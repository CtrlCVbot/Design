# 그룹 3 필수 입력 진행 세분화 기획

## 배경

기존 `그룹 3. 필수 입력 진행`은 `화주 -> 상차지 -> 하차지 -> 운송+품목 -> 금액 -> new-required-complete` 전체를 하나의 중앙 preview에서 보여주었습니다.

이 방식은 실제 흐름을 한 번에 볼 수 있다는 장점이 있지만, marker가 10개까지 늘어나 중앙 화면에서 버튼, step, 상태 panel이 서로 겹쳐 보입니다. Screen Map의 목적은 구현자가 “지금 봐야 할 화면 영역”을 빠르게 찾는 것이므로, 그룹 3은 왼쪽 user flow에서 더 작은 실행 단위로 쪼개는 편이 적합합니다.

## 결정

왼쪽 user flow에서는 기존 `그룹 3`을 숨겨진 원본 그룹으로 남기고, 실제 탐색 node는 아래 5개로 나눕니다.

| Node | 범위 | 중앙 preview marker | 오른쪽 설명 초점 |
| --- | --- | --- | --- |
| `new-order.group-required-shipper` | 화주 정보 | 조회, 결과 선택, 선택 정보 preview, 담당자 추가, 적용, 상차지 단계 표시 | `Requester`, `ContactPerson`, 다음 step 전환 |
| `new-order.group-required-load` | 상차지 | 조회, 결과 선택, 선택 정보 preview, 일시/방법 조건, 적용, 하차지 단계 표시 | `Location(load)`, `HandlingCondition(load)`, 최근 주소 |
| `new-order.group-required-unload` | 하차지 | 조회, 결과 선택, 선택 정보 preview, 일시/방법 조건, 적용, 운송+품목 단계 표시 | `Location(unload)`, `HandlingCondition(unload)`, route preview |
| `new-order.group-required-cargo` | 운송+품목 | 차량 조건, 대수/실중량, 품목, 최근 조합, 적용, 금액 단계 표시 | `VehicleRequirement`, `CargoDetail`, `RecentCargoCombo` |
| `new-order.group-required-money` | 금액 | 결제방법, 청구/운송 비용, 수수료/조정 금액, 금액 적용, `new-required-complete` | `Pricing`, `PricingAdjustment`, 다음 행동 분기 |

## 중앙 Preview 정책

각 세부 node는 기본적으로 marker를 5~6개 안에 유지합니다.

- 주소 단계는 조회, 결과 row, 선택 정보 preview, 일시/방법 조건, 완료, 다음 단계 표시로 나눕니다.
- 운송+품목 단계는 차량 조건, 대수/실중량, 품목, 최근 조합, 완료, 다음 단계 표시로 나눕니다.
- 금액 단계는 결제방법, 청구/운송 비용, 수수료/조정 금액, 완료, `new-required-complete` panel로 나눕니다.
- “완료” marker는 footer 또는 action button을 설명합니다.
- 같은 영역 안에서 marker가 가까이 붙는 경우에는 `left`, `right`, `above` callout으로 빼서 번호가 겹치지 않게 합니다.

`3-1 화주 정보`는 `10-group-3-1-shipper-contact-components-plan.md`, `3-2`부터 `3-5`는 `11-group-3-2-to-3-5-required-components-plan.md`를 상세 기준으로 사용합니다.

이 정책은 화면 전체를 줄이는 것이 아니라, 같은 `master.html?screenmap=1` live 화면에서 필요한 anchor만 필터링하는 방식입니다.

그룹 3에서 검증된 왼쪽 node, 가운데 live preview, bridge 상태 준비, 오른쪽 detail 기준은 `12-group-3-screenmap-pattern-template.md`를 기준 템플릿으로 확정합니다. 그룹 4~7 확장 시에도 marker 과밀이나 dialog 상태 준비가 필요하면 이 문서를 먼저 적용합니다.

## Bridge 정책

기존 part id는 유지합니다.

예: `group-required-inputs.load-complete`, `group-required-inputs.money-complete`

대신 iframe query의 `group` 값은 새 node id를 사용합니다.

예: `master.html?screenmap=1&group=new-order.group-required-load`

bridge는 새 node id들을 모두 “필수 입력 그룹”으로 인식하고, 기존 `prepareGroupRequiredInputs(partId, callback)` 경로로 상태를 준비합니다. 이렇게 하면 `master.html`의 실제 구조나 anchor map을 중복 작성하지 않아도 됩니다.

현재 구현은 `3-2`부터 `3-5`의 node 초기 진입에서 앞 단계 적용 이벤트를 순차 실행하지 않고, 해당 node의 part 1에 맞는 wizard step dialog를 직접 엽니다. 같은 node 안에서 part를 이동할 때는 iframe을 다시 만들지 않고 `screenmap.select-part` message만 보내 열린 dialog를 유지합니다.

## Acceptance Criteria

| 항목 | 기준 |
| --- | --- |
| 왼쪽 user flow | `그룹 3-1`부터 `그룹 3-5`까지 독립 node로 표시된다 |
| 중앙 marker 밀도 | 세부 node는 5~6개 marker 안에 유지하고, 주소/필드 컴포넌트가 서로 겹치지 않게 placement를 조정한다 |
| 오른쪽 panel | 세부 node별 data contract, validation, QA가 해당 입력 단위에 맞게 바뀐다 |
| legacy hash | `#new-order.group-required-inputs`로 열어도 `#new-order.group-required-shipper`에 해당하는 화면을 보여준다 |
| source link | 세부 node에서 `../wireframes/final-handoff` 기준 문서와 이 split plan을 열 수 있다 |
| bridge | 새 group id에서도 live anchor 위치가 수집된다 |

## 구현 반영

| 영역 | 반영 내용 |
| --- | --- |
| `app.js` flow | 신규 접수 flow에서 기존 그룹 3 전체 node를 5개 세부 node로 대체 |
| `app.js` preview | 기존 그룹 3 preview map의 part를 세부 node별로 slicing |
| `app.js` right panel | 세부 node별 summary, data contract, validation, checklist, QA 연결 |
| `tools/inject-screenmap-bridge.mjs` | 새 group id와 세부 part id를 필수 입력 그룹으로 허용 |
| `master.html` | bridge layer 재삽입으로 새 group id 준비 로직 반영 |

## 후속 확장

그룹 4~7도 marker가 과밀해질 경우 같은 규칙을 적용합니다. 단, 먼저 하나의 그룹에 marker가 4개 이상이 되는지 확인하고, 실제로 화면 이해를 방해할 때만 세분화합니다.
