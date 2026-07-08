const { chromium } = require('playwright');

async function run() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 1000 } });
  await page.goto('http://localhost:3001', { waitUntil: 'networkidle' });
  await page.locator('#components').scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);

  const calendarContainer = page.locator('.calendar-container');
  const count = await calendarContainer.count();
  console.log('calendar-container count:', count);
  if (count > 0) {
    await calendarContainer.first().scrollIntoViewIfNeeded();
    await page.waitForTimeout(200);
    const box = await calendarContainer.first().boundingBox();
    console.log('calendar-container box:', box);
    await calendarContainer.first().screenshot({ path: '.playwright-verification/calendar-container-only.png' });
  }

  await page.screenshot({ path: '.playwright-verification/calendar-fullpage.png', fullPage: true });

  await browser.close();
}
run();
