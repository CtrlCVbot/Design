import assert from "node:assert/strict";
import test from "node:test";
import React from "../apps/alliance-homecare/node_modules/react";
import { renderToStaticMarkup } from "../apps/alliance-homecare/node_modules/react-dom/server";
import { ContactForm } from "../apps/alliance-homecare/components/contact-form";

Object.defineProperty(globalThis, "React", { value: React, configurable: true });

test("상담 신청 reference의 일곱 서비스 옵션과 FAQ 원문을 렌더링한다", () => {
  const markup = renderToStaticMarkup(<ContactForm />);

  assert.match(markup, /시니어 케어/);
  assert.match(markup, /소아 홈케어/);
  assert.match(markup, /잘 모르겠어요 \(상담으로 결정\)/);
  assert.match(markup, /value="nursing"/);
  assert.match(markup, /value="aide"/);
  assert.match(markup, /value="chronic"/);
  assert.match(markup, /value="membership"/);
  assert.match(markup, /value="senior"/);
  assert.match(markup, /value="pediatric"/);
  assert.match(markup, /value="etc"/);
  assert.match(markup, /얼마나 빨리 시작할 수 있나요/);
  assert.match(markup, /장기요양보험이 적용되나요/);
});
