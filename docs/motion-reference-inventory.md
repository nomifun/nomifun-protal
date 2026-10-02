# 参考工程图形动效与 NomiFun 门户对应清单

审计日期：2026-10-02。参考源码：用户提供的原始参考工程（未随本仓库分发）。下表参考组件路径和事件 ID 均用于定位该原始工程。本文件记录参考源码实证、当前代码的实际对应和待完成的视觉验收。下面的“已实现”指组件/行为/样式已连接，不代表浏览器验收通过。源码核对不代替浏览器验收。

## 提取数据的范围与缺陷

- `lib/ix2-data.json` 有 75 个事件、33 个动作列表；`scripts/ix2-raw.json` 有 756 个事件、73 个动作列表，后者还包含原网站其他页面。
- 75 个事件不是 75 种独立效果。类别计数为：MOUSE_OVER 13、MOUSE_OUT 13、DROPDOWN_OPEN 1、DROPDOWN_CLOSE 1、SCROLL_INTO_VIEW 11、MOUSE_MOVE 12、SCROLLING_IN_VIEW 22、PAGE_SCROLL_UP 1、PAGE_SCROLL_DOWN 1。
- 按参考 React 组件的真实 `data-w-id` 和类名核对，75 个事件只有 22 个匹配当前首页（含 2 个 PAGE 事件），53 个指向旧节点。原始数据不可不加判断地复制。
- `scripts/extract-ix2.js` 根据页面 ID 前缀抽取事件，错误遗漏共享组件无页面前缀的真实首页事件：`e-2942 → a-259` 十格双面翻牌，`e-1887 → a-183` 共享 CTA 磁吸，`e-3246/3247/3248` 底部 CTA 磁吸和横向覆层，`e-3265` 顶部 CTA 磁吸。
- 参考的图形来自 GSAP、ScrollTrigger、Three.js shader、CSS 3D、SVG 滤镜、视频、轮播与灯箱。没有使用中的 Lottie 或 Rive。
- `lib/behaviors/gtm.js` 在首次互动加载 Google Tag Manager，是追踪代码，不属于图形效果。本次恢复不应引入原站追踪 ID、商业表单或营销数据。

## 大型舞台与图形机制

| 参考效果               | 原源码和核心参数                                                                                                                                                                          | NomiFun 实现与核对状态                                                                                                                                                                           |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 首屏背景影片与标签轮换 | `components/sections/Hero.jsx`：全幅 MP4/WebM 与渐变；标签 outin，间隔 4s、转场 500ms                                                                                                     | `Hero.jsx`＋`three-dots.js`＋`motion-extras.css`：全幅本地 WebGL shader 替换原商业影片，4s 标签轮换／500ms 显露；真实设备影片进入主动产品画廊。提供动效暂停，保留静态回退。                      |
| 十格双面 3D 翻牌       | `LogoSection.jsx`、raw `a-259`：perspective 500px；10 卡以 250ms 错开；初始延迟 1s，翻转 1s；Y 轴 0→180→360°；入视口循环                                                                  | `MotionExtras.jsx#MotionHighlights`＋`motion-extras.css`：10类真实能力/结果双面网格，500px透视、250ms错开、1s翻转，入视口循环、离屏暂停。                                                        |
| 双波浮动卡片穿越       | `ThreeHero.jsx`、`a-300`、`custom.css`：250vh track、100vh sticky、perspective 1200px；两波各 6 张；KF30 wave1 scale1/opacity1，wave2 .6/0；KF50 wave1 2.4/0、wave2 1/1；KF75 wave2 1.5/0 | `MotionPrelude.jsx`＋`prelude-motion.css`：250vh/100svh舞台，两波各6对象；30–50%第一波1→2.4退场、第二波.6→1入场，50–75%第二波1→1.5退场；保留中心说明和两波访问状态。                             |
| 浮动卡片抬起           | `custom.css`：hover y-8px、scale1.04，250ms                                                                                                                                               | `prelude-motion.css` 的 `.prelude-object-hover`：hover/focus抬起8px并放大1.04；水晶、知识、终端、伙伴、画布、设备等对象都有真实章节入口。                                                        |
| 鼠标唤起平面点阵       | `three-dots.js`：正交相机、InstancedMesh shader；间距 16px，点 2px，半径 240px；位置平滑 .12，强度进入 .15/离开 .08；alpha 为 pow(factor,1.4)                                             | `dot-field.js#initDotField`＋`MotionPrelude.jsx`：正交相机/InstancedMesh shader，16px网格、2px点、240px显影半径，.12位置平滑及.15/.08强度；离屏/后台停RAF，销毁GPU资源。与首屏shader分别保留。   |
| 大幅影片滚动放大       | `VideoSection.jsx`、`a-245`：KF0→50，scaleX .8→1、scaleY .9→1                                                                                                                             | `MotionExtras.jsx#MotionShowcase`：真实Agent工作台大幅图像scaleX .8→1、scaleY .9→1；灯箱收录两张创作截图与真实云台影片，素材均带来源/版本说明。                                                  |
| 影片鼠标标签           | `a-304`：鼠标轴驱动 `.view-work` ±50vw/vh；`a-263/264` 显示延迟 200ms＋300ms，隐藏 200ms                                                                                                  | `MotionShowcase` 的 `.showcase-hover-tag`：pointer坐标相对图像中心驱动350ms浮标；手机隐藏跟随层，整幅图像按钮与播放入口可直接点按。                                                              |
| 影片灯箱               | `lib/widgets.js`：点击 lightbox，独立 backdrop、视频容器与关闭入口                                                                                                                        | `MotionShowcase`：独立背景/画廊、进入动画、Escape、循环左右控制与方向键、焦点约束及回归；真实视频仅在主动打开后显示，关闭时卸载。                                                                |
| 大弧面惯性拖拽         | `WorkSection.jsx`、`arc-slider.js`：桌面 21°/手机 20°步距；transform-origin 50% 360%；scale 至少 .75；距1.8后渐隐、2.6后消失；最近5次速度样本，惯性180ms、吸附 .95s expo                  | `EcosystemSection.jsx`＋`arc-slider.js`＋`arc-motion.css`：4个开源产品，620×720大卡、360%圆心、21°/20°步距、原缩放/渐隐曲线；5样本速度平均×180、950ms expo吸附，支持最短循环方向和侧卡点击。     |
| 磁吸拖拽徽章           | `arc-slider.js`：鼠标位置平滑 .16；idle scale1、拖拽.88、离开.6；交互元素上透明度.15                                                                                                      | `arc-slider.js` 的磁性徽章：.16插值、idle1/抓取.88/离开.6、按钮链接上opacity.15；触摸/降动效隐藏，仅用于弧形舞台，不替代系统鼠标。                                                               |
| 横向首卡飞入           | `ApproachSection.jsx`、`a-306/307`：500vh；sticky100vh；轨道 left100vw；首卡 x45vw/y70vh/scale.62/rotate6°，KF15→20归位                                                                   | `WorkLoop.jsx`＋`work-motion.css`：500vh、100svh sticky，首卡从x45vw/y70vh/scale.62/rotate6°于15–20%落位；以需求登记进入真实产品工作回环的说明。                                                 |
| 横向长轨道与背景撤离   | 同上：卡宽桌面80vh/手机90vw；KF15/20、45、65、75轨道 x=-80/-160/-240/-320vh，手机 -90/-180/-270/-360vw；背景 opacity/scale1→0                                                             | `WorkLoop.jsx`：5个工作步骤大卡，按当前实际卡宽计算横移、背景退场；阶段导航、手动演示、回执展开与提需授权均可操作，明确为官网演示。手机保持横轨，降动效改连续阅读。                              |
| 扩张式液体导航舞台     | `AiSection.jsx`、`ai-tabs.js`：420vh track、top24px；1040×600，≥1400px为1160×670；前22%扩至vw-48/vh-48，后78%均分4视角                                                                    | `DeveloperSection.jsx`＋`liquid-stage.js`＋`developer-motion.css`：420svh轨道、top24px，前22%扩张、后78%四视角；模型/协作/数字行动/开放内核保留独立交互。                                        |
| 四区移动色域           | `ai-tabs.js`：5200×900 SVG，blur75px；每tab xPercent-25，850ms power2out                                                                                                                  | `DeveloperSection.jsx` 的5200×900 SVG＋`liquid-stage.js`：每视角移动1300px，850ms power2.out，珊瑚/紫/蓝/玫瑰与四面板匹配；不是只切换平面背景色。                                                |
| 真正 SVG 液滴桥        | `ai-tabs.js`：Gaussian blur2＋ColorMatrix alpha20/-10；白色pill→44×16桥→32×10落点；位置/宽/高450ms                                                                                        | `DeveloperSection.jsx` 的GaussianBlur2/ColorMatrix20,-10＋`.developer-liquid-goo`：白色pill、44×16桥、32×10落点；`liquid-stage.js`按tab实时测量，450ms变形移动。                                 |
| 空间面板过渡           | `custom.css`：panel opacity0/y8px/scale.985→1/0/1；400ms cubic(.16,1,.3,1)                                                                                                                | `developer-motion.css` 的 `.developer-liquid-panel`：opacity/y8px/scale.985空间过渡；四面板持续挂载、未选面板inert，保留原模型/规划/操作/架构控件。                                              |
| 水平模型/渠道 ticker   | `AiSection.jsx`、`a-303`：入视口循环，-100%→0，20s，瞬时重置                                                                                                                              | `MotionHighlights` 的 `.capability-ticker-track`：双份真实能力内容、20s无缝横向循环，hover暂停。12个IM渠道由伙伴区域如实说明，不冒充合作方或客户标志。                                           |
| 自动落牌卡组           | **`Projects.jsx`**、`deck.js`、`custom.css`：3.4s轮换；next y-68px/scale.95（手机-44）；退出y360px/scale.96/rotate.6°；650ms；hover暂停/点击/40px swipe                                   | `CompanionSection.jsx`＋`companion-deck-motion.css`：三伙伴牌组3400ms轮换、露头y-68px/scale.95、退出y360px/scale.96/rotate.6°、650ms；hover/focus/触摸/离屏/后台暂停，点击/40px滑动/方向键可选。 |
| 全屏3D连续压栈         | `ServicesStack.jsx`、`a-302`：5张sticky100vh＋结束卡；KF16/30/45/60/76/85；前卡scale1→.75、rotateX15°、rotateY交替±8°、y6–8%                                                              | `CreativeSection.jsx`＋`creative-stack-motion.css`：对话/图像/视频/音频/画布5张全高sticky卡，前卡退至scale.75/rotateX15°/rotateY交替±8°/y6–8%；真实界面与可操作对话、波形、画布共存。            |

## 菜单、卡片与微交互

| 参考效果             | 核心参数与定位                                                                                                          | NomiFun 实现与核对状态                                                                                                                                                                                   |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| CTA双层磁吸          | `a-183`：按钮X±10px、Y±8px，内部文字X±12px，smoothing90/rest50；原数据部分空target还含±50%位移                          | `micro-motion.js#initMicroMotion`：按钮X±10px/Y±8px、`.button-motion-inner`文字X±12px；限定fine pointer/768px，路由切换清理。未沿用原空target的±50%错误位移。                                            |
| CTA覆层横向擦入      | `a-175/173`：hover-bg -100%→0，200ms；退出300ms；箭头-45°→0，300ms                                                      | `motion-extras.css` 的 `.button:before`、`.header-download:before`：覆层从-101%横向进入、箭头-45°→0独立转向；`SiteShell`/`Hero`使用双层文字容器。                                                        |
| 作品卡底部遮罩       | `OurProjects.jsx`、`a-201/202`：y100%→0，400ms；opacity300ms；文字延迟200ms；离开先文字300ms、再延迟300ms滑退           | `MotionShowcase` 的 `.showcase-detail-reveal`＋`motion-extras.css`：底部说明上滑400ms、opacity300ms、文字延迟200ms；手机以直接操作的图像和固定说明替代hover遮罩。文章卡另有`micro-motion.js`的18px抬起。 |
| 平台卡整面上滑       | 参考工程的原则卡组件、`a-188/189`：platform-box y1%→-100%，600ms；light-border opacity1→0，400ms                              | `MotionExtras.jsx#MotionPrinciples`＋`motion-extras.css`：本地优先/代码开放/选择由你/电脑即服务4张原则卡，整张正面y1%→-101%/600ms，hover/focus显露后层说明；手机直接展示说明。                           |
| 支持卡上下错位       | `Membership.jsx`、`a-298/299`：y0→70px，300ms                                                                           | `micro-motion.js`：下载页`.download-card`内`.platform-mark`直接下移70px/300ms，并轻微转向；修复原参考错误的子support-card选择器，离开归位并清理tween。                                                   |
| FAQ自动高度与加号    | `Faq.jsx`、`a-229/230`：height0→auto400ms；垂线90°→0°，辅助图标0→45°；边框alpha变化                                     | `FaqSection.jsx`＋`motion-extras.css`：测量真实内容高度、400ms展开/折叠、图标/边框状态；原生button、aria-expanded/controls、折叠内容inert，完成后刷新滚动布局。                                          |
| 常规内容轮播         | `Testimonials.jsx`、`widgets.js`：translateX500ms、循环、30px swipe、左右控制                                           | `MotionShowcase` 产品画廊：translateX500ms、4幅循环、左右按钮/方向键；30px且横向大于垂向的touch swipe，避开视频/按钮并保留pan-y。内容全部为真实工作台与设备记录；真实触摸设备验收未完成。                |
| 顶栏方向升降         | `a-234/235`：上滚y0、下滚y-100%，700ms                                                                                  | `SiteShell.jsx`：下滚yPercent-100、上滚0、700ms；目录展开或顶栏包含键盘focus时保留入口，路由卸载清理监听/tween。                                                                                         |
| 全站方括号跟随       | `cursor.js`：min768px/fine pointer；左gap20/右27/y+6；quickTo120ms；difference白；interactive时150ms隐藏，离开200ms恢复 | 已按用户后续走查要求移除：删除方括号DOM、全局pointermove/pointerleave监听、跟随tween与CSS；使用系统鼠标，避免这一全站跟随层的卡顿。                                                                      |
| 底部dock菜单向上展开 | `menu.js`：height0→内容高度420ms power3out；内项y10→0/opacity，300ms、stagger30ms，提前250ms；关闭150ms内项＋350ms外壳  | `SiteShell.jsx`＋`motion-extras.css`：菜单height0→测量内容高度/420ms，项y10→0/300ms、stagger30ms；关闭reverse，保留dock、焦点管理、Escape与遮罩关闭。                                                    |
| 菜单磨砂遮罩         | `custom.css`：blur16px、背景alpha.25，350ms                                                                             | `SiteShell.jsx` GSAP timeline：背景autoAlpha＋backdropFilter0→16px/350ms；`motion-extras.css`提供背景alpha层；关闭反向播放并保留卸载时机。                                                               |
| 菜单文字逐字显露     | `menu.js`：18帧×20ms，bullet逐字恢复；Menu↔Close，icon250ms，top y4/45°与bottom y-4/-45°                                | `SiteShell.jsx`：目录/关闭18帧×20ms逐字恢复，dock两条线250ms转叉；降动效直接显示最终文字并清理计时器。                                                                                                   |
| 菜单逐字双层滚动     | `menu.js`：两层文字各字yPercent-100，260ms power2inout/stagger15ms；离开reverse                                         | `components/motion/RollText.jsx`＋`motion-extras.css`：两层逐字y-100%，260ms、15ms错开；导航/章节/CTA使用，hover和键盘focus均可触发，屏幕阅读器只读一次。                                                |
| 阅读进度             | `menu.js`：scrollY/总可滚距离                                                                                           | `SiteShell.jsx`：按scrollY/实际可滚距离计算，ResizeObserver随页面高度更新，dock显示百分比及目录入口。                                                                                                    |
| Lenis平滑滚动        | `lenis.js`：lerp.08、smoothWheel、touch不同步                                                                           | `lenis.js`＋`Behaviors.jsx`：smoothWheel、touch不同步、当前lerp.1；路由清理RAF/Lenis，`data-lenis-prevent`只分配给确需内部滚读的内容。参考.08调整为当前.1。                                              |
| 手动弹层             | `popup.js`原版≥1024px、30s一次、直接display flex，**没有精细图形动效**                                                  | 原`popup.js`的30秒营销自动弹出不恢复；当前主动弹层为`SiteShell`目录和`MotionShowcase`产品画廊，均由用户点击进入。该自动触发不是图形动效族。                                                              |
| 复制反馈toast        | `ai-links.js`：opacity/y10→0，300ms；3.5s后退出                                                                         | `SiteShell.jsx#copyOverview`＋`motion-extras.css`：真实剪贴板复制产品简介，成功/失败各有明确反馈；opacity/y10→0/300ms、3500ms后退场并清理计时器。                                                        |

## 重复与旧版原型的处理

- `a-183` 有11个磁吸实例；`a-175/173`各6个覆层进退实例，它们不是23种独立效果。
- `a-190/a-245/a-246` 的6事件为同一类影片缩放；当前参考首页靠类选择器 `e-2813` 运行。
- `a-248` 的12事件为相同半圆遮罩高度100px→0，当前参考首页节点全部悬空。当前以 `micro-motion.js` 的 `[data-motion-mask]` 重新绑定真实节点：半圆底缘 clipPath 裁切展开，FAQ 标题已使用；不复制原失效 ID。
- `a-243` 的3事件为15s圆形文案旋转360°，源节点悬空。当前落到 `MotionShowcase` 的 `.showcase-play-ring`，本地 SVG textPath 配合 `motion-extras.css` 的15s旋转，文案已替换为 NomiFun。
- `a-249/250`各2事件为播放按钮1→1.2、300ms/200ms，源节点悬空。当前 `.showcase-play-ring` 保留hover scale1.2，300ms进退，原播放对象改为主动产品画廊入口。
- `a-260/261/262` 三份聊天原型几乎相同：入视口30%循环，y10–20px/opacity0→0/1，300ms；逐条延迟0/750/1200/1600/2000/2300/2800/3200/3800/4200ms。源动作目标为空、节点悬空。当前 `micro-motion.js` 为 `AgentComposer.jsx` 的真实 `.relay-user/.relay-response` 添加20px/300ms/750ms错开的入视口循环、离屏暂停；三份旧原型合并为一个可切换 Agent 的对话接力演示，不把空动作对象当作已恢复。
- `a-203` 的2事件是50s服务marquee，源节点悬空。当前合并为 `MotionHighlights` 的真实能力双份ticker，使用20s循环；它与 `a-303` 同属横向marquee族，没有新增无内容的50s轨道。
- `slideInBottom` 两个事件仅为100px淡入，且源ID悬空。当前一般内容显露由 `Behaviors.jsx` 的 `[data-reveal]` 承担，控件所在块取消纵向位移；此类微动效独立于上面的完整图形舞台。
- `a-306/307` 是同一个横向舞台的桌面/手机版本。
- `Brand.jsx` 是静态品牌卡片。自动落牌必须以 `Projects.jsx` 和 `deck.js` 为依据。

## 液体舞台的实现边界

- 标题和本地数据宣言在滚动track之外，只出现一次；四段产品说明、供应商范围、授权要求、长期资源边界保留原文。
- 四个原生图形组件持续挂载，保留任务模型切换、规划/并行切换、Browser/Computer操作步骤、架构层选择。非活动面板不能获焦或被鼠标点击。
- tabs点击/方向键可滚到对应视角中心；窗口大小与字体变化重新测量，不用整体scale压小文字和控件。
- 手机上继续使用sticky和滚动切换，tabs保持四入口可见；过长面板独立滚读，边界可向页面传递滚动，不把整个舞台当作不可离开的滚动区域。
- `prefers-reduced-motion` 下取消长track和粘性，四面板连续展开供阅读与操作。
- 生命周期清理ScrollTrigger、GSAP、resize监听器和RAF；底层演示仍明确标记为架构交互示意，不声称连接了真实模型或操作系统。

## 当前实现的组合与证据边界

- 首页已在 `app/page.jsx` 串起 `Hero → MotionHighlights → MotionPrelude → MotionShowcase → AgentComposer → CompanionSection → WorkLoop → CreativeSection → ExtensionSection → DeveloperSection → StorySection → EcosystemSection → FaqSection → MotionPrinciples`。`app/globals.css` 末尾已导入各独立 motion 样式；组件内部 GSAP 和 `Behaviors.jsx` 的全站微交互分别管理生命周期。
- 大型动效保持各自机制：双波缩放穿越、局部显影点阵、首卡飞入横轨、自动下落牌组、全屏3D压栈、扩张色域/液滴tabs和真圆弧惯性拖拽。没有把这些不同机制合并成一种普通淡入。
- 内容重设计与时序微调在上表中明确记录。首屏原商业影片替换为本地全幅shader；真实演示归入主动打开的产品画廊。ticker展示可核对的产品能力。新图形用于说明产品设计，不能当作Desktop原生运行或真实任务执行的证据。
- 当前是源码对应核对。进入/离开/逆向、动态过程、手机尺寸、快速连续操作、路由往返、灯箱媒体与焦点等浏览器验收仍需按照下面的要点执行并记录；本文件不预先宣称通过。

## 视觉验收要点

1. 每个大型stage至少检查进入、中心、切换、离开、逆向滚动5个状态；不能只截图第一帧。
2. 确认内容能操作：tab、卡片链接、内部选择器、播放、灯箱关闭、FAQ、菜单与拖拽。
3. 320px、390px、平板、常见桌面、低高度窗口不整体压缩，重点检查遮挡、内部滚动、点击目标和横向溢出。
4. 页面跳转回首页、刷新中途位置、快速连续点击、方向键、reduced-motion不出现重复监听或失焦。
5. 所有文案、图形、影片与链接为NomiFun内容；原始参考工程的客户评价、价格、联络方式与追踪ID不进入门户。
