const { chromium } = require('puppeteer');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:8003');
  const visibility = await page.evaluate(() => {
    const brand = document.querySelector('.brand');
    if (!brand) return 'no .brand';
    return window.getComputedStyle(brand).display;
  });
  console.log('Brand display:', visibility);
  await browser.close();
})();
