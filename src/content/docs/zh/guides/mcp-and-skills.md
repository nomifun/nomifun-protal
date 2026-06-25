---
title: MCP 与技能
description: 配置 MCP server、管理技能，并通过开放能力把 NomiFun 暴露给任意 Agent。
category: 核心操作
order: 6
lang: zh-CN
---

NomiFun 有两种容易混淆的扩展机制：

- **MCP server** 是外部工具服务器，通过 stdio / HTTP / SSE 暴露可调用工具。
- **技能（skill）** 是 markdown / 文件夹知识包，告诉 agent 如何完成某个工作流——它不是常驻工具服务器。

反过来，NomiFun 自身的 151 项能力也经三个公开门面对外暴露——`/mcp`（全量 Remote）、`/mcp-agent`（精选 do-work 子集）、`/v1`（REST + OpenAPI 3.1 + SSE 流）——让 Claude / Codex / 任意 Agent 通过 MCP/Skill 直接驱动 NomiFun。

![MCP 能力页](/screenshots/mcp-01-capabilities.png)

## 操作步骤

1. **添加 MCP server**。打开 `/mcp` 新增 server：填名称、选 transport（stdio 填 command/args/env，HTTP/SSE 填 URL），点连接测试——后端会启动临时 client、完成握手、列出工具并持久化结果。需要 OAuth 的 HTTP/SSE server 走内置 OAuth 流程。
2. **导入 / 同步 agent 配置**。从已支持的本地 agent CLI 探测 MCP 配置，可把探测到的 server 导入 NomiFun，也可把 NomiFun 的 MCP 列表同步回选中的 agent 配置。
3. **每会话选择**。全局启用只是让 server 可用；某次会话最终能看到哪些 server，由该会话的勾选决定。
4. **管理技能**。打开 `/assistants?tab=skills`。技能可以是单个 markdown 文件或含 `SKILL.md` 的目录，分 Builtin / Custom / Extension 三种来源，可打标签、导入导出、扫描外部目录，并按某个 agent 后端 materialize。

   ![技能页](/screenshots/mcp-03-skills.png)

## 把 NomiFun 暴露给外部 Agent

通过 companion-token（Bearer，SHA-256 存储，常量时间比对）鉴权，调用者"以该伙伴身份"在 Remote 面操作。头部能力是 `nomi_agent_run`（流式）+ `nomi_agent_result`（轮询）委派。在 `/open-capabilities` 管理这些对外入口，启用前应逐项审查。

> 技能进化引擎会从工具调用序列中自动挖掘可评审的 `SKILL.md`，伙伴之间还能"技能 gift"互赠技能。技能库按伙伴隔离，记忆则全家共享。

完整文档 → [GitHub](https://github.com/nomifun/nomifun)
