import assert from "node:assert/strict";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { SiteShell } from "./site-shell";

Object.defineProperty(globalThis, "React", { value: React, configurable: true });

test("공용 셸은 주요 내비게이션과 Preview 비수집 안내를 렌더링한다", () => {
  const markup = renderToStaticMarkup(<SiteShell active="/services"><p>본문</p></SiteShell>);
  assert.match(markup, /href="\/services"/);
  assert.match(markup, /새소망<span>방문요양<\/span>/);
  assert.equal((markup.match(/새소망<span>방문요양<\/span>/g) ?? []).length, 2);
  assert.match(markup, /이용 후기/);
  assert.match(markup, /2006년부터 집에서 받는 돌봄의 기준을 높여 왔습니다/);
  assert.match(markup, /24시간 365일 상담/);
});

test("공용 셸은 네 가지 컬러 테마를 선택할 수 있다", () => {
  const markup = renderToStaticMarkup(<SiteShell><p>본문</p></SiteShell>);
  assert.match(markup, /테마 선택/);
  assert.match(markup, /원본 테라코타/);
  assert.match(markup, /딥 옐로 코어/);
  assert.match(markup, /골든 네이비/);
  assert.match(markup, /새소망 헤리티지/);
});

test("공용 셸은 모바일 내비게이션과 모션 런타임을 제공한다", () => {
  const markup = renderToStaticMarkup(<SiteShell><p>본문</p></SiteShell>);
  assert.match(markup, /메뉴 열기/);
  assert.match(markup, /aria-label="모바일 메뉴"/);
  assert.match(markup, /data-motion-runtime="true"/);
});
