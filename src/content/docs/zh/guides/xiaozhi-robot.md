---
title: 接入小智机器人
description: 让兼容小智协议的 ESP32 机器人通过局域网使用 NomiFun 的伙伴、模型、语音和设备 MCP 能力。
category: 设备与生态
order: 23
lang: zh-CN
---

NomiFun 可以作为兼容小智 ESP32 机器人的本地 AI 后端。机器人负责麦克风、扬声器、
显示屏、按键和设备端 MCP 工具；NomiFun 负责伙伴、对话模型、ASR、TTS、记忆、会话
和工具协同。

这是可选的硬件接入方式。使用专门固件时，机器人通过局域网连接自己的 NomiFun Desktop，
而不是默认连接 `xiaozhi.me` 服务。

## 准备工作

- 在与机器人相同的局域网内运行
  [NomiFun Desktop](https://github.com/nomifun/nomifun-desktop)；
- 准备兼容的小智固件；
  [nomifun-xiaozhi-yuntai](https://github.com/nomifun/nomifun-xiaozhi-yuntai)
  包含 `esp32-s3n16r8-emoji` 板型和头部舵机 MCP 工具；
- 在 NomiFun 中创建或选择一个桌面伙伴；
- 为该伙伴准备可用的聊天、语音识别（ASR）和语音合成（TTS）模型。

机器人必须能够直接访问电脑。访客 Wi-Fi、AP 隔离或系统防火墙都可能阻止同一 Wi-Fi
下的设备互相通信。

## 1. 配置桌面伙伴

1. 打开 NomiFun 的**桌面伙伴**，选择或创建一个伙伴。
2. 在伙伴的**总览**页配置主对话模型。
3. 在**模型配置**中选择 ASR 和 TTS 模型；如果供应商要求音色，也同时选择音色。
4. 先在普通文字会话中确认伙伴可以正常回复。

机器人使用它所绑定伙伴的模型。全局模型目录里存在供应商，并不代表伙伴已经配置完成；
伙伴必须有可用的主对话模型，语音对话还必须有 ASR 与 TTS。

## 2. 获取 OTA 地址

1. 打开伙伴的**远程控制**页。
2. 在**机器人连接**区域点击**添加机器人**。
3. 如果提示局域网访问未开启，点击**现在开启**。
4. 保持弹窗打开，复制其中一个以 `/robot/ota` 结尾的完整 OTA 地址，通常使用局域网
   端口 `25808`。

请选择与机器人处于同一网络、且机器人确实可达的电脑 IP。不要使用 `127.0.0.1`，
因为它在 ESP32 上指向机器人自身。

## 3. 让固件连接 NomiFun

烧录兼容固件后，打开机器人的 Wi-Fi 配网页。在**高级设置**中，把 NomiFun 显示的完整
地址粘贴到**OTA 地址**字段，保存 Wi-Fi 设置并重启机器人。

设备启动时会请求该地址。NomiFun 会返回连接 `/robot/v1` 所需的 WebSocket 配置，
无需手工拼接或填写 WebSocket 地址。

板型选择、编译、烧录、接线和舵机注意事项，请遵循
[nomifun-xiaozhi-yuntai](https://github.com/nomifun/nomifun-xiaozhi-yuntai)
仓库的 README 与板级文档。

## 4. 绑定机器人

1. 重启后，机器人会在屏幕上显示并读出 6 位激活码。
2. 返回 NomiFun 的**添加机器人**弹窗。
3. 输入激活码，点击**绑定到本伙伴**。
4. 等待机器人出现在伙伴的**机器人连接**列表中。

激活码会过期。若提示无效，请重新开始连接并使用设备最新显示的号码。已经绑定到其他
伙伴的机器人，需要先在原伙伴处解绑。

## 5. 验证接入

建议依次验证：

1. 对机器人说话，确认识别文本出现在 NomiFun 的伙伴会话中；
2. 确认回复能从机器人扬声器播放，并按固件支持的方式打断播放；
3. 让伙伴读取头部状态或转动头部。`esp32-s3n16r8-emoji` 固件通过 `self.head.*`
   暴露设备端 MCP 工具，其中包括 `self.head.get_status`。

需要校准的固件默认不会启用舵机动作。启用自动动作前，请按照板级文档校准中位和行程；
错误的限位可能导致舵机堵转或损坏。

## 数据流与本地边界

```text
麦克风 -> 小智固件 -> NomiFun ASR -> 伙伴对话模型
                                           |
扬声器 <- Opus 音频 <- 小智固件 <- NomiFun TTS
                                           |
                       设备 MCP 工具 <-----+
```

语音和对话内容会按照 NomiFun 中选定供应商的策略处理。“本地后端”表示机器人网关、
会话协同和绑定逻辑在本机运行；如果选择云端 ASR、TTS 或对话模型，相应数据仍会发送给
该供应商。

## 局域网安全

开启局域网访问后，NomiFun 会监听本地网络。请仅在可信局域网中使用，保持系统防火墙
开启，不要把 `25808` 直接暴露到公网。不再使用机器人或 WebUI 连接时，可以关闭局域网
访问。

完整固件与接入实现：
[NomiFun Xiaozhi Yuntai](https://github.com/nomifun/nomifun-xiaozhi-yuntai) ·
[NomiFun Desktop](https://github.com/nomifun/nomifun-desktop)
