import puppeteer from 'puppeteer-core';
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const BASE = 'http://localhost:4399';
const OUT = '/tmp/shots';
const fs = await import('node:fs');

const browser = await puppeteer.launch({
  executablePath: CHROME, headless: 'new',
  args: ['--no-sandbox', '--hide-scrollbars', '--force-color-profile=srgb'],
});
const page = await browser.newPage();
await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
await page.setViewport({ width: 1366, height: 860, deviceScaleFactor: 2 });
await page.goto(`${BASE}/`, { waitUntil: 'networkidle0', timeout: 60000 });
// reveal everything + hydrate
await page.evaluate(async () => {
  await new Promise((res) => { let y=0; const s=()=>{window.scrollBy(0,500);y+=500;if(y<document.body.scrollHeight)setTimeout(s,30);else setTimeout(res,300);}; s(); });
});
const offsets = JSON.parse(process.argv[2] || '[0,860,1720,2580,3440,4300,5160,6020,6880,7740]');
for (let i = 0; i < offsets.length; i++) {
  await page.evaluate((y) => window.scrollTo(0, y), offsets[i]);
  await new Promise((r) => setTimeout(r, 350));
  const f = `${OUT}/seg-${String(i).padStart(2,'0')}.png`;
  await page.screenshot({ path: f });
  console.log(`✓ ${f} @${offsets[i]}`);
}
await browser.close();
console.log('done');
