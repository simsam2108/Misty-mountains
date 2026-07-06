# Project Context — Seema Jain Portfolio (Cinematic One-Pager)

> Handoff doc for starting a fresh chat. Summarizes what's built, why, how to run it,
> the git state, and what's still open. Last updated: 2026-07-06.

---

## 1. What this is

A cinematic, single-page portfolio for **Seema Jain** (Senior Product Designer),
built to feel like a "front door" to her existing site **https://www.seema-jain.com**.

- **Aesthetic:** hybrid — a **dark cinematic hero** (Scene 1) that transitions into a
  **light, Vercel/Geist-minimal** body (Scene 2 onward). The light system follows
  `DESIGN-vercel.md` (ink `#171717` on canvas `#fafafa`, hairline borders `#ebebeb`,
  Geist Sans display + Geist Mono eyebrows, tight negative tracking).
- **One page, in order:** dark Fjord hero → sticky stacking projects → about → contact → footer.

---

## 2. Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14 (App Router) + TypeScript |
| Styling | Tailwind CSS — all design tokens wired into `tailwind.config.ts` (no inline JSX styles) |
| Fonts | Geist Sans + Geist Mono via `geist` package / `next/font` |
| Macro motion | GSAP + ScrollTrigger |
| Smooth scroll | Lenis |
| Hero atmosphere | Custom WebGL fluid sim (see §5) |
| Data | `data/projects.ts` (lightweight, no CMS) |

Node 25 / npm 11 on the dev machine. Next pinned to `^14.2.35` (14.2.15 had a CVE).

---

## 3. Key structure

```
app/
  layout.tsx                     # Geist fonts, Lenis mount, metadata
  page.tsx                       # assembles Nav + Hero + ProjectsSection + Closing
  components/
    Nav.tsx                      # thin nav, transparent over hero → hairline on scroll
    Hero.tsx                     # Scene 1: dark fjord + parallax + fluid
    hero/HeroFluid.tsx           # WebGL fluid-smoke atmosphere (canvas)
    ProjectsSection.tsx          # sticky left rail + stacking panels + overlay state/URL
    ProjectPanel.tsx             # one full-viewport stacking project panel
    CaseStudyOverlay.tsx         # full-screen, URL-addressable case study
    Closing.tsx                  # about + contact/CTA + footer (server component)
    SmoothScroll.tsx             # Lenis + ScrollTrigger sync
  hooks/                         # (useGlowSpring.ts was removed — see §5)
lib/gsap.ts                      # GSAP + ScrollTrigger registration
data/projects.ts                # 4 projects + case-study copy
styles/globals.css              # tokens/vars, Lenis css, reduced-motion
public/hero/misty-mountains.jpg  # hero background
public/projects/*.png            # installer / activation / designgrid / cocreate
DESIGN-vercel.md                 # the authoritative light design system
```

---

## 4. Content (real, from seema-jain.com)

Four projects in `data/projects.ts`, each with fetched case-study copy:

1. **Installer App** — Lead UX/UI, ChargePoint, native mobile (`/projects/installer.png`)
2. **Station Activation Flow** — Lead UX/UI, ChargePoint, enterprise workflow (`/projects/activation.png`)
3. **DesignGrid** — UX/UI, The Mobility House, design systems (`/projects/designgrid.png`)
4. **CoCreate** — In Progress (no case study yet) (`/projects/cocreate.png`)

Hero copy: **"Seema Jain"** + tagline *"Senior Product Designer — turning complex
enterprise data into clarity."* Contact CTA → `mailto:seemasam2113@gmail.com`.
Case studies open as a **full-screen overlay**, deep-linkable via `?project=<slug>`
(e.g. `/?project=designgrid`) with browser back/Esc support. Data model accepts an
`images[]` array per project so more images can be dropped in later.

---

## 5. Hero motion (the signature work)

Scene 1 combines four things in `Hero.tsx` + `hero/HeroFluid.tsx`:

- **WebGL fluid-smoke** (`HeroFluid.tsx`): a Navier–Stokes "stable fluids" sim adapted
  from Pavel Dobryakov's WebGL-Fluid-Simulation (MIT), ported off jQuery. Soft smoke
  splats from the cursor + a gentle **auto-drift** so it's alive when idle. Pauses
  offscreen (IntersectionObserver); **skips entirely under `prefers-reduced-motion`;**
  wrapped in try/catch to degrade to the still hero if WebGL fails.
- **Color = "Grey Lavender"** palette sampled from the fjord image: `#b8b8cc`, `#9aa0bd`,
  `#7d84a3`, at low intensity (0.09) so the additive smoke reads muted, not shiny.
  (This lives on the `mist-animations` branch — see §7.)
- **Scroll parallax:** image drifts down slowly, **no zoom**; a GSAP-set static
  over-scale (1.1) prevents edge gaps.
- **Mouse parallax:** inertial 3-tier (background / fluid / content) via `gsap.quickTo`,
  almost imperceptible.

Removed along the way: the old cursor **glow** (`useGlowSpring`) and the old CSS
gradient mist — the fluid replaces both.

**Tuning knobs** (in `HeroFluid.tsx`): smoke visibility = `intensity` in `generateColor()`;
fade speed = `DENSITY_DISSIPATION`; calmness = `SPLAT_FORCE` / `CURL`; idle drift =
`ambientDrift()` timer + `dx/dy`.

---

## 6. How to run / verify

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build (currently passes clean)
```

**Known dev gotcha:** heavy branch-switching + hot-reload can leave Tailwind's dev CSS
stale, which collapses every section below the hero (only the hero image shows). Fix:
stop the server, `rm -rf .next`, restart, then **hard-refresh** the browser (Cmd+Shift+R).
Also: the in-editor browser-preview tool intermittently collapses its viewport to ~0px —
that's a harness glitch, not the app.

---

## 7. Git state

- Remote: **https://github.com/simsam2108/Misty-mountains** (auth via `gh`, account `simsam2108`).
- **`main`** — full site through the WebGL fluid smoke (icy default color). Pushed.
- **`mist-animations`** — everything in `main` **plus** the Grey Lavender muted palette +
  calmer motion commit. Pushed. **1 commit ahead of `main`; NOT merged yet** (per request).
- Commits are small and runnable; messages are conventional (`feat(...)`, `chore(...)`).
- `gh` CLI is installed + authenticated, so pushes work without prompts.

**Untouched on purpose:** a `project hero images/` folder the user added (left alone),
and `main` (no merge yet).

---

## 8. Open / next possible tasks

- Decide whether to **merge `mist-animations` → `main`** (or open a PR) once the muted
  mist is approved.
- Possibly tune mist further (fainter / slower) — one-number changes in `HeroFluid.tsx`.
- The new `project hero images/` folder hasn't been reviewed or wired in.
- CoCreate has placeholder "In Progress" copy — real case study TBD.
- Case-study overlays are text-rich with one image each; more images can be added to
  each project's `images[]`.
- Nothing deployed yet (local + GitHub only).

---

## 9. Working preferences (from this session)

- User is **not a developer** — describe things visually ("soft grey mist that drifts"),
  not in code terms. When given a reference link, **dig into it fully first** and rebuild
  the *look*; don't ask lots of technical questions.
- User likes to **see a preview before building** big visual changes.
- Keep using **small, runnable git commits**; branch experiments off `main`.
