/**
 * Surface token lookup — maps Surface prop values to CSS custom property references.
 * Import Surface and surfaceTokens into any component that accepts a surface prop.
 *
 * "ground" is intentionally excluded: it is reserved for the page background
 * and should not be applied directly to components.
 */

export const surfaceTokens = {
  low:  "var(--semantic-color-surface-low)",
  base: "var(--semantic-color-surface-base)",
  high: "var(--semantic-color-surface-high)",
} as const;

export type Surface = keyof typeof surfaceTokens;
