# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal site for James Melzer (jamesmelzer.com). This repo is also the testbed for a Figma-to-code design token pipeline using the Figma Variables REST API, Style Dictionary, and GitHub Actions.

**Hosting:** Vercel — auto-deploys on push to `main`.
**Repo:** https://github.com/james-bearings-ux/personal-site

## Dev Commands

```bash
npm run dev          # local dev server (localhost:3000)
npm run build        # production build
npm run lint         # ESLint
npm run fetch-tokens # pull variables from Figma API → tokens/figma.raw.json  (once set up)
npm run build-tokens # Style Dictionary transform → src/styles/tokens.css     (once set up)
```

Node version managed via nvm. Run `nvm use` if versions mismatch.

## Architecture

**Framework:** Next.js 16, App Router, TypeScript.
**CSS:** Hand-rolled CSS custom properties — no Tailwind (except the reset in `globals.css`). All design values come from generated token files.

### Token Pipeline

```
Figma Variables
  → scripts/fetch-tokens.ts       (calls Figma REST API, outputs JSON)
  → tokens/figma.raw.json         (raw token data, committed)
  → style-dictionary.config.js    (transforms JSON → CSS)
  → src/styles/tokens.css         (generated, committed, imported in layout.tsx)
```

GitHub Actions runs this pipeline on a schedule and on manual trigger, then commits changes so Vercel redeploys.

### Key files

- `src/app/layout.tsx` — root layout, imports `globals.css` and `tokens.css`
- `src/app/globals.css` — CSS reset only
- `src/styles/tokens.css` — generated from Figma variables, do not edit by hand
- `scripts/fetch-tokens.ts` — Figma API fetch script
- `.github/workflows/sync-tokens.yml` — automated sync workflow

### Images

SVG assets live in `public/img/`.
