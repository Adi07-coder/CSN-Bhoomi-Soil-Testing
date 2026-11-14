/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  "#e8f5e9",
          100: "#c8e6c9",
          200: "#a5d6a7",
          300: "#81c784",
          400: "#66bb6a",
          500: "#2d7a4f",
          600: "#1a6b3c",
          700: "#145c32",
          800: "#0e4d29",
          900: "#083e20",
        },
        earth: {
          50:  "#fdf8f0",
          100: "#faefd9",
          200: "#f5deb3",
          300: "#e8c98a",
          400: "#d4a855",
          500: "#b8892e",
          600: "#9a6e1f",
          700: "#7c5512",
          800: "#5e3d08",
          900: "#3d2500",
        },
        surface: {
          DEFAULT: "#f9fafb",
          card: "#ffffff",
          border: "#e5e7eb",
          muted: "#6b7280",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Outfit", "Inter", "sans-serif"],
      },
      borderRadius: {
        xl: "0.75rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      boxShadow: {
        card: "0 1px 3px 0 rgba(0,0,0,0.08), 0 1px 2px -1px rgba(0,0,0,0.05)",
        "card-hover": "0 4px 12px 0 rgba(0,0,0,0.10), 0 2px 4px -1px rgba(0,0,0,0.06)",
        "card-elevated": "0 8px 24px 0 rgba(0,0,0,0.10)",
      },
    },
  },
  plugins: [],
}
