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
  { id: 'zhipu', name: 'Zhipu / GLM', icon: 'zhipu', hasLogo: true },
  { id: 'stepfun', name: 'StepFun', icon: 'stepfun', hasLogo: true },
  { id: 'volcengine', name: 'Doubao / Volcengine', icon: 'volcengine', hasLogo: true },
  { id: 'mistral', name: 'Mistral', icon: 'mistral', hasLogo: true },
  { id: 'xai', name: 'xAI', icon: 'xai', hasLogo: true },
  { id: 'openrouter', name: 'OpenRouter', icon: 'openrouter', hasLogo: true },
  { id: 'newapi', name: 'New API', icon: 'newapi', hasLogo: true },
  { id: 'modelscope', name: 'ModelScope', icon: 'modelscope', hasLogo: true },
  { id: 'infiniai', name: 'InfiniAI', icon: 'infiniai', hasLogo: true },
  { id: 'novita', name: 'Novita', icon: 'novita', hasLogo: true },
  { id: 'ppio', name: 'PPIO', icon: 'ppio', hasLogo: true },
  { id: 'ollama', name: 'Ollama', hasLogo: false },
  { id: 'vllm', name: 'vLLM', hasLogo: false },
  { id: 'azure', name: 'Azure', hasLogo: false },
];

export const providerLabels: Dict<{ native: string; compatible: string; note: string }> = {
  'zh-CN': {
    native: '4 个原生后端',
    compatible: '26+ 供应商 / 预设可达',
    note: 'OpenAI 兼容后端 + 自定义 base_url，可接入 DeepSeek / Gemini / Qwen / Kimi / GLM / StepFun / 火山 / OpenRouter / New API / Ollama / vLLM / Azure 等。',
  },
  'en-US': {
    native: '4 native backends',
    compatible: '26+ providers / presets reachable',
    note: 'The OpenAI-compatible backend + a custom base_url reaches DeepSeek / Gemini / Qwen / Kimi / GLM / StepFun / Volcengine / OpenRouter / New API / Ollama / vLLM / Azure and more.',
  },
};
