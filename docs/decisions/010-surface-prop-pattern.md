# ADR 010: Surface prop pattern — token aliasing via component props

## Context

Full-row section components (FeatureAccordion, TabbedSlideshow, OffsetList, SideBySide) each have a background color drawn from the semantic surface token scale. Initially these were hardcoded in each component's CSS module. This made it impossible to change a component's surface from the call site without editing the component's source file.

The goal was to make surface color a configurable prop — matching the `Surface` Variant property added to each component in Figma — while keeping the mapping between prop values and CSS tokens explicit and maintainable.

## Options considered

**Option A — String interpolation**
Construct the CSS variable name directly from the prop value:
```tsx
style={{ backgroundColor: `var(--semantic-color-surface-${surface})` }}
```
Simple, and stays in sync with the token structure automatically. The risk: a typo in a prop value (or a future token rename) produces an invalid `var()` reference that fails silently — no TypeScript error, no runtime error, just a transparent background.

**Option B — Lookup object (chosen)**
Map each valid prop value to its full CSS variable reference explicitly:
```ts
export const surfaceTokens = {
  low:  "var(--semantic-color-surface-low)",
  base: "var(--semantic-color-surface-base)",
  high: "var(--semantic-color-surface-high)",
} as const;

export type Surface = keyof typeof surfaceTokens;
```
The `Surface` type is derived from the object keys, so TypeScript enforces valid values at every call site. A token rename requires updating one file. The mapping is greppable.

## Decision

Use the lookup object (Option B). The shared file lives at `src/styles/tokens.surface.ts`.

`ground` is intentionally excluded from the lookup. It is reserved for the page background and should not be applied to components.

## How the pipeline connects

```
Figma Variables (semantic/color/surface/*)
  → tokens/figma.raw.json
  → src/styles/tokens.semantic.css      (--semantic-color-surface-* custom properties)
  → src/styles/tokens.surface.ts        (surfaceTokens lookup + Surface type)
  → component props (surface?: Surface) (TypeScript-enforced, call-site-configurable)
  → inline style: backgroundColor       (applied at render time)
```

## Per-component wiring

Each component that accepts a `surface` prop follows the same pattern:

```tsx
import { surfaceTokens, Surface } from "@/styles/tokens.surface";

interface MyComponentProps {
  surface?: Surface;
  // ...other props
}

export function MyComponent({ surface = "base", ...props }: MyComponentProps) {
  return (
    <div style={{ backgroundColor: surfaceTokens[surface] }}>
      ...
    </div>
  );
}
```

The hardcoded `background-color` is removed from the component's CSS module. The default value preserves prior behavior so existing usages without an explicit `surface` prop are unaffected.

## Call-site usage

Surface is declared explicitly at every call site, even when it matches the default, so intent is visible in the JSX:

```tsx
<FeatureAccordion surface="base" ...>
<TabbedSlideshow surface="low" ...>
<OffsetList surface="low" ...>
```

Changing all components on a page to a different surface is a single pass through the call sites — no component source files need to be touched.

## Consequences

- Adding a new surface token requires: (1) adding the Figma variable, (2) rebuilding tokens, (3) adding the key to `surfaceTokens` in `tokens.surface.ts`. The TypeScript type updates automatically.
- Removing a surface token will produce TypeScript errors at any call site using that value — a safe, loud failure.
- Components that do not yet accept a `surface` prop (TypeShowcase, ButtonShowcase, TabsShowcase) are demo scaffolding and can be updated if they graduate to production components.
