import { SITE_NAME } from "@/lib/site-config";
import type { SeoContent } from "@/lib/category-seo-content";

export type PageSeoSlug =
  | "new"
  | "popular"
  | "top-picks"
  | "all-games"
  | "continue-playing";

const PAGE_KEY_TO_SLUG: Record<string, PageSeoSlug> = {
  new: "new",
  popular: "popular",
  topPicks: "top-picks",
  allGames: "all-games",
  continuePlaying: "continue-playing",
  "top-picks": "top-picks",
  "all-games": "all-games",
  "continue-playing": "continue-playing",
};

type PageLabels = {
  title: string;
  name: string;
  lower: string;
};

function labelsFrom(name: string): PageLabels {
  const trimmed = name.trim();
  return { title: trimmed, name: trimmed, lower: trimmed.toLowerCase() };
}

const PAGE_SEO_BY_SLUG: Record<string, (labels: PageLabels) => SeoContent> = {
  popular: (l) => ({
    aboutTitle: "About this page",
    paragraphs: [
      `${l.title} on ${SITE_NAME} ranks unblocked games by how often people actually play them — action, arcade, puzzles, racing, sports, and strategy.`,
      `Use this list when you want a proven free online game in a browser tab, with no download. HTML5 titles load the same way other unblocked games do.`,
      `The order shifts as play counts move, so check back when you want a current favorite rather than the newest release.`,
    ],
    faqs: [
      {
        question: `How are ${l.title} ranked?`,
        answer: `By play count on ${SITE_NAME}, so the most-opened unblocked games sit first.`,
      },
      {
        question: `Do I need to download ${l.title}?`,
        answer: "No. These are free HTML5 unblocked browser games.",
      },
      {
        question: `Can I play ${l.title} on mobile?`,
        answer: "Yes. Most popular titles work on phones and tablets as well as desktop.",
      },
      {
        question: `Are ${l.title} unblocked?`,
        answer: `They are designed to play in a normal browser tab on ${SITE_NAME}. Network filters still vary.`,
      },
    ],
  }),
  new: (l) => ({
    aboutTitle: "About this page",
    paragraphs: [
      `${l.title} lists the latest unblocked HTML5 games added to ${SITE_NAME} — action, puzzle, racing, sports, arcade, and strategy.`,
      `Every new title is a no-download browser game. Open it as soon as it goes live if you want something unused.`,
      `Older games stay in the catalog and categories; this page is only the newest arrivals.`,
    ],
    faqs: [
      {
        question: `How often are ${l.title} added?`,
        answer: `${SITE_NAME} publishes new unblocked games regularly. Newest titles appear first here.`,
      },
      {
        question: `Are ${l.title} free to play?`,
        answer: `Yes. ${l.title} are free online HTML5 games with no download.`,
      },
      {
        question: `Can I play ${l.title} at school or work?`,
        answer: "Many HTML5 games work in a standard tab. Availability depends on your network filters.",
      },
      {
        question: `Do ${l.title} work on phones?`,
        answer: "Most new titles support desktop and mobile browsers.",
      },
    ],
  }),
  "top-picks": (l) => ({
    aboutTitle: "About this page",
    paragraphs: [
      `${l.title} on ${SITE_NAME} is a short unblocked-games list: featured HTML5 titles mixed with games people already replay.`,
      `Skip the full catalog when you want a free online game fast — action, puzzles, racing, and more, no installer.`,
      `The mix changes as new unblocked games land and as play counts move.`,
    ],
    faqs: [
      {
        question: `What are ${l.title}?`,
        answer: `Recommended unblocked games on ${SITE_NAME}, combining featured and popular HTML5 titles.`,
      },
      {
        question: `Do ${l.title} require an account?`,
        answer: "No. Play in the browser without signing up.",
      },
      {
        question: `Are ${l.title} updated over time?`,
        answer: "Yes. Picks shift as new games are added and as player interest changes.",
      },
      {
        question: `Can I play ${l.title} on mobile?`,
        answer: "Yes. Most recommended games work on mobile and desktop browsers.",
      },
    ],
  }),
  "all-games": (l) => ({
    aboutTitle: "About this page",
    paragraphs: [
      `${l.title} is the full unblocked games catalog on ${SITE_NAME} — every published HTML5 browser game in one grid.`,
      `Wander the library or jump to Popular and New for a shorter list. Nothing here needs an install.`,
      `Use search or categories when you already know you want racing, puzzles, or sports.`,
    ],
    faqs: [
      {
        question: `What is included in ${l.title}?`,
        answer: `Every free published unblocked browser game currently on ${SITE_NAME}.`,
      },
      {
        question: "Do I need to install anything?",
        answer: "No. These are HTML5 unblocked games — play online with no download.",
      },
      {
        question: "How do I find a specific game?",
        answer: "Use site search, open a category, or scan All Games page by page.",
      },
      {
        question: `Are ${l.title} free?`,
        answer: `Yes. The ${SITE_NAME} catalog is free online browser games.`,
      },
    ],
  }),
  "continue-playing": (l) => ({
    aboutTitle: "About this page",
    paragraphs: [
      `${l.title} brings back unblocked games you recently opened on ${SITE_NAME} in this browser.`,
      `If the list is empty, play any HTML5 game once and it can appear here. Clearing site data may reset it.`,
    ],
    faqs: [
      {
        question: `Why is ${l.title} empty?`,
        answer: "Play an unblocked game first. Recently opened titles in this browser can then show up here.",
      },
      {
        question: `Does ${l.title} sync across devices?`,
        answer: "It is based on this browser only. Switching devices or clearing site data may reset the list.",
      },
      {
        question: "Are these games free?",
        answer: `Yes. ${l.title} only includes free online browser games from ${SITE_NAME}.`,
      },
    ],
  }),
};

const PAGE_DEFAULT_NAMES: Record<PageSeoSlug, string> = {
  new: "New Games",
  popular: "Popular Games",
  "top-picks": "Top Picks",
  "all-games": "All Games",
  "continue-playing": "Continue Playing",
};

function buildGenericPageSeo(labels: PageLabels): SeoContent {
  return {
    aboutTitle: "About this page",
    paragraphs: [
      `${labels.title} on ${SITE_NAME} lists free unblocked browser games you can play instantly — no downloads and no sign-up.`,
      `Every title is HTML5 on desktop, tablet, or mobile. Browse the grid and start playing in seconds.`,
    ],
    faqs: [
      {
        question: `What is the ${labels.title} page?`,
        answer: `This page lists free unblocked games on ${SITE_NAME} related to ${labels.lower}.`,
      },
      {
        question: "Do I need to download these games?",
        answer: "No. All games are free HTML5 browser games.",
      },
      {
        question: "Can I play on mobile?",
        answer: "Yes. Most titles work on mobile and tablet browsers as well as desktop.",
      },
    ],
  };
}

export function getPageSeoContent(slugOrKey: string, name?: string): SeoContent {
  const slug = PAGE_KEY_TO_SLUG[slugOrKey] ?? (slugOrKey as PageSeoSlug);
  const displayName = name?.trim() || PAGE_DEFAULT_NAMES[slug] || slugOrKey;
  const labels = labelsFrom(displayName);
  const builder = PAGE_SEO_BY_SLUG[slug];
  return builder ? builder(labels) : buildGenericPageSeo(labels);
}

export type PageSeoKey = "new" | "popular" | "topPicks" | "allGames" | "continuePlaying";
