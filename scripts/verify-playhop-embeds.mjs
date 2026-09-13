import { readFileSync } from "fs";
import path from "path";

const batch = JSON.parse(
  readFileSync(path.join("prisma", "batch-playhop-dressup.json"), "utf8")
);
const games = batch.games;
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36";

function framePolicy(headers) {
  const xfo = headers.get("x-frame-options");
  const csp = headers.get("content-security-policy") ?? "";
  const ancestors = (csp.match(/frame-ancestors\s+([^;]+)/i) ?? [])[1] ?? "";
  const blocked =
    (xfo && /deny|sameorigin/i.test(xfo)) ||
    (ancestors && !ancestors.includes("*") && !ancestors.includes("thedressingupgames"));
  return { xfo, ancestors: ancestors.trim() || null, blocked };
}

async function checkUrl(url) {
  const started = Date.now();
  try {
    const res = await fetch(url, {
      redirect: "follow",
      headers: { "user-agent": UA, accept: "text/html,*/*" },
      signal: AbortSignal.timeout(25000),
    });
    const text = await res.text();
    const html = /<html|<canvas|yandex|unity|application/i.test(text);
    const policy = framePolicy(res.headers);
    return {
      ok: res.ok,
      status: res.status,
      finalUrl: res.url,
      bytes: text.length,
      html,
      ...policy,
      ms: Date.now() - started,
    };
  } catch (error) {
    return {
      ok: false,
      status: 0,
      error: error.message,
      ms: Date.now() - started,
    };
  }
}

const results = [];
for (const game of games) {
  const appId = (game.embed.match(/app-(\d+)/) ?? game.embed.match(/\/(\d+)\//) ?? [])[1];
  const embed = await checkUrl(game.embed);
  const yandex = appId
    ? await checkUrl(`https://yandex.com/games/app/${appId}`)
    : { skipped: true };
  results.push({
    slug: game.slug,
    title: game.title,
    appId: appId ?? null,
    embed,
    yandex,
  });
  const mark = embed.ok && !embed.blocked ? "OK" : embed.ok ? "FRAME?" : "FAIL";
  console.log(
    `${mark.padEnd(6)} ${String(embed.status).padStart(3)} ${game.slug}  yandex=${yandex.status ?? "-"}`
  );
}

const working = results.filter((r) => r.embed.ok && !r.embed.blocked);
const framed = results.filter((r) => r.embed.ok && r.embed.blocked);
const failed = results.filter((r) => !r.embed.ok);

console.log("\n=== SUMMARY ===");
console.log(JSON.stringify({
  total: results.length,
  embedOk: results.filter((r) => r.embed.ok).length,
  embedBlockedByFramePolicy: framed.length,
  embedFailed: failed.length,
  yandexOk: results.filter((r) => r.yandex.ok).length,
  failedSlugs: failed.map((r) => r.slug),
  framedSlugs: framed.map((r) => ({
    slug: r.slug,
    xfo: r.embed.xfo,
    ancestors: r.embed.ancestors,
  })),
}, null, 2));
