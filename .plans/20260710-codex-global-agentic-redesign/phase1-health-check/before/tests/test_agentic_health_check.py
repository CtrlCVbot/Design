"""Tests for the custom-agent portion of the global health check."""

from __future__ import annotations

import importlib.util
import io
import tempfile
import unittest
from contextlib import redirect_stdout
from pathlib import Path
from unittest.mock import patch


SCRIPT = Path(__file__).parents[1] / "scripts" / "agentic_health_check.py"
SPEC = importlib.util.spec_from_file_location("agentic_health_check", SCRIPT)
assert SPEC is not None and SPEC.loader is not None
health_check = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(health_check)


IMPLEMENTATION_AGENT = '''name = "implementation_worker"
description = "Bounded implementation worker."
model = "gpt-5.6-terra"
model_reasoning_effort = "medium"
nickname_candidates = ["terra_builder"]
developer_instructions = "Implement only the assigned brief."
'''

ROUTINE_AGENT = '''name = "routine_worker"
description = "Narrow routine worker."
model = "gpt-5.6-luna"
model_reasoning_effort = "medium"
nickname_candidates = ["routine_runner"]
developer_instructions = "Execute only deterministic routine briefs."
'''

PLANNING_AGENT = '''name = "planning_worker"
description = "Bounded planning artifact worker."
model = "gpt-5.6-terra"
model_reasoning_effort = "medium"
nickname_candidates = ["plan_builder"]
developer_instructions = "Draft only the assigned planning artifacts."
'''

EXTRA_AGENT = '''name = "planner"
description = "Official-schema extra agent."
nickname_candidates = ["Atlas One", "delta-two"]
developer_instructions = "Plan only within the assigned brief."
'''


class CustomAgentsCheckTests(unittest.TestCase):
    def setUp(self) -> None:
        self.tempdir = tempfile.TemporaryDirectory()
        self.codex_home = Path(self.tempdir.name)
        self.agents_dir = self.codex_home / "agents"
        self.agents_dir.mkdir()
        self.patch = patch.object(health_check, "CODEX_HOME", self.codex_home)
        self.patch.start()

    def tearDown(self) -> None:
        self.patch.stop()
        self.tempdir.cleanup()

    def write_config(self, agents: str = "max_threads = 4\nmax_depth = 1\n") -> None:
        (self.codex_home / "config.toml").write_text(
            f"[agents]\n{agents}", encoding="utf-8"
        )

    def write_agents(self, implementation: str = IMPLEMENTATION_AGENT, routine: str = ROUTINE_AGENT) -> None:
        (self.agents_dir / "implementation-worker.toml").write_text(
            implementation, encoding="utf-8"
        )
        (self.agents_dir / "routine-worker.toml").write_text(routine, encoding="utf-8")
        (self.agents_dir / "planning-worker.toml").write_text(
            PLANNING_AGENT, encoding="utf-8"
        )

    def test_healthy_configuration_passes_with_summary_counts_and_limits(self) -> None:
        self.write_config()
        self.write_agents()

        result = health_check.custom_agents_check()

        self.assertEqual("pass", result["status"])
        self.assertEqual(3, result["agent_count"])
        self.assertEqual(3, result["required_route_count"])
        self.assertEqual(0, result["override_count"])
        self.assertEqual(4, result["max_threads"])
        self.assertEqual(1, result["max_depth"])

    def test_extra_agent_uses_official_minimum_schema_and_valid_nicknames(self) -> None:
        self.write_config()
        self.write_agents()
        (self.agents_dir / "planner.toml").write_text(EXTRA_AGENT, encoding="utf-8")

        result = health_check.custom_agents_check()

        self.assertEqual("pass", result["status"])
        self.assertEqual(4, result["agent_count"])

    def test_missing_directory_or_required_agent_fails(self) -> None:
        self.agents_dir.rmdir()
        self.assertEqual("fail", health_check.custom_agents_check()["status"])

        self.agents_dir.mkdir()
        self.write_config()
        (self.agents_dir / "implementation-worker.toml").write_text(
            IMPLEMENTATION_AGENT, encoding="utf-8"
        )
        result = health_check.custom_agents_check()
        self.assertEqual("fail", result["status"])
        self.assertTrue(any("routine_worker" in issue for issue in result["issues"]))

    def test_malformed_or_incomplete_agent_toml_fails(self) -> None:
        self.write_config()
        self.write_agents(implementation="name = [\n")
        self.assertEqual("fail", health_check.custom_agents_check()["status"])

        self.write_agents(implementation='name = "implementation_worker"\n')
        self.assertEqual("fail", health_check.custom_agents_check()["status"])

    def test_duplicate_or_builtin_shadowing_name_fails(self) -> None:
        self.write_config()
        self.write_agents()
        (self.agents_dir / "copy.toml").write_text(
            IMPLEMENTATION_AGENT.replace("implementation_worker", "routine_worker"),
            encoding="utf-8",
        )
        self.assertEqual("fail", health_check.custom_agents_check()["status"])

        (self.agents_dir / "copy.toml").unlink()
        self.write_agents(implementation=IMPLEMENTATION_AGENT.replace("implementation_worker", "worker"))
        result = health_check.custom_agents_check()
        self.assertEqual("fail", result["status"])
        self.assertTrue(any("built-in name shadowing worker" in issue for issue in result["issues"]))

    def test_invalid_nickname_and_required_route_or_override_fail(self) -> None:
        self.write_config()
        self.write_agents(implementation=IMPLEMENTATION_AGENT.replace("terra_builder", "bad.nickname"))
        self.assertEqual("fail", health_check.custom_agents_check()["status"])

        self.write_agents(
            implementation=IMPLEMENTATION_AGENT.replace(
                '["terra_builder"]', '["Atlas One", "Atlas One"]'
            )
        )
        self.assertEqual("fail", health_check.custom_agents_check()["status"])

        self.write_agents(implementation=IMPLEMENTATION_AGENT.replace("gpt-5.6-terra", "gpt-5.6-luna"))
        self.assertEqual("fail", health_check.custom_agents_check()["status"])

        self.write_agents()
        (self.agents_dir / "planning-worker.toml").write_text(
            PLANNING_AGENT.replace("gpt-5.6-terra", "gpt-5.6-luna"), encoding="utf-8"
        )
        result = health_check.custom_agents_check()
        self.assertEqual("fail", result["status"])
        self.assertTrue(any("planning_worker" in issue for issue in result["issues"]))

        self.write_agents(implementation=IMPLEMENTATION_AGENT + 'sandbox_mode = "workspace-write"\n')
        result = health_check.custom_agents_check()
        self.assertEqual("fail", result["status"])
        self.assertEqual(1, result["override_count"])

    def test_effective_thread_and_depth_limits_fail_when_invalid_or_omitted(self) -> None:
        self.write_agents()
        self.write_config("max_threads = 5\nmax_depth = 2\n")
        self.assertEqual("fail", health_check.custom_agents_check()["status"])

        self.write_config("max_depth = 1\n")
        result = health_check.custom_agents_check()
        self.assertEqual("fail", result["status"])
        self.assertEqual(6, result["max_threads"])

    def test_main_returns_one_when_custom_agents_fail(self) -> None:
        self.write_config()
        self.write_agents(implementation=IMPLEMENTATION_AGENT.replace("gpt-5.6-terra", "wrong"))
        (self.codex_home / "AGENTS.md").write_text("# AGENTS\n", encoding="utf-8")

        with redirect_stdout(io.StringIO()):
            self.assertEqual(1, health_check.main())

    def test_main_returns_one_when_agents_or_config_fail(self) -> None:
        self.write_config()
        self.write_agents()
        with redirect_stdout(io.StringIO()):
            self.assertEqual(1, health_check.main())

        (self.codex_home / "AGENTS.md").write_text("# AGENTS\n", encoding="utf-8")
        (self.codex_home / "config.toml").write_text("[agents\n", encoding="utf-8")
        with redirect_stdout(io.StringIO()):
            self.assertEqual(1, health_check.main())


if __name__ == "__main__":
    unittest.main()
