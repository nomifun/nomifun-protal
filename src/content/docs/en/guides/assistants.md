---
title: Assistants
description: An assistant is a reusable persona (system prompt + default backend + skill selection) you create, edit, and tag under /assistants, then pick on demand in any session.
category: Knowledge & Open Capabilities
order: 11
lang: en-US
---

An **assistant** is a reusable persona: it bundles display info, a default agent backend, an optional model preference, a system prompt, and a skill selection into one entry, so you can pick it in one click when starting a session instead of rewriting prompts every time.

The entry point is **`/assistants`** (the old `/settings/assistants` redirects to `/assistants?tab=assistants`). The **Skills** tab on the same page lives at `/assistants?tab=skills`.

![Assistants list (builtin library)](/images/en/助手&skill&mcp/助手列表.png)

## Steps

1. **Browse the assistant library.** Open `/assistants`. The list merges three sources: **Builtin** (shipped with the app), **Custom** (created by you), and **Extension** (provided by installed extensions). Every entry can be enabled/disabled and reordered, and the list also tracks recent use so you can grab one quickly in a session.

2. **Create an assistant.** Click new, then fill in a name, description, and avatar; choose a **default agent backend** (e.g. the built-in `nomi`, or `claude` / `codex` / `gemini`); set a model preference if you want; write the **system prompt** (the assistant's instructions); and check the **skills** to attach when a session starts. Save, and it's ready to pick in a session.

   ![Create / edit an assistant](/images/en/助手&skill&mcp/新增助手.png)

3. **Edit an assistant.** Custom assistants are fully editable — name, description, avatar, prompt, and skills — and can be deleted. Builtin assistants are read-only in content, but their enabled state, sort order, recent use, and a default-backend override are stored separately; Extension assistants are read-only here, with their lifecycle managed by the extension.

4. **Organize with tags.** Create tags in tag management and apply them to assistants, then filter by tag at the top of the list — once you have many assistants, this is the fastest way to find one.

   ![Tag management](/images/en/助手&skill&mcp/标签管理.png)

5. **Pick one in a session.** When you start a session, or switch agents in the session header, choose an assistant; its prompt and enabled skills take effect automatically at session start. The assistant's skills merge with the auto-injected builtin skills — no need to copy skill directories by hand in normal use.

## Notes and limits

- **Three sources, different editability.** Custom assistants are editable and deletable; Builtin assistants are read-only in content (only enabled/order/default-backend override are mutable); Extension assistants are read-only.
- **Default backend and providers.** If you don't set a default backend when creating an assistant, you need at least one configured provider; the built-in `nomi` is used by default when it can be inferred.
- **CLI agents need their own install.** Choosing `claude` / `codex` / `gemini` does not install those tools — they still require the matching CLI on the host beforehand.
- **Skills are per-companion; memory is shared.** Each companion has its own skill library, while memory runs through one capture/learning pipeline shared by all companions. Per-companion private memory is coming soon.
- **Skills and MCP are managed separately.** The Skills tab is at `/assistants?tab=skills`, while MCP servers moved out to `/mcp`; both extend capability but are managed apart today.

## FAQ

- **How do assistants relate to sessions?** An assistant is a template; a session is an instance. Picking one makes its prompt, default backend, and skills the session's starting point; later tweaks inside the session don't rewrite the assistant itself.
- **Can I edit a builtin assistant?** Not its content, but you can enable/disable it, reorder it, and override its default backend. For full customization, create a custom assistant instead.
- **What happens when I delete a custom assistant?** Its associated rule, skill, and avatar files are cleaned up along with it.

## Related

- [MCP and skills](/docs/guides/mcp-and-skills) — manage skills and MCP servers to extend what an assistant can do.
- [The session workspace](/docs/guides/sessions) — pick an assistant and get work done in a session.
- [Model failover queue](/docs/guides/model-routing) — a safety net for an assistant's model preference.

Full docs → [GitHub](https://github.com/nomifun/nomifun-tauri)
