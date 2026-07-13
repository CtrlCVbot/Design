"""Retry schedule utilities."""


def build_retry_schedule(attempts: int, base_seconds: int = 2) -> list[int]:
    """Return exponential retry delays for the requested attempts."""
    raise NotImplementedError("Phase 3 fixture: implement build_retry_schedule")
