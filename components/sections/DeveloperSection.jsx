"use client";

import { useEffect, useId, useRef, useState } from "react";
import Icon from "@/components/Icon";
import { links } from "@/lib/site";
import { initLiquidStage } from "@/lib/behaviors/liquid-stage";
import { useLocale } from "@/components/i18n/LocaleProvider";

const getPerspectives = (t) => [
  {
    id: "models",
    title: t("模型与协议", "Models & protocols"),
    icon: "PlugsConnected",
    kicker: "THE RIGHT MODEL FOR THE RIGHT TASK",
    heading: t("让模型各展所长。", "Let every model do its best work."),
    description: t(
      "模型、协议与任务分开配置。对话、图像、视频、语音和检索，各自连接适合的供应商，也为新协议留出扩展接口。",
      "Configure tasks, models and protocols separately. Connect chat, images, video, audio and retrieval to the right providers, with room to add new protocols.",
    ),
    note: t(
      "实际可用能力取决于已接入协议、模型与供应商配置。",
      "Available capabilities depend on the connected protocols, models and provider settings.",
    ),
  },
  {
    id: "collaboration",
    title: t("多 Agent 协作", "Agent teams"),
    icon: "GitBranch",
    kicker: "ONE GOAL. A TEAM OF AGENTS.",
    heading: t("一个目标，分工推进。", "One goal. A team to move it forward."),
    description: t(
      "让 Agent 即时规划任务依赖，或直接并行委派独立工作。每一步有自己的职责与状态，结果最终汇入完整交付。",
      "Let agents plan task dependencies as they work, or delegate independent jobs in parallel. Each step has a clear role and status; the results come together in one delivery.",
    ),
    note: t(
      "支持规划与并行委派；运行受模型可用性、授权和资源配置约束。",
      "Planning and parallel delegation require available models, permissions and sufficient resources.",
    ),
  },
  {
    id: "action",
    title: t("浏览器与电脑", "Browser & computer"),
    icon: "Cursor",
    kicker: "BEYOND THE CHAT WINDOW",
    heading: t("看懂，也能行动。", "Understand the screen. Take action."),
    description: t(
      "自研 Browser Use 与 Computer Use，把页面、窗口和输入连接到 Agent。在系统与能力授权下，让数字世界成为可操作的工作现场。",
      "Our Browser Use and Computer Use connect agents to pages, windows and input. With system and capability permissions, the digital workspace becomes a place to act.",
    ),
    note: t(
      "原生浏览器与电脑操作面向 Windows / macOS；需系统权限与 Agent 授权。",
      "Native browser and computer control targets Windows / macOS and requires system permissions and agent authorization.",
    ),
  },
  {
    id: "runtime",
    title: t("开放的内核", "Open runtime"),
    icon: "Code",
    kicker: "CLEAR BOUNDARIES. OPEN POSSIBILITIES.",
    heading: t(
      "开放架构，清楚的职责。",
      "Open architecture. Clear responsibilities.",
    ),
    description: t(
      "执行循环、模型连接、能力调用与宿主权限分别承担职责。Rust + Tauri 的本地架构，配合按需能力与有界资源设计，让扩展有清楚的入口。",
      "Execution loops, model connections, capabilities and host permissions each have their own role. A local Rust + Tauri foundation, on-demand capabilities and bounded resources provide clear extension points.",
    ),
    note: t(
      "原生底座与按需能力，面向长期使用。资源占用随模型、任务与伙伴窗口数量变化。",
      "A native foundation and on-demand capabilities are designed for everyday use. Resource use varies with models, tasks and the number of companion windows.",
    ),
  },
];

const getModelTasks = (t) => [
  {
    name: t("对话", "Chat"),
    icon: "ChatText",
    model: "Chat model",
    protocol: "OpenAI / Responses / Anthropic / Gemini",
    verb: t("理解 · 推理 · 协作", "Understand · Reason · Collaborate"),
  },
  {
    name: t("图像", "Image"),
    icon: "Image",
    model: "Image model",
    protocol: t("图像生成与编辑适配器", "Image generation & editing adapters"),
    verb: t("生成 · 编辑 · 迭代", "Generate · Edit · Iterate"),
  },
  {
    name: t("视频", "Video"),
    icon: "FilmStrip",
    model: "Video model",
    protocol: t("视频生成适配器", "Video generation adapters"),
    verb: t("描述 · 生成 · 查询进度", "Describe · Generate · Track progress"),
  },
  {
    name: t("音频", "Audio"),
    icon: "Waveform",
    model: "Audio model",
    protocol: t("语音与音乐适配器", "Speech & music adapters"),
    verb: t("声音 · 语音 · 音乐", "Sound · Speech · Music"),
  },
  {
    name: t("检索", "Search"),
    icon: "MagnifyingGlass",
    model: "Retrieval model",
    protocol: "Embedding / Rerank",
    verb: t("关联 · 搜索 · 排序", "Connect · Search · Rank"),
  },
];

const getActionSteps = (t) => ({
  browser: [
    {
      title: t("观察页面", "Observe"),
      text: t("理解页面元素与标签页状态", "Read page elements and tab state"),
      icon: "Eye",
    },
    {
      title: t("原生输入", "Interact"),
      text: t("按授权进行点击与键盘操作", "Click and type with permission"),
      icon: "CursorClick",
    },
    {
      title: t("复核结果", "Verify"),
      text: t("读取新状态，推进下一步", "Read the new state, then continue"),
      icon: "CheckCircle",
    },
  ],
  computer: [
    {
      title: t("观察桌面", "Observe"),
      text: t("语义树与屏幕感知", "Accessibility trees and screen perception"),
      icon: "Desktop",
    },
    {
      title: t("执行动作", "Act"),
      text: t("操作窗口、鼠标与键盘", "Control windows, mouse and keyboard"),
      icon: "CursorClick",
    },
    {
      title: t("复核结果", "Verify"),
      text: t(
        "检查动作后的实际状态",
        "Check the actual state after each action",
      ),
      icon: "CheckCircle",
    },
  ],
});

function ModelDiagram() {
  const { t } = useLocale();
  const modelTasks = getModelTasks(t);
  const [task, setTask] = useState(0);
  const current = modelTasks[task];
  return (
    <div className="developer-model-diagram">
      <div
        className="developer-task-list"
        role="group"
        aria-label={t("探索模型任务路由", "Explore model routing by task")}
      >
        {modelTasks.map((item, index) => (
          <button
            type="button"
            key={item.name}
            aria-pressed={task === index}
            onClick={() => setTask(index)}
          >
            <Icon name={item.icon} size={20} />
            {item.name}
            <Icon name="ArrowRight" size={16} />
          </button>
        ))}
      </div>
      <div className="developer-route-line">
        <i />
        <i />
        <i />
        <span />
      </div>
      <div className="developer-model-endpoint" aria-live="polite">
        <span className="developer-endpoint-symbol">
          <Icon name={current.icon} size={36} />
        </span>
        <p>{current.model}</p>
        <span>{current.verb}</span>
        <div>
          <small>PROTOCOL ADAPTER</small>
          <strong>{current.protocol}</strong>
        </div>
      </div>
      <div className="developer-diagram-caption">
        <Icon name="PlugsConnected" size={15} />
        {t("任务 → 模型 → 协议", "Task → Model → Protocol")}
      </div>
    </div>
  );
}

function CollaborationDiagram() {
  const { t } = useLocale();
  const [strategy, setStrategy] = useState("planned");
  const [selected, setSelected] = useState(0);
  const tasks =
    strategy === "planned"
      ? [
          t("研究背景", "Research"),
          t("制定方案", "Plan"),
          t("实现与验证", "Build & verify"),
        ]
      : [
          t("调研 Agent", "Research agents"),
          t("编写界面", "Build the UI"),
          t("核验内容", "Check content"),
        ];
  return (
    <div className="developer-collaboration-diagram">
      <div
        className="developer-diagram-switch"
        role="group"
        aria-label={t(
          "选择 Agent 协作模式",
          "Choose an agent collaboration mode",
        )}
      >
        <button
          type="button"
          aria-pressed={strategy === "planned"}
          onClick={() => {
            setStrategy("planned");
            setSelected(0);
          }}
        >
          {t("自动规划", "Plan tasks")}
        </button>
        <button
          type="button"
          aria-pressed={strategy === "parallel"}
          onClick={() => {
            setStrategy("parallel");
            setSelected(0);
          }}
        >
          {t("并行委派", "Delegate in parallel")}
        </button>
      </div>
      <div className="developer-dag-goal">
        <Icon name="Flag" size={20} />
        <span>
          {t("把一个想法，变成完整交付", "Take an idea through to delivery")}
        </span>
        <small>GOAL</small>
      </div>
      <div className={`developer-dag ${strategy}`}>
        <svg
          className="developer-dag-lines"
          viewBox="0 0 600 220"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {strategy === "planned" ? (
            <>
              <path d="M100 100 H500" />
              <path d="M500 100 V190 H300" />
            </>
          ) : (
            <>
              <path d="M300 0 V40 M100 90 V40 H500 V90 M300 40 V90" />
              <path d="M100 135 V175 H500 V135 M300 135 V220" />
            </>
          )}
        </svg>
        <div
          className="developer-dag-tasks"
          role="group"
          aria-label={t("查看分工职责", "Explore each agent's role")}
        >
          {tasks.map((item, index) => (
            <button
              type="button"
              key={item}
              aria-pressed={selected === index}
              onClick={() => setSelected(index)}
            >
              <span className="developer-agent-symbol">
                <Icon
                  name={["MagnifyingGlass", "PenNib", "Code"][index]}
                  size={24}
                />
              </span>
              <small>AGENT 0{index + 1}</small>
              <strong>{item}</strong>
              <i />
            </button>
          ))}
        </div>
      </div>
      <div className="developer-dag-delivery">
        <Icon name="Package" size={24} />
        <span>
          {t("汇总结果", "Bring results together")}{" "}
          <small>
            {t("有依赖、有状态、有交付", "Dependencies · Status · Delivery")}
          </small>
        </span>
        <Icon name="Check" size={19} />
      </div>
      <p className="developer-dag-status" aria-live="polite">
        <span />
        {tasks[selected]} ·{" "}
        {strategy === "planned"
          ? t("按规划依赖推进", "Following task dependencies")
          : t("独立工作，结果汇总", "Independent work, shared results")}
      </p>
    </div>
  );
}

function ActionDiagram() {
  const { t } = useLocale();
  const actionSteps = getActionSteps(t);
  const [track, setTrack] = useState("browser");
  const [selected, setSelected] = useState(0);
  const current = actionSteps[track][selected];
  return (
    <div className="developer-action-diagram">
      <div
        className="developer-diagram-switch"
        role="group"
        aria-label={t("选择数字行动轨道", "Choose browser or computer control")}
      >
        <button
          type="button"
          aria-pressed={track === "browser"}
          onClick={() => {
            setTrack("browser");
            setSelected(0);
          }}
        >
          Browser Use
        </button>
        <button
          type="button"
          aria-pressed={track === "computer"}
          onClick={() => {
            setTrack("computer");
            setSelected(0);
          }}
        >
          Computer Use
        </button>
      </div>
      <div className={`developer-action-window ${track}`}>
        <div className="developer-window-bar">
          <i />
          <i />
          <i />
          <span>
            {track === "browser"
              ? t("Agent 的浏览器工作现场", "Agent browser workspace")
              : t("Agent 的桌面工作现场", "Agent desktop workspace")}
          </span>
          <Icon name="ShieldCheck" size={15} />
        </div>
        <div className="developer-window-body">
          <div className="developer-window-sidebar">
            <span />
            <span />
            <span />
            <span />
          </div>
          <div className="developer-window-content">
            <span className="developer-window-title" />
            <div className="developer-window-blocks">
              <i />
              <i />
              <i />
            </div>
            <span className="developer-window-text" />
            <span className="developer-window-text short" />
            <div className={`developer-window-focus step-${selected}`} />
            <span className={`developer-window-cursor step-${selected}`}>
              <Icon name="Cursor" size={29} />
            </span>
          </div>
        </div>
        <div className="developer-action-overlay" aria-live="polite">
          <Icon name={current.icon} size={22} />
          <span>
            <strong>{current.title}</strong>
            <small>{current.text}</small>
          </span>
        </div>
      </div>
      <div
        className="developer-action-steps"
        role="group"
        aria-label={t("探索行动过程", "Explore the action steps")}
      >
        {actionSteps[track].map((item, index) => (
          <button
            type="button"
            key={item.title}
            aria-pressed={selected === index}
            onClick={() => setSelected(index)}
          >
            <span>0{index + 1}</span>
            {item.title}
            {index < 2 && <Icon name="ArrowRight" size={13} />}
          </button>
        ))}
      </div>
    </div>
  );
}

function RuntimeDiagram() {
  const { t } = useLocale();
  const [selected, setSelected] = useState(1);
  const layers = [
    {
      name: t("产品与界面", "Product & UI"),
      detail: t(
        "会话、伙伴、创作、自动工作",
        "Sessions, companions, creation and automatic work",
      ),
      icon: "Desktop",
    },
    {
      name: "Agent Runtime",
      detail: t(
        "执行循环、上下文与事件",
        "Execution loops, context and events",
      ),
      icon: "Cpu",
    },
    {
      name: t("能力与插件", "Capabilities & plugins"),
      detail: t(
        "模块组合、Action 与 Binding",
        "Composable modules, Actions and Bindings",
      ),
      icon: "PuzzlePiece",
    },
    {
      name: t("本地宿主", "Local host"),
      detail: t(
        "数据、权限、进程与系统连接",
        "Data, permissions, processes and system connections",
      ),
      icon: "ShieldCheck",
    },
  ];
  return (
    <div className="developer-runtime-diagram">
      <div
        className="developer-runtime-layers"
        role="group"
        aria-label={t(
          "探索开放架构层次",
          "Explore the layers of the open architecture",
        )}
      >
        {layers.map((layer, index) => (
          <button
            type="button"
            key={layer.name}
            aria-pressed={selected === index}
            onClick={() => setSelected(index)}
          >
            <span>0{index + 1}</span>
            <Icon name={layer.icon} size={22} />
            <strong>{layer.name}</strong>
            <Icon name="ArrowUpRight" size={18} />
          </button>
        ))}
      </div>
      <div className="developer-runtime-description" aria-live="polite">
        <span className="developer-runtime-ring">
          <Icon name={layers[selected].icon} size={38} />
        </span>
        <h4>{layers[selected].name}</h4>
        <p>{layers[selected].detail}</p>
        <div>
          <Icon name="GitBranch" size={17} />
          {t(
            "清楚的接口。可组合的实现。",
            "Clear interfaces. Composable building blocks.",
          )}
        </div>
      </div>
      <div className="developer-diagram-caption">
        <span className="developer-local-dot" />
        RUST + TAURI · LOCAL FIRST
      </div>
    </div>
  );
}

export default function DeveloperSection() {
  const { t } = useLocale();
  const perspectives = getPerspectives(t);
  const [selected, setSelected] = useState(0);
  const [readable, setReadable] = useState(false);
  const trackRef = useRef(null);
  const stageControl = useRef(null);
  const filterId = `developer-goo-${useId().replace(/:/g, "")}`;
  const diagrams = [
    ModelDiagram,
    CollaborationDiagram,
    ActionDiagram,
    RuntimeDiagram,
  ];
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let destroy = () => {};
    const configure = () => {
      destroy();
      setReadable(media.matches);
      const controller = initLiquidStage(trackRef.current, {
        count: perspectives.length,
        reduced: media.matches,
        onSelect: setSelected,
      });
      stageControl.current = controller;
      destroy = controller.destroy;
    };
    configure();
    media.addEventListener("change", configure);
    return () => {
      media.removeEventListener("change", configure);
      destroy();
      stageControl.current = null;
    };
  }, []);

  const selectPerspective = (index) => stageControl.current?.goTo(index);

  return (
    <section
      id="developers"
      className="developer-section platform-section"
      aria-labelledby="developer-heading"
    >
      <div className="container">
        <div className="developer-intro">
          <p className="eyebrow">
            BUILT TO BE OPEN{" "}
            <span>
              {t(
                "为开发者，也为每个创造者",
                "For developers. For every creator.",
              )}
            </span>
          </p>
          <h2 className="section-heading" id="developer-heading">
            {t("强大的背后，", "Powerful by nature.")}
            <br />
            <span className="platform-serif">
              {t("有一套开放的设计。", "Open by design.")}
            </span>
          </h2>
          <p>
            {t(
              "从一条对话，到一支 Agent 团队。认识 NomiFun 如何连接模型、能力与真实行动。",
              "From a single conversation to an agent team. See how NomiFun connects models, capabilities and real action.",
            )}
          </p>
        </div>
      </div>
      <div
        className="developer-liquid-track"
        ref={trackRef}
        data-motion="liquid-stage"
      >
        <div className="developer-liquid-stage" data-liquid-stage>
          <div className="developer-liquid-mesh" aria-hidden="true">
            <svg
              data-liquid-mesh
              width="5200"
              height="900"
              viewBox="0 0 5200 900"
              preserveAspectRatio="none"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="1300" height="900" fill="#ffe5dc" />
              <rect x="1300" width="1300" height="900" fill="#eee2ff" />
              <rect x="2600" width="1300" height="900" fill="#dde9ff" />
              <rect x="3900" width="1300" height="900" fill="#ffe3ee" />
              <circle cx="830" cy="250" r="420" fill="#ff755b" />
              <circle cx="270" cy="660" r="430" fill="#ffbd70" />
              <circle cx="1060" cy="790" r="350" fill="#ed7650" />
              <circle cx="1800" cy="230" r="480" fill="#b06dfa" />
              <circle cx="2360" cy="630" r="450" fill="#ec8af7" />
              <circle cx="1580" cy="800" r="330" fill="#c4adff" />
              <circle cx="3410" cy="200" r="480" fill="#5a77f4" />
              <circle cx="2900" cy="640" r="440" fill="#62bef8" />
              <circle cx="3670" cy="770" r="370" fill="#697ce5" />
              <circle cx="4470" cy="180" r="460" fill="#f773a5" />
              <circle cx="4970" cy="630" r="450" fill="#f69991" />
              <circle cx="4210" cy="750" r="360" fill="#dd669f" />
            </svg>
          </div>
          <svg className="developer-liquid-filter" aria-hidden="true">
            <defs>
              <filter
                id={filterId}
                x="-30%"
                y="-50%"
                width="160%"
                height="300%"
              >
                <feGaussianBlur
                  in="SourceGraphic"
                  stdDeviation="2"
                  result="blur"
                />
                <feColorMatrix
                  in="blur"
                  type="matrix"
                  values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10"
                />
              </filter>
            </defs>
          </svg>
          <div className="developer-liquid-stage-top">
            <span className="developer-liquid-index" aria-hidden="true">
              OPEN BY DESIGN <i>{String(selected + 1).padStart(2, "0")} / 04</i>
            </span>
            <div
              className="developer-perspectives developer-liquid-tabs"
              role="tablist"
              aria-label={t(
                "探索 NomiFun 技术设计",
                "Explore NomiFun's technical design",
              )}
            >
              <span
                className="developer-liquid-droplet"
                data-liquid-indicator
                aria-hidden="true"
              >
                <span
                  className="developer-liquid-goo"
                  style={{ filter: `url(#${filterId})` }}
                >
                  <span className="developer-liquid-pill" />
                  <svg
                    className="developer-liquid-bridge"
                    viewBox="0 0 44 16"
                    preserveAspectRatio="none"
                    fill="currentColor"
                  >
                    <path d="M35 0C35 0 28 1.5 28 8C28 14.5 44 16 44 16L0 16C0 16 16 14.5 16 8C16 1.5 9 0 9 0L35 0Z" />
                  </svg>
                  <span className="developer-liquid-landing" />
                </span>
              </span>
              {perspectives.map((item, index) => (
                <button
                  type="button"
                  role="tab"
                  id={`developer-tab-${item.id}`}
                  data-liquid-tab
                  key={item.id}
                  aria-selected={selected === index}
                  aria-pressed={selected === index}
                  aria-controls={`developer-panel-${item.id}`}
                  tabIndex={selected === index ? 0 : -1}
                  onClick={() => selectPerspective(index)}
                  onKeyDown={(event) => {
                    const next =
                      event.key === "ArrowRight"
                        ? (index + 1) % perspectives.length
                        : event.key === "ArrowLeft"
                          ? (index + perspectives.length - 1) %
                            perspectives.length
                          : event.key === "Home"
                            ? 0
                            : event.key === "End"
                              ? perspectives.length - 1
                              : null;
                    if (next === null) return;
                    event.preventDefault();
                    selectPerspective(next);
                    trackRef.current
                      ?.querySelectorAll("[data-liquid-tab]")
                      [next]?.focus();
                  }}
                >
                  <Icon name={item.icon} size={19} />
                  <span>{item.title}</span>
                  <small>0{index + 1}</small>
                </button>
              ))}
            </div>
          </div>
          <div className="developer-liquid-panels">
            {perspectives.map((item, index) => {
              const Diagram = diagrams[index];
              const active = index === selected;
              return (
                <div
                  key={item.id}
                  id={`developer-panel-${item.id}`}
                  role="tabpanel"
                  aria-labelledby={`developer-tab-${item.id}`}
                  aria-hidden={readable ? undefined : !active}
                  inert={readable || active ? undefined : true}
                  tabIndex={0}
                  data-liquid-panel
                  className={`developer-workbench developer-liquid-panel is-${item.id} ${active ? "is-active" : ""}`}
                >
                  <div className="developer-workbench-copy">
                    <p className="developer-kicker">{item.kicker}</p>
                    <h3>{item.heading}</h3>
                    <p>{item.description}</p>
                    <a
                      className="developer-source-link"
                      href={links.github}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {t("到源码里探索", "Explore the source")}{" "}
                      <Icon name="ArrowUpRight" size={18} />
                    </a>
                    <div className="developer-scope-note">
                      <Icon name="Info" size={16} />
                      <span>{item.note}</span>
                    </div>
                  </div>
                  <div className="developer-workbench-visual">
                    <div className="platform-demo-label">
                      <span />
                      {t("架构与交互示意", "Interactive architecture demo")}
                    </div>
                    <Diagram />
                    <p className="platform-demo-note">
                      {t(
                        "用于理解设计，不代表真实模型或任务正在运行。",
                        "A design demonstration; no live models or tasks are running.",
                      )}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="developer-liquid-stage-bottom" aria-hidden="true">
            <span>
              {t(
                "模型 · 协作 · 行动 · 内核",
                "Models · Teams · Action · Runtime",
              )}
            </span>
            <span>
              {t(
                "继续滚动，探索下一种视角",
                "Scroll to explore another perspective",
              )}{" "}
              <Icon name="ArrowDown" size={15} />
            </span>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="developer-local-manifesto">
          <div>
            <span className="developer-manifesto-icon">
              <Icon name="LockSimple" size={31} />
            </span>
            <h3>
              {t("你的电脑。", "Your computer.")}
              <br />
              <span>{t("你的数据与工作。", "Your data. Your work.")}</span>
            </h3>
          </div>
          <div>
            <p>
              {t(
                "本地优先，代码开源，无产品遥测。模型、IM 与联网工具，按你的配置连接外部服务。",
                "Local first. Open source. No product telemetry. Models, IM channels and online tools connect to external services according to your settings.",
              )}
            </p>
            <a href={links.github} target="_blank" rel="noreferrer">
              {t(
                "开放代码，欢迎一起检验",
                "Open code. Come explore it with us.",
              )}
              <Icon name="ArrowUpRight" size={17} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
