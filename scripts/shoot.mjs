import puppeteer from 'puppeteer-core';

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const BASE = 'http://localhost:4399';
const OUT = '/tmp/shots';

const pages = [
  { name: 'home', path: '/', full: true },
  { name: 'home-mobile', path: '/', full: true, mobile: true },
  { name: 'download', path: '/download/', full: true },
  { name: 'contact', path: '/contact/', full: true },
  { name: 'docs-index', path: '/docs/', full: true },
  { name: 'docs-guide', path: '/docs/guides/companions/', full: true },
  { name: 'en-home', path: '/en/', full: true },
];

const fs = await import('node:fs');
fs.mkdirSync(OUT, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--no-sandbox', '--hide-scrollbars', '--force-color-profile=srgb'],
});

for (const p of pages) {
  const page = await browser.newPage();
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await page.setViewport({
    width: p.mobile ? 390 : 1366,
    height: p.mobile ? 844 : 900,
    deviceScaleFactor: 1,
  });
  await page.goto(`${BASE}${p.path}`, { waitUntil: 'networkidle0', timeout: 60000 });
  // scroll through to trigger any lazy hydration / observers
  await page.evaluate(async () => {
    await new Promise((res) => {
      let y = 0;
      const step = () => {
        window.scrollBy(0, 600);
        y += 600;
        if (y < document.body.scrollHeight) setTimeout(step, 40);
        else { window.scrollTo(0, 0); setTimeout(res, 400); }
      };
      step();
    });
  });
  await new Promise((r) => setTimeout(r, 500));
  const file = `${OUT}/${p.name}.png`;
  await page.screenshot({ path: file, fullPage: !!p.full });
  const { size } = fs.statSync(file);
  console.log(`✓ ${p.name} -> ${file} (${Math.round(size / 1024)}KB)`);
  await page.close();
}

await browser.close();
console.log('done');
