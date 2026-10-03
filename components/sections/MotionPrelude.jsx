"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Icon from "@/components/Icon";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { deviceDemo } from "@/lib/site";

function WindowBar({ label }) {
  return (
    <div className="prelude-window-bar">
      <span>
        <i />
        <i />
        <i />
      </span>
      <small>{label}</small>
    </div>
  );
}

function AgentCrystal() {
  return (
    <div className="prelude-crystal">
      <svg viewBox="0 0 200 220" aria-hidden="true">
        <defs>
          <linearGradient id="prelude-crystal-a" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#eee6ff" />
            <stop offset="1" stopColor="#a591d8" />
          </linearGradient>
          <linearGradient id="prelude-crystal-b" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#a999d8" />
            <stop offset="1" stopColor="#7964ba" />
          </linearGradient>
        </defs>
        <ellipse
          cx="100"
          cy="192"
          rx="69"
          ry="13"
          fill="#5b467e"
          opacity=".12"
        />
        <path
          d="M100 17L180 63V151L100 197L20 151V63Z"
          fill="url(#prelude-crystal-a)"
        />
        <path d="M20 63L100 109L180 63L100 17Z" fill="#ece6ff" />
        <path d="M100 109L180 63V151L100 197Z" fill="url(#prelude-crystal-b)" />
        <path d="M20 63L100 109V197L20 151Z" fill="#cbbdec" />
        <path
          d="M56 45L136 91M63 171V88L143 42M100 155L180 109M20 109L100 155"
          fill="none"
          stroke="#fff"
          strokeWidth="1.2"
          opacity=".45"
        />
        <circle cx="100" cy="109" r="21" fill="#faf7ff" />
        <path
          d="M100 96L104 105L114 109L104 113L100 123L96 113L86 109L96 105Z"
          fill="#7c60b1"
        />
      </svg>
      <span>COMPOSABLE AGENT</span>
    </div>
  );
}

function KnowledgeCards() {
  const { t } = useLocale();
  return (
    <div className="prelude-knowledge">
      <div className="prelude-paper back">
        <Icon name="BookOpen" size={27} />
        <i />
        <i />
        <i />
      </div>
      <div className="prelude-paper front">
        <small>YOUR KNOWLEDGE</small>
        <strong>
          {t("理解，来自", "Built on")}
          <br />
          {t("你的积累。", "what you know.")}
        </strong>
        <span>
          <Icon name="Link" size={14} />{" "}
          {t("知识 · 长期记忆", "Knowledge · Memory")}
        </span>
        <i />
        <i />
      </div>
    </div>
  );
}

function BrowserCard() {
  const { t } = useLocale();
  return (
    <div className="prelude-browser">
      <WindowBar label="browser use" />
      <div className="prelude-browser-page">
        <div className="prelude-address">
          <Icon name="LockKey" size={12} /> localhost / your-work
        </div>
        <div className="prelude-browser-hero">
          <span>{t("从观察到行动", "Observe. Act.")}</span>
          <i />
          <i />
          <span className="prelude-browser-action">
            {t("继续探索", "Explore")} <Icon name="ArrowUpRight" size={12} />
          </span>
        </div>
        <div className="prelude-browser-grid">
          <i />
          <i />
          <i />
        </div>
        <span className="prelude-browser-cursor">
          <svg viewBox="0 0 28 34">
            <path
              d="M3 3L24 23L14 24L9 33Z"
              fill="#9774bb"
              stroke="white"
              strokeWidth="2"
            />
          </svg>
        </span>
      </div>
    </div>
  );
}

function TerminalCard() {
  const { t } = useLocale();
  return (
    <div className="prelude-terminal">
      <WindowBar label="local workspace" />
      <div>
        <span>~/your-project</span>
        <p>
          <b>✓</b> {t("读取项目与上下文", "Read project context")}
        </p>
        <p>
          <b>✓</b> {t("编辑、运行、检查", "Edit, run, verify")}
        </p>
        <p>
          <b>→</b> {t("让想法开始工作", "Put ideas to work")} <i />
        </p>
      </div>
      <span className="prelude-terminal-chip">
        <Icon name="Terminal" size={15} /> LOCAL FIRST
      </span>
    </div>
  );
}

function ClusterCard() {
  const { t } = useLocale();
  return (
    <div className="prelude-cluster">
      <span>ONE GOAL. MANY AGENTS.</span>
      <svg viewBox="0 0 260 130" aria-hidden="true">
        <path
          d="M130 34V69M44 96V69H216V96M130 69V96"
          stroke="#7f906c"
          strokeWidth="1.5"
          fill="none"
        />
        <circle cx="130" cy="34" r="27" fill="#fff" />
        <circle cx="44" cy="101" r="22" fill="#ecf3df" />
        <circle cx="130" cy="101" r="22" fill="#ecf3df" />
        <circle cx="216" cy="101" r="22" fill="#ecf3df" />
        <path
          d="M122 34h16M130 26v16M38 101h12M124 101h12M210 101h12"
          stroke="#778369"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      <div>
        <small>{t("调研", "Research")}</small>
        <small>{t("实现", "Build")}</small>
        <small>{t("检验", "Verify")}</small>
      </div>
    </div>
  );
}

function CompanionSculpture() {
  const { t } = useLocale();
  return (
    <div className="prelude-companion">
      <svg viewBox="0 0 220 230" aria-hidden="true">
        <defs>
          <radialGradient id="prelude-mochi">
            <stop stopColor="#fffaf5" />
            <stop offset="1" stopColor="#edd0ce" />
          </radialGradient>
        </defs>
        <ellipse
          cx="110"
          cy="207"
          rx="63"
          ry="11"
          fill="#ac827d"
          opacity=".15"
        />
        <path
          d="M79 92C53 44 62 6 77 9C93 12 95 67 91 93M129 92C125 67 127 12 143 9C158 6 167 44 141 92"
          fill="url(#prelude-mochi)"
          stroke="#dbb4b7"
          strokeWidth="2"
        />
        <path
          d="M79 71Q66 37 77 23M141 71Q154 37 143 23"
          stroke="#eab3c7"
          strokeWidth="7"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M110 73C160 73 180 110 177 153C174 191 150 206 110 206C70 206 46 191 43 153C40 110 60 73 110 73Z"
          fill="url(#prelude-mochi)"
          stroke="#dfbdbb"
          strokeWidth="2"
        />
        <ellipse cx="87" cy="136" rx="7" ry="9" fill="#5b4549" />
        <ellipse cx="133" cy="136" rx="7" ry="9" fill="#5b4549" />
        <circle cx="85" cy="133" r="2.4" fill="#fff" />
        <circle cx="131" cy="133" r="2.4" fill="#fff" />
        <ellipse cx="68" cy="153" rx="12" ry="6" fill="#edb6c1" />
        <ellipse cx="152" cy="153" rx="12" ry="6" fill="#edb6c1" />
        <path
          d="M101 154Q110 166 119 154"
          stroke="#ad8289"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M164 108Q188 92 188 120"
          stroke="#eaccc8"
          strokeWidth="15"
          fill="none"
          strokeLinecap="round"
        />
      </svg>
      <span>{t("你的桌面伙伴。", "Your desktop companion.")}</span>
      <small>
        {t("独立人格 · 完整 Agent", "Own personality · Full agent")}
      </small>
    </div>
  );
}

function CanvasCard() {
  const { t } = useLocale();
  return (
    <div className="prelude-canvas">
      <WindowBar label="an infinite canvas" />
      <div className="prelude-canvas-inner">
        <svg viewBox="0 0 260 170" aria-hidden="true">
          <path
            d="M55 53C115 53 80 109 137 109M137 109C190 109 170 58 225 58"
            fill="none"
            stroke="#8b79b0"
            strokeWidth="2"
            strokeDasharray="5 5"
          />
        </svg>
        <span className="prelude-canvas-node node-one">
          <Icon name="ChatCircle" size={18} />
          <small>{t("一段灵感", "An idea")}</small>
        </span>
        <span className="prelude-canvas-node node-two">
          <Icon name="Image" size={26} />
          <small>{t("一张画面", "An image")}</small>
        </span>
        <span className="prelude-canvas-node node-three">
          <Icon name="Video" size={22} />
          <small>{t("一个故事", "A story")}</small>
        </span>
        <span className="prelude-canvas-plus">+</span>
      </div>
    </div>
  );
}

function MediaCard() {
  const { t } = useLocale();
  return (
    <div className="prelude-media">
      <div className="prelude-media-picture">
        <svg viewBox="0 0 200 220" aria-hidden="true">
          <defs>
            <linearGradient id="prelude-landscape" x2="0" y2="1">
              <stop stopColor="#dacdf0" />
              <stop offset="1" stopColor="#fff3d8" />
            </linearGradient>
          </defs>
          <rect width="200" height="220" fill="url(#prelude-landscape)" />
          <circle cx="131" cy="62" r="28" fill="#fff7d3" />
          <path d="M0 147L57 65L105 132L149 95L200 154V220H0Z" fill="#ac9bbd" />
          <path
            d="M0 181L76 141L131 189L183 145L200 175V220H0Z"
            fill="#756a95"
          />
          <path
            d="M58 220C68 182 121 205 131 189"
            fill="none"
            stroke="#e0d8e7"
            strokeWidth="9"
          />
        </svg>
        <span>
          <Icon name="Image" size={14} /> IMAGE
        </span>
      </div>
      <div className="prelude-media-play">
        <Icon name="Play" size={25} weight="fill" />
        <span>VIDEO</span>
      </div>
      <small>
        {t("图像、视频、声音。", "Images. Video. Sound.")}
        <br />
        {t("让灵感找到表达。", "Give ideas a voice.")}
      </small>
    </div>
  );
}

function ChannelsCard() {
  const { t } = useLocale();
  return (
    <div className="prelude-channels">
      <span>
        <Icon name="ChatsCircle" size={23} />{" "}
        {t("12 个 IM 渠道", "12 IM channels")}
      </span>
      <div>
        <i>{t("飞书", "Feishu")}</i>
        <i>{t("微信", "WeChat")}</i>
        <i>Telegram</i>
        <i>Discord</i>
      </div>
      <p>{t("伙伴，跟着你走。", "Your companion, anywhere.")}</p>
      <small>
        {t("私聊 / 群聊 · 精细权限", "DMs / groups · Fine permissions")}
      </small>
    </div>
  );
}

function VoiceCard() {
  const { t } = useLocale();
  return (
    <div className="prelude-voice">
      <span>
        <Icon name="Waveform" size={19} /> A NEW WAY TO CREATE
      </span>
      <div>
        {Array.from({ length: 26 }, (_, i) => (
          <i
            key={i}
            style={{ "--voice-height": `${14 + ((i * 23) % 53)}px` }}
          />
        ))}
      </div>
      <small>{t("把想法，变成声音。", "Turn ideas into sound.")}</small>
    </div>
  );
}

function ProductWindow() {
  const { t, asset } = useLocale();
  return (
    <div className="prelude-product-window">
      <WindowBar label="NomiFun / Agent" />
      <img
        src={asset("/images/product/agent-workbench.png")}
        alt={t(
          "NomiFun 可视化 Agent 能力工作台",
          "NomiFun visual agent capability workspace",
        )}
        width="740"
        height="430"
        loading="lazy"
      />
      <span>
        {t("把能力，组合成你自己的 Agent。", "Compose your own agent.")}
      </span>
    </div>
  );
}

function RobotCard() {
  const { t } = useLocale();
  return (
    <div className="prelude-robot">
      <img
        src={deviceDemo.poster}
        alt={t("NomiFun 小智云台实物", "NomiFun Xiaozhi robotic gimbal device")}
        width="300"
        height="200"
        loading="lazy"
      />
      <span>
        <Icon name="Robot" size={18} />{" "}
        {t("电脑即服务", "Your PC is the service")}
      </span>
      <small>
        {t(
          "手机与机器人，直连自己的电脑。",
          "Phones and robots connect to your PC.",
        )}
      </small>
    </div>
  );
}

const waveOne = [
  {
    id: "crystal",
    href: "#agent",
    title: ["可组合的 Agent", "Composable agents"],
    art: AgentCrystal,
  },
  {
    id: "workbench",
    href: "#agent",
    title: ["真实 Agent 能力工作台", "The agent capability workspace"],
    art: ProductWindow,
  },
  {
    id: "knowledge",
    href: "#companion",
    title: ["知识与持久记忆", "Knowledge and lasting memory"],
    art: KnowledgeCards,
  },
  {
    id: "browser",
    href: "#developers",
    title: ["跨平台 Browser Use", "Cross-platform browser use"],
    art: BrowserCard,
  },
  {
    id: "terminal",
    href: "#developers",
    title: ["本地开发与电脑操作", "Local development and computer use"],
    art: TerminalCard,
  },
  {
    id: "cluster",
    href: "#developers",
    title: ["多 Agent 协作", "Multi-agent collaboration"],
    art: ClusterCard,
  },
];
const waveTwo = [
  {
    id: "companion",
    href: "#companion",
    title: ["超级桌面伙伴", "Desktop companions"],
    art: CompanionSculpture,
  },
  {
    id: "canvas",
    href: "#creation",
    title: ["无限创作画布", "An infinite creative canvas"],
    art: CanvasCard,
  },
  {
    id: "media",
    href: "#creation",
    title: ["多模态创作", "Multimodal creation"],
    art: MediaCard,
  },
  {
    id: "robot",
    href: "#ecosystem",
    title: ["连接真实机器人", "Connected to real robots"],
    art: RobotCard,
  },
  {
    id: "channels",
    href: "#companion",
    title: ["十二渠道的伙伴", "Companions across twelve channels"],
    art: ChannelsCard,
  },
  {
    id: "voice",
    href: "#creation",
    title: ["音频创作", "Audio creation"],
    art: VoiceCard,
  },
];

export default function MotionPrelude() {
  const { t } = useLocale();
  const rootRef = useRef(null);
  const canvasRef = useRef(null);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [wave, setWave] = useState(0);
  const staticMode = paused || reduced;

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (
      staticMode ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      const frame = requestAnimationFrame(() => ScrollTrigger.refresh());
      return () => cancelAnimationFrame(frame);
    }
    const root = rootRef.current;
    let disposeDots;
    let alive = true;
    import("@/lib/behaviors/dot-field")
      .then(({ initDotField }) => {
        if (!alive) return;
        try {
          disposeDots = initDotField(canvasRef.current);
        } catch {
          /* The product scene remains readable without WebGL. */
        }
      })
      .catch(() => {});
    const context = gsap.context(() => {
      const first = root.querySelector(".prelude-wave-one");
      const second = root.querySelector(".prelude-wave-two");
      gsap.set(first, { scale: 1, opacity: 1 });
      gsap.set(second, { scale: 0.6, opacity: 0 });
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.5,
          onUpdate: ({ progress }) =>
            setWave(progress < 0.44 ? 0 : progress < 0.75 ? 1 : -1),
        },
      });
      timeline
        .to(first, { scale: 2.4, opacity: 0, duration: 0.2, ease: "none" }, 0.3)
        .to(second, { scale: 1, opacity: 1, duration: 0.2, ease: "none" }, 0.3)
        .to(
          second,
          { scale: 1.5, opacity: 0, duration: 0.25, ease: "none" },
          0.5,
        )
        .to({}, { duration: 0.25 }, 0.75);
    }, root);
    const refreshFrame = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => {
      alive = false;
      cancelAnimationFrame(refreshFrame);
      disposeDots?.();
      context.revert();
    };
  }, [staticMode]);

  return (
    <section
      id="possibilities"
      ref={rootRef}
      className={`motion-prelude ${staticMode ? "is-static" : ""}`}
      aria-labelledby="prelude-heading"
    >
      <div className="prelude-sticky">
        <div className="prelude-dot-field" aria-hidden="true">
          <canvas ref={canvasRef} />
        </div>
        <div className="prelude-space">
          {[waveOne, waveTwo].map((items, index) => (
            <div
              key={index}
              className={`prelude-wave prelude-wave-${index === 0 ? "one" : "two"}`}
              inert={!staticMode && wave !== index}
              aria-hidden={!staticMode && wave !== index}
            >
              {items.map(({ id, href, title, art: Art }) => (
                <a
                  className={`prelude-object prelude-object-${id}`}
                  href={href}
                  aria-label={t(`探索${title[0]}`, `Explore ${title[1]}`)}
                  key={id}
                >
                  <div className="prelude-object-hover">
                    <Art />
                  </div>
                </a>
              ))}
            </div>
          ))}
        </div>
        <div className="prelude-center">
          <p className="eyebrow">A WORLD OF CAPABILITIES</p>
          <h2 id="prelude-heading">
            {t("一个工作空间。", "One workspace.")}
            <br />
            <span>
              {t("打开 AI 的整个世界。", "A world of AI possibilities.")}
            </span>
          </h2>
          <p>
            {t("能思考，能创作，能行动。", "Think. Create. Act.")}
            <br />
            {t(
              "让丰富的能力，在你的电脑里自由相遇。",
              "Bring powerful capabilities together on your PC.",
            )}
          </p>
          <a href="#agent" className="button light">
            {t("从你的 Agent 开始", "Start with your agent")}{" "}
            <Icon name="ArrowDown" size={18} />
          </a>
        </div>
        <div className="prelude-footer">
          <span>
            {t(
              "向下滚动 · 让能力在眼前展开",
              "Scroll to explore the possibilities",
            )}
          </span>
          <small>
            {t(
              "图形与交互示意 · 产品界面与设备实物",
              "Concept graphics · Product UI and real hardware",
            )}
          </small>
          <button
            type="button"
            aria-pressed={paused}
            onClick={() => setPaused((value) => !value)}
          >
            <Icon name={paused ? "Play" : "Pause"} size={14} />
            {paused
              ? t("体验动效", "Play motion")
              : t("静态阅读", "Read without motion")}
          </button>
        </div>
      </div>
    </section>
  );
}
