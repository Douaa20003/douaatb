import { RecipeCard } from "@/components/recipes/RecipeCard";
import { EmptyState } from "@/components/ui/EmptyState";
import type { RecipeWithDetails } from "@/types/database";

interface RecipeGridProps {
  recipes: RecipeWithDetails[];
  emptyTitle?: string;
  emptyDescription?: string;
}

export function RecipeGrid({
  recipes,
  emptyTitle = "Aucune recette trouvée",
  emptyDescription = "Essayez une autre recherche ou ajoutez une nouvelle recette.",
}: RecipeGridProps) {
  if (!recipes.length) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        actionHref="/recipes/new"
        actionLabel="Ajouter une recette"
        icon="🍰"
      />
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {recipes.map((recipe) => (
        <RecipeCard key={recipe.id} recipe={recipe} />
      ))}
    </div>
  );
}
