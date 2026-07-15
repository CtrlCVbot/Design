import assert from "node:assert/strict";
import test from "node:test";
import React from "../apps/alliance-homecare/node_modules/react";
import { renderToStaticMarkup } from "../apps/alliance-homecare/node_modules/react-dom/server";
import { HomeContent } from "../apps/alliance-homecare/components/home";

Object.defineProperty(globalThis, "React", { value: React, configurable: true });

test("홈 press section은 reference의 보도 매체와 보호자 평점을 렌더링한다", () => {
  const markup = renderToStaticMarkup(<HomeContent />);

  assert.match(markup, /언론이 주목한 홈케어/);
  assert.match(markup, /헬스투데이/);
  assert.match(markup, /메디컬포스트/);
  assert.match(markup, /위클리케어/);
  assert.match(markup, /보호자 평점 4.9/);
});
