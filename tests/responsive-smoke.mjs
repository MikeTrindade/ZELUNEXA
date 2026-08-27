import { chromium } from 'playwright';

const baseURL = process.env.SITE_URL || 'http://127.0.0.1:4173';
const pages = ['/', '/monitor.html', '/guia.html', '/sobre.html', '/contato.html', '/area-do-cliente.html'];
const viewports = [
  { name: 'mobile-360', width: 360, height: 800 },
  { name: 'mobile-390', width: 390, height: 844 },
  { name: 'mobile-412', width: 412, height: 915 },
  { name: 'tablet-768', width: 768, height: 1024 },
  { name: 'desktop-1366', width: 1366, height: 768 },
  { name: 'desktop-1440', width: 1440, height: 900 },
  { name: 'desktop-1920', width: 1920, height: 1080 },
];

const browser = await chromium.launch({ headless: true });
const failures = [];

for (const viewport of viewports) {
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();

  for (const path of pages) {
    const url = new URL(path, baseURL).href;
    const response = await page.goto(url, { waitUntil: 'networkidle' });
    if (!response || !response.ok()) {
      failures.push(`${viewport.name} ${path}: HTTP ${response?.status() ?? 'sem resposta'}`);
      continue;
    }

    const result = await page.evaluate(() => {
      const root = document.documentElement;
      const body = document.body;
      const overflow = Math.max(root.scrollWidth, body.scrollWidth) - window.innerWidth;
      const badFixed = [...document.querySelectorAll('*')]
        .filter((el) => {
          const style = getComputedStyle(el);
          if (style.display === 'none' || style.visibility === 'hidden') return false;
          const rect = el.getBoundingClientRect();
          return rect.width > 0 && (rect.right > window.innerWidth + 12 || rect.left < -12);
        })
        .slice(0, 8)
        .map((el) => ({
          tag: el.tagName.toLowerCase(),
          className: String(el.className || '').slice(0, 120),
          left: Math.round(el.getBoundingClientRect().left),
          right: Math.round(el.getBoundingClientRect().right),
        }));
      return { overflow, badFixed };
    });

    if (result.overflow > 4) {
      failures.push(`${viewport.name} ${path}: overflow horizontal de ${Math.round(result.overflow)}px. Elementos: ${JSON.stringify(result.badFixed)}`);
    }
  }

  await context.close();
}

await browser.close();

if (failures.length) {
  console.error('\nFalhas de responsividade:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log('OK: páginas validadas em 7 larguras sem overflow horizontal relevante.');
