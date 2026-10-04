import Link from "next/link";
import type { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  description?: string;
  actionHref?: string;
  actionLabel?: string;
  icon?: ReactNode;
}

export function EmptyState({
  title,
  description,
  actionHref,
  actionLabel,
  icon,
}: EmptyStateProps) {
  return (
    <div className="card-surface flex flex-col items-center px-6 py-16 text-center animate-fade-up">
      {icon && <div className="mb-4 text-4xl opacity-80">{icon}</div>}
      <h3 className="font-display text-2xl text-cocoa-800">{title}</h3>
      {description && (
        <p className="mt-2 max-w-md text-cocoa-500">{description}</p>
      )}
      {actionHref && actionLabel && (
        <Link href={actionHref} className="btn-primary mt-6">
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
