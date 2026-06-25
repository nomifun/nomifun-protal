import type { Dict } from '@/i18n';

export interface AcpAgent {
  id: string;
  name: string;
  /** /providers/<icon>.svg — only when hasLogo is true */
  icon?: string;
  hasLogo: boolean;
}

/**
 * 17 built-in ACP direct-connect agents (SQL-seeded in nomifun-db migrations).
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
  { id: 'opencode', name: 'OpenCode', hasLogo: false },
  { id: 'copilot', name: 'Copilot', hasLogo: false },
  { id: 'qoder', name: 'Qoder', hasLogo: false },
  { id: 'vibe', name: 'Vibe', hasLogo: false },
  { id: 'cursor', name: 'Cursor', hasLogo: false },
  { id: 'kiro', name: 'Kiro', hasLogo: false },
  { id: 'snow', name: 'Snow', hasLogo: false },
];

export const acpLabels: Dict<{ title: string; subtitle: string; count: string }> = {
  'zh-CN': {
    title: 'ACP 协议直连 17+ 主流 Agent',
    subtitle: '不仅自研 nomi agent 可用海量系统能力，Claude Code、Codex 等数十个 Agent 也能直连，并由 NomiFun 为它们提供模型。',
    count: '17 个内置 ACP Agent',
  },
  'en-US': {
    title: 'ACP direct-connect to 17+ leading agents',
    subtitle: 'Not just the built-in nomi agent — Claude Code, Codex and dozens more connect directly, with NomiFun supplying their models.',
    count: '17 built-in ACP agents',
  },
};
