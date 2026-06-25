import type { Dict } from '@/i18n';

/** A model provider backend or a reachable OpenAI-compatible endpoint. */
export interface Provider {
  id: string;
  name: string;
  /** /providers/<icon>.svg — only when hasLogo is true */
  icon?: string;
  hasLogo: boolean;
}

/**
 * Native provider backends (ProviderType enum, nomi-config):
 * exactly 4 — Anthropic, OpenAI-compatible, Amazon Bedrock, Google Vertex.
 */
export const nativeBackends: Provider[] = [
  { id: 'anthropic', name: 'Anthropic', icon: 'anthropic', hasLogo: true },
  { id: 'openai', name: 'OpenAI 兼容', icon: 'openai', hasLogo: true },
  { id: 'bedrock', name: 'Amazon Bedrock', icon: 'bedrock', hasLogo: true },
  { id: 'vertex', name: 'Google Vertex', hasLogo: false },
];

/**
 * Reachable via the OpenAI-compatible backend + custom base_url.
 * (These are NOT separate native variants — accuracy matters.)
 */
export const compatibleProviders: Provider[] = [
  { id: 'deepseek', name: 'DeepSeek', icon: 'deepseek', hasLogo: true },
  { id: 'gemini', name: 'Gemini', icon: 'gemini', hasLogo: true },
  { id: 'qwen', name: 'Qwen', icon: 'qwen', hasLogo: true },
  { id: 'kimi', name: 'Kimi', icon: 'kimi', hasLogo: true },
  { id: 'mistral', name: 'Mistral', icon: 'mistral', hasLogo: true },
  { id: 'xai', name: 'xAI', icon: 'xai', hasLogo: true },
  { id: 'openrouter', name: 'OpenRouter', icon: 'openrouter', hasLogo: true },
  { id: 'ollama', name: 'Ollama', hasLogo: false },
  { id: 'vllm', name: 'vLLM', hasLogo: false },
  { id: 'azure', name: 'Azure', hasLogo: false },
];

export const providerLabels: Dict<{ native: string; compatible: string; note: string }> = {
  'zh-CN': {
    native: '4 个原生后端',
    compatible: 'OpenAI 兼容可达',
    note: 'OpenAI 兼容后端 + 自定义 base_url，即可接入 DeepSeek / Gemini / Qwen / Kimi / Ollama / vLLM / Azure 等。',
  },
  'en-US': {
    native: '4 native backends',
    compatible: 'Reachable via OpenAI-compatible',
    note: 'The OpenAI-compatible backend + a custom base_url reaches DeepSeek / Gemini / Qwen / Kimi / Ollama / vLLM / Azure and more.',
  },
};
