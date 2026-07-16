"use client";

import { useEffect } from "react";
import { projectBySlug } from "@/data/projects";

/**
 * Static-export 404 → GitHub Pages serves this file for any path without a
 * pre-generated HTML file. Every real route (/, /work/<slug>/) IS generated,
 * so this only fires for stray URLs. A known project path that 404'd (e.g. a
 * missing trailing slash on some hosts) is normalized to its real page;
 * anything else falls back to the app root. Slug is validated so an unknown
 * /work/<x> can never redirect to itself and loop.
 */
export default function NotFound() {
  useEffect(() => {
    const BP = process.env.NEXT_PUBLIC_BASE_PATH || "";
    const path = window.location.pathname.slice(BP.length);
    const m = path.match(/^\/work\/([^/]+)\/?$/);
    if (m && projectBySlug(m[1])) {
      window.location.replace(`${BP}/work/${m[1]}/`);
    } else {
      window.location.replace(`${BP}/`);
    }
  }, []);

  return (
    <main
      style={{
        minHeight: "60vh",
        display: "grid",
        placeItems: "center",
        padding: "24px",
        textAlign: "center",
      }}
    >
      <p>
        Redirecting… <a href="/">Back to home</a>
      </p>
    </main>
  );
}
