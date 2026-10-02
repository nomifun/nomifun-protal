"use client";
import Link from "./LocaleLink";
import { useLocale } from "./LocaleProvider";
import Icon from "@/components/Icon";
export default function NotFound() {
  const { t } = useLocale();
  return (
    <main id="main-content" className="subpage">
      <section className="container" style={{ paddingBlock: "190px 150px" }}>
        <p className="eyebrow">404 / A DIFFERENT POSSIBILITY</p>
        <h1 className="section-heading" style={{ marginBlock: 25 }}>
          {t("这个入口，", "This possibility")}
          <br />
          {t("暂时没有内容。", "isn't here yet.")}
        </h1>
        <p className="section-copy">
          {t(
            "从首页继续探索，或去开源矩阵找到你感兴趣的项目。",
            "Continue from the home page, or explore an open-source project that interests you.",
          )}
        </p>
        <div
          style={{ display: "flex", gap: 15, marginTop: 35, flexWrap: "wrap" }}
        >
          <Link href="/" className="button">
            {t("回到首页", "Back to home")}
            <Icon name="ArrowRight" size={18} />
          </Link>
          <Link href="/products" className="button light">
            {t("开源矩阵", "Open-source projects")}
          </Link>
        </div>
      </section>
    </main>
  );
}
