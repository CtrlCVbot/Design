import assert from "node:assert/strict";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { ContactForm } from "./contact-form";

Object.defineProperty(globalThis, "React", { value: React, configurable: true });

test("상담 폼은 필수 입력과 Preview 비저장 고지를 렌더링한다", () => {
  const markup = renderToStaticMarkup(<ContactForm />);
  assert.match(markup, /name="name"/);
  assert.match(markup, /name="phone"/);
  assert.match(markup, /Preview에서는 저장·전송하지 않습니다/);
  assert.match(markup, /비용은 어떻게 되나요/);
});

test("상담 폼은 제출 진행 상태와 부드러운 FAQ 패널 계약을 제공한다", () => {
  const markup = renderToStaticMarkup(<ContactForm />);
  assert.match(markup, /role="status"/);
  assert.match(markup, /aria-live="polite"/);
  assert.match(markup, /aria-controls="faq-answer-0"/);
  assert.match(markup, /id="faq-answer-0"/);
  assert.match(markup, /class="faq-answer"/);
});
