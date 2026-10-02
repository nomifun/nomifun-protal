"use client";

import { useState } from "react";
import Link from "@/components/i18n/LocaleLink";
import { useLocale } from "@/components/i18n/LocaleProvider";
import Icon from "@/components/Icon";
import { handleTabNavigation } from "./tabNavigation";

const surfaces = [
  {
    id: "mobile",
    icon: "DeviceMobile",
    label: "Mobile",
    title: "电脑上的工作，随身继续。",
    titleEn: "Your desktop work, wherever you go.",
    body: "手机通过一次性二维码配对。会话、需求、任务和伙伴来自同一个 Desktop，可信局域网内直接连接。",
    bodyEn:
      "Pair your phone with a single-use QR code. Conversations, requirements, tasks, and companions come from the same Desktop, connected directly on a trusted local network.",
    route: "mobile",
    wire: "DIRECT / HTTP + WEBSOCKET",
  },
  {
    id: "robot",
    icon: "Robot",
    label: "小智云台",
    labelEn: "Xiaozhi Yuntai",
    title: "同一个伙伴，多一种陪伴。",
    titleEn: "The same companion. A new way to connect.",
    body: "ESP32-S3 负责声音、屏幕和运动；电脑负责模型、记忆、知识和工具。让伙伴在真实世界里回应你。",
    bodyEn:
      "ESP32-S3 handles audio, display, and movement. Your computer handles models, memory, knowledge, and tools. Let your companion respond in the real world.",
    route: "xiaozhi-yuntai",
    wire: "DIRECT / VOICE + DEVICE TOOLS",
  },
  {
    id: "network",
    icon: "Network",
    label: "Net Infra",
    title: "按需开启跨网络连接。",
    titleEn: "Connect across networks when you need to.",
    body: "自行部署 NomiRelay 与 nfagent，转发受授权的服务。网络承载与应用分工清晰，Desktop 仍负责数据和执行。",
    bodyEn:
      "Self-host NomiRelay and nfagent to relay authorized services. Transport and application responsibilities stay clear, with Desktop still handling data and execution.",
    route: "net-infra",
    wire: "OPTIONAL / SELF-HOSTED RELAY",
  },
];

export default function ProductMap() {
  const { t } = useLocale();
  const [selected, setSelected] = useState("mobile");
  const current = surfaces.find((item) => item.id === selected);
  return (
    <section
      className="product-map container"
      aria-label={t("探索产品连接方式", "Explore product connections")}
    >
      <div className="map-stage">
        <div className="map-orbit map-orbit-one" />
        <div className="map-orbit map-orbit-two" />
        <div className="map-core">
          <Icon name="Desktop" size={50} />
          <span>NomiFun</span>
          <strong>Desktop</strong>
          <small>LOCAL CORE</small>
        </div>
        <div
          className="map-surfaces"
          role="tablist"
          aria-orientation="vertical"
          aria-label={t("选择一个生态入口", "Choose an ecosystem entry point")}
          onKeyDown={handleTabNavigation}
        >
          {surfaces.map((item) => (
            <button
              key={item.id}
              role="tab"
              tabIndex={selected === item.id ? 0 : -1}
              aria-selected={selected === item.id}
              aria-controls="map-panel"
              id={`map-tab-${item.id}`}
              onClick={() => setSelected(item.id)}
              className={selected === item.id ? "active" : ""}
            >
              <Icon name={item.icon} size={27} />
              <span>{t(item.label, item.labelEn || item.label)}</span>
            </button>
          ))}
        </div>
        <span className="map-caption">
          {t(
            "点击一个入口，看看它如何连接。",
            "Choose an entry point to see how it connects.",
          )}
        </span>
      </div>
      <div
        className="map-panel"
        id="map-panel"
        role="tabpanel"
        aria-labelledby={`map-tab-${current.id}`}
      >
        <span className="pill">{current.wire}</span>
        <h2>{t(current.title, current.titleEn)}</h2>
        <p>{t(current.body, current.bodyEn)}</p>
        <Link href={`/products/${current.route}`} className="map-link">
          {t(
            `认识 ${current.label}`,
            `Meet ${current.labelEn || current.label}`,
          )}{" "}
          <Icon name="ArrowUpRight" />
        </Link>
      </div>
    </section>
  );
}
