"use client";
import Link from "@/components/i18n/LocaleLink";
import { useLocale } from "@/components/i18n/LocaleProvider";
import Icon from "@/components/Icon";
export default function StorySection() {
  const { locale, t } = useLocale();
  return (
    <section className="story-section" id="story" data-locale={locale}>
      <div className="container">
        <div className="story-intro" data-reveal>
          <p className="eyebrow">A PERSONAL IDEA. AN OPEN FUTURE.</p>
          <h2>
            {t("起点，是一个人的想象。", "One person's idea.")}
            <br />
            {t("未来，是每个人的可能。", "A future we can all shape.")}
          </h2>
          <p>
            {t(
              "2025 年 10 月，NomiFun 从个人开发的机器人大脑与 Coding 增强系统出发。",
              "In October 2025, NomiFun began as one developer's robot brain and coding enhancement system. ",
            )}
            <br />
            {t(
              "从让机器“听懂”，到让 Agent 真正拥有记忆、能力与行动，探索一直在继续。",
              "From helping machines understand to giving Agents memory, capabilities, and action, the exploration continues.",
            )}
          </p>
          <Link href="/blog/nomifun-origin-story" className="story-link">
            {t("读读它诞生的故事", "Read the origin story")}
            <Icon name="ArrowUpRight" size={19} />
          </Link>
        </div>
        <div className="story-timeline" data-reveal>
          <article>
            <span>2025.10</span>
            <div className="timeline-marker" />
            <h3>{t("从机器人的大脑出发", "Starting with a robot brain")}</h3>
            <p>
              {t(
                "个人开发开始。把编程增强、智能对话与物理世界连接起来。",
                "Solo development begins, connecting coding tools and intelligent conversation to the physical world.",
              )}
            </p>
          </article>
          <article>
            <span>2025 Q4 — 2026 Q1</span>
            <div className="timeline-marker" />
            <h3>{t("让想法持续落地", "Bringing ideas into the product")}</h3>
            <p>
              {t(
                "IDMM 旁路决策、需求与自动工作回环、机器人远程连接、伙伴 Agent 和知识库，逐步走入产品。",
                "IDMM sidecar decisions, requests and autonomous work loops, remote robots, companion Agents, and knowledge bases arrive in the product.",
              )}
            </p>
          </article>
          <article>
            <span>NOW & BEYOND</span>
            <div className="timeline-marker" />
            <h3>
              {t(
                "从助手，走向开放的能力系统",
                "An open system of capabilities",
              )}
            </h3>
            <p>
              {t(
                "可组合 Agent、统一插件内核与多模态工作空间，让更多场景由用户和开发者共同创造。",
                "Composable Agents, a unified plugin core, and a multimodal workspace open up possibilities for users and developers to build together.",
              )}
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
