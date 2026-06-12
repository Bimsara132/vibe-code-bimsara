/** @type {import('tailwindcss').Config} */

/** Shadcn semantic palette — values come from `app/globals.css` :root / .dark */
const shadcnColors = {
  background: 'var(--background)',
  foreground: 'var(--foreground)',
  card: 'var(--card)',
  'card-foreground': 'var(--card-foreground)',
  popover: 'var(--popover)',
  'popover-foreground': 'var(--popover-foreground)',
  primary: 'var(--primary)',
  'primary-foreground': 'var(--primary-foreground)',
  secondary: 'var(--secondary)',
  'secondary-foreground': 'var(--secondary-foreground)',
  muted: 'var(--muted)',
  'muted-foreground': 'var(--muted-foreground)',
  accent: 'var(--accent)',
  'accent-foreground': 'var(--accent-foreground)',
  destructive: 'var(--destructive)',
  'destructive-foreground': 'var(--destructive-foreground)',
  border: 'var(--border)',
  input: 'var(--input)',
  ring: 'var(--ring)',
  'chart-1': 'var(--chart-1)',
  'chart-2': 'var(--chart-2)',
  'chart-3': 'var(--chart-3)',
  'chart-4': 'var(--chart-4)',
  'chart-5': 'var(--chart-5)',
  sidebar: 'var(--sidebar)',
  'sidebar-foreground': 'var(--sidebar-foreground)',
  'sidebar-primary': 'var(--sidebar-primary)',
  'sidebar-primary-foreground': 'var(--sidebar-primary-foreground)',
  'sidebar-accent': 'var(--sidebar-accent)',
  'sidebar-accent-foreground': 'var(--sidebar-accent-foreground)',
  'sidebar-border': 'var(--sidebar-border)',
  'sidebar-ring': 'var(--sidebar-ring)',
}

/** Product blues + neutrals — prompt box, toolbar chips, primary CTAs (`bg-ibl`, `text-ibl-soft-border`, …). */
const iblBrand = {
  DEFAULT: '#7284FF',
  hover: '#6474E0',
  strong: '#5568D4',
  /** Primary gray for headings & nav labels (hero copy, sidebar rows). */
  copy: '#6c6d76',
  /** Darker chrome / icon mute (toolbar inactive, etc.). */
  neutral: '#5f5f61',
  soft: '#F5F8FF',
  'soft-hover': '#E8EFFF',
  'soft-border': '#D0E0FF',
  surface: '#FBFBFB',
  indigo: '#7284FF',
  /** Collapsed-rail hover card — title / primary row text (v0 sidebar). */
  'flyout-title': '#646676',
  'flyout-item': '#1f1f20',
}

/** Creation column / agent setup stepper */
const creationColors = {
  'creation-headline': '#717185',
  'creation-step-inactive': '#6f6f76',
  'creation-step-subtitle': '#8b8b92',
  'creation-step-divider': '#E6E6E8',
  'creation-step-ring-border': '#DDDDDF',
}

module.exports = {
  theme: {
    extend: {
      spacing: {
        'sidebar-collapsed': '65px',
        'sidebar-expanded': '255px',
        'app-header': '65px',
        /** Chat textarea — compact rail / embedded contexts (`min-h-prompt-input-compact`). */
        'prompt-input-compact': '36px',
        /** Chat textarea — default home prompt (`min-h-prompt-input-default`). */
        'prompt-input-default': '40px',
      },
      fontSize: {
        'shell-section': ['10px', { lineHeight: '1.25', letterSpacing: '0.05em' }],
        'shell-badge': ['11px', { lineHeight: '1.25' }],
        'shell-meta': ['13px', { lineHeight: '1.25' }],
        'shell-body': ['14px', { lineHeight: '1.43' }],
        'shell-brand': ['18px', { lineHeight: '1.22' }],
        'shell-header-compact': ['12px', { lineHeight: '1.33' }],
        'shell-header': ['14px', { lineHeight: '1.43' }],
      },
      colors: {
        ...shadcnColors,
        ibl: iblBrand,
        ...creationColors,
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        xl: 'calc(var(--radius) + 4px)',
      },
      fontFamily: {
        sans: ['Geist', 'Geist Fallback'],
        mono: ['Geist Mono', 'Geist Mono Fallback'],
      },
    },
  },
}
