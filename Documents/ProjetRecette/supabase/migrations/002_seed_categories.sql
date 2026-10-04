-- Catégories de base
insert into public.categories (name, slug, description, emoji) values
  ('Recettes marocaines', 'marocaines', 'Tajines, couscous, pastillas et classiques du Maroc', '🍲'),
  ('Gâteaux & desserts', 'gateaux', 'Gâteaux, pâtisseries et douceurs', '🍰'),
  ('Salées', 'salees', 'Plats salés du quotidien et du week-end', '🥐'),
  ('Salades', 'salades', 'Salades fraîches et croquantes', '🥗'),
  ('Soupes', 'soupes', 'Soupes réconfortantes', '🥣'),
  ('Jus & boissons', 'jus', 'Jus, smoothies et aux boissons maison', '🧃')
on conflict (slug) do nothing;
