# 실행 Tasks

| ID | 작업 | 상태 | owner | 검증/비고 |
|---|---|---|---|---|
| R-00 | reference hash·screen contract 확인 | 완료 | Advisor | `Dispatches.tsx`, `index.css` hash 고정 |
| R-01 | legacy focused 회귀 기준선 | 완료 | Advisor | 46 files / 434 tests PASS |
| P0-HOOK | guard deny/allow dry-run | 완료 | Advisor | final guard exit 0 |
| N-00 | 신규 route·isolation test | 완료 | Worker | `/test/broker-order-console-new`, legacy 무변경 |
| N-01 | component boundary | 완료 | Worker | route-local component·prototype fixture 분리 |
| N-02 | token·layout foundation | 완료 | Worker | 2-pane desktop, scoped CSS token |
| P-01 | 등록·목록 prototype | 완료 | Worker | demo 등록·필터·목록 반영 |
| P-02 | 상세 확장 | 완료 | Worker | inline detail·selected context |
| P-03 | 차주 배정 mode | 완료 | Worker | 후보 선택·demo 배정·등록 mode 복귀 |
| P-04 | 추천·collapse mode | 완료 | Worker | 추천 주소 반영·목록 collapse/restore |
| P-05 | 전체 기획 상태 preview | 완료 | Worker | 실제 연결 전 기능은 `prototype-only` 표시 |
| P-06 | screenshot·gap·검수 package | 완료 | Advisor | `evidence/**` 생성, known gap 기록 |
| R1-01 | 거래처 검색 pane | 완료 | Worker | 검색·filter·empty·선택·복귀 |
| R1-02 | full-width 40/60 layout | 완료 | Worker | browser width utilization `1.000` |
| R1-03 | reference motion contract | 완료 | Worker | 200/350/220/300ms + reduced-motion |
| R1-04 | 상세 55/45 layout | 완료 | Worker | 좌 상세 + 우 운임·차주/status stack |
| R1-05 | code-level token·component fidelity | 완료 | Advisor/Worker | source anchor 대조·primary rail 보완 |
| R1-06 | 독립 회귀·build·browser 검증 | 완료 | Advisor | 11/22 + 46/434, build PASS |
| R2-01 | inline detail source 재대조 | 완료 | Advisor | `Dispatches.tsx:5119-5864` 구조·token·interaction 계약 |
| R2-02 | inline detail 구조·상태 재구현 | 완료 | Worker | advisor·상하차·정산·운임·차주·6-state |
| R2-03 | typography·semantic color repair | 완료 | Advisor/Worker | reference exact token CSS contract 6건 |
| R2-04 | 독립 회귀·build·browser 검증 | 완료 | Advisor | 11/34 + combined 57/465, build PASS |
| R3-01 | 목록 검색 reference 계약 | 완료 | Advisor | 6-field·지연 적용·facet·reset 계약 |
| R3-02 | 검색·초기화 TDD 구현 | 완료 | Worker | focused 2/16, 신규 route 11/43 PASS |
| R3-03 | 디자인 디테일 Before/After HTML | 완료 | Advisor | DD-01~12, 앱 미적용 |
| R3-04 | 독립 type·build·browser 검증 | 완료 | Advisor | type/build/computed style/interaction PASS |
| R4-01 | DD-01~12 fidelity 계약 | 완료 | Advisor | HTML After state·token·viewport 고정 |
| R4-02 | DD-01~12 TDD 구현 | 완료 | Worker | Red 5 FAIL + 보강 1 FAIL, Green 5/38 |
| R4-03 | 신규 route 전체·type·build 검증 | 완료 | Advisor | 11/46, type/build PASS |
| R4-04 | interaction·responsive·fidelity 검증 | 완료 | Advisor | 1600/1440/1280/766 PASS |
| G-UI | 사용자 재검수 | 완료 | 사용자 | R4 `approved` 기록 |
| JH-00 | 인수인계 패키지 | 완료 | Advisor | `22`, `23` — Phase B 계획부터 시작 |
| B-00+ | 실제 기능 연결 | 예정 | Advisor/Worker | Phase B 상세 계획·사용자 승인 후 시작 |

## 현재 중단선

R4 DD-01~12 전체 적용이 사용자 `G-UI approved`로 승인됐다. 현재 단계는 Phase B 계획·승인 대기이며 실제 API, Phase 3 capability bridge, backend/service 연결은 아직 시작하지 않는다.
