---
title: Introduction
description: What NomiFun is, the problem it solves, and its two host modes.
category: Getting Started
order: 1
lang: en-US
---

**NomiFun** is a fully open-source, local-first "super AI workstation." It pulls multiple AI agents, the built-in nomi engine, model providers, MCP servers, skills, terminals, knowledge bases, and remote channels into one local workspace — all data stays local, free for commercial use, open to audit.

Real AI workflows get scattered across separate terminals, browser tabs, and scripts. NomiFun's goal is not another chat box, but to wire these runtimes into one workspace: one conversation surface for many agents, one model catalog reused everywhere, durable backend-driven automation, and a single backend shared by desktop and web.

![NomiFun landing page](/screenshots/gs-01-introduction-hero.png)

## Who it's for

NomiFun targets people already doing real work with agents. It expects you to understand API keys, local data directories, CLI agent installation, and self-hosting boundaries — it is not a zero-config SaaS chat product, but infrastructure you fully control.

## Two host modes

One Rust backend + one React frontend, two hosts:

1. **Desktop app `nomifun-desktop`** — a Tauri 2 shell that starts the backend in-process on a random loopback port; the window is trusted via a per-boot local trust token (no login). Best for a personal workstation and everyday dev.
2. **Web server `nomifun-web`** — a self-hosted axum service on `127.0.0.1:8787` by default, serving the SPA and API on one port, **login required by default**. Best for LAN / VPN / VPS self-hosting.

## Current version

NomiFun is at **0.1.0 (pre-1.0)** and under active iteration. It began as a fork of [AionUi](https://github.com/iOfficeAI/AionUi), since substantially refactored, and is released under **Apache-2.0**.

> This portal covers operational / usage content only — it does not duplicate the full technical docs or architecture internals on GitHub.

## Next

1. Read [Installation](/en/docs/getting-started/installation) to get it running.
2. Read [Your first conversation](/en/docs/getting-started/quick-start).

Full docs → [GitHub](https://github.com/nomifun/nomifun)
