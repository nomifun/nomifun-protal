"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "@/components/i18n/LocaleLink";
import { useLocale } from "@/components/i18n/LocaleProvider";
import LanguageSwitch from "@/components/i18n/LanguageSwitch";
import { stripLocale } from "@/lib/i18n";
import gsap from "gsap";
import Icon from "./Icon";
import RollText from "./motion/RollText";
const navigation = [
  ["/", "首页", "Home"],
  ["/products", "开源矩阵", "Open source"],
  ["/download", "下载", "Download"],
  ["/blog", "博客文章", "Blog"],
  ["/contact", "联系我们", "Contact"],
];
const chapters = [
  ["possibilities", "能力世界", "Possibilities"],
  ["agent", "组合 Agent", "Compose an Agent"],
  ["companion", "桌面伙伴", "Companions"],
  ["work", "持续工作", "Continuous work"],
  ["creation", "多模态创作", "Multimodal creation"],
  ["extend", "能力扩展", "Extend capabilities"],
  ["developers", "开放架构", "Open architecture"],
];

export default function SiteShell({ children }) {
  const { t, path } = useLocale();
  const pathname = usePathname(),
    currentPath = stripLocale(pathname),
    [open, setOpen] = useState(false),
    [present, setPresent] = useState(false),
    [progress, setProgress] = useState(0),
    [heroVisible, setHeroVisible] = useState(currentPath === "/"),
    [menuLabel, setMenuLabel] = useState(t("目录", "Menu")),
    [toast, setToast] = useState("");
  const header = useRef(null),
    trigger = useRef(null),
    dialog = useRef(null),
    inner = useRef(null),
    backdrop = useRef(null),
    opener = useRef(null),
    menuTimeline = useRef(null),
    openRef = useRef(false),
    toastTimer = useRef(null);
  const showMenu = () => {
    opener.current = document.activeElement;
    setPresent(true);
    setOpen(true);
  };
  useEffect(() => {
    setOpen(false);
  }, [pathname]);
  useEffect(() => {
    openRef.current = open;
    document.documentElement.dataset.menuOpen = String(open);
    let frame = 0;
    const target = open ? t("关闭", "Close") : t("目录", "Menu");
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setMenuLabel(target);
      return;
    }
    const timer = setInterval(() => {
      frame++;
      setMenuLabel(
        [...target]
          .map((c, i) => (frame / 18 > i / target.length ? c : "•"))
          .join(""),
      );
      if (frame >= 18) {
        setMenuLabel(target);
        clearInterval(timer);
      }
    }, 20);
    return () => clearInterval(timer);
  }, [open, t]);
  useEffect(() => {
    let last = window.scrollY,
      hidden = false;
    if (!present) gsap.set(header.current, { yPercent: 0 });
    const update = () => {
      const y = window.scrollY,
        max = document.documentElement.scrollHeight - innerHeight;
      const hero = document.querySelector(".home-hero");
      const inHero =
        currentPath === "/" &&
        !!hero &&
        hero.getBoundingClientRect().bottom > 100;
      const inFullScreenStage =
        currentPath === "/" &&
        !matchMedia("(prefers-reduced-motion: reduce)").matches &&
        [...document.querySelectorAll(".wm-track,.creative-stack-track")].some(
          (stage) => {
            const bounds = stage.getBoundingClientRect();
            return bounds.top <= 1 && bounds.bottom >= innerHeight - 1;
          },
        );
      setHeroVisible(inHero);
      setProgress(max > 0 ? Math.min(100, Math.round((y / max) * 100)) : 0);
      if (header.current) {
        const hide =
          currentPath === "/" &&
          !inHero &&
          y > 120 &&
          (inFullScreenStage ||
            (y - last > 2 ? true : y - last < -2 ? false : hidden)) &&
          !openRef.current &&
          !header.current.contains(document.activeElement);
        header.current.classList.toggle("is-scrolled", y > 60);
        if (hide !== hidden)
          gsap.to(header.current, {
            yPercent: hide ? -100 : 0,
            duration: matchMedia("(prefers-reduced-motion: reduce)").matches
              ? 0
              : 0.7,
            ease: "power3.inOut",
            overwrite: true,
          });
        hidden = hide;
      }
      last = y;
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    const ro = new ResizeObserver(update);
    const main = document.querySelector("main");
    if (main) ro.observe(main);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      ro.disconnect();
      gsap.killTweensOf(header.current);
    };
  }, [pathname, present]);
  useLayoutEffect(() => {
    if (!present) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const panel = dialog.current,
      content = inner.current;
    const timeline = gsap.timeline({
      paused: true,
      onReverseComplete: () => setPresent(false),
    });
    const items = content.querySelectorAll(
      ".menu-heading,.menu-language-row,.menu-panel nav>a,.menu-chapters,.menu-note",
    );
    timeline
      .fromTo(
        backdrop.current,
        { autoAlpha: 0, backdropFilter: "blur(0px)" },
        {
          autoAlpha: 1,
          backdropFilter: "blur(16px)",
          duration: reduced ? 0 : 0.35,
        },
        0,
      )
      .fromTo(
        panel,
        { height: 0, autoAlpha: 0 },
        {
          height: Math.min(content.scrollHeight, innerHeight - 130),
          autoAlpha: 1,
          duration: reduced ? 0 : 0.42,
          ease: "power3.out",
        },
        0,
      )
      .fromTo(
        items,
        { y: 10, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: reduced ? 0 : 0.3,
          stagger: reduced ? 0 : 0.03,
          ease: "power2.out",
        },
        reduced ? 0 : 0.17,
      );
    menuTimeline.current = timeline;
    timeline.play();
    return () => {
      timeline.kill();
      menuTimeline.current = null;
    };
  }, [present]);
  useEffect(() => {
    if (!present) return;
    if (open) menuTimeline.current?.play();
    else if (menuTimeline.current) {
      if (matchMedia("(prefers-reduced-motion: reduce)").matches)
        setPresent(false);
      else menuTimeline.current.reverse();
    }
  }, [open, present]);
  useEffect(() => {
    if (!present) return;
    const old = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.lenis?.stop();
    gsap.to(header.current, { yPercent: 0, duration: 0.3 });
    const focusTimer = setTimeout(
      () => dialog.current?.querySelector("button,a")?.focus(),
      30,
    );
    const keyboard = (e) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "Tab") {
        const items = [...dialog.current.querySelectorAll("a,button")],
          first = items[0],
          last = items.at(-1);
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", keyboard);
    return () => {
      clearTimeout(focusTimer);
      document.body.style.overflow = old;
      window.lenis?.start();
      document.removeEventListener("keydown", keyboard);
      opener.current?.focus();
    };
  }, [present]);
  useEffect(() => () => clearTimeout(toastTimer.current), []);
  const copyOverview = async () => {
    try {
      await navigator.clipboard.writeText(
        t(
          "NomiFun：本地优先的开源 Agent 工作空间。可组合能力、桌面伙伴、多模态创作与持续工作，在自己的电脑上发生。https://www.nomifun.com",
          "NomiFun: your local-first, open-source Agent workspace. Compose capabilities, create with AI, and keep work moving with desktop companions—all on your own computer. https://www.nomifun.com/",
        ),
      );
      setToast(
        t(
          "产品简介已复制，可以分享给朋友。",
          "Product overview copied. Share it with a friend.",
        ),
      );
    } catch {
      setToast(
        t(
          "复制暂不可用，可直接分享官网链接。",
          "Copy is unavailable. You can share the website link instead.",
        ),
      );
    }
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 3500);
  };
  return (
    <>
      <a href="#main-content" className="skip-link">
        {t("跳至主要内容", "Skip to main content")}
      </a>
      <header
        className={`site-header ${currentPath === "/" ? "" : "is-inner-page"}`}
        ref={header}
      >
        <Link
          href="/"
          className="wordmark"
          aria-label={t("NomiFun 首页", "NomiFun home")}
        >
          <img src="/images/brand/nomifun.svg" alt="" width="34" height="34" />
          <span>NomiFun</span>
        </Link>
        <nav
          aria-label={t("主导航", "Main navigation")}
          className="desktop-navigation"
        >
          {navigation.map(([href, zh, en]) => (
            <Link
              href={href}
              key={href}
              aria-label={t(zh, en)}
              aria-current={
                currentPath === href ||
                (href !== "/" && currentPath.startsWith(href))
                  ? "page"
                  : undefined
              }
            >
              <RollText>{t(zh, en)}</RollText>
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <a
            className="header-source"
            href="https://github.com/nomifun/nomifun-desktop"
            target="_blank"
            rel="noreferrer"
            aria-label={t(
              "GitHub 开源仓库",
              "Open-source repository on GitHub",
            )}
          >
            <Icon name="GithubLogo" size={23} />
          </a>
          <LanguageSwitch />
          <Link className="header-download" href="/download">
            <span className="button-motion-inner">
              <RollText>{t("开始体验", "Get started")}</RollText>
              <Icon name="ArrowUpRight" size={18} />
            </span>
          </Link>
          <button
            className="mobile-menu"
            onClick={showMenu}
            aria-label={t("打开导航", "Open navigation")}
          >
            <Icon name="List" />
          </button>
        </div>
      </header>
      {children}
      <footer className="site-footer">
        <div className="container">
          <div className="footer-top">
            <div>
              <p className="eyebrow">YOUR COMPUTER. YOUR POSSIBILITIES.</p>
              <h2>
                {t("下一种可能，", "Create what")}
                <br />
                {t("由你创造。", "comes next.")}
              </h2>
              <div className="footer-cta">
                <Link href="/download" className="button light">
                  <span className="button-motion-inner">
                    <RollText>{t("下载 NomiFun", "Download NomiFun")}</RollText>
                    <Icon name="ArrowUpRight" size={20} />
                  </span>
                </Link>
                <a
                  className="footer-source"
                  href="https://github.com/nomifun/nomifun-desktop"
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="button-motion-inner">
                    <RollText>{t("一起构建", "Build with us")}</RollText>
                    <Icon name="GithubLogo" size={20} />
                  </span>
                </a>
              </div>
              <button className="footer-copy" onClick={copyOverview}>
                <Icon name="Link" size={17} />
                {t("复制产品简介", "Copy product overview")}
              </button>
            </div>
            <div className="footer-links">
              <div>
                <span>{t("探索", "Explore")}</span>
                {navigation.slice(1).map(([href, zh, en]) => (
                  <Link href={href} key={href}>
                    <RollText>{t(zh, en)}</RollText>
                  </Link>
                ))}
              </div>
              <div>
                <span>{t("开源生态", "Ecosystem")}</span>
                {[
                  ["desktop", "Desktop", "Desktop"],
                  ["mobile", "Mobile", "Mobile"],
                  ["xiaozhi-yuntai", "小智云台", "Xiaozhi Yuntai"],
                  ["net-infra", "Net Infra", "Net Infra"],
                ].map(([slug, zh, en]) => (
                  <Link key={slug} href={`/products/${slug}`}>
                    <RollText>{t(zh, en)}</RollText>
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <div className="footer-wordmark" aria-hidden="true">
            NomiFun
          </div>
          <div className="footer-bottom">
            <span>
              © {new Date().getFullYear()} NomiFun.{" "}
              {t(
                "始于个人，面向每个人。",
                "Started by one. Built for everyone.",
              )}
            </span>
            <span>{t("本地优先 · 开源共建", "Local first · Open source")}</span>
            <a href="#main-content">
              {t("回到顶部", "Back to top")}
              <Icon name="ArrowUpRight" size={16} />
            </a>
          </div>
        </div>
      </footer>
      {currentPath === "/" && (
        <div
          className={`reading-dock ${open ? "is-open" : ""} ${heroVisible ? "is-hero" : ""}`}
        >
          <Link href="/" aria-label={t("NomiFun 首页", "NomiFun home")}>
            <img
              src="/images/brand/nomifun.svg"
              alt=""
              width="24"
              height="24"
            />
          </Link>
          <span className="dock-title">
            {currentPath === "/"
              ? t("认识 NomiFun", "Explore NomiFun")
              : "NomiFun"}
          </span>
          <span
            className="dock-progress"
            aria-label={t(
              `阅读进度 ${progress}%`,
              `Reading progress ${progress}%`,
            )}
          >
            {progress}%
          </span>
          <button
            ref={trigger}
            onClick={() => (open ? setOpen(false) : showMenu())}
            aria-label={
              open ? t("关闭目录", "Close menu") : t("打开目录", "Open menu")
            }
            aria-expanded={open}
            aria-controls="portal-menu"
          >
            <span className="dock-menu-symbol" aria-hidden="true">
              <i />
              <i />
            </span>
            <span className="dock-menu-label" aria-hidden="true">
              {menuLabel}
            </span>
          </button>
        </div>
      )}
      {present && (
        <div
          className="menu-overlay"
          ref={backdrop}
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div
            className={`menu-panel ${currentPath === "/" ? "" : "is-inner-page"}`}
            id="portal-menu"
            role="dialog"
            aria-modal="true"
            aria-label={t("网站目录", "Website menu")}
            ref={dialog}
          >
            <div className="menu-panel-inner" ref={inner} data-lenis-prevent>
              <div className="menu-heading">
                <span className="eyebrow">EXPLORE NOMIFUN</span>
                <button
                  onClick={() => setOpen(false)}
                  aria-label={t("关闭目录", "Close menu")}
                >
                  <Icon name="X" />
                </button>
              </div>
              <div className="menu-language-row">
                <span>{t("语言", "Language")}</span>
                <LanguageSwitch variant="menu" />
              </div>
              <nav aria-label={t("完整导航", "All pages")}>
                {navigation.map(([href, zh, en], i) => (
                  <Link
                    key={href}
                    href={href}
                    aria-label={`0${i + 1} ${t(zh, en)}`}
                    onClick={() => setOpen(false)}
                  >
                    <small>0{i + 1}</small>
                    <RollText>{t(zh, en)}</RollText>
                    <Icon name="ArrowUpRight" size={27} />
                  </Link>
                ))}
              </nav>
              <div className="menu-chapters">
                <span>{t("首页章节", "Home chapters")}</span>
                {chapters.map(([id, zh, en]) => (
                  <a
                    key={id}
                    href={path(`/#${id}`)}
                    onClick={() => setOpen(false)}
                  >
                    <RollText>{t(zh, en)}</RollText>
                  </a>
                ))}
              </div>
              <p className="menu-note">
                {t(
                  "让强大的 AI，成为你自己的日常。",
                  "Make powerful AI part of your everyday.",
                )}
              </p>
            </div>
          </div>
        </div>
      )}
      <div
        className={`portal-toast ${toast ? "is-visible" : ""}`}
        role="status"
        aria-live="polite"
      >
        {toast}
      </div>
    </>
  );
}
