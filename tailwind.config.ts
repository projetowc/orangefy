import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#EE4D2D",
          50: "#FFF0ED",
          100: "#FFE0D9",
          200: "#FFC1B3",
          300: "#FFA18D",
          400: "#FF7337",
          500: "#EE4D2D",
          600: "#D43C1E",
          700: "#B02E14",
          800: "#8C200B",
          900: "#681204",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          50: "#F6F6F6",
          100: "#F0F0F0",
          200: "#E5E7EB",
        },
        dark: {
          DEFAULT: "#111827",
          muted: "#6B7280",
        },
        success: "#10B981",
        danger: "#EF4444",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.5s ease-out",
        "slide-in": "slideIn 0.4s ease-out",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "bounce-slow": "bounce 2s infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideIn: {
          "0%": { opacity: "0", transform: "translateX(-20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
      },
      backgroundImage: {
        "gradient-brand": "linear-gradient(135deg, #EE4D2D 0%, #FF7337 100%)",
        "gradient-subtle": "linear-gradient(180deg, #FFFFFF 0%, #F6F6F6 100%)",
        "gradient-hero": "linear-gradient(135deg, #FFF0ED 0%, #FFFFFF 60%, #FFF8F6 100%)",
      },
      boxShadow: {
        card: "0 1px 3px 0 rgba(0,0,0,0.06), 0 1px 2px 0 rgba(0,0,0,0.04)",
        "card-hover": "0 10px 25px -5px rgba(0,0,0,0.08), 0 4px 6px -2px rgba(0,0,0,0.04)",
        brand: "0 8px 25px -5px rgba(238,77,45,0.35)",
        glow: "0 0 40px rgba(238,77,45,0.15)",
      },
      borderRadius: {
        xl: "0.875rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
    },
  },
  plugins: [],
};

export default config;
