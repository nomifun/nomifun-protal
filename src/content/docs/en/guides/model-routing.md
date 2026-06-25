---
title: Model routing & failover
description: Connect the 4 native provider backends and orchestrate a failover queue of up to 4 switches so a session keeps going when a provider fails or is rate-limited.
category: Models & Decisioning
order: 4
lang: en-US
---

This page covers how to **connect model providers** in NomiFun, set a default model, and orchestrate a **model failover queue**: when a provider temporarily fails or gets rate-limited, a Nomi engine session automatically switches to the next model you've ordered — no babysitting the retry.

> Failover is a **failover queue**, not a multi-credential round-robin pool — it solves reliability, not quota aggregation. It applies only to Nomi engine sessions; ACP / CLI agents make their provider calls inside an external runtime and are out of scope here.

Entry point: the **Models** page in the sidebar (`/models`) manages every provider, model, and the global failover queue.

## Steps

1. **Add a model.** On the Models page, click "Add model", pick a provider type, and fill in the API key, base URL, and default model name. NomiFun ships 4 native provider backends:

   - **Anthropic** (the Claude family)
   - **OpenAI-compatible** — one configuration reaches any compatible endpoint: DeepSeek / Gemini / Qwen / Kimi / Ollama / vLLM / Azure OpenAI and more — just change the base URL and model name
   - **Amazon Bedrock**
   - **Google Vertex**

   ![Add a model: provider / API key / base URL / default model](/images/en/01模型/新增模型.png)

2. **Check the model list.** After saving, return to the list and confirm each provider's status and default model. This is also where you later add, remove, rotate keys, or change defaults.

   ![Configured model list](/images/en/01模型/模型列表.png)

3. **Orchestrate the failover queue.** Open the Failover list in the global model config and order your backup models top to bottom by priority. When a session detects a recoverable provider failure (failure / rate-limit), the runtime switches to the next one **in order** — **up to 4 switches across the whole queue.**

   ![Model failover queue (switches in order on failure / rate-limit)](/images/en/01模型/全局模型配置-故障转移列表.png)

   A common ordering:

   ```text
   primary → cheap backup → stronger backup → human check
   ```

4. **(Optional) Per-session override.** The global queue is the default; an individual session can override it to use a different backup order for a specific task.

## Notes & boundaries

- **Nomi engine sessions only.** This is an in-engine retry strategy. It does not spread load across multiple API keys, and it does not make all CLI / ACP agents share one model pool.
- **Reliability, not quota.** If **every** provider in the queue is down, or the turn's prompt / tool state is itself invalid, failover can't rescue that turn.
- **Works with IDMM.** When IDMM's failure-watch judges a provider failure recoverable and the session has failover enabled, it lets the session retry along this queue. Failure-watch and decision-watch are **off by default**. See [Unattended automation · AutoWork](/docs/guides/autowork).

## The 17 direct ACP agents

Beyond the native providers, NomiFun also connects directly to 17 external agent CLIs (e.g. Claude Code, Codex) over **ACP (Agent Client Protocol)**. They run as separate runtimes in a terminal and you install and configure each one; the built-in **nomi agent** is a bundled CLI binary that needs no extra install.

![ACP agent install & configuration](/images/en/01模型/agent安装配置.png)

> ACP / CLI agents do not participate in the failover queue above — their provider calls happen inside their own external runtime.

## Related

- [Unattended automation · AutoWork](/docs/guides/autowork)
- [MCP & skills](/docs/guides/mcp-and-skills)
- [Channels · super gateway](/docs/guides/channels)

Full docs → [GitHub](https://github.com/nomifun/nomifun-tauri)
