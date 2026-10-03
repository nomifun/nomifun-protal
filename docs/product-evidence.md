# NomiFun 门户产品证据与宣传边界

调研日期：2026-10-02。本文是门户编辑和开发的内部依据，不是新增文档中心，也不是产品全功能验收报告。

主要源码：`C:/Users/MINISFORUM/code/nomifun/main/nomifun-desktop`。调研时分支为 `rf/agent-capability-platform-v2`，HEAD 为 `cbbc647d13710f89d675ce540ff79eeb3316f66b`。以下 Desktop 路径相对该源码根目录，行号用于定位本次快照；修改产品源码后需要重新核对。

本轮已阅读源码及已有产品说明，没有运行 Desktop 的完整构建、真实模型调用、Windows/macOS 原生能力验收、性能基准或持续运行测试。门户中的模型路由、集群任务图、伙伴切换、扩展工作台等均是解释设计的交互示意；它们不向产品后端发送请求，也不能替代真实产品截图或运行证据。

首页专门呈现的对应关系：

| 用户重点 | 首页入口          | 专门内容                                                   |
| -------- | ----------------- | ---------------------------------------------------------- |
| 0        | `#story`          | 创立叙事与早期时间线                                       |
| 1        | `#agent`          | 能力装配台与同会话 Agent 接力                              |
| 2        | `#extend`         | 小程序/无头服务、四步体验、七个绑定入口                    |
| 3        | `#companion`      | 独立身份、记忆/知识、成长、12 IM、权限与机器人             |
| 3 / 13   | `#physical-world` | 个人 AI 伙伴从桌面、手机到小智云台；真实设备视频与接入条件 |
| 4        | `#work`           | IDMM 规则/旁路模型策略切换                                 |
| 5        | `#work`           | 需求 → 认领 → 执行 → 回执 → 授权提需与持续运行条件         |
| 6        | `#creation`       | 会话、图像、视频、音频和无限画布五种创作模式               |
| 7        | `#developers`     | “模型与协议”任务路由面板                                   |
| 8        | `#developers`     | “多 Agent 协作”规划/并行 DAG 面板                          |
| 9        | `#developers`     | “浏览器与电脑”双轨行动面板                                 |
| 10       | `#developers`     | “开放的内核”可点击架构层次                                 |
| 11       | `#developers`     | 本地数据与开放代码宣言                                     |
| 12       | `#developers`     | Rust + Tauri、按需能力、有界资源与性能测量边界             |
| 13       | `#ecosystem`      | 电脑即服务、手机/机器人直连和可选跨网网络层                |

## 用户重点 0–13 的逐项映射

### 0. 个人项目起源与早期创新

**用户给定信息：** 诞生于 2025 年 10 月，个人开发，从机器人大脑与 Coding 增强系统起步；2025 Q4–2026 Q1 陆续推出 IDMM、需求平台、自动工作与提需 Loop、机器人连接、伙伴和知识库。

**证据等级：** 创立日期、个人开发背景及早期时间线来自本次用户提供的项目叙事，本轮没有独立核验初次发布日期、各项首发日期或“行业领先/第一”的外部证据。当前对应功能的实现分别在下述条目核验。

**门户呈现：** 首页产品起源叙事及 Desktop 产品专页；表述为“2025.10，从一个人的机器人大脑想法开始”，早期发布区间注明为项目发起人提供的历程。不能把当前代码的存在推导成具体早期版本已经完整实现，更不使用“全球首创”等未经核验的排名。

### 1. 可视化能力组合与同会话 Agent 切换

**当前实现：** Agent 工作台分类展示能力模块，提供模块搜索、开关、依赖与冲突检查、逐操作授权及系统权限状态。配置同时包含能力、Skill、模型路由、人格和执行策略，经 Kernel 编译为执行快照。最简模板可精确不绑定能力、Skill、MCP 和资源；编程、伙伴、多模等模板提供组合起点。普通本地会话可保留会话身份、消息和输入草稿，在下一条消息开始前切换 Agent。

**源码定位：**

- `ui/src/renderer/pages/agentSettings/AgentCapabilityWorkspace.tsx:94,121,323,638`。
- `ui/src/renderer/pages/agentSettings/capabilityChanges.ts:8,15,31`：默认授权只读操作、依赖和冲突处理。
- `crates/backend/nomifun-agent-contracts/src/preset.rs:183,204`：Action allowlist 与完整 Agent 配置。
- `crates/backend/nomifun-agent-kernel/src/compiler.rs:318,363,775`：依赖编译与执行权限。
- `ui/src/renderer/pages/conversation/components/ChatConversation.tsx:291,312,351`：切换 preview/apply 链路。
- `crates/backend/nomifun-app/src/router/nomi_core_session.rs:11444,11955`：切换条件与校验。

**门户呈现：** 首页“能力装配台”与会话接力示意，Desktop 专页；推荐“按需要，组装你的 Agent”“同一段对话，从下一轮切换不同能力”。

**边界：** 执行中、仍有未结算效果/子进程、活跃集群等情况下不能切换；Remote 冻结、伙伴/渠道/画布等固定产品身份会话和 Attempt 审计会话不支持任意热切。交接事实是历史数据，新 Agent 仍要复核重要事实和工作区。

### 2. 无头插件、带界面小程序与系统 Hook

**当前实现：** 一个 `nomifun.plugin/v1` 扩展包可带 `UI`、`Service` 或两者兼有；服务支持按需或持续运行。统一的 Action + Binding 接入七个实际扩展点：Agent 工具、上下文、模型调用前、工具执行前、桌面命令、桌面事件、自动化动作。自然语言创建流程通过选择的 Chat 模型生成完整包，之后检查、预览、配置凭据并保存启用。

**源码定位：**

- `crates/backend/nomifun-agent-contracts/src/plugin.rs:64,72,113,164`：形态与七个 Binding 点。
- `crates/backend/nomifun-plugin-platform/src/service_runtime.rs:41,79`：每插件服务进程所有权、按需启动。
- `crates/backend/nomifun-plugin-platform/src/bindings.rs:791,833,850,906,950,966,982`：真实消费者分发。
- `crates/backend/nomifun-app/src/router/engine_plugin_bindings.rs:107,210,262,287`：Agent 工具/上下文/钩子消费。
- `crates/backend/nomifun-app/src/router/plugin.rs:1216,1245,1253,1296,1394,1556`：自然语言生成、包检查、预览及保存。
- `ui/src/renderer/services/i18n/locales/zh-CN/pluginPlatform.json:59`：远程 WebUI 只读边界。

**门户呈现：** 首页 `#extend`，可切换带界面小程序/后台服务、四步体验、七个入口探索；Desktop 专页。文案“描述想法 → 可视化预览 → 确认授权 → 启用扩展”。

**边界：** 当前统一插件体系整合了旧 MiniApp/Plugin 路径，不宣传旧 Project/Mount/Candidate/Release 体系。自然语言生成需要可用模型且会消耗模型额度；不保证任意复杂功能均零代码、零 token、零成本。Desktop App 可创建、导入和运行扩展，远程 WebUI 当前只读。进程分离不等价于经过验证的完整操作系统安全沙箱。

### 3. 可定制超级桌面伙伴、记忆、演进、IM 与机器人

**当前实现：** 每个伙伴具有独立 persona、Agent 能力、专属工作区和线程；使用完整 Agent 引擎。支持按伙伴保存、归档和检索记忆，并通过演进流程学习。可挂多个知识库。当前编译与工厂代码覆盖 12 个 IM 渠道，包含私聊/群聊准入、@机器人、审批名单、受限访客等控制。伙伴可连接物理机器人。

**源码定位：**

- `crates/backend/nomifun-companion/src/companion.rs:1,31,36,382`：Agent、工作区与记忆注入预算。
- `crates/backend/nomifun-companion/src/store.rs:40,87`：记忆归属与行级所有权。
- `crates/backend/nomifun-companion/src/archiver.rs:127,254`：按伙伴归档、摘要与上下文处理。
- `crates/backend/nomifun-companion/src/evolution/engine.rs:94,172,210,365,438`：演进与学习。
- `crates/backend/nomifun-companion/src/config.rs:11`：原始事件保留期和容量上限。
- `docs/guides/companions.zh.md:60`：知识库挂载说明。
- `crates/backend/nomifun-app/Cargo.toml:154`、`crates/backend/nomifun-channel/src/plugins/mod.rs:1,70`：12 渠道编译与工厂。
- `crates/backend/nomifun-channel/src/action.rs:196,238,271,311`：群聊、私聊与访客准入。

**门户呈现：** 2026-10-03 首页保留新 slogan 及原有“组装你的 Agent，遇见你的伙伴。从灵感到行动，让 AI 的强大能力，成为你触手可及的日常”核心副文案。按“首屏 → 能力速览 → 一个工作空间，打开 AI 的整个世界（`#possibilities`）→ 桌面伙伴（`#companion`）→ 真实设备（`#physical-world`）→ 后续工作台与能力专题”的顺序呈现。首屏探索入口指向能力总览，目录与正文顺序一致。设备专题沿用已有小智云台真实视频，说明同一伙伴在桌面、手机和实体设备中的身份与记忆连续性，并明确兼容硬件、固件、可信局域网配对及 Desktop 运行条件。伙伴专题保留独立记忆、共享知识、IM 连接和物理伙伴交互示意。

**官网验证（2026-10-03）：** 生产构建、`check:content`、`check:i18n`、`check:work-motion` 通过，校验覆盖 37 个 HTML 页面、884 个内部链接与锚点、916 个素材引用。浏览器核对 1440×900、1366×768、1024×768、390×844、320×640 下的首屏和新增设备专题；修正桌面首屏控件间距和英文窄屏场景按钮宽度。恢复原副文案后核对中英文显示和手机换行；重新排序后确认 `#possibilities` 的下一节为 `#companion`，再下一节为 `#physical-world`，并实际点选首屏探索和目录入口。已检查双语锚点切换、移动目录顺序、伙伴选择、设备 FAQ、产品入口和视频资源的 HTTP 分段响应。本轮未新增 Desktop 原生功能或设备实机验收证据。

**重要差异：** 用户提及的“共享记忆”概念在当前 `store.rs:40` 明确已移除：每条记忆属于一个伙伴。不能重新宣传成可配置共享记忆；共享知识库是当前可复用方式。“无限记忆”应呈现为归档与检索支持的持续记忆设计，不写成无限原始上下文或无限事件存储。默认原始事件保留 30 天、64 MiB，配置有上限。多伙伴低资源占用没有本轮基准数据；每窗口 WebView 等资源开销仍存在。

### 4. IDMM 旁路决策与低模型消耗

**当前实现：** 敏感输入停止处理；规则优先选择安全选项。仅在 `RulePlusModel` 模式、规则不足且满足条件时调用旁路模型；调用结果有大小预算。

**源码定位：** `crates/backend/nomifun-idmm/src/service.rs:490,502,514,635`；`src/detector.rs:168`。

**门户呈现：** 自动工作中的专门 IDMM 说明与策略交互，文案“规则值守，0 模型 token；必要时，再让旁路模型参与决策”。

**边界：** 0 token 指不调用模型的规则执行路径，不指整个工作任务、主 Agent 或所有 IDMM 模式都零消耗。本轮没有测量 token 节省比例，不宣传具体降幅；敏感动作与用户决策可能暂停自动推进。

### 5. 需求平台 + AutoWork + 自动提需 Loop

**当前实现：** 持久 runner 按“认领需求 → 注入执行 → 等待 → 完结 → 再循环”推进；支持启动恢复。已授权的 Agent 可通过 RequirementsWrite 创建需求，为自动工作与自动提需构成闭环。

**源码定位：** `crates/backend/nomifun-requirement/src/auto_work_runner.rs:1012,1277`；`crates/backend/nomifun-app/src/router/agent_wave5_host.rs:287`。

**门户呈现：** 自动工作循环专题，清楚展示“需求 → 工作 → 结果 → 新需求”的持续过程，提供 IDMM 辅助策略。

**边界：** 7×24 表示在满足运行条件下持续调度的能力设计。电脑必须持续运行，模型和所需服务必须可用；授权、审批、故障和额度可以导致暂停。需求为空会等待。不是本轮验证的 168 小时不间断运行保证。

### 6. 多模态会话工作台与无限画布

**当前实现：** 创作领域含图像、文本、视频、音频、时间线和组合节点；有对话、图像生成/编辑、视频、语音任务路由。画布有缩放、视口裁剪等机制，可定制创作组合与模板。

**源码定位：** `ui/src/renderer/pages/creativeStudio/domain/schema.ts:17,46`；`canvas/editor/CreativeCanvasEditor.tsx:1306,1703`；`canvas/product/CreativeCanvasAudioComposer.tsx:26,365`。上述后两个文件路径均相对 `ui/src/renderer/pages/creativeStudio`。

**门户呈现：** 创作专题、会话/画布模式探索、图像/视频/音频切换，用混合图形和真实截图表达内容创作的丰富性。

**边界：** “无限画布”描述无固定版面边界的创作交互，不承诺无限节点、内存或渲染资源。媒体生成需要支持相应任务的模型与配置；不同模型的模态能力不能相互替代。

### 7. 可扩展模型供应商协议

**当前实现：** 多模态调用按精确 `(provider_id, model, task)` 路由；协议决定传输、鉴权与端点。已注册多家供应商的图像、视频、语音、音乐、Embedding/Rerank 适配器。对话端实际具备 Anthropic、OpenAI Chat、OpenAI Responses、Gemini 适配器。

**源码定位：** `crates/backend/nomifun-model-invoke/src/lib.rs:3`；`src/adapter.rs:18,45,73`；`src/adapters/mod.rs:249`；`src/manifest.rs:511`；`crates/backend/nomifun-chat-model-broker/src/adapter.rs:360`；`crates/backend/nomifun-ai-agent/src/factory/provider_config.rs:206`。

**门户呈现：** 首页 `#developers` 模型任务路由示意；“选择模型，也选择它擅长的任务”。

**边界：** 源码中注册适配器不等价于所有提供商账户、地区、模型及实时协议均已验收。未注册协议会拒绝，不能写“任何供应商、任何模态即插即用”。

### 8. 多 Agent 即时规划与集群工作

**当前实现：** `agent/delegate` 支持 `planned` 完整目标自动分解和 `parallel` 显式独立任务。可增加依赖所有上游结果的只读汇总 Agent。AgentExecution 保存步骤、依赖、状态、输入及恢复事实，调度器控制并发。

**源码定位：** `crates/backend/nomifun-gateway/src/caps_agent_execution.rs:112,1119`；`crates/backend/nomifun-agent-execution/src/planner.rs:175,253`；`src/engine.rs:125,260,2596,2912`；`src/scheduler.rs:1,45`。

**门户呈现：** 首页 `#developers` 可切换自动规划/并行委派的 DAG，点击节点解释职责；“复杂目标，交给一支 Agent 团队”。

**边界：** 需要可用模型和授权；无效规划可回退为单步骤。默认并发 4、契约上限 64 是配置约束，不是本轮测得的性能承诺。网页动画不代表集群正在实际执行。

### 9. 自研跨平台 Browser Use / Computer Use

**当前实现：** 独立 Rust 浏览器引擎提供标签页语义观察、原生输入；Windows 使用 WebView2，macOS 使用 CEF/NSView。可显式连接已授权的默认 Chrome。Computer 具备语义树、截图、鼠标键盘、窗口和应用/文件启动能力，动作受冻结 Agent 权限检查。

**源码定位：** `crates/agent/nomi-browser-engine/src/lib.rs:1`；`src/attached_browser.rs:77`；`apps/desktop/src/browser_surface/mod.rs:5,13`；`automation.rs:418,501,509`；`macos/host.rs:25`；`host.rs:46`；`crates/agent/nomi-computer/src/tool.rs:52,160`；`src/capability.rs:140`。

**门户呈现：** 首页 `#developers` 中 Browser / Computer 双轨探索；“让 Agent 走出对话框：看懂网页、操作桌面，把想法推进为行动”。

**边界：** 当前完整产品可用性面向 Windows/macOS；Linux 存在底层组件不等价于完整可用产品。需系统权限、桌面环境及 Agent 授权。本轮没有原生验收。Chrome 连接不自动开启调试，不读取 Cookies/Login Data；不能扩写成任意浏览器直接接管。

### 10. 清晰、可扩展的 Runtime / 能力 / 插件结构

**当前实现：** Runtime 通过模型、工具、事件端口组合；宿主掌握权限、进程和会话历史，Runtime 执行任务与派生上下文。能力有规范化合同、依赖编译、执行快照；插件在明确消费者入口接入。

**源码定位：** `crates/backend/nomifun-agent-runtime/src/lib.rs:1`；`src/engine.rs:168`；`src/tool.rs:19`；`crates/backend/nomifun-chat-model-broker/src/engine_port.rs:19`；前述 Agent Kernel 与 Unified Plugin 文件。

**门户呈现：** 首页 `#developers` 可点击架构层次，代码仓库入口与技术博客；“开放架构，清楚的职责”。

**边界：** “代码简单”是主观判断，不作可量化保证；源码存在复杂的可靠性、授权、恢复和跨平台实现。官网突出可理解的职责与接口，不抹去真实复杂度。

### 11. 本地优先、无产品遥测、代码开源

**当前依据：** README 有无遥测产品声明。调研代理在 crates/apps/ui 源码搜索未发现第三方产品遥测集成；少数 telemetry 名称属于本地运行事件等语境。代码可公开查看与检验。模型、IM、Web 调研等能力按配置访问网络；更新配置存在外部 CDN，伙伴抠图模型存在 Hugging Face 下载地址。

**源码定位：** `README.md:54`；`apps/desktop/tauri.conf.json:50`；`crates/backend/nomifun-companion/src/matting_model.rs:30`；网络行为还见模型调用、渠道及 Web 能力源码。

**门户呈现：** 首页 `#developers` 本地数据宣言与 Desktop 专页；“本地优先，代码开源，无产品遥测。模型、IM 与联网工具，按你的配置连接外部服务。”

**边界：** 全本地存储不等于所有网络请求都不存在，旧 README 中“仅模型调用联网”的措辞已经不足以完整描述当前产品。本轮源码检索不是完整安全审计，不能绝对保证无后门、无漏洞或依赖供应链永远安全；开源提供可检验性。

### 12. 高性能、低资源、长期稳定的设计方向

**当前依据：** Rust + Tauri 本地架构，画布有视口裁剪，插件按需服务，Runtime/事件具备明确预算及有界机制。源码和既有设计体现对资源与持续执行的考虑。

**源码定位：** `apps/desktop/Cargo.toml` 与 `apps/desktop/tauri.conf.json`；`ui/src/renderer/pages/creativeStudio/canvas/editor/CreativeCanvasEditor.tsx:1306`；`crates/backend/nomifun-plugin-platform/src/service_runtime.rs:79`；`crates/backend/nomifun-agent-contracts/src/native_execution.rs:12`；`crates/backend/nomifun-companion/src/config.rs:11`。

**门户呈现：** 首页 `#developers` 本地原生架构说明；“Rust + Tauri，按需能力与有界资源设计”。

**边界：** 本轮没有启动时间、内存、CPU、电量、并发或长期运行基准，不生成虚构占用数字，不宣称经过 7×24 压测。能力选择、WebView 数量、浏览器、媒体任务、外部模型等影响真实资源占用。

### 13. 电脑即服务、手机与机器人直连

**当前依据：** Desktop 是数据和执行中枢，Mobile 局域网直连其认证监听器，机器人接入 Desktop。基础使用不需要额外应用服务器；跨网络可选自托管 NomiRelay，网络层不替代 Desktop 的数据和执行职责。

**源码/说明定位：**

- Desktop：`crates/backend/nomifun-app/src/desktop.rs:1,48`，进程内回环与按需 LAN 共用 Router，LAN 认证监听独立开关。
- Desktop：`crates/backend/nomifun-auth/src/qr_token.rs:10,80`，5 分钟有效的一次性配对凭证。
- Desktop：`docs/architecture/product-ecosystem.zh.md:13,16,39,41,52,61`，产品职责、可信局域网和可选跨网络中继。
- Mobile 源码根 `C:/Users/MINISFORUM/code/nomifun/main/nomifun-mobile`：`src/api/pairing.ts:4,85` 兑换 Desktop JWT；`src/api/client.ts:44` 连接所选 baseURL；`src/api/ws.ts:242` 绑定 baseURL 与 token。

**门户呈现：** 首页“电脑即服务”连接场景，`/products/mobile`、`/products/xiaozhi-yuntai`、`/products/net-infra` 独立介绍页；“可信局域网，电脑即服务，无需另外部署业务服务器。”

**边界：** 电脑必须运行，连接需要显式开启、配对与认证。局域网监听器不内置 TLS，应在可信局域网/专用 VPN 中使用。公网穿透、跨网络和自托管 Relay 有额外部署及安全条件，不能宣传为任何网络无配置直连。

## 资源与发布约束

- 用户提供的原始参考工程（未随本仓库分发）的介绍文案、客户案例、评价、供应商宣传图片和第三方营销目标不作为 NomiFun 产品证据。
- 本地 SVG/CSS 示意用于解释结构和交互；真实产品界面应来自明确版本的 Desktop 截图，不能把视觉示意标为实机截图。
- 供应商 Logo 如使用，只说明存在对应适配，不暗示所有模态、地区和模型已统一验收。
- 创立日期、历史时间线引用用户给定叙事；性能、稳定性、隐私与安全以本次证据范围表述。
- 官网交互示意只改变网页状态，不伪造模型执行、插件安装、权限授予、联系人消息发送或实际任务完成回执。
