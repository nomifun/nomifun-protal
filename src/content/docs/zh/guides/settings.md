---
title: 系统设置
description: 查看与调整本地数据目录、深/浅主题，以及"关于"页的版本与开源许可信息。
category: 远程与设置
order: 18
lang: zh-CN
---

系统设置是 NomiFun 的"应用级"配置面：在这里查看本地数据存放在哪、切换深色 / 浅色主题，并在"关于"页确认当前版本与开源许可。它与伙伴、模型、渠道等业务配置相互独立——那些各有专门页面，本页只管应用本身。

> 入口：侧边栏底部「设置」，路由 `/settings`。

![系统设置](/images/zh/设置/系统设置.png)

## 操作步骤

1. **打开设置**。点击侧边栏底部的「设置」进入 `/settings`，左侧分为「主题」「关于」等分组。

2. **切换主题**。在「主题」分组选择深色或浅色，界面即时生效，无需重启;选择会被记住，下次启动沿用。

   ![主题设置](/images/zh/设置/主题设置.png)

3. **查看本地数据目录**。NomiFun 是本地优先应用，所有状态都落在按用户的应用数据目录下：
   - macOS：`~/Library/Application Support/NomiFun/Nomi`
   - Windows：`%LOCALAPPDATA%\NomiFun\Nomi`
   - Linux：`$XDG_DATA_HOME/NomiFun/Nomi`（通常即 `~/.local/share/NomiFun/Nomi`）

   该目录内含 SQLite 数据库（会话、设置）、`companion/`（伙伴 + 共享记忆中枢）、`knowledge/`（知识库）与 `logs/` 等。桌面应用、自托管 Web 与开发脚本默认共用同一目录——所以在一个宿主里配好的提供商或伙伴，在另一个宿主里同样可见。

4. **查看关于信息**。打开「关于」分组，确认当前版本与开源许可。

   ![关于（版本 / 许可）](/images/zh/设置/关于.png)

## 关于本页信息

- **版本**：当前为 `0.1.0`（pre-1.0）。仍在快速迭代阶段，配置项与界面可能随版本调整。
- **许可证**：**Apache-2.0**。完全开源、接受审计，源码托管于 GitHub。

## 要点与边界

- **数据即数据库**：把数据目录当成数据库对待——做好备份、限制权限即可整体迁移；复制到新机器即可搬家，退出应用后删除该目录即可重置。
- **隔离沙箱**：想让某次运行用独立目录，在启动前设置环境变量 `NOMIFUN_DATA_DIR=<绝对路径>`（桌面应用会在其后附加 `/Nomi`）。同一目录被两个后端同时占用会被机制性阻止——启动会带着持有者信息快速失败。
- **共享 / 私有记忆，按伙伴技能**：数据目录里的 `companion/` 支持共享记忆和按伙伴私有记忆；技能库（skill）仍按伙伴隔离。
- **本页不含运行配置**：computer-use / browser-use / nomi agent 的开关与权限不在系统设置里，详见 [电脑操作与浏览器操作](/zh/docs/guides/computer-browser-use)。

## 常见问题

**改主题需要重启吗？** 不需要，深 / 浅主题即时切换并被记住。

**怎么找到我的数据在哪？** 按上方平台路径定位；若设过 `NOMIFUN_DATA_DIR` 则在该路径下的 `Nomi` 子目录。

**版本号在哪看？** 设置 →「关于」分组，当前为 `0.1.0`。

## 相关

- [电脑操作与浏览器操作](/zh/docs/guides/computer-browser-use) —— computer-use / browser-use / agent 运行的开关与权限。
- [WebUI 远程访问](/zh/docs/guides/webui-remote) —— 把桌面实例经登录暴露给手机 / 局域网。
- [伙伴管理](/zh/docs/guides/companions) —— 共享 / 私有记忆作用域与按伙伴技能库。

完整文档 → [GitHub](https://github.com/nomifun/nomifun-tauri)
