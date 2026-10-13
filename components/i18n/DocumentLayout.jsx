import "@/app/globals.css";
import SiteShell from "@/components/SiteShell";
import Behaviors from "@/components/Behaviors";
import LocaleProvider from "./LocaleProvider";
import { pageMetadata } from "@/lib/i18n";

export function documentMetadata(locale) {
  const page = pageMetadata(
    locale,
    "/",
    "NomiFun — 强大的 AI，向每个人开放。",
    "NomiFun — Powerful AI. Open to everyone.",
    "强大的 AI，向每个人开放。全面的能力、领先的设计、强悍的性能，完全免费开源，无条件商用。开源不意味着平凡，强大也可以开源。从桌面、手机到小智云台，让你的个人 AI 伙伴有个性、有记忆，也能一起做事。",
    "Powerful AI. Open to everyone. Comprehensive capabilities, forward-thinking design and powerful performance. Completely free and open source, with unconditional commercial use. From desktop and phone to Xiaozhi Yuntai, your personal AI companion has personality, memory, and the ability to act.",
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
