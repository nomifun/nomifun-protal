---
title: "Agent capabilities, made composable"
description: "From visual agent configuration to Unified Plugin, build your own way of working around clear capability boundaries."
publishedAt: "2026-10-02"
category: "Developer design"
readingTime: "7 min"
kind: "technical"
lang: "en-US"
---

This article describes the development branch as of October 2026. Features in a released installer depend on its version.

A research assistant needs search and knowledge bases. A coding assistant needs files and a terminal. A creative assistant needs models and media tools. Giving every agent every capability makes both configuration and tool use harder to understand.

NomiFun turns an agent configuration into a composable set of capabilities. Users can start with a lightweight assistant and add modules for the task at hand. Developers can extend the system through the same capability pipeline.

## Visible configuration, enforced at execution

The [visual capability workspace](https://github.com/nomifun/nomifun-desktop/blob/cbbc647d13710f89d675ce540ff79eeb3316f66b/ui/src/renderer/pages/agentSettings/AgentCapabilityWorkspace.tsx) organizes capabilities around Modules and Actions. A configuration also includes model routing, Skills, personality, instructions, and the order in which context components and middleware are combined.

These settings go through the [unified compiler](https://github.com/nomifun/nomifun-desktop/blob/cbbc647d13710f89d675ce540ff79eeb3316f66b/crates/backend/nomifun-agent-kernel/src/compiler.rs), which resolves dependencies, conflicts, resources, and their implementations into an execution snapshot. The runtime invokes capabilities within the selected scope. A prompt alone does not grant access to every tool in the platform. Specific resources, such as workspaces, knowledge bases, and devices, also require their own bindings and permission checks.

## A different agent, in the same conversation

You can organize requirements, switch to a coding agent, and continue the implementation without leaving the conversation. The current [conversation switcher](https://github.com/nomifun/nomifun-desktop/blob/cbbc647d13710f89d675ce540ff79eeb3316f66b/ui/src/renderer/pages/conversation/components/ChatConversation.tsx) first requests a switch preview, displays availability, then submits the change against the current binding version.

A switch can preserve context and, when the required conditions are met, continue a task. An active execution, missing resources, or an unresolved recovery state can prevent the switch. Previous tool calls cannot replay under the new agent's permissions. Changing capabilities is therefore an explicit change to the binding.

Different configurations reuse [the same official Nomi Runtime](https://github.com/nomifun/nomifun-desktop/blob/cbbc647d13710f89d675ce540ff79eeb3316f66b/crates/backend/nomifun-ai-agent/src/runtime_driver.rs). Models, tools, events, and recovery follow a shared contract. Agent differences are expressed through capability composition, reducing the maintenance cost of separate execution loops.

## Plugins can provide an interface, capabilities, or both

Unified Plugin uses one package format. A plugin with a UI provides an App Surface; a plugin with background logic provides a Service. A package can include both. Plugins generated through a conversation or imported from a folder or ZIP follow the same installation pipeline.

The [Service Runtime](https://github.com/nomifun/nomifun-desktop/blob/cbbc647d13710f89d675ce540ff79eeb3316f66b/crates/backend/nomifun-plugin-platform/src/service_runtime.rs) manages an independent process for plugins that include a Service. A UI-only plugin does not need a Node process. A plugin's UI and Service share their own data root. Persistent KV, SQLite, and files are managed by the [unified storage layer](https://github.com/nomifun/nomifun-desktop/blob/cbbc647d13710f89d675ce540ff79eeb3316f66b/crates/backend/nomifun-plugin-platform/src/data_root.rs). Previews use temporary data; changes made in a preview are not merged into the installed plugin's data.

## Actions connect to real entry points

An Action describes a method and its inputs and outputs. A Binding declares where the system uses it. The [current contract](https://github.com/nomifun/nomifun-desktop/blob/cbbc647d13710f89d675ce540ff79eeb3316f66b/crates/backend/nomifun-agent-contracts/src/plugin.rs) includes agent tools, context, hooks before model and tool calls, desktop commands, and events.

For example, a to-do plugin can display a list and expose an "add task" action to an agent. Its UI, background logic, and tools share data and a lifecycle. When the plugin is disabled or updated, the host withdraws its previous entry points. Capability composition and plugin extensions form one inspectable path: new features can become part of everyday work while retaining clear responsibility boundaries.
