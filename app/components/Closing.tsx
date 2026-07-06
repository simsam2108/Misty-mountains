import AboutReveal from "./AboutReveal";

/**
 * About band → Contact/CTA band → footer. Static server component —
 * quiet, ink-on-white, generous vertical rhythm per the Geist system.
 */
export default function Closing() {
  return (
    <>
      {/* About */}
      <section
        id="about"
        className="border-t border-hairline bg-canvas"
      >
        <div className="mx-auto max-w-container px-lg py-section">
          <p className="eyebrow text-mute">About</p>
          <AboutReveal />
          <p className="mt-2xl text-body-lg text-mute">
            Based in Salzburg, Austria. Open to relocation.
          </p>
        </div>
      </section>

      {/* CTA / Contact */}
      <section id="contact" className="border-t border-hairline bg-canvas">
        <div className="mx-auto max-w-container px-lg py-4xl text-center">
          <h2 className="mx-auto max-w-3xl text-display-xl text-ink">
            Have a complex problem worth designing?
          </h2>
          <div className="mt-2xl flex flex-wrap items-center justify-center gap-md">
            <a
              href="mailto:seemasam2113@gmail.com"
              className="rounded-pill bg-ink px-lg py-sm text-body-lg font-medium text-on-primary transition-colors hover:bg-black"
            >
              Get in touch
            </a>
            <a
              href="https://www.seema-jain.com"
              target="_blank"
              rel="noreferrer"
              className="rounded-pill border border-hairline bg-elevated px-lg py-sm text-body-lg font-medium text-ink transition-colors hover:bg-hairline-soft"
            >
              seema-jain.com ↗
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-hairline bg-canvas">
        <div className="mx-auto flex max-w-container flex-col items-start justify-between gap-md px-lg py-3xl md:flex-row md:items-center">
          <span className="text-label-sm font-semibold text-ink">
            Seema Jain
          </span>
          <span className="font-mono text-mono-eyebrow text-mute">
            © 2026 — Salzburg, AT
          </span>
        </div>
      </footer>
    </>
  );
}
