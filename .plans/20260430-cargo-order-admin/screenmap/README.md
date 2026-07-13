# Screen Map / Visual Handoff Hub MVP

## 목적

이 폴더는 `wireframes/final-handoff` 패키지를 기준으로 만든 정적 HTML 기반 Screen Map입니다.

여러 `.md` 원문을 대체하지 않고, 구현자가 화면 node별로 다음 정보를 빠르게 연결해 보는 탐색기 역할을 합니다.

- user flow / screen map node
- 선택 node의 화면 상태 preview
- master HTML 진입 링크
- 기능 설명, data contract, validation, API 보류, QA, checklist
- 원문 source link

## 파일

| 파일 | 역할 |
| --- | --- |
| `index.html` | 3-pane explorer shell |
| `styles.css` | 반응형 3-pane 레이아웃과 overflow 방지 스타일 |
| `app.js` | embedded hub data, node/part 선택, live marker placement, source/QA/backlog 렌더링 |
| `assets/master-new-order-base.png` | 그룹 1 live master 실패 시 사용하는 fallback 캡처 기준 이미지 |
| `tools/inject-screenmap-bridge.mjs` | `master.html`에 `SCREENMAP_BRIDGE_LAYER`를 반복 가능하게 삽입 |
| `README.md` | 사용법과 검증 기준 |

## 기획 문서

| 파일 | 역할 |
| --- | --- |
| `01-user-flow-new-order-events.md` | 신규 접수 이벤트 그룹 1~7과 화물 수정 흐름 기획 |
| `02-center-preview-options.md` | 가운데 pane 표현 방식 비교와 그룹 1 live master hotspot 확정안 |
| `03-live-master-screenmap-mode-plan.md` | screenshot 리스크 해소를 위한 live master / screenmap mode 전환 기획 |
| `04-master-screenmap-bridge-design.md` | `master.html?screenmap=1` bridge script 상세 설계 |
| `05-master-html-edit-point-inspection.md` | `master.html` 구조와 bridge script 삽입 지점 조사 |
| `06-group-2-wizard-entry-anchor-plan.md` | 그룹 2 Wizard 진입 live anchor map과 준비 상태 설계 |
| `07-marker-placement-standard.md` | 그룹 3~7 확장 전 marker kind, placement, focusRect 표준 |
| `08-group-3-required-inputs-marker-plan.md` | 그룹 3 필수 입력 진행의 part별 markerKind, targetZone, focusRect 설계 |
| `09-group-3-required-inputs-split-plan.md` | 그룹 3을 화주, 상차지, 하차지, 운송+품목, 금액 node로 세분화한 기획 |
| `10-group-3-1-shipper-contact-components-plan.md` | 그룹 3-1 화주 정보의 조회, 결과 선택, 선택 정보 preview, 담당자 추가 등록 컴포넌트 기획 |
| `11-group-3-2-to-3-5-required-components-plan.md` | 그룹 3-2~3-5의 주소 lookup, 운송+품목 field, 금액 field 컴포넌트 세분화 기획 |
| `12-group-3-screenmap-pattern-template.md` | 그룹 3에서 검증된 왼쪽 node, 가운데 live preview, bridge 상태 준비, 오른쪽 detail 기준 템플릿 |
| `13-group-4-amount-branch-plan.md` | 그룹 4 금액 완료 후 분기의 단일 node, 4개 marker, API boundary 설계 |
| `14-group-5-driver-choice-plan.md` | 그룹 5 차주 정보 선택의 단일 node, 6개 marker, 선택/건너뛰기, 화물맨 배차 결과 박스 설계 |
| `15-group-6-main-apply-plan.md` | 그룹 6 메인 화면 적용의 단일 node, 6개 marker, pre-API CTA boundary 설계 |
| `16-edit-order-section-edit-flow-plan.md` | 화물 수정 7개 확장 node, 섹션별 수정 가능 항목 inventory, 항목별 수정 flow matrix 설계 |
| `17-edit-order-shipper-edit-marker-plan.md` | 화물 수정 `화주 항목 수정` node의 7개 part marker, dialog, inline edit 설계 |
| `18-edit-order-route-edit-marker-plan.md` | 화물 수정 `운송 구간 수정` node의 6개 part marker, 상차/하차 주소 dialog, inline edit, 재계산 확인 설계 |
| `19-edit-order-cargo-money-edit-marker-plan.md` | 화물 수정 `운송+품목/금액 수정` node의 7개 part marker, 운송+품목 dialog, 금액 dialog, 계산값 readonly 설계 |
| `20-edit-order-driver-edit-marker-plan.md` | 화물 수정 `차주 정보 수정` node의 9개 part marker, 차주/차량 dialog, 내부 DB/화물맨 결과, 연락처/톤수/차종 inline 보정 설계 |
| `21-edit-order-apply-review-marker-plan.md` | 화물 수정 `수정값 반영 확인` node의 5개 part marker, 변경 feedback, 수정 row 반영, 최종 CTA, 취소 경계, 목록 갱신 보류 설계 |

## 기준 경로

`screenmap` 기준 상대 경로는 아래만 사용합니다.

| 대상 | 경로 |
| --- | --- |
| final handoff root | `../wireframes/final-handoff` |
| master HTML | `../wireframes/final-handoff/baseline/html/cargo-order-admin-hifi-master.html` |

이전 active root 경로에는 의존하지 않습니다.

## Bridge Layer

`master.html?screenmap=1`에서는 `SCREENMAP_BRIDGE_LAYER`가 실행되어 iframe 내부 anchor 위치와 target metadata를 `screenmap.anchor-rects` message로 보냅니다. 부모 `screenmap/app.js`는 이 message를 받아 그룹별 marker를 live DOM 좌표로 갱신합니다.

layer를 다시 삽입하거나 갱신할 때는 아래 명령을 사용합니다.

```sh
node screenmap/tools/inject-screenmap-bridge.mjs
```

현재 단계에서는 그룹 1 시작/초기화, 그룹 2 Wizard 진입, 그룹 3 필수 입력 세분화 node, 그룹 4 금액 완료 후 분기, 그룹 5 차주 정보 선택, 그룹 6 메인 화면 적용 node의 live marker sync, `core` view filter, iframe 내부 scroll 제거, 버튼형 target callout marker까지 구현되어 있습니다. bridge 좌표가 없는 part는 기본적으로 기존 fallback marker 좌표를 유지하되, 그룹 3 wizard 내부 part와 그룹 4~6 live state part는 대상 anchor가 확인되기 전까지 marker와 focus를 숨깁니다.

그룹 3의 같은 node 안에서 part marker나 part 목록을 선택할 때는 중앙 iframe을 다시 만들지 않습니다. 부모 screenmap은 active marker, part chip, 오른쪽 detail만 갱신하고 기존 master dialog에 `screenmap.select-part` message를 보내므로, 이미 열린 다이얼로그가 닫혔다 다시 열리는 반복을 줄입니다.

`그룹 3-2`부터 `그룹 3-5`의 초기 화면은 앞 단계 적용 버튼을 순차 실행하지 않고 목표 wizard step을 직접 엽니다. 따라서 `그룹 3-2`는 상차지 dialog, `그룹 3-3`은 하차지 dialog, `그룹 3-4`는 운송+품목 dialog, `그룹 3-5`는 금액 dialog가 part 1 상태로 바로 보여야 합니다.

`screenmap=1`의 기본 view는 `core`입니다. 이 view에서는 live marker 확인을 방해하는 하단 보조 섹션을 숨깁니다.

| view | URL parameter | 표시 정책 |
| --- | --- | --- |
| core | `screenmap=1` | `.list-ph`, `.ds-section.showcase` 숨김 |
| full | `screenmap=1&screenmapView=full` | master HTML 전체 표시 |

core view에서는 iframe 내부 스크롤을 만들지 않습니다. bridge가 master 문서 전체 높이를 부모 screenmap에 보내고, 부모 frame이 그 높이에 맞춰 iframe을 키운 뒤 marker와 focus 범위를 문서 전체 좌표 기준으로 배치합니다.

| option | 기본값 | 역할 |
| --- | --- | --- |
| `screenmapScroll` | off | `screenmapScroll=1`일 때만 iframe 내부 `scrollIntoView` 허용 |

## Marker Placement

live anchor가 버튼형 target이면 번호 marker를 버튼 중심에 올리지 않고 버튼 가장자리 바깥 callout으로 배치합니다.

자세한 part 유형과 placement 표준은 `07-marker-placement-standard.md`를 기준으로 합니다.

| 기준 | 동작 |
| --- | --- |
| part에 `liveMarkerPlacement` 있음 | 명시된 `above`, `below`, `left`, `right`, `center`를 우선 적용 |
| bridge target이 button 또는 `role="button"` | 화면 위치를 보고 자동 callout placement 적용 |
| bridge 좌표 없음 | 기존 fallback marker 좌표와 `center` placement 유지 |
| 그룹 3 wizard 내부 part의 bridge 좌표 없음 | 닫힌 다이얼로그 위에 잘못 보이지 않도록 `pending-live`로 숨김 |

그룹 1에서는 `신규 접수 클릭` marker가 `above`, `화주 정보 focus` marker가 `left`로 지정되어 실제 master 버튼을 가리지 않습니다. 그룹 2에서는 `화주 정보 입력 시작` marker가 `left`, process panel과 current step marker가 `right`로 지정됩니다.

그룹 3은 왼쪽 user flow에서 `그룹 3-1. 화주 정보`, `그룹 3-2. 상차지`, `그룹 3-3. 하차지`, `그룹 3-4. 운송+품목`, `그룹 3-5. 금액`으로 세분화됩니다. 각 node는 중앙 preview에 필요한 컴포넌트 marker만 보여주어 버튼, 입력 필드, 선택 정보 panel이 겹쳐 보이는 문제를 줄입니다.

단, `그룹 3-1. 화주 정보`는 화주/담당자 조회, 결과 선택, 선택 정보 preview, 담당자 추가 등록, 적용 버튼, 상차지 단계 표시까지 서로 다른 컴포넌트를 설명해야 하므로 6개 part marker를 사용합니다.

`그룹 3-2`부터 `그룹 3-5`도 주소 lookup, field group, 최근 조합, 금액 조정처럼 서로 다른 컴포넌트를 설명해야 하므로 5~6개 part marker를 사용합니다. 상세 기준은 `11-group-3-2-to-3-5-required-components-plan.md`를 따릅니다.

그룹 3에서 확인된 세분화, dialog 직접 open, 같은 node 내 iframe 유지, pending-live 처리 방식은 `12-group-3-screenmap-pattern-template.md`를 기준 템플릿으로 확정했습니다. 그룹 4~7 확장 시 marker가 과밀해지거나 dialog 상태 준비가 필요하면 이 템플릿을 먼저 적용합니다.

그룹 4는 `13-group-4-amount-branch-plan.md` 기준으로 단일 node를 유지합니다. `new-required-complete` panel, 저장 연동 전 단계 안내, `차주 정보로 이동`, `화물 등록 완료`를 4개 marker로 표현하고 실제 저장 연동 항목은 연결하지 않습니다. 중앙 preview와 bridge anchor도 이 4개 marker 기준으로 구현되어 있습니다.

그룹 5는 `14-group-5-driver-choice-plan.md` 기준으로 단일 node를 유지합니다. 차주 선택 단계, 차주/차량 조회 진입, 화물맨 배차 결과 박스, 선택 차주/차량 preview, `건너뛰기`, `차주 정보에 적용`을 6개 marker로 표현합니다. 중앙 preview와 bridge anchor도 이 6개 marker 기준으로 구현되어 있습니다. 화물맨 연동과 내부 DB 조회/등록은 화면 UI 의미만 설명하고 실제 연동 상세는 연결하지 않습니다.

그룹 6은 `15-group-6-main-apply-plan.md` 기준으로 단일 node를 유지합니다. 적용 완료 status, 섹션 헤더 숨김, 요약 반영, 차주 정보 반영, 메인 `화물 등록` CTA, 독립 수정 진입을 6개 marker로 표현합니다. 중앙 preview와 bridge anchor도 이 6개 marker 기준으로 구현되어 있습니다. 실제 저장 validation, pending, retry, server error는 그룹 6에서 클릭하지 않고 보류 항목으로만 다룹니다.

그룹 6의 live state 준비는 `ensureMainApplyReady()`로 1회 실행을 보장합니다. 초기 iframe 준비와 첫 part 이동 message가 겹쳐도 샘플 데이터 적용을 중복 실행하지 않으며, core view에서는 actionbar 아래 안전 여백을 둬 메인 `화물 등록` CTA가 frame 하단에서 잘리지 않게 합니다.

화물 수정은 `16-edit-order-section-edit-flow-plan.md` 기준으로 7개 확장 node를 왼쪽 user flow에 적용했습니다. `화주 항목 수정`은 7개 part preview, `운송 구간 수정`은 6개 part preview, `운송+품목/금액 수정`은 7개 part preview, `차주 정보 수정`은 9개 part preview, `수정값 반영 확인`은 5개 part preview와 master bridge anchor를 1차 반영했습니다. `목록 행 선택`과 `수정 가능 항목 확인` node는 아직 구현전 상태로 표시합니다.

`화주 항목 수정`의 가운데 preview 상세 기준은 `17-edit-order-shipper-edit-marker-plan.md`를 따릅니다. 이 node는 왼쪽에서는 하나로 유지하되, 가운데에서는 현재 화주 row, 화주/담당자 변경, 조회 결과 선택, 선택 preview, 담당자 추가 등록, 담당자 연락처 inline edit, 담당자 이메일 inline edit의 7개 part로 나눕니다.

`운송 구간 수정`의 가운데 preview 상세 기준은 `18-edit-order-route-edit-marker-plan.md`를 따릅니다. 이 node는 왼쪽에서는 하나로 유지하되, 가운데에서는 상차/하차 현재 row, 상차지 주소 변경, 상차 상세/담당/조건 수정, 하차지 주소 변경, 하차 상세/담당/조건 수정, 거리/기준금액 확인의 6개 part로 나눕니다.

`운송+품목/금액 수정`의 가운데 preview 상세 기준은 `19-edit-order-cargo-money-edit-marker-plan.md`를 따릅니다. 이 node는 왼쪽에서는 하나로 유지하되, 가운데에서는 운송+품목 입력 dialog, 최근 조합 선택, 운송 조건 row, 품목 row, 금액 입력 dialog, 금액 계산 preview, 금액 row/계산값 readonly의 7개 part로 나눕니다.

`차주 정보 수정`의 가운데 preview 상세 기준은 `20-edit-order-driver-edit-marker-plan.md`를 따릅니다. 이 node는 왼쪽에서는 하나로 유지하되, 가운데에서는 차주 현재 row, 차주/차량 변경 dialog, 내부 DB 결과, 화물맨 배차 결과, 선택 preview, 차주 등록, 연락처 inline 보정, 톤수 inline 보정, 차종 inline 보정의 9개 part로 나눕니다. 실제 화물맨 API와 내부 DB 저장 API는 연결하지 않고 화면 상태와 선택 의미만 설명합니다.

`수정값 반영 확인`의 가운데 preview 상세 기준은 `21-edit-order-apply-review-marker-plan.md`를 따릅니다. 이 node는 독립 수정이 메인 화면 row에 반영된 상태를 기준으로 변경 feedback, 수정 row 반영, 최종 `화물 등록` CTA, dialog 취소 경계, 목록 갱신 보류의 5개 part를 보여줍니다. 실제 저장 API와 목록 재조회는 연결하지 않고, 저장 전 화면 검수 기준만 설명합니다.

## 사용 방법

1. `screenmap/index.html`을 브라우저에서 엽니다.
2. 왼쪽에서 flow 또는 node를 선택합니다.
3. 가운데에서 선택 node의 화면 상태와 master HTML 링크를 확인합니다.
4. 오른쪽에서 기능 설명, data contract, validation, API 보류, QA point, checklist를 확인합니다.
5. source link를 열어 원문 문서로 이동합니다.

## `file://` 동작

브라우저가 `file://`에서 JSON fetch를 막을 수 있으므로, `app.js`는 필요한 `hub-map`, `source-links`, `qa-map`, `final-baseline` 요약 데이터를 embedded data로 포함합니다.

따라서 별도 dev server 없이 `index.html`을 직접 열어도 기본 탐색이 동작합니다.

## 검증 체크리스트

| 항목 | 기준 |
| --- | --- |
| 빈 화면 방지 | `index.html`을 열면 3-pane과 node 목록이 표시 |
| node 클릭 | 왼쪽 node 클릭 시 가운데 preview와 오른쪽 detail이 함께 갱신 |
| master HTML 링크 | `../wireframes/final-handoff/baseline/html/cargo-order-admin-hifi-master.html`로 연결 |
| source link | `../wireframes/final-handoff/...` 기준으로 연결 |
| backlog 표시 | P0/P1 보류 항목이 관련 node detail에 표시 |
| QA 표시 | AC ID 또는 수동 QA check가 관련 node detail에 표시 |
| overflow | 긴 경로와 checklist 문구가 패널 밖으로 밀리지 않음 |
| live marker | 버튼형 target marker가 실제 버튼을 덮지 않고 callout으로 표시 |
