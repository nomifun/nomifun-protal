# NomiFun Portal

NomiFun 是一项**完全开源、免费、无商业化限制**的本地优先 Agent
Desktop。它把桌面伙伴、会话协作、模型管理、知识库、Skill、MCP、REST API、
WebUI 远程访问、Browser Use、Computer Use、需求管理、自动工作、创意工坊和
Agent Desktop 小程序放进一套可审计、可扩展的工作站。

本仓库是 NomiFun 官方网站与中英文文档门户源码。核心桌面产品位于
[nomifun/nomifun-desktop](https://github.com/nomifun/nomifun-desktop)；移动端与硬件
伙伴生态见下方的[NomiFun 开源生态家族](#nomifun-开源生态家族)。

![NomiFun 自动工作与编排画布](public/images/showcase/autowork-flow-readme.png)

## 当前状态

> NomiFun Desktop 当前公开版本为 **v0.6.1**，项目整体仍处于 **pre-1.0** 快速迭代阶段。
> 请以 GitHub Releases、应用「关于」页和当前代码为准。

NomiFun 最初只是作者自用、以及给内容朋友使用的工具；直到 **2026 年完成 UI 重构**
后才逐步开源。它仍然是一个实验性、公益性产品，维护人力有限，因此不会承诺企业级
SLA，也没有强宣传或商业化增长诉求。欢迎使用、审计、二次开发和共建，也请对版本、
稳定性和生产部署保持合理预期。

## NomiFun 开源生态家族

| 项目 | 定位 |
|---|---|
| [NomiFun Desktop](https://github.com/nomifun/nomifun-desktop) | 跨平台主工作台：Windows、macOS、Linux；多模型、多 Agent、会话、终端、WebUI、知识库、自动化和本地伙伴能力。 |
| [NomiFun Mobile](https://github.com/nomifun/nomifun-mobile) | 手机远控入口：优先在局域网中连接自己的 Desktop，查看状态、发送指令、处理确认项和管理定时任务。 |
| [NomiFun Xiaozhi Yuntai](https://github.com/nomifun/nomifun-xiaozhi-yuntai) | 硬件多模态伙伴接入：把小智兼容设备的语音、显示和设备 MCP 能力接入 NomiFun。 |

## 下载与演示

- 官方桌面安装包：[GitHub Releases](https://github.com/nomifun/nomifun-desktop/releases)
- 中国区备用下载：[百度网盘分享 nomifun](https://pan.baidu.com/s/5GPonoJNrwJ7GciBSDgXLaA)
- 中国区视频：[抖音演示](https://www.douyin.com/user/self?from_tab_name=main&modal_id=7657100052061523209) / [B站演示](https://www.bilibili.com/video/BV1kwKZ6UE5X/)
- 海外视频：[YouTube](https://youtu.be/AsEToBDFR9s) / [X](https://x.com/colir0/status/2072001821640437776?s=20)

## 核心承诺

### 数据安全：all in local

NomiFun 的应用逻辑与默认数据都在本机。项目没有数据采集遥测管道、analytics SDK
或后台自发回传机制；除非你主动配置并调用模型、渠道、Webhook、外部知识源、远程
MCP/REST、CDN 或其它连接，否则核心工作流不会自行把数据发往第三方。

这不是“绝对断网”承诺：你选择的模型供应商仍会收到它需要处理的上下文，启用的外部
渠道也会按其协议通信。NomiFun 的边界是让外联由你的配置触发、入口清晰、代码可审计。

### 开源、免费与二次开发

主产品以 **Apache-2.0** 开源。个人和企业可以阅读、审计、内部使用、Fork、二次开发
和商业化，不需要向 NomiFun 申请额外授权；保留许可证与声明即可。NomiFun 本身不收
会员费、订阅费、广告费或功能费，可能产生的模型 token 成本由你直接承担。

架构平实而可理解：React 19 + Tauri 2 + Rust 2024，桌面与 Web 共用清晰的前后端能力。
这使它适合作为企业自研先进 Agent Desktop 的起点，在内网、私有模型、权限体系和业务
流程中按需裁剪与扩展。

## 已公开能力

- **多模型供应商、多 Agent 与 ACP**：内置 Nomi Agent，也可接入 Claude Code、Codex、
  Gemini 等外部 Agent；模型、能力与会话可组合使用。
- **交互式会话与 AI 终端**：普通会话拥有消息流、文件工作区、预览和协作执行；内置
  原生 PTY，可运行 Shell、Claude Code、Codex、Gemini 等工作流。
- **WebUI 远程控制**：在可信局域网、VPN 或 Tailscale 中开启 Desktop WebUI，手机或
  平板扫码登录后使用同一套工作界面；本地电脑就是服务器。
- **知识与开放能力**：本地 Markdown、URL 快照、回写策略、MCP、REST/OpenAPI、
  Skills 和渠道网关可以按授权组合。
- **Agent Desktop 小程序**：普通会话生成单文件 HTML，显式发布后进入本地小程序库；
  继续迭代时物化本地工作副本，再由新的普通会话修改并发布快照，同时支持导入与沙箱运行。
- **创意工坊（Beta）**：无限画布支持图片、文字、视频、生成器、TTS 与流程节点；
  部分生成能力依赖已配置的模型供应商，Beta 功能可能调整。
- **安全客服域**：独立客服 Agent 只注册知识检索、知识阅读和客服笔记三个只读工具，
  不注册终端、文件、电脑或浏览器等高危能力。
- **硬件伙伴**：通过 Xiaozhi Yuntai 接入兼容小智的 ESP32 设备与设备端 MCP 工具。

## 前瞻布局

以下内容用于说明 NomiFun 的产品方向，不等同于全部已经公开发布：

### 2025 年内部自研、逐步开放

- Xiaozhi 的 Computer Use / Browser Use；
- Loop for Claude、Codex Agent 的自动化需求管理；
- 三方决策、实施分离的 IDMM 智能决策容灾系统；
- 硬件多模态接入伙伴；
- Agent 知识库与工作上下文；
- 伙伴的记忆、Skill、设定自进化、迁移与架构。

### 2026 年初创新上线或逐步开放

- Agent Desktop 小程序；
- 安全客服集群系统；
- 手机移动端直连 Desktop 的控制路径；
- 独创的 Agent 集群交互与 IM channel 网关；
- 以及尚未公开的保密方向。

具体功能状态、支持平台和安全边界，以当前 Desktop release 与文档为准；内部布局不应被
理解为对所有用户承诺的完整公开功能清单。

## Docker 自托管（可选）

需要无头 Web 宿主时，可使用官方 Docker Hub 镜像：
[nomifun/nomifun-web](https://hub.docker.com/repository/docker/nomifun/nomifun-web)。
版本与环境变量请以主项目当前文档为准，下面示例沿用已发布的 `v0.3.4` 标签；部署前请查看 Docker Hub，如有更新标签请替换为对应版本：

```bash
docker run -d \
  --name nomifun-web \
  --restart unless-stopped \
  -p 8787:8787 \
  -v nomifun-data:/data \
  nomifun/nomifun-web:v0.3.4
```

启动后打开 `http://<服务器IP>:8787`，首次访问按页面提示创建管理员。公网部署请放在
TLS 反向代理后，设置强密码并做好 `/data` 备份。

## 官网与文档门户开发

技术栈：Astro 5、React 19 islands、UnoCSS、TypeScript。英文在 `/`，中文在 `/zh`；
文档内容位于 `src/content/docs/zh/` 与 `src/content/docs/en/`。

```bash
bun install
bun run dev
bun run build
```

截图、品牌资源和来源说明见 [`docs/RESOURCES-TODO.md`](docs/RESOURCES-TODO.md)。

## 贡献与许可证

欢迎提交 issue、PR、文档修正、截图补充、设计建议和真实使用反馈。项目人力有限，但
代码、审计、生态适配、文档和传播方面的认真贡献都很有价值。

主产品以 Apache-2.0 许可开源。二次开发、商用、部署、数据处理、模型调用和合规风险由
使用方自行承担；作者与贡献者不对下游使用、模型输出或交付结果承担责任。
