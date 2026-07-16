"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { projects, projectBySlug } from "@/data/projects";
import ProjectStage from "./ProjectStage";
import CaseStudyOverlay from "./CaseStudyOverlay";

/**
 * Scene 2 - light Vercel-minimal projects gallery.
 * Uniform 16/10 mat frames (one per project) + a sticky "where am I"
 * counter, plus the URL-addressable full-screen case-study overlay.
 */
// Root-relative base path (empty at the site root; set only if the site is
// ever served under a sub-path). Keeps every URL domain-agnostic.
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

/** Extract a project slug from a `/work/<slug>` pathname, else null. */
function slugFromPath(pathname: string): string | null {
  const m = pathname.slice(BASE_PATH.length).match(/^\/work\/([^/]+)\/?$/);
  return m ? m[1] : null;
}

export default function ProjectsSection({
  initialSlug = null,
}: {
  initialSlug?: string | null;
}) {
  const [active, setActive] = useState(0);
  const [inView, setInView] = useState(false);
  // Seeded from the route on a /work/<slug> page so the overlay is present in
  // the static HTML (and matches on hydration).
  const [openSlug, setOpenSlug] = useState<string | null>(initialSlug);
  const sectionRef = useRef<HTMLElement>(null);

  // Push a real path route so each case study is a shareable, crawlable URL.
  const setUrl = useCallback((slug: string | null) => {
    const path = slug ? `${BASE_PATH}/work/${slug}/` : `${BASE_PATH}/`;
    window.history.pushState({}, "", path);
  }, []);

  const open = useCallback(
    (slug: string) => {
      setOpenSlug(slug);
      setUrl(slug);
    },
    [setUrl]
  );

  const close = useCallback(() => {
    setOpenSlug(null);
    setUrl(null);
  }, [setUrl]);

  // Resolve the open project from the path on load + browser back/forward, and
  // transparently upgrade legacy `?project=<slug>` links to the new path.
  useEffect(() => {
    const sync = () => {
      const url = new URL(window.location.href);
      let slug = slugFromPath(url.pathname);
      const legacy = url.searchParams.get("project");
      if (!slug && legacy && projectBySlug(legacy)) {
        slug = legacy;
        window.history.replaceState({}, "", `${BASE_PATH}/work/${slug}/`);
      }
      setOpenSlug(slug && projectBySlug(slug) ? slug : null);
    };
    sync();
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, []);

  // Show the sticky counter only while the Work section is in view
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: "-20% 0px -20% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section id="work" ref={sectionRef} className="relative bg-canvas">
      <div className="mx-auto max-w-container px-lg pb-2xl">
        <p className="eyebrow py-2xl text-mute">Selected Work</p>

        {projects.map((p, i) => (
          <ProjectStage
            key={p.slug}
            project={p}
            order={i}
            onOpen={open}
            onActive={setActive}
          />
        ))}
      </div>

      {/* Sticky "where am I" counter - bottom-left, only within Work */}
      <div
        aria-hidden
        className={`pointer-events-none fixed bottom-lg left-lg z-30 font-mono text-mono-eyebrow text-mute transition-opacity duration-500 max-md:hidden ${
          inView && !openSlug ? "opacity-100" : "opacity-0"
        }`}
      >
        {projects[active].index} / (0{projects.length})
      </div>

      <CaseStudyOverlay
        project={openSlug ? projectBySlug(openSlug) ?? null : null}
        onClose={close}
        onNavigate={open}
      />
    </section>
  );
}
