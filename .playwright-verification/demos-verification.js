const { chromium } = require('playwright');

async function run() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

  const consoleErrors = [];
  page.on('console', msg => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });

  await page.goto('http://localhost:3001', { waitUntil: 'networkidle' });

  const section = page.locator('#components');
  await section.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);

  const menu = page.locator('#components-menu-inner');
  const tabs = ['calendar', 'Todo', 'Measurement', 'TicTacToe'];

  for (let i = 0; i < tabs.length; i++) {
    if (i > 0) {
      await menu.locator(`p:text-is("${tabs[i]}")`).click();
      await page.waitForTimeout(300);
    }
    const selected = await menu.locator('.selected p').textContent();
    console.log(`Tab ${i} (${tabs[i]}) selected text: ${selected}`);
    await section.screenshot({ path: `/Users/blakestagner/Documents/GitHub/bstagner/.playwright-verification/demo-${i}-${tabs[i]}.png` });
  }

  // Extra: bounding boxes for calendar nav buttons vs card
  await menu.locator('p:text-is("calendar")').click();
  await page.waitForTimeout(300);
  const card = page.locator('.calendar-container, .calendar, [class*="calendar"]').first();
  console.log('console errors:', consoleErrors.length ? consoleErrors : 'none');

  await browser.close();
}

run();
