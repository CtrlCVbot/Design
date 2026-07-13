# G-UI Revision 4 — 디자인 디테일 전체 적용 계약

- 작성일: 2026-07-13
- gate: `G-UI revise-ready (R4)`
- target: `/test/broker-order-console-new`
- source of truth: `design-proposals/g-ui-design-detail-before-after.html`의 DD-01~12 After
- scope: `app/test/broker-order-console-new/**`

## Current Verdict

- Functional status: R3 목록 검색 완료, R4 DD-01~12 구현·검증 완료
- Fidelity status: DD-01~12 전체 적용 승인
- Closeout decision: `revise-ready (R4)`, 사용자 재검수 대기
- Source of truth: Before/After HTML의 After 구조·token·state

## Reference Inputs

| artifact | path_or_url | role | notes |
|---|---|---|---|
| 디자인 제안 HTML | `design-proposals/g-ui-design-detail-before-after.html` | source of truth | DD-01~12 전체 승인 |
| 코드형 기획 원본 | `.references/code/nb-main` | 기존 화면 구조 기준 | R1~R3 계약 유지 |
| target app | `/test/broker-order-console-new` | implementation target | route-local prototype |

## Screen And State Inventory

| screen_or_state | required_viewports | reference_evidence | app_evidence | status |
|---|---|---|---|---|
| 기본 등록+목록 | 1600×1000, 1440×900 | DD-01~09 | `g-ui-r4-default.png` | verified |
| 날짜 직접선택 | 1440×900 | DD-02 | `g-ui-r4-custom-date.png` | verified |
| 목록 expanded | 1440×900 | DD-04, DD-11 | `g-ui-r4-detail-feedback.png` | verified |
| 검색 결과 없음 | 1440×900 | DD-10 | `g-ui-r4-no-result.png` | verified |
| compact/column scroll | 1280×900 | DD-12 | `g-ui-r4-1280-column-scroll.png` | verified |
| 1-column | 767×900 | DD-12 | `g-ui-r4-767-single-column.png` | verified |

## DD Implementation Map

| ID | After 계약 | target | 검증 |
|---|---|---|---|
| DD-01 | status rail + 고정 검색 cluster | `dispatch-list-pane.tsx`, CSS | DOM·computed style |
| DD-02 | pressed 날짜 filter + 직접선택 range | `dispatch-list-pane.tsx` | behavior test·browser |
| DD-03 | minmax column + ellipsis | CSS | CSS contract·overflow |
| DD-04 | expanded rail + soft surface | CSS | screenshot·computed style |
| DD-05 | 14/12/40/18 form rhythm + section rail | `registration-pane.tsx`, CSS | CSS contract·screenshot |
| DD-06 | Primary/Secondary/Outline/Ghost | component buttons, CSS | CSS contract |
| DD-07 | Caption/Metadata/Body/Section type ladder | CSS tokens | CSS contract·computed style |
| DD-08 | focus-visible + disabled 42% | scoped controls, CSS | CSS contract·keyboard |
| DD-09 | sticky header + edge fade | list structure, CSS | scroll browser QA |
| DD-10 | 원인·안내·복구 action | `dispatch-list-pane.tsx` | behavior test·browser |
| DD-11 | 수정 완료 feedback + 저장 안 됨 | `inline-dispatch-detail.tsx` | behavior test·browser |
| DD-12 | 1600/1440/1280/768 responsive | CSS media queries | viewport QA |

## Token And Style Map

| token_area | source_value | target_value | match_required | notes |
|---|---|---|---|---|
| type-caption | 11px | CSS variable | yes | 보조 안내 |
| type-metadata | 12px | CSS variable | yes | 날짜·상태 |
| type-body | 13px | CSS variable | yes | 필드·본문 |
| type-section | 14.72px | CSS variable | yes | section heading |
| field-height | 40px | form control | yes | 등록 리듬 |
| focus ring | primary + 3px soft ring | `:focus-visible` | yes | keyboard state |
| disabled | opacity 42% + not-allowed | shared controls | yes | 조작 가능성 |
| selected row | primary rail + `#f6faff` 계열 | expanded row | close match | 기존 status 색 보존 |
| button hierarchy | primary/secondary/outline/ghost | shared class contract | yes | action 경쟁 제거 |

## Asset Map

별도 bitmap·SVG asset은 추가하지 않는다. 기존 `lucide-react` icon과 CSS shape만 사용하며 package 변경은 금지한다.

## Visual Gap Board

| gap_id | category | reference | current_app | severity | planned_fix | evidence |
|---|---|---|---|---|---|---|
| VF-TOOLBAR | layout | 독립 status rail/search cluster | 좁은 폭에서 rail·검색 경쟁 | high | overflow owner 분리 | R4 screenshot |
| VF-DATE | state | pressed + custom range | 정적 quick button | high | route-local date state | interaction log |
| VF-ROWS | density | minmax/ellipsis/selected rail | 일부 wrap·weak selection | medium | CSS column contract | computed style |
| VF-FORM | rhythm | 14/12/40/18 | section별 간격 혼재 | medium | spacing token 통합 | screenshot |
| VF-A11Y | interaction | focus ring/disabled rule | control별 편차 | high | shared state rule | keyboard QA |
| VF-SCROLL | affordance | sticky + edge fade | header 분리·fade 없음 | medium | sticky header/fade | browser scroll |
| VF-EMPTY | recovery | 이유 + reset action | text only | high | actionable empty state | behavior test |
| VF-FEEDBACK | state | 수정 완료 + 저장 안 됨 | disabled만 변경 | high | status feedback | behavior test |
| VF-RESPONSIVE | layout | 1600/1440/1280/<768 | desktop 중심 | high | breakpoint contract | viewport QA |

## Implementation Order

1. R4 behavior·CSS contract test를 먼저 추가하고 Red를 확인한다.
2. toolbar/date/no-result와 list row 구조를 구현한다.
3. form·button·typography·focus·scroll token을 적용한다.
4. detail feedback과 responsive breakpoint를 적용한다.
5. focused·route 전체·type·build 검증을 수행한다.
6. 1600/1440/1280/767 browser evidence를 수집한다.
7. Simple Design·fidelity gap을 재검토하고 gate 문서를 갱신한다.

## Completion Criteria

- Exact-match items: DD-01~12 behavior·token 계약, focus/disabled, breakpoint 존재
- Tolerance-based items: text fit과 pane 내부 폭은 viewport별 overflow 없이 유지
- Required screenshots: 기본, custom date, no-result, detail feedback, 1280, 767
- Required commands: focused Vitest, 신규 route 전체 Vitest, `tsc --noEmit`, production build
- Remaining accepted gaps: backend/API 미연결과 prototype reset은 기존 gate대로 유지

## Scope Guard

- 기존 `/test/broker-order-console` 변경 금지
- backend/service/API/localStorage/package/config 변경 금지
- 디자인 전체 적용을 Phase B 기능 연결 승인으로 해석하지 않음
- R4 구현 완료 후에도 사용자 `G-UI approved` 전에는 Phase B를 시작하지 않음

## Verification Result

| 검증 | 결과 |
|---|---|
| TDD Red | 4 files / 29 tests 중 5 FAIL, 보강 CSS 1 FAIL |
| focused Green | 5 files / 38 tests PASS |
| 신규 route 전체 | 11 files / 46 tests PASS |
| TypeScript | PASS |
| production build | PASS, route 14.9 kB / first load 201 kB |
| browser interaction | date·empty recovery·detail feedback·focus·disabled PASS |
| responsive | 1600/1440/1280/766, document overflow 0, 내부 column scroll PASS |
| scope | legacy/backend/service/API/config 변경 0건 |

- verification: `evidence/verification/05-g-ui-r4-design-detail-verification.md`
- fidelity: `evidence/visual-gap/05-g-ui-r4-design-detail-fidelity-report.md`
