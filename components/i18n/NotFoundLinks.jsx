"use client";
export default function NotFoundLinks() {
  const remember = (locale) => {
    try {
      localStorage.setItem("nomifun-portal-locale", locale);
    } catch {
      /* Native links still work. */
    }
  };
  return (
    <nav
      aria-label="Choose a home page language"
      style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 32 }}
    >
      <a
        href="/en"
        hrefLang="en"
        lang="en"
        className="button"
        onClick={() => remember("en")}
      >
        Explore in English
      </a>
      <a
        href="/"
        hrefLang="zh-CN"
        lang="zh-CN"
        className="button light"
        onClick={() => remember("zh")}
      >
        回到中文首页
      </a>
    </nav>
  );
}
