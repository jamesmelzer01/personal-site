/**
 * Fetches variables from the Figma REST API and writes them to
 * tokens/figma.raw.json in Style Dictionary (DTCG) format.
 *
 * Requires env vars: FIGMA_TOKEN, FIGMA_FILE_KEY
 * Locally: set these in .env.local
 * CI: set these as GitHub Actions secrets
 */

import { writeFileSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

dotenv.config({ path: resolve(ROOT, '.env.local') });

const { FIGMA_TOKEN, FIGMA_FILE_KEY } = process.env;

if (!FIGMA_TOKEN || !FIGMA_FILE_KEY) {
  console.error('Error: FIGMA_TOKEN and FIGMA_FILE_KEY must be set in .env.local or environment');
  process.exit(1);
}

// Convert Figma RGBA (0–1 floats) to a CSS hex string.
// Appends alpha channel only when the value is not fully opaque.
function rgbaToHex({ r, g, b, a }) {
  const toHex = (n) => Math.round(n * 255).toString(16).padStart(2, '0');
  const hex = `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  return a < 1 ? `${hex}${toHex(a)}` : hex;
}

// Sets a value at a slash-separated path on a nested object.
// e.g. "primitives/color/brand/primary" → { primitives: { color: { brand: { primary: value } } } }
function setNestedValue(obj, path, value) {
  const parts = path.split('/');
  let node = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    if (!node[parts[i]]) node[parts[i]] = {};
    node = node[parts[i]];
  }
  node[parts[parts.length - 1]] = value;
}

async function fetchFigmaVariables() {
  const url = `https://api.figma.com/v1/files/${FIGMA_FILE_KEY}/variables/local`;
  console.log(`Fetching variables from Figma file: ${FIGMA_FILE_KEY}`);

  const res = await fetch(url, {
    headers: { 'X-Figma-Token': FIGMA_TOKEN },
  });

  if (!res.ok) {
    console.error(`Figma API error: ${res.status} ${res.statusText}`);
    process.exit(1);
  }

  const data = await res.json();
  const { variables, variableCollections } = data.meta;

  const tokens = {};

  for (const variable of Object.values(variables)) {
    const { name, resolvedType, variableCollectionId, valuesByMode } = variable;
    const collection = variableCollections[variableCollectionId];
    const rawValue = valuesByMode[collection.defaultModeId];

    // Skip alias references (variable pointing to another variable).
    // Alias resolution will be added in a future iteration.
    if (rawValue?.type === 'VARIABLE_ALIAS') continue;

    let $value, $type;

    if (resolvedType === 'COLOR') {
      $value = rgbaToHex(rawValue);
      $type = 'color';
    } else if (resolvedType === 'FLOAT') {
      $value = rawValue;
      $type = 'number';
    } else if (resolvedType === 'STRING') {
      $value = rawValue;
      $type = 'string';
    } else {
      continue;
    }

    setNestedValue(tokens, name, { $value, $type });
  }

  return tokens;
}

const tokens = await fetchFigmaVariables();

mkdirSync(resolve(ROOT, 'tokens'), { recursive: true });
const outPath = resolve(ROOT, 'tokens/figma.raw.json');
writeFileSync(outPath, JSON.stringify(tokens, null, 2));
console.log(`✓ Tokens written to tokens/figma.raw.json`);
