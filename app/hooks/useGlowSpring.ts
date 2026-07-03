"use client";

import { useEffect, useRef } from "react";

/**
 * Spring-driven mouse glow. Writes eased pointer position to CSS custom
 * properties (--glow-x / --glow-y) on the target element — no inline JSX
 * styles, no per-frame React re-render.
 */
export function useGlowSpring<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const pos = { x: 0.5, y: 0.4 };
    const target = { x: 0.5, y: 0.4 };

    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      target.x = (e.clientX - rect.left) / rect.width;
      target.y = (e.clientY - rect.top) / rect.height;
    };

    let rafId = 0;
    const animate = () => {
      pos.x += (target.x - pos.x) * 0.08;
      pos.y += (target.y - pos.y) * 0.08;
      el.style.setProperty("--glow-x", `${(pos.x * 100).toFixed(2)}%`);
      el.style.setProperty("--glow-y", `${(pos.y * 100).toFixed(2)}%`);
      rafId = requestAnimationFrame(animate);
    };

    el.addEventListener("pointermove", onMove);
    rafId = requestAnimationFrame(animate);

    return () => {
      el.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return ref;
}
