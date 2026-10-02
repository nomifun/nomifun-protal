"use client";

import { useState } from "react";
import Link from "@/components/i18n/LocaleLink";
import { useLocale } from "@/components/i18n/LocaleProvider";
import Icon from "@/components/Icon";

export default function BlogList({ posts }) {
  const { t } = useLocale();
  const [filter, setFilter] = useState("全部");
  const filters = [
    { key: "全部", label: t("全部", "All") },
    { key: "设计与实现", label: t("设计与实现", "Design & engineering") },
    { key: "项目故事", label: t("项目故事", "Project stories") },
  ];
  const visible = posts.filter(
    (post) =>
      filter === "全部" ||
      (filter === "设计与实现"
        ? post.kind !== "origin"
        : post.kind === "origin"),
  );
  return (
    <section className="blog-list container">
      <div
        className="blog-filter"
        role="group"
        aria-label={t("筛选博客文章", "Filter journal articles")}
      >
        {filters.map(({ key, label }) => (
          <button
            key={key}
            aria-pressed={filter === key}
            className={filter === key ? "active" : ""}
            onClick={() => setFilter(key)}
          >
            {label}
          </button>
        ))}
        <span aria-live="polite">
          {t(
            `${visible.length} 篇文章`,
            `${visible.length} ${visible.length === 1 ? "article" : "articles"}`,
          )}
        </span>
      </div>
      <div className="blog-grid">
        {visible.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className={`blog-card blog-card-${post.kind === "origin" ? "origin" : post.slug === "composable-agents" ? "agent" : "local"}`}
          >
            <div className="blog-art" aria-hidden="true">
              {post.kind === "origin" ? (
                <>
                  <span className="blog-orbit" />
                  <span className="blog-seed">N.</span>
                  <small>FROM A SMALL IDEA</small>
                </>
              ) : post.slug === "composable-agents" ? (
                <>
                  <span className="blog-module module-one">Skill</span>
                  <span className="blog-module module-two">Model</span>
                  <span className="blog-module module-three">Agent</span>
                  <span className="blog-module module-four">Knowledge</span>
                  <small>COMPOSE YOUR OWN</small>
                </>
              ) : (
                <>
                  <span className="blog-local-core">
                    <Icon name="Desktop" size={44} />
                  </span>
                  <span className="blog-local-surface surface-phone">
                    <Icon name="DeviceMobile" size={28} />
                  </span>
                  <span className="blog-local-surface surface-robot">
                    <Icon name="Robot" size={28} />
                  </span>
                  <span className="blog-local-line" />
                  <small>ONE LOCAL HUB</small>
                </>
              )}
            </div>
            <div className="blog-card-body">
              <div className="blog-card-meta">
                <span>{post.category}</span>
                <time dateTime={post.publishedAt}>{post.formattedDate}</time>
              </div>
              <h2>{post.title}</h2>
              <p>{post.description}</p>
              <div className="blog-card-bottom">
                <span>
                  {t(
                    `${post.readingTime || "5 分钟"}阅读`,
                    `${post.readingTime || "5 min"} read`,
                  )}
                </span>
                <Icon name="ArrowUpRight" size={24} />
              </div>
            </div>
          </Link>
        ))}
      </div>
      <p className="blog-editorial-note">
        {t(
          "新的设计记录与开源故事，会在这里继续。",
          "More design notes and open-source stories to come.",
        )}
      </p>
    </section>
  );
}
