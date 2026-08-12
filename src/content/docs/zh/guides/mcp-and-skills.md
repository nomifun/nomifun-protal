---
title: MCP 与 Skills
description: 接入外部 MCP Server，管理已安装 Skills，并通过 Skill Market 发现与审核新技能。
category: 知识与开放能力
order: 12
lang: zh-CN
---

NomiFun 用两种方式扩展能力：

- **MCP Server** 提供可调用的外部工具，例如搜索、数据服务或第三方应用操作。
- **Skill** 是一个包含说明与资源的知识包，告诉 Agent 如何稳定完成某类工作流。

侧边栏的 **MCP** 用来连接工具服务器；**技能** 用来管理本地 Skills 与 Skill Market。

## 接入 MCP Server

1. 打开侧边栏“MCP”，点击新增。
2. 选择连接方式：本地命令使用 stdio，远程服务使用 HTTP 或 SSE。
3. 填写命令、参数、环境变量或 URL；需要 OAuth 的服务按界面提示授权。
4. 保存前先做连接测试。NomiFun 会完成握手并列出可用工具，错误信息会区分命令、权限、超时、网络与协议问题。
5. 在会话中选择本次真正要使用的 MCP Server。全局启用表示“可选”，不会强制注入每一次会话。

![配置 MCP Server](/images/zh/助手&skill&mcp/mcp配置.png)

如果其它本地 Agent 已经有 MCP 配置，可以使用导入功能扫描并复用，减少重复填写。

## 管理已安装 Skills

打开“技能”并停留在“已安装 Skills”。这里统一显示三种来源：

| 来源 | 含义 |
| --- | --- |
| Builtin | 随 NomiFun 发布的内置 Skill |
| Custom | 你导入、链接或自己编写的 Skill |
| Extension | 已安装扩展提供的 Skill |

你可以查看详情、搜索、打标签、导入目录、扫描外部位置，也可以把 Skills 准备给不同 Agent 使用。

![已安装 Skills](/screenshots/skills-library-zh.png)

## 从 Skill Market 发现技能

切换到 **Skill Market**，NomiFun 会同步 ClawHub 与 SkillHub 的公开榜单。你可以：

1. 在 ClawHub / SkillHub 之间切换；
2. 用关键词、受众标签和场景标签筛选；
3. 打开卡片查看技能说明与来源；
4. 点击添加，把安装请求交给 Nomi 生成确认草稿；
5. 审核来源、目标目录和具体改动后再执行安装。

![Skill Market](/screenshots/skills-market-zh.png)

浏览市场不会静默安装任何内容。发现与执行被分开，你可以先确认来源和用途，再决定是否安装第三方 Skill。

## 通用 Skills 与伙伴技能

侧边栏“技能”管理的是可以跨会话、跨伙伴复用的通用 Skills。伙伴页面中的技能库则属于某个具体伙伴，用于沉淀它在长期协作中形成的工作方式。两者都使用 Skill 形式，但作用范围不同。

## 安全建议

- 安装第三方 Skill 前阅读 `SKILL.md` 和附带脚本。
- MCP Server 只授予完成工作所需的最小权限。
- 需要密钥时优先使用环境变量或应用凭据设置，不要把密钥写进 Skill 文件。
- 为敏感工作单独选择 MCP 与 Skills，不要默认把所有能力放进每个会话。

## 相关

- [设定](/zh/docs/guides/assistants) —— 把常用 Skills 与模型组合成一键配置。
- [知识库](/zh/docs/guides/knowledge-base) —— 为会话提供项目资料。
- [超级伙伴](/zh/docs/guides/companions) —— 伙伴自己的技能与记忆。

完整源码与发布记录 → [GitHub](https://github.com/nomifun/nomifun-desktop)
