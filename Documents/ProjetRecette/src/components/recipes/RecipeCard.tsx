"use client";

import Image from "next/image";
import Link from "next/link";
import { Clock, Heart } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { RatingStars } from "@/components/ratings/RatingStars";
import { toggleFavorite } from "@/services/recipe-actions";
import { formatMinutes, formatRating } from "@/lib/utils";
import type { RecipeWithDetails } from "@/types/database";

interface RecipeCardProps {
  recipe: RecipeWithDetails;
  showFavorite?: boolean;
}

export function RecipeCard({ recipe, showFavorite = true }: RecipeCardProps) {
  const [favorited, setFavorited] = useState(Boolean(recipe.is_favorited));
  const [loading, setLoading] = useState(false);

  async function handleFavorite(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (loading) return;
    setLoading(true);
    try {
      const next = await toggleFavorite(recipe.id, favorited);
      setFavorited(next);
      toast.success(next ? "Ajoutée aux favoris" : "Retirée des favoris");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur favoris");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Link
      href={`/recipes/${recipe.slug}`}
      className="group card-surface block overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-soft animate-fade-up"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-cream-200">
        {recipe.image_url ? (
          <Image
            src={recipe.image_url}
            alt={recipe.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-4xl opacity-40">
            🍽️
          </div>
        )}
        {showFavorite && (
          <button
            type="button"
            onClick={handleFavorite}
            className="absolute right-3 top-3 rounded-full bg-white/90 p-2 shadow-sm transition hover:scale-110"
            aria-label={favorited ? "Retirer des favoris" : "Ajouter aux favoris"}
          >
            <Heart
              className={`h-4 w-4 ${
                favorited ? "fill-rose-500 text-rose-500" : "text-cocoa-500"
              }`}
            />
          </button>
        )}
      </div>

      <div className="space-y-2 p-4">
        <div className="flex items-center justify-between gap-2">
          <span className="rounded-full bg-rose-50 px-2.5 py-1 text-xs font-medium text-rose-600">
            {recipe.category?.emoji} {recipe.category?.name ?? "Recette"}
          </span>
          {recipe.preparation_time != null && (
            <span className="inline-flex items-center gap-1 text-xs text-cocoa-500">
              <Clock className="h-3.5 w-3.5" />
              {formatMinutes(recipe.preparation_time)}
            </span>
          )}
        </div>

        <h3 className="font-display text-xl text-cocoa-800 transition group-hover:text-rose-600">
          {recipe.title}
        </h3>

        <p className="text-sm text-cocoa-500">
          Par {recipe.author?.display_name ?? "Anonyme"}
        </p>

        <div className="flex items-center gap-2 pt-1">
          <RatingStars value={recipe.average_rating ?? 0} size="sm" readonly />
          <span className="text-sm text-cocoa-500">
            {formatRating(recipe.average_rating)}{" "}
            <span className="text-cocoa-500/70">
              ({recipe.ratings_count ?? 0})
            </span>
          </span>
        </div>
      </div>
    </Link>
  );
}
