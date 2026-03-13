# ADR-002: Site Framework

## Status
Accepted

## Context
The original site was a single `index.html` with inline CSS. The goal of this project is to build an enterprise-grade Figma-to-code design token pipeline. That pipeline requires a build step — tokens need to be transformed into CSS and consumed by the application at build time. A plain HTML site has no build step and no way to cleanly integrate generated CSS files or run token transformation scripts.

Additionally, the primary audience for this project's lessons is enterprise clients, all of whom run JavaScript-based front-end environments.

## Options Considered

**Plain HTML + build script**
- Minimal complexity
- Awkward integration with token pipeline; no standard patterns to follow
- Not representative of client environments

**Astro**
- Static-first, lightweight, excellent for personal/content sites
- Smaller ecosystem than Next.js for enterprise reference
- Fewer enterprise clients using it

**Next.js (App Router)**
- Industry standard in enterprise JS environments
- Native TypeScript, CSS modules, image optimization out of the box
- App Router is the current paradigm (Pages Router is legacy)
- First-class Vercel support

## Decision
Next.js 16 with App Router and TypeScript. Bootstrapped with `create-next-app`, Tailwind declined (see ADR-003).

## Consequences
- Build step enables the token pipeline (Style Dictionary runs at build time / pre-commit)
- TypeScript adds type safety across the project
- App Router paradigm is the right thing to learn; it requires understanding React Server Components
- Heavier than needed for a personal placeholder page, but appropriate for the pipeline learning goals
