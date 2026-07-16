import assert from "node:assert/strict";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { ThemeSwitcher } from "./theme-switcher";

Object.defineProperty(globalThis, "React", { value: React, configurable: true });

test("테마 선택기는 네 가지 승인된 테마만 렌더링한다", () => {
  const markup = renderToStaticMarkup(<ThemeSwitcher />);

  assert.match(markup, /value="original"/);
  assert.match(markup, /value="yellow"/);
  assert.match(markup, /value="gold-navy"/);
  assert.match(markup, /value="saesomang-heritage"/);
});
