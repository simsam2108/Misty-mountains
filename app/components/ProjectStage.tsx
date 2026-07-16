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

// Root-relative base path; empty at the site root, keeping links domain-agnostic.
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

/**
 * One project in the sticky overlap-stack. Each card is pinned near the top
 * (position: sticky); as you scroll, the next card rises up and covers the
 * previous one while the pinned card zooms out and fades back (GSAP-scrubbed
 * - single scroll system). Every screenshot sits on the same fixed 16/10
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

      // Fuel-style zoom-out: covered cards keep receding as every later
      // card arrives - deeper cards end smaller, so strips read as depth.
      const nextCard = cardRef.current?.nextElementSibling;
      if (!prefersReduced && nextCard?.classList.contains("stack-card")) {
        // querySelectorAll, not a selector string - gsap.context(scope) would
        // scope ".stack-card" to this card's subtree and match nothing.
        const cards = Array.from(
          document.querySelectorAll<HTMLElement>(".stack-card")
        );
        const n = cards.length;
        const lastCard = cards[n - 1];
        const rootStyles = getComputedStyle(document.documentElement);
        const stackTop =
          parseFloat(rootStyles.getPropertyValue("--stack-top")) || 80;
        const peek =
          parseFloat(rootStyles.getPropertyValue("--stack-peek")) || 14;
        const lastPin = stackTop + (n - 1) * peek;
        const finalScale = 1 - 0.04 * (n - 1 - order);

        gsap.fromTo(
          cardRef.current,
          { scale: 1 },
          {
            scale: finalScale,
            transformOrigin: "center top",
            ease: "none",
            scrollTrigger: {
              trigger: nextCard,
              start: "top bottom",
              endTrigger: lastCard,
              end: "top " + lastPin,
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
          "--i": order,
          "--accent": project.accent,
          "--accent-text": project.accentText,
        } as React.CSSProperties
      }
      className="stack-card group mt-2xl flex flex-col overflow-hidden rounded-lg border border-hairline bg-canvas px-lg pb-md pt-lg shadow-[0_1px_1px_rgba(0,0,0,0.04)]"
    >
      {/* Tinted mat - a real /work/<slug> link (crawlable, open-in-new-tab
          friendly); a plain click is intercepted to open the overlay smoothly
          without a full navigation. */}
      <div className="flex flex-1 items-center justify-center">
        <a
          href={`${BASE_PATH}/work/${project.slug}/`}
          onClick={(e) => {
            // Let modified clicks / new-tab behave natively.
            if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0)
              return;
            e.preventDefault();
            onOpen(project.slug);
          }}
          aria-label={`Open ${project.title} case study`}
          className="project-stage relative flex items-center justify-center overflow-hidden rounded-md border border-hairline outline-none transition-transform duration-200 focus-visible:ring-2 focus-visible:ring-link focus-visible:ring-offset-2 focus-visible:ring-offset-elevated active:scale-[0.99]"
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
        </a>
      </div>

      {/* Caption row - index / title·discipline / year */}
      <div className="mt-md flex w-full items-baseline justify-between pt-sm">
        <span
          className="font-mono text-mono-eyebrow"
          style={{ color: "var(--accent-text)" }}
        >
          {project.index}
        </span>
        <div className="text-center">
          <p className="text-label-sm text-ink">{project.title}</p>
          <p className="text-body-sm text-faint">{project.discipline}</p>
        </div>
        <span className="font-mono text-mono-eyebrow text-mute">
          {project.inProgress ? "In Progress" : `© ${project.year}`}
        </span>
      </div>
    </section>
  );
}
