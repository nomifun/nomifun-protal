---
title: MCP & skills
description: Configure MCP servers, manage skills, and expose NomiFun to any agent via open capabilities.
category: Core Guides
order: 6
lang: en-US
---

NomiFun has two easily-confused extension mechanisms:

- An **MCP server** is an external tool server exposing callable tools over stdio / HTTP / SSE.
- A **skill** is a markdown / folder knowledge pack telling the agent how to complete a workflow — it is not a long-running tool server.

In the other direction, NomiFun's own 151 capabilities are exposed through three public fronts — `/mcp` (full Remote), `/mcp-agent` (a curated do-work subset), and `/v1` (REST + OpenAPI 3.1 + SSE streaming) — so Claude / Codex / any agent can drive NomiFun directly via MCP/Skill.

![MCP capabilities page](/screenshots/mcp-01-capabilities.png)

## Steps

1. **Add an MCP server.** Open `/mcp` and add a server: name it, pick a transport (stdio takes command/args/env; HTTP/SSE takes a URL), and run a connection test — the backend starts a temporary client, completes the handshake, lists tools, and persists the result. HTTP/SSE servers needing OAuth go through the built-in OAuth flow.
2. **Import / sync agent configs.** Detect MCP configs from supported local agent CLIs; you can import detected servers into NomiFun, or sync NomiFun's MCP list back into a selected agent's config.
3. **Select per session.** Enabling globally only makes a server available; which servers a given session actually sees is decided by that session's selection.
4. **Manage skills.** Open `/assistants?tab=skills`. A skill can be a single markdown file or a directory with a `SKILL.md`, sourced as Builtin / Custom / Extension, and can be tagged, imported/exported, scanned from external directories, and materialized for a specific agent backend.

   ![Skills page](/screenshots/mcp-03-skills.png)

## Exposing NomiFun to external agents

Authentication is by companion-token (Bearer, SHA-256 stored, constant-time compared); the caller operates "as that companion" on the Remote surface. The headline capability is `nomi_agent_run` (streaming) + `nomi_agent_result` (polling) delegation. Manage these outbound fronts under `/open-capabilities`, reviewing each before enabling.

> The skill-evolution engine mines reviewable `SKILL.md` files from tool-call sequences, and companions can "gift" skills to one another. Skill libraries are isolated per companion, while memory is shared family-wide.

Full docs → [GitHub](https://github.com/nomifun/nomifun)
