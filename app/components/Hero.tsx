"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import HeroFluid from "./hero/HeroFluid";

/**
 * Scene 1 - dark cinematic Fjord hero.
 * Full-viewport misty-mountains image with a WebGL fluid-smoke atmosphere,
 * gentle vertical scroll parallax (no zoom), and an almost-imperceptible
 * mouse parallax across background / atmosphere / content depth tiers.
 */
export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const fluidRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  // null until we know the pointer type - WebGL atmosphere only mounts on
  // fine-pointer devices (mouse parallax is meaningless + costly on touch).
  const [coarsePointer, setCoarsePointer] = useState<boolean | null>(null);

  useEffect(() => {
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    setCoarsePointer(coarse);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const ctx = gsap.context(() => {
      // Static over-scale (via GSAP so it isn't overwritten by the x/y tweens
      // below) so parallax translation never reveals an image edge.
      gsap.set(imageRef.current, { scale: 1.1 });

      // Vertical scroll parallax - image drifts slower than the page, no scale.
      gsap.to(imageRef.current, {
        yPercent: 12,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      // Fade content out as we leave
      gsap.to(contentRef.current, {
        opacity: 0,
        y: -40,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "60% top",
          scrub: true,
        },
      });

      // Inertial mouse parallax - three depth tiers, opposite the cursor.
      // Skipped entirely on touch devices (no cursor to follow).
      if (coarse) return;
      const setImg = {
        x: gsap.quickTo(imageRef.current, "x", { duration: 0.9, ease: "power3.out" }),
        y: gsap.quickTo(imageRef.current, "y", { duration: 0.9, ease: "power3.out" }),
      };
      const setFluid = {
        x: gsap.quickTo(fluidRef.current, "x", { duration: 0.9, ease: "power3.out" }),
        y: gsap.quickTo(fluidRef.current, "y", { duration: 0.9, ease: "power3.out" }),
      };
      const setContent = {
        x: gsap.quickTo(contentRef.current, "x", { duration: 1.1, ease: "power3.out" }),
        y: gsap.quickTo(contentRef.current, "y", { duration: 1.1, ease: "power3.out" }),
      };

      const onMove = (e: MouseEvent) => {
        const nx = e.clientX / window.innerWidth - 0.5;
        const ny = e.clientY / window.innerHeight - 0.5;
        setImg.x(-nx * 16);
        setImg.y(-ny * 16);
        setFluid.x(-nx * 26);
        setFluid.y(-ny * 26);
        setContent.x(nx * 8);
        setContent.y(ny * 8);
      };
      window.addEventListener("mousemove", onMove);
      return () => window.removeEventListener("mousemove", onMove);
    }, sectionRef);

    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-[100svh] w-full overflow-hidden bg-fjord-ink"
    >
      {/* Background image - statically over-scaled so parallax never reveals an edge */}
      <div ref={imageRef} className="absolute inset-0 scale-110 will-change-transform motion-reduce:scale-100">
        <Image
          src="/hero/misty-mountains.jpg"
          alt="Misty fjord mountains"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-fjord-ink/40 via-fjord-ink/10 to-fjord-ink/85" />
      </div>

      {/* Fluid-smoke atmosphere - between image and content. Only mounted on
          fine-pointer devices; on touch the still image + gradient carries it. */}
      <div ref={fluidRef} className="absolute inset-0 will-change-transform">
        {coarsePointer === false ? <HeroFluid /> : null}
      </div>

      {/* Content */}
      <div
        ref={contentRef}
        className="hero-content relative z-10 mx-auto flex h-full max-w-container flex-col justify-between px-lg py-2xl will-change-transform"
      >
        <div />

        <div className="max-w-4xl pb-4xl">
          <h1 className="text-fjord-text text-[length:clamp(3rem,11vw,6rem)] font-semibold leading-[0.95] tracking-[-0.03em]">
            Seema Jain
          </h1>
          <p className="mt-lg max-w-xl text-body-lg text-fjord-text/80">
            Senior Product Designer, turning complex enterprise data into
            clarity.
          </p>
          <p className="mt-sm max-w-xl text-body-md text-fjord-mute">
            Based in Salzburg, Austria · open to relocate · EU Blue Card visa
            holder.
          </p>

          {/* CTA row - light-on-dark twins of the Closing pills */}
          <div className="mt-xl flex flex-wrap items-center gap-md">
            <a
              href="mailto:seemasam2113@gmail.com"
              className="rounded-pill border border-transparent bg-fjord-text px-lg py-sm text-body-lg font-medium text-fjord-ink transition-opacity hover:opacity-90"
            >
              Get in touch
            </a>
            <a
              href="/seema-jain-resume.pdf"
              target="_blank"
              rel="noopener"
              className="rounded-pill border border-white/25 px-lg py-sm text-body-lg font-medium text-fjord-text transition-colors hover:border-fjord-text hover:bg-white/10"
            >
              Resume
            </a>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-sm text-fjord-mute">
            <span className="eyebrow">Scroll to explore</span>
            <span className="h-px w-16 bg-fjord-mute/50" />
          </div>
        </div>
      </div>
    </section>
  );
}
