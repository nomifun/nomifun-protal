"use client";
import { useEffect, useRef, useState } from "react";
import Link from "@/components/i18n/LocaleLink";
import { useLocale } from "@/components/i18n/LocaleProvider";
import Icon from "@/components/Icon";
import RollText from "@/components/motion/RollText";
import useReducedMotion from "@/components/motion/useReducedMotion";

const modes = [
  {
    label: "思考",
    labelEn: "Think",
    icon: "ChatCircle",
    prompt: "把一个想法，变成可执行的计划。",
    promptEn: "Turn an idea into a plan you can act on.",
    left: "你的知识，随时可用",
    leftEn: "Your knowledge, within reach",
    right: "从对话，到真实行动",
    rightEn: "From conversation to action",
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
  const { locale, t } = useLocale();
  const reduced = useReducedMotion();
  const [mode, setMode] = useState(0),
    [animated, setAnimated] = useState(true);
  const canvas = useRef(null);
  const [label, setLabel] = useState(0);
  const heroLabels = [
    t("本地优先的 Agent 工作空间", "A local-first Agent workspace"),
    t("自由组合，让能力刚好适合你", "Compose capabilities around you"),
    t("桌面伙伴，让 AI 走进日常", "Desktop companions for everyday life"),
    t(
      "电脑即服务，连接手机与机器人",
      "Your computer connects phones and robots",
    ),
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
    <section className={`home-hero hero-mode-${mode}`} data-locale={locale}>
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
      <div className="hero-content container">
        <p className="eyebrow hero-eyebrow">
          <span className="live-dot" />
          <span className="hero-rotating-label" key={label}>
            NOMIFUN DESKTOP · {heroLabels[label]}
          </span>
        </p>
        <h1>
          {t("让 AI，", "AI belongs")}
          <br />
          {t("真正生活在", "on your ")}
          <span className="hero-mobile-break">
            <br />
          </span>
          {t("你的电脑里", "computer")}
          <span className="hero-period">{t("。", ".")}</span>
        </h1>
        <p className="hero-description">
          {t(
            "组装你的 Agent，遇见你的伙伴。",
            "Build your Agent. Meet your companion. ",
          )}
          <br className="mobile-only" />
          {t("从灵感到行动，", "From inspiration to action, ")}
          <br className="desktop-only" />
          {t(
            "让 AI 的强大能力，成为你触手可及的日常。",
            "bring the power of AI into your everyday life.",
          )}
        </p>
        <div className="hero-buttons">
          <Link href="/download" className="button">
            <span className="button-motion-inner">
              <RollText>
                {t("下载，开始自己的 AI 世界", "Download your AI workspace")}
              </RollText>
              <Icon name="ArrowUpRight" size={20} />
            </span>
          </Link>
          <a href="#agent" className="button light">
            <span className="button-motion-inner">
              <RollText>
                {t("探索它的可能", "Explore the possibilities")}
              </RollText>
              <Icon name="ArrowDown" size={19} />
            </span>
          </a>
        </div>
        <div className="hero-meta">
          <span>Windows / macOS</span>
          <i />
          <span>{t("自由开源", "Open source")}</span>
          <i />
          <span>{t("电脑即服务", "Your computer, your hub")}</span>
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
        <a href="#agent">
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
