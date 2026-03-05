import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "forest-green": "#044110",
        "orange": "#FC401D",
        "mint": "#D0FDDA",
        "off-white": "#FAFAFA",
        "off-black": "#1F1F1F",
        "hertha-blue": "#005CA9",
        "union-red": "#ED1C24",
        "union-iron": "#1D1D1B",
      },
      fontFamily: {
        headline: ["Manuka", "system-ui", "sans-serif"],
        sans: ["Manrope", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
