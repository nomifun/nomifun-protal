import { getPosts } from "@/lib/blog";
import { createI18n, pageMetadata } from "@/lib/i18n";
import BlogList from "./BlogList";

export function getBlogMetadata(locale = "zh") {
  return pageMetadata(
    locale,
    "/blog",
    "博客",
    "Journal",
    "产品背后的设计、开源故事与实现思考。认识 NomiFun 如何连接 Agent、本地工作与真实世界。",
    "Product design, implementation notes, and open-source stories. Explore how NomiFun connects agents, local work, and the physical world.",
  );
}

export const metadata = getBlogMetadata();

export default function BlogPage({ locale = "zh" }) {
  const { t } = createI18n(locale);
  const posts = getPosts(locale).map(
    ({ content, html, ...summary }) => summary,
  );
  return (
    <main
      id="main-content"
      className={`subpage${locale === "en" ? " blog-page-en" : ""}`}
    >
      <section className="page-hero container">
        <p className="eyebrow">
          NOTES FROM THE WORKSHOP <span>{t("博客文章", "JOURNAL")}</span>
        </p>
        <div className="page-hero-row">
          <h1>
            {t("代码之外，", "Beyond the code,")}
            <br />
            <span className="page-italic">
              {t("还有一些想法。", "a few more ideas.")}
            </span>
          </h1>
          <p className="page-lead">
            {t(
              "记录产品为何这样设计，能力如何连接，以及一个开源项目怎样从小小的想法开始生长。",
              "Why the product works this way, how its capabilities connect, and how an open-source project grows from a small idea.",
            )}
          </p>
        </div>
      </section>
      <BlogList posts={posts} />
    </main>
  );
}
