# NomiFun 官方门户 — 设计规格（Design Spec）

> 状态：已批准方向（2026-06-25）。本文件是**唯一事实来源（single source of truth）**，所有并行 subagent 在实现前必须先读本文件，按此规格产出，保证文案准确、视觉一致、接口契约统一。
>
> 源仓库参考：`/Users/jyxc-dz-0100640/code/my/nomifun-release/nomifun-tauri`（产品本体，勿改动）。本仓库：`nomifun-portal`（门户，从零搭建）。

---

## 0. 一句话目标

为 **NomiFun**（完全开源、本地优先的"超级 AI 工作站"）搭建官方门户：功能速览首页 / 操作文档页 / 下载页 / 联系我们页。强调**美学与交互体验**，用前端代码直接渲染核心功能演示（随 i18n 切换），**不重复** GitHub 上的全量技术文档，只收敛"操作/使用类"内容。

---

## 1. 已确认的方向决策

| 维度 | 决策 |
|---|---|
| 技术栈 | **Astro + React 岛 + UnoCSS**（默认零 JS，交互处用 React island） |
| 视觉 | **深炭黑画布 + 暖粉主强调 + 蓝紫辅色**（忠于 logo 粉碗+近黑底，蓝紫衔接 App） |
| 文档范围 | **先做精选核心操作指南 + 可扩展架构**（侧边栏/搜索/i18n 一次搭好，内容分批补） |
| 文案口径 | **以已实现能力为准；未上线/在途清晰标注"敬请期待 / Roadmap"** |
| 语言 | **zh-CN 默认（根路径），en-US 次要（/en）**，浏览器语言自动判断；回退 en-US |

---

## 2. 准确性红线（写文案必须遵守，开源接受审计）

代码核对后，以下 4 处与作者初稿不一致，**一律按"代码实际"口径**书写：

| 主题 | ❌ 不要写 | ✅ 正确口径 |
|---|---|---|
| 伙伴记忆 | "既有共享记忆又有专属记忆" | **共享记忆中枢**（全体伙伴共享）+ **每个伙伴专属技能库**（skill 按伙伴隔离）。可加"细分私有记忆敬请期待" |
| IM 渠道数 | "12+ 渠道" | **11 个已落地渠道**：Telegram、飞书 Lark、钉钉、微信、Slack、Discord、Matrix、Mattermost、Twitch、Nostr、QQ Bot；**企业微信 WeCom 在途** |
| 需求入站 | "可对接在线 issue、slack、lark 入站转需求" | 完成通知**出站**可推送 **Lark / Slack / HTTP webhook**；issue/IM **入站转需求 = 敬请期待** |
| 知识库来源 | "支持飞书、Notion 来源" | **飞书 Feishu 已实现**（连接器已注册，UI 内创建入口当前关闭）；**Notion = 路线图未实现** |

**可大胆宣传（全部属实）**：自研 in-process CDP 浏览器引擎（Chromium-only，无 Playwright/Node）；原生 computer-use（macOS AX / Windows UIA / Linux AT-SPI）；三轴能力网关（危险级 × 调用面 × 决策）；151 项 MCP/REST 能力（`/mcp` `/mcp-agent` `/v1`+OpenAPI 3.1）；17 个 ACP 直连 Agent；IDMM 值守（规则层 + 旁路模型层）；安全回写暂存区（IM 写入永远进 `_inbox` 待审）；模型故障 failover 队列；URL 实时快照知识库（SSRF 防护）；WebUI 局域网扫码远控（5 分钟一次性 token）；技能进化挖掘 + 伙伴间技能 gift。

---

## 3. 产品事实库（写文案的素材，全部已核对）

**定位**：本地优先的超级 AI 工作站 / 编码工作空间。一套 Rust 后端 + 一套 React 19 前端 + 两种宿主形态：`nomifun-desktop`（Tauri 2 桌面，环回端口 + 每次启动本地信任 token）/ `nomifun-web`（自托管 axum 服务，`127.0.0.1:8787`，默认需登录）。15 个 `nomi-*` agent crate、29 个 `nomifun-*` 后端 crate。Apache-2.0，脱胎自 AionUi 并大幅重构。当前版本 **0.1.0（pre-1.0）**。

**7 大支柱（首页叙事骨架）**：

1. **数据安全 · 源码开放**：all-in-local，绝不主动外发数据，除调用 LLM 厂商外无第三方网络对接。Apache-2.0 完全开源、接受审计、免费商用、无广告无会员。SQLite 为唯一事实源，每个会话独立工作目录。补充叙事：为保障安全，主动砍掉了若干先进功能（开源版移除），把"放心"放第一位。
2. **超级伙伴养成体系**：**3 个内置形象**（Mochi 麻薯兔 / Ink 墨墨黑猫 / Bolt 波特机器人，纯代码绘制 SVG，无图片资源，默认 Mochi）+ 自定义任意 IP 形象（甚至家人 / 宠物）+ 人格预设（活泼/沉静/俏皮 + 自由文本）；行为采集（opt-in，多数默认关）→ LLM 蒸馏长期记忆；进化引擎自动挖掘 skill（仅基于工具调用序列，不含参数值）→ 生成可评审 `SKILL.md` 与你商议；**技能 gift**（把一个伙伴的技能复制给另一个）；**共享记忆中枢 + 专属技能库**；伙伴即超级网关 → 连接 **11 个 IM 渠道**，远程指挥伙伴操作电脑。每伙伴可独立绑定知识库。〔注：角色集 2026-06 由 6 缩减为 3，roux/pixel/boo 已下线。〕
3. **智能值守（需求平台 + AutoWork + IDMM）**：需求看板 Pending→InProgress→Done/Failed/NeedsReview，按 tag 轮转、单循环执行；租约清扫 60s 重派孤儿任务、开机自恢复（后端是唯一事实源）→ 高可靠保活、无人值守。完成通知 webhook（Lark 签名卡 / Slack / HTTP）。**IDMM** = 每会话监督层：规则层（重试/退避/空闲推动/只读权限自动确认）+ 旁路模型层（真正决策卡点升级到轻量模型）；两个默认关的值守（故障值守 / 决策值守）；可触发模型 failover 队列（max 4 次切换）。
4. **开放能力 · 超级生态**：151 项能力经三个公开门面暴露——`/mcp`（全量 Remote）、`/mcp-agent`（精选 do-work 子集）、`/v1`（REST + `/v1/openapi.json` OpenAPI 3.1 + SSE 流）。companion-token（Bearer，SHA-256 存储，常量时间比对）鉴权，调用者"以该伙伴身份"在 Remote 面操作。让 Claude / Codex / 任意 Agent 通过 MCP/Skill 直接驱动 NomiFun。头部能力：`nomi_agent_run`（流式）+ `nomi_agent_result`（轮询）委派。
5. **无限搭配 · config one, use anywhere**：统一管理知识库 / skill / agent / mcp / 模型。知识库 = 用户策展的 markdown 目录，挂载进会话工作区；**URL 实时快照**（Live/Snapshot，SSRF 防护，JS 重页面走无头浏览器）；**安全回写**（Disabled/Staged/Direct，IM 写入永远 Staged 进 `_inbox` 待审/合并）；飞书连接器已实现。绑定类型：workpath/conversation/terminal/companion。
6. **更 native 的实现**：自研 in-process Rust **CDP 浏览器引擎**（Chromium-only，无 Playwright/Node，首用自动获取 Chrome for Testing，~32 个动作）；原生 **computer-use**（xcap 截屏 + enigo 输入 + 平台 a11y：macOS AXUIElement+Vision OCR / Windows UIAutomation+Media.Ocr / Linux AT-SPI2，~21 个动作）。以 native tools 形式服务模型 → 更快、更省 token、可细粒度管控。**三轴能力网关**：DangerTier(Read/Write/Destructive/Sensitive) × Surface(Desktop/Channel/Remote) × Decision(Allow/Confirm/Deny)。**WebUI 局域网扫码远控**（`0.0.0.0:25808`，QR 一次性 token 5 分钟 TTL，Host/Origin 白名单防 DNS rebinding，非社交平台、直连局域网）。
7. **专为提效 · 海量创新敬请期待**：开发者兼职、精力有限，迭代/修复可能不达预期；很多惊喜 feature 未上线。召集贡献者/社区运营/布道者共建。

**开箱即用 nomi agent**：内置无需额外安装（CLI 二进制 `nomi`）。4 个原生 provider 后端：**Anthropic / OpenAI 兼容 / Amazon Bedrock / Google Vertex**（OpenAI 兼容可达 DeepSeek/Gemini/Qwen/Kimi/Ollama/vLLM/Azure 等）。**17 个 ACP 直连 Agent**：Claude Code、Codex CLI、Gemini CLI、Qwen、CodeBuddy、Droid、Goose、Auggie、Kimi、OpenCode、Copilot、Qoder、Vibe、Cursor、Kiro、Hermes、Snow（+ Nanobot / OpenClaw 两个非 ACP 托管）。交互式会话与 PTY 终端均可用（终端预设：Shell / Claude Code / Codex / Gemini）。

**许可与归属**：Apache-2.0 © 2025-2026 NomiFun（nomifun.com，未核实）。脱胎自 AionUi（https://github.com/iOfficeAI/AionUi ，Apache-2.0），页脚需署名致谢。

---

## 4. 视觉设计系统（Design Tokens）

源自真实 logo（`viewBox 0 0 80 80`：暗底 `#1B1822→#0B0A10` 圆角方块 + 白色饭团拱形 + 粉色碗 `#FF9FB4→#FF6F91` + 三缕粉色蒸汽 `#FF8FA8`/`#FFB3C4`）。

```
// 画布 / 表面（深炭黑）
--ink-950: #07060B   // 页面最底
--ink-900: #0B0A10   // 主画布（logo 底色低点）
--ink-850: #131019
--ink-800: #1B1822   // 卡片（logo 底色高点）
--ink-700: #25222E
--ink-600: #322E3C   // 边框/分隔
// 暖粉（主强调）
--pink-300: #FFB3C4
--pink-400: #FF9FB4  // logo 碗高光
--pink-500: #FF6F91  // 主 CTA / 品牌
--pink-600: #F0577C
// 蓝紫（辅色，衔接 App --brand #7583b2）
--violet-300: #b5bcd6
--violet-400: #a1aacb
--violet-500: #7583b2
// 文本
--text-hi:  #F5F3F7  // 主文本
--text-mid: #B8B3C4  // 次文本
--text-low: #7A7488  // 辅助/标注
// 语义
--success: #34d399  --warning: #fbbf24  --danger: #fb7185  --info: #4d9fff
// 渐变
--grad-hero: radial-gradient(at 30% 0%, rgba(255,111,145,.18), transparent 60%)
--grad-pink: linear-gradient(135deg, #FF9FB4, #FF6F91)
--grad-glow: 粉色辉光，用于 CTA/卡片 hover
```

- **字体**：中文 `"HarmonyOS Sans SC","PingFang SC","Source Han Sans SC",system-ui`；英文/数字 `Inter, Geist, system-ui`；代码 `"JetBrains Mono", ui-monospace`。标题字重 600–700，正文 400–500。
- **圆角**：卡片/容器 `rounded-2xl`(16px)~`rounded-3xl`(24px)，呼应 logo 18px 圆角；按钮 `rounded-xl`。
- **间距**：section 垂直 padding 桌面 `py-28`、移动 `py-16`；内容最大宽 `max-w-6xl`（1152px）居中。
- **阴影/光**：暗色下用粉色/紫色低透明度 glow（`box-shadow: 0 0 40px rgba(255,111,145,.15)`），不用硬黑投影。
- **动效**：进场 `fade-up`（IntersectionObserver，translateY 16px→0 + opacity）；hover 微缩放/辉光；滚动视差克制；**必须**支持 `prefers-reduced-motion: reduce` 降级为无动画。
- **气质**：安全感（深色 premium）× 温度感（暖粉 + 伙伴）× 硬核感（工程/工作站）。**刻意避开**千篇一律的"AI 紫渐变 + 玻璃拟态满屏"。

---

## 5. 工程架构与目录约定（契约）

```
nomifun-portal/
├─ package.json            # astro, @astrojs/react, @astrojs/sitemap, react/react-dom, unocss, @unocss/astro
├─ astro.config.mjs        # integrations: react(), UnoCSS(); i18n: defaultLocale 'zh-CN', locales ['zh-CN','en-US'], routing prefixDefaultLocale:false
├─ uno.config.ts           # theme.colors 映射上面 token；presetWind3 + presetIcons(可选)
├─ tsconfig.json
├─ src/
│  ├─ styles/global.css            # CSS 变量(:root) + 字体 + 基础 reset + fade-up keyframes
│  ├─ i18n/
│  │   ├─ index.ts                 # t(locale, key)、getLocale(url)、localizePath()
│  │   └─ dict/                    # 每个区块/页面一个词条文件，避免并行冲突
│  │       ├─ common.ts            # 导航/页脚/通用 CTA（zh + en）
│  │       ├─ home.ts              # 首页所有区块文案
│  │       ├─ download.ts
│  │       ├─ contact.ts
│  │       └─ docs.ts
│  ├─ data/                        # 结构化数据（渠道/provider/ACP/能力等，含 i18n 字段）
│  │   ├─ channels.ts  providers.ts  acpAgents.ts  pillars.ts  roadmap.ts
│  ├─ components/
│  │   ├─ ui/                      # Button.astro Container.astro Badge.astro SectionHeader.astro Card.astro
│  │   ├─ layout/                  # Header.astro Footer.astro LangSwitch.astro ThemeMark.astro
│  │   ├─ sections/                # 首页各 section（.astro，命名见 §7）
│  │   └─ islands/                 # React 交互岛（.tsx，命名见 §6）
│  ├─ layouts/
│  │   └─ Base.astro               # <html lang> + SEO/OG + Header + <slot/> + Footer
│  ├─ content/                     # content collections：docs(md)
│  │   ├─ config.ts
│  │   └─ docs/{zh,en}/*.md
│  └─ pages/
│      ├─ index.astro              # 首页(zh)
│      ├─ download.astro  contact.astro
│      ├─ docs/[...slug].astro     # 文档动态路由 + 侧边栏
│      └─ en/                      # 英文镜像（index/download/contact/docs）
└─ public/
    ├─ brand/logo.svg favicon.svg  og-cover.png(待补)  wordmark-*.svg(待补)
    ├─ channels/*.svg              # 12 渠道 logo（从 tauri 复制）
    ├─ providers/*.svg             # provider/ACP logo（从 tauri 复制）
    └─ screenshots/*.png           # 复用 tauri docs/images（按需）
```

### 并行实现的契约规则（避免文件冲突）
1. **每个 section = 独立 `.astro` 文件**；**每个 island = 独立 `.tsx` 文件**。subagent 只创建/编辑自己负责的叶子文件。
2. **文案不写死在组件里**：全部走 `src/i18n/dict/*.ts`（同一文件内含 `zh-CN` 与 `en-US` 两份）。每个区块用各自的 dict 文件，互不交叉。
3. **结构化列表数据**（渠道、provider、ACP、能力点）放 `src/data/*.ts`，组件 import 渲染。
4. **页面骨架（`index.astro` 等）由 main agent 写**，import 各 section 组件（按本规格约定的文件名/路径）。subagent 负责把对应组件文件实现出来，**不改页面骨架**。
5. UnoCSS 原子类优先；自定义动画/复杂样式放组件内 `<style>` 或 `global.css`。
6. 所有交互岛必须接收 `locale` 与对应文案 props（或自带 dict），保证 i18n 切换生效；必须做 `prefers-reduced-motion` 降级。

---

## 6. React 交互岛规格（v1 五个）

文件位于 `src/components/islands/`。在 `.astro` 中以 `client:visible` 加载。

| 文件 | 名称 | 交互 | 数据源 |
|---|---|---|---|
| `CompanionDemo.tsx` | 桌面伙伴 | 粉色热气碗：悬停冒蒸汽动画；点击切换人格(活泼/沉静/俏皮)与角色名；旁边"技能进化"卡片打字机生成 | inline + props |
| `ChannelGateway.tsx` | 超级网关 | 11 渠道 logo 网格依次点亮；手机气泡演示"Telegram 下令 → 伙伴操作电脑"流程时间轴 | `data/channels.ts` |
| `CapabilityGateway.tsx` | 能力网关三轴 | 危险级×调用面 矩阵，hover 单元格高亮决策(Allow/Confirm/Deny)；强调"IM 写入永远进暂存区" | inline 矩阵 |
| `OpenApiTabs.tsx` | 开放能力 | 三 Tab：MCP(`/mcp`) / REST(`curl /v1/tools`) / OpenAPI；切换带打字机/高亮代码 | inline 代码样例 |
| `AutoWorkBoard.tsx` | 智能值守看板 | 需求卡自动从 Pending→InProgress→Done 轮转动画 + IDMM"值守"脉冲指示灯 | inline 模拟卡片 |

> 其余功能（知识库回写流、WebUI 扫码、模型/ACP 矩阵）v1 用静态组件 + 复用截图，预留 island 升级位。

---

## 7. 首页 section 清单（`src/components/sections/`）

页面 `index.astro` 按序 import：
1. `Hero.astro` — 定位句 + 7 价值速览(chips) + 主 CTA(下载/GitHub) + Hero 视觉(粉碗辉光)
2. `TrustBar.astro` — Apache-2.0 · 数据全本地 · 免费商用 · 接受审计 · 无广告无会员
3. `PillarSecurity.astro` — 数据安全与开源（all-in-local 示意 + "为安全做减法"叙事）
4. `PillarCompanion.astro` — 超级伙伴养成（含 `CompanionDemo` island）
5. `PillarGateway.astro` — 伙伴即超级网关（含 `ChannelGateway` island）
6. `PillarAutoWork.astro` — 智能值守 需求/AutoWork/IDMM（含 `AutoWorkBoard` island）
7. `PillarOpenCapability.astro` — 开放能力超级生态（含 `OpenApiTabs` + `CapabilityGateway` island）
8. `PillarUnified.astro` — config one use anywhere（知识库/skill/agent/mcp/模型；安全回写流）
9. `PillarNative.astro` — 更 native（自研浏览器/电脑操控 + WebUI 扫码）
10. `NomiAgent.astro` — 开箱即用 nomi agent（4 provider + 17 ACP 矩阵，复用 provider logos）
11. `Roadmap.astro` — 敬请期待（诚实呈现未上线/在途能力）
12. `CommunityCTA.astro` — 共建召集 + 商用告知 + 模型网关求助 + 底部大 CTA

每个 section 结构：`痛点钩子 → 一句话主张 → 3 能力要点 → 演示/截图 → 次级 CTA`。

---

## 8. 其余页面

- **`/download`**：诚实现状横幅（暂无官方预编译包）→ 三条路径卡（桌面源码构建 / Web 源码 / Docker 自托管）→ 平台占位卡（macOS/Windows/Linux，"即将提供"，预留二进制按钮）→ 系统要求 + 自托管指引（Caddy/systemd）。
- **`/contact`**：共建召集（贡献值/社区运营/布道者）+ 商用告知通道（"渴望一场认可，非授权"）+ 模型网关求助 + 渠道占位（GitHub/邮箱/社群 — 待补真实地址，先用占位常量集中放 `data/links.ts`）。
- **`/docs`**：侧边栏 + 内容区 + 站内搜索（轻量，pagefind 或前端过滤）+ i18n。v1 精选：快速上手(介绍/安装/第一次对话)、核心操作(伙伴/渠道/知识库/AutoWork/IDMM/终端/MCP&Skill/WebUI 远程/模型路由)。底部"完整技术文档 →"外链 Git。内容迁移自 tauri `docs/getting-started` + `docs/guides`（仅操作类，bucket B），改写为门户语气，**不照搬技术内幕**。

---

## 9. 资源策略

- **直接复用 tauri 资源**（copy 进 `public/`）：`logo.svg`、12 个 channel-logos、provider/ACP logos、`docs/images/*.png` 截图（按需挑选）。
- **需作者补充**（详见 `docs/RESOURCES-TODO.md`）：OG 分享图、横版 wordmark、真实联系方式（GitHub/邮箱/社群）、可选桌宠真机演示视频。缺失项一律用占位常量 + 占位图，不阻塞开发。

---

## 10. 验收

1. `bun install && bun run build` 通过，`bun run dev` 可本地预览。
2. 中英切换全站生效，无硬编码文案漏网。
3. 首页 5 个 island 交互正常，`prefers-reduced-motion` 降级正常。
4. 视觉符合 §4 token，移动端自适应。
5. 文案 100% 符合 §2 准确性红线。
6. 用 computer-use 打开本地 NomiFun 比对真实 UI，演示岛/截图与真实形态不矛盾。
7. 设计预留：内容数据与展示分离，便于后续大量反复修改。
```
