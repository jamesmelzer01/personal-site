# ADR 011: Line-height as code-only primitives; values copied into typography composites

## Context

Figma Variables support a "line-height" data type, but it only accepts pixel values. Px line-heights are problematic for web typography because they don't scale with font size — if a type style's size changes, the line-height relationship breaks and must be updated manually.

Proportional line-height (expressed as a percentage like `120%` or a unitless ratio like `1.2`) is strongly preferred for CSS because it maintains the intended visual rhythm automatically.

This is the same class of constraint as shadow geometry (ADR 007): a CSS property whose semantic meaning requires a value type that Figma Variables cannot store correctly.

## Options considered

**Option A — Accept px from Variables**
Use Figma's line-height Variable type, accepting px output. Line-heights would need manual updates whenever font sizes change. Simpler pipeline, worse output.

**Option B — Primitive tokens as rules, copied into composites (chosen)**
Define 2–3 line-height rules as string-typed primitive tokens in Figma (e.g. `typography/line-height/heading: "120%"`). These export through the pipeline and produce CSS custom properties (`--primitives-typography-line-height-heading: 120%`). Typography composite tokens in the JSON store the literal string value (`"lineHeight": "120%"`), manually aligned to the primitive. Figma remains the documented source of truth for the rules; alignment is a manual authoring step, not an automated reference.

**Option C — Resolve references inside composites**
Reference the primitive inside the typography composite (`"lineHeight": "{primitives.typography.line-height.heading}"`), then update the Style Dictionary formatter to resolve that reference. Technically correct but adds formatter complexity, and the formatter's use of `token.original.$value` (required to avoid the font shorthand transform) bypasses reference resolution — making this unreliable without deeper changes.

## Decision

Use Option B. The line-height scale has only 2–3 values (tight/heading/body), making manual alignment low-cost. The primitive tokens serve as the documented rule; the composite tokens copy the value directly.

## Line-height scale

| Token | Value | Applied to |
|---|---|---|
| `primitives/typography/line-height/ui` | `110%` | UI labels, tabs, buttons |
| `primitives/typography/line-height/heading` | `120%` | Headings, display |
| `primitives/typography/line-height/body` | `140%` | Body text |

## Implementation

Primitive tokens live in the `primitives` collection in Figma as `$type: "string"`. They output to `tokens.css` as CSS custom properties.

Typography composite tokens in `tokens/figma.raw.json` set `lineHeight` as a literal string matching the primitive value:

```json
{
  "typography": {
    "heading-1": {
      "$value": {
        "fontFamily": "Overpass",
        "fontSize": "48px",
        "fontWeight": 600,
        "lineHeight": "120%"
      },
      "$type": "typography"
    }
  }
}
```

The Style Dictionary typography formatter (`style-dictionary.config.mjs`) uses `token.original.$value` to access composite properties before the font shorthand transform is applied. Since `lineHeight` is stored as a literal string (not a reference), it passes through correctly with no formatter changes required.

## Authoring rule

When a line-height primitive value is updated in Figma, the corresponding `lineHeight` values in all affected typography composite tokens must be updated manually to match. The two values must stay in sync — the primitive documents the intent, the composite implements it.

## Known export artifact

Figma stores line-height multipliers internally as 32-bit floats. On export via the plugin, percentage values may appear with floating-point noise: `115%` exports as `1.149999976158142` rather than `1.15`. These values should be cleaned to 2 decimal places in `figma.raw.json` after each export (find/replace is sufficient). The cleaned values are the correct source of truth — the noise is an export artifact, not an intentional value.

## Consequences

- Line-heights in generated CSS are proportional (`120%`) not fixed (`px`), which is the correct behavior for web typography.
- The pipeline produces `--primitives-typography-line-height-*` custom properties usable anywhere proportional line-height is needed outside of typography composites (e.g. one-off UI elements).
- A discrepancy between the primitive and composite values is not caught automatically. This is an accepted tradeoff given the small scale of the line-height system.
