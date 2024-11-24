import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontSize: {
        xxs: "10px",
        xs: "12px",
        s: "14px",
        m: "16px",
        l: "20px",
        xl: "24px",
        xxl: "32px",
      },
    },
  },
  plugins: [],
};
export default config;
