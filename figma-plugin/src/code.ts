/**
 * Token Exporter — Figma Plugin
 *
 * Reads all local variables and text styles from the current Figma file,
 * transforms them into Style Dictionary DTCG format, and displays the
 * JSON for copying into tokens/figma.raw.json in the repo.
 *
 * Variable aliases (e.g. semantic tokens referencing primitives) are
 * output as DTCG reference syntax: {primitives.color.neutral.900}
 */

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Converts a Figma RGBA color (0–1 floats) to a CSS hex string. */
function rgbaToHex(color: RGBA): string {
  const toHex = (n: number) => Math.round(n * 255).toString(16).padStart(2, "0");
  const hex = `#${toHex(color.r)}${toHex(color.g)}${toHex(color.b)}`;
  return color.a < 1 ? `${hex}${toHex(color.a)}` : hex;
}

/** Sets a value at a slash-separated path on a nested object. */
function setNestedValue(
  obj: Record<string, unknown>,
  path: string,
  value: unknown
): void {
  const parts = path.split("/");
  let node = obj as Record<string, unknown>;
  for (let i = 0; i < parts.length - 1; i++) {
    if (!node[parts[i]]) node[parts[i]] = {};
    node = node[parts[i]] as Record<string, unknown>;
  }
  node[parts[parts.length - 1]] = value;
}

/**
 * Maps Figma font style strings to numeric CSS font-weight values.
 * Handles composite style names like "Bold Italic" by substring match.
 */
const FONT_WEIGHT_MAP: Record<string, number> = {
  "Thin": 100,
  "ExtraLight": 200, "Extra Light": 200,
  "Light": 300,
  "Regular": 400, "Normal": 400,
  "Medium": 500,
  "SemiBold": 600, "Semi Bold": 600,
  "Bold": 700,
  "ExtraBold": 800, "Extra Bold": 800,
  "Black": 900, "Heavy": 900,
};

function fontStyleToWeight(style: string): number {
  for (const [key, value] of Object.entries(FONT_WEIGHT_MAP)) {
    if (style.includes(key)) return value;
  }
  return 400;
}

/** Converts a Figma LineHeight to a CSS-ready value. */
function lineHeightToCss(lh: LineHeight): string | number {
  if (lh.unit === "AUTO") return "normal";
  if (lh.unit === "PIXELS") return `${lh.value}px`;
  return lh.value / 100; // PERCENT → unitless ratio (e.g. 150% → 1.5)
}

/** Converts a Figma LetterSpacing to a CSS-ready value. */
function letterSpacingToCss(ls: LetterSpacing): string {
  if (ls.unit === "PIXELS") return ls.value === 0 ? "0" : `${ls.value}px`;
  return ls.value === 0 ? "0" : `${ls.value / 100}em`; // PERCENT → em
}

// ---------------------------------------------------------------------------
// Variable tokens
// ---------------------------------------------------------------------------

function buildVariableTokens(): Record<string, unknown> {
  const variables = figma.variables.getLocalVariables();
  const collections = figma.variables.getLocalVariableCollections();
  const collectionMap = new Map(collections.map((c) => [c.id, c]));
  const variableMap = new Map(variables.map((v) => [v.id, v]));

  const tokens: Record<string, unknown> = {};

  for (const variable of variables) {
    const collection = collectionMap.get(variable.variableCollectionId);
    if (!collection) continue;

    const rawValue = variable.valuesByMode[collection.defaultModeId];
    const tokenPath = `${collection.name.toLowerCase()}/${variable.name}`;

    // Alias reference: translate to DTCG {collection.path.to.token} syntax
    if (
      typeof rawValue === "object" &&
      rawValue !== null &&
      "type" in rawValue &&
      (rawValue as VariableAlias).type === "VARIABLE_ALIAS"
    ) {
      const alias = rawValue as VariableAlias;
      const referencedVar = variableMap.get(alias.id);
      if (!referencedVar) continue;

      const referencedCollection = collectionMap.get(
        referencedVar.variableCollectionId
      );
      if (!referencedCollection) continue;

      const refPath = `${referencedCollection.name.toLowerCase()}/${referencedVar.name}`;
      const $value = `{${refPath.replace(/\//g, ".")}}`;
      const $type =
        referencedVar.resolvedType === "COLOR" ? "color" :
        referencedVar.resolvedType === "FLOAT" ? "number" : "string";

      setNestedValue(tokens, tokenPath, { $value, $type });
      continue;
    }

    // Direct value
    let $value: unknown;
    let $type: string;

    switch (variable.resolvedType) {
      case "COLOR":
        $value = rgbaToHex(rawValue as RGBA);
        $type = "color";
        break;
      case "FLOAT":
        $value = rawValue as number;
        $type = "number";
        break;
      case "STRING":
        $value = rawValue as string;
        $type = "string";
        break;
      case "BOOLEAN":
        $value = rawValue as boolean;
        $type = "boolean";
        break;
      default:
        continue;
    }

    setNestedValue(tokens, tokenPath, { $value, $type });
  }

  return tokens;
}

// ---------------------------------------------------------------------------
// Typography tokens (from Figma Text Styles)
// ---------------------------------------------------------------------------

function buildTypographyTokens(): Record<string, unknown> {
  const textStyles = figma.getLocalTextStyles();
  const tokens: Record<string, unknown> = {};

  for (const style of textStyles) {
    // Sanitize: lowercase, spaces → hyphens, preserve slashes as path separators
    const sanitizedName = style.name
      .toLowerCase()
      .replace(/\s+/g, "-");

    const tokenPath = `typography/${sanitizedName}`;

    const $value = {
      fontFamily: style.fontName.family,
      fontWeight: fontStyleToWeight(style.fontName.style),
      fontSize: `${style.fontSize}px`,
      lineHeight: lineHeightToCss(style.lineHeight),
      letterSpacing: letterSpacingToCss(style.letterSpacing),
    };

    setNestedValue(tokens, tokenPath, { $value, $type: "typography" });
  }

  return tokens;
}

// ---------------------------------------------------------------------------
// UI
// ---------------------------------------------------------------------------

const UI_HTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: Inter, -apple-system, sans-serif;
      font-size: 12px;
      background: #1e1e1e;
      color: #e0e0e0;
      padding: 16px;
      height: 100vh;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    h1 {
      font-size: 13px;
      font-weight: 600;
      color: #ffffff;
    }

    p {
      font-size: 11px;
      color: #999;
      line-height: 1.5;
    }

    textarea {
      flex: 1;
      width: 100%;
      background: #2c2c2c;
      border: 1px solid #3a3a3a;
      border-radius: 4px;
      color: #cde;
      font-family: "Fira Mono", "Courier New", monospace;
      font-size: 11px;
      line-height: 1.5;
      padding: 10px;
      resize: none;
      outline: none;
    }

    .actions {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    button {
      background: #0d99ff;
      border: none;
      border-radius: 4px;
      color: #fff;
      cursor: pointer;
      font-size: 12px;
      font-weight: 600;
      padding: 8px 16px;
    }

    button:hover { background: #0a7fd4; }

    .status {
      font-size: 11px;
      color: #5dba7d;
      opacity: 0;
      transition: opacity 0.2s;
    }

    .status.visible { opacity: 1; }
  </style>
</head>
<body>
  <h1>Token Exporter</h1>
  <p>Copy the JSON below and paste it into <code>tokens/figma.raw.json</code> in the repo, then commit.</p>
  <textarea id="output" readonly placeholder="Loading tokens…"></textarea>
  <div class="actions">
    <button id="copy">Copy to clipboard</button>
    <span class="status" id="status">Copied!</span>
  </div>

  <script>
    const output = document.getElementById('output');
    const copyBtn = document.getElementById('copy');
    const status = document.getElementById('status');

    window.onmessage = function(event) {
      const msg = event.data.pluginMessage;
      if (msg && msg.type === 'TOKENS') {
        output.value = msg.payload;
      }
    };

    copyBtn.onclick = function() {
      output.select();
      document.execCommand('copy');
      status.classList.add('visible');
      setTimeout(function() { status.classList.remove('visible'); }, 2000);
    };
  </script>
</body>
</html>
`;

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------

figma.showUI(UI_HTML, { width: 480, height: 500, title: "Token Exporter" });

const tokens = {
  ...buildVariableTokens(),
  ...buildTypographyTokens(),
};

figma.ui.postMessage({
  type: "TOKENS",
  payload: JSON.stringify(tokens, null, 2),
});
