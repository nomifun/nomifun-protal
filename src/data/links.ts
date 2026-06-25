/**
 * Central place for all outbound links & contact info.
 *
 * The public GitHub repo (github.com/nomifun/nomifun-tauri) and the official
 * website (www.nomifun.com) are confirmed and live. The contact email is the
 * only field still being finalized — it stays marked PLACEHOLDER until the
 * author confirms it. See docs/RESOURCES-TODO.md.
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
