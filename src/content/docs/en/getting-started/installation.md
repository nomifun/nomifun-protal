---
title: Installation
description: The three paths available today — desktop from source, web from source, and Docker self-host.
category: Getting Started
order: 2
lang: en-US
---

NomiFun has two host modes that share one Rust backend. There are **no official prebuilt installers yet** — desktop bundles, Docker, and a native Linux service all build locally, but there is no public release channel. All three paths below start from source.

> For platform placeholders and system requirements, see the [download page](/en/download).

## Prerequisites

Whichever path you choose, you need a working build toolchain:

1. **Rust** (stable, edition 2024) — compiles the backend; desktop also compiles the Tauri shell. Install via [rustup](https://rustup.rs/).
2. **Bun ≥ 1.3.13** — frontend package manager and build (also a hard runtime dependency of the engine).
3. **Tauri CLI v2** — builds the desktop shell (pulled in as a devDependency, no global install needed).
4. **C/C++ build tools** — MSVC + WebView2 on Windows; Xcode CLT on macOS; `build-essential cmake clang pkg-config perl` on Linux.

## Steps

### A. Build the desktop app from source

1. Clone the repo, then run `bun install` to fetch JS dependencies.
2. For dev mode just run `bun run dev`: Vite serves on `localhost:5173`, cargo compiles `nomifun-desktop`, and the shell picks a free port to spawn the embedded backend.
3. For a release binary: first `bun run build:ui` to build the SPA into `ui/dist`, then `bun run build` to produce a standalone executable plus platform installers.

![Desktop app in dev mode](/screenshots/gs-02-desktop-dev.png)

### B. Build the web server from source

1. After `bun install`, run `bun run build:ui` (you must build the SPA before serving it outside dev mode).
2. `bun run serve:web` starts the service, binding `127.0.0.1:8787` by default.
3. Open `http://127.0.0.1:8787`; the first visit is routed to a setup page — the username and password you enter **become the initial admin account**.

### C. Docker / Docker Compose

1. From the repo root run `docker compose up -d --build` to build a GUI-less container image.
2. Visit `http://<server-ip>:8787`. The service uses `restart: unless-stopped`, so installing is effectively enabling autostart.
3. For public deployments, always pre-seed an admin (`NOMIFUN_ADMIN_PASSWORD`) and put TLS in front (the repo ships a `Caddyfile`).

## Verify your install

```bash
cargo check --workspace
curl -sS http://127.0.0.1:8787/api/auth/status
# → 200 {"success":true,"needs_setup":..., "user_count":...}
```

Full docs → [GitHub](https://github.com/nomifun/nomifun)
