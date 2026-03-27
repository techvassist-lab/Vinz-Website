import puppeteer from 'puppeteer';

const browser = await puppeteer.launch({
  headless: true,
  executablePath: 'C:/Users/Vincent/.cache/puppeteer/chrome/win64-146.0.7680.153/chrome-win64/chrome.exe',
  args: ['--no-sandbox'],
});

const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
await new Promise(r => setTimeout(r, 1000));

// Trigger all scroll animations
const pageHeight = await page.evaluate(() => document.body.scrollHeight);
for (let y = 0; y < pageHeight; y += 400) {
  await page.evaluate(yPos => window.scrollTo(0, yPos), y);
  await new Promise(r => setTimeout(r, 100));
}
await page.evaluate(() => window.scrollTo(0, 0));
await new Promise(r => setTimeout(r, 500));

// Get section offsets
const offsets = await page.evaluate(() => {
  const ids = ['hero','about','skills','achievements','projects','experience','education'];
  return ids.map(id => {
    const el = document.getElementById(id);
    if (!el) return { id, top: 0 };
    return { id, top: Math.max(0, el.getBoundingClientRect().top + window.scrollY - 70) };
  });
});

// Viewport screenshot at each section (no clip - just scroll there)
for (const { id, top } of offsets) {
  await page.evaluate(yPos => window.scrollTo(0, yPos), top);
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: `temporary screenshots/crop-${id}.png` });
  console.log(`Saved crop-${id}.png`);
}

await browser.close();
