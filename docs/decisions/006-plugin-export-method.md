# ADR-006: Figma Plugin Export Method

## Status
Accepted (Phase 1)

## Context
The Figma plugin (see ADR-004) reads variables and needs to get them out of Figma and into the repo. Figma's plugin sandbox restricts what a plugin can do: the main plugin thread has no network access, but the UI iframe can make HTTP requests. This creates options with different complexity/automation trade-offs.

## Options Considered

**Option A: Copy to clipboard**
- Plugin formats JSON and writes it to the clipboard
- Designer pastes into `tokens/figma.raw.json` in their editor and commits
- Zero infrastructure, works immediately, completely transparent
- Manual step: paste + commit

**Option B: Download as file**
- Plugin triggers a file download via the UI iframe
- Designer drags the downloaded file into the project and commits
- Slightly more cumbersome than clipboard; same manual commit requirement

**Option C: Plugin → GitHub API (direct commit)**
- Plugin UI iframe calls the GitHub Contents API to write `tokens/figma.raw.json` directly to the repo
- Fully automated from Figma: save variables → run plugin → repo updated → Vercel redeploys
- Requires storing a GitHub token in the plugin (can be done securely via plugin storage)
- This is architecturally what Tokens Studio does under the hood
- Higher complexity; appropriate once the clipboard approach is proven

## Decision
**Phase 1:** Option A (clipboard). Keeps the plugin simple while the pipeline is being validated. The manual paste-and-commit step is acceptable for a personal site and a learning context.

**Phase 2:** Option C (GitHub API). The natural upgrade once the plugin is working. Tracked in `docs/backlog.md`.

## Consequences
- Phase 1 requires one manual step per token update: run plugin → paste → commit
- The commit itself triggers Vercel's production deploy, so the rest of the pipeline remains fully automated
- Option C upgrade requires only changes to the plugin; nothing downstream changes
