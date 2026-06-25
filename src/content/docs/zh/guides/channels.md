---
title: 渠道 · 超级网关
description: 让伙伴接入 11 个 IM 渠道，从手机或群聊远程指挥它操作电脑。
category: 核心操作
order: 2
lang: zh-CN
---

通过**渠道（channel）**，你可以从外部聊天应用操作 NomiFun 的伙伴，而不必坐在桌面前。启用一个连接器、粘贴凭证、用一次性验证码授权一个聊天用户，从此发给机器人的消息就会分发到伙伴，伙伴的回复也回到同一会话。

默认开启的**主 Agent 模式**让远程消息由伙伴本尊接待：会话继承伙伴人格与记忆，并接上 Desktop Gateway 工具——你在手机上对话的不是孤立的聊天 bot，而是掌管你整个桌面的 agent。"把日报 cron 改到早上 9 点，再说说现在桌面上有什么在跑"只需一条飞书消息。

![渠道设置总览](/screenshots/channels-01-overview.png)

## 已落地的 11 个渠道

Telegram、飞书 Lark、钉钉、微信、Slack、Discord、Matrix、Mattermost、Twitch、Nostr、QQ Bot。**企业微信 WeCom 在途**。

## 操作步骤

1. **找到入口**。打开 Nomi 页（`/nomi`），选一只伙伴，进入它的"远程连接（Remote）" Tab，里面列出可用连接器与各自的状态药丸。
2. **填入凭证并启用**。以 Telegram 为例：找 [@BotFather](https://t.me/BotFather) 创建 bot、保存 token，粘入表单，点 Test 验证后 Enable。Lark / 钉钉填 App ID/Secret，微信用扫码登录。
3. **配对授权用户**。用户首次给 bot 发消息时，bot 回一个 6 位验证码（10 分钟 TTL）；你在桌面"Pending pairings"中批准即可。

   ![配对批准](/screenshots/channels-02-pairing.png)

4. **选接待伙伴与默认模型**。机器人按渠道行绑定伙伴：`UNIQUE(type, bot_key)` 约束保证同一机器人永远只绑一只伙伴。切换绑定会重置该渠道活跃会话，下一条消息由新伙伴接待。

   ![渠道 agent / 模型选择器](/screenshots/channels-03-default-model.png)

## 从 IM 端能做什么

- **纯文本**双向，**流式编辑回复**（微信回退为追加新消息）。
- **动作按钮**——确认 prompt、重试等，渲染为各平台原生的 inline 键盘 / 互动卡片。
- 群聊可配置只在被 `@` 时才回应。

> 记忆全家共享：不管多少机器人、多少渠道，会话数据都汇入同一套记忆体系，换伙伴不丢记忆。

完整文档 → [GitHub](https://github.com/nomifun/nomifun)
