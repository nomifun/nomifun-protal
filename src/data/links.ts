/**
 * Central place for all outbound links & contact info.
 *
 * Keep public entry points in one place so the portal, docs, footer and
 * structured data all point at the same repositories.
 */

export const links = {
  // The desktop repository is the primary public entry point.
  github: 'https://github.com/nomifun/nomifun-desktop',
  desktopRepo: 'https://github.com/nomifun/nomifun-desktop',
  mobileRepo: 'https://github.com/nomifun/nomifun-mobile',
  xiaozhiRepo: 'https://github.com/nomifun/nomifun-xiaozhi-yuntai',
  // GitHub Releases page (download buttons)
  releases: 'https://github.com/nomifun/nomifun-desktop/releases',
  // GitHub redirect for the latest non-draft, non-prerelease release
  releasesLatest: 'https://github.com/nomifun/nomifun-desktop/releases/latest',
  // GitHub Releases API list; the site picks the newest non-draft item so prereleases can still be shown.
  releasesApi: 'https://api.github.com/repos/nomifun/nomifun-desktop/releases?per_page=10',
  // Direct GitHub latest endpoint, useful for integrations that only want stable latest semantics.
  releasesLatestApi: 'https://api.github.com/repos/nomifun/nomifun-desktop/releases/latest',
  // Official Docker Hub image for nomifun-web
  dockerHub: 'https://hub.docker.com/repository/docker/nomifun/nomifun-web',
  // Baidu Netdisk mirror for users in mainland China
  baiduPan: 'https://pan.baidu.com/s/5GPonoJNrwJ7GciBSDgXLaA',
  // Issues
  issues: 'https://github.com/nomifun/nomifun-desktop/issues',
  // Official website
  website: 'https://www.nomifun.com',
  // Product introduction video (region-aware: Bilibili for mainland China, YouTube for overseas)
  introVideos: {
    'zh-CN': {
      watch: 'https://www.bilibili.com/video/BV1kwKZ6UE5X/',
      embed: 'https://player.bilibili.com/player.html?bvid=BV1kwKZ6UE5X&autoplay=0',
    },
    'en-US': {
      watch: 'https://youtu.be/AsEToBDFR9s',
      embed: 'https://www.youtube-nocookie.com/embed/AsEToBDFR9s?rel=0',
    },
  },
  // Public contact / security email
  email: '535526063@qq.com',
  // Upstream attribution (Apache-2.0)
  aionui: 'https://github.com/iOfficeAI/AionUi',
  license: 'https://www.apache.org/licenses/LICENSE-2.0',
} as const;

/** The public repositories that make up the NomiFun open-source family. */
export const ecosystemRepos = [
  {
    id: 'desktop',
    name: 'NomiFun Desktop',
    url: links.desktopRepo,
    icon: 'i-mdi-monitor-dashboard',
    accent: 'pink',
  },
  {
    id: 'mobile',
    name: 'NomiFun Mobile',
    url: links.mobileRepo,
    icon: 'i-mdi-cellphone-link',
    accent: 'violet',
  },
  {
    id: 'xiaozhi',
    name: 'NomiFun Xiaozhi Yuntai',
    url: links.xiaozhiRepo,
    icon: 'i-mdi-robot-outline',
    accent: 'cyan',
  },
] as const;

export const socialLinks = {
  xiaohongshu: 'https://xhslink.com/m/4x6ti8n6cA1',
  bilibili: 'https://b23.tv/0UhgKDh',
  douyin: 'https://v.douyin.com/MDT5QVdYaJk/',
  youtube: 'https://www.youtube.com/@NomiFun-o2y',
  x: 'https://x.com/colir0',
  tiktok: 'https://www.tiktok.com/@colir0luo',
} as const;

/** Primary community entries rendered before platform-specific social links. */
export const community: { id: string; label: string; url: string; icon: string }[] = [
  { id: 'github', label: 'GitHub', url: links.github, icon: 'i-mdi-github' },
  // { id: 'discord', label: 'Discord', url: '#', icon: 'i-mdi-discord' },
  // { id: 'wechat', label: '微信群', url: '#', icon: 'i-mdi-wechat' },
  // { id: 'telegram', label: 'Telegram', url: '#', icon: 'i-mdi-telegram' },
];

/** Download entry points. Platform buttons all land on GitHub Releases. */
export const downloads = {
  macos: { label: 'macOS', ext: '.dmg', url: links.releases, arch: 'Apple Silicon / Intel' },
  windows: { label: 'Windows', ext: '.exe', url: links.releases, arch: 'x64' },
  linux: { label: 'Linux', ext: '.AppImage / .deb / .rpm', url: links.releases, arch: 'x86_64' },
} as const;

export const meta = {
  status: 'pre-1.0',
  license: 'Apache-2.0',
} as const;
