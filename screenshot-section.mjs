import puppeteer from 'puppeteer';

const browser = await puppeteer.launch({
  headless: true,
  executablePath: 'C:/Users/Vincent/.cache/puppeteer/chrome/win64-146.0.7680.153/chrome-win64/chrome.exe',
  args: ['--no-sandbox'],
});

const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
await new Promise(r => setTimeout(r, 800));

// Trigger all animations
const pageHeight = await page.evaluate(() => document.body.scrollHeight);
for (let y = 0; y < pageHeight; y += 600) {
  await page.evaluate(yPos => window.scrollTo(0, yPos), y);
  await new Promise(r => setTimeout(r, 100));
}

const sections = ['#hero', '#about', '#skills', '#achievements', '#projects', '#experience', '#education'];

for (const sel of sections) {
  await page.evaluate(s => {
    document.querySelector(s).scrollIntoView({ behavior: 'instant', block: 'start' });
  }, sel);
  await new Promise(r => setTimeout(r, 400));
  const name = sel.replace('#', '');
  await page.screenshot({ path: `temporary screenshots/section-${name}.png`, clip: { x: 0, y: 0, width: 1440, height: 900 } });
  console.log(`Saved section-${name}.png`);
}

await browser.close();
