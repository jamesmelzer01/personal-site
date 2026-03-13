# ADR-003: CSS Approach

## Status
Accepted

## Context
When initializing Next.js, Tailwind CSS is offered as the default styling option. The project goal is to build a design token pipeline where Figma variables become CSS custom properties that directly drive the visual design. Understanding that pipeline requires seeing the full chain from token to applied style. Abstracting it through a utility-class framework obscures that chain.

## Options Considered

**Tailwind CSS**
- Rapid development
- Obscures the relationship between design tokens and applied styles — utility classes don't consume CSS custom properties directly in a transparent way
- Enterprise design systems that own their token pipeline tend not to use Tailwind; tokens and utility classes are competing systems

**CSS Modules + CSS custom properties (hand-rolled)**
- Full visibility into how tokens become styles
- CSS custom properties are the natural output format for Style Dictionary
- Component-scoped styles via CSS Modules prevent conflicts
- Mirrors what enterprise design system teams actually build

## Decision
CSS Modules for component styles. A single global CSS reset (`globals.css`) for base normalization. All design values sourced from generated CSS custom properties in `src/styles/tokens.css`. No Tailwind anywhere in the project.

## Consequences
- Every style decision is explicit and traceable to a token or a deliberate local override
- More CSS to write by hand, but that's appropriate for a learning project
- The token → custom property → applied style chain is fully transparent
- Scales well: this is exactly how mature enterprise design systems manage tokens
