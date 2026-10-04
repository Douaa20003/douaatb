export type UserRole = "user" | "admin";

export interface Profile {
  id: string;
  display_name: string;
  email: string | null;
  avatar_url: string | null;
  role: UserRole;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  emoji: string | null;
  created_at: string;
}

export interface Ingredient {
  id: string;
  recipe_id: string;
  quantity: string | null;
  unit: string | null;
  name: string;
  position: number;
}

export interface PreparationStep {
  id: string;
  recipe_id: string;
  step_number: number;
  instruction: string;
}

export interface Recipe {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  category_id: string;
  author_id: string;
  image_url: string | null;
  preparation_time: number | null;
  cooking_time: number | null;
  servings: number | null;
  created_at: string;
  updated_at: string;
}

export interface RecipeWithDetails extends Recipe {
  category?: Category | null;
  author?: Profile | null;
  ingredients?: Ingredient[];
  preparation_steps?: PreparationStep[];
  average_rating?: number | null;
  ratings_count?: number | null;
  is_favorited?: boolean;
  user_rating?: number | null;
}

export interface Rating {
  id: string;
  recipe_id: string;
  user_id: string;
  rating: number;
  created_at: string;
  updated_at: string;
}

export interface Favorite {
  id: string;
  recipe_id: string;
  user_id: string;
  created_at: string;
}

export interface IngredientInput {
  quantity: string;
  unit: string;
  name: string;
}

export interface PreparationStepInput {
  instruction: string;
}

export interface RecipeFormData {
  title: string;
  category_id: string;
  description: string;
  preparation_time: number | "";
  cooking_time: number | "";
  servings: number | "";
  image_file?: File | null;
  image_url?: string | null;
  ingredients: IngredientInput[];
  steps: PreparationStepInput[];
}

export interface RecipeFilters {
  query?: string;
  categorySlug?: string;
  minRating?: number;
  maxPrepTime?: number;
}
