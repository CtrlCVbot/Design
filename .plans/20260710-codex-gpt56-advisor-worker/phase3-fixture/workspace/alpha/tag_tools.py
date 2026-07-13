"""Tag normalization utilities."""


def normalize_tags(tags: list[str]) -> list[str]:
    """Return canonical tags in stable first-seen order."""
    normalized_tags: list[str] = []
    seen_tags: set[str] = set()

    for tag in tags:
        normalized_tag = tag.strip().lower()
        if normalized_tag and normalized_tag not in seen_tags:
            seen_tags.add(normalized_tag)
            normalized_tags.append(normalized_tag)

    return normalized_tags
