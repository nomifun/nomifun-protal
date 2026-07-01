---
title: Scheduled tasks
description: Schedule companions with cron, run a job on demand, review run history, and keep the system awake.
category: Automation
order: 15
lang: en-US
---

Scheduled tasks let you trigger a companion on a clock (cron) to do something: a daily reminder, a weekly health check, an hourly news roundup. Every trigger drives the agent you pick, runs the prompt you wrote, and records each run into a history.

Open **Scheduled tasks** from the sidebar (route `/scheduled`). With no jobs yet you see the empty state, and a **keep-awake** banner at the top — a job only fires while the host process is running.

![Scheduled tasks (empty state + keep-awake banner)](/images/en/04定时任务/定时任务首页空.png)

## Steps

1. **Create a task.** On `/scheduled`, click **New task**. The dialog has four parts: frequency, agent, execution mode, and prompt + name.

   ![Create a scheduled task](/images/en/04定时任务/新增定时任务.png)

2. **Set the frequency (cron).** Pick a preset — `Manual` (no auto-schedule, fired only by Run now), `Hourly`, `Daily`, `Weekdays` (Mon–Fri), `Weekly`, or `Custom` to type a cron expression directly. Presets render an editable expression and the builder validates as you type. Both 5-field (`min hour dom mon dow`) and 6-field (with a seconds prefix) forms are accepted. The task's timezone is set at creation (defaulting to your browser's), so `0 9 * * MON` means 09:00 in *that* timezone, not UTC.
3. **Choose an agent.** Pick the backend that runs on each trigger: built-in **Nomi** (no extra install, best for a first run), a detected CLI agent (`claude` / `codex` / `gemini`), or a preset assistant. **Advanced** lets you override the workspace, model, and more. Note that a workspace path cannot contain whitespace segments — the server enforces this.
4. **Pick an execution mode.** `new_conversation` opens a fresh session on each trigger, good for independent outputs; `existing` (a specified conversation) sends the prompt as a new message into the same thread, good for "remind me" / "summarize today" tasks where continuity matters.
5. **Write the prompt and name it.** Write the prompt as a **self-contained instruction**: the agent never sees your original intent, only this text, so tell it exactly what to produce — e.g. "Search for this week's latest AI news and produce a concise bullet-point summary." Name is just the label in the list.
6. **View and manage tasks.** The list at `/scheduled` shows every task, its next trigger, and an enable toggle.

   ![Scheduled tasks list](/images/en/04定时任务/定时任务首页列表.png)

7. **Act from the detail page.** Open `/scheduled/:job_id` to **Run now** (fire immediately, ignoring the schedule), **Pause / Resume**, **Edit**, or **Delete**. The detail page also shows the schedule, the run history, and the conversations this task created.

   ![Job detail: schedule / Run now / history](/images/en/04定时任务/但是任务详情.png)

## Notes & boundaries

- **A task only fires while the host is running.** The list page has a **keep the system awake** toggle that asks the OS to inhibit sleep (macOS `caffeinate`, Windows `SetThreadExecutionState`, `systemd-inhibit` on Linux where available), so closing the laptop lid doesn't silently skip a trigger.
- **Missed triggers are logged, not silently lost.** If a trigger is missed because the system slept or the app wasn't running, the next startup / resume records a `missed` run, posts a system message into the affected conversation, and re-arms the timer for the next normal trigger.
- **Run history carries a status.** Each trigger is recorded as `ok` / `error` / `skipped` / `missed`, with a link to the resulting conversation where applicable.
- **A busy guard prevents overlap.** In `existing` mode, if the previous run is still going when the next trigger arrives, the new run is skipped (recorded as `skipped`). Switch to `new_conversation` for long-running work so each trigger gets its own thread.
- **You can attach a per-task skill.** Author a `SKILL.md` on the detail page and it is injected into the agent's session on every trigger — to lock in a persona, tool preferences, or workspace conventions. Companion skills are **isolated per companion**, while memory supports shared and per-companion private scopes — the two are independent. Deleting the task removes its skill directory too.

## FAQ

- **Does Run now conflict with the normal schedule?** No. Run now fires one trigger immediately, ignoring the schedule; the busy guard still applies.
- **My cron expression was rejected.** Both 5-field and 6-field forms are valid; validate locally with the dialog's builder or [crontab.guru](https://crontab.guru/).
- **The task ran but the agent did the wrong thing.** Re-read the prompt assuming the agent has no other context — it must spell out exactly what to produce. Then consider attaching a skill to pin the behavior.

## Related

- [Unattended automation · AutoWork](/docs/guides/autowork) — use it when you want work done "as soon as possible" rather than on a clock.
- [Session workspace](/docs/guides/sessions) — where the conversations a scheduled task creates continue.
- [In-app terminal](/docs/guides/terminal) — when you need a live shell instead.

Full docs → [GitHub](https://github.com/nomifun/nomifun-tauri)
