---
title: 系统设置
description: 调整主题、语言、启动与通知偏好，管理执行引擎、Browser Use、Computer Use，并检查应用更新。
category: 远程与设置
order: 18
lang: zh-CN
---

新版设置页把应用偏好、执行引擎、浏览器操作、电脑操作和关于信息拆成清晰的独立入口。侧边栏底部点击“设置”即可进入。

![NomiFun 关于与更新页面](/screenshots/settings-system-zh.png)

## 系统设置

这里管理日常使用偏好：

- 界面语言与消息发送快捷键；
- 开机启动、保持系统唤醒与硬件加速；
- 系统通知与定时任务通知；
- 上传文件是否保存进工作区、Office 文件是否自动预览；
- 默认工作目录与日志目录；
- 恢复出厂设置。

修改工作目录或硬件加速时，应用会提示重启后生效。

## 主题

NomiFun 默认使用 **Rhythm Dark（律动暗黑）**。当前内置主题包括：

- 律动暗黑（默认）
- 经典
- 暗夜霓虹
- 冰晶幻境
- 落日余晖

主题切换会立即生效并被记住。你也可以添加自定义 CSS 主题。

## 执行引擎

“执行引擎”现在与“模型管理”分开。这里负责检测和配置 Nomi、Claude Code、Codex、OpenCode 等执行后端，以及远程 OpenClaw；“模型管理”只负责模型 Provider、本地模型与语音识别。

这种分工让“谁来执行”和“使用哪个模型”更容易理解，也避免把 CLI 安装状态与模型凭据混在一起。

## Browser Use 与 Computer Use

- **Browser Use**：控制浏览器来源、可见性、登录状态与操作审批。新版默认打开可见的系统浏览器，便于你观察正在发生的操作。
- **Computer Use**：控制截屏、鼠标、键盘与系统无障碍能力。首次使用时，macOS 会要求屏幕录制与辅助功能权限。

只在需要时启用这些能力，并为敏感工作保留操作确认。

## 关于与检查更新

“关于”页显示当前安装版本、源码仓库、更新日志、问题反馈与官网入口。桌面端可以在这里点击“检查更新”；侧边栏底部也会在检测到新版本时显示提示。

由于 NomiFun 仍处于 pre-1.0 快速迭代阶段，最终版本请以应用“关于”页和 [GitHub Releases](https://github.com/nomifun/nomifun-desktop/releases/latest) 为准。

## 数据与备份

NomiFun 的会话、设置、伙伴、知识库和日志默认保存在当前用户的应用数据目录：

- macOS：`~/Library/Application Support/NomiFun/Nomi`
- Windows：`%LOCALAPPDATA%\NomiFun\Nomi`
- Linux：`$XDG_DATA_HOME/NomiFun/Nomi`，通常为 `~/.local/share/NomiFun/Nomi`

迁移或备份前先退出应用，再复制整个目录。恢复出厂设置会清除本地数据，执行前请先备份重要内容。

## 相关

- [语音输入](/zh/docs/guides/voice-input)
- [电脑操作与浏览器操作](/zh/docs/guides/computer-browser-use)
- [WebUI 远程办公](/zh/docs/guides/webui-remote)

完整源码与发布记录 → [GitHub](https://github.com/nomifun/nomifun-desktop)
