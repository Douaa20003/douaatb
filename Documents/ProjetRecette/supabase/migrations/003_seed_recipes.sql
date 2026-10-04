-- ============================================================
-- Recettes de test
-- Prérequis : au moins un utilisateur créé (profil existant).
-- Les recettes sont attribuées au premier profil trouvé.
-- ============================================================

do $$
declare
  v_author uuid;
  v_cat_maroc uuid;
  v_cat_gateaux uuid;
  v_cat_salees uuid;
  v_cat_salades uuid;
  v_cat_soupes uuid;
  v_cat_jus uuid;
  v_recipe uuid;
begin
  select id into v_author from public.profiles order by created_at asc limit 1;

  if v_author is null then
    raise notice 'Aucun profil trouvé. Créez un compte puis ré-exécutez ce script.';
    return;
  end if;

  select id into v_cat_maroc from public.categories where slug = 'marocaines';
  select id into v_cat_gateaux from public.categories where slug = 'gateaux';
  select id into v_cat_salees from public.categories where slug = 'salees';
  select id into v_cat_salades from public.categories where slug = 'salades';
  select id into v_cat_soupes from public.categories where slug = 'soupes';
  select id into v_cat_jus from public.categories where slug = 'jus';

  -- Helper inline: insert recipe if slug missing
  -- Tajine poulet aux olives
  if not exists (select 1 from public.recipes where slug = 'tajine-poulet-olives') then
    insert into public.recipes (title, slug, description, category_id, author_id, image_url, preparation_time, cooking_time, servings)
    values (
      'Tajine poulet aux olives',
      'tajine-poulet-olives',
      'Un classique marocain parfumé au citron confit et aux olives.',
      v_cat_maroc, v_author,
      'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800&q=80',
      20, 60, 4
    ) returning id into v_recipe;

    insert into public.ingredients (recipe_id, quantity, unit, name, position) values
      (v_recipe, '1', '', 'poulet', 1),
      (v_recipe, '2', '', 'oignons', 2),
      (v_recipe, '100', 'g', 'olives vertes', 3),
      (v_recipe, '1', '', 'citron confit', 4),
      (v_recipe, '2', 'c. à s.', 'huile d''olive', 5),
      (v_recipe, '', '', 'épices (curcuma, gingembre, poivre)', 6);

    insert into public.preparation_steps (recipe_id, step_number, instruction) values
      (v_recipe, 1, 'Préparer les ingrédients et couper le poulet en morceaux.'),
      (v_recipe, 2, 'Faire revenir les oignons dans l''huile d''olive.'),
      (v_recipe, 3, 'Ajouter le poulet et les épices.'),
      (v_recipe, 4, 'Ajouter les olives et le citron confit.'),
      (v_recipe, 5, 'Laisser mijoter à feu doux environ 1 heure.');
  end if;

  -- Couscous marocain
  if not exists (select 1 from public.recipes where slug = 'couscous-marocain') then
    insert into public.recipes (title, slug, description, category_id, author_id, image_url, preparation_time, cooking_time, servings)
    values (
      'Couscous marocain',
      'couscous-marocain',
      'Couscous familial aux légumes et viande tendre.',
      v_cat_maroc, v_author,
      'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&q=80',
      30, 90, 6
    ) returning id into v_recipe;

    insert into public.ingredients (recipe_id, quantity, unit, name, position) values
      (v_recipe, '500', 'g', 'semoule de couscous', 1),
      (v_recipe, '500', 'g', 'agneau', 2),
      (v_recipe, '3', '', 'carottes', 3),
      (v_recipe, '2', '', 'courgettes', 4),
      (v_recipe, '1', '', 'chou', 5),
      (v_recipe, '200', 'g', 'pois chiches', 6);

    insert into public.preparation_steps (recipe_id, step_number, instruction) values
      (v_recipe, 1, 'Faire revenir la viande avec les oignons et les épices.'),
      (v_recipe, 2, 'Ajouter les légumes fermes et couvrir d''eau.'),
      (v_recipe, 3, 'Cuire la semoule à la vapeur en plusieurs passages.'),
      (v_recipe, 4, 'Servir la semoule avec le bouillon et les légumes.');
  end if;

  -- Harira
  if not exists (select 1 from public.recipes where slug = 'harira') then
    insert into public.recipes (title, slug, description, category_id, author_id, image_url, preparation_time, cooking_time, servings)
    values (
      'Harira',
      'harira',
      'Soupe traditionnelle marocaine, idéale pour le Ramadan.',
      v_cat_soupes, v_author,
      'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&q=80',
      25, 50, 6
    ) returning id into v_recipe;

    insert into public.ingredients (recipe_id, quantity, unit, name, position) values
      (v_recipe, '200', 'g', 'viande', 1),
      (v_recipe, '100', 'g', 'lentilles', 2),
      (v_recipe, '100', 'g', 'pois chiches', 3),
      (v_recipe, '2', '', 'tomates', 4),
      (v_recipe, '1', 'bouquet', 'coriandre et céleri', 5);

    insert into public.preparation_steps (recipe_id, step_number, instruction) values
      (v_recipe, 1, 'Faire revenir la viande avec les herbes et les épices.'),
      (v_recipe, 2, 'Ajouter les tomates, lentilles et pois chiches.'),
      (v_recipe, 3, 'Laisser mijoter puis lier avec un peu de farine.');
  end if;

  -- Pastilla
  if not exists (select 1 from public.recipes where slug = 'pastilla') then
    insert into public.recipes (title, slug, description, category_id, author_id, image_url, preparation_time, cooking_time, servings)
    values (
      'Pastilla',
      'pastilla',
      'Pastilla au poulet, croustillante et légèrement sucrée.',
      v_cat_maroc, v_author,
      'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800&q=80',
      45, 40, 8
    ) returning id into v_recipe;

    insert into public.ingredients (recipe_id, quantity, unit, name, position) values
      (v_recipe, '1', '', 'poulet', 1),
      (v_recipe, '10', 'feuilles', 'brick ou pastilla', 2),
      (v_recipe, '100', 'g', 'amandes', 3),
      (v_recipe, '4', '', 'œufs', 4),
      (v_recipe, '', '', 'cannelle et sucre glace', 5);

    insert into public.preparation_steps (recipe_id, step_number, instruction) values
      (v_recipe, 1, 'Cuire le poulet avec les épices et émietter la chair.'),
      (v_recipe, 2, 'Préparer la farce aux œufs et amandes.'),
      (v_recipe, 3, 'Monter la pastilla et dorer au four.');
  end if;

  -- Cheesecake
  if not exists (select 1 from public.recipes where slug = 'cheesecake') then
    insert into public.recipes (title, slug, description, category_id, author_id, image_url, preparation_time, cooking_time, servings)
    values (
      'Cheesecake',
      'cheesecake',
      'Cheesecake crémeux sur base biscuitée.',
      v_cat_gateaux, v_author,
      'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=800&q=80',
      30, 60, 8
    ) returning id into v_recipe;

    insert into public.ingredients (recipe_id, quantity, unit, name, position) values
      (v_recipe, '200', 'g', 'biscuits', 1),
      (v_recipe, '100', 'g', 'beurre', 2),
      (v_recipe, '400', 'g', 'cream cheese', 3),
      (v_recipe, '100', 'g', 'sucre', 4),
      (v_recipe, '3', '', 'œufs', 5);

    insert into public.preparation_steps (recipe_id, step_number, instruction) values
      (v_recipe, 1, 'Préparer la base biscuit-beurre.'),
      (v_recipe, 2, 'Mélanger le cream cheese, sucre et œufs.'),
      (v_recipe, 3, 'Cuire au bain-marie puis laisser refroidir.');
  end if;

  -- Gâteau au chocolat
  if not exists (select 1 from public.recipes where slug = 'gateau-chocolat') then
    insert into public.recipes (title, slug, description, category_id, author_id, image_url, preparation_time, cooking_time, servings)
    values (
      'Gâteau au chocolat',
      'gateau-chocolat',
      'Moelleux intense au chocolat noir.',
      v_cat_gateaux, v_author,
      'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80',
      20, 35, 8
    ) returning id into v_recipe;

    insert into public.ingredients (recipe_id, quantity, unit, name, position) values
      (v_recipe, '200', 'g', 'chocolat noir', 1),
      (v_recipe, '150', 'g', 'beurre', 2),
      (v_recipe, '150', 'g', 'sucre', 3),
      (v_recipe, '100', 'g', 'farine', 4),
      (v_recipe, '4', '', 'œufs', 5);

    insert into public.preparation_steps (recipe_id, step_number, instruction) values
      (v_recipe, 1, 'Faire fondre le chocolat avec le beurre.'),
      (v_recipe, 2, 'Ajouter sucre, œufs puis farine.'),
      (v_recipe, 3, 'Cuire 35 minutes à 180°C.');
  end if;

  -- Red velvet
  if not exists (select 1 from public.recipes where slug = 'red-velvet') then
    insert into public.recipes (title, slug, description, category_id, author_id, image_url, preparation_time, cooking_time, servings)
    values (
      'Red velvet',
      'red-velvet',
      'Gâteau rouge velours au frosting cream cheese.',
      v_cat_gateaux, v_author,
      'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=800&q=80',
      35, 30, 10
    ) returning id into v_recipe;

    insert into public.ingredients (recipe_id, quantity, unit, name, position) values
      (v_recipe, '250', 'g', 'farine', 1),
      (v_recipe, '200', 'g', 'sucre', 2),
      (v_recipe, '2', '', 'œufs', 3),
      (v_recipe, '1', 'c. à c.', 'colorant rouge', 4),
      (v_recipe, '200', 'g', 'cream cheese', 5);

    insert into public.preparation_steps (recipe_id, step_number, instruction) values
      (v_recipe, 1, 'Préparer la pâte et colorer en rouge.'),
      (v_recipe, 2, 'Cuire les génoises.'),
      (v_recipe, 3, 'Garnir et napper de frosting.');
  end if;

  -- Tiramisu
  if not exists (select 1 from public.recipes where slug = 'tiramisu') then
    insert into public.recipes (title, slug, description, category_id, author_id, image_url, preparation_time, cooking_time, servings)
    values (
      'Tiramisu',
      'tiramisu',
      'Dessert italien au mascarpone et café.',
      v_cat_gateaux, v_author,
      'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800&q=80',
      30, 0, 6
    ) returning id into v_recipe;

    insert into public.ingredients (recipe_id, quantity, unit, name, position) values
      (v_recipe, '250', 'g', 'mascarpone', 1),
      (v_recipe, '3', '', 'œufs', 2),
      (v_recipe, '100', 'g', 'sucre', 3),
      (v_recipe, '200', 'g', 'biscuits à la cuillère', 4),
      (v_recipe, '20', 'cl', 'café', 5);

    insert into public.preparation_steps (recipe_id, step_number, instruction) values
      (v_recipe, 1, 'Préparer la crème mascarpone.'),
      (v_recipe, 2, 'Tremper les biscuits dans le café.'),
      (v_recipe, 3, 'Alterner couches et réfrigérer 4 heures.');
  end if;

  -- Pizza
  if not exists (select 1 from public.recipes where slug = 'pizza-maison') then
    insert into public.recipes (title, slug, description, category_id, author_id, image_url, preparation_time, cooking_time, servings)
    values (
      'Pizza maison',
      'pizza-maison',
      'Pizza croustillante garniture au choix.',
      v_cat_salees, v_author,
      'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80',
      90, 15, 4
    ) returning id into v_recipe;

    insert into public.ingredients (recipe_id, quantity, unit, name, position) values
      (v_recipe, '300', 'g', 'farine', 1),
      (v_recipe, '10', 'g', 'levure', 2),
      (v_recipe, '200', 'g', 'sauce tomate', 3),
      (v_recipe, '200', 'g', 'mozzarella', 4);

    insert into public.preparation_steps (recipe_id, step_number, instruction) values
      (v_recipe, 1, 'Préparer et laisser lever la pâte.'),
      (v_recipe, 2, 'Étaler, garnir et cuire à four très chaud.');
  end if;

  -- Quiche
  if not exists (select 1 from public.recipes where slug = 'quiche-lorraine') then
    insert into public.recipes (title, slug, description, category_id, author_id, image_url, preparation_time, cooking_time, servings)
    values (
      'Quiche lorraine',
      'quiche-lorraine',
      'Quiche crémeuse aux lardons.',
      v_cat_salees, v_author,
      'https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=800&q=80',
      20, 40, 6
    ) returning id into v_recipe;

    insert into public.ingredients (recipe_id, quantity, unit, name, position) values
      (v_recipe, '1', '', 'pâte brisée', 1),
      (v_recipe, '200', 'g', 'lardons', 2),
      (v_recipe, '3', '', 'œufs', 3),
      (v_recipe, '20', 'cl', 'crème', 4);

    insert into public.preparation_steps (recipe_id, step_number, instruction) values
      (v_recipe, 1, 'Précuire la pâte.'),
      (v_recipe, 2, 'Mélanger œufs, crème et lardons.'),
      (v_recipe, 3, 'Cuire 40 minutes à 180°C.');
  end if;

  -- Briouates
  if not exists (select 1 from public.recipes where slug = 'briouates') then
    insert into public.recipes (title, slug, description, category_id, author_id, image_url, preparation_time, cooking_time, servings)
    values (
      'Briouates',
      'briouates',
      'Petits feuilletés croustillants farcis.',
      v_cat_salees, v_author,
      'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80',
      40, 20, 8
    ) returning id into v_recipe;

    insert into public.ingredients (recipe_id, quantity, unit, name, position) values
      (v_recipe, '10', 'feuilles', 'brick', 1),
      (v_recipe, '300', 'g', 'viande hachée', 2),
      (v_recipe, '1', '', 'oignon', 3),
      (v_recipe, '', '', 'épices', 4);

    insert into public.preparation_steps (recipe_id, step_number, instruction) values
      (v_recipe, 1, 'Préparer la farce.'),
      (v_recipe, 2, 'Façonner les briouates.'),
      (v_recipe, 3, 'Frire ou cuire au four jusqu''à dorure.');
  end if;

  -- Sandwich poulet
  if not exists (select 1 from public.recipes where slug = 'sandwich-poulet') then
    insert into public.recipes (title, slug, description, category_id, author_id, image_url, preparation_time, cooking_time, servings)
    values (
      'Sandwich poulet',
      'sandwich-poulet',
      'Sandwich généreux au poulet mariné.',
      v_cat_salees, v_author,
      'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800&q=80',
      15, 15, 2
    ) returning id into v_recipe;

    insert into public.ingredients (recipe_id, quantity, unit, name, position) values
      (v_recipe, '2', '', 'pains', 1),
      (v_recipe, '300', 'g', 'blancs de poulet', 2),
      (v_recipe, '2', '', 'tomates', 3),
      (v_recipe, '', '', 'sauce et salade', 4);

    insert into public.preparation_steps (recipe_id, step_number, instruction) values
      (v_recipe, 1, 'Faire mariner et cuire le poulet.'),
      (v_recipe, 2, 'Assembler le sandwich avec les garnitures.');
  end if;

  -- Salade marocaine
  if not exists (select 1 from public.recipes where slug = 'salade-marocaine') then
    insert into public.recipes (title, slug, description, category_id, author_id, image_url, preparation_time, cooking_time, servings)
    values (
      'Salade marocaine',
      'salade-marocaine',
      'Salade fraîche tomate-concombre à la menthe.',
      v_cat_salades, v_author,
      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80',
      15, 0, 4
    ) returning id into v_recipe;

    insert into public.ingredients (recipe_id, quantity, unit, name, position) values
      (v_recipe, '3', '', 'tomates', 1),
      (v_recipe, '1', '', 'concombre', 2),
      (v_recipe, '1', '', 'oignon', 3),
      (v_recipe, '', '', 'menthe, citron, huile d''olive', 4);

    insert into public.preparation_steps (recipe_id, step_number, instruction) values
      (v_recipe, 1, 'Couper les légumes en petits dés.'),
      (v_recipe, 2, 'Assaisonner et servir frais.');
  end if;

  -- Salade César
  if not exists (select 1 from public.recipes where slug = 'salade-cesar') then
    insert into public.recipes (title, slug, description, category_id, author_id, image_url, preparation_time, cooking_time, servings)
    values (
      'Salade César',
      'salade-cesar',
      'Salade César croustillante au poulet.',
      v_cat_salades, v_author,
      'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=800&q=80',
      20, 10, 2
    ) returning id into v_recipe;

    insert into public.ingredients (recipe_id, quantity, unit, name, position) values
      (v_recipe, '1', '', 'laitue romaine', 1),
      (v_recipe, '200', 'g', 'poulet', 2),
      (v_recipe, '50', 'g', 'parmesan', 3),
      (v_recipe, '', '', 'croûtons et sauce César', 4);

    insert into public.preparation_steps (recipe_id, step_number, instruction) values
      (v_recipe, 1, 'Cuire le poulet et préparer les croûtons.'),
      (v_recipe, 2, 'Mélanger avec la sauce et le parmesan.');
  end if;

  -- Salade avocat
  if not exists (select 1 from public.recipes where slug = 'salade-avocat') then
    insert into public.recipes (title, slug, description, category_id, author_id, image_url, preparation_time, cooking_time, servings)
    values (
      'Salade avocat',
      'salade-avocat',
      'Salade légère avocat-tomate.',
      v_cat_salades, v_author,
      'https://images.unsplash.com/photo-1607532941433-304659e8198a?w=800&q=80',
      10, 0, 2
    ) returning id into v_recipe;

    insert into public.ingredients (recipe_id, quantity, unit, name, position) values
      (v_recipe, '2', '', 'avocats', 1),
      (v_recipe, '2', '', 'tomates', 2),
      (v_recipe, '1', '', 'citron', 3);

    insert into public.preparation_steps (recipe_id, step_number, instruction) values
      (v_recipe, 1, 'Couper les avocats et tomates.'),
      (v_recipe, 2, 'Arroser de citron et assaisonner.');
  end if;

  -- Soupe de légumes
  if not exists (select 1 from public.recipes where slug = 'soupe-legumes') then
    insert into public.recipes (title, slug, description, category_id, author_id, image_url, preparation_time, cooking_time, servings)
    values (
      'Soupe de légumes',
      'soupe-legumes',
      'Velouté de légumes de saison.',
      v_cat_soupes, v_author,
      'https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?w=800&q=80',
      15, 30, 4
    ) returning id into v_recipe;

    insert into public.ingredients (recipe_id, quantity, unit, name, position) values
      (v_recipe, '3', '', 'carottes', 1),
      (v_recipe, '2', '', 'pommes de terre', 2),
      (v_recipe, '1', '', 'poireau', 3),
      (v_recipe, '1', 'l', 'bouillon', 4);

    insert into public.preparation_steps (recipe_id, step_number, instruction) values
      (v_recipe, 1, 'Faire revenir les légumes.'),
      (v_recipe, 2, 'Ajouter le bouillon et mixer.');
  end if;

  -- Soupe de lentilles
  if not exists (select 1 from public.recipes where slug = 'soupe-lentilles') then
    insert into public.recipes (title, slug, description, category_id, author_id, image_url, preparation_time, cooking_time, servings)
    values (
      'Soupe de lentilles',
      'soupe-lentilles',
      'Soupe onctueuse aux lentilles corail.',
      v_cat_soupes, v_author,
      'https://images.unsplash.com/photo-1547592180-85f173990554?w=800&q=80',
      10, 25, 4
    ) returning id into v_recipe;

    insert into public.ingredients (recipe_id, quantity, unit, name, position) values
      (v_recipe, '250', 'g', 'lentilles corail', 1),
      (v_recipe, '1', '', 'oignon', 2),
      (v_recipe, '1', '', 'carotte', 3),
      (v_recipe, '1', 'c. à c.', 'cumin', 4);

    insert into public.preparation_steps (recipe_id, step_number, instruction) values
      (v_recipe, 1, 'Faire revenir oignon et carotte.'),
      (v_recipe, 2, 'Ajouter lentilles et cumin, cuire 25 minutes.');
  end if;

  -- Jus d'orange
  if not exists (select 1 from public.recipes where slug = 'jus-orange') then
    insert into public.recipes (title, slug, description, category_id, author_id, image_url, preparation_time, cooking_time, servings)
    values (
      'Jus d''orange',
      'jus-orange',
      'Jus d''orange frais pressé.',
      v_cat_jus, v_author,
      'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=800&q=80',
      5, 0, 2
    ) returning id into v_recipe;

    insert into public.ingredients (recipe_id, quantity, unit, name, position) values
      (v_recipe, '6', '', 'oranges', 1);

    insert into public.preparation_steps (recipe_id, step_number, instruction) values
      (v_recipe, 1, 'Presser les oranges et servir frais.');
  end if;

  -- Jus d'avocat
  if not exists (select 1 from public.recipes where slug = 'jus-avocat') then
    insert into public.recipes (title, slug, description, category_id, author_id, image_url, preparation_time, cooking_time, servings)
    values (
      'Jus d''avocat',
      'jus-avocat',
      'Boisson crémeuse à l''avocat, sucre et lait.',
      v_cat_jus, v_author,
      'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=800&q=80',
      10, 0, 2
    ) returning id into v_recipe;

    insert into public.ingredients (recipe_id, quantity, unit, name, position) values
      (v_recipe, '2', '', 'avocats', 1),
      (v_recipe, '30', 'cl', 'lait', 2),
      (v_recipe, '2', 'c. à s.', 'sucre', 3);

    insert into public.preparation_steps (recipe_id, step_number, instruction) values
      (v_recipe, 1, 'Mixer avocat, lait et sucre jusqu''à obtenir une texture lisse.');
  end if;

  -- Smoothie fraise
  if not exists (select 1 from public.recipes where slug = 'smoothie-fraise') then
    insert into public.recipes (title, slug, description, category_id, author_id, image_url, preparation_time, cooking_time, servings)
    values (
      'Smoothie fraise',
      'smoothie-fraise',
      'Smoothie fruité aux fraises.',
      v_cat_jus, v_author,
      'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=800&q=80',
      8, 0, 2
    ) returning id into v_recipe;

    insert into public.ingredients (recipe_id, quantity, unit, name, position) values
      (v_recipe, '250', 'g', 'fraises', 1),
      (v_recipe, '1', '', 'banane', 2),
      (v_recipe, '20', 'cl', 'yaourt', 3);

    insert into public.preparation_steps (recipe_id, step_number, instruction) values
      (v_recipe, 1, 'Mixer tous les ingrédients et servir immédiatement.');
  end if;

  -- Jus de citron
  if not exists (select 1 from public.recipes where slug = 'jus-citron') then
    insert into public.recipes (title, slug, description, category_id, author_id, image_url, preparation_time, cooking_time, servings)
    values (
      'Jus de citron',
      'jus-citron',
      'Limonade maison rafraîchissante.',
      v_cat_jus, v_author,
      'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=800&q=80',
      10, 0, 4
    ) returning id into v_recipe;

    insert into public.ingredients (recipe_id, quantity, unit, name, position) values
      (v_recipe, '4', '', 'citrons', 1),
      (v_recipe, '80', 'g', 'sucre', 2),
      (v_recipe, '1', 'l', 'eau', 3),
      (v_recipe, '', '', 'menthe (optionnel)', 4);

    insert into public.preparation_steps (recipe_id, step_number, instruction) values
      (v_recipe, 1, 'Presser les citrons.'),
      (v_recipe, 2, 'Mélanger avec eau et sucre, servir bien frais.');
  end if;

  raise notice 'Seed recettes terminé.';
end $$;
