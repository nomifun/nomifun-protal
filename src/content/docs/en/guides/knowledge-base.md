---
title: Knowledge bases
description: Manage local Markdown, URL snapshots, and write-back policy so any Agent can share traceable context across sessions, terminals, and companions.
category: Knowledge & Open Capabilities
order: 10
lang: en-US
---

A knowledge base is NomiFun’s “config one, use anywhere” content layer: curate a local Markdown directory, mount it into a session, terminal, working directory, or companion, and let any Agent **retrieve before it answers** under an explicit protocol.

> Entry point: **Knowledge** in the left sidebar (`/knowledge`). Exact controls and labels follow the version of the app you have installed.

## Knowledge sources

1. **Local Markdown** — handbooks, specifications, project notes, and team material.
2. **URL snapshots** — fetch public pages into Markdown, with persistent Snapshot and runtime Live modes plus SSRF protection.
3. **Feishu** — the connector is being opened progressively; availability depends on the current build.

> **Notion as a source remains on the roadmap.** Do not treat it as a currently public capability.

## Basic workflow

1. Create a base with a name, description, and local Markdown directory.
2. Optionally add URL sources and choose Snapshot (stable saved copy) or Live (fetch the latest at runtime).
3. Generate a description and summary so the Agent can decide when the base is relevant.
4. Bind the base to a session, terminal, working directory, or companion.
5. Verify that the Agent retrieves the relevant context before answering or acting.

## Write-back policy

The current product should not be described as “every IM write always goes into `_inbox`.” The actual behavior depends on the mounted base and the app version. Common modes include:

- **Disabled** — the Agent cannot write back.
- **Manual** — turn-end automatic extraction is off; the Agent writes only when you explicitly ask it in the current conversation to record, save, or remember something.
- **Auto** — the Agent may decide at turn end to retain knowledge that is durable, reusable, clearly relevant, and sufficiently certain.

These modes are not a universal `_inbox` staging flow: qualifying writes land in the knowledge-base body. Updates to existing documents use append and compare-and-swap protections where applicable, reducing silent overwrites and concurrent collisions. External IM channels have a separate `channel_write_enabled` opt-in; when enabled, they also write to the body. Keep important material in version control and back it up regardless.

## What the Agent sees

The base is mounted at a controlled workspace path. Context injection can include the base description, summary, directory hints, and retrieval protocol. Built-in Nomi, ACP agents, terminal CLIs, and companions can use the same knowledge capability; the effective scope is determined by the binding.

URL fetching accepts only `http/https`, and internal or loopback destinations are restricted by SSRF protection. Requests to external URLs, model providers, or channel platforms follow the providers and connections you explicitly configure.

## FAQ

**Does NomiFun automatically save every conversation?**
No. Write-back follows the selected policy and the Agent’s decision. Disable it entirely, use Manual mode for explicit-request-only writes, or use Auto mode when you want the Agent to retain durable knowledge by itself.

**Can one base serve multiple sessions?**
Yes. Bind it by working directory or companion for shared use, or mount it only into one session.

**When will Notion be available?**
It remains a forward-looking direction. Use the sources visible in your installed app as the current source of truth.

## Related

- [Companions](/docs/guides/companions) — bind knowledge to a companion
- [Session workspace](/docs/guides/sessions) — mount a base in a session
- [Channels](/docs/guides/channels) — command a companion from chat

Full docs → [GitHub](https://github.com/nomifun/nomifun-desktop)
