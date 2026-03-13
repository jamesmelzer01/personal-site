# Backlog

Features and improvements outside the current sprint. Not prioritized — items move to the active task list when work begins.

---

## Token Pipeline

**Plugin → GitHub API (Option C)**
Upgrade the Figma plugin to commit `tokens/figma.raw.json` directly to the repo via the GitHub Contents API, eliminating the manual paste-and-commit step. See ADR-006 for context. This is the enterprise-grade end state for the export step.

**Figma REST API sync (headless)**
When an Enterprise Figma account is available, restore the `scripts/fetch-tokens.mjs` REST API fetch into the GitHub Actions workflow. Eliminates the need to run the plugin entirely — sync becomes fully server-side on a schedule. See ADR-004.

**GitHub Actions automated sync**
GitHub Actions workflow (`.github/workflows/sync-tokens.yml`) that runs `npm run sync-tokens` on a schedule or manual trigger, commits any changed token files, and lets Vercel redeploy. Currently blocked on having a reliable Figma source (plugin clipboard approach requires manual commit; REST API requires Enterprise).

---

## Token Structure

**Multi-mode / theming support**
Expand the token schema to support Figma variable modes (e.g. light/dark, brand themes). Style Dictionary outputs separate CSS files or a single file with `[data-theme]` selectors. Requires defining the mode mapping in the fetch/plugin script.

**Richer token categories**
Add spacing, typography (font family, size, weight, line height), border radius, and shadow tokens beyond color. Requires expanding both the Figma variable collections and the Style Dictionary config.

**Semantic token layer**
Add a semantic layer on top of primitives (e.g. `color/surface/background` → `primitives/color/neutral/100`). Requires alias resolution in the fetch/plugin script (currently skipped).

**JS/TypeScript token export**
Configure Style Dictionary to output a `tokens.ts` file alongside `tokens.css` for use in component logic (e.g. animation values, breakpoints).

---

## Site

**Actual personal site content**
Replace the placeholder with real portfolio content once the token pipeline is proven.

**Figma design file**
Build out the full design in Figma using the variable system before translating to code.
