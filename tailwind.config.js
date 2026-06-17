/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0a0f0a',
        surface: '#111811',
        border: '#1e2e1e',
        green: {
          primary: '#4ade80',
          dim: '#22c55e',
          muted: '#166534',
          faint: '#0f2d1a',
        },
        text: {
          primary: '#e8f5e9',
          secondary: '#9ca3af',
          dim: '#4b5563',
        }
      },
      fontFamily: {
        mono: ['var(--font-mono)', 'monospace'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
