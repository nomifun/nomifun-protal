---
title: Companions
description: Raise a family of companions — shared memory hub, per-companion skill libraries, knowledge-base binding, skill evolution, and cross-machine migration.
category: Companions & Channels
order: 8
lang: en-US
---

NomiFun's digital companion grows from a single nomi into a **family of companions**: create several at once, each with its own name, avatar, persona, chat model, and bound knowledge bases — so they specialize into finance, literature, coding, or emotional-support companions over time. This page walks through raising a companion from scratch and the two data boundaries behind it.

The memory model is the key thing to understand:

- **Shared memory hub (family-wide)** — collection and learning run as one global pipeline. Whatever any companion learns or remembers, the whole family remembers. Switch companions mid-conversation and the new one already knows everything that happened.
- **Per-companion skill libraries (isolated per companion)** — each companion grows its own set of skills, kept separate from the others.
- (Per-companion **private memory** is coming soon.)

> The entry point is the **Companions** page in the sidebar (`/nomi`). Right-clicking any desktop pet and choosing "Open chat" also deep-links here.

## Steps

1. **Create a companion.** Click "New companion" on the companion switcher and give it a name. The first companion automatically becomes the default (default avatar: Mochi) — the default is the fallback whenever a channel has no explicit binding.

   ![Create a companion](/images/en/桌面伙伴/新增桌面伙伴.png)

2. **Pick an avatar.** Choose one of the 3 built-in characters: **Mochi** (the mochi bunny), **Ink** (the black cat), and **Bolt** (the robot) — all drawn purely in SVG code, no assets to download.

   ![Add an avatar](/images/en/桌面伙伴/新增形象.png)

3. **Manage the avatar library.** The avatar library lists every available look — built-ins plus your own custom ones — ready to reuse across any companion.

   ![Avatar library](/images/en/桌面伙伴/形象库列表.png)

4. **Use any IP you like.** You're not limited to the three built-ins — capture **any IP** as a companion avatar, even your own family or pets, and build a one-of-a-kind companion.

   ![Custom avatar capture (any IP — even family/pets)](/images/en/桌面伙伴/形象采集.png)

5. **Tune the companion.** In its Settings tab, rename it (takes effect instantly), swap the avatar, adjust the persona (a built-in preset or **free-form text**), and — per companion — pick a chat model and toggle the desktop pet and do-not-disturb hours.

   ![Companion settings: rename / avatar / persona / chat model](/images/en/桌面伙伴/桌面伙伴设置.png)

6. **Start chatting.** Talk to the companion in its Chat tab — this is its own dedicated companion thread.

   ![Chatting with a companion](/images/en/桌面伙伴/桌面伙伴聊天页.png)

7. **Grow a per-companion skill library.** Each companion has its own skill library, **isolated per companion**. The evolution engine mines reusable skills from the companion's **tool-call sequences** (based only on the sequence itself — **never any argument values**), produces a draft, and lets you review the resulting `SKILL.md` before enabling it. A learned skill can also be **gifted** to another companion.

   ![Per-companion skill library (isolated per companion)](/images/en/桌面伙伴/桌面伙伴技能配置.png)

8. **Bind knowledge bases.** In the Model & Knowledge tab, mount one or more knowledge bases on this companion — binding is independent per companion, and the companion can retrieve from them while chatting (see [Knowledge base](/en/docs/guides/knowledge-base)). Bind different bases to different companions and you get a "finance companion," a "literature companion," a "coding companion."

   ![Bind knowledge bases to a companion](/images/en/桌面伙伴/桌面伙伴知识库配置.png)

9. **Shared memory in action.** You can add a shared memory by hand in the shared area. Tell one companion to remember something, then ask another — it knows too, because the memory hub is shared across the whole family.

   ![Add a shared memory](/images/en/桌面伙伴/桌面伙伴新增共享记忆.png)

10. **Configure data collection.** Shared data collection decides which of your work data the memory hub learns from. Most collectors are **off by default and opt-in**, and you can control them per category.

    ![Shared data-collection settings (mostly off by default, opt-in)](/images/en/桌面伙伴/桌面伙伴共享数据采集配置.png)

11. **Migrate to a new machine.** The Migration tab in the shared area exports three kinds of `.zip` pack: **memory**, **companion**, and **knowledge-base**. On the new machine import in the order **knowledge base → companion → memory** for a smooth move (the knowledge bases must exist first so a companion pack's bindings can rebind by name).

    ![Cross-machine migration (memory / companion / KB .zip packs)](/images/en/桌面伙伴/桌面伙伴共享记忆迁移.png)

12. **Enable the desktop pet.** Flip the desktop-pet toggle and the companion gets a transparent, always-on-top, draggable window that keeps you company.

    ![Enable the desktop pet (transparent always-on-top window)](/images/en/桌面伙伴/开启桌面伙伴.png)

## Notes and boundaries

- **Memory is shared, skills are isolated.** All companions share one collection/learning pipeline and a single long-term memory; skill libraries are grown per companion. Don't read this as "each companion has its own private memory" — per-companion private memory is on the roadmap.
- **The evolution engine sees sequences, not arguments.** Skill mining is based only on the **sequence** of tool calls and records no argument values, so the skills it distills are safe to review and share.
- **Keep desktop pets to ≤ 5 on screen.** Each pet is its own WebView; too many hurts performance. The UI warns you but doesn't hard-cap.
- **Remote channels bind per companion.** Each IM platform can bind one companion to handle remote messages, falling back to the default companion when unbound. Binding and rebinding are covered in [Channels](/en/docs/guides/channels).

## Privacy boundaries

- **Raw collected events are not exported by default.** The raw `events` data contains your work content verbatim and stays out of migration packs unless you explicitly check "include raw event data."
- **Chat history does not travel with the companion pack.** A companion pack carries only persona and settings; companion threads stay on the original machine.
- **Legacy auto-migration.** Upgrading from the single-pet version automatically migrates to "shared memory hub + first companion" on first launch — no manual steps.

## FAQ

- **Will deleting all companions lose my memory?** No. The shared memory hub exists independently of companions; you can delete down to zero and collection/learning keep running.
- **A companion's model isn't active after migration?** Model config travels with the pack, but if the new machine hasn't configured the matching provider it shows as unconfigured — just re-select it in Settings.

## Related

- [Channels](/en/docs/guides/channels) — channel master-agent mode and per-platform companion binding.
- [Knowledge base](/en/docs/guides/knowledge-base) — knowledge-base creation, URL snapshots, and session mounting.

Full docs → [GitHub](https://github.com/nomifun/nomifun-tauri)
