"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, Plus, Heart, User, LogOut, LogIn, X } from "lucide-react";
import { Suspense, useState } from "react";
import { toast } from "sonner";
import { SearchBar } from "@/components/recipes/SearchBar";
import { NAV_LINKS } from "@/constants/nav";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import type { Profile } from "@/types/database";

interface NavbarProps {
  profile: Profile | null;
}

export function Navbar({ profile }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    toast.success("Déconnexion réussie");
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-40 border-b border-cream-200/80 bg-[#FFFCFA]/85 backdrop-blur-md">
      <div className="container-page">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link href="/" className="shrink-0 font-display text-2xl text-rose-600">
            Mes Recettes
          </Link>

          <nav className="hidden items-center gap-1 xl:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-full px-3 py-1.5 text-sm transition",
                  pathname === link.href
                    ? "bg-rose-100 text-rose-700"
                    : "text-cocoa-600 hover:bg-rose-50"
                )}
              >
                <span className="mr-1">{link.emoji}</span>
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden max-w-xs flex-1 md:block lg:max-w-sm">
            <Suspense fallback={<div className="input h-10" />}>
              <SearchBar />
            </Suspense>
          </div>

          <div className="hidden items-center gap-1 sm:flex">
            {profile ? (
              <>
                <Link href="/recipes/new" className="btn-primary !py-2">
                  <Plus className="h-4 w-4" />
                  <span className="hidden lg:inline">Ajouter</span>
                </Link>
                <Link href="/favorites" className="btn-ghost" aria-label="Favoris">
                  <Heart className="h-4 w-4" />
                </Link>
                <Link href="/profile" className="btn-ghost" aria-label="Profil">
                  <User className="h-4 w-4" />
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="btn-ghost"
                  aria-label="Déconnexion"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </>
            ) : (
              <Link href="/login" className="btn-primary !py-2">
                <LogIn className="h-4 w-4" /> Connexion
              </Link>
            )}
          </div>

          <button
            type="button"
            className="btn-ghost xl:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {open && (
          <div className="border-t border-cream-200 py-4 xl:hidden animate-fade-up">
            <div className="mb-4 md:hidden">
              <Suspense fallback={null}>
                <SearchBar />
              </Suspense>
            </div>
            <div className="grid gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "rounded-2xl px-4 py-3 text-sm",
                    pathname === link.href
                      ? "bg-rose-100 text-rose-700"
                      : "text-cocoa-700 hover:bg-rose-50"
                  )}
                >
                  {link.emoji} {link.label}
                </Link>
              ))}
            </div>
            <div className="mt-4 grid gap-2 border-t border-cream-200 pt-4">
              {profile ? (
                <>
                  <Link
                    href="/recipes/new"
                    onClick={() => setOpen(false)}
                    className="btn-primary"
                  >
                    <Plus className="h-4 w-4" /> Ajouter une recette
                  </Link>
                  <Link
                    href="/favorites"
                    onClick={() => setOpen(false)}
                    className="btn-secondary"
                  >
                    <Heart className="h-4 w-4" /> Mes favoris
                  </Link>
                  <Link
                    href="/profile"
                    onClick={() => setOpen(false)}
                    className="btn-secondary"
                  >
                    <User className="h-4 w-4" /> Mon profil
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="btn-ghost justify-start"
                  >
                    <LogOut className="h-4 w-4" /> Déconnexion
                  </button>
                </>
              ) : (
                <Link href="/login" className="btn-primary">
                  <LogIn className="h-4 w-4" /> Connexion
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
