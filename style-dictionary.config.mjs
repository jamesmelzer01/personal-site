/**
 * Style Dictionary configuration.
 * Reads tokens/figma.raw.json and outputs src/styles/tokens.css
 * as CSS custom properties on :root.
 *
 * Run via: npm run build-tokens
 */

import StyleDictionary from 'style-dictionary';

const sd = new StyleDictionary({
  source: ['tokens/figma.raw.json'],
  platforms: {
    css: {
      transformGroup: 'css',
      buildPath: 'src/styles/',
      files: [
        {
          destination: 'tokens.css',
          format: 'css/variables',
          options: {
            selector: ':root',
            outputReferences: false,
          },
        },
      ],
    },
  },
});

await sd.buildAllPlatforms();
console.log('✓ CSS tokens written to src/styles/tokens.css');
