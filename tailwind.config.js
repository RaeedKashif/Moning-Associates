/** @type {import('tailwindcss').Config} */
import typography from '@tailwindcss/typography';

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
      typography: {
        DEFAULT: {
          css: {
            '--tw-prose-body':          '#3F4756',
            '--tw-prose-headings':      '#06101C',
            '--tw-prose-bold':          '#06101C',
            '--tw-prose-links':         '#A07830',
            '--tw-prose-quotes':        '#06101C',
            '--tw-prose-quote-borders': '#D4A84B',
            '--tw-prose-bullets':       '#D4A84B',
            '--tw-prose-counters':      '#A07830',
            '--tw-prose-code':          '#06101C',
            '--tw-prose-hr':            '#D4A84B40',
            maxWidth: 'none',
            lineHeight: '1.7',
            fontSize:   '1.05rem',
            color: '#3F4756',
            h1: {
              fontFamily: '"Cormorant Garamond", serif',
              fontWeight: '600',
              color:      '#06101C',
              lineHeight: '1.1',
              marginBottom: '0.75rem',
            },
            h2: {
              fontFamily:   '"Cormorant Garamond", serif',
              fontWeight:   '600',
              color:        '#06101C',
              fontSize:     '1.85rem',
              lineHeight:   '1.15',
              marginTop:    '2.5rem',
              marginBottom: '0.85rem',
            },
            h3: {
              fontFamily:   '"Cormorant Garamond", serif',
              fontWeight:   '600',
              color:        '#06101C',
              fontSize:     '1.4rem',
              lineHeight:   '1.2',
              marginTop:    '2rem',
              marginBottom: '0.65rem',
            },
            h4: {
              fontFamily:   '"Cormorant Garamond", serif',
              fontWeight:   '600',
              color:        '#06101C',
              marginTop:    '1.5rem',
              marginBottom: '0.5rem',
            },
            p: {
              marginBottom: '1.4rem',
              lineHeight:   '1.7',
            },
            strong: {
              color:      '#06101C',
              fontWeight: '600',
            },
            blockquote: {
              borderLeftColor:   '#D4A84B',
              borderLeftWidth:   '4px',
              backgroundColor:   'rgba(212,168,75,0.07)',
              borderRadius:      '0 0.75rem 0.75rem 0',
              padding:           '1.25rem 1.5rem',
              fontStyle:         'italic',
              fontFamily:        '"Cormorant Garamond", serif',
              color:             '#06101C',
              fontSize:          '1.15rem',
              lineHeight:        '1.7',
              marginTop:         '1.75rem',
              marginBottom:      '1.75rem',
            },
            'blockquote p': {
              margin: '0',
            },
            'blockquote p:first-of-type::before': { content: 'none' },
            'blockquote p:last-of-type::after':   { content: 'none' },
            ul: {
              paddingLeft:  '1.4rem',
              marginTop:    '1rem',
              marginBottom: '1rem',
            },
            'ul > li': {
              paddingLeft:  '0.5rem',
              marginTop:    '0.5rem',
              marginBottom: '0.5rem',
            },
            'ul > li::marker': {
              color: '#D4A84B',
            },
            ol: {
              paddingLeft:  '1.4rem',
              marginTop:    '1rem',
              marginBottom: '1rem',
            },
            'ol > li::marker': {
              color: '#A07830',
              fontWeight: '600',
            },
            a: {
              color:          '#A07830',
              textDecoration: 'underline',
              fontWeight:     '500',
              '&:hover': { color: '#D4A84B' },
            },
            hr: {
              borderColor: 'rgba(212,168,75,0.25)',
              marginTop:    '2rem',
              marginBottom: '2rem',
            },
            img: {
              borderRadius: '0.75rem',
              marginTop:    '1.5rem',
              marginBottom: '1.5rem',
            },
            code: {
              color:           '#06101C',
              backgroundColor: 'rgba(212,168,75,0.12)',
              borderRadius:    '0.25rem',
              padding:         '0.15em 0.4em',
              fontWeight:      '500',
            },
            'code::before': { content: 'none' },
            'code::after':  { content: 'none' },
          },
        },
      },
    },
  },
  plugins: [typography],
};
