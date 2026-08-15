import type { Dict } from '@/i18n';

/** Navigation + footer + globally shared strings. */
export const nav: Dict<{
  home: string;
  products: string;
  docs: string;
  download: string;
  contact: string;
  blog: string;
  github: string;
  cta: string;
}> = {
  'zh-CN': { home: '首页', products: '产品', docs: '操作文档', download: '下载', contact: '联系我们', blog: '博客文章', github: 'GitHub', cta: '立即下载' },
  'en-US': { home: 'Home', products: 'Products', docs: 'Docs', download: 'Download', contact: 'Contact', blog: 'Blog', github: 'GitHub', cta: 'Get NomiFun' },
};

export const brand: Dict<{ name: string; tagline: string }> = {
  'zh-CN': { name: 'NomiFun', tagline: 'Desktop · Mobile · 小智云台 · Net Infra，四个关联的开源项目' },
  'en-US': { name: 'NomiFun', tagline: 'Desktop · Mobile · Xiaozhi · Net Infra, four connected open-source projects' },
};

export const footer: Dict<{
  blurb: string;
  productTitle: string;
  resourceTitle: string;
  communityTitle: string;
  links: { label: string; href: string }[];
  resources: { label: string; href: string }[];
  license: string;
  noWarranty: string;
  copyright: string;
}> = {
  'zh-CN': {
    blurb: '数据全在本地 · 免费商用 · 无广告无会员 · 接受审计',
    productTitle: '产品',
    resourceTitle: '资源',
    communityTitle: '社区',
    links: [
      { label: '首页', href: '/' },
      { label: '四个开源项目', href: '/products' },
      { label: 'NomiFun Desktop', href: '/products/desktop' },
      { label: 'NomiFun Mobile', href: '/products/mobile' },
      { label: 'NomiFun 小智云台', href: '/products/xiaozhi-yuntai' },
      { label: 'NomiFun Net Infra', href: '/products/net-infra' },
      { label: '操作文档', href: '/docs' },
      { label: '下载', href: '/download' },
      { label: '博客文章', href: '/blog' },
      { label: '联系我们', href: '/contact' },
    ],
    resources: [
      { label: 'Desktop GitHub 仓库', href: '#github' },
      { label: 'Mobile / Xiaozhi / Net Infra', href: '/products' },
      { label: 'Apache-2.0 许可', href: '#license' },
    ],
    license: '基于 Apache License 2.0 开源',
    noWarranty: '二次开发 / 商用风险由使用者自行承担，作者与贡献者不承担相关法律责任。',
    copyright: '© 2025-2026 NomiFun',
  },
  'en-US': {
    blurb: 'All data local · Free for commercial use · No ads, no membership · Open to audit',
    productTitle: 'Product',
    resourceTitle: 'Resources',
    communityTitle: 'Community',
    links: [
      { label: 'Home', href: '/' },
      { label: 'Four open-source projects', href: '/products' },
      { label: 'NomiFun Desktop', href: '/products/desktop' },
      { label: 'NomiFun Mobile', href: '/products/mobile' },
      { label: 'NomiFun Xiaozhi Yuntai', href: '/products/xiaozhi-yuntai' },
      { label: 'NomiFun Net Infra', href: '/products/net-infra' },
      { label: 'Docs', href: '/docs' },
      { label: 'Download', href: '/download' },
      { label: 'Blog', href: '/blog' },
      { label: 'Contact', href: '/contact' },
    ],
    resources: [
      { label: 'Desktop GitHub repo', href: '#github' },
      { label: 'Mobile / Xiaozhi / Net Infra', href: '/products' },
      { label: 'Apache-2.0 license', href: '#license' },
    ],
    license: 'Open-source under the Apache License 2.0',
    noWarranty: 'Forks / commercial use are at your own risk; the author and contributors assume no liability.',
    copyright: '© 2025-2026 NomiFun',
  },
};
