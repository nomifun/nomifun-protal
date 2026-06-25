# NomiFun 门户 — 待补静态资源清单（给作者）

> **2026-06-25 更新**：作者已产出**真实产品截图**（中文界面，深色主题），放在 `public/images/zh/<分类>/`，
> 已接入全部 18 篇文档 + 首页「真实界面一览」展示区 + WebUiRemote 区 + 联系页二维码。旧的 `public/screenshots/*`
> 占位卡**已全部弃用、不再被引用**。截图对照与待补清单见 **`public/images/IMAGE-MANIFEST.md`**。
> 仍待补：**英文界面截图**（`public/images/en/` 下同相对路径，详见 manifest 第 3 节）；以及下方 B 节的真实文本/联系方式。

> 说明：门户绝大多数视觉用**前端代码直接渲染**（活体演示 + CSS 动效），并**直接复用 nomifun-tauri 现有资源**，所以真正需要你手动补的资源**很少**。下面分两部分：
> - **A. 我会自动复用**（你无需操作，列出来让你知情）
> - **B. 需要你补充**（缺失项我已用占位图/占位常量顶上，不阻塞开发；你补上后替换即可）
>
> 命名规范：全小写、连字符分隔、见名知意、含尺寸或用途后缀。所有资源放在 `public/` 下对应子目录。

---

## A. 自动复用（来自 nomifun-tauri，我会 copy 进 `public/`，你无需操作）

| 门户路径 | 来源 | 说明 |
|---|---|---|
| `public/brand/logo.svg` | `ui/src/renderer/assets/logo.svg` | 主 logo（粉碗矢量），用于页头/Hero/favicon |
| `public/channels/*.svg` | `ui/src/renderer/assets/channel-logos/` | 12 个 IM 渠道 logo（含 wecom，标"在途"） |
| `public/providers/*.svg` | `crates/backend/nomifun-assets/assets/logos/**` | AI provider / ACP agent logo（anthropic/openai/gemini/deepseek/qwen/kimi/claude/bedrock/openrouter…） |
| `public/screenshots/*.png` | `docs/images/*.png`（44 张） | 真实产品截图，按需挑选用于文档页与部分功能区 |

> ⚠️ **重要**：经核对，`nomifun-tauri/docs/images/` 里的 44 张 PNG 目前**全部是占位图**（内容为 "SCREENSHOT COMING SOON / Real capture pending" 的品牌占位卡），并非真实产品截图。门户已据此处理：**营销首页不依赖这些占位图**（如"更 native"一节的扫码远控改用纯 CSS/SVG 手机+二维码示意），仅**文档页**内联引用了少量占位图（清晰可替换）。请在方便时用真实运行截图替换 `public/screenshots/` 下的同名文件即可（文件名见 §B5）。

---

## B. 需要你补充的资源

> 缺失期间我会用占位图（带文字说明的 SVG/灰块）和占位常量，页面照常运行。

### B1. 品牌图（设计/导出类）

| 文件名（放 `public/brand/`） | 尺寸/格式 | 用途 | 备注 |
|---|---|---|---|
| `og-cover.png` | 1200×630 PNG | 社交分享卡（微信/X/Slack 预览图） | 建议：深炭黑底 + 粉碗 logo + "NomiFun 超级 AI 工作站" 标题。无则用代码生成的占位卡 |
| `wordmark-light.svg` | 矢量横版 | 浅色背景下的"图标 + NomiFun 文字"横向锁定组合 | 目前仓库只有方形碗图标，没有横版文字 logo。无则用"碗图标 + 文字"临时拼接 |
| `wordmark-dark.svg` | 矢量横版 | 深色背景下的横版组合 | 同上 |
| `favicon.ico` | 32×32/48×48 | 浏览器标签页图标 | 可由 logo.svg 自动生成，非必须手补 |

### B2. 可选的演示动图/视频（有则锦上添花，无则用纯 CSS 动效替代）

| 文件名（放 `public/media/`） | 格式 | 用途 | 备注 |
|---|---|---|---|
| `hero-companion-demo.mp4` | MP4 (H.264, ≤8MB, 静音, 可循环) | Hero 区桌宠真机演示 | 录制桌面伙伴冒热气/切人格/对话的 5-8 秒循环。无则用 `CompanionDemo` 纯 CSS 岛 |
| `autowork-rotation.gif` | GIF 或 MP4 (≤4MB) | 需求看板真机轮转演示 | 无则用 `AutoWorkBoard` 岛 |
| `webui-qr-scan.gif` | GIF 或 MP4 (≤4MB) | 手机扫码远控真机演示 | 无则用静态截图 `webui-04-qr-login-phone.png` |

### B3. 真实文本信息（最关键 — 影响下载页与联系我们页）

集中维护在 `src/data/links.ts`，你直接改这个文件即可（我先填占位）：

| 字段 | 当前状态 | 需要你提供 |
|---|---|---|
| `githubUrl` | ✅ 已确认 `https://github.com/nomifun/nomifun-tauri` | —（已接入全部 CTA 与文档页脚） |
| `releasesUrl` | ✅ 已确认 `…/nomifun-tauri/releases` | —（下载页二进制按钮指向） |
| `contactEmail` | 占位 `hello@nomifun.com` | 对外联系/安全报告邮箱（确认后替换） |
| `communityLinks` | 空 | Discord / 微信群 / Telegram / QQ 群等社群入口（有几个填几个） |
| `websiteUrl` | ✅ 已确认 `https://www.nomifun.com` | —（已写入 links.ts） |
| `commercialNoticeChannel` | 占位 | "商用告知"希望走哪个通道（邮箱 / issue / 表单） |

### B4. 下载二进制（产品侧，非门户）

仓库当前**无官方预编译包**（只能源码构建 + Docker）。下载页我会先做"源码构建 + Docker 自托管"三条路径，平台二进制按钮标"即将提供"并预留位置。等你有了 Release 产物（`.dmg`/`.msi`/`.exe`/`.deb`/`.AppImage`），把链接填进 `src/data/links.ts` 的 `downloads` 即可点亮。

### B5. 真实产品截图（替换占位图，文档页用）

文档页当前内联了若干**占位截图**（`public/screenshots/` 下，目前都是 "SCREENSHOT COMING SOON" 占位卡）。建议用真机截图替换同名文件（命名已就位、见名知意，无需改代码）：

| 文件名 | 内容应为 |
|---|---|
| `gs-01-introduction-hero.png` | 产品主界面总览 |
| `gs-04-quickstart-login.png` ~ `gs-07-quickstart-first-reply.png` | 首次登录 → 选模型 → 首次回复 |
| `companions-*.png` | 伙伴列表/创建/绑定知识库 |
| `channels-02-pairing.png` | 渠道配对（扫码/配对码） |
| `autowork-03-kanban.png` | AutoWork 需求看板 |
| `webui-04-qr-login-phone.png` | 手机扫码登录页（竖屏） |
| `mcp-01-capabilities.png` | MCP 能力面板 |
| `terminal-01-session.png` | 内置终端会话 |

> 截图建议：暗色主题、1600px+ 宽、PNG，文件名保持不变。如你许可，我也可以用 computer-use 打开本机 NomiFun 帮你批量截取真机图。
>
> 📌 **首页「WEBUI · 远程办公」新区块**：右侧平板框当前内嵌 `desktop-01-main-window.png`（占位），意在表达"完整桌面体验装进平板"。最佳替换是一张**手机/平板上 WebUI 的真机截图**（竖屏或横屏皆可，建议另存为 `webui-mobile-experience.png` 并告诉我，我来换上）；终端会话部分是纯 CSS 绘制、无需截图。

---

## 替换方式

1. 把文件按上表**文件名**放进对应 `public/` 子目录，覆盖占位图即可，无需改代码。
2. 文本信息改 `src/data/links.ts`。
3. 改完告诉我，或直接刷新页面查看效果。

> 本清单会随设计推进持续更新。当前不补充也能看到完整门户（占位状态）。
