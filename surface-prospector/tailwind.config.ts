import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0A0A0B",
        surface: "#141415",
        border: "#2A2A2D",
        primary: "#3B82F6",
        success: "#22C55E",
        warning: "#EAB308",
        muted: "#6B7280",
        "text-primary": "#FAFAFA",
        "text-secondary": "#A1A1AA",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui"],
      },
      boxShadow: {
        lift: "0 12px 32px rgba(0, 0, 0, 0.4)",
      },
      transitionTimingFunction: {
        out: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        flash: {
          "0%": { boxShadow: "0 0 0 0 rgba(34, 197, 94, 0.6)" },
          "100%": { boxShadow: "0 0 0 12px rgba(34, 197, 94, 0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.4s ease-out",
        flash: "flash 1s ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
