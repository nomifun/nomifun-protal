# 下载与源码入口验收

验收日期：2026-10-09（Asia/Shanghai）。当前工作区实现、本地静态预览和打包后的版本接口已验收，尚未部署到 Vercel 线上。

## 交付行为

- CrabNebula 中英文统一标记为推荐下载源。每个操作系统卡片内直接并列 CrabNebula 与 GitHub 下载按钮及各自版本；没有全局来源选择控件，也没有地域限定描述。
- 两源独立显示版本和实际核实时间。进入下载页、页面可见时每分钟、重新聚焦后及手动刷新都会检查版本；Vercel 接口按源缓存最多 60 秒，另有最多 60 秒的 CDN SWR 窗口。
- 下载行紧凑展示来源、推荐标签、各源版本及小按钮；没有安装包时使用短状态链接，不显示整行禁用大按钮。文件名、尺寸、核实时间收进每个系统卡片的原生“下载详情”，刷新失败仍在行内常驻提示。卡片按内容自然高度排列。
- 只列出正式发布中的安装包；处理器架构和格式可选。下载安装包、查看发布说明、打开源码仓库分别使用不同入口。百度网盘保留为可能延迟的备用分享。
- 下载使用 GitHub `browser_download_url` 或 CrabNebula 固定 `/asset/<id>`，保证附件对应所显示的来源与版本。两源共用系统卡片的架构/格式选择，直接点对应按钮即可下载；刷新保留选择，某一源缺少对应组合时显示短状态与发布页链接，两源均缺少原组合时要求重选。
- 请求失败保留构建快照或最近成功结果，并保留原核实时间。没有 JavaScript 时隐藏交互选择器，按操作系统提供两个来源所有已核实架构的普通下载链接。
- 产品详情、页脚与联系页分别显示 GitHub/Gitee 源码；Desktop 安装包入口单独指向下载页。

## 真实发布检查

本次构建及打包后 handler 实际读取：GitHub `0.8.2`，CrabNebula `0.8.2`。每源各有 macOS Apple Silicon / Intel 两个 DMG；最新发布没有 Windows / Linux 安装包。这两个系统的页面显示缺少附件，未猜测文件地址。

四个 DMG 直链均已通过 HEAD 验证：HTTP 200、`Content-Disposition: attachment`，文件名与来源/版本相符。CrabNebula 两个实际资产 ID 为 `01M4FP67BB5JAMFXNWP3JCY0K4` 与 `01M4FPB9EN409R8PXV0DPNF478`。此项检查没有下载或运行完整安装包。

GitHub 匿名 REST API 在本机返回 403，构建同步和运行时接口均成功通过同一仓库的官方发布网页回退取得最新版本及资产列表；回退和 API 共用 10 秒总预算。

## 浏览器流程证据

最新紧凑版使用 Codex in-app browser，桌面 1280×900、英文手机 390×900。实测桌面下载按钮 71×34 px，默认 Windows/Linux 卡片约 275 px、macOS 约 350 px；英文手机卡片约 299/378 px，无横向溢出。手机布局测试保留桌面浏览器 UA，没有模拟移动设备的操作系统识别。图片 01–10 为前两轮实现留档，当前证据为 11–13。

| 步骤              | 操作和结果                                                                                                                                                                           | 证据                                                            |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------- |
| 1. 原下载入口     | 旧版 Windows/macOS/Linux 都跳 GitHub 发布列表，无版本或直达附件选择                                                                                                                  | [原入口](qa/downloads/01-before-zh.jpg)                         |
| 2. 系统内多源     | 每个 OS 卡均有独立双源区；macOS 两个直链同时可见，CrabNebula 标记推荐；全局来源选择控件数量为 0                                                                                      | [桌面系统卡](qa/downloads/11-compact-desktop.jpg)               |
| 3. 架构与键盘     | 选择 Intel 后两个小按钮同时更新到各自的 Intel 直链；Tab 到推荐下载，焦点清晰；原生详情可用 Enter 展开和收起，折叠不影响下载                                                          | [英文手机系统卡](qa/downloads/12-compact-en-mobile.jpg)         |
| 4. 语言与手机布局 | 中文桌面与英文手机都推荐 CrabNebula；均无地域描述，手机无横向溢出，原语言路由与别名检查通过                                                                                          | [英文手机系统卡](qa/downloads/12-compact-en-mobile.jpg)         |
| 5. 代码与下载     | Desktop 产品页仍依次展示下载安装包、GitHub 源码、Gitee 源码；页脚及联系页源码入口保留，链接/双语检查通过                                                                             | [产品页按钮](qa/downloads/05-product-actions-mobile.jpg)        |
| 6. 模拟发布不同步 | GitHub 8.4.0 x64、CrabNebula 8.3.0 arm64 在同一 OS 内各自显示；选择 Intel 时 GitHub 直链可用、CrabNebula 缺该架构按钮禁用，反之同样正确                                              | [模拟服务器](../scripts/serve-download-fixtures.mjs)            |
| 7. 模拟刷新与故障 | 刷新后 CrabNebula 为 8.5.0/new asset ID，Apple Silicon 选择保持且直链更新；GitHub 503 保留 8.4.0 与原检查时间，折叠详情时行内失败提示仍可见，重新选 Intel 可直接下载已核实 GitHub 包 | [卡片内模拟故障](qa/downloads/13-compact-simulated-failure.jpg) |

模拟数据只用于异常分支测试，未点击模拟安装包链接，没有访问真实上游；模拟服务器已停止。无 JavaScript 的四个普通安装包链接已在导出 HTML 中检查，未在禁用 JavaScript 的浏览器中另做运行验收。

## 构建与接口检查

以下全部通过：

```sh
npm run build:vercel
npm run check:content
npm run check:i18n
npm run check:work-motion
npm run check:downloads
npm run check:release-service
node scripts/check-release-service.mjs --packaged --live
git diff --check
```

静态输出为 37 个 HTML 页面；内容检查覆盖 884 个内部链接/锚点、919 个资源引用。语言检查覆盖 24 个英文页面（含别名）和 12 个中文页面。Vercel 包包含 151 个静态文件、36 条内容页面映射和一个 Node Function；打包后接口实际取得两源数据。开发服务的中文下载页及两个同源 API 也均返回 HTTP 200。

测试覆盖安装格式/架构筛选、来源隔离、固定版本地址、刷新时处理器保持、缺包重选、原核实时间保留、2 MiB 大小和超时限制、并发刷新去重、缓存有效期、查询/方法约束、失败恢复、GitHub HTML 回退失败及新旧 tag 错配。部署步骤与线上验收入口见 [Vercel 下载部署说明](download-deployment.md)。
