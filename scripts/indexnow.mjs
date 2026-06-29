#!/usr/bin/env node
/**
 * Submit all sitemap URLs to IndexNow.
 *
 * IndexNow is a shared protocol — one ping notifies Bing, Yandex, Seznam,
 * Naver and Yep at once (Google does NOT consume it). Ownership is proven by
 * the key file hosted at https://www.nomifun.com/<key>.txt, so no per-engine
 * account or login is required.
 *
 * The key file must already be live before running this (the engines fetch it
 * to validate the request). Run after a deploy:  npm run indexnow
 */

const HOST = 'www.nomifun.com';
const KEY = '9d1defeed8db9c6817c586b7d267e735';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const SITEMAP = `https://${HOST}/sitemap-0.xml`;
const ENDPOINT = 'https://api.indexnow.org/indexnow';

const res = await fetch(SITEMAP);
if (!res.ok) {
  console.error(`Could not fetch sitemap (${res.status}). Is the site deployed?`);
  process.exit(1);
}
const xml = await res.text();
const urlList = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
if (urlList.length === 0) {
  console.error('No <loc> URLs found in the sitemap.');
  process.exit(1);
}

const body = { host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList };
const submit = await fetch(ENDPOINT, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify(body),
});

// 200 = accepted, 202 = accepted (key validation pending). Both are success.
const ok = submit.status === 200 || submit.status === 202;
console.log(`IndexNow: submitted ${urlList.length} URLs -> HTTP ${submit.status} ${submit.statusText}`);
process.exit(ok ? 0 : 1);
