/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#111827',
          muted: '#4B5563',
          soft: '#6B7280',
        },
        paper: '#FAFAF7',
        rule: '#E5E7EB',
        accent: {
          DEFAULT: '#0F4C75',
          soft: '#3282B8',
        },
        flag: {
          red: '#C8102E',
        },
      },
      fontFamily: {
        sans: ['"Inter"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['"Source Serif 4"', '"Source Serif Pro"', 'Georgia', 'serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(17,24,39,0.04), 0 1px 3px rgba(17,24,39,0.06)',
      },
    },
  },
  plugins: [],
}
