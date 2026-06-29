---
title: 模型路由与故障转移
description: 配置 4 个原生 provider 后端，编排一条最多 4 次切换的故障转移队列，让会话在 provider 故障/限流时自动续命。
category: 模型与决策
order: 4
lang: zh-CN
---

这一页教你在 NomiFun 里**接入模型 provider**、设置默认模型，并编排一条**模型故障转移队列**：当某个 provider 临时故障或限流时，Nomi 引擎会话会按你排好的顺序自动换用备用模型，不必你盯着重试。

> 故障转移是一条**故障转移队列**，不是多凭据轮询池——它解决可靠性，不做额度聚合。它只作用于 Nomi 引擎会话；ACP / CLI 直连 Agent 的 provider 调用发生在外部运行时内部，不在此功能范围内。

入口：侧边栏「模型」（`/models`）页统一管理所有 provider、模型与全局故障转移队列。

## 操作步骤

1. **新增一个模型**。在「模型」页点「新增模型」，选 provider 类型，填 API key、base URL 与默认模型名。NomiFun 提供 4 个原生 provider 后端：

   - **Anthropic**（Claude 系列）
   - **OpenAI 兼容**——一套配置即可接 DeepSeek / Gemini / Qwen / Kimi / Ollama / vLLM / Azure OpenAI 等任意兼容端点，只需改 base URL 与模型名
   - **Amazon Bedrock**
   - **Google Vertex**

   ![新增模型：填 provider / API key / base URL / 默认模型](/images/zh/01模型/新增模型.png)

2. **核对模型列表**。保存后回到列表，确认每个 provider 的状态与默认模型。这里也是你日后增删、改 key、调默认模型的地方。

   ![已配置模型列表](/images/zh/01模型/模型列表.png)

3. **编排故障转移队列**。打开全局模型配置里的「故障转移」列表，按优先级从上到下排好备用模型。当会话检测到可恢复的 provider 故障（失败 / 限流）时，运行时会**按序**切换到下一个——**整条队列最多切换 4 次**。

   ![模型故障 failover 队列（失败 / 限流时按序切换）](/images/zh/01模型/全局模型配置-故障转移列表.png)

   常见排法：

   ```text
   主模型 → 便宜备用 → 更强备用 → 人工检查
   ```

4. **（可选）会话级覆盖**。全局队列是默认值；单个会话可以覆盖它，对特定任务用不同的备用顺序。

## 要点与边界

- **只作用于 Nomi 引擎会话**。这是引擎内部的重试策略，不会把负载分摊到多个 API key，也不会让所有 CLI / ACP Agent 共享同一个模型池。
- **解决可靠性，不解决额度**。如果队列里**所有** provider 都不可用，或本轮的 prompt / 工具状态本身就是无效的，故障转移也救不回这一轮。
- **与 IDMM 协作**。IDMM 的故障值守在判定某次 provider 故障可恢复、且该会话启用了故障转移时，会让会话按这条队列重试。故障值守与决策值守**默认关闭**。详见 [智能值守 · AutoWork](/zh/docs/guides/autowork)。

## 17 个 ACP 直连 Agent

除原生 provider 外，NomiFun 还能通过 **ACP（Agent Client Protocol）** 直连 17 个外部 Agent CLI（如 Claude Code、Codex 等）。它们以独立运行时跑在终端里，由你各自安装与配置；内置的 **nomi agent** 是随附的 CLI 二进制，无需额外安装。

![ACP Agent 安装与配置](/images/zh/01模型/agent安装配置.png)

> ACP / CLI Agent 不参与上面的故障转移队列——它们的 provider 调用在各自的外部运行时里完成。

## 相关

- [智能值守 · AutoWork](/zh/docs/guides/autowork)
- [MCP 与技能](/zh/docs/guides/mcp-and-skills)
- [渠道 · 超级网关](/zh/docs/guides/channels)

完整文档 → [GitHub](https://github.com/nomifun/nomifun-tauri)
