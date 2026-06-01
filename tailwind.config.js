/** @type {import('tailwindcss').Config} */
module.exports = {

  // Which files Tailwind scans to know which classes you've used.
  // If a class isn't found in these files, it gets stripped from the build.
  content: ["./src/**/*.{tsx,html}"],

  // Enables dark mode via a CSS class (e.g. <html class="dark">).
  // You're not using dark mode, but Plasmo adds this by default — leave it.
  darkMode: "class",

  // Plasmo requires this. Every Tailwind class must be prefixed with "plasmo-"
  // so it doesn't conflict with styles on whatever page the extension runs on.
  // e.g. bg-primary becomes plasmo-bg-primary
  prefix: "plasmo-",

  plugins: [require("tailwindcss-animate")],

  theme: {
    extend: {

      // ── COLORS ──────────────────────────────────────────────────────────
      // These map Tailwind class names to your CSS variables from style.css.
      // "var(--primary)" means "use whatever --primary is set to in :root".
      // This way if you change a color in style.css, it updates everywhere.
      //
      // Usage examples:
      //   plasmo-bg-primary        → background: #1e3a8a
      //   plasmo-text-foreground   → color: #0a0a0a
      //   plasmo-border-border     → border-color: #e5e5e5
      //   plasmo-bg-primary/50     → background: #1e3a8a at 50% opacity (only works with RGB, see note below)

      colors: {
        // Page and card backgrounds
        background: {
          DEFAULT: "var(--background)",        // plasmo-bg-background
          subtle:  "var(--background-subtle)", // plasmo-bg-background-subtle
        },
        card:       "var(--card)",             // plasmo-bg-card

        // Text colors
        foreground: "var(--foreground)",       // plasmo-text-foreground
        muted: {
          DEFAULT:    "var(--muted)",          // plasmo-bg-muted
          foreground: "var(--muted-foreground)",// plasmo-text-muted-foreground
        },

        // Primary button / accent color (your navy #1E3A8A)
        primary: {
          DEFAULT:    "var(--primary)",        // plasmo-bg-primary
          hover:      "var(--primary-hover)",  // plasmo-bg-primary-hover (use in hover: variants)
          foreground: "var(--primary-foreground)", // plasmo-text-primary-foreground
        },

        // Secondary button color (light grey)
        secondary: {
          DEFAULT:    "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },

        // Borders and inputs
        border: "var(--border)",               // plasmo-border-border
        input:  "var(--input)",                // plasmo-bg-input

        // Focus ring
        ring: {
          DEFAULT: "var(--ring)",              // used automatically on focus
          error:   "var(--ring-error)",        // plasmo-ring-error
        },

        // Semantic
        destructive: {
          DEFAULT:    "var(--destructive)",    // plasmo-bg-destructive
          foreground: "var(--destructive-foreground)",
        },
        warning: {
          DEFAULT:    "var(--warning)",        // plasmo-bg-warning
          foreground: "var(--warning-foreground)",
        },
        success: {
          DEFAULT:    "var(--success)",        // plasmo-bg-success
          foreground: "var(--success-foreground)",
        },
      },

      // ── FONTS ────────────────────────────────────────────────────────────
      // Maps font-family class names to actual font names.
      // plasmo-font-sans and plasmo-font-heading both use Inter.
      fontFamily: {
        sans:    ["Inter", "sans-serif"],
        heading: ["Inter", "sans-serif"],
      },

      // ── FONT SIZES ───────────────────────────────────────────────────────
      // Custom size scale matching your Figma text styles exactly.
      // Each entry is [fontSize, { lineHeight, letterSpacing }].
      //
      // Usage: plasmo-text-p, plasmo-text-h1, etc.
      fontSize: {
        // Paragraph scale
        "p-sm": ["12px", { lineHeight: "1.4", letterSpacing: "0" }], // confirmation links, captions
        "p":    ["14px", { lineHeight: "1.4", letterSpacing: "0" }], // default body text
        "p-lg": ["20px", { lineHeight: "1.4", letterSpacing: "0" }], // larger body, form labels

        // Heading scale (all semibold in Figma — apply plasmo-font-semibold alongside)
        "h4": ["20px", { lineHeight: "24px",   letterSpacing: "0" }],
        "h3": ["18px", { lineHeight: "28.8px", letterSpacing: "0" }],
        "h2": ["24px", { lineHeight: "30px",   letterSpacing: "-0.5px" }],
        "h1": ["30px", { lineHeight: "48px",   letterSpacing: "-0.5px" }],
      },

      // ── BORDER RADIUS ────────────────────────────────────────────────────
      // All radii derive from --radius (0.5rem = 8px).
      // plasmo-rounded-lg = 8px, plasmo-rounded-md = 6px, plasmo-rounded-sm = 4px
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
}