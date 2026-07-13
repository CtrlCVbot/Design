"""Compare trial record bytes to the prebuilt GT-04 expected fixture."""

from __future__ import annotations

import argparse
import json
from pathlib import Path


FIXTURE_ROOT = Path(__file__).resolve().parent
EXPECTED_RECORDS = FIXTURE_ROOT / "expected" / "records"
TRIAL_IDS = ("trial-01", "trial-02", "trial-03")


def file_bytes_by_name(directory: Path) -> dict[str, bytes]:
    if not directory.is_dir():
        return {}
    return {
        path.relative_to(directory).as_posix(): path.read_bytes()
        for path in sorted(directory.rglob("*"))
        if path.is_file()
    }


def verify_trial(trial_id: str, expected_files: dict[str, bytes]) -> dict[str, object]:
    actual_files = file_bytes_by_name(FIXTURE_ROOT / trial_id / "records")
    expected_names = set(expected_files)
    actual_names = set(actual_files)
    missing = sorted(expected_names - actual_names)
    extra = sorted(actual_names - expected_names)
    byte_mismatches = sorted(
        name
        for name in expected_names & actual_names
        if expected_files[name] != actual_files[name]
    )
    mismatches = len(missing) + len(extra) + len(byte_mismatches)
    return {
        "trial": trial_id,
        "status": "PASS" if mismatches == 0 else "FAIL",
        "mismatches": mismatches,
        "missing": missing,
        "extra": extra,
        "byte_mismatches": byte_mismatches,
    }


def parse_arguments() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    selection = parser.add_mutually_exclusive_group(required=True)
    selection.add_argument("--trial", choices=TRIAL_IDS)
    selection.add_argument("--all", action="store_true")
    return parser.parse_args()


def main() -> int:
    arguments = parse_arguments()
    expected_files = file_bytes_by_name(EXPECTED_RECORDS)
    trial_ids = TRIAL_IDS if arguments.all else (arguments.trial,)
    results = [verify_trial(trial_id, expected_files) for trial_id in trial_ids]
    total_mismatches = sum(result["mismatches"] for result in results)
    passed = total_mismatches == 0
    payload = {
        "status": "PASS" if passed else "FAIL",
        "mismatches": total_mismatches,
        "trials": results,
    }
    print(json.dumps(payload, ensure_ascii=True, separators=(",", ":"), sort_keys=True))
    return 0 if passed else 1


if __name__ == "__main__":
    raise SystemExit(main())
