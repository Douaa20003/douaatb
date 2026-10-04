import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: "#FFFCFA",
          100: "#FBF6F0",
          200: "#F5EBE0",
          300: "#EAD9C8",
        },
        rose: {
          50: "#FDF2F4",
          100: "#F9E0E6",
          200: "#F3C5D0",
          300: "#E8A0B0",
          400: "#D97A92",
          500: "#C45C78",
          600: "#A84763",
        },
        cocoa: {
          500: "#6B4F4F",
          600: "#5A3F3F",
          700: "#4A3333",
          800: "#3D2A2A",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 8px 30px rgba(107, 79, 79, 0.08)",
        card: "0 4px 20px rgba(107, 79, 79, 0.06)",
      },
      borderRadius: {
        "2xl": "1.25rem",
        "3xl": "1.75rem",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "fade-up": "fadeUp 0.5s ease-out both",
        shimmer: "shimmer 1.5s infinite linear",
      },
    },
  },
  plugins: [],
};
export default config;
