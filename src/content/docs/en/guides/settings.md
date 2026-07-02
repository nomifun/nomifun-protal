---
title: Settings
description: Review and adjust your local data directory, the dark/light theme, and the version and open-source license on the About page.
category: Remote & Settings
order: 18
lang: en-US
---

Settings is NomiFun's app-level configuration surface: see where your local data lives, switch between dark and light themes, and confirm the current version and open-source license on the About page. It is separate from your companion, model, and channel configuration — those have their own pages; this one is about the app itself.

> Entry point: **Settings** at the bottom of the sidebar, route `/settings`.

![System settings](/images/en/设置/系统设置.png)

## Steps

1. **Open Settings.** Click **Settings** at the bottom of the sidebar to reach `/settings`. The left side is split into groups such as **Theme** and **About**.

2. **Switch the theme.** Under **Theme**, pick dark or light. The change applies instantly with no restart, and your choice is remembered for the next launch.

   ![Theme settings](/images/en/设置/主题设置.png)

3. **Find your local data directory.** NomiFun is local-first, so all state lives under a per-user app-data directory:
   - macOS: `~/Library/Application Support/NomiFun/Nomi`
   - Windows: `%LOCALAPPDATA%\NomiFun\Nomi`
   - Linux: `$XDG_DATA_HOME/NomiFun/Nomi` (usually `~/.local/share/NomiFun/Nomi`)

   That directory holds the SQLite database (sessions, settings), `companion/` (companions + the shared memory hub), `knowledge/` (knowledge base), `logs/`, and more. The desktop app, the self-hosted web host, and the dev scripts all default to the same directory — so a provider or companion you set up in one host is visible in the others.

4. **Read the About page.** Open the **About** group to confirm the current version and open-source license.

   ![About (version / license)](/images/en/设置/关于.png)

## What's on this page

- **Version**: currently `0.1.0` (pre-1.0). NomiFun is iterating quickly, so settings and the UI may shift between releases.
- **License**: **Apache-2.0**. Fully open-source and open to audit; the source lives on GitHub.

## Notes & boundaries

- **Treat data as a database.** Treat the data directory like a database — back it up and lock down its permissions, and you can move the whole thing: copy it to a new machine to migrate, or quit the app and delete it to reset.
- **Isolated sandbox.** To make one run use a separate directory, set `NOMIFUN_DATA_DIR=<absolute path>` before launch (the desktop app appends `/Nomi`). Two backends sharing one directory is blocked by design — startup fails fast and names the current holder.
- **Shared/private memory, per-companion skills.** Inside the data directory, `companion/` supports shared memories and per-companion private memories; skill libraries remain isolated per companion.
- **No runtime config here.** The toggles and permissions for computer-use / browser-use / the nomi agent are not in Settings — see [Computer & browser use](/docs/guides/computer-browser-use).

## FAQ

**Does changing the theme require a restart?** No — dark/light switches instantly and is remembered.

**How do I find where my data lives?** Use the per-platform path above; if you set `NOMIFUN_DATA_DIR`, look in the `Nomi` subdirectory of that path.

**Where do I see the version?** Settings → **About** group; it currently reads `0.1.0`.

## Related

- [Computer & browser use](/docs/guides/computer-browser-use) — toggles and permissions for computer-use / browser-use / the agent.
- [WebUI remote access](/docs/guides/webui-remote) — expose the desktop instance over LAN behind a login.
- [Companions](/docs/guides/companions) — shared/private memory scopes and per-companion skill libraries.

Full docs → [GitHub](https://github.com/nomifun/nomifun-tauri)
