import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "node_modules/antd/dist/antd.min.css",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config;
