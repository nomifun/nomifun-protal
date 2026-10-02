import "@/app/globals.css";
import SiteShell from "@/components/SiteShell";
import Behaviors from "@/components/Behaviors";
import LocaleProvider from "./LocaleProvider";
import { createI18n, pageMetadata } from "@/lib/i18n";

export function documentMetadata(locale) {
  const { t } = createI18n(locale);
  const page = pageMetadata(
    locale,
    "/",
    "NomiFun — 让 AI，真正生活在你的电脑里",
    "NomiFun — AI that feels at home on your computer",
    "一个属于你的开源 Agent 工作空间。自由组合能力，创造桌面伙伴，让对话、创作和持续工作在自己的电脑上发生。",
    "Your open-source Agent workspace. Compose capabilities, create desktop companions, and bring conversation, creativity and continuous work to your own computer.",
  );
  return {
    ...page,
    metadataBase: new URL("https://www.nomifun.com"),
    title: { default: page.title, template: "%s · NomiFun" },
    openGraph: {
      ...page.openGraph,
      type: "website",
      siteName: "NomiFun",
      title: t(
        "NomiFun — 你的电脑，你的 Agent 世界",
        "NomiFun — Your computer. Your Agent world.",
      ),
    },
    robots: { index: true, follow: true },
    icons: { icon: "/images/brand/nomifun.svg" },
  };
}
export const documentViewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f6f5f1",
};
export default function DocumentLayout({ locale, children }) {
  return (
    <html lang={locale === "en" ? "en" : "zh-CN"} data-locale={locale}>
      <head>
        {locale === "zh" && (
          <script
            id="nomifun-language-preference"
            dangerouslySetInnerHTML={{
              __html:
                "try{if(location.pathname==='/'&&localStorage.getItem('nomifun-portal-locale')==='en'){location.replace('/en'+location.search+location.hash)}}catch{}",
            }}
          />
        )}
      </head>
      <body>
        <LocaleProvider locale={locale}>
          <SiteShell>{children}</SiteShell>
          <Behaviors />
        </LocaleProvider>
      </body>
    </html>
  );
}
