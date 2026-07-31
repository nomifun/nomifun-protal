/**
 * Central place for all outbound links & contact info.
 *
 * The public GitHub repo, GitHub Releases download page, official website,
 * and public contact email are confirmed and live. See docs/RESOURCES-TODO.md
 * for optional future channels and assets.
 */

export const links = {
  // Public GitHub repo (most CTAs point here)
  github: 'https://github.com/nomifun/nomifun-tauri',
  // GitHub Releases page (download buttons)
  releases: 'https://github.com/nomifun/nomifun-tauri/releases',
  // Official Docker Hub image for nomifun-web
  dockerHub: 'https://hub.docker.com/repository/docker/nomifun/nomifun-web',
  // Baidu Netdisk mirror for users in mainland China
  baiduPan: 'https://pan.baidu.com/s/5GPonoJNrwJ7GciBSDgXLaA',
  // Issues
  issues: 'https://github.com/nomifun/nomifun-tauri/issues',
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
  version: '0.2.23',
  status: 'pre-1.0',
  license: 'Apache-2.0',
} as const;
