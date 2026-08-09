/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: ["class"],
  theme: {
    extend: {
      colors: {
        bg: "var(--color-bg)",
        surface: "var(--color-surface)",
        surfaceAlt: "var(--color-surface-alt)",
        primary: "var(--color-primary)",
        primaryAlt: "var(--color-primary-alt)",
        accent: "var(--color-accent)",
        text: "var(--color-text)",
        textMuted: "var(--color-text-muted)",
        border: "var(--color-border)",
      },
      fontFamily: {
        display: ["'Clash Display'", "'Space Grotesk'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      boxShadow: {
        glow: "0 0 40px var(--color-glow)",
      },
    },
  },
  plugins: [],
};
