import unittest

from beta.retry_schedule import build_retry_schedule


class BuildRetryScheduleTest(unittest.TestCase):
    def test_builds_exponential_delays(self) -> None:
        self.assertEqual(build_retry_schedule(4), [2, 4, 8, 16])

    def test_supports_a_custom_base(self) -> None:
        self.assertEqual(build_retry_schedule(3, base_seconds=3), [3, 6, 12])

    def test_zero_attempts_has_no_delays(self) -> None:
        self.assertEqual(build_retry_schedule(0), [])

    def test_rejects_invalid_arguments(self) -> None:
        with self.assertRaises(ValueError):
            build_retry_schedule(-1)
        with self.assertRaises(ValueError):
            build_retry_schedule(1, base_seconds=0)


if __name__ == "__main__":
    unittest.main()
