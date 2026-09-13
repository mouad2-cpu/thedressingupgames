import type { Metadata } from "next";
import { SITE_HOME_PRIMARY_IMAGE, SITE_LOGO, SITE_NAME } from "@/lib/site-config";
import { absoluteUrl } from "@/lib/structured-data/urls";
import { descriptionToMetaDescription } from "@/lib/meta-description";
import { formatUnblockedGameMetaTitle } from "@/lib/unblocked-game-seo";

export function parsePageNumber(pageParam?: string): number {
  return Math.max(1, parseInt(pageParam ?? "1", 10) || 1);
}

function defaultSocialImage() {
  if (SITE_HOME_PRIMARY_IMAGE) {
    return {
      url: SITE_HOME_PRIMARY_IMAGE.path,
      width: SITE_HOME_PRIMARY_IMAGE.width,
      height: SITE_HOME_PRIMARY_IMAGE.height,
      alt: SITE_HOME_PRIMARY_IMAGE.alt,
    };
  }
  return {
    url: SITE_LOGO.path,
    width: SITE_LOGO.width,
    height: SITE_LOGO.height,
    alt: SITE_LOGO.alt,
  };
}

type BuildPageMetadataOptions = {
  path: string;
  title: string;
  description: string;
  /** Site-relative or absolute image URLs for OG/Twitter. */
  images?: string[];
  /** When false, emit noindex. Default true. */
  index?: boolean;
  follow?: boolean;
  /** Open Graph / Twitter title (defaults to `title`). */
  ogTitle?: string;
  /** Skip the root layout title template (e.g. `| The Dressing Up Games`). */
  absoluteTitle?: boolean;
};

/** Game page `<title>` / OG title: `{Name} Unblocked – Play Free Online` */
export function formatGameMetaTitle(gameTitle: string): string {
  return formatUnblockedGameMetaTitle(gameTitle);
}

/** Shared HTML metadata: canonical, robots, Open Graph, Twitter. */
export function buildPageMetadata({
  path,
  title,
  description,
  images,
  index = true,
  follow = true,
  ogTitle,
  absoluteTitle = false,
}: BuildPageMetadataOptions): Metadata {
  const canonical = absoluteUrl(path);
  const resolvedOgTitle = ogTitle ?? title;
  const hasCustomImages = Boolean(images?.length);
  const ogImages = hasCustomImages
    ? images!.map((url) => ({ url }))
    : [defaultSocialImage()];
  const metaDescription = descriptionToMetaDescription(description);

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description: metaDescription,
    alternates: { canonical },
    robots: {
      index,
      follow,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
      googleBot: {
        index,
        follow,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      title: resolvedOgTitle,
      description: metaDescription,
      url: canonical,
      siteName: SITE_NAME,
      type: "website",
      images: ogImages,
    },
    twitter: {
      card: hasCustomImages ? "summary_large_image" : "summary",
      title: resolvedOgTitle,
      description: metaDescription,
      images: ogImages.map((img) => img.url),
    },
  };
}

/** Collection/list pages: canonical to clean path; noindex when paginated or forced. */
export function buildCollectionPageMetadata(options: {
  path: string;
  title: string;
  description: string;
  page?: number;
  forceNoIndex?: boolean;
}): Metadata {
  const page = options.page ?? 1;
  const index = !options.forceNoIndex && page <= 1;
  return buildPageMetadata({
    path: options.path,
    title: options.title,
    description: options.description,
    index,
  });
}

/** Stronger `<head>` copy for collection routes (also used in JSON-LD). */
export const LIST_PAGE_META = {
  popular: {
    path: "/popular",
    title: "Popular Unblocked Games",
    description:
      "The most-played unblocked games and free HTML5 browser games on The Dressing Up Games. Instant play, no download — desktop, tablet, or mobile.",
  },
  new: {
    path: "/new",
    title: "New Unblocked Games",
    description:
      "Fresh unblocked games and new free online HTML5 titles on The Dressing Up Games. Play in your browser with no install.",
  },
  "all-games": {
    path: "/all-games",
    title: "All Unblocked Games & Free Online Games",
    description:
      "The full unblocked games catalog on The Dressing Up Games — action, puzzle, racing, sports, arcade, and strategy HTML5 games. Play free on any device.",
  },
  "top-picks": {
    path: "/top-picks",
    title: "Top Unblocked Games Picks",
    description:
      "A shortlist of unblocked browser games on The Dressing Up Games — featured HTML5 titles mixed with popular free online games.",
  },
  "continue-playing": {
    path: "/continue-playing",
    title: "Continue Playing Unblocked Games",
    description:
      "Resume unblocked games you recently opened on The Dressing Up Games. Jump back into free HTML5 browser titles instantly.",
  },
} as const;
