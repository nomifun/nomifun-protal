---
title: Knowledge bases
description: User-curated markdown directories, live URL snapshots, a safe staged write-back inbox, and session mounting.
category: Core Guides
order: 3
lang: en-US
---

A knowledge base is NomiFun's "config one, use anywhere" idea applied to content: a markdown directory you curate, mounted into a session workspace so the agent **retrieves before it answers** per an explicit protocol, rather than answering from memory. A base can bind to a session, a terminal, or a specific companion, and can be exported / imported as a `.zip`.

## Three knowledge sources

1. **Local markdown** — a directory you organize yourself, the most direct option.
2. **Live URL snapshots** — supply up to 16 public URLs at creation; *snapshot* mode fetches and converts each page to markdown into the base (oversized pages compressed by AI), while *live* mode leaves fetching to the agent at runtime. Built-in SSRF protection; only `http/https` accepted.
3. **Feishu** — connector implemented. (**Notion source = roadmap, not yet implemented.**)

## Steps

1. **Create a base.** On the knowledge page, create a base: give it a name, organize the markdown directory, and optionally add URL sources.
2. **AI-generate a description.** Click "AI generate" to call `autogen` and produce the base's description and `README.md` (requires a configured AI provider).
3. **Bind it to a target.** Bind the base to the current session, a terminal, or a companion; once bound to a companion, its companion chats and channel sessions all mount that companion's bases.
4. **Pick a write-back mode.** Decide how knowledge produced in conversation flows back:
   - **Disabled** — no write-back.
   - **Staged** — write-back lands in the base's `_inbox/` for you to review before merging. **Writes from IM always go Staged**, never direct.
   - **Direct** — skips staging and writes straight into the base body.

## What the agent sees

Bases mount at `{workspace}/.nomi/knowledge/`; the injected context carries per-base description, an AI summary, a "when to consult" hint, and a budgeted table of contents (20 entries per base / 60 global), plus an explicit retrieval protocol. Companions can also grow their own bases — the Desktop Gateway provides knowledge tools (create / write file / fetch URL), so a companion can quietly distill notes during a chat.

> The safe staged write-back inbox is a hard rule: any write originating from IM lands in `_inbox` for review first, and never goes straight to the base body.

Full docs → [GitHub](https://github.com/nomifun/nomifun)
