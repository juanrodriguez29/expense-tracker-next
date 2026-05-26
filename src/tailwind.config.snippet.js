// tailwind.config.js — SmartLedge brand tokens
//
// Merge this into your existing tailwind.config.js so you can write
//   className="bg-indigo text-ink"
// instead of arbitrary values like bg-[#5B4FE9].

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx,html}'],
  theme: {
    extend: {
      colors: {
        // Brand
        indigo: {
          DEFAULT: '#5B4FE9',
          deep:    '#4A3FD0',
        },
        blue: {
          DEFAULT: '#1FAEEC',
          soft:    '#7BD0F4',
          deep:    '#0E8CC5',
        },

        // Surfaces
        bg:           '#FAFBFD',
        surface:      '#FFFFFF',
        'surface-2':  '#F4F6FA',

        // Text
        ink: {
          DEFAULT: '#0F172A',
          soft:    '#475569',
          softer:  '#94A3B8',
        },

        hairline: '#E5E7EB',
      },
      backgroundImage: {
        'brand-gradient':
          'linear-gradient(135deg, #6E5DEF 0%, #4577ED 55%, #1FAEEC 100%)',
      },
      boxShadow: {
        card: '0 28px 56px rgba(15,23,42,0.10), 0 4px 12px rgba(15,23,42,0.04)',
        btn:  '0 6px 16px rgba(91,79,233,0.30)',
        'btn-hover': '0 10px 22px rgba(91,79,233,0.36)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
