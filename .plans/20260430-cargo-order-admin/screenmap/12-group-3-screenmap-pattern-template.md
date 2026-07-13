# 그룹 3 Screenmap 기준 템플릿

## 목적

이 문서는 `그룹 3. 필수 입력 진행`에서 검증된 screenmap 표현 방식을 이후 그룹 확장의 기준 템플릿으로 확정합니다.

여기서 말하는 템플릿은 화면을 새로 만드는 설계가 아니라, 왼쪽 user flow, 가운데 live master preview, 오른쪽 detail panel이 같은 기준으로 움직이게 하는 운영 규칙입니다.

## 확정 기준

| 영역 | 기준 | 그룹 3에서 확인된 동작 |
| --- | --- | --- |
| 왼쪽 user flow | 과밀한 그룹은 실행 단위 node로 세분화 | `3-1`부터 `3-5`까지 분리 |
| 가운데 preview | 현재 node에 필요한 part marker만 표시 | node당 5~6개 marker 유지 |
| master 상태 | node의 part 1에 맞는 wizard step을 직접 open | `load`, `unload`, `cargo`, `money` dialog 직접 표시 |
| part 이동 | 같은 node 안에서는 iframe을 재생성하지 않음 | 열린 dialog 유지, marker/detail만 갱신 |
| live anchor | master DOM anchor 우선 사용 | dialog가 없으면 marker/focus를 숨김 |
| 오른쪽 detail | part별 기능, contract, validation, QA를 갱신 | 조회, 선택, preview, 적용 책임 분리 |

## Node 분할 템플릿

하나의 그룹 안에서 marker가 많아지면 아래 기준으로 왼쪽 node를 나눕니다.

| 판단 기준 | 분할 여부 |
| --- | --- |
| marker가 7개 이상 | 분할 우선 |
| 같은 화면에 dialog, field, footer button, 다음 step이 섞임 | 분할 우선 |
| data contract가 서로 다른 도메인으로 나뉨 | 분할 우선 |
| marker가 4~6개이고 한 화면에서 자연스럽게 읽힘 | 단일 node 유지 가능 |

그룹 3 적용 예시:

| Node | 범위 | Part 구성 |
| --- | --- | --- |
| `new-order.group-required-shipper` | 화주 정보 | 조회, 결과 선택, 선택 정보, 담당자 추가, 적용, 다음 step |
| `new-order.group-required-load` | 상차지 | 주소 조회, 결과 선택, 선택 정보, 조건, 적용, 다음 step |
| `new-order.group-required-unload` | 하차지 | 주소 조회, 결과 선택, 선택 정보, 조건, 적용, 다음 step |
| `new-order.group-required-cargo` | 운송+품목 | 차량 조건, 수량/중량, 품목, 최근 조합, 적용, 다음 step |
| `new-order.group-required-money` | 금액 | 결제방법, 비용, 수수료/조정, 적용, 완료 분기 |

## 가운데 Preview 템플릿

중앙 preview는 “현재 node를 이해하는 데 필요한 것만” 보여줍니다.

| 규칙 | 적용 |
| --- | --- |
| marker 수 | 기본 5~6개 안에 유지 |
| marker 배치 | `07-marker-placement-standard.md`의 `markerKind`와 `liveMarkerPlacement` 우선 |
| live anchor 우선 | bridge가 보낸 DOM rect를 기준으로 marker와 focus 배치 |
| pending 처리 | wizard/dialog part는 anchor가 없으면 fallback marker를 보여주지 않음 |
| no-scroll | 기본 `screenmap=1`에서는 iframe 내부 scroll 금지 |
| fallback | live master 실패 시에만 fallback marker 또는 screenshot 기준 사용 |

## Bridge 상태 준비 템플릿

동적 화면은 “이전 이벤트를 모두 재생”하지 않고, 필요한 화면 상태를 직접 준비합니다.

| 상태 | 기준 |
| --- | --- |
| node 초기 진입 | part 1이 속한 dialog 또는 step을 바로 연다 |
| 같은 node의 part 선택 | 기존 iframe과 dialog를 유지한다 |
| 다른 node 선택 | 새 node의 part 1 상태로 iframe을 준비한다 |
| 다음 step marker | 적용 버튼 이후 실제 전환 결과를 설명하는 part로 둔다 |
| 완료 상태 | 완료 panel이 필요한 경우 해당 완료 상태까지 진행시킨다 |

그룹 3 적용 mapping:

| Node | 초기 step |
| --- | --- |
| `new-order.group-required-shipper` | `shipper` |
| `new-order.group-required-load` | `load` |
| `new-order.group-required-unload` | `unload` |
| `new-order.group-required-cargo` | `cargo` |
| `new-order.group-required-money` | `money` |

## 오른쪽 Detail 템플릿

오른쪽 panel은 part가 “무엇을 바꾸는지”와 “어떤 데이터 책임을 가지는지”를 중심으로 설명합니다.

| 설명 묶음 | 기준 |
| --- | --- |
| 기능 설명 | 화면에서 사용자가 보는 행동을 먼저 설명 |
| data contract | 실제 API 항목이 아니라 화면 draft에 들어가는 도메인 책임만 표시 |
| validation | 필수값, 선택 상태, 적용 가능 조건을 표시 |
| API 보류 | 실제 endpoint, 저장 방식, 권한은 backlog로 분리 |
| QA | 해당 part에서 확인해야 할 수동 QA point 연결 |
| checklist | 구현자가 놓치기 쉬운 UI 상태를 짧게 표시 |

## 그룹 4~7 확장 기준

그룹 4~7은 먼저 단일 node로 설계하되, 아래 조건이 보이면 그룹 3 템플릿을 적용합니다.

| 조건 | 적용 방식 |
| --- | --- |
| marker 과밀 | 왼쪽 user flow를 하위 node로 나눈다 |
| dialog 상태 필요 | bridge에 직접 open 준비 함수를 둔다 |
| 같은 dialog 안 part 이동 | iframe 재생성을 막고 `screenmap.select-part`만 보낸다 |
| 완료 후 분기 panel | 완료 상태 자체를 하나의 part로 둔다 |
| 실제 API 설명이 섞임 | API는 backlog/보류로 분리하고 화면 contract만 남긴다 |

## Acceptance Criteria

| 항목 | 기준 |
| --- | --- |
| 기준 문서 | 그룹 3 확장 판단은 이 문서와 `07-marker-placement-standard.md`를 함께 따른다 |
| 초기 상태 | 세분화 node의 첫 part는 필요한 dialog나 step이 열린 상태로 시작한다 |
| part 이동 | 같은 node 안 part 선택으로 dialog가 닫혔다 다시 열리지 않는다 |
| marker 안정성 | 닫힌 dialog 위에 잘못된 fallback marker를 표시하지 않는다 |
| 문서 일관성 | `08`, `09`, `10`, `11` 문서는 이 템플릿을 세부 기준으로 참조한다 |
