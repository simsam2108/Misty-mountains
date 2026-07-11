"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

const LINKS = [
  { href: "#work", label: "Work" },
  { href: "#about", label: "About" },
  { href: "mailto:seemasam2113@gmail.com", label: "Contact" },
] as const;

/**
 * Thin top nav. Transparent over the dark hero, hairline light bar once
 * scrolled into the white body. Below md the inline links collapse into a
 * hamburger that opens a full-screen overlay (focus-trapped, Lenis paused —
 * same lenis-stopped pattern as CaseStudyOverlay).
 */
export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const burgerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.85);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const close = useCallback(() => setOpen(false), []);

  // Overlay lifecycle: pause Lenis, staggered link reveal, Escape to close,
  // focus trap while open, focus restored to the burger on close.
  useEffect(() => {
    if (!open) return;

    window.lenis?.stop();
    document.documentElement.classList.add("lenis-stopped");

    const overlay = overlayRef.current;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let tween: gsap.core.Tween | undefined;
    if (!reduce && overlay) {
      // opacity (not autoAlpha) — visibility:hidden would block the focus call
      tween = gsap.fromTo(
        overlay.querySelectorAll("[data-overlay-link]"),
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.07, ease: "power3.out" }
      );
    }

    overlay?.querySelector<HTMLElement>("[data-overlay-link]")?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
        return;
      }
      if (e.key !== "Tab" || !overlay) return;
      const focusables = overlay.querySelectorAll<HTMLElement>("a[href], button");
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);

    return () => {
      tween?.kill();
      window.lenis?.start();
      document.documentElement.classList.remove("lenis-stopped");
      window.removeEventListener("keydown", onKey);
      burgerRef.current?.focus();
    };
  }, [open, close]);

  const dark = !scrolled;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-500 ${
        scrolled
          ? "border-b border-hairline bg-canvas/85 text-ink backdrop-blur"
          : "border-b border-transparent bg-transparent text-fjord-text"
      }`}
    >
      <nav className="mx-auto flex max-w-container items-center justify-between px-lg py-sm">
        <a href="#top" className="text-label-sm font-semibold">
          Seema Jain
        </a>

        {/* Desktop links */}
        <div className="hidden items-center gap-xs text-body-md md:flex">
          {LINKS.map((l) => (
            <a key={l.label} href={l.href} className="rounded-pill px-sm py-xs hover:opacity-70">
              {l.label}
            </a>
          ))}
        </div>

        {/* Mobile burger — 44×44 tap target */}
        <button
          ref={burgerRef}
          type="button"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
          className="-mr-xs flex h-11 w-11 flex-col items-center justify-center gap-[7px] rounded-pill md:hidden"
        >
          <span
            aria-hidden
            className={`h-px w-5 bg-current transition-transform duration-300 ${
              open ? "translate-y-[4px] rotate-45" : ""
            }`}
          />
          <span
            aria-hidden
            className={`h-px w-5 bg-current transition-transform duration-300 ${
              open ? "-translate-y-[4px] -rotate-45" : ""
            }`}
          />
        </button>
      </nav>

      {/* Full-screen mobile overlay */}
      {open ? (
        <div
          ref={overlayRef}
          id="mobile-nav"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          onClick={(e) => {
            if (e.target === e.currentTarget) close();
          }}
          className={`fixed inset-0 -z-10 flex flex-col justify-center px-lg md:hidden ${
            dark ? "bg-fjord-ink text-fjord-text" : "bg-canvas text-ink"
          }`}
        >
          <nav className="flex flex-col" aria-label="Site">
            {LINKS.map((l) => (
              <a
                key={l.label}
                data-overlay-link
                href={l.href}
                onClick={close}
                className="flex min-h-[48px] items-center border-b py-md text-heading-lg last:border-b-0"
                style={{ borderColor: dark ? "rgba(234,234,234,0.12)" : "#ebebeb" }}
              >
                {l.label}
              </a>
            ))}
          </nav>
          <p className={`eyebrow mt-2xl ${dark ? "text-fjord-mute" : "text-mute"}`}>
            Salzburg, Austria — open to relocate
          </p>
        </div>
      ) : null}
    </header>
  );
}
