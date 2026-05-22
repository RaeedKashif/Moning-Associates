/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Royal navy palette - deeper, richer
        navy:     '#06101C',
        navy2:    '#0E1B30',
        navy3:    '#1A2C4A',
        royal:    '#16243F',
        // Gold palette - champagne to deep bronze
        gold:     '#D4A84B',
        goldLt:   '#E8C879',
        goldDk:   '#A07830',
        goldDeep: '#7C5A20',
        champagne:'#F0DDB0',
        // Royal accents
        wine:     '#6B1F2E',
        burgundy: '#4A1424',
        // Neutrals
        cream:    '#FAF4E8',
        cream2:   '#F0E7D5',
        ivory:    '#FBF6EC',
        // Text
        slate:    '#3F4756',
        muted:    '#7F8898',
        wineRed:  '#B22A2A',
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'serif'],
        sans:  ['"DM Sans"', 'system-ui', 'sans-serif'],
        display: ['"Cormorant Garamond"', 'serif'],
      },
      keyframes: {
        ticker: {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(18px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        floatY: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':       { transform: 'translateY(-8px)' },
        },
        floatYLg: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':       { transform: 'translateY(-14px)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        slowSpin: {
          '0%':   { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 22px rgba(212,168,75,0.18)' },
          '50%':       { boxShadow: '0 0 38px rgba(212,168,75,0.42)' },
        },
        kenburns: {
          '0%':   { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.08)' },
        },
        sweep: {
          '0%':   { transform: 'translateX(-100%) skewX(-12deg)' },
          '100%': { transform: 'translateX(220%) skewX(-12deg)' },
        },
        slideDown: {
          '0%':   { opacity: '0', transform: 'translateY(-8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGold: {
          '0%, 100%': { opacity: '0.55' },
          '50%':       { opacity: '1' },
        },
      },
      animation: {
        ticker:    'ticker 32s linear infinite',
        fadeUp:    'fadeUp 0.8s ease both',
        fadeIn:    'fadeIn 1s ease both',
        floatY:    'floatY 5s ease-in-out infinite',
        floatYLg:  'floatYLg 7s ease-in-out infinite',
        shimmer:   'shimmer 3s linear infinite',
        slowSpin:  'slowSpin 28s linear infinite',
        glow:      'glow 3.6s ease-in-out infinite',
        kenburns:  'kenburns 16s ease-in-out infinite alternate',
        sweep:     'sweep 2.6s ease-in-out infinite',
        slideDown: 'slideDown 0.25s ease-out both',
        pulseGold: 'pulseGold 2.6s ease-in-out infinite',
      },
      boxShadow: {
        soft:   '0 16px 40px rgba(0,0,0,0.10)',
        royal:  '0 24px 60px rgba(6,16,28,0.45)',
        gold:   '0 8px 24px rgba(212,168,75,0.35)',
        goldLg: '0 18px 48px rgba(212,168,75,0.28)',
        crest:  '0 2px 0 rgba(212,168,75,0.5), 0 24px 60px rgba(6,16,28,0.6)',
      },
      backgroundImage: {
        'royal-radial':
          'radial-gradient(ellipse at top, rgba(212,168,75,0.10), transparent 55%), radial-gradient(ellipse at bottom right, rgba(107,31,46,0.18), transparent 55%), linear-gradient(180deg, #06101C 0%, #0E1B30 100%)',
        'royal-deep':
          'radial-gradient(ellipse at top, rgba(212,168,75,0.08), transparent 50%), linear-gradient(180deg, #06101C 0%, #0A1424 60%, #06101C 100%)',
        'gold-shimmer':
          'linear-gradient(90deg, #A07830 0%, #E8C879 25%, #D4A84B 50%, #E8C879 75%, #A07830 100%)',
        'crown-pattern':
          "url(\"data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M40 12 L46 22 L58 22 L48 30 L52 42 L40 36 L28 42 L32 30 L22 22 L34 22 Z' fill='none' stroke='%23D4A84B' stroke-width='0.6' opacity='0.18'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
};
