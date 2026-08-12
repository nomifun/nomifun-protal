---
title: MCP & Skills
description: Connect external MCP servers, manage installed Skills, and discover and review new capabilities in Skill Market.
category: Knowledge & Open Capabilities
order: 12
lang: en-US
---

NomiFun extends an agent in two complementary ways:

- An **MCP server** provides callable external tools such as search, data services, or third-party app actions.
- A **Skill** is a knowledge pack with instructions and resources that teaches an agent how to perform a workflow consistently.

Use **MCP** in the sidebar for tool servers and **Skills** for local Skills and Skill Market.

## Connect an MCP server

1. Open MCP from the sidebar and click Add.
2. Choose a transport: stdio for a local command, or HTTP / SSE for a remote service.
3. Enter the command, arguments, environment variables, or URL. Follow the built-in OAuth flow when a service requires authorization.
4. Test the connection before saving. NomiFun completes the handshake and lists tools, with distinct errors for commands, permissions, timeouts, networking, and protocol failures.
5. Select the MCP servers a conversation should actually use. Global enablement makes a server available; it does not force it into every conversation.

![Configure an MCP server](/images/en/助手&skill&mcp/mcp配置.png)

If another local agent already has MCP configuration, use import to scan and reuse it instead of entering everything again.

## Manage Installed Skills

Open Skills and stay on **Installed Skills**. The library combines three sources:

| Source | Meaning |
| --- | --- |
| Builtin | Skills shipped with NomiFun |
| Custom | Skills you import, link, or write yourself |
| Extension | Skills provided by installed extensions |

You can inspect details, search, tag, import folders, scan external locations, and prepare Skills for different agents.

![Installed Skills](/screenshots/skills-library-en.png)

## Discover Skills in Skill Market

Switch to **Skill Market** to sync public rankings from ClawHub and SkillHub. You can:

1. switch between ClawHub and SkillHub;
2. filter by search, audience tags, and scenario tags;
3. inspect a card's description and source;
4. click Add to hand an installation draft to Nomi;
5. review the source, destination, and planned changes before installing.

![Skill Market](/screenshots/skills-market-en.png)

Browsing the market never silently installs anything. Discovery and execution remain separate so you can review the source and purpose before adding a third-party Skill.

## General Skills and companion Skills

The sidebar Skills page manages general Skills that can be reused across conversations and companions. The skill library inside a companion belongs to that companion and captures working patterns developed through long-term collaboration. Both use the Skill format, but their scope is different.

## Safety tips

- Read `SKILL.md` and any bundled scripts before installing a third-party Skill.
- Give each MCP server only the permissions required for its job.
- Keep secrets in environment variables or app credential settings, not inside Skill files.
- Select sensitive capabilities per conversation instead of enabling everything everywhere.

## Related

- [Presets](/docs/guides/assistants) — combine common Skills and models into a one-click setup.
- [Knowledge base](/docs/guides/knowledge-base) — provide project material to a conversation.
- [Companions](/docs/guides/companions) — companion-specific Skills and memory.

Source code and release history → [GitHub](https://github.com/nomifun/nomifun-desktop)
