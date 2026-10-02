import Link from "@/components/i18n/LocaleLink";
import { notFound } from "next/navigation";
import Icon from "@/components/Icon";
import { getPost, getPosts, formatDate } from "@/lib/blog";
import { createI18n, pageMetadata } from "@/lib/i18n";

export function getBlogStaticParams(locale = "zh") {
  return getPosts(locale).map(({ slug }) => ({ slug }));
}

export function generateStaticParams() {
  return getBlogStaticParams();
}

export async function getBlogPostMetadata({ params }, locale = "zh") {
  const { slug } = await params;
  const zh = getPost(slug, "zh");
  const en = getPost(slug, "en");
  return pageMetadata(
    locale,
    `/blog/${slug}`,
    zh?.title || "文章",
    en?.title || "Article",
    zh?.description,
    en?.description,
  );
}

export async function generateMetadata(props) {
  return getBlogPostMetadata(props);
}

export default async function BlogPostPage({ params, locale = "zh" }) {
  const { t } = createI18n(locale);
  const { slug } = await params;
  const post = getPost(slug, locale);
  if (!post) notFound();
  const related = getPosts(locale)
    .filter((item) => item.slug !== slug)
    .slice(0, 2);
  return (
    <main
      id="main-content"
      className={`subpage article-page${locale === "en" ? " blog-page-en" : ""}`}
    >
      <article>
        <header className="article-header container">
          <Link href="/blog" className="page-back">
            <Icon name="ArrowRight" size={17} /> {t("全部文章", "All articles")}
          </Link>
          <p className="eyebrow">{post.category || "NOMIFUN JOURNAL"}</p>
          <h1>{post.title}</h1>
          <p className="article-description">{post.description}</p>
          <div className="article-meta">
            <span>{post.author || "NomiFun"}</span>
            <time dateTime={post.publishedAt}>
              {formatDate(post.publishedAt, locale)}
            </time>
            <span>
              {t(
                `${post.readingTime || "5 分钟"}阅读`,
                `${post.readingTime || "5 min"} read`,
              )}
            </span>
          </div>
        </header>
        <div className="article-content-wrap">
          {post.kind === "origin" && (
            <aside className="article-archive-note">
              <span className="pill">
                {t("历史归档 · 2026.08.15", "ARCHIVE · AUGUST 15, 2026")}
              </span>
              <p>
                {t(
                  "以下保留作者当时的原始自述，其中版本状态、小程序规划与历史描述反映写作时的阶段。当前产品设计与能力，请参考产品页及对应版本源码。",
                  "The author's original account is preserved below. Version status, mini-app plans, and historical descriptions reflect the product at the time of writing. For current design and capabilities, see the product pages and source code for the relevant version.",
                )}
              </p>
            </aside>
          )}
          <div
            className="article-prose"
            dangerouslySetInnerHTML={{ __html: post.html }}
          />
        </div>
      </article>
      <section className="article-related container">
        <p className="eyebrow">KEEP EXPLORING</p>
        <h2>{t("再读一点。", "A little more to read.")}</h2>
        <div>
          {related.map((item) => (
            <Link key={item.slug} href={`/blog/${item.slug}`}>
              <span>{item.category}</span>
              <h3>{item.title}</h3>
              <Icon name="ArrowUpRight" size={27} />
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
