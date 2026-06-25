---
title: 简介
description: NomiFun 是什么、适合谁、两种运行形态与当前版本，以及一张主界面总览。
category: 快速上手
order: 1
lang: zh-CN
---

**NomiFun** 是一项完全开源、本地优先的"超级 AI 工作站"。它把多种 AI agent、内置 nomi 引擎、模型 provider、MCP 服务、技能、终端、知识库与远程渠道收拢进同一个本地工作区——数据全在本地，免费商用，接受审计。

真实的 AI 工作流常被拆散在多个终端、浏览器标签与脚本之间。NomiFun 的目标不是再做一个聊天框，而是把这些运行时接到同一个工作区：一个会话入口对接多种 agent、一个模型目录处处复用、后端持久化驱动自动化、桌面与 Web 共用同一套后端。

下面这张主界面就是你日常工作的地方——左侧会话与导航、中间消息流、右侧文件树与预览面板，会话的工作目录、终端与各类能力都围绕它展开。

![NomiFun 主界面 · 会话工作区总览](/images/zh/02会话/会话.png)

## 它适合谁

NomiFun 面向已经在用 agent 做真实工作的用户。它要求你理解 API key、本地数据目录、CLI agent 安装与自托管边界——它不是零配置的 SaaS 聊天产品，而是一套你完全掌控的本地基础设施。

如果你正在多个终端里分别跑不同的 agent、在浏览器里盯着自托管页面、旁边还散落着 MCP 服务与项目脚本，那么把它们收进一个工作区正是 NomiFun 想替你做的事。

## 两种运行形态

一套 Rust 后端 + 一套 React 19 前端，两种宿主：

1. **桌面应用 `nomifun-desktop`**：Tauri 2 外壳，在进程内启动后端、监听随机环回端口，桌面窗口通过每次启动生成的本地信任 token 免登录访问。适合单机工作站、日常开发。开启 WebUI 远程访问后，额外的局域网监听仍要求远程浏览器登录。
2. **Web 服务 `nomifun-web`**：自托管 axum 服务，默认 `127.0.0.1:8787`，同一端口提供 SPA 与 API，**默认需要登录**，首次访问创建管理员。适合 LAN / VPN / VPS 自托管，Docker 与 systemd 部署都走这条路径。

两种形态共用同一份后端与同一份 React SPA，因此功能、界面与文档基本一致，差异主要在启动方式与鉴权边界。

## 你能在这里做什么

进门后的常用入口（侧边栏 / 路由）一览：

- **会话与工作区**：`/guid` 创建会话、`/conversation/:id` 运行会话；可选内置 nomi 或外部 CLI agent，每段会话有独立工作目录、文件树、预览面板与后端管理的 PTY 终端。
- **模型配置**：`/models` 管理 4 个原生 provider（Anthropic、OpenAI 兼容、Amazon Bedrock、Google Vertex）、模型、凭据与全局**故障 failover 队列**（失败 / 限流时最多切换 4 次备用模型）。
- **助手与技能**：`/assistants` 管理助手，`?tab=skills` 管理技能。
- **MCP 与对外能力**：`/mcp` 管理 MCP server，`/open-capabilities` 管理 WebUI 远程访问与对外能力暴露。
- **桌面伙伴**：`/nomi` 管理伙伴形象、远程渠道绑定与 companion 设置；内置 3 个纯代码 SVG 形象（Mochi 麻薯兔 / Ink 墨墨黑猫 / Bolt 波特机器人，默认 Mochi），也可自定义任意形象。
- **终端与自动化**：`/terminal-new`、`/terminal/:id` 运行后端 PTY；`/scheduled` 管理 cron 计划任务；`/requirements` 管理 AutoWork 需求看板。

## 要点与边界

- **共享记忆 + 专属技能**：全体伙伴共享同一条记忆采集 / 学习链路（共享记忆中枢），而技能库按伙伴隔离。按伙伴细分的私有记忆敬请期待。
- **IM 渠道（11+）**：已落地 Telegram、飞书 Lark、钉钉、微信、Slack、Discord、Matrix、Mattermost、Twitch、Nostr、QQ Bot；企业微信 WeCom 在途。
- **完成通知是出站**：任务完成可通过 webhook 出站推送（飞书签名卡 / Slack / HTTP）。把 issue 或 IM 消息**入站转为需求**目前是路线图，敬请期待。
- **知识库来源**：飞书 Feishu 连接器已实现（UI 内创建入口当前关闭）；Notion 来源为路线图，尚未实现。

## 当前版本

NomiFun 当前为 **0.1.0（pre-1.0）**，仍在活跃迭代。脱胎自 [AionUi](https://github.com/iOfficeAI/AionUi) 并大幅重构，以 **Apache-2.0** 许可开源。内置 nomi agent 为独立 CLI 二进制，随应用分发，无需额外安装。

> 本门户只收敛"操作 / 使用"类内容，不重复 GitHub 上的全量技术文档与架构内幕。

## 相关

- [安装](/docs/getting-started/installation) —— 把它跑起来。
- [第一次对话](/docs/getting-started/quick-start) —— 配置模型并完成第一段会话。

完整文档 → [GitHub](https://github.com/nomifun/nomifun-tauri)
