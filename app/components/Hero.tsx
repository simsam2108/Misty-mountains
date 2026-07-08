"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import HeroFluid from "./hero/HeroFluid";

/**
 * Scene 1 — dark cinematic Fjord hero.
 * Full-viewport misty-mountains image with a WebGL fluid-smoke atmosphere,
 * gentle vertical scroll parallax (no zoom), and an almost-imperceptible
 * mouse parallax across background / atmosphere / content depth tiers.
 */
export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const fluidRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const ctx = gsap.context(() => {
      // Static over-scale (via GSAP so it isn't overwritten by the x/y tweens
      // below) so parallax translation never reveals an image edge.
      gsap.set(imageRef.current, { scale: 1.1 });

      // Vertical scroll parallax — image drifts slower than the page, no scale.
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

      // Inertial mouse parallax — three depth tiers, opposite the cursor.
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
      className="relative h-screen w-full overflow-hidden bg-fjord-ink"
    >
      {/* Background image — statically over-scaled so parallax never reveals an edge */}
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

      {/* Fluid-smoke atmosphere — between image and content */}
      <div ref={fluidRef} className="absolute inset-0 will-change-transform">
        <HeroFluid />
      </div>

      {/* Content */}
      <div
        ref={contentRef}
        className="hero-content relative z-10 mx-auto flex h-full max-w-container flex-col justify-between px-lg py-2xl will-change-transform"
      >
        <div />

        <div className="max-w-4xl pb-4xl">
          <h1 className="text-fjord-text text-display-hero">Seema Jain</h1>
          <p className="mt-lg max-w-xl text-body-lg text-fjord-text/80">
            Senior Product Designer — turning complex enterprise data into
            clarity.
          </p>
          <p className="mt-sm max-w-xl text-body-md text-fjord-mute">
            Based in Salzburg, Austria — open to relocate · EU Blue Card visa
            holder.
          </p>
        </div>

        <div className="flex items-center gap-sm text-fjord-mute">
          <span className="eyebrow">Scroll to explore</span>
          <span className="h-px w-16 bg-fjord-mute/50" />
        </div>
      </div>
    </section>
  );
}
