---
title: NomiFun Net Infra relay
description: Self-host NomiRelay to expose Desktop or other services behind NAT to phones and IoT devices across networks.
category: Integration & access
order: 47
lang: en-US
---

# NomiFun Net Infra relay

[NomiFun Net Infra](https://github.com/nomifun/nomifun-net-infra), whose core
service is named **NomiRelay**, is an independent, self-hosted, general-purpose
network relay. It exposes HTTP, WebSocket, TCP, and UDP services behind home or
factory NAT through infrastructure operated by the deployer.

It does not replace NomiFun Desktop. Desktop still owns models, companions,
sessions, files, and workspace data and performs Agent and task execution.
NomiRelay handles network transport, tunnel policy, and observability.

## Where it fits

```text
NomiFun Mobile
      │  HTTP / WebSocket
      ▼
NomiRelay business endpoint (public, self-hosted)
      │  QUIC first; TLS/TCP fallback on restricted networks
      ▼
nfagent ──► NomiFun Desktop WebUI (behind NAT)
```

- **Trusted LAN:** Mobile should still connect directly to Desktop; no relay is
  required.
- **Cross-network access:** run `nfrelay`, install `nfagent` where it can reach
  Desktop, and create a business tunnel to the Desktop WebUI.
- **Separated responsibilities:** Mobile connects only to the business
  endpoint. It does not call the relay console API or store the admin password,
  one-time enrol token, or SPKI pin.
- **Beyond Mobile:** the same relay can serve Xiaozhi devices, home services,
  factory robots, and ordinary HTTP/WebSocket/TCP/UDP workloads.

## Core capabilities

- QUIC/UDP first, with TLS/TCP + smux fallback when UDP is blocked;
- HTTP, WebSocket, TCP, and UDP tunnels, plus optional shared ingress and
  TURN/STUN;
- SPKI pinning, one-time agent enrolment, and default-deny local-target policy;
- per-tunnel connection, source, rate, and byte limits with events and metrics;
- an embedded React console, SQLite persistence, Docker Compose, and systemd
  deployment paths.

## Minimal integration path

1. Build and start `nfrelay` using the repository
   [quick start](https://github.com/nomifun/nomifun-net-infra/blob/main/README.en.md#quick-start).
2. Initialize the operator-only console and issue a one-time agent enrol token.
3. Run `nfagent` where it can reach Desktop, using the relay address, SPKI pin,
   token, and a persistent state directory.
4. Create a business tunnel to Desktop WebUI. Mobile connects to that
   **business endpoint**, never to the relay console port.
5. Before public use, validate HTTPS/WSS, certificates, firewall rules, DNS,
   persistence, backups, and revocation separately.

Use the [NomiRelay integration docs](https://github.com/nomifun/nomifun-net-infra/tree/main/docs/integration)
and [Mobile relay integration guide](https://github.com/nomifun/nomifun-mobile/blob/main/docs/RELAY-INTEGRATION.md)
for exact commands and boundaries. A successful loopback test is not evidence
that a public deployment has passed security validation.

## Related links

- [NomiFun Net Infra product page](/products/net-infra/)
- [NomiFun Net Infra source](https://github.com/nomifun/nomifun-net-infra)
- [NomiFun Mobile](https://github.com/nomifun/nomifun-mobile)
- [NomiFun Desktop WebUI remote access](/docs/guides/webui-remote/)
