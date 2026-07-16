import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const css = readFileSync(new URL("./ux.css", import.meta.url), "utf8");

test("공용 UX 스타일은 모바일과 키보드·앵커·페이지 전환 계약을 포함한다", () => {
  assert.match(css, /@media \(max-width: 767px\)/);
  assert.match(css, /scroll-margin-top:\s*98px/);
  assert.match(css, /:focus-visible/);
  assert.match(css, /@view-transition/);
  assert.match(css, /scale\(\.98\)/);
});
