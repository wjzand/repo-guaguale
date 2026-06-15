/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        mine: {
          bg: '#1a0f0a',
          card: '#2D1810',
          border: '#4a2c1a',
          gold: '#FFD700',
          'gold-dark': '#DAA520',
          copper: '#B87333',
          bronze: '#CD7F32',
        },
        rarity: {
          normal: '#9CA3AF',
          rare: '#3B82F6',
          epic: '#A855F7',
          legendary: '#F59E0B',
        }
      },
      fontFamily: {
        game: ['"Press Start 2P"', 'cursive'],
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'spin-slow': 'spin 3s linear infinite',
        'shake': 'shake 0.5s ease-in-out',
        'flame': 'flame 0.5s ease-in-out infinite alternate',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 5px currentColor, 0 0 10px currentColor' },
          '50%': { boxShadow: '0 0 20px currentColor, 0 0 30px currentColor' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'shake': {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-5px)' },
          '75%': { transform: 'translateX(5px)' },
        },
        'flame': {
          '0%': { transform: 'scaleY(1) scaleX(1)' },
          '100%': { transform: 'scaleY(1.1) scaleX(0.9)' },
        },
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #FFD700 0%, #DAA520 50%, #FFD700 100%)',
        'copper-gradient': 'linear-gradient(135deg, #B87333 0%, #CD7F32 50%, #B87333 100%)',
      },
    },
  },
  plugins: [],
};
