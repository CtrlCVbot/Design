import assert from "node:assert/strict";
import test from "node:test";

import {
  MAX_TAG_LENGTH,
  isTagAllowed,
  normalizeTag,
  normalizeTags,
} from "../src/tag-policy.ts";

test("normalizeTag trims, lowercases, and joins words", () => {
  assert.equal(normalizeTag("  Alpha   Beta  "), "alpha-beta");
});

test("normalizeTags removes empty and duplicate tags", () => {
  assert.deepEqual(normalizeTags([" Alpha ", "alpha", " ", "Beta"]), [
    "alpha",
    "beta",
  ]);
});

test("isTagAllowed uses the exported maximum length", () => {
  assert.equal(MAX_TAG_LENGTH, 24);
  assert.equal(isTagAllowed("a".repeat(MAX_TAG_LENGTH)), true);
  assert.equal(isTagAllowed("a".repeat(MAX_TAG_LENGTH + 1)), false);
});
