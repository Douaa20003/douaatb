import { RecipeForm } from "@/components/recipes/RecipeForm";
import { getCategories } from "@/services/categories";

export const dynamic = "force-dynamic";

export default async function NewRecipePage() {
  const categories = await getCategories();

  return (
    <div className="container-page py-10">
      <div className="mb-8">
        <h1 className="section-title">Ajouter une recette</h1>
        <p className="section-subtitle">
          Partagez une nouvelle création avec la famille.
        </p>
      </div>
      <RecipeForm categories={categories} />
    </div>
  );
}
