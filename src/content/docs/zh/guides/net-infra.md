---
title: NomiFun Net Infra 网络中继
description: 自托管 NomiRelay，把 NAT 后的 Desktop 或其他服务安全提供给跨网络的手机与 IoT 设备。
category: 接入与开放
order: 47
lang: zh-CN
---

# NomiFun Net Infra 网络中继

[NomiFun Net Infra](https://github.com/nomifun/nomifun-net-infra)（核心程序名
**NomiRelay**）是一套独立开源、可自托管的通用网络中继。它把家庭或工厂 NAT
后面的 HTTP、WebSocket、TCP、UDP 服务，通过部署者自己的公网中继提供给手机与
IoT 设备。

它不会替代 NomiFun Desktop：Desktop 仍然保存模型、伙伴、会话、文件和工作区数据，
并执行 Agent 与任务；NomiRelay 只负责网络承载、隧道策略和可观察性。

## 在 NomiFun 生态中的位置

```text
NomiFun Mobile
      │  HTTP / WebSocket
      ▼
NomiRelay 业务入口（公网、自托管）
      │  QUIC 优先；受限网络可回退 TLS/TCP
      ▼
nfagent ──► NomiFun Desktop WebUI（NAT 后）
```

- **可信局域网**：Mobile 仍应优先直连 Desktop，不需要中继。
- **跨网络访问**：部署者可运行 `nfrelay`，并在能访问 Desktop 的机器上运行
  `nfagent`，再创建指向 Desktop WebUI 的业务隧道。
- **职责隔离**：Mobile 只访问业务入口，不调用 Relay 控制台 API，也不保存管理员
  密码、一次性 enrol token 或 SPKI pin。
- **其他场景**：同一套中继也可服务小智设备、家庭服务、工厂机器人及普通
  HTTP/WebSocket/TCP/UDP 工作负载。

## 核心能力

- QUIC/UDP 优先承载，UDP 被封锁时可回退到 TLS/TCP + smux；
- HTTP、WebSocket、TCP、UDP 隧道，以及可选共享入口与 TURN/STUN；
- SPKI 指纹绑定、一次性 agent 入网令牌、默认拒绝的本地目标策略；
- 每隧道连接数、来源、速率和数据量限制，以及审计事件和运行指标；
- React Web 控制台、SQLite 持久化、Docker Compose 与 systemd 部署入口。

## 最小接入流程

1. 按仓库 [Quick start](https://github.com/nomifun/nomifun-net-infra#快速上手)
   构建并启动 `nfrelay`。
2. 在仅限运维访问的控制台完成初始化，签发一次性 agent 入网令牌。
3. 在能访问目标 Desktop 的机器上运行 `nfagent`，使用中继地址、SPKI pin、令牌和
   持久状态目录入网。
4. 创建一条指向 Desktop WebUI 的业务隧道；Mobile 填写的是该**业务入口**，不是
   Relay 控制台端口。
5. 公网使用前单独验收 HTTPS/WSS、证书、防火墙、DNS、持久化、备份和吊销策略。

详细命令、端口和安全注意事项以
[NomiRelay 接入文档](https://github.com/nomifun/nomifun-net-infra/tree/main/docs/integration)
及 [Mobile Relay 集成文档](https://github.com/nomifun/nomifun-mobile/blob/main/docs/RELAY-INTEGRATION.md)
为准。本地 loopback 联调成功不等于公网部署已经通过安全验收。

## 相关入口

- [NomiFun Net Infra 产品页](/zh/products/net-infra/)
- [NomiFun Net Infra 源码](https://github.com/nomifun/nomifun-net-infra)
- [NomiFun Mobile](https://github.com/nomifun/nomifun-mobile)
- [NomiFun Desktop WebUI 远程访问](/zh/docs/guides/webui-remote/)
