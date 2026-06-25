import puppeteer from 'puppeteer-core';
const b = await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:'new',args:['--no-sandbox','--hide-scrollbars']});
const p = await b.newPage();
await p.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]);
await p.setViewport({width:1280,height:900,deviceScaleFactor:2});
await p.goto('http://localhost:4399/',{waitUntil:'networkidle0'});
await p.evaluate(async()=>{await new Promise(r=>{let y=0;const s=()=>{window.scrollBy(0,500);y+=500;if(y<document.body.scrollHeight)setTimeout(s,25);else{window.scrollTo(0,0);setTimeout(r,300)}};s();});});
await new Promise(r=>setTimeout(r,400));
for (const [name, needle] of [['webui','WEBUI · 远程办公'],['native','更 native 的实现']]) {
  const y = await p.evaluate((nd)=>{const els=[...document.querySelectorAll('section')];const el=els.find(e=>e.textContent.includes(nd));if(!el)return -1;el.scrollIntoView();return 1;}, needle);
  await new Promise(r=>setTimeout(r,400));
  await p.screenshot({path:`/tmp/shots/${name}.png`});
  console.log(name, y);
}
await b.close();
