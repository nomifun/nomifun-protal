/**
 * Central place for all outbound links & contact info.
 *
 * NOTE (placeholders): the source repo's git remote is a private IP-hosted Git
 * server, and there is no public GitHub URL, contact email, or community link
 * yet. Everything marked PLACEHOLDER must be replaced by the author — see
 * docs/RESOURCES-TODO.md. The UI renders fine with placeholders.
 */

export const links = {
  // PLACEHOLDER — public GitHub repo URL (most CTAs point here)
  github: 'https://github.com/nomifun/nomifun',
  // PLACEHOLDER — GitHub Releases page (download buttons)
  releases: 'https://github.com/nomifun/nomifun/releases',
  // PLACEHOLDER — issues
  issues: 'https://github.com/nomifun/nomifun/issues',
  // Website (referenced in NOTICE; unverified)
  website: 'https://nomifun.com',
  // PLACEHOLDER — contact / security email
  email: 'hello@nomifun.com',
  // Upstream attribution (Apache-2.0)
  aionui: 'https://github.com/iOfficeAI/AionUi',
  license: 'https://www.apache.org/licenses/LICENSE-2.0',
} as const;

/** PLACEHOLDER community entries — fill in what exists, drop the rest. */
export const community: { id: string; label: string; url: string; icon: string }[] = [
  { id: 'github', label: 'GitHub', url: links.github, icon: 'i-mdi-github' },
  // { id: 'discord', label: 'Discord', url: '#', icon: 'i-mdi-discord' },
  // { id: 'wechat', label: '微信群', url: '#', icon: 'i-mdi-wechat' },
  // { id: 'telegram', label: 'Telegram', url: '#', icon: 'i-mdi-telegram' },
];

/**
 * Download artifacts. Empty `url` => button shows "即将提供 / Coming soon"
 * (the source repo has no official prebuilt installers yet).
 */
export const downloads = {
  macos: { label: 'macOS', ext: '.dmg', url: '', arch: 'Apple Silicon / Intel' },
  windows: { label: 'Windows', ext: '.msi / .exe', url: '', arch: 'x64' },
  linux: { label: 'Linux', ext: '.deb / .AppImage', url: '', arch: 'x64' },
} as const;

export const meta = {
  version: '0.1.0',
  status: 'pre-1.0',
  license: 'Apache-2.0',
} as const;
