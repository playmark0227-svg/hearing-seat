import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "system-ui", "sans-serif"],
      },
      colors: {
        ink: {
          900: "#0b0820",
          800: "#13102d",
          700: "#1b1640",
        },
        neon: {
          pink: "#ff4fa3",
          purple: "#9b5cff",
          blue: "#4fc3ff",
          lime: "#b8ff5c",
          gold: "#ffd24f",
        },
      },
      backgroundImage: {
        "grid-fade":
          "radial-gradient(ellipse at top, rgba(155,92,255,0.25), transparent 60%), radial-gradient(ellipse at bottom, rgba(79,195,255,0.18), transparent 60%)",
        "hero-glow":
          "radial-gradient(circle at 20% 20%, rgba(255,79,163,0.35), transparent 45%), radial-gradient(circle at 80% 30%, rgba(155,92,255,0.35), transparent 45%), radial-gradient(circle at 50% 90%, rgba(79,195,255,0.25), transparent 45%)",
      },
      keyframes: {
        "float-slow": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(155,92,255,0.4)" },
          "50%": { boxShadow: "0 0 40px 10px rgba(155,92,255,0.0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        pop: {
          "0%": { transform: "scale(0.8)", opacity: "0" },
          "60%": { transform: "scale(1.05)", opacity: "1" },
          "100%": { transform: "scale(1)" },
        },
      },
      animation: {
        "float-slow": "float-slow 4s ease-in-out infinite",
        "pulse-glow": "pulse-glow 2.4s ease-in-out infinite",
        shimmer: "shimmer 2.5s linear infinite",
        pop: "pop 0.4s ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
