# Manual Health Checks

## Config

```powershell
python -c "import tomllib, pathlib; tomllib.loads(pathlib.Path(r'C:\Users\beck\.codex\config.toml').read_text(encoding='utf-8')); print('config ok')"
```

## Custom Agents

The automated health check validates every standalone `C:\Users\beck\.codex\agents\*.toml` file for TOML parsing, the official required text fields (`name`, `description`, `developer_instructions`), safe unique names, optional unique nicknames using ASCII letters, digits, spaces, hyphens, and underscores, and reserved built-in names (`default`, `worker`, `explorer`). Extra agents do not need model or reasoning-effort fields. It requires these exact routes only for the named agents below:

| Agent | Model | Reasoning effort |
| --- | --- | --- |
| `implementation_worker` | `gpt-5.6-terra` | `medium` |
| `routine_worker` | `gpt-5.6-luna` | `medium` |
| `planning_worker` | `gpt-5.6-terra` | `medium` |

Those required agents must not override `sandbox_mode`, `approval_policy`, `service_tier`, `mcp_servers`, or `skills`. In `C:\Users\beck\.codex\config.toml`, `[agents]` must have effective `max_threads <= 4` (the omitted default is `6`, so omission fails) and `max_depth = 1` (the omitted default is `1`).

Manual spot check:

```powershell
Get-Content -Raw C:\Users\beck\.codex\agents\*.toml
Select-String -LiteralPath C:\Users\beck\.codex\config.toml -Pattern '^max_threads|max_depth'
```

## Plugins

Discover the newest bundled CLI when the WindowsApps shim fails:

```powershell
$codexExe = Get-ChildItem "$env:LOCALAPPDATA\OpenAI\Codex\bin\*\codex.exe" -File |
  Sort-Object LastWriteTime -Descending |
  Select-Object -First 1 -ExpandProperty FullName
if (-not $codexExe) { throw "Bundled codex.exe not found" }
& $codexExe plugin list
```

## Stale References

```powershell
rg -n "~/.claude|\.claude|Claude Code|Gemini|TodoWrite|AskUserQuestion|agent-router" C:\Users\beck\.agents\skills C:\Users\beck\.codex\local-plugins\claude-kit\skills
```

## Hook Trust

```powershell
Select-String -LiteralPath C:\Users\beck\.codex\config.toml -Pattern "trusted_hash"
```

Healthy state means the trusted hashes match the current enabled plugin hook manifests. Prefer the scripted check for exact matching:

```powershell
python C:\Users\beck\.agents\skills\agentic-health-check\scripts\agentic_health_check.py
```
