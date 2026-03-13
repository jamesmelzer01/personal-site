# ADR-004: Token Pipeline Source (Figma → JSON)

## Status
Superseded in part — see current approach below

## Context
The pipeline needs a way to extract variable values from Figma and get them into the repo as JSON. Figma offers two programmatic surfaces: the REST API and the Plugin API. These have different plan requirements and different architectural trade-offs.

## Options Considered

**Figma Variables REST API**
- `GET /v1/files/:file_key/variables/local`
- Clean server-side automation: a script calls the API, no Figma UI involvement needed
- Enables fully headless sync via GitHub Actions on a schedule
- **Requires `file_variables:read` scope — Enterprise plan only**

**Tokens Studio plugin**
- Popular third-party plugin with GitHub sync built in
- Abstracts the pipeline behind plugin UI; less transparent
- Enterprise clients generally don't use it; not representative of the target workflow

**Custom Figma Plugin (Plugin API)**
- `figma.variables.getLocalVariables()` — available on Professional (Pro) plan and above
- Requires a human to run the plugin in Figma when variables change
- Plugin outputs JSON in exactly the same format the rest of the pipeline expects
- Can be extended later to push directly to GitHub (see ADR-005)

## Decision
**Phase 1:** Custom Figma plugin with clipboard export (Option A). Plugin reads variables via Plugin API, formats them as DTCG JSON, copies to clipboard. Designer pastes into `tokens/figma.raw.json` and commits.

**Phase 2 (future):** When an Enterprise Figma account is available, add the REST API fetch script (`scripts/fetch-tokens.mjs`, already written) back into the GitHub Actions workflow for fully headless sync.

## Consequences
- Pipeline works today on a Pro Figma account
- One manual step (paste + commit) in the export process
- The JSON contract between Figma and the pipeline is identical regardless of export method — upgrading to the REST API later requires no downstream changes
- Building a custom plugin is itself a valuable learning artifact for client work
