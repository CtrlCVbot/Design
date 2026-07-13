# 15. UI Prototype 사용자 검수·승인 Gate

- 작성일: 2026-07-10
- 상태: G0 `approved` / G-UI `revise-ready (R2)`
- 검수 target: `/test/broker-order-console-new`
- 원칙: 사용자가 `approved`를 명시하기 전에는 Phase 3 capability bridge를 연결하지 않는다.

## 1. 목적

새 기획 화면을 임의 해석한 상태로 실제 기능까지 구현하는 위험을 줄인다. 먼저 interaction 가능한 화면을 제공하고 사용자가 구성·밀도·용어·흐름을 직접 확인한다. 불만족 항목은 UI layer에서 반복 수정한 뒤 승인 화면을 기능 연결의 기준선으로 잠근다.

## 2. Prototype 성격

| 항목 | prototype 단계 |
|---|---|
| 데이터 | route-local in-memory fixture |
| API/network | 사용하지 않음 |
| 등록·배정·상태 변경 | demo transition만 제공, 저장하지 않음 |
| 새로고침 | 초기 demo state로 복귀 |
| 미지원 기능 | `prototype-only / data not connected` 표시 |
| 기존 route | 수정하지 않음 |
| backend/service | 수정·연결하지 않음 |

Prototype 표시는 reference content의 pane 비율이나 row 높이를 바꾸지 않는 route-level banner 또는 non-layout overlay를 우선한다. 항목별 설명이 필요하면 screenshot 기준 화면 밖의 검수 패널에 둔다.

> R2 갱신: inline detail은 `nb-main/src/pages/Dispatches.tsx:5119-5864`의 구조·label·token·상태 동작을 다시 적용했다. 자동 검증은 완료됐지만 사용자 승인 전까지 gate는 열지 않는다.

## 3. 검수 제공물

G-UI 검수 요청 시 다음을 함께 제공한다.

1. 실행 URL과 인증·진입 방법
2. 검수 권장 viewport
   - 1600×1000
   - 1440×900
3. CK-01~05 상태별 screenshot
4. `nb-main` reference와 prototype 비교표
5. known gap과 의도적 차이
6. 조작 순서 5개
7. 이번 검수에서 결정할 질문
8. prototype commit/hash 또는 동일한 변경 식별자

## 4. 필수 화면 상태

| 상태 | 시작 조건 | 확인할 결과 |
|---|---|---|
| CK-01 기본 | route 최초 진입 | 좌 등록 + 우 목록, 정보 밀도와 pane 비율 |
| CK-02 상세 | 목록 행 클릭 | inline 상세 확장, 선택 강조, action 배치 |
| CK-03 배정 | 배정 action | 좌 driver card mode, 선택·해제·demo 배정 |
| CK-04 추천 | 화주·주소 interaction | 우 추천 panel, 후보 카드, form context 유지 |
| CK-05 접힘 | list collapse | 복구 affordance와 선택·filter view state 유지 |

## 5. 필수 조작 시나리오

### UJ-01 등록 화면

1. 거래처 chip 또는 검색 field 선택
2. 상·하차지 입력
3. 차량·화물·정산 UI 확인
4. demo 등록 실행
5. 입력 feedback과 우측 목록 반영 모양 확인

### UJ-02 목록·상세

1. filter 변경
2. 상태 chip 선택
3. 행 확장
4. 상세 action 위치 확인
5. 다시 접기

### UJ-03 차주 배정

1. 배정 mode 진입
2. driver card 선택·변경
3. demo 배정
4. 배정 결과 표시 확인
5. 등록 mode로 복귀

### UJ-04 추천 panel

1. 화주 또는 주소 후보 선택
2. 추천 mode 전환
3. 후보 카드 선택
4. form 반영 모양 확인
5. 목록 mode 복귀

### UJ-05 collapse

1. 목록 filter·행 선택
2. 우측 panel 접기
3. 다시 펼치기
4. 화면 view state 유지 확인

## 6. 사용자 검수 체크리스트

각 항목을 `만족 / 수정 / 제외 / 보류`로 기록한다.

| ID | 검수 항목 | 판정 | 요청·근거 |
|---|---|---|---|
| UA-01 | 전체 좌우 pane 비율 | 미검수 | |
| UA-02 | 화면 정보 밀도와 scroll | 미검수 | |
| UA-03 | 등록 section 순서 | 미검수 | |
| UA-04 | 입력 field·chip 크기와 간격 | 미검수 | |
| UA-05 | 목록 column·row 높이 | 미검수 | |
| UA-06 | filter·status control 위치 | 미검수 | |
| UA-07 | inline 상세 정보 위계 | 미검수 | |
| UA-08 | 차주 배정 mode·card | 미검수 | |
| UA-09 | 추천 panel과 후보 선택 | 미검수 | |
| UA-10 | list collapse·restore | 미검수 | |
| UA-11 | color·radius·shadow·typography | 미검수 | |
| UA-12 | 버튼·badge·chip 위계 | 미검수 | |
| UA-13 | 화면 용어와 label | 미검수 | |
| UA-14 | 추가·삭제·이동할 요소 | 미검수 | |
| UA-15 | desktop 전체 만족도 | 미검수 | |

## 7. Revision loop

1. 사용자가 `수정` 항목과 우선순위를 지정한다.
2. UI component·token·view interaction만 수정한다.
3. 기능 bridge·API·backend 작업은 계속 보류한다.
4. 영향받은 CK 상태 screenshot을 다시 만든다.
5. 수정 전/후와 남은 gap을 보고한다.
6. 사용자가 `approved` 또는 추가 `revise`를 결정한다.

## 8. G-UI 승인 기록

| 필드 | 값 |
|---|---|
| gate | `G-UI` |
| status | `pending / revise / approved` |
| reviewer | 사용자 |
| reviewed_at | 미정 |
| target URL | `/test/broker-order-console-new` |
| viewport | 미정 |
| approved evidence | 미정 |
| approved revision | 미정 |
| remaining tolerance | 미정 |
| excluded items | 미정 |
| follow-up decisions | 미정 |

승인 문구 예시:

> G-UI approved. 현재 화면 구성과 interaction을 기능 연결 기준선으로 사용한다. 기록된 제외·보류 항목은 자동 구현하지 않는다.

## 9. 승인 후 잠금과 재승인

G-UI 승인 후 다음은 화면 기준선으로 잠근다.

- pane 비율과 주요 block order
- 등록 section order
- 목록 column과 기본 row density
- 상세·배정·추천 mode 전환 방식
- primary action과 secondary action hierarchy
- 핵심 token과 component treatment

다음 변경은 재승인을 받는다.

- pane 구조 또는 주요 section 순서 변경
- primary flow를 바꾸는 dialog/drawer 추가
- 목록 column 대량 추가·삭제
- 승인된 mode 제거
- Phase 3-only 기능 배치로 화면 밀도가 크게 변함
- mobile 확장으로 desktop contract가 함께 변함

## 10. G-UI exit condition

- UA-01~15 판정 완료
- `수정` 항목 0건 또는 후속 revision으로 해소
- known gap·제외·보류 기록
- 승인 screenshot·revision 식별자 기록
- 사용자 명시적 `approved`

이 조건을 모두 만족해야 Phase B capability bridge를 시작할 수 있다.

## 11. 2026-07-10 검수 패키지 준비 결과

- target 구현: 완료
- CK-01~05 자동·브라우저 사전 검증: 완료
- 신규 test: 9 files / 15 tests PASS
- legacy regression: 46 files / 434 tests PASS
- typecheck·production build·rules guard: PASS
- 실제 API·저장·backend/service 호출: 0건
- 기존 `/test/broker-order-console` 변경: 0건
- screenshot: `evidence/screenshots/` 5종
- 상세 검증: `evidence/verification/01-ui-prototype-verification.md`
- fidelity·known gap: `evidence/visual-gap/01-g-ui-fidelity-report.md`

현재 gate 상태는 `revise-ready`다. 사용자의 `G-UI approved` 또는 추가 `G-UI revise`가 기록되기 전에는 Phase B를 시작하지 않는다.

## 12. G-UI Revision 1 기록

- 요청일: 2026-07-10
- reviewer: 사용자
- decision: `G-UI revise`
- 상세 계약: `18-g-ui-revision-1-code-fidelity-contract.md`

요청 항목:

1. 거래처 검색 결과 pane 추가
2. 중앙 max-width 제거와 웹 가용 폭 활용
3. reference code 기반 motion·interaction 반영
4. expanded detail의 55/45 구조와 내부 section 재현
5. screenshot 의존도를 낮추고 reference source code token·style을 세부 대조

R1 완료 전 gate status는 `revise`, 완료 후 사용자 재검수 대기 상태는 `revise-ready`로 기록한다.

### R1 완료 기록

- completed_at: 2026-07-10
- status: `revise-ready`
- test: 11 files / 22 tests PASS
- legacy: 46 files / 434 tests PASS
- build·type·guard: PASS
- evidence: `evidence/verification/02-g-ui-r1-verification.md`
- fidelity: `evidence/visual-gap/02-g-ui-r1-code-fidelity-report.md`
- screenshots: `g-ui-r1-client-search.png`, `g-ui-r1-inline-detail.png`
