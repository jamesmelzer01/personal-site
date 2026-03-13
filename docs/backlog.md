# Backlog

Features and improvements outside the current sprint. Not prioritized — items move to the active task list when work begins.

---

## Token Pipeline — Near Term

**Plugin: resolve alias references**
The plugin currently skips `VARIABLE_ALIAS` variable types. Semantic tokens that reference primitives need to be output as DTCG reference syntax (`{"$value": "{primitives.color.neutral.900}"}`) so Style Dictionary can resolve them at build time. Required before the semantic layer is useful.

**Plugin: read Figma Text Styles**
Extend the plugin to also call `figma.getLocalTextStyles()` and export composite typography tokens alongside variable tokens. Text styles hold the composite assemblies (family + size + weight + line-height + letter-spacing) that Variables can't express.

**Plugin → GitHub API (Option C)**
Upgrade the plugin to commit `tokens/figma.raw.json` directly to the repo via the GitHub Contents API, eliminating the manual paste-and-commit step. See ADR-006 for context.

---

## Token Pipeline — Infrastructure

**Style Dictionary: multi-output configuration**
Expand `style-dictionary.config.mjs` to output:
- `tokens.primitives.css` — all primitive tokens on `:root`
- `tokens.semantic.css` — semantic tokens scoped to `[data-theme="light"]` and `[data-theme="dark"]`
- `tokens.density.css` — component tokens scoped to `[data-density="compact/default/spacious"]`
- `tokens.typography.css` — utility classes for composite text styles (custom formatter required)

**Style Dictionary: custom typography formatter**
Write a custom Style Dictionary formatter that reads composite typography tokens (from Text Styles) and outputs `.type-[name]` CSS classes that bundle font-family, font-size, font-weight, line-height, and letter-spacing using CSS custom property references.

**GitHub Actions automated sync**
GitHub Actions workflow that runs `npm run sync-tokens` on schedule or manual trigger, commits changed token files, and triggers Vercel redeploy. Currently deferred — meaningful once alias references work (otherwise semantic tokens won't resolve correctly in CI).

**Figma REST API sync (headless)**
When an Enterprise Figma account is available, restore `scripts/fetch-tokens.mjs` into the pipeline. Eliminates the plugin step entirely — fully server-side, no Figma UI required. See ADR-004.

---

## Token Structure — Figma

**Semantic collection: configure Light/Dark modes**
Currently the Semantic collection exists in Figma but modes haven't been configured. Each semantic token needs a value for both Light and Dark modes, referencing the appropriate primitive.

**Component collection: configure Compact/Default/Spacious modes**
The Component/button collection exists but needs three modes defined with appropriate sizing values per mode.

**Space/sizing primitive scale**
A numeric spacing scale (`space/1` through `space/16` or similar) in the Primitives collection. Referenced by semantic layout tokens and component tokens.

**Figma Text Styles**
Composite typography styles: Display, Heading 1–4, Body Large, Body, Body Small, Label, Caption, Code. Each references font primitive variables for size, weight, and family.

---

## Application

**Theme toggle component**
Next.js component that sets `data-theme` on the `<html>` element. Should respect `prefers-color-scheme` as the default and allow manual override, persisted to `localStorage`.

**Density toggle (proof of concept)**
Simple UI control that sets `data-density` on the `<html>` element. Demonstrates the independent composition of theme and density axes.

**Actual site content**
Replace the placeholder with real portfolio content once the token pipeline is proven end-to-end at full fidelity.

**Figma design file**
Full page design built against the variable system before translating to code.
