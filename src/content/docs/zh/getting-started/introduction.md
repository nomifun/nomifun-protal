---
title: 简介
description: NomiFun 是什么，能为你解决什么问题，以及两种运行形态。
category: 快速上手
order: 1
lang: zh-CN
---

**NomiFun** 是一项完全开源、本地优先的"超级 AI 工作站"。它把多种 AI agent、内置 nomi 引擎、模型 provider、MCP 服务、技能、终端、知识库和远程渠道收拢进同一个本地工作区——数据全在本地，免费商用，接受审计。

真实的 AI 工作流常被拆散在多个终端、浏览器标签与脚本之间。NomiFun 的目标不是再做一个聊天框，而是把这些运行时接到同一个工作区：一个会话入口对接多种 agent、一个模型目录处处复用、后端持久化驱动自动化、桌面与 Web 共用同一套后端。

![NomiFun 引导页](/screenshots/gs-01-introduction-hero.png)

## 它适合谁

NomiFun 面向已经在用 agent 做真实工作的用户。它要求你理解 API key、本地数据目录、CLI agent 安装与自托管边界——它不是零配置的 SaaS 聊天产品，而是一套你完全掌控的本地基础设施。

## 两种运行形态

一套 Rust 后端 + 一套 React 前端，两种宿主：

1. **桌面应用 `nomifun-desktop`**：Tauri 2 外壳，在进程内启动后端、监听随机环回端口，桌面窗口通过每次启动生成的本地信任 token 免登录访问。适合单机工作站、日常开发。
2. **Web 服务 `nomifun-web`**：自托管 axum 服务，默认 `127.0.0.1:8787`，同一端口提供 SPA 与 API，**默认需要登录**。适合 LAN / VPN / VPS 自托管。

## 当前版本

NomiFun 当前为 **0.1.0（pre-1.0）**，仍在活跃迭代。脱胎自 [AionUi](https://github.com/iOfficeAI/AionUi) 并大幅重构，以 **Apache-2.0** 许可开源。

> 本门户只收敛"操作 / 使用"类内容，不重复 GitHub 上的全量技术文档与架构内幕。

## 接下来

1. 读 [安装](/docs/getting-started/installation) 把它跑起来。
2. 读 [第一次对话](/docs/getting-started/quick-start) 完成第一段会话。

完整文档 → [GitHub](https://github.com/nomifun/nomifun)
