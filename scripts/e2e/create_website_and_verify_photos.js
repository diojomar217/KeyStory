const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const BASE = process.env.BASE_URL || `http://localhost:3000`;
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox','--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  page.setDefaultTimeout(60000);

  try {
    await page.goto(`${BASE}/admin/websites/create`, { waitUntil: 'networkidle2' });

    // Fill basic required fields
    await page.waitForSelector('input[name="website_name"]', { timeout: 30000 });
    const slug = 'e2e-' + Date.now().toString().slice(-6);
    await page.focus('input[name="website_name"]');
    await page.keyboard.type(slug);

    await page.focus('input[name="participants.0.name"]');
    await page.keyboard.type('Alice');
    await page.focus('input[name="participants.1.name"]');
    await page.keyboard.type('Bob');

    // Set specialDate to tomorrow
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    await page.evaluate((d) => {
      const el = document.querySelector('input[name="specialDate"]');
      if (el) {
        el.value = d;
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }, tomorrow);

    // Pick the first preset available
    await page.evaluate(() => {
      const btn = document.querySelector('div.grid button[type="button"]');
      if (btn) btn.click();
    });

    await page.waitForTimeout(600);

    // Navigate forward until the gallery file input shows up (or Create Website appears)
    let attempts = 0;
    while (attempts < 12) {
      const fileInput = await page.$('input[type="file"][multiple]');
      if (fileInput) break;

      const hasCreate = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('button')).some(b => /create website/i.test(b.innerText));
      });
      if (hasCreate) break;

      const clicked = await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const c = btns.find(b => /continue/i.test(b.innerText));
        if (c) { c.click(); return true; }
        const n = btns.find(b => /next/i.test(b.innerText));
        if (n) { n.click(); return true; }
        return false;
      });

      if (!clicked) break;
      await page.waitForTimeout(800);
      attempts++;
    }

    // Upload images if file input available
    const fileInput = await page.$('input[type="file"][multiple]');
    if (fileInput) {
      const imgPath = path.resolve(process.cwd(), 'public', 'photo.png');
      // upload same file twice to simulate multiple photos
      await fileInput.uploadFile(imgPath, imgPath);
      await page.waitForTimeout(800);
    }

    // Click Create Website
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => /create website/i.test(b.innerText));
      if (btn) btn.click();
    });

    // Wait for Open Website link in success modal (or fallback to any /site/ link)
    let openHref = null;
    try {
      await page.waitForFunction(() => {
        return Array.from(document.querySelectorAll('a')).some(a => /open website/i.test(a.innerText));
      }, { timeout: 60000 });
      openHref = await page.evaluate(() => {
        const a = Array.from(document.querySelectorAll('a')).find(a => /open website/i.test(a.innerText));
        return a ? a.href : null;
      });
    } catch (err) {
      // fallback: find any anchor with /site/ or /love/
      const anchors = await page.$$eval('a[href]', as => as.map(a => a.href));
      openHref = anchors.find(h => /\/site\//.test(h) || /\/love\//.test(h));
    }

    if (!openHref) {
      console.error('FAIL: Could not find public site link after creation');
      await browser.close();
      process.exit(2);
    }

    // Open public site and check images
    await page.goto(openHref, { waitUntil: 'networkidle2' });
    await page.waitForTimeout(1200);

    const hasBlob = await page.evaluate(() => Array.from(document.images).some(img => !!img.src && img.src.startsWith('blob:')));
    if (hasBlob) {
      console.error('FAIL: Found blob: image src on public site');
      await browser.close();
      process.exit(3);
    }

    const imgs = await page.evaluate(() => Array.from(document.images).map(i => i.src));
    const goodImgs = imgs.filter(s => s && !s.startsWith('blob:') && !s.startsWith('data:') && s.trim().length > 0);
    if (goodImgs.length === 0) {
      console.warn('WARN: No persistent remote image found on public page; this may indicate uploads not configured');
    }

    console.log('PASS: No blob images persisted; persistent images:', goodImgs.slice(0, 5));
    await browser.close();
    process.exit(0);
  } catch (e) {
    console.error('ERROR running E2E test', e);
    await browser.close();
    process.exit(1);
  }
})();
