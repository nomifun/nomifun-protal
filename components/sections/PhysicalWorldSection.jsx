"use client";

import Link from "@/components/i18n/LocaleLink";
import { useLocale } from "@/components/i18n/LocaleProvider";
import Icon from "@/components/Icon";

const places = [
  {
    icon: "Desktop",
    title: "在桌面，记得你",
    titleEn: "On your desktop",
    copy: "自己的个性与记忆，和你一起做事。",
    copyEn: "Personality, memory, and help with everyday tasks.",
    href: "/products/desktop",
  },
  {
    icon: "DeviceMobile",
    title: "在手机，继续交流",
    titleEn: "On your phone",
    copy: "直连自己的 Desktop，延续和伙伴的对话。",
    copyEn: "Connect to your Desktop and keep the conversation going.",
    href: "/products/mobile",
  },
  {
    icon: "Robot",
    title: "在桌边，回应你",
    titleEn: "In the real world",
    copy: "连接小智云台，用声音、表情与动作回应。",
    copyEn: "Xiaozhi Yuntai adds voice, expressions, and movement.",
    href: "/products/xiaozhi-yuntai",
  },
];

export default function PhysicalWorldSection() {
  const { locale, t } = useLocale();
  return (
    <section
      className="physical-world-section"
      id="physical-world"
      aria-labelledby="physical-world-heading"
      data-locale={locale}
    >
      <div className="container">
        <div className="physical-world-layout">
          <div className="physical-world-copy">
            <p className="eyebrow">
              {t(
                "PERSONAL AI / 从桌面走进真实世界",
                "PERSONAL AI / BEYOND THE SCREEN",
              )}
            </p>
            <h2 id="physical-world-heading">
              {t("同一个 AI 伙伴，", "The same AI companion.")}
              <br />
              <span>{t("从屏幕来到身边。", "Now by your side.")}</span>
            </h2>
            <p className="physical-world-description">
              {t(
                "在桌面上记住你、帮你做事，在手机上延续交流。连接小智云台后，它也能听见你，用声音、表情与动作回应，让陪伴走进你生活的空间。",
                "A companion that remembers you, helps you get things done, and keeps the conversation going on your phone. Connect Xiaozhi Yuntai so it can hear you and respond with voice, expressions, and movement in your everyday space.",
              )}
            </p>
            <div className="physical-world-actions">
              <Link href="/products/xiaozhi-yuntai" className="button">
                {t("让伙伴走进真实世界", "Bring your companion into the world")}
                <Icon name="ArrowUpRight" size={19} />
              </Link>
              <a href="#agent" className="experience-text-link">
                {t("继续探索 Agent 能力", "Explore Agent capabilities")}
                <Icon name="ArrowDown" size={18} />
              </a>
            </div>
          </div>
          <figure className="physical-world-demo">
            <div className="physical-world-demo-heading">
              <span>
                <Icon name="Robot" size={18} /> NOMIFUN × XIAOZHI
              </span>
              <span>{t("设备实拍", "REAL DEVICE")}</span>
            </div>
            <video
              controls
              playsInline
              preload="none"
              poster="/images/product/xiaozhi-yuntai-poster.png"
              aria-label={t(
                "桌面伙伴连接小智云台的项目已有实拍演示",
                "Existing project footage of a desktop companion connected to Xiaozhi Yuntai",
              )}
              aria-describedby="physical-world-video-caption"
            >
              <source src="/media/xiaozhi-yuntai-demo.mp4" type="video/mp4" />
              <a href="/media/xiaozhi-yuntai-demo.mp4">
                {t("打开设备演示视频", "Open device demonstration video")}
              </a>
            </video>
            <figcaption id="physical-world-video-caption">
              <strong>
                {t(
                  "给熟悉的伙伴，一个真实的身体。",
                  "A familiar companion. A physical presence.",
                )}
              </strong>
              <p>
                {t(
                  "项目已有小智云台演示 · 同一份身份与记忆，新的表达方式。",
                  "Existing Xiaozhi Yuntai project demo. The same identity and memory, with a new way to respond.",
                )}
              </p>
            </figcaption>
          </figure>
        </div>
        <div className="physical-world-places">
          {places.map((place) => (
            <Link
              href={place.href}
              className="physical-world-place"
              key={place.icon}
            >
              <span className="physical-world-place-icon">
                <Icon name={place.icon} size={24} />
              </span>
              <div>
                <h3>{t(place.title, place.titleEn)}</h3>
                <p>{t(place.copy, place.copyEn)}</p>
              </div>
              <Icon name="ArrowUpRight" size={17} />
            </Link>
          ))}
        </div>
        <p className="physical-world-note">
          {t(
            "实体设备目前以小智云台为入口，需要兼容硬件、固件配置与可信局域网配对，并保持 Desktop 运行。语音、表情和动作能力随板型、固件与模型配置而不同。",
            "Physical device integration currently uses Xiaozhi Yuntai. It requires compatible hardware, configured firmware, pairing on a trusted local network, and a running Desktop. Voice, expressions, and movement depend on the board, firmware, and model configuration.",
          )}
        </p>
      </div>
    </section>
  );
}
