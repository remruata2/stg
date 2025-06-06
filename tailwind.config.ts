import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  // Disable dark mode completely
  darkMode: false,
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '100%',
          },
        },
        // Dark typography styles removed to enforce light mode only
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

export default config
