import { redirect } from "next/navigation";
import { RecipeGrid } from "@/components/recipes/RecipeGrid";
import { getCurrentProfile } from "@/services/profiles";
import { getFavoriteRecipes } from "@/services/recipes";

export const dynamic = "force-dynamic";

export default async function FavoritesPage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");

  const recipes = await getFavoriteRecipes(profile.id).catch(() => []);

  return (
    <div className="container-page py-10">
      <div className="mb-8">
        <h1 className="section-title">❤️ Mes favoris</h1>
        <p className="section-subtitle">
          Vos recettes préférées, réunies au même endroit.
        </p>
      </div>
      <RecipeGrid
        recipes={recipes}
        emptyTitle="Aucun favori pour le moment"
        emptyDescription="Cliquez sur le cœur d'une recette pour l'enregistrer ici."
      />
    </div>
  );
}
