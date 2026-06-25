import puppeteer from 'puppeteer-core';
const b = await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:'new',args:['--no-sandbox','--hide-scrollbars']});
const p = await b.newPage();
await p.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]);
await p.setViewport({width:1366,height:860,deviceScaleFactor:2});
await p.goto('http://localhost:4399/en/',{waitUntil:'networkidle0'});
await p.screenshot({path:'/tmp/shots/en-hero.png'});
await b.close(); console.log('ok');
