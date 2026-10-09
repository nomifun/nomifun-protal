"use client";
import { useId, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useLocale } from "@/components/i18n/LocaleProvider";
const questions = [
  [
    "桌面伙伴可以连接真实设备吗？",
    "可以通过小智云台，把兼容的 ESP32-S3 设备绑定到已有桌面伙伴，延续它的身份、知识与记忆，用声音、表情和云台动作回应。需要兼容硬件、固件配置、可信局域网配对，并保持 Desktop 运行；具体能力随板型、固件和模型配置而不同。",
    "Can my desktop companion connect to a physical device?",
    "With Xiaozhi Yuntai, bind a compatible ESP32-S3 device to an existing desktop companion and keep its identity, knowledge, and memory. It can respond through voice, expressions, and pan-tilt movement. Compatible hardware, configured firmware, pairing on a trusted local network, and a running Desktop are required. Capabilities vary by board, firmware, and model configuration.",
  ],
  [
    "开始使用，需要部署服务器吗？",
    "在电脑上安装 Desktop、配置你选择的模型即可开始。手机与机器人在可信局域网内可直接连接 Desktop，不需要额外业务服务器；跨网访问可按需自托管 Net Infra。",
    "Do I need to deploy a server?",
    "Install Desktop on your computer and configure a model of your choice. Phones and robots can connect directly on a trusted local network without an additional application server. For access across networks, you can self-host Net Infra as needed.",
  ],
  [
    "普通用户也能用吗？",
    "可以从预设 Agent 开始，用对话完成调研、内容创作与日常任务。能力工作台让你按需要启用模块；描述需求可以生成扩展，再通过预览和权限确认来启用。复杂场景仍需要调整和验证。",
    "Can I use it without a technical background?",
    "Start with a preset Agent and use conversation for research, content creation, and everyday tasks. Enable modules as you need them in the capability workbench. Describe an extension, preview the result, and review its permissions before enabling it. Complex use cases still need adjustment and verification.",
  ],
  [
    "我的数据会去哪里？",
    "会话、配置、记忆与知识默认保存在本地，产品没有遥测上报。你启用的模型、IM 渠道、网页和其他联网工具，会按照配置与对应服务通信。敏感操作仍需要对应的授权。",
    "Where does my data go?",
    "Conversations, settings, memory, and knowledge are stored locally by default, with no product telemetry. Models, messaging channels, web access, and other online tools you enable communicate with their services according to your configuration. Sensitive actions require the relevant permissions.",
  ],
  [
    "24 小时自动工作，需要哪些条件？",
    "电脑与应用需要保持运行，模型和相关服务可用，并启用对应能力。自动工作支持持续认领、执行和完成需求；新需求回环取决于 Agent 的指令与授权。遇到审批或错误时，流程可能等待或暂停。",
    "What does around-the-clock work require?",
    "Your computer and the app must stay running, models and related services must be available, and the required capabilities must be enabled. Autonomous work can continuously claim, execute, and complete requests. Generating new requests depends on the Agent's instructions and permissions. Approvals or errors may cause a wait or pause.",
  ],
  [
    "“无限记忆”和“低资源”意味着什么？",
    "记忆采用可持续记录、压缩与检索的设计，不受单次对话上下文长度直接限制；仍受本地存储与模型能力影响。Rust 原生底座与按需能力加载面向长期使用，具体资源占用取决于模型、任务和伙伴窗口数量。",
    "What do unlimited memory and low resource use mean?",
    "Memory is designed for continuous recording, compression, and retrieval beyond a single conversation's context window. Local storage and model capabilities still set practical limits. The native Rust foundation and on-demand capabilities are designed for long-term use; resource consumption depends on models, tasks, and the number of companion windows.",
  ],
  [
    "在哪里了解版本、参与贡献？",
    "下载页在每个操作系统选项内提供 CrabNebula（推荐）与 GitHub 下载按钮，并分别显示各自的版本和安装包。一个来源不可用时，可以使用另一个来源。两边发版可能有时间差，请以对应按钮显示的版本为准。项目页有独立的 GitHub 与 Gitee 源码入口；欢迎通过 GitHub Issue、代码与设计讨论参与。首页按当前源码介绍产品方向，具体可用功能以安装版本为准。",
    "Where can I find releases or contribute?",
    "Each operating system on the download page offers CrabNebula (recommended) and GitHub download buttons, with versions and packages shown separately for each source. If one source is unavailable, use the other. Releases may arrive at different times, so check the version shown with each button. Project pages have separate GitHub and Gitee source links. Join us through GitHub issues, code contributions, and design discussions. This homepage describes the current source; available features depend on the version you install.",
  ],
];
function Accordion({ q, a, i }) {
  const [open, setOpen] = useState(false),
    region = useRef(null),
    content = useRef(null),
    id = useId();
  useLayoutEffect(() => {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const target = region.current;
    const tween = gsap.to(target, {
      height: open ? content.current.scrollHeight : 0,
      autoAlpha: open ? 1 : 0,
      duration: reduced ? 0 : 0.4,
      ease: "power2.inOut",
      overwrite: true,
      onComplete: () => {
        if (open) gsap.set(target, { height: "auto" });
        window.dispatchEvent(new Event("portal:layout"));
      },
    });
    return () => tween.kill();
  }, [open, a]);
  return (
    <div className={`faq-item ${open ? "is-open" : ""}`}>
      <h3>
        <button
          aria-expanded={open}
          aria-controls={id}
          id={`${id}-button`}
          onClick={() => setOpen((v) => !v)}
        >
          <span>
            <small>0{i + 1}</small>
            {q}
          </span>
          <span className="faq-plus" aria-hidden="true" />
        </button>
      </h3>
      <div
        className="faq-region"
        ref={region}
        id={id}
        role="region"
        aria-labelledby={`${id}-button`}
        aria-hidden={!open}
        inert={!open}
      >
        <div className="faq-answer" ref={content}>
          <p>{a}</p>
        </div>
      </div>
    </div>
  );
}
export default function FaqSection() {
  const { locale, t } = useLocale();
  return (
    <section className="faq-section" data-locale={locale}>
      <div className="container faq-layout">
        <div data-motion-mask>
          <p className="eyebrow">A FEW THINGS TO KNOW</p>
          <h2 className="section-heading">
            {t("开始之前，", "Before you begin,")}
            <br />
            {t("你可能想知道。", "a few things to know.")}
          </h2>
          <p className="section-copy">
            {t("把选择权留给你，", "The choices are yours.")}
            <br />
            {t("也把边界讲清楚。", "The boundaries should be clear.")}
          </p>
        </div>
        <div className="faq-list">
          {questions.map(([q, a, qEn, aEn], i) => (
            <Accordion key={q} q={t(q, qEn)} a={t(a, aEn)} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
