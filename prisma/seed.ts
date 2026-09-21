import { PrismaClient, GameStatus, Role } from "@prisma/client";
import bcrypt from "bcrypt";
import { existsSync, readFileSync } from "fs";
import path from "path";
import { descriptionToMetaDescription } from "../src/lib/meta-description";
import { CONTACT_EMAIL, SITE_NAME } from "../src/lib/site-config";
import {
  buildUnblockedDressUpDescription,
  buildUnblockedGameDescription,
  formatUnblockedDressUpMetaTitle,
  formatUnblockedGameMetaTitle,
} from "../src/lib/unblocked-game-seo";
import { PLAYHOP_DRESSUP_SLUGS } from "../src/lib/playhop-dressup-slugs";

const prisma = new PrismaClient();

const categories = [
  {
    slug: "dress-up",
    name: "Dress Up",
    icon: "shirt",
    sortOrder: 0,
    description:
      "Play unblocked dress-up, makeup, salon, and character-creator games on The Dressing Up Games. HTML5 in your browser — no download.",
  },
  { slug: "action", name: "Action", icon: "zap", sortOrder: 1 },
  { slug: "puzzle", name: "Puzzle", icon: "puzzle", sortOrder: 2 },
  { slug: "racing", name: "Racing", icon: "car", sortOrder: 3 },
  { slug: "sports", name: "Sports", icon: "trophy", sortOrder: 4 },
  { slug: "arcade", name: "Arcade", icon: "gamepad", sortOrder: 5 },
  { slug: "strategy", name: "Strategy", icon: "crown", sortOrder: 6 },
];

const FEATURED_SLUGS = new Set([
  "endless-siege",
  "crazy-caves",
  "jewel-academy",
  "fullspeed-racing",
  "hoop-hero",
  "om-nom-run",
  "merge-defenders",
  "element-blocks",
  "the-impossible-quiz",
  "bloons-tower-defense-4",
  "age-of-war",
  "cut-the-rope",
]);

type DraftGame = {
  title: string;
  slug: string;
  embed: string;
  thumbnail?: string | null;
  coverFile?: string;
  categories: string[];
  hook?: string;
  kind?: "dress-up" | "cooking";
};

const GENRE_LABEL: Record<string, string> = {
  "dress-up": "dress-up",
  action: "action",
  puzzle: "puzzle",
  racing: "racing",
  sports: "sports",
  arcade: "arcade",
  strategy: "strategy",
};

function loadGameList(fileName: string): DraftGame[] {
  const filePath = path.join(__dirname, fileName);
  if (!existsSync(filePath)) return [];
  const data = JSON.parse(readFileSync(filePath, "utf8")) as { games?: DraftGame[] };
  return data.games ?? [];
}

function mergeGames(lists: DraftGame[][]): DraftGame[] {
  const bySlug = new Map<string, DraftGame>();
  for (const list of lists) {
    for (const game of list) {
      if (!game?.slug || !game?.embed) continue;
      if (!bySlug.has(game.slug)) bySlug.set(game.slug, game);
    }
  }
  return [...bySlug.values()];
}

async function main() {
  console.log("Seeding database...");

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
  }

  const categoryMap = Object.fromEntries(
    (await prisma.category.findMany()).map((c) => [c.slug, c.id])
  );

  const removedPlayhop = await prisma.game.deleteMany({
    where: { slug: { in: [...PLAYHOP_DRESSUP_SLUGS] } },
  });
  if (removedPlayhop.count > 0) {
    console.log(`Removed ${removedPlayhop.count} old Playhop dress-up games`);
  }

  const drafts = mergeGames([
    loadGameList("gamesnacks-drafts.json"),
    loadGameList("gamesnacks-batches-1-8-seed.json"),
    loadGameList("batch25-gamesnacks.json"),
    loadGameList("batch39-addictinggames.json"),
    loadGameList("batch-gamerdam-girls.json"),
  ]);

  for (const game of drafts) {
    const catSlugs = game.categories?.length ? game.categories : [];
    const primarySlug = catSlugs[0];
    const primaryCategoryId = primarySlug ? categoryMap[primarySlug] : undefined;
    if (!primaryCategoryId) continue;

    const genre = GENRE_LABEL[primarySlug] ?? "browser";
    const description = game.hook
      ? buildUnblockedDressUpDescription(game.title, game.hook, undefined, game.kind ?? "dress-up")
      : buildUnblockedGameDescription(game.title, genre);
    const metaTitle =
      game.kind === "cooking"
        ? formatUnblockedGameMetaTitle(game.title)
        : game.hook || primarySlug === "dress-up"
          ? formatUnblockedDressUpMetaTitle(game.title)
          : formatUnblockedGameMetaTitle(game.title);
    const metaDescription = descriptionToMetaDescription(description);
    const thumbnail = game.thumbnail?.startsWith("/")
      ? game.thumbnail
      : `/game-covers/${game.coverFile ?? `${game.slug}.png`}`;
    const now = new Date();
    const featured = FEATURED_SLUGS.has(game.slug);

    const created = await prisma.game.upsert({
      where: { slug: game.slug },
      update: {
        title: game.title,
        description,
        metaTitle,
        metaDescription,
        thumbnail,
        embedPath: game.embed,
        featured,
        status: GameStatus.published,
        primaryCategoryId,
        releasedAt: now,
      },
      create: {
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

    await prisma.gameCategory.deleteMany({ where: { gameId: created.id } });
    for (const slug of catSlugs) {
      const categoryId = categoryMap[slug];
      if (categoryId) {
        await prisma.gameCategory.create({
          data: { gameId: created.id, categoryId },
        });
      }
    }
  }

  const adminPassword = await bcrypt.hash("admin123", 12);
  await prisma.user.upsert({
    where: { username: "admin" },
    update: { role: Role.SUPER_ADMIN },
    create: {
      username: "admin",
      email: "admin@example.com",
      passwordHash: adminPassword,
      role: Role.SUPER_ADMIN,
    },
  });

  const modPassword = await bcrypt.hash("mod123456", 12);
  await prisma.user.upsert({
    where: { username: "moderator" },
    update: {},
    create: {
      username: "moderator",
      email: "mod@example.com",
      passwordHash: modPassword,
      role: Role.MODERATOR,
    },
  });

  const devPassword = await bcrypt.hash("dev123456", 12);
  const devUser = await prisma.user.upsert({
    where: { username: "devstudio" },
    update: {},
    create: {
      username: "devstudio",
      email: "dev@example.com",
      passwordHash: devPassword,
      role: Role.USER,
    },
  });

  const developer = await prisma.developer.upsert({
    where: { userId: devUser.id },
    update: {},
    create: {
      userId: devUser.id,
      companyName: "Atelier Looks",
      revenueShare: 0.7,
      totalRevenue: 0,
    },
  });

  await prisma.gameUpload.create({
    data: {
      developerId: developer.id,
      title: "Closet Mix",
      description: "A sample dress-up upload for the developer queue.",
      embedPath: "https://example.com/games/closet-mix",
      thumbnail: "https://picsum.photos/seed/closet-mix/400/250",
      scanStatus: "CLEAN",
    },
  });

  const slots = [
    { name: "Homepage Banner", placement: "HOME" as const, cpm: 2.5 },
    { name: "Pre-Game Interstitial", placement: "PRE_GAME" as const, cpm: 4.0 },
    { name: "Sidebar Rectangle", placement: "SIDEBAR" as const, cpm: 1.8 },
  ];

  for (const slot of slots) {
    const existing = await prisma.adSlot.findFirst({ where: { name: slot.name } });
    if (!existing) {
      const created = await prisma.adSlot.create({ data: slot });
      await prisma.adCampaign.create({
        data: {
          name: `${slot.name} - Default`,
          slotId: created.id,
          cpm: slot.cpm,
          impressions: 0,
          clicks: 0,
          isActive: true,
        },
      });
    }
  }

  const platformValue = JSON.stringify({
    siteName: SITE_NAME,
    cdnUrl: "",
    domain: "www.thedressingupgames.com",
    featureFlags: { userRegistration: true, developerUploads: true, adsEnabled: false },
  });

  const existingPlatform = await prisma.platformSetting.findUnique({ where: { key: "platform" } });
  if (existingPlatform?.value.includes("zenfun")) {
    console.warn(
      "This database still has ZenFun settings. Overwriting them. Use a NEW MySQL database — never copy the ZenFun Games database."
    );
  }

  await prisma.platformSetting.upsert({
    where: { key: "platform" },
    update: { value: platformValue },
    create: {
      key: "platform",
      value: platformValue,
    },
  });

  await prisma.moderationFlag.deleteMany({ where: { entityId: "sample" } });
  await prisma.moderationFlag.create({
    data: {
      entityType: "game",
      entityId: "sample",
      reason: "Sample flag for moderation queue demo",
      status: "PENDING",
    },
  });

  const menuPages = [
    {
      slug: "contact",
      title: "Contact Us",
      icon: "mail",
      sortOrder: 1,
      content:
        `Have a question about a dress-up game, a broken closet, or a title we should add? Email us at ${CONTACT_EMAIL}\n\nWe usually reply within 1–2 business days.`,
    },
    {
      slug: "terms",
      title: "Terms of Service",
      icon: "scale",
      sortOrder: 2,
      content:
        "Last updated: September 2026\n\nBy using The Dressing Up Games, you agree to these terms. Please read them before styling or browsing.\n\nUsing our service\nYou may use The Dressing Up Games for personal, non-commercial entertainment. Do not attempt to disrupt the site, abuse other users, or upload harmful content.",
    },
    {
      slug: "privacy",
      title: "Privacy Policy",
      icon: "shield",
      sortOrder: 3,
      content:
        "Last updated: September 2026\n\nThe Dressing Up Games respects your privacy. This policy explains what information we collect and how we use it.\n\nInformation we collect\nWe may collect basic usage data such as pages visited, games played, and cookies used to remember recently opened dress-up games.",
    },
    {
      slug: "information-for-parents",
      title: "Information for Parents",
      icon: "users",
      sortOrder: 4,
      content:
        "Guidance for parents about family-friendly dress-up, makeup, and fashion games on The Dressing Up Games.",
    },
    {
      slug: "dmca-notice",
      title: "DMCA Notice",
      icon: "scale",
      sortOrder: 5,
      content:
        "Digital Millennium Copyright Act notice and takedown procedures for The Dressing Up Games.",
    },
  ];

  for (const page of menuPages) {
    await prisma.menuPage.upsert({
      where: { slug: page.slug },
      update: {
        title: page.title,
        icon: page.icon,
        sortOrder: page.sortOrder,
        content: page.content,
        published: true,
      },
      create: { ...page, published: true },
    });
  }

  console.log(`Seed complete: ${categories.length} categories, ${drafts.length} games, 5 menu pages`);
  console.log(`Public contact email: ${CONTACT_EMAIL}`);
  console.log("Staff: admin/admin123 (SUPER_ADMIN), moderator/mod123456 (MODERATOR)");
  console.log("Developer: devstudio/dev123456");
  console.log("Use a dedicated MySQL database for this site. Never point DATABASE_URL at the ZenFun Games database.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
