"use client";
import { useState } from "react";
import Icon from "@/components/Icon";
import { useLocale } from "@/components/i18n/LocaleProvider";

const modules = [
  {
    id: "knowledge",
    name: "知识与记忆",
    nameEn: "Knowledge & memory",
    icon: "BookOpen",
    description: "让相关知识与持久记忆，进入当前任务。",
    descriptionEn:
      "Bring relevant knowledge and lasting memories into the task.",
  },
  {
    id: "files",
    name: "文件与开发",
    nameEn: "Files & development",
    icon: "Code",
    description: "读取项目、编辑文件、使用本地进程与版本控制。",
    descriptionEn:
      "Read projects, edit files, and use local processes and version control.",
  },
  {
    id: "web",
    name: "网页与浏览器",
    nameEn: "Web & browser",
    icon: "Browser",
    description: "调研公开来源，观察并操作已授权的浏览器。",
    descriptionEn: "Research public sources and work in authorized browsers.",
  },
  {
    id: "collab",
    name: "Agent 协作",
    nameEn: "Agent collaboration",
    icon: "UsersThree",
    description: "规划、委派并汇总有边界的 Agent 工作。",
    descriptionEn:
      "Plan, delegate, and bring together clearly scoped Agent work.",
  },
  {
    id: "media",
    name: "多模态创作",
    nameEn: "Multimodal creation",
    icon: "Sparkle",
    description: "通过已配置的模型，创作图像、视频与音频。",
    descriptionEn:
      "Create images, video, and audio with your configured models.",
  },
  {
    id: "auto",
    name: "持续自动化",
    nameEn: "Continuous automation",
    icon: "Lightning",
    description: "让需求、定时任务与持续工作连起来。",
    descriptionEn: "Connect requests, scheduled tasks, and ongoing work.",
  },
  {
    id: "computer",
    name: "电脑操作",
    nameEn: "Computer use",
    icon: "Mouse",
    description: "在系统授权范围内，观察和操作桌面应用。",
    descriptionEn:
      "Observe and operate desktop apps within system permissions.",
  },
  {
    id: "device",
    name: "机器人设备",
    nameEn: "Robot devices",
    icon: "Robot",
    description: "让明确绑定的设备，成为 Agent 的行动入口。",
    descriptionEn:
      "Let explicitly paired devices become an Agent's way to act.",
  },
];
const presets = [
  {
    name: "轻量助手",
    nameEn: "Lightweight assistant",
    ids: [],
    role: "只带上必要的能力",
    roleEn: "Just the capabilities you need",
    task: "一起梳理想法、回答问题，把注意力留给眼前。",
    taskEn: "Explore ideas, answer questions, and focus on what matters now.",
    tone: "minimal",
  },
  {
    name: "开发搭档",
    nameEn: "Coding partner",
    ids: ["knowledge", "files", "web", "collab"],
    role: "从理解项目，到协作交付",
    roleEn: "From project insight to delivery",
    task: "读懂代码，调研方案，分工实现，再汇总成可检查的结果。",
    taskEn:
      "Understand the code, research options, divide the work, and deliver results you can review.",
    tone: "developer",
  },
  {
    name: "创作伙伴",
    nameEn: "Creative partner",
    ids: ["knowledge", "media", "web"],
    role: "让灵感，有完整的表达",
    roleEn: "Give every idea a fuller form",
    task: "在图像、视频、声音与无限画布之间，持续推进创意。",
    taskEn:
      "Build your ideas across images, video, sound, and an infinite canvas.",
    tone: "creator",
  },
];
export default function AgentComposer() {
  const { locale, t, asset } = useLocale();
  const [selected, setSelected] = useState(presets[1].ids),
    [preset, setPreset] = useState(1),
    [detail, setDetail] = useState("files"),
    [session, setSession] = useState("调研 Agent"),
    [showSource, setShowSource] = useState(false);
  const toggle = (id) => {
    setSelected((s) =>
      s.includes(id) ? s.filter((x) => x !== id) : [...s, id],
    );
    setPreset(-1);
    setDetail(id);
  };
  const current = modules.find((m) => m.id === detail);
  return (
    <section id="agent" className="agent-section" data-locale={locale}>
      <div className="container">
        <div className="section-split" data-reveal>
          <p className="eyebrow">01 / AN AGENT, AS YOU IMAGINE IT</p>
          <div>
            <h2 className="section-heading">
              {t("能力不必全开。", "Only what you need.")}
              <br />
              {t("刚好适合你，才强大。", "An Agent that fits you.")}
            </h2>
            <p className="section-copy">
              {t(
                "从基础对话，到完整工作伙伴。可视化组合真实能力、模型与执行策略，",
                "From simple chat to a full working partner. Visually combine capabilities, models, and execution policies,",
              )}
              <br className="desktop-only" />
              {t(
                "让每一个 Agent，都有自己的工作方式。",
                "so every Agent can work its own way.",
              )}
            </p>
          </div>
        </div>
        <div className="agent-workbench" data-reveal>
          <div className="workbench-top">
            <span>
              <span className="live-dot" />
              {t("自由组合，亲手试试", "Compose it. Try it.")}
            </span>
            <small>
              {t("能力组合交互示意", "Interactive capability demo")}
            </small>
          </div>
          <div className="composer-grid">
            <div className="composer-controls">
              <div
                className="preset-tabs"
                role="group"
                aria-label={t("Agent 能力预设", "Agent capability presets")}
              >
                {presets.map((p, i) => (
                  <button
                    key={p.name}
                    aria-pressed={preset === i}
                    onClick={() => {
                      setPreset(i);
                      setSelected(p.ids);
                    }}
                  >
                    {t(p.name, p.nameEn)}
                  </button>
                ))}
              </div>
              <div className="module-list">
                {modules.map((m) => (
                  <button
                    key={m.id}
                    className={
                      selected.includes(m.id) ? "module enabled" : "module"
                    }
                    role="switch"
                    aria-checked={selected.includes(m.id)}
                    aria-label={t(`切换${m.name}能力`, `Toggle ${m.nameEn}`)}
                    onClick={() => toggle(m.id)}
                  >
                    <Icon name={m.icon} size={21} />
                    <span>{t(m.name, m.nameEn)}</span>
                    <span className="switch-track">
                      <span />
                    </span>
                  </button>
                ))}
              </div>
              <div className="module-detail" aria-live="polite">
                <Icon name={current.icon} size={16} />
                <span>{t(current.description, current.descriptionEn)}</span>
              </div>
            </div>
            <div
              className={`composer-preview ${presets[preset]?.tone || "custom"}`}
            >
              <div className="agent-orbit" aria-hidden="true">
                <div className="orbit-circle circle-one" />
                <div className="orbit-circle circle-two" />
                <div className="agent-core">
                  <img
                    src={asset("/images/brand/nomifun.svg")}
                    alt=""
                    width="64"
                    height="64"
                  />
                  <span>YOUR AGENT</span>
                </div>
                {modules.map((m, i) => (
                  <div
                    key={m.id}
                    className={`orbit-module ${selected.includes(m.id) ? "active" : ""}`}
                    style={{ "--angle": `${i * 45}deg` }}
                  >
                    <Icon name={m.icon} size={23} />
                  </div>
                ))}
              </div>
              <div className="agent-preview-copy" aria-live="polite">
                <span className="pill">
                  {selected.length === 0
                    ? t("基础对话", "Basic conversation")
                    : t(
                        `${selected.length} 组能力已选择`,
                        `${selected.length} capabilities selected`,
                      )}
                </span>
                <h3>
                  {preset >= 0
                    ? t(presets[preset].role, presets[preset].roleEn)
                    : t("这就是你的独特组合", "A combination that's yours")}
                </h3>
                <p>
                  {preset >= 0
                    ? t(presets[preset].task, presets[preset].taskEn)
                    : t(
                        "根据场景取舍能力，让 Agent 在明确的授权范围内工作。",
                        "Choose capabilities for the situation. Let your Agent work within explicit permissions.",
                      )}
                </p>
              </div>
            </div>
          </div>
          <div className="workbench-bottom">
            <span>
              <Icon name="ShieldCheck" size={17} />
              {t(
                "模块可组合，具体操作仍由你授权。",
                "Compose the modules. You authorize the actions.",
              )}
            </span>
            <button
              onClick={() => setShowSource((v) => !v)}
              aria-expanded={showSource}
            >
              {t("看看真实工作台", "See the real workbench")}
              <Icon
                name={showSource ? "CaretDown" : "ArrowUpRight"}
                size={17}
              />
            </button>
          </div>
          {showSource && (
            <figure className="agent-source">
              <img
                src={asset("/images/product/agent-workbench.png")}
                alt={t(
                  "NomiFun 真实 Agent 工作台组件：官方预设、模块分类与逐项操作授权",
                  "The real NomiFun Agent workbench: official presets, capability categories, and permissions for individual actions",
                )}
                loading="lazy"
              />
              <figcaption>
                {t(
                  "当前源码的真实工作台组件 · 测试数据交互预览，功能以安装版本为准。",
                  "Real workbench component from current source, previewed with test data. Features depend on your installed version.",
                )}
              </figcaption>
            </figure>
          )}
        </div>
        <div className="session-relay" data-reveal>
          <div className="relay-copy">
            <span className="eyebrow">
              ONE CONVERSATION. DIFFERENT CAPABILITIES.
            </span>
            <h3>
              {t("同一段对话，", "One conversation.")}
              <br />
              {t("让能力接力。", "Let capabilities take turns.")}
            </h3>
            <p>
              {t(
                "上下文与草稿留在这里。下一轮，",
                "Your context and drafts stay here. Next turn,",
              )}
              <br />
              {t(
                "换一个更适合当前任务的 Agent。",
                "switch to the Agent that fits the task.",
              )}
            </p>
          </div>
          <div className="relay-card">
            <div className="relay-header">
              <span>{t("我的产品计划", "My product plan")}</span>
              <div
                className="session-switch"
                role="group"
                aria-label={t(
                  "会话 Agent 切换示意",
                  "Conversation Agent switch demo",
                )}
              >
                {["调研 Agent", "开发 Agent"].map((n) => (
                  <button
                    key={n}
                    aria-pressed={session === n}
                    onClick={() => setSession(n)}
                  >
                    {t(
                      n,
                      n === "调研 Agent" ? "Research Agent" : "Coding Agent",
                    )}
                  </button>
                ))}
              </div>
            </div>
            <p className="relay-user">
              {t(
                "帮我把这个想法，做成一个可以运行的工具。",
                "Help me turn this idea into a working tool.",
              )}
            </p>
            <div className="relay-response" aria-live="polite">
              <Icon
                name={session === "调研 Agent" ? "Compass" : "Code"}
                size={23}
              />
              <div>
                <strong>
                  {t(
                    session,
                    session === "调研 Agent"
                      ? "Research Agent"
                      : "Coding Agent",
                  )}
                </strong>
                <p>
                  {session === "调研 Agent"
                    ? t(
                        "先调研使用场景，整理有来源的方案与实现边界。",
                        "First, research the use cases and map out sourced options and implementation boundaries.",
                      )
                    : t(
                        "接着读取项目、拆解实现步骤，把方案推进为可检验的代码。",
                        "Then read the project, break down the work, and turn the plan into code you can verify.",
                      )}
                </p>
                <span>
                  {t(
                    "消息与草稿保留 · 下一轮生效",
                    "Messages and drafts stay · Applies next turn",
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
        <p className="section-footnote">
          {t(
            "会话切换用于普通本地会话的空闲状态；伙伴、渠道等绑定会话遵循各自的 Agent 设定。此处按当前开发源码介绍新设计，发行版功能以版本说明为准。",
            "Agent switching is available while a regular local conversation is idle. Companion and channel conversations follow their bound Agent settings. This preview describes the current development source; check release notes for available features.",
          )}
        </p>
      </div>
    </section>
  );
}
