import assert from "node:assert/strict";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { ContentPage } from "../components/content-page";

Object.defineProperty(globalThis, "React", { value: React, configurable: true });

test("reference route contracts cover anchors, reviews, care principles, and company history", () => {
  const services = renderToStaticMarkup(<ContentPage kind="services" />);
  const reviews = renderToStaticMarkup(<ContentPage kind="reviews" />);
  const conditions = renderToStaticMarkup(<ContentPage kind="conditions" />);
  const about = renderToStaticMarkup(<ContentPage kind="about" />);

  assert.match(services, /id="nursing"/);
  assert.match(reviews, /그 무게를 아는 분들이었습니다/);
  assert.match(conditions, /세 가지 원칙으로 움직입니다/);
  assert.match(about, /방문간호팀 설립/);
});
