import { notFound, redirect } from "next/navigation";
import { RecipeForm } from "@/components/recipes/RecipeForm";
import { getCategories } from "@/services/categories";
import { getCurrentProfile } from "@/services/profiles";
import { getRecipeBySlug } from "@/services/recipes";

export const dynamic = "force-dynamic";

interface EditRecipePageProps {
  params: { slug: string };
}

export default async function EditRecipePage({ params }: EditRecipePageProps) {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");

  const [categories, recipe] = await Promise.all([
    getCategories(),
    getRecipeBySlug(params.slug, profile.id),
  ]);

  if (!recipe) notFound();

  const canEdit =
    profile.id === recipe.author_id || profile.role === "admin";
  if (!canEdit) redirect(`/recipes/${recipe.slug}`);

  return (
    <div className="container-page py-10">
      <div className="mb-8">
        <h1 className="section-title">Modifier la recette</h1>
        <p className="section-subtitle">{recipe.title}</p>
      </div>
      <RecipeForm categories={categories} initialRecipe={recipe} />
    </div>
  );
}
