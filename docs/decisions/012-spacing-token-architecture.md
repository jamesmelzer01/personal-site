# ADR 012: Two-tier spacing token architecture — fixed primitives and responsive scale

## Context

Prior to this decision, spacing values in component CSS were a mix of hardcoded pixels and ad-hoc `layout-helpers/padding-*` tokens that had grown incrementally without a coherent scale. There was no primitive spacing scale, no predictable relationship between values, and no way to distinguish fixed-size intent from responsive-size intent at the token name level.

A gap analysis (2026-03-18) confirmed that `8px`, `12px`, `16px`, and `24px` appeared as raw values across multiple components, and that existing motion tokens (`motion-distance-small/medium`) were being misused as layout spacing tokens because no layout-specific equivalents existed.

The goal was to introduce a proper spacing scale that:
- Is grounded in a consistent base unit
- Distinguishes between values that should be fixed across all viewports vs. values that should compress on smaller screens
- Is traceable from Figma through the pipeline to CSS

## Base unit

**4px.** All scale steps are multiples of 4px. This aligns with the most common convention in UI design systems and ensures spacing values land on 4px-grid increments throughout.

## Options considered

**Option A — Single flat scale with responsive overrides in CSS**
One set of tokens (e.g. `space/4x = 16px`) with ad-hoc media query overrides written directly in component CSS when responsive behavior is needed. Simple to define, but the responsive intent is invisible at the token level — you can't tell from a token name whether its value is stable or variable.

**Option B — Semantic names only (e.g. `space/component-gap`, `space/section-margin`)**
Name tokens by their intended role rather than their numeric value. Common in mature systems. Rejected for now: the component library is small and the naming taxonomy isn't stable enough to commit to. Premature semantic naming often produces either too-coarse a vocabulary (every component shares names that don't quite fit) or too-fine a vocabulary (one token per use, which defeats the purpose). Noted as the likely direction once the component library matures — see Consequences.

**Option C — Two parallel numeric scales by responsive tier (chosen)**
Define two parallel token collections with identical naming:
- `primitives/space/*` — fixed values, same at every viewport
- `breakpoints/space/*` — responsive values, different per breakpoint

The names (`1x`–`20x`) are numeric multipliers of the 4px base. Components choose which tier to reference based on whether the spacing should flex with viewport size.

## Decision

Use Option C.

### Scale

| Step | Fixed value (`primitives/space`) | Responsive values (`breakpoints/space`) |
|:-----|:---------------------------------|:---------------------------------------|
| 1x   | 4px                              | 4px / 4px / 4px                        |
| 2x   | 8px                              | 8px / 8px / 8px                        |
| 3x   | 12px                             | 8px / 8px / 12px                       |
| 4x   | 16px                             | 12px / 12px / 16px                     |
| 6x   | 24px                             | 16px / 16px / 24px                     |
| 8x   | 32px                             | 16px / 24px / 32px                     |
| 10x  | 40px                             | 16px / 24px / 40px                     |
| 16x  | 64px                             | 24px / 32px / 64px                     |
| 20x  | 80px                             | 24px / 32px / 80px                     |

Breakpoint columns: mobile / tablet / desktop.

### Named semantic tokens in the responsive tier

The previous `layout-helpers/v-margin-*` tokens were kept and migrated into `breakpoints/space/` as named aliases (`v-margin-m`, `v-margin-l`, `v-margin-xl`). These express design intent ("this is the large section margin") while referencing the numeric scale as their source values. They are used exclusively for section-level vertical padding and structural gaps between major layout regions.

### CSS output

`primitives/space/*` tokens output to `tokens.css` as `--primitives-space-Nx` (e.g. `--primitives-space-4x: 16px`).

`breakpoints/space/*` tokens output to `tokens.breakpoints.css` as `--space-Nx` with per-breakpoint overrides in `@media` blocks (e.g. `--space-4x` resolves to `12px` at mobile and `16px` at desktop).

The prefix difference (`--primitives-` vs. none) makes the tier immediately visible at the point of use in component CSS.

### Usage conventions

- **Internal component spacing** (gaps between elements within a component, internal padding) — use `--primitives-space-*`. Component density is a design-time decision, not a viewport-driven one.
- **Section-level spacing** (top/bottom padding on full-width sections, structural gaps between major layout blocks) — use `--space-v-margin-*` or `--space-Nx` from the responsive tier. These should compress gracefully on smaller screens.

## Consequences

- All component CSS is now free of raw pixel spacing values and legacy `--layout-helpers-*` references.
- The tier a component is using (fixed vs. responsive) is readable from the token name prefix alone, without consulting the token file.
- The numeric naming (`4x`, `6x`) breaks down in the responsive tier: `--space-4x` at mobile is `12px`, not `16px` — the multiplier math only holds at the full desktop size. This is an accepted tradeoff. The names communicate relative scale, not exact values, in the responsive context.
- Semantic spacing names (Option B) remain the long-term direction. When the component library is large enough that recurring spacing roles become clear — `component-gap`, `section-margin`, `inline-padding`, etc. — the numeric tier should be aliased or replaced with intent-based names. The numeric scale provides a stable foundation to build those aliases on top of.
