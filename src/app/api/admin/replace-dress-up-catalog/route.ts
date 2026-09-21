import { NextResponse } from "next/server";
import { readFileSync } from "fs";
import path from "path";
import { GameStatus } from "@prisma/client";
import { adminApiAuth } from "@/lib/admin/api-auth";
import { prisma } from "@/lib/db";
import { descriptionToMetaDescription } from "@/lib/meta-description";
import { PLAYHOP_DRESSUP_SLUGS } from "@/lib/playhop-dressup-slugs";
import { PERMISSIONS } from "@/lib/rbac";
import {
  buildUnblockedDressUpDescription,
  formatUnblockedDressUpMetaTitle,
  formatUnblockedGameMetaTitle,
} from "@/lib/unblocked-game-seo";

export const runtime = "nodejs";

type BatchGame = {
  title: string;
  slug: string;
  embed: string;
  hook: string;
  kind?: "dress-up" | "cooking";
  categories: string[];
};

export async function POST() {
  const auth = await adminApiAuth(PERMISSIONS.GAMES_DELETE);
  if (auth.error) return auth.error;

  try {
    const deleted = await prisma.game.deleteMany({
      where: { slug: { in: [...PLAYHOP_DRESSUP_SLUGS] } },
    });

    await prisma.category.upsert({
      where: { slug: "dress-up" },
      update: { name: "Dress Up", icon: "shirt", showOnHome: true },
      create: { slug: "dress-up", name: "Dress Up", icon: "shirt", sortOrder: 0, showOnHome: true },
    });

    const categoryMap = Object.fromEntries(
      (await prisma.category.findMany()).map((c) => [c.slug, c.id])
    );

    const dressUpId = categoryMap["dress-up"];
    if (dressUpId) {
      await prisma.homePageSection.upsert({
        where: { categoryId: dressUpId },
        update: { published: true, title: "Dress Up" },
        create: {
          categoryId: dressUpId,
          title: "Dress Up",
          layout: "row",
          gameLimit: 14,
          sortOrder: 0,
          placement: "between_top_picks_featured",
          published: true,
        },
      });
    }

    const filePath = path.join(process.cwd(), "prisma", "batch-gamerdam-girls.json");
    const data = JSON.parse(readFileSync(filePath, "utf8")) as { games: BatchGame[] };

    let created = 0;
    let updated = 0;

    for (const game of data.games) {
      const catSlugs = game.categories?.length ? game.categories : ["dress-up"];
      const primaryCategoryId = categoryMap[catSlugs[0]];
      if (!primaryCategoryId) continue;

      const kind = game.kind ?? "dress-up";
      const description = buildUnblockedDressUpDescription(game.title, game.hook, undefined, kind);
      const metaTitle =
        kind === "cooking"
          ? formatUnblockedGameMetaTitle(game.title)
          : formatUnblockedDressUpMetaTitle(game.title);
      const metaDescription = descriptionToMetaDescription(description);
      const thumbnail = `/game-covers/${game.slug}.png`;
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

      if (existing) updated += 1;
      else created += 1;

      await prisma.gameCategory.deleteMany({ where: { gameId: id } });
      for (const slug of catSlugs) {
        const categoryId = categoryMap[slug];
        if (!categoryId) continue;
        await prisma.gameCategory.create({ data: { gameId: id, categoryId } });
      }
    }

    return NextResponse.json({
      ok: true,
      deleted: deleted.count,
      created,
      updated,
      total: data.games.length,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Catalog replace failed" }, { status: 500 });
  }
}
