import assert from "node:assert/strict";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { ContentPage } from "./content-page";

Object.defineProperty(globalThis, "React", { value: React, configurable: true });

test("서비스 페이지는 여섯 앵커와 이용 절차를 reference 순서로 렌더링한다", () => {
  const markup = renderToStaticMarkup(<ContentPage kind="services" />);
  assert.match(markup, /id="nursing"/);
  assert.match(markup, /id="pediatric"/);
  assert.match(markup, /시작은 이렇게 간단합니다/);
  assert.match(markup, /질환별 케어 보기/);
});

test("후기 페이지는 대표 후기와 여섯 개의 실제 이용 후기를 렌더링한다", () => {
  const markup = renderToStaticMarkup(<ContentPage kind="reviews" />);
  assert.match(markup, /그 무게를 아는 분들이었습니다/);
  assert.match(markup, /김O현 님/);
  assert.match(markup, /한O미 님/);
});

test("만성질환 페이지는 세 원칙과 질환별 상담 CTA를 렌더링한다", () => {
  const markup = renderToStaticMarkup(<ContentPage kind="conditions" />);
  assert.match(markup, /루게릭병 \(ALS\)/);
  assert.match(markup, /파킨슨병/);
  assert.match(markup, /세 가지 원칙으로 움직입니다/);
  assert.match(markup, /상담하기/);
});

test("회사 소개 페이지는 연혁, 주요 지표, 채용 섹션을 렌더링한다", () => {
  const markup = renderToStaticMarkup(<ContentPage kind="about" />);
  assert.match(markup, /방문간호팀 설립/);
  assert.match(markup, /1,200\+/);
  assert.match(markup, /id="careers"/);
});

test("콘텐츠 페이지는 리빌 그룹과 카운트업 계약을 공유한다", () => {
  const servicesMarkup = renderToStaticMarkup(<ContentPage kind="services" />);
  const aboutMarkup = renderToStaticMarkup(<ContentPage kind="about" />);
  assert.match(servicesMarkup, /data-reveal="true"/);
  assert.match(servicesMarkup, /data-reveal-group="true"/);
  assert.match(aboutMarkup, /data-count="1200"/);
  assert.match(aboutMarkup, /data-count-suffix="\+"/);
});
