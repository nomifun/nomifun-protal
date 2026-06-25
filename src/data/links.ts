/**
 * Central place for all outbound links & contact info.
 *
 * The public GitHub repo, GitHub Releases download page, and official website
 * are confirmed and live. The contact email is the only field still being
 * finalized — it stays marked PLACEHOLDER until the author confirms it. See
 * docs/RESOURCES-TODO.md.
 */

export const links = {
  // Public GitHub repo (most CTAs point here)
  github: 'https://github.com/nomifun/nomifun-tauri',
  // GitHub Releases page (download buttons)
  releases: 'https://github.com/nomifun/nomifun-tauri/releases',
  // Issues
  issues: 'https://github.com/nomifun/nomifun-tauri/issues',
  // Official website
  website: 'https://www.nomifun.com',
  // PLACEHOLDER — contact / security email (not yet confirmed)
  email: 'hello@nomifun.com',
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
  windows: { label: 'Windows', ext: '.msi / .exe', url: links.releases, arch: 'x64' },
  linux: { label: 'Linux', ext: '.deb / .AppImage', url: links.releases, arch: 'x64' },
} as const;

export const meta = {
  version: '0.1.0',
  status: 'pre-1.0',
  license: 'Apache-2.0',
} as const;
