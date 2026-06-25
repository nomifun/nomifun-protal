---
title: WebUI remote access
description: Expose the desktop backend over LAN behind a login; scan a QR with a 5-minute one-time token to drive it from your phone.
category: Core Guides
order: 5
lang: en-US
---

The desktop app already runs a backend on a loopback port for its own WebView — but putting an unauthenticated backend straight onto the LAN hands full shell, file, and agent access to every device on the network. **WebUI remote access** exists for exactly this: one click binds an extra **login-protected (password + QR)** listener on a stable LAN port, letting you use Nomi from a phone or another browser without giving up local-mode convenience.

It is **per-instance** — it lives inside the desktop app you're already running — and is distinct from a dedicated `nomifun-web` deployment. Use this when you already have a desktop install and just want to reach it from another device on the same network; use the dedicated server when you want a long-running headless deployment.

![Open-capabilities WebUI panel](/screenshots/webui-01-settings-overview.png)

## Architecture: two listeners, one backend

- A **permanent loopback listener** (random port) — the desktop's own WebView, trusted by the per-boot secret, always on.
- An **on-demand LAN listener** (`0.0.0.0:25808`) — bound only while you have remote access on; remote browsers hit this and must log in. Trust is by the **secret** (held only by the desktop WebView), not "came from loopback," so other OS accounts and same-host reverse proxies are not auto-trusted; it also enforces a Host/Origin allowlist (blocking DNS rebinding) and rate-limits by peer address.

## Steps

1. **Enable it.** In Open Capabilities (`/open-capabilities`), click Enable on the WebUI panel. The backend starts an auth server inside the desktop process (default port `25808`) and provisions an admin; the **initial random password is shown in plaintext exactly once** — copy it immediately.
2. **Get the access URL.** The displayed URL adapts: `http://localhost:<port>` on the host, `http://<your-LAN-IP>:<port>` remotely. On multi-NIC / VPN hosts, confirm the advertised address is the one your phone can actually reach.
3. **Scan to log in.** A QR code appears in the credentials card while the LAN listener runs. Scanning opens `…/qr-login?token=<one-time>` in your phone's browser. The token **expires in 5 minutes** and is single-use; the UI auto-refreshes the QR every 4 minutes.

   ![QR login on a phone](/screenshots/webui-04-qr-login-phone.png)

## Security notes

- The server listens over plaintext HTTP — use it only on a **trusted local network** (home Wi-Fi / VPN / Tailscale). To go beyond that, deploy `nomifun-web` behind a TLS reverse proxy instead.
- The admin has the same capabilities as the local desktop user (shell / files / agent execution) — treat the password and QR token accordingly, and don't post screenshots of the QR.
- Changing the password invalidates all existing sessions (the JWT signing key rotates atomically with the password).

Full docs → [GitHub](https://github.com/nomifun/nomifun)
