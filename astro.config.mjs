// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import UnoCSS from 'unocss/astro';

// https://astro.build/config
// en-US lives at the root ("/"), zh-CN lives under "/zh".
export default defineConfig({
  site: 'https://www.nomifun.com',
  image: {
    endpoint: { route: '/_image' },
    service: { entrypoint: 'astro/assets/services/sharp', config: {} },
    domains: [],
    remotePatterns: [],
    responsiveStyles: false,
  },
  integrations: [
    UnoCSS({ injectReset: true }),
    react(),
    sitemap({
      // en-US at the root ("/"), zh-CN under "/zh" — emit reciprocal
      // <xhtml:link hreflang> alternates so search engines pair the languages.
      i18n: {
        defaultLocale: 'en',
        locales: { en: 'en', zh: 'zh-CN' },
      },
    }),
  ],
  i18n: {
    defaultLocale: 'en-US',
    locales: ['en-US', { path: 'zh', codes: ['zh-CN', 'zh'] }],
    routing: {
      prefixDefaultLocale: false,
      redirectToDefaultLocale: false,
    },
  },
});
