# 手机动效恢复与滚动验收

日期：2026-10-10。本轮修正 `d8f789e` 将手机主要舞台静态化的问题。当前手机继续保留首卡旋入、工作横轨、创作 3D 叠卡、液态技术视角切换及色场移动；演示内容仍没有内部纵向滚动。

## 方案

1. **工作闭环**：保留 sticky 视口舞台与横向票券。卡片使用正常字号和自然高度，每张卡先由页面滚动带动纵向阅读，页脚到达可视区域后停留，再横移到下一卡。导航定位每卡标题，自动演示先读到底部再切卡。卡片或字体尺寸变化后重新测量阅读距离。
2. **创作区**：恢复自然高度 sticky 叠卡。高卡片从标题读到页脚后才停靠；下一卡随后带动原有缩放、rotateX / rotateY 退场。较短卡片将标题留在标签下方，末卡正常滚出。稳定位置按自然卡高和 gap 累加，不使用粘住后的 offsetTop。
3. **技术设计**：保留视口内的自然高度舞台。每个视角拥有顶部停留、完整阅读、底部停留的主页面距离，再进入下一视角；液态标签、面板淡入和渐变色场同步切换。顶部留 24px，底部留 104px，避免阅读浮条盖住末尾说明。手机舞台期间顶栏收起，逆向浏览不盖住标签。

三类舞台通过页面滚动揭示完整内容。用于镜头和圆角的 `overflow: clip` 没有可滚动区域，图景与面板保持 `overflow: visible`。没有用整体缩小文字、图景或永久裁掉超出内容来适配一屏。减少动态效果仍使用连续阅读，并清理动画、观察器和内联变换。

## 已验证的行为

- 中英文 320×568、360×667、390×844、430×932、768×1024、844×390、1000×700 共 14 组：首页普通内容内层纵滚为 0，document clientWidth 与 scrollWidth 相同，三类舞台均已启用 sticky，工作正文为 16px。
- 工作：标题顶部与页脚均能通过页面滚动到达。390px 英文页脚完整位于舞台内，横轨仍居中；滚动经过图景时 `scrollTop` 保持 0。五阶段导航、收据开合及播放控件保留。
- 创作：390px 中文实际退场帧出现 scale 0.8565、rotateX 8.6129°、rotateY −4.5936°；图景内部 scrollTop 为 0。画布加入音频后保持 4 个节点，并重新测量 sticky 停靠位置。
- 技术：390px 中文模型视角从顶部读到底部，舞台实际移动 −513px，最后的说明落在可视区域内；面板内部 scrollTop 为 0。顶部与底部均有停留距离。
- 工作说明与卡片标题未重叠：14 组视口的说明底部都在舞台顶部之前；320px 英文仍保留 11px 间距。
- 短横屏 844×390：阶段导航移到顶部，文案与图景并排，正文仍为 16px。舞台由 140px 增至 186px，完整标题位于舞台内，舞台底部 300px 与阅读浮条顶部 306px 分开，两个导航不再重叠。
- 桌面回归覆盖中英文 1366×768、1440×900、1920×1080，工作、创作、技术舞台保持 sticky，创作内容 clientHeight 与 scrollHeight 相同。手机与桌面来回切换后，viewport 包装、轨道和控制器分支恢复正常。
- 技术视角自动推进：从模型视角完整阅读后继续滚动，无需点击标签即进入协作视角；色场实际移动至 −1300px，面板内部 scrollTop 仍为 0。

## 证据

本轮截图和实际 DOM 数据位于 `docs/qa/mobile-motion/`，均来自当前内置浏览器。截图为原始 JPG，没有修改像素。

- [静态版基线](qa/mobile-motion/01-before-static-390-zh.jpg)，[基线位置数据](qa/mobile-motion/baseline.json)。
- [工作标题](qa/mobile-motion/02-work-title-390-zh.jpg)、[横移中段](qa/mobile-motion/03-work-footer-390-zh.jpg)、[闭环卡片](qa/mobile-motion/04-work-loop-390-zh.jpg)、[完整居中的英文页脚](qa/mobile-motion/08-work-footer-390-en.jpg)、[展开的英文收据](qa/mobile-motion/09-work-receipt-expanded-390-en.jpg)、[首卡旋入帧](qa/mobile-motion/10-work-entry-frame-390-en.jpg)、[短横屏并排布局](qa/mobile-motion/11-work-landscape-844-zh.jpg)。
- [创作 3D 叠卡帧](qa/mobile-motion/05-creative-stack-frame-390-zh.jpg)。
- [技术舞台顶部](qa/mobile-motion/06-developer-title-390-zh.jpg)、[图景与末尾说明](qa/mobile-motion/07-developer-bottom-390-zh.jpg)、[页面滚动自动进入协作视角](qa/mobile-motion/12-developer-auto-advance-390-en.jpg)。
- [验收测量](qa/mobile-motion/measurements.json)。

之前的静态方案与截图保留在 [mobile-scroll-qa](mobile-scroll-qa.md)，用于解释问题演变；它们不代表当前手机动效。

## 本地检查与证据边界

`npx next build`、`check:content`、`check:i18n`、`check:work-motion` 及修改文件格式检查通过。构建直接执行 Next，不改动下载发布快照。内容检查覆盖 40 HTML、995 个站内链接/锚点与 991 个资源引用。

工作纯几何检查增加了手机标题起点、完整页脚可达、阅读期间不提前横移、动态卡高、反向运动等断言，并保留原有桌面验证。截图与实际变换支持动效确实运行；本轮使用浏览器移动 CSS 视口和页面滚动，没有真实 iOS / Android 设备、帧率基准或系统减少动画模拟。减少动画分支另外通过源码审查确认。
