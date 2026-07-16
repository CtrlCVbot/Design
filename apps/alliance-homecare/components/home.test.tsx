import assert from "node:assert/strict";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { HomeContent } from "./home";

Object.defineProperty(globalThis, "React", { value: React, configurable: true });

test("홈은 핵심 서비스와 상담 CTA를 렌더링한다", () => {
  const markup = renderToStaticMarkup(<HomeContent />);
  assert.match(markup, /방문 간호/);
  assert.match(markup, /만성질환 관리/);
  assert.match(markup, /상담 신청하기/);
  assert.match(markup, /언론 보도/);
  assert.match(markup, /언론이 주목한 홈케어/);
  assert.match(markup, /헬스투데이/);
  assert.match(markup, /위클리케어/);
  assert.match(markup, /보호자 평점 4.9/);
  assert.match(markup, /내 가족에게 맡길 수 있는/);
  assert.match(markup, /훌륭한 간호사·요양보호사님을 찾습니다/);
});

test("홈의 섹션과 통계는 공용 모션 계약을 노출한다", () => {
  const markup = renderToStaticMarkup(<HomeContent />);
  assert.match(markup, /data-reveal="true"/);
  assert.match(markup, /data-reveal-group="true"/);
  assert.match(markup, /data-count="20"/);
  assert.match(markup, /data-count="1200"/);
  assert.match(markup, /data-count="97"/);
  assert.match(markup, />1,200\+</);
});
