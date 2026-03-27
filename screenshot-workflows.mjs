import puppeteer from 'puppeteer';

const browser = await puppeteer.launch({
  headless: true,
  executablePath: 'C:/Users/Vincent/.cache/puppeteer/chrome/win64-146.0.7680.153/chrome-win64/chrome.exe',
  args: ['--no-sandbox'],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto('http://localhost:3001', { waitUntil: 'networkidle2' });
await new Promise(r => setTimeout(r, 800));

const ph = await page.evaluate(() => document.body.scrollHeight);
for (let y = 0; y < ph; y += 400) {
  await page.evaluate(yPos => window.scrollTo(0, yPos), y);
  await new Promise(r => setTimeout(r, 80));
}

const top = await page.evaluate(() => {
  const el = document.getElementById('workflows');
  return el ? el.getBoundingClientRect().top + window.scrollY - 70 : 0;
});
await page.evaluate(y => window.scrollTo(0, y), top);
await new Promise(r => setTimeout(r, 500));
await page.screenshot({ path: 'temporary screenshots/crop-workflows.png' });
console.log('Saved crop-workflows.png');
await browser.close();
