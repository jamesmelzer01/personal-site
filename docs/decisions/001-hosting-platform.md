# ADR-001: Hosting Platform

## Status
Accepted

## Context
The original site was a static HTML file hosted on GitHub Pages. Migrating to Next.js (see ADR-002) introduced a build step that GitHub Pages doesn't handle natively without a static export configuration — which restricts future Next.js features (server components, API routes, ISR). A hosting platform that understands Next.js natively was needed.

## Options Considered

**GitHub Pages**
- Free, already in use
- Requires `next export` (static-only mode), permanently forecloses dynamic Next.js features
- Manual or Actions-based deploy pipeline

**Vercel**
- Built by the Next.js team, deploys any Next.js mode without configuration
- Free tier sufficient for a personal site
- Auto-deploys on every push; preview deployments on every PR with a unique URL
- Automatic SSL via Let's Encrypt with no setup required
- Native GitHub integration with status checks in PR UI

## Decision
Vercel (free tier), connected to the GitHub repo. `main` branch deploys to production. All other branches deploy to preview URLs.

## Consequences
- Zero-config deploys; no GitHub Actions needed for the deploy step itself
- SSL certificate provisioned automatically once DNS resolves to Vercel
- Preview URLs make design review shareable before merging
- Vendor relationship with Vercel, though the cost to migrate away is low (just a hosting change)
- Domain DNS managed at Network Solutions: A record → `76.76.21.21`, CNAME (www) → `cname.vercel-dns.com`
