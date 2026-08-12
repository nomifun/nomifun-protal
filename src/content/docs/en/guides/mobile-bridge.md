---
title: Mobile bridge to Desktop
description: Use NomiFun Mobile to inspect tasks, send instructions, and handle confirmations while connecting back to your own Desktop.
category: Devices & Ecosystem
order: 24
lang: en-US
---

NomiFun Mobile is a **remote-control entry point**, not a copy of the model
runtime or the full desktop workspace on a phone. The phone sends instructions
to your own NomiFun Desktop, while Desktop performs model calls, session
execution, and local-capability work. The mobile surface is for checking
status, starting work, and handling approvals when you are away from the
computer.

Mobile source:
[nomifun/nomifun-mobile](https://github.com/nomifun/nomifun-mobile).

## What it is for

The lightweight mobile workflow is designed for:

- listing paired Desktop sessions, their status, and recent result summaries;
- sending an instruction to an existing session or starting a task;
- receiving completion feedback;
- reviewing pending tool confirmations and accepting or rejecting them;
- managing scheduled tasks, including create, edit, delete, and run now.

The phone does not invoke models itself and does not subscribe to the full
thinking, tool-call, or message-stream process. This keeps large transient
payloads off the phone. Local mobile storage is intended for pairing data,
connection settings, and a small number of recent event summaries.

## Connection modes

### Direct LAN connection

On a home or office network, the phone can discover and pair with Desktop using
a QR code or the bridge's device discovery endpoint. This is the shortest path:
your computer is the server, and the local flow does not need a NomiFun cloud
account or a mandatory hosted control plane.

### Cross-network access

When the phone and computer are not on the same LAN, a given version may offer
an optional public relay. The relay matches peers and forwards encrypted frames;
the business payload remains end-to-end encrypted between the phone and Desktop.
Availability, deployment, and cost boundaries are defined by the current Mobile
repository rather than by this portal.

“Direct to Desktop” therefore describes the LAN and trusted-network path. It
does not promise that every cross-network scenario avoids a relay.

## Pairing and security

1. Generate a one-time pairing code and QR from Desktop's remote-bridge
   settings.
2. Scan it in the mobile app, or paste the bridge string and enter the code
   when a camera is unavailable.
3. Desktop verifies the code and stores the authorized device; devices can be
   revoked from Desktop later.
4. Once paired, the two ends exchange a reduced task/result RPC stream over an
   encrypted channel.

Treat the pairing code as a login credential and never publish the QR. Enable
LAN bridging only on a trusted network and keep the computer's firewall on.

## Local-first boundaries

Mobile does not bypass Desktop's local permission model. The computer running
NomiFun remains the place where commands execute, files are accessed, models
are called, and sensitive data is handled; the phone is an authorized control
surface. If you enable a relay, channel, or model provider, the resulting
network traffic still follows your configuration.

The mobile project is evolving quickly, so screens, supported platforms,
bridging protocol, and cross-network behavior can change. Use the current
[NomiFun Mobile repository](https://github.com/nomifun/nomifun-mobile) and
[NomiFun Desktop repository](https://github.com/nomifun/nomifun-desktop) as the
source of truth.
