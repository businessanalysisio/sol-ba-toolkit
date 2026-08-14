import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
  	extend: {
  		colors: {
        // Values come from the SOL Product Screens design system. Names are kept
        // so the ~180 existing sol-* usages inherit the new identity; `gold` is
        // now the orange accent, `mint` the teal.
        sol: {
          night: '#0a0a0f',
          ink: '#07070b',
          panel: '#101014',
          raised: '#16161b',
          line: 'rgba(242, 239, 233, 0.09)',
          gold: '#ef7d45',
          mint: '#40c4a4',
          coral: '#e5484d',
          violet: '#9d8cf0',
          muted: '#a39e94',
          dim: '#6e6960',
          text: '#d8d4cc',
          fg: '#f2efe9',
          info: '#4c9eeb',
          warn: '#e5c158',
          teal: '#40c4a4',
          special: '#6a51c7',
          // Numeric scale kept for components ported from sol-website, now
          // stepping through the orange accent.
          '100': '#fbe3d5',
          '200': '#f8cdb4',
          '300': '#f5ab86',
          '400': '#f2925f',
          '500': '#ef7d45',
          '600': '#c75f2e',
        },
        ember: '#e5484d',
        night: {
          '700': '#1f1f26',
          '800': '#16161b',
          '900': '#101014',
          '950': '#0a0a0f',
        },
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			},
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			}
  		},
  		fontFamily: {
  			display: ['var(--font-display)', 'Noto Sans', 'Segoe UI', 'sans-serif'],
  			sans: ['var(--font-body)', 'Noto Sans', 'Segoe UI', 'system-ui', 'sans-serif'],
  			mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' }
        },
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		},
  		animation: {
        float: 'float 6s ease-in-out infinite',
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		},
      boxShadow: {
        'sol-glow': '0 24px 80px rgba(0, 0, 0, 0.45), 0 0 40px rgba(246, 199, 107, 0.08)',
      }
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
