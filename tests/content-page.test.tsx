import assert from "node:assert/strict";
import test from "node:test";
import React from "../apps/alliance-homecare/node_modules/react";
import { renderToStaticMarkup } from "../apps/alliance-homecare/node_modules/react-dom/server";
import { ContentPage } from "../apps/alliance-homecare/components/content-page";

Object.defineProperty(globalThis, "React", { value: React, configurable: true });

test("서비스 reference의 여섯 anchor와 이용 절차를 렌더링한다", () => {
  const markup = renderToStaticMarkup(<ContentPage kind="services" />);
  assert.match(markup, /id="nursing"/);
  assert.match(markup, /id="pediatric"/);
  assert.match(markup, /시작은 이렇게 간단합니다/);
});

test("후기·만성질환·회사 소개 reference의 고유 섹션을 렌더링한다", () => {
  assert.match(renderToStaticMarkup(<ContentPage kind="reviews" />), /그 무게를 아는 분들이었습니다/);
  assert.match(renderToStaticMarkup(<ContentPage kind="conditions" />), /세 가지 원칙으로 움직입니다/);
  assert.match(renderToStaticMarkup(<ContentPage kind="about" />), /방문간호팀 설립/);
});
