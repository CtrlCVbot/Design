# Marker Placement Standard

## 목적

이 문서는 `screenmap`의 live marker와 fallback marker 배치 기준을 표준화합니다.

그룹 3~7은 wizard step, 섹션, 버튼, 상태 badge가 섞여 있으므로 marker를 매번 감으로 배치하면 번호가 버튼이나 텍스트를 가리는 문제가 반복됩니다. 따라서 part마다 `markerKind`를 먼저 정하고, 그 유형에 맞는 기본 placement와 `focusRect` 범위를 적용합니다.

## 적용 범위

| 구분 | 포함 |
| --- | --- |
| 대상 | `screenmap/app.js`의 `centerPreviewMaps.*.parts[]` |
| live 기준 | `tools/inject-screenmap-bridge.mjs`에서 수집한 anchor rect |
| fallback 기준 | part의 `marker`, `focusRect`, `liveMarkerPlacement` |
| 우선 적용 그룹 | 그룹 1, 그룹 2, 이후 그룹 3~7 |

## Part Data 계약

| 필드 | 필수 | 역할 |
| --- | --- | --- |
| `markerKind` | 권장 | target 유형을 나타내는 표준 분류 |
| `liveMarkerPlacement` | 선택 | live marker 위치를 강제로 지정 |
| `marker` | 필수 | live anchor 실패 시 fallback marker 중심 좌표 |
| `focusRect` | 권장 | 선택 part의 강조 범위 |
| `targetZone` | 필수 | 오른쪽 detail과 QA에서 읽는 기능 영역 이름 |

`markerKind`는 현재 화면 동작을 바꾸지 않는 메타데이터입니다. 실제 marker 위치는 기존처럼 `liveMarkerPlacement`, button 자동 callout, fallback 좌표 순서로 결정합니다.

## Marker Kind

| `markerKind` | 대상 예시 | 기본 placement | `focusRect` 기준 | 주의점 |
| --- | --- | --- | --- | --- |
| `action-button` | `신규 접수`, `화주 정보 입력`, footer CTA | `above` 또는 `left` | 버튼 자체보다 약간 넓게 | marker가 버튼 label이나 클릭 영역을 덮지 않게 함 |
| `form-section` | 화주 정보, 상차지, 하차지, 화물 정보, 금액 섹션 | `center` | 섹션 전체 또는 입력 cluster | 넓은 섹션은 marker를 제목 가까이에 두고 `focusRect`로 범위를 설명 |
| `section-header` | 번호형 섹션 헤더, 단계 헤더 | `right` 또는 `left` | 헤더 줄 전체 | 번호 marker가 섹션 번호와 겹치지 않게 함 |
| `status-badge` | `new-reset`, `new-wizard-active`, current step badge | `right` 또는 `above` | badge 또는 상태 row | 작은 badge 중앙에 marker를 올리지 않음 |
| `dialog-surface` | wizard dialog, lookup dialog | `center` | dialog 전체 | dialog 내부 버튼보다 overlay 전체 상태를 설명할 때 사용 |
| `process-panel` | wizard 왼쪽 process panel | `right` | panel 전체 | panel label과 step 번호를 가리지 않게 오른쪽으로 뺌 |
| `step-item` | wizard current step row | `right` | 해당 step item | 현재 step의 번호/라벨을 가리지 않게 함 |
| `state-surface` | 화면 전체 상태 전환, reset 적용 범위 | `center` | main form 또는 상태가 바뀌는 주요 영역 | 범위가 넓으므로 marker보다 `focusRect`가 설명의 중심 |
| `search-control` | 주소, 화주, 담당자 조회 입력 | `above` | 검색 입력과 조회 source row | 입력 label과 버튼을 덮지 않게 위쪽으로 뺌 |
| `result-row` | 조회 결과 row, 최근 조합 row | `left` 또는 `right` | 선택 가능한 row 묶음 | row 텍스트 위에 marker를 올리지 않음 |
| `detail-panel` | 선택 정보 preview panel | `right` | preview card 또는 aside panel | 데이터 확인 영역과 action 영역을 분리 |
| `condition-panel` | 일시, 방법, 상세 조건 묶음 | `right` | 조건 입력 cluster | 주소 본문과 조건 책임을 분리 |
| `input-group` | 톤수, 차종, 수량 같은 입력 묶음 | `above` 또는 `right` | 관련 field group | field label 중앙 배치 금지 |
| `input-field` | 품목, 결제방법 같은 단일 입력 | `above` | 단일 field와 label | 입력값을 가리지 않음 |
| `money-group` | 청구/운송 비용, 수수료, 조정 금액 | `left` 또는 `right` | 금액 field 묶음 | 숫자 입력값과 단위 표시를 덮지 않음 |

## Placement 결정 순서

| 순서 | 기준 | 설명 |
| ---: | --- | --- |
| 1 | `part.liveMarkerPlacement` | part가 명시한 placement를 최우선 적용 |
| 2 | bridge target metadata | target이 button 또는 `role="button"`이면 자동 callout 적용 |
| 3 | `markerKind` 표준 | 신규 part 설계 시 기본 placement를 선택하는 기준 |
| 4 | fallback marker | live anchor가 없으면 `part.marker`와 `center` 기준 사용 |

현재 구현에서 `markerKind`는 3번 설계 기준으로 쓰며, 런타임 자동 분기는 아직 하지 않습니다. 그룹 3~7에서 반복 패턴이 안정되면 `markerKind` 기반 자동 placement를 도입할 수 있습니다.

## 유형별 세부 규칙

### `action-button`

| 규칙 | 기준 |
| --- | --- |
| 기본 placement | 좌측/우측 여유가 있으면 `left` 또는 `right`, 하단 고정 버튼은 `above` |
| 금지 | 버튼 중앙 `center` placement |
| focus | 버튼 rect보다 4~8px 넓은 범위 |
| 예시 | `group-init.click-new`, `group-wizard-entry.shipper-cta` |

### `form-section`

| 규칙 | 기준 |
| --- | --- |
| 기본 placement | `center` |
| focus | 섹션 전체 또는 현재 입력 cluster |
| 예외 | 섹션 헤더만 설명하면 `section-header`로 분류 |
| 예시 | reset 이후 main form, 운송+품목 입력 섹션 |

### `section-header`

| 규칙 | 기준 |
| --- | --- |
| 기본 placement | `left` 또는 `right` |
| focus | 헤더 row 전체 |
| 금지 | 번호 marker가 실제 섹션 번호 위를 덮는 배치 |
| 예시 | `group-init.section-headers` |

### `status-badge`

| 규칙 | 기준 |
| --- | --- |
| 기본 placement | `right` |
| focus | badge 또는 상태 row |
| 금지 | 작은 badge 중앙에 marker를 올리는 배치 |
| 예시 | `group-init.state-new-reset` |

### `dialog-surface`

| 규칙 | 기준 |
| --- | --- |
| 기본 placement | `center` |
| focus | dialog 전체 |
| 예외 | dialog 내부 panel 또는 step을 설명하면 각각 `process-panel`, `step-item`으로 분리 |
| 예시 | `group-wizard-entry.dialog-open` |

### `process-panel`

| 규칙 | 기준 |
| --- | --- |
| 기본 placement | `right` |
| focus | process panel 전체 |
| 금지 | panel 제목이나 step number 위를 marker가 덮는 배치 |
| 예시 | `group-wizard-entry.process-panel` |

### `step-item`

| 규칙 | 기준 |
| --- | --- |
| 기본 placement | `right` |
| focus | current step item |
| 금지 | step number 또는 label 중앙 배치 |
| 예시 | `group-wizard-entry.state-active` |

### 조회/입력 컴포넌트

| `markerKind` | 기본 placement | 적용 기준 |
| --- | --- | --- |
| `search-control` | `above` | 조회 source, 검색 입력, lookup control을 함께 설명 |
| `result-row` | `left` 또는 `right` | row 선택과 적용 버튼 책임을 분리 |
| `detail-panel` | `right` | 선택 결과 preview나 담당자 정보 확인 |
| `condition-panel` | `right` | 일시, 방법, 주소록 저장 같은 부가 조건 |
| `input-group` | `above` 또는 `right` | 서로 연결된 여러 입력 field |
| `input-field` | `above` | 단일 field나 select |
| `money-group` | `left` 또는 `right` | 금액 입력 묶음과 계산 책임 설명 |

그룹 3에서 위 유형을 기준 템플릿으로 확정했습니다. 이후 그룹 4~7에서도 조회, 선택, preview, 조건, 적용이 함께 등장하면 같은 분류를 먼저 사용합니다.

## 현재 그룹 적용표

| Group | Part | `markerKind` | Placement |
| --- | --- | --- | --- |
| 그룹 1 | `group-init.click-new` | `action-button` | `above` |
| 그룹 1 | `group-init.reset-fields` | `state-surface` | `center` |
| 그룹 1 | `group-init.state-new-reset` | `status-badge` | `center`, 후속 개선 시 `right` 검토 |
| 그룹 1 | `group-init.section-headers` | `section-header` | `center`, 후속 개선 시 `left` 검토 |
| 그룹 1 | `group-init.shipper-focus` | `action-button` | `left` |
| 그룹 2 | `group-wizard-entry.shipper-cta` | `action-button` | `left` |
| 그룹 2 | `group-wizard-entry.dialog-open` | `dialog-surface` | `center` |
| 그룹 2 | `group-wizard-entry.process-panel` | `process-panel` | `right` |
| 그룹 2 | `group-wizard-entry.state-active` | `step-item` | `right` |
| 그룹 3 | `*-search`, `*-address-search` | `search-control` | `above` |
| 그룹 3 | `*-result-select`, `*-recent-combo` | `result-row` | `left` 또는 `right` |
| 그룹 3 | `*-selected-preview` | `detail-panel` | `right` |
| 그룹 3 | `*-condition` | `condition-panel` | `right` |
| 그룹 3 | `cargo-*`, `money-*` 입력 묶음 | `input-group`, `input-field`, `money-group` | `above`, `right`, `left` |
| 그룹 3 | `*-complete` | `action-button` | `above` |
| 그룹 3 | `*-step` | `step-item` | `right` |
| 그룹 4 | `required-complete-panel` | `dialog-surface` | `center` |
| 그룹 4 | `api-boundary-note` | `detail-panel` | `right` |
| 그룹 4 | `go-driver`, `apply-to-main` | `action-button` | `above` |
| 그룹 5 | `driver-step-panel` | `dialog-surface` | `center` |
| 그룹 5 | `driver-search-entry` | `search-control` | `above` |
| 그룹 5 | `hwamulman-option` | `status-badge` | `right` |
| 그룹 5 | `driver-result-preview` | `detail-panel` | `right` |
| 그룹 5 | `skip-driver`, `apply-driver` | `action-button` | `above` |

그룹 1의 `state-new-reset`, `section-headers`는 현재 fallback 좌표와 live 동작을 유지합니다. 다음 화면 품질 개선 때 표준 placement로 조정할 후보입니다.

## 그룹 3 기준 템플릿

그룹 3에서 검증된 세분화, 상태 준비, pending-live 기준은 `12-group-3-screenmap-pattern-template.md`를 따른다.

| 기준 | 적용 |
| --- | --- |
| 왼쪽 node | `3-1`부터 `3-5`까지 입력 단위로 분리 |
| 중앙 marker | node당 5~6개 marker 유지 |
| 초기 상태 | 각 node의 part 1 wizard step dialog를 직접 open |
| 같은 node part 이동 | iframe을 재생성하지 않고 marker/detail만 갱신 |
| anchor 없음 | wizard/dialog part는 fallback marker 대신 `pending-live` 처리 |

## 그룹 4~7 적용 원칙

| 그룹 | 예상 주요 `markerKind` |
| --- | --- |
| 그룹 4. 금액 완료 후 분기 | `form-section`, `action-button`, `status-badge` |
| 그룹 5. 차주 정보 선택 | `dialog-surface`, `search-control`, `status-badge`, `detail-panel`, `action-button` |
| 그룹 6. 메인 화면 적용 | `state-surface`, `form-section`, `status-badge` |
| 그룹 7. 신규 접수 취소 | `action-button`, `dialog-surface`, `state-surface` |

그룹 4는 `13-group-4-amount-branch-plan.md` 기준으로 단일 node를 유지합니다. marker가 4개라 세분화하지 않고, 실제 API 항목은 그룹 4 detail에 연결하지 않습니다.

그룹 5는 `14-group-5-driver-choice-plan.md` 기준으로 단일 node를 유지합니다. marker가 6개로 유지 가능하고 같은 `new-driver-optional` step 안에서 설명할 수 있으므로, 차주 선택/건너뛰기를 하위 node로 나누지 않습니다. 화물맨 연동 UI는 `status-badge` 또는 작은 action 영역으로 표시하되 실제 API 호출 항목은 marker detail에 연결하지 않습니다.

## Acceptance Criteria

| 항목 | 기준 |
| --- | --- |
| part 분류 | 신규 live part는 `markerKind`를 가진다 |
| 버튼 보호 | `action-button`은 marker가 버튼 label과 클릭 영역을 덮지 않는다 |
| 범위 설명 | 넓은 영역은 marker 하나로 설명하지 않고 `focusRect`를 함께 가진다 |
| 상태 표시 | 작은 상태 badge나 step item은 marker를 오른쪽 또는 위쪽으로 뺀다 |
| fallback 유지 | live anchor 실패 시에도 기존 `marker`와 `focusRect`로 이해 가능한 화면을 유지한다 |

## 다음 작업

1. 그룹 4~7 설계 시 그룹 3 템플릿을 먼저 적용할지 판단합니다.
2. anchor selector를 정하기 전에 `markerKind`, `targetZone`, `focusRect`를 함께 작성합니다.
3. 반복적으로 안정된 유형은 `app.js`의 marker 계산에서 `markerKind` 기반 자동 placement로 승격할지 검토합니다.
