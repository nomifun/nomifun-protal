---
title: Unattended automation · AutoWork
description: A requirements board + orchestrator + IDMM that process work item by item, with outbound notifications.
category: Core Guides
order: 4
lang: en-US
---

AutoWork is NomiFun's flagship automation: a **requirements board** plus an **orchestrator** that drives AI agents (or an agent CLI running in a terminal) through your requirements one at a time, without you watching. You register requirements, group them by tag, bind a tag to a session, and the orchestrator claims, executes, and finalizes them in order.

It is all **backend-authoritative**: AutoWork resumes automatically on process startup and runs whether or not the UI is open. A lease sweeper re-dispatches orphaned tasks every 60 seconds — a crash never leaves a task stranded.

![AutoWork board](/screenshots/autowork-03-kanban.png)

## Steps

1. **Submit a requirement.** On `/requirements`, click "New requirement" and fill in a title, tag, content (write it as a ticket: enough context + a clear definition of done), and an `order_key` (lexicographically ordered queue, smaller goes first).
2. **Bind a target.** Open a session or an eligible terminal (preset `claude` / `codex`), and in the header AutoWork control pick a tag, set an optional cap, and enable. The orchestrator then cycles `pending → in_progress → done`.
3. **Track progress.** The list `/requirements`, the board `/requirements?view=board`, and the tag-sessions panel `/requirements/extensions?tab=autowork` are three views of the same data.
4. **Configure completion notifications (outbound).** In the Notify tab, create a webhook and bind it to a tag. When a requirement reaches a terminal state, it sends an **outbound** signed card to a **Lark / Slack / HTTP webhook**.

> Requirement intake is only by you registering one in the UI. Turning issues / Slack / Lark **inbound into requirements = coming soon**; Slack / Lark / HTTP are **outbound** completion webhooks only.

## IDMM — keeping a stuck turn alive

IDMM (Intelligent Decision-Making Mode) is a per-session supervisor that stacks with AutoWork:

- **Rule layer** (no LLM) — provider errors, repeated retries, idle nudges, read-only auto-confirm, handled by deterministic policy.
- **Sidecar model layer** — genuine decision stalls escalate to a lightweight backup model for the next instruction, so a session doesn't hang.

Failure-watch and decision-watch are off by default, and a model failover queue (up to 4 switches) can be triggered. AutoWork pushes forward, IDMM keeps each turn from getting stuck — together they make true unattended operation possible.

Full docs → [GitHub](https://github.com/nomifun/nomifun)
