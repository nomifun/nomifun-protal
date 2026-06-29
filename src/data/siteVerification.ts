/**
 * Search-engine ownership-verification tokens.
 *
 * Fill a value once the engine's webmaster console hands you a token, then
 * redeploy and click "verify" there. Empty strings render no tag, so it is
 * safe to leave engines you are not using blank.
 */
export const siteVerification = {
  // Google Search Console — verified.
  google: '0d2-w2TWdJppCVQdx8IBs4MY-t3yG6QJPq4_B-LAyCk',
  // Bing Webmaster Tools — the simplest path is "Import from Google Search
  // Console" (no token needed). Only fill this if you verify Bing directly.
  bing: '',
  // 百度搜索资源平台 (ziyuan.baidu.com) — the `codeva-XXXX` value.
  baidu: '',
  // Yandex Webmaster — optional (mainly the Russian market).
  yandex: '',
} as const;

/** The `<meta name="…">` attribute each engine expects. */
export const verificationMeta: Record<keyof typeof siteVerification, string> = {
  google: 'google-site-verification',
  bing: 'msvalidate.01',
  baidu: 'baidu-site-verification',
  yandex: 'yandex-verification',
};

/** Non-empty tokens as ready-to-render `{ name, content }` pairs. */
export const activeVerifications = (
  Object.keys(siteVerification) as (keyof typeof siteVerification)[]
)
  .filter((k) => siteVerification[k])
  .map((k) => ({ name: verificationMeta[k], content: siteVerification[k] }));
