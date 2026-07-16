import AboutReveal from "./AboutReveal";

/**
 * About band → Contact/CTA band → footer. Static server component -
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
        </div>

        {/* Origin story + facts */}
        <div className="border-t border-hairline">
          <div className="mx-auto grid max-w-container gap-3xl px-lg py-4xl md:grid-cols-2 md:gap-2xl">
            {/* Left - origin story */}
            <div>
              <p className="eyebrow text-mute">Before UX</p>
              <p className="mt-lg max-w-lg text-body-lg text-body">
                Before UX, I worked as a fashion consultant for Tommy
                Hilfiger, Kenneth Cole, and Emporio Armani. Fashion taught me
                to design under pressure, read what people feel the moment
                they touch something, and think at a system level.
              </p>
              <p className="mt-md max-w-lg text-body-lg text-body">
                The instincts carried over, the same empathy, faster feedback
                loops, and products that reach millions.
              </p>
            </div>

            {/* Right - facts */}
            <div>
              <p className="eyebrow text-mute">At a glance</p>
              <dl className="mt-lg divide-y divide-hairline border-b border-hairline">
                {[
                  ["Location", "Salzburg, Austria"],
                  ["Relocation", "Open, across Europe"],
                  ["Visa", "EU Blue Card holder"],
                  ["Looking for", "Senior IC · B2B SaaS"],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="flex items-baseline justify-between gap-md py-sm"
                  >
                    <dt className="font-mono text-mono-eyebrow uppercase text-mute">
                      {label}
                    </dt>
                    <dd className="text-body-md text-ink">{value}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-lg text-body-lg text-mute">
                I do my best work where asking hard questions is expected, and
                design has a real seat at the table.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA / Contact */}
      <section id="contact" className="border-t border-hairline bg-canvas">
        <div className="mx-auto max-w-container px-lg py-4xl text-center">
          <h2 className="mx-auto max-w-3xl text-[length:clamp(1.75rem,4vw+0.5rem,3rem)] font-semibold leading-none tracking-[-0.05em] text-ink">
            Got a gnarly problem worth solving?
          </h2>
          <div className="mt-2xl flex flex-wrap items-center justify-center gap-md">
            <a
              href="mailto:seemasam2113@gmail.com"
              className="rounded-pill border border-transparent bg-ink px-lg py-sm text-body-lg font-medium text-on-primary transition-colors hover:bg-black"
            >
              Get in touch
            </a>
            <a
              href="/seema-jain-resume.pdf"
              target="_blank"
              rel="noopener"
              className="rounded-pill border border-hairline bg-elevated px-lg py-sm text-body-lg font-medium text-ink transition-colors hover:bg-hairline-soft"
            >
              Resume
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-hairline bg-canvas">
        <div className="mx-auto flex max-w-container flex-col items-start justify-between gap-md px-lg py-3xl md:flex-row md:items-center">
          <div className="flex flex-col items-start gap-xs sm:flex-row sm:items-center sm:gap-md">
            <span className="text-label-sm font-semibold text-ink">
              Seema Jain
            </span>
            <span className="font-mono text-mono-eyebrow text-mute">
              © 2026 · Salzburg, AT
            </span>
            <span className="font-mono text-mono-eyebrow text-mute">
              V1.0
            </span>
          </div>
          <a
            href="https://www.linkedin.com/in/seema-sampathraj/"
            target="_blank"
            rel="noopener"
            className="font-mono text-mono-eyebrow text-mute transition-colors hover:text-ink"
          >
            LinkedIn ↗
          </a>
        </div>
      </footer>
    </>
  );
}
