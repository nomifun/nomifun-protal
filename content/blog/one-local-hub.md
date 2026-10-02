---
title: '一台电脑，连接整个 NomiFun'
description: '手机、桌面伙伴和机器人共用本地中枢，让模型、记忆与工作留在同一处。'
publishedAt: '2026-10-02'
category: '产品架构'
readingTime: '6 分钟'
kind: 'technical'
---

本文依据 2026 年 10 月的开发分支实现梳理，正式安装包的功能以对应版本为准。

在电脑上整理资料，拿起手机继续对话，再让书桌上的机器人读出回答。这三个界面背后，可以是同一位伙伴、同一份记忆、同一个工作现场。

NomiFun 的「电脑即服务」，让已经运行的 Desktop 同时成为本地执行中枢。日常局域网使用不需要再部署一套业务服务器。Desktop 保存会话与持久数据，管理模型、Agent、知识库和任务；Mobile 与小智云台把交互带到不同场景。

## 能力配置一次，界面按需选择

Desktop 既是桌面应用，也是实际执行工作的后端。手机上的操作回到所选 Desktop 实例，模型凭据和主要工作区无需各复制一份。模型、Skill 或知识库在电脑上更新后，其他入口复用同一个中枢的状态。分工见[产品生态架构](https://github.com/nomifun/nomifun-desktop/blob/cbbc647d13710f89d675ce540ff79eeb3316f66b/docs/architecture/product-ecosystem.zh.md)。

源码中的[双监听器设计](https://github.com/nomifun/nomifun-desktop/blob/cbbc647d13710f89d675ce540ff79eeb3316f66b/crates/backend/nomifun-app/src/desktop.rs)让桌面自己的回环连接持续存在，同时按需开启经过认证的局域网入口。两者共享一个路由。开启或关闭远程访问，不需要重建桌面后端，也不会因为一次局域网端口绑定失败就打断本机工作。

## 一次扫码，直接连接

Mobile 在可信局域网中直连 Desktop，通过 HTTP 完成请求，通过 WebSocket 接收实时更新。这条路径不经过 NomiFun 云中转服务器。

首次配对使用短时效二维码凭证。[QrTokenStore](https://github.com/nomifun/nomifun-desktop/blob/cbbc647d13710f89d675ce540ff79eeb3316f66b/crates/backend/nomifun-auth/src/qr_token.rs)把有效期设为 5 分钟，并原子校验、消费凭证；成功使用后不能再次登录。二维码帮助用户少输一次密码，身份校验仍由 Desktop 完成。

## 机器人延续同一位伙伴

小智云台负责麦克风、扬声器、屏幕、运动与设备工具，Desktop 负责模型、ASR、TTS、记忆和对话编排。设备绑定到伙伴后，连接逻辑调用[同一伙伴会话](https://github.com/nomifun/nomifun-desktop/blob/cbbc647d13710f89d675ce540ff79eeb3316f66b/crates/backend/nomifun-robot/src/session.rs)，重连也延续已有聊天。

于是，机器人获得的是这位伙伴的物理交互方式。声音、文字和设备动作进入统一的能力边界；拍照、动作与持续观察分别受设备权限约束，具体可用能力由固件提供。

## 跨网络时，再加入网络承载

需要从外网访问时，可以选择自托管 [NomiFun Net Infra](https://github.com/nomifun/nomifun-net-infra/blob/main/README.md)。NomiRelay 承载网络流量，nfagent 运行在能访问 Desktop 的机器上。它们解决连通与网络策略问题；模型配置、数据和 Agent 执行仍属于 Desktop。

这套分工也有明确条件：电脑需要运行且可达；局域网监听器没有内置 TLS，应放在可信网络或专用 VPN 中。选择云端模型、ASR 或 TTS 时，对应内容仍会发送给所选供应商。部署与信任范围清晰，才能让「自己的电脑」成为可理解、可控制的能力中枢。
