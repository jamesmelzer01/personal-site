/**
 * Style Dictionary configuration.
 * Reads tokens/figma.raw.json and outputs:
 *   src/styles/tokens.css              — primitive tokens as CSS custom properties on :root
 *   src/styles/tokens.semantic.css     — [data-theme="light"] and [data-theme="dark"] blocks
 *   src/styles/tokens.component.css    — [data-density="compact/default/spacious"] blocks
 *   src/styles/tokens.breakpoints.css  — mobile-first @media query blocks for grid/layout tokens
 *   src/styles/tokens.typography.css   — typography composite tokens as .type-* utility classes
 *
 * Tokens with any path segment prefixed with "_" are Figma-only and skipped in all outputs.
 *
 * Run via: npm run build-tokens
 */

import StyleDictionary from 'style-dictionary';

// ---------------------------------------------------------------------------
// Custom transform: motion duration → ms
//
// Duration tokens use $type: "number" (raw integer milliseconds) because
// Figma has no native duration type. The css transformGroup does not add
// units to number tokens, so we append "ms" here.
//
// Scoped to tokens whose path includes "duration" so other number tokens
// (e.g. grid columns) are unaffected.
// ---------------------------------------------------------------------------

StyleDictionary.registerTransform({
  name: 'motion/duration-ms',
  type: 'value',
  filter: (token) => token.$type === 'number' && token.path.includes('duration'),
  transform: (token) => `${token.$value}ms`,
});

// ---------------------------------------------------------------------------
// Custom transform: component spacing/sizing → px
//
// Component tokens typed as $type: "number" (raw integers) rather than
// $type: "dimension" (e.g. accordion padding/border-width). Appends "px"
// so values are valid CSS. Scoped to component-* collections only, and
// excludes duration tokens already handled by motion/duration-ms.
// ---------------------------------------------------------------------------

StyleDictionary.registerTransform({
  name: 'dimension/px',
  type: 'value',
  filter: (token) =>
    token.$type === 'number' &&
    token.path[0]?.startsWith('component-') &&
    !token.path.includes('duration'),
  transform: (token) => `${token.$value}px`,
});

StyleDictionary.registerTransformGroup({
  name: 'css/extended',
  transforms: [
    ...(StyleDictionary.hooks.transformGroups['css'] ?? []),
    'motion/duration-ms',
    'dimension/px',
  ],
});

// ---------------------------------------------------------------------------
// Custom format: themed CSS blocks
//
// Groups tokens by their first path segment (e.g. "semantic-light",
// "component-default") and outputs one [data-*] scoped block per mode.
//
// Variable names strip the mode suffix so the same var name works across
// themes: "semantic-light/color/text/primary" → "--semantic-color-text-primary"
// in both [data-theme="light"] and [data-theme="dark"].
// ---------------------------------------------------------------------------

StyleDictionary.registerFormat({
  name: 'css/themed-variables',
  format: ({ dictionary, options }) => {
    const { attribute = 'data-theme' } = options ?? {};

    // Group tokens by first path segment.
    const groups = new Map();
    for (const token of dictionary.allTokens) {
      const key = token.path[0]; // e.g. "semantic-light"
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(token);
    }

    const lines = [
      '/**',
      ' * Do not edit directly, this file was auto-generated.',
      ' */',
      '',
    ];

    for (const [key, tokens] of groups) {
      // "semantic-light" → theme = "light", base = "semantic"
      // "component-compact" → theme = "compact", base = "component"
      const segments = key.split('-');
      const themeName = segments.pop();          // last segment = mode name
      const collectionBase = segments.join('-'); // everything before it

      lines.push(`[${attribute}="${themeName}"] {`);
      for (const token of tokens) {
        // Rebuild var name as "--{collectionBase}-{rest of path}"
        // e.g. path ["semantic-light","color","text","primary"] → "--semantic-color-text-primary"
        const varName = `--${collectionBase}-${token.path.slice(1).join('-')}`;
        lines.push(`  ${varName}: ${token.$value};`);
      }
      lines.push('}');
      lines.push('');
    }

    return lines.join('\n');
  },
});

// ---------------------------------------------------------------------------
// Custom format: breakpoint-scoped CSS variables
//
// Groups tokens by breakpoint collection (breakpoints-mobile, -tablet,
// -desktop), reads the "min-width" token to construct the @media condition,
// then outputs all other non-skipped tokens as CSS custom properties with the
// collection prefix stripped: "breakpoints-desktop/grid/edge" → "--grid-edge".
//
// Mobile (min-width: 0) is output as :root defaults with no @media wrapper,
// following the mobile-first convention.
//
// Tokens are skipped when any path segment after path[0] starts with "_"
// (Figma-only tokens) or equals "min-width" (used for the query, not a var).
// ---------------------------------------------------------------------------

StyleDictionary.registerFormat({
  name: 'css/media-query-variables',
  format: ({ dictionary }) => {
    // Group tokens by first path segment and sort by min-width ascending.
    const groups = new Map();
    for (const token of dictionary.allTokens) {
      const key = token.path[0];
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(token);
    }

    // Resolve min-width for each group so we can sort mobile-first.
    const sorted = [...groups.entries()].sort((a, b) => {
      const minWidth = (tokens) =>
        parseInt(tokens.find((t) => t.path[1] === 'min-width')?.$value ?? '0', 10);
      return minWidth(a[1]) - minWidth(b[1]);
    });

    const SKIP = (token) =>
      token.path.slice(1).some((seg) => seg.startsWith('_')) ||
      token.path[1] === 'min-width';

    const lines = [
      '/**',
      ' * Do not edit directly, this file was auto-generated.',
      ' */',
      '',
    ];

    for (const [key, tokens] of sorted) {
      const minWidthToken = tokens.find((t) => t.path[1] === 'min-width');
      const minWidthValue = minWidthToken?.$value ?? '0px';
      const isMobileDefault = parseInt(minWidthValue, 10) === 0;

      const outputTokens = tokens.filter((t) => !SKIP(t));
      if (outputTokens.length === 0) continue;

      // Variable names strip path[0] (the breakpoint collection name).
      // "breakpoints-desktop/grid/edge" → "--grid-edge"
      const vars = outputTokens.map(
        (t) => `  --${t.path.slice(1).join('-')}: ${t.$value};`
      );

      if (isMobileDefault) {
        lines.push(':root {');
        lines.push(...vars);
        lines.push('}');
      } else {
        lines.push(`@media (min-width: ${minWidthValue}) {`);
        lines.push('  :root {');
        lines.push(...vars.map((v) => `  ${v}`));
        lines.push('  }');
        lines.push('}');
      }
      lines.push('');
    }

    return lines.join('\n');
  },
});

// ---------------------------------------------------------------------------
// Custom format: typography utility classes
//
// Reads $type: "typography" composite tokens and outputs .type-[name] CSS
// classes with individual font properties. Uses token.original.$value to
// access the composite object before Style Dictionary applies its font
// shorthand transform to token.value.
// ---------------------------------------------------------------------------

StyleDictionary.registerFormat({
  name: 'css/typography-classes',
  format: ({ dictionary }) => {
    const lines = [
      '/**',
      ' * Do not edit directly, this file was auto-generated.',
      ' */',
      '',
    ];

    for (const token of dictionary.allTokens) {
      const val = token.original.$value;
      // Strip the top-level "typography" path segment for the class name.
      // typography.heading-1 → .type-heading-1
      const className = token.path.slice(1).join('-');

      // Quote font family names that contain spaces.
      const fontFamily = val.fontFamily.includes(' ')
        ? `'${val.fontFamily}'`
        : val.fontFamily;

      lines.push(`.type-${className} {`);
      lines.push(`  font-family: ${fontFamily};`);
      lines.push(`  font-size: ${val.fontSize};`);
      lines.push(`  font-weight: ${val.fontWeight};`);
      lines.push(`  line-height: ${val.lineHeight};`);
      if (val.letterSpacing && val.letterSpacing !== '0') {
        lines.push(`  letter-spacing: ${val.letterSpacing};`);
      }
      lines.push('}');
      lines.push('');
    }

    return lines.join('\n');
  },
});

// ---------------------------------------------------------------------------
// Custom format: breakpoint constants (TypeScript)
//
// Outputs breakpoint min-width values as a typed TypeScript const object
// for use in JS/TS contexts (e.g. matchMedia, window.innerWidth comparisons).
// Values are output as plain numbers (px stripped) to avoid string coercion
// at the call site.
//
// Output: export const breakpoints = { mobile: 0, tablet: 800, ... } as const;
// ---------------------------------------------------------------------------

StyleDictionary.registerFormat({
  name: 'typescript/breakpoint-constants',
  format: ({ dictionary }) => {
    const tokens = [...dictionary.allTokens].sort(
      (a, b) => parseInt(a.$value, 10) - parseInt(b.$value, 10)
    );

    const lines = [
      '/**',
      ' * Do not edit directly, this file was auto-generated.',
      ' */',
      '',
      '/** Breakpoint min-width values in px — for use with matchMedia / window.innerWidth. */',
      'export const breakpoints = {',
    ];

    for (const token of tokens) {
      // "breakpoints-tablet" → "tablet"
      const name = token.path[0].replace('breakpoints-', '');
      const value = parseInt(token.$value, 10);
      lines.push(`  ${name}: ${value},`);
    }

    lines.push('} as const;');
    lines.push('');
    lines.push('export type Breakpoint = keyof typeof breakpoints;');
    lines.push('');
    return lines.join('\n');
  },
});

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const sd = new StyleDictionary({
  source: ['tokens/figma.raw.json'],
  platforms: {
    css: {
      transformGroup: 'css/extended',
      buildPath: 'src/styles/',
      files: [
        {
          // Primitive tokens only → CSS custom properties on :root
          destination: 'tokens.css',
          format: 'css/variables',
          filter: (token) => token.path[0] === 'primitives',
          options: {
            selector: ':root',
            outputReferences: false,
          },
        },
        {
          // Semantic tokens → [data-theme="light"] and [data-theme="dark"] blocks
          destination: 'tokens.semantic.css',
          format: 'css/themed-variables',
          filter: (token) => token.path[0].startsWith('semantic-'),
          options: { attribute: 'data-theme' },
        },
        {
          // Component tokens → [data-density="compact/default/spacious"] blocks
          destination: 'tokens.component.css',
          format: 'css/themed-variables',
          filter: (token) => token.path[0].startsWith('component-'),
          options: { attribute: 'data-density' },
        },
        {
          // Breakpoint tokens → mobile-first @media query blocks
          destination: 'tokens.breakpoints.css',
          format: 'css/media-query-variables',
          filter: (token) => token.path[0].startsWith('breakpoints-'),
        },
        {
          // Typography composite tokens → .type-* utility classes
          destination: 'tokens.typography.css',
          format: 'css/typography-classes',
          filter: (token) => token.original?.$type === 'typography',
        },
      ],
    },
    js: {
      transformGroup: 'js',
      buildPath: 'src/styles/',
      files: [
        {
          // Breakpoint min-widths → TypeScript const object
          destination: 'tokens.breakpoints.ts',
          format: 'typescript/breakpoint-constants',
          filter: (token) =>
            token.path[0].startsWith('breakpoints-') && token.path[1] === 'min-width',
        },
      ],
    },
  },
});

await sd.buildAllPlatforms();
console.log('✓ Token files written to src/styles/');
