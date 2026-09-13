import type { Metadata } from "next";
import { TermsOfServicePageContent } from "@/components/legal/terms-of-service-page-content";
import { buildPageMetadata } from "@/lib/seo-metadata";

export const metadata: Metadata = buildPageMetadata({
  path: "/terms-of-service",
  title: "Terms of Service",
  description: "Terms of Service for using The Dressing Up Games and our free unblocked browser games.",
});

export default function TermsOfServicePage() {
  return <TermsOfServicePageContent />;
}
