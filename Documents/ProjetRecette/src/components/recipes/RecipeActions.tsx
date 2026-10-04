"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { RatingStars } from "@/components/ratings/RatingStars";
import {
  deleteRecipe,
  toggleFavorite,
  upsertRating,
} from "@/services/recipe-actions";
import { formatRating } from "@/lib/utils";
import type { Profile, RecipeWithDetails } from "@/types/database";

interface RecipeActionsProps {
  recipe: RecipeWithDetails;
  profile: Profile | null;
}

export function RecipeActions({ recipe, profile }: RecipeActionsProps) {
  const router = useRouter();
  const [favorited, setFavorited] = useState(Boolean(recipe.is_favorited));
  const [userRating, setUserRating] = useState(recipe.user_rating ?? 0);
  const [avg, setAvg] = useState(recipe.average_rating ?? 0);
  const [count, setCount] = useState(recipe.ratings_count ?? 0);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const canEdit =
    profile &&
    (profile.id === recipe.author_id || profile.role === "admin");

  async function onRate(value: number) {
    try {
      await upsertRating(recipe.id, value);
      const wasNew = !userRating;
      const previous = userRating;
      setUserRating(value);
      if (wasNew) {
        const nextCount = count + 1;
        setAvg((avg * count + value) / nextCount);
        setCount(nextCount);
      } else {
        setAvg((avg * count - previous + value) / count);
      }
      toast.success("Note enregistrée");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur de notation");
    }
  }

  async function onFavorite() {
    try {
      const next = await toggleFavorite(recipe.id, favorited);
      setFavorited(next);
      toast.success(next ? "Ajoutée aux favoris" : "Retirée des favoris");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur favoris");
    }
  }

  async function onDelete() {
    setLoading(true);
    try {
      await deleteRecipe(recipe.id, recipe.image_url);
      toast.success("Recette supprimée");
      router.push("/recipes");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Suppression impossible");
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="card-surface flex flex-wrap items-center justify-between gap-4 p-5">
        <div>
          <p className="text-sm text-cocoa-500">Note moyenne</p>
          <div className="mt-1 flex items-center gap-2">
            <RatingStars value={avg} readonly size="md" />
            <span className="font-medium text-cocoa-700">
              {formatRating(avg)} ⭐ ({count} avis)
            </span>
          </div>
        </div>

        <button type="button" onClick={onFavorite} className="btn-secondary">
          <Heart
            className={`h-4 w-4 ${
              favorited ? "fill-rose-500 text-rose-500" : ""
            }`}
          />
          {favorited ? "Retirer des favoris" : "Ajouter aux favoris"}
        </button>
      </div>

      {profile && (
        <div className="card-surface p-5">
          <p className="mb-2 text-sm text-cocoa-500">Votre note</p>
          <RatingStars value={userRating} onChange={onRate} size="lg" />
        </div>
      )}

      {canEdit && (
        <div className="flex flex-wrap gap-3">
          <Link href={`/recipes/${recipe.slug}/edit`} className="btn-secondary">
            <Pencil className="h-4 w-4" /> Modifier
          </Link>
          <button
            type="button"
            className="btn-secondary text-rose-600"
            onClick={() => setConfirmOpen(true)}
          >
            <Trash2 className="h-4 w-4" /> Supprimer
          </button>
        </div>
      )}

      <ConfirmDialog
        open={confirmOpen}
        title="Supprimer la recette"
        description="Voulez-vous vraiment supprimer cette recette ?"
        confirmLabel="Oui, supprimer"
        loading={loading}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={onDelete}
      />
    </div>
  );
}
