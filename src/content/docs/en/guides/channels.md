---
title: Channels · super gateway
description: Connect a companion to 11 IM channels and command your computer from a phone or group chat.
category: Core Guides
order: 2
lang: en-US
---

With **channels**, you operate NomiFun's companions from external chat apps instead of sitting at the desktop. Enable a connector, paste its credentials, authorize a chat user with a one-time code, and from then on messages to your bot route to a companion — its replies come back to the same chat.

The default **master-agent mode** has the companion itself answer remote messages: the session inherits the companion's personality and memory and is wired to the Desktop Gateway tools — so the thing you're chatting with on your phone isn't an isolated bot, it's the agent that runs your whole desktop. "Move my daily-report cron to 9am and tell me what's running on the desktop right now" is a single Lark message.

![Channels overview](/screenshots/channels-01-overview.png)

## The 11 shipped channels

Telegram, Lark / Feishu, DingTalk, WeChat, Slack, Discord, Matrix, Mattermost, Twitch, Nostr, and QQ Bot. **WeCom (Enterprise WeChat) is in progress.**

## Steps

1. **Find the entry point.** Open the Nomi page (`/nomi`), pick a companion, and open its Remote tab, which lists the available connectors with a status pill each.
2. **Paste credentials and enable.** For Telegram: create a bot with [@BotFather](https://t.me/BotFather), save the token, paste it, click Test to verify, then Enable. Lark / DingTalk take an App ID/Secret; WeChat uses QR login.
3. **Pair an authorized user.** When a user first messages the bot, it replies with a 6-digit code (10-minute TTL); approve it under "Pending pairings" on the desktop.

   ![Pairing approval](/screenshots/channels-02-pairing.png)

4. **Choose the handling companion and default model.** Bots bind to a companion per channel row; a `UNIQUE(type, bot_key)` constraint guarantees one bot is never bound to two companions. Switching a binding resets that channel's active session — the next message is handled by the new companion.

   ![Channel agent / model picker](/screenshots/channels-03-default-model.png)

## What you can do from IM

- **Plain text** both ways, with **streaming edited replies** (WeChat falls back to sending a new message).
- **Action buttons** — confirm prompts, retries, etc., rendered as each platform's native inline keyboard / interactive card.
- Group chats can be configured to respond only when `@`-mentioned.

> Memory is shared family-wide: no matter how many bots or channels, session data flows into one memory system, and switching companions loses nothing.

Full docs → [GitHub](https://github.com/nomifun/nomifun)
