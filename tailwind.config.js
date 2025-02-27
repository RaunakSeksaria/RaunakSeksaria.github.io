/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Poppins', 'ui-sans-serif', 'system-ui'],
        'lato': ['Lato', 'sans-serif'],
        'roboto-mono': ['Roboto Mono', 'monospace'],
        'dancing-script': ['"Dancing Script"', 'cursive'],
        'courier-new': ['"Courier New"', 'monospace'],
        'fira-code': ['"Fira Code"', 'monospace'],
      },
      colors: {
        primary: 'var(--accentColor)',
        'primary-light': 'var(--accentColorLight)',
        'primary-dark': 'var(--accentColorDark)',
      },
      animation: {
        fadeIn: 'fadeIn 1s ease-out forwards',
        slideInLeft: 'slideInFromLeft 1s ease-out forwards',
        slideInRight: 'slideInFromRight 1s ease-out forwards',
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}

