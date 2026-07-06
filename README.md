# JD Survey

A desktop-only Obsidian plugin that surveys a note's filesystem mirror directory, writes a **Contents (Filesystem)** section, and tracks survey staleness.

## What it does

When you run **Survey this slot** on an active note:

1. **Discovers the filesystem mirror** via path resolution (see below)
2. **Walks the directory tree** at a configurable depth, counting items and stubs
3. **Generates a `## Contents (Filesystem)` section** — a `> [!info] Filesystem snapshot` callout containing either:
   - Anthropic-generated prose (if LLM is enabled and the API key is set)
   - A skeleton placeholder (if LLM is disabled or no key is present)
4. **Stamps survey metadata** into the note's frontmatter (`survey:` object with `at`, `items`, `depth`, `by`, `stubs`)
5. **Reports staleness** — notes can be bulk-refreshed via **Survey all stale slots**, and a dashboard can be refreshed to show which slots are stale

This is a TypeScript port of the Python `jd-survey-status` / `jd-survey` CLI with no external dependencies.

## Installation

### Manual / Development

```bash
cd /path/to/jd-survey
npm install
npm run build
```

Copy `main.js` and `manifest.json` into your vault's `.obsidian/plugins/jd-survey/` directory, then enable **JD Survey** in **Settings > Community plugins > Installed plugins**.

**Desktop-only.** Mobile is not supported (Node.js filesystem access required).

## Commands

- **Survey this slot** — survey the active note's filesystem mirror and write the Contents section
- **Survey all stale slots** — find all notes with filesystem mirrors older than the staleness threshold and re-survey them
- **Refresh stale-surveys table** — rebuild the stale-surveys dashboard by scanning all surveyed notes
- **Migrate has-filesystem** — convert legacy `has-filesystem: false` opt-out to the new `survey-target: none` syntax

## Settings

| Setting | Default | Description |
|---------|---------|-------------|
| **Frontmatter Prefix** | `survey` | Prefix for frontmatter keys (`survey`, `survey-target`, `survey-filepath`) |
| **Filesystem Root** | `~/Documents` | Base directory containing the mirror tree |
| **Default Depth** | `2` | How many directory levels deep to scan |
| **Date Format** | `YYYY-MM-DD` | Format for the `at` timestamp in survey metadata |
| **Staleness Threshold (days)** | `180` | Notes older than this are considered stale |
| **Dashboard Note Path** | `00-09 System/08 Obsidian/08.34 Stale surveys.md` | Vault-relative path to the stale-surveys table |
| **LLM Enabled** | `true` | Use Anthropic API to generate prose summaries |
| **Anthropic API Key** | (none) | Stored in `data.json` (propagated by Obsidian Sync) |
| **Anthropic Model** | `claude-haiku-4-5-20251001` | Which Claude model to use |
| **Keep if Accurate** | `false` | (Coming soon) Don't regenerate if the snapshot is fresh |

## Frontmatter contract

The plugin reads and writes a `<prefix>:` object (default `survey:`) with these fields:

```yaml
survey:
  at: 2026-07-05           # last survey timestamp
  items: 42                # item count at the time of the survey
  depth: 2                 # walk depth used
  by: jd-survey            # who surveyed: "jd-survey" (skeleton) or "jd-survey-llm" (prose)
  stubs: true              # whether any items are placeholder files
```

Additional control keys:

| Key | Meaning |
|-----|---------|
| `survey-target` | One of `documents` (default), `vault` (folder-note mirror in vault), or `none` (opt-out). Overrides path resolution. |
| `survey-filepath` | Absolute or vault-relative path to the directory to survey. If set, overrides target and path resolution. |
| `has-filesystem: false` | (Legacy) opt-out syntax; still honored for backwards compatibility. |

## Path resolution

The plugin resolves the filesystem directory in this order:

1. **Opt-out?** If `survey-target: none` or `has-filesystem: false`, skip.
2. **Explicit override?** If `survey-filepath` is set, use that path (absolute or relative to fsRoot).
3. **Vault mirror?** If the note is a [folder note](https://docs.obsidian.md/Obsidian/Advanced+topics/Folder+notes) and `survey-target: vault`, survey the note's parent folder in the vault itself, skipping the note file from the walk.
4. **Default: filesystem mirror** in fsRoot (configurable, default `~/Documents`). For a folder note at `foo/bar/bar.md`, the mirror is `~/Documents/foo/bar`. For a regular note `foo/bar.md`, the mirror is `~/Documents/foo/bar` (`.md` suffix stripped).

## Development

```bash
npm test              # vitest
npm run build         # esbuild to main.js
npm run dev           # watch mode
```

## License

MIT
