---
title: "One computer, a connected NomiFun"
description: "Your phone, desktop companions, and robot share a local hub, keeping models, memory, and work together."
publishedAt: "2026-10-02"
category: "Product architecture"
readingTime: "6 min"
kind: "technical"
lang: "en-US"
---

This article describes the development branch as of October 2026. Features in a released installer depend on its version.

Organize research on your computer, pick up your phone to continue the conversation, then have the robot on your desk read the answer aloud. Behind those three interfaces can be the same companion, the same memory, and the same work in progress.

NomiFun's "computer as a service" design lets a running Desktop instance act as the local execution hub. Everyday use on a local network requires no additional application server. Desktop stores conversations and persistent data, and manages models, agents, knowledge bases, and tasks. Mobile and the Xiaozhi pan-tilt robot bring interaction to different settings.

## Configure capabilities once, choose the interface you need

Desktop is both the desktop application and the backend that performs the work. Actions on a phone return to the selected Desktop instance, so model credentials and the primary workspace do not need to be duplicated. When models, Skills, or knowledge bases change on the computer, the other interfaces reuse the state of the same hub. The responsibilities are documented in the [product ecosystem architecture](https://github.com/nomifun/nomifun-desktop/blob/cbbc647d13710f89d675ce540ff79eeb3316f66b/docs/architecture/product-ecosystem.zh.md).

The [dual-listener design](https://github.com/nomifun/nomifun-desktop/blob/cbbc647d13710f89d675ce540ff79eeb3316f66b/crates/backend/nomifun-app/src/desktop.rs) keeps the desktop application's loopback connection running while allowing an authenticated LAN endpoint to be enabled when needed. Both listeners share the same router. Turning remote access on or off does not rebuild the desktop backend, and a failed LAN port binding does not interrupt local work.

## Scan once, connect directly

Mobile connects directly to Desktop on a trusted local network, using HTTP for requests and WebSocket for live updates. This path does not pass through a NomiFun cloud relay server.

Initial pairing uses a short-lived QR-code credential. [QrTokenStore](https://github.com/nomifun/nomifun-desktop/blob/cbbc647d13710f89d675ce540ff79eeb3316f66b/crates/backend/nomifun-auth/src/qr_token.rs) sets a five-minute expiry and validates and consumes the credential atomically. After a successful use, it cannot be used to sign in again. The QR code saves the user from typing a password; Desktop still verifies the identity.

## The robot continues the same companion

The Xiaozhi pan-tilt robot handles its microphone, speaker, screen, movement, and device tools. Desktop handles models, ASR, TTS, memory, and conversation orchestration. Once the device is bound to a companion, the connection logic uses [that companion's session](https://github.com/nomifun/nomifun-desktop/blob/cbbc647d13710f89d675ce540ff79eeb3316f66b/crates/backend/nomifun-robot/src/session.rs). Reconnecting continues the existing chat.

The robot becomes a physical way to interact with that companion. Voice, text, and device actions stay within the same capability boundaries. Taking photos, moving, and continuous observation each have their own device permissions; the firmware determines which capabilities are available.

## Add network infrastructure when crossing networks

For access from outside the local network, you can choose to self-host [NomiFun Net Infra](https://github.com/nomifun/nomifun-net-infra/blob/main/README.md). NomiRelay carries network traffic, while nfagent runs on a machine that can reach Desktop. Together, they handle connectivity and network policy. Model configuration, data, and agent execution remain Desktop's responsibility.

This division of responsibilities has clear requirements. The computer must be running and reachable. The LAN listener does not include TLS, so it belongs on a trusted network or a dedicated VPN. If you choose cloud models, ASR, or TTS, the corresponding content is still sent to the selected provider. Clear deployment and trust boundaries make your own computer an understandable, controllable capability hub.
