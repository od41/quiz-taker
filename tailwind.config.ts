const config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    // Ensure custom color classes are always generated
    'bg-nigeria-green',
    'text-nigeria-green',
    'border-nigeria-green',
    'ring-nigeria-green',
    'bg-nigeria-white',
    'text-nigeria-white',
    'bg-nigeria-dark-green',
    'text-nigeria-dark-green',
    'bg-nigeria-light-green',
    'text-nigeria-light-green',
    'bg-gov-background',
    'text-gov-text',
    'text-gov-text-secondary',
    'border-gov-border',
    // Hover and focus variants
    'hover:bg-nigeria-green',
    'hover:text-nigeria-green',
    'hover:border-nigeria-green',
    'focus:ring-nigeria-green',
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