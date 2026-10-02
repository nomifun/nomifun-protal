"use client";

import { useEffect, useState } from "react";
import Icon from "@/components/Icon";
import { useLocale } from "@/components/i18n/LocaleProvider";

const getExtensionPoints = (t) => [
  {
    id: "agent.tool",
    title: t("Agent 工具", "Agent tools"),
    short: t("工具", "Tools"),
    icon: "Wrench",
    body: t(
      "把专属操作交给 Agent。它知道何时调用，也能在会话中使用你的扩展。",
      "Give your Agent custom actions. It can choose when to use them and call your extensions in a conversation.",
    ),
  },
  {
    id: "agent.context",
    title: t("上下文补充", "Context enrichment"),
    short: t("上下文", "Context"),
    icon: "Stack",
    body: t(
      "在需要时补充背景、资料与业务上下文，让 Agent 更了解你的工作。",
      "Add background, resources, and business context when needed, so your Agent understands your work.",
    ),
  },
  {
    id: "agent.before_model",
    title: t("模型调用前", "Before model calls"),
    short: t("模型前", "Before model"),
    icon: "Sparkle",
    body: t(
      "在请求模型之前介入处理，定制输入与协作方式。",
      "Customize inputs and collaboration before a request reaches the model.",
    ),
  },
  {
    id: "agent.before_tool",
    title: t("工具执行前", "Before tool execution"),
    short: t("工具前", "Before tool"),
    icon: "ShieldCheck",
    body: t(
      "在工具动作执行前加入检查，让自动化遵循你的规则。",
      "Check tool actions before they execute, so automation follows your rules.",
    ),
  },
  {
    id: "desktop.command",
    title: t("桌面命令", "Desktop commands"),
    short: t("桌面命令", "Commands"),
    icon: "Command",
    body: t(
      "把日常动作变成可调用的桌面命令，减少重复操作。",
      "Turn everyday actions into callable desktop commands and reduce repetitive work.",
    ),
  },
  {
    id: "desktop.event",
    title: t("桌面事件", "Desktop events"),
    short: t("桌面事件", "Events"),
    icon: "Bell",
    body: t(
      "响应已注册的桌面事件，让后台能力在合适的时机出现。",
      "Respond to registered desktop events and bring background capabilities into action at the right time.",
    ),
  },
  {
    id: "automation.action",
    title: t("自动化动作", "Automation actions"),
    short: t("自动化", "Automation"),
    icon: "Lightning",
    body: t(
      "为自动工作流程提供动作，在持续任务中复用你的工具。",
      "Add actions to automated workflows and reuse your tools in ongoing tasks.",
    ),
  },
];

const getSteps = (t) => [
  {
    title: t("描述想法", "Describe"),
    label: "01 / IDEA",
    heading: t("你的需求，就是起点。", "Start with what you need."),
    body: t(
      "用自然语言说清楚想要什么，再和助手一起调整。",
      "Describe what you want in everyday language, then refine it with your assistant.",
    ),
    icon: "ChatText",
  },
  {
    title: t("可视化预览", "Preview"),
    label: "02 / PREVIEW",
    heading: t("让想法，先看得见。", "See your idea take shape."),
    body: t(
      "界面与后台能力使用同一种扩展包。先看预览，再决定如何使用。",
      "Interfaces and background services share one extension package. Preview it before deciding how to use it.",
    ),
    icon: "Eye",
  },
  {
    title: t("确认授权", "Authorize"),
    label: "03 / PERMISSION",
    heading: t("它能做什么，由你决定。", "You decide what it can do."),
    body: t(
      "查看扩展入口与所需权限，绑定配置和凭据，再启用。",
      "Review its entry points and permissions, bind settings and credentials, then enable it.",
    ),
    icon: "ShieldCheck",
  },
  {
    title: t("启用扩展", "Enable"),
    label: "04 / ENABLE",
    heading: t("加入你的日常工作。", "Make it part of your day."),
    body: t(
      "带界面的小程序，或按需、持续运行的服务，都能成为系统的一部分。",
      "Mini apps with an interface, on-demand services, and ongoing services can all become part of your system.",
    ),
    icon: "CheckCircle",
  },
];

function ExtensionPreview({ shape, stage, requirement }) {
  const { t } = useLocale();
  if (stage === 0) {
    return (
      <div className="extension-idea">
        <span className="extension-idea-icon">
          <Icon name="Sparkle" size={26} />
        </span>
        <span className="extension-idea-label">
          {t("从一句话开始", "Start with a sentence")}
        </span>
        <p>
          “
          {requirement ||
            t("做一个属于我的工作小工具", "Build a small tool for my work")}
          ”
        </p>
        <div className="extension-idea-reply">
          <i />
          {t(
            "一个统一扩展包，连接你的工作方式。",
            "One extension package, built around your work.",
          )}
        </div>
      </div>
    );
  }

  if (stage === 2) {
    return (
      <div className="extension-permission-preview">
        <span className="extension-preview-symbol">
          <Icon name="ShieldCheck" size={42} />
        </span>
        <h4>{t("先了解，再授权。", "Understand first. Then authorize.")}</h4>
        <div>
          <Icon name="Database" size={19} />
          <span>{t("独立的插件数据", "Isolated plugin data")}</span>
          <span className="extension-permission-tag">{t("本地", "Local")}</span>
        </div>
        <div>
          <Icon name="Key" size={19} />
          <span>{t("所需凭据由宿主管理", "Host-managed credentials")}</span>
          <span className="extension-permission-tag">
            {t("按需绑定", "Bind as needed")}
          </span>
        </div>
        <div>
          <Icon name="PlugsConnected" size={19} />
          <span>{t("只接入已注册的入口", "Registered entry points only")}</span>
          <span className="extension-permission-tag">
            {t("明确启用", "Explicit opt-in")}
          </span>
        </div>
      </div>
    );
  }

  if (shape === "ui") {
    return (
      <div className={`extension-miniapp ${stage === 3 ? "is-enabled" : ""}`}>
        <div className="extension-miniapp-bar">
          <span>
            <i />
            <i />
            <i />
          </span>
          <small>{t("我的专注工作台", "My focus workspace")}</small>
          <Icon name="DotsThree" size={22} />
        </div>
        <div className="extension-miniapp-content">
          <div className="extension-miniapp-title">
            <span>
              {t(
                "今天，也给想法一点空间。",
                "Make a little room for ideas today.",
              )}
            </span>
            <Icon name="Sun" size={25} />
          </div>
          <div className="extension-focus-ring">
            <span>
              25<small>MIN FOCUS</small>
            </span>
          </div>
          <div className="extension-miniapp-task">
            <Icon name="CheckCircle" size={19} />
            <span>
              {t(
                "整理项目里的下一个好点子",
                "Find the next good idea for your project",
              )}
            </span>
          </div>
          <div className="extension-miniapp-task">
            <span className="extension-task-dot" />
            <span>{t("留一点时间，专注创造", "Set aside time to create")}</span>
          </div>
        </div>
        {stage === 3 && (
          <span className="extension-enabled-badge">
            <Icon name="Check" size={14} />
            {t("示意：已启用", "Demo: enabled")}
          </span>
        )}
      </div>
    );
  }

  return (
    <div
      className={`extension-service-preview ${stage === 3 ? "is-enabled" : ""}`}
    >
      <span className="extension-service-orbit">
        <Icon name="Lightning" size={40} />
        <i />
        <i />
        <i />
      </span>
      <p>
        {t("没有界面。", "No interface needed.")}
        <br />
        <strong>{t("能力依然在场。", "Your tools are still at work.")}</strong>
      </p>
      <div className="extension-service-path">
        <span>{t("桌面事件", "Event")}</span>
        <Icon name="ArrowRight" size={16} />
        <span>{t("后台服务", "Service")}</span>
        <Icon name="ArrowRight" size={16} />
        <span>Agent</span>
      </div>
      <small>
        {stage === 3
          ? t(
              "示意：扩展已进入工作流程",
              "Demo: extension added to the workflow",
            )
          : t("按需唤起 / 持续运行", "On demand / Ongoing")}
      </small>
    </div>
  );
}

export default function ExtensionSection() {
  const { locale, t } = useLocale();
  const extensionPoints = getExtensionPoints(t);
  const steps = getSteps(t);
  const defaultRequirement = t(
    "为我做一个专注工作台，也让 Agent 能查看我的工作进度。",
    "Build me a focus workspace, and let my Agent check my progress.",
  );
  const [shape, setShape] = useState("ui");
  const [stage, setStage] = useState(1);
  const [requirement, setRequirement] = useState(defaultRequirement);
  useEffect(() => {
    // Translate the initial sample on a locale change without overwriting edits.
    setRequirement((current) =>
      [
        "为我做一个专注工作台，也让 Agent 能查看我的工作进度。",
        "Build me a focus workspace, and let my Agent check my progress.",
      ].includes(current)
        ? defaultRequirement
        : current,
    );
  }, [locale, defaultRequirement]);
  const [selectedPoint, setSelectedPoint] = useState(0);
  const [grantedPoints, setGrantedPoints] = useState(["agent.tool"]);
  const point = extensionPoints[selectedPoint];
  const step = steps[stage];
  const allowed = grantedPoints.includes(point.id);

  const togglePoint = () =>
    setGrantedPoints((current) =>
      current.includes(point.id)
        ? current.filter((id) => id !== point.id)
        : [...current, point.id],
    );

  return (
    <section
      id="extend"
      className="extension-section platform-section"
      aria-labelledby="extension-heading"
    >
      <div className="container">
        <div className="extension-intro">
          <p className="eyebrow">
            MAKE IT YOURS{" "}
            <span>{t("小程序与无头插件", "MINI APPS & HEADLESS PLUGINS")}</span>
          </p>
          <div className="extension-heading-row">
            <h2 className="section-heading" id="extension-heading">
              {t("你的想法，", "Your ideas,")}
              <br />
              {t("可以成为", "made into ")}
              <span className="platform-serif">
                {t("一种能力。", "capabilities.")}
              </span>
            </h2>
            <p>
              {t(
                "用自然语言创建，再可视化预览。半托管的小程序与无头服务，让专属工具、后台能力和自动化，按你的方式生长。",
                "Create in natural language and preview visually. Semi-managed mini apps and headless services let your tools, background capabilities, and automation grow with your needs.",
              )}
            </p>
          </div>
        </div>

        <div className="extension-workbench">
          <div className="extension-controls">
            <div className="platform-demo-label">
              <span />
              {t("交互示意", "INTERACTIVE DEMO")}
            </div>
            <p className="extension-step-label">{step.label}</p>
            <h3>{step.heading}</h3>
            <p className="extension-step-description">{step.body}</p>
            <label className="extension-prompt-label" htmlFor="extension-idea">
              {t("试着描述你的扩展", "Describe your extension")}
            </label>
            <textarea
              id="extension-idea"
              value={requirement}
              onChange={(event) => setRequirement(event.target.value)}
              maxLength={120}
              rows={3}
            />
            <div
              className="extension-shape-switch"
              role="group"
              aria-label={t("选择扩展形态", "Choose an extension type")}
            >
              <button
                type="button"
                aria-pressed={shape === "ui"}
                onClick={() => setShape("ui")}
              >
                <Icon name="Browser" size={18} />
                {t("带界面小程序", "Mini app with UI")}
              </button>
              <button
                type="button"
                aria-pressed={shape === "headless"}
                onClick={() => setShape("headless")}
              >
                <Icon name="Lightning" size={18} />
                {t("无头后台服务", "Headless service")}
              </button>
            </div>
            <button
              type="button"
              className="extension-next"
              onClick={() =>
                setStage((current) => (current + 1) % steps.length)
              }
            >
              {stage === 3
                ? t("重新体验", "Start again")
                : t(
                    `看看${steps[stage + 1].title}`,
                    `Next: ${steps[stage + 1].title}`,
                  )}
              <Icon name="ArrowUpRight" size={20} />
            </button>
            <p className="platform-demo-note">
              {t(
                "此体验不会创建或运行真实插件。",
                "This demo does not create or run real plugins.",
              )}
            </p>
          </div>

          <div className="extension-stage">
            <div className="extension-package-header">
              <Icon name="Package" size={19} />
              <span>ONE PACKAGE. MANY POSSIBILITIES.</span>
              <span className="extension-package-dot" />
            </div>
            <div
              className="extension-preview-area"
              aria-live="polite"
              key={`${shape}-${stage}`}
            >
              <ExtensionPreview
                shape={shape}
                stage={stage}
                requirement={requirement}
              />
            </div>
            <div className="extension-package-parts">
              <span className={shape === "ui" ? "is-active" : ""}>UI</span>
              <span className={shape === "headless" ? "is-active" : ""}>
                Service
              </span>
              <span>Action</span>
              <span>Binding</span>
            </div>
          </div>
        </div>

        <div
          className="extension-steps"
          role="group"
          aria-label={t(
            "选择扩展体验步骤",
            "Choose a step in the extension demo",
          )}
        >
          {steps.map((item, index) => (
            <button
              type="button"
              key={item.title}
              aria-pressed={stage === index}
              onClick={() => setStage(index)}
            >
              <span>0{index + 1}</span>
              <Icon name={item.icon} size={20} />
              <strong>{item.title}</strong>
              <Icon name="ArrowRight" size={17} />
            </button>
          ))}
        </div>

        <div className="extension-binding-area">
          <div className="extension-binding-heading">
            <span className="extension-binding-number">7</span>
            <div>
              <h3>
                {t("个入口，接入真正的工作。", "entry points into real work.")}
              </h3>
              <p>
                {t(
                  "从对话到桌面，从工具到自动化。选择一个入口，看看扩展如何参与。",
                  "From chat to desktop, tools to automation. Choose an entry point to see where your extension can contribute.",
                )}
              </p>
            </div>
          </div>
          <div className="extension-binding-layout">
            <div
              className="extension-binding-points"
              role="group"
              aria-label={t(
                "探索七种插件扩展入口",
                "Explore seven plugin entry points",
              )}
            >
              {extensionPoints.map((item, index) => (
                <button
                  type="button"
                  key={item.id}
                  aria-pressed={selectedPoint === index}
                  onClick={() => setSelectedPoint(index)}
                >
                  <Icon name={item.icon} size={18} />
                  {item.short}
                  <span
                    className={
                      grantedPoints.includes(item.id) ? "is-granted" : ""
                    }
                  />
                </button>
              ))}
            </div>
            <div className="extension-binding-detail" aria-live="polite">
              <div>
                <p className="extension-binding-code">{point.id}</p>
                <h4>{point.title}</h4>
                <p>{point.body}</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={allowed}
                onClick={togglePoint}
                aria-label={t(
                  `${allowed ? "关闭" : "打开"}${point.title}接入示意`,
                  `${allowed ? "Disable" : "Enable"} ${point.title} connection demo`,
                )}
              >
                <span className={`extension-toggle ${allowed ? "is-on" : ""}`}>
                  <i />
                </span>
                <span>
                  {allowed
                    ? t("已接入 · 示意", "Connected · Demo")
                    : t("点击接入 · 示意", "Connect · Demo")}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
