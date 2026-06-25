---
title: Knowledge bases
description: User-curated markdown directories, live URL snapshots, a safe staged write-back inbox, and session mounting so the agent retrieves before it answers.
category: Knowledge & Open Capabilities
order: 10
lang: en-US
---

A knowledge base is NomiFun's "config one, use anywhere" idea applied to content: a markdown directory you curate, mounted into a session workspace so the agent **retrieves before it answers** per an explicit protocol, rather than answering from memory. A base can bind to a session, a terminal, a specific companion, or a working directory, and can be exported / imported as a `.zip`.

> Entry point: the **Knowledge** item in the left sidebar (route `/knowledge`). Everything below — creating bases, setting write-back, binding, and mounting — lives here.

![Knowledge base home](/images/en/03知识库/知识库首页.png)

## Three knowledge sources

1. **Local markdown** — a directory you organize yourself; the most direct option, ideal for handbooks, specs, and project notes.
2. **Live URL snapshots** — supply up to 16 public URLs at creation. **Snapshot** mode fetches each page now and converts it to markdown into the base (oversized pages compressed by AI); **Live** mode leaves fetching to the agent at runtime. Built-in SSRF protection accepts only `http/https`, and JS-heavy pages are fetched through a headless browser to recover their content.
3. **Feishu** — connector implemented (the in-UI creation entry is currently off).

> **Notion source = roadmap, not yet implemented.** The available sources today are local markdown, URL snapshots, and the Feishu connector.

## Steps

1. **Create a local base.** On the knowledge page, click new, give it a name, organize or select the markdown directory, and optionally add URL sources.

   ![Create a local knowledge base](/images/en/03知识库/新增本地知识库.png)

2. **Add live-snapshot URL sources** (optional). Paste up to 16 public links and choose Snapshot or Live per link. Snapshot suits stable reference pages; Live suits pages where you want the latest version every time.

   ![URL live-snapshot knowledge base](/images/en/03知识库/网页抓取知识库.png)

3. **AI-generate a description.** Click "AI generate" to call `autogen` and produce the base's description and `README.md` (requires a configured AI provider). The description feeds the agent's "when to consult" hint — the clearer it reads, the better the matches.

4. **Configure write-back mode and settings.** In base settings, decide how knowledge produced in conversation flows back:

   - **Disabled** — no write-back.
   - **Staged** — write-back lands in the base's `_inbox/` for you to review before merging. **Writes from IM always go Staged**, never direct.
   - **Direct** — skips staging and writes straight into the base body.

   ![Knowledge base settings (write-back mode, etc.)](/images/en/03知识库/知识库设置.png)

5. **Inspect the base detail.** After creation, open the detail page to browse the directory tree, fetched snapshot files, pending `_inbox/` entries, and the base's description and stats.

   ![Knowledge base detail](/images/en/03知识库/新增成功后对应的知识库详情.png)

6. **Bind / mount it to a use case.** Bind the base to the current session, a terminal, a companion, or a working directory. Once bound to a companion, its companion chats and channel sessions all mount that companion's bases automatically; once mounted into a session workspace, the agent retrieves-before-answering inside that session.

   ![Mount into a session workspace](/images/en/03知识库/知识库挂载使用.png)

## Four binding types

| Binding type | Meaning |
| --- | --- |
| **workpath** | Bound to a working directory; sessions under it mount by default |
| **conversation** | Bound to this one session only |
| **terminal** | Bound to a terminal session |
| **companion** | Bound to a companion; its companion chats and channel sessions mount it throughout |

## What the agent sees

Bases mount at `{workspace}/.nomi/knowledge/`. The injected context carries each base's description, an AI summary, a "when to consult" hint, and a budgeted table of contents (20 entries per base / 60 global), plus an explicit retrieval protocol that steers the agent to retrieve before it answers. Companions can also grow their own bases — the Desktop Gateway provides knowledge tools (create base / write file / fetch URL), so a companion can quietly distill notes during a chat.

## Notes & boundaries

- **Any agent can use it:** once a base is bound to a session / terminal / working directory / companion, whatever agent runs in that context — the built-in nomi, an ACP direct-connect agent (Claude Code / Codex, etc.), or a terminal CLI — retrieves-before-answering by the same protocol. It is not tied to one kind of agent.
- **Safe write-back is a hard rule:** any write originating from an IM channel lands in `_inbox/` for review first and never goes straight to the body; you decide whether to merge it from the detail page.
- **URL fetching is SSRF-guarded:** only `http/https` is accepted, and internal/loopback addresses are blocked.
- **Retrieval has a budget:** the injected table of contents caps at 20 entries per base and 60 global; anything beyond that doesn't enter context — organize the most important material up front.
- **Source status:** local markdown, URL snapshots, and the Feishu connector are available; Notion is roadmap.

## FAQ

**Q: How do I choose between Snapshot and Live?**
A: Use Snapshot for reference pages that rarely change (fetched once, stable and predictable); use Live for pages where you need the latest version each time (fetched at runtime, higher cost).

**Q: Where does the note I asked a companion to record over IM end up?**
A: In that base's `_inbox/`, waiting for you to review and merge from the detail page before it reaches the body. This safeguard cannot be bypassed.

**Q: Can one base serve multiple sessions at once?**
A: Yes. Bind by workpath or companion to let multiple sessions share the same base.

## Related

- [Companions](/docs/guides/companions) — bind a base to a companion to grow its own knowledge
- [Sessions](/docs/guides/sessions) — enable and mount a base from the session header
- [Channels · Super Gateway](/docs/guides/channels) — why IM writes always go through the staging inbox

Full docs → [GitHub](https://github.com/nomifun/nomifun-tauri)
