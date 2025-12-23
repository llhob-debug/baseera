import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        /* ===== Basira Design Tokens ===== */

        surface: {
          page: {
            light: "var(--surface-page-light)",
            dark: "var(--surface-page-dark)",
          },
          card: {
            light: "var(--surface-card-light)",
            dark: "var(--surface-card-dark)",
          },
          soft: {
            light: "var(--surface-soft-light)",
            dark: "var(--surface-soft-dark)",
          },
        },

        text: {
          primary: {
            light: "var(--text-primary-light)",
            dark: "var(--text-primary-dark)",
          },
          secondary: {
            light: "var(--text-secondary-light)",
            dark: "var(--text-secondary-dark)",
          },
        },

        accent: {
          primary: "var(--accent-primary)",
          success: "var(--accent-success)",
          warning: "var(--accent-warning)",
          danger: "var(--accent-danger)",
        },
      },
    },
  },
  plugins: [],
};

export default config;
