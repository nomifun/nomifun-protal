import { defineConfig, presetWind3, presetIcons, transformerDirectives } from 'unocss';

const cssRgb = (name: string) => `rgb(var(--color-${name}) / <alpha-value>)`;

export default defineConfig({
  presets: [
    presetWind3(),
    presetIcons({ scale: 1.1, warn: false }),
  ],
  transformers: [transformerDirectives()],
  theme: {
    colors: {
      // Canvas / surfaces. Values are CSS variables so theme switching can
      // preserve the current dark theme and add a light theme without UI forks.
      ink: {
        950: cssRgb('ink-950'),
        900: cssRgb('ink-900'),
        850: cssRgb('ink-850'),
        800: cssRgb('ink-800'),
        700: cssRgb('ink-700'),
        600: cssRgb('ink-600'),
      },
      // Warm pink (primary accent — from the logo bowl)
      pink: {
        300: cssRgb('pink-300'),
        400: cssRgb('pink-400'),
        500: cssRgb('pink-500'),
        600: cssRgb('pink-600'),
        700: cssRgb('pink-700'),
      },
      // Blue-violet (secondary — bridges the in-app theme --brand #7583b2)
      violet: {
        300: cssRgb('violet-300'),
        400: cssRgb('violet-400'),
        500: cssRgb('violet-500'),
        600: cssRgb('violet-600'),
      },
      // Text
      hi: cssRgb('text-hi'),
      mid: cssRgb('text-mid'),
      low: cssRgb('text-low'),
      // Semantic
      success: cssRgb('success'),
      warning: cssRgb('warning'),
      danger: cssRgb('danger'),
      info: cssRgb('info'),
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
    'card-hover': 'transition-all duration-300 hover:border-pink-500/40 hover:shadow-[0_0_40px_-8px_var(--glow-pink-soft)]',
    // Buttons
    'btn': 'inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200 select-none',
    'btn-primary': 'btn bg-gradient-to-br from-pink-400 to-pink-600 text-[var(--on-accent)] hover:shadow-[0_0_32px_-4px_var(--glow-pink-strong)] hover:-translate-y-0.5 px-6 py-3',
    'btn-ghost': 'btn border border-ink-600 text-hi hover:border-violet-400/60 hover:bg-ink-700/50 px-6 py-3',
    // Text helpers
    'text-grad-pink': 'bg-gradient-to-r from-pink-300 via-pink-400 to-pink-500 bg-clip-text text-transparent',
    'eyebrow': 'text-xs font-semibold uppercase tracking-[0.18em] text-pink-400',
  },
});
