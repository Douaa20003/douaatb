import Image from "next/image";
import Link from "next/link";
import { CategoryCard } from "@/components/recipes/CategoryCard";
import { RecipeGrid } from "@/components/recipes/RecipeGrid";
import { getCategories } from "@/services/categories";
import { getCurrentProfile } from "@/services/profiles";
import {
  getLatestRecipes,
  getPopularRecipes,
} from "@/services/recipes";
import type { Category, RecipeWithDetails } from "@/types/database";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const profile = await getCurrentProfile().catch(() => null);

  let categories: Category[] = [];
  let popular: RecipeWithDetails[] = [];
  let latest: RecipeWithDetails[] = [];
  let hasError = false;

  try {
    [categories, popular, latest] = await Promise.all([
      getCategories(),
      getPopularRecipes(6, profile?.id),
      getLatestRecipes(6, profile?.id),
    ]);
  } catch {
    hasError = true;
  }

  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=1600&q=80"
            alt="Table dressée avec desserts et pâtisseries"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#3D2A2A]/70 via-[#3D2A2A]/45 to-transparent" />
        </div>

        <div className="container-page relative flex min-h-[70vh] items-center py-20">
          <div className="max-w-xl text-white animate-fade-up">
            <p className="mb-3 text-sm uppercase tracking-[0.2em] text-rose-100">
              Carnet gourmand privé
            </p>
            <h1 className="font-display text-5xl leading-tight sm:text-6xl">
              Mes recettes gourmandes
            </h1>
            <p className="mt-4 text-lg text-cream-100/90">
              Découvrez, partagez et conservez vos recettes préférées.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/recipes" className="btn-primary">
                Découvrir les recettes
              </Link>
              {profile && (
                <Link
                  href="/recipes/new"
                  className="btn-secondary border-white/30 bg-white/15 text-white hover:bg-white/25"
                >
                  Ajouter une recette
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="container-page space-y-16 py-16">
        {hasError && (
          <div className="card-surface border-rose-200 bg-rose-50/60 p-6 text-cocoa-700">
            Impossible de charger les données pour le moment. Vérifiez la
            configuration Supabase (variables d&apos;environnement et migrations SQL).
          </div>
        )}

        <section>
          <h2 className="section-title">Catégories</h2>
          <p className="section-subtitle">
            Explorez nos univers culinaires, du tajine aux douceurs.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </section>

        <section>
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <h2 className="section-title">Recettes populaires</h2>
              <p className="section-subtitle">
                Les mieux notées par la famille.
              </p>
            </div>
            <Link href="/recipes" className="btn-ghost hidden sm:inline-flex">
              Voir tout
            </Link>
          </div>
          <RecipeGrid
            recipes={popular}
            emptyTitle="Pas encore de recettes populaires"
            emptyDescription="Ajoutez vos premières recettes pour démarrer le carnet."
          />
        </section>

        <section>
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <h2 className="section-title">Dernières recettes</h2>
              <p className="section-subtitle">
                Fraîchement ajoutées au carnet.
              </p>
            </div>
            <Link href="/recipes" className="btn-ghost hidden sm:inline-flex">
              Voir tout
            </Link>
          </div>
          <RecipeGrid
            recipes={latest}
            emptyTitle="Aucune recette récente"
            emptyDescription="Soyez la première à partager une recette."
          />
        </section>
      </div>
    </div>
  );
}
