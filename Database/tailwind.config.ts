import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          950: "#06111f",
          900: "#0a1628",
          850: "#0f2036",
          800: "#142b46"
        },
        champagne: "#d8bd7a",
        parchment: "#f6f1e8"
      },
      boxShadow: {
        broadcast: "0 24px 80px rgba(0, 0, 0, 0.34)"
      }
    }
  },
  plugins: [require("tailwindcss-animate")]
};

export default config;
