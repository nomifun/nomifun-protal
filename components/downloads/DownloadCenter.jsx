"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Icon from "@/components/Icon";
import { createI18n } from "@/lib/i18n";
import { links } from "@/lib/site";
import {
  getInstallerChoices,
  selectInstallerChoice,
  selectInstaller,
} from "@/lib/download-selection.mjs";
import {
  fetchRelease,
  getPlatformAssets,
  RELEASE_SOURCES,
} from "@/lib/downloads.mjs";

const sourceIds = ["crabnebula", "github"];
const platforms = [
  { id: "windows", name: "Windows", icon: "WindowsLogo" },
  { id: "macos", name: "macOS", icon: "AppleLogo" },
  { id: "linux", name: "Linux", icon: "LinuxLogo" },
];
const formats = {
  exe: ".exe",
  msi: ".msi",
  dmg: ".dmg",
  appimage: ".AppImage",
  deb: ".deb",
  rpm: ".rpm",
};

function assetLabel(asset, platform, t) {
  const architecture =
    platform === "macos"
      ? { arm64: "Apple Silicon", x64: "Intel", universal: "Universal" }[
          asset.arch
        ]
      : { x64: "x64", arm64: "ARM64", x86: "x86" }[asset.arch];
  return (
    (architecture || t("架构见文件名", "See filename for architecture")) +
    " · " +
    (formats[asset.format] || asset.format)
  );
}

function checkedTime(value, locale) {
  if (!value || !Number.isFinite(Date.parse(value))) return "";
  return (
    new Intl.DateTimeFormat(locale === "zh" ? "zh-CN" : "en-GB", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "UTC",
      hour12: false,
    }).format(new Date(value)) + " UTC"
  );
}

function fileSize(bytes) {
  return Number.isFinite(bytes) && bytes > 0
    ? (bytes / 1024 / 1024).toFixed(1) + " MB"
    : "";
}

function syncLabel(status, t) {
  return status === "loading"
    ? t("正在检查…", "Checking…")
    : status === "error"
      ? t(
          "刷新暂不可用 · 保留已核实版本",
          "Refresh unavailable · keeping the verified release",
        )
      : status === "live"
        ? t("已核实", "Verified")
        : t("已保存版本", "Saved release");
}

export default function DownloadCenter({ locale, snapshot }) {
  const { t } = createI18n(locale);
  const [records, setRecords] = useState(() =>
    Object.fromEntries(
      sourceIds.map((id) => [
        id,
        { release: snapshot[id], status: "snapshot" },
      ]),
    ),
  );
  const [selections, setSelections] = useState({});
  const [detectedPlatform, setDetectedPlatform] = useState(null);
  const requests = useRef(new Map());
  const lastRefresh = useRef(0);

  const refresh = useCallback(() => {
    if (requests.current.size) return;
    lastRefresh.current = Date.now();
    for (const id of sourceIds) {
      const controller = new AbortController();
      requests.current.set(id, controller);
      setRecords((previous) => ({
        ...previous,
        [id]: { ...previous[id], status: "loading" },
      }));
      fetchRelease(id, {
        endpoint: "/api/releases?source=" + id,
        signal: controller.signal,
        timeoutMs: 12000,
      })
        .then((release) => {
          if (!controller.signal.aborted)
            setRecords((previous) => ({
              ...previous,
              [id]: { release, status: "live" },
            }));
        })
        .catch(() => {
          if (!controller.signal.aborted)
            setRecords((previous) => ({
              ...previous,
              [id]: { ...previous[id], status: "error" },
            }));
        })
        .finally(() => {
          if (requests.current.get(id) === controller)
            requests.current.delete(id);
        });
    }
  }, []);

  useEffect(() => {
    refresh();
    const checkVisible = () => {
      if (
        document.visibilityState === "visible" &&
        Date.now() - lastRefresh.current >= 60000
      )
        refresh();
    };
    const timer = setInterval(checkVisible, 60000);
    document.addEventListener("visibilitychange", checkVisible);
    window.addEventListener("focus", checkVisible);
    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", checkVisible);
      window.removeEventListener("focus", checkVisible);
      requests.current.forEach((controller) => controller.abort());
      requests.current.clear();
    };
  }, [refresh]);

  useEffect(() => {
    const agent = navigator.userAgent;
    setDetectedPlatform(
      /Windows/i.test(agent)
        ? "windows"
        : /Macintosh|Mac OS X/i.test(agent) &&
            !/iPhone|iPad/i.test(agent) &&
            navigator.maxTouchPoints < 2
          ? "macos"
          : /Linux/i.test(agent) && !/Android/i.test(agent)
            ? "linux"
            : null,
    );
  }, []);

  const releases = Object.fromEntries(
    sourceIds.map((id) => [id, records[id].release]),
  );
  const refreshing = sourceIds.some((id) => records[id].status === "loading");

  return (
    <section
      className="release-center container"
      aria-label={t("下载安装包", "Download installers")}
    >
      <div className="release-heading">
        <div>
          <p className="eyebrow">NOMIFUN DESKTOP</p>
          <h2>
            {t(
              "选择你的系统，直接下载。",
              "Choose your system. Download directly.",
            )}
          </h2>
        </div>
        <button
          className="release-refresh"
          onClick={refresh}
          disabled={refreshing}
        >
          <Icon name="ArrowsClockwise" size={18} />
          {refreshing
            ? t("正在检查", "Checking")
            : t("刷新版本", "Refresh versions")}
        </button>
      </div>
      <noscript>
        <style>
          {
            ".release-center .release-refresh, .release-center .release-platform-grid { display: none; }"
          }
        </style>
        <div className="release-nojs">
          <p>
            {t(
              "未启用 JavaScript。请选择对应系统和架构的安装包；版本为构建时已核实的记录。",
              "JavaScript is disabled. Choose your system and processor below. These releases were verified when the site was built.",
            )}
          </p>
          {platforms.map((platform) => (
            <div key={platform.id}>
              <h3>{platform.name}</h3>
              {sourceIds.map((id) => (
                <div key={id}>
                  <h4>
                    {RELEASE_SOURCES[id].name}
                    {id === "crabnebula" &&
                      " · " + t("推荐", "Recommended")} ·{" "}
                    {snapshot[id]?.version}
                  </h4>
                  {getPlatformAssets(snapshot[id], platform.id).map((asset) => (
                    <a key={asset.id} href={asset.url} download={asset.name}>
                      {assetLabel(asset, platform.id, t)}{" "}
                      <Icon name="DownloadSimple" size={18} />
                    </a>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      </noscript>
      <div className="release-platform-grid">
        {platforms.map((platform) => {
          const choices = getInstallerChoices(releases, platform.id);
          const choice = selectInstallerChoice(
            choices,
            selections[platform.id],
          );
          return (
            <article
              key={platform.id}
              className={
                "release-platform-card " +
                (detectedPlatform === platform.id ? "is-detected" : "")
              }
              aria-labelledby={"platform-" + platform.id}
            >
              <div className="release-platform-top">
                <Icon name={platform.icon} size={32} weight="light" />
                <h3 id={"platform-" + platform.id}>{platform.name}</h3>
                {detectedPlatform === platform.id && (
                  <span className="release-device-badge">
                    {t("当前系统", "Your system")}
                  </span>
                )}
              </div>
              {choices.length > 0 ? (
                <>
                  <label
                    className="release-package-label"
                    htmlFor={"installer-" + platform.id}
                  >
                    {t("处理器 / 安装格式", "Processor / package")}
                  </label>
                  <select
                    id={"installer-" + platform.id}
                    value={choice ? choice.arch + ":" + choice.format : ""}
                    onChange={(event) => {
                      const selected = choices.find(
                        (item) =>
                          item.arch + ":" + item.format === event.target.value,
                      );
                      if (selected)
                        setSelections((previous) => ({
                          ...previous,
                          [platform.id]: selected,
                        }));
                    }}
                  >
                    {!choice && (
                      <option value="" disabled>
                        {t("请重新选择安装包", "Choose a package again")}
                      </option>
                    )}
                    {choices.map((item) => (
                      <option
                        key={item.arch + ":" + item.format}
                        value={item.arch + ":" + item.format}
                      >
                        {assetLabel(item, platform.id, t)}
                      </option>
                    ))}
                  </select>
                  <p className="release-platform-note">
                    {!choice
                      ? t(
                          "所选架构或格式暂不可用，请重新选择。",
                          "Your selected processor or package is unavailable. Choose another package.",
                        )
                      : platform.id === "macos"
                        ? t(
                            "M 系列芯片选 Apple Silicon；Intel 芯片选 Intel。",
                            "Choose Apple Silicon for M-series chips, or Intel for Intel chips.",
                          )
                        : platform.id === "windows"
                          ? t(
                              "请选择匹配处理器的架构。运行需要 WebView2。",
                              "Match your processor architecture. WebView2 is required.",
                            )
                          : t(
                              "请选择匹配发行版和处理器的格式。",
                              "Match the package to your distribution and processor.",
                            )}
                  </p>
                </>
              ) : (
                <p className="release-platform-note">
                  {t(
                    "当前版本尚未提供该系统安装包。",
                    "No installer for this system is available in the current releases.",
                  )}
                </p>
              )}
              <div
                className="release-platform-sources"
                role="group"
                aria-label={
                  platform.name + " " + t("下载来源", "download sources")
                }
              >
                {sourceIds.map((id) => {
                  const record = records[id];
                  const assets = getPlatformAssets(record.release, platform.id);
                  const asset = choice ? selectInstaller(assets, choice) : null;
                  return (
                    <div key={id} className="release-platform-source">
                      <div className="release-download-row">
                        <span className="release-source-name">
                          {RELEASE_SOURCES[id].name}
                          {id === "crabnebula" && (
                            <span className="release-recommended">
                              {t("推荐", "Recommended")}
                            </span>
                          )}
                        </span>
                        <span className="release-version">
                          {record.release?.version
                            ? "v" + record.release.version.replace(/^v/, "")
                            : t("待核实", "Unverified")}
                        </span>
                        {asset ? (
                          <a
                            className={
                              "release-download-link " +
                              (id === "crabnebula" ? "is-primary" : "")
                            }
                            href={asset.url}
                            download={asset.name}
                            title={asset.name}
                            aria-label={
                              t("下载", "Download") +
                              " NomiFun " +
                              platform.name +
                              " " +
                              assetLabel(asset, platform.id, t) +
                              " " +
                              record.release.version +
                              " · " +
                              RELEASE_SOURCES[id].name
                            }
                          >
                            {t("下载", "Download")}{" "}
                            <Icon name="DownloadSimple" size={15} />
                          </a>
                        ) : assets.length > 0 && !choice ? (
                          <span className="release-unavailable-label">
                            {t("请先选包", "Choose package")}
                          </span>
                        ) : (
                          <a
                            className="release-status-link"
                            href={
                              record.release?.releaseUrl ||
                              RELEASE_SOURCES[id].releaseUrl
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={
                              platform.name +
                              " · " +
                              RELEASE_SOURCES[id].name +
                              " · " +
                              (assets.length === 0
                                ? t(
                                    "暂无安装包，查看发布状态",
                                    "No installer, view releases",
                                  )
                                : t(
                                    "暂无此架构或格式，查看发布状态",
                                    "Selected package unavailable, view releases",
                                  ))
                            }
                          >
                            {assets.length === 0
                              ? t("未提供", "Unavailable")
                              : t("无此包", "No package")}{" "}
                            <Icon name="ArrowUpRight" size={14} />
                          </a>
                        )}
                      </div>
                      {record.status === "error" && (
                        <p className="release-row-feedback" role="status">
                          {t(
                            "刷新暂不可用 · 已保存版本",
                            "Refresh unavailable · saved release",
                          )}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
              <details className="release-package-details">
                <summary>
                  {t("下载详情", "Download details")}{" "}
                  <Icon name="ArrowDown" size={13} />
                </summary>
                <div className="release-details-body">
                  {sourceIds.map((id) => {
                    const record = records[id];
                    const assets = getPlatformAssets(
                      record.release,
                      platform.id,
                    );
                    const asset = choice
                      ? selectInstaller(assets, choice)
                      : null;
                    return (
                      <div key={id} className="release-package-metadata">
                        <h4>{RELEASE_SOURCES[id].name}</h4>
                        {asset ? (
                          <p className="release-file-name">
                            {asset.name}
                            {fileSize(asset.size) &&
                              " · " + fileSize(asset.size)}
                          </p>
                        ) : (
                          <p>
                            {assets.length === 0
                              ? t(
                                  "暂无该系统安装包。",
                                  "No installer for this system.",
                                )
                              : !choice
                                ? t(
                                    "请先选择安装包。",
                                    "Choose a package first.",
                                  )
                                : t(
                                    "暂无所选架构或格式。",
                                    "The selected processor or package is unavailable.",
                                  )}
                          </p>
                        )}
                        <p className="release-sync-note">
                          {syncLabel(record.status, t)}
                          {record.release?.checkedAt &&
                            " · " +
                              checkedTime(record.release.checkedAt, locale)}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </details>
            </article>
          );
        })}
      </div>
      <div className="release-secondary-links">
        <span>{t("更新说明与完整附件", "Release notes & all assets")}</span>
        {sourceIds.map((id) => (
          <a
            key={id}
            href={
              records[id].release?.releaseUrl || RELEASE_SOURCES[id].releaseUrl
            }
            target="_blank"
            rel="noopener noreferrer"
          >
            {RELEASE_SOURCES[id].name} <Icon name="ArrowUpRight" size={17} />
          </a>
        ))}
        <a href={links.chinaMirror} target="_blank" rel="noopener noreferrer">
          {t("备用网盘（可能延迟）", "Backup share (may lag)")}{" "}
          <Icon name="ArrowUpRight" size={17} />
        </a>
      </div>
    </section>
  );
}
