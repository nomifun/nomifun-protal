---
title: MCP 与技能
description: 接入外部 MCP server 扩展工具，管理技能知识包，并区分"外部工具"与"伙伴专属技能库"两条扩展路径。
category: 知识与开放能力
order: 12
lang: zh-CN
---

NomiFun 有两条容易混淆的扩展路径，这页帮你分清并配好它们：

- **MCP server**——外部工具服务器，通过 stdio / HTTP / SSE 暴露可调用工具，让 agent 多出一批"能动手"的能力。
- **技能（skill）**——markdown / 文件夹知识包，告诉 agent *如何* 完成某个工作流；它是知识，不是常驻工具服务器。

反过来，NomiFun 自身的 151 项能力也经三个公开门面对外暴露——`/mcp`（全量 Remote）、`/mcp-agent`（精选 do-work 子集）、`/v1`（REST + OpenAPI 3.1 + SSE 流）——让 Claude / Codex / 任意 Agent 通过 MCP/Skill 直接驱动 NomiFun。

> 入口：侧边栏 **MCP**（`/mcp`）配置外部 server，**技能** 页（`/assistants?tab=skills`）管理通用技能包，对外暴露在 `/open-capabilities`。旧版 Settings URL 会自动重定向到这些页面。

## 接入外部 MCP server

1. **新增 server**。打开 `/mcp` 点新增，填名称、选 transport——stdio 填 command / args / env，HTTP / SSE 填 URL。从其他 agent 配置导入时还会保留原始 JSON。

   ![配置 MCP server](/images/zh/助手&skill&mcp/mcp配置.png)

2. **连接测试**。保存前点连接测试：后端启动一个临时 MCP client、完成握手、列出工具并把结果持久化。失败码会区分命令不存在、权限、超时、HTTP、RPC 与协议错误，便于排查。

3. **处理 OAuth**。需要 OAuth 的 HTTP / SSE server 走内置 OAuth 流程授权后即可连接。

4. **导入 / 同步 agent 配置**。从已支持的本地 agent CLI 探测 MCP 配置，把探测到的 server 一键导入 NomiFun；当 adapter 支持写入时，也能把 NomiFun 的 MCP 列表同步回选中的 agent 配置。这一步只是配置管理。

5. **每会话选择**。全局启用只是让 server 可用，不会自动注入每个会话。某次会话最终能看到哪些 server，由三部分合并而成：全局启用的 server + 该会话勾选的 server + 当前能力集需要的内置 bridge server。

## 管理技能（通用知识包）

打开 `/assistants?tab=skills` 管理跨伙伴通用的技能包。技能可以是单个 markdown 文件，也可以是含 `SKILL.md` 的目录，按来源分三类：

| 来源 | 含义 |
| --- | --- |
| Builtin | 随应用发布，部分会自动注入会话 |
| Custom | 你导入或放入配置目录的技能 |
| Extension | 已安装扩展提供的技能 |

技能可打标签、导入、导出 / 符号链接、扫描外部目录，也可按某个 agent 后端进行 materialize。

![技能页](/images/zh/助手&skill&mcp/skills.png)

## 两种"技能"别搞混

`/assistants?tab=skills` 这里管理的是**跨伙伴通用**的技能知识包。它和"伙伴专属技能库"是两回事：

- **通用技能（本页）**——你手工策展、所有伙伴可共用的知识包，来源是 Builtin / Custom / Extension。
- **伙伴专属技能库（在伙伴页）**——每只伙伴各养成一套、**按伙伴隔离**的技能。进化引擎从该伙伴的**工具调用序列**中自动挖掘可复用 skill（仅基于调用序列本身，**不含任何参数值**），生成草稿后由你评审对应的 `SKILL.md` 再决定是否启用；养成的技能还能**赠予（gift）**给其它伙伴。详见[超级伙伴](/docs/guides/companions)。

> 记忆与技能的边界要分清：**记忆是共享记忆中枢、全家共享**一条采集 / 学习链路；**技能库按伙伴隔离**。按伙伴细分的私有记忆敬请期待。

## 把 NomiFun 暴露给外部 Agent

在 `/open-capabilities` 管理对外入口。通过 companion-token（Bearer，SHA-256 存储，常量时间比对）鉴权，调用者"以该伙伴身份"在 Remote 面操作。头部能力是 `nomi_agent_run`（流式）+ `nomi_agent_result`（轮询）委派。这些入口默认应逐项审查后再启用。

## 要点与边界

- **全局启用 ≠ 注入会话**：MCP server 全局启用只是"可用"，进不进某次会话由该会话的勾选决定。
- **连接测试是临时 client**：测试只为握手、列工具并落库结果，不影响后续会话的真实连接。
- **进化引擎只看序列、不看参数**：伙伴专属技能的挖掘仅基于工具调用**序列**，不会记录参数值，因此沉淀出的技能可放心评审与 gift。
- **当前版本 0.1.0（pre-1.0）**：部分入口（如对外能力面板）建议审查后再开启。

## 相关

- [超级伙伴](/docs/guides/companions) —— 伙伴专属技能库、进化挖掘与技能 gift。
- [知识库](/docs/guides/knowledge-base) —— 给会话 / 终端 / 伙伴挂载知识库，让 agent"先查再答"。
- [终端](/docs/guides/terminal) —— agent 实际执行命令的地方。

完整文档 → [GitHub](https://github.com/nomifun/nomifun-tauri)
