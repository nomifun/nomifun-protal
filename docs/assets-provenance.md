# 门户资源来源

本清单记录本次门户重构中使用的真实媒体、历史文章，以及主动弃用的旧资源。首页的新截图与补拍要求由主界面资源清单补充。

## 小智云台真实演示

- 2026-10-03 按用户要求替换为其提供的本地录像 `6ada7b89d801b9955e65a91ac67c63b1.mp4`；提供日期不代表录制日期或固件版本。
- 原片：3,167,454 字节，1280×720，30 fps，24.68 秒；HEVC Main 视频与 AAC LC 单声道音频。SHA-256：`4c694bf202740d08342b34d94ec299f7dd1e09560e6ebc0712af1bd640ee54de`。
- 网页版本：`public/media/xiaozhi-yuntai-demo-7b67f896.mp4`，9,311,060 字节。为浏览器兼容性转为 H.264 High / Level 4.0、yuv420p，保留分辨率、帧率、完整时长与原音频流；MP4 启用 faststart，移除来源容器元数据。没有剪辑、变速、添加字幕或生成实物画面。
- 网页视频 SHA-256：`7b67f896641d5b565e58061f8c5bb93f16891d553018dbbc7e551a62ab65ae01`。
- 封面：`public/images/product/xiaozhi-yuntai-poster-ebc825a5.jpg`，从用户原片第 2 秒直接提取完整真实画面，1280×720，134,482 字节。SHA-256：`ebc825a593e1a861c14501078a2acc0242447d8faaa9202fc240581d3fb9c76c`。
- 首页设备专题、产品展示画廊、小智云台中英文产品页及能力总览设备卡共用 `lib/site.js` 的 `deviceDemo`。媒体文件名包含内容摘要，避免替换后继续命中旧视频或旧封面缓存。
- 页面继续以用户主动播放的 `<video controls playsInline preload="none">` 展示；该录像不主张对应当前最新固件或所有板型。旧片及其截图属于历史素材，`docs/qa/source-robot-fullscreen.png` 不再是当前封面的来源。

## 原始起源文章

- 新门户路径：`content/blog/nomifun-origin-story.md`
- 来源：`C:/Users/MINISFORUM/code/nomifun/main/nomifun-protal/src/content/blog/zh/nomifun-origin-story.md`
- 原标题、描述、作者、发布日期、标签与全部正文保留；仅补充 `category`、`readingTime`、`kind` 字段用于新博客列表。
- 原发布日期：2026-08-15。
- 新详情页显式显示历史归档说明。原文的版本稳定性、小程序规划与历史描述按原始语境保留，不能作为当前发行状态证明。
- 新增两篇技术文章为此次源码调研后编写；其精确实现依据指向 Desktop 固定提交 `cbbc647d13710f89d675ce540ff79eeb3316f66b`，而不是假定目录 `main` 就是 Git `main` 分支。

## 内页的交互示意

- 产品矩阵、Desktop 能力模式、Mobile 功能面板、机器人表情、网络拓扑与博客封面，使用 HTML/CSS 与 Phosphor SVG 图标绘制。
- 图形只解释真实产品能力与连接职责。模拟屏幕、示意机器人和连接图均标注交互/架构示意，没有伪装成运行截图或硬件实物照片。
- 交互通过点击按钮在本地切换，未连接模型供应商、设备或真实任务，也没有产生真实任务执行记录。

## 本次没有作为当前产品截图使用的旧资源

- Desktop `docs/images/SCREENSHOTS.md:4-5` 记载现有 README/Creative Studio 图集拍摄于 2026-08-25、基于 0.7.2。
- 旧 `workspace.png` 带有后续已经调整的召唤伙伴/小程序界面，不作为当前 Agent 设定或 Unified Plugin 运行形态的证明。
- 旧 Portal 的 `public/images/products/xiaozhi/hardware-schematic.png` 是第三方 ESP32 OLED Eyes/Wemos 原理图，不能代表 NomiFun 云台硬件实物。
- `public/images/products/xiaozhi/expressions.png` 是英语情绪表情参考拼图，不作为 NomiFun 机器人照片或当前产品资产展示。
- Mobile 旧素材存在空状态界面及拍摄时间不明确的历史截图。新产品内页使用明确标注的功能示意，当前版本截图可按补拍清单后续替换。

## 公开链接来源

仓库、Gitee 镜像、GitHub Releases、备用下载、邮箱与社交入口来自旧门户 `src/data/links.ts` 及 Desktop README，集中维护于 `lib/site.js`。下载页不写死版本、下载附件名称或不可核验的大小；所有系统按钮打开正式 Releases 供用户选择实际附件。邮箱使用当前门户配置 `535526063@qq.com`。

## 社群联系方式

2026-10-07 按用户要求，将联系页的企业微信群二维码替换为其提供的微信交流群原图 `codex-clipboard-17b55914-81d5-4a47-8d12-10eecad58082.png`。文件原样复制，751,241 字节，完整保留群名称、微信标志、二维码与底部有效期提示；原图注明“该二维码7天内(10月14日前)有效，重新进入将更新”。图片文件名包含内容摘要，避免浏览器继续命中旧图片缓存；页面名称、说明、替代文本与图片尺寸同步更新。中英文页面共用该图片。

QQ 二维码仍沿用 2026-10-03 从旧官网联系页 `https://www.nomifun.com/zh/contact/` 核对并保存的原始 PNG。QQ 群号为 `865887762`，来自官方 QQ 群二维码原图。

| 本地资源                                        | 来源                                                         | 尺寸      | SHA-256                                                            |
| ----------------------------------------------- | ---------------------------------------------------------------- | --------- | ------------------------------------------------------------------ |
| `public/images/contact/nomifun-wechat-group-9e898c22.png` | 用户于 2026-10-07 提供的微信群原图 | 1996 × 1934 | `9e898c22ef09c4de48fa55e6b7ae08efdc0fd37303a0f3b037ae0e313d91aaba` |
| `public/images/contact/nomifun-qq-group.png`    | `https://www.nomifun.com/images/zh/联系方式/qq-group/qr.png`     | 405 × 720 | `0cda04ef1b77755404c7ec1fea2a7448be32cab00573018642c2ecceba6795ec` |

## 2026-10-10 真实运行截图替换

- 来源：本机运行的 nomifun-desktop dev 实例（UI 由 nomifun-desktop/ui Vite dev server 提供，后端版本 0.8.3），通过桌面端 WebUI 远程访问入口（127.0.0.1:25808）以 admin 账号登录后，用 Playwright + Chrome 在 1440×900@2x 截取；Mobile 截图为 nomifun-mobile `bun run dev`（Expo Web + scripts/dev-proxy.mjs 代理到同一桌面实例）在 390×844@3x 视口截取。
- 桌面端画面是真实运行页面，不是组件 fixture：Agent 工作台（`/#/agent`，编程/Coding 预设）、无限画布创作页（`/#/nomi/canvases` 内图片/视频生成工具）、会话详情与需求平台。画布中两张海报为该 dev 实例既有的演示生成结果；截图时临时创建的空节点已在拍摄后删除，画布恢复原状。
- Mobile 画面为真实应用（连接同一桌面实例）：会话详情（与桌面伙伴"天天"的既有会话）、任务、伙伴三个标签页。截图中的会话与伙伴均为 dev 环境既有演示数据。
- 尺寸：桌面端图统一缩放至 1600×1000（16:10），手机端图缩放至 585×1266（≈9:19.5）。
- 文件清单：`public/images/product/agent-workbench.png`、`desktop-chat.png`、`desktop-canvas.png`、`autowork.png`（及 `en/` 英文变体）、`mobile-connected.png`、`mobile-tasks.png`、`mobile-companions.png`、`creative/image-workbench.png`、`creative/video-workbench.png`（及 `en/` 变体）。中英文变体分别在同一运行实例切换应用语言后拍摄；Mobile 应用本身以中文为第一界面，两语页面共用同一组截图。
- 用途：前三者继续作为首页示意位；desktop-chat/desktop-canvas/autowork 接入 Desktop 产品页"会话/创作/自动工作"三个标签；mobile-connected/mobile-tasks/mobile-companions 接入 Mobile 产品页"会话/任务/伙伴"三个标签，替换原 CSS 假列表。
- 旧素材处置：原 agent-workbench（fixture 测试数据图）与 image/video-workbench（2026-08-25 / 0.7.2 旧版界面）均被新文件原位覆盖删除，未保留占用空间的副本。
- 2026-10-10 二次更新：`creative/image-workbench.png`（中英文）重拍为画布内"当场生成"的图片节点编辑态——该图片素材是截图时实时调用 `agnes-image-2.1-flash` 生成（提示词"赛博朋克城市夜景中的小猫…"），非预置内容；`creative/video-workbench.png`（中英文）改为时间线编排界面（6 个真实素材 clip / 00:30），因 dev 实例可用视频模型（`agnes-video-v2.0`、`agnes-video-2.5-flash`）生成都返回 503 `model_not_found`（渠道未配置，健康检查仅测连通性），无法产出真实生成视频。时间线界面的素材 clip 全部为实例中 AI 生成的真实图片资产。
- 截图仅反映 dev 运行时的界面外观，不代表这些能力已在当前稳定版发布；图中不出现真实账号私聊、API Key 或个人文件。

## 首页与共享资源

- NomiFun 标志：复制旧 Portal 的 public/brand/logo.svg，未改品牌图形。
- Agent 工作台与创作图集已于 2026-10-10 更新为 dev 实例真实截图，见上方"真实运行截图替换"一节；早期 fixture 图与 0.7.2 版图集不再使用。
- 伙伴插画和能力连线为官网原生 SVG/HTML/CSS 交互示意；不是实物或原生运行截图。
- 英文字体沿用用户提供参考工程里的本地 Neue Montreal 字体。
- 2026-10-02 在线复核四个 GitHub 项目与 Releases 入口可访问；发布记录分平台提供安装产物，因此官网不锁定最新版本号与假附件。
