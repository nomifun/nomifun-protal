import Link from "@/components/i18n/LocaleLink";
import Icon from "@/components/Icon";
import { links, getProducts } from "@/lib/site";
import { createI18n, pageMetadata } from "@/lib/i18n";
import DownloadCenter from "@/components/downloads/DownloadCenter";
import snapshot from "@/lib/releases-snapshot.json";

export function getPageMetadata(locale = "zh") {
  return pageMetadata(
    locale,
    "/download",
    "下载",
    "Download",
    "从 CrabNebula 或 GitHub 直接下载 NomiFun Desktop，分别查看最新版本与各系统安装包。GitHub、Gitee 源码仓库入口独立展示。",
    "Download NomiFun Desktop directly from CrabNebula or GitHub. Compare each source's latest version and available installers, with separate GitHub and Gitee source repositories.",
  );
}
export const metadata = getPageMetadata();

export default function DownloadPage({ locale = "zh" }) {
  const { t } = createI18n(locale);
  const products = getProducts(locale);
  return (
    <main id="main-content" className="subpage">
      <section className="page-hero container">
        <p className="eyebrow">
          START SOMETHING GOOD <span>{t("下载", "Download")}</span>
        </p>
        <div className="page-hero-row">
          <h1>
            {t("下一件有趣的事，", "Your next great idea")}
            <br />
            <span className="page-italic">
              {t("从你的电脑开始。", "starts on your computer.")}
            </span>
          </h1>
          <p className="page-lead">
            {t(
              "获取 NomiFun Desktop。让 Agent、伙伴、自动工作与创作，拥有一个属于你的本地空间。",
              "Get NomiFun Desktop. Give your agents, companions, autonomous work, and creativity a local space of their own.",
            )}
          </p>
        </div>
      </section>
      <DownloadCenter locale={locale} snapshot={snapshot} />
      <section className="download-source container">
        <div>
          <span className="pill">OPEN SOURCE</span>
          <h2>{t("源码，也是另一种起点。", "Start with the source, too.")}</h2>
          <p>
            {t(
              "想了解实现、自己构建或参与贡献，可以从 GitHub 或 Gitee 查看项目源码。官网按当前源码介绍产品，具体能力以安装版本为准；不同来源、不同系统的安装包可能分批发布。",
              "Explore the implementation, build it yourself, or contribute through GitHub or Gitee. This website describes the current source; available features depend on your installed version. Packages may arrive at different times across sources and systems.",
            )}
          </p>
        </div>
        <div className="download-source-actions">
          <a href={links.github} target="_blank" rel="noopener noreferrer">
            {t("GitHub 源码仓库", "GitHub source repository")}{" "}
            <Icon name="GithubLogo" />
          </a>
          <a href={links.gitee} target="_blank" rel="noopener noreferrer">
            {t("Gitee 源码仓库", "Gitee source repository")}{" "}
            <Icon name="GitBranch" />
          </a>
          <small>
            {t(
              "仓库用于阅读源码与参与开发。安装应用请使用上方的下载按钮。",
              "Repositories are for source code and development. Use the download buttons above to install the app.",
            )}
          </small>
        </div>
      </section>
      <section className="download-notes container">
        <div>
          <p className="eyebrow">A FEW THINGS TO KNOW</p>
          <h2>
            {t("准备好，", "A little preparation.")}
            <br />
            {t("再开始。", "Then make it yours.")}
          </h2>
        </div>
        <div className="download-note-list">
          <article>
            <span>01</span>
            <div>
              <h3>{t("模型由你选择", "Choose your own models")}</h3>
              <p>
                {t(
                  "安装应用后，配置自己使用的模型供应商。外部模型的用量费用与数据处理方式由对应供应商决定。",
                  "After installation, configure the model providers you want to use. Each external provider sets its own usage charges and data-handling policies.",
                )}
              </p>
            </div>
          </article>
          <article>
            <span>02</span>
            <div>
              <h3>{t("升级前，备份自己的数据", "Back up before upgrading")}</h3>
              <p>
                {t(
                  "NomiFun 正在持续迭代。请阅读更新说明，并在升级、迁移或尝试实验能力前备份本地数据。",
                  "NomiFun is evolving continuously. Read the release notes and back up your local data before upgrading, migrating, or trying experimental capabilities.",
                )}
              </p>
            </div>
          </article>
          <article>
            <span>03</span>
            <div>
              <h3>{t("想自己构建，也欢迎", "Build it yourself, too")}</h3>
              <p>
                {t(
                  "仓库提供源码、开发脚本与平台构建说明。你可以修改能力、贡献代码，或按项目许可证将它用于自己的工作。",
                  "The repository includes source code, development scripts, and platform build instructions. Customize capabilities, contribute code, or use it in your own work under the project license.",
                )}
              </p>
              <a
                href={`${links.github}#readme`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t("打开源码与构建说明", "Source & build instructions")}{" "}
                <Icon name="ArrowUpRight" size={17} />
              </a>
            </div>
          </article>
        </div>
      </section>
      <section className="download-family container">
        <div className="section-heading">
          <p className="eyebrow">BEYOND THE DESKTOP</p>
          <h2>{t("把它，连接到更多地方。", "Take it to more places.")}</h2>
        </div>
        <div className="download-family-grid">
          {products.slice(1).map((product) => (
            <Link key={product.slug} href={`/products/${product.slug}`}>
              <Icon name={product.icon} size={31} />
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <span>
                {t("了解项目与获取方式", "Explore the project & get started")}{" "}
                <Icon name="ArrowUpRight" size={18} />
              </span>
            </Link>
          ))}
        </div>
      </section>
      <div className="download-help container">
        <span>
          {t("安装或使用遇到问题？", "Need help installing or using it?")}
        </span>
        <Link href="/contact">
          {t("让我们一起看看", "Let's take a look together")}{" "}
          <Icon name="ArrowUpRight" size={18} />
        </Link>
      </div>
    </main>
  );
}
