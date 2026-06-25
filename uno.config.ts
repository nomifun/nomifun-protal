import { defineConfig, presetWind3, presetIcons, transformerDirectives } from 'unocss';

export default defineConfig({
  presets: [
    presetWind3(),
    presetIcons({ scale: 1.1, warn: false }),
  ],
  transformers: [transformerDirectives()],
  theme: {
    colors: {
      // Canvas / surfaces (deep charcoal — from the logo background)
      ink: {
        950: '#07060B',
        900: '#0B0A10',
        850: '#131019',
        800: '#1B1822',
        700: '#25222E',
        600: '#322E3C',
      },
      // Warm pink (primary accent — from the logo bowl)
      pink: {
        300: '#FFB3C4',
        400: '#FF9FB4',
        500: '#FF6F91',
        600: '#F0577C',
        700: '#D43E64',
      },
      // Blue-violet (secondary — bridges the in-app theme --brand #7583b2)
      violet: {
        300: '#B5BCD6',
        400: '#A1AACB',
        500: '#7583B2',
        600: '#5C6B9E',
      },
      // Text
      hi: '#F5F3F7',
      mid: '#B8B3C4',
      low: '#7A7488',
      // Semantic
      success: '#34D399',
      warning: '#FBBF24',
      danger: '#FB7185',
      info: '#4D9FFF',
    },
    fontFamily: {
      sans: '"Inter","HarmonyOS Sans SC","PingFang SC","Source Han Sans SC","Microsoft YaHei",system-ui,sans-serif',
      mono: '"JetBrains Mono",ui-monospace,SFMono-Regular,Menlo,monospace',
    },
    borderRadius: {
      '2xl': '16px',
      '3xl': '24px',
    },
  },
  shortcuts: {
    // Layout
    'container-x': 'mx-auto w-full max-w-6xl px-5 sm:px-8',
    'section-y': 'py-16 sm:py-24 lg:py-28',
    // Surfaces
    'card': 'rounded-2xl border border-ink-600/70 bg-ink-800/60 backdrop-blur-sm',
    'card-hover': 'transition-all duration-300 hover:border-pink-500/40 hover:shadow-[0_0_40px_-8px_rgba(255,111,145,0.25)]',
    // Buttons
    'btn': 'inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200 select-none',
    'btn-primary': 'btn bg-gradient-to-br from-pink-400 to-pink-600 text-ink-950 hover:shadow-[0_0_32px_-4px_rgba(255,111,145,0.55)] hover:-translate-y-0.5 px-6 py-3',
    'btn-ghost': 'btn border border-ink-600 text-hi hover:border-violet-400/60 hover:bg-ink-700/50 px-6 py-3',
    // Text helpers
    'text-grad-pink': 'bg-gradient-to-r from-pink-300 via-pink-400 to-pink-500 bg-clip-text text-transparent',
    'eyebrow': 'text-xs font-semibold uppercase tracking-[0.18em] text-pink-400',
  },
});
