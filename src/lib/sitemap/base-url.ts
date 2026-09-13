import { SITE_URL } from "@/lib/site-config";

const PRODUCTION_HOST = "www.thedressingupgames.com";
const PRODUCTION_ORIGIN = `https://${PRODUCTION_HOST}`;

/**
 * Canonical origin for sitemaps, robots, and SEO URLs.
 * Forces https://www.thedressingupgames.com in production; keeps localhost in dev.
 */
export function getSitemapBaseUrl(): string {
  const raw = (process.env.SITEMAP_BASE_URL || SITE_URL || PRODUCTION_ORIGIN).trim();
  try {
    const url = new URL(raw);
    const host = url.hostname.toLowerCase();

    if (host === "localhost" || host === "127.0.0.1") {
      return url.origin.replace(/\/+$/, "");
    }

    if (host === "thedressingupgames.com" || host === "www.thedressingupgames.com") {
      return PRODUCTION_ORIGIN;
    }

    if (url.protocol === "http:") {
      url.protocol = "https:";
    }
    return url.origin.replace(/\/+$/, "");
  } catch {
    return PRODUCTION_ORIGIN;
  }
}

/** Absolute URL using the sitemap canonical origin. */
export function sitemapAbsoluteUrl(path = "/"): string {
  if (/^https?:\/\//i.test(path)) {
    try {
      const incoming = new URL(path);
      if (
        incoming.hostname === "thedressingupgames.com" ||
        incoming.hostname === "www.thedressingupgames.com"
      ) {
        return `${PRODUCTION_ORIGIN}${incoming.pathname}${incoming.search}`;
      }
      return path;
    } catch {
      return path;
    }
  }

  const origin = getSitemapBaseUrl();
  if (!path || path === "/") return origin;
  return `${origin}${path.startsWith("/") ? path : `/${path}`}`;
}
