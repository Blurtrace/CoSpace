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
        rausch: {
          DEFAULT: "#ff385c",
          hover: "#e00b41",
          light: "#fff1f3",
          disabled: "#ffd1da",
        },
        ink: {
          DEFAULT: "#222222",
          body: "#3f3f3f",
          muted: "#6a6a6a",
          soft: "#929292",
        },
        hairline: {
          DEFAULT: "#dddddd",
          soft: "#ebebeb",
          strong: "#c1c1c1",
        },
        surface: {
          soft: "#f7f7f7",
          strong: "#f2f2f2",
        },
      },
      borderRadius: {
        card: "14px",
      },
    },
  },
  plugins: [],
};

export default config;
