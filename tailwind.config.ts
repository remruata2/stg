import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            maxWidth: "100%",
            p: {
              marginTop: "1em",
              marginBottom: "1em",
            },
          },
        },
        // Dark typography styles removed to enforce light mode only
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
