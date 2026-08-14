# NomiFun 门户 — 静态资源与维护清单

> **维护日期：2026-08-12**
>
> 这份清单记录门户当前实际使用的图片、品牌资源和仍可继续补充的素材。门户的大部分
> 视觉由 Astro / React / UnoCSS 直接渲染，截图只用于证明真实产品界面和辅助文档，不应
> 被误解为产品能力的完整清单。

## 当前资源状态

### 产品截图

`public/screenshots/` 目前包含来自 NomiFun 安装版和既有产品资料的中英文截图，**不再是
“全部占位图”**。当前首页中文主截图已使用 2026 年 8 月 12 日从本机已安装的最新
NomiFun 应用抓取的真实窗口：

```text
public/screenshots/current-home-zh.png
```

尺寸为 `1296×841`。门户只保留并引用这一份语义化文件；抓取过程中产生的同内容
临时副本已清理，避免重复资源进入仓库。

英文首页和英文文档的主截图也已在 2026 年 8 月 12 日从本机已安装的最新
NomiFun 应用英文界面重新抓取：

```text
public/screenshots/current-home-en.png
```

尺寸为 `1296×841`。中英文截图分别来自对应语言的真实应用界面，不能混用；后续更新
英文展示时仍应从英文界面的安装版重新截取并替换同名文件。

首页截图引用位置：

- `src/components/sections/Hero.astro`
- `src/components/sections/ScreenshotGallery.astro`

入门文档会引用 `current-home-zh.png` / `current-home-en.png`；能力文档还会引用
`presets-*`、`skills-*`、`settings-system-*`、`voice-input-*` 等截图。替换同名文件
即可，不需要修改 Markdown。

### 产品资料图

`public/images/` 中已有来自当前产品资料的中英文界面图、联系渠道二维码和首页展示素材。
这些文件按现有目录组织，除非同步修改引用代码，不建议随意重命名。`public/images/`
下没有 `IMAGE-MANIFEST.md`；本清单不再引用不存在的 manifest 文件。

### 品牌与演示资源

| 路径 | 当前状态 | 用途 |
|---|---|---|
| `public/brand/logo.svg` | 已有 | 页头、Hero、favicon |
| `public/images/showcase/*` | 已有 | 首页与 README 展示素材 |
| `public/images/zh/**` / `public/images/en/**` | 已有 | 中英文产品资料与文档辅助图 |
| `public/channels/*.svg` | 已有 | 渠道图标 |
| `public/providers/*.svg` | 已有 | 模型供应商与 Agent 图标 |
| `public/brand/og-cover.png` | 可选补充 | 社交分享预览图 |
| `public/brand/wordmark-light.svg` | 可选补充 | 浅色背景横版 Logo |
| `public/brand/wordmark-dark.svg` | 可选补充 | 深色背景横版 Logo |
| `public/media/*.mp4` / `*.gif` | 可选补充 | 真机演示视频或动图；当前代码已有 CSS / 静态图替代方案 |

## 链接与下载入口

所有公共入口集中维护在 `src/data/links.ts`：

| 用途 | 地址 |
|---|---|
| Desktop 源码 | `https://github.com/nomifun/nomifun-desktop` |
| Mobile 源码 | `https://github.com/nomifun/nomifun-mobile` |
| Xiaozhi Yuntai 源码 | `https://github.com/nomifun/nomifun-xiaozhi-yuntai` |
| NomiFun Net Infra 源码 | `https://github.com/nomifun/nomifun-net-infra` |
| Desktop Releases | `https://github.com/nomifun/nomifun-desktop/releases` |
| Desktop Issues | `https://github.com/nomifun/nomifun-desktop/issues` |
| Docker Hub | `https://hub.docker.com/repository/docker/nomifun/nomifun-web` |

大陆用户的备用网盘和视频入口也由 `src/data/links.ts` 维护。没有确认的社群地址不要
擅自添加占位链接。

## 后续可补清单

1. **更多真实功能截图**：可按文档主题补充 WebUI、终端、AutoWork、知识库、伙伴、MCP
   等页面；优先替换现有同名文件，避免无必要地扩大资源目录。
2. **社交分享图与横版 Logo**：补齐 `public/brand/` 中的可选品牌文件。
3. **真机动图 / 视频**：如有稳定的录屏，再放入 `public/media/`，并同步在组件中引用；
   没有合适素材时保留当前代码绘制的演示。

## 替换规则

- 图片尽量使用 PNG / SVG，保持清晰、压缩合理，并保留语义化文件名。
- 中英文界面不要混用；中文页面使用 `*-zh`，英文页面使用 `*-en`。
- 新增截图后应检查对应 Markdown 或 Astro 引用是否真实存在。
- 运行 `bun run build` 验证静态资源路径和文档页面均可生成。

> 本文件是维护记录，不是产品路线图。尚未公开、逐步开放或保密的产品方向请以首页
> Roadmap、README 和 Desktop 仓库当前代码为准。
