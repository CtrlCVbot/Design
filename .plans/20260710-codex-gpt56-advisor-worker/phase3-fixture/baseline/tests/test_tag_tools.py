import unittest

from alpha.tag_tools import normalize_tags


class NormalizeTagsTest(unittest.TestCase):
    def test_normalizes_and_preserves_first_seen_order(self) -> None:
        self.assertEqual(
            normalize_tags(["  Python", "AGENTS ", "python", "codex"]),
            ["python", "agents", "codex"],
        )

    def test_discards_blank_tags(self) -> None:
        self.assertEqual(normalize_tags(["", "   ", "Valid"]), ["valid"])

    def test_does_not_mutate_input(self) -> None:
        tags = [" Alpha ", "Beta"]
        normalize_tags(tags)
        self.assertEqual(tags, [" Alpha ", "Beta"])


if __name__ == "__main__":
    unittest.main()
