---
title: Secure customer-service clusters
description: Create isolated customer-service Agents, bind knowledge and channel bots, and serve strangers inside a deliberately read-only runtime.
category: Services & Customer Care
order: 22
lang: en-US
---

NomiFun **Customer Service** is a separate domain from desktop companions,
available at `/customer-service`. Create multiple customer-service Agents,
configure a model, knowledge bases, greeting, persona, and service policy for
each one, then bind dedicated channel bots to the right Agent.

This is not a shortcut for exposing a full desktop companion to strangers. It
is a narrower runtime with a boundary that is easier to review and operate.

## The safety boundary

The customer-service runtime exposes only three **read-only tools**:

1. knowledge search;
2. knowledge read;
3. customer-service note search.

Terminal, file, computer-use, browser-use, and other high-risk capabilities are
not registered for customer-service Agents. Strangers do not need a desktop
companion pairing code either: messages arriving through a dedicated
customer-service channel bot are handled by the assigned service Agent.

The result is intentionally limited. A service Agent can look up facts and
approved scripts, but a visitor's message cannot make it operate your computer,
read arbitrary files, or reach the tools of a desktop companion.

## Create a service Agent

1. Open `/customer-service` and select **Create agent**.
2. Enter a name and choose a configured chat model.
3. Select the knowledge bases this Agent may search.
4. Add a greeting, persona, and service policy. Use the policy to define
   business scope, off-limits topics, and compliance wording.
5. Set the concurrency limit and save the Agent.

The detail page has separate sections for:

- **Identity and voice** — name, greeting, persona, and policy;
- **Model and knowledge** — chat model and mounted knowledge bases;
- **Channel bot bindings** — bots owned by the customer-service domain;
- **Service notes** — FAQs, scripts, and business facts.

Notes can be **private** to one Agent or **shared** with all service Agents.
Runtime access is read-only: the service Agent can cite a note but does not
rewrite the notes or knowledge bases by itself.

## Connect a channel

Customer service uses its own channel bots, independent of desktop companion
channels. When you create a bot, keep it in the customer-service domain and
bind it to the intended Agent. Once bound, inbound visitor messages on that
bot are served by that Agent without ordinary companion pairing.

The channel platform may still be external. If you enable WeCom, Feishu,
Telegram, or another connector, messages follow that platform's network and
credential model; a local customer-service runtime does not make a third-party
platform local.

## Operating recommendations

- Put product facts, support procedures, pricing rules, and approved wording in
  knowledge bases or service notes.
- State escalation-to-human and refusal rules explicitly in the service policy.
- Test greetings, retrieval quality, and refusal boundaries before opening the
  channel to visitors.
- Review the network boundaries of the selected model provider, channel
  platform, and knowledge sources.
- Never put API keys, internal credentials, or confidential material into
  shared notes.

Customer Service is still evolving. Use the in-app page and the relevant
release as the source of truth for fields, channel support, and current
security behavior.

## Related

- [Knowledge bases](/docs/guides/knowledge-base)
- [Channels](/docs/guides/channels)
- [Companions](/docs/guides/companions)

Implementation → [NomiFun Desktop on GitHub](https://github.com/nomifun/nomifun-desktop)
