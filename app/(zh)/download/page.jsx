import Link from "@/components/i18n/LocaleLink";
import Icon from "@/components/Icon";
import { links, getProducts } from "@/lib/site";
import { createI18n, pageMetadata } from "@/lib/i18n";

export function getPageMetadata(locale = "zh") {
  return pageMetadata(
    locale,
    "/download",
    "下载",
    "Download",
    "从官方 GitHub Releases 获取 NomiFun Desktop。Windows、macOS、Linux 安装与四个开源项目入口。",
    "Get NomiFun Desktop from official GitHub Releases. Find Windows, macOS, and Linux installation packages and explore all four open-source projects.",
  );
}
export const metadata = getPageMetadata();

const platforms = [
  {
    name: "Windows",
    label: "为你的日常电脑",
    labelEn: "For your everyday computer",
    file: ".exe 安装包",
    fileEn: ".exe installer",
    icon: "WindowsLogo",
    note: "选择对应架构的安装包。运行需要 Microsoft WebView2。",
    noteEn:
      "Choose the installer for your processor architecture. Microsoft WebView2 is required.",
  },
  {
    name: "macOS",
    label: "为创作与开发",
    labelEn: "For creating and developing",
    file: ".dmg 安装包",
    fileEn: ".dmg installer",
    icon: "AppleLogo",
    note: "选择 Apple Silicon、Intel 或 Universal 版本，以发布附件为准。",
    noteEn:
      "Choose Apple Silicon, Intel, or Universal, according to the files available in the release.",
  },
  {
    name: "Linux",
    label: "为开放的工作方式",
    labelEn: "For an open way of working",
    file: ".AppImage / .deb / .rpm",
    icon: "LinuxLogo",
    note: "选择对应发行版与架构。运行环境要求请查看仓库说明。",
    noteEn:
      "Choose the package for your distribution and architecture. See the repository for runtime requirements.",
  },
];

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
      <section
        className="download-grid container"
        aria-label={t("选择桌面平台", "Choose your desktop platform")}
      >
        {platforms.map((platform) => (
          <article key={platform.name} className="download-card">
            <span className="platform-mark" aria-hidden="true">
              <Icon name={platform.icon} size={50} weight="light" />
            </span>
            <span className="eyebrow">
              {t(platform.label, platform.labelEn)}
            </span>
            <h2>{platform.name}</h2>
            <span className="download-format">
              {t(platform.file, platform.fileEn || platform.file)}
            </span>
            <p>{t(platform.note, platform.noteEn)}</p>
            <a
              href={links.releases}
              target="_blank"
              rel="noopener noreferrer"
              className="button"
            >
              {t("查看发布与下载", "View releases & download")}{" "}
              <Icon name="DownloadSimple" size={18} />
            </a>
          </article>
        ))}
      </section>
      <section className="download-source container">
        <div>
          <span className="pill">OFFICIAL RELEASES</span>
          <h2>{t("选一个适合你的版本。", "Choose the release that fits.")}</h2>
          <p>
            {t(
              "官方安装包集中发布在 GitHub Releases。官网按当前开源源码介绍产品，新设计可能先于正式安装包发布。请查看对应版本的更新说明与附件，按系统和处理器架构选择；部分平台的附件可能分批发布。",
              "Official packages are published on GitHub Releases. This website describes the current open-source code, so new designs may appear here before they reach a packaged release. Check the release notes and assets, then choose your operating system and processor architecture. Files for some platforms may arrive in stages.",
            )}
          </p>
        </div>
        <div className="download-source-actions">
          <a href={links.releases} target="_blank" rel="noopener noreferrer">
            GitHub Releases <Icon name="ArrowUpRight" />
          </a>
          <a href={links.chinaMirror} target="_blank" rel="noopener noreferrer">
            {t("中国区备用下载", "Alternative download for China")}{" "}
            <Icon name="ArrowUpRight" />
          </a>
          <small>
            {t(
              "GitHub 为正式发布源；备用分享内容可能存在同步延迟。",
              "GitHub is the official release source. The alternative share may take time to sync.",
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
