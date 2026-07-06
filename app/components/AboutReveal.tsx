"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

/**
 * Cuberto-style masked line reveal. Each line sits inside an overflow-hidden
 * "mask" and starts translated fully below it (so nothing flashes before the
 * script runs). On scroll into view the lines slide up one after another on a
 * power4.out deceleration. Honors prefers-reduced-motion.
 */

// The merged About statement — one paragraph, all at h2 (heading-lg) size.
const LINES = [
  "Senior Product Designer turning complex enterprise",
  "data into clarity. 7+ years building B2B SaaS",
  "platforms, native mobile apps, design systems, and",
  "end-to-end flows — most recently across EV",
  "infrastructure at ChargePoint and The Mobility House.",
];

function MaskLine({
  children,
  className,
}: {
  children: React.ReactNode;
  className: string;
}) {
  return (
    <span className="block overflow-hidden pb-[0.12em]">
      <span className={`reveal-line block will-change-transform ${className}`}>
        {children}
      </span>
    </span>
  );
}

export default function AboutReveal() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const lines = root.querySelectorAll<HTMLElement>(".reveal-line");

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return; // copy is already visible in natural flow

    // Bulletproof: the copy is visible by default. Only at the moment the
    // section scrolls into view do we snap it below the mask and slide it up
    // (fromTo). If the trigger never fires, the text simply stays visible —
    // it can never be permanently hidden. IntersectionObserver is used (not
    // ScrollTrigger) so it's immune to page-height shifts from the stack.
    let played = false;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting) || played) return;
        played = true;
        io.disconnect();
        gsap.fromTo(
          lines,
          { yPercent: 115 },
          {
            yPercent: 0,
            duration: 1.4,
            ease: "power4.out",
            stagger: 0.12,
            onComplete: () => {
              gsap.set(lines, { clearProps: "transform,will-change" });
            },
          }
        );
      },
      { threshold: 0.1 }
    );
    io.observe(root);

    return () => io.disconnect();
  }, []);

  return (
    <div ref={rootRef} className="mt-lg">
      <h2 className="max-w-4xl text-heading-lg text-ink">
        {LINES.map((line) => (
          <MaskLine key={line} className="text-heading-lg text-ink">
            {line}
          </MaskLine>
        ))}
      </h2>
    </div>
  );
}
