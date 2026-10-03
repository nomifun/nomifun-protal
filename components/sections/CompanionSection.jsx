"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import Icon from "@/components/Icon";
import { useLocale } from "@/components/i18n/LocaleProvider";

const companions = [
  {
    id: "mochi",
    name: "Mochi",
    role: "日常伙伴",
    roleEn: "Everyday companion",
    color: "#edb2ca",
    memory: "你喜欢把复杂的事情，讲得简单一点。",
    memoryEn: "You like making complex things a little easier to understand.",
    line: "今天的灵感，我帮你记住。",
    lineEn: "I'll keep today's inspiration for you.",
    ability: "人格 · 对话 · 长期记忆",
    abilityEn: "Personality · Conversation · Long-term memory",
  },
  {
    id: "ink",
    name: "Ink",
    role: "研究搭档",
    roleEn: "Research partner",
    color: "#b8a0ee",
    memory: "你习惯先读源码，再做架构判断。",
    memoryEn:
      "You prefer reading the source before making architecture decisions.",
    line: "把问题交给我，我们一起找到答案。",
    lineEn: "Let's find the answer together.",
    ability: "知识检索 · 工具 · Skills",
    abilityEn: "Knowledge search · Tools · Skills",
  },
  {
    id: "bolt",
    name: "Bolt",
    role: "行动助手",
    roleEn: "Action assistant",
    color: "#a3d5bf",
    memory: "你希望执行前看计划，完成后看结果。",
    memoryEn:
      "You want a plan before execution and results when the work is done.",
    line: "准备就绪。让想法走进真实世界。",
    lineEn: "Ready. Let's bring your ideas into the world.",
    ability: "设备连接 · 工具 · 自动化",
    abilityEn: "Devices · Tools · Automation",
  },
];

const channelsEn = [
  "Telegram",
  "Feishu / Lark",
  "DingTalk",
  "WeChat",
  "WeCom",
  "Discord",
  "Matrix",
  "Mattermost",
  "Slack",
  "Twitch",
  "Nostr",
  "QQ Bot",
];

const channels = [
  "Telegram",
  "飞书 / Lark",
  "钉钉",
  "微信",
  "企业微信",
  "Discord",
  "Matrix",
  "Mattermost",
  "Slack",
  "Twitch",
  "Nostr",
  "QQ Bot",
];

// The Mochi outline is adapted from NomiFun Desktop's Apache-2.0 character.
// Other poses are original portal illustrations, not product screenshots.
function CompanionFigure({ kind, small = false }) {
  const { t } = useLocale();
  const uid = useId().replace(/:/g, "");
  return (
    <svg
      className={`experience-figure ${small ? "is-small" : ""}`}
      viewBox="0 0 160 160"
      role="img"
      aria-label={t(`${kind} 伙伴形象插画`, `${kind} companion illustration`)}
    >
      <defs>
        <radialGradient id={`body-${uid}`} cx="40%" cy="28%" r="80%">
          <stop stopColor={kind === "ink" ? "#62606e" : "#fffdfb"} />
          <stop offset="1" stopColor={kind === "ink" ? "#232129" : "#f7e6dd"} />
        </radialGradient>
      </defs>
      <ellipse cx="80" cy="146" rx="38" ry="6" fill="#252227" opacity=".08" />
      <g className="experience-figure-body">
        {kind === "mochi" && (
          <>
            <path
              d="M62 60C50 50 48 26 54 14C58 6 68 8 70 20C72 34 71 50 68 60Z"
              fill={`url(#body-${uid})`}
              stroke="#d6a3ac"
              strokeWidth="2"
            />
            <path
              d="M98 60C110 50 112 26 106 14C102 6 92 8 90 20C88 34 89 50 92 60Z"
              fill={`url(#body-${uid})`}
              stroke="#d6a3ac"
              strokeWidth="2"
            />
            <path
              d="M61 51C55 38 56 21 60 18C64 16 65 36 63 51M99 51C105 38 104 21 100 18C96 16 95 36 97 51"
              stroke="#f0bbcf"
              strokeWidth="5"
              strokeLinecap="round"
            />
          </>
        )}
        {kind === "ink" && (
          <>
            <path
              d="M43 65L45 23L72 54M88 54L116 23L118 66"
              fill="#39363f"
              stroke="#27232d"
              strokeWidth="2"
            />
            <path
              d="M111 129Q151 141 148 105"
              fill="none"
              stroke="#39363f"
              strokeWidth="12"
              strokeLinecap="round"
            />
          </>
        )}
        {kind !== "bolt" ? (
          <>
            <ellipse
              cx="64"
              cy="139"
              rx="12"
              ry="8"
              fill={`url(#body-${uid})`}
            />
            <ellipse
              cx="96"
              cy="139"
              rx="12"
              ry="8"
              fill={`url(#body-${uid})`}
            />
            <path
              d="M80 50C116 50 132 76 132 102C132 130 110 142 80 142C50 142 28 130 28 102C28 76 44 50 80 50Z"
              fill={`url(#body-${uid})`}
              stroke={kind === "ink" ? "#27232d" : "#d6a3ac"}
              strokeWidth="2"
            />
            <ellipse
              cx="53"
              cy="104"
              rx="10"
              ry="5"
              fill="#efb0c5"
              opacity=".5"
            />
            <ellipse
              cx="107"
              cy="104"
              rx="10"
              ry="5"
              fill="#efb0c5"
              opacity=".5"
            />
            <g className="experience-figure-eyes">
              <ellipse
                cx="63"
                cy="92"
                rx="5.5"
                ry="7"
                fill={kind === "ink" ? "#e5c370" : "#54413e"}
              />
              <ellipse
                cx="97"
                cy="92"
                rx="5.5"
                ry="7"
                fill={kind === "ink" ? "#e5c370" : "#54413e"}
              />
              <circle cx="61" cy="90" r="2" fill="white" />
              <circle cx="95" cy="90" r="2" fill="white" />
            </g>
            <path
              d="M73 107Q80 114 87 107"
              fill="none"
              stroke={kind === "ink" ? "#c3acb1" : "#a4717d"}
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </>
        ) : (
          <>
            <path d="M80 44V26" stroke="#83b9a0" strokeWidth="5" />
            <circle cx="80" cy="22" r="8" fill="#bbdd9d" />
            <rect
              x="39"
              y="45"
              width="82"
              height="88"
              rx="29"
              fill={`url(#body-${uid})`}
              stroke="#b4c3bc"
              strokeWidth="2"
            />
            <rect x="49" y="57" width="62" height="49" rx="17" fill="#25372f" />
            <g className="experience-figure-eyes">
              <path
                d="M60 79h9M91 79h9"
                stroke="#b9e0b8"
                strokeWidth="5"
                strokeLinecap="round"
              />
            </g>
            <path
              d="M74 93h12"
              stroke="#b9e0b8"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <path
              d="M36 81L24 103M124 81L136 103"
              stroke="#c6d4ce"
              strokeWidth="10"
              strokeLinecap="round"
            />
            <path d="M69 139L80 153L91 139" fill="#9ed3be" opacity=".6" />
          </>
        )}
      </g>
    </svg>
  );
}

export default function CompanionSection() {
  const { t, path } = useLocale();
  const [active, setActive] = useState(0);
  const [dropping, setDropping] = useState(null);
  const [playing, setPlaying] = useState(true);
  const [hovering, setHovering] = useState(false);
  const [focused, setFocused] = useState(false);
  const [touching, setTouching] = useState(false);
  const [visible, setVisible] = useState(false);
  const [tabVisible, setTabVisible] = useState(true);
  const [scope, setScope] = useState("memory");
  const [expanded, setExpanded] = useState(false);
  const [permission, setPermission] = useState("approved");
  const [robot, setRobot] = useState(false);
  const deckRef = useRef(null);
  const activeRef = useRef(0);
  const animatingRef = useRef(false);
  const reducedRef = useRef(false);
  const dropTimerRef = useRef(null);
  const queuedSelectionRef = useRef(null);
  const pointerRef = useRef(null);
  const suppressClickRef = useRef(0);
  const current = companions[active];

  const selectCompanion = useCallback(function select(index, manual = false) {
    // A visitor's choice owns the deck until they explicitly resume autoplay.
    // Finish the current card drop, then deliver the latest manual
    // request instead of discarding clicks during its 650ms animation lock.
    if (manual) setPlaying(false);
    if (index === activeRef.current) {
      if (manual) queuedSelectionRef.current = null;
      return;
    }
    if (animatingRef.current) {
      if (manual) queuedSelectionRef.current = index;
      return;
    }
    queuedSelectionRef.current = null;
    const previous = activeRef.current;
    activeRef.current = index;
    setActive(index);
    if (reducedRef.current) return;
    animatingRef.current = true;
    setDropping(previous);
    dropTimerRef.current = window.setTimeout(() => {
      setDropping(null);
      animatingRef.current = false;
      dropTimerRef.current = null;
      const queued = queuedSelectionRef.current;
      queuedSelectionRef.current = null;
      if (queued !== null) select(queued);
    }, 650);
  }, []);

  const nextCompanion = useCallback(
    (manual = false) => {
      const start = manual
        ? (queuedSelectionRef.current ?? activeRef.current)
        : activeRef.current;
      selectCompanion((start + 1) % companions.length, manual);
    },
    [selectCompanion],
  );

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => {
      reducedRef.current = media.matches;
      if (media.matches) {
        setPlaying(false);
        window.clearTimeout(dropTimerRef.current);
        setDropping(null);
        animatingRef.current = false;
        const queued = queuedSelectionRef.current;
        queuedSelectionRef.current = null;
        if (queued !== null) {
          activeRef.current = queued;
          setActive(queued);
        }
      }
    };
    const updateVisibility = () => setTabVisible(!document.hidden);
    updateMotion();
    updateVisibility();
    media.addEventListener("change", updateMotion);
    document.addEventListener("visibilitychange", updateVisibility);
    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting && entry.intersectionRatio >= 0.15);
      },
      { threshold: [0, 0.15] },
    );
    if (deckRef.current) observer.observe(deckRef.current);
    return () => {
      observer.disconnect();
      media.removeEventListener("change", updateMotion);
      document.removeEventListener("visibilitychange", updateVisibility);
      window.clearTimeout(dropTimerRef.current);
      queuedSelectionRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!playing || hovering || focused || touching || !visible || !tabVisible)
      return;
    const timer = window.setInterval(() => nextCompanion(false), 3400);
    return () => window.clearInterval(timer);
  }, [
    playing,
    hovering,
    focused,
    touching,
    visible,
    tabVisible,
    nextCompanion,
    active,
  ]);

  const cardRole = (index) => {
    if (index === dropping) return "is-dropping";
    if (index === active) return "is-front";
    if (index === (active + 1) % companions.length) return "is-next";
    return "is-hidden";
  };

  return (
    <section
      className="experience-section companion-experience companion-deck-experience"
      id="companion"
      aria-labelledby="companion-heading"
    >
      <div className="container">
        <div className="experience-heading companion-heading">
          <div>
            <span className="eyebrow">
              {t("PERSONAL AI / 你的桌面伙伴", "YOUR PERSONAL AI COMPANIONS")}
            </span>
            <h2 id="companion-heading" className="section-heading">
              {t("有个性。会成长。", "Personal. Always growing.")}
              <br />
              <span>{t("更能一起做事。", "Ready to work together.")}</span>
            </h2>
          </div>
          <p>
            {t(
              "有自己的形象、人格与记忆，也能调动完整 Agent 能力。",
              "A personality and memories of its own, with a complete Agent's capabilities.",
            )}
            <br />
            {t(
              "从桌面日常，到手机与实体设备，延续同一位伙伴的陪伴。",
              "Keep the same companion close, across your desktop, phone, and physical device.",
            )}
          </p>
        </div>

        <div
          className="companion-stage"
          style={{ "--companion-accent": current.color }}
        >
          <div
            className={`companion-world companion-deck-world ${visible && tabVisible ? "is-in-view" : ""}`}
          >
            <div className="experience-demo-label">
              <span className="experience-dot" />{" "}
              {t(
                "独立的 Agent · 不同的个性",
                "Independent Agents · Distinct personalities",
              )}
            </div>
            <div
              className="companion-deck-container"
              ref={deckRef}
              role="group"
              aria-label={t(
                "桌面伙伴卡牌，点击、左右滑动或用方向键切换",
                "Companion cards. Click, swipe or use the arrow keys to switch.",
              )}
              tabIndex={0}
              onMouseEnter={() => setHovering(true)}
              onMouseLeave={() => setHovering(false)}
              onFocusCapture={() => setFocused(true)}
              onBlurCapture={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget))
                  setFocused(false);
              }}
              onKeyDown={(event) => {
                if (event.target.closest("button, a")) return;
                if (
                  event.key === "ArrowRight" ||
                  event.key === "Enter" ||
                  event.key === " "
                ) {
                  event.preventDefault();
                  nextCompanion(true);
                } else if (event.key === "ArrowLeft") {
                  event.preventDefault();
                  selectCompanion(
                    ((queuedSelectionRef.current ?? activeRef.current) -
                      1 +
                      companions.length) %
                      companions.length,
                    true,
                  );
                }
              }}
              onPointerDown={(event) => {
                if (event.button !== 0 || event.target.closest("a, button"))
                  return;
                pointerRef.current = {
                  x: event.clientX,
                  y: event.clientY,
                  id: event.pointerId,
                };
                if (event.pointerType !== "mouse") {
                  setTouching(true);
                  event.currentTarget.setPointerCapture(event.pointerId);
                }
              }}
              onPointerUp={(event) => {
                const start = pointerRef.current;
                pointerRef.current = null;
                setTouching(false);
                if (!start || start.id !== event.pointerId) return;
                const x = start.x - event.clientX;
                const y = start.y - event.clientY;
                if (Math.abs(x) > 40 && Math.abs(x) > Math.abs(y)) {
                  suppressClickRef.current = Date.now() + 500;
                  nextCompanion(true);
                }
              }}
              onPointerCancel={() => {
                pointerRef.current = null;
                setTouching(false);
              }}
              onPointerLeave={(event) => {
                if (event.pointerType === "mouse") pointerRef.current = null;
              }}
              onClick={(event) => {
                if (
                  event.target.closest("a, button") ||
                  Date.now() < suppressClickRef.current
                )
                  return;
                nextCompanion(true);
              }}
            >
              {companions.map((item, index) => (
                <article
                  key={item.id}
                  className={`companion-deck-card companion-scene ${cardRole(index)}`}
                  aria-hidden={active !== index}
                  style={{ "--card-accent": item.color }}
                >
                  <div className="companion-deck-card-top">
                    <span>YOUR PERSONAL AGENT</span>
                    <span>0{index + 1} / 03</span>
                  </div>
                  <span className="companion-deck-aura" />
                  <span className="companion-orbit orbit-one" />
                  <span className="companion-orbit orbit-two" />
                  <div className="companion-speech">
                    <Icon name="Sparkle" size={16} />
                    <span>{t(item.line, item.lineEn)}</span>
                  </div>
                  <div className="companion-main-figure">
                    <CompanionFigure kind={item.id} />
                  </div>
                  <div className="companion-name">
                    <h3>
                      {item.name}
                      <span>{t(item.role, item.roleEn)}</span>
                    </h3>
                    <p>{t(item.ability, item.abilityEn)}</p>
                  </div>
                  <span className="companion-floating-note">
                    <Icon name="ArrowsClockwise" size={15} />{" "}
                    {t(
                      "持续学习，沉淀为技能",
                      "Keep learning. Build reusable Skills.",
                    )}
                  </span>
                  <span className="companion-deck-card-bottom">
                    {t(
                      "个性由你定义 · 能力由你组合",
                      "Your personality choices · Your capability mix",
                    )}
                  </span>
                </article>
              ))}
            </div>
            <div className="companion-deck-controls">
              <span>
                {String(active + 1).padStart(2, "0")} <i /> 03
              </span>
              <div>
                <button
                  onClick={() =>
                    setPlaying((currentPlaying) => !currentPlaying)
                  }
                  aria-pressed={playing}
                >
                  <Icon name={playing ? "Pause" : "Play"} size={15} />
                  {playing ? t("暂停轮播", "Pause") : t("开始轮播", "Play")}
                </button>
                <button
                  onClick={() => nextCompanion(true)}
                  aria-label={t("切换到下一位伙伴", "Show the next companion")}
                >
                  <Icon name="ArrowRight" size={18} />
                </button>
              </div>
            </div>
            <div
              className="companion-picker"
              role="group"
              aria-label={t("选择示意伙伴", "Choose a demo companion")}
            >
              {companions.map((item, index) => (
                <button
                  key={item.id}
                  className={active === index ? "is-active" : ""}
                  aria-pressed={active === index}
                  onClick={() => selectCompanion(index, true)}
                >
                  <CompanionFigure kind={item.id} small />
                  <span>
                    {item.name}
                    <small>{t(item.role, item.roleEn)}</small>
                  </span>
                  <Icon name={active === index ? "Check" : "Plus"} size={16} />
                </button>
              ))}
            </div>
          </div>
          <div className="companion-insight">
            <span className="experience-overline">
              {t(
                "一位伙伴，一段持续的关系",
                "A companion. A lasting connection.",
              )}
            </span>
            <h3>
              {t("独立记忆。", "Own memories.")}
              <br />
              {t("共享知识。", "Shared knowledge.")}
            </h3>
            <div
              className="experience-segmented"
              role="group"
              aria-label={t(
                "查看伙伴记忆或知识示意",
                "Explore companion memory and knowledge",
              )}
            >
              <button
                aria-pressed={scope === "memory"}
                className={scope === "memory" ? "is-active" : ""}
                onClick={() => setScope("memory")}
              >
                <Icon name="LockKey" size={16} /> {t("独立记忆", "Own memory")}
              </button>
              <button
                aria-pressed={scope === "knowledge"}
                className={scope === "knowledge" ? "is-active" : ""}
                onClick={() => setScope("knowledge")}
              >
                <Icon name="Link" size={16} />{" "}
                {t("共享知识", "Shared knowledge")}
              </button>
            </div>
            <div className="companion-memory-card" aria-live="polite">
              {scope === "memory" ? (
                <>
                  <span className="memory-card-owner">
                    <span style={{ background: current.color }} />{" "}
                    {t("只属于", "Only for")} {current.name}
                  </span>
                  <p>“{t(current.memory, current.memoryEn)}”</p>
                  <div className="memory-card-meta">
                    <Icon name="ShieldCheck" size={15} />{" "}
                    {t(
                      "每位伙伴各自的记忆与学习节奏",
                      "Each companion remembers and learns at its own pace",
                    )}
                  </div>
                </>
              ) : (
                <>
                  <span className="memory-card-owner">
                    <Icon name="Link" size={15} />{" "}
                    {t(
                      "可由多个伙伴挂载的知识库",
                      "A knowledge base for multiple companions",
                    )}
                  </span>
                  <div className="knowledge-document">
                    <Icon name="GridFour" size={19} />
                    <span>
                      {t("我的产品资料", "My product resources")}
                      <small>
                        {t(
                          "把同一份知识带进不同角色",
                          "The same knowledge, across different roles",
                        )}
                      </small>
                    </span>
                  </div>
                  <div className="knowledge-document">
                    <Icon name="MagnifyingGlass" size={19} />
                    <span>
                      {t("研究与灵感", "Research and inspiration")}
                      <small>
                        {t(
                          "需要时检索，按策略沉淀",
                          "Retrieve when needed. Retain by policy.",
                        )}
                      </small>
                    </span>
                  </div>
                </>
              )}
            </div>
            <p className="companion-insight-note">
              {t(
                "可持续的“无限记忆”设计：归档、压缩与按需检索，让陪伴延续下去；重复工作也能沉淀成可复用 Skills。",
                'Designed for lasting, "unbounded memory": archiving, compression and retrieval on demand keep the connection going. Repeated work can become reusable Skills.',
              )}
            </p>
            <a
              className="experience-text-link"
              href={path("/products/desktop")}
            >
              {t("认识 NomiFun Desktop", "Meet NomiFun Desktop")}{" "}
              <Icon name="ArrowUpRight" size={18} />
            </a>
          </div>
        </div>

        <div className="companion-connections">
          <div className="companion-channel-side">
            <button
              className="channel-expand"
              aria-expanded={expanded}
              aria-controls="companion-channel-list"
              onClick={() => setExpanded(!expanded)}
            >
              <span className="connection-icon">
                <Icon name="ChatsCircle" size={25} />
              </span>
              <span>
                <strong>{t("12 个 IM 渠道", "12 IM channels")}</strong>
                <small>
                  {t(
                    "把伙伴带到你常用的聊天入口",
                    "Bring your companion to the chats you use",
                  )}
                </small>
              </span>
              <Icon
                name="Plus"
                size={22}
                className={expanded ? "is-rotated" : ""}
              />
            </button>
            <div
              className={`companion-channel-list ${expanded ? "is-expanded" : ""}`}
              id="companion-channel-list"
            >
              {channels.map((item, index) => (
                <span key={item}>{t(item, channelsEn[index])}</span>
              ))}
            </div>
          </div>
          <div className="companion-permission-side">
            <div className="permission-heading">
              <Icon name="ShieldCheck" size={19} />
              <span>{t("权限，由你掌控", "Permissions in your hands")}</span>
              <small>{t("配置示意", "Demo settings")}</small>
            </div>
            <div
              className="permission-switch"
              role="group"
              aria-label={t("渠道权限示意", "Demo channel permissions")}
            >
              <button
                className={permission === "approved" ? "is-active" : ""}
                aria-pressed={permission === "approved"}
                onClick={() => setPermission("approved")}
              >
                {t("私聊审批", "DM approval")}
              </button>
              <button
                className={permission === "group" ? "is-active" : ""}
                aria-pressed={permission === "group"}
                onClick={() => setPermission("group")}
              >
                {t("群聊名单", "Group allowlist")}
              </button>
            </div>
            <p>
              {permission === "approved"
                ? t(
                    "经你批准，才成为能与伙伴私聊的用户。",
                    "Only users you approve can message your companion directly.",
                  )
                : t(
                    "按名单接待群成员；群消息须 @ 机器人。",
                    "Group access follows an allowlist. Messages must mention the bot.",
                  )}
            </p>
          </div>
          <button
            className={`companion-robot-side ${robot ? "is-linked" : ""}`}
            aria-pressed={robot}
            onClick={() => setRobot(!robot)}
          >
            <span className="robot-line">
              <Icon name="Robot" size={28} />
              <span className="robot-wire">
                <i />
                <i />
                <i />
              </span>
              <Icon name="Cpu" size={28} />
            </span>
            <strong>
              {robot
                ? t("连接关系已展开", "Connection revealed")
                : t("连接物理世界", "Connect to the physical world")}
            </strong>
            <small>
              {robot
                ? t(
                    "机器人 ↔ 电脑 ↔ 同一个伙伴",
                    "Robot ↔ Computer ↔ Your companion",
                  )
                : t(
                    "点击查看机器人直连示意",
                    "See how a robot connects directly",
                  )}
            </small>
          </button>
        </div>
        <p className="experience-footnote">
          {t(
            "此处为官网交互示意，不会创建伙伴或连接设备。多桌面窗口会增加 WebView 资源占用；渠道接入需要相应平台配置。",
            "This website demo does not create companions or connect devices. Additional desktop windows use more WebView resources. Each chat platform requires its own setup.",
          )}
        </p>
      </div>
    </section>
  );
}
