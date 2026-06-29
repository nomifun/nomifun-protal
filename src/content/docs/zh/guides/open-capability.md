---
title: 开放能力（MCP / REST / OpenAPI）
description: 用一枚 companion-token 把 NomiFun 的 151 项能力经 /mcp、/mcp-agent、/v1 暴露给任意 Agent，并以伙伴身份远程委派任务。
category: 知识与开放能力
order: 13
lang: zh-CN
---

NomiFun 把整个平台的 151 项能力（agent / 浏览器 / computer / 知识库 / 文件 / 平台控制）通过三个网络可达的公开门面对外暴露。任何 MCP 客户端或 HTTP 脚本，只要填一个 URL 加一枚访问令牌，就能像“桌面伙伴”一样驱动平台——这页讲怎么开通入口、拿令牌、连客户端，以及一句话委派任务。

> 入口：在“开放能力”面板（`/open-capabilities`）查看并管理这些对外门面；启用前请逐项审查。

![MCP 能力面板](/images/zh/开放能力/mcp能力.png)

## 三个公开门面

| 门面 | 路径 | 适合 |
|---|---|---|
| 全量 MCP | `/mcp` | MCP 客户端，需要全平台控制面（Remote 面全量工具） |
| 精选 MCP | `/mcp-agent` | MCP 客户端，只要精选的 do-work 子集（agent / 浏览器 / computer / 知识库 / 文件） |
| REST | `/v1` | 脚本、自动化、其它语言；含 `/v1/openapi.json`（OpenAPI 3.1）与 SSE 流式 |

三个门面共用同一条能力总线、同一套 companion-token 鉴权。头部能力是 **`nomi_agent_run`**（流式委派）配 **`nomi_agent_result`**（轮询长任务结果）。

## 操作步骤

1. **拿到端点**。本机为 `http://127.0.0.1:<端口>`（桌面应用的回环端口，或 `nomifun-web` 的服务端口）；开启 WebUI 远程访问后为 `http://<你的局域网IP>:25808`。
2. **生成 companion-token**。在“开放能力”面板为某个伙伴点“生成访问令牌”。令牌**只存哈希（SHA-256）、明文只在铸造时显示一次**，且**绑定到这一个伙伴**——请立即复制保存。无头部署可在启动时用环境变量播种：`NOMIFUN_COMPANION_TOKEN=$(openssl rand -hex 32) nomifun-web`，绑定到默认伙伴。
3. **连接 MCP 客户端**。在 Claude Code / Cursor 等客户端的 `mcpServers` 里把 NomiFun 配成 Streamable-HTTP server：

   ```json
   {
     "mcpServers": {
       "nomifun": {
         "type": "streamable-http",
         "url": "http://127.0.0.1:25808/mcp-agent",
         "headers": { "Authorization": "Bearer <伙伴访问令牌>" }
       }
     }
   }
   ```

   连上后 `tools/list` 即见 `nomi_*` 工具，`tools/call` 驱动；要全平台控制面把 `/mcp-agent` 换成 `/mcp`。
4. **或走 REST**。脚本与自动化直接打 HTTP，鉴权头一致：

   ```bash
   # 列能力（精瘦 agent 档）
   curl -s "http://127.0.0.1:25808/v1/tools?profile=agent" \
     -H "Authorization: Bearer $TOKEN"

   # 一句话把任务委派给一个自治 nomi agent
   curl -s -X POST "http://127.0.0.1:25808/v1/tools/nomi_agent_run" \
     -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
     -d '{"goal":"调研竞品定价并写入 notes.md","timeout_secs":600}'
   # => {"result":{"conversation_id":123,"status":"completed","text":"..."}}
   #    长任务返回 {"status":"running",...}，之后用 nomi_agent_result 轮询
   ```
5. **要实时进度用流式**。`POST /v1/tools/nomi_agent_run/stream` 走 SSE，逐行吐 `data:` 增量事件，末帧 `{"type":"__result__",...}` 带终值；MCP 端的长任务则用 `nomi_agent_run` 返回的 `{status:running}` 句柄配 `nomi_agent_result` 轮询。
6. **从 OpenAPI 生成客户端**（可选）。`GET /v1/openapi.json[?profile=agent]` 是 OpenAPI 3.1 契约，可喂给 `openapi-generator` 生成任意语言的 typed client，或导入 Postman / Insomnia / Bruno。

## 要点与边界

- **以伙伴身份运行**：调用继承所绑定伙伴的 profile 模型、人格与知识库，伙伴之间彼此隔离。`nomi_agent_run` 不显式指定 `model` 时会用该伙伴的 profile 模型，**所以该伙伴必须先配好可用模型**（否则铸造令牌时会返回 `warning`，需要模型的能力会失败）。
- **权限分级（Remote 面）**：读 / 写允许；破坏性操作需二次确认（先返回 `needs_confirmation`，向用户复述后带 `"confirm": true` 重试）；敏感能力（`secret.*`、`factory_reset` 等）默认在 Remote 面被拒，且**不出现在 `tools/list`**。
- **结果信封**（REST）：成功 `200 {"result": ...}`；需确认 `409 {"needs_confirmation":true,...}`；工具报错 `422`；未知工具 `404`；无/错令牌 `401`。
- **安全**：持令牌即等价于授予远程代码执行能力，只发给可信客户端；公网暴露务必前置 TLS 反代加防火墙。令牌可随时吊销/轮换，吊销只影响对应伙伴，其它伙伴不受影响。

## 常见问题

- **`/mcp` 还是 `/mcp-agent`？** 要全平台控制面用 `/mcp`；只想把活干完、面更干净用 `/mcp-agent`。
- **不用 MCP 客户端行不行？** 行，任意能发 HTTP 的工具（n8n / Zapier / shell 脚本）指向 `POST /v1/tools/{name}` 即可，零 SDK。
- **怎么发现有哪些能力？** `GET /v1/tools`（或 `?profile=agent`）列出每个工具的名称、描述与 JSON Schema，工具名以此为准。

## 相关

- [MCP 与技能](/zh/docs/guides/mcp-and-skills)
- [WebUI 远程访问](/zh/docs/guides/webui-remote)
- [伙伴](/zh/docs/guides/companions)
- [知识库](/zh/docs/guides/knowledge-base)

完整文档 → [GitHub](https://github.com/nomifun/nomifun-tauri)
