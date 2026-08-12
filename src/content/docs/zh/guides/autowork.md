---
title: 需求平台与 AutoWork
description: 登记需求、按 tag 绑定会话/终端，让编排器无人值守地逐条执行，并出站推送完成通知。
category: 自动化
order: 14
lang: zh-CN
---

需求平台是 NomiFun 的旗舰自动化能力：一块**需求看板**加上一个**编排器**，驱动 AI 智能体（或运行在终端中的 agent CLI）逐条处理需求，无需你全程盯着。你登记需求、按 tag 分组、把 tag 绑定到一个会话或终端，编排器就会按顺序认领、执行并完结它们。

这一切都是**后端权威**的：AutoWork 在进程启动时自动恢复，无论你是否打开 UI 都在运行。

> **入口**：左侧边栏「需求平台」，路由 `/requirements`。扩展能力（绑定管理、完成通知）在 `/requirements/extensions`。

## 先理解几个概念

- **需求（Requirement）**：一个工作单元——标题、内容（交给智能体的实际指令）、tag、`order_key`（按字典序排队的字符串）以及状态。
- **Tag**：任意字符串，把需求归入一个队列。绑定、看板列、通知路由都以 tag 为键。
- **状态**：`Pending → InProgress → Done`（或 `Failed` / `NeedsReview`）。看板每个状态对应一列。
- **编排器**：每个绑定一条常驻循环——认领该 tag 中 `order_key` 最小的 `Pending` 需求 → 注入指令 → 等待回合完成 → 完结 → 重复。队列空了就空闲等待，不退出。

## 操作步骤

### 1. 提交一条需求

在 `/requirements` 点「新增需求」。把内容当作 ticket 来写：上下文足够让智能体不必反问就能开工，并附上清晰的「完成定义」。`order_key` 按字典序排队（如 `1.0`、`1.1`、`1.2.0`），值越小越早执行。

![新增需求](/images/zh/05需求平台/新增需求.png)

提交后该行进入队列。若已有会话绑定到该 tag，它会立刻被唤醒并开始处理（前提是没有别的需求排在它前面）。

### 2. 查看需求列表与看板

需求列表是一张扁平表格，可按 tag、状态或全文过滤、批量删除。点击行打开详情抽屉。

![需求平台列表](/images/zh/05需求平台/需求平台列表.png)

还没有任何需求时是空态——从这里直接「新增需求」即可起步。

![需求平台（空态）](/images/zh/05需求平台/需求平台列表-空.png)

切到看板视图（`/requirements?view=board`）后，所选 tag 的每个状态占一列，跟随编排器实时刷新。看板**不通过拖拽改状态**，请用详情抽屉操作。

### 3. 绑定一个目标：会话或终端

一条绑定形如 `(目标类型, 目标 id, tag, 可选上限)`。目标有两种：

- **会话目标**：打开任意会话（内置 nomi 或任意 ACP 直连 Agent 均可），在头部 **AutoWork** 控件选 tag、设可选完成上限、启用。每一轮编排器认领下一条需求，构造一段对用户隐藏的注入指令，等待回合干净结束后记为 `Done`。
- **终端目标**：打开预设为 `claude` 或 `codex` 的终端（普通 shell、Gemini 暂不符合条件），头部会出现同一个 AutoWork 控件。绑定 tag 并启用即可。终端以「输出静默即完成」判定回合收尾。

> **强烈推荐 Full Auto。** 一旦回合撞到交互式批准提示，会一直阻塞到超时。每个 agent CLI 都有非交互式开关，终端的 Full Auto 模式会替你加上（参见 [终端](/zh/docs/guides/terminal)）。

绑定后编排器即按 `Pending → InProgress → Done/Failed/NeedsReview` 轮转，按 tag 单循环顺序执行。

### 4. 配置完成通知（出站 webhook）

进入**需求平台 → 扩展能力 → 通知**（`/requirements/extensions?tab=notify`），先创建一个完成通知 webhook。

![完成通知 webhook 列表](/images/zh/05需求平台/需求平台webhook.png)

点「新增 webhook」，支持三种目标：**飞书 Lark 签名卡片 / Slack / 通用 HTTP**。填写名称、URL，以及可选的签名 secret（Lark 自定义机器人按 `HMAC-SHA256` 标准方案签名）。点 **Test** 先发一张卡片验证可达。

![新增完成通知 webhook（Lark / Slack / HTTP）](/images/zh/05需求平台/新增webhook.png)

创建后回到通知 tab，为目标 tag 从下拉框选定 webhook。需求进入终态时，编排器会**出站**推送一张卡片，字段含需求 id、需求名、需求内容、完成状态与完成记录（本轮捕获的报告）。webhook 不稳定只会以告警记录并吞掉，永远不会影响需求状态。

## 要点与边界

- **完成通知只出不进。** 飞书 Lark / Slack / HTTP webhook 仅用于在需求完结时**出站**推送结果。从 issue 或 IM 消息**入站转需求**目前是路线图（敬请期待），不要把它当作已支持的入站能力。需求当前只能由你在 UI 中登记。
- **看板不靠拖拽。** `Pending → InProgress → Done/Failed/NeedsReview` 由编排器按 tag 轮转、单循环执行；改状态请用详情抽屉。
- **崩溃不会丢任务。** 租约清扫器每 60 秒巡检一次，把租约已过期、且持有它的会话已不在的 `InProgress` 行重置回 `Pending`，重新派发孤儿任务。
- **不在场也照常跑。** 每条绑定的 `enabled` / `tag` / 上限都已持久化，进程启动时后端会逐用户、逐绑定**自行恢复**这些循环。UI 只是把已经在跑的状态展示给你看——后端是唯一事实源。
- **终端可断点续跑。** 被绑定但 PTY 已退出的终端会让循环以空闲方式存活；重新启动该终端时 AutoWork 从中断处继续，无需先解绑再绑定。

## 常见问题

**为什么我关掉标签页后 AutoWork 还在跑？** 这是设计如此。编排器是后端常驻的，UI 只是观察窗口。

**到达完成上限后会怎样？** 绑定会被持久化为已禁用，该上限在重启后依然生效；需要继续时重新启用即可。

## 相关

- [智能值守 IDMM](/zh/docs/guides/intelligent-decision)——让卡顿中的本轮存活，与 AutoWork 叠加
- [终端](/zh/docs/guides/terminal)——把 agent CLI 作为终端目标，开启 Full Auto
- [会话](/zh/docs/guides/sessions)——会话目标与 AutoWork 控件
- [消息渠道](/zh/docs/guides/channels)——IM 接入现状

完整文档 → [GitHub](https://github.com/nomifun/nomifun-desktop)
