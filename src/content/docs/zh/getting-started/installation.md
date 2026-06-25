---
title: 安装
description: 目前可行的三条安装路径：桌面源码构建、Web 源码构建、Docker 自托管。
category: 快速上手
order: 2
lang: zh-CN
---

NomiFun 有两种宿主形态，共享同一个 Rust 后端。目前**尚无官方预编译安装包**——桌面包、Docker 与 native Linux service 都可本地构建，但还没有公开发布渠道。下面三条路径都从源码起步。

> 想了解平台占位与系统要求，可参考[下载页](/download)。

## 前置条件

无论哪条路径，都需要一套可用的构建工具链：

1. **Rust**（stable，edition 2024）——编译后端；桌面端还需编译 Tauri 外壳。用 [rustup](https://rustup.rs/) 安装。
2. **Bun ≥ 1.3.13**——前端包管理与构建（也是引擎的硬运行时依赖）。
3. **Tauri CLI v2**——构建桌面外壳（作为 devDependency 引入，无需全局安装）。
4. **C/C++ 构建工具**——Windows 用 MSVC + WebView2；macOS 用 Xcode CLT；Linux 用 `build-essential cmake clang pkg-config perl`。

## 操作步骤

### A. 从源码构建桌面应用

1. 克隆仓库后执行 `bun install` 安装 JS 依赖。
2. 开发模式直接 `bun run dev`：Vite 起在 `localhost:5173`，cargo 编译 `nomifun-desktop`，外壳挑选空闲端口派生嵌入式后端并加载。
3. 出 Release 二进制：先 `bun run build:ui` 把 SPA 构建到 `ui/dist`，再 `bun run build` 产出独立可执行文件与平台安装包。

![开发模式下的桌面应用](/screenshots/gs-02-desktop-dev.png)

### B. 从源码构建 Web 服务

1. `bun install` 后 `bun run build:ui`（非开发模式提供服务前必须先构建 SPA）。
2. `bun run serve:web` 启动服务，默认绑定 `127.0.0.1:8787`。
3. 浏览器打开 `http://127.0.0.1:8787`，首次访问被引导到设置页——你输入的用户名与密码**将成为初始管理员账户**。

### C. Docker / Docker Compose

1. 在仓库根目录执行 `docker compose up -d --build`，构建一个无 GUI 的容器镜像。
2. 访问 `http://<server-ip>:8787`。服务配置了 `restart: unless-stopped`，安装即等同开机自启。
3. 公网部署务必预置管理员（`NOMIFUN_ADMIN_PASSWORD`）并在前面加一层 TLS（仓库附带 `Caddyfile`）。

## 验证安装

```bash
cargo check --workspace
curl -sS http://127.0.0.1:8787/api/auth/status
# → 200 {"success":true,"needs_setup":..., "user_count":...}
```

完整文档 → [GitHub](https://github.com/nomifun/nomifun)
