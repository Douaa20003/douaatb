"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";

interface SearchBarProps {
  placeholder?: string;
  className?: string;
  basePath?: string;
}

export function SearchBar({
  placeholder = "Rechercher une recette, un ingrédient...",
  className,
  basePath = "/recipes",
}: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get("q") ?? "");

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (value.trim()) params.set("q", value.trim());
    else params.delete("q");
    router.push(`${basePath}?${params.toString()}`);
  }

  return (
    <form onSubmit={onSubmit} className={className}>
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-cocoa-500/60" />
        <input
          type="search"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className="input pl-10"
          aria-label="Rechercher"
        />
      </div>
    </form>
  );
}
