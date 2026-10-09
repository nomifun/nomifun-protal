# 下载版本同步与 Vercel 部署

官网保留 Next.js `output: "export"`。`npm run build` 仍生成 `out/`，所有页面、语言路由和安装包选择界面都预渲染为静态文件。Vercel 的部署构建额外通过 `scripts/package-vercel.mjs` 生成 Build Output API v3：

```text
.vercel/output/
  config.json
  static/                         ← out/ 的完整副本
  functions/api/releases.func/
    .vc-config.json               ← Node.js 22，最长 15 秒
    api/releases.mjs
    lib/release-service.mjs
    lib/downloads.mjs
    lib/download-catalog.mjs
    lib/release-history.mjs
    lib/releases-snapshot.json
    lib/github-release-html.mjs
```

`/api/releases` 是唯一动态接口。静态页面与该接口使用同一个域名，浏览器无需直接跨域请求 CrabNebula；安装包继续由 CrabNebula CDN 或 GitHub 直接提供，官网不代理二进制文件。

中英文下载页都将 CrabNebula 作为推荐下载源。每个操作系统卡片内直接显示 CrabNebula 与 GitHub 的下载按钮，以及各自的版本和安装包；用户选择架构或安装格式后即可从对应来源下载。多个下载源提供备用入口，各来源的版本独立同步，发版时间差不会改变另一来源显示的版本。

安装包按“来源＋操作系统＋处理器架构＋格式”独立查找最近可用版本，不绑定来源的整体 latest。例如整体最新版只有 macOS 0.9.0，而 Windows 最近有包的是 0.8.2，Windows 的按钮继续下载并显示 0.8.2。每个安装包保留自己的 `version`、`publishedAt`、`releaseUrl` 和 `checkedAt`；来源顶层版本仅描述整体发布，不能用于替换安装包显示版本。

GitHub 查询公开历史发布（API 限流时使用同一仓库的历史发布网页）。CrabNebula 没有可公开枚举的历史版本列表，使用 GitHub 公开正式版本及快照已有版本作为候选，再向 CrabNebula 自己的公开接口读取对应历史版本；只有其返回的真实正式发布附件会进入该来源的目录，两个来源不复制安装包或版本。CrabNebula 的发布说明继续使用公开总页，不构造未经支持的历史网页链接。

历史查找受 10 秒总期限、4 页／40 个 GitHub 正式版本、20 个 CrabNebula 候选和每来源 4 个并发请求限制，每次响应最多 2 MiB。`historyComplete` 表示能否证明已枚举完整目录，`partial` 表示请求失败、超时或达到查找上限；CrabNebula 候选查找成功时 `historyComplete: false` 并不等于刷新失败。未查到的既有系统组合保留原地址、版本与核实时间，并标记 `retained`；真正补传新包后对应组合自动更新。构建同步、服务端冷启动／缓存与浏览器刷新都使用同一合并规则。

## 构建与托管配置

仓库的 `vercel.json` 设置 `framework: null`（Vercel 的 Other 预设）和 `buildCommand: "npm run build:vercel"`。这让仓库自己的适配脚本负责部署产物，避免 Next.js 的自动适配器把全站改为服务端部署。不要把 Output Directory 设置为 `.vercel/output/static`，否则只部署静态副本会遗漏接口；使用 Vercel 对 `.vercel/output/config.json` 的 Build Output API 识别。

```sh
npm ci
npm run build:vercel
node scripts/check-release-service.mjs --packaged
```

构建步骤依次执行现有静态导出及 Vercel 打包。打包只替换本仓库生成的 `.vercel/output`，保留 `.vercel/project.json` 等部署关联信息。清洁路径 `/zh/download`、`/en/download`、`/products/desktop` 等仍映射到导出的 HTML，未知路径返回静态 404。

纯静态托管可以继续上传 `out/`。没有 `/api/releases` 时，界面保留随构建发布的版本快照及对应的固定安装包地址，并提示刷新失败。手动更新快照使用 `npm run sync:releases`；这与访问时同步是两个独立途径。

## 接口行为

| 请求                                       | 结果                                                   |
| ------------------------------------------ | ------------------------------------------------------ |
| `GET /api/releases?source=github`          | 该平台最新正式版本、发布时间、实际检查时间及安装包列表 |
| `GET /api/releases?source=crabnebula`      | CrabNebula 自己的最新正式版本及安装包列表              |
| 缺少来源、未知来源、重复来源或额外查询参数 | 400，不请求上游                                        |
| 非 GET 方法                                | 405，`Allow: GET`                                      |
| 上游不可用、数据不合法或超时               | 503，`stale: true`，`Cache-Control: no-store`          |

两个来源独立请求、独立缓存及独立失败，不比较版本后把一个来源的安装包贴到另一个来源的版本上。接口仅访问代码内固定的官方公开地址，不接受用户 URL，不需要发布凭证。

每个来源在同一暖进程中缓存 60 秒，并复用并发刷新。成功响应的 `s-maxage` 是内存缓存剩余秒数（最多 60 秒），CDN `stale-while-revalidate` 限制为 60 秒；缓存命中保留实际的 `checkedAt`，不会把旧检查改为当前时间。CDN 更新存在短暂延迟，不能保证发布后立即全球可见。错误响应明确失败，客户端保留构建快照或最近一次成功结果。

接口的上游请求总预算为 10 秒。GitHub 公开 API 遇到限流或失败时，可使用同一官方仓库的公开历史发布页读取版本与安装包，不添加 Token。若最新查询失败但取得有效历史，返回部分目录并保留更近的已核实记录；所有查询均失败时返回 503，由客户端保留已有数据。查询范围不足以证明某系统没有安装包时，界面显示“未找到”，不会把未知结果写成“未提供”。

## 本地验收

开发服务和静态预览复用 `api/releases.mjs` 的同一个 Node handler，所以本地与 Vercel 使用相同的版本解析、缓存和失败语义。可以分别启动 `npm run dev` 和 `npm run preview` 检查页面及两个同源来源。

```sh
node scripts/check-release-service.mjs
node scripts/check-release-service.mjs --packaged --live
```

第一条用本地 HTTP 请求验证固定上游、来源隔离、并发去重、缓存时间、限流失败、恢复和超时；第二条还检查生成的静态页面映射、复制内容、函数依赖完整性，并从打包后的 handler 访问真实上游。真实上游检查受当时网络及平台可用性影响。

本地打包及真实上游通过不等于已完成线上部署。发布后的验证应检查两个 `/api/releases?source=…`、中英文下载页、固定版本安装包地址和未知页面的 404；无需为此添加 GitHub Actions。

## 部署规范依据

Vercel 官方支持静态文件与 Node Functions 放在同一个 Build Output API 目录中，并按 `.func` 路径映射接口；参见 [Build Output API](https://vercel.com/docs/build-output-api)、[静态文件与 Functions 规范](https://vercel.com/docs/build-output-api/primitives) 和 [输出路由配置](https://vercel.com/docs/build-output-api/configuration)。`framework: null` 与自定义 Build Command 的含义见 [vercel.json 官方文档](https://vercel.com/docs/project-configuration/vercel-json)。官方 [static-build 实现](https://github.com/vercel/vercel/blob/main/packages/static-build/src/index.ts) 在构建结束后优先识别 Build Output API v3，发现产物后直接使用该输出。
