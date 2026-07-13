# 진행 기록

## 2026-07-10 — G0 시작

- 사용자 G0 승인: `진행해줘`
- 구현 branch: `feat/nbbb1-broker-order-console-new-ui-prototype`
- reference hash, project guard, legacy 46 files / 434 tests 기준선 확인
- Worker brief 공개 후 single-writer 방식으로 구현 시작

## 2026-07-10 — UI prototype 구현

- 신규 route: `/test/broker-order-console-new`
- 구현 범위: `app/test/broker-order-console-new/**`
- route-local fixture: `_prototype/**`
- CK-01 기본 2-pane, CK-02 inline detail, CK-03 차주 배정, CK-04 주소 추천, CK-05 collapse/restore 구현
- 실제 API·저장·backend/service 호출 0건
- 기존 `/test/broker-order-console/**` 변경 0건

## 2026-07-10 — Worker repair loop

Advisor 독립 검증에서 아래 3건을 발견해 Worker에게 repair brief를 전달했다.

1. rules guard가 basename test 부재로 production file 7개를 deny
2. prototype 안내가 normal flow를 점유
3. demo fixture가 registration component 내부에 존재

수정 결과:

- production file별 basename test 보강
- 안내를 route-level fixed overlay로 이동
- fixture를 `_prototype/demo-data.ts`로 이동
- final guard exit 0

## 2026-07-10 — Advisor 최종 검증

| 검증 | 결과 |
|---|---|
| 신규 route unit/component test | 9 files / 15 tests PASS |
| legacy focused regression | 46 files / 434 tests PASS |
| combined regression | 55 files / 449 tests PASS |
| TypeScript | `tsc --noEmit` PASS |
| production build | PASS, `/test/broker-order-console-new` static route 포함 |
| rules guard | exit 0 |
| forbidden dependency scan | clean |
| legacy route status | clean |
| UTF-8 | 신규 text file 20개 정상 |
| browser console | error 0 / warn 0 |

production build의 기존 Sentry 설정 warning과 LMS 환경변수 warning은 현재 prototype 변경에서 발생한 회귀가 아니며 build exit code는 0이다.

## 2026-07-10 — 브라우저 QA

- 상태 필터: `배차중 (1)` 선택 후 대상 row 1개 확인
- inline detail: `가온물류` row 확장과 detail card 확인
- 차주 배정: 장기사 선택 `aria-pressed=true`, demo 배정 후 현재 차주 반영 확인
- 주소 추천: `서울 마포구 공덕로` 선택 후 상차지 field 반영 확인
- 추천 panel·collapse/restore는 unit/component test와 브라우저 상태로 확인
- screenshot 5종 저장

## 현재 상태

- `P-06` 완료
- `G-UI Revision 1` 완료
- `G-UI revise-ready` 사용자 재검수 대기
- `B-00+` 실제 기능 연결 보류

## 진행 규칙

- G-UI에서 `revise`가 나오면 UI component·token·view interaction만 수정한다.
- G-UI에서 `approved`가 나오기 전에는 capability bridge·API·backend 작업을 시작하지 않는다.
- 사용자 소유 untracked 파일과 기존 route는 계속 보존한다.

## 2026-07-10 — G-UI Revision 1

사용자 `G-UI revise` 5건을 `nb-main` source code 기준으로 재분석했다.

| 항목 | 확인된 원인 | R1 결과 |
|---|---|---|
| 거래처 검색 없음 | right mode·action 부재 | 검색·filter·empty·선택·복귀 pane 추가 |
| 중앙 배치 | `max-width:1580px; margin:auto` | max-width 제거, full-width 40/60 |
| motion 부족 | reference timing·keyframe 미적용 | 200/350/220/300ms, hover·press·reduced-motion |
| 상세 구조 불일치 | 동일 크기 2×2 요약 카드 | advisor + 55/45 + 좌 상세 + 우 control stack |
| 세부 디자인 drift | screenshot 위주 단순화 | `Dispatches.tsx`, `index.css`, `ui.tsx` line anchor 기반 재적용 |

TDD Red에서 R1 관련 test 6건 실패를 확인한 뒤 구현했다.

### R1 Advisor 검증

| 검증 | 결과 |
|---|---|
| 신규 route test | 11 files / 22 tests PASS |
| legacy regression | 46 files / 434 tests PASS |
| TypeScript | PASS |
| production build | PASS, 신규 route 13.3kB |
| rules guard | 12 allow / 0 deny |
| forbidden dependency | 0건 |
| legacy route 변경 | 0건 |
| UTF-8 | 23 files PASS |
| browser full-width | utilization 1.000, pane 약 530/796px |
| browser detail | 약 373/305px, 55/45, overflow 0 |
| browser motion | pane 220ms, detail 300ms, control transition 200ms |
| browser client search | 5 columns·5 rows, filter·draft 반영 PASS |

브라우저의 Sentry debug bundle warning 1건은 기존 전역 설정이며 R1 component 오류는 아니다.

## 2026-07-10 — G-UI Revision 2 Inline Detail

사용자 피드백에 따라 `inline-dispatch-detail.tsx`를 `nb-main/src/pages/Dispatches.tsx:5119-5864`와 다시 line-by-line 대조했다. R1은 55/45 외곽만 따르고 내부를 재해석한 차이가 컸다.

### R2 교정 범위

- AI advisor: `배차중` 전용, 녹색·황색·적색 3단계와 3개 지표
- 좌측 상세: 거래처 action, 상·하차 2열, 정산/화물, 기사 메모
- 우측 운임: 운/수 toggle, 로컬 입력·증감·수정 enable, 인수증 disabled
- 우측 차주: editable 입력, 조건부 대화방, 차량배정 callback
- 상태: 6-state segmented control, 활성 상태 재클릭 시 reference 이전 상태
- CSS: exact typography, radius, gap, rail, 증가=red/감소=blue semantic color

### R2 검증

| 검증 | 결과 |
|---|---|
| TDD 초기 Red | 8 FAIL / 1 PASS |
| AI 3단계 Red | 4 FAIL / 8 PASS |
| CSS repair Red | 3 FAIL / 3 PASS, 추가 1 FAIL / 5 PASS |
| focused | 2 files / 15 tests PASS |
| new route 전체 | 11 files / 34 tests PASS |
| combined regression | 57 files / 465 tests PASS |
| TypeScript | PASS |
| production build | PASS, route 14.2 kB |
| project rules guard | 4-file synthetic patch ALLOW, exit 0 |
| browser layout | detail 722px, grid 364/298px, gap 20px, overflow 0 |
| browser motion | slideDown 300ms |
| browser interaction | fee 300,000→310,000, driver input, status reverse toggle PASS |
| 인수증 browser state | commission input·수 toggle disabled PASS |
| scope | legacy/backend/service/API/config 변경 0건 |

브라우저 console에는 기존 Sentry debug bundle warning 1건만 있었다. production build의 Sentry/LMS 환경변수 warning도 기존 설정이며 build exit code는 0이다.

현재 상태는 `G-UI revise-ready (R2)`다. 사용자 승인 전 Phase B는 계속 보류한다.
