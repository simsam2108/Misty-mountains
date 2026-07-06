"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import type { Project } from "@/data/projects";

type Props = {
  project: Project;
  onOpen: (slug: string) => void;
  onActive: (index: number) => void;
  order: number;
};

/**
 * One project in the sticky overlap-stack. Each card is pinned near the top
 * (position: sticky); as you scroll, the next card rises up and cleanly covers
 * the previous one — the cards accumulate into a pile. The gradient stage takes
 * the screenshot's own aspect ratio (object-contain, never cropped) and the
 * inner image drifts subtly (GSAP-scrubbed parallax — single scroll system).
 */
export default function ProjectStage({
  project,
  onOpen,
  onActive,
  order,
}: Props) {
  const cardRef = useRef<HTMLElement>(null);
  const shotRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (!prefersReduced && shotRef.current) {
        const raw = getComputedStyle(document.documentElement)
          .getPropertyValue("--parallax-max")
          .trim();
        const max = parseFloat(raw) || 24;

        // Subtle drift layered on top of the sticky stack.
        gsap.fromTo(
          shotRef.current,
          { y: max },
          {
            y: -max,
            ease: "none",
            scrollTrigger: {
              trigger: cardRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      }

      // Live "where am I" tracking for the sticky counter.
      ScrollTrigger.create({
        trigger: cardRef.current,
        start: "top 55%",
        end: "bottom 55%",
        onToggle: (self) => {
          if (self.isActive) onActive(order);
        },
      });
    }, cardRef);

    return () => ctx.revert();
  }, [onActive, order]);

  return (
    <section
      ref={cardRef}
      data-slug={project.slug}
      style={
        {
          "--stage-ratio": `${project.hero.width} / ${project.hero.height}`,
        } as React.CSSProperties
      }
      className="stack-card group mb-2xl flex flex-col overflow-hidden rounded-lg bg-elevated px-lg pb-md pt-lg shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
    >
      {/* Gradient stage — click opens the case study */}
      <div className="flex flex-1 items-center justify-center">
        <button
          type="button"
          onClick={() => onOpen(project.slug)}
          aria-label={`Open ${project.title} case study`}
          className="project-stage relative flex items-center justify-center overflow-hidden rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-link focus-visible:ring-offset-2 focus-visible:ring-offset-elevated"
        >
          <span
            ref={shotRef}
            className="project-shot absolute inset-0 flex items-center justify-center"
          >
            <Image
              src={project.hero.src}
              alt={project.title}
              width={project.hero.width}
              height={project.hero.height}
              sizes="(max-width: 768px) 90vw, 1080px"
              loading="lazy"
              className="h-full w-full object-contain"
            />
          </span>
        </button>
      </div>

      {/* Caption row — index / title·discipline / year */}
      <div className="mt-md flex w-full items-baseline justify-between border-t border-hairline pt-sm">
        <span className="font-mono text-mono-eyebrow text-mute">
          {project.index}
        </span>
        <div className="text-center">
          <p className="text-label-sm text-ink">
            {project.title}
            <span
              aria-hidden
              className="ml-1 inline-block text-mute opacity-0 transition-all duration-300 group-hover:opacity-100"
            >
              ↗
            </span>
          </p>
          <p className="text-body-sm text-faint">{project.discipline}</p>
        </div>
        <span className="font-mono text-mono-eyebrow text-mute">
          {project.inProgress ? "In Progress" : `© ${project.year}`}
        </span>
      </div>
    </section>
  );
}
