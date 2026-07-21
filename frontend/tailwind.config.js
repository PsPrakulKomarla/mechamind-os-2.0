/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Core palette
        primary: {
          bg: "#0B1220",
          DEFAULT: "#3B82F6",
          foreground: "#FFFFFF",
        },
        secondary: {
          bg: "#111827",
          DEFAULT: "#1F2937",
          foreground: "#F9FAFB",
        },
        card: {
          bg: "#1F2937",
          DEFAULT: "#1F2937",
          foreground: "#F9FAFB",
        },
        accent: {
          DEFAULT: "#3B82F6",
          foreground: "#FFFFFF",
        },
        muted: {
          DEFAULT: "#1F2937",
          foreground: "#9CA3AF",
        },
        foreground: "#F3F4F6",
        background: "#0B1220",
        border: "#374151",
        input: "#374151",
        ring: "#3B82F6",

        // Brand tokens
        "brand-production": "#10B981",
        "brand-agent": "#8B5CF6",
        "brand-mobile": "#06B6D4",

        // Semantic
        success: "#10B981",
        warning: "#F59E0B",
        danger: "#EF4444",
        info: "#06B6D4",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-out",
        "slide-up": "slideUp 0.3s ease-out",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "breathe": "breathe 4s ease-in-out infinite",
        "glow": "glow 3s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
        "shimmer": "shimmer 2s linear infinite",
        "rotate-slow": "rotate-slow 20s linear infinite",
        "rotate-reverse": "rotate-reverse 25s linear infinite",
        "neural-pulse": "neural-pulse 3s ease-in-out infinite",
        "pulse-ring": "pulse-ring 3s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        breathe: {
          "0%, 100%": { transform: "scale(1)", opacity: "0.8" },
          "50%": { transform: "scale(1.05)", opacity: "1" },
        },
        glow: {
          "0%, 100%": { opacity: "0.5" },
          "50%": { opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "rotate-slow": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "rotate-reverse": {
          "0%": { transform: "rotate(360deg)" },
          "100%": { transform: "rotate(0deg)" },
        },
        "neural-pulse": {
          "0%": { opacity: "0.3", transform: "scale(1)" },
          "50%": { opacity: "0.8", transform: "scale(1.02)" },
          "100%": { opacity: "0.3", transform: "scale(1)" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(0.9)", opacity: "0.8" },
          "50%": { transform: "scale(1.1)", opacity: "0.4" },
          "100%": { transform: "scale(0.9)", opacity: "0.8" },
        },
      },
    },
  },
  plugins: [],
}
