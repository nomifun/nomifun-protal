"use client";

import { useState } from "react";
import Icon from "@/components/Icon";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { handleTabNavigation } from "../tabNavigation";

const desktopModes = {
  会话: {
    title: "把想法，交给合适的 Agent。",
    labels: ["模型与设定", "能力与 Skill", "知识与记忆", "工具与权限"],
    result: "一个会话，按需切换 Agent",
  },
  创作: {
    title: "把灵感，铺开到画布上。",
    labels: ["图像工作台", "视频工作台", "提示词与模板", "素材与画布"],
    result: "文字、图像、视频、音频协同创作",
  },
  自动工作: {
    title: "把需求，连接成持续工作。",
    labels: ["需求池", "AutoWork", "IDMM 策略", "新需求 Loop"],
    result: "发现 → 认领 → 执行 → 反馈",
  },
};
const mobileModes = {
  会话: [
    ["设计下一个产品功能", "继续上次的讨论"],
    ["探索新的创作方向", "查看最近结果"],
    ["整理我的知识库", "发送新指令"],
  ],
  任务: [
    ["每周阅读整理", "定时任务"],
    ["项目工作进度", "查看执行结果"],
    ["一个新的工作想法", "交给 Desktop 处理"],
  ],
  伙伴: [
    ["Nomi · 创作伙伴", "沿用电脑上的身份与记忆"],
    ["Dev · 开发伙伴", "调用已配置的知识与工具"],
    ["一起成长", "伙伴配置来自同一 Desktop"],
  ],
};

const englishDesktopModes = {
  会话: {
    title: "Give your ideas to the right agent.",
    labels: [
      "Models & presets",
      "Capabilities & skills",
      "Knowledge & memory",
      "Tools & permissions",
    ],
    result: "One conversation. Switch agents as needed.",
  },
  创作: {
    title: "Spread your ideas across a canvas.",
    labels: [
      "Image workbench",
      "Video workbench",
      "Prompts & templates",
      "Assets & canvas",
    ],
    result: "Create with text, images, video, and audio together.",
  },
  自动工作: {
    title: "Turn requirements into ongoing work.",
    labels: [
      "Requirements",
      "AutoWork",
      "IDMM policies",
      "New-requirement loop",
    ],
    result: "Discover → Claim → Execute → Report",
  },
};

const englishMobileModes = {
  会话: [
    ["Design the next product feature", "Pick up the last discussion"],
    ["Explore a creative direction", "See the latest results"],
    ["Organize my knowledge base", "Send a new instruction"],
  ],
  任务: [
    ["Weekly reading digest", "Scheduled task"],
    ["Project progress", "Review execution results"],
    ["A new work idea", "Hand it to Desktop"],
  ],
  伙伴: [
    ["Nomi · Creative companion", "The same identity and memory"],
    ["Dev · Coding companion", "Your configured knowledge and tools"],
    ["Grow together", "Companions from the same Desktop"],
  ],
};

const englishLabels = {
  会话: "Chat",
  创作: "Create",
  自动工作: "AutoWork",
  任务: "Tasks",
  伙伴: "Companions",
  开心: "Happy",
  思考: "Thinking",
  眨眼: "Winking",
  局域网直连: "Direct LAN",
  跨网络中继: "Cross-network relay",
};

export default function ProductVisual({ slug }) {
  const { locale, t } = useLocale();
  const label = (key) => t(key, englishLabels[key]);
  const [desktopMode, setDesktopMode] = useState("会话");
  const [mobileMode, setMobileMode] = useState("会话");
  const [emotion, setEmotion] = useState("开心");
  const [network, setNetwork] = useState("局域网直连");
  if (slug === "desktop") {
    const current = (locale === "en" ? englishDesktopModes : desktopModes)[
      desktopMode
    ];
    return (
      <section
        className="product-visual container desktop-product-visual"
        aria-label={t("探索 Desktop 工作方式", "Explore Desktop workflows")}
      >
        <div className="visual-topline">
          <span>NOMIFUN DESKTOP</span>
          <small>
            {t("能力交互示意", "Interactive capability illustration")}
          </small>
        </div>
        <div
          className="visual-tabs"
          role="tablist"
          onKeyDown={handleTabNavigation}
          aria-label={t("选择工作方式", "Choose a workflow")}
        >
          {Object.keys(desktopModes).map((item) => (
            <button
              key={item}
              role="tab"
              tabIndex={desktopMode === item ? 0 : -1}
              aria-selected={desktopMode === item}
              aria-controls="desktop-visual-panel"
              id={`desktop-visual-${item}`}
              className={desktopMode === item ? "active" : ""}
              onClick={() => setDesktopMode(item)}
            >
              {label(item)}
            </button>
          ))}
        </div>
        <div
          className="desktop-visual-panel"
          role="tabpanel"
          id="desktop-visual-panel"
          aria-labelledby={`desktop-visual-${desktopMode}`}
        >
          <h2>{current.title}</h2>
          <div className="capability-rail">
            {current.labels.map((item, i) => (
              <div key={item}>
                <span>{String(i + 1).padStart(2, "0")}</span>
                <strong>{item}</strong>
                <i />
              </div>
            ))}
          </div>
          <div className="capability-result">
            <Icon name="Desktop" size={26} />
            <span>{current.result}</span>
            <span className="visual-local-dot">LOCAL RUNTIME</span>
          </div>
        </div>
      </section>
    );
  }
  if (slug === "mobile")
    return (
      <section
        className="product-visual container mobile-product-visual"
        aria-label={t(
          "Mobile 功能交互示意",
          "Interactive Mobile feature illustration",
        )}
      >
        <div className="mobile-connection">
          <span className="eyebrow">YOUR DESKTOP, WITH YOU</span>
          <h2>
            {t("换一个屏幕。", "A different screen.")}
            <br />
            {t("继续同一件事。", "The same work.")}
          </h2>
          <div className="mobile-connection-line">
            <span>
              <Icon name="Desktop" size={38} /> Desktop
            </span>
            <i />
            <span>
              <Icon name="DeviceMobile" size={30} /> Mobile
            </span>
          </div>
          <p>
            {t("扫描一次性二维码", "Scan a single-use QR code")}
            <br />
            {t("可信局域网直接连接", "Connect directly on a trusted LAN")}
          </p>
        </div>
        <div className="demo-phone">
          <div className="phone-top">
            <span>9:41</span>
            <span>● ● ●</span>
          </div>
          <div className="phone-heading">
            <span>NomiFun</span>
            <small>{t("功能交互示意", "Interactive illustration")}</small>
          </div>
          <div className="phone-welcome">
            {t("你的工作，", "Your work")}
            <br />
            <strong>{t("正在继续。", "keeps moving.")}</strong>
          </div>
          <div
            className="phone-tabbar"
            role="tablist"
            onKeyDown={handleTabNavigation}
            aria-label={t("探索手机功能", "Explore phone features")}
          >
            {Object.keys(mobileModes).map((item) => (
              <button
                key={item}
                className={mobileMode === item ? "active" : ""}
                role="tab"
                tabIndex={mobileMode === item ? 0 : -1}
                aria-selected={mobileMode === item}
                aria-controls="mobile-visual-panel"
                id={`mobile-visual-${item}`}
                onClick={() => setMobileMode(item)}
              >
                {label(item)}
              </button>
            ))}
          </div>
          <div
            className="phone-items"
            role="tabpanel"
            id="mobile-visual-panel"
            aria-labelledby={`mobile-visual-${mobileMode}`}
          >
            {(locale === "en" ? englishMobileModes : mobileModes)[
              mobileMode
            ].map(([title, subtitle], i) => (
              <div key={title}>
                <span className="phone-item-num">0{i + 1}</span>
                <span>
                  <strong>{title}</strong>
                  <small>{subtitle}</small>
                </span>
                <Icon name="ArrowRight" size={16} />
              </div>
            ))}
          </div>
          <span className="phone-connected">
            {t("连接自己的 Desktop", "Connected to your Desktop")}
          </span>
        </div>
      </section>
    );
  if (slug === "xiaozhi-yuntai")
    return (
      <section
        className="product-visual container robot-product-visual"
        aria-label={t(
          "体验云台表情示意",
          "Try the robot expression illustration",
        )}
      >
        <div className="robot-visual-copy">
          <span className="eyebrow">MEET YOUR COMPANION</span>
          <h2>
            {t("你说一句。", "Say something.")}
            <br />
            {t("它也有回应。", "Get a response.")}
          </h2>
          <p>
            {t(
              "声音、表情、动作，进入同一个伙伴世界。",
              "Voice, expressions, and movement—in the same companion's world.",
            )}
          </p>
          <div
            className="visual-tabs robot-expression-tabs"
            role="group"
            aria-label={t("选择示意表情", "Choose an illustrated expression")}
          >
            {["开心", "思考", "眨眼"].map((item) => (
              <button
                key={item}
                aria-pressed={emotion === item}
                className={emotion === item ? "active" : ""}
                onClick={() => setEmotion(item)}
              >
                {label(item)}
              </button>
            ))}
          </div>
          <small className="visual-disclaimer">
            {t(
              "表情与云台的交互示意 · 实际设备见下方视频",
              "Expression and pan-tilt illustration · See the real device in the video below",
            )}
          </small>
        </div>
        <div className={`robot-portrait emotion-${emotion}`}>
          <div className="robot-antenna" />
          <div className="robot-head">
            <div className="robot-screen">
              <i className="robot-eye robot-eye-left" />
              <i className="robot-eye robot-eye-right" />
              <span className="robot-cheek cheek-left" />
              <span className="robot-cheek cheek-right" />
            </div>
          </div>
          <div className="robot-neck" />
          <div className="robot-body">
            <span>NOMI</span>
          </div>
          <div className="robot-shadow" />
        </div>
      </section>
    );
  if (slug === "model-gateway")
    return (
      <section
        className="product-visual container gateway-product-visual"
        aria-label={t(
          "模型服务架构示意",
          "Model service architecture illustration",
        )}
      >
        <div className="visual-topline">
          <span>YOUR MODEL SERVICE</span>
          <small>{t("架构示意", "Architecture illustration")}</small>
        </div>
        <div className="network-visual-panel gateway-visual-panel">
          <div className="network-node">
            <Icon name="Desktop" size={37} />
            <strong>
              {t("Desktop 与 API 客户端", "Desktop & API clients")}
            </strong>
            <small>{t("实例地址与 API 密钥", "Instance URL & API key")}</small>
          </div>
          <div className="network-wire" />
          <div className="network-node gateway-service">
            <Icon name="Key" size={37} />
            <strong>Model Gateway</strong>
            <small>
              {t("你的品牌、模型与定价", "Your brand, models & pricing")}
            </small>
          </div>
          <div className="network-wire" />
          <div className="network-node">
            <Icon name="PlugsConnected" size={37} />
            <strong>{t("上游模型服务", "Upstream model services")}</strong>
            <small>OpenAI · Anthropic · Gemini</small>
          </div>
        </div>
        <div className="gateway-capabilities">
          {[
            ["GridFour", "模型目录与价格", "Models & pricing"],
            ["LockKey", "用户与密钥", "Users & API keys"],
            ["ChartBar", "用量与结算", "Usage & settlement"],
            ["Wallet", "钱包与订阅", "Wallets & subscriptions"],
          ].map(([icon, zh, en]) => (
            <div key={icon}>
              <Icon name={icon} size={23} />
              <span>{t(zh, en)}</span>
            </div>
          ))}
        </div>
        <p className="network-visual-caption">
          {t(
            "运营方独立部署与定价，用户选择需要的服务接入。模型调用、用量和账务在同一网关中管理。",
            "Operators deploy and price their own services. Users choose a service to connect to, with model calls, usage, and accounting managed in one gateway.",
          )}
        </p>
      </section>
    );
  return (
    <section
      className="product-visual container network-product-visual"
      aria-label={t("探索两种网络连接方式", "Explore two ways to connect")}
    >
      <div className="visual-topline">
        <span>CONNECT ON YOUR TERMS</span>
        <small>{t("网络架构示意", "Network architecture illustration")}</small>
      </div>
      <div
        className="visual-tabs"
        role="tablist"
        onKeyDown={handleTabNavigation}
        aria-label={t("选择网络路径", "Choose a network path")}
      >
        {["局域网直连", "跨网络中继"].map((item) => (
          <button
            key={item}
            role="tab"
            tabIndex={network === item ? 0 : -1}
            aria-selected={network === item}
            aria-controls="network-visual-panel"
            id={`network-visual-${item}`}
            className={network === item ? "active" : ""}
            onClick={() => setNetwork(item)}
          >
            {label(item)}
          </button>
        ))}
      </div>
      <div
        className="network-visual-panel"
        role="tabpanel"
        id="network-visual-panel"
        aria-labelledby={`network-visual-${network}`}
      >
        <div className="network-node">
          <Icon name="DeviceMobile" size={37} />
          <strong>Mobile / Client</strong>
          <small>{t("操作与交互", "Interaction & controls")}</small>
        </div>
        <div className="network-wire" />
        {network === "跨网络中继" && (
          <>
            <div className="network-node network-relay">
              <Icon name="Network" size={37} />
              <strong>NomiRelay + nfagent</strong>
              <small>{t("自托管传输层", "Self-hosted transport")}</small>
            </div>
            <div className="network-wire" />
          </>
        )}
        <div className="network-node">
          <Icon name="Desktop" size={37} />
          <strong>Desktop / Service</strong>
          <small>{t("数据与执行", "Data & execution")}</small>
        </div>
      </div>
      <p className="network-visual-caption">
        {network === "局域网直连"
          ? t(
              "可信局域网内，电脑即服务。开启访问、配对连接，无需另外部署业务服务器。",
              "On a trusted local network, your computer is the service. Enable access and pair the client—no separate application server to deploy.",
            )
          : t(
              "跨网络时，自行部署中继与 agent。管理凭据留在运维侧，客户端只访问业务入口。",
              "Across networks, self-host the relay and agent. Administrative credentials stay on the operations side; clients use only the application endpoint.",
            )}
      </p>
    </section>
  );
}
