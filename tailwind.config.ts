import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        base: "#0B0B0F",
        surface: "#15151B",
        elevated: "#1D1D25",
        accent: {
          DEFAULT: "#F5A623",
          hover: "#FFB938",
          soft: "#E08600",
        },
        line: "rgba(255,255,255,0.08)",
        success: "#1DB954",
        warning: "#F5A623",
        danger: "#F0506E",
      },
      fontFamily: {
        sans: ["var(--font-manrope)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "accent-gradient": "linear-gradient(135deg, #FFC24B 0%, #F5A623 55%, #E08600 100%)",
        "app-gradient":
          "radial-gradient(1200px 600px at 15% -10%, rgba(245,166,35,0.10), transparent 60%), radial-gradient(900px 500px at 100% 0%, rgba(245,166,35,0.06), transparent 55%), linear-gradient(180deg, #0B0B0F 0%, #0E0E13 100%)",
        "glass":
          "linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)",
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(245,166,35,0.25), 0 8px 30px -8px rgba(245,166,35,0.45)",
        "glow-sm": "0 6px 18px -6px rgba(245,166,35,0.5)",
        card: "0 10px 30px -12px rgba(0,0,0,0.6)",
        lift: "0 18px 40px -16px rgba(0,0,0,0.75)",
      },
      borderRadius: {
        xl: "0.9rem",
        "2xl": "1.25rem",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        eq: {
          "0%, 100%": { transform: "scaleY(0.35)" },
          "50%": { transform: "scaleY(1)" },
        },
        discspin: {
          to: { transform: "rotate(360deg)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.4s ease-out both",
        eq: "eq 0.9s ease-in-out infinite",
        disc: "discspin 9s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;
