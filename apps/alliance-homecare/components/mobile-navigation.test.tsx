import assert from "node:assert/strict";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MobileNavigation } from "./mobile-navigation";

Object.defineProperty(globalThis, "React", { value: React, configurable: true });

test("모바일 내비게이션은 메뉴 버튼과 전체 탐색 경로를 제공한다", () => {
  const markup = renderToStaticMarkup(<MobileNavigation links={[["서비스", "/services"], ["회사 소개", "/about"]]} active="/services" />);
  assert.match(markup, /메뉴 열기/);
  assert.match(markup, /aria-label="모바일 메뉴"/);
  assert.match(markup, /href="\/services"/);
  assert.match(markup, /href="\/contact"/);
  assert.match(markup, /aria-expanded="false"/);
});
