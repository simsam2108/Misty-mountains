"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { projects, projectBySlug } from "@/data/projects";
import ProjectStage from "./ProjectStage";
import CaseStudyOverlay from "./CaseStudyOverlay";

/**
 * Scene 2 — light Vercel-minimal projects gallery.
 * Uniform 16/10 mat frames (one per project) + a sticky "where am I"
 * counter, plus the URL-addressable full-screen case-study overlay.
 */
export default function ProjectsSection() {
  const [active, setActive] = useState(0);
  const [inView, setInView] = useState(false);
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  // Sync overlay <-> URL (shallow, deep-linkable, back-button friendly)
  const setUrl = useCallback((slug: string | null) => {
    const url = new URL(window.location.href);
    if (slug) url.searchParams.set("project", slug);
    else url.searchParams.delete("project");
    window.history.pushState({}, "", url);
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

  // Deep-link on load + browser back/forward
  useEffect(() => {
    const sync = () => {
      const slug = new URL(window.location.href).searchParams.get("project");
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

      {/* Sticky "where am I" counter — bottom-left, only within Work */}
      <div
        aria-hidden
        className={`pointer-events-none fixed bottom-lg left-lg z-30 font-mono text-mono-eyebrow text-mute transition-opacity duration-500 ${
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
