/**
 * Insert GameSnacks games as published unblocked titles with unique SEO fields.
 * Run: npm run db:seed-gamesnacks-drafts
 */
import { readFileSync } from "fs";
import path from "path";
import { PrismaClient, GameStatus } from "@prisma/client";
import { descriptionToMetaDescription } from "../src/lib/meta-description";
import { SITE_NAME } from "../src/lib/site-config";
import {
  buildUnblockedGameDescription,
  formatUnblockedGameMetaTitle,
} from "../src/lib/unblocked-game-seo";

const prisma = new PrismaClient();

const GENRE_LABEL: Record<string, string> = {
  action: "action",
  puzzle: "puzzle",
  racing: "racing",
  sports: "sports",
  arcade: "arcade",
  strategy: "strategy",
};

type DraftGame = {
  id: string;
  title: string;
  slug: string;
  embed: string;
  thumbnail?: string | null;
  categories: string[];
};

type DraftFile = { games: DraftGame[] };

async function main() {
  const filePath = path.join(__dirname, "gamesnacks-drafts.json");
  const data = JSON.parse(readFileSync(filePath, "utf8")) as DraftFile;

  const categoryMap = Object.fromEntries(
    (await prisma.category.findMany()).map((c) => [c.slug, c.id])
  );

  let created = 0;
  let updated = 0;
  let skipped = 0;

  for (const game of data.games) {
    const catSlugs = game.categories?.length ? game.categories : [];
    const primarySlug = catSlugs[0];
    const primaryCategoryId = primarySlug ? categoryMap[primarySlug] : undefined;
    if (!primaryCategoryId) {
      console.warn(`Skip ${game.slug}: missing category ${primarySlug}`);
      skipped += 1;
      continue;
    }

    const genre = GENRE_LABEL[primarySlug] ?? "browser";
    const description = buildUnblockedGameDescription(game.title, genre, SITE_NAME);
    const metaTitle = formatUnblockedGameMetaTitle(game.title);
    const metaDescription = descriptionToMetaDescription(description);
    const thumbnail = game.thumbnail?.startsWith("/")
      ? game.thumbnail
      : `/game-covers/${game.slug}.png`;

    const existing = await prisma.game.findUnique({ where: { slug: game.slug } });

    const saved = await prisma.game.upsert({
      where: { slug: game.slug },
      update: {
        title: game.title,
        description,
        metaTitle,
        metaDescription,
        thumbnail,
        embedPath: game.embed,
        primaryCategoryId,
        status: GameStatus.published,
      },
      create: {
        title: game.title,
        slug: game.slug,
        description,
        metaTitle,
        metaDescription,
        thumbnail,
        embedPath: game.embed,
        featured: false,
        status: GameStatus.published,
        primaryCategoryId,
        addedAt: new Date(),
      },
    });

    if (existing) updated += 1;
    else created += 1;

    await prisma.gameCategory.deleteMany({ where: { gameId: saved.id } });
    for (const slug of catSlugs) {
      const categoryId = categoryMap[slug];
      if (!categoryId) continue;
      await prisma.gameCategory.create({
        data: { gameId: saved.id, categoryId },
      });
    }

    console.log(
      `${existing ? "update" : "create"} ${game.slug} [${catSlugs.join(",")}] draft SEO ok`
    );
  }

  console.log(
    `Done. created=${created} updated=${updated} skipped=${skipped} total=${data.games.length}`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
