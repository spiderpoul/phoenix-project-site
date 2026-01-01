import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}", "./public/admin/index.html"],
  theme: {
    extend: {
      colors: {
        ember: {
          50: "#fff7ed",
          100: "#ffedd5",
          200: "#fed7aa",
          300: "#fdba74",
          400: "#fb923c",
          500: "#f97316",
          600: "#ea580c",
          700: "#c2410c",
          800: "#9a3412",
          900: "#7c2d12"
        },
        flame: {
          500: "#ef4444",
          600: "#dc2626",
          700: "#b91c1c"
        }
      },
      backgroundImage: {
        "phoenix-glow": "radial-gradient(circle at top, rgba(249,115,22,0.35), transparent 60%)",
        "phoenix-gradient": "linear-gradient(135deg, #fb923c, #ef4444, #f97316)"
      }
    }
  },
  plugins: [require("@tailwindcss/typography")]
};

export default config;
