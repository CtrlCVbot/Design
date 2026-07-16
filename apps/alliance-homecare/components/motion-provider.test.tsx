import assert from "node:assert/strict";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MotionProvider } from "./motion-provider";

Object.defineProperty(globalThis, "React", { value: React, configurable: true });

test("모션 런타임은 JS 실패 시에도 콘텐츠를 가리지 않는 표식을 렌더링한다", () => {
  const markup = renderToStaticMarkup(<MotionProvider />);
  assert.match(markup, /data-motion-runtime="true"/);
  assert.doesNotMatch(markup, /opacity:\s*0/);
});
