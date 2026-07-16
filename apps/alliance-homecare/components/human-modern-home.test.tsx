import assert from "node:assert/strict";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { HumanModernHome } from "./human-modern-home";

Object.defineProperty(globalThis, "React", { value: React, configurable: true });

test("휴먼 모던 홈은 승인된 섹션을 기준 순서로 렌더링한다", () => {
  const markup = renderToStaticMarkup(<HumanModernHome />);
  const sectionCopy = [
    "돌봄은 기술보다",
    "어떤 마음으로 돌보는지",
    "필요한 도움만",
    "우리 가족을 이해해 주는 사람",
    "네 번의 대화로",
    "동네에서 신뢰를 쌓았습니다",
    "현재 구조는 유지하고",
    "조용하지만 살아 있는",
    "가족의 오늘을 듣는 것부터",
  ];

  sectionCopy.reduce((previousIndex, copy) => {
    const currentIndex = markup.indexOf(copy);
    assert.ok(currentIndex > previousIndex, `${copy} 섹션 순서가 올바르지 않습니다.`);
    return currentIndex;
  }, -1);
});

test("휴먼 모던 홈은 네 테마와 로컬 이미지와 모션 계약을 유지한다", () => {
  const markup = renderToStaticMarkup(<HumanModernHome />);

  assert.match(markup, /원본 테라코타/);
  assert.match(markup, /딥 옐로 코어/);
  assert.match(markup, /골든 네이비/);
  assert.match(markup, /새소망 헤리티지/);
  assert.match(markup, /src="\/_next\/image\?url=%2Fimages%2Fhuman-modern%2Fcare-hands.jpg/);
  assert.match(markup, /src="\/_next\/image\?url=%2Fimages%2Fhuman-modern%2Fbrand-sign.jpg/);
  assert.match(markup, /data-motion-runtime="true"/);
  assert.match(markup, /031-726-5288/);
});

test("sticky 인물 프레임은 fill 이미지용 relative 래퍼를 제공한다", () => {
  const markup = renderToStaticMarkup(<HumanModernHome />);

  assert.match(markup, /class="human-modern-portrait"[^>]*><div class="human-modern-portrait-media"><img/);
});
