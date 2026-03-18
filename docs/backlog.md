# Backlog

Features and improvements outside the current sprint. Not prioritized — items move to the active task list when work begins.

---

## Token Pipeline — Near Term

**Plugin → GitHub API**
Upgrade the plugin to commit `tokens/figma.raw.json` directly to the repo via the GitHub Contents API, eliminating the manual paste-and-commit step. See ADR-006 for context.

**Figma REST API sync (headless)**
When an Enterprise Figma account is available, restore `scripts/fetch-tokens.mjs` into the pipeline. Eliminates the plugin step entirely — fully server-side, no Figma UI required. See ADR-004.

---

## Component System

**Icon as a component**
Formalize the CSS mask-image technique into a shared `<Icon>` component. Accepts an SVG filename (matching `/public/img/*.svg`) and renders a sized, theme-aware `<span>` using `background-color: currentColor` + `mask-image`. Would replace the inline `<Icon>` helper currently local to `Button.tsx` and the ad-hoc span in `FeatureAccordion.tsx`. Consider a token-backed size scale (e.g. `size?: "sm" | "md" | "lg"`) and an icon name union type derived from available SVG filenames.

**Token-driven component density contracts**
Components currently express breakpoint-responsive density intent via a `densityByBreakpoint` prop implemented with `matchMedia`. A future approach: encode this in the breakpoints token collection as component-specific overrides (e.g. `breakpoints-tablet/component/tabbed-slideshow/density = spacious`), with a Style Dictionary formatter outputting them as `@media`-scoped CSS attribute overrides. Eliminates JS matchMedia and makes the intent token-pipeline-visible — but couples the breakpoints and component collections. Evaluate when the component library grows enough to justify the machinery.

---

## Token Structure — Figma

**Space/sizing primitive scale**
A numeric spacing scale (`space/1` through `space/16` or similar) in the Primitives collection. Referenced by semantic layout tokens and component tokens. Currently `8px`, `12px`, `16px`, and `24px` appear as hardcoded values across multiple components with no tokens to reference — this is the root cause of most gaps in the audit below.

---

## Component Token Gap Analysis

Findings from a 2026-03-18 audit of all component CSS modules. Items grouped by priority.

### Quick fixes — tokens already exist, just need wiring in code

- **`font-weight: 600`** in Button, Tabs, StackedImage → swap to `--primitives-typography-weight-bold`
- **`font-family: 'Overpass'`** in StackedImage → swap to `--primitives-typography-font-family-heading`
- **StackedImage `line-height: 1.2`** → wire to `--primitives-typography-line-height-heading` (120%) once confirmed equivalent

### Needs new tokens in Figma first

- **`24px` spacing** — gap in ButtonShowcase, TabbedSlideshow, TabsShowcase, TypeShowcase. No token between `motion-distance-large` (32px) and `motion-distance-medium` (16px).
- **`12px` spacing** — gap in ButtonShowcase button row. No token between `motion-distance-small` (8px) and `motion-distance-medium` (16px).
- **`8px` and `16px` spacing** — used widely for layout gap/padding. `motion-distance-small/medium` exist but are semantically wrong (motion ≠ layout). Resolved by the spacing primitive scale above.
- **`component-accordion-icon-size`** — accordion chevron `width/height: 24px` is hardcoded. Should be a density-responsive component token so it scales with compact/default/spacious.
- **Controls bar `padding: 10px`** — odd value in page.module.css with no token. Worth standardizing to 8px or 12px once spacing scale exists.

### Not actionable in CSS (known limitation)
- **`@media (min-width: 800px)`** hardcoded in FeatureAccordion, SideBySide, OffsetList — CSS media queries cannot use custom properties. The value is correct (matches `breakpoints.tablet`). Acceptable as-is unless a SASS/PostCSS build step is introduced.

---

## Developer Experience

**Component QA with Ladle (or Storybook)**
As the component library grows, the hand-authored `/tokens` page won't catch every prop permutation. A story-based tool generates coverage automatically — every `hierarchy`, `surface`, `iconOnly`, and density combination is explorable without manually adding examples. Suggested trigger: ~8–10 components with intersecting props, or the first time a prop combination is found broken that wasn't in the `/tokens` page.

Prefer **Ladle** over Storybook for this stack — it uses the same `.stories.tsx` format (Storybook-compatible) but is significantly lighter and faster to configure with Next.js. Key setup considerations: CSS custom property injection (token CSS files must be imported in Ladle's setup file), and ensuring `data-theme`/`data-density` attributes are wrappable per-story for theme/density switching.

The `/tokens` page remains the live public demo; Ladle would be a local/CI QA surface, not a replacement.

**Codebase orientation tour**
A guided walkthrough of where key artifacts live: Style Dictionary config, generated token files (CSS + TS), component prop files, centralized style definitions, Figma plugin source, and the docs/decisions structure. Intended for onboarding or after a period away from the project.

---

## Application

**Flash of unstyled theme (FOUT) fix**
The `/tokens` page briefly renders `light/default` before `useEffect` restores saved preferences from `localStorage`. Fix with an inline `<script>` in `<head>` that reads `localStorage` and sets `data-theme`/`data-density` on `<html>` before first paint. Apply when mirroring the toggle to the real site.

**Full homepage design**
Design the homepage in Figma against the live variable system before translating to code. Replaces the current placeholder.

**Actual site content**
Implement the homepage design in Next.js once the Figma design is ready.
