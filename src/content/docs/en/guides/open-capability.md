---
title: Open capabilities (MCP / REST / OpenAPI)
description: Expose NomiFun's 151 capabilities to any agent through /mcp, /mcp-agent, and /v1 with a single companion-token, and delegate tasks as that companion.
category: Knowledge & Open Capabilities
order: 13
lang: en-US
---

NomiFun exposes all 151 platform capabilities (agent / browser / computer / knowledge / files / platform control) through three network-reachable public fronts. Any MCP client or HTTP script can drive the platform like a "desktop companion" with just a URL plus an access token — this page covers opening the fronts, getting a token, connecting a client, and delegating a task in one call.

> Entry point: view and manage these outbound fronts in the Open Capabilities panel (`/open-capabilities`); review each one before enabling it.

![MCP capabilities panel](/images/en/开放能力/mcp能力.png)

## The three public fronts

| Front | Path | Best for |
|---|---|---|
| Full MCP | `/mcp` | MCP clients that need the full platform control surface (all Remote-surface tools) |
| Curated MCP | `/mcp-agent` | MCP clients that only want the curated do-work subset (agent / browser / computer / knowledge / files) |
| REST | `/v1` | Scripts, automation, other languages; includes `/v1/openapi.json` (OpenAPI 3.1) and SSE streaming |

All three share one capability bus and the same companion-token auth. The headline capability is **`nomi_agent_run`** (streaming delegation) paired with **`nomi_agent_result`** (poll for long-running results).

## Steps

1. **Get the endpoint.** Locally it's `http://127.0.0.1:<port>` (the desktop app's loopback port, or `nomifun-web`'s service port); with WebUI remote access enabled it's `http://<your-LAN-IP>:25808`.
2. **Mint a companion-token.** In the Open Capabilities panel, click "generate access token" for a companion. The token is **hash-only (SHA-256), shown in plaintext just once at minting**, and **bound to that one companion** — copy it immediately. For headless deployments, seed it at startup via an env var: `NOMIFUN_COMPANION_TOKEN=$(openssl rand -hex 32) nomifun-web`, which binds to the default companion.
3. **Connect an MCP client.** In Claude Code / Cursor and similar clients, add NomiFun as a Streamable-HTTP server under `mcpServers`:

   ```json
   {
     "mcpServers": {
       "nomifun": {
         "type": "streamable-http",
         "url": "http://127.0.0.1:25808/mcp-agent",
         "headers": { "Authorization": "Bearer <companion access token>" }
       }
     }
   }
   ```

   Once connected, `tools/list` shows the `nomi_*` tools and `tools/call` drives them; swap `/mcp-agent` for `/mcp` to get the full platform control surface.
4. **Or use REST.** Scripts and automation hit HTTP directly with the same auth header:

   ```bash
   # List capabilities (lean agent profile)
   curl -s "http://127.0.0.1:25808/v1/tools?profile=agent" \
     -H "Authorization: Bearer $TOKEN"

   # Delegate a goal to an autonomous nomi agent in one call
   curl -s -X POST "http://127.0.0.1:25808/v1/tools/nomi_agent_run" \
     -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
     -d '{"goal":"Research competitor pricing and write notes.md","timeout_secs":600}'
   # => {"result":{"conversation_id":123,"status":"completed","text":"..."}}
   #    Long tasks return {"status":"running",...}; poll with nomi_agent_result
   ```
5. **Use streaming for live progress.** `POST /v1/tools/nomi_agent_run/stream` is SSE, emitting one `data:` delta event per line with a final `{"type":"__result__",...}` frame carrying the result; on the MCP side, long tasks return a `{status:running}` handle from `nomi_agent_run` that you poll with `nomi_agent_result`.
6. **Generate a client from OpenAPI** (optional). `GET /v1/openapi.json[?profile=agent]` is an OpenAPI 3.1 contract — feed it to `openapi-generator` for a typed client in any language, or import it into Postman / Insomnia / Bruno.

## Notes and boundaries

- **Runs as the companion:** calls inherit the bound companion's profile model, persona, and knowledge base, and companions are isolated from one another. When `nomi_agent_run` doesn't specify a `model`, it uses that companion's profile model — **so the companion must have a working model configured** (otherwise minting returns a `warning` and model-dependent capabilities fail).
- **Permission tiers (Remote surface):** read / write are allowed; destructive actions need confirmation (a `needs_confirmation` response comes back first, then retry with `"confirm": true` after restating the action to the user); sensitive capabilities (`secret.*`, `factory_reset`, etc.) are denied on the Remote surface by default and **don't appear in `tools/list`**.
- **Result envelope** (REST): success `200 {"result": ...}`; needs confirmation `409 {"needs_confirmation":true,...}`; tool error `422`; unknown tool `404`; missing/bad token `401`.
- **Security:** holding a token is equivalent to granting remote code execution, so only hand it to trusted clients; for any public exposure, front it with a TLS reverse proxy and a firewall. Tokens can be revoked/rotated at any time, and revoking one only affects its companion.

## FAQ

- **`/mcp` or `/mcp-agent`?** Use `/mcp` for the full platform control surface; use `/mcp-agent` for a cleaner, get-work-done surface.
- **Do I need an MCP client?** No — any tool that can send HTTP (n8n / Zapier / shell scripts) can point at `POST /v1/tools/{name}` with zero SDK.
- **How do I discover capabilities?** `GET /v1/tools` (or `?profile=agent`) lists each tool's name, description, and JSON Schema; tool names come from there.

## Related

- [MCP & skills](/en/docs/guides/mcp-and-skills)
- [WebUI remote access](/en/docs/guides/webui-remote)
- [Companions](/en/docs/guides/companions)
- [Knowledge base](/en/docs/guides/knowledge-base)

Full docs → [GitHub](https://github.com/nomifun/nomifun-tauri)
