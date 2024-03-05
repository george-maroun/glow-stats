import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    fontFamily: {
      'manrope': ['Manrope', 'sans-serif'],
    },
    colors: {
      'beige': '#F9F7EB',
      'black' : '#000000',
      'gray': '#777777',
      'lightGray': 'rbga(230,230,230)',
      // 'beige': '#f7f6f0',
    },
    extend: {
      backgroundImage: {
      },
    },
  },
  plugins: [],
}
export default config
