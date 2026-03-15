# ADR-008: Motion Token Architecture

## Context

Animation work on the `/tokens` page produced two animation systems — scroll-reveal (global CSS) and panel switching (CSS Modules) — both with hardcoded timing, easing, and distance values. These values were tracked as inline "proto-token candidates" in code comments while the design intent was being explored.

A first-pass motion token set has been defined in Figma and verified against the code values.

## Decision

Motion tokens are defined as **primitives** in the Figma variable collection and piped through Style Dictionary alongside the existing primitive tokens.

### Token structure

```
motion
  duration
    quick   250ms   — micro-interactions (hover, focus)
    normal  400ms   — fades, opacity transitions
    easy    560ms   — spring-eased translations (scroll reveal)
    slow    1000ms  — deliberate panel transitions
  distance
    xsmall  4px
    small   8px
    medium  16px
    large   32px    — scroll-reveal translate distance
    xlarge  40px    — panel slide distance
  easing
    spring  cubic-bezier(0.16, 1, 0.3, 1)  — spring ease-out
    appear  ease-out                         — gentle fade curve
```

### Decoupled opacity + transform timing

A deliberate pattern used in both animation systems: opacity and transform transitions use different durations and easings. The spring easing progresses 80%+ in ~100ms, making opacity appear as a pop rather than a fade at that speed. Opacity uses `appear` easing at `normal` duration so it resolves visibly before the translation completes, creating a layered two-stage feel.

### Pipeline considerations

Two `$type` values require special handling in the Style Dictionary formatter:

- `$type: "number"` (durations) — raw millisecond integers with no unit. The formatter must append `ms` before writing to CSS.
- `$type: "string"` (easing) — cubic-bezier and named easing values. Must pass through as-is; no unit transform should be applied.

## Current state

Motion tokens are defined in Figma and present in `tokens/figma.raw.json` but not yet wired through Style Dictionary. CSS files currently use hardcoded values with inline comments mapping them to the token names. Wiring is the next pipeline step.

## Consequences

- Motion values become single-source-of-truth in Figma, consistent with all other design tokens
- Duration/easing/distance combinations can be updated globally by changing one token
- The `$type: "number"` and `$type: "string"` handling establishes a pattern for future non-standard token types in the pipeline
