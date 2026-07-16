import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SiteShell from "@/app/components/SiteShell";
import { projects, projectBySlug } from "@/data/projects";

type Params = { slug: string };

/** Pre-render one static HTML file per project at build time. */
export async function generateStaticParams(): Promise<Params[]> {
  return projects.map((p) => ({ slug: p.slug }));
}

// Only the known project slugs exist; anything else is a real 404.
export const dynamicParams = false;

/** Per-page title + OG/Twitter, baked into each project's static HTML. */
export function generateMetadata({ params }: { params: Params }): Metadata {
  const p = projectBySlug(params.slug);
  if (!p) return {};

  const title = `${p.title} · Seema Jain`;
  const description = p.subtitle;
  // Existing hero image; root-relative path is resolved to an absolute URL
  // against metadataBase (set in the root layout).
  const image = (p.overlayHero ?? p.hero).src;
  const url = `/work/${p.slug}/`;

  return {
    title,
    description,
    openGraph: { type: "article", title, description, url, images: [image] },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

export default function WorkPage({ params }: { params: Params }) {
  if (!projectBySlug(params.slug)) notFound();
  return <SiteShell initialSlug={params.slug} />;
}
