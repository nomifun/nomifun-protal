---
title: Installation
description: Install NomiFun on Windows, macOS, or Linux, or build from source and self-host with Docker.
category: Getting Started
order: 2
lang: en-US
---

NomiFun now ships desktop installers for Windows, macOS, and Linux. Most users should install the desktop app directly; choose the web service or Docker when you need an always-on server or access from other devices.

This page walks you through getting NomiFun onto your machine or server from scratch.

> **Download entry**: [GitHub Releases](https://github.com/nomifun/nomifun-tauri/releases). Choose `x64-setup.exe` for Windows, `universal.dmg` for macOS, or AppImage, `.deb`, or `.rpm` for Linux x86_64. Native build machines append platforms in sequence, so if the latest tag does not include yours yet, use the most recent release that does.
>
> For platform support and system requirements, see the [download page](/download).

| Desktop installers | Official Docker image |
| --- | --- |
| Download the Windows, macOS, or Linux desktop package from [GitHub Releases](https://github.com/nomifun/nomifun-tauri/releases). | Pull `nomifun/nomifun-web:latest` from [Docker Hub](https://hub.docker.com/repository/docker/nomifun/nomifun-web). |
| Best for a personal desktop workstation. | Best for a long-running web service on a server, NAS, LAN host, or VPS. |
| Choose `.exe` / `.dmg` / `AppImage` / `.deb` / `.rpm` for your OS. | `docker pull nomifun/nomifun-web:latest` |

## Install the desktop app

### Windows

Download `NomiFun_<version>_x64-setup.exe` and follow the installer. Windows 11 includes WebView2; on Windows 10 the installer guides you to fetch it if needed. The installer is protected by the Tauri updater signature but is not Authenticode-signed, so a manual download may show an unknown-publisher warning. Confirm that the file came from the official GitHub Releases page.

### macOS

Download `NomiFun_<version>_universal.dmg`, open it, and drag NomiFun into Applications. The universal build supports Apple Silicon and Intel and is signed and notarized for distribution.

### Linux

Linux x86_64 is available in three formats:

- **AppImage**: run `chmod +x NomiFun_*.AppImage`, then double-click or start it from a terminal.
- **Debian / Ubuntu**: `sudo apt install ./NomiFun_*_amd64.deb`.
- **Fedora / RHEL family**: `sudo rpm -i NomiFun-*.x86_64.rpm`.

The desktop UI requires WebKitGTK 4.1. If your distribution reports a missing shared library, install the corresponding `webkit2gtk-4.1` package first.

After launch, use **Check for updates** at the bottom of the sidebar to look for a newer version. The About area in System Settings also shows the installed version.

## Before building from source

You only need this toolchain when building from source. Skip this section when using a prebuilt installer.

1. **Rust** (stable, edition 2024) — compiles the backend; the desktop path also compiles the Tauri shell. Install via [rustup](https://rustup.rs/).
2. **Bun ≥ 1.3.13** — frontend package manager and build, and also a hard runtime dependency of the agent engine. `1.1.38` has a stdin bug — do not use it.
3. **Tauri CLI v2** — desktop path only; pulled in as a devDependency, no global install needed.
4. **Git** — to clone the repo; also used by skill discovery and several built-in tools.
5. **C/C++ build tools** — Windows: MSVC + the WebView2 runtime; macOS: Xcode Command Line Tools; Linux: `build-essential cmake clang pkg-config perl`.

On the machine that actually runs NomiFun, also install `ripgrep` (the code-search backend; falls back to `grep` when missing) and `node` / `npm` / `npx` (many MCP stdio servers launch via `npx -y …`). A build-only machine doesn't need those two.

Clone the repo and install JS dependencies once (re-run whenever `package.json` changes):

```bash
git clone https://github.com/nomifun/nomifun-tauri.git
cd nomifun
bun install
```

All commands below assume your working directory is the repository root.

## Steps

Choose one path for your use case. Pick A to compile the desktop app yourself; choose B or C for phone, LAN, or server access.

### A. Build the desktop app from source

The desktop app is a Tauri 2 shell that links the backend in-process and starts it on a free `127.0.0.1` port under a local-trust policy. The WebView receives a local-trust token generated on each launch, so the desktop window has no login screen.

1. **Run in dev mode**: `bun run dev`. The Vite dev server comes up at `http://localhost:5173`, cargo compiles `nomifun-desktop`, and the shell picks a free port, spawns the embedded backend, and loads the UI. The renderer hot-reloads.
2. **Produce a release binary**: first `bun run build:ui` to build the SPA into `ui/dist`, then `bun run build` to produce a standalone executable plus platform installers (under `target/release/bundle/`: `.msi`/`.exe` on Windows, `.app`/`.dmg` on macOS, `.deb`/`.AppImage` on Linux).
3. **Distribute a signed build** (optional): on macOS use `bun run build:signed` (signing keys required); Windows signing still needs an external code-signing certificate.

Once installed, launch the desktop app and open Settings → System Settings → About to see the current version number and confirm the install succeeded:

![The About page after install · shows the version](/images/en/设置/关于.png)

### B. Build the web service from source

`nomifun-web` is an axum service that mounts the same backend in-process and serves the built SPA on the same port (default `8787`). It suits self-hosting on a LAN, VPN, or VPS, and **requires login by default**.

1. Install dependencies and build the SPA: `bun install`, then `bun run build:ui` (mandatory before serving outside dev mode).
2. Start the service: `bun run serve:web` (equivalent to `cargo run -p nomifun-web`). It binds `127.0.0.1:8787` by default and uses the same per-user data directory as the desktop app.
3. Open `http://127.0.0.1:8787` in a browser. The first visit is routed to a setup page — the username and password you enter **become the initial admin account**, and everyone authenticates afterward.

To open it to your LAN and preseed the admin (skipping interactive first-run setup), use `--host 0.0.0.0` with `--admin-user` / `--admin-password`, and set absolute `--data-dir` and `--dist` paths explicitly:

```bash
nomifun-web \
  --host 0.0.0.0 --port 8787 \
  --data-dir /var/lib/nomifun \
  --dist /opt/nomifun/web \
  --admin-user admin \
  --admin-password "change-me-to-something-strong"
```

### C. Deploy the official Docker image

Official image: [nomifun/nomifun-web](https://hub.docker.com/repository/docker/nomifun/nomifun-web). The image includes the built SPA, `nomifun-web`, and required runtime dependencies, so it is the preferred Docker path for deploying the web service.

1. Pull the official image:

```bash
docker pull nomifun/nomifun-web:latest
```

2. Start the service and mount persistent data:

```bash
docker run -d \
  --name nomifun-web \
  --restart unless-stopped \
  -p 8787:8787 \
  -v nomifun-data:/data \
  nomifun/nomifun-web:latest
```

3. Visit `http://<server-ip>:8787`. The service is configured with `--restart unless-stopped`, so **installing it is enabling it on boot**. Persistent state lives in the named volume `nomifun-data` mounted at `/data` in the container — back it up like any other database.
4. For any public-facing deployment, preseed the admin (`NOMIFUN_ADMIN_USERNAME` / `NOMIFUN_ADMIN_PASSWORD`) and put TLS in front. When enabled, also set `NOMIFUN_HTTPS=true` so session cookies get the `Secure` flag.

If you need to customize Compose, Caddy, or image build settings, the repo still ships a multi-stage `Dockerfile` and `docker-compose.yml`; run this from the repository root:

```bash
docker compose up -d --build
```

## Notes and boundaries

- **The desktop app is a single-user tool.** The OS account that launches it has everything the agent can do, including shell and file access. The login-free window relies on the local-trust token, not on "no auth" — other processes that merely know the port are not trusted automatically.
- **Don't expose the desktop port directly for remote access.** To reach it from another device, use the in-app [WebUI LAN remote control](/docs/guides/webui-remote) (one-time QR scan, 5-minute token TTL) or deploy the [web service](#b-build-the-web-service-from-source) separately.
- **First-run window.** Until you finish setup, anyone who can reach the web service's port can claim the admin account. On a non-loopback bind the server logs a prominent warning; preseeding with `NOMIFUN_ADMIN_PASSWORD` closes that race window.
- **`--insecure-no-auth` is hostile by default.** It disables authentication entirely; use it only on loopback or a fully trusted private network. Running the backend remotely is, by design, equivalent to granting remote code execution on that host — auth + TLS is the floor.
- **Only one backend instance per data directory.** The backend takes an exclusive `server.lock` at startup; running `nomifun-web` bare on a machine that also has the desktop app fails fast because both point at the same directory. To run multiple instances, give each its own `--data-dir`.

## Verify the install

Run the quick check for the path you used:

```bash
# Source-build path: the Rust workspace compiles cleanly
cargo check --workspace

# Web service / Docker path: the host responds with the SPA + auth status
curl -sS http://127.0.0.1:8787/api/auth/status
# → 200 {"success":true,"needs_setup":..., "user_count":...}
```

If you see `nomifun-web: embedded backend + SPA on one port` in the logs and `/api/auth/status` returns JSON, the backend is up and the SPA is served on the same port. For the desktop app, the version shown on Settings → About is the source of truth.

## FAQ

**The window opens to a blank white screen.** Make sure the WebView runtime is installed — Windows 10 needs the WebView2 Evergreen Bootstrapper, Linux needs `libwebkit2gtk-4.1-0`.

**Agent commands fail with `bun: command not found`.** The agent engine spawns Bun to run tools. Ensure `bun` is on the system `PATH` (`curl -fsSL https://bun.sh/install | bash`), or build with `NOMIFUN_EMBED_BUN=1` to embed Bun into the binary.

**`Failed to bind backend port`.** Another process is holding the ephemeral port; quit any other NomiFun instance and retry.

## Related

- [Introduction](/docs/getting-started/introduction) — what NomiFun is and how the two hosts compare.
- [Quick Start](/docs/getting-started/quick-start) — your first session after installing.
- [WebUI LAN remote control](/docs/guides/webui-remote) — turn an existing desktop install into a QR-scan remote instance.

Full docs → [GitHub](https://github.com/nomifun/nomifun-tauri)
