/**
 * Upsert kept Gamerdam girls games with unblocked SEO copy and original o.gamerdam.com/ho iframes.
 * Run: npx tsx prisma/seed-gamerdam-girls.ts
 */
import { copyFileSync, existsSync, mkdirSync, readFileSync } from "fs";
import path from "path";
import { PrismaClient, GameStatus } from "@prisma/client";
import { descriptionToMetaDescription } from "../src/lib/meta-description";
import {
  buildUnblockedDressUpDescription,
  formatUnblockedDressUpMetaTitle,
  formatUnblockedGameMetaTitle,
} from "../src/lib/unblocked-game-seo";

const prisma = new PrismaClient();

type BatchGame = {
  title: string;
  slug: string;
  embed: string;
  hook: string;
  kind?: "dress-up" | "cooking";
  categories: string[];
};

async function main() {
  const filePath = path.join(__dirname, "batch-gamerdam-girls.json");
  const data = JSON.parse(readFileSync(filePath, "utf8")) as { games: BatchGame[] };

  await prisma.category.upsert({
    where: { slug: "dress-up" },
    update: { name: "Dress Up", icon: "shirt", showOnHome: true },
    create: { slug: "dress-up", name: "Dress Up", icon: "shirt", sortOrder: 0, showOnHome: true },
  });

  const coversSrc = path.join(process.cwd(), "public", "game-covers");
  const thumbsDir = path.join(process.cwd(), "public", "uploads", "thumbnails");
  mkdirSync(thumbsDir, { recursive: true });

  const categoryMap = Object.fromEntries(
    (await prisma.category.findMany()).map((c) => [c.slug, c.id])
  );

  let created = 0;
  let updated = 0;
  let skipped = 0;
  let missingCovers = 0;

  for (const game of data.games) {
    const catSlugs = game.categories?.length ? game.categories : ["dress-up"];
    const primaryCategoryId = categoryMap[catSlugs[0]];
    if (!primaryCategoryId) {
      skipped += 1;
      continue;
    }

    const coverName = `${game.slug}.png`;
    const coverPath = path.join(coversSrc, coverName);
    if (existsSync(coverPath)) {
      copyFileSync(coverPath, path.join(thumbsDir, coverName));
    } else {
      missingCovers += 1;
      console.warn(`Missing cover: ${coverName}`);
    }

    const kind = game.kind ?? "dress-up";
    const description = buildUnblockedDressUpDescription(game.title, game.hook, undefined, kind);
    const metaTitle =
      kind === "cooking"
        ? formatUnblockedGameMetaTitle(game.title)
        : formatUnblockedDressUpMetaTitle(game.title);
    const metaDescription = descriptionToMetaDescription(description);
    const thumbnail = `/uploads/thumbnails/${game.slug}.png`;
    const now = new Date();

    const existing = await prisma.game.findUnique({ where: { slug: game.slug } });
    const payload = {
      title: game.title,
      description,
      metaTitle,
      metaDescription,
      thumbnail,
      embedPath: game.embed,
      featured: false,
      status: GameStatus.published,
      primaryCategoryId,
    };

    const id = existing
      ? (
          await prisma.game.update({
            where: { id: existing.id },
            data: { ...payload, releasedAt: existing.releasedAt ?? now },
          })
        ).id
      : (
          await prisma.game.create({
            data: { ...payload, slug: game.slug, addedAt: now, releasedAt: now },
          })
        ).id;

    if (existing) {
      updated += 1;
      console.log(`UPDATE published: ${game.slug}`);
    } else {
      created += 1;
      console.log(`CREATE published: ${game.slug}`);
    }

    await prisma.gameCategory.deleteMany({ where: { gameId: id } });
    for (const slug of catSlugs) {
      const categoryId = categoryMap[slug];
      if (!categoryId) continue;
      await prisma.gameCategory.create({ data: { gameId: id, categoryId } });
    }
  }

  console.log(JSON.stringify({ created, updated, skipped, missingCovers }, null, 2));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
