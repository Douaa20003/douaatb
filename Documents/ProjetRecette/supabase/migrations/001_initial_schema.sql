-- ============================================================
-- Moroccan Recipes — Schéma initial + RLS + Storage
-- À exécuter dans Supabase SQL Editor (dans l'ordre)
-- ============================================================

-- Extensions
create extension if not exists "pgcrypto";

-- ------------------------------------------------------------
-- PROFILES
-- ------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  email text,
  avatar_url text,
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- CATEGORIES
-- ------------------------------------------------------------
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  description text,
  image_url text,
  emoji text,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- RECIPES
-- ------------------------------------------------------------
create table if not exists public.recipes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text,
  category_id uuid not null references public.categories(id) on delete restrict,
  author_id uuid not null references public.profiles(id) on delete cascade,
  image_url text,
  preparation_time integer check (preparation_time is null or preparation_time >= 0),
  cooking_time integer check (cooking_time is null or cooking_time >= 0),
  servings integer check (servings is null or servings > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists recipes_category_id_idx on public.recipes(category_id);
create index if not exists recipes_author_id_idx on public.recipes(author_id);
create index if not exists recipes_created_at_idx on public.recipes(created_at desc);
create index if not exists recipes_title_idx on public.recipes using gin (to_tsvector('french', title));

-- ------------------------------------------------------------
-- INGREDIENTS
-- ------------------------------------------------------------
create table if not exists public.ingredients (
  id uuid primary key default gen_random_uuid(),
  recipe_id uuid not null references public.recipes(id) on delete cascade,
  quantity text,
  unit text,
  name text not null,
  position integer not null default 0
);

create index if not exists ingredients_recipe_id_idx on public.ingredients(recipe_id);

-- ------------------------------------------------------------
-- PREPARATION STEPS
-- ------------------------------------------------------------
create table if not exists public.preparation_steps (
  id uuid primary key default gen_random_uuid(),
  recipe_id uuid not null references public.recipes(id) on delete cascade,
  step_number integer not null check (step_number > 0),
  instruction text not null,
  unique (recipe_id, step_number)
);

create index if not exists preparation_steps_recipe_id_idx on public.preparation_steps(recipe_id);

-- ------------------------------------------------------------
-- RATINGS
-- ------------------------------------------------------------
create table if not exists public.ratings (
  id uuid primary key default gen_random_uuid(),
  recipe_id uuid not null references public.recipes(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  rating integer not null check (rating between 1 and 5),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (recipe_id, user_id)
);

create index if not exists ratings_recipe_id_idx on public.ratings(recipe_id);

-- ------------------------------------------------------------
-- FAVORITES
-- ------------------------------------------------------------
create table if not exists public.favorites (
  id uuid primary key default gen_random_uuid(),
  recipe_id uuid not null references public.recipes(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (recipe_id, user_id)
);

create index if not exists favorites_user_id_idx on public.favorites(user_id);

-- ------------------------------------------------------------
-- UPDATED_AT trigger
-- ------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists recipes_set_updated_at on public.recipes;
create trigger recipes_set_updated_at
  before update on public.recipes
  for each row execute function public.set_updated_at();

drop trigger if exists ratings_set_updated_at on public.ratings;
create trigger ratings_set_updated_at
  before update on public.ratings
  for each row execute function public.set_updated_at();

-- ------------------------------------------------------------
-- Auto-create profile on signup
-- ------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, email, avatar_url)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data->>'display_name',
      split_part(new.email, '@', 1),
      'Utilisateur'
    ),
    new.email,
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ------------------------------------------------------------
-- Helper: is admin
-- ------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- ------------------------------------------------------------
-- VIEW: recipes with rating aggregates
-- ------------------------------------------------------------
create or replace view public.recipes_with_stats as
select
  r.*,
  coalesce(avg(rt.rating), 0)::numeric(3,2) as average_rating,
  count(rt.id)::integer as ratings_count
from public.recipes r
left join public.ratings rt on rt.recipe_id = r.id
group by r.id;

-- ------------------------------------------------------------
-- ROW LEVEL SECURITY
-- ------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.recipes enable row level security;
alter table public.ingredients enable row level security;
alter table public.preparation_steps enable row level security;
alter table public.ratings enable row level security;
alter table public.favorites enable row level security;

-- Profiles
drop policy if exists "Profiles are viewable by authenticated users" on public.profiles;
create policy "Profiles are viewable by authenticated users"
  on public.profiles for select
  to authenticated
  using (true);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Empêcher l'auto-promotion en admin
create or replace function public.protect_profile_role()
returns trigger
language plpgsql
as $$
begin
  if new.role is distinct from old.role and not public.is_admin() then
    raise exception 'Seul un administrateur peut modifier le rôle';
  end if;
  return new;
end;
$$;

drop trigger if exists protect_profile_role on public.profiles;
create trigger protect_profile_role
  before update on public.profiles
  for each row execute function public.protect_profile_role();

-- Categories (lecture pour authentifiés ; écriture admin)
drop policy if exists "Categories are viewable by authenticated users" on public.categories;
create policy "Categories are viewable by authenticated users"
  on public.categories for select
  to authenticated
  using (true);

drop policy if exists "Admins can manage categories" on public.categories;
create policy "Admins can manage categories"
  on public.categories for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Recipes
drop policy if exists "Recipes are viewable by authenticated users" on public.recipes;
create policy "Recipes are viewable by authenticated users"
  on public.recipes for select
  to authenticated
  using (true);

drop policy if exists "Users can insert own recipes" on public.recipes;
create policy "Users can insert own recipes"
  on public.recipes for insert
  to authenticated
  with check (auth.uid() = author_id);

drop policy if exists "Owners or admins can update recipes" on public.recipes;
create policy "Owners or admins can update recipes"
  on public.recipes for update
  to authenticated
  using (auth.uid() = author_id or public.is_admin())
  with check (auth.uid() = author_id or public.is_admin());

drop policy if exists "Owners or admins can delete recipes" on public.recipes;
create policy "Owners or admins can delete recipes"
  on public.recipes for delete
  to authenticated
  using (auth.uid() = author_id or public.is_admin());

-- Ingredients
drop policy if exists "Ingredients are viewable by authenticated users" on public.ingredients;
create policy "Ingredients are viewable by authenticated users"
  on public.ingredients for select
  to authenticated
  using (true);

drop policy if exists "Owners or admins can insert ingredients" on public.ingredients;
create policy "Owners or admins can insert ingredients"
  on public.ingredients for insert
  to authenticated
  with check (
    exists (
      select 1 from public.recipes
      where id = recipe_id and (author_id = auth.uid() or public.is_admin())
    )
  );

drop policy if exists "Owners or admins can update ingredients" on public.ingredients;
create policy "Owners or admins can update ingredients"
  on public.ingredients for update
  to authenticated
  using (
    exists (
      select 1 from public.recipes
      where id = recipe_id and (author_id = auth.uid() or public.is_admin())
    )
  );

drop policy if exists "Owners or admins can delete ingredients" on public.ingredients;
create policy "Owners or admins can delete ingredients"
  on public.ingredients for delete
  to authenticated
  using (
    exists (
      select 1 from public.recipes
      where id = recipe_id and (author_id = auth.uid() or public.is_admin())
    )
  );

-- Preparation steps
drop policy if exists "Steps are viewable by authenticated users" on public.preparation_steps;
create policy "Steps are viewable by authenticated users"
  on public.preparation_steps for select
  to authenticated
  using (true);

drop policy if exists "Owners or admins can insert steps" on public.preparation_steps;
create policy "Owners or admins can insert steps"
  on public.preparation_steps for insert
  to authenticated
  with check (
    exists (
      select 1 from public.recipes
      where id = recipe_id and (author_id = auth.uid() or public.is_admin())
    )
  );

drop policy if exists "Owners or admins can update steps" on public.preparation_steps;
create policy "Owners or admins can update steps"
  on public.preparation_steps for update
  to authenticated
  using (
    exists (
      select 1 from public.recipes
      where id = recipe_id and (author_id = auth.uid() or public.is_admin())
    )
  );

drop policy if exists "Owners or admins can delete steps" on public.preparation_steps;
create policy "Owners or admins can delete steps"
  on public.preparation_steps for delete
  to authenticated
  using (
    exists (
      select 1 from public.recipes
      where id = recipe_id and (author_id = auth.uid() or public.is_admin())
    )
  );

-- Ratings
drop policy if exists "Ratings are viewable by authenticated users" on public.ratings;
create policy "Ratings are viewable by authenticated users"
  on public.ratings for select
  to authenticated
  using (true);

drop policy if exists "Users can insert own ratings" on public.ratings;
create policy "Users can insert own ratings"
  on public.ratings for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Users can update own ratings" on public.ratings;
create policy "Users can update own ratings"
  on public.ratings for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete own ratings" on public.ratings;
create policy "Users can delete own ratings"
  on public.ratings for delete
  to authenticated
  using (auth.uid() = user_id);

-- Favorites
drop policy if exists "Users can view own favorites" on public.favorites;
create policy "Users can view own favorites"
  on public.favorites for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own favorites" on public.favorites;
create policy "Users can insert own favorites"
  on public.favorites for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete own favorites" on public.favorites;
create policy "Users can delete own favorites"
  on public.favorites for delete
  to authenticated
  using (auth.uid() = user_id);

-- ------------------------------------------------------------
-- STORAGE: bucket recipe-images
-- ------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'recipe-images',
  'recipe-images',
  true,
  5242880, -- 5 MB
  array['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Authenticated users can view recipe images" on storage.objects;
create policy "Authenticated users can view recipe images"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'recipe-images');

-- Lecture publique utile pour les URLs publiques du bucket
drop policy if exists "Public can view recipe images" on storage.objects;
create policy "Public can view recipe images"
  on storage.objects for select
  to public
  using (bucket_id = 'recipe-images');

drop policy if exists "Users can upload own recipe images" on storage.objects;
create policy "Users can upload own recipe images"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'recipe-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Users can update own recipe images" on storage.objects;
create policy "Users can update own recipe images"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'recipe-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Users can delete own recipe images" on storage.objects;
create policy "Users can delete own recipe images"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'recipe-images'
    and (
      (storage.foldername(name))[1] = auth.uid()::text
      or public.is_admin()
    )
  );
