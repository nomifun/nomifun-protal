import "@/app/globals.css";
import SiteShell from "@/components/SiteShell";
import Behaviors from "@/components/Behaviors";
import LocaleProvider from "./LocaleProvider";
import { pageMetadata } from "@/lib/i18n";

export function documentMetadata(locale) {
  const page = pageMetadata(
    locale,
    "/",
    "NomiFun — 让 AI 生活在你生命的左右",
    "NomiFun — Let AI live by your side",
    "属于你的个人 AI 伙伴，有个性、有记忆，也能一起做事。从桌面、手机到小智云台，让陪伴延伸到真实世界。本地优先，代码开源，Agent 能力自由组合。",
    "Your personal AI companion, with personality, memory, and the ability to act. From desktop and phone to Xiaozhi Yuntai, bring your companion into the real world. Local first, open source, with composable Agent capabilities.",
  );
  return {
    ...page,
    metadataBase: new URL("https://www.nomifun.com"),
    title: { default: page.title, template: "%s · NomiFun" },
    openGraph: {
      ...page.openGraph,
      type: "website",
      siteName: "NomiFun",
      title: page.title,
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
      <body>
        <LocaleProvider locale={locale}>
          <SiteShell>{children}</SiteShell>
          <Behaviors />
        </LocaleProvider>
      </body>
    </html>
  );
}
