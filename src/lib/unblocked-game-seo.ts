import { SITE_NAME } from "@/lib/site-config";

/** Browser-tab title for non-dress-up games. */
export function formatUnblockedGameMetaTitle(gameTitle: string): string {
  return `Play ${gameTitle} Free Online | No Download`;
}

/** Browser-tab title for dress-up, makeup, and fashion pages. */
export function formatUnblockedDressUpMetaTitle(gameTitle: string): string {
  return `Play ${gameTitle} Free – Dress-Up Game Online`;
}

/**
 * Unique dress-up body copy. `hook` is the game-specific paragraph so pages
 * do not all share the same first 155 characters.
 */
export function buildUnblockedDressUpDescription(
  title: string,
  hook: string,
  siteName = SITE_NAME,
  kind: "dress-up" | "cooking" = "dress-up"
): string {
  if (kind === "cooking") {
    return [
      `${hook} ${title} is a free cooking game on ${siteName} — HTML5 in your tab, nothing to install.`,
      `Open ${title} on a computer, tablet, or phone. There is no account wall. Search **play ${title}** when you want a short kitchen session.`,
      `## Start ${title}`,
      `- Press play and wait for the kitchen or ticket to load.`,
      `- Follow the recipe steps, tap ingredients, and plate the dish.`,
      `- Run the same order again if you want a cleaner time.`,
      `## On ${siteName}`,
      `- Free cooking game, no download`,
      `- Same page on desktop and mobile`,
      `Find **${title}** on ${siteName} and start from the game page.`,
    ].join("\n\n");
  }

  return [
    `${hook} ${title} is a free dress-up game on ${siteName}. It is HTML5 — open the closet in your browser.`,
    `${title} works on a computer, Chromebook, tablet, or phone. No installer and no account. Search **play ${title}** when you want a quick styling session.`,
    `## Start ${title}`,
    `- Press play and wait for the character and rack to appear.`,
    `- Mix clothes, hair, makeup, and extras until the look feels finished.`,
    `- Undo a piece or reset and try a second theme.`,
    `## On ${siteName}`,
    `- Free dress-up game, no download`,
    `- One link for home or school browsers (filters still vary)`,
    `- Desktop, tablet, and phone`,
    `Open **${title}** on ${siteName} from the game page.`,
  ].join("\n\n");
}

/** Seeded descriptions for action, puzzle, racing, and other non-closet titles. */
export function buildUnblockedGameDescription(title: string, genre: string, siteName = SITE_NAME): string {
  return [
    `${title} is a free ${genre} game on ${siteName}. It opens as HTML5 in this tab — no installer and no account.`,
    `Use a computer, tablet, or phone. Search **play ${title}** when you want a short ${genre} session.`,
    `## Start ${title}`,
    `- Press play and read the first on-screen hint.`,
    `- Use keys, mouse, or touch the way the intro shows.`,
    `- Finish the opening goal, then retry if you want a cleaner run.`,
    `## On ${siteName}`,
    `- Free ${genre} game in the browser`,
    `- Same link on desktop and mobile`,
    `Load **${title}** from its page on ${siteName}.`,
  ].join("\n\n");
}
