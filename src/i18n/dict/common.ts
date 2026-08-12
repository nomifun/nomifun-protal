import type { Dict } from '@/i18n';

/** Navigation + footer + globally shared strings. */
export const nav: Dict<{
  home: string;
  docs: string;
  download: string;
  contact: string;
  friends: string;
  github: string;
  cta: string;
}> = {
  'zh-CN': { home: '功能速览', docs: '操作文档', download: '下载', contact: '联系我们', friends: '其他项目', github: 'GitHub', cta: '立即下载' },
  'en-US': { home: 'Overview', docs: 'Docs', download: 'Download', contact: 'Contact', friends: 'Other projects', github: 'GitHub', cta: 'Get NomiFun' },
};

export const brand: Dict<{ name: string; tagline: string }> = {
  'zh-CN': { name: 'NomiFun', tagline: '完全开源 · 本地优先的超级 AI 工作站' },
  'en-US': { name: 'NomiFun', tagline: 'Fully open-source, local-first super AI workstation' },
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
      { label: '功能速览', href: '/' },
      { label: '操作文档', href: '/docs' },
      { label: '下载', href: '/download' },
      { label: '其他项目', href: '/friends' },
      { label: '联系我们', href: '/contact' },
    ],
    resources: [
      { label: 'Desktop GitHub 仓库', href: '#github' },
      { label: 'Mobile / Xiaozhi 项目', href: '/friends' },
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
      { label: 'Overview', href: '/' },
      { label: 'Docs', href: '/docs' },
      { label: 'Download', href: '/download' },
      { label: 'Other projects', href: '/friends' },
      { label: 'Contact', href: '/contact' },
    ],
    resources: [
      { label: 'Desktop GitHub repo', href: '#github' },
      { label: 'Mobile / Xiaozhi projects', href: '/friends' },
      { label: 'Apache-2.0 license', href: '#license' },
    ],
    license: 'Open-source under the Apache License 2.0',
    noWarranty: 'Forks / commercial use are at your own risk; the author and contributors assume no liability.',
    copyright: '© 2025-2026 NomiFun',
  },
};
