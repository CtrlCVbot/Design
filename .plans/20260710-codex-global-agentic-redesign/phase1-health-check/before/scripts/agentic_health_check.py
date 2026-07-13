#!/usr/bin/env python3
"""Audit the local Codex global agentic setup and print Markdown."""

from __future__ import annotations

import json
import os
import re
import sys
import tomllib
from collections import Counter, defaultdict
from pathlib import Path


HOME = Path.home()
CODEX_HOME = Path(os.environ.get("CODEX_HOME", HOME / ".codex"))
AGENTS_HOME = HOME / ".agents"
CLAUDE_KIT = CODEX_HOME / "local-plugins" / "claude-kit"

SKILL_ROOTS = [
    CODEX_HOME / "skills",
    AGENTS_HOME / "skills",
    CLAUDE_KIT / "skills",
]

STALE_PATTERN = re.compile(
    r"~[/\\]\.claude|\.claude|Claude Code|Gemini|TodoWrite|AskUserQuestion|agent-router"
)
AGENT_NAME_PATTERN = re.compile(r"^[a-z][a-z0-9_]{0,63}$")
NICKNAME_PATTERN = re.compile(r"^[A-Za-z0-9 _-]+$")
BUILTIN_AGENT_NAMES = {"default", "explorer", "worker"}
REQUIRED_AGENT_ROUTES = {
    "implementation_worker": ("gpt-5.6-terra", "medium"),
    "routine_worker": ("gpt-5.6-luna", "medium"),
    "planning_worker": ("gpt-5.6-terra", "medium"),
}
FORBIDDEN_REQUIRED_AGENT_OVERRIDES = {
    "approval_policy",
    "mcp_servers",
    "sandbox_mode",
    "service_tier",
    "skills",
}
REQUIRED_AGENT_FIELDS = {
    "name",
    "description",
    "developer_instructions",
}


def status(ok: bool, warn: bool = False) -> str:
    if ok and not warn:
        return "pass"
    if ok and warn:
        return "warn"
    return "fail"


def read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8", errors="replace")


def agents_check() -> dict[str, object]:
    path = CODEX_HOME / "AGENTS.md"
    if not path.exists():
        return {"status": "fail", "note": "missing", "lines": 0, "chars": 0}
    text = read_text(path)
    lines = text.splitlines()
    warn = len(lines) > 140
    return {
        "status": status(True, warn),
        "note": "long" if warn else "core-sized",
        "lines": len(lines),
        "chars": len(text),
    }


def config_check() -> dict[str, object]:
    path = CODEX_HOME / "config.toml"
    if not path.exists():
        return {"status": "fail", "note": "missing", "plugins": 0, "trusted_hash": 0}
    text = read_text(path)
    try:
        data = tomllib.loads(text)
        plugin_count = len(data.get("plugins", {})) if isinstance(data, dict) else 0
        trusted_hooks = trusted_hook_state(data)
        expected_hooks, manifest_errors = expected_hook_state_keys(data)
        stale_hooks = sorted(set(trusted_hooks) - expected_hooks)
        trusted_hash = len(trusted_hooks)

        warn = bool(stale_hooks or manifest_errors)
        if expected_hooks and trusted_hash == len(expected_hooks) and not stale_hooks:
            note = f"hook trust {trusted_hash}/{len(expected_hooks)} current"
        elif expected_hooks:
            note = f"hook trust {trusted_hash}/{len(expected_hooks)} recognized"
        else:
            note = f"hook trust {trusted_hash}/0"
        if stale_hooks:
            note = f"{note}, stale {len(stale_hooks)}"
        if manifest_errors:
            note = f"{note}, manifest errors {len(manifest_errors)}"

        return {
            "status": status(True, warn),
            "note": note,
            "plugins": plugin_count,
            "trusted_hash": trusted_hash,
            "hook_expected": len(expected_hooks),
            "hook_stale": len(stale_hooks),
            "hook_manifest_errors": len(manifest_errors),
        }
    except Exception as exc:  # noqa: BLE001
        return {
            "status": "fail",
            "note": f"parse error: {exc}",
            "plugins": 0,
            "trusted_hash": 0,
            "hook_expected": 0,
            "hook_stale": 0,
            "hook_manifest_errors": 0,
        }


def custom_agents_check() -> dict[str, object]:
    agents_directory = CODEX_HOME / "agents"
    issues: list[str] = []
    agent_count = 0
    required_route_count = 0
    override_count = 0
    max_threads = 6
    max_depth = 1

    config_path = CODEX_HOME / "config.toml"
    if not config_path.exists():
        issues.append("config.toml missing")
    else:
        try:
            config = tomllib.loads(read_text(config_path))
            configured_agents = config.get("agents", {}) if isinstance(config, dict) else {}
            if not isinstance(configured_agents, dict):
                issues.append("[agents] must be a table")
            else:
                max_threads = configured_agents.get("max_threads", 6)
                max_depth = configured_agents.get("max_depth", 1)
        except Exception as exc:  # noqa: BLE001
            issues.append(f"config parse error: {exc}")

    if not isinstance(max_threads, int) or isinstance(max_threads, bool) or max_threads < 1 or max_threads > 4:
        issues.append(f"max_threads must be 1..4 (effective {max_threads!r})")
    if not isinstance(max_depth, int) or isinstance(max_depth, bool) or max_depth != 1:
        issues.append(f"max_depth must be 1 (effective {max_depth!r})")

    if not agents_directory.exists():
        issues.append("agents directory missing")
        return custom_agents_result(
            issues, agent_count, required_route_count, override_count, max_threads, max_depth
        )

    parsed_agents: list[tuple[Path, dict[str, object]]] = []
    for path in sorted(agents_directory.glob("*.toml")):
        try:
            data = tomllib.loads(read_text(path))
        except Exception as exc:  # noqa: BLE001
            issues.append(f"{path.name}: parse error: {exc}")
            continue
        if not isinstance(data, dict):
            issues.append(f"{path.name}: root must be a table")
            continue
        parsed_agents.append((path, data))

    agent_count = len(parsed_agents)
    names: list[str] = []
    by_name: dict[str, dict[str, object]] = {}
    for path, data in parsed_agents:
        missing_fields = sorted(
            field for field in REQUIRED_AGENT_FIELDS if not isinstance(data.get(field), str) or not data[field].strip()
        )
        if missing_fields:
            issues.append(f"{path.name}: missing or invalid {', '.join(missing_fields)}")

        name = data.get("name")
        if not isinstance(name, str) or not AGENT_NAME_PATTERN.fullmatch(name):
            issues.append(f"{path.name}: invalid name")
            continue
        names.append(name)
        by_name[name] = data
        if name in BUILTIN_AGENT_NAMES:
            issues.append(f"{path.name}: built-in name shadowing {name}")

        nicknames = data.get("nickname_candidates")
        if nicknames is not None and (
            not isinstance(nicknames, list)
            or any(not isinstance(nickname, str) or not NICKNAME_PATTERN.fullmatch(nickname) for nickname in nicknames)
            or len(set(nicknames)) != len(nicknames)
        ):
            issues.append(f"{path.name}: invalid nickname_candidates")

    duplicate_names = sorted(name for name, count in Counter(names).items() if count > 1)
    if duplicate_names:
        issues.append(f"duplicate names: {', '.join(duplicate_names)}")

    for name, (model, effort) in REQUIRED_AGENT_ROUTES.items():
        agent = by_name.get(name)
        if agent is None:
            issues.append(f"required agent missing: {name}")
            continue
        if agent.get("model") != model or agent.get("model_reasoning_effort") != effort:
            issues.append(f"{name}: required route is {model}/{effort}")
        else:
            required_route_count += 1

        overrides = sorted(FORBIDDEN_REQUIRED_AGENT_OVERRIDES & set(agent))
        override_count += len(overrides)
        if overrides:
            issues.append(f"{name}: forbidden overrides {', '.join(overrides)}")

    return custom_agents_result(
        issues, agent_count, required_route_count, override_count, max_threads, max_depth
    )


def custom_agents_result(
    issues: list[str],
    agent_count: int,
    required_route_count: int,
    override_count: int,
    max_threads: object,
    max_depth: object,
) -> dict[str, object]:
    return {
        "status": status(not issues),
        "note": "; ".join(issues) if issues else "schema and required routes valid",
        "issues": issues,
        "agent_count": agent_count,
        "required_route_count": required_route_count,
        "override_count": override_count,
        "max_threads": max_threads,
        "max_depth": max_depth,
    }


def latest_plugin_cache_root(plugin_id: str) -> Path | None:
    if "@" not in plugin_id:
        return None
    plugin_name, marketplace = plugin_id.rsplit("@", 1)
    root = CODEX_HOME / "plugins" / "cache" / marketplace / plugin_name
    if not root.exists():
        return None
    candidates = [path for path in root.iterdir() if path.is_dir()]
    if not candidates:
        return None
    return max(candidates, key=lambda path: path.stat().st_mtime)


def hook_event_key(event_name: str) -> str:
    return re.sub(r"(?<!^)([A-Z])", r"_\1", event_name).lower()


def trusted_hook_state(data: dict[str, object]) -> dict[str, str]:
    hooks = data.get("hooks", {})
    if not isinstance(hooks, dict):
        return {}
    state = hooks.get("state", {})
    if not isinstance(state, dict):
        return {}

    trusted: dict[str, str] = {}
    for key, value in state.items():
        if not isinstance(value, dict):
            continue
        trusted_hash = value.get("trusted_hash")
        if isinstance(trusted_hash, str):
            trusted[str(key)] = trusted_hash
    return trusted


def expected_hook_state_keys(data: dict[str, object]) -> tuple[set[str], list[str]]:
    plugins = data.get("plugins", {})
    if not isinstance(plugins, dict):
        return set(), []

    expected: set[str] = set()
    errors: list[str] = []
    for plugin_id, plugin_config in plugins.items():
        if isinstance(plugin_config, dict) and plugin_config.get("enabled") is False:
            continue

        root = latest_plugin_cache_root(str(plugin_id))
        if root is None:
            continue
        manifest_path = root / "hooks.json"
        if not manifest_path.exists():
            continue

        try:
            manifest = json.loads(read_text(manifest_path))
        except Exception:  # noqa: BLE001
            errors.append(str(plugin_id))
            continue

        hooks = manifest.get("hooks", {}) if isinstance(manifest, dict) else {}
        if not isinstance(hooks, dict):
            continue

        for event_name, event_entries in hooks.items():
            if not isinstance(event_entries, list):
                continue
            event_key = hook_event_key(str(event_name))
            for entry_index, entry in enumerate(event_entries):
                if not isinstance(entry, dict):
                    continue
                hook_entries = entry.get("hooks", [])
                if not isinstance(hook_entries, list):
                    continue
                for hook_index, hook_entry in enumerate(hook_entries):
                    if isinstance(hook_entry, dict):
                        expected.add(f"{plugin_id}:hooks.json:{event_key}:{entry_index}:{hook_index}")
    return expected, errors


def iter_skill_files() -> list[Path]:
    files: list[Path] = []
    for root in SKILL_ROOTS:
        if not root.exists():
            continue
        files.extend(root.glob("*/SKILL.md"))
    return sorted(files)


def iter_installed_plugin_skill_files() -> list[Path]:
    files: list[Path] = []
    cache_root = CODEX_HOME / "plugins" / "cache" / "user-local" / "claude-kit"
    if cache_root.exists():
        files.extend(cache_root.glob("*/skills/*/SKILL.md"))
    return sorted(files)


def latest_claude_kit_cache_root() -> Path | None:
    cache_root = CODEX_HOME / "plugins" / "cache" / "user-local" / "claude-kit"
    if not cache_root.exists():
        return None
    candidates = [path for path in cache_root.iterdir() if path.is_dir()]
    if not candidates:
        return None
    return max(candidates, key=lambda path: path.stat().st_mtime)


def iter_user_command_files() -> tuple[list[Path], int, int]:
    cache_root = latest_claude_kit_cache_root()
    claude_kit_commands = []
    if cache_root is not None:
        claude_kit_commands = sorted((cache_root / "commands").glob("*.md"))

    skill_commands: list[Path] = []
    if (AGENTS_HOME / "skills").exists():
        skill_commands.extend((AGENTS_HOME / "skills").glob("*/commands/*.md"))

    files = sorted({*claude_kit_commands, *skill_commands})
    return files, len(claude_kit_commands), len(skill_commands)


def skill_check() -> dict[str, object]:
    files = iter_skill_files()
    cache_files = iter_installed_plugin_skill_files()
    scan_files = sorted({*files, *cache_files})
    names = []
    long_files = []
    stale_files = []
    stale_lines = 0

    for path in files:
        text = read_text(path)
        match = re.search(r"^name:\s*(.+)$", text, re.MULTILINE)
        if match:
            names.append(match.group(1).strip())
    for path in scan_files:
        text = read_text(path)
        if len(text) > 7000 or len(text.splitlines()) > 300:
            long_files.append(path)
        if "agentic-health-check" not in path.parts:
            matches = STALE_PATTERN.findall(text)
            if matches:
                stale_files.append(path)
                stale_lines += len(matches)

    duplicates = [name for name, count in Counter(names).items() if count > 1]
    warn = bool(long_files or stale_files or duplicates)
    return {
        "status": status(True, warn),
        "total": len(files),
        "cache_total": len(cache_files),
        "long": len(long_files),
        "stale_files": len(stale_files),
        "stale_hits": stale_lines,
        "duplicates": duplicates,
    }


def command_check() -> dict[str, object]:
    files, claude_kit_count, skill_count = iter_user_command_files()
    names: list[str] = []
    stale_files = []
    stale_hits = 0
    missing_description = []

    for path in files:
        text = read_text(path)
        names.append(path.stem)
        matches = STALE_PATTERN.findall(text)
        if matches:
            stale_files.append(path)
            stale_hits += len(matches)
        frontmatter = ""
        if text.startswith("---"):
            parts = text.split("---", 2)
            if len(parts) >= 3:
                frontmatter = parts[1]
        if "description:" not in frontmatter:
            missing_description.append(path)

    duplicates = [name for name, count in Counter(names).items() if count > 1]
    warn = bool(stale_files or missing_description or duplicates)
    return {
        "status": status(True, warn),
        "total": len(files),
        "claude_kit": claude_kit_count,
        "skill_commands": skill_count,
        "stale_files": len(stale_files),
        "stale_hits": stale_hits,
        "missing_description": len(missing_description),
        "duplicates": duplicates,
    }


def memory_check() -> dict[str, object]:
    root = CODEX_HOME / "memories"
    raw = root / "raw_memories.md"
    registry = root / "MEMORY.md"
    summary = root / "memory_summary.md"
    rollout_dir = root / "rollout_summaries"
    notes_dir = root / "extensions" / "ad_hoc" / "notes"

    missing = [path.name for path in (raw, registry, summary) if not path.exists()]
    if missing:
        return {"status": "fail", "note": f"missing {', '.join(missing)}"}

    text = read_text(raw)
    registry_text = read_text(registry)
    summary_text = read_text(summary)
    rollout_count = len(list(rollout_dir.glob("*.jsonl"))) + len(list(rollout_dir.glob("*.md"))) if rollout_dir.exists() else 0
    note_count = len(list(notes_dir.glob("*.md"))) if notes_dir.exists() else 0

    if note_count:
        return {"status": "warn", "note": f"{note_count} ad-hoc notes pending consolidation"}

    empty_raw = "No raw memories yet" in text
    bootstrap_markers = (
        "bootstrap" in registry_text.lower()
        or "bootstrap" in summary_text.lower()
        or "empty" in registry_text.lower()
    )
    if empty_raw and rollout_count == 0 and bootstrap_markers:
        return {"status": "pass", "note": "bootstrap clean/no durable memories yet"}
    if empty_raw:
        return {"status": "warn", "note": f"raw empty, rollout files {rollout_count}"}
    return {"status": "pass", "note": f"raw memories present, rollout files {rollout_count}"}


def plugin_names_from_config() -> list[str]:
    config = CODEX_HOME / "config.toml"
    if not config.exists():
        return []
    try:
        data = tomllib.loads(read_text(config))
    except Exception:
        return []
    plugins = data.get("plugins", {})
    if not isinstance(plugins, dict):
        return []
    return sorted(plugins.keys())


def print_table(rows: list[tuple[str, str, str]]) -> None:
    print("| 항목 | 상태 | 메모 |")
    print("| --- | --- | --- |")
    for item, stat, note in rows:
        print(f"| {item} | {stat} | {note} |")


def main() -> int:
    agents = agents_check()
    config = config_check()
    custom_agents = custom_agents_check()
    skills = skill_check()
    commands = command_check()
    memory = memory_check()
    plugins = plugin_names_from_config()

    print("# Codex Agentic Health Check")
    print()
    print_table(
        [
            ("AGENTS.md", str(agents["status"]), f"{agents['lines']} lines, {agents['note']}"),
            (
                "config.toml",
                str(config["status"]),
                f"{config['plugins']} plugins, {config['note']}",
            ),
            (
                "custom agents",
                str(custom_agents["status"]),
                f"{custom_agents['agent_count']} total, "
                f"routes {custom_agents['required_route_count']}/{len(REQUIRED_AGENT_ROUTES)}, "
                f"overrides {custom_agents['override_count']}, "
                f"limits threads {custom_agents['max_threads']}, depth {custom_agents['max_depth']}: "
                f"{custom_agents['note']}",
            ),
            (
                "skills",
                str(skills["status"]),
                f"{skills['total']} total, {skills['cache_total']} cache, {skills['long']} long, stale files {skills['stale_files']}",
            ),
            (
                "commands",
                str(commands["status"]),
                f"{commands['total']} total, {commands['claude_kit']} claude-kit, {commands['skill_commands']} skill, stale files {commands['stale_files']}, missing desc {commands['missing_description']}",
            ),
            ("memories", str(memory["status"]), str(memory["note"])),
            ("plugins", status(bool(plugins)), ", ".join(plugins[:8]) if plugins else "none"),
        ]
    )

    print()
    print("## Details")
    print()
    print(f"- Skill duplicate names: {', '.join(skills['duplicates']) or 'none'}")
    print(f"- Command duplicate names: {', '.join(commands['duplicates']) or 'none'}")
    print(f"- Stale reference hits: {skills['stale_hits']}")
    print(f"- Command stale reference hits: {commands['stale_hits']}")
    print(
        "- Hook trusted hashes: "
        f"{config['trusted_hash']} current/{config.get('hook_expected', 0)} expected, "
        f"stale {config.get('hook_stale', 0)}, "
        f"manifest errors {config.get('hook_manifest_errors', 0)}"
    )
    print(f"- Custom-agent issues: {', '.join(custom_agents['issues']) or 'none'}")

    if any(str(check["status"]) == "fail" for check in (agents, config, custom_agents)):
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
