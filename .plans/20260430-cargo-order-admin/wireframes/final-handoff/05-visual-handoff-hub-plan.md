# Visual Handoff Hub 설계안

## 목적

Visual handoff hub는 여러 `.md` 문서를 새로 대체하는 문서가 아닙니다. 화면, 흐름, 섹션, 컴포넌트를 기준으로 기존 source 문서를 탐색하게 하는 HTML 기반 planning hub입니다.

이번 패키지에서는 실제 `index.html`을 생성하지 않고, 후속 구현을 위한 IA와 데이터 초안을 제공합니다.

## MVP 범위

| 범위 | 포함 |
| --- | --- |
| 1. screen map + user flow + 화면 상태 preview | 왼쪽 flow, 가운데 상태/preview, 오른쪽 상세 |
| 2. 섹션/컴포넌트별 기능 설명 + data/validation/API/QA 연결 | field, action, source link, AC 연결 |
| 3. 구현 전 handoff checklist | 기존 프로젝트 분석자가 확인할 항목 |

## 후순위 확장

| 확장 | 후순위 이유 |
| --- | --- |
| 전체 data contract viewer | 실제 API/schema 확정 후 효과가 큼 |
| 권한 matrix | 금액/메모/배차 담당자 권한 정책 미정 |
| QA scenario runner | 테스트 자동화 구조 확정 후 |
| API dependency map | 기존 프로젝트 API 분석 후 |
| 정책 미결정 관리 화면 | 운영 정책 workflow가 필요해질 때 |

## 3-pane 구성

```text
┌────────────────────┬────────────────────────────────────┬────────────────────────────┐
│ Left               │ Center                             │ Right                      │
│ Flow / screen map  │ Screen state / section preview      │ Detail / contract / QA     │
├────────────────────┼────────────────────────────────────┼────────────────────────────┤
│ 신규 접수          │ 선택한 단계의 master 상태           │ 기능 설명                  │
│ - 화주 정보        │ section wireframe                   │ data contract              │
│ - 상차지           │ publishing 기준 화면                │ validation rule            │
│ - 하차지           │ state transition                    │ API/권한/정책 메모         │
│ - 운송+품목        │ related dialog preview              │ QA/AC 링크                 │
│ - 금액             │                                    │ 기존 프로젝트 체크리스트   │
└────────────────────┴────────────────────────────────────┴────────────────────────────┘
```

## 정보 구조

| Hub 개체 | 설명 | 예시 |
| --- | --- | --- |
| `screenNode` | 화면/상태/섹션 단위 탐색 노드 | `new-order.amount` |
| `flow` | 사용자의 업무 단계 묶음 | `new-order-registration` |
| `section` | UI section | `transport-route`, `reservation-area-tabs` |
| `component` | button, dialog, tab, chip 등 | `main-submit-button` |
| `state` | flow or UI 상태 | `new-submitted` |
| `contract` | data model/field/API 연결 | `PricingAdjustment` |
| `qa` | acceptance criteria 또는 수동 QA | `AC-D4` |
| `source` | 원문 문서 링크 | `source-snapshot/sections/...` |

## 왼쪽 Pane

| 그룹 | 노드 |
| --- | --- |
| 신규 접수 | 시작, 화주, 상차지, 하차지, 운송+품목, 금액, 차주 선택, 메인 적용, 최종 등록 |
| 수정/조회 | 목록 행 선택, 개별 수정, 화물수정, 취소/배차취소 |
| 다이얼로그 | 주소 검색, 운송+품목 입력, 금액 입력, 차주 조회 |
| 보조 정보 | 메모, 금액 로그, 운송 구간 지도 |
| Header | 상태 chip, 거리/기준금액, 배차 담당자, 라벨 토글 |

## 가운데 Pane

| 상태 | 표시 |
| --- | --- |
| master preview | `cargo-order-admin-hifi-master.html` 기준 화면 설명 |
| state snapshot | 해당 단계에서 보이는 섹션/다이얼로그 상태 |
| section map | 관련 섹션 wireframe 또는 위치 설명 |
| publishing rule | master에서 확인할 조작 경로 |

현재 단계에서는 screenshot asset을 새로 만들지 않습니다. 후속 hub 구현 시 필요하면 master HTML을 브라우저로 열어 상태별 preview 이미지를 생성합니다.

## 오른쪽 Pane

| 블록 | 내용 |
| --- | --- |
| 기능 설명 | 선택한 node의 목적과 사용자 영향 |
| Data contract | 관련 모델/필드 |
| Validation | 필수/조건부 규칙 |
| API | endpoint 확정/보류, payload 기준 |
| 권한/정책 | role, 마스킹, 정산 후 수정 등 |
| QA | AC ID, 수동 확인 방법 |
| Source | 원문 문서 링크 |
| Handoff | 기존 프로젝트에서 찾아야 할 component/API/store |

## 주요 노드 설계

| Node ID | Label | 핵심 연결 |
| --- | --- | --- |
| `new-order.start` | 신규 접수 시작 | `new-reset`, `AC-A*`, reset 범위 |
| `new-order.shipper` | 화주 정보 | `Requester`, 메모 mock trigger |
| `new-order.load-address` | 상차지 | `Location`, 주소 최근, 지도 |
| `new-order.unload-address` | 하차지 | `Location`, 주소 최근, 지도 |
| `new-order.cargo-item` | 운송+품목 | `VehicleRequirement`, `CargoDetail`, 최근 조합 |
| `new-order.amount` | 금액 | `Pricing`, `PricingAdjustment`, 금액 로그 |
| `new-order.driver` | 차주 정보 선택 | `DriverAssignment`, optional |
| `new-order.pre-api-submit` | 메인 적용 후 최종 등록 | `new-submitted`, idempotency |
| `aside.memo` | 보조 정보 메모 | `CargoMemo`, 권한 |
| `aside.amount-log` | 금액 로그 | 조정금, 정산 후 수정 |
| `aside.route-map` | 운송 구간 지도 | `RoutePreview`, provider |
| `dialog.address-recent` | 주소 최근 | `RecentLocation`, 마스킹 |
| `dialog.cargo-recent` | 운송+품목 최근 | `RecentCargoCombo`, 중복 제거 |
| `header.dispatch-manager` | 배차 담당자 | `DispatchManager`, 변경 UX 보류 |

## 데이터 파일

| 파일 | 역할 |
| --- | --- |
| `data/final-baseline.json` | 최종 기준 데이터 취합본. state, section, data contract, validation, API, policy, QA |
| `visual-handoff-hub/data/hub-map.json` | flow, screen node, pane 표시용 초안 |
| `visual-handoff-hub/data/source-links.json` | node와 원문 source 연결 |
| `visual-handoff-hub/data/qa-map.json` | node와 AC/QA 연결 |

## 후속 `index.html` 구현 기준

실제 hub를 만들 때는 아래 조건을 만족해야 합니다.

1. 첫 화면은 landing page가 아니라 바로 3-pane explorer입니다.
2. 기존 `.md` 문서 원문은 링크로 연결하고, 긴 내용을 hub에 중복 복제하지 않습니다.
3. 공통 최종 기준 데이터는 `data/final-baseline.json`에서 읽고, node별 화면 탐색은 `visual-handoff-hub/data/hub-map.json`을 사용합니다.
4. 왼쪽 node를 선택하면 가운데 preview와 오른쪽 detail이 동시에 바뀝니다.
5. node별로 source, QA, data, policy, risk가 한눈에 보여야 합니다.
6. `cargo-order-admin-hifi-master.html`을 iframe으로 직접 끼우는 방식은 성능과 22MB 용량 때문에 기본값으로 삼지 않습니다. 필요 시 별도 열기 링크 또는 state preview 이미지로 연결합니다.

## 완료 기준

| 항목 | 기준 |
| --- | --- |
| IA | flow, section, component, state를 분리 |
| Source 연결 | 모든 MVP node가 원문 source를 최소 1개 이상 가짐 |
| QA 연결 | 주요 flow node가 AC 또는 검증 항목을 가짐 |
| 구현 인계 | node별 기존 프로젝트 확인 항목이 있음 |
| 확장성 | 권한/API/QA runner는 후순위 확장으로 분리 |
