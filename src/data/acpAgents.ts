import type { Dict } from '@/i18n';

export interface AcpAgent {
  id: string;
  name: string;
  /** /providers/<icon>.svg — only when hasLogo is true */
  icon?: string;
  hasLogo: boolean;
}

/**
 * 19 supported external ecosystem agents (ACP builtins plus Nanobot/OpenClaw).
 * NomiFun connects to them over the Agent Client Protocol AND supplies models.
 * `hasLogo` reflects which brand SVGs ship in public/providers.
 */
export const acpAgents: AcpAgent[] = [
  { id: 'claude', name: 'Claude Code', icon: 'claude', hasLogo: true },
  { id: 'codex', name: 'Codex CLI', icon: 'openai', hasLogo: true },
  { id: 'gemini', name: 'Gemini CLI', icon: 'gemini', hasLogo: true },
  { id: 'qwen', name: 'Qwen', icon: 'qwen', hasLogo: true },
  { id: 'droid', name: 'Droid', icon: 'droid', hasLogo: true },
  { id: 'goose', name: 'Goose', icon: 'goose', hasLogo: true },
  { id: 'auggie', name: 'Auggie', icon: 'auggie', hasLogo: true },
  { id: 'hermes', name: 'Hermes', icon: 'hermes', hasLogo: true },
  { id: 'kimi', name: 'Kimi', icon: 'kimi', hasLogo: true },
  { id: 'codebuddy', name: 'CodeBuddy', hasLogo: false },
  { id: 'opencode', name: 'OpenCode', icon: 'opencode', hasLogo: true },
  { id: 'copilot', name: 'Copilot', hasLogo: false },
  { id: 'qoder', name: 'Qoder', hasLogo: false },
  { id: 'vibe', name: 'Vibe', hasLogo: false },
  { id: 'cursor', name: 'Cursor', hasLogo: false },
  { id: 'kiro', name: 'Kiro', hasLogo: false },
  { id: 'snow', name: 'Snow', hasLogo: false },
  { id: 'nanobot', name: 'Nanobot', icon: 'nanobot', hasLogo: true },
  { id: 'openclaw', name: 'OpenClaw', icon: 'openclaw', hasLogo: true },
];

export const acpLabels: Dict<{ title: string; subtitle: string; count: string }> = {
  'zh-CN': {
    title: '直连约 19 个外部生态 Agent',
    subtitle: '不仅自研 nomi agent 可用系统能力，Claude Code、Codex、OpenCode、Nanobot、OpenClaw 等生态 Agent 也能接入，并由 NomiFun 为它们提供模型和本地能力。',
    count: '19 个支持的生态 Agent',
  },
  'en-US': {
    title: '~19 external ecosystem agents',
    subtitle: 'Not just the built-in nomi agent — Claude Code, Codex, OpenCode, Nanobot, OpenClaw, and more can connect, with NomiFun supplying their models and local capabilities.',
    count: '19 supported ecosystem agents',
  },
};
