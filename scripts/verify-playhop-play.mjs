import { readFileSync, writeFileSync } from "fs";
import path from "path";
import puppeteer from "puppeteer-core";

const games = JSON.parse(
  readFileSync(path.join("prisma", "batch-playhop-dressup.json"), "utf8")
).games;
const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const FAIL_RE =
  /access denied|403 forbidden|404 not found|this site can.?t be reached|err_connection|refused to connect|blocked by cors|unavailable|нет доступа|ошибка/i;

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: ["--disable-gpu", "--no-sandbox", "--disable-dev-shm-usage"],
});
const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 800 });
await page.setUserAgent(
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36"
);

await page.setContent(
  `<!doctype html><html><body style="margin:0">
  <iframe id="g" style="width:100vw;height:100vh;border:0" allowfullscreen></iframe>
  </body></html>`
);

const results = [];
for (const game of games) {
  const docs = [];
  const onResponse = (res) => {
    if (res.url() === game.embed || res.url().startsWith(game.embed)) {
      docs.push(res.status());
    }
  };
  page.on("response", onResponse);

  try {
    await page.evaluate((src) => {
      document.getElementById("g").src = src;
    }, game.embed);

    const frame = await page.waitForFrame(
      (f) => f.url().includes("yandex.net") || f.url() === game.embed,
      { timeout: 15000 }
    ).catch(() => null);

    await new Promise((r) => setTimeout(r, 4000));

    let frameUrl = "";
    let text = "";
    let htmlLen = 0;
    let hasCanvas = false;
    if (frame) {
      frameUrl = frame.url();
      try {
        htmlLen = (await frame.content()).length;
        text = await frame.evaluate(() => (document.body?.innerText ?? "").slice(0, 300));
        hasCanvas = await frame.evaluate(() =>
          Boolean(document.querySelector("canvas, #unity-canvas, #game, #GameCanvas, #unity-container"))
        );
      } catch (error) {
        text = `frame-read: ${error.message}`;
      }
    }

    const http = docs.at(-1) ?? 0;
    const failedText = FAIL_RE.test(text) || FAIL_RE.test(frameUrl);
    const ok = http < 400 && http !== 0 && Boolean(frameUrl) && !failedText && (htmlLen > 200 || hasCanvas);

    const row = {
      slug: game.slug,
      title: game.title,
      status: ok ? "WORKS" : "BROKEN",
      http,
      frameUrl,
      htmlLen,
      hasCanvas,
      preview: text.replace(/\s+/g, " ").slice(0, 100),
    };
    results.push(row);
    console.log(`${row.status} ${game.slug} http=${http} canvas=${hasCanvas} len=${htmlLen}`);
  } catch (error) {
    results.push({ slug: game.slug, title: game.title, status: "BROKEN", reason: error.message });
    console.log(`BROKEN ${game.slug} ${error.message}`);
  } finally {
    page.off("response", onResponse);
  }
}

await browser.close();

const works = results.filter((r) => r.status === "WORKS");
const broken = results.filter((r) => r.status === "BROKEN");
const summary = { total: results.length, works: works.length, broken: broken.length, brokenGames: broken, results };
writeFileSync("scripts/playhop-play-report.json", JSON.stringify(summary, null, 2));
console.log("\n=== PLAY CHECK ===");
console.log(JSON.stringify({ total: summary.total, works: summary.works, broken: summary.broken, brokenGames: broken }, null, 2));
