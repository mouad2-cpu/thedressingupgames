import { SITE_NAME } from "@/lib/site-config";
import type { FaqItemInput } from "@/lib/structured-data/types";

export type SeoContent = {
  aboutTitle: string;
  paragraphs: string[];
  faqs: FaqItemInput[];
};

export type CategorySeoContent = SeoContent;

type CategoryLabels = {
  title: string;
  name: string;
  lower: string;
};

function labelsFrom(name: string): CategoryLabels {
  const trimmed = name.trim();
  const title = /games$/i.test(trimmed) ? trimmed : `${trimmed} Games`;
  const nameOnly = title.replace(/\s+games$/i, "").trim() || trimmed;
  return {
    title,
    name: nameOnly,
    lower: nameOnly.toLowerCase(),
  };
}

const CATEGORY_SEO_BY_SLUG: Record<string, (labels: CategoryLabels) => CategorySeoContent> = {
  action: (l) => ({
    aboutTitle: "About this category",
    paragraphs: [
      `${l.title} on ${SITE_NAME} are unblocked HTML5 titles built for fast reactions — shooting, combos, traps, and short bursts of combat you can open in a browser tab.`,
      `Expect wave arenas, run-and-gun stages, and boss fights with simple keyboard or touch controls. Sessions can last two minutes or a full campaign, and nothing needs to be installed.`,
      `These ${l.lower} games are a core part of our unblocked games library: click play, load the HTML5 build, and start. Filters still vary by network, but you never download an app to try.`,
    ],
    faqs: [
      {
        question: `Are ${l.lower} games unblocked here?`,
        answer: `They run as HTML5 games in a normal browser tab on ${SITE_NAME}, which is how most unblocked action games are played.`,
      },
      {
        question: `Do I need to download ${l.lower} games?`,
        answer: "No. Open the game page and play in your browser.",
      },
      {
        question: `Can beginners play ${l.lower} games?`,
        answer: "Yes. Many start with simple controls and ramp difficulty as you go.",
      },
      {
        question: `Do ${l.lower} games work on mobile?`,
        answer: "Most titles support touch as well as desktop keyboards.",
      },
    ],
  }),
  puzzle: (l) => ({
    aboutTitle: "About this category",
    paragraphs: [
      `${l.title} are unblocked brain games: match tiles, stack blocks, connect paths, and clear boards in your browser.`,
      `Levels teach a rule, then twist it. You can solve at your own pace or chase a tighter move count — all without installing a puzzle app.`,
      `Play free ${l.lower} games on ${SITE_NAME} as HTML5 unblocked games on desktop, tablet, or phone.`,
    ],
    faqs: [
      {
        question: `Are ${l.lower} games free unblocked games?`,
        answer: `Yes. ${l.title} on ${SITE_NAME} are free HTML5 browser games with no download.`,
      },
      {
        question: `Are ${l.lower} games good for kids?`,
        answer: "Many are family-friendly logic games, though difficulty varies by title.",
      },
      {
        question: `Can I play ${l.lower} games on a phone?`,
        answer: "Yes. Click, drag, and tap controls work well on mobile browsers.",
      },
      {
        question: `Are ${l.lower} games timed?`,
        answer: "Some boards have timers or move limits; others let you think as long as you want.",
      },
    ],
  }),
  racing: (l) => ({
    aboutTitle: "About this category",
    paragraphs: [
      `${l.title} are unblocked driving games you launch in a tab — karts, circuits, traffic, and drift challenges.`,
      `Steer with keys or on-screen controls, chase lap times, and unlock faster cars. No racing installer required.`,
      `Open free ${l.lower} games on ${SITE_NAME} whenever you want a short unblocked race on desktop or mobile.`,
    ],
    faqs: [
      {
        question: `Do ${l.lower} games work without downloading?`,
        answer: "Yes. They are HTML5 unblocked browser games.",
      },
      {
        question: `Can I play ${l.lower} games with a keyboard?`,
        answer: "Most desktop builds use arrows or WASD; phones use touch steering.",
      },
      {
        question: `Are ${l.lower} games free?`,
        answer: `Yes. Play ${l.lower} games free on ${SITE_NAME}.`,
      },
      {
        question: `Are these unblocked racing games?`,
        answer: "They load in a standard browser tab, which is the usual unblocked-games setup.",
      },
    ],
  }),
  sports: (l) => ({
    aboutTitle: "About this category",
    paragraphs: [
      `${l.title} bring penalties, shootouts, golf, and arcade matches to ${SITE_NAME} as unblocked browser games.`,
      `Play a single hole or a full tournament in HTML5 — no sports app, no download.`,
      `These ${l.lower} games fit a short break: open the tab, take a shot, leave when the bell rings.`,
    ],
    faqs: [
      {
        question: `What ${l.lower} games can I play?`,
        answer: "Soccer, basketball, golf, billiards, and other athletic HTML5 challenges.",
      },
      {
        question: `Do I need an account?`,
        answer: `No. Unblocked ${l.lower} games on ${SITE_NAME} play in the browser without sign-up.`,
      },
      {
        question: `Can I play on a phone?`,
        answer: "Yes. Most sports titles support mobile browsers.",
      },
      {
        question: `Are ${l.lower} games free?`,
        answer: "Yes. They are free online unblocked games.",
      },
    ],
  }),
  "dress-up": (l) => ({
    aboutTitle: "About this category",
    paragraphs: [
      `${l.title} on ${SITE_NAME} are unblocked fashion games: closets, makeup, salons, and character creators you open in a browser tab.`,
      `Mix outfits, hair, and accessories with tap or click controls. No dress-up app and no download — just HTML5 play.`,
      `Search unblocked dress-up games when you want a free styling session on desktop, Chromebook, or phone. Filters still vary by network.`,
    ],
    faqs: [
      {
        question: `Are ${l.lower} games unblocked here?`,
        answer: `Yes. ${l.title} on ${SITE_NAME} load as HTML5 in a normal browser tab, which is how unblocked dress-up games are played.`,
      },
      {
        question: `Do I need to download ${l.lower} games?`,
        answer: "No. Open the game page and play free in your browser.",
      },
      {
        question: `Can I play ${l.lower} games on a phone?`,
        answer: "Yes. Most dress-up titles use touch controls as well as a mouse on desktop.",
      },
      {
        question: `Are ${l.lower} games free?`,
        answer: `Yes. Play ${l.lower} games unblocked and free on ${SITE_NAME}.`,
      },
    ],
  }),
  arcade: (l) => ({
    aboutTitle: "About this category",
    paragraphs: [
      `${l.title} are classic unblocked time-killers: one more run, a higher score, simple rules.`,
      `Runners, shooters, stackers, and retro-style hits load as HTML5 games in your browser.`,
      `On ${SITE_NAME}, free ${l.lower} games are picked for instant unblocked play at home, school, or anywhere a website still opens.`,
    ],
    faqs: [
      {
        question: `Are ${l.lower} games free to play?`,
        answer: `Yes. All ${l.lower} games on ${SITE_NAME} are free unblocked HTML5 games.`,
      },
      {
        question: `What makes a game arcade?`,
        answer: "Simple controls, short rounds, rising difficulty, and score chasing.",
      },
      {
        question: `Can kids play ${l.lower} games?`,
        answer: "Many arcade titles are casual; check the game page if you need extra context.",
      },
      {
        question: `Do scores save?`,
        answer: "Some games store a local high score in the browser; others reset each session.",
      },
    ],
  }),
  strategy: (l) => ({
    aboutTitle: "About this category",
    paragraphs: [
      `${l.title} are unblocked planning games: towers, resources, units, and turn-based tactics in the browser.`,
      `Learn the first mission, then tighten your build. HTML5 strategy titles here need no download.`,
      `Play free ${l.lower} games on ${SITE_NAME} when you want unblocked games that reward thinking, not only reflexes.`,
    ],
    faqs: [
      {
        question: `Are ${l.lower} games hard for beginners?`,
        answer: "Most start with a tutorial or easy mode, then add systems.",
      },
      {
        question: `Do ${l.lower} games need a powerful PC?`,
        answer: "No. These are HTML5 unblocked browser games for typical laptops and phones.",
      },
      {
        question: `Are there tower defense games?`,
        answer: `Yes. Tower defense sits in ${l.title} along with other tactics titles.`,
      },
      {
        question: `Can I play ${l.lower} games unblocked?`,
        answer: `They open in a normal tab on ${SITE_NAME}. Network filters still vary.`,
      },
    ],
  }),
};

function buildGenericCategorySeo(labels: CategoryLabels): CategorySeoContent {
  return {
    aboutTitle: "About this category",
    paragraphs: [
      `${labels.title} on ${SITE_NAME} are free unblocked browser games you can play instantly — no downloads and no sign-up.`,
      `Every title is HTML5, so it loads in the tab on desktop, tablet, or mobile. Pick a game from the grid and start in seconds.`,
      `Looking for unblocked games in the ${labels.lower} genre? Open your browser, choose a title, and play.`,
    ],
    faqs: [
      {
        question: `What are ${labels.title}?`,
        answer: `${labels.title} are free unblocked ${labels.lower} games on ${SITE_NAME}.`,
      },
      {
        question: `Do I need to download ${labels.lower} games?`,
        answer: "No. All games run in your web browser.",
      },
      {
        question: `Can I play ${labels.lower} games on mobile?`,
        answer: "Yes. Most titles work on mobile and tablet browsers as well as desktop.",
      },
      {
        question: `Are ${labels.title} free?`,
        answer: `Yes. ${labels.title} on ${SITE_NAME} are free to play online.`,
      },
    ],
  };
}

export function getCategorySeoContent(slug: string, name: string): CategorySeoContent {
  const labels = labelsFrom(name);
  const builder = CATEGORY_SEO_BY_SLUG[slug];
  return builder ? builder(labels) : buildGenericCategorySeo(labels);
}
