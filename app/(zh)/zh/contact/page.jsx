import Icon from "@/components/Icon";
import { links, getProducts, getSocialLinks } from "@/lib/site";
import { createI18n, pageMetadata } from "@/lib/i18n";

export function getPageMetadata(locale = "zh") {
  return pageMetadata(
    locale,
    "/contact",
    "联系我们",
    "Contact",
    "参与 NomiFun 开源共建、反馈问题、交流想法。官方邮箱、GitHub Issues、企业微信群与 QQ 交流群入口。",
    "Build NomiFun with us, report issues, and exchange ideas. Find our official email, GitHub Issues, WeCom group, and QQ community.",
  );
}
export const metadata = getPageMetadata();

export default function ContactPage({ locale = "zh" }) {
  const { t } = createI18n(locale);
  const products = getProducts(locale);
  const socialLinks = getSocialLinks(locale);
  const communityContacts = [
    {
      id: "wecom",
      name: t("企业微信群", "WeCom group"),
      caption: t(
        "扫码加入 NomiFun 企业微信交流群。",
        "Scan to join the NomiFun WeCom community.",
      ),
      image: links.wecomGroupQr,
      width: 396,
      height: 396,
    },
    {
      id: "qq",
      name: t("QQ 交流群", "QQ group"),
      caption: t(
        `QQ群号：${links.qqGroupNumber}，扫码或搜索群号加入。`,
        `Group number: ${links.qqGroupNumber}. Scan the QR code or search for this number in QQ.`,
      ),
      image: links.qqGroupQr,
      width: 405,
      height: 720,
    },
  ];
  return (
    <main id="main-content" className="subpage">
      <section className="page-hero container">
        <p className="eyebrow">
          GOOD IDEAS START WITH A HELLO <span>{t("联系我们", "Contact")}</span>
        </p>
        <div className="page-hero-row">
          <h1>
            {t("一起把有趣的事，", "Make good things")}
            <br />
            <span className="page-italic">
              {t("做得更好。", "better, together.")}
            </span>
          </h1>
          <p className="page-lead">
            {t(
              "一个人的起点，可以成为很多人的创造。使用体验、代码贡献、新的连接方式，或只是一个好想法，都欢迎。",
              "What began with one person can grow through many people's creativity. Share your experience, contribute code, suggest a new connection, or simply bring a good idea.",
            )}
          </p>
        </div>
      </section>
      <section className="contact-primary container">
        <a href={`mailto:${links.email}`} className="contact-email">
          <span className="eyebrow">SAY HELLO</span>
          <Icon name="Envelope" size={41} />
          <h2>{t("写一封信。", "Drop us a line.")}</h2>
          <span className="email-address">{links.email}</span>
          <p>
            {t(
              "产品交流、合作想法与共建邀请。",
              "Product conversations, collaboration ideas, and invitations to build together.",
            )}
          </p>
          <span className="contact-card-action">
            {t("打开邮箱", "Send an email")}{" "}
            <Icon name="ArrowUpRight" size={24} />
          </span>
        </a>
        <a
          href={links.issues}
          target="_blank"
          rel="noopener noreferrer"
          className="contact-issues"
        >
          <span className="eyebrow">MAKE IT BETTER</span>
          <Icon name="GithubLogo" size={41} />
          <h2>{t("留一个 Issue。", "Open an issue.")}</h2>
          <span className="email-address">
            {t("分享问题，也分享期待。", "Share a problem. Or a possibility.")}
          </span>
          <p>
            {t(
              "附上应用版本、运行平台和复现步骤，让修复更快发生。",
              "Include your app version, platform, and steps to reproduce so we can get to a fix faster.",
            )}
          </p>
          <span className="contact-card-action">
            {t("前往 GitHub Issues", "Go to GitHub Issues")}{" "}
            <Icon name="ArrowUpRight" size={24} />
          </span>
        </a>
      </section>
      <section className="contact-build container">
        <div>
          <p className="eyebrow">BUILD WITH US</p>
          <h2>
            {t("从一个小改动，", "Start with")}
            <br />
            {t("开始参与。", "one small change.")}
          </h2>
          <p>
            {t(
              "修复问题、打磨交互、连接新设备、拓展能力。找到你感兴趣的项目，阅读仓库说明，开启一次讨论或 Pull Request。",
              "Fix a bug, refine an interaction, connect a new device, or add a capability. Find a project you care about, read its repository guide, and start a discussion or pull request.",
            )}
          </p>
        </div>
        <div className="contact-repos">
          {products.map((product) => (
            <a
              key={product.slug}
              href={product.repo}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>
                <Icon name={product.icon} size={23} />
                {product.name}
              </span>
              <Icon name="ArrowUpRight" size={23} />
            </a>
          ))}
        </div>
      </section>
      <section className="contact-social container">
        <div>
          <p className="eyebrow">FOLLOW THE JOURNEY</p>
          <h2>{t("也在这些地方，见面。", "Find us along the way.")}</h2>
        </div>
        <div>
          {socialLinks.map((social) => (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {social.name}
              <Icon name="ArrowUpRight" size={22} />
            </a>
          ))}
        </div>
      </section>
      <section
        className="contact-community container"
        aria-labelledby="contact-community-heading"
      >
        <div className="contact-community-heading">
          <p className="eyebrow">MEET THE COMMUNITY</p>
          <h2 id="contact-community-heading">
            {t("扫码，一起聊聊。", "Join the conversation.")}
          </h2>
          <p>
            {t(
              "交流使用体验、反馈问题、分享新想法，欢迎加入 NomiFun 交流群。",
              "Share your experience, ask questions, and bring new ideas to the NomiFun community.",
            )}
          </p>
        </div>
        <div className="contact-community-grid">
          {communityContacts.map((contact) => (
            <article
              key={contact.id}
              className="contact-community-card"
              aria-labelledby={`contact-${contact.id}-heading`}
            >
              <h3 id={`contact-${contact.id}-heading`}>{contact.name}</h3>
              <p>{contact.caption}</p>
              <a
                href={contact.image}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-community-qr"
                aria-label={t(
                  `查看 ${contact.name} 的完整二维码`,
                  `View the full ${contact.name} QR code`,
                )}
              >
                <img
                  src={contact.image}
                  width={contact.width}
                  height={contact.height}
                  loading="lazy"
                  alt={t(
                    `NomiFun ${contact.name}二维码`,
                    `NomiFun ${contact.name} QR code`,
                  )}
                />
              </a>
              <a
                href={contact.image}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-card-action"
              >
                {t("查看完整二维码", "View the full QR code")}
                <Icon name="ArrowUpRight" size={22} />
              </a>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
