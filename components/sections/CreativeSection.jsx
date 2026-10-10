"use client";

import { useEffect, useId, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Icon from "@/components/Icon";
import { useLocale } from "@/components/i18n/LocaleProvider";

const getModes = (t) => [
  {
    id: "chat",
    name: t("对话", "Chat"),
    icon: "ChatCircle",
    title: t("一个会话，接住所有想法。", "One conversation. Every idea."),
    description: t(
      "理解目标、使用工具、查阅知识。把你的工作交给同一个 Agent 工作台。",
      "Understand goals, use tools, and search knowledge. Bring your work into one Agent workspace.",
    ),
  },
  {
    id: "image",
    name: t("图像", "Image"),
    icon: "Image",
    title: t("从一句灵感，到一组画面。", "From inspiration to images."),
    description: t(
      "提示词、参考图、模型与生成设置集中在创作界面。生成、编辑、整理素材，顺着思路完成。",
      "Prompts, references, models, and settings in one place. Generate, edit, and organize as your ideas take shape.",
    ),
    src: "/images/creative/image-workbench.png",
    alt: t(
      "NomiFun Desktop 图像创作界面截图",
      "NomiFun Desktop image creation workspace screenshot",
    ),
  },
  {
    id: "video",
    name: t("视频", "Video"),
    icon: "Video",
    title: t("让画面，拥有时间。", "Give your images a sense of time."),
    description: t(
      "组织视频提示词、参考素材与生成参数，再把图像和视频带进时间线，继续创作。",
      "Set up prompts, references, and generation options. Bring images and video onto a timeline to keep creating.",
    ),
    src: "/images/creative/video-workbench.png",
    alt: t(
      "NomiFun Desktop 视频创作界面截图",
      "NomiFun Desktop video creation workspace screenshot",
    ),
  },
  {
    id: "audio",
    name: t("音频", "Audio"),
    icon: "Waveform",
    title: t("给故事，添一种声音。", "Give your story a voice."),
    description: t(
      "配置语音模型和声音参数，把文本变成音频。音频节点，也能加入同一张创作画布。",
      "Choose a speech model and voice settings to turn text into audio. Add audio nodes to the same creative canvas.",
    ),
  },
  {
    id: "canvas",
    name: t("无限画布", "Canvas"),
    icon: "GridFour",
    title: t("把创作，铺开来。", "Make room for your ideas."),
    description: t(
      "图像、视频、文字、音频与时间线，在一张自由缩放的画布中组织。你的创作工作台，由你定义。",
      "Arrange images, video, text, audio, and timelines on a canvas you can freely zoom. Build a workspace around your process.",
    ),
  },
];

// Original portal artwork: an animated context constellation, rather than a
// fictional product screenshot. All five modes below retain their real demos.
function ContextConstellation() {
  const { locale, t } = useLocale();
  const uid = useId().replace(/:/g, "");
  const points = [
    [242, 88, t("知识", "Knowledge")],
    [404, 196, t("工具", "Tools")],
    [376, 386, t("图像", "Images")],
    [119, 391, t("音频", "Audio")],
    [72, 184, t("上下文", "Context")],
  ];
  return (
    <svg
      className="creative-context-graphic"
      viewBox="0 0 480 480"
      role="img"
      aria-label={t(
        "围绕同一个会话流转的知识、工具和多模态上下文示意",
        "Illustration of knowledge, tools, and multimodal context flowing around one conversation",
      )}
    >
      <defs>
        <radialGradient id={`context-${uid}`}>
          <stop stopColor="#fff5e6" />
          <stop offset=".52" stopColor="#e1bdfe" />
          <stop offset="1" stopColor="#6859d2" />
        </radialGradient>
        <linearGradient id={`context-line-${uid}`} x1="0" x2="1">
          <stop stopColor="#fcdb9e" />
          <stop offset="1" stopColor="#e9e2ff" />
        </linearGradient>
      </defs>
      <g
        className="context-orbits"
        fill="none"
        stroke="#f5e9ff"
        strokeWidth=".8"
      >
        <ellipse
          cx="240"
          cy="240"
          rx="218"
          ry="98"
          transform="rotate(-30 240 240)"
        />
        <ellipse
          cx="240"
          cy="240"
          rx="218"
          ry="98"
          transform="rotate(30 240 240)"
        />
        <ellipse cx="240" cy="240" rx="94" ry="214" />
        <circle cx="240" cy="240" r="170" strokeDasharray="2 9" />
      </g>
      {points.map(([x, y, name], index) => (
        <g key={name}>
          <path
            className="context-connection"
            d={`M240 240 Q${(x + 240) / 2 + 30} ${(y + 240) / 2 - 30} ${x} ${y}`}
            fill="none"
            stroke={`url(#context-line-${uid})`}
            strokeWidth="1.5"
            strokeDasharray="5 9"
            style={{ animationDelay: `${index * -0.7}s` }}
          />
          <circle
            cx={x}
            cy={y}
            r="26"
            fill="#f8efff"
            fillOpacity=".14"
            stroke="#f7edff"
            strokeOpacity=".55"
          />
          <text
            x={x}
            y={y + 4}
            textAnchor="middle"
            fill="#fff"
            fontSize={locale === "en" ? "9.5" : "11"}
          >
            {name}
          </text>
          <circle
            className="context-signal"
            cx={x}
            cy={y}
            r="32"
            fill="none"
            stroke="#f8efff"
            strokeWidth=".8"
            style={{
              animationDelay: `${index * -0.6}s`,
              transformOrigin: `${x}px ${y}px`,
            }}
          />
        </g>
      ))}
      <g className="context-core">
        <circle cx="240" cy="240" r="65" fill={`url(#context-${uid})`} />
        <circle
          cx="240"
          cy="240"
          r="77"
          fill="none"
          stroke="#fff4ec"
          strokeOpacity=".65"
        />
        <path
          d="M240 209L247 233L271 240L247 247L240 271L233 247L209 240L233 233Z"
          fill="#fffaf1"
        />
      </g>
      <text
        x="240"
        y="462"
        textAnchor="middle"
        fill="#f8f3ff"
        fontSize="10"
        letterSpacing="4"
      >
        ONE CONVERSATION. EVERY POSSIBILITY.
      </text>
    </svg>
  );
}

function AudioSculpture({ playing }) {
  const { t } = useLocale();
  const uid = useId().replace(/:/g, "");
  return (
    <svg
      className={`creative-audio-sculpture ${playing ? "is-playing" : ""}`}
      viewBox="0 0 500 500"
      role="img"
      aria-label={t(
        "随波形演示旋转的声音雕塑",
        "A sound sculpture rotating with the waveform demonstration",
      )}
    >
      <defs>
        <radialGradient id={`record-${uid}`} cx="38%" cy="32%">
          <stop stopColor="#c278cf" />
          <stop offset=".52" stopColor="#3c234d" />
          <stop offset="1" stopColor="#180f29" />
        </radialGradient>
        <linearGradient id={`voice-${uid}`} x1="0" x2="1" y1="0" y2="1">
          <stop stopColor="#fff6b1" />
          <stop offset="1" stopColor="#ef886c" />
        </linearGradient>
      </defs>
      <g className="audio-sculpture-disc">
        <circle cx="250" cy="250" r="202" fill={`url(#record-${uid})`} />
        {Array.from({ length: 15 }, (_, i) => (
          <circle
            key={i}
            cx="250"
            cy="250"
            r={80 + i * 8}
            fill="none"
            stroke="#fbdecb"
            strokeOpacity={i % 3 === 0 ? ".23" : ".09"}
          />
        ))}
        <path
          d="M126 90A202 202 0 0 1 414 126L298 232Z"
          fill="#ecd4f2"
          opacity=".15"
        />
        <path
          d="M90 334A202 202 0 0 0 358 417L242 284Z"
          fill="#ecd4f2"
          opacity=".12"
        />
        <circle cx="250" cy="250" r="70" fill={`url(#voice-${uid})`} />
        <circle cx="250" cy="250" r="7" fill="#34203d" />
        <text
          x="250"
          y="216"
          textAnchor="middle"
          fill="#382534"
          fontSize="10"
          letterSpacing="2"
        >
          YOUR IDEAS, YOUR VOICE
        </text>
        <text x="250" y="290" textAnchor="middle" fill="#382534" fontSize="11">
          NomiFun / Audio
        </text>
      </g>
      <circle
        cx="250"
        cy="250"
        r="227"
        fill="none"
        stroke="#5f3639"
        strokeOpacity=".22"
        strokeDasharray="3 13"
      />
      <path
        d="M425 65V208L331 287"
        fill="none"
        stroke="#fff6e6"
        strokeWidth="12"
        strokeLinecap="round"
      />
      <circle cx="425" cy="65" r="17" fill="#34203d" />
      <path
        d="M338 280L317 302"
        stroke="#34203d"
        strokeWidth="14"
        strokeLinecap="round"
      />
    </svg>
  );
}

const getNodes = (t) => [
  {
    id: "brief",
    label: t("灵感与提示词", "Ideas & prompts"),
    icon: "ChatCircle",
    text: t("一段关于城市与自然的故事", "A story of city and nature"),
    className: "canvas-brief",
  },
  {
    id: "image",
    label: t("图像创作", "Image creation"),
    icon: "Image",
    text: t("参考图 · 生成 · 编辑", "Reference · Generate · Edit"),
    className: "canvas-image",
  },
  {
    id: "video",
    label: t("视频与时间线", "Video & timeline"),
    icon: "Video",
    text: t("让素材连成一段叙事", "Turn media into a narrative"),
    className: "canvas-video",
  },
];

function CanvasDemo() {
  const { t } = useLocale();
  const nodes = getNodes(t);
  const [connected, setConnected] = useState(true);
  const [audio, setAudio] = useState(false);
  const [selected, setSelected] = useState("image");
  const [connections, setConnections] = useState([]);
  const [canvasSize, setCanvasSize] = useState({ width: 1100, height: 475 });
  const boardRef = useRef(null);

  useEffect(() => {
    const board = boardRef.current;
    if (!board) return;
    const updateConnections = () => {
      const bounds = board.getBoundingClientRect();
      setCanvasSize({ width: bounds.width, height: bounds.height });
      const point = (name, side) => {
        const port = board.querySelector(
          `[data-canvas-node="${name}"] .port-${side}`,
        );
        if (!port) return null;
        const box = port.getBoundingClientRect();
        return {
          x: box.left - bounds.left + box.width / 2,
          y: box.top - bounds.top + box.height / 2,
        };
      };
      const pairs = [
        ["brief", "image"],
        ["image", "video"],
        ...(audio ? [["image", "audio"]] : []),
      ];
      setConnections(
        pairs.flatMap(([from, to]) => {
          const start = point(from, "out");
          const end = point(to, "in");
          if (!start || !end) return [];
          const bend = Math.max(45, Math.abs(end.x - start.x) / 2);
          return [
            `M${start.x} ${start.y}C${start.x + bend} ${start.y} ${end.x - bend} ${end.y} ${end.x} ${end.y}`,
          ];
        }),
      );
    };
    updateConnections();
    const observer = new ResizeObserver(updateConnections);
    observer.observe(board);
    board
      .querySelectorAll("[data-canvas-node]")
      .forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [audio, t]);
  return (
    <div className={`creative-canvas-demo ${connected ? "is-connected" : ""}`}>
      <div className="canvas-demo-bar">
        <span>
          <i /> {t("城市与自然 / 创作画布示意", "City & nature / Canvas demo")}
        </span>
        <div>
          <button
            onClick={() => setConnected(!connected)}
            aria-pressed={connected}
          >
            <Icon name="Link" size={15} />
            {connected ? t("断开关联", "Disconnect") : t("连接节点", "Connect")}
          </button>
          <button onClick={() => setAudio(!audio)} aria-pressed={audio}>
            <Icon name={audio ? "Check" : "Plus"} size={15} />
            {audio
              ? t("已加入音频", "Audio added")
              : t("加入音频", "Add audio")}
          </button>
        </div>
      </div>
      <div
        className={`creative-canvas-board ${audio ? "has-audio" : ""}`}
        ref={boardRef}
      >
        <svg
          className="canvas-demo-lines"
          viewBox={`0 0 ${canvasSize.width} ${canvasSize.height}`}
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {connections.map((path, index) => (
            <path key={index} d={path} />
          ))}
        </svg>
        {nodes.map((item) => (
          <button
            className={`canvas-demo-node ${item.className} ${selected === item.id ? "is-selected" : ""}`}
            key={item.id}
            data-canvas-node={item.id}
            aria-pressed={selected === item.id}
            onClick={() => setSelected(item.id)}
          >
            <span className="canvas-node-top">
              <Icon name={item.icon} size={16} />
              {item.label}
              <span className="canvas-node-dot" />
            </span>
            {item.id === "image" ? (
              <div className="canvas-node-art">
                <span className="art-sun" />
                <span className="art-hill hill-one" />
                <span className="art-hill hill-two" />
                <span className="art-hill hill-three" />
                <span className="art-window" />
              </div>
            ) : item.id === "video" ? (
              <div className="canvas-node-timeline">
                <div>
                  <span />
                  <span />
                  <span />
                  <span />
                </div>
                <i />
                <p>
                  00:00 <span>00:15</span>
                </p>
              </div>
            ) : (
              <p className="canvas-node-prompt">
                {t(
                  "“让自然的光，走进城市的每一个清晨。”",
                  "“Let nature’s light fill every city morning.”",
                )}
              </p>
            )}
            <small>{item.text}</small>
            <span className="canvas-node-port port-out" />
            <span className="canvas-node-port port-in" />
          </button>
        ))}
        {audio && (
          <button
            className={`canvas-demo-node canvas-audio ${selected === "audio" ? "is-selected" : ""}`}
            aria-pressed={selected === "audio"}
            data-canvas-node="audio"
            onClick={() => setSelected("audio")}
          >
            <span className="canvas-node-top">
              <Icon name="Waveform" size={16} />
              {t("旁白音频", "Narration")}
            </span>
            <div className="canvas-small-wave">
              {Array.from({ length: 24 }, (_, i) => (
                <i
                  style={{ "--bar-height": `${12 + ((i * 17) % 34)}px` }}
                  key={i}
                />
              ))}
            </div>
            <small>
              {t("语音合成 · 音频素材", "Speech synthesis · Audio")}
            </small>
            <span className="canvas-node-port port-in" />
          </button>
        )}
        <span className="canvas-demo-selection">
          <Icon name="CheckCircle" size={15} />
          {selected === "brief"
            ? t("文字与提示词节点", "Text & prompt node")
            : selected === "image"
              ? t("图像节点：生成与编辑", "Image node: generate & edit")
              : selected === "video"
                ? t("视频节点：组织时间线", "Video node: build a timeline")
                : t("音频节点：文字转语音", "Audio node: text to speech")}
        </span>
        <div className="canvas-demo-minimap" aria-hidden="true">
          <i />
          <i />
          <i />
          <span>100%</span>
        </div>
      </div>
      <div className="canvas-demo-caption">
        {t(
          "节点与关联为官网交互示意；点击节点，探索属于你的创作工作台。",
          "An interactive illustration of nodes and connections. Select a node to explore your workspace.",
        )}
      </div>
    </div>
  );
}

function ChatDemo() {
  const { t } = useLocale();
  const [context, setContext] = useState("knowledge");
  return (
    <div className="creative-chat-world">
      <div className="creative-chat-demo">
        <div className="creative-chat-thread">
          <span className="experience-demo-label">
            <span className="experience-dot" />{" "}
            {t("会话能力示意", "Conversation demo")}
          </span>
          <p className="creative-user-bubble">
            {t(
              "帮我把这个灵感，整理成一个完整的创作方案。",
              "Help me turn this idea into a complete creative plan.",
            )}
          </p>
          <div className="creative-agent-message">
            <span className="creative-agent-mark">
              <Icon name="Sparkle" size={22} />
            </span>
            <div>
              <strong>
                {t(
                  "从想法到作品，我们一步一步来。",
                  "Let’s take it from idea to creation.",
                )}
              </strong>
              <p>
                {t(
                  "可以先梳理故事，再组织参考图、视频与音频。需要领域信息时，我会查询你挂载的知识库。",
                  "Start with the story, then gather image, video, and audio references. For domain details, I can search the knowledge base you attach.",
                )}
              </p>
              <span className="creative-tool-receipt">
                <Icon name="Check" size={15} />
                {context === "knowledge"
                  ? t("已选择：知识检索能力", "Selected: knowledge search")
                  : t("已选择：创作工具能力", "Selected: creative tools")}
              </span>
            </div>
          </div>
        </div>
        <div className="creative-demo-composer">
          <span>
            {t("把你的想法带进工作台…", "Bring your ideas into the workspace…")}
          </span>
          <div>
            <button
              aria-pressed={context === "knowledge"}
              className={context === "knowledge" ? "is-active" : ""}
              onClick={() => setContext("knowledge")}
            >
              <Icon name="MagnifyingGlass" size={15} />
              {t("知识库", "Knowledge")}
            </button>
            <button
              aria-pressed={context === "creative"}
              className={context === "creative" ? "is-active" : ""}
              onClick={() => setContext("creative")}
            >
              <Icon name="Image" size={15} />
              {t("创作工具", "Creative tools")}
            </button>
            <span className="demo-composer-send">
              <Icon name="ArrowUpRight" size={19} />
            </span>
          </div>
        </div>
        <p className="creative-demo-disclaimer">
          {t(
            "官网示意对话，不发送消息或调用模型。",
            "Website demo only. No messages are sent or models called.",
          )}
        </p>
      </div>
    </div>
  );
}

function AudioDemo({ animate, onToggle }) {
  const { t } = useLocale();
  return (
    <div className="creative-audio-world">
      <div className={`creative-audio-demo ${animate ? "is-playing" : ""}`}>
        <span className="experience-demo-label">
          <span className="experience-dot" />{" "}
          {t("音频创作能力示意", "Audio creation demo")}
        </span>
        <div className="creative-audio-title">
          <Icon name="Waveform" size={30} />
          <h4>
            {t("让每段文字，有自己的声音。", "Give every word its own voice.")}
          </h4>
          <p>
            {t(
              "语音合成 · 音频节点 · 模型由你配置",
              "Speech synthesis · Audio nodes · Your choice of model",
            )}
          </p>
        </div>
        <div className="creative-audio-wave" aria-hidden="true">
          {Array.from({ length: 72 }, (_, i) => (
            <i
              key={i}
              style={{
                "--bar-height": `${15 + ((i * 37) % 112)}px`,
                "--bar-delay": `${(i % 7) * 0.08}s`,
              }}
            />
          ))}
        </div>
        <button
          className="audio-demo-control"
          aria-pressed={animate}
          onClick={onToggle}
        >
          <Icon name={animate ? "Pause" : "Play"} size={20} />
          {animate
            ? t("暂停波形演示", "Pause waveform")
            : t("播放波形演示", "Play waveform")}
        </button>
        <p className="creative-demo-disclaimer">
          {t(
            "交互仅演示波形动效，不播放声音或生成音频。",
            "Visual waveform demo only. No sound is played or generated.",
          )}
        </p>
      </div>
    </div>
  );
}

export default function CreativeSection() {
  const { locale, t, path, asset } = useLocale();
  const modes = getModes(t);
  const [active, setActive] = useState("chat");
  const [audioPlaying, setAudioPlaying] = useState(true);
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const cardRefs = useRef([]);

  // A sticky card's offsetTop changes as it sticks. Sum the natural chapter
  // heights so navigation and animation boundaries share stable page positions.
  const chapterTop = (index) => {
    const track = trackRef.current;
    const styles = window.getComputedStyle(track);
    const gap = parseFloat(styles.rowGap) || 0;
    return (
      window.scrollY +
      track.getBoundingClientRect().top +
      (parseFloat(styles.paddingTop) || 0) +
      cardRefs.current
        .slice(0, index)
        .reduce((height, card) => height + card.offsetHeight + gap, 0)
    );
  };

  useEffect(() => {
    const panels = Array.from(
      sectionRef.current?.querySelectorAll(".creative-stack-visual") || [],
    );
    const updateScrollRegions = () => {
      panels.forEach((panel) => {
        // Standard desktop stages present the entire demo. Only a genuine
        // scrollable fallback should intercept Lenis or become a tab stop.
        const scrollable = /^(auto|scroll)$/.test(
          window.getComputedStyle(panel).overflowY,
        );
        const overflowing =
          scrollable && panel.scrollHeight > panel.clientHeight + 2;
        panel.toggleAttribute("data-lenis-prevent", overflowing);
        if (overflowing) panel.setAttribute("tabindex", "0");
        else panel.removeAttribute("tabindex");
      });
    };
    const observer = new ResizeObserver(updateScrollRegions);
    panels.forEach((panel) => {
      observer.observe(panel);
      if (panel.firstElementChild) observer.observe(panel.firstElementChild);
    });
    const images = panels.flatMap((panel) =>
      Array.from(panel.querySelectorAll("img")),
    );
    images.forEach((image) =>
      image.addEventListener("load", updateScrollRegions),
    );
    updateScrollRegions();
    return () => {
      observer.disconnect();
      images.forEach((image) =>
        image.removeEventListener("load", updateScrollRegions),
      );
      panels.forEach((panel) => {
        panel.removeAttribute("data-lenis-prevent");
        panel.removeAttribute("tabindex");
      });
    };
  }, [locale]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    let layoutFrame;
    const refresh = () => {
      cancelAnimationFrame(layoutFrame);
      layoutFrame = requestAnimationFrame(() =>
        window.dispatchEvent(new Event("portal:layout")),
      );
    };
    media.add(
      {
        wide: "(min-width: 1001px)",
        narrow: "(max-width: 1000px)",
        motion: "(prefers-reduced-motion: no-preference)",
      },
      (match) => {
        const measureStickyCards = () => {
          if (!match.conditions.narrow || !match.conditions.motion) return;
          cardRefs.current.forEach((card) => {
            // The page reads a tall chapter before its bottom docks above the
            // reading controls. A short chapter keeps its title below the tabs.
            const top = Math.min(
              152,
              window.innerHeight - 96 - card.offsetHeight,
            );
            card.style.setProperty("--creative-sticky-top", `${top}px`);
          });
        };
        measureStickyCards();
        const context = gsap.context(() => {
          // Each full-height incoming creation card retreats the
          // previous card to .75 / rotateX 15 / alternating rotateY +/-8.
          cardRefs.current.forEach((card, index) => {
            if (!card) return;
            ScrollTrigger.create({
              trigger: card,
              start:
                match.conditions.narrow && match.conditions.motion
                  ? () => chapterTop(index) - window.innerHeight * 0.48
                  : "top 48%",
              end:
                match.conditions.narrow && match.conditions.motion
                  ? () =>
                      chapterTop(index) +
                      card.offsetHeight -
                      window.innerHeight * 0.48
                  : "bottom 48%",
              onEnter: () => setActive(modes[index].id),
              onEnterBack: () => setActive(modes[index].id),
            });
            const incoming = cardRefs.current[index + 1];
            if (!incoming || !match.conditions.motion) return;
            const retreatStart = () =>
              Math.max(
                chapterTop(index) -
                  parseFloat(
                    card.style.getPropertyValue("--creative-sticky-top"),
                  ),
                chapterTop(index + 1) - window.innerHeight + 72,
              );
            gsap.to(card.querySelector(".creative-stack-face"), {
              scale: 0.75,
              rotateX: 15,
              rotateY: index % 2 ? 8 : -8,
              yPercent: [8, 7, 6, 6][index],
              ease: "none",
              scrollTrigger: {
                trigger: incoming,
                start: match.conditions.narrow ? retreatStart : "top bottom",
                end: match.conditions.narrow
                  ? () =>
                      Math.max(retreatStart() + 1, chapterTop(index + 1) - 152)
                  : "top top",
                scrub: 0.6,
                invalidateOnRefresh: true,
              },
            });
          });
        }, sectionRef);
        const update = () => {
          measureStickyCards();
          refresh();
        };
        const observer = new ResizeObserver(update);
        if (match.conditions.narrow || !match.conditions.motion) {
          observer.observe(trackRef.current);
          cardRefs.current.forEach((card) => observer.observe(card));
        }
        window.addEventListener("resize", update);
        return () => {
          window.removeEventListener("resize", update);
          observer.disconnect();
          context.revert();
          cardRefs.current.forEach((card) =>
            card?.style.removeProperty("--creative-sticky-top"),
          );
        };
      },
    );
    // Images load asynchronously; refresh the full-screen card geometry once
    // intrinsic screenshot sizes are known, and remove every listener on exit.
    const images = Array.from(sectionRef.current.querySelectorAll("img"));
    images.forEach((img) => img.addEventListener("load", refresh));
    const timer = window.setTimeout(refresh, 250);
    return () => {
      window.clearTimeout(timer);
      cancelAnimationFrame(layoutFrame);
      images.forEach((img) => img.removeEventListener("load", refresh));
      media.revert();
    };
  }, [locale]);

  const jumpTo = (index) => {
    const card = cardRefs.current[index];
    const track = trackRef.current;
    if (!card || !track) return;
    setActive(modes[index].id);
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const reading = window.matchMedia("(max-width: 1000px)").matches;
    const top = reduced
      ? window.scrollY + card.getBoundingClientRect().top - 152
      : chapterTop(index) - (reading ? 152 : 0);
    if (window.lenis && !reduced) window.lenis.scrollTo(top, { duration: 1.1 });
    else window.scrollTo({ top, behavior: reduced ? "auto" : "smooth" });
  };

  return (
    <section
      className="experience-section creative-experience creative-stack-experience"
      id="creation"
      aria-labelledby="creation-heading"
      ref={sectionRef}
    >
      <div className="container">
        <div className="experience-heading creative-heading">
          <div>
            <span className="eyebrow">
              {t(
                "A SPACE FOR EVERY IDEA / 多模态创作",
                "A SPACE FOR EVERY IDEA / MULTIMODAL CREATION",
              )}
            </span>
            <h2 className="section-heading" id="creation-heading">
              {t("想法不设边界。", "Ideas have no limits.")}
              <br />
              <span>{t("工作台也是。", "Neither should your workspace.")}</span>
            </h2>
          </div>
          <p>
            {t("对话、图像、视频、音频。", "Chat, images, video, and audio.")}
            <br />
            {t(
              "从一个会话，到一张能自由组织的画布。",
              "From one conversation to a canvas you can make your own.",
            )}
          </p>
        </div>
      </div>
      <nav
        className="creative-tabs creative-stack-nav"
        aria-label={t("跳转到创作能力", "Jump to a creative capability")}
      >
        <span className="creative-tabs-intro">
          {t("滚动，让想法展开", "Scroll to unfold your ideas")}
        </span>
        {modes.map((item, index) => (
          <button
            key={item.id}
            id={`creative-tab-${item.id}`}
            aria-controls={`creative-panel-${item.id}`}
            aria-current={active === item.id ? "true" : undefined}
            onKeyDown={(event) => {
              const nextIndex =
                event.key === "ArrowRight"
                  ? (index + 1) % modes.length
                  : event.key === "ArrowLeft"
                    ? (index - 1 + modes.length) % modes.length
                    : event.key === "Home"
                      ? 0
                      : event.key === "End"
                        ? modes.length - 1
                        : null;
              if (nextIndex === null) return;
              event.preventDefault();
              jumpTo(nextIndex);
              document
                .getElementById(`creative-tab-${modes[nextIndex].id}`)
                ?.focus();
            }}
            onClick={() => jumpTo(index)}
          >
            <Icon name={item.icon} size={20} />
            {item.name}
          </button>
        ))}
      </nav>
      <div className="creative-stack-track" ref={trackRef}>
        {modes.map((item, index) => (
          <article
            className={`creative-stack-card creative-mode-${item.id}`}
            key={item.id}
            id={`creative-panel-${item.id}`}
            aria-labelledby={`creative-title-${item.id}`}
            ref={(node) => {
              cardRefs.current[index] = node;
            }}
            style={{ "--creative-card-index": index }}
          >
            <div className="creative-stack-face">
              <span className="creative-stack-orbit" aria-hidden="true" />
              <span className="creative-card-number" aria-hidden="true">
                /0{index + 1}
              </span>
              <div className="creative-stage-copy">
                <div className="creative-stack-heading">
                  <div>
                    <span className="creative-mode-label">
                      {item.name} /{" "}
                      {item.id === "canvas"
                        ? "INFINITE CANVAS"
                        : item.id.toUpperCase()}
                    </span>
                    <h3 id={`creative-title-${item.id}`}>
                      {locale === "zh"
                        ? item.title
                            .split("，")
                            .map((phrase, phraseIndex, phrases) => (
                              <span
                                className="creative-title-phrase"
                                key={phrase}
                              >
                                {phrase}
                                {phraseIndex < phrases.length - 1 ? "，" : ""}
                              </span>
                            ))
                        : item.title}
                    </h3>
                  </div>
                  {item.id !== "chat" && item.id !== "audio" && (
                    <p>{item.description}</p>
                  )}
                </div>
                {(item.id === "chat" || item.id === "audio") && (
                  <div className="creative-stage-art">
                    {item.id === "chat" ? (
                      <ContextConstellation />
                    ) : (
                      <AudioSculpture playing={audioPlaying} />
                    )}
                  </div>
                )}
              </div>
              <div
                className="creative-stack-visual"
                role="region"
                aria-label={t(`${item.name}演示`, `${item.name} demo`)}
              >
                {(item.id === "chat" || item.id === "audio") && (
                  <p className="creative-stage-description">
                    {item.description}
                  </p>
                )}
                {item.src ? (
                  <figure className="creative-product-shot creative-stack-shot">
                    <div className="creative-shot-bar">
                      <span>
                        <i />
                        <i />
                        <i />
                      </span>
                      <span>
                        {t(
                          "NomiFun Desktop / 产品界面",
                          "NomiFun Desktop / Product interface",
                        )}
                      </span>
                      <Icon name={item.icon} size={18} />
                    </div>
                    <img
                      src={asset(item.src)}
                      alt={item.alt}
                      loading="lazy"
                      width="1600"
                      height="1000"
                    />
                    <figcaption>
                      {t(
                        "来自 NomiFun Desktop 开发版的真实界面截图（0.8.3 dev / 2026.10）；界面与功能以正式发布为准。",
                        "Actual product screenshot from a NomiFun Desktop dev build (0.8.3 dev / Oct 2026). Interface may differ in the released version.",
                      )}
                    </figcaption>
                  </figure>
                ) : item.id === "canvas" ? (
                  <CanvasDemo />
                ) : item.id === "chat" ? (
                  <ChatDemo />
                ) : (
                  <AudioDemo
                    animate={audioPlaying}
                    onToggle={() => setAudioPlaying((playing) => !playing)}
                  />
                )}
              </div>
              <div className="creative-card-footer">
                <span>
                  <i />{" "}
                  {t("一个工作台 · 多种表达", "One workspace · Every medium")}
                </span>
                {index < modes.length - 1 ? (
                  <button onClick={() => jumpTo(index + 1)}>
                    {t("继续探索", "Explore")} {modes[index + 1].name}{" "}
                    <Icon name="ArrowDown" size={17} />
                  </button>
                ) : (
                  <a href={path("/products/desktop")}>
                    {t("探索 NomiFun Desktop", "Explore NomiFun Desktop")}{" "}
                    <Icon name="ArrowUpRight" size={17} />
                  </a>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
      <div className="container">
        <div className="creative-bottom-note">
          <span>
            <Icon name="Link" size={18} />{" "}
            {t(
              "让素材、模型与创作上下文，留在同一个空间。",
              "Keep media, models, and creative context in one space.",
            )}
          </span>
          <a href={path("/products/desktop")} className="experience-text-link">
            {t("探索更多创作能力", "Explore creative capabilities")}{" "}
            <Icon name="ArrowUpRight" size={18} />
          </a>
        </div>
      </div>
    </section>
  );
}
