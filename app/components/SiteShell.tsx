import Nav from "./Nav";
import Hero from "./Hero";
import ProjectsSection from "./ProjectsSection";
import Closing from "./Closing";

/**
 * The full one-page scene. Rendered by both the home route (`/`) and every
 * project route (`/work/<slug>`); on a project route `initialSlug` opens that
 * case study in the overlay at build time, so the case-study markup and its
 * baked meta exist in the served HTML before any JS runs.
 */
export default function SiteShell({
  initialSlug = null,
}: {
  initialSlug?: string | null;
}) {
  return (
    <main id="top">
      <Nav />
      <Hero />
      <ProjectsSection initialSlug={initialSlug} />
      <Closing />
    </main>
  );
}
