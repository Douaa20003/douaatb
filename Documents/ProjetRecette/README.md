# Mes recettes gourmandes

Site web privé, moderne et élégant pour partager des recettes entre famille et amis.

**Stack :** Next.js 14 · TypeScript · Tailwind CSS · Supabase (Auth, PostgreSQL, Storage)

---

## Fonctionnalités

- Authentification (connexion / inscription / session persistante)
- Accueil avec hero, catégories, recettes populaires et récentes
- Recherche par nom, ingrédients, catégorie ou auteur + filtres
- Pages recettes détaillées (ingrédients, étapes, image, auteur)
- Ajout / modification / suppression (propriétaire ou admin)
- Upload d’images via Supabase Storage
- Notation 1–5 étoiles (une note par utilisateur)
- Favoris
- Design responsive (desktop, tablette, mobile)

---

## Prérequis

- Node.js 18+
- Un projet [Supabase](https://supabase.com) (plan gratuit suffisant)

---

## 1. Installation locale

```bash
cd ProjetRecette
npm install
cp .env.example .env.local
```

Renseignez `.env.local` :

```env
NEXT_PUBLIC_SUPABASE_URL=https://VOTRE_PROJET.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_anon_key
```

Ces valeurs se trouvent dans **Supabase → Project Settings → API**.

> Ne jamais mettre la `service_role` key dans le frontend.

---

## 2. Configuration Supabase

### 2.1 Migrations SQL

Dans **Supabase → SQL Editor**, exécutez dans l’ordre :

1. `supabase/migrations/001_initial_schema.sql`  
   Tables, contraintes, triggers, RLS, bucket Storage
2. `supabase/migrations/002_seed_categories.sql`  
   Catégories
3. Créez un premier compte via l’app (`/signup`)
4. `supabase/migrations/003_seed_recipes.sql`  
   Recettes de test (attribuées au premier profil)

### 2.2 Auth

Dans **Authentication → Providers** :

- Email activé
- Pour un cercle privé, vous pouvez ensuite désactiver les inscriptions publiques et créer les comptes manuellement

### 2.3 Rôle admin

Pour promouvoir un utilisateur :

```sql
update public.profiles
set role = 'admin'
where email = 'votre@email.com';
```

### 2.4 Storage

Le bucket `recipe-images` est créé par la migration 001 :

- Public (URLs d’affichage)
- Formats : JPG, JPEG, PNG, WEBP
- Taille max : 5 Mo
- Chemins : `{user_id}/{recipe_id}/image.ext`

---

## 3. Lancement

```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000).

Sans session, vous serez redirigé vers `/login`.

---

## 4. Structure du projet

```
src/
  app/                 # Pages (App Router)
  components/          # UI, recettes, auth, layout
  services/            # Accès Supabase
  lib/supabase/        # Clients browser / server / middleware
  hooks/ types/ constants/
supabase/migrations/   # SQL schema + seed
```

---

## 5. Images placeholder

Les recettes de seed utilisent des images Unsplash. Pour les remplacer :

1. Ouvrez la recette → **Modifier**
2. Uploadez votre propre photo
3. Ou remplacez `image_url` dans Supabase Table Editor

---

## 6. Déploiement (Vercel — gratuit)

1. Poussez le repo sur GitHub
2. Importez le projet sur [vercel.com](https://vercel.com)
3. Ajoutez les variables d’environnement :
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Déployez

Dans Supabase → **Authentication → URL Configuration**, ajoutez l’URL Vercel dans les Redirect URLs.

---

## 7. Sécurité (rappel)

- RLS activé sur toutes les tables
- Un utilisateur ne modifie/supprime que ses recettes (sauf admin)
- Notes et favoris limités au propriétaire
- Pas d’auto-promotion en admin
- Seule la clé `anon` est exposée côté client

---

## Scripts

| Commande        | Description              |
|-----------------|--------------------------|
| `npm run dev`   | Développement local      |
| `npm run build` | Build de production      |
| `npm run start` | Serveur de production    |
| `npm run lint`  | ESLint                   |

---

Bon appétit 🍰
