import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        lavender: {
          50: "#F7F5FF",
          100: "#EFEAFF",
          200: "#DDD4FE",
          300: "#C4B2FD",
          400: "#A78BFA",
          500: "#8B5CF6",
          600: "#7C3AED",
          700: "#6D28D9",
          800: "#5B21B6",
          900: "#4C1D95",
        },
        rose: {
          soft: "#FFF0F5",
          blush: "#FDE8EF",
          accent: "#F472B6",
        },
        gold: {
          light: "#FDF4E3",
          DEFAULT: "#D4AF37",
          dark: "#AA820A",
          accent: "#F3E5AB",
        },
        plum: {
          light: "#3B2647",
          DEFAULT: "#23132F",
          dark: "#160B1E",
        }
      },
      fontFamily: {
        heading: ["var(--font-cormorant)", "Georgia", "serif"],
        body: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 3s infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' }
        }
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(139, 92, 246, 0.12)',
        'glass-hover': '0 12px 40px 0 rgba(139, 92, 246, 0.22)',
        'gold-glow': '0 0 25px rgba(212, 175, 55, 0.35)',
        'lavender-glow': '0 0 30px rgba(167, 139, 250, 0.3)',
      }
    },
  },
  plugins: [],
};
export default config;
