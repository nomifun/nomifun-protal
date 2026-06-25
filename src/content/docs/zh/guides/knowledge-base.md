---
title: 知识库
description: 用户策展的 markdown 目录、URL 实时快照、安全回写暂存区与会话挂载。
category: 核心操作
order: 3
lang: zh-CN
---

知识库是 NomiFun 的"config one, use anywhere"理念在内容侧的落地：一个由你策展的 markdown 目录，挂载进会话工作区后，agent 会按一份显式检索协议**先查再答**，而不是凭记忆作答。知识库可以绑定到会话、终端或某只伙伴，也能打包成 `.zip` 导出 / 导入。

## 三种知识来源

1. **本地 markdown**——你自己组织的目录，最直接。
2. **URL 实时快照**——创建时可给最多 16 条公网 URL；*snapshot* 模式抓取并转为 markdown 落库（超大页面由 AI 压缩），*live* 模式留给 agent 运行期实时抓取。内置 SSRF 防护，仅接受 `http/https`。
3. **飞书 Feishu**——连接器已实现。（**Notion 来源 = 路线图，尚未实现**。）

## 操作步骤

1. **建库**。在知识库页面新建知识库，给出名称、组织 markdown 目录，必要时附上 URL 知识源。
2. **AI 生成描述**。点"AI 生成"调用 `autogen` 为库生成描述与 `README.md`（需已配置 AI Provider）。
3. **绑定到对象**。把库绑定到当前会话、终端或某只伙伴；绑定伙伴后，它的陪伴聊天与渠道会话都会挂载这只伙伴的库。
4. **选择回写模式**。决定对话中产生的知识如何回流：
   - **Disabled**——不回写。
   - **Staged（暂存）**——回写先落入库的 `_inbox/`，由你审阅后入库。**IM 写入永远走 Staged**，绝不直写。
   - **Direct（直写）**——跳过暂存直接写入库正文。

## agent 看到什么

库挂载到 `{workspace}/.nomi/knowledge/`，注入上下文按库携带描述、AI 梗概、"何时查阅"提示和按预算的目录（每库 20 条 / 全局 60 条），外加显式检索协议。伙伴还能自己养库——Desktop Gateway 提供建库 / 写文件 / 抓取 URL 等知识工具，它可以在对话中不经吩咐就沉淀心得。

> 安全回写暂存区是一条红线：任何来自 IM 的写入都先进 `_inbox` 待审，永不直接落正文。

完整文档 → [GitHub](https://github.com/nomifun/nomifun)
