import assert from "node:assert/strict";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { VersionSwitcher } from "./version-switcher";

Object.defineProperty(globalThis, "React", { value: React, configurable: true });

test("버전 선택기는 V1과 V2 비교 링크와 현재 버전을 노출한다", () => {
  const markup = renderToStaticMarkup(<VersionSwitcher current="v1" />);

  assert.match(markup, /aria-label="홈페이지 디자인 버전"/);
  assert.match(markup, /<a[^>]*aria-current="page"[^>]*href="\/v1"/);
  assert.match(markup, /href="\/v2"/);
  assert.match(markup, />V1 기존</);
  assert.match(markup, />V2 휴먼 모던</);
});

test("V2에서는 휴먼 모던 링크를 현재 페이지로 표시한다", () => {
  const markup = renderToStaticMarkup(<VersionSwitcher current="v2" />);

  assert.match(markup, /<a[^>]*aria-current="page"[^>]*href="\/v2"/);
  assert.doesNotMatch(markup, /<a[^>]*aria-current="page"[^>]*href="\/v1"/);
});
