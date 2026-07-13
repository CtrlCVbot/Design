"""Retry schedule utilities."""


def build_retry_schedule(attempts: int, base_seconds: int = 2) -> list[int]:
    """Return exponential retry delays for the requested attempts."""
    if attempts < 0:
        raise ValueError("attempts must not be negative")
    if base_seconds <= 0:
        raise ValueError("base_seconds must be positive")

    return [base_seconds * 2**index for index in range(attempts)]
