---
title: 简介
description: 认识 NomiFun：跨平台 AI 工作台、会话协作、Skills、设定、语音输入、自动化与桌面伙伴。
category: 快速上手
order: 1
lang: zh-CN
---

**NomiFun** 是一项完全开源、本地优先的超级 AI 工作站。它把 Nomi、Claude Code、Codex、OpenCode 等 Agent，会话与项目、模型、Skills、MCP、知识库、自动化和桌面伙伴放进同一个工作台，让 AI 不只回答问题，也能持续处理真实工作。

![NomiFun 主工作台](/screenshots/current-home-zh.png)

## 核心能力

当前产品表面围绕这些能力组织；具体版本与安装包请以 [GitHub Releases](https://github.com/nomifun/nomifun-tauri/releases/latest) 和应用“关于”页为准：

- **Windows、macOS、Linux 全平台桌面端**：GitHub Releases 提供 Windows x64、macOS Universal，以及 Linux x86_64 的 AppImage、Debian 与 RPM 安装包。
- **Skills 与 Skill Market**：统一管理已安装 Skills，浏览 ClawHub / SkillHub 榜单，查看详情、筛选并在确认后交给 Nomi 安装。
- **可复用设定**：把 Agent、模型、Skills、知识库与提示要求保存为一套设定，创建会话时一键复用。
- **语音输入与本地 ASR**：直接录音转文字；既支持云端语音模型，也支持本地 Whisper 与中文优化的 FunASR。
- **工作台界面**：默认 Rhythm Dark 主题，整理导航与设置结构，侧边栏会提示可用更新；Browser Use 默认打开可见的系统浏览器。
- **OpenClaw 远程控制**：可连接并验证远程 OpenClaw Agent，在新建会话时作为执行后端使用。

## 你可以用它做什么

- **发起会话与项目**：为每项工作选择 Agent、模型、设定、Skills 和工作目录，在消息流中查看执行过程，并用文件树、预览与终端检查产物。
- **多人式协作**：开启协作策略，把复杂目标拆给多个 Agent 并行或按依赖执行；在协作面板查看实时进度、调整计划或处理提问。
- **管理模型与执行引擎**：统一配置模型服务与外部 Agent，设置模型优先级、备用模型和多模态能力。
- **沉淀知识与能力**：把项目资料放进知识库，把可复用流程做成 Skills，再通过设定组合成随时可启动的工作方式。
- **自动处理工作**：使用定时任务、需求平台与 AutoWork，让 NomiFun 在你不盯着界面时继续推进事项。
- **随时访问**：桌面端本地使用，也可启用 WebUI 从同一局域网的手机、平板或另一台电脑访问。

## 适合谁

NomiFun 适合已经在使用 AI Agent 做真实工作，希望把分散的终端、浏览器、模型配置、项目资料和自动任务统一管理的个人与团队。它强调本地掌控和可审计性：应用本身完全免费、无广告、无会员，数据默认保存在你的设备上。

## 下一步

- [安装 NomiFun](/zh/docs/getting-started/installation)
- [完成第一次对话](/zh/docs/getting-started/quick-start)
- [使用 Skills 与技能市场](/zh/docs/guides/mcp-and-skills)
- [创建可复用设定](/zh/docs/guides/assistants)
- [配置语音输入](/zh/docs/guides/voice-input)

完整源码与发布记录 → [GitHub](https://github.com/nomifun/nomifun-tauri)
