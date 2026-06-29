---
title: 电脑操控与浏览器
description: 让 agent 看见并操作本机桌面、用自研内置浏览器引擎完成导航与填表——两项系统级能力的开关、权限与审批边界。
category: 远程与设置
order: 17
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

3. **打开浏览器设置。** 进入 `/settings/browser-use`。同样默认开启、可关闭。浏览器以**单个 `Browser` 工具**暴露，约 32 个动作覆盖导航、观察快照、点击、输入、等待等。**首次启用时引擎按需自动获取 Chrome for Testing**（下载、解压到引擎专属的 user-data-dir，不污染你日常的浏览器），全程无需安装 Node / npm / Playwright。

   ![browser-use 设置](/images/zh/设置/browser%20use设置.png)

4. **（可选）按会话或宿主调整默认值。** 除了系统设置里的全局开关，你也能在 agent 运行设置中针对具体会话开关这两项能力，以及调节截图长边上限、历史保留图片数等与 token 治理相关的项。

   ![agent 运行设置](/images/zh/设置/agent运行设置.png)

5. **让 agent 用起来。** 在会话里直接用自然语言交派任务（例如「打开这个网页把表单填好」「截屏看看现在屏幕上是什么」）。推荐工作流是：**先截屏观察 → 再操作 → 再截屏验证**。

## 要点与边界

- **三轴能力网关。** 每个动作都经过 **DangerTier（危险等级）× Surface（作用面）× Decision（决策模式）** 三轴判定审批类别，做到细粒度管控而非一刀切。
- **只读 vs. 写操作的审批。** 只读动作（截屏、光标位置、列窗口、等待、浏览器的 `observe`/快照）按 **Info** 类——AutoEdit / Default 模式自动放行；操作类动作（点击、输入、滚动、拖拽、聚焦窗口、浏览器导航/填表等）按 **Exec** 类——Default 模式需你确认后执行。
- **Plan mode 不碰桌面。** 在只读规划阶段，电脑操控整个工具不可见，规划期间不会操作你的桌面。
- **截图与 token 治理。** 截图自动降采样到长边不超过设定上限（默认 1568px，落在视觉推荐区间），模型给出的坐标会自动映射回真实屏幕（含 Retina 缩放）；历史里只保留最近若干张带图结果，更早的图片在轮次结束时剥离（文本保留），避免会话与请求 token 膨胀。
- **构建形态决定可用性。** 桌面应用默认带这两项能力；无头 Web / 服务器构建不编译电脑操控（无显示器），也不启用托管浏览器——若在那里误开电脑操控，仅记录一条 warning，不会报错。

## 常见问题

- **截图全黑或失败？** macOS 上多半是没授「屏幕录制」；授权后重启宿主应用再试。
- **必须自己装 Chrome 或 Node 吗？** 不用。浏览器引擎首次使用时自动获取 Chrome for Testing，与你日常用的浏览器互不干扰，也不需要 Node / npm / Playwright。
- **还能接社区 MCP 浏览器/桌面工具吗？** 可以。内置的电脑操控与原生浏览器不妨碍你在 MCP 设置里再添加任意社区 server，两者工具名不同、互不冲突。

## 相关

- [会话工作台](/zh/docs/guides/sessions) —— 文件树、预览与会话里如何调用这些能力。
- [MCP 与技能](/zh/docs/guides/mcp-and-skills) —— 在内置能力之外再接外部工具。
- [智能决策 · IDMM](/zh/docs/guides/intelligent-decision) —— 为长任务叠加值守与决策护航。

完整文档 → [GitHub](https://github.com/nomifun/nomifun-tauri)
