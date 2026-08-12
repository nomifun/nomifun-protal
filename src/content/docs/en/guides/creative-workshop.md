---
title: Creative Workshop (Beta)
description: Arrange images, text, video, and generation nodes on an infinite canvas for local-first multimedia creation.
category: Creation & Mini Apps
order: 21
lang: en-US
---

**Creative Workshop** is NomiFun's infinite-canvas workspace for making and
organizing media. Open `/workshop` for the canvas gallery and
`/workshop/:id` for a specific canvas. Pan, zoom, and connect nodes while
keeping source assets, prompts, generation jobs, and iterations together.

> The current surface is explicitly marked **Beta**. It may be unstable, fail,
> or change, and should not be the sole dependency of a critical production
> workflow. Keep copies of important assets and results.

## What the canvas supports

The current implementation includes:

- **Image nodes** for upload, preview, download, crop, grid splitting, upscale,
  and local repaint workflows;
- **Text nodes** for scripts, notes, prompts, and annotations;
- **Video nodes** for uploading and previewing video assets;
- **Generator cards** that use a configured provider and model for image,
  video, text, or text-to-speech (TTS) tasks;
- **Flow nodes** for loops, comparisons, output inspection, and grouping;
- **An asset library** for keeping image, video, and text assets locally
  available across canvases.

Generation nodes may use an external model provider. NomiFun keeps the canvas,
orchestration, and asset metadata local; whether prompts, input media, or
results travel over the network depends on the provider you configure.

## A practical workflow

1. Create and name a canvas in `/workshop`.
2. Add images, videos, and text from the asset library, or create nodes directly
   on the canvas.
3. Add a generator card and choose its capability, model, size, count, quality,
   and other parameters.
4. Connect reference assets to a generator; use loop nodes for batches and
   compare nodes for A/B review.
5. Preview and download results, and save useful outputs to the local asset
   library for reuse.
6. Return to the gallery to search, rename, reopen, or delete canvases.

Canvas documents preserve nodes, edges, viewport, and background settings.
Thumbnails and update times make the gallery useful for finding active work.

## Local-first boundaries

Workshop is a local workspace inside the desktop app and does not require a
NomiFun cloud account. Desktop manages canvases and assets on the computer by
default. When you select a hosted image, video, speech, or text model, the
corresponding inputs and outputs are still handled according to that provider's
terms.

If a CDN or generation provider is unavailable, the canvas remains useful for
local organization, text nodes, and existing-asset editing, while the affected
generator may fail or enter an error state. Treat Beta canvases as experimental
records and export or back up important results.

## Related

- [Agent Desktop mini-apps](/docs/guides/mini-apps)
- [The session workspace](/docs/guides/sessions)
- [Model routing and failover](/docs/guides/model-routing)

Implementation → [NomiFun Desktop on GitHub](https://github.com/nomifun/nomifun-desktop)
