/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Warm neutrals
        'cream': '#faf8f6',
        'charcoal': '#2a2620',
        'taupe': '#8b8680',
        // Accent color - deep teal
        'teal': {
          50: '#f0fdfb',
          100: '#d4faf6',
          200: '#a8f5f0',
          300: '#7ceae5',
          400: '#50dfd9',
          500: '#24d4ce',
          600: '#1ab5b2',
          700: '#169591',
          800: '#167575',
          900: '#155a5a',
        },
        // Category colors
        'shopping': '#f59e0b',    // amber
        'travel': '#0ea5e9',      // sky
        'contact': '#a855f7',     // violet
        'note': '#ec4899',        // rose
        'task': '#10b981',        // emerald
        'other': '#64748b',       // slate
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'card': '0.75rem',
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
      },
    },
  },
  plugins: [],
}
