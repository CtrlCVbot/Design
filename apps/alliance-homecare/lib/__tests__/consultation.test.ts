import assert from "node:assert/strict";
import test from "node:test";

import { createDemoConsultationState, getNextOpenFaq } from "../consultation";

test("상담 신청은 개인정보를 보관하지 않는 demo 완료 상태를 만든다", () => {
  assert.deepEqual(createDemoConsultationState(), { status: "submitted", message: "신청이 접수되었습니다" });
});

test("FAQ는 하나만 열리며 같은 항목은 닫힌다", () => {
  assert.equal(getNextOpenFaq(null, 2), 2);
  assert.equal(getNextOpenFaq(2, 2), null);
  assert.equal(getNextOpenFaq(2, 3), 3);
});
