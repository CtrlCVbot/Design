# G-UI Revision 2 — Inline Dispatch Detail Fidelity Contract

- 작성일: 2026-07-10
- target: `C:\Work\Dev\Optics\apps\mm-broker\app\test\broker-order-console-new\_components\inline-dispatch-detail.tsx`
- reference: `C:\Work\Dev\Design\.references\code\nb-main\src\pages\Dispatches.tsx:5119-5864`
- reference CSS: `C:\Work\Dev\Design\.references\code\nb-main\src\index.css:218-230,564-567,581-595`
- mode: implementation
- gate: `G-UI revise-ready (R2)`

## 목표

R1 상세 화면의 재해석을 제거하고, `nb-main` 상세 패널의 표시 구조·필드·토큰·상태·로컬 상호작용을 `broker-order-console-new`의 demo data 범위 안에서 최대한 동일하게 재현한다.

backend/service/API 연결은 하지 않는다. reference가 `localStorage`에 저장하는 동작은 route-local React state로 대체하며, 실제 저장 기능으로 오해되지 않도록 한다.

## Reference 구조 계약

1. 확장 행 컨테이너
   - 흰색 상세 패널, `1.25rem` padding/gap
   - `slideDown 300ms cubic-bezier(0.4, 0, 0.2, 1)`
2. AI 배차 분석 어드바이저
   - `배차중` 상태에서만 표시
   - 녹색/황색/적색 좌측 rail, 상태 제목, 설명, 대기 차주·경쟁 화물·구간 평균 운임
3. 본문 `55fr 45fr`, gap `1.25rem`
4. 좌측 상세 카드
   - 제목 rail + `상세 정보`
   - 거래처명, `+ 경유지 추가`, `대화방`
   - 상차지/하차지 2열, 하차지 왼쪽 dashed divider
   - 정산 수단/수수료, 정산 예정일, 화물품목
   - `기사 전달사항 및 메모` 왼쪽 primary rail
5. 우측 운임/수수료 카드
   - 제목 rail + 정산방법
   - 운임/수수료 입력 2행
   - `운/수` 조정 대상 vertical toggle
   - `+1만/+5천/+1천`, `-1만/-5천/-1천`
   - 2행 span `수정` 버튼
   - 인수증이면 수수료 입력과 `수` toggle disabled
6. 우측 차주/상태 카드
   - success rail
   - 차량번호 2-column span + 차량배정
   - 차주명 + 연락처 + 차주가 있을 때 대화방
   - 6-state segmented control
   - 활성 상태 재클릭 시 reference의 이전 상태로 되돌림

## R1 Gap Board

| ID | R1 구현 | Reference | R2 판정 |
|---|---|---|---|
| R2-01 | advisor placeholder 상시 표시 | 배차중일 때만 실제 분석형 strip | 필수 수정 |
| R2-02 | 상차→화살표→하차 3열 | 상·하차 2열 + dashed divider | 필수 수정 |
| R2-03 | 차량 스펙/화물/정산 3열 | 정산/수수료·예정일 2열 + 화물 full row | 필수 수정 |
| R2-04 | prototype context 문구 포함 memo | primary rail의 기사 전달사항 | 필수 수정 |
| R2-05 | readOnly fee/commission, 무동작 quick buttons | 로컬 편집 + 운/수 toggle + save enable state | 필수 수정 |
| R2-06 | readOnly driver inputs | 로컬 editable inputs | 필수 수정 |
| R2-07 | 차주 대화방 없음 | 차주 존재 시 대화방 버튼 | 필수 수정 |
| R2-08 | 상태 클릭은 항상 선택 상태로 설정 | 활성 상태 재클릭 시 이전 상태로 toggle | 필수 수정 |
| R2-09 | card gap 12px, 세부 토큰 재해석 | `0.85rem/1rem/1.25rem` reference token | 필수 수정 |

## 허용된 Prototype 대체

- reference의 서버/`localStorage` 저장은 route-local state와 callback으로만 흉내 낸다.
- Daum postcode 경유지 편집기는 추가하지 않는다. `+ 경유지 추가`는 화면 형태만 유지한다.
- 거래처/차주 대화방은 외부 메시지 서비스를 연결하지 않는다.
- reference에 없는 API, backend, service는 만들지 않는다.

## TDD Acceptance Criteria

- [x] `배차중`에서만 AI advisor가 나타나며 3개 분석 지표가 표시된다.
- [x] 좌측 카드가 reference 순서와 label을 그대로 가진다.
- [x] 원본에 없는 차량 스펙 3열과 prototype disclaimer가 제거된다.
- [x] 운임/수수료 조정 대상 toggle과 로컬 금액 증감이 동작한다.
- [x] 인수증에서는 수수료 입력과 `수` toggle이 disabled다.
- [x] 차주 입력이 로컬에서 편집 가능하고 차주가 있으면 대화방 버튼이 보인다.
- [x] 6-state control과 active-state reverse toggle이 동작한다.
- [x] CSS contract가 55/45, 1.25rem gap, success rail, 300ms slideDown을 고정한다.
- [x] 기존 거래처 검색·등록·목록·차주 배정 demo flow가 회귀하지 않는다.
- [x] legacy `broker-order-console`, backend/service/API/config/package는 변경하지 않는다.

## 구현·검증 결과

- TDD 초기 Red: `8 FAIL / 1 PASS`
- AI advisor 3단계 보강 Red: `4 FAIL / 8 PASS`
- CSS token repair Red: `3 FAIL / 3 PASS`, 추가 색상 Red `1 FAIL / 5 PASS`
- focused: `2 files / 15 tests PASS`
- new route 전체: `11 files / 34 tests PASS`
- legacy + new combined: `57 files / 465 tests PASS`
- TypeScript: PASS
- production build: PASS, 신규 route `14.2 kB`
- browser DOM/computed/interaction: PASS
- 사용자 최종 화면 판정: 대기

## 사용자 재검수 Gate

R2 구현·검증 후에도 자동으로 `PASS` 처리하지 않는다. 최종 판정은 `G-UI revise-ready (R2)`로 두고, 사용자가 reference 대비 상세 화면을 다시 확인한 뒤 `G-UI approved` 또는 추가 `G-UI revise`를 결정한다.
