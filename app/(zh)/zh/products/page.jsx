import Link from "@/components/i18n/LocaleLink";
import Icon from "@/components/Icon";
import { getProducts } from "@/lib/site";
import { createI18n, pageMetadata } from "@/lib/i18n";
import ProductMap from "./ProductMap";

export function getPageMetadata(locale = "zh") {
  return pageMetadata(
    locale,
    "/products",
    "开源矩阵",
    "Open-source ecosystem",
    "五个开源项目，连接个人 AI 与商业服务。认识 NomiFun Desktop、Mobile、小智云台、Net Infra 和 Model Gateway。",
    "Five open-source projects for personal AI and commercial services. Meet NomiFun Desktop, Mobile, Xiaozhi Yuntai, Net Infra, and Model Gateway.",
  );
}
export const metadata = getPageMetadata();

export default function ProductsPage({ locale = "zh" }) {
  const { t } = createI18n(locale);
  const products = getProducts(locale);
  return (
    <main id="main-content" className="subpage">
      <section className="page-hero container">
        <p className="eyebrow">
          THE NOMIFUN UNIVERSE{" "}
          <span>{t("开源矩阵", "Open-source ecosystem")}</span>
        </p>
        <div className="page-hero-row">
          <h1>
            {t("一颗本地大脑。", "One local brain.")}
            <br />
            <span className="page-italic">
              {t("不止一种相遇。", "More ways to connect.")}
            </span>
          </h1>
          <p className="page-lead">
            {t(
              "桌面是起点，手机、机器人和网络是延伸。五个开放项目，让个人 AI 随处可用，也让社区与团队搭建自己的 Token 商业服务。",
              "Start on your desktop. Extend to your phone, robot, and network. Five open projects bring your AI within reach and help communities and teams run their own token billing services.",
            )}
          </p>
        </div>
      </section>
      <ProductMap />
      <section
        className="product-list container"
        aria-label={t("五个开源项目", "Five open-source projects")}
      >
        {products.map((product) => (
          <Link
            href={`/products/${product.slug}`}
            className={`ecosystem-row accent-${product.accent}`}
            key={product.slug}
          >
            <span className="ecosystem-number">/{product.number}</span>
            <span className="ecosystem-symbol">
              <Icon name={product.icon} size={38} />
            </span>
            <div className="ecosystem-copy">
              <p className="eyebrow">{product.category}</p>
              <h2>{product.name}</h2>
              <p>{product.description}</p>
            </div>
            <span className="ecosystem-arrow">
              <Icon name="ArrowUpRight" size={32} />
            </span>
          </Link>
        ))}
      </section>
      <section className="page-endnote container">
        <p className="eyebrow">OPEN BY DESIGN</p>
        <h2>{t("从使用者，成为创造者。", "From using it to shaping it.")}</h2>
        <p>
          {t(
            "探索代码，定制自己的工作方式，或贡献下一个值得分享的能力。每个项目都保留自己的职责，也欢迎新的连接。",
            "Explore the code, make it fit your workflow, or contribute the next capability worth sharing. Each project has a clear role, with room for new connections.",
          )}
        </p>
        <Link href="/contact" className="button">
          {t("加入共建", "Build with us")} <Icon name="ArrowUpRight" />
        </Link>
      </section>
    </main>
  );
}
