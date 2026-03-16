# Token Pipeline Guide

How design token changes flow from Figma to the browser.

---

## Overview

```
Figma Variables
  → Figma plugin (copy JSON to clipboard)
  → tokens/figma.raw.json (paste, save, commit)
  → Style Dictionary (npm run build-tokens)
  → src/styles/tokens.*.css + tokens.breakpoints.ts
  → Browser
```

---

## Making a token change

### 1. Update Figma Variables
Edit variable values or add new variables in the Figma file.

### 2. Export via plugin
Run the Figma plugin. It reads the variable collections via the Plugin API and copies DTCG-format JSON to your clipboard.

### 3. Paste into `tokens/figma.raw.json`
Replace the file contents with the clipboard JSON. This is the source of truth for all tokens in the codebase.

### 4. Regenerate token files
```bash
npm run build-tokens
```
This runs Style Dictionary and writes new versions of:
- `src/styles/tokens.css` — primitive tokens as CSS custom properties on `:root`
- `src/styles/tokens.semantic.css` — `[data-theme="light"]` and `[data-theme="dark"]` blocks
- `src/styles/tokens.component.css` — `[data-density="compact/default/spacious"]` blocks
- `src/styles/tokens.breakpoints.css` — mobile-first `@media` query blocks
- `src/styles/tokens.typography.css` — `.type-*` utility classes
- `src/styles/tokens.breakpoints.ts` — TypeScript breakpoint constants

### 5. Commit everything together
Commit both `tokens/figma.raw.json` and the regenerated `src/styles/` files in the same commit.

> **Note:** The generated token files are intentionally committed. Vercel's build environment does not run `build-tokens` — it needs the pre-built CSS files present in the repo.

---

## What happens on push to `main`

When a push to `main` includes changes to `tokens/figma.raw.json`, a GitHub Actions workflow runs automatically:

1. Checks out the repo
2. Runs `npm ci` and `npm run build-tokens`
3. Commits any changed files in `src/styles/` back to `main` with the message `chore: regenerate token files [skip ci]`
4. The `[skip ci]` tag prevents the workflow from triggering itself again
5. Vercel detects the new commit on `main` and deploys to production

**If you already ran `build-tokens` locally and committed the output**, the workflow will find no diff and skip the commit step — no double-commit.

**If you pushed `figma.raw.json` without regenerating locally**, the workflow catches it and regenerates on your behalf. You will need to `git pull` before your next push to incorporate the auto-commit.

---

## Local dev behavior

Next.js watches `src/styles/` for changes. When `build-tokens` rewrites the CSS files, the dev server hot-reloads the browser automatically.

`tokens/figma.raw.json` itself is not watched by Next.js — changing it has no visible effect until `build-tokens` runs.

---

## Partial update: editing tokens directly in JSON

For tokens with no Figma equivalent (e.g. `primitives.shadow.text-overlay-geometry`, motion easing strings), edit `tokens/figma.raw.json` directly and run `build-tokens`. Skip the plugin step. Note in a comment or commit message that the value is code-only and will not sync back to Figma automatically.

---

## Backlogged improvements

- **Plugin → GitHub API**: commit `figma.raw.json` directly from the plugin, eliminating the manual paste step. See `docs/backlog.md`.
- **Figma REST API sync**: fully headless alternative to the plugin, requires Figma Enterprise. See `docs/backlog.md` and ADR-004.
