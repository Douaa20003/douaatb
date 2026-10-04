import Link from "next/link";
import { redirect } from "next/navigation";
import { RecipeGrid } from "@/components/recipes/RecipeGrid";
import { getCurrentProfile } from "@/services/profiles";
import { getFavoriteRecipes, getRecipes } from "@/services/recipes";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");

  const [allRecipes, favorites] = await Promise.all([
    getRecipes({}, profile.id).catch(() => []),
    getFavoriteRecipes(profile.id).catch(() => []),
  ]);

  const myRecipes = allRecipes.filter((r) => r.author_id === profile.id);

  return (
    <div className="container-page space-y-12 py-10">
      <section className="card-surface p-8 animate-fade-up">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-widest text-rose-400">
              Mon profil
            </p>
            <h1 className="mt-2 font-display text-4xl text-cocoa-800">
              {profile.display_name}
            </h1>
            <p className="mt-2 text-cocoa-500">{profile.email}</p>
            <p className="mt-1 text-sm text-cocoa-500">
              Membre depuis {formatDate(profile.created_at)}
              {profile.role === "admin" ? " · Administrateur" : ""}
            </p>
          </div>
          <Link href="/recipes/new" className="btn-primary">
            Ajouter une recette
          </Link>
        </div>
      </section>

      <section>
        <h2 className="section-title">Mes recettes</h2>
        <p className="section-subtitle mb-8">
          {myRecipes.length} recette{myRecipes.length > 1 ? "s" : ""} publiée
          {myRecipes.length > 1 ? "s" : ""}
        </p>
        <RecipeGrid
          recipes={myRecipes}
          emptyTitle="Vous n'avez pas encore publié de recette"
          emptyDescription="Partagez votre première recette avec la famille."
        />
      </section>

      <section>
        <h2 className="section-title">Mes favoris</h2>
        <p className="section-subtitle mb-8">
          Accès rapide à vos coups de cœur.
        </p>
        <RecipeGrid
          recipes={favorites}
          emptyTitle="Aucun favori"
          emptyDescription="Ajoutez des recettes à vos favoris depuis leur page."
        />
      </section>
    </div>
  );
}
