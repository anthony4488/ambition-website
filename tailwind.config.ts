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
        accent: "#FF8C42",
        "accent-light": "#FFB366",
        "accent-dark": "#e06b1a",
        dark: {
          DEFAULT: "#000000",
          50: "#0a0a0a",
          100: "#111111",
          200: "#1a1a1a",
          300: "#222222",
          400: "#333333",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      animation: {
        "marquee": "marquee 30s linear infinite",
        "shimmer": "shimmer 3s linear infinite",
        "float": "float 8s ease-in-out infinite",
        "float-slow": "float-slow 12s ease-in-out infinite",
        "pulse-glow": "pulse-glow 2.5s ease-in-out infinite",
        "gradient-shift": "gradient-shift 6s ease infinite",
        "scroll-indicator": "scroll-indicator 2s ease-in-out infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
        float: {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "33%": { transform: "translate(10px, -15px) scale(1.05)" },
          "66%": { transform: "translate(-8px, 8px) scale(0.97)" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "50%": { transform: "translate(-15px, -20px) scale(1.03)" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(255, 140, 66, 0.3), 0 0 60px rgba(255, 140, 66, 0.1)" },
          "50%": { boxShadow: "0 0 30px rgba(255, 140, 66, 0.5), 0 0 80px rgba(255, 140, 66, 0.2)" },
        },
        "gradient-shift": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        "scroll-indicator": {
          "0%, 100%": { transform: "translateY(0)", opacity: "1" },
          "50%": { transform: "translateY(8px)", opacity: "0.4" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
