"use client";

import Image from "next/image";
import { useEffect } from "react";
import type { CaseImage, CaseSection, Project } from "@/data/projects";

type Props = {
  project: Project | null;
  onClose: () => void;
};

/** One screenshot in a bordered card with a quiet decision-caption below. */
function Figure({ image }: { image: CaseImage }) {
  return (
    <figure className="m-0">
      <span className="block overflow-hidden rounded-lg border border-hairline bg-hairline-soft p-md sm:p-lg">
        <Image
          src={image.src}
          alt={image.caption ?? ""}
          width={image.width}
          height={image.height}
          sizes="(max-width: 768px) 100vw, 900px"
          className="h-auto w-full rounded-md"
        />
      </span>
      {image.caption ? (
        <figcaption className="mt-sm font-mono text-body-sm leading-5 text-mute">
          {image.caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

/**
 * Renders a section's images in reading order. Consecutive "inline" phone
 * screens batch into a responsive grid; "wide"/"phone"/"full" images each get
 * their own centered row so the rhythm alternates group → single → group.
 */
function SectionImages({ images }: { images: CaseImage[] }) {
  const blocks: React.ReactNode[] = [];
  let run: CaseImage[] = [];

  const flushRun = (key: string) => {
    if (run.length === 0) return;
    const cols =
      run.length >= 3 ? "sm:grid-cols-3" : run.length === 2 ? "sm:grid-cols-2" : "";
    blocks.push(
      <div key={key} className={`grid grid-cols-1 items-start gap-lg ${cols}`}>
        {run.map((img) => (
          <Figure key={img.src} image={img} />
        ))}
      </div>,
    );
    run = [];
  };

  images.forEach((img, i) => {
    if ((img.layout ?? "inline") === "inline") {
      run.push(img);
      return;
    }
    flushRun(`run-${i}`);
    const maxW =
      img.layout === "full" ? "max-w-none" : img.layout === "phone" ? "max-w-[300px]" : "max-w-md";
    blocks.push(
      <div key={img.src} className={`mx-auto w-full ${maxW}`}>
        <Figure image={img} />
      </div>,
    );
  });
  flushRun("run-final");

  return <div className="mt-xl flex flex-col gap-xl">{blocks}</div>;
}

/** Renders body copy, splitting blank-line-separated text into paragraphs. */
function Prose({ text, className }: { text: string; className: string }) {
  const paragraphs = text.split(/\n\n+/);
  return (
    <>
      {paragraphs.map((p, i) => (
        <p key={i} className={i === 0 ? className : `mt-md ${className}`}>
          {p}
        </p>
      ))}
    </>
  );
}

/** One case-study section: reading column of copy + wider image column. */
function SectionBlock({ section: s }: { section: CaseSection }) {
  return (
    <section>
      <div className="mx-auto max-w-3xl">
        <h2 className="text-heading-md text-ink">{s.heading}</h2>
        <Prose text={s.body} className="mt-md text-body-lg text-body" />

        {s.points ? (
          <ul className="mt-lg flex flex-col gap-sm">
            {s.points.map((p) => (
              <li key={p} className="flex gap-sm text-body-lg text-body">
                <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-mute" />
                <span>{p}</span>
              </li>
            ))}
          </ul>
        ) : null}

        {s.callout ? (
          <aside className="mt-xl rounded-md border border-hairline bg-elevated p-lg">
            {s.callout.label ? (
              <p className="font-mono text-mono-eyebrow uppercase text-mute">
                {s.callout.label}
              </p>
            ) : null}
            <Prose text={s.callout.body} className="mt-sm text-body-lg text-body" />
          </aside>
        ) : null}

        {s.metrics ? (
          <dl className="mt-xl grid grid-cols-1 gap-lg border-y border-hairline py-lg sm:grid-cols-3">
            {s.metrics.map((m) => (
              <div key={m.label}>
                <dt className="text-heading-lg text-ink">{m.value}</dt>
                <dd className="mt-xxs text-body-md text-mute">{m.label}</dd>
              </div>
            ))}
          </dl>
        ) : null}
      </div>

      {s.images ? (
        <div className="mx-auto max-w-5xl">
          <SectionImages images={s.images} />
        </div>
      ) : null}
    </section>
  );
}

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
    // Pause Lenis so the page behind can't scroll (avoids a second scrollbar);
    // Lenis.stop() adds the .lenis-stopped class that locks overflow.
    window.lenis?.stop();
    document.documentElement.classList.add("lenis-stopped");
    window.addEventListener("keydown", onKey);
    return () => {
      window.lenis?.start();
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
      data-lenis-prevent
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

        {/* Hero image — rendered at its true ratio so nothing crops */}
        <div className="mt-2xl overflow-hidden rounded-lg border border-hairline bg-elevated">
          <Image
            src={(project.overlayHero ?? project.hero).src}
            alt={project.title}
            width={(project.overlayHero ?? project.hero).width}
            height={(project.overlayHero ?? project.hero).height}
            priority
            sizes="(max-width: 1200px) 100vw, 1200px"
            className="h-auto w-full"
          />
        </div>

        {/* Sections — copy in a narrow reading column, images breathe wider */}
        <div className="mt-3xl flex flex-col gap-3xl">
          {project.sections.map((s) => (
            <SectionBlock key={s.heading} section={s} />
          ))}
        </div>
      </article>
    </div>
  );
}
