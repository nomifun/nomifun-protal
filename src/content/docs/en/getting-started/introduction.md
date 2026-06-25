---
title: Introduction
description: What NomiFun is, who it's for, its two host modes and current version, plus a look at the main UI.
category: Getting Started
order: 1
lang: en-US
---

**NomiFun** is a fully open-source, local-first "super AI workstation." It pulls multiple AI agents, the built-in nomi engine, model providers, MCP servers, skills, terminals, knowledge bases, and remote channels into one local workspace — all data stays local, free for commercial use, open to audit.

Real AI workflows get scattered across separate terminals, browser tabs, and scripts. NomiFun's goal is not another chat box, but to wire these runtimes into one workspace: one conversation surface for many agents, one model catalog reused everywhere, durable backend-driven automation, and a single backend shared by desktop and web.

The main UI below is where you'll spend your day — conversations and navigation on the left, the message stream in the middle, the file tree and preview panel on the right, with each session's working directory, terminal, and capabilities arranged around it.

![NomiFun main UI · the session workspace](/images/en/02会话/会话.png)

## Who it's for

NomiFun targets people already doing real work with agents. It expects you to understand API keys, local data directories, CLI agent installation, and self-hosting boundaries — it is not a zero-config SaaS chat product, but infrastructure you fully control.

If you're already running different agents in separate terminals, watching a self-hosted page in the browser, with MCP servers and project scripts scattered alongside, then pulling them into one workspace is exactly what NomiFun is built to do for you.

## Two host modes

One Rust backend + one React 19 frontend, two hosts:

1. **Desktop app `nomifun-desktop`** — a Tauri 2 shell that starts the backend in-process on a random loopback port; the window is trusted via a per-boot local trust token (no login). Best for a personal workstation and everyday dev. When WebUI remote access is enabled, the extra LAN listener still requires the remote browser to log in.
2. **Web server `nomifun-web`** — a self-hosted axum service on `127.0.0.1:8787` by default, serving the SPA and API on one port, **login required by default**, with an admin created on first visit. Best for LAN / VPN / VPS self-hosting; Docker and systemd deployments take this path.

Both modes share the same backend and the same React SPA, so features, UI, and docs are essentially identical — the difference is in how they launch and where the auth boundary sits.

## What you can do here

A tour of the common entry points (sidebar / routes) once you're in:

- **Sessions & workspace** — `/guid` to create a session, `/conversation/:id` to run it; pick the built-in nomi or an external CLI agent. Each session has its own working directory, file tree, preview panel, and a backend-managed PTY terminal.
- **Model setup** — `/models` manages the 4 native providers (Anthropic, OpenAI-compatible, Amazon Bedrock, Google Vertex), models, credentials, and a global **failover queue** (up to 4 fallback switches on failure / rate limit).
- **Assistants & skills** — `/assistants` manages assistants; `?tab=skills` manages skills.
- **MCP & outward capabilities** — `/mcp` manages MCP servers; `/open-capabilities` manages WebUI remote access and outward capability exposure.
- **Desktop companions** — `/nomi` manages companion characters, remote channel binding, and companion settings; 3 built-in code-drawn SVG characters ship in (Mochi the bunny / Ink the black cat / Bolt the robot, Mochi by default), and you can bring any custom character.
- **Terminals & automation** — `/terminal-new`, `/terminal/:id` run backend PTYs; `/scheduled` manages cron tasks; `/requirements` manages the AutoWork board.

## Notes & boundaries

- **Shared memory + per-companion skills** — all companions share one memory capture / learning pipeline (a shared memory hub), while the skill library is isolated per companion. Per-companion private memory is coming soon.
- **IM channels (11+)** — shipped: Telegram, Lark (Feishu), DingTalk, WeChat, Slack, Discord, Matrix, Mattermost, Twitch, Nostr, QQ Bot; WeCom (Enterprise WeChat) is in progress.
- **Completion notifications are outbound** — tasks can push completion via outbound webhooks (Lark signed card / Slack / HTTP). Turning an issue or IM message **into an inbound requirement** is on the roadmap (coming soon).
- **Knowledge base sources** — the Feishu connector is shipped (its in-UI creation entry is currently disabled); Notion as a source is on the roadmap, not yet implemented.

## Current version

NomiFun is at **0.1.0 (pre-1.0)** and under active iteration. It began as a fork of [AionUi](https://github.com/iOfficeAI/AionUi), since substantially refactored, and is released under **Apache-2.0**. The built-in nomi agent ships as a standalone CLI binary bundled with the app — no extra install needed.

> This portal covers operational / usage content only — it does not duplicate the full technical docs or architecture internals on GitHub.

## Related

- [Installation](/docs/getting-started/installation) — get it running.
- [Your first conversation](/docs/getting-started/quick-start) — set up a model and complete your first session.

Full docs → [GitHub](https://github.com/nomifun/nomifun-tauri)
