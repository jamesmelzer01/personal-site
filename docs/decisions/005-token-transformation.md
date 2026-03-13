# ADR-005: Token Transformation Tool

## Status
Accepted

## Context
Raw token data from Figma (JSON) needs to be transformed into platform-specific outputs — in our case, CSS custom properties. A transformation layer is needed to handle naming conventions, value formatting (e.g. Figma's RGBA floats → hex), and output file generation.

## Options Considered

**Hand-rolled transform script**
- Full control
- Reinvents a solved problem; maintenance burden
- Non-standard, harder to hand off

**Theo (by Tokens)**
- Lightweight transformer
- Smaller community, less enterprise adoption

**Style Dictionary (by Amazon)**
- Industry standard; used by major enterprise design systems
- Supports DTCG token format (`$value`, `$type`) natively in v4+
- Highly configurable: multiple output platforms (CSS, JS, iOS, Android) from one source
- Large community, well-documented, actively maintained

## Decision
Style Dictionary v5. Configured in `style-dictionary.config.mjs` at the project root. Input: `tokens/figma.raw.json`. Output: `src/styles/tokens.css` (CSS custom properties on `:root`).

Token naming follows the slash-separated hierarchy from Figma variable names:
`primitives/color/brand/primary` → `--primitives-color-brand-primary`

## Consequences
- CSS custom property naming is verbose but fully traceable to the Figma variable name
- Style Dictionary can output to multiple platforms simultaneously — a future iteration could add JS/TypeScript token exports alongside CSS
- DTCG format future-proofs the token schema as the community standard matures
- `src/styles/tokens.css` is generated and should never be edited by hand
