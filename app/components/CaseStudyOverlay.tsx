"use client";

import Image from "next/image";
import { useEffect } from "react";
import type { Project } from "@/data/projects";

type Props = {
  project: Project | null;
  onClose: () => void;
};

/**
 * Full-screen cinematic case-study overlay. Opened by URL (?project=slug) so
 * every project is deep-linkable. Text-rich, single hero image; the data model
 * accepts an image array for richer galleries later.
 */
export default function CaseStudyOverlay({ project, onClose }: Props) {
  useEffect(() => {
    if (!project) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.documentElement.classList.add("lenis-stopped");
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.classList.remove("lenis-stopped");
      window.removeEventListener("keydown", onKey);
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${project.title} case study`}
      className="fixed inset-0 z-50 overflow-y-auto bg-canvas"
    >
      {/* Top bar */}
      <div className="sticky top-0 z-10 border-b border-hairline bg-canvas/90 backdrop-blur">
        <div className="mx-auto flex max-w-container items-center justify-between px-lg py-sm">
          <span className="font-mono text-mono-eyebrow uppercase text-mute">
            {project.index} — {project.org}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-sm border border-hairline bg-elevated px-sm py-xxs text-body-md font-medium text-ink transition-colors hover:bg-hairline-soft"
          >
            Close ✕
          </button>
        </div>
      </div>

      <article className="mx-auto max-w-container px-lg pb-section pt-2xl">
        <header className="max-w-3xl">
          <p className="eyebrow text-mute">
            {project.discipline}
            {project.inProgress ? " · In Progress" : ` · ${project.year}`}
          </p>
          <h1 className="mt-md text-heading-lg text-ink md:text-display-xl">
            {project.title}
          </h1>
          <p className="mt-lg text-body-lg text-body">{project.subtitle}</p>
        </header>

        {/* Meta strip */}
        <dl className="mt-2xl grid grid-cols-2 gap-lg border-y border-hairline py-lg md:grid-cols-4">
          {project.meta.map((m) => (
            <div key={m.label}>
              <dt className="font-mono text-mono-eyebrow uppercase text-mute">
                {m.label}
              </dt>
              <dd className="mt-xxs text-label-sm text-ink">{m.value}</dd>
            </div>
          ))}
        </dl>

        {/* Hero image */}
        <div className="mt-2xl overflow-hidden rounded-lg border border-hairline bg-elevated">
          <span className="relative block aspect-[16/9]">
            <Image
              src={project.images[0]}
              alt={project.title}
              fill
              sizes="(max-width: 1200px) 100vw, 1200px"
              className="object-cover"
            />
          </span>
        </div>

        {/* Sections */}
        <div className="mx-auto mt-3xl max-w-3xl">
          {project.sections.map((s) => (
            <section key={s.heading} className="mb-2xl">
              <h2 className="text-heading-md text-ink">{s.heading}</h2>
              <p className="mt-md text-body-lg text-body">{s.body}</p>
            </section>
          ))}
        </div>
      </article>
    </div>
  );
}
