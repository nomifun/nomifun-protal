---
title: Your first conversation
description: Configure a model, create your first session, and use the conversation workspace.
category: Getting Started
order: 3
lang: en-US
---

This page walks you through your first NomiFun session. The desktop app and web server share the same UI; the difference is auth: the desktop WebView is trusted via a local token (no login), while `nomifun-web` requires login. Finish [Installation](/en/docs/getting-started/installation) first.

![First-run admin setup (web only)](/screenshots/gs-04-quickstart-login.png)

## Steps

1. **Launch and land on the home screen.** After login you land on `/guid`, which gathers everything you need to start a session: agent picker, model picker, assistant, tools & workspace, and the input box.

   ![guid home screen](/screenshots/gs-05-quickstart-guid.png)

2. **Configure a model.** Open `/models` and add at least one provider — Anthropic, OpenAI-compatible, Amazon Bedrock, or Google Vertex — with its API key, base URL, and default model. For unattended long tasks, set up a **model failover queue** so the engine cycles through backups on failure / rate limits.

   ![Model settings](/screenshots/gs-06-quickstart-model-settings.png)

3. **Create your first session.** Back on `/guid`, pick the built-in **nomi** engine (no external CLI required — ideal for a first run), choose a configured model, type a prompt like "Write a Python function returning the nth Fibonacci number, with a small test," and send.

   ![First reply](/screenshots/gs-07-quickstart-first-reply.png)

4. **Use the conversation workspace.** Every session has its own working directory. The session page includes the message stream, a file tree, a preview panel (code / Markdown / PDF / Office / HTML / diff), and a PTY terminal mounted at the working directory.

## Common surfaces

- `/assistants` — manage assistants; `?tab=skills` for skills.
- `/mcp` — manage MCP servers.
- `/open-capabilities` — WebUI remote access and outbound capability exposure.
- `/requirements` — the AutoWork board.
- `/nomi` — companions, remote channel bindings, and companion settings.

Full docs → [GitHub](https://github.com/nomifun/nomifun)
