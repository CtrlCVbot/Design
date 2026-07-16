import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import RootPage from "./page";
import V1Page from "./v1/page";
import V2Page from "./v2/page";

Object.defineProperty(globalThis, "React", { value: React, configurable: true });

const css = readFileSync(new URL("./human-modern.css", import.meta.url), "utf8");

test("기본 경로와 V1 경로는 기존 홈 구성을 유지한다", () => {
  const rootMarkup = renderToStaticMarkup(<RootPage />);
  const v1Markup = renderToStaticMarkup(<V1Page />);

  for (const markup of [rootMarkup, v1Markup]) {
    assert.match(markup, /집에서 만나는 프리미엄 홈케어/);
    assert.match(markup, /V1 기존/);
    assert.match(markup, /V2 휴먼 모던/);
    assert.doesNotMatch(markup, /human-modern-home/);
  }
});

test("V2 경로는 격리된 휴먼 모던 홈과 현재 버전을 렌더링한다", () => {
  const markup = renderToStaticMarkup(<V2Page />);

  assert.match(markup, /human-modern-home/);
  assert.match(markup, /돌봄은 기술보다/);
  assert.match(markup, /<a[^>]*aria-current="page"[^>]*href="\/v2"/);
  assert.doesNotMatch(markup, /집에서 만나는 프리미엄 홈케어/);
});

test("휴먼 모던 스타일은 반응형·포커스·모션 축소·모바일 CTA 계약을 포함한다", () => {
  assert.match(css, /\.human-modern-home/);
  assert.match(css, /--hm-dark:\s*var\(--deep\)/);
  assert.match(css, /@media \(max-width:\s*767px\)/);
  assert.match(css, /:focus-visible/);
  assert.match(css, /@media \(prefers-reduced-motion:\s*reduce\)/);
  assert.match(css, /\.human-modern-mobile-contact/);
  assert.match(css, /padding-bottom:\s*90px/);
});

test("휴먼 모던 내비게이션과 버전 선택기는 히어로 CTA를 가리지 않는다", () => {
  assert.match(css, /\.human-modern-nav\s*\{[^}]*position:\s*fixed/s);
  assert.match(css, /\.human-modern-hero\s*\{[^}]*min-height:\s*100svh/s);
  assert.match(css, /\.human-modern-nav\[data-scrolled\]\s*\{[^}]*background:/s);
  assert.match(css, /@media \(max-width:\s*767px\)[\s\S]*?\.version-switcher\s*\{[^}]*top:\s*78px[^}]*bottom:\s*auto/s);
});
