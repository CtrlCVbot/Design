import assert from "node:assert/strict";
import test from "node:test";
import robots from "./robots";

test("Preview robots는 모든 크롤러의 색인을 차단한다", () => {
  assert.deepEqual(robots(), { rules: { userAgent: "*", disallow: "/" } });
});
