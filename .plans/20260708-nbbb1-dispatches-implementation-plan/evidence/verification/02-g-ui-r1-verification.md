# G-UI Revision 1 검증 보고서

- 검증일: 2026-07-10
- branch: `feat/nbbb1-broker-order-console-new-ui-prototype`
- base HEAD: `744327f5`
- target: `/test/broker-order-console-new`
- gate: `G-UI revise-ready`
- reference: `nb-main/src/pages/Dispatches.tsx`, `src/index.css`, `src/components/ui.tsx`

## 결론

사용자 R1 피드백 5건은 code-level contract 기준으로 구현·검증됐다. 기능·회귀·build 검증은 PASS다. `verify-html-fidelity` 최종 verdict는 사용자의 전체 화면 만족도 판정이 남아 있어 `LIMITED`이며, 이는 코드 실패가 아니라 사용자 G-UI gate와 넓은 화면 capture limitation 때문이다.

## TDD 증거

- production 수정 전 R1 관련 test 6건 FAIL
- 최종 신규 route: 11 files / 22 tests PASS
- 신규 test surface:
  - `client-search-pane.test.tsx`
  - `prototype-css-contract.test.ts`
  - page client search·status transition
  - detail section·6-state control

## 자동 검증

| 검증 | 결과 |
|---|---|
| 신규 route Vitest | 11 files / 22 tests PASS |
| legacy regression | 46 files / 434 tests PASS |
| TypeScript | `tsc --noEmit` PASS |
| production build | PASS |
| Next route | `/test/broker-order-console-new`, static, 13.3kB |
| rules guard | 12 allow / 0 deny |
| forbidden dependency | clean |
| legacy route | clean |
| UTF-8 | 23 files PASS |

## Browser computed evidence

| 항목 | 실측 결과 | 판정 |
|---|---|---|
| viewport | 1422×800 CSS px | 참고 |
| workspace | x=0, width=1422, utilization=1.000 | PASS |
| pane width | left≈530, right≈796 | 40/60 PASS |
| horizontal overflow | body scrollWidth=1422 | 없음 |
| pane motion | `paneEnter`, 0.22s | PASS |
| detail motion | `detailEnter`, 0.3s | PASS |
| row/control transition | 0.2s, reference easing | PASS |
| client search | 5 columns·5 rows | PASS |
| client filter | `박대리` → `나래물산` 1 row | PASS |
| client selection | draft 3필드 반영, list 복귀 | PASS |
| detail grid | 약 373/305px, 55/45 | PASS |
| detail overflow | scrollWidth=clientWidth=722 | 없음 |
| status segment | 6개, current `aria-pressed` | PASS |
| demo status | 운행완료 선택 → badge 반영 | PASS |

Browser console의 Sentry debug bundle warning 1건은 기존 전역 설정이며 R1 source에서 발생한 오류가 아니다.

## 범위

- 실제 API·저장·backend/service: 미연결
- legacy route: 무변경
- package·lockfile·전역 config: 무변경
- commit·push·PR·deploy: 미수행
