---
title: '让 Agent 的能力可以组合'
description: '从可视化 Agent 设定到 Unified Plugin，以清晰的能力边界组合自己的工作方式。'
publishedAt: '2026-10-02'
category: '开发者设计'
readingTime: '7 分钟'
kind: 'technical'
---

本文依据 2026 年 10 月的开发分支实现梳理，正式安装包的功能以对应版本为准。

资料助手需要搜索和知识库，编码助手需要文件与终端，创作助手需要模型和媒体工具。把全部能力装进每一个 Agent，会让配置和调用越来越难理解。

NomiFun 将 Agent 设定做成可组合的能力配方。用户可以从轻量助手开始，按场景增加需要的模块；开发者也能沿着同一条能力链扩展系统。

## 配置可以看见，边界进入执行

[可视化能力工作区](https://github.com/nomifun/nomifun-desktop/blob/cbbc647d13710f89d675ce540ff79eeb3316f66b/ui/src/renderer/pages/agentSettings/AgentCapabilityWorkspace.tsx)围绕 Module 与 Action 组织能力。设定还包含模型路由、Skill、人格、指令，以及上下文和中间件的组合顺序。

这些配置进入[统一编译器](https://github.com/nomifun/nomifun-desktop/blob/cbbc647d13710f89d675ce540ff79eeb3316f66b/crates/backend/nomifun-agent-kernel/src/compiler.rs)，解析依赖、冲突、资源与实际实现，形成执行用的快照。运行时根据选定范围调用能力，而不是凭一句提示词就取得整个平台的所有工具。工作区、知识库或设备等具体资源还要经过各自的绑定与权限检查。

## 一段会话，可以换一种能力

先整理需求，再切换编码 Agent 继续实施，用户可以留在同一会话里。当前[会话切换界面](https://github.com/nomifun/nomifun-desktop/blob/cbbc647d13710f89d675ce540ff79eeb3316f66b/ui/src/renderer/pages/conversation/components/ChatConversation.tsx)先请求切换预览，显示可用性，再按当前绑定版本提交。

切换可以保留上下文，也可以在条件满足时接续任务。忙碌中的执行、缺失资源或未解决的恢复状态可能阻止切换。旧工具调用不能借新 Agent 的权限继续重放，能力增强因此是一次明确的绑定变更。

不同设定复用[同一个官方 Nomi Runtime](https://github.com/nomifun/nomifun-desktop/blob/cbbc647d13710f89d675ce540ff79eeb3316f66b/crates/backend/nomifun-ai-agent/src/runtime_driver.rs)。模型、工具、事件和恢复走统一合同，Agent 的差异由能力组合表达，减少多套执行循环带来的重复维护。

## 插件可以有界面，也可以只提供能力

Unified Plugin 使用一种包格式：有 UI 时提供 App Surface，有后台逻辑时提供 Service，也可以同时拥有二者。通过对话生成，或从目录、ZIP 导入，都进入同一安装链。

[Service Runtime](https://github.com/nomifun/nomifun-desktop/blob/cbbc647d13710f89d675ce540ff79eeb3316f66b/crates/backend/nomifun-plugin-platform/src/service_runtime.rs)为含 Service 的插件管理独立进程；只有 UI 的插件无需启动 Node 进程。一个插件的 UI 与 Service 共享自己的数据根，持久 KV、SQLite 与文件由[统一存储层](https://github.com/nomifun/nomifun-desktop/blob/cbbc647d13710f89d675ce540ff79eeb3316f66b/crates/backend/nomifun-plugin-platform/src/data_root.rs)管理，预览使用临时数据，预览写入不会合并进正式数据。

## 用 Action 连接真实入口

Action 描述方法及输入、输出，Binding 声明系统在何处使用它。[当前合同](https://github.com/nomifun/nomifun-desktop/blob/cbbc647d13710f89d675ce540ff79eeb3316f66b/crates/backend/nomifun-agent-contracts/src/plugin.rs)包含 Agent 工具、上下文、模型调用前与工具调用前 hook，以及桌面命令、事件等入口。

例如，待办插件可以展示清单，也把「添加待办」提供给 Agent。UI、后台和工具共用一份数据与生命周期；停用或更新时，宿主撤销旧入口。能力组合与插件扩展由此形成同一条可检查的路径，让新增功能能够进入日常工作，也保留清楚的责任边界。
