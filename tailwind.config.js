/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // WhatsApp / Natural Green Theme Palette
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a', // emerald / natural green
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        // Complete override of indigo with natural green/teal so no old color can ever show
        indigo: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        whatsapp: {
          light: '#25D366',   // WhatsApp Vibrant Green
          teal: '#128C7E',    // WhatsApp Teal Green
          dark: '#075E54',    // WhatsApp Deep Green
          web: '#00a884',     // WhatsApp Web Header Green
          bg: '#EFEAE2',      // WhatsApp Soft Chat Bg
          chatBg: '#dcf8c6',  // WhatsApp Sent Message Tint
          darkBg: '#111b21',  // WhatsApp Dark Mode Background
        },
        brand: {
          green: '#128C7E',
          accent: '#25D366',
          blue: '#0284c7',
          amber: '#f59e0b',
          rose: '#e11d48',
          purple: '#7c3aed',
        }
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(18, 140, 126, 0.08)',
        'glass-dark': '0 8px 32px 0 rgba(0, 0, 0, 0.4)',
        'whatsapp': '0 4px 20px -2px rgba(18, 140, 126, 0.25)',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-subtle': 'pulseSubtle 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        }
      }
    },
  },
  plugins: [],
}
