/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      /*
       * Every colour resolves to a custom property defined twice in
       * globals.css, under :root and .dark-mode. That is what makes the site
       * toggle work without Tailwind's `dark:` variant, which would follow the
       * OS instead of the toggle.
       */
      colors: {
        canvas: 'var(--bg)',
        raised: 'var(--raised)',
        ink: 'var(--text)',
        dim: 'var(--dim)',
        faint: 'var(--faint)',
        rule: 'var(--rule)',
        accent: 'var(--accent)',
        add: 'var(--add)',
        del: 'var(--del)',
        spine: 'var(--spine)',
      },
      fontFamily: {
        // Both faces come from the `geist` package, self-hosted by next/font.
        sans: ['var(--font-geist-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      maxWidth: {
        prose: '68ch',
      },
    },
  },
  plugins: [],
};
