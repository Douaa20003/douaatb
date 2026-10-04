import Link from "next/link";
import type { Category } from "@/types/database";

interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      href={`/categories/${category.slug}`}
      className="group card-surface flex flex-col items-start gap-3 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-rose-200 hover:shadow-soft animate-fade-up"
    >
      <span className="text-3xl transition-transform group-hover:scale-110">
        {category.emoji ?? "🍽️"}
      </span>
      <div>
        <h3 className="font-display text-xl text-cocoa-800 group-hover:text-rose-600">
          {category.name}
        </h3>
        {category.description && (
          <p className="mt-1 text-sm text-cocoa-500 line-clamp-2">
            {category.description}
          </p>
        )}
      </div>
    </Link>
  );
}
