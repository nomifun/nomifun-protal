---
title: Connect a XiaoZhi robot
description: Let a compatible ESP32 robot use NomiFun companions, models, voice services, and device-side MCP tools over the LAN.
category: Devices & Ecosystem
order: 23
lang: en-US
---

NomiFun can act as a local AI backend for a compatible XiaoZhi ESP32 robot.
The robot handles its microphone, speaker, display, buttons, and device-side
MCP tools; NomiFun provides the companion, chat model, ASR, TTS, memory,
sessions, and tool coordination.

This is an optional hardware integration. With a firmware build configured for
NomiFun, the robot connects to your own NomiFun Desktop over the LAN instead of
the default `xiaozhi.me` service.

## What you need

- [NomiFun Desktop](https://github.com/nomifun/nomifun-desktop) running on the
  same LAN as the robot;
- compatible XiaoZhi firmware;
  [nomifun-xiaozhi-yuntai](https://github.com/nomifun/nomifun-xiaozhi-yuntai)
  includes the `esp32-s3n16r8-emoji` board and head-servo MCP tools;
- a configured NomiFun companion;
- usable chat, speech-recognition (ASR), and speech-synthesis (TTS) models for
  that companion.

The robot must be able to reach the computer directly. Guest Wi-Fi, AP
isolation, or the operating-system firewall can prevent devices on the same
Wi-Fi from communicating.

## 1. Configure the companion

1. Open **Desktop companions** and select or create a companion.
2. Configure its main chat model on **Overview**.
3. In **Model configuration**, select ASR and TTS models, including a voice if
   the provider requires one.
4. Test a normal text conversation first.

The robot uses the models assigned to the companion it is bound to. A provider
in the global catalog is not enough: the companion needs a usable chat model,
and voice conversation also needs ASR and TTS.

## 2. Get the OTA address

1. Open the companion's **Remote control** tab.
2. In **Robot connection**, select **Add a robot**.
3. If NomiFun says LAN access is off, select **Turn it on**.
4. Keep the dialog open and copy a complete OTA address ending in
   `/robot/ota`, normally on LAN port `25808`.

Choose the computer IP that is reachable from the robot on their shared
network. Do not use `127.0.0.1`: on an ESP32 it points back to the robot.

## 3. Point the firmware at NomiFun

Flash a compatible firmware build and open the robot's Wi-Fi setup page. Under
**Advanced settings**, paste NomiFun's complete address into **OTA address**,
save the Wi-Fi settings, and restart the robot.

At startup the device requests that address. NomiFun returns the WebSocket
configuration needed for `/robot/v1`; you do not need to construct or enter a
WebSocket URL manually.

For board selection, building, flashing, wiring, and servo precautions, follow
the README and board documentation in
[nomifun-xiaozhi-yuntai](https://github.com/nomifun/nomifun-xiaozhi-yuntai).

## 4. Bind the robot

1. After restart, the robot displays and reads out a six-digit activation code.
2. Return to NomiFun's **Add a robot** dialog.
3. Enter the code and select **Bind to this companion**.
4. Wait for the robot to appear in the companion's **Robot connection** list.

Activation codes expire. If a code is rejected, restart the connection flow and
use the newest six-digit number shown on the device. A robot already bound to
another companion must be unbound there first.

## 5. Verify the connection

Start with these checks:

1. Speak to the robot and confirm recognized text appears in the companion
   session;
2. confirm replies play through the robot speaker and can be interrupted using
   the controls supported by the firmware;
3. ask the companion to read the head status or move its head. The
   `esp32-s3n16r8-emoji` firmware exposes device-side MCP tools under
   `self.head.*`, including `self.head.get_status`.

Servo motion is disabled by default on firmware builds that require calibration.
Calibrate center and travel limits before enabling automatic motion; incorrect
limits can stall or damage a servo.

## Data flow and locality

```text
Microphone -> XiaoZhi firmware -> NomiFun ASR -> companion chat model
                                                     |
Speaker <- Opus audio <- XiaoZhi firmware <- NomiFun TTS
                                                     |
                         device MCP tools <----------+
```

Voice and conversation content are processed according to the providers
selected in NomiFun. “Local backend” means the robot gateway, session
coordination, and binding logic run on the computer; a cloud ASR, TTS, or chat
provider still receives the data it needs.

## LAN safety

Enabling LAN access makes NomiFun listen on the local network. Use it only on a
trusted LAN, keep the operating-system firewall enabled, and do not expose
port `25808` directly to the public Internet. Turn LAN access off when robot
or WebUI connections are no longer needed.

Full firmware and integration source:
[NomiFun Xiaozhi Yuntai](https://github.com/nomifun/nomifun-xiaozhi-yuntai) ·
[NomiFun Desktop](https://github.com/nomifun/nomifun-desktop)
