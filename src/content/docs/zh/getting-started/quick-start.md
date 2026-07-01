---
title: 第一次对话
description: 配置模型、从首页发起第一段会话，并用上会话工作区的消息流、文件树、预览与终端。
category: 快速上手
order: 3
lang: zh-CN
---

这页带你跑通第一段 NomiFun 会话：配好一个模型 provider，从首页发起对话，再在会话工作区里检查产物。开始前请先完成[安装](/zh/docs/getting-started/installation)。

桌面应用（nomifun-desktop）与自托管 Web 服务（nomifun-web）使用同一份 UI，差异主要在鉴权：桌面 WebView 每次启动都通过本地信任 token 免登录；`nomifun-web` 默认监听 `127.0.0.1:8787` 且需要登录。首跑建议直接用内置 **nomi** agent——它是随应用内置的 CLI 二进制，无需另外安装任何外部 CLI，最适合第一次验证。

> 入口提示：模型配置在侧边栏 `/models`，会话从首页 `/guid` 发起，进行中的会话在 `/conversation/:id`。

## 操作步骤

1. **配置一个模型 provider。** 发送第一条消息前，至少要有一个可用模型。打开 `/models`，新增一个原生 provider——Anthropic、OpenAI 兼容、Amazon Bedrock 或 Google Vertex，填写 API key、base URL 与默认模型 id。

   ![新增模型 provider](/images/zh/01模型/新增模型.png)

2. **（可选）配置模型故障 failover 队列。** 需要无人值守长任务时，可在模型设置里编排一条 failover 队列：当某个模型失败、限流或不可用时，引擎会按序切换备用模型，最多切换 4 次后才放弃。首跑可以先跳过，配好一个模型即可。

3. **从首页发起第一段会话。** 回到 `/guid`。首页集中了开始会话所需的几件事：agent 选择、模型选择、助手（预设 persona / system prompt / 技能组合）、工具与工作区，以及输入框。选择内置 **nomi**，选一个刚配好的模型，在输入框里写下第一条提示词，例如：

   > 写一个返回第 n 个斐波那契数的 Python 函数，并附一个小测试。

   按发送。NomiFun 会创建新会话并跳转到 `/conversation/:id`，随后开始流式输出。输入时可用 `@` 引用文件、技能或助手。

   ![从首页发起第一段会话](/images/zh/02会话/会话启动.png)

4. **用上会话工作区。** 每段会话都有独立工作目录。会话页通常包含四块：

   - **消息流**：模型回复、工具调用、文件变更与执行状态。
   - **文件树**：展示本会话工作目录中的文件。
   - **预览面板**：预览代码、Markdown、PDF、Office、HTML 与 diff。
   - **终端**：在会话内启动挂载到工作目录的 PTY 终端。

   可以让 nomi 把刚写的函数落到文件，再在文件树与预览面板里检查结果。

   ![会话工作区：消息流 + 文件树 + 预览 + 终端](/images/zh/02会话/会话.png)

## 要点与边界

- **内置 nomi vs 外部 agent**：内置 nomi 无需外部 CLI，开箱即用。若改用 Claude Code、Codex、Gemini 等外部 agent，仍需在宿主机上自行安装对应 CLI；`/models` 只负责模型凭据与选择，不会替你安装第三方 CLI。
- **记忆与技能的边界**：记忆支持共享 / 按伙伴私有作用域，而**技能库按伙伴隔离**——每个伙伴有自己专属的技能集合。
- **登录差异**：桌面端免登录；Web 端首次访问会引导创建管理员账号，之后需要登录。

## 常见问题

- **第一条消息发不出去？** 多半是还没配模型，或所选 agent 与模型不匹配。回到 `/models` 确认 provider 可用，再回 `/guid` 选中它。
- **想换形象？** NomiFun 内置 3 个纯代码 SVG 桌宠形象（麻薯兔 Mochi / 墨墨黑猫 Ink / 波特机器人 Bolt，默认 Mochi），也支持自定义任意 IP，可在 `/nomi` 里调整。

## 相关

- [MCP 与技能](/zh/docs/guides/mcp-and-skills)
- [助手](/zh/docs/guides/assistants)
- [终端](/zh/docs/guides/terminal)
- [WebUI 远程访问](/zh/docs/guides/webui-remote)
- [Web 服务部署](/zh/docs/getting-started/installation)

完整文档 → [GitHub](https://github.com/nomifun/nomifun-tauri)
