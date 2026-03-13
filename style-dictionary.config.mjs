/**
 * Style Dictionary configuration.
 * Reads tokens/figma.raw.json and outputs:
 *   src/styles/tokens.css            — all non-typography tokens as CSS custom properties
 *   src/styles/tokens.typography.css — typography composite tokens as .type-* utility classes
 *
 * Run via: npm run build-tokens
 */

import StyleDictionary from 'style-dictionary';

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
// Configuration
// ---------------------------------------------------------------------------

const sd = new StyleDictionary({
  source: ['tokens/figma.raw.json'],
  platforms: {
    css: {
      transformGroup: 'css',
      buildPath: 'src/styles/',
      files: [
        {
          // All tokens except typography composites → CSS custom properties on :root
          destination: 'tokens.css',
          format: 'css/variables',
          filter: (token) => token.original?.$type !== 'typography',
          options: {
            selector: ':root',
            outputReferences: false,
          },
        },
        {
          // Typography composite tokens → .type-* utility classes
          destination: 'tokens.typography.css',
          format: 'css/typography-classes',
          filter: (token) => token.original?.$type === 'typography',
        },
      ],
    },
  },
});

await sd.buildAllPlatforms();
console.log('✓ CSS tokens written to src/styles/');
