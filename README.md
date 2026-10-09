# NomiFun 官方门户

以产品宣传为中心的 NomiFun 门户，使用 Next.js / React，静态导出，可部署到常规静态托管。支持简体中文和英语，首次访问默认英文。根目录是独立 Git 仓库，以当前源码快照作为初始版本。

## 本地运行

```powershell
npm ci
npm run dev -- --port 3107
```

打开 http://localhost:3107。构建命令 `npm run build` 先同步发布快照，再生成 `out/`。生产预览可运行 `npm run preview`，默认 3107 端口。开发与静态预览都提供与 Vercel 相同的双源版本接口。

## Git 与本地文件

`.gitignore` 排除依赖、构建产物、缓存、日志、环境变量、私钥与临时截图；`package-lock.json`、环境配置示例（`.env.example` / `.env.sample` 等）、`public/` 产品素材和 `docs/qa/` 验收证据保留在版本控制中。

仓库于 2026-10-03 以当前项目重新初始化，旧提交和旧版源码不再保留。既有验收文档描述的是当时的检查过程，其中已清理的参考截图无法再从本仓库 Git 历史恢复。

## 页面与内容

英文使用根路径，例如 `/`、`/products/desktop`、`/blog`；`/en` 及其内页也提供完整英文内容，canonical指向对应根路径。中文统一使用 `/zh` 前缀，例如 `/zh`、`/zh/products/desktop`、`/zh/blog`。顶栏和目录中的语言入口切换到同一页面，保留查询参数和锚点。页面语言由URL决定，根路径始终为英文，不依赖浏览器存储或客户端语言跳转。

两种语言及英文别名分别静态导出完整HTML、`html lang`、标题/摘要、Open Graph语言和canonical/hreflang，sitemap只收录26个规范内容地址。维护规则见 `docs/i18n.md`，英文素材来源见 `docs/english-assets.md`。

- `/`、`/en`、`/zh`：Desktop 产品首页。场景切换、能力装配、会话 Agent 接力、伙伴/记忆/渠道、IDMM 与持续工作、创作画布、小程序/无头插件、开发者架构、产品起源和生态弧形拖拽。
- `/products` 和五个产品详情：Desktop、Mobile、小智云台、Net Infra、Model Gateway。Model Gateway 面向社区与团队的自托管 Token 商业服务，包含模型接入、密钥、用量、钱包与订阅管理；服务由运营方自行部署、定价与运营。
- `/download`：每个操作系统卡片内直接提供 CrabNebula（推荐）与 GitHub 的安装包下载按钮。按来源、系统、架构及安装格式分别选择历史发布中最近可用的安装包，并展示安装包自己的版本；新版仅发布 macOS 时，Windows/Linux 下载仍保留。查询不完整或失败时保留已核实地址和原时间，补包后自动更新对应组合。源码区单独展示 GitHub / Gitee 仓库。
- `/blog`：可筛选的 Markdown 博客。文章放在 `content/blog/*.md`，自动生成详情页，`draft: true` 不发布。原起源文章保留为历史归档。
- `/contact`：真实邮箱、Issue、微信与 QQ 社群二维码，以及社交/项目入口。

核心编辑点：`components/sections/`、`lib/site.js`、`lib/i18n/`、`content/blog/`、`styles/`。文章的中文位于 `content/blog/`，英文位于 `content/blog/en/`，使用相同slug；按已有frontmatter填写title / description / publishedAt / author / tags / draft，再重新构建。英文没有中文正文回退。

官网中的交互演示仅解释产品设计，不会调用模型、执行任务、配置权限或连接设备。素材版本与来源见 `docs/assets-provenance.md`；产品宣传逐项证据见 `docs/product-evidence.md`；截图升级清单见 `docs/screenshot-manifest.md`。

## 参考源码与改编

最初从用户提供的原始参考工程（未随本仓库分发）复制 Next.js 工程、样式、组件与行为模块到当前目录，再替换全部产品文案/图片/导航并精简重构。

参考动效逐族映射到 NomiFun 内容：全幅 shader 与标签轮换、十格双面 3D 翻牌、250vh 双波图形穿越与平面点阵、真实界面滚动放大与画廊、500vh 横向工作流程、伙伴自动落牌、五张全屏 3D 创作压栈、420vh 扩张式液态导航与四区移动色场、大曲率惯性生态轮盘。按钮磁吸/覆层、逐字滚动导航、向上展开的磨砂目录、原则卡上滑、FAQ 自动高度与复制反馈也已接入。完整源码对照见 `docs/motion-reference-inventory.md`。

React 统一管理动画、监听和资源清理。桌面与手机保留工作横轨、创作叠卡和液态技术舞台；手机的自然高度内容由页面滚动从标题读到图景底部，完整阅读后再推进横移或叠卡，不产生演示内部滚动。减少动态效果时改连续阅读，系统偏好运行中变化会停止相应动画。首屏、伙伴轮播、工作演示、波形等提供手动暂停；画廊的非活动视频暂停。浏览器验证边界见 `docs/motion-qa.md`。

原模板的客户案例、评论、奖项、预约报价、表单占位接口、Google Tag Manager、搜索引擎验证 ID、原品牌元数据和媒体没有进入新版站点。没有分析或遥测脚本，字体和展示视频在本地目录。没有新增账号或后台服务。

模板目录没有提供明确授权文件；使用其设计/字体资产前，应由项目维护者核实实际获得的授权。本地原型采用用户提供资源，本文不声称拥有原参考站资产的独立再许可权。NomiFun 标志与产品素材保留原来源，Phosphor 图标使用 MIT 许可。

## 检查

```powershell
npm run build
npm run check:content
npm run check:i18n
npm run check:work-motion
npm run check:downloads
npm run check:release-service
```

`check:content` 检查双语导出页面的站内链接、锚点、图片/视频/字体。`check:i18n` 检查英文展示及ARIA漏译、语言链接、metadata、英文资源和路径辅助函数。初版内容验收记录保存在 `design-qa.md`；动效记录见 `docs/motion-qa.md`，双语最新验收见 `docs/i18n-qa.md`。

Vercel 使用 `npm run build:vercel`，将静态导出与一个 `/api/releases?source=github|crabnebula` Function 打包到 Build Output API v3。接口按源缓存约一分钟，解决 CrabNebula 元数据的浏览器跨域限制；安装包直接从对应发布平台下载。纯静态托管仍可使用 `out/` 及构建时快照。配置、缓存与本地验收步骤见 [下载版本同步与 Vercel 部署](docs/download-deployment.md)。

字体与组件可读性修正见 `docs/readability-audit.md`。`styles/polish-foundations.css`、`polish-platform-cards.css`、`polish-work-creative.css` 按正文、实际控件、辅助说明分级；手机长场景保持正常字号并随内容自然撑高，由页面承接纵向滚动。首页阅读dock在首屏之后出现，内页使用常驻顶栏，避免盖住主要动作。

当前标准桌面修正见 `docs/desktop-motion-layout-qa.md`：以 1920×1080、1440×900、1366×768 浏览器视口验收，不为当前非标准窗口增加专用布局。`styles/work-entry-refinement.css` 与 `creative-layout-refinement.css` 最后导入，优化首卡飞入时序与创作区完整展示，保留原有动态图形和互动。`check:work-motion` 验证五阶段停靠和运动边界连续性。全屏工作/创作舞台收起顶栏，避免反向阅读时遮挡顶部信息；底部目录保持可用。

最新创作区构图见 `docs/creative-visual-scale-qa.md`：星轨与唱片改为独立大图舞台，三个标准尺寸下约 420px／506px／623px，说明与完整演示组合在右侧，保留原 SVG 动效与聊天、波形交互。

手机动效与内部滚动的当前方案见 [mobile-motion-qa](docs/mobile-motion-qa.md)：`mobile-work.css`、`mobile-creative.css`、`mobile-developer.css` 与 `mobile-content.css` 在旧样式之后导入，分别处理可完整阅读的横向工作卡、自然高度叠卡、液态技术舞台、能力网格及扩展步骤。初次内部滚动修复的历史记录保留在 [mobile-scroll-qa](docs/mobile-scroll-qa.md)，其中将手机改为静态纵向阅读的方案已被本轮动效恢复替代。
