/**
 * Upsert 50 Playhop / Yandex dress-up games with unique unblocked SEO copy.
 * New and existing rows are published so the pages can rank.
 *
 * Run: npx tsx prisma/seed-playhop-dressup.ts
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

type BatchFile = { games: BatchGame[] };

const FEATURED_SLUGS = new Set([
  "k-pop-stylist-idol-girls",
  "toca-life-habillez-vous-pour-les-filles",
  "pony-creator-jeu-dhabillage-pour-filles",
  "lol-surprise-dolls-unlock-all-100",
]);

async function ensureDressUpCategory() {
  await prisma.category.upsert({
    where: { slug: "dress-up" },
    update: {
      name: "Dress Up",
      icon: "shirt",
      sortOrder: 0,
      showOnHome: true,
      homeLabel: "Dress Up",
      homeSize: "lg",
      homeSortOrder: 0,
      homePlacement: "first",
      description:
        "Play free unblocked dress-up games online. Fashion, makeup, salon, and character creators as HTML5 in your browser — no download.",
    },
    create: {
      slug: "dress-up",
      name: "Dress Up",
      icon: "shirt",
      sortOrder: 0,
      showOnHome: true,
      homeLabel: "Dress Up",
      homeSize: "lg",
      homeSortOrder: 0,
      homePlacement: "first",
      description:
        "Play free unblocked dress-up games online. Fashion, makeup, salon, and character creators as HTML5 in your browser — no download.",
    },
  });
}

async function ensureDressUpHomeSection() {
  const category = await prisma.category.findUnique({ where: { slug: "dress-up" } });
  if (!category) return;

  await prisma.homePageSection.upsert({
    where: { categoryId: category.id },
    update: {
      title: "Dress Up Games Unblocked",
      layout: "grid",
      gameLimit: 49,
      sortOrder: 0,
      placement: "first",
      published: true,
    },
    create: {
      categoryId: category.id,
      title: "Dress Up Games Unblocked",
      layout: "grid",
      gameLimit: 49,
      sortOrder: 0,
      placement: "first",
      published: true,
    },
  });
}

async function main() {
  const filePath = path.join(__dirname, "batch-playhop-dressup.json");
  const data = JSON.parse(readFileSync(filePath, "utf8")) as BatchFile;

  await ensureDressUpCategory();

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
    const primarySlug = catSlugs[0];
    const primaryCategoryId = categoryMap[primarySlug];
    if (!primaryCategoryId) {
      console.warn(`Skip ${game.slug}: missing category ${primarySlug}`);
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
    const featured = FEATURED_SLUGS.has(game.slug);

    const existing = await prisma.game.findUnique({ where: { slug: game.slug } });

    if (existing) {
      await prisma.game.update({
        where: { id: existing.id },
        data: {
          title: game.title,
          description,
          metaTitle,
          metaDescription,
          thumbnail,
          embedPath: game.embed,
          featured,
          status: GameStatus.published,
          primaryCategoryId,
          releasedAt: existing.releasedAt ?? now,
        },
      });

      await prisma.gameCategory.deleteMany({ where: { gameId: existing.id } });
      for (const slug of catSlugs) {
        const categoryId = categoryMap[slug];
        if (!categoryId) continue;
        await prisma.gameCategory.create({
          data: { gameId: existing.id, categoryId },
        });
      }

      updated += 1;
      console.log(`UPDATE published: ${game.slug}`);
      continue;
    }

    const saved = await prisma.game.create({
      data: {
        title: game.title,
        slug: game.slug,
        description,
        metaTitle,
        metaDescription,
        thumbnail,
        embedPath: game.embed,
        featured,
        status: GameStatus.published,
        primaryCategoryId,
        addedAt: now,
        releasedAt: now,
      },
    });

    for (const slug of catSlugs) {
      const categoryId = categoryMap[slug];
      if (!categoryId) continue;
      await prisma.gameCategory.create({
        data: { gameId: saved.id, categoryId },
      });
    }

    created += 1;
    console.log(`CREATE published: ${game.slug}`);
  }

  await ensureDressUpHomeSection();
  console.log("Homepage: Dress Up section + category tile (first)");

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
