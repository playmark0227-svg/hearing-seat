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
          50: "#fafafa",
          100: "#f5f5f7",
          150: "#eeeef2",
          200: "#e8e8ed",
          300: "#d2d2d7",
          400: "#a1a1a6",
          500: "#86868b",
          600: "#515154",
          700: "#1d1d1f",
          800: "#0f0f10",
          900: "#000000",
        },
        accent: {
          DEFAULT: "#0071e3",
          dark: "#0058b8",
          soft: "#e6f0fd",
        },
      },
      letterSpacing: {
        tightest: "-0.04em",
        ultra: "-0.05em",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) both",
        "fade-in": "fade-in 0.8s ease-out both",
        float: "float 6s ease-in-out infinite",
      },
      boxShadow: {
        soft: "0 1px 3px rgba(0,0,0,0.04), 0 6px 24px rgba(0,0,0,0.04)",
        elev: "0 1px 3px rgba(0,0,0,0.06), 0 16px 48px rgba(0,0,0,0.08)",
        ring: "0 0 0 1px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.05)",
      },
    },
  },
  plugins: [],
};

export default config;
