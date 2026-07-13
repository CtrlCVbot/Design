# G-UI Fidelity Report

- 기준: `C:\Work\Dev\Design\.references\code\nb-main\src\pages\Dispatches.tsx`
- 계약: `11-cockpit-fidelity-contract.md`
- target: `/test/broker-order-console-new`
- 판정: 사용자 검수 준비 완료 / `G-UI pending`

## 상태별 대조

| CK | reference anchor | prototype 결과 | 사전 판정 |
|---|---|---|---|
| CK-01 | 좌 등록 약 600px + 우 fluid 목록 | 좌 등록·우 목록, 분리 scroll owner | 충족 |
| CK-02 | 목록 row inline 확장 | 선택 row 하단 detail workspace | 충족 |
| CK-03 | 좌 차주 후보 + 선택 row context | 3개 후보 card, 선택·해제·demo 배정 | 충족 |
| CK-04 | 우 주요 구간·상차지·하차지 추천 | 우 panel 전환, 선택 시 form context 유지 | 충족 |
| CK-05 | 목록 접힘·복원 affordance | rail mode와 복원 action | 충족 |

## Token·구조 대조

| 영역 | reference | prototype | 판정 |
|---|---|---|---|
| page background | `#F2F4F6` | route-local `#f2f4f6` | 일치 |
| surface | white panel/card | white pane/card | 일치 |
| primary | `#3182F6` | `#3182f6` | 일치 |
| frame | register / list 동시 노출 | desktop 2-pane | 일치 |
| form order | 거래처 → 구간/일시 → 차량 → 정산 → 메모 | 동일 순서 | 일치 |
| list density | filter → header → compact row | 동일 hierarchy | 대체로 일치 |
| recommendation | right pane mode 교체 | right pane mode 교체 | 일치 |
| assignment | left pane mode 교체 | left pane mode 교체 | 일치 |

## 의도된 차이

| 차이 | 이유 | G-UI 이후 처리 |
|---|---|---|
| AI 배차 분석을 실제 수치 대신 placeholder로 표시 | fidelity 계약이 가짜 AI·통계·위치 fixture를 금지 | 실제 데이터 계약 승인 후 연결 또는 계속 deferred |
| 저장·배정·상태 변경은 demo memory transition만 제공 | 사용자 화면 승인 전 capability bridge 금지 | G-UI 승인 후 Phase 3 capability bridge 계획 적용 |
| 새로고침 시 초기화 | prototype 계약 | 실제 저장 연결 단계에서 해소 |
| app navigation/sidebar 미포함 | navigation owner는 기존 앱이며 reference shell 직접 이식 금지 | 실제 route integration 시 기존 shell 사용 |

## 사용자 판정이 필요한 항목

1. 좌우 pane 비율과 한 화면 정보량
2. 등록 section 간격, field·chip 크기
3. 목록 column 폭·row 높이·상태 badge 밀도
4. inline detail의 정보 위계와 action 위치
5. 차주 후보 card의 정보량과 선택 강조
6. 추천 panel의 3개 group 밀도
7. color·radius·shadow·typography
8. prototype 안내 overlay의 위치와 허용 여부

## Known limitation

in-app browser의 넓은 viewport screenshot에서 브라우저 zoom/캡처 surface 차이로 오른쪽·아래쪽 가장자리 타일링이 발생했다. DOM 구조, viewport 값, interaction state, console은 별도로 검증했고 증거 이미지는 유효 영역만 crop했다. 따라서 최종 1600×1000·1440×900 전체 화면 만족도는 사용자가 실제 URL에서 직접 확인해야 한다.

이 제한은 구현 defect로 확인된 것은 아니지만 G-UI 시각 승인 증거의 완전성을 낮춘다.

## Risk-based self-review

| 피드백 | Impact | Reach | Recovery | Total | Severity | 처리 |
|---|---:|---:|---:|---:|---|---|
| production file별 basename test 부재로 guard deny | 3 | 2 | 1 | 6 | high | 자동 수정 완료 |
| fixture가 presentation component에 혼재 | 2 | 2 | 1 | 5 | high | `_prototype/**`로 이동 완료 |
| prototype 안내가 normal flow를 점유 | 2 | 2 | 1 | 5 | high | non-layout overlay로 수정 완료 |
| 넓은 viewport 캡처 가장자리 타일링 | 1 | 1 | 1 | 3 | medium | crop·DOM 검증으로 완화, 사용자 직접 검수 필요 |
| AI·실시간 상태 placeholder | 2 | 1 | 1 | 4 | medium | 의도된 defer, G-UI 이후 별도 결정 |

critical risk는 발견되지 않았다.

## G-UI 질문

사용자는 아래 중 하나를 명시한다.

- `G-UI approved`: 현재 화면 구조와 interaction을 기능 연결 기준으로 잠금
- `G-UI revise`: UA ID 또는 화면 상태와 함께 수정 요청
- `G-UI hold`: 검수를 보류하고 기능 연결도 계속 중단
