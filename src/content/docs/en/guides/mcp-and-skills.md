---
title: MCP & skills
description: Connect external MCP servers for more tools, manage skill knowledge packs, and tell external tools apart from a companion's own skill library.
category: Knowledge & Open Capabilities
order: 12
lang: en-US
---

NomiFun has two easily-confused extension paths. This page helps you tell them apart and set them up:

- An **MCP server** is an external tool server that exposes callable tools over stdio / HTTP / SSE, giving the agent a batch of new "hands-on" abilities.
- A **skill** is a markdown / folder knowledge pack that tells the agent *how* to complete a workflow — it is knowledge, not a long-running tool server.

In the other direction, NomiFun's own 151 capabilities are exposed through three public fronts — `/mcp` (full Remote), `/mcp-agent` (a curated do-work subset), and `/v1` (REST + OpenAPI 3.1 + SSE streaming) — so Claude / Codex / any agent can drive NomiFun directly via MCP/Skill.

> Entry points: the sidebar **MCP** page (`/mcp`) configures external servers, the **Skills** page (`/assistants?tab=skills`) manages general skill packs, and outbound exposure lives under `/open-capabilities`. Old Settings URLs redirect to these pages.

## Connect an external MCP server

1. **Add a server.** Open `/mcp`, click add, name it, and pick a transport — stdio takes command / args / env, HTTP / SSE takes a URL. Importing from another agent's config preserves its raw JSON too.

   ![Configure an MCP server](/images/en/助手&skill&mcp/mcp配置.png)

2. **Test the connection.** Before saving, run the connection test: the backend starts a temporary MCP client, completes the handshake, lists tools, and persists the result. Failure codes distinguish missing command, permission, timeout, HTTP, RPC, and protocol errors, which makes debugging easier.

3. **Handle OAuth.** HTTP / SSE servers that need OAuth go through the built-in OAuth flow; once authorized they connect.

4. **Import / sync agent configs.** Detect MCP configs from supported local agent CLIs and import detected servers into NomiFun in one click; when the adapter supports writing, you can also sync NomiFun's MCP list back into a selected agent's config. This step is configuration management only.

5. **Select per session.** Enabling globally only makes a server available — it does not auto-inject into every session. Which servers a given session actually sees is the merge of three sets: globally enabled servers + servers selected for that session + the builtin bridge servers the current capability set requires.

## Manage skills (general knowledge packs)

Open `/assistants?tab=skills` to manage skill packs shared across companions. A skill can be a single markdown file or a directory containing a `SKILL.md`, and is sourced one of three ways:

| Source | Meaning |
| --- | --- |
| Builtin | Ships with the app; some are auto-injected into sessions |
| Custom | Skills you import or drop into the config directory |
| Extension | Provided by an installed extension |

Skills can be tagged, imported, exported / symlinked, scanned from external directories, and materialized for a specific agent backend.

![Skills page](/images/en/助手&skill&mcp/skills.png)

## Two kinds of "skill" — don't mix them up

What you manage at `/assistants?tab=skills` are **cross-companion, general** skill knowledge packs. That is a different thing from a "companion's own skill library":

- **General skills (this page)** — knowledge packs you curate by hand and every companion can share, sourced as Builtin / Custom / Extension.
- **Per-companion skill library (on the companion page)** — each companion grows its own, **per-companion-isolated** set of skills. The evolution engine mines reusable skills from that companion's **tool-call sequences** (based on the sequence itself only, with **no parameter values**), produces a draft, and you review the resulting `SKILL.md` before enabling it; grown skills can also be **gifted** to other companions. See [Companions](/docs/guides/companions).

> Keep the memory-vs-skill boundary straight: **memory is a shared memory hub, shared family-wide** across one capture / learning pipeline; **skill libraries are isolated per companion**. Per-companion private memory is coming soon.

## Exposing NomiFun to external agents

Manage outbound fronts under `/open-capabilities`. Authentication is by companion-token (Bearer, SHA-256 stored, constant-time compared); the caller operates "as that companion" on the Remote surface. The headline capability is `nomi_agent_run` (streaming) + `nomi_agent_result` (polling) delegation. Review each front before enabling it.

## Notes & boundaries

- **Enabled globally ≠ injected into a session.** Enabling an MCP server globally only makes it "available"; whether it enters a given session is decided by that session's selection.
- **The connection test is a temporary client.** The test only handshakes, lists tools, and stores the result; it does not affect later real connections in sessions.
- **The evolution engine sees sequences, not parameters.** Per-companion skill mining is based on tool-call **sequences** only and never records parameter values, so the distilled skills are safe to review and gift.
- **Current version is 0.1.0 (pre-1.0).** Review some fronts (such as the open-capabilities panel) before turning them on.

## Related

- [Companions](/docs/guides/companions) — per-companion skill libraries, evolution mining, and skill gifting.
- [Knowledge base](/docs/guides/knowledge-base) — attach a knowledge base to a session / terminal / companion so the agent can "look it up first".
- [Terminal](/docs/guides/terminal) — where the agent actually runs commands.

Full docs → [GitHub](https://github.com/nomifun/nomifun-tauri)
