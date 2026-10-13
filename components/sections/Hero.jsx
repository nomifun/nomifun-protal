"use client";
import { useEffect, useRef, useState } from "react";
import Link from "@/components/i18n/LocaleLink";
import { useLocale } from "@/components/i18n/LocaleProvider";
import Icon from "@/components/Icon";
import RollText from "@/components/motion/RollText";
import useReducedMotion from "@/components/motion/useReducedMotion";

const modes = [
  {
    label: "陪伴",
    labelEn: "Connect",
    icon: "ChatCircle",
    prompt: "从桌面到桌边，和同一位伙伴继续日常。",
    promptEn: "The same companion, on your screen and at your side.",
    left: "有自己的个性，也记得你",
    leftEn: "Personality. Memory. A connection.",
    right: "从屏幕，到声音与动作",
    rightEn: "From screen to voice and movement",
  },
  {
    label: "创造",
    labelEn: "Create",
    icon: "Sparkle",
    prompt: "从一段描述，走进无限的创作画布。",
    promptEn: "Start with a prompt. Explore an infinite creative canvas.",
    left: "图像 · 视频 · 音频",
    leftEn: "Images · Video · Audio",
    right: "连接灵感的每一个节点",
    rightEn: "Connect every spark of inspiration",
  },
  {
    label: "行动",
    labelEn: "Act",
    icon: "Lightning",
    prompt: "让持续工作，发生在自己的电脑上。",
    promptEn: "Keep work moving on your own computer.",
    left: "需求，自动进入下一步",
    leftEn: "Move requests to the next step",
    right: "你的电脑，就是运行中枢",
    rightEn: "Your computer is the hub",
  },
];
export default function Hero() {
  const { locale, t, asset } = useLocale();
  const reduced = useReducedMotion();
  const [mode, setMode] = useState(0),
    [animated, setAnimated] = useState(true);
  const canvas = useRef(null);
  const [label, setLabel] = useState(0);
  const heroLabels = [
    t("属于你的个人 AI 伙伴", "Your own personal AI companion"),
    t(
      "有个性，有记忆，也能一起做事",
      "Personality, memory, and the ability to act",
    ),
    t("从桌面走进物理世界", "From your desktop into the real world"),
    t("本地优先的 Agent 工作空间", "A local-first Agent workspace"),
  ];
  useEffect(() => {
    if (!animated || matchMedia("(prefers-reduced-motion: reduce)").matches)
      return;
    const timer = setInterval(() => {
      if (!document.hidden) setLabel((v) => (v + 1) % heroLabels.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [animated, reduced]);
  useEffect(() => {
    if (
      !animated ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    let dispose,
      live = true;
    import("@/lib/behaviors/three-dots").then(({ initThreeDots }) => {
      if (!live) return;
      try {
        dispose = initThreeDots(canvas.current);
      } catch {
        /* A readable static scene remains when WebGL is unavailable. */
      }
    });
    return () => {
      live = false;
      dispose?.();
    };
  }, [animated, reduced]);
  return (
    <section
      id="open-source"
      className={`home-hero hero-mode-${mode}${animated ? "" : " hero-motion-paused"}`}
      data-locale={locale}
    >
      <div className="hero-atmosphere" aria-hidden="true">
        <canvas ref={canvas} />
      </div>
      <div className="hero-satellite satellite-left" aria-hidden="true">
        <Icon name="Cube" size={24} />
        <div>
          <small>COMPOSABLE BY DESIGN</small>
          <span>{t(modes[mode].left, modes[mode].leftEn)}</span>
        </div>
      </div>
      <div className="hero-satellite satellite-right" aria-hidden="true">
        <span className="satellite-dot" />
        <div>
          <small>BUILT AROUND YOU</small>
          <span>{t(modes[mode].right, modes[mode].rightEn)}</span>
        </div>
      </div>
      <div className="hero-product-glimpses">
        <a
          href="#agent"
          className="hero-product-glimpse hero-glimpse-agent"
          aria-label={t(
            "探索可组合的 Agent 能力工作台",
            "Explore the agent capability workspace",
          )}
        >
          <div className="hero-glimpse-bar">
            <Icon name="Stack" size={14} />
            <span>COMPOSABLE AGENT</span>
            <Icon name="ArrowUpRight" size={14} />
          </div>
          <img
            src={asset("/images/product/agent-workbench.png")}
            alt={t(
              "NomiFun Desktop Agent 能力工作台界面",
              "The NomiFun Desktop agent capability workspace",
            )}
            width="1600"
            height="1000"
          />
          <span className="hero-glimpse-caption">
            {t("全面的能力，自由组合。", "Powerful capabilities. Your way.")}
          </span>
        </a>
        <a
          href="#creation"
          className="hero-product-glimpse hero-glimpse-creative"
          aria-label={t(
            "探索多模态创作工作台",
            "Explore the multimodal creative workspace",
          )}
        >
          <div className="hero-glimpse-bar">
            <Icon name="Sparkle" size={14} />
            <span>CREATE WITHOUT LIMITS</span>
            <Icon name="ArrowUpRight" size={14} />
          </div>
          <img
            src={asset("/images/creative/image-workbench.png")}
            alt={t(
              "NomiFun Desktop 图像创作界面",
              "NomiFun Desktop image creation interface",
            )}
            width="1600"
            height="1000"
          />
          <span className="hero-glimpse-caption">
            {t("让灵感，有自己的工作空间。", "A workspace for every idea.")}
          </span>
        </a>
      </div>
      <div className="hero-content container">
        <p className="eyebrow hero-eyebrow">
          <span className="live-dot" />
          <span className="hero-rotating-label" key={label}>
            NOMIFUN DESKTOP · {heroLabels[label]}
          </span>
        </p>
        <h1>
          {t("强大的 AI，", "Powerful AI.")}
          <br />
          <span className="hero-slogan-open">
            {t("向每个人开放", "Open to everyone")}
          </span>
          <span className="hero-period">{t("。", ".")}</span>
        </h1>
        <div className="hero-description">
          <div
            className="hero-quality-line"
            aria-label={t(
              "探索能力、设计与性能",
              "Explore capabilities, design and performance",
            )}
          >
            <a href="#possibilities">
              <Icon name="Stack" size={20} />
              {t("全面的能力", "Full capabilities")}
            </a>
            <a href="#product-view">
              <Icon name="SquaresFour" size={20} />
              {t("领先的设计", "Leading design")}
            </a>
            <a href="#developers">
              <Icon name="Lightning" size={20} />
              {t("强悍的性能", "Powerful performance")}
            </a>
          </div>
          <p className="hero-open-promise">
            <strong>
              {t("完全免费开源给社会，", "Free and open source for everyone.")}
            </strong>
            <span>{t("无条件商用。", "Unconditional commercial use.")}</span>
          </p>
          <p className="hero-manifesto-line">
            {t(
              "开源不意味着平凡，强大也可以开源。",
              "Open source can be extraordinary. Powerful can be open.",
            )}
          </p>
        </div>
        <div className="hero-buttons">
          <Link href="/download" className="button">
            <span className="button-motion-inner">
              <RollText>
                {t("免费下载，开启更多可能", "Download for free")}
              </RollText>
              <Icon name="ArrowUpRight" size={20} />
            </span>
          </Link>
          <a href="#possibilities" className="button light">
            <span className="button-motion-inner">
              <RollText>
                {t("探索完整能力", "Explore the capabilities")}
              </RollText>
              <Icon name="ArrowDown" size={19} />
            </span>
          </a>
        </div>
        <div className="hero-meta">
          <span>Windows / macOS</span>
          <i />
          <span>{t("你的模型，自由选择", "Your choice of models")}</span>
          <i />
          <span>{t("本地优先", "Local first")}</span>
        </div>
      </div>
      <div className="hero-playground">
        <div
          className="hero-mode-tabs"
          role="group"
          aria-label={t("探索 NomiFun 使用场景", "Explore ways to use NomiFun")}
        >
          {modes.map((m, i) => (
            <button
              key={m.label}
              aria-pressed={mode === i}
              onClick={() => setMode(i)}
            >
              <Icon name={m.icon} size={18} />
              {t(m.label, m.labelEn)}
            </button>
          ))}
        </div>
        <p key={mode} className="hero-prompt">
          {t(modes[mode].prompt, modes[mode].promptEn)}
        </p>
        <span className="demo-caption desktop-only">
          {t(
            "移动鼠标，看看灵感如何相遇",
            "Move your pointer and let ideas meet",
          )}
        </span>
        <span className="demo-caption mobile-only">
          {t("切换上方场景，探索它的可能", "Choose a mode to explore")}
        </span>
      </div>
      <div className="hero-floor">
        <span>OPEN SOURCE. OPEN POSSIBILITIES.</span>
        <a href="#possibilities">
          {t("向下，打开更多可能", "Scroll into the possibilities")}
          <Icon name="ArrowDown" size={17} />
        </a>
        <button
          aria-pressed={!animated}
          onClick={() => setAnimated((v) => !v)}
          aria-label={
            animated
              ? t("暂停背景动效", "Pause background animation")
              : t("播放背景动效", "Play background animation")
          }
        >
          <Icon name={animated ? "Pause" : "Play"} size={17} />
          <span>{t("动效", "Motion")}</span>
        </button>
      </div>
    </section>
  );
}
