"use client";
import { useEffect, useLayoutEffect, useRef, useState, useId } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Icon from "@/components/Icon";
import Link from "@/components/i18n/LocaleLink";
import useReducedMotion from "@/components/motion/useReducedMotion";
import { useLocale } from "@/components/i18n/LocaleProvider";

const capabilities = [
  [
    "BookOpen",
    ["知识与记忆", "Knowledge & memory"],
    ["记住重要的事", "Remember what matters"],
    "#ecd8bf",
  ],
  [
    "Code",
    ["开发与文件", "Code & files"],
    ["把想法做出来", "Bring ideas to life"],
    "#d9e2fb",
  ],
  [
    "Browser",
    ["网页与浏览器", "Web & browser"],
    ["走进真实网页", "Explore real websites"],
    "#d9e8d4",
  ],
  [
    "UsersThree",
    ["多 Agent", "Multi-agent"],
    ["一起推进目标", "Work toward one goal"],
    "#f3c8b5",
  ],
  [
    "Image",
    ["图像创作", "Image creation"],
    ["描绘你的想象", "Picture your ideas"],
    "#e5d3f1",
  ],
  [
    "Video",
    ["视频创作", "Video creation"],
    ["让画面动起来", "Bring frames to life"],
    "#efdbb5",
  ],
  [
    "Waveform",
    ["音频与音乐", "Audio & music"],
    ["让故事有声音", "Give stories a voice"],
    "#cce6e5",
  ],
  [
    "Lightning",
    ["持续工作", "Continuous work"],
    ["让工作接着走", "Keep work moving"],
    "#e4e9bb",
  ],
  [
    "Robot",
    ["物理设备", "Physical devices"],
    ["与现实相连接", "Connect to the world"],
    "#e9cbd6",
  ],
  [
    "PuzzlePiece",
    ["插件与小程序", "Plugins & mini-apps"],
    ["长出新的能力", "Add new capabilities"],
    "#c7d7ed",
  ],
];
export function MotionHighlights() {
  const { t } = useLocale();
  const root = useRef(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let io;
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray(".capability-flipper", root.current);
      const tl = gsap.timeline({ paused: true, repeat: -1, repeatDelay: 1 });
      tl.to(
        cards,
        { rotationY: 180, duration: 1, stagger: 0.25, ease: "power2.inOut" },
        1,
      ).to(
        cards,
        { rotationY: 360, duration: 1, stagger: 0.25, ease: "power2.inOut" },
        6,
      );
      io = new IntersectionObserver(
        ([entry]) => (entry.isIntersecting ? tl.play() : tl.pause()),
        { threshold: 0.15 },
      );
      io.observe(root.current);
    }, root);
    return () => {
      io?.disconnect();
      ctx.revert();
    };
  }, [reduced]);
  return (
    <section
      className="capability-motion-band"
      ref={root}
      aria-label={t(
        "探索 NomiFun 十类能力",
        "Explore ten NomiFun capability categories",
      )}
    >
      <div className="container">
        <div className="capability-band-head">
          <span className="eyebrow">COMPOSE THE POSSIBILITIES</span>
          <p>
            {t(
              "每一种能力，都有自己的用武之地。",
              "Every capability has a place to shine.",
            )}
          </p>
        </div>
        <div className="capability-flip-grid">
          {capabilities.map(([icon, label, result, color], i) => (
            <div
              className="capability-flip-cell"
              key={label[0]}
              style={{ "--cap-color": color }}
            >
              <div className="capability-flipper">
                <div className="capability-face">
                  <Icon name={icon} size={34} weight="light" />
                  <span>{t(...label)}</span>
                  <small>{String(i + 1).padStart(2, "0")}</small>
                </div>
                <div className="capability-face capability-back">
                  <Icon name="Sparkle" size={26} />
                  <span>{t(...result)}</span>
                  <small>NOMIFUN</small>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="capability-ticker" aria-hidden="true">
        <div className="capability-ticker-track">
          {[0, 1].map((copy) => (
            <div className="capability-ticker-set" key={copy}>
              {capabilities.map(([icon, label]) => (
                <span key={label[0]}>
                  <Icon name={icon} size={21} />
                  {t(...label)}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const media = [
  {
    name: ["可组合 Agent", "Composable agents"],
    src: "/images/product/agent-workbench.png",
    note: [
      "真实工作台组件 · 测试数据预览",
      "Actual workspace component · Preview with test data",
    ],
  },
  {
    name: ["图像创作工作台", "Image creation workspace"],
    src: "/images/creative/image-workbench.png",
    note: [
      "产品界面记录 · 0.7.2 / 2026.08",
      "Product UI · 0.7.2 / Aug 2026 · Sample prompt remains in its original language",
    ],
  },
  {
    name: ["视频创作工作台", "Video creation workspace"],
    src: "/images/creative/video-workbench.png",
    note: [
      "产品界面记录 · 0.7.2 / 2026.08",
      "Product UI · 0.7.2 / Aug 2026 · Sample prompt remains in its original language",
    ],
  },
  {
    name: ["连接真实机器人", "Connected to real robots"],
    src: "/images/product/xiaozhi-yuntai-poster.png",
    video: "/media/xiaozhi-yuntai-demo.mp4",
    note: [
      "来自项目已有设备演示",
      "Original device recording from the project",
    ],
  },
];
export function MotionShowcase() {
  const { t, asset } = useLocale();
  const reduced = useReducedMotion();
  const root = useRef(null),
    frame = useRef(null),
    tag = useRef(null),
    dialog = useRef(null),
    opener = useRef(null),
    slider = useRef(null),
    swipe = useRef(null);
  const [open, setOpen] = useState(false),
    [index, setIndex] = useState(0);
  const uid = useId().replace(/:/g, "");
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        frame.current,
        { scaleX: 0.8, scaleY: 0.9 },
        {
          scaleX: 1,
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top bottom",
            end: "center center",
            scrub: 0.7,
          },
        },
      );
    }, root);
    return () => ctx.revert();
  }, [reduced]);
  useLayoutEffect(() => {
    if (!open || !dialog.current) return;
    const old = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.lenis?.stop();
    const ctx = gsap.context(() => {
      if (!matchMedia("(prefers-reduced-motion: reduce)").matches)
        gsap.fromTo(
          dialog.current,
          { opacity: 0, scale: 0.92, y: 30 },
          { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: "power3.out" },
        );
    });
    dialog.current.querySelector("button")?.focus();
    const key = (e) => {
      if (e.key === "Escape") setOpen(false);
      const usingVideo = e.target.closest?.("video");
      if (e.key === "ArrowRight" && !usingVideo)
        setIndex((v) => (v + 1) % media.length);
      if (e.key === "ArrowLeft" && !usingVideo)
        setIndex((v) => (v + media.length - 1) % media.length);
      if (e.key === "Tab") {
        const buttons = [...dialog.current.querySelectorAll("button,a,video")];
        const first = buttons[0],
          last = buttons.at(-1);
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", key);
    return () => {
      ctx.revert();
      document.body.style.overflow = old;
      window.lenis?.start();
      document.removeEventListener("keydown", key);
      opener.current?.focus();
    };
  }, [open]);
  useLayoutEffect(() => {
    if (!open || !slider.current) return;
    const slides = [...slider.current.querySelectorAll(".showcase-slide")];
    slides.forEach((slide, i) => {
      if (i !== index) slide.querySelector("video")?.pause();
    });
    const tween = gsap.to(slider.current, {
      xPercent: -index * 100,
      duration: matchMedia("(prefers-reduced-motion: reduce)").matches
        ? 0
        : 0.5,
      ease: "power3.inOut",
    });
    return () => tween.kill();
  }, [index, open, reduced]);
  useEffect(() => {
    const target = tag.current;
    return () => gsap.killTweensOf(target);
  }, []);
  const move = (e) => {
    if (
      !matchMedia("(pointer:fine)").matches ||
      matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const r = e.currentTarget.getBoundingClientRect();
    gsap.to(tag.current, {
      x: e.clientX - r.left - r.width / 2,
      y: e.clientY - r.top - r.height / 2,
      autoAlpha: 1,
      duration: 0.35,
      ease: "power2.out",
      overwrite: true,
    });
  };
  return (
    <section className="motion-showcase" id="product-view" ref={root}>
      <div className="container showcase-heading">
        <p className="eyebrow">LOOK CLOSER. GO FURTHER.</p>
        <h2 className="section-heading">
          {t("让能力，", "Turn capabilities")}
          <br />
          {t("成为看得见的工作。", "into tangible work.")}
        </h2>
        <p>
          {t("用自己的模型、知识和工具，", "Your models, knowledge and tools.")}
          <br />
          {t("打开一个属于你的工作空间。", "A workspace that belongs to you.")}
        </p>
      </div>
      <div className="showcase-frame" ref={frame}>
        <button
          ref={opener}
          className="showcase-image-button"
          aria-label={t(
            "放大查看 NomiFun 产品界面与设备演示",
            "Open the NomiFun product and device gallery",
          )}
          onClick={() => {
            setIndex(0);
            setOpen(true);
          }}
          onPointerMove={move}
          onPointerLeave={() =>
            gsap.to(tag.current, {
              autoAlpha: 0,
              duration: matchMedia("(prefers-reduced-motion: reduce)").matches
                ? 0
                : 0.2,
              overwrite: true,
            })
          }
        >
          <div className="showcase-window-top">
            <span>
              <i />
              <i />
              <i />
            </span>
            <small>NOMIFUN / CAPABILITY WORKSPACE</small>
            <Icon name="ArrowUpRight" size={20} />
          </div>
          <img
            src={asset(media[0].src)}
            alt={t(
              "真实 Agent 能力工作台组件测试数据预览",
              "Actual agent capability workspace component with test data",
            )}
            loading="lazy"
          />
          <span className="showcase-hover-tag" ref={tag}>
            {t("放大查看", "View larger")}
            <Icon name="ArrowUpRight" size={20} />
          </span>
          <span className="showcase-detail-reveal">
            <strong>
              {t(
                "自由选择能力。定义自己的 Agent。",
                "Choose capabilities. Define your agent.",
              )}
            </strong>
            <span>
              {t(
                "模块、操作、资源和执行策略，在同一个可视化工作台里相遇。",
                "Modules, actions, resources and execution strategies meet in one visual workspace.",
              )}
            </span>
          </span>
          <span className="showcase-play-ring">
            <svg viewBox="0 0 160 160" aria-hidden="true">
              <defs>
                <path
                  id={`play-ring-${uid}`}
                  d="M80,80 m-58,0 a58,58 0 1,1 116,0 a58,58 0 1,1 -116,0"
                />
              </defs>
              <text>
                <textPath href={`#play-ring-${uid}`}>
                  NOMIFUN DESKTOP · OPEN THE POSSIBILITIES ·{" "}
                </textPath>
              </text>
            </svg>
            <Icon name="Play" size={26} weight="fill" />
          </span>
        </button>
        <p>
          {t(...media[0].note)} · {t("点击看更大的世界", "Click to explore")}
        </p>
      </div>
      {open && (
        <div
          className="showcase-lightbox"
          role="presentation"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div
            className="showcase-dialog"
            role="dialog"
            aria-modal="true"
            aria-label={t("NomiFun 产品界面画廊", "NomiFun product gallery")}
            ref={dialog}
          >
            <div className="showcase-dialog-head">
              <span>{t(...media[index].name)}</span>
              <button
                onClick={() => setOpen(false)}
                aria-label={t("关闭产品画廊", "Close product gallery")}
              >
                <Icon name="X" />
              </button>
            </div>
            <div
              className="showcase-slides-viewport"
              onPointerDown={(event) => {
                if (
                  !event.isPrimary ||
                  event.pointerType === "mouse" ||
                  event.target.closest("video,button")
                )
                  return;
                swipe.current = {
                  x: event.clientX,
                  y: event.clientY,
                  id: event.pointerId,
                };
                event.currentTarget.setPointerCapture(event.pointerId);
              }}
              onPointerCancel={() => {
                swipe.current = null;
              }}
              onLostPointerCapture={() => {
                swipe.current = null;
              }}
              onPointerUp={(event) => {
                const start = swipe.current;
                swipe.current = null;
                if (!start || start.id !== event.pointerId) return;
                const dx = event.clientX - start.x;
                const dy = event.clientY - start.y;
                if (Math.abs(dx) < 30 || Math.abs(dx) <= Math.abs(dy)) return;
                setIndex(
                  (value) =>
                    (value + (dx < 0 ? 1 : media.length - 1)) % media.length,
                );
              }}
            >
              <div className="showcase-slides" ref={slider}>
                {media.map((m, i) => (
                  <div
                    className="showcase-slide"
                    key={m.name[0]}
                    aria-hidden={index !== i}
                    inert={index !== i}
                  >
                    {m.video ? (
                      <video
                        controls
                        playsInline
                        preload="none"
                        poster={asset(m.src)}
                        aria-label={t(
                          "真实小智设备演示",
                          "Original Xiaozhi device demonstration",
                        )}
                      >
                        <source src={m.video} type="video/mp4" />
                      </video>
                    ) : (
                      <img src={asset(m.src)} alt={t(...m.name)} />
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="showcase-gallery-controls">
              <button
                aria-label={t("上一个产品画面", "Previous product view")}
                onClick={() =>
                  setIndex((v) => (v + media.length - 1) % media.length)
                }
              >
                <Icon name="ArrowLeft" />
              </button>
              <span>
                {String(index + 1).padStart(2, "0")} / 04 ·{" "}
                {t(...media[index].note)}
              </span>
              <button
                aria-label={t("下一个产品画面", "Next product view")}
                onClick={() => setIndex((v) => (v + 1) % media.length)}
              >
                <Icon name="ArrowRight" />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

const principles = [
  [
    "Database",
    ["本地优先", "Local first"],
    [
      "会话、配置与记忆，默认留在自己的电脑。模型与联网工具按你配置连接。",
      "Conversations, settings and memory stay on your PC by default. Models and network tools connect as you configure them.",
    ],
    "#d5daf4",
  ],
  [
    "Code",
    ["代码开放", "Open code"],
    [
      "从使用者成为创造者。读清楚接口，改成自己的工作方式。",
      "Go from user to creator. Explore the interfaces and shape the app around the way you work.",
    ],
    "#f3c8ac",
  ],
  [
    "ShieldCheck",
    ["选择由你", "Your choice"],
    [
      "真实能力配明确授权。私聊、群聊、工具与设备入口，由你决定。",
      "Powerful capabilities need explicit permission. You control access to DMs, group chats, tools and devices.",
    ],
    "#cadcc6",
  ],
  [
    "Desktop",
    ["电脑即服务", "Your PC, the service"],
    [
      "可信局域网内手机与机器人直连；跨网访问可选自己的中继。",
      "Phones and robots connect directly on a trusted LAN. Use your own optional relay for access across networks.",
    ],
    "#e5c9e8",
  ],
];
export function MotionPrinciples() {
  const { t } = useLocale();
  return (
    <section
      className="motion-principles container"
      aria-label={t("NomiFun 产品原则", "NomiFun product principles")}
    >
      <div className="principle-grid">
        {principles.map(([icon, title, text, color], i) => (
          <Link
            className="principle-card"
            href={
              i === 1
                ? "https://github.com/nomifun/nomifun-desktop"
                : "/products/desktop"
            }
            key={title[0]}
            style={{ "--principle-color": color }}
          >
            <div className="principle-reverse">
              <small>0{i + 1} / BUILT AROUND YOU</small>
              <h3>{t(...title)}</h3>
              <p>{t(...text)}</p>
              <Icon name="ArrowUpRight" size={25} />
            </div>
            <div className="principle-face">
              <Icon name={icon} size={84} weight="thin" />
              <h3>{t(...title)}</h3>
              <small>
                {t(
                  "移动鼠标，发现背后的设计",
                  "Hover or focus to discover the design",
                )}
              </small>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
