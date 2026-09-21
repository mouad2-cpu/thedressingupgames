import { createWriteStream, readFileSync } from "node:fs";
import { mkdir } from "node:fs/promises";
import { pipeline } from "node:stream/promises";
import path from "node:path";
import { Readable } from "node:stream";

const OUT_DIR = path.join(process.cwd(), "public", "game-covers");
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36";

const games = JSON.parse(
  readFileSync(path.join("prisma", "batch-gamerdam-girls.json"), "utf8")
).games;

const LISTINGS = [
  "https://gamerdam.com/dress-up-games/",
  "https://gamerdam.com/dress-up-games/page/2/",
  "https://gamerdam.com/makeup-games/",
  "https://gamerdam.com/barbie-games/",
  "https://gamerdam.com/pony-games/",
  "https://gamerdam.com/toca-life-games/",
  "https://gamerdam.com/gacha-life-games/",
  "https://gamerdam.com/tiktok-games/",
  ...Array.from({ length: 8 }, (_, i) =>
    i === 0
      ? "https://gamerdam.com/games-for-girls/"
      : `https://gamerdam.com/games-for-girls/page/${i + 1}/`
  ),
];

async function fetchText(url) {
  const res = await fetch(url, {
    headers: { "user-agent": UA, accept: "text/html,*/*" },
    redirect: "follow",
    signal: AbortSignal.timeout(25000),
  });
  if (!res.ok) return "";
  return res.text();
}

async function download(url, dest) {
  const res = await fetch(url, {
    headers: { "user-agent": UA, accept: "image/avif,image/webp,image/*,*/*" },
    redirect: "follow",
    signal: AbortSignal.timeout(25000),
  });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  await pipeline(Readable.fromWeb(res.body), createWriteStream(dest));
}

const coverMap = new Map();
for (const url of LISTINGS) {
  const html = await fetchText(url);
  if (!html) {
    console.log(`LIST FAIL ${url}`);
    continue;
  }
  const imgs = [...html.matchAll(/src="(\/uploads\/posts\/[^"]+\.(?:png|jpe?g|webp))"/gi)];
  for (const [, src] of imgs) {
    const file = src.split("/").pop()?.replace(/\.(png|jpe?g|webp)$/i, "") ?? "";
    const slug = file.replace(/^\d+_/, "");
    if (!slug) continue;
    if (!coverMap.has(slug)) coverMap.set(slug, `https://gamerdam.com${src}`);
  }
  console.log(`LIST ${url} covers=${coverMap.size}`);
}

await mkdir(OUT_DIR, { recursive: true });
let ok = 0;
let fail = 0;

for (const game of games) {
  const dest = path.join(OUT_DIR, `${game.slug}.png`);
  let url = coverMap.get(game.slug);
  if (!url) {
    const hit = [...coverMap.entries()].find(([slug]) => slug.includes(game.slug) || game.slug.includes(slug));
    url = hit?.[1];
  }
  if (!url) {
    fail += 1;
    console.log(`NOCOVER ${game.slug}`);
    continue;
  }
  const full = url.replace("/thumbs/", "/");
  try {
    await download(full, dest);
    ok += 1;
    console.log(`OK ${game.slug} <- ${full}`);
  } catch {
    try {
      await download(url, dest);
      ok += 1;
      console.log(`OK-THUMB ${game.slug} <- ${url}`);
    } catch (e) {
      fail += 1;
      console.log(`FAIL ${game.slug} ${e.message}`);
    }
  }
}

console.log(JSON.stringify({ ok, fail, total: games.length, mapped: coverMap.size }));
