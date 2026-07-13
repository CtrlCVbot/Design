# G-UI R2 Inline Detail Fidelity Report

- verdict: `LIMITED — automated fidelity PASS, user visual gate pending`
- reference: `nb-main/src/pages/Dispatches.tsx:5119-5864`
- target: `/test/broker-order-console-new`

## Required Gap 결과

| ID | 항목 | 결과 |
|---|---|---|
| VF-STRUCTURE-01 | 배차중 전용 AI advisor + 3개 지표 | PASS |
| VF-STRUCTURE-02 | 55/45, 좌 상세 + 우 2-card stack | PASS |
| VF-STRUCTURE-03 | 상·하차 2열, 정산·화물·메모 순서 | PASS |
| VF-STATE-01 | 운/수 toggle·증감·save enable | PASS |
| VF-STATE-02 | 인수증 수수료 disabled | PASS |
| VF-STATE-03 | 6-state active reverse toggle | PASS |
| VF-TOKENS-01 | typography·spacing·radius·rail | PASS |
| VF-TOKENS-02 | increase red / decrease blue | PASS |
| VF-INTERACTION-01 | driver local edit·차량배정 callback | PASS |
| VF-SCOPE-01 | backend/service/API 무변경 | PASS |

## Self-review Feedback Loop

| 항목 | Severity | Confidence | Action | 메모 |
|---|---|---|---|---|
| R1 내부 구조 재해석 | high | confirmed | auto-fixed | reference 순서·필드로 교체 |
| 축소 typography와 반대 semantic color | high | confirmed | auto-fixed | exact CSS contract 6건 추가 |
| AI advisor 단일 황색 고정 | medium | confirmed | auto-fixed | 녹/황/적 3단계 보강 |
| wide viewport capture tiling/clip drift | low | confirmed | mitigated | screenshot은 보조, DOM/computed를 주 증거로 사용 |
| CSS module 규모 증가 | medium | confirmed | queued | G-UI 승인 후 동작 무변경 분리 검토 |

critical/high 잔여 gap은 확인되지 않았다. 사용자 최종 화면 만족도는 자동화로 대신할 수 없으므로 `G-UI approved` 전까지 Phase B를 시작하지 않는다.
