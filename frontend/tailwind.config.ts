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
        brand: {
          primary: "#0052FF",
          primaryHover: "#0044DD",
          background: "#FFFFFF",
          surface: "#F7F8FA",
          card: "#FFFFFF",
          border: "#E5E7EB",
          textPrimary: "#0A0B0D",
          textSecondary: "#5B616E",
          success: "#22C55E",
          warning: "#F59E0B",
          danger: "#EF4444",
        }
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      boxShadow: {
        premium: "0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.025)",
      }
    },
  },
  plugins: [],
};

export default config;
