import type { Metadata } from "next";
import { AboutPageContent } from "@/components/about/about-page-content";
import { buildPageMetadata } from "@/lib/seo-metadata";

export const metadata: Metadata = buildPageMetadata({
  path: "/about",
  title: "About Us",
  description:
    "Learn about The Dressing Up Games — unblocked games and free HTML5 browser games with no downloads.",
});

export default function AboutPage() {
  return <AboutPageContent />;
}
