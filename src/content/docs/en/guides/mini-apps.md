---
title: Agent Desktop mini-apps
description: Turn ordinary conversations into single-file web tools that you can publish, run, iterate, or import locally.
category: Creation & Mini Apps
order: 20
lang: en-US
---

NomiFun **mini-apps** are single-file web tools generated and hosted on your own
computer. They are a way to turn a one-off conversation artifact into something
you can reopen whenever you need it: a timer, form, calculator, project panel,
or an internal workflow utility.

The contract is deliberately small: the final artifact is one self-contained
`miniapp.html` file. CSS and JavaScript live inside that file; third-party
libraries may be loaded from a CDN, and no separate build step is required.

> In the current v3 flow, conversations are unified. Creating and iterating a
> mini-app both use ordinary conversations; a mini-app does not hide a permanent
> iteration thread. Those conversations remain in the normal conversation list,
> and deleting one does not delete an already-published mini-app.

## Create from a conversation

1. Enable **Create mini-app** on the session start page, or open
   `/guid?miniapp=1`.
2. Describe the tool you want. NomiFun starts an ordinary conversation and
   asks the Agent to write `miniapp.html` in that conversation's workspace root.
3. At the end of each turn, the file should be a complete, runnable HTML
   document. The preview panel shows the current working version as it changes.
4. Select **Publish as mini-app** in the preview, enter a name and optional
   description or icon, and publish it into the `/mini-apps` library.

Before publishing, the document is only a **working copy** in the conversation.
You can keep refining it without creating a collection of unnamed records.

## Published snapshots and iteration

The library stores an explicit published snapshot. Open `/mini-apps` to browse
your tools, or open `/mini-apps/:id` to run one. From a card or the runner,
choose **Keep iterating** when you want to change it.

NomiFun first prepares a private working copy:

```text
{work directory}/miniapps/{miniapp_id}/miniapp.html
```

It then starts a new ordinary conversation and puts the absolute source path in
the first message. The Agent is instructed to read the whole file before
changing it and to edit only that file. This keeps conversation history and
search semantics normal while decoupling the source from the conversation that
originally published it.

Iteration does not go live automatically. The library and runner show
**Unpublished changes** until you explicitly select **Publish**. Publishing can
either:

- publish a new mini-app;
- replace an existing mini-app; or
- leave the current published snapshot running until you are ready.

## Import an existing web page

The mini-app library also has an **Import** flow:

- the desktop app can pick one HTML file or a folder containing `index.html`;
- WebUI supports uploading one HTML file;
- validation checks for empty content, HTML shape, the 4 MiB size limit, and
  local files that cannot be served with a single-document app;
- missing `html` / `body` shells and similar safe transformations can be
  repaired during import;
- when a fatal finding blocks adoption, **Rewrite in a session** can turn the
  source into a self-contained file and return it to the preview/publish flow.

CDN resources are allowed, but the app depends on the network when it uses
them. Inline critical CSS, JavaScript, and small images when offline behavior
matters.

## Sandbox and data boundaries

Mini-apps run in a sandboxed iframe with an opaque origin. This prevents
generated scripts from directly inheriting the host page's cookies, storage,
or desktop privileges. As a result, browser storage such as `localStorage` may
throw or may last only for the current run. Wrap every storage read and write
in `try/catch`, and never make core behavior depend on it.

NomiFun Desktop manages the published HTML and working copy locally by default.
If the mini-app itself calls a CDN, external API, or model service, its network
behavior is determined by that code and by the services you configure; the
mini-app contract does not turn external calls into local calls.

## Related

- [The session workspace](/docs/guides/sessions)
- [Built-in terminal](/docs/guides/terminal)
- [Creative Workshop](/docs/guides/creative-workshop)

Implementation and change history → [NomiFun Desktop on GitHub](https://github.com/nomifun/nomifun-desktop)
