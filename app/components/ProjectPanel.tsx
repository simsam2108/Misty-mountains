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
 * One full-viewport project panel. Sticky positioning makes panels stack as
 * you scroll; the inner sharp framed image scales in while the panel is active.
 */
export default function ProjectPanel({
  project,
  onOpen,
  onActive,
  order,
}: Props) {
  const panelRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        frameRef.current,
        { scale: 0.94, opacity: 0.6, yPercent: 4 },
        {
          scale: 1,
          opacity: 1,
          yPercent: 0,
          ease: "none",
          scrollTrigger: {
            trigger: panelRef.current,
            start: "top 80%",
            end: "top 30%",
            scrub: true,
          },
        }
      );

      ScrollTrigger.create({
        trigger: panelRef.current,
        start: "top 55%",
        end: "bottom 55%",
        onToggle: (self) => {
          if (self.isActive) onActive(order);
        },
      });
    }, panelRef);

    return () => ctx.revert();
  }, [onActive, order]);

  return (
    <article
      ref={panelRef}
      data-slug={project.slug}
      className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden border-t border-hairline bg-canvas"
    >
      {/* Soft-focus backdrop */}
      <Image
        src={project.images[0]}
        alt=""
        aria-hidden
        fill
        sizes="100vw"
        className="scale-105 object-cover opacity-40 blur-2xl"
      />
      <div className="absolute inset-0 bg-canvas/40" />

      {/* Sharp framed image */}
      <button
        ref={frameRef}
        type="button"
        onClick={() => onOpen(project.slug)}
        className="group relative z-10 block w-[min(58vw,720px)] overflow-hidden rounded-md border border-hairline bg-elevated shadow-[0_2px_2px_rgba(0,0,0,0.04),0_8px_24px_-6px_rgba(0,0,0,0.12)] will-change-transform"
        aria-label={`Open ${project.title} case study`}
      >
        <span className="block aspect-[16/10] overflow-hidden">
          <Image
            src={project.images[0]}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 90vw, 58vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
          />
        </span>
        <span className="pointer-events-none absolute inset-0 flex items-end justify-end p-md opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <span className="rounded-pill bg-ink px-md py-xs text-body-sm font-medium text-on-primary">
            View case study
          </span>
        </span>
      </button>

      {/* Bottom meta row */}
      <div className="absolute inset-x-0 bottom-0 z-10 border-t border-hairline bg-canvas/80 backdrop-blur">
        <div className="mx-auto flex max-w-container items-baseline justify-between px-lg py-md">
          <span className="font-mono text-mono-eyebrow text-mute">
            {project.index}
          </span>
          <div className="text-center">
            <p className="text-label-sm text-ink">{project.title}</p>
            <p className="text-body-sm text-mute">{project.discipline}</p>
          </div>
          <span className="font-mono text-mono-eyebrow text-mute">
            {project.inProgress ? "In Progress" : `© ${project.year}`}
          </span>
        </div>
      </div>
    </article>
  );
}
