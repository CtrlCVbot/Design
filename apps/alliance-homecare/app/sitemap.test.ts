import assert from "node:assert/strict";
import test from "node:test";
import sitemap from "./sitemap";

test("sitemap은 Preview 검수 대상과 두 디자인 버전을 포함한다", () => {
  assert.deepEqual(sitemap().map((entry) => entry.url), ["https://alliance-homecare.vercel.app", "https://alliance-homecare.vercel.app/v1", "https://alliance-homecare.vercel.app/v2", "https://alliance-homecare.vercel.app/services", "https://alliance-homecare.vercel.app/reviews", "https://alliance-homecare.vercel.app/conditions", "https://alliance-homecare.vercel.app/about", "https://alliance-homecare.vercel.app/contact"]);
});
