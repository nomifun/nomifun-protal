---
title: 电脑操控与浏览器
description: 让 Agent 操作桌面和浏览器，并理解可见浏览器、登录状态、系统权限与操作确认。
category: 远程与设置
order: 19
lang: zh-CN
---

NomiFun 给 agent 内置了两项可选的系统级能力：**电脑操控（Computer-use）**让它截屏、合成鼠标键盘输入、枚举/聚焦窗口——看见并操作你的整台桌面；**浏览器（Browser-use）**则用一套**自研、进程内的 Rust CDP 引擎**驱动 Chromium，完成导航、读取、点击、填表等。两者都以**原生工具**形式直接服务模型，因此比外接方案更快、更省 token，也能被细粒度管控。

两项都是高权限能力。在桌面应用（nomifun-desktop）中，对应能力默认随构建编译并开启；你可以随时在系统设置里关掉。无头的 Web / 服务器构建（nomifun-web）不承诺桌面控制或托管浏览器能力。

入口在系统设置：**Computer Use**（`/settings/computer-use`）与 **Browser Use**（`/settings/browser-use`）。

## 操作步骤

1. **打开电脑操控设置。** 进入 `/settings/computer-use`。桌面构建默认开启；关闭开关会持久化到偏好，之后新建的会话不再获得该能力。能力底层是单工具 + `action` 参数形态：截屏、移动/点击、输入、滚动、拖拽、列窗口、聚焦窗口等共约 21 个动作。截屏与界面识别走平台原生无障碍栈——macOS 用 AX + Vision OCR，Windows 用 UIA + Media.Ocr，Linux 用 AT-SPI2。

   ![computer-use 设置](/images/zh/设置/computer%20use设置.png)

2. **（仅 macOS）授予系统权限。** 首次使用电脑操控需在「系统设置 → 隐私与安全性」中授权宿主应用：
   - **辅助功能（Accessibility）**——合成鼠标键盘输入、读取无障碍树需要它。
   - **屏幕录制（Screen Recording）**——截图需要它（截图全黑或失败时先查这一项）。

   权限缺失时工具结果会直接给出授权指引，照做后重试即可。

3. **打开浏览器设置。** 进入 `/settings/browser-use`。新版默认使用**可见的系统浏览器**，让你能看到 Agent 正在打开、点击和填写什么。你也可以改为 NomiFun 管理的浏览器，或打开“后台静默运行”隐藏窗口；只有选择托管浏览器时，首次使用才会自动获取独立的 Chrome for Testing。

   ![browser-use 设置](/images/zh/设置/browser%20use设置.png)

4. **（可选）按会话或宿主调整默认值。** 除了系统设置里的全局开关，你也能在 agent 运行设置中针对具体会话开关这两项能力，以及调节截图长边上限、历史保留图片数等与 token 治理相关的项。

   ![agent 运行设置](/images/zh/设置/agent运行设置.png)

5. **让 agent 用起来。** 在会话里直接用自然语言交派任务（例如「打开这个网页把表单填好」「截屏看看现在屏幕上是什么」）。推荐工作流是：**先截屏观察 → 再操作 → 再截屏验证**。

## 要点与边界

- **系统浏览器与托管浏览器**：系统浏览器使用本机 Chrome / Edge；托管浏览器使用 NomiFun 独立维护的 Chrome for Testing，不会混用你的日常浏览器目录。
- **登录状态**：需要登录的网站可先点“登录我的浏览器”，完成后关闭登录窗口以保存状态。开启持久登录时，不要同时授予无条件的完全控制。
- **可见与静默**：默认可见更适合第一次使用和敏感操作；熟悉流程后，可为低风险、重复性任务选择后台静默。
- **操作确认**：截屏和读取页面通常可直接执行；点击、输入、上传、提交等会改变外部状态的操作，应保留确认。
- **桌面端能力**：Computer Use 依赖真实桌面与系统权限，主要用于桌面应用；无头服务器不适合执行这类任务。

## 常见问题

- **截图全黑或失败？** macOS 上多半是没授「屏幕录制」；授权后重启宿主应用再试。
- **必须自己装 Chrome 或 Node 吗？** 默认使用系统 Chrome / Edge。若改用托管浏览器，NomiFun 会自动获取 Chrome for Testing；不需要额外安装 Node、npm 或 Playwright。
- **还能接社区 MCP 浏览器/桌面工具吗？** 可以。内置的电脑操控与原生浏览器不妨碍你在 MCP 设置里再添加任意社区 server，两者工具名不同、互不冲突。

## 相关

- [会话工作台](/zh/docs/guides/sessions) —— 文件树、预览与会话里如何调用这些能力。
- [MCP 与技能](/zh/docs/guides/mcp-and-skills) —— 在内置能力之外再接外部工具。
- [系统设置](/zh/docs/guides/settings) —— 主题、执行引擎、更新与其它应用偏好。

完整文档 → [GitHub](https://github.com/nomifun/nomifun-tauri)
