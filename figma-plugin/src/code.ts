/**
 * Token Exporter — Figma Plugin
 *
 * Reads all local variables from the current Figma file, transforms them
 * into Style Dictionary DTCG format, and displays the JSON for copying
 * into tokens/figma.raw.json in the repo.
 *
 * Variable names use slash notation (e.g. primitives/color/brand/primary)
 * which becomes a nested JSON hierarchy matching the pipeline's expectations.
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

// ---------------------------------------------------------------------------
// Variable collection
// ---------------------------------------------------------------------------

function buildTokens(): Record<string, unknown> {
  const variables = figma.variables.getLocalVariables();
  const collections = figma.variables.getLocalVariableCollections();
  const collectionMap = new Map(collections.map((c) => [c.id, c]));

  const tokens: Record<string, unknown> = {};
  let skipped = 0;

  for (const variable of variables) {
    const collection = collectionMap.get(variable.variableCollectionId);
    if (!collection) continue;

    const rawValue = variable.valuesByMode[collection.defaultModeId];

    // Skip alias references (variable pointing to another variable).
    // Alias resolution is a future enhancement — see docs/backlog.md.
    if (
      typeof rawValue === "object" &&
      rawValue !== null &&
      "type" in rawValue &&
      (rawValue as VariableAlias).type === "VARIABLE_ALIAS"
    ) {
      skipped++;
      continue;
    }

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
        skipped++;
        continue;
    }

    setNestedValue(tokens, variable.name, { $value, $type });
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

    // Receive tokens from the plugin main thread
    window.onmessage = function(event) {
      const msg = event.data.pluginMessage;
      if (msg && msg.type === 'TOKENS') {
        output.value = msg.payload;
      }
    };

    copyBtn.onclick = function() {
      navigator.clipboard.writeText(output.value).then(function() {
        status.classList.add('visible');
        setTimeout(function() { status.classList.remove('visible'); }, 2000);
      });
    };
  </script>
</body>
</html>
`;

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------

figma.showUI(UI_HTML, { width: 480, height: 500, title: "Token Exporter" });

const tokens = buildTokens();
figma.ui.postMessage({ type: "TOKENS", payload: JSON.stringify(tokens, null, 2) });
