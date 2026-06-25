// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import UnoCSS from 'unocss/astro';

// https://astro.build/config
// zh-CN lives at the root ("/"), en-US lives under "/en".
export default defineConfig({
  site: 'https://www.nomifun.com',
  integrations: [
    UnoCSS({ injectReset: true }),
    react(),
    sitemap(),
  ],
  i18n: {
    defaultLocale: 'zh-CN',
    locales: ['zh-CN', { path: 'en', codes: ['en-US', 'en'] }],
    routing: {
      prefixDefaultLocale: false,
      redirectToDefaultLocale: false,
    },
  },
});
