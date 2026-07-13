---
name: agentic-health-check
description: Audit the local Codex global agentic setup. Use when checking AGENTS.md, config.toml, plugins, hooks, skills, duplicate skill names, stale Claude/Gemini references, memories, or after restoring/updating global agentic files.
---

# Agentic Health Check

## Overview

Use this skill to inspect whether the global Codex agentic setup is healthy after restore, plugin install, skill edits, or hook changes.

## Quick Run

Run the bundled script from any directory:

```powershell
python C:\Users\beck\.agents\skills\agentic-health-check\scripts\agentic_health_check.py
```

The script prints a Markdown report with:

- `AGENTS.md` existence and size.
- `config.toml` parse status.
- Custom agent TOML schema (`name`, `description`, `developer_instructions`), safe unique names, built-in-name shadowing, and optional nickname shape/uniqueness.
- Required `implementation_worker`, `routine_worker`, and `planning_worker` model/effort routes, forbidden per-agent overrides, and effective `[agents]` thread/depth limits.
- Enabled plugin names from config.
- Hook trusted hash count and whether it matches current enabled plugin hook manifests.
- Skill counts, long skills, duplicate names.
- Stale runtime references such as `.claude`, Gemini, `TodoWrite`, `AskUserQuestion`, `agent-router`.
- Memory bootstrap status.

## Manual Checks

If the script cannot run, perform the checks in `references/checks.md`.

## Interpretation

| Status | Meaning |
| --- | --- |
| `pass` | Healthy enough for normal work |
| `warn` | Usable, but cleanup is recommended |
| `fail` | Broken or missing core setup |

## Rules

- Do not auto-delete files from this skill.
- Treat current hook `trusted_hash` entries as accepted state; warn only when they are stale, unknown, or cannot be matched to current enabled plugin hook manifests.
- Treat stale references as `warn` unless they are in a broadly triggered skill.
- Treat any custom-agent schema, route, override, or `[agents]` limit violation as `fail`; the script exits nonzero for this row, `AGENTS.md`, or `config.toml` failures.
- Recommend fixes in priority order: `AGENTS.md`, hooks, stale refs, duplicates, then optional convenience skills.
