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
 * (position: sticky); as you scroll, the next card rises up and covers the
 * previous one while the pinned card zooms out and fades back (GSAP-scrubbed
 * — single scroll system). Every screenshot sits on the same fixed 16/10
 * tinted mat (object-contain, never cropped).
 */
export default function ProjectStage({
  project,
  onOpen,
  onActive,
  order,
}: Props) {
  const cardRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      // Fuel-style zoom-out: as the next card rises to its pin point, this
      // card recedes. The last card has no successor, so it never recedes.
      const nextCard = cardRef.current?.nextElementSibling;
      if (!prefersReduced && nextCard?.classList.contains("stack-card")) {
        gsap.fromTo(
          cardRef.current,
          { scale: 1 },
          {
            scale: 0.96,
            transformOrigin: "center top",
            ease: "none",
            scrollTrigger: {
              trigger: nextCard,
              start: "top bottom",
              end: "top 80px",
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
      style={{ "--i": order } as React.CSSProperties}
      className="stack-card group mt-2xl flex flex-col overflow-hidden rounded-t-lg border border-hairline bg-canvas px-lg pb-md pt-lg shadow-[0_1px_1px_rgba(0,0,0,0.04)]"
    >
      {/* Tinted mat — click opens the case study */}
      <div className="flex flex-1 items-center justify-center">
        <button
          type="button"
          onClick={() => onOpen(project.slug)}
          aria-label={`Open ${project.title} case study`}
          className="project-stage relative flex items-center justify-center overflow-hidden rounded-md border border-hairline outline-none focus-visible:ring-2 focus-visible:ring-link focus-visible:ring-offset-2 focus-visible:ring-offset-elevated"
        >
          <span className="project-shot absolute flex items-center justify-center">
            <Image
              src={project.hero.src}
              alt={project.title}
              width={project.hero.width}
              height={project.hero.height}
              sizes="(max-width: 768px) 90vw, 736px"
              loading="lazy"
              className="h-auto max-h-full w-auto max-w-full rounded-sm object-contain"
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
