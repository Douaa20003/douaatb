import Image from "next/image";
import { notFound } from "next/navigation";
import { Clock, Users, ChefHat } from "lucide-react";
import { RecipeActions } from "@/components/recipes/RecipeActions";
import { getCurrentProfile } from "@/services/profiles";
import { getRecipeBySlug } from "@/services/recipes";
import { formatDate, formatMinutes } from "@/lib/utils";

export const dynamic = "force-dynamic";

interface RecipePageProps {
  params: { slug: string };
}

export default async function RecipePage({ params }: RecipePageProps) {
  const profile = await getCurrentProfile().catch(() => null);
  const recipe = await getRecipeBySlug(params.slug, profile?.id).catch(
    () => null
  );

  if (!recipe) notFound();

  return (
    <div className="container-page py-10">
      <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <div className="relative aspect-[16/10] overflow-hidden rounded-3xl bg-cream-200 shadow-soft">
            {recipe.image_url ? (
              <Image
                src={recipe.image_url}
                alt={recipe.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-6xl opacity-40">
                🍽️
              </div>
            )}
          </div>

          <div className="mt-8 animate-fade-up">
            <span className="rounded-full bg-rose-50 px-3 py-1 text-sm text-rose-600">
              {recipe.category?.emoji} {recipe.category?.name}
            </span>
            <h1 className="mt-4 font-display text-4xl text-cocoa-800 sm:text-5xl">
              {recipe.title}
            </h1>
            <p className="mt-3 text-cocoa-500">
              Ajoutée par{" "}
              <span className="font-medium text-cocoa-700">
                {recipe.author?.display_name ?? "Anonyme"}
              </span>{" "}
              · {formatDate(recipe.created_at)}
            </p>
            {recipe.description && (
              <p className="mt-6 text-lg leading-relaxed text-cocoa-600">
                {recipe.description}
              </p>
            )}
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <div className="card-surface flex items-center gap-3 p-4">
              <Clock className="h-5 w-5 text-rose-500" />
              <div>
                <p className="text-xs text-cocoa-500">Préparation</p>
                <p className="font-medium text-cocoa-700">
                  {formatMinutes(recipe.preparation_time)}
                </p>
              </div>
            </div>
            <div className="card-surface flex items-center gap-3 p-4">
              <ChefHat className="h-5 w-5 text-rose-500" />
              <div>
                <p className="text-xs text-cocoa-500">Cuisson</p>
                <p className="font-medium text-cocoa-700">
                  {formatMinutes(recipe.cooking_time)}
                </p>
              </div>
            </div>
            <div className="card-surface flex items-center gap-3 p-4">
              <Users className="h-5 w-5 text-rose-500" />
              <div>
                <p className="text-xs text-cocoa-500">Portions</p>
                <p className="font-medium text-cocoa-700">
                  {recipe.servings ?? "—"}
                </p>
              </div>
            </div>
          </div>

          <section className="card-surface mt-8 p-6">
            <h2 className="font-display text-2xl text-cocoa-800">
              🧂 Ingrédients
            </h2>
            <ul className="mt-4 space-y-3">
              {(recipe.ingredients ?? []).map((ingredient) => (
                <li
                  key={ingredient.id}
                  className="flex gap-3 border-b border-cream-200 pb-3 last:border-0"
                >
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-400" />
                  <span className="text-cocoa-700">
                    {[ingredient.quantity, ingredient.unit, ingredient.name]
                      .filter(Boolean)
                      .join(" ")}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <section className="card-surface mt-6 p-6">
            <h2 className="font-display text-2xl text-cocoa-800">
              👩‍🍳 Préparation
            </h2>
            <ol className="mt-4 space-y-4">
              {(recipe.preparation_steps ?? []).map((step) => (
                <li key={step.id} className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-rose-100 font-medium text-rose-600">
                    {step.step_number}
                  </span>
                  <p className="pt-1 leading-relaxed text-cocoa-700">
                    {step.instruction}
                  </p>
                </li>
              ))}
            </ol>
          </section>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <RecipeActions recipe={recipe} profile={profile} />
        </aside>
      </div>
    </div>
  );
}
