// Build-time Tailwind configuration; migrated from the previous browser CDN setup.
const forms = require('@tailwindcss/forms');

module.exports = {
  content: ['./index.html', './index.tsx', './App.tsx', './pages/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './data/**/*.{ts,tsx}'],
  plugins: [forms],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary": "var(--cobalt-ink, #2555FF)",
        "primary-dark": "#1D44CC",
        "accent": "var(--status-verified, #0D8A62)",
        "paper": "var(--canvas, #F6F5F0)",
        "surface": "var(--surface, #ECEAE3)",
        "surface-highlight": "var(--raised, #E4E2DA)",
        "ink": "var(--fg, #121316)",
        "ink-muted": "var(--muted, #52555E)",
        "ink-border": "var(--rule, rgba(18, 19, 22, 0.12))",
        "white": "#ffffff",
      },
      fontFamily: {
        "display": ["Georgia", "Yu Mincho", "Hiragino Mincho ProN", "Noto Serif CJK JP", "serif"],
        "body": ["-apple-system", "BlinkMacSystemFont", "Hiragino Kaku Gothic ProN", "Yu Gothic", "sans-serif"],
        "mono": ["ui-monospace", "SFMono-Regular", "Menlo", "Consolas", "monospace"],
      },
      borderRadius: {
        "DEFAULT": "2px",
        "lg": "2px",
        "xl": "3px",
        "2xl": "4px",
        "3xl": "4px",
        "full": "9999px"
      },
      boxShadow: {
        'soft': 'none',
        'paper': 'none',
        'paper-lg': 'none',
        'glow': 'none',
        'inner-soft': 'none',
      }
    },
  },
};
