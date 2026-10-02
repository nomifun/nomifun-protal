# 中英文优化验收

日期：2026-10-02。范围：门户页面、双语内容、素材、导航和动效交互；不代表Desktop原生功能、模型调用或硬件能力验收。

以下原验收记录描述2026-10-02的双语版本；当前路由规则已更新，见本文末尾的2026-10-03默认英文路由验收。

## 成品范围

- 中文保留原有URL，英文使用 `/en`。24个内容路由分别静态导出，另有统一双语404；合计25个HTML文件。
- 主页全部章节、4产品详情、产品矩阵、下载、联系、3篇博客及列表已支持两种语言。
- 动态内容覆盖首屏轮换、Agent预设/能力/接力、伙伴记忆/渠道/权限、工作回执/授权/IDMM、创作节点/波形、插件阶段/输入/授权、四架构视角及内层切换、弧形生态与博客过滤。裸写中文和翻译调用由独立AST复核；既有中文内部key仅用于状态判断。
- 顶栏和目录有语言入口。展示、ARIA、SVG文字、alt、placeholder和实际复制简介都本地化；语言选项自身与历史品牌引用用对应lang标记。

## 实际浏览器验证

| 检查             | 结果                                                                                                                                                                                                                            |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 文章语言往返     | `/en/blog/composable-agents?preview=1#main-content` 切中文后为同slug的 `/blog/...`，切回英语恢复 `/en/blog/...`；query与hash保留，html lang分别zh-CN/en，h1分别“让Agent的能力可以组合”／“Agent capabilities, made composable”。 |
| 语言记忆         | 英文选择后访问根 `/`，实际恢复 `/en`；明确点中文后保持 `/` 和zh-CN。重建后的head偏好恢复脚本亦实际复验，控制台没有error/warn。                                                                                                  |
| 英文菜单         | 顶栏及磨砂目录英文名称、章节、Menu/Close与语言选项正常；390×844目录边界left15/right375、top66/bottom761。                                                                                                                       |
| 英文架构舞台     | 1440×900四标签和内层“Delegate in parallel”正确更新英文结果；320×740四标签边界19.5–285.5px，页面scrollWidth305px，无横向溢出。                                                                                                   |
| 博客过滤         | Project stories过滤后实际1张卡，计数“1 article”，英语日期和文章摘要正常。                                                                                                                                                       |
| 工作流程         | 手机Verify阶段能打开英文回执；阶段dock bottom754px、全局dock top775px，保留间距。                                                                                                                                               |
| 英文创作素材     | Video阶段实际src为`/images/creative/en/video-workbench.png`，真实英文UI和历史版本说明可见。                                                                                                                                     |
| 创作按钮遮挡修复 | 390×844Video footer原被阅读dock遮挡；修复后top708.98/bottom743.22px，reading dock top775px，按钮完整可点。                                                                                                                      |
| 画布             | Add audio后实际显示Audio added；短内容的visual高446/scrollHeight450、scrollTop可到4，节点与说明可读。                                                                                                                           |
| 低高度对话       | 390×650Chat visual高286/scrollHeight353，实际scrollTop到66；footer top516/bottom550，全局dock top581，底部按钮不遮挡。                                                                                                          |

截图位于 `qa/i18n/`：英文首屏、目录、架构、博客、390px首屏/工作/创作/画布、320px液态舞台和低高度对话。只记录实际截图和读到的状态，动画中的瞬间不当作最终布局。

## 英文资源

1. 当前真实Agent工作台组件英语截图，1680×1050；明确标记Synthetic data only，不代表连接真实模型或执行任务。
2. 两张真实历史英文创作工作台截图，0.7.2 / 2026-08-25；原业务示例prompt保留中文，页面说明其原始语言。
3. 两篇技术文章完整翻译；起源故事复用作者已有英文原文，仅补元数据并标记中文品牌名的lang，历史声明保留。
4. 原生SVG/HTML图形内部标签、卡片背面、ticker和状态英文齐全。设备视频共用真实原片，英语标题/说明及原始设备录制性质明确；没有杜撰英语音轨或字幕。

来源和截图边界见 [english-assets.md](./english-assets.md)。产品源码HEAD已重新核对为`cbbc647d13710f89d675ce540ff79eeb3316f66b`，素材预览服务3121采集后关闭。

## 自动与服务检查

- `npm run build` 成功：29个生成项（含元数据）、25个HTML；首页First Load JS约266kB，属于构建统计，不作实际性能基准。
- `npm run check:content` 通过：602个站内链接/锚点、595个资源引用，无模板/追踪残留。
- `npm run check:i18n` 通过：12个英文内容页、英文文本/ARIA、站内语言链接、canonical/hreflang、3个独立英文资产、24个sitemap URL与locale path helper。
- 24个内容地址实际HTTP200；未知英语地址实际HTTP404、noindex且有双语恢复入口。
- 页面语言、日期、英文metadata与服务器/客户端locale保持一致。系统鼠标方括号组件没有重新加入。

## 验证边界

已进行浏览器的桌面、390px、320px和低高度布局及核心交互检查。未做实体触摸手机、读屏软件、全量WCAG认证、不同操作系统字体或页面性能基准。历史素材不代表当前发行版；官网演示不连接真实模型、插件或设备。

结果：中英文切换、完整内容与素材、本地生产构建和上述浏览器验收通过。

## 2026-10-03 默认英文路由验收

英文规范入口为 `/` 及根路径内页；`/en` 及其内页保留为英文别名。中文统一位于 `/zh`。语言由URL决定，已移除旧的浏览器偏好存储和首页语言跳转脚本。

- 生产构建成功：41个生成项（含元数据），37个HTML文件，包含12个规范英文页面、12个英文别名、12个中文页面与1个统一404。
- `check:content` 通过：869个站内链接/锚点、907个资源引用。
- `check:i18n` 通过：双语页面语言、全部canonical与hreflang、英文文本/ARIA、3个英文资源及24个规范sitemap URL；sitemap不重复收录 `/en` 别名。
- 静态HTTP实测：36个内容地址均为200，响应HTML已包含正确语言；三组未知地址均返回404、noindex与英文 `/` / 中文 `/zh` 首页入口。
- 浏览器实测首页往返：`/en?ref=language-default#agent` → `/zh?ref=language-default#agent` → `/?ref=language-default#agent`，语言依次为en / zh-CN / en。
- 浏览器实测文章往返：`/en/blog/composable-agents?preview=1#main-content` → `/zh/blog/composable-agents?preview=1#main-content` → `/blog/composable-agents?preview=1#main-content`，query与hash完整保留；英文别名canonical指向根路径文章，中文canonical指向对应 `/zh` 文章。

本次只验收语言路由、静态内容及语言往返；此前的视觉与动效记录仍按各自验收日期理解。尚未验收线上部署结果。
