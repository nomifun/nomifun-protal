---
title: 第一次对话
description: 配置模型、创建第一段会话、用上会话工作区。
category: 快速上手
order: 3
lang: zh-CN
---

这页带你完成第一段 NomiFun 会话。桌面应用与 Web 服务使用同一份 UI，差异主要在鉴权：桌面 WebView 通过本地信任 token 免登录，`nomifun-web` 需要登录。开始前请先完成[安装](/docs/getting-started/installation)。

![首次启动管理员设置（仅 Web）](/screenshots/gs-04-quickstart-login.png)

## 操作步骤

1. **启动并进入首页**。登录后默认进入 `/guid`。这里集中了开始会话所需的几件事：agent 选择、模型选择、助手、工具与工作区、输入框。

   ![guid 首页](/screenshots/gs-05-quickstart-guid.png)

2. **配置模型**。打开 `/models`，至少添加一个可用 provider——Anthropic、OpenAI 兼容、Amazon Bedrock 或 Google Vertex，填写 API key、base URL 与默认模型。需要无人值守长任务时，可配置**模型故障 failover 队列**，让引擎在失败 / 限流时按序切换备用模型。

   ![模型设置](/screenshots/gs-06-quickstart-model-settings.png)

3. **创建第一段会话**。回到 `/guid`，选择内置 **nomi**（无需外部 CLI，最适合首跑验证），选一个已配置的模型，输入提示词如"写一个返回第 n 个斐波那契数的 Python 函数并附测试"，发送。

   ![会话回复](/screenshots/gs-07-quickstart-first-reply.png)

4. **用上会话工作区**。每段会话都有独立工作目录，会话页包含消息流、文件树、预览面板（代码 / Markdown / PDF / Office / HTML / diff）和挂载到工作目录的 PTY 终端。

## 常用入口

- `/assistants`：管理助手；`?tab=skills` 管理技能。
- `/mcp`：管理 MCP server。
- `/open-capabilities`：WebUI 远程访问与对外能力暴露。
- `/requirements`：AutoWork 需求看板。
- `/nomi`：伙伴、远程渠道绑定与 companion 设置。

完整文档 → [GitHub](https://github.com/nomifun/nomifun)
