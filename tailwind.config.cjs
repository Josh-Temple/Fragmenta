// Build-time Tailwind configuration; migrated from the previous browser CDN setup.
const forms = require('@tailwindcss/forms');

module.exports = {
  content: ['./index.html', './index.tsx', './App.tsx', './pages/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './data/**/*.{ts,tsx}'],
  plugins: [forms],
  darkMode: "class",
            theme: {
                extend: {
                    colors: {
                        // Unified "Warm Paper" Palette
                        "primary": "rgb(205, 133, 63)",    // Warm Brown / Gold
                        "primary-dark": "rgb(160, 82, 45)",
                        "accent": "rgb(102, 205, 170)",    // Muted Teal
                        "paper": "rgb(250, 240, 230)",     // Main Background
                        "surface": "rgb(230, 215, 177)",   // Cards / Inputs
                        "surface-highlight": "rgba(255, 255, 255, 0.4)",
                        "ink": "rgb(51, 34, 0)",           // Main Text
                        "ink-muted": "rgba(51, 34, 0, 0.75)",
                        "ink-border": "rgba(51, 34, 0, 0.1)",
                        "white": "#ffffff",
                    },
                    fontFamily: {
                        "display": ["Space Grotesk", "sans-serif"],
                        "body": ["Manrope", "sans-serif"],
                        "mono": ["Courier New", "monospace"],
                    },
                    borderRadius: {
                        "DEFAULT": "0.25rem",
                        "lg": "0.5rem",
                        "xl": "0.75rem",
                        "2xl": "1rem",
                        "3xl": "1.5rem",
                        "full": "9999px"
                    },
                    boxShadow: {
                        'soft': '0 4px 20px -5px rgba(51, 34, 0, 0.05)',
                        'paper': '0 2px 8px -2px rgba(51, 34, 0, 0.1)',
                        'paper-lg': '0 10px 25px -3px rgba(51, 34, 0, 0.1), 0 4px 6px -2px rgba(51, 34, 0, 0.05)',
                        'glow': '0 0 15px rgba(205, 133, 63, 0.2)',
                        'inner-soft': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
                    }
                },
            },
        
};
