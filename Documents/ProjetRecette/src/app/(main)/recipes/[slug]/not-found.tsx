import Link from "next/link";

export default function RecipeNotFound() {
  return (
    <div className="container-page flex min-h-[50vh] flex-col items-center justify-center py-20 text-center">
      <p className="text-5xl">🍰</p>
      <h1 className="mt-4 font-display text-3xl text-cocoa-800">
        Recette introuvable
      </h1>
      <p className="mt-2 text-cocoa-500">
        Cette recette n&apos;existe pas ou a été supprimée.
      </p>
      <Link href="/recipes" className="btn-primary mt-6">
        Retour aux recettes
      </Link>
    </div>
  );
}
