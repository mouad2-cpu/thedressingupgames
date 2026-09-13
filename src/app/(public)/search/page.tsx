import type { Metadata } from "next";
import { searchGames } from "@/lib/games";
import { SearchPageView } from "@/components/pages/search-page-view";
import { buildPageMetadata } from "@/lib/seo-metadata";

type Props = {
  searchParams: Promise<{ s?: string; page?: string }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { s } = await searchParams;
  const query = s?.trim() ?? "";

  // Always noindex: search is blocked in robots.txt and has no unique SEO value.
  if (!query) {
    return buildPageMetadata({
      path: "/search",
      title: "Search Games",
      description:
        "Search unblocked games and free HTML5 browser games on The Dressing Up Games. Find action, puzzle, racing, sports, and more.",
      index: false,
    });
  }

  return buildPageMetadata({
    path: "/search",
    title: `Search: ${query}`,
    description: `Search results for “${query}” on The Dressing Up Games — unblocked games and free online HTML5 titles.`,
    index: false,
  });
}

export default async function SearchPage({ searchParams }: Props) {
  const { s, page: pageParam } = await searchParams;
  const query = s?.trim() ?? "";
  const page = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);

  if (!query) {
    return <SearchPageView games={[]} query="" />;
  }

  const { games } = await searchGames(query, page);

  return <SearchPageView games={games} query={query} />;
}
