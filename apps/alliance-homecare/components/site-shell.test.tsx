import assert from "node:assert/strict";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { SiteShell } from "./site-shell";

Object.defineProperty(globalThis, "React", { value: React, configurable: true });

test("공용 셸은 주요 내비게이션과 Preview 비수집 안내를 렌더링한다", () => {
  const markup = renderToStaticMarkup(<SiteShell active="/services"><p>본문</p></SiteShell>);
  assert.match(markup, /href="\/services"/);
  assert.match(markup, /이용 후기/);
  assert.match(markup, /2006년부터 집에서 받는 돌봄의 기준을 높여 왔습니다/);
  assert.match(markup, /24시간 365일 상담/);
});
