import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MotionProvider } from "./motion-provider";

Object.defineProperty(globalThis, "React", { value: React, configurable: true });

const source = readFileSync(new URL("./motion-provider.tsx", import.meta.url), "utf8");

test("모션 런타임은 JS 실패 시에도 콘텐츠를 가리지 않는 표식을 렌더링한다", () => {
  const markup = renderToStaticMarkup(<MotionProvider />);
  assert.match(markup, /data-motion-runtime="true"/);
  assert.doesNotMatch(markup, /opacity:\s*0/);
});

test("모션 런타임은 버전별 내비게이션의 스크롤 상태를 갱신한다", () => {
  assert.match(source, /\[data-motion-nav\]/);
});
