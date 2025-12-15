/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  mode: 'jit',
  safelist: [
    // Always include these critical classes for production
    {
      pattern: /^(bg|text|border)-(red|green|blue|yellow|purple|pink|gray|white|black)-(50|100|200|300|400|500|600|700|800|900)$/,
      variants: ['hover', 'focus', 'active'],
    },
    {
      pattern: /^(bg|from|to|via)-gradient-/,
    },
    {
      pattern: /^animate-/,
    },
    {
      pattern: /^(hover|focus|active):/,
    },
    // Force include all Ethiopian colors
    'bg-ethiopian-green',
    'bg-ethiopian-blue', 
    'bg-ethiopian-yellow',
    'bg-ethiopian-red',
    'text-ethiopian-green',
    'text-ethiopian-blue',
    'text-ethiopian-yellow',
    'text-ethiopian-red',
    'border-ethiopian-green',
    'border-ethiopian-blue',
    // Force include common utility classes
    'min-h-screen',
    'max-w-7xl',
    'mx-auto',
    'px-4',
    'py-2',
    'py-4',
    'rounded-lg',
    'rounded-xl',
    'shadow-lg',
    'shadow-xl',
    'flex',
    'items-center',
    'justify-center',
    'space-x-4',
    'space-y-4',
    'grid',
    'grid-cols-1',
    'md:grid-cols-2',
    'lg:grid-cols-3',
  ],
  theme: {
    extend: {
      colors: {
        ethiopian: {
          green: '#009639',
          yellow: '#FFCD00',
          red: '#DA020E',
          blue: '#0F4C75',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'float': 'float 3s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'gradient': 'gradient-shift 3s ease infinite',
        'shake': 'shake 0.5s ease-in-out',
        'bounce-in': 'bounce-in 0.6s ease-out',
        'glow': 'glow 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px) scale(0.95)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)' },
          '50%': { boxShadow: '0 0 30px rgba(59, 130, 246, 0.6)' },
        },
        'gradient-shift': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-5px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(5px)' },
        },
        'bounce-in': {
          '0%': { transform: 'scale(0.3) rotate(-10deg)', opacity: '0' },
          '50%': { transform: 'scale(1.05) rotate(5deg)' },
          '70%': { transform: 'scale(0.9) rotate(-2deg)' },
          '100%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 15px rgba(59, 130, 246, 0.4)' },
          '50%': { boxShadow: '0 0 25px rgba(59, 130, 246, 0.8), 0 0 35px rgba(147, 51, 234, 0.4)' },
        },
      },
    },
  },
  plugins: [],
}