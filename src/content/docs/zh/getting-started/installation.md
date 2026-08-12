---
title: 安装
description: 在 Windows、macOS 或 Linux 安装 NomiFun，也可从源码构建或通过 Docker 自托管。
category: 快速上手
order: 2
lang: zh-CN
---

NomiFun 已提供 Windows、macOS 与 Linux 桌面安装包。多数用户直接安装桌面版即可；需要服务器长期运行或从其它设备访问时，再选择 Web 服务或 Docker 自托管。

本页带你从零把 NomiFun 装到本机或服务器上。

> **下载入口**：[GitHub Releases](https://github.com/nomifun/nomifun-desktop/releases)。Windows 选择 `x64-setup.exe`，macOS 选择 `universal.dmg`；Linux x86_64 可选 `AppImage`、`.deb` 或 `.rpm`。不同平台的安装包会由各自构建机依次追加，如果最新标签暂时没有你的平台，请使用最近一个包含对应文件的版本。
>
> 想了解平台支持与系统要求，可参考[下载页](/zh/download)。

| 桌面安装包 | 官方 Docker 镜像 |
| --- | --- |
| 从 [GitHub Releases](https://github.com/nomifun/nomifun-desktop/releases) 下载 Windows、macOS 或 Linux 桌面安装包。 | 从 [Docker Hub](https://hub.docker.com/repository/docker/nomifun/nomifun-web) 拉取已发布的 `v0.3.4` 示例镜像；如 Docker Hub 有更新标签，请替换为更新版本。 |
| 适合个人电脑上的桌面工作台。 | 适合服务器、NAS、内网主机或云主机长期运行 Web 服务。 |
| 按系统选择 `.exe` / `.dmg` / `AppImage` / `.deb` / `.rpm`。 | `docker pull nomifun/nomifun-web:v0.3.4` |

## 直接安装桌面版

### Windows

下载 `NomiFun_<版本>_x64-setup.exe` 并按提示安装。Windows 11 已内置 WebView2；Windows 10 如缺失，安装程序会引导你获取。当前安装包使用 Tauri 更新签名，但没有 Authenticode 证书，手动下载时 Windows 可能显示“未知发布者”，请确认文件来自官方 GitHub Releases。

### macOS

下载 `NomiFun_<版本>_universal.dmg`，打开后把 NomiFun 拖入“应用程序”。Universal 安装包同时支持 Apple Silicon 与 Intel；正式发布包已经过签名与公证。

### Linux

Linux x86_64 提供三种格式：

- **AppImage**：下载后执行 `chmod +x NomiFun_*.AppImage`，再双击或从终端运行。
- **Debian / Ubuntu**：`sudo apt install ./NomiFun_*_amd64.deb`。
- **Fedora / RHEL 系**：`sudo rpm -i NomiFun-*.x86_64.rpm`。

桌面界面依赖 WebKitGTK 4.1。若系统提示缺少共享库，请先通过发行版包管理器安装 `webkit2gtk-4.1` 对应的软件包。

安装完成后启动 NomiFun；在侧边栏底部选择“检查更新”可查看新版本，系统设置的“关于”区域也会显示当前版本。

## 从源码构建前的准备

只有从源码构建时才需要以下工具链；直接下载安装包的用户可以跳过本节。

1. **Rust**（stable，edition 2024）——编译后端；桌面端还需编译 Tauri 外壳。用 [rustup](https://rustup.rs/) 安装。
2. **Bun ≥ 1.3.13**——前端包管理与构建，同时也是 agent 引擎的硬运行时依赖。`1.1.38` 存在 stdin 缺陷，请勿使用。
3. **Tauri CLI v2**——仅桌面端需要，作为 devDependency 引入，无需全局安装。
4. **Git**——克隆仓库；技能发现与若干内置工具也会用到。
5. **C/C++ 构建工具**——Windows 用 MSVC + WebView2 运行时；macOS 用 Xcode Command Line Tools；Linux 用 `build-essential cmake clang pkg-config perl`。

在实际运行 NomiFun 的机器上，还推荐装好 `ripgrep`（代码搜索后端，缺失时回退 `grep`）与 `node` / `npm` / `npx`（许多 MCP stdio 服务通过 `npx -y …` 启动）。构建机本身不需要这两项。

克隆仓库后，先安装一次 JS 依赖（后续 `package.json` 变动时重跑）：

```bash
git clone https://github.com/nomifun/nomifun-desktop.git
cd nomifun-desktop
bun install
```

下文命令均假设工作目录为仓库根目录。

## 操作步骤

按你的使用场景三选一。需要自己编译桌面端选 A；要从手机、局域网或服务器访问，选 B 或 C。

### A. 从源码构建桌面应用

桌面应用是一个 Tauri 2 外壳，在进程内链接后端，并在一个空闲的 `127.0.0.1` 端口上以本地信任策略启动它。WebView 会拿到每次启动生成的本地信任 token，因此桌面窗口没有登录界面。

1. **开发模式直接运行**：`bun run dev`。Vite 开发服务器起在 `http://localhost:5173`，cargo 编译 `nomifun-desktop`，外壳挑选空闲端口派生嵌入式后端并加载界面。渲染端支持热重载。
2. **出 Release 二进制**：先 `bun run build:ui` 把 SPA 构建到 `ui/dist`，再 `bun run build` 产出独立可执行文件与平台安装包（落在 `target/release/bundle/`：Windows 的 `.msi`/`.exe`、macOS 的 `.app`/`.dmg`、Linux 的 `.deb`/`.AppImage`）。
3. **分发签名构建**（可选）：macOS 用 `bun run build:signed`（需配置签名密钥），Windows 签名仍需外部代码签名证书。

装好后启动桌面应用，进入“设置 → 系统设置 → 关于”即可看到当前版本号，确认安装成功：

![安装完成后的“关于”页 · 可见版本号](/images/zh/设置/关于.png)

### B. 从源码构建 Web 服务

`nomifun-web` 是一个 axum 服务，在同一进程内挂载同一个后端，并在同一端口（默认 `8787`）上同时提供已构建的 SPA。适合在局域网、VPN 或 VPS 上自托管。它**默认要求登录**。

1. 安装依赖并构建 SPA：`bun install` 后执行 `bun run build:ui`（非开发模式提供服务前必须先构建）。
2. 启动服务：`bun run serve:web`（等价于 `cargo run -p nomifun-web`），默认绑定 `127.0.0.1:8787`，使用与桌面应用相同的按用户数据目录。
3. 浏览器打开 `http://127.0.0.1:8787`。首次访问会被引导到设置页——你输入的用户名与密码**将成为初始管理员账户**，此后所有人都需要登录。

要开放到局域网并预置管理员（跳过交互式首次设置），用 `--host 0.0.0.0` 配合 `--admin-user` / `--admin-password`，并显式指定 `--data-dir` 与 `--dist` 绝对路径：

```bash
nomifun-web \
  --host 0.0.0.0 --port 8787 \
  --data-dir /var/lib/nomifun \
  --dist /opt/nomifun/web \
  --admin-user admin \
  --admin-password "换成一个足够强的密码"
```

### C. 使用官方 Docker 镜像

官方镜像地址：[nomifun/nomifun-web](https://hub.docker.com/repository/docker/nomifun/nomifun-web)。镜像内置已构建的 SPA、`nomifun-web` 与运行所需依赖，是部署 Web 服务的优先 Docker 方式。下面示例沿用已发布的 `v0.3.4` 标签；部署前请查看 Docker Hub，如有更新标签，请将命令中的版本替换为对应标签。

1. 拉取官方镜像：

```bash
docker pull nomifun/nomifun-web:v0.3.4
```

2. 启动服务并挂载持久化数据目录：

```bash
docker run -d \
  --name nomifun-web \
  --restart unless-stopped \
  -p 8787:8787 \
  -v nomifun-data:/data \
  nomifun/nomifun-web:v0.3.4
```

3. 访问 `http://<server-ip>:8787`。服务配置了 `--restart unless-stopped`，**安装即等同于开机自启**；持久化状态存放在挂载到容器 `/data` 的命名卷 `nomifun-data`，请像其他数据库一样定期备份。
4. 公网部署务必预置管理员（`NOMIFUN_ADMIN_USERNAME` / `NOMIFUN_ADMIN_PASSWORD`），并在前面加一层 TLS。启用 HTTPS 后记得设置 `NOMIFUN_HTTPS=true` 让会话 cookie 获得 `Secure` 标记。

如果你需要改 Compose、Caddy 或镜像构建参数，仓库仍附带多阶段 `Dockerfile` 与 `docker-compose.yml`，可在仓库根目录执行：

```bash
docker compose up -d --build
```

## 要点与注意

- **桌面端是单用户工具。** 启动它的操作系统账户拥有 agent 的全部能力（含 shell 与文件访问）。桌面窗口免登录靠的是本地信任 token，而非「无鉴权」——只知道端口的其他进程不会被自动信任。
- **不要直接暴露桌面端口做远程访问。** 想从另一台设备访问，请用应用内的 [WebUI 局域网远控](/zh/docs/guides/webui-remote)（一次性扫码、token 5 分钟 TTL），或独立部署 [Web 服务](#b-从源码构建-web-服务)。
- **首次运行窗口期。** Web 服务在你完成设置前，任何能到达端口的人都可能认领管理员。非环回绑定时服务会打印醒目警告；用 `NOMIFUN_ADMIN_PASSWORD` 预置即可关闭这个竞态窗口。
- **`--insecure-no-auth` 默认是敌对选项。** 它完全禁用鉴权，仅限 loopback 或完全可信的私有网络。远程裸跑后端，本质上等同于给该主机开通远程代码执行——鉴权 + TLS 是底线。
- **同一数据目录只允许一个后端实例。** 后端启动时会取排他的 `server.lock`；在同时装有桌面应用的机器上裸跑 `nomifun-web`，会因为指向同一目录而快速失败。要并行多实例，请为每个实例指定独立的 `--data-dir`。

## 验证安装

根据你的安装路径做一次快速检验：

```bash
# 源码构建路径：Rust 工作区编译干净
cargo check --workspace

# Web 服务 / Docker 路径：主机响应 SPA + 鉴权状态
curl -sS http://127.0.0.1:8787/api/auth/status
# → 200 {"success":true,"needs_setup":..., "user_count":...}
```

若日志中出现 `nomifun-web: embedded backend + SPA on one port`，且 `/api/auth/status` 返回 JSON，说明后端已启动、SPA 在同一端口提供服务。桌面端则以「设置 → 关于」页显示的版本号为准。

## 常见问题

**窗口打开后是空白白屏。** 确认已安装 WebView 运行时——Windows 10 需要 WebView2 Evergreen Bootstrapper，Linux 需要 `libwebkit2gtk-4.1-0`。

**agent 命令报 `bun: command not found`。** agent 引擎会派生 Bun 执行工具。请确保 `bun` 在系统 `PATH` 上（`curl -fsSL https://bun.sh/install | bash`），或用 `NOMIFUN_EMBED_BUN=1` 构建以把 Bun 嵌入二进制。

**`Failed to bind backend port`。** 另一个进程占用了临时端口；退出其他 NomiFun 实例后重试。

## 相关

- [简介](/zh/docs/getting-started/introduction) —— NomiFun 是什么、两种宿主的取舍。
- [快速上手](/zh/docs/getting-started/quick-start) —— 装好后的第一段会话。
- [WebUI 局域网远控](/zh/docs/guides/webui-remote) —— 把现有桌面安装变成可扫码远程访问的实例。

完整文档 → [GitHub](https://github.com/nomifun/nomifun-desktop)
