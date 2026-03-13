# ADR-007: Token Architecture

## Status
Accepted (in progress — component density and composite typography output are planned, not yet implemented)

## Context
With the hello world pipeline proven, we needed to define the full token architecture before expanding the Figma file. The decisions here govern how tokens are structured in Figma, how they're named and layered, how theming works, and how they're output to CSS.

## Options Considered

### Layering
**Flat (all tokens at one level)**
Common in simpler systems. Works at small scale but breaks down when theming is introduced — it's impossible to distinguish what should change per theme from what shouldn't.

**Two-layer (primitives + semantic)**
The most common enterprise pattern. Primitives hold raw values; semantic tokens reference primitives and carry meaning. Good for color and spacing.

**Three-layer (primitives + semantic + component)**
Extends two-layer with a component-specific layer for sizing/density. Necessary when supporting multiple UI densities. Used by Salesforce Lightning, IBM Carbon, and others.

### Typography output
**Custom properties only**
Each sub-value (size, weight, line-height) is its own CSS variable. Precise but verbose at point of use — every element needs multiple declarations.

**Utility classes only**
Pre-assembled CSS classes per text style. Convenient but opaque — hides the underlying token values.

**Both**
Custom properties for primitive values; generated utility classes for composite text styles. Most flexible.

### Theming mechanism
**Separate CSS files per theme**
`tokens.light.css` / `tokens.dark.css`. Clear separation, easy to audit in isolation. Slightly more complex import logic.

**Single file, scoped selectors**
Both themes in one file using `[data-theme="light"]` and `[data-theme="dark"]` selectors on `:root`. Simpler imports, slightly less traceable.

### Component density
**Baked into component styles**
Each component defines its own size variants. No shared system — harder to tune globally.

**Dedicated Variable Collection with modes**
A `Component` collection in Figma with Compact / Default / Spacious modes. Component tokens (button height, padding, border radius, text size) defined once per mode. A single `data-density` attribute switches the entire UI's spatial density independently of theme.

## Decision

**Three-layer architecture:**

| Layer | Figma Surface | Modes | Purpose |
|---|---|---|---|
| Primitives | Variable Collection | None | Raw values — color scale, font scale, space scale |
| Semantic | Variable Collection | Light / Dark | Role-based aliases into primitives; all color theming lives here |
| Component | Variable Collection | Compact / Default / Spacious | Component-specific sizing; density switching |
| Text Styles | Figma Text Styles | N/A | Composite typography; separate from Variables |

**Typography output:** Both individual CSS custom properties (from Variables) and generated utility classes (from Text Styles). Utility classes use custom properties internally.

**Theming:** Single CSS output file. Primitive tokens on `:root`. Semantic tokens scoped to `[data-theme="light"]` and `[data-theme="dark"]`. Density tokens scoped to `[data-density="compact"]`, `[data-density="default"]`, `[data-density="spacious"]`. The two axes compose independently.

**CSS custom properties in production:** `var()` references are not flattened. Modern browsers resolve them with negligible overhead. Flattening would break runtime theming. Build pipeline minifies whitespace and comments only.

## Current Figma file state

**Implemented:**
- `Primitives` collection: color (universals, neutrals, accents), typography (weight, size, family)
- `Semantic` collection: surface, text, icon, border, alert, interaction
- `Component` collection (button): border width, border radius, internal padding, text size

**Planned:**
- Semantic collection Light/Dark modes (variable mode configuration in Figma)
- Component collection Compact/Default/Spacious modes
- Space/sizing primitive scale
- Figma Text Styles for composite typography

## Consequences

- Plugin must be extended to: (1) resolve `VARIABLE_ALIAS` references into DTCG reference syntax rather than skipping them, (2) read Figma Text Styles alongside Variables
- Style Dictionary config expands to: multiple output files, scoped selectors for theme and density, custom formatter for typography utility classes
- Next.js needs a theme toggle component that sets `data-theme` on the root element
- Two independent runtime switches: `data-theme` (Light/Dark) and `data-density` (Compact/Default/Spacious)
- This architecture is the most significant design decision in the system — changes to layer boundaries or naming conventions are expensive after components are built against them
