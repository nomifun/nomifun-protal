export default function NotFoundLinks() {
  return (
    <nav
      aria-label="Choose a home page language"
      style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 32 }}
    >
      <a href="/" hrefLang="en" lang="en" className="button">
        Explore in English
      </a>
      <a href="/zh" hrefLang="zh-CN" lang="zh-CN" className="button light">
        回到中文首页
      </a>
    </nav>
  );
}
