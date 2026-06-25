---
title: 智能值守 · AutoWork
description: 需求看板 + 编排器 + IDMM，无人值守地逐条处理需求并出站通知。
category: 核心操作
order: 4
lang: zh-CN
---

AutoWork 是 NomiFun 的旗舰自动化能力：一块**需求看板**加上一个**编排器**，驱动 AI 智能体（或运行在终端中的 agent CLI）逐条处理需求，无需你全程盯着。你登记需求、按 tag 分组、把 tag 绑定到一个会话，编排器就会按顺序认领、执行并完结它们。

这一切都是**后端权威**的：AutoWork 在进程启动时自动恢复，无论你是否打开 UI 都在运行。租约清扫器每 60 秒重派孤儿任务——崩溃永远不会让任务孤立。

![AutoWork 看板](/screenshots/autowork-03-kanban.png)

## 操作步骤

1. **提交需求**。在 `/requirements` 点"新建需求"，填写标题、tag、内容（当作 ticket 来写：上下文足够 + 清晰的"完成定义"）和 `order_key`（按字典序排队，越小越早）。
2. **绑定一个目标**。打开会话或符合条件的终端（预设 `claude` / `codex`），在头部 AutoWork 控件里选 tag、设可选上限、启用。编排器随即按 `pending → in_progress → done` 轮转。
3. **查看进度**。需求列表 `/requirements`、看板 `/requirements?view=board`、Tag sessions 管理面板 `/requirements/extensions?tab=autowork` 是同一份数据的三个视图。
4. **配置完成通知（出站）**。在"通知" Tab 创建 webhook，把它绑定到 tag。需求进入终态时会**出站**推送一张签名卡片到 **飞书 Lark / Slack / HTTP webhook**。

> 需求入站只能由你在 UI 中登记。从 issue / Slack / Lark **入站转需求 = 敬请期待**；Slack / Lark / HTTP 目前仅作为**出站**完成通知。

## IDMM——让卡顿中的本轮存活

IDMM（智能决策模式）是每会话的监督层，可与 AutoWork 叠加：

- **规则层**（无 LLM）——provider 报错、反复重试、空闲推动、只读权限自动确认等，以确定性策略处理。
- **旁路模型层**——真正的决策卡点升级到一个轻量备用模型来下一步指令，避免会话挂死。

故障值守与决策值守默认关闭；可触发模型 failover 队列（最多 4 次切换）。AutoWork 推动前进，IDMM 让每一轮不至卡死——两者组合才能真正无人值守。

完整文档 → [GitHub](https://github.com/nomifun/nomifun)
