"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { projects, projectBySlug } from "@/data/projects";
import ProjectPanel from "./ProjectPanel";
import CaseStudyOverlay from "./CaseStudyOverlay";

/**
 * Scene 2 — light Vercel-minimal projects experience.
 * Pinned left rail + stacking full-panel scroll, plus the URL-addressable
 * full-screen case-study overlay (?project=slug).
 */
export default function ProjectsSection() {
  const [active, setActive] = useState(0);
  const [openSlug, setOpenSlug] = useState<string | null>(null);

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

  const activeProject = projects[active];

  return (
    <section id="work" className="relative bg-canvas">
      <div className="mx-auto flex max-w-container gap-xl px-lg">
        {/* Pinned left rail */}
        <aside className="sticky top-0 hidden h-screen w-[34%] flex-col justify-center py-2xl lg:flex">
          <p className="eyebrow text-mute">Selected Work</p>
          <h2 className="mt-md text-heading-lg text-ink">Seema Jain</h2>

          <a
            href="#contact"
            className="group mt-lg inline-flex w-fit items-center justify-between gap-2xl border-b border-ink pb-xs text-heading-md text-ink"
          >
            Get in touch
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              ↗
            </span>
          </a>

          {/* See all + active thumbnail */}
          <div className="mt-3xl flex items-center gap-sm">
            <span className="relative h-14 w-14 overflow-hidden rounded-sm border border-hairline bg-elevated">
              <Image
                src={activeProject.images[0]}
                alt={activeProject.title}
                fill
                sizes="56px"
                className="object-cover"
              />
            </span>
            <div>
              <p className="font-mono text-mono-eyebrow text-mute">
                {activeProject.index} / (0{projects.length})
              </p>
              <p className="text-label-sm text-ink">{activeProject.title}</p>
            </div>
          </div>

          <div className="mt-lg font-mono text-mono-eyebrow text-mute">
            See all ({String(projects.length).padStart(2, "0")})
          </div>
        </aside>

        {/* Stacking panels */}
        <div className="w-full lg:w-[66%]">
          {projects.map((p, i) => (
            <ProjectPanel
              key={p.slug}
              project={p}
              order={i}
              onOpen={open}
              onActive={setActive}
            />
          ))}
        </div>
      </div>

      <CaseStudyOverlay project={openSlug ? projectBySlug(openSlug) ?? null : null} onClose={close} />
    </section>
  );
}
