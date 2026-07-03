import type { Config } from "tailwindcss";

/**
 * Design tokens sourced 1:1 from DESIGN-vercel.md (the Geist system).
 * Dark hero values are additive — everything else is ink-on-near-white.
 */
const config: Config = {
  content: ["./app/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#171717",
        "on-primary": "#ffffff",
        body: "#4d4d4d",
        mute: "#8f8f8f",
        faint: "#a1a1a1",
        hairline: "#ebebeb",
        "hairline-soft": "#f2f2f2",
        canvas: "#fafafa",
        elevated: "#ffffff",
        link: "#0070f3",
        "link-deep": "#0761d1",
        // dark hero scene
        "fjord-ink": "#0a0a0a",
        "fjord-text": "#eaeaea",
        "fjord-mute": "#a1a1a1",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "Inter", "Arial", "sans-serif"],
        mono: [
          "var(--font-geist-mono)",
          "JetBrains Mono",
          "ui-monospace",
          "monospace",
        ],
      },
      fontSize: {
        "display-xl": ["48px", { lineHeight: "48px", letterSpacing: "-2.4px", fontWeight: "600" }],
        "display-hero": ["96px", { lineHeight: "0.95", letterSpacing: "-4px", fontWeight: "600" }],
        "heading-lg": ["32px", { lineHeight: "40px", letterSpacing: "-1.28px", fontWeight: "600" }],
        "heading-md": ["20px", { lineHeight: "28px", letterSpacing: "-0.4px", fontWeight: "600" }],
        "label-sm": ["14px", { lineHeight: "20px", letterSpacing: "-0.28px", fontWeight: "500" }],
        "mono-eyebrow": ["12px", { lineHeight: "16px", letterSpacing: "0" }],
        "body-lg": ["16px", { lineHeight: "24px" }],
        "body-md": ["14px", { lineHeight: "20px" }],
        "body-sm": ["12px", { lineHeight: "16px" }],
      },
      spacing: {
        xxs: "4px",
        xs: "8px",
        sm: "12px",
        md: "16px",
        lg: "24px",
        xl: "32px",
        "2xl": "40px",
        "3xl": "64px",
        "4xl": "96px",
        section: "128px",
      },
      borderRadius: {
        sm: "6px",
        md: "12px",
        lg: "16px",
        "pill-category": "64px",
        pill: "100px",
      },
      maxWidth: {
        container: "1200px",
      },
    },
  },
  plugins: [],
};

export default config;
