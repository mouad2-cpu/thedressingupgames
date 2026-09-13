import { descriptionToMetaDescription } from "@/lib/meta-description";
import { SITE_NAME } from "@/lib/site-config";

export function getCategoryPageDescription(name: string, custom?: string | null): string {
  if (custom?.trim()) return custom.trim();

  const lower = name.toLowerCase();
  return `Play free unblocked ${lower} games online in your browser. Browse ${name} titles on ${SITE_NAME} — HTML5 play, no download.`;
}

export function getCategoryMetaDescription(name: string, custom?: string | null): string {
  return descriptionToMetaDescription(getCategoryPageDescription(name, custom));
}

export function getCategoryPageTitle(name: string): string {
  const trimmed = name.trim();
  if (/games$/i.test(trimmed)) return trimmed;
  return `${trimmed} Games`;
}
