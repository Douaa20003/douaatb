"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type { Category } from "@/types/database";

interface RecipeFiltersProps {
  categories: Category[];
  basePath?: string;
}

export function RecipeFiltersPanel({
  categories,
  basePath = "/recipes",
}: RecipeFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function update(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`${basePath}?${params.toString()}`);
  }

  return (
    <div className="card-surface grid gap-4 p-4 sm:grid-cols-3">
      <div>
        <label className="label" htmlFor="category">
          Catégorie
        </label>
        <select
          id="category"
          className="input"
          value={searchParams.get("category") ?? ""}
          onChange={(e) => update("category", e.target.value)}
        >
          <option value="">Toutes</option>
          {categories.map((category) => (
            <option key={category.id} value={category.slug}>
              {category.emoji} {category.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="label" htmlFor="rating">
          Note minimale
        </label>
        <select
          id="rating"
          className="input"
          value={searchParams.get("rating") ?? ""}
          onChange={(e) => update("rating", e.target.value)}
        >
          <option value="">Toutes</option>
          <option value="4">4★ et plus</option>
          <option value="3">3★ et plus</option>
          <option value="2">2★ et plus</option>
        </select>
      </div>

      <div>
        <label className="label" htmlFor="time">
          Temps de préparation
        </label>
        <select
          id="time"
          className="input"
          value={searchParams.get("time") ?? ""}
          onChange={(e) => update("time", e.target.value)}
        >
          <option value="">Tous</option>
          <option value="15">≤ 15 min</option>
          <option value="30">≤ 30 min</option>
          <option value="60">≤ 1 h</option>
        </select>
      </div>
    </div>
  );
}
