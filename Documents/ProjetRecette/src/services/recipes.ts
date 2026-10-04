import { createClient } from "@/lib/supabase/server";
import type {
  RecipeFilters,
  RecipeWithDetails,
} from "@/types/database";

type RawRecipe = RecipeWithDetails & {
  ratings?: { rating: number; user_id?: string }[] | null;
  favorites?: { id: string; user_id?: string }[] | null;
};

function mapRecipe(
  recipe: RawRecipe,
  userId?: string | null
): RecipeWithDetails {
  const ratings = recipe.ratings ?? [];
  const count = ratings.length;
  const average =
    count > 0
      ? ratings.reduce((sum, r) => sum + r.rating, 0) / count
      : 0;

  const isFavorited =
    userId != null
      ? Boolean(recipe.favorites?.some((f) => f.user_id === userId))
      : false;

  return {
    ...recipe,
    average_rating: average,
    ratings_count: count,
    is_favorited: isFavorited,
    user_rating: null,
  };
}

const RECIPE_SELECT = `
  *,
  category:categories(*),
  author:profiles(*),
  ratings(rating, user_id),
  favorites(id, user_id)
`;

export async function getRecipes(
  filters: RecipeFilters = {},
  userId?: string | null
): Promise<RecipeWithDetails[]> {
  const supabase = createClient();

  let query = supabase
    .from("recipes")
    .select(RECIPE_SELECT)
    .order("created_at", { ascending: false });

  if (filters.categorySlug) {
    const { data: category } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", filters.categorySlug)
      .maybeSingle();

    if (!category) return [];
    query = query.eq("category_id", category.id);
  }

  if (filters.maxPrepTime != null) {
    query = query.lte("preparation_time", filters.maxPrepTime);
  }

  const { data, error } = await query;
  if (error) throw error;

  let recipes =
    (data as RawRecipe[] | null)?.map((r) => mapRecipe(r, userId)) ?? [];

  if (filters.query?.trim()) {
    const q = filters.query.trim().toLowerCase();
    const titleMatches = recipes.filter((recipe) => {
      const inTitle = recipe.title.toLowerCase().includes(q);
      const inDesc = recipe.description?.toLowerCase().includes(q) ?? false;
      const inCategory =
        recipe.category?.name.toLowerCase().includes(q) ?? false;
      const inAuthor =
        recipe.author?.display_name.toLowerCase().includes(q) ?? false;
      return inTitle || inDesc || inCategory || inAuthor;
    });

    const { data: ingredientMatches } = await supabase
      .from("ingredients")
      .select("recipe_id")
      .ilike("name", `%${filters.query.trim()}%`);

    const matchedIds = new Set(
      (ingredientMatches ?? []).map((i) => i.recipe_id)
    );

    const byId = new Map(recipes.map((r) => [r.id, r]));
    const ingredientRecipes = Array.from(matchedIds)
      .map((id) => byId.get(id))
      .filter(Boolean) as RecipeWithDetails[];

    const merged = new Map<string, RecipeWithDetails>();
    titleMatches.concat(ingredientRecipes).forEach((r) => merged.set(r.id, r));
    recipes = Array.from(merged.values());
  }

  if (filters.minRating != null) {
    recipes = recipes.filter(
      (r) => (r.average_rating ?? 0) >= filters.minRating!
    );
  }

  return recipes;
}

export async function getPopularRecipes(
  limit = 6,
  userId?: string | null
): Promise<RecipeWithDetails[]> {
  const recipes = await getRecipes({}, userId);
  return [...recipes]
    .sort((a, b) => {
      const ratingDiff = (b.average_rating ?? 0) - (a.average_rating ?? 0);
      if (ratingDiff !== 0) return ratingDiff;
      return (b.ratings_count ?? 0) - (a.ratings_count ?? 0);
    })
    .slice(0, limit);
}

export async function getLatestRecipes(
  limit = 6,
  userId?: string | null
): Promise<RecipeWithDetails[]> {
  const recipes = await getRecipes({}, userId);
  return recipes.slice(0, limit);
}

export async function getRecipeBySlug(
  slug: string,
  userId?: string | null
): Promise<RecipeWithDetails | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("recipes")
    .select(
      `
      *,
      category:categories(*),
      author:profiles(*),
      ingredients(*),
      preparation_steps(*),
      ratings(rating, user_id),
      favorites(id, user_id)
    `
    )
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  const raw = data as RawRecipe & {
    ingredients?: RecipeWithDetails["ingredients"];
    preparation_steps?: RecipeWithDetails["preparation_steps"];
  };

  const mapped = mapRecipe(raw, userId);
  const userRating =
    userId != null
      ? raw.ratings?.find((r) => r.user_id === userId)?.rating ?? null
      : null;

  return {
    ...mapped,
    ingredients: [...(raw.ingredients ?? [])].sort(
      (a, b) => a.position - b.position
    ),
    preparation_steps: [...(raw.preparation_steps ?? [])].sort(
      (a, b) => a.step_number - b.step_number
    ),
    user_rating: userRating,
  };
}

export async function getFavoriteRecipes(
  userId: string
): Promise<RecipeWithDetails[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("favorites")
    .select(
      `
      recipe:recipes(
        *,
        category:categories(*),
        author:profiles(*),
        ratings(rating, user_id)
      )
    `
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data ?? [])
    .map((row) => {
      const recipe = row.recipe as unknown as RawRecipe | null;
      if (!recipe) return null;
      return {
        ...mapRecipe(recipe, userId),
        is_favorited: true,
      };
    })
    .filter(Boolean) as RecipeWithDetails[];
}
