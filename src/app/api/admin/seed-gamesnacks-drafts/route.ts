import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { hasPermission, PERMISSIONS } from "@/lib/rbac";
import { prisma } from "@/lib/db";
import { GameStatus } from "@prisma/client";
import { readFileSync } from "fs";
import path from "path";
import { descriptionToMetaDescription } from "@/lib/meta-description";
import { SITE_NAME } from "@/lib/site-config";
import {
  buildUnblockedGameDescription,
  formatUnblockedGameMetaTitle,
} from "@/lib/unblocked-game-seo";

export const runtime = "nodejs";

const GENRE_LABEL: Record<string, string> = {
  action: "action",
  puzzle: "puzzle",
  racing: "racing",
  sports: "sports",
  arcade: "arcade",
  strategy: "strategy",
};

type DraftGame = {
  title: string;
  slug: string;
  embed: string;
  thumbnail?: string | null;
  categories: string[];
};

export async function POST() {
  const session = await getSession();
  if (!session || !hasPermission(session.role, PERMISSIONS.GAMES_EDIT)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const filePath = path.join(process.cwd(), "prisma", "gamesnacks-drafts.json");
    const data = JSON.parse(readFileSync(filePath, "utf8")) as { games: DraftGame[] };

    const categoryMap = Object.fromEntries(
      (await prisma.category.findMany()).map((c) => [c.slug, c.id])
    );

    let created = 0;
    let updated = 0;

    for (const game of data.games) {
      const catSlugs = game.categories?.length ? game.categories : [];
      const primarySlug = catSlugs[0];
      const primaryCategoryId = primarySlug ? categoryMap[primarySlug] : undefined;
      if (!primaryCategoryId) continue;

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
    }

    return NextResponse.json({
      ok: true,
      created,
      updated,
      total: data.games.length,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Seed failed" }, { status: 500 });
  }
}
