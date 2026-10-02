import "./globals.css";
import NotFoundLinks from "@/components/i18n/NotFoundLinks";
export const metadata = {
  title: "Page not found · NomiFun",
  robots: { index: false, follow: false },
};
export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body>
        <main id="main-content" className="subpage">
          <section
            className="container"
            style={{ paddingBlock: "100px 130px", minHeight: "100svh" }}
          >
            <img
              src="/images/brand/nomifun.svg"
              alt="NomiFun"
              width="52"
              height="52"
            />
            <p className="eyebrow" style={{ marginTop: 55 }}>
              404 / A DIFFERENT POSSIBILITY
            </p>
            <h1
              className="section-heading"
              style={{ marginBlock: 25, maxWidth: 900 }}
            >
              There's more
              <br />
              to explore.
            </h1>
            <p className="section-copy">
              This page isn't here. Start again with a world of open
              possibilities.
            </p>
            <p className="section-copy" lang="zh-CN" style={{ marginTop: 15 }}>
              这个入口暂时没有内容。从首页继续，探索更多可能。
            </p>
            <NotFoundLinks />
          </section>
        </main>
      </body>
    </html>
  );
}
