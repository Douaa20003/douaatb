import { notFound } from "next/navigation";
import { RecipeGrid } from "@/components/recipes/RecipeGrid";
import { getCategoryBySlug } from "@/services/categories";
import { getCurrentProfile } from "@/services/profiles";
import { getRecipes } from "@/services/recipes";

export const dynamic = "force-dynamic";

interface CategoryPageProps {
  params: { slug: string };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const category = await getCategoryBySlug(params.slug).catch(() => null);
  if (!category) notFound();

  const profile = await getCurrentProfile().catch(() => null);
  const recipes = await getRecipes(
    { categorySlug: category.slug },
    profile?.id
  ).catch(() => []);

  return (
    <div className="container-page py-10">
      <div className="mb-8">
        <p className="text-4xl">{category.emoji}</p>
        <h1 className="section-title mt-3">{category.name}</h1>
        {category.description && (
          <p className="section-subtitle">{category.description}</p>
        )}
      </div>
      <RecipeGrid
        recipes={recipes}
        emptyTitle="Aucune recette dans cette catégorie"
        emptyDescription="Ajoutez la première recette de cette catégorie."
      />
    </div>
  );
}
