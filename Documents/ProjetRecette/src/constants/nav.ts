export const NAV_LINKS = [
  { href: "/", label: "Accueil", emoji: "🏠" },
  { href: "/recipes", label: "Recettes", emoji: "🍽️" },
  { href: "/categories/marocaines", label: "Marocaines", emoji: "🍲" },
  { href: "/categories/gateaux", label: "Gâteaux", emoji: "🍰" },
  { href: "/categories/salees", label: "Salées", emoji: "🥐" },
  { href: "/categories/salades", label: "Salades", emoji: "🥗" },
  { href: "/categories/soupes", label: "Soupes", emoji: "🥣" },
  { href: "/categories/jus", label: "Jus", emoji: "🧃" },
] as const;

export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB
export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
] as const;
