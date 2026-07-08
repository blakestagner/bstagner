const { chromium } = require('playwright');

async function run() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 1000 }, deviceScaleFactor: 3 });
  await page.goto('http://localhost:3001', { waitUntil: 'networkidle' });
  await page.locator('#components').scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  const cc = page.locator('.calendar-container').first();
  await cc.scrollIntoViewIfNeeded();
  await page.waitForTimeout(200);
  const box = await cc.boundingBox();
  console.log('box', box);
  await page.screenshot({
    path: '/Users/blakestagner/Documents/GitHub/bstagner/.playwright-verification/calendar-bottom-3x.png',
    clip: { x: box.x, y: box.y + box.height - 90, width: box.width, height: 90 }
  });
  await browser.close();
}
run();
