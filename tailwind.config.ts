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
        'nigeria-green': '#008751',
        'nigeria-white': '#ffffff',
        'nigeria-dark-green': '#006640',
        'nigeria-light-green': '#00a75c',
        'gov-text': '#0b0c0c',
        'gov-text-secondary': '#505a5f',
        'gov-background': '#f3f2f1',
        'gov-border': '#b1b4b6',
        'gov-focus': '#fd0',
      },
      fontFamily: {
        'gov': ['"nta"', 'Arial', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
      },
    },
  },
  plugins: [],
};

export default config; 