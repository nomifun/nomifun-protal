# 截图资产对齐清单 · Image Manifest

> 本文件是门户**真实截图**的唯一对照表。截图由作者在实际运行的 NomiFun（深色主题）中产出，
> 中文界面图位于 `public/images/zh/`。本表说明每张图的用途、所在文档，以及**英文界面图的待补路径**。
>
> This is the single cross-reference for the portal's **real screenshots** (captured by the author
> from the actual running app, dark theme). Chinese-UI images live under `public/images/zh/`. This
> table maps each image to its purpose, the doc that uses it, and the **English-UI path to fill in**.

## 中英对齐规则 · zh ↔ en rule

- **中文站 / 中文文档**：直接引用 `public/images/zh/<分类>/<文件名>.png`（真实存在）。
- **英文文档**：引用 **同一相对路径**，仅把前缀 `/images/zh/` 换成 `/images/en/`。
  即 `…/zh/01模型/模型列表.png` ↔ `…/en/01模型/模型列表.png`。
  > 英文界面图**尚未产出**：请用**英文界面**重新截同样的画面，按下表「英文待补路径」存盘即可点亮（无需改代码）。
- **文件名含空格**（`computer use设置.png`、`browser use设置.png`）：在 Markdown / `src` 里写成 `%20`
  （如 `computer%20use设置.png`）。中文字符保持原样。文档里已按此处理。
- **首页与联系页**：直接用 `…/zh/…` 图（中英两站同图，仅作产品展示，无需英文版）。

---

## 1. 文档截图清单 · docs

| 文档 doc | 中文源 `/images/zh/…` | 英文待补 `/images/en/…` | 用途 |
|---|---|---|---|
| getting-started/introduction | `02会话/会话.png` | `02会话/会话.png` | 主界面 · 会话工作区总览 |
| getting-started/installation | `设置/关于.png` | `设置/关于.png` | 安装后「关于」页 · 版本号 |
| getting-started/quick-start | `01模型/新增模型.png` | `01模型/新增模型.png` | 新增模型 provider |
| getting-started/quick-start | `02会话/会话启动.png` | `02会话/会话启动.png` | 发起第一段会话 |
| getting-started/quick-start | `02会话/会话.png` | `02会话/会话.png` | 会话工作区 |
| guides/model-routing | `01模型/新增模型.png` | `01模型/新增模型.png` | 新增模型表单 |
| guides/model-routing | `01模型/模型列表.png` | `01模型/模型列表.png` | 已配置模型列表 |
| guides/model-routing | `01模型/全局模型配置-故障转移列表.png` | `01模型/全局模型配置-故障转移列表.png` | 故障转移队列 |
| guides/model-routing | `01模型/agent安装配置.png` | `01模型/agent安装配置.png` | ACP Agent 安装配置 |
| guides/intelligent-decision | `01模型/全局模型配置-IDMM默认配置.png` | `01模型/全局模型配置-IDMM默认配置.png` | IDMM 默认配置 |
| guides/intelligent-decision | `01模型/全局模型配置-决策活动.png` | `01模型/全局模型配置-决策活动.png` | 决策活动记录 |
| guides/intelligent-decision | `02会话/会话决策.png` | `02会话/会话决策.png` | 会话内决策卡点 |
| guides/sessions | `02会话/会话.png` | `02会话/会话.png` | 会话工作区布局 |
| guides/sessions | `02会话/会话挂载知识库.png` | `02会话/会话挂载知识库.png` | 为会话挂载知识库 |
| guides/sessions | `02会话/会话开启自动工作.png` | `02会话/会话开启自动工作.png` | 会话内开启自动工作 |
| guides/terminal | `02会话/新建终端.png` | `02会话/新建终端.png` | 新建终端 |
| guides/terminal | `02会话/选择终端启动方式.png` | `02会话/选择终端启动方式.png` | 终端预设选择 |
| guides/terminal | `02会话/终端会话-codex.png` | `02会话/终端会话-codex.png` | 驱动 Codex 终端 |
| guides/companions | `桌面伙伴/新增桌面伙伴.png` | `桌面伙伴/新增桌面伙伴.png` | 新建伙伴 |
| guides/companions | `桌面伙伴/新增形象.png` | `桌面伙伴/新增形象.png` | 新增形象 |
| guides/companions | `桌面伙伴/形象库列表.png` | `桌面伙伴/形象库列表.png` | 形象库 |
| guides/companions | `桌面伙伴/形象采集.png` | `桌面伙伴/形象采集.png` | 自定义形象采集 |
| guides/companions | `桌面伙伴/桌面伙伴设置.png` | `桌面伙伴/桌面伙伴设置.png` | 伙伴设置 |
| guides/companions | `桌面伙伴/桌面伙伴聊天页.png` | `桌面伙伴/桌面伙伴聊天页.png` | 与伙伴对话 |
| guides/companions | `桌面伙伴/桌面伙伴技能配置.png` | `桌面伙伴/桌面伙伴技能配置.png` | 专属技能库（按伙伴隔离） |
| guides/companions | `桌面伙伴/桌面伙伴知识库配置.png` | `桌面伙伴/桌面伙伴知识库配置.png` | 伙伴绑定知识库 |
| guides/companions | `桌面伙伴/桌面伙伴新增共享记忆.png` | `桌面伙伴/桌面伙伴新增共享记忆.png` | 新增共享记忆 |
| guides/companions | `桌面伙伴/桌面伙伴共享数据采集配置.png` | `桌面伙伴/桌面伙伴共享数据采集配置.png` | 共享数据采集（opt-in） |
| guides/companions | `桌面伙伴/桌面伙伴共享记忆迁移.png` | `桌面伙伴/桌面伙伴共享记忆迁移.png` | 换机迁移 |
| guides/companions | `桌面伙伴/开启桌面伙伴.png` | `桌面伙伴/开启桌面伙伴.png` | 开启桌宠 |
| guides/channels | `桌面伙伴/桌面伙伴远程连接配置.png` | `桌面伙伴/桌面伙伴远程连接配置.png` | 渠道 / 远程连接绑定 |
| guides/knowledge-base | `03知识库/知识库首页.png` | `03知识库/知识库首页.png` | 知识库首页 |
| guides/knowledge-base | `03知识库/新增本地知识库.png` | `03知识库/新增本地知识库.png` | 新增本地知识库 |
| guides/knowledge-base | `03知识库/网页抓取知识库.png` | `03知识库/网页抓取知识库.png` | URL 实时快照知识库 |
| guides/knowledge-base | `03知识库/知识库设置.png` | `03知识库/知识库设置.png` | 知识库设置（回写模式） |
| guides/knowledge-base | `03知识库/新增成功后对应的知识库详情.png` | `03知识库/新增成功后对应的知识库详情.png` | 知识库详情 |
| guides/knowledge-base | `03知识库/知识库挂载使用.png` | `03知识库/知识库挂载使用.png` | 挂载到会话使用 |
| guides/assistants | `助手&skill&mcp/助手列表.png` | `助手&skill&mcp/助手列表.png` | 助手列表 |
| guides/assistants | `助手&skill&mcp/新增助手.png` | `助手&skill&mcp/新增助手.png` | 新增 / 编辑助手 |
| guides/assistants | `助手&skill&mcp/标签管理.png` | `助手&skill&mcp/标签管理.png` | 标签管理 |
| guides/mcp-and-skills | `助手&skill&mcp/mcp配置.png` | `助手&skill&mcp/mcp配置.png` | 配置 MCP server |
| guides/mcp-and-skills | `助手&skill&mcp/skills.png` | `助手&skill&mcp/skills.png` | 技能页 |
| guides/open-capability | `开放能力/mcp能力.png` | `开放能力/mcp能力.png` | MCP 能力面板 |
| guides/autowork | `05需求平台/需求平台列表.png` | `05需求平台/需求平台列表.png` | 需求列表 |
| guides/autowork | `05需求平台/需求平台列表-空.png` | `05需求平台/需求平台列表-空.png` | 需求平台空态 |
| guides/autowork | `05需求平台/新增需求.png` | `05需求平台/新增需求.png` | 新增需求 |
| guides/autowork | `05需求平台/需求平台webhook.png` | `05需求平台/需求平台webhook.png` | 完成通知 webhook 列表 |
| guides/autowork | `05需求平台/新增webhook.png` | `05需求平台/新增webhook.png` | 新增出站 webhook（Lark/Slack/HTTP） |
| guides/scheduled-tasks | `04定时任务/定时任务首页空.png` | `04定时任务/定时任务首页空.png` | 空态 + keep-awake |
| guides/scheduled-tasks | `04定时任务/新增定时任务.png` | `04定时任务/新增定时任务.png` | 新增定时任务 |
| guides/scheduled-tasks | `04定时任务/定时任务首页列表.png` | `04定时任务/定时任务首页列表.png` | 任务列表 |
| guides/scheduled-tasks | `04定时任务/但是任务详情.png` | `04定时任务/但是任务详情.png` | 任务详情（注：文件名原始拼写如此） |
| guides/webui-remote | `开放能力/webui.png` | `开放能力/webui.png` | WebUI 远程访问面板 |
| guides/computer-browser-use | `设置/computer use设置.png` | `设置/computer use设置.png` | computer-use 设置（markdown 用 `computer%20use设置.png`） |
| guides/computer-browser-use | `设置/browser use设置.png` | `设置/browser use设置.png` | browser-use 设置（markdown 用 `browser%20use设置.png`） |
| guides/computer-browser-use | `设置/agent运行设置.png` | `设置/agent运行设置.png` | agent 运行设置 |
| guides/settings | `设置/系统设置.png` | `设置/系统设置.png` | 系统设置 |
| guides/settings | `设置/主题设置.png` | `设置/主题设置.png` | 主题设置 |
| guides/settings | `设置/关于.png` | `设置/关于.png` | 关于（版本 / 归属） |

## 2. 首页与联系页用图 · homepage & contact （中英同图，无需英文版）

| 位置 | 中文源 `/images/zh/…` | 说明 |
|---|---|---|
| 首页 · Hero 主视觉 | `/images/showcase/webui-cross-device.png` | 笔记本 + 平板同时运行 NomiFun 的真机实拍照片（源 `Documents/desktop-01-main-window.png`）。实物图，中英两站共用 |
| 首页 · WebUiRemote 设备框 | `/images/showcase/webui-cross-device.png` | 同上真机照片（跨设备远程办公场景） |
| 文档 · guides/webui-remote（中英共用） | `/images/showcase/webui-cross-device.png` | 同上；实物照片无需英文版，zh/en 文档同引用 `/images/showcase/` |
| 首页 · ScreenshotGallery | `02会话/会话.png` | 会话工作区 |
| 首页 · ScreenshotGallery | `桌面伙伴/桌面伙伴聊天页.png` | 与桌面伙伴对话 |
| 首页 · ScreenshotGallery | `05需求平台/需求平台列表.png` | 需求平台 · AutoWork |
| 首页 · ScreenshotGallery | `01模型/模型列表.png` | 模型管理与故障转移 |
| 首页 · ScreenshotGallery | `03知识库/知识库首页.png` | 知识库首页 |
| 首页 · ScreenshotGallery | `开放能力/webui.png` | 开放能力 · WebUI 远程 |
| 联系页 · 二维码 | `联系方式/wechat/1280X1280.JPEG` | 微信 |
| 联系页 · 二维码 | `联系方式/qq/1280X1280.PNG` | QQ |
| 联系页 · 二维码 | `联系方式/xhs/1280X1280.JPEG` | 小红书 |

> 如希望英文站首页也显示英文界面截图，可后续将 `ScreenshotGallery.astro` / `WebUiRemote.astro`
> 的 `src` 改为按 locale 切换（zh → `/images/zh/…`，en → `/images/en/…`），再补对应英文图。

## 3. 待补英文截图清单（去重）· English captures to produce

把以下画面用**英文界面**重新截图，按相同相对路径存到 `public/images/en/` 即可（覆盖式新建目录）：

```
01模型/新增模型.png
01模型/模型列表.png
01模型/全局模型配置-故障转移列表.png
01模型/agent安装配置.png
01模型/全局模型配置-IDMM默认配置.png
01模型/全局模型配置-决策活动.png
02会话/会话.png
02会话/会话启动.png
02会话/会话决策.png
02会话/会话挂载知识库.png
02会话/会话开启自动工作.png
02会话/新建终端.png
02会话/选择终端启动方式.png
02会话/终端会话-codex.png
03知识库/知识库首页.png
03知识库/新增本地知识库.png
03知识库/网页抓取知识库.png
03知识库/知识库设置.png
03知识库/新增成功后对应的知识库详情.png
03知识库/知识库挂载使用.png
04定时任务/定时任务首页空.png
04定时任务/新增定时任务.png
04定时任务/定时任务首页列表.png
04定时任务/但是任务详情.png
05需求平台/需求平台列表.png
05需求平台/需求平台列表-空.png
05需求平台/新增需求.png
05需求平台/需求平台webhook.png
05需求平台/新增webhook.png
助手&skill&mcp/助手列表.png
助手&skill&mcp/新增助手.png
助手&skill&mcp/标签管理.png
助手&skill&mcp/mcp配置.png
助手&skill&mcp/skills.png
开放能力/mcp能力.png
开放能力/webui.png
设置/computer use设置.png
设置/browser use设置.png
设置/agent运行设置.png
设置/系统设置.png
设置/主题设置.png
设置/关于.png
桌面伙伴/新增桌面伙伴.png
桌面伙伴/新增形象.png
桌面伙伴/形象库列表.png
桌面伙伴/形象采集.png
桌面伙伴/桌面伙伴设置.png
桌面伙伴/桌面伙伴聊天页.png
桌面伙伴/桌面伙伴技能配置.png
桌面伙伴/桌面伙伴知识库配置.png
桌面伙伴/桌面伙伴新增共享记忆.png
桌面伙伴/桌面伙伴共享数据采集配置.png
桌面伙伴/桌面伙伴共享记忆迁移.png
桌面伙伴/开启桌面伙伴.png
桌面伙伴/桌面伙伴远程连接配置.png
```

## 4. 已弃用占位图 · deprecated placeholders

`public/screenshots/*.png` 为早期从 `nomifun-tauri/docs/images/` 复制来的 **"SCREENSHOT COMING SOON" 占位卡**，
现已全部被上面的真实截图取代，**文档与页面不再引用**。可在确认无误后自行删除该目录（保留亦不影响构建）。

---

> 维护：新增/调整文档用图时同步更新本表，保持 zh / en 一一对应。
