"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { IngredientInputList } from "@/components/recipes/IngredientInput";
import { PreparationStepInputList } from "@/components/recipes/PreparationStepInput";
import { createRecipe, updateRecipe } from "@/services/recipe-actions";
import type { Category, RecipeFormData, RecipeWithDetails } from "@/types/database";

interface RecipeFormProps {
  categories: Category[];
  initialRecipe?: RecipeWithDetails;
}

export function RecipeForm({ categories, initialRecipe }: RecipeFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(
    initialRecipe?.image_url ?? null
  );
  const [form, setForm] = useState<RecipeFormData>({
    title: initialRecipe?.title ?? "",
    category_id: initialRecipe?.category_id ?? categories[0]?.id ?? "",
    description: initialRecipe?.description ?? "",
    preparation_time: initialRecipe?.preparation_time ?? "",
    cooking_time: initialRecipe?.cooking_time ?? "",
    servings: initialRecipe?.servings ?? "",
    image_file: null,
    image_url: initialRecipe?.image_url ?? null,
    ingredients: initialRecipe?.ingredients?.length
      ? initialRecipe.ingredients.map((i) => ({
          quantity: i.quantity ?? "",
          unit: i.unit ?? "",
          name: i.name,
        }))
      : [{ quantity: "", unit: "", name: "" }],
    steps: initialRecipe?.preparation_steps?.length
      ? initialRecipe.preparation_steps.map((s) => ({
          instruction: s.instruction,
        }))
      : [{ instruction: "" }],
  });

  function onFileChange(file: File | null) {
    setForm((prev) => ({ ...prev, image_file: file }));
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
    }
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !form.category_id) {
      toast.error("Le titre et la catégorie sont obligatoires.");
      return;
    }

    setLoading(true);
    try {
      const recipe = initialRecipe
        ? await updateRecipe(initialRecipe.id, form)
        : await createRecipe(form);

      toast.success(
        initialRecipe ? "Recette mise à jour" : "Recette ajoutée avec succès"
      );
      router.push(`/recipes/${recipe.slug}`);
      router.refresh();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Impossible d'enregistrer la recette"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <section className="card-surface space-y-4 p-6">
        <h2 className="font-display text-2xl text-cocoa-800">
          Informations générales
        </h2>

        <div>
          <label className="label" htmlFor="title">
            Nom de la recette
          </label>
          <input
            id="title"
            className="input"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="label" htmlFor="category">
            Catégorie
          </label>
          <select
            id="category"
            className="input"
            value={form.category_id}
            onChange={(e) => setForm({ ...form, category_id: e.target.value })}
            required
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.emoji} {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            className="input min-h-[100px]"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="label" htmlFor="prep">
              Préparation (min)
            </label>
            <input
              id="prep"
              type="number"
              min={0}
              className="input"
              value={form.preparation_time}
              onChange={(e) =>
                setForm({
                  ...form,
                  preparation_time: e.target.value === "" ? "" : Number(e.target.value),
                })
              }
            />
          </div>
          <div>
            <label className="label" htmlFor="cook">
              Cuisson (min)
            </label>
            <input
              id="cook"
              type="number"
              min={0}
              className="input"
              value={form.cooking_time}
              onChange={(e) =>
                setForm({
                  ...form,
                  cooking_time: e.target.value === "" ? "" : Number(e.target.value),
                })
              }
            />
          </div>
          <div>
            <label className="label" htmlFor="servings">
              Portions
            </label>
            <input
              id="servings"
              type="number"
              min={1}
              className="input"
              value={form.servings}
              onChange={(e) =>
                setForm({
                  ...form,
                  servings: e.target.value === "" ? "" : Number(e.target.value),
                })
              }
            />
          </div>
        </div>
      </section>

      <section className="card-surface space-y-4 p-6">
        <h2 className="font-display text-2xl text-cocoa-800">Image</h2>
        <input
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          className="input"
          onChange={(e) => onFileChange(e.target.files?.[0] ?? null)}
        />
        <p className="text-sm text-cocoa-500">
          JPG, PNG ou WEBP — max 5 Mo. L&apos;image est stockée dans Supabase Storage.
        </p>
        {preview && (
          <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-cream-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview}
              alt="Aperçu"
              className="h-full w-full object-cover"
            />
          </div>
        )}
      </section>

      <section className="card-surface space-y-4 p-6">
        <h2 className="font-display text-2xl text-cocoa-800">🧂 Ingrédients</h2>
        <IngredientInputList
          ingredients={form.ingredients}
          onChange={(ingredients) => setForm({ ...form, ingredients })}
        />
      </section>

      <section className="card-surface space-y-4 p-6">
        <h2 className="font-display text-2xl text-cocoa-800">👩‍🍳 Préparation</h2>
        <PreparationStepInputList
          steps={form.steps}
          onChange={(steps) => setForm({ ...form, steps })}
        />
      </section>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          className="btn-secondary"
          onClick={() => router.back()}
        >
          Annuler
        </button>
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading
            ? "Enregistrement..."
            : initialRecipe
              ? "Enregistrer les modifications"
              : "Publier la recette"}
        </button>
      </div>
    </form>
  );
}
