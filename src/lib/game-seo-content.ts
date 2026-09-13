import { SITE_NAME } from "@/lib/site-config";
import { descriptionToMetaDescription } from "@/lib/meta-description";
import type { FaqItemInput } from "@/lib/structured-data/types";

export type GameSeoSpec = {
  label: string;
  value: string;
};

export type GameSeoContent = {
  overviewTitle: string;
  overview: string[];
  specs: GameSeoSpec[];
  howToTitle: string;
  howToSteps: string[];
  tipsTitle: string;
  tipLabel: string;
  mistakeLabel: string;
  proTip: string;
  commonMistake: string;
  unblockedTitle: string;
  unblocked: string;
  faqs: FaqItemInput[];
};

type GameSeoInput = {
  title: string;
  slug: string;
  description: string | null;
  categories: { slug: string; name: string }[];
};

function primaryGenre(categories: { slug: string; name: string }[]): {
  name: string;
  lower: string;
  slug: string;
} {
  const primary = categories[0];
  if (!primary) {
    return { name: "browser", lower: "browser", slug: "games" };
  }
  const name = primary.name.replace(/\s+games$/i, "").trim() || primary.name;
  return { name, lower: name.toLowerCase(), slug: primary.slug };
}

function isStylingSlug(slug: string): boolean {
  return (
    slug === "dress-up" ||
    slug === "makeup" ||
    slug === "fashion" ||
    slug === "salon" ||
    slug === "princess" ||
    slug === "wedding" ||
    slug === "celebrity"
  );
}

function overviewFromDescription(title: string, description: string | null, genre: { lower: string; slug: string }): string[] {
  if (description?.trim()) {
    const plain = descriptionToMetaDescription(description, 520);
    if (plain) {
      if (isStylingSlug(genre.slug)) {
        return [
          plain,
          `${title} lives on ${SITE_NAME} as a free ${genre.lower} closet you open in a tab. Dress the character, then leave whenever you like — nothing installs.`,
        ];
      }
      return [
        plain,
        `${SITE_NAME} hosts ${title} as a free ${genre.lower} title in the browser. Press play when you have a few minutes; close the tab when you are done.`,
      ];
    }
  }

  if (isStylingSlug(genre.slug)) {
    return [
      `${title} is a free ${genre.lower} game on ${SITE_NAME}. Open the closet, try a look, and skip any app store step.`,
      `It is HTML5, so a laptop, tablet, or phone can start the same page. Build one outfit, then another, without making an account.`,
    ];
  }

  return [
    `${title} is a free ${genre.lower} game on ${SITE_NAME}. The rules show up on the first screen, so you can start without a long tutorial.`,
    `The page is HTML5. Desktop, tablet, and phone all use the same link — no installer and no extra login.`,
  ];
}

function howToSteps(title: string, genreSlug: string): string[] {
  switch (genreSlug) {
    case "dress-up":
      return [
        `Load ${title} and wait for the character and closet to appear.`,
        "Tap or click garments, wigs, and extras. Swap pieces until the silhouette feels finished.",
        "Change a color or reset the rack if the look feels crowded.",
        "Keep the snapshot if the game offers a save, then start a second theme from a clean base.",
      ];
    case "makeup":
      return [
        `Open ${title} and pick the face or palette the first screen shows.`,
        "Layer base, eyes, lips, and extras one at a time so you can undo a shade.",
        "Soft light and one bold feature usually read better than painting every zone.",
        "Save the face if a camera button exists, then try a night-out or school-day version.",
      ];
    case "fashion":
      return [
        `Start ${title} and scan the runway brief or style prompt if one is listed.`,
        "Build from shoes or a hero jacket, then fill the rest of the look around that piece.",
        "Drop anything that fights the color story before you add bags or jewelry.",
        "Lock the outfit if the game lets you, then remix it for a second event.",
      ];
    case "salon":
      return [
        `Launch ${title} and choose the chair, client, or hairstyle board.`,
        "Cut, color, or style in the order the tools appear — wet, cut, then finish.",
        "Check the outline in the mirror before you add clips or extra dye.",
        "Send the client out if that is the goal, or restyle the same head for a new vibe.",
      ];
    case "princess":
      return [
        `Enter ${title} and pick the castle scene or royal closet.`,
        "Start with a gown or crown, then add gloves, shoes, and a smaller accessory.",
        "Keep one metallic (gold or silver) so the look stays readable.",
        "Pose or save if the game offers it, then dress a second character for a ball.",
      ];
    case "wedding":
      return [
        `Open ${title} and choose the ceremony, reception, or couple scene.`,
        "Fit the dress or suit first, then veil, flowers, and shoes.",
        "Match metals and florals instead of mixing every decoration at once.",
        "Capture the couple if a photo tool exists, then try a second color palette.",
      ];
    case "celebrity":
      return [
        `Start ${title} and pick the red-carpet, interview, or street-style set.`,
        "Choose a statement piece (coat, dress, or boots), then keep the rest quieter.",
        "Hair and makeup should support the outfit, not compete with it.",
        "Save the press look if you can, then build a casual off-duty version.",
      ];
    case "cooking":
      return [
        `Open ${title} and read the order or recipe card.`,
        "Add ingredients in the sequence shown — rush only after you know the steps.",
        "Serve or plate before the timer if the kitchen uses one.",
        "Replay the same dish to clean up wasted moves and raise the score.",
      ];
    case "puzzle":
      return [
        `Start ${title} and note the first board’s win rule — match, sort, or path.`,
        "Make a small test move so you learn how tiles react before you commit.",
        "Clear space near the edges when the grid starts to choke.",
        "Replay a tough stage after you see the pattern; fewer wasted taps usually win.",
      ];
    case "racing":
      return [
        `Load ${title} and pick a car or course if the menu offers a choice.`,
        "Steer with the keys or the on-screen wheel. Ease off before a tight bend.",
        "Pass rivals on the straights; do not clip walls on the exit.",
        "Run the same track again to shave time once you know the corners.",
      ];
    case "sports":
      return [
        `Open ${title} and take the practice shot or kick the game shows first.`,
        "Time the swing, throw, or tap using the on-screen meter if there is one.",
        "Aim for a clean score rather than a lucky full-power hit.",
        "Replay a miss immediately — most sports builds reward a second try.",
      ];
    case "strategy":
      return [
        `Begin ${title} on the first map and learn what you can build or spend.`,
        "Protect one core resource before you open a second front.",
        "Spend upgrades on the unit or tower that already works, then branch out.",
        "Restart a lost map with a tighter plan instead of spreading thin again.",
      ];
    case "arcade":
      return [
        `Press play in ${title} and learn the one or two buttons the intro shows.`,
        "Stay alive through the first difficulty bump before you chase combos.",
        "Grab a pickup only when it does not throw you into a hazard.",
        "Die, restart, and beat your last run — that is the whole loop.",
      ];
    case "action":
      return [
        `Start ${title} and move through the first arena using the shown keys or stick.`,
        "Learn the basic attack or jump before you hold specials.",
        "Watch health and ammo; duck out of a wave if the screen floods.",
        "Retry a failed stage with a calmer route instead of mashing.",
      ];
    default:
      return [
        `Open ${title} on ${SITE_NAME} and wait for the play button to finish loading.`,
        "Follow the first on-screen hint — tap, drag, or use the keyboard as shown.",
        "Finish the opening goal, then explore extra modes if the menu lists them.",
        "Leave and come back later; the same link works on another device.",
      ];
  }
}

function tipsForGenre(title: string, genreSlug: string): { proTip: string; commonMistake: string } {
  switch (genreSlug) {
    case "dress-up":
      return {
        proTip: `In ${title}, lock a base (jeans + tee, or a single dress) before you hunt accessories. The closet reads faster when one piece is the hero.`,
        commonMistake:
          "Piling every layer hides the shape. Strip back to three items, then add one bag or necklace.",
      };
    case "makeup":
      return {
        proTip: `In ${title}, pick one feature to push — liner, blush, or lip — and keep the rest softer.`,
        commonMistake:
          "Painting eyes, cheeks, and lips at full intensity at once usually muddies the face. Undo two layers and look again.",
      };
    case "fashion":
      return {
        proTip: `In ${title}, repeat one color in shoes and a small accessory so the outfit feels planned.`,
        commonMistake:
          "A loud print plus loud jewelry plus loud shoes fights itself. Let one item shout.",
      };
    case "salon":
      return {
        proTip: `In ${title}, finish the cut before you dump extra color. Shape first, pigment second.`,
        commonMistake:
          "Adding clips and dye before the haircut is set makes the head look busy. Check the silhouette in the mirror.",
      };
    case "princess":
      return {
        proTip: `In ${title}, pair a simple gown with one sparkling extra, or a busy gown with quiet shoes.`,
        commonMistake:
          "Crown, cape, and giant jewelry together hide the dress. Remove one royal piece.",
      };
    case "wedding":
      return {
        proTip: `In ${title}, match the bouquet metal to the jewelry. Gold with gold, silver with silver.`,
        commonMistake:
          "Too many floral overlays on the dress wash out the couple. Keep flowers in the hands or hair, not both plus the hem.",
      };
    case "celebrity":
      return {
        proTip: `In ${title}, treat the photo backdrop as part of the outfit — dark sets like bright clothes, bright sets like darker tailoring.`,
        commonMistake:
          "Copying every trend on one character looks costume-y. Pick a decade or a color and stop.",
      };
    case "cooking":
      return {
        proTip: `In ${title}, prep the next ingredient while something simmers if the kitchen allows multitasking.`,
        commonMistake:
          "Dumping everything in at once burns the dish. Wait for the prompt or the timer tick.",
      };
    case "puzzle":
      return {
        proTip: `In ${title}, scan the whole board once before the first tap. The leftover awkward tile is usually the real puzzle.`,
        commonMistake:
          "Spending a booster on a board you could clear with two planned moves. Save boosts for cramped layouts.",
      };
    case "racing":
      return {
        proTip: `In ${title}, lift off before the apex and roll back on through the exit. Late braking into a wall costs more than a slow entry.`,
        commonMistake:
          "Pinning the accelerator the whole lap. The car needs a moment to settle or it slides wide.",
      };
    case "sports":
      return {
        proTip: `In ${title}, take the 70% power shot you can aim. Full bars miss more than they highlight.`,
        commonMistake:
          "Ignoring the wind or angle meter and blaming the physics. Read the UI, then shoot.",
      };
    case "strategy":
      return {
        proTip: `In ${title}, get one production building humming before you expand. A thin empire collapses on the first rush.`,
        commonMistake:
          "Researching every branch at once. Finish a lane (economy or defense) so the next fight is even.",
      };
    case "arcade":
      return {
        proTip: `In ${title}, learn the first hazard pattern by dying on purpose once. The next run is for score.`,
        commonMistake:
          "Chasing every coin through a spike. Skip a pickup if the lane is dirty.",
      };
    case "action":
      return {
        proTip: `In ${title}, land the basic hit-confirm before you spam the special. Clean strings beat panic buttons.`,
        commonMistake:
          "Standing still to empty a clip. Strafe, then shoot — most waves punish statues.",
      };
    default:
      return {
        proTip: `In ${title}, finish the opening screen slowly. The game usually teaches its only trick in the first minute.`,
        commonMistake:
          "Skipping the hint text and assuming the controls. One extra glance at the UI saves a restart.",
      };
  }
}

export function getGameSeoContent(input: GameSeoInput): GameSeoContent {
  const genre = primaryGenre(input.categories);
  const overview = overviewFromDescription(input.title, input.description, genre);
  const tips = tipsForGenre(input.title, genre.slug);
  const styling = isStylingSlug(genre.slug);

  return {
    overviewTitle: `About ${input.title}`,
    overview,
    specs: [
      { label: "Built with", value: "HTML5" },
      { label: "Controls", value: styling ? "Tap / click to dress" : "Keyboard, mouse, or touch" },
      { label: "Progress", value: "Saved in this browser when the game supports it" },
      { label: "Play mode", value: "Single player" },
      { label: "Where it runs", value: "Browser on computer, tablet, or phone" },
      { label: "Collection", value: genre.name },
    ],
    howToTitle: `Start ${input.title} in your browser`,
    howToSteps: howToSteps(input.title, genre.slug),
    tipsTitle: styling ? `${input.title} closet notes` : `${input.title} pointers`,
    tipLabel: "Worth knowing",
    mistakeLabel: "Easy to miss",
    proTip: tips.proTip,
    commonMistake: tips.commonMistake,
    unblockedTitle: styling
      ? `Open ${input.title} on ${SITE_NAME}`
      : `${input.title} on ${SITE_NAME}`,
    unblocked: styling
      ? `${input.title} is a free ${genre.lower} game on ${SITE_NAME}. It loads as HTML5 in a normal tab — search the title, press play, and style a look on whatever screen you have.`
      : `${input.title} is a free ${genre.lower} game on ${SITE_NAME}. It runs as HTML5 in a regular tab, so you do not install an app. Network filters still decide what opens.`,
    faqs: buildGameSpecificFaqs(input.title, genre, input.description),
  };
}

function buildGameSpecificFaqs(
  title: string,
  genre: { name: string; lower: string; slug: string },
  description: string | null
): FaqItemInput[] {
  const styling = isStylingSlug(genre.slug);
  const faqs: FaqItemInput[] = [
    {
      question: `Do I pay to play ${title}?`,
      answer: `No. ${title} is free on ${SITE_NAME}. Open the page and start — there is no store checkout for the game itself.`,
    },
    {
      question: `Where can I open ${title}?`,
      answer: `${title} runs in a normal browser tab on ${SITE_NAME}. If a school or work filter blocks the site, that is the network, not a missing download.`,
    },
    {
      question: `What kind of game is ${title}?`,
      answer: styling
        ? `${title} sits in the ${genre.name} collection on ${SITE_NAME}. Look there for more closets, makeup, and fashion pages.`
        : `${title} is filed under ${genre.name} on ${SITE_NAME}. Use that collection page if you want similar titles.`,
    },
  ];

  if (genre.slug === "dress-up" || genre.slug === "fashion") {
    faqs.push({
      question: `How do I change clothes in ${title}?`,
      answer: `Tap or click items in the closet. Mix tops, bottoms, shoes, and extras until you like the silhouette. Most builds let you undo or reset.`,
    });
  } else if (genre.slug === "makeup" || genre.slug === "salon") {
    faqs.push({
      question: `How do the tools work in ${title}?`,
      answer: `Pick a tool from the tray, then tap the face or hair. Go slowly — one shade at a time is easier to undo.`,
    });
  } else if (genre.slug === "cooking") {
    faqs.push({
      question: `How do I finish a recipe in ${title}?`,
      answer: `Follow the ticket or recipe steps in order, then serve. A second run of the same dish is the fastest way to learn the timing.`,
    });
  } else if (genre.slug === "puzzle") {
    faqs.push({
      question: `How do you clear a board in ${title}?`,
      answer: `Read the first level’s rule, then clear tiles or paths without wasting moves. Replay a stage when you see the leftover awkward piece.`,
    });
  } else if (genre.slug === "racing") {
    faqs.push({
      question: `How do you drive in ${title}?`,
      answer: `Use the arrows, WASD, or the on-screen wheel. Lift before a tight corner, then accelerate out. A clean lap beats a messy full-throttle one.`,
    });
  } else if (genre.slug === "strategy") {
    faqs.push({
      question: `What should I build first in ${title}?`,
      answer: `Get one resource or defense working, then expand. A single solid lane beats unlocking every option on minute one.`,
    });
  } else {
    faqs.push({
      question: `How do the controls work in ${title}?`,
      answer: `Desktop players usually use a keyboard and mouse. On a phone, tap and drag. The first screen of ${title} shows the exact layout.`,
    });
  }

  if (description?.trim()) {
    faqs.push({
      question: `What happens in ${title}?`,
      answer: descriptionToMetaDescription(description, 220),
    });
  } else {
    faqs.push({
      question: `Will ${title} remember my progress?`,
      answer: `If ${title} saves, it usually uses this browser’s local storage. A new device or cleared site data can reset the closet or score.`,
    });
  }

  return faqs;
}
