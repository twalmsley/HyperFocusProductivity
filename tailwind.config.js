/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
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
    },
  },
  plugins: [],
} 