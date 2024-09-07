import type { Config } from 'tailwindcss'

const config: Config = {
    darkMode: ['class'],
    content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
  	fontFamily: {
  		manrope: ['Manrope', 'sans-serif']
  	},
  	colors: {
  		beige: '#F9F7EB',
  		black: '#000000',
  		gray: '#777777',
  		lightGray: 'rbga(230,230,230)'
  	},
  	extend: {
  		backgroundImage: {},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		colors: {}
  	}
  },
  plugins: [require("tailwindcss-animate")],
}
export default config
