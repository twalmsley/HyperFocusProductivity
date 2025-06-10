import type { Config } from 'tailwindcss'

export default {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
    './error.vue'
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        accent: 'var(--color-accent)',
        bg: 'var(--color-bg)',
        'bg-dark': 'var(--color-bg-dark)',
        text: 'var(--color-text)',
        muted: 'var(--color-muted)',
      },
      typography: ({ theme }: { theme: any }) => ({
        DEFAULT: {
          css: {
            'h1, h2, h3, h4, h5, h6': {
              'font-weight': '600',
              'line-height': '1.3',
            },
            h1: {
              'font-size': theme('fontSize.3xl'),
              'margin-top': '1.5rem',
              'margin-bottom': '1rem',
            },
            h2: {
              'font-size': theme('fontSize.2xl'),
              'margin-top': '1.5rem',
              'margin-bottom': '0.75rem',
            },
            h3: {
              'font-size': theme('fontSize.xl'),
              'margin-top': '1.25rem',
              'margin-bottom': '0.5rem',
            },
            h4: {
              'font-size': theme('fontSize.lg'),
              'margin-top': '1.25rem',
              'margin-bottom': '0.5rem',
            },
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
} satisfies Config 