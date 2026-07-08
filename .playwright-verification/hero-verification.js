const { chromium } = require('playwright');
const path = require('path');

async function verifyHeroAnimation() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1
  });

  const page = await context.newPage();

  // Console error monitoring
  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  try {
    console.log('1. Navigating to localhost:3000...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

    // Wait for first paint
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(100);

    console.log('2. Verifying hero elements exist...');

    // Check if cosmic-birth canvas exists
    const canvas = page.locator('canvas.cosmic-birth');
    const canvasExists = await canvas.count() > 0;
    console.log(`Canvas exists: ${canvasExists}`);

    if (canvasExists) {
      const canvasBounds = await canvas.boundingBox();
      console.log(`Canvas dimensions: ${canvasBounds?.width}x${canvasBounds?.height}`);
    }

    // Check hero text elements with more specific selectors
    const blakeHeading = page.locator('h1#anim1');
    const stagnerHeading = page.locator('h2#anim2');
    const viewWorkCTA = page.locator('text=View My Work').first();
    const getInTouchCTA = page.locator('text=Get in Touch').first();

    console.log(`Blake heading visible: ${await blakeHeading.isVisible()}`);
    console.log(`Stagner heading visible: ${await stagnerHeading.isVisible()}`);
    console.log(`View My Work CTA visible: ${await viewWorkCTA.isVisible()}`);
    console.log(`Get in Touch CTA visible: ${await getInTouchCTA.isVisible()}`);

    // Get hero section bounds for cropped screenshots
    const heroSection = page.locator('section').first(); // Assuming hero is first section
    const heroBounds = await heroSection.boundingBox();

    console.log('3. Capturing timeline screenshots...');

    // Timeline screenshots at specified intervals
    const screenshots = [
      { delay: 300, name: 'hero-00.png', phase: 'flash/explosion phase' },
      { delay: 1200, name: 'hero-01.png', phase: 'sparks expanding + shockwave' },
      { delay: 2500, name: 'hero-02.png', phase: 'sun formed, planets starting' },
      { delay: 4000, name: 'hero-03.png', phase: 'planets in orbit' },
      { delay: 6000, name: 'hero-04.png', phase: 'settled living state' }
    ];

    for (const shot of screenshots) {
      await page.waitForTimeout(shot.delay);
      console.log(`Capturing ${shot.phase} at ${shot.delay}ms`);

      if (heroBounds) {
        await page.screenshot({
          path: `/Users/blakestagner/Documents/GitHub/bstagner/.playwright-verification/${shot.name}`,
          clip: heroBounds
        });
      } else {
        await page.screenshot({
          path: `/Users/blakestagner/Documents/GitHub/bstagner/.playwright-verification/${shot.name}`
        });
      }
    }

    console.log('4. Testing reduced motion...');
    await context.close();

    // New context with reduced motion
    const reducedMotionContext = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      reducedMotion: 'reduce'
    });

    const reducedMotionPage = await reducedMotionContext.newPage();
    await reducedMotionPage.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    await reducedMotionPage.waitForTimeout(1000);

    const reducedHeroSection = reducedMotionPage.locator('section').first();
    const reducedHeroBounds = await reducedHeroSection.boundingBox();

    if (reducedHeroBounds) {
      await reducedMotionPage.screenshot({
        path: '/Users/blakestagner/Documents/GitHub/bstagner/.playwright-verification/hero-reduced.png',
        clip: reducedHeroBounds
      });
    } else {
      await reducedMotionPage.screenshot({
        path: '/Users/blakestagner/Documents/GitHub/bstagner/.playwright-verification/hero-reduced.png'
      });
    }

    await reducedMotionContext.close();

    console.log('5. Testing mobile viewport...');

    // Mobile context
    const mobileContext = await browser.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 2
    });

    const mobilePage = await mobileContext.newPage();
    await mobilePage.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    await mobilePage.waitForTimeout(1000);

    // Check mobile text readability
    const mobileBlakeHeading = mobilePage.locator('h1#anim1');
    const mobileStagnerHeading = mobilePage.locator('h2#anim2');

    console.log(`Mobile Blake heading visible: ${await mobileBlakeHeading.isVisible()}`);
    console.log(`Mobile Stagner heading visible: ${await mobileStagnerHeading.isVisible()}`);

    // Check for horizontal overflow
    const bodyWidth = await mobilePage.evaluate(() => document.body.scrollWidth);
    const viewportWidth = 390;
    const hasOverflow = bodyWidth > viewportWidth;
    console.log(`Mobile overflow check - Body width: ${bodyWidth}, Viewport: ${viewportWidth}, Has overflow: ${hasOverflow}`);

    const mobileHeroSection = mobilePage.locator('section').first();
    const mobileHeroBounds = await mobileHeroSection.boundingBox();

    if (mobileHeroBounds) {
      await mobilePage.screenshot({
        path: '/Users/blakestagner/Documents/GitHub/bstagner/.playwright-verification/hero-mobile.png',
        clip: mobileHeroBounds
      });
    } else {
      await mobilePage.screenshot({
        path: '/Users/blakestagner/Documents/GitHub/bstagner/.playwright-verification/hero-mobile.png'
      });
    }

    await mobileContext.close();

    // Final verification summary
    console.log('\n=== VERIFICATION SUMMARY ===');
    console.log(`Console errors during load/animation: ${consoleErrors.length}`);
    if (consoleErrors.length > 0) {
      consoleErrors.forEach(error => console.log(`  ERROR: ${error}`));
    }

    console.log('Screenshots captured successfully');
    console.log('Verification complete!');

  } catch (error) {
    console.error('Verification failed:', error);
  } finally {
    await browser.close();
  }
}

verifyHeroAnimation();