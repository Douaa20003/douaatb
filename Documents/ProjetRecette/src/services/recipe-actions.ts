"use client";

import { createClient } from "@/lib/supabase/client";
import { ALLOWED_IMAGE_TYPES, MAX_IMAGE_SIZE } from "@/constants/nav";
import { slugify } from "@/lib/utils";
import type {
  IngredientInput,
  PreparationStepInput,
  RecipeFormData,
} from "@/types/database";

function uniqueSlug(base: string) {
  const suffix = Math.random().toString(36).slice(2, 6);
  return `${base}-${suffix}`;
}

export async function uploadRecipeImage(
  file: File,
  userId: string,
  recipeId: string
): Promise<string> {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type as (typeof ALLOWED_IMAGE_TYPES)[number])) {
    throw new Error("Format d'image non supporté (JPG, PNG ou WEBP).");
  }
  if (file.size > MAX_IMAGE_SIZE) {
    throw new Error("L'image dépasse 5 Mo.");
  }

  const supabase = createClient();
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${userId}/${recipeId}/image.${ext}`;

  const { error } = await supabase.storage
    .from("recipe-images")
    .upload(path, file, { upsert: true, contentType: file.type });

  if (error) throw error;

  const {
    data: { publicUrl },
  } = supabase.storage.from("recipe-images").getPublicUrl(path);

  return publicUrl;
}

export async function deleteRecipeImage(imageUrl: string | null | undefined) {
  if (!imageUrl) return;
  const marker = "/recipe-images/";
  const idx = imageUrl.indexOf(marker);
  if (idx === -1) return;

  const path = decodeURIComponent(imageUrl.slice(idx + marker.length));
  const supabase = createClient();
  await supabase.storage.from("recipe-images").remove([path]);
}

async function replaceIngredients(
  recipeId: string,
  ingredients: IngredientInput[]
) {
  const supabase = createClient();
  await supabase.from("ingredients").delete().eq("recipe_id", recipeId);

  const rows = ingredients
    .filter((i) => i.name.trim())
    .map((ingredient, index) => ({
      recipe_id: recipeId,
      quantity: ingredient.quantity.trim() || null,
      unit: ingredient.unit.trim() || null,
      name: ingredient.name.trim(),
      position: index + 1,
    }));

  if (rows.length) {
    const { error } = await supabase.from("ingredients").insert(rows);
    if (error) throw error;
  }
}

async function replaceSteps(
  recipeId: string,
  steps: PreparationStepInput[]
) {
  const supabase = createClient();
  await supabase.from("preparation_steps").delete().eq("recipe_id", recipeId);

  const rows = steps
    .filter((s) => s.instruction.trim())
    .map((step, index) => ({
      recipe_id: recipeId,
      step_number: index + 1,
      instruction: step.instruction.trim(),
    }));

  if (rows.length) {
    const { error } = await supabase.from("preparation_steps").insert(rows);
    if (error) throw error;
  }
}

export async function createRecipe(form: RecipeFormData) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Vous devez être connecté.");

  const baseSlug = slugify(form.title);
  const slug = uniqueSlug(baseSlug || "recette");

  const { data: recipe, error } = await supabase
    .from("recipes")
    .insert({
      title: form.title.trim(),
      slug,
      description: form.description.trim() || null,
      category_id: form.category_id,
      author_id: user.id,
      preparation_time:
        form.preparation_time === "" ? null : Number(form.preparation_time),
      cooking_time:
        form.cooking_time === "" ? null : Number(form.cooking_time),
      servings: form.servings === "" ? null : Number(form.servings),
    })
    .select("*")
    .single();

  if (error) throw error;

  let imageUrl: string | null = null;
  if (form.image_file) {
    imageUrl = await uploadRecipeImage(form.image_file, user.id, recipe.id);
    const { error: imageError } = await supabase
      .from("recipes")
      .update({ image_url: imageUrl })
      .eq("id", recipe.id);
    if (imageError) throw imageError;
  }

  await replaceIngredients(recipe.id, form.ingredients);
  await replaceSteps(recipe.id, form.steps);

  return { ...recipe, image_url: imageUrl ?? recipe.image_url };
}

export async function updateRecipe(recipeId: string, form: RecipeFormData) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Vous devez être connecté.");

  const { data: existing, error: fetchError } = await supabase
    .from("recipes")
    .select("*")
    .eq("id", recipeId)
    .single();

  if (fetchError) throw fetchError;

  let imageUrl = existing.image_url as string | null;

  if (form.image_file) {
    await deleteRecipeImage(imageUrl);
    imageUrl = await uploadRecipeImage(form.image_file, user.id, recipeId);
  }

  const { data: recipe, error } = await supabase
    .from("recipes")
    .update({
      title: form.title.trim(),
      description: form.description.trim() || null,
      category_id: form.category_id,
      image_url: imageUrl,
      preparation_time:
        form.preparation_time === "" ? null : Number(form.preparation_time),
      cooking_time:
        form.cooking_time === "" ? null : Number(form.cooking_time),
      servings: form.servings === "" ? null : Number(form.servings),
    })
    .eq("id", recipeId)
    .select("*")
    .single();

  if (error) throw error;

  await replaceIngredients(recipeId, form.ingredients);
  await replaceSteps(recipeId, form.steps);

  return recipe;
}

export async function deleteRecipe(
  recipeId: string,
  imageUrl?: string | null
) {
  const supabase = createClient();
  await deleteRecipeImage(imageUrl);

  const { error } = await supabase.from("recipes").delete().eq("id", recipeId);
  if (error) throw error;
}

export async function upsertRating(recipeId: string, rating: number) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Connexion requise pour noter.");

  const { error } = await supabase.from("ratings").upsert(
    {
      recipe_id: recipeId,
      user_id: user.id,
      rating,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "recipe_id,user_id" }
  );

  if (error) throw error;
}

export async function toggleFavorite(
  recipeId: string,
  currentlyFavorited: boolean
) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Connexion requise pour les favoris.");

  if (currentlyFavorited) {
    const { error } = await supabase
      .from("favorites")
      .delete()
      .eq("recipe_id", recipeId)
      .eq("user_id", user.id);
    if (error) throw error;
    return false;
  }

  const { error } = await supabase.from("favorites").insert({
    recipe_id: recipeId,
    user_id: user.id,
  });
  if (error) throw error;
  return true;
}
