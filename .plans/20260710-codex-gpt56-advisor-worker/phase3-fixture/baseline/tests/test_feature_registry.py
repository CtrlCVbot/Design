import json
import unittest
from pathlib import Path


class FeatureRegistryTest(unittest.TestCase):
    def test_registers_all_implemented_features(self) -> None:
        registry_path = Path(__file__).parents[1] / "registry" / "features.json"
        registry = json.loads(registry_path.read_text(encoding="utf-8"))
        self.assertEqual(registry, {"features": ["alpha", "beta"]})


if __name__ == "__main__":
    unittest.main()
