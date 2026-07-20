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
      },
    },
  },
  plugins: [],
}
