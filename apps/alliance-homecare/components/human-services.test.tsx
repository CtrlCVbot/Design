import assert from "node:assert/strict";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { HumanServices } from "./human-services";

Object.defineProperty(globalThis, "React", { value: React, configurable: true });

test("서비스 아코디언은 네 서비스를 렌더링하고 첫 항목만 펼친다", () => {
  const markup = renderToStaticMarkup(<HumanServices />);

  assert.match(markup, /방문요양/);
  assert.match(markup, /방문목욕/);
  assert.match(markup, /가족요양 상담/);
  assert.match(markup, /장기요양 등급 안내/);
  assert.equal((markup.match(/aria-expanded="true"/g) ?? []).length, 1);
  assert.equal((markup.match(/aria-controls="human-service-/g) ?? []).length, 4);
  assert.equal((markup.match(/role="region"/g) ?? []).length, 4);
  assert.equal((markup.match(/id="human-service-[^"]+-trigger"/g) ?? []).length, 4);
  assert.equal((markup.match(/aria-labelledby="human-service-[^"]+-trigger"/g) ?? []).length, 4);
});
