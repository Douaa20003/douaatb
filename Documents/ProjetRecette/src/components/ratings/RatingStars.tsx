"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingStarsProps {
  value: number;
  onChange?: (value: number) => void;
  size?: "sm" | "md" | "lg";
  readonly?: boolean;
  className?: string;
}

const sizes = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-7 w-7",
};

export function RatingStars({
  value,
  onChange,
  size = "md",
  readonly = false,
  className,
}: RatingStarsProps) {
  return (
    <div className={cn("flex items-center gap-1", className)} role="img" aria-label={`${value} sur 5`}>
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= Math.round(value);
        return (
          <button
            key={star}
            type="button"
            disabled={readonly || !onChange}
            onClick={() => onChange?.(star)}
            className={cn(
              "transition-transform",
              !readonly && onChange && "hover:scale-110 cursor-pointer",
              (readonly || !onChange) && "cursor-default"
            )}
            aria-label={`${star} étoile${star > 1 ? "s" : ""}`}
          >
            <Star
              className={cn(
                sizes[size],
                filled
                  ? "fill-rose-400 text-rose-400"
                  : "fill-transparent text-cream-300"
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
