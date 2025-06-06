import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '100%',
          },
        },
        dark: {
          css: {
            color: '#f3f4f6',
            h1: {
              color: '#f3f4f6',
            },
            h2: {
              color: '#e5e7eb',
            },
            h3: {
              color: '#d1d5db',
            },
            a: {
              color: '#60a5fa',
            },
            strong: {
              color: '#f3f4f6',
            },
            code: {
              color: '#e5e7eb',
            },
            blockquote: {
              color: '#d1d5db',
              borderLeftColor: '#4b5563',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

export default config
