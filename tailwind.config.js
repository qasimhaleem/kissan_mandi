/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Strict KissanMandi Palette: Light Green, Dark Green (contrast/hover), White, Cream
        'km-green': {
          50: '#F2FAF4',
          100: '#E3F4E7',
          200: '#C5E8CE',
          300: '#8FD19E', // Primary Light Green
          400: '#6DBE82', // Medium Primary Hover
          500: '#499F61',
          600: '#2E7D47', // Accessible Dark Green
          700: '#236238', // Deep Forest Button/Text
          800: '#1B4B2B', // Dark Green Hover
          900: '#13361F',
        },
        'km-cream': {
          50: '#FDFBF7',
          100: '#FAF6EA', // Page Canvas Cream
          200: '#F2EAD6', // Elevated Cream Section
          300: '#E5D9BE', // Soft Cream Border
        },
        'km-ink': {
          DEFAULT: '#1D2B22', // High-contrast Deep Green-Charcoal
          muted: '#425649',   // WCAG AA Secondary Body Copy
          subtle: '#5B6E61',  // WCAG AA Captions & Metadata
        },
        // Backwards-compatible aliases
        'primary-green': '#8FD19E',
        'primary-hover': '#6DBE82',
        cream: '#FAF6EA',
        dark: '#1D2B22',
      },
      fontFamily: {
        heading: ['var(--font-gt-america)', 'var(--font-heading)', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        sans: ['var(--font-gt-america)', 'var(--font-body)', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['var(--font-mono)', 'SFMono-Regular', 'Menlo', 'monospace'],
        accent: ['Georgia', 'serif'],
      },
      fontSize: {
        'hero': [
          'clamp(2.5rem, 4.4vw + 1rem, 4.25rem)',
          { lineHeight: '1.1', letterSpacing: '-0.025em', fontWeight: '800' },
        ],
        'h2': [
          'clamp(1.75rem, 2.4vw + 0.75rem, 2.75rem)',
          { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '700' },
        ],
        'h3': [
          'clamp(1.25rem, 0.9vw + 0.95rem, 1.5rem)',
          { lineHeight: '1.3', letterSpacing: '-0.015em', fontWeight: '600' },
        ],
        'body-fluid': [
          'clamp(1rem, 0.25vw + 0.92rem, 1.125rem)',
          { lineHeight: '1.65', fontWeight: '400' },
        ],
        'caption': [
          '0.875rem',
          { lineHeight: '1.45', fontWeight: '500' },
        ],
        'stat': [
          'clamp(1.75rem, 2vw + 1rem, 2.5rem)',
          { lineHeight: '1.1', letterSpacing: '-0.025em', fontWeight: '800' },
        ],
      },
      borderRadius: {
        'xl': '0.875rem',
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      },
      boxShadow: {
        'km-sm': '0 1px 2px 0 rgba(29, 43, 34, 0.05), 0 1px 3px 0 rgba(29, 43, 34, 0.04)',
        'km-md': '0 4px 16px -2px rgba(29, 43, 34, 0.07), 0 2px 6px -1px rgba(29, 43, 34, 0.04)',
        'km-lg': '0 12px 32px -4px rgba(29, 43, 34, 0.10), 0 4px 12px -2px rgba(29, 43, 34, 0.05)',
        'km-card': '0 2px 10px -2px rgba(35, 98, 56, 0.06), 0 0 0 1px rgba(35, 98, 56, 0.07)',
      },
      keyframes: {
        pageEnter: {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        'page-enter': 'pageEnter 0.28s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-up': 'fadeUp 0.55s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        shimmer: 'shimmer 1.5s infinite',
      },
    },
  },
  plugins: [],
};
