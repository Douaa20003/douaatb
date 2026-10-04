import { Suspense } from "react";
import { RecipeFiltersPanel } from "@/components/recipes/RecipeFilters";
import { RecipeGrid } from "@/components/recipes/RecipeGrid";
import { SearchBar } from "@/components/recipes/SearchBar";
import { RecipeGridSkeleton } from "@/components/ui/LoadingSkeleton";
import { getCategories } from "@/services/categories";
import { getCurrentProfile } from "@/services/profiles";
import { getRecipes } from "@/services/recipes";

export const dynamic = "force-dynamic";

interface RecipesPageProps {
  searchParams: {
    q?: string;
    category?: string;
    rating?: string;
    time?: string;
  };
}

async function RecipesContent({ searchParams }: RecipesPageProps) {
  const profile = await getCurrentProfile().catch(() => null);
  const categories = await getCategories().catch(() => []);

  const recipes = await getRecipes(
    {
      query: searchParams.q,
      categorySlug: searchParams.category,
      minRating: searchParams.rating ? Number(searchParams.rating) : undefined,
      maxPrepTime: searchParams.time ? Number(searchParams.time) : undefined,
    },
    profile?.id
  ).catch(() => []);

  return (
    <>
      <div className="space-y-4">
        <SearchBar />
        <RecipeFiltersPanel categories={categories} />
      </div>
      <div className="mt-8">
        <p className="mb-4 text-sm text-cocoa-500">
          {recipes.length} recette{recipes.length > 1 ? "s" : ""} trouvée
          {recipes.length > 1 ? "s" : ""}
        </p>
        <RecipeGrid recipes={recipes} />
      </div>
    </>
  );
}

export default function RecipesPage({ searchParams }: RecipesPageProps) {
  return (
    <div className="container-page py-10">
      <div className="mb-8">
        <h1 className="section-title">Toutes les recettes</h1>
        <p className="section-subtitle">
          Recherchez par nom, ingrédient, catégorie ou auteur.
        </p>
      </div>
      <Suspense fallback={<RecipeGridSkeleton />}>
        <RecipesContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
