"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

interface AuthFormProps {
  mode: "login" | "signup";
}

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/";
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    const supabase = createClient();

    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { display_name: displayName.trim() || email.split("@")[0] },
          },
        });
        if (error) throw error;
        toast.success("Compte créé. Vous pouvez vous connecter.");
        router.push("/login");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        toast.success("Connexion réussie");
        router.push(next);
        router.refresh();
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur d'authentification");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="card-surface mx-auto w-full max-w-md space-y-4 p-8 animate-fade-up">
      <div className="text-center">
        <h1 className="font-display text-3xl text-cocoa-800">
          {mode === "login" ? "Connexion" : "Créer un compte"}
        </h1>
        <p className="mt-2 text-sm text-cocoa-500">
          Accès réservé à la famille et aux amis.
        </p>
      </div>

      {mode === "signup" && (
        <div>
          <label className="label" htmlFor="name">
            Prénom / Nom affiché
          </label>
          <input
            id="name"
            className="input"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Douaa"
          />
        </div>
      )}

      <div>
        <label className="label" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          className="input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="label" htmlFor="password">
          Mot de passe
        </label>
        <input
          id="password"
          type="password"
          className="input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={6}
          required
        />
      </div>

      <button type="submit" className="btn-primary w-full" disabled={loading}>
        {loading
          ? "Chargement..."
          : mode === "login"
            ? "Se connecter"
            : "Créer mon compte"}
      </button>

      <p className="text-center text-sm text-cocoa-500">
        {mode === "login" ? (
          <>
            Pas encore de compte ?{" "}
            <Link href="/signup" className="text-rose-600 hover:underline">
              S&apos;inscrire
            </Link>
          </>
        ) : (
          <>
            Déjà un compte ?{" "}
            <Link href="/login" className="text-rose-600 hover:underline">
              Se connecter
            </Link>
          </>
        )}
      </p>
    </form>
  );
}
