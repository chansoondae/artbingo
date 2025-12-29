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
        'bg-primary': '#F5847A',
        'bg-card': '#FFFFFF',
        'text-primary': '#333333',
        'text-secondary': '#666666',
        'accent': '#FFD700',
        'stamp-color': '#E53935',
      },
    },
  },
  plugins: [],
};
export default config;
