---
title: Companions
description: Multi-companion raising, a shared memory hub with per-companion skills, knowledge bindings, and migration.
category: Core Guides
order: 1
lang: en-US
---

NomiFun's digital companions have grown from "a single nomi" into a **family of companions**: create several and use them at once, naming, styling, and tuning each one's personality. Every companion can use its own chat model and bind its own knowledge base, evolving into finance / literary / coding / emotional specialists.

The memory model is the key idea: **all companions share one memory hub** — collection and learning are a single global pipeline, so anything one companion learns, the whole family remembers — while **skill libraries are isolated per companion**, each raising its own specialized skills. (Per-companion private memory is on the roadmap.)

> The entry point is the **Nomi** page (`/nomi`) in the sidebar.

## Steps

1. **Create a companion.** Click "New companion" on the switcher bar, give it a name, and pick one of three built-in avatars (Mochi the mochi bunny / Ink the amber-eyed cat / Bolt the hovering robot), or customize any companion IP you like — even your own family or pets. The first one automatically becomes the default (Mochi by default).
2. **Tune it.** In its Settings tab, rename it, change the avatar, adjust the personality (preset or free text), and pick a chat model just for it; toggle the desktop pet and do-not-disturb hours.
3. **Bind a knowledge base.** In the Models & Knowledge tab, mount one or more knowledge bases so it can retrieve them in conversation (see [Knowledge bases](/en/docs/guides/knowledge-base)).
4. **Share memory across companions.** Tell one companion to remember something, then switch to another and ask — it knows too, because the memory hub is shared family-wide.
5. **Migrate to a new machine.** The shared-domain Migration tab offers three `.zip` packages (memory / companion / knowledge base). On the new machine, import in the order "knowledge base → companion → memory" for a smooth move.

## Desktop pets & channels

Each companion with its pet toggle on gets a transparent, always-on-top desktop window (5 on screen at once is the suggested ceiling). Each IM platform can bind one companion to handle remote messages; unbound platforms fall back to the default companion. See [Channels](/en/docs/guides/channels).

## Privacy boundaries

Raw collected events are **not** exported by default — only an explicit opt-in includes them in a memory package — and chat history does not travel in a companion package. Upgrading from the single-companion version auto-migrates to "shared memory hub + first companion" on first launch, with no manual steps.

Full docs → [GitHub](https://github.com/nomifun/nomifun)
