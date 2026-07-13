"use strict";

const SOURCE_ROOT = "../wireframes/final-handoff";
const MASTER_HTML = `${SOURCE_ROOT}/baseline/html/cargo-order-admin-hifi-master.html`;
const NOT_IMPLEMENTED_NAV_STATUS = "아직 구현전";

const flows = [
  {
    id: "new-order-registration",
    label: "신규 접수",
    nodes: [
      "new-order.group-init",
      "new-order.group-wizard-entry",
      "new-order.group-required-shipper",
      "new-order.group-required-load",
      "new-order.group-required-unload",
      "new-order.group-required-cargo",
      "new-order.group-required-money",
      "new-order.group-amount-branch",
      "new-order.group-driver-choice",
      "new-order.group-main-apply",
      "new-order.group-cancel"
    ]
  },
  {
    id: "edit-order",
    label: "화물 수정",
    nodes: [
      "edit-order.row-select",
      "edit-order.section-scan",
      "edit-order.shipper-edit",
      "edit-order.route-edit",
      "edit-order.cargo-money-edit",
      "edit-order.driver-edit",
      "edit-order.apply-review"
    ]
  }
];

const flowMeta = {
  "new-order-registration": {
    note: "그룹화된 신규 접수 이벤트",
    mode: "7개 그룹 / 그룹 3 세분화"
  },
  "edit-order": {
    note: "기존 화물 수정 흐름",
    mode: "7개 확장 node",
    status: "부분 구현"
  }
};

const navMeta = {
  "new-order.group-init": {
    label: "그룹 1. 신규 접수 시작/초기화",
    displayId: "new-order.group-01",
    hint: "클릭, 초기화, new-reset, 섹션 헤더 표시",
    kind: "시작"
  },
  "new-order.group-wizard-entry": {
    label: "그룹 2. Wizard 진입",
    displayId: "new-order.group-02",
    hint: "화주 입력 시작, wizard 열림, 프로세스 패널 표시",
    kind: "진입"
  },
  "new-order.group-required-inputs": {
    label: "그룹 3. 필수 입력 진행",
    displayId: "new-order.group-03",
    hint: "화주, 상차지, 하차지, 운송+품목, 금액",
    kind: "필수"
  },
  "new-order.group-required-shipper": {
    label: "그룹 3-1. 화주 정보",
    displayId: "new-order.group-03-1",
    hint: "화주 완료, 상차지 단계 진입",
    kind: "필수"
  },
  "new-order.group-required-load": {
    label: "그룹 3-2. 상차지",
    displayId: "new-order.group-03-2",
    hint: "조회, 결과 선택, preview, 일시/방법, 적용",
    kind: "필수"
  },
  "new-order.group-required-unload": {
    label: "그룹 3-3. 하차지",
    displayId: "new-order.group-03-3",
    hint: "조회, 결과 선택, preview, 일시/방법, 적용",
    kind: "필수"
  },
  "new-order.group-required-cargo": {
    label: "그룹 3-4. 운송+품목",
    displayId: "new-order.group-03-4",
    hint: "차량 조건, 대수/실중량, 품목, 최근 조합",
    kind: "필수"
  },
  "new-order.group-required-money": {
    label: "그룹 3-5. 금액",
    displayId: "new-order.group-03-5",
    hint: "결제방법, 청구/운송비, 조정금, 필수 완료",
    kind: "필수"
  },
  "new-order.group-amount-branch": {
    label: "그룹 4. 금액 완료 후 분기",
    displayId: "new-order.group-04",
    hint: "화물 등록 완료 또는 차주 정보로 이동",
    kind: "분기"
  },
  "new-order.group-driver-choice": {
    label: "그룹 5. 차주 정보 선택",
    displayId: "new-order.group-05",
    hint: "차주 선택 완료 또는 건너뛰기",
    kind: "선택"
  },
  "new-order.group-main-apply": {
    label: "그룹 6. 메인 화면 적용",
    displayId: "new-order.group-06",
    hint: "draft 적용, new-submitted, wizard 종료",
    kind: "적용"
  },
  "new-order.group-cancel": {
    label: "그룹 7. 신규 접수 취소",
    displayId: "new-order.group-07",
    navStatus: NOT_IMPLEMENTED_NAV_STATUS,
    hint: "작성 중단 확인, idle-edit 복귀",
    kind: "취소"
  },
  "edit-order.row-select": {
    navStatus: NOT_IMPLEMENTED_NAV_STATUS,
    label: "목록 행 선택",
    displayId: "edit-order.group-01",
    hint: "기존 화물 선택 후 명세서형 보기",
    kind: "선택"
  },
  "edit-order.section-scan": {
    navStatus: NOT_IMPLEMENTED_NAV_STATUS,
    label: "수정 가능 항목 확인",
    displayId: "edit-order.group-02",
    hint: "editable/readonly 항목을 섹션별로 스캔",
    kind: "확인"
  },
  "edit-order.shipper-edit": {
    navStatus: "bridge 연결",
    label: "화주 항목 수정",
    displayId: "edit-order.group-03",
    hint: "화주/담당자 변경, 연락처/이메일 inline",
    kind: "수정"
  },
  "edit-order.route-edit": {
    navStatus: "bridge 연결",
    label: "운송 구간 수정",
    displayId: "edit-order.group-04",
    hint: "상차/하차 주소, 일시/방법, 재계산 필요",
    kind: "수정"
  },
  "edit-order.cargo-money-edit": {
    navStatus: "bridge 연결",
    label: "운송+품목/금액 수정",
    displayId: "edit-order.group-05",
    hint: "톤수/차종, 품목, 결제방법, 비용 inline",
    kind: "수정"
  },
  "edit-order.driver-edit": {
    navStatus: "bridge 연결",
    label: "차주 정보 수정",
    displayId: "edit-order.group-06",
    hint: "차주/차량 변경, 연락처와 스펙 보정",
    kind: "수정"
  },
  "edit-order.apply-review": {
    navStatus: "bridge 연결",
    label: "수정값 반영 확인",
    displayId: "edit-order.group-07",
    hint: "변경 field feedback, 목록 row 갱신 후보",
    kind: "반영"
  },
  "new-order.start": {
    label: "신규 접수 시작",
    hint: "초기화, focus, draft 시작",
    kind: "시작"
  },
  "new-order.shipper": {
    label: "화주 정보",
    hint: "화주 식별과 담당자 확인",
    kind: "필수"
  },
  "new-order.load-address": {
    label: "상차지",
    hint: "주소 검색, 최근 장소, 상차 정책",
    kind: "필수"
  },
  "new-order.unload-address": {
    label: "하차지",
    hint: "하차 주소 확정과 route 준비",
    kind: "필수"
  },
  "new-order.cargo-item": {
    label: "운송+품목",
    hint: "톤수, 차종, 대수, 실중량, 품목",
    kind: "필수"
  },
  "new-order.amount": {
    label: "금액",
    hint: "청구금, 배차금, 결제방법",
    kind: "필수"
  },
  "new-order.driver": {
    label: "차주 정보 선택",
    hint: "선택 또는 건너뛰기 가능",
    kind: "선택"
  },
  "new-order.pre-api-submit": {
    label: "메인 화면 적용",
    displayId: "new-order.main-apply",
    hint: "저장 전 화면 반영 상태",
    kind: "완료"
  },
  "aside.memo": {
    label: "메모",
    hint: "운영 메모와 고객 요청",
    kind: "보조"
  },
  "aside.amount-log": {
    label: "금액 로그",
    hint: "조정금, 합계, 수익 확인",
    kind: "보조"
  },
  "aside.route-map": {
    label: "운송 구간 지도",
    hint: "거리, 예상 시간, 경유 상태",
    kind: "보조"
  },
  "dialog.address-recent": {
    label: "주소 최근 사용",
    hint: "row 선택은 미리보기, 적용은 버튼",
    kind: "다이얼로그"
  },
  "dialog.cargo-recent": {
    label: "운송+품목 최근 사용",
    hint: "최근 조합을 입력폼에 반영",
    kind: "다이얼로그"
  },
  "header.status-metrics": {
    label: "상태/거리/기준금액",
    hint: "상단 chip과 wrap 확인",
    kind: "Header"
  },
  "header.dispatch-manager": {
    label: "배차 담당자",
    hint: "표시 전용 담당자 chip",
    kind: "Header"
  },
  "header.label-toggle": {
    label: "라벨 표시 토글",
    hint: "본문 라벨 표시/숨김",
    kind: "Header"
  }
};

const requiredInputSplitGroups = [
  {
    id: "new-order.group-required-shipper",
    label: "그룹 3-1. 화주 정보",
    summary: "화주와 담당자를 통합 조회하고, 결과 행 선택 후 우측 선택 정보 preview에서 업체/담당자 값을 확인한 뒤 필요하면 담당자를 추가 등록하고 wizard draft에 반영하는 구간입니다.",
    dataContracts: ["Requester", "ContactPerson", "CargoMemo"],
    states: ["new-wizard-active"],
    validation: ["화주/담당자 통합 조회", "결과 행 선택", "선택 정보 preview 확인", "담당자 추가 등록", "상차지 단계 전환"],
    checklist: ["조회 영역 marker 확인", "선택 row와 우측 preview 동기화 확인", "담당자 추가 등록 버튼과 역할 선택 확인", "화주 정보 적용 후 상차지 step current 전환 확인"],
    partIds: [
      "group-required-inputs.shipper-search",
      "group-required-inputs.shipper-result-select",
      "group-required-inputs.shipper-selected-preview",
      "group-required-inputs.shipper-contact-add",
      "group-required-inputs.shipper-complete",
      "group-required-inputs.load-step"
    ],
    backlog: ["P0-VALIDATION", "P0-CONTACT-MASTER-POLICY", "P0-PRIVACY"],
    extraSourceLinks: [
      "./10-group-3-1-shipper-contact-components-plan.md",
      "../source-snapshot/sections/shipper-info/README.md",
      "../source-snapshot/sections/shipper-info/02-wireframe-shipper-info.md"
    ],
    qa: ["AC-C5"]
  },
  {
    id: "new-order.group-required-load",
    label: "그룹 3-2. 상차지",
    summary: "상차지 조회 출처와 주소 결과를 선택하고, 우측 선택 정보에서 주소/담당자와 상차 일시/방법 조건을 확인한 뒤 하차지 단계로 넘어가는 구간입니다.",
    dataContracts: ["Location", "HandlingCondition", "RecentLocation"],
    states: ["new-wizard-active"],
    validation: ["상차지 조회 출처/검색", "상차지 결과 선택", "선택 주소/담당자 preview", "상차 일시/방법", "하차지 단계 전환"],
    checklist: ["조회 출처와 검색 영역 marker 확인", "선택 row와 우측 주소 preview 동기화 확인", "상차 일시/방법 조건 카드 확인", "상차지 적용 후 하차지 step current 전환 확인"],
    partIds: [
      "group-required-inputs.load-address-search",
      "group-required-inputs.load-result-select",
      "group-required-inputs.load-selected-preview",
      "group-required-inputs.load-condition",
      "group-required-inputs.load-complete",
      "group-required-inputs.unload-step"
    ],
    backlog: ["P0-VALIDATION", "P0-RECENT-SCOPE", "P0-PRIVACY"],
    extraSourceLinks: [
      "./11-group-3-2-to-3-5-required-components-plan.md",
      "../source-snapshot/sections/transport-route/README.md",
      "../source-snapshot/sections/transport-route/address-apply-layouts/02-wireframe-address-apply-layouts.md",
      "../source-snapshot/sections/transport-dialog-recent-lists/02-address-dialog-recent-list.md"
    ],
    qa: ["AC-C5", "AC-ADDR-001", "AC-REG-001"]
  },
  {
    id: "new-order.group-required-unload",
    label: "그룹 3-3. 하차지",
    summary: "하차지 조회 출처와 주소 결과를 선택하고, 우측 선택 정보에서 주소/담당자와 하차 일시/방법 조건을 확인한 뒤 운송+품목 단계로 넘어가는 구간입니다.",
    dataContracts: ["Location", "HandlingCondition", "RecentLocation", "RoutePreview"],
    states: ["new-wizard-active"],
    validation: ["하차지 조회 출처/검색", "하차지 결과 선택", "선택 주소/담당자 preview", "하차 일시/방법", "운송+품목 단계 전환"],
    checklist: ["조회 출처와 검색 영역 marker 확인", "선택 row와 우측 주소 preview 동기화 확인", "하차 일시/방법 조건 카드 확인", "하차지 적용 후 운송+품목 step current 전환 확인"],
    partIds: [
      "group-required-inputs.unload-address-search",
      "group-required-inputs.unload-result-select",
      "group-required-inputs.unload-selected-preview",
      "group-required-inputs.unload-condition",
      "group-required-inputs.unload-complete",
      "group-required-inputs.cargo-step"
    ],
    backlog: ["P0-VALIDATION", "P0-RECENT-SCOPE", "P0-PRIVACY", "P1-MAP-PROVIDER"],
    extraSourceLinks: [
      "./11-group-3-2-to-3-5-required-components-plan.md",
      "../source-snapshot/sections/transport-route/README.md",
      "../source-snapshot/sections/transport-route/address-apply-layouts/02-wireframe-address-apply-layouts.md",
      "../source-snapshot/sections/transport-dialog-recent-lists/02-address-dialog-recent-list.md",
      "../source-snapshot/sections/reservation-area-tabs/02-tab-map-section.md"
    ],
    qa: ["AC-C5", "AC-ADDR-001", "AC-REG-001"]
  },
  {
    id: "new-order.group-required-cargo",
    label: "그룹 3-4. 운송+품목",
    summary: "차량 조건, 대수/실중량, 품목명, 최근 사용 조합을 확인해 배차와 정산의 기준이 되는 운송+품목 조건을 확정하고 금액 단계로 넘어가는 구간입니다.",
    dataContracts: ["VehicleRequirement", "CargoDetail", "RecentCargoCombo"],
    states: ["new-wizard-active"],
    validation: ["톤수/차종", "대수/실중량", "품목명", "최근 사용 조합", "금액 단계 전환"],
    checklist: ["차량 조건 필드 marker 확인", "대수/실중량 필드 marker 확인", "품목 입력과 최근 조합의 적용 전 역할 확인", "운송+품목 적용 후 금액 step current 전환 확인"],
    partIds: [
      "group-required-inputs.cargo-vehicle-requirement",
      "group-required-inputs.cargo-quantity-weight",
      "group-required-inputs.cargo-item-input",
      "group-required-inputs.cargo-recent-combo",
      "group-required-inputs.cargo-complete",
      "group-required-inputs.money-step"
    ],
    partOverrides: {
      "group-required-inputs.money-step": {
        marker: { x: 12.8, y: 58.6 },
        liveMarkerPlacement: "left"
      }
    },
    backlog: ["P0-VALIDATION", "P0-RECENT-SCOPE"],
    extraSourceLinks: [
      "./11-group-3-2-to-3-5-required-components-plan.md",
      "../source-snapshot/sections/cargo-transport/README.md",
      "../source-snapshot/sections/cargo-transport/09-f-transport-item-money-dialog-plan.md",
      "../source-snapshot/sections/transport-dialog-recent-lists/03-cargo-item-dialog-recent-list.md"
    ],
    qa: ["AC-C5", "AC-CARGO-001", "AC-CARGO-002"]
  },
  {
    id: "new-order.group-required-money",
    label: "그룹 3-5. 금액",
    summary: "결제방법, 청구금, 배차금, 수수료, 조정 금액을 확인해 등록 전 금액 조건을 확정하고 `new-required-complete` 상태와 다음 행동 분기 panel을 표시하는 구간입니다.",
    dataContracts: ["Pricing", "PricingAdjustment"],
    states: ["new-wizard-active", "new-required-complete"],
    validation: ["결제방법", "청구/운송 비용", "수수료/조정 금액", "필수 입력 완료 상태"],
    checklist: ["결제방법 marker 확인", "청구/운송 비용 묶음 확인", "수수료/조정 금액 묶음 확인", "금액 조건 적용 후 `new-required-complete` panel marker 확인"],
    partIds: [
      "group-required-inputs.money-payment-method",
      "group-required-inputs.money-charge-haul",
      "group-required-inputs.money-fee-adjustment",
      "group-required-inputs.money-complete",
      "group-required-inputs.required-complete"
    ],
    backlog: ["P0-VALIDATION", "P0-AMOUNT-PERMISSION", "P0-SETTLEMENT-EDIT"],
    extraSourceLinks: [
      "./11-group-3-2-to-3-5-required-components-plan.md",
      "../source-snapshot/sections/cargo-transport/09-f-transport-item-money-dialog-plan.md",
      "../source-snapshot/sections/reservation-area-tabs/04-tab-amount-log-section.md",
      "../source-snapshot/sections/reservation-area-tabs/08-implementation-handoff.md"
    ],
    qa: ["AC-C5", "AC-D1"]
  }
];

const centerPreviewMaps = {
  "new-order.group-init": {
    centerMode: "live-master-hotspot",
    previewBase: "live-master-fallback-marker",
    master: {
      src: `${MASTER_HTML}?screenmap=1&group=new-order.group-init`,
      title: "cargo-order-admin-hifi-master live preview",
      fallbackImage: "./assets/master-new-order-base.png"
    },
    screenshot: {
      src: "./assets/master-new-order-base.png",
      alt: "cargo-order-admin-hifi-master 신규 접수 기준 화면",
      width: 1408,
      height: 662
    },
    mobileFallback: "event-list",
    parts: [
      {
        id: "group-init.click-new",
        number: 1,
        label: "신규 접수 클릭",
        shortCopy: "사용자가 신규 접수 흐름을 시작합니다.",
        event: "clickNewOrder",
        stateBefore: "idle-edit",
        stateAfter: "idle-edit",
        targetZone: "header-action",
        markerKind: "action-button",
        marker: { x: 6.7, y: 95.3 },
        liveMarkerPlacement: "above",
        focusRect: { x: 3.4, y: 92.8, width: 5.4, height: 5.2 },
        rightDetailKey: "group-init.click-new",
        detail: "idle-edit에서 신규 접수 흐름으로 진입합니다. 이 시점에는 아직 화면 초기화가 완료되지 않았습니다.",
        qa: ["AC-A1"]
      },
      {
        id: "group-init.reset-fields",
        number: 2,
        label: "전체 입력 상태 초기화",
        shortCopy: "기존 입력값과 선택 상태를 비웁니다.",
        event: "resetDraftFields",
        stateBefore: "idle-edit",
        stateAfter: "new-reset",
        targetZone: "main-form",
        markerKind: "state-surface",
        marker: { x: 25.4, y: 42.8 },
        focusRect: { x: 1.2, y: 8.5, width: 48.5, height: 67.2 },
        rightDetailKey: "group-init.reset-fields",
        detail: "화주, 주소, 운송+품목, 금액, 차주 관련 draft를 초기화합니다.",
        qa: ["AC-A1", "AC-A2"]
      },
      {
        id: "group-init.state-new-reset",
        number: 3,
        label: "상태: new-reset",
        shortCopy: "신규 접수 초기 상태로 전환됩니다.",
        event: "enterNewResetState",
        stateBefore: "idle-edit",
        stateAfter: "new-reset",
        targetZone: "status-area",
        markerKind: "status-badge",
        marker: { x: 77.0, y: 4.1 },
        focusRect: { x: 75.3, y: 1.2, width: 3.9, height: 4.5 },
        rightDetailKey: "group-init.state-new-reset",
        detail: "신규 접수 초기화가 완료된 상태입니다. 이후 화면은 안내형 신규 접수 보기로 바뀝니다.",
        qa: ["AC-A2"]
      },
      {
        id: "group-init.section-headers",
        number: 4,
        label: "섹션 헤더 표시",
        shortCopy: "입력 순서를 보여주는 섹션 헤더가 나타납니다.",
        event: "showGuidedSectionHeaders",
        stateBefore: "new-reset",
        stateAfter: "new-reset",
        targetZone: "section-header",
        markerKind: "section-header",
        marker: { x: 3.8, y: 13.9 },
        focusRect: { x: 1.2, y: 8.5, width: 4.4, height: 67.2 },
        rightDetailKey: "group-init.section-headers",
        detail: "신규 접수 안내형 보기로 전환해 번호형 섹션 헤더를 표시합니다.",
        qa: ["AC-A3", "AC-B3", "AC-B6"]
      },
      {
        id: "group-init.shipper-focus",
        number: 5,
        label: "화주 정보 focus",
        shortCopy: "첫 입력 위치로 focus를 이동합니다.",
        event: "focusShipperInput",
        stateBefore: "new-reset",
        stateAfter: "new-reset",
        targetZone: "shipper-section",
        markerKind: "action-button",
        marker: { x: 94.6, y: 13.9 },
        liveMarkerPlacement: "left",
        focusRect: { x: 91.8, y: 8.5, width: 7.3, height: 4.9 },
        rightDetailKey: "group-init.shipper-focus",
        detail: "화주 정보 섹션 또는 화주 정보 입력 버튼으로 focus를 이동합니다. focus 이동은 render 완료 후 1회만 수행합니다.",
        qa: ["AC-A4", "AC-A5"]
      }
    ]
  },
  "new-order.group-wizard-entry": {
    centerMode: "live-master-hotspot",
    previewBase: "live-master-fallback-marker",
    master: {
      src: `${MASTER_HTML}?screenmap=1&group=new-order.group-wizard-entry`,
      title: "cargo-order-admin-hifi-master group 2 wizard entry preview",
      fallbackImage: "./assets/master-new-order-base.png"
    },
    screenshot: {
      src: "./assets/master-new-order-base.png",
      alt: "cargo-order-admin-hifi-master Wizard 진입 기준 화면",
      width: 1408,
      height: 920
    },
    mobileFallback: "event-list",
    parts: [
      {
        id: "group-wizard-entry.shipper-cta",
        number: 1,
        label: "화주 정보 입력 시작",
        shortCopy: "new-reset에서 첫 필수 입력 CTA를 실행합니다.",
        event: "startShipperInput",
        stateBefore: "new-reset",
        stateAfter: "new-reset",
        targetZone: "shipper-section",
        markerKind: "action-button",
        marker: { x: 93.7, y: 16.4 },
        liveMarkerPlacement: "left",
        focusRect: { x: 90.6, y: 15.0, width: 6.1, height: 2.8 },
        rightDetailKey: "group-wizard-entry.shipper-cta",
        detail: "화주 정보 입력 버튼을 실행해 wizard 진입을 시작합니다. 이 단계에서는 아직 new-wizard-active 상태가 확정되기 전입니다.",
        qa: ["AC-C1"]
      },
      {
        id: "group-wizard-entry.dialog-open",
        number: 2,
        label: "wizard 다이얼로그 열림",
        shortCopy: "화주 정보 입력용 wizard frame이 열립니다.",
        event: "openShipperWizardDialog",
        stateBefore: "new-reset",
        stateAfter: "new-wizard-active",
        targetZone: "wizard-dialog",
        markerKind: "dialog-surface",
        marker: { x: 50.0, y: 50.1 },
        focusRect: { x: 13.1, y: 16.4, width: 73.9, height: 67.3 },
        rightDetailKey: "group-wizard-entry.dialog-open",
        detail: "화주 정보 wizard 다이얼로그가 열립니다. bridge 확장 후에는 .dialog--new-order-wizard anchor를 기준으로 live 위치를 표시합니다.",
        qa: ["AC-C1"]
      },
      {
        id: "group-wizard-entry.process-panel",
        number: 3,
        label: "왼쪽 프로세스 패널 표시",
        shortCopy: "wizard 왼쪽에 신규 접수 진행 단계를 보여줍니다.",
        event: "showWizardProcessPanel",
        stateBefore: "new-wizard-active",
        stateAfter: "new-wizard-active",
        targetZone: "wizard-process-panel",
        markerKind: "process-panel",
        marker: { x: 29.0, y: 50.1 },
        liveMarkerPlacement: "right",
        focusRect: { x: 13.1, y: 16.5, width: 15.9, height: 67.1 },
        rightDetailKey: "group-wizard-entry.process-panel",
        detail: "신규 접수 wizard의 왼쪽 process panel을 표시합니다. 현재 단계와 남은 필수 입력 흐름을 한눈에 확인하는 영역입니다.",
        qa: ["AC-C2", "AC-C3"]
      },
      {
        id: "group-wizard-entry.state-active",
        number: 4,
        label: "상태: new-wizard-active",
        shortCopy: "화주 step이 current 상태로 확정됩니다.",
        event: "confirmNewWizardActive",
        stateBefore: "new-reset",
        stateAfter: "new-wizard-active",
        targetZone: "wizard-state",
        markerKind: "step-item",
        marker: { x: 28.2, y: 28.6 },
        liveMarkerPlacement: "right",
        focusRect: { x: 14.3, y: 26.5, width: 13.6, height: 4.1 },
        rightDetailKey: "group-wizard-entry.state-active",
        detail: "runtime phase가 new-wizard-active로 바뀌고 화주 정보 step이 current로 표시됩니다. 이 상태가 확인되어야 그룹 3 필수 입력 진행으로 이어질 수 있습니다.",
        qa: ["AC-C1", "AC-C3"]
      }
    ]
  },
  "new-order.group-required-inputs": {
    centerMode: "live-master-hotspot",
    previewBase: "live-master-fallback-marker",
    master: {
      src: `${MASTER_HTML}?screenmap=1&group=new-order.group-required-inputs`,
      title: "cargo-order-admin-hifi-master group 3 required inputs preview",
      fallbackImage: "./assets/master-new-order-base.png"
    },
    screenshot: {
      src: "./assets/master-new-order-base.png",
      alt: "cargo-order-admin-hifi-master 필수 입력 진행 기준 화면",
      width: 1408,
      height: 920
    },
    mobileFallback: "event-list",
    parts: [
      {
        id: "group-required-inputs.shipper-search",
        number: 1,
        label: "화주/담당자 통합 조회",
        shortCopy: "업체명과 담당자 기준으로 화주 후보를 조회합니다.",
        event: "searchRequesterContact",
        stateBefore: "new-wizard-active",
        stateAfter: "new-wizard-active",
        targetZone: "wizard-shipper-search",
        markerKind: "search-control",
        marker: { x: 85.1, y: 27.0 },
        liveMarkerPlacement: "above",
        focusRect: { x: 31.3, y: 25.4, width: 55.5, height: 3.3 },
        rightDetailKey: "group-required-inputs.shipper-search",
        detail: "화주 조회 dialog 상단의 통합 검색 영역입니다. 업체명, 사업자번호, 담당자명, 연락처 중 어떤 기준으로 조회할지와 결과 갱신 책임을 설명합니다.",
        qa: ["AC-C5"]
      },
      {
        id: "group-required-inputs.shipper-result-select",
        number: 2,
        label: "화주/담당자 결과 선택",
        shortCopy: "조회 결과 row에서 적용할 화주와 담당자를 선택합니다.",
        event: "selectRequesterContactRow",
        stateBefore: "new-wizard-active",
        stateAfter: "new-wizard-active",
        targetZone: "wizard-shipper-result-row",
        markerKind: "result-row",
        marker: { x: 49.4, y: 35.4 },
        liveMarkerPlacement: "left",
        focusRect: { x: 31.3, y: 30.0, width: 36.2, height: 16.6 },
        rightDetailKey: "group-required-inputs.shipper-result-select",
        detail: "왼쪽 결과 목록은 화주 업체와 담당자 조합을 함께 보여줍니다. row 클릭은 즉시 적용이 아니라 우측 선택 정보 preview를 갱신하는 선택 동작으로 봅니다.",
        qa: ["AC-C5"]
      },
      {
        id: "group-required-inputs.shipper-selected-preview",
        number: 3,
        label: "선택 화주/담당자 정보 확인",
        shortCopy: "선택한 업체와 담당자 정보를 적용 전 우측 preview에서 확인합니다.",
        event: "previewSelectedRequesterContact",
        stateBefore: "new-wizard-active",
        stateAfter: "new-wizard-active",
        targetZone: "wizard-shipper-selected-preview",
        markerKind: "detail-panel",
        marker: { x: 77.6, y: 41.1 },
        liveMarkerPlacement: "right",
        focusRect: { x: 68.4, y: 30.0, width: 18.5, height: 22.2 },
        rightDetailKey: "group-required-inputs.shipper-selected-preview",
        detail: "우측 선택 정보 영역은 `화주 정보에 적용` 전에 업체명, 사업자번호, 담당자, 연락처, 이메일, 역할을 확인하는 안전장치입니다.",
        qa: ["AC-C5"]
      },
      {
        id: "group-required-inputs.shipper-contact-add",
        number: 4,
        label: "담당자 추가 등록",
        shortCopy: "선택된 화주에 새 담당자와 역할을 추가 등록합니다.",
        event: "registerRequesterContact",
        stateBefore: "new-wizard-active",
        stateAfter: "new-wizard-active",
        targetZone: "wizard-shipper-contact-add",
        markerKind: "action-button",
        marker: { x: 77.6, y: 74.6 },
        liveMarkerPlacement: "above",
        focusRect: { x: 68.4, y: 52.9, width: 18.5, height: 24.5 },
        rightDetailKey: "group-required-inputs.shipper-contact-add",
        detail: "담당자 추가 카드는 선택한 화주에 새 담당자를 붙이는 보조 입력입니다. 배차, 정산, 관리 역할 선택과 중복 등록 판단은 정책 보류 항목으로 추적합니다.",
        qa: ["AC-C5"]
      },
      {
        id: "group-required-inputs.shipper-complete",
        number: 5,
        label: "화주 정보 완료",
        shortCopy: "선택된 화주 정보를 draft에 반영합니다.",
        event: "applyShipperDraft",
        stateBefore: "new-wizard-active",
        stateAfter: "new-wizard-active",
        targetZone: "wizard-shipper-apply",
        markerKind: "action-button",
        marker: { x: 81.8, y: 80.6 },
        liveMarkerPlacement: "above",
        focusRect: { x: 77.8, y: 78.9, width: 7.9, height: 3.3 },
        rightDetailKey: "group-required-inputs.shipper-complete",
        detail: "선택된 화주 정보를 wizard draft에 반영하고 상차지 step으로 이동합니다.",
        qa: ["AC-C5"]
      },
      {
        id: "group-required-inputs.load-step",
        number: 2,
        label: "상차지 단계 표시",
        shortCopy: "process panel에서 상차지 step이 current로 표시됩니다.",
        event: "showLoadStep",
        stateBefore: "new-wizard-active",
        stateAfter: "new-wizard-active",
        targetZone: "wizard-step-load",
        markerKind: "step-item",
        marker: { x: 21.1, y: 36.2 },
        liveMarkerPlacement: "right",
        focusRect: { x: 14.3, y: 34.1, width: 13.6, height: 4.1 },
        rightDetailKey: "group-required-inputs.load-step",
        detail: "화주 정보 완료 후 current step이 상차지로 이동합니다.",
        qa: ["AC-C5"]
      },
      {
        id: "group-required-inputs.load-address-search",
        number: 3,
        label: "상차지 조회 출처/검색",
        shortCopy: "최근 사용, 화주 주소록, Kakao 포함 조회 출처로 상차지를 찾습니다.",
        event: "searchLoadAddress",
        stateBefore: "new-wizard-active",
        stateAfter: "new-wizard-active",
        targetZone: "wizard-load-search",
        markerKind: "search-control",
        marker: { x: 85.1, y: 29.6 },
        liveMarkerPlacement: "above",
        focusRect: { x: 31.3, y: 28.0, width: 55.5, height: 3.3 },
        rightDetailKey: "group-required-inputs.load-address-search",
        detail: "상차지 단계의 조회 출처와 검색 입력 영역입니다. 최근 사용, 화주 주소록, 외부 주소 조회가 같은 결과 목록으로 모이는 지점을 설명합니다.",
        qa: ["AC-C5", "AC-ADDR-001"]
      },
      {
        id: "group-required-inputs.load-result-select",
        number: 4,
        label: "상차지 결과 선택",
        shortCopy: "상차지 후보 row를 선택해 우측 선택 정보 preview를 갱신합니다.",
        event: "selectLoadAddressRow",
        stateBefore: "new-wizard-active",
        stateAfter: "new-wizard-active",
        targetZone: "wizard-load-result-row",
        markerKind: "result-row",
        marker: { x: 49.4, y: 45.8 },
        liveMarkerPlacement: "left",
        focusRect: { x: 31.3, y: 40.3, width: 36.2, height: 16.6 },
        rightDetailKey: "group-required-inputs.load-result-select",
        detail: "검색 결과 row는 즉시 적용이 아니라 우측 preview를 바꾸는 선택 동작입니다. 실제 draft 반영은 `상차지 적용` 버튼이 담당합니다.",
        qa: ["AC-C5", "AC-ADDR-002"]
      },
      {
        id: "group-required-inputs.load-selected-preview",
        number: 5,
        label: "선택 상차지 정보 확인",
        shortCopy: "선택한 주소, 상세주소, 담당자, 연락처를 우측 preview에서 확인합니다.",
        event: "previewSelectedLoadAddress",
        stateBefore: "new-wizard-active",
        stateAfter: "new-wizard-active",
        targetZone: "wizard-load-selected-preview",
        markerKind: "detail-panel",
        marker: { x: 77.6, y: 47.6 },
        liveMarkerPlacement: "right",
        focusRect: { x: 68.4, y: 36.5, width: 18.5, height: 22.2 },
        rightDetailKey: "group-required-inputs.load-selected-preview",
        detail: "우측 선택 정보 card에서 상차지 주소와 담당자 정보를 적용 전에 확인합니다. 상세 편집과 주소록 저장 여부도 이 영역의 책임으로 봅니다.",
        qa: ["AC-C5", "AC-REG-001"]
      },
      {
        id: "group-required-inputs.load-condition",
        number: 6,
        label: "상차 일시/방법 조건",
        shortCopy: "상차 일시와 처리 방법을 선택해 출발 조건을 확정합니다.",
        event: "setLoadHandlingCondition",
        stateBefore: "new-wizard-active",
        stateAfter: "new-wizard-active",
        targetZone: "wizard-load-condition",
        markerKind: "condition-panel",
        marker: { x: 77.6, y: 67.2 },
        liveMarkerPlacement: "right",
        focusRect: { x: 68.4, y: 59.5, width: 18.5, height: 15.3 },
        rightDetailKey: "group-required-inputs.load-condition",
        detail: "상차 일시와 상차 방법은 주소와 별개의 운송 조건입니다. 같은 주소라도 일시와 작업 방식이 달라질 수 있으므로 `HandlingCondition`으로 분리해 설명합니다.",
        qa: ["AC-C5"]
      },
      {
        id: "group-required-inputs.load-complete",
        number: 3,
        label: "상차지 완료",
        shortCopy: "상차지 주소와 조건을 draft에 반영합니다.",
        event: "applyLoadLocationDraft",
        stateBefore: "new-wizard-active",
        stateAfter: "new-wizard-active",
        targetZone: "wizard-load-apply",
        markerKind: "action-button",
        marker: { x: 82.7, y: 78.0 },
        liveMarkerPlacement: "above",
        focusRect: { x: 79.7, y: 76.3, width: 6.1, height: 3.3 },
        rightDetailKey: "group-required-inputs.load-complete",
        detail: "상차지 주소, 상세주소, 담당자, 연락처, 일시/방법 조건을 draft에 반영합니다.",
        qa: ["AC-C5"]
      },
      {
        id: "group-required-inputs.unload-step",
        number: 4,
        label: "하차지 단계 표시",
        shortCopy: "process panel에서 하차지 step이 current로 표시됩니다.",
        event: "showUnloadStep",
        stateBefore: "new-wizard-active",
        stateAfter: "new-wizard-active",
        targetZone: "wizard-step-unload",
        markerKind: "step-item",
        marker: { x: 21.1, y: 41.2 },
        liveMarkerPlacement: "right",
        focusRect: { x: 14.3, y: 39.1, width: 13.6, height: 4.1 },
        rightDetailKey: "group-required-inputs.unload-step",
        detail: "상차지 완료 후 current step이 하차지로 이동합니다.",
        qa: ["AC-C5"]
      },
      {
        id: "group-required-inputs.unload-address-search",
        number: 8,
        label: "하차지 조회 출처/검색",
        shortCopy: "최근 사용, 화주 주소록, Kakao 포함 조회 출처로 하차지를 찾습니다.",
        event: "searchUnloadAddress",
        stateBefore: "new-wizard-active",
        stateAfter: "new-wizard-active",
        targetZone: "wizard-unload-search",
        markerKind: "search-control",
        marker: { x: 85.1, y: 29.6 },
        liveMarkerPlacement: "above",
        focusRect: { x: 31.3, y: 28.0, width: 55.5, height: 3.3 },
        rightDetailKey: "group-required-inputs.unload-address-search",
        detail: "하차지 단계의 조회 출처와 검색 입력 영역입니다. 상차지와 같은 lookup 구조를 쓰지만 도착지 기준의 최근 사용, 주소록, 외부 조회 결과를 다룹니다.",
        qa: ["AC-C5", "AC-ADDR-001"]
      },
      {
        id: "group-required-inputs.unload-result-select",
        number: 9,
        label: "하차지 결과 선택",
        shortCopy: "하차지 후보 row를 선택해 우측 선택 정보 preview를 갱신합니다.",
        event: "selectUnloadAddressRow",
        stateBefore: "new-wizard-active",
        stateAfter: "new-wizard-active",
        targetZone: "wizard-unload-result-row",
        markerKind: "result-row",
        marker: { x: 49.4, y: 45.8 },
        liveMarkerPlacement: "left",
        focusRect: { x: 31.3, y: 40.3, width: 36.2, height: 16.6 },
        rightDetailKey: "group-required-inputs.unload-result-select",
        detail: "검색 결과 row는 도착지 후보를 선택하는 동작입니다. 선택 결과는 우측 preview에만 먼저 반영되고, draft 확정은 `하차지 적용`에서 이루어집니다.",
        qa: ["AC-C5", "AC-ADDR-002"]
      },
      {
        id: "group-required-inputs.unload-selected-preview",
        number: 10,
        label: "선택 하차지 정보 확인",
        shortCopy: "선택한 도착 주소, 상세주소, 담당자, 연락처를 우측 preview에서 확인합니다.",
        event: "previewSelectedUnloadAddress",
        stateBefore: "new-wizard-active",
        stateAfter: "new-wizard-active",
        targetZone: "wizard-unload-selected-preview",
        markerKind: "detail-panel",
        marker: { x: 77.6, y: 47.6 },
        liveMarkerPlacement: "right",
        focusRect: { x: 68.4, y: 36.5, width: 18.5, height: 22.2 },
        rightDetailKey: "group-required-inputs.unload-selected-preview",
        detail: "우측 선택 정보 card에서 하차지 주소와 담당자 정보를 적용 전에 확인합니다. 상차지와 같은 UI라도 route 계산과 도착 조건의 입력원으로 쓰입니다.",
        qa: ["AC-C5", "AC-REG-001"]
      },
      {
        id: "group-required-inputs.unload-condition",
        number: 11,
        label: "하차 일시/방법 조건",
        shortCopy: "하차 일시와 처리 방법을 선택해 도착 조건을 확정합니다.",
        event: "setUnloadHandlingCondition",
        stateBefore: "new-wizard-active",
        stateAfter: "new-wizard-active",
        targetZone: "wizard-unload-condition",
        markerKind: "condition-panel",
        marker: { x: 77.6, y: 67.2 },
        liveMarkerPlacement: "right",
        focusRect: { x: 68.4, y: 59.5, width: 18.5, height: 15.3 },
        rightDetailKey: "group-required-inputs.unload-condition",
        detail: "하차 일시와 하차 방법은 도착지 주소와 함께 route preview, 기사 전달 문구, validation에 영향을 주는 조건입니다.",
        qa: ["AC-C5"]
      },
      {
        id: "group-required-inputs.unload-complete",
        number: 5,
        label: "하차지 완료",
        shortCopy: "하차지 주소와 조건을 draft에 반영합니다.",
        event: "applyUnloadLocationDraft",
        stateBefore: "new-wizard-active",
        stateAfter: "new-wizard-active",
        targetZone: "wizard-unload-apply",
        markerKind: "action-button",
        marker: { x: 82.7, y: 78.0 },
        liveMarkerPlacement: "above",
        focusRect: { x: 79.7, y: 76.3, width: 6.1, height: 3.3 },
        rightDetailKey: "group-required-inputs.unload-complete",
        detail: "하차지 주소, 상세주소, 담당자, 연락처, 일시/방법 조건을 draft에 반영합니다.",
        qa: ["AC-C5"]
      },
      {
        id: "group-required-inputs.cargo-step",
        number: 6,
        label: "운송+품목 단계 표시",
        shortCopy: "process panel에서 운송+품목 step이 current로 표시됩니다.",
        event: "showCargoStep",
        stateBefore: "new-wizard-active",
        stateAfter: "new-wizard-active",
        targetZone: "wizard-step-cargo",
        markerKind: "step-item",
        marker: { x: 21.1, y: 55.3 },
        liveMarkerPlacement: "right",
        focusRect: { x: 14.3, y: 53.3, width: 13.6, height: 4.1 },
        rightDetailKey: "group-required-inputs.cargo-step",
        detail: "하차지 완료 후 current step이 운송+품목으로 이동합니다.",
        qa: ["AC-C5"]
      },
      {
        id: "group-required-inputs.cargo-vehicle-requirement",
        number: 13,
        label: "차량 조건 입력",
        shortCopy: "톤수와 차종을 선택해 배차 후보의 기본 조건을 만듭니다.",
        event: "setCargoVehicleRequirement",
        stateBefore: "new-wizard-active",
        stateAfter: "new-wizard-active",
        targetZone: "wizard-cargo-vehicle",
        markerKind: "input-group",
        marker: { x: 40.2, y: 41.1 },
        liveMarkerPlacement: "above",
        focusRect: { x: 31.3, y: 37.1, width: 36.2, height: 5.6 },
        rightDetailKey: "group-required-inputs.cargo-vehicle-requirement",
        detail: "톤수와 차종은 배차 가능 차량을 좁히는 첫 조건입니다. 최근 사용 조합을 선택해도 이 필드들이 먼저 채워지고, 적용 전에는 화물 정보 row에 반영되지 않습니다.",
        qa: ["AC-C5", "AC-CARGO-001"]
      },
      {
        id: "group-required-inputs.cargo-quantity-weight",
        number: 14,
        label: "대수/실중량 입력",
        shortCopy: "대수와 실중량을 입력해 운송 규모와 정산 기준을 보강합니다.",
        event: "setCargoQuantityWeight",
        stateBefore: "new-wizard-active",
        stateAfter: "new-wizard-active",
        targetZone: "wizard-cargo-quantity-weight",
        markerKind: "input-group",
        marker: { x: 58.7, y: 48.0 },
        liveMarkerPlacement: "right",
        focusRect: { x: 31.3, y: 44.0, width: 36.2, height: 7.8 },
        rightDetailKey: "group-required-inputs.cargo-quantity-weight",
        detail: "대수와 실중량은 운송 물량과 금액 산정의 기초값입니다. 실중량 자동값이 있더라도 수정 가능 여부와 validation 범위는 별도로 확인해야 합니다.",
        qa: ["AC-C5", "AC-CARGO-001"]
      },
      {
        id: "group-required-inputs.cargo-item-input",
        number: 15,
        label: "품목 입력",
        shortCopy: "운송 품목명을 입력해 기사 전달과 오더 요약에 쓸 값을 확정합니다.",
        event: "setCargoItemName",
        stateBefore: "new-wizard-active",
        stateAfter: "new-wizard-active",
        targetZone: "wizard-cargo-item",
        markerKind: "input-field",
        marker: { x: 49.4, y: 57.0 },
        liveMarkerPlacement: "above",
        focusRect: { x: 31.3, y: 53.1, width: 36.2, height: 5.6 },
        rightDetailKey: "group-required-inputs.cargo-item-input",
        detail: "품목은 차량 조건과 함께 운송 설명의 핵심 값입니다. 최근 조합 선택으로 채워질 수 있지만, 사용자가 직접 수정한 최종값을 적용 버튼에서 draft로 확정합니다.",
        qa: ["AC-C5", "AC-CARGO-002"]
      },
      {
        id: "group-required-inputs.cargo-recent-combo",
        number: 16,
        label: "최근 조합 선택",
        shortCopy: "최근 사용한 톤수, 차종, 중량, 품목 조합을 입력폼에 채웁니다.",
        event: "selectRecentCargoCombo",
        stateBefore: "new-wizard-active",
        stateAfter: "new-wizard-active",
        targetZone: "wizard-cargo-recent-combo",
        markerKind: "result-row",
        marker: { x: 77.6, y: 47.7 },
        liveMarkerPlacement: "right",
        focusRect: { x: 68.4, y: 37.1, width: 18.5, height: 21.2 },
        rightDetailKey: "group-required-inputs.cargo-recent-combo",
        detail: "최근 조합은 입력폼을 빠르게 채우는 보조 선택입니다. 금액 조건은 포함하지 않고, 운송+품목 적용 전까지 실제 화물 정보에는 반영되지 않습니다.",
        qa: ["AC-C5", "AC-CARGO-002"]
      },
      {
        id: "group-required-inputs.cargo-complete",
        number: 7,
        label: "운송+품목 완료",
        shortCopy: "운송 조건과 품목 정보를 draft에 반영합니다.",
        event: "applyCargoDraft",
        stateBefore: "new-wizard-active",
        stateAfter: "new-wizard-active",
        targetZone: "wizard-cargo-apply",
        markerKind: "action-button",
        marker: { x: 82.0, y: 68.9 },
        liveMarkerPlacement: "above",
        focusRect: { x: 78.3, y: 67.2, width: 7.4, height: 3.3 },
        rightDetailKey: "group-required-inputs.cargo-complete",
        detail: "톤수, 차종, 대수, 실중량, 품목을 wizard draft에 반영합니다.",
        qa: ["AC-C5"]
      },
      {
        id: "group-required-inputs.money-step",
        number: 8,
        label: "금액 단계 표시",
        shortCopy: "process panel에서 금액 step이 current로 표시됩니다.",
        event: "showMoneyStep",
        stateBefore: "new-wizard-active",
        stateAfter: "new-wizard-active",
        targetZone: "wizard-step-money",
        markerKind: "step-item",
        marker: { x: 21.1, y: 58.6 },
        liveMarkerPlacement: "right",
        focusRect: { x: 14.3, y: 56.5, width: 13.6, height: 4.1 },
        rightDetailKey: "group-required-inputs.money-step",
        detail: "운송+품목 완료 후 current step이 금액으로 이동합니다.",
        qa: ["AC-C5"]
      },
      {
        id: "group-required-inputs.money-payment-method",
        number: 18,
        label: "결제방법 선택",
        shortCopy: "인수증, 선불, 착불, 선착불 중 금액 처리 방식을 선택합니다.",
        event: "setPaymentMethod",
        stateBefore: "new-wizard-active",
        stateAfter: "new-wizard-active",
        targetZone: "wizard-money-payment",
        markerKind: "input-field",
        marker: { x: 36.0, y: 39.3 },
        liveMarkerPlacement: "above",
        focusRect: { x: 31.3, y: 35.3, width: 27.3, height: 5.6 },
        rightDetailKey: "group-required-inputs.money-payment-method",
        detail: "결제방법은 청구와 정산의 흐름을 결정하는 필수값입니다. 실제 저장 API는 제외하되, 화면 handoff에서는 선택값이 금액 draft의 시작점임을 표시합니다.",
        qa: ["AC-C5", "AC-D1"]
      },
      {
        id: "group-required-inputs.money-charge-haul",
        number: 19,
        label: "청구/운송 비용 입력",
        shortCopy: "청구비용과 운송비용을 입력해 기본 수익 계산 기준을 만듭니다.",
        event: "setChargeAndHaulAmount",
        stateBefore: "new-wizard-active",
        stateAfter: "new-wizard-active",
        targetZone: "wizard-money-charge-haul",
        markerKind: "money-group",
        marker: { x: 73.2, y: 42.7 },
        liveMarkerPlacement: "right",
        focusRect: { x: 31.3, y: 35.3, width: 55.5, height: 12.5 },
        rightDetailKey: "group-required-inputs.money-charge-haul",
        detail: "청구비용과 운송비용은 수익 계산의 기본값입니다. 청구, 운송, 수익 계산 표시는 같은 금액 단계 안에서 함께 검토해야 합니다.",
        qa: ["AC-C5", "AC-D1"]
      },
      {
        id: "group-required-inputs.money-fee-adjustment",
        number: 20,
        label: "수수료/조정 금액 입력",
        shortCopy: "수수료, 조정 사유, 조정 대상, 조정 금액과 설명을 입력합니다.",
        event: "setFeeAndAdjustment",
        stateBefore: "new-wizard-active",
        stateAfter: "new-wizard-active",
        targetZone: "wizard-money-fee-adjustment",
        markerKind: "money-group",
        marker: { x: 36.0, y: 56.0 },
        liveMarkerPlacement: "left",
        focusRect: { x: 31.3, y: 42.2, width: 55.5, height: 19.4 },
        rightDetailKey: "group-required-inputs.money-fee-adjustment",
        detail: "수수료와 조정 금액은 금액 로그, 권한, 정산 후 수정 정책과 연결됩니다. 그래서 화면에서는 입력 묶음으로 보이지만 오른쪽 detail에서는 `PricingAdjustment`와 보류 정책을 함께 보여줍니다.",
        qa: ["AC-C5", "AC-D1"]
      },
      {
        id: "group-required-inputs.money-complete",
        number: 9,
        label: "금액 완료",
        shortCopy: "정산 정보를 draft에 반영하고 필수 완료 상태로 전환합니다.",
        event: "applyMoneyDraft",
        stateBefore: "new-wizard-active",
        stateAfter: "new-required-complete",
        targetZone: "wizard-money-apply",
        markerKind: "action-button",
        marker: { x: 82.2, y: 70.6 },
        liveMarkerPlacement: "above",
        focusRect: { x: 78.6, y: 69.0, width: 7.1, height: 3.3 },
        rightDetailKey: "group-required-inputs.money-complete",
        detail: "결제방법, 청구/운송 비용, 수수료, 조정 금액을 draft에 반영하고 필수 입력 완료 상태로 이동합니다.",
        qa: ["AC-C5", "AC-D1"]
      },
      {
        id: "group-required-inputs.required-complete",
        number: 10,
        label: "상태: new-required-complete",
        shortCopy: "필수 입력 완료 panel과 다음 행동 분기가 표시됩니다.",
        event: "enterRequiredCompleteState",
        stateBefore: "new-wizard-active",
        stateAfter: "new-required-complete",
        targetZone: "required-complete-panel",
        markerKind: "dialog-surface",
        marker: { x: 58.0, y: 49.8 },
        focusRect: { x: 29.0, y: 35.1, width: 57.8, height: 29.4 },
        rightDetailKey: "group-required-inputs.required-complete",
        detail: "필수 입력이 끝나 new-required-complete 상태가 되고 화물 등록 완료 또는 차주 정보로 이동 분기 panel이 표시됩니다.",
        qa: ["AC-D1"]
      }
    ]
  },
  "new-order.group-amount-branch": {
    centerMode: "live-master-hotspot",
    previewBase: "live-master-fallback-marker",
    master: {
      src: `${MASTER_HTML}?screenmap=1&group=new-order.group-amount-branch`,
      title: "cargo-order-admin-hifi-master 그룹 4 금액 완료 후 분기 preview",
      fallbackImage: "./assets/master-new-order-base.png"
    },
    screenshot: {
      src: "./assets/master-new-order-base.png",
      alt: "cargo-order-admin-hifi-master 금액 완료 후 분기 기준 화면",
      width: 1408,
      height: 662
    },
    mobileFallback: "event-list",
    parts: [
      {
        id: "group-amount-branch.required-complete-panel",
        number: 1,
        label: "필수 입력 완료 안내",
        shortCopy: "금액까지 완료되어 다음 행동을 선택할 수 있는 상태입니다.",
        event: "enterRequiredCompleteState",
        stateBefore: "new-wizard-active",
        stateAfter: "new-required-complete",
        targetZone: "required-complete-panel",
        markerKind: "dialog-surface",
        marker: { x: 58.0, y: 49.8 },
        focusRect: { x: 29.0, y: 35.1, width: 57.8, height: 29.4 },
        rightDetailKey: "group-amount-branch.required-complete-panel",
        detail: "필수 입력이 끝나 `new-required-complete` 상태가 되고, 같은 wizard 안에서 메인 화면 적용 또는 차주 정보 이동을 선택할 수 있습니다.",
        qa: ["AC-D1", "AC-D2"]
      },
      {
        id: "group-amount-branch.api-boundary-note",
        number: 2,
        label: "API 저장 아님 안내",
        shortCopy: "`화물 등록 완료`는 실제 저장이 아니라 메인 화면 적용입니다.",
        event: "showPreApiBoundary",
        stateBefore: "new-required-complete",
        stateAfter: "new-required-complete",
        targetZone: "required-complete-api-boundary",
        markerKind: "detail-panel",
        marker: { x: 76.0, y: 41.0 },
        liveMarkerPlacement: "right",
        focusRect: { x: 32.0, y: 38.0, width: 50.0, height: 9.5 },
        rightDetailKey: "group-amount-branch.api-boundary-note",
        detail: "wizard의 완료 버튼은 API 통신을 만들지 않습니다. 실제 등록 요청은 그룹 6 이후 메인 화면의 `화물 등록` 버튼에서만 다룹니다.",
        qa: ["AC-D3", "AC-D6"]
      },
      {
        id: "group-amount-branch.go-driver",
        number: 3,
        label: "차주 정보로 이동",
        shortCopy: "선택 입력인 차주 정보 단계로 이어집니다.",
        event: "goDriverOptionalStep",
        stateBefore: "new-required-complete",
        stateAfter: "new-driver-optional",
        targetZone: "required-complete-go-driver",
        markerKind: "action-button",
        marker: { x: 72.0, y: 64.0 },
        liveMarkerPlacement: "above",
        focusRect: { x: 66.5, y: 60.0, width: 11.0, height: 5.0 },
        rightDetailKey: "group-amount-branch.go-driver",
        detail: "`차주 정보로 이동`을 선택하면 같은 wizard 안에서 선택 단계인 차주 정보 입력으로 전환됩니다.",
        qa: ["AC-D5", "AC-E1"]
      },
      {
        id: "group-amount-branch.apply-to-main",
        number: 4,
        label: "화물 등록 완료",
        shortCopy: "API 없이 wizard draft를 메인 화면에 적용합니다.",
        event: "applyWizardDraftToMain",
        stateBefore: "new-required-complete",
        stateAfter: "new-submitted",
        targetZone: "required-complete-apply-main",
        markerKind: "action-button",
        marker: { x: 82.5, y: 64.0 },
        liveMarkerPlacement: "above",
        focusRect: { x: 78.0, y: 60.0, width: 9.0, height: 5.0 },
        rightDetailKey: "group-amount-branch.apply-to-main",
        detail: "`화물 등록 완료`는 서버 저장 완료가 아니라 입력 draft를 메인 화면에 적용하는 pre-API 동작입니다.",
        qa: ["AC-D3", "AC-D4"]
      }
    ]
  },
  "new-order.group-driver-choice": {
    centerMode: "live-master-hotspot",
    previewBase: "live-master-fallback-marker",
    master: {
      src: `${MASTER_HTML}?screenmap=1&group=new-order.group-driver-choice`,
      title: "cargo-order-admin-hifi-master 그룹 5 차주 정보 선택 preview",
      fallbackImage: "./assets/master-new-order-base.png"
    },
    screenshot: {
      src: "./assets/master-new-order-base.png",
      alt: "cargo-order-admin-hifi-master 차주 정보 선택 기준 화면",
      width: 1408,
      height: 662
    },
    mobileFallback: "event-list",
    parts: [
      {
        id: "group-driver-choice.driver-step-panel",
        number: 1,
        label: "차주 선택 단계 표시",
        shortCopy: "금액 완료 후 선택 단계인 차주 정보 dialog가 열린 상태입니다.",
        event: "enterDriverOptionalStep",
        stateBefore: "new-required-complete",
        stateAfter: "new-driver-optional",
        targetZone: "driver-step-panel",
        markerKind: "dialog-surface",
        marker: { x: 58.0, y: 49.8 },
        focusRect: { x: 27.0, y: 24.0, width: 61.0, height: 50.0 },
        rightDetailKey: "group-driver-choice.driver-step-panel",
        detail: "`new-driver-optional` 상태에서는 차주 정보가 선택 단계로 표시됩니다. 왼쪽 프로세스 패널은 유지되고, 차주를 선택하거나 건너뛰는 흐름으로 갈라집니다.",
        qa: ["AC-D5", "AC-E1", "AC-E4"]
      },
      {
        id: "group-driver-choice.driver-search-entry",
        number: 2,
        label: "차주/차량 조회 진입",
        shortCopy: "차주명, 차량번호, 연락처, 톤수, 차종 기준으로 차주를 조회합니다.",
        event: "openDriverSearch",
        stateBefore: "new-driver-optional",
        stateAfter: "new-driver-optional",
        targetZone: "driver-search-entry",
        markerKind: "search-control",
        marker: { x: 51.0, y: 36.0 },
        liveMarkerPlacement: "above",
        focusRect: { x: 30.0, y: 32.0, width: 55.0, height: 8.5 },
        rightDetailKey: "group-driver-choice.driver-search-entry",
        detail: "현재 baseline master에서는 `openDriverLookup()`이 기존 `lookup-search` 기반 차주/차량 통합 조회 dialog를 엽니다. 실제 내부 DB API 호출은 하지 않고, 화면에서 조회 진입 UI만 설명합니다.",
        qa: ["AC-E1", "AC-E2"]
      },
      {
        id: "group-driver-choice.hwamulman-result-box",
        number: 3,
        label: "화물맨 배차 결과 박스",
        shortCopy: "화물맨 배차 결과가 상단 고정 결과 박스로 표시되는 위치를 설명합니다.",
        event: "showHwamulmanDispatchResult",
        stateBefore: "new-driver-optional",
        stateAfter: "new-driver-optional",
        targetZone: "driver-hwamulman-result-box",
        markerKind: "result-box",
        marker: { x: 46.0, y: 47.5 },
        liveMarkerPlacement: "right",
        focusRect: { x: 30.0, y: 42.0, width: 37.0, height: 20.0 },
        rightDetailKey: "group-driver-choice.hwamulman-result-box",
        detail: "화물맨은 그룹 5에서 실제 연동 요청/취소 API를 호출하지 않습니다. Screenmap에서는 `화물맨 배차 결과` 박스가 검색어와 무관하게 상단 고정으로 노출되고, 선택 가능한 외부 배차 후보가 표시된다는 화면 의미만 설명합니다.",
        qa: ["AC-E1"]
      },
      {
        id: "group-driver-choice.driver-result-preview",
        number: 4,
        label: "선택 차주/차량 preview",
        shortCopy: "선택한 차주명, 차량번호, 연락처, 톤수, 차종을 적용 전에 확인합니다.",
        event: "previewDriverSelection",
        stateBefore: "new-driver-optional",
        stateAfter: "new-driver-optional",
        targetZone: "driver-result-preview",
        markerKind: "detail-panel",
        marker: { x: 75.0, y: 52.0 },
        liveMarkerPlacement: "right",
        focusRect: { x: 66.0, y: 42.0, width: 20.0, height: 22.0 },
        rightDetailKey: "group-driver-choice.driver-result-preview",
        detail: "`DriverAssignment`에 들어갈 차주명, 연락처, 차량번호, 톤수, 차종을 적용 전에 확인하는 영역입니다. 등록/조회 API 계약은 이 marker에서 다루지 않습니다.",
        qa: ["AC-E2"]
      },
      {
        id: "group-driver-choice.skip-driver",
        number: 5,
        label: "건너뛰기",
        shortCopy: "차주를 지정하지 않아도 메인 화면 적용으로 진행할 수 있습니다.",
        event: "skipDriverAssignment",
        stateBefore: "new-driver-optional",
        stateAfter: "new-submitted",
        targetZone: "driver-skip",
        markerKind: "action-button",
        marker: { x: 70.0, y: 70.0 },
        liveMarkerPlacement: "above",
        focusRect: { x: 66.0, y: 68.0, width: 8.5, height: 4.0 },
        rightDetailKey: "group-driver-choice.skip-driver",
        detail: "`건너뛰기`는 오류나 미완료가 아니라 정상 선택입니다. 차주 미지정 상태로 wizard draft를 메인 화면에 적용하고 `new-submitted`로 이동합니다.",
        qa: ["AC-E1", "AC-E3"]
      },
      {
        id: "group-driver-choice.apply-driver",
        number: 6,
        label: "차주 정보에 적용",
        shortCopy: "선택한 차주 정보를 draft에 포함하고 메인 화면 적용으로 이어집니다.",
        event: "applyDriverAssignment",
        stateBefore: "new-driver-optional",
        stateAfter: "new-submitted",
        targetZone: "driver-apply-main",
        markerKind: "action-button",
        marker: { x: 82.5, y: 70.0 },
        liveMarkerPlacement: "above",
        focusRect: { x: 77.5, y: 68.0, width: 11.0, height: 4.0 },
        rightDetailKey: "group-driver-choice.apply-driver",
        detail: "현재 baseline master의 버튼 문구는 `차주 정보에 적용`입니다. 신규 접수 wizard 안에서는 이 적용 후 wrapper가 `newOrderApplyToMain(\"driver-applied\")`로 이어져 메인 화면 적용 상태가 됩니다.",
        qa: ["AC-E2", "AC-E4"]
      }
    ]
  },
  "new-order.group-main-apply": {
    centerMode: "live-master-hotspot",
    previewBase: "live-master-fallback-marker",
    master: {
      src: `${MASTER_HTML}?screenmap=1&group=new-order.group-main-apply`,
      title: "cargo-order-admin-hifi-master 그룹 6 메인 화면 적용 preview",
      fallbackImage: "./assets/master-new-order-base.png"
    },
    screenshot: {
      src: "./assets/master-new-order-base.png",
      alt: "cargo-order-admin-hifi-master 메인 화면 적용 기준 화면",
      width: 1408,
      height: 662
    },
    mobileFallback: "event-list",
    parts: [
      {
        id: "group-main-apply.status-success",
        number: 1,
        label: "적용 완료 status",
        shortCopy: "입력한 화물 정보가 메인 화면에 적용되었다는 feedback입니다.",
        event: "showMainApplyFeedback",
        stateBefore: "new-required-complete",
        stateAfter: "new-submitted",
        targetZone: "main-apply-status",
        markerKind: "status-bar",
        marker: { x: 50.0, y: 82.0 },
        liveMarkerPlacement: "below",
        focusRect: { x: 8.0, y: 78.0, width: 84.0, height: 6.0 },
        rightDetailKey: "group-main-apply.status-success",
        detail: "`new-submitted` 진입 직후 표시되는 상태 feedback입니다. 여기서도 실제 API 저장은 아직 시작되지 않았고, 메인 `화물 등록` CTA로 최종 등록할 수 있다는 의미만 안내합니다.",
        qa: ["AC-D3", "AC-D4", "AC-D6"]
      },
      {
        id: "group-main-apply.document-view",
        number: 2,
        label: "섹션 헤더 숨김",
        shortCopy: "신규 접수 안내형 번호 헤더가 사라지고 명세서형 보기로 돌아갑니다.",
        event: "switchToDocumentView",
        stateBefore: "new-driver-optional",
        stateAfter: "new-submitted",
        targetZone: "main-document-view",
        markerKind: "layout-state",
        marker: { x: 50.0, y: 36.0 },
        liveMarkerPlacement: "center",
        focusRect: { x: 5.0, y: 14.0, width: 90.0, height: 58.0 },
        rightDetailKey: "group-main-apply.document-view",
        detail: "`new-submitted`에서는 `new-order-flow--guided-entry`가 해제되고 `new-order-flow--document-view`가 적용됩니다. 그 결과 신규 접수용 섹션 번호 헤더와 process panel은 표시되지 않습니다.",
        qa: ["AC-B4", "AC-F2", "AC-F3", "AC-F4"]
      },
      {
        id: "group-main-apply.summary-applied",
        number: 3,
        label: "요약 반영",
        shortCopy: "운송+품목, 경로, 거리 정보가 메인 요약 row에 반영됩니다.",
        event: "renderAppliedSummary",
        stateBefore: "new-required-complete",
        stateAfter: "new-submitted",
        targetZone: "main-summary-applied",
        markerKind: "summary-row",
        marker: { x: 45.0, y: 52.0 },
        liveMarkerPlacement: "right",
        focusRect: { x: 8.0, y: 46.0, width: 62.0, height: 8.0 },
        rightDetailKey: "group-main-apply.summary-applied",
        detail: "wizard draft의 운송 조건, 품목, 경로 요약이 메인 화면의 `화물정보 요약` row에 반영됩니다. 이후 저장 연동은 이 메인 화면 최신 값을 기준으로 해야 하지만, 이 marker에서는 화면 반영까지만 다룹니다.",
        qa: ["AC-D3", "AC-F5"]
      },
      {
        id: "group-main-apply.driver-applied",
        number: 4,
        label: "차주 정보 반영",
        shortCopy: "차주를 선택한 경우 `DriverAssignment`가 메인 차주 정보 영역에 반영됩니다.",
        event: "renderDriverAssignment",
        stateBefore: "new-driver-optional",
        stateAfter: "new-submitted",
        targetZone: "main-driver-applied",
        markerKind: "detail-row",
        marker: { x: 42.0, y: 68.0 },
        liveMarkerPlacement: "right",
        focusRect: { x: 8.0, y: 58.0, width: 64.0, height: 13.0 },
        rightDetailKey: "group-main-apply.driver-applied",
        detail: "차주 선택 흐름을 거친 경우 차주명, 차량번호, 연락처, 톤수, 차종, 출처가 메인 차주 정보 row에 반영됩니다. 차주를 건너뛴 경우에는 그룹 5의 건너뛰기 정책을 따릅니다.",
        qa: ["AC-E2", "AC-F5"]
      },
      {
        id: "group-main-apply.final-submit-cta",
        number: 5,
        label: "메인 화물 등록 CTA",
        shortCopy: "실제 등록을 시작하는 최종 `화물 등록` 버튼이 표시됩니다.",
        event: "revealMainSubmitCta",
        stateBefore: "new-submitted",
        stateAfter: "new-submitted",
        targetZone: "main-final-submit-cta",
        markerKind: "action-button",
        marker: { x: 17.0, y: 88.0 },
        liveMarkerPlacement: "above",
        focusRect: { x: 12.0, y: 84.0, width: 11.0, height: 5.0 },
        rightDetailKey: "group-main-apply.final-submit-cta",
        detail: "이 버튼이 실제 API 통신을 시작하는 최종 CTA입니다. 그룹 6에서는 버튼 표시와 pre-API 경계만 설명하고, 클릭 이후 validation, pending, retry, server error 처리는 별도 API 단계로 남깁니다.",
        qa: ["AC-D6"]
      },
      {
        id: "group-main-apply.independent-edit-entry",
        number: 6,
        label: "독립 수정 진입",
        shortCopy: "적용 후 수정은 wizard 재개가 아니라 각 섹션의 독립 다이얼로그로 진행합니다.",
        event: "openIndependentEditDialog",
        stateBefore: "new-submitted",
        stateAfter: "new-submitted",
        targetZone: "main-independent-edit-entry",
        markerKind: "action-button",
        marker: { x: 86.0, y: 30.0 },
        liveMarkerPlacement: "above",
        focusRect: { x: 78.0, y: 25.0, width: 12.0, height: 5.0 },
        rightDetailKey: "group-main-apply.independent-edit-entry",
        detail: "`new-submitted` 이후의 `변경`/`수정` 버튼은 신규 접수 wizard를 다시 열지 않고 섹션별 독립 다이얼로그를 엽니다. 이때 왼쪽 process panel도 표시되지 않아야 합니다.",
        qa: ["AC-F1", "AC-F2", "AC-F3", "AC-F4"]
      }
    ]
  },
  "edit-order.shipper-edit": {
    centerMode: "live-master-hotspot",
    previewBase: "live-master-fallback-marker",
    master: {
      src: `${MASTER_HTML}?screenmap=1&group=edit-order.shipper-edit`,
      title: "cargo-order-admin-hifi-master 화물 수정 화주 항목 수정 preview",
      fallbackImage: "./assets/master-new-order-base.png"
    },
    screenshot: {
      src: "./assets/master-new-order-base.png",
      alt: "cargo-order-admin-hifi-master 화주 항목 수정 기준 화면",
      width: 1408,
      height: 662
    },
    mobileFallback: "event-list",
    parts: [
      {
        id: "edit-shipper.row-summary",
        number: 1,
        label: "현재 화주 정보 row",
        shortCopy: "선택된 화물에 적용된 화주/담당자 5개 값을 확인합니다.",
        event: "reviewSelectedShipperRow",
        stateBefore: "cargo-selected",
        stateAfter: "cargo-selected",
        targetZone: "selected-shipper-row",
        markerKind: "form-section",
        marker: { x: 43.0, y: 28.0 },
        liveMarkerPlacement: "center",
        focusRect: { x: 7.0, y: 22.0, width: 72.0, height: 8.0 },
        rightDetailKey: "edit-shipper.row-summary",
        detail: "선택 화물 데이터가 메인 화면에 적용된 상태의 화주 정보 row입니다. 업체명, 사업자 번호, 담당자명, 담당자 연락처, 담당자 이메일을 한 줄에서 확인합니다.",
        qa: ["AC-ES-01", "AC-ES-02"]
      },
      {
        id: "edit-shipper.change-entry",
        number: 2,
        label: "화주/담당자 변경",
        shortCopy: "업체명/사업자번호/담당자명을 바꿀 때 통합 조회로 진입합니다.",
        event: "openShipperContactLookup",
        stateBefore: "cargo-selected",
        stateAfter: "dialog-editing",
        targetZone: "shipper-change-entry",
        markerKind: "action-button",
        marker: { x: 87.5, y: 27.0 },
        liveMarkerPlacement: "above",
        focusRect: { x: 80.0, y: 23.5, width: 10.0, height: 4.5 },
        rightDetailKey: "edit-shipper.change-entry",
        detail: "`화주/담당자 변경` 버튼은 화주 식별 정보와 담당자명을 다시 선택하는 독립 dialog 진입점입니다. 적용된 연락처와 이메일의 단순 보정은 이 버튼이 아니라 inline edit로 처리합니다.",
        qa: ["AC-ES-01", "AC-ES-03"]
      },
      {
        id: "edit-shipper.lookup-result",
        number: 3,
        label: "조회 결과 선택",
        shortCopy: "dialog 안 결과 row는 즉시 적용이 아니라 선택 상태를 만듭니다.",
        event: "selectShipperContactCandidate",
        stateBefore: "dialog-editing",
        stateAfter: "dialog-editing",
        targetZone: "shipper-contact-result",
        markerKind: "result-row",
        marker: { x: 43.0, y: 47.0 },
        liveMarkerPlacement: "left",
        focusRect: { x: 24.0, y: 34.0, width: 38.0, height: 23.0 },
        rightDetailKey: "edit-shipper.lookup-result",
        detail: "통합 조회 dialog의 결과 row입니다. row 클릭은 메인 화주 row를 바로 바꾸지 않고, 오른쪽 선택 preview를 갱신하는 선택 동작으로만 봅니다.",
        qa: ["AC-ES-03"]
      },
      {
        id: "edit-shipper.selected-preview",
        number: 4,
        label: "선택 화주/담당자 정보",
        shortCopy: "적용 전 업체와 담당자 정보를 한 번 더 확인합니다.",
        event: "previewSelectedShipperContact",
        stateBefore: "dialog-editing",
        stateAfter: "dialog-editing",
        targetZone: "shipper-contact-preview",
        markerKind: "detail-panel",
        marker: { x: 73.5, y: 42.0 },
        liveMarkerPlacement: "right",
        focusRect: { x: 63.5, y: 34.0, width: 22.0, height: 16.0 },
        rightDetailKey: "edit-shipper.selected-preview",
        detail: "적용 전에 업체명, 사업자 번호, 담당자명, 연락처, 이메일, 역할 chip을 확인하는 preview 영역입니다. 조회 결과 선택과 최종 적용 사이의 확인 단계입니다.",
        qa: ["AC-ES-03"]
      },
      {
        id: "edit-shipper.contact-add",
        number: 5,
        label: "담당자 추가 등록",
        shortCopy: "선택한 화주 맥락에서 새 담당자를 추가하고 자동 선택합니다.",
        event: "addShipperContactDraft",
        stateBefore: "dialog-editing",
        stateAfter: "dialog-editing",
        targetZone: "shipper-contact-add",
        markerKind: "detail-panel",
        marker: { x: 75.0, y: 60.0 },
        liveMarkerPlacement: "right",
        focusRect: { x: 63.5, y: 52.0, width: 22.0, height: 18.0 },
        rightDetailKey: "edit-shipper.contact-add",
        detail: "선택한 화주에 담당자를 추가하는 영역입니다. 신규 담당자는 `신규` 상태로 결과 목록에 추가되고 자동 선택되는 흐름으로 설명합니다.",
        qa: ["AC-ES-03"]
      },
      {
        id: "edit-shipper.contact-phone-inline",
        number: 6,
        label: "담당자 연락처 수정",
        shortCopy: "적용된 row에서 연락처만 같은 위치의 input으로 전환합니다.",
        event: "editShipperContactPhoneInline",
        stateBefore: "cargo-selected",
        stateAfter: "field-editing",
        targetZone: "shipper-phone-inline",
        markerKind: "input-field",
        marker: { x: 60.0, y: 27.0 },
        liveMarkerPlacement: "above",
        focusRect: { x: 55.0, y: 23.5, width: 10.0, height: 4.5 },
        rightDetailKey: "edit-shipper.contact-phone-inline",
        detail: "담당자 연락처 값만 inline input으로 전환합니다. `Enter` 또는 blur는 표시값 반영, `Escape`는 수정 전 값 복구로 설명합니다.",
        qa: ["AC-ES-02", "AC-ES-05"]
      },
      {
        id: "edit-shipper.contact-email-inline",
        number: 7,
        label: "담당자 이메일 수정",
        shortCopy: "적용된 row에서 이메일만 같은 위치의 input으로 전환합니다.",
        event: "editShipperContactEmailInline",
        stateBefore: "cargo-selected",
        stateAfter: "field-editing",
        targetZone: "shipper-email-inline",
        markerKind: "input-field",
        marker: { x: 72.0, y: 27.0 },
        liveMarkerPlacement: "above",
        focusRect: { x: 66.5, y: 23.5, width: 12.0, height: 4.5 },
        rightDetailKey: "edit-shipper.contact-email-inline",
        detail: "담당자 이메일 값만 inline input으로 전환합니다. 이메일 형식 오류, 빈 값 허용 여부, 마스킹 정책은 후속 확인 항목으로 남깁니다.",
        qa: ["AC-ES-02", "AC-ES-05"]
      }
    ]
  },
  "edit-order.route-edit": {
    centerMode: "live-master-hotspot",
    previewBase: "live-master-fallback-marker",
    master: {
      src: `${MASTER_HTML}?screenmap=1&group=edit-order.route-edit`,
      title: "cargo-order-admin-hifi-master 화물 수정 운송 구간 수정 preview",
      fallbackImage: "./assets/master-new-order-base.png"
    },
    screenshot: {
      src: "./assets/master-new-order-base.png",
      alt: "cargo-order-admin-hifi-master 운송 구간 수정 기준 화면",
      width: 1408,
      height: 662
    },
    mobileFallback: "event-list",
    parts: [
      {
        id: "edit-route.row-summary",
        number: 1,
        label: "상차/하차 현재 row",
        shortCopy: "선택 화물에 적용된 운송 구간 2행을 먼저 확인합니다.",
        event: "reviewSelectedRouteRows",
        stateBefore: "cargo-selected",
        stateAfter: "cargo-selected",
        targetZone: "selected-route-rows",
        markerKind: "form-section",
        marker: { x: 43.0, y: 38.0 },
        liveMarkerPlacement: "center",
        focusRect: { x: 7.0, y: 31.5, width: 83.0, height: 14.0 },
        rightDetailKey: "edit-route.row-summary",
        detail: "운송 구간의 기준 상태입니다. 상차 row와 하차 row는 장소명, 행정주소, 상세주소, 담당, 연락처, 일시, 방법을 같은 구조로 보여줍니다.",
        qa: ["AC-ER-01", "AC-ER-02"]
      },
      {
        id: "edit-route.load-address-dialog",
        number: 2,
        label: "상차지 주소 변경",
        shortCopy: "상차 row의 주소 변경은 주소 검색 dialog에서 후보를 선택합니다.",
        event: "openLoadAddressLookup",
        stateBefore: "cargo-selected",
        stateAfter: "dialog-editing",
        targetZone: "load-address-dialog",
        markerKind: "dialog-surface",
        marker: { x: 46.0, y: 47.0 },
        liveMarkerPlacement: "left",
        focusRect: { x: 24.0, y: 34.0, width: 38.0, height: 23.0 },
        rightDetailKey: "edit-route.load-address-dialog",
        detail: "상차지 주소 검색 dialog입니다. 최근 사용, 화주 등록, Kakao 후보를 한 결과 목록으로 보여주고, row 선택은 적용 전 preview를 갱신합니다.",
        qa: ["AC-ER-03", "AC-ADDR-001", "AC-ADDR-002"]
      },
      {
        id: "edit-route.load-inline-fields",
        number: 3,
        label: "상차 상세/담당/조건 수정",
        shortCopy: "상차 row 안에서 상세주소, 담당, 연락처, 일시, 방법을 보정합니다.",
        event: "editLoadRouteInlineFields",
        stateBefore: "cargo-selected",
        stateAfter: "field-editing",
        targetZone: "load-inline-fields",
        markerKind: "input-field",
        marker: { x: 61.0, y: 35.0 },
        liveMarkerPlacement: "above",
        focusRect: { x: 38.0, y: 32.0, width: 43.0, height: 5.0 },
        rightDetailKey: "edit-route.load-inline-fields",
        detail: "상차 상세주소, 담당, 연락처는 같은 row에서 inline input으로 전환됩니다. 일시와 방법은 row 안의 조건 cell을 눌러 빠른 선택 popover로 바꿉니다.",
        qa: ["AC-ER-04", "AC-ER-05"]
      },
      {
        id: "edit-route.unload-address-dialog",
        number: 4,
        label: "하차지 주소 변경",
        shortCopy: "하차 row의 주소 변경은 하차 전용 주소 검색 dialog에서 처리합니다.",
        event: "openUnloadAddressLookup",
        stateBefore: "cargo-selected",
        stateAfter: "dialog-editing",
        targetZone: "unload-address-dialog",
        markerKind: "dialog-surface",
        marker: { x: 46.0, y: 55.0 },
        liveMarkerPlacement: "left",
        focusRect: { x: 24.0, y: 34.0, width: 38.0, height: 23.0 },
        rightDetailKey: "edit-route.unload-address-dialog",
        detail: "하차지 주소 검색 dialog입니다. 상차와 같은 UI를 쓰지만 `하차지 적용`으로 확정되어야 하며, 상차 주소를 덮어쓰지 않아야 합니다.",
        qa: ["AC-ER-03", "AC-ADDR-001", "AC-ADDR-002"]
      },
      {
        id: "edit-route.unload-inline-fields",
        number: 5,
        label: "하차 상세/담당/조건 수정",
        shortCopy: "하차 row 안에서 상세주소, 담당, 연락처, 일시, 방법을 보정합니다.",
        event: "editUnloadRouteInlineFields",
        stateBefore: "cargo-selected",
        stateAfter: "field-editing",
        targetZone: "unload-inline-fields",
        markerKind: "input-field",
        marker: { x: 61.0, y: 43.0 },
        liveMarkerPlacement: "above",
        focusRect: { x: 38.0, y: 40.0, width: 43.0, height: 5.0 },
        rightDetailKey: "edit-route.unload-inline-fields",
        detail: "하차 상세주소, 담당, 연락처는 하차 row의 값만 수정합니다. 하차 일시는 `당일`, `내일`, `월착`, `지정` 후보를 가지므로 상차 일시 후보와 구분됩니다.",
        qa: ["AC-ER-04", "AC-ER-05"]
      },
      {
        id: "edit-route.recalc-notice",
        number: 6,
        label: "거리/기준금액 확인",
        shortCopy: "주소 변경 후 거리와 기준금액을 다시 확인해야 하는 위치입니다.",
        event: "reviewRouteRecalculationState",
        stateBefore: "edit-applied",
        stateAfter: "cargo-selected",
        targetZone: "route-recalc-state",
        markerKind: "status-badge",
        marker: { x: 78.0, y: 5.5 },
        liveMarkerPlacement: "below",
        focusRect: { x: 73.0, y: 2.0, width: 15.0, height: 4.5 },
        rightDetailKey: "edit-route.recalc-notice",
        detail: "주소가 바뀌면 거리와 기준금액 표시가 stale 상태가 될 수 있습니다. 이번 screenmap에서는 실제 계산 호출을 다루지 않고, header의 거리/기준 chip과 요약이 다시 확인되어야 한다는 경계만 표시합니다.",
        qa: ["AC-ER-06"]
      }
    ]
  },
  "edit-order.cargo-money-edit": {
    centerMode: "live-master-hotspot",
    previewBase: "live-master-fallback-marker",
    master: {
      src: `${MASTER_HTML}?screenmap=1&group=edit-order.cargo-money-edit`,
      title: "cargo-order-admin-hifi-master 화물 수정 운송+품목/금액 수정 preview",
      fallbackImage: "./assets/master-new-order-base.png"
    },
    screenshot: {
      src: "./assets/master-new-order-base.png",
      alt: "cargo-order-admin-hifi-master 운송+품목/금액 수정 기준 화면",
      width: 1408,
      height: 662
    },
    mobileFallback: "event-list",
    parts: [
      {
        id: "edit-cargo-money.transport-dialog",
        number: 1,
        label: "운송+품목 입력 dialog",
        shortCopy: "톤수, 차종, 대수, 실중량, 품목을 한 번에 수정합니다.",
        event: "openCargoTransportDialog",
        stateBefore: "cargo-selected",
        stateAfter: "dialog-editing",
        targetZone: "cargo-transport-dialog",
        markerKind: "dialog-surface",
        marker: { x: 45.0, y: 48.0 },
        liveMarkerPlacement: "left",
        focusRect: { x: 25.0, y: 29.0, width: 38.0, height: 31.0 },
        rightDetailKey: "edit-cargo-money.transport-dialog",
        detail: "운송+품목 입력 dialog의 주 입력 영역입니다. 톤수, 차종, 대수, 실중량, 품목은 적용 전까지 메인 row에 반영되지 않습니다.",
        qa: ["AC-ECM-01"]
      },
      {
        id: "edit-cargo-money.recent-combo",
        number: 2,
        label: "최근 조합 선택",
        shortCopy: "최근 사용 조합은 입력폼을 채우는 보조 선택입니다.",
        event: "pickRecentCargoCombo",
        stateBefore: "dialog-editing",
        stateAfter: "dialog-editing",
        targetZone: "cargo-recent-combo",
        markerKind: "result-row",
        marker: { x: 74.0, y: 45.0 },
        liveMarkerPlacement: "right",
        focusRect: { x: 64.0, y: 31.0, width: 23.0, height: 27.0 },
        rightDetailKey: "edit-cargo-money.recent-combo",
        detail: "최근 조합 row는 즉시 적용이 아니라 입력폼 값을 채우는 shortcut입니다. 최종 반영은 `운송+품목 적용` 버튼이 담당합니다.",
        qa: ["AC-ECM-02"]
      },
      {
        id: "edit-cargo-money.transport-row",
        number: 3,
        label: "운송 조건 row",
        shortCopy: "적용 후 톤수, 차종, 대수, 실중량을 같은 row에서 확인합니다.",
        event: "reviewTransportConditionRow",
        stateBefore: "dialog-editing",
        stateAfter: "field-editing",
        targetZone: "cargo-transport-row",
        markerKind: "form-section",
        marker: { x: 44.0, y: 51.0 },
        liveMarkerPlacement: "center",
        focusRect: { x: 8.0, y: 45.5, width: 65.0, height: 6.0 },
        rightDetailKey: "edit-cargo-money.transport-row",
        detail: "적용된 운송 조건 row입니다. 톤수와 차종 변경은 운송구간 기준금액 재확인 후보가 되고, 실중량은 자동값을 직접 수정할 수 있는 값입니다.",
        qa: ["AC-ECM-03"]
      },
      {
        id: "edit-cargo-money.item-row",
        number: 4,
        label: "품목 row",
        shortCopy: "품목은 금액이 아니라 운송+품목의 2번째 row에 남습니다.",
        event: "editCargoItemRow",
        stateBefore: "field-editing",
        stateAfter: "field-editing",
        targetZone: "cargo-item-row",
        markerKind: "input-field",
        marker: { x: 44.0, y: 56.0 },
        liveMarkerPlacement: "above",
        focusRect: { x: 8.0, y: 52.0, width: 65.0, height: 5.0 },
        rightDetailKey: "edit-cargo-money.item-row",
        detail: "품목 row는 화물정보 요약의 핵심 원본입니다. 금액 조건과 시각적으로 분리되어야 하며, inline edit는 같은 row 안에서 이루어집니다.",
        qa: ["AC-ECM-04"]
      },
      {
        id: "edit-cargo-money.money-dialog",
        number: 5,
        label: "금액 입력 dialog",
        shortCopy: "결제방법, 청구비용, 운송비용, 수수료, 조정금을 수정합니다.",
        event: "openMoneyInputDialog",
        stateBefore: "field-editing",
        stateAfter: "dialog-editing",
        targetZone: "cargo-money-dialog",
        markerKind: "dialog-surface",
        marker: { x: 45.0, y: 48.0 },
        liveMarkerPlacement: "left",
        focusRect: { x: 25.0, y: 29.0, width: 38.0, height: 31.0 },
        rightDetailKey: "edit-cargo-money.money-dialog",
        detail: "금액 입력 dialog의 주 입력 영역입니다. 결제방법은 수수료 표시 여부와 계산 결과 라벨을 바꾸는 제어값입니다.",
        qa: ["AC-ECM-05"]
      },
      {
        id: "edit-cargo-money.money-preview",
        number: 6,
        label: "금액 계산 preview",
        shortCopy: "적용 전 수익 또는 차주운임 계산식을 확인합니다.",
        event: "previewMoneyFormula",
        stateBefore: "dialog-editing",
        stateAfter: "dialog-editing",
        targetZone: "cargo-money-preview",
        markerKind: "status-badge",
        marker: { x: 52.0, y: 63.0 },
        liveMarkerPlacement: "below",
        focusRect: { x: 25.0, y: 60.0, width: 38.0, height: 6.0 },
        rightDetailKey: "edit-cargo-money.money-preview",
        detail: "금액 계산 preview는 적용 전 확인 영역입니다. 인수증은 `수익 = 청구 - 운송`, 그 외 조건은 `차주운임 = 운송 + 수수료`로 설명합니다.",
        qa: ["AC-ECM-06"]
      },
      {
        id: "edit-cargo-money.money-row",
        number: 7,
        label: "금액 row / 계산값 readonly",
        shortCopy: "적용 후 금액 row와 계산값 read-only 구분을 확인합니다.",
        event: "reviewMoneyRowReadonly",
        stateBefore: "dialog-editing",
        stateAfter: "field-editing",
        targetZone: "cargo-money-row",
        markerKind: "form-section",
        marker: { x: 45.0, y: 62.0 },
        liveMarkerPlacement: "center",
        focusRect: { x: 8.0, y: 58.0, width: 65.0, height: 6.0 },
        rightDetailKey: "edit-cargo-money.money-row",
        detail: "적용된 금액 row입니다. 청구비용, 운송비용, 수수료는 값 표시 대상이고, `수익` 또는 `차주운임`은 계산값이므로 직접 수정 대상처럼 보이면 안 됩니다.",
        qa: ["AC-ECM-07"]
      }
    ]
  },
  "edit-order.driver-edit": {
    centerMode: "live-master-hotspot",
    previewBase: "live-master-fallback-marker",
    master: {
      src: `${MASTER_HTML}?screenmap=1&group=edit-order.driver-edit`,
      title: "cargo-order-admin-hifi-master 화물 수정 차주 정보 수정 preview",
      fallbackImage: "./assets/master-new-order-base.png"
    },
    screenshot: {
      src: "./assets/master-new-order-base.png",
      alt: "cargo-order-admin-hifi-master 차주 정보 수정 기준 화면",
      width: 1408,
      height: 662
    },
    mobileFallback: "event-list",
    parts: [
      {
        id: "edit-driver.row-summary",
        number: 1,
        label: "차주 현재 row",
        shortCopy: "선택 화물에 적용된 차주/차량 정보를 먼저 확인합니다.",
        event: "reviewDriverRow",
        stateBefore: "cargo-selected",
        stateAfter: "cargo-selected",
        targetZone: "driver-row-summary",
        markerKind: "form-section",
        marker: { x: 45.0, y: 70.0 },
        liveMarkerPlacement: "center",
        focusRect: { x: 8.0, y: 65.0, width: 72.0, height: 10.0 },
        rightDetailKey: "edit-driver.row-summary",
        detail: "적용된 차주 row입니다. 차주명과 차량번호는 식별값이라 dialog 변경 대상이고, 연락처, 톤수, 차종은 현재 오더 기준 보정 대상입니다.",
        qa: ["AC-ED-01", "AC-ED-07"]
      },
      {
        id: "edit-driver.change-dialog",
        number: 2,
        label: "차주/차량 변경 dialog",
        shortCopy: "차주/차량 변경은 통합 조회 dialog에서 처리합니다.",
        event: "openDriverLookup",
        stateBefore: "cargo-selected",
        stateAfter: "dialog-editing",
        targetZone: "driver-change-dialog",
        markerKind: "dialog-surface",
        marker: { x: 45.0, y: 48.0 },
        liveMarkerPlacement: "left",
        focusRect: { x: 24.0, y: 29.0, width: 63.0, height: 34.0 },
        rightDetailKey: "edit-driver.change-dialog",
        detail: "차주/차량 통합 조회 dialog입니다. 내부 DB 조회와 화물맨 배차 결과를 같은 dialog에서 비교하고, 적용 전까지 메인 row 값은 유지됩니다.",
        qa: ["AC-ED-02"]
      },
      {
        id: "edit-driver.internal-result",
        number: 3,
        label: "내부 DB 결과",
        shortCopy: "내부 DB 차주/차량 후보 row를 선택합니다.",
        event: "driverSearch",
        stateBefore: "dialog-editing",
        stateAfter: "dialog-editing",
        targetZone: "driver-internal-result",
        markerKind: "result-row",
        marker: { x: 43.0, y: 52.0 },
        liveMarkerPlacement: "right",
        focusRect: { x: 25.0, y: 46.0, width: 39.0, height: 14.0 },
        rightDetailKey: "edit-driver.internal-result",
        detail: "내부 DB 결과 목록입니다. 차주명, 차량번호, 연락처, 톤수, 차종, 최근 운행 정보를 한 행에서 비교하고 선택합니다.",
        qa: ["AC-ED-03"]
      },
      {
        id: "edit-driver.hwamulman-result",
        number: 4,
        label: "화물맨 배차 결과",
        shortCopy: "화물맨 배차 결과는 검색어와 무관하게 상단 고정됩니다.",
        event: "driverSetHwamulmanMode",
        stateBefore: "dialog-editing",
        stateAfter: "dialog-editing",
        targetZone: "driver-hwamulman-result",
        markerKind: "result-box",
        marker: { x: 43.0, y: 40.0 },
        liveMarkerPlacement: "right",
        focusRect: { x: 25.0, y: 35.0, width: 39.0, height: 12.0 },
        rightDetailKey: "edit-driver.hwamulman-result",
        detail: "화물맨 배차 결과 박스입니다. 실제 화물맨 API 호출은 제외하고, 배차완료 차주를 조회 목록 상단에 고정해 선택할 수 있다는 UI 의미만 설명합니다.",
        qa: ["AC-ED-04"]
      },
      {
        id: "edit-driver.selected-preview",
        number: 5,
        label: "선택 preview",
        shortCopy: "선택한 차주/차량 정보를 적용 전에 확인합니다.",
        event: "pickDriverRow",
        stateBefore: "dialog-editing",
        stateAfter: "dialog-editing",
        targetZone: "driver-selected-preview",
        markerKind: "detail-panel",
        marker: { x: 74.0, y: 50.0 },
        liveMarkerPlacement: "left",
        focusRect: { x: 65.0, y: 35.0, width: 22.0, height: 27.0 },
        rightDetailKey: "edit-driver.selected-preview",
        detail: "선택 preview입니다. 차주명, 차량번호, 연락처, 톤수, 차종, 출처, 상태를 적용 전에 확인하고 `차주 정보에 적용` 버튼 활성화를 판단합니다.",
        qa: ["AC-ED-05"]
      },
      {
        id: "edit-driver.register-form",
        number: 6,
        label: "차주 등록",
        shortCopy: "조회 결과가 없거나 신규 차주가 필요하면 등록 form으로 전환합니다.",
        event: "openDriverRegisterForm",
        stateBefore: "dialog-editing",
        stateAfter: "dialog-editing",
        targetZone: "driver-register-form",
        markerKind: "detail-panel",
        marker: { x: 74.0, y: 52.0 },
        liveMarkerPlacement: "left",
        focusRect: { x: 65.0, y: 36.0, width: 22.0, height: 27.0 },
        rightDetailKey: "edit-driver.register-form",
        detail: "차주 등록 form입니다. 등록 form이 열리면 선택 preview와 동시에 보이지 않아야 하며, 저장 위치와 중복 검증은 아직 API 보류 항목입니다.",
        qa: ["AC-ED-06"]
      },
      {
        id: "edit-driver.contact-inline",
        number: 7,
        label: "연락처 inline 보정",
        shortCopy: "적용 후 row에서 차주 연락처만 현재 오더 기준으로 보정합니다.",
        event: "editDriverContactInline",
        stateBefore: "cargo-selected",
        stateAfter: "field-editing",
        targetZone: "driver-contact-inline",
        markerKind: "input-field",
        marker: { x: 39.0, y: 70.0 },
        liveMarkerPlacement: "above",
        focusRect: { x: 34.0, y: 66.0, width: 12.0, height: 5.0 },
        rightDetailKey: "edit-driver.contact-inline",
        detail: "차주 연락처는 적용된 row에서 input으로 보정합니다. 차주 마스터의 영구 수정이 아니라 현재 오더 기준 보정값으로 다룹니다.",
        qa: ["AC-ED-07"]
      },
      {
        id: "edit-driver.ton-inline",
        number: 8,
        label: "톤수 inline 보정",
        shortCopy: "차주 차량 톤수는 현재 오더 기준 select로 보정합니다.",
        event: "editDriverTonInline",
        stateBefore: "cargo-selected",
        stateAfter: "field-editing",
        targetZone: "driver-ton-inline",
        markerKind: "input-field",
        marker: { x: 31.0, y: 73.0 },
        liveMarkerPlacement: "above",
        focusRect: { x: 24.0, y: 71.0, width: 13.0, height: 5.0 },
        rightDetailKey: "edit-driver.ton-inline",
        detail: "톤수는 차주 차량 스펙이지만 현재 오더 기준으로 보정할 수 있는 값입니다. 운송+품목의 톤수 요구 조건과 mismatch validation은 아직 확인 필요 항목입니다.",
        qa: ["AC-ED-08"]
      },
      {
        id: "edit-driver.type-inline",
        number: 9,
        label: "차종 inline 보정",
        shortCopy: "차주 차량 차종은 현재 오더 기준 select로 보정합니다.",
        event: "editDriverTypeInline",
        stateBefore: "cargo-selected",
        stateAfter: "field-editing",
        targetZone: "driver-type-inline",
        markerKind: "input-field",
        marker: { x: 45.0, y: 73.0 },
        liveMarkerPlacement: "above",
        focusRect: { x: 38.0, y: 71.0, width: 13.0, height: 5.0 },
        rightDetailKey: "edit-driver.type-inline",
        detail: "차종은 차주 차량 스펙이지만 현재 오더 기준으로 보정할 수 있는 값입니다. 차주명과 차량번호처럼 식별값을 직접 바꾸는 항목은 아니며, 조회 dialog 변경과 구분합니다.",
        qa: ["AC-ED-09"]
      }
    ]
  },
  "edit-order.apply-review": {
    centerMode: "live-master-hotspot",
    previewBase: "live-master-fallback-marker",
    master: {
      src: `${MASTER_HTML}?screenmap=1&group=edit-order.apply-review`,
      title: "cargo-order-admin-hifi-master 화물 수정 수정값 반영 확인 preview",
      fallbackImage: "./assets/master-new-order-base.png"
    },
    screenshot: {
      src: "./assets/master-new-order-base.png",
      alt: "cargo-order-admin-hifi-master 수정값 반영 확인 기준 화면",
      width: 1408,
      height: 662
    },
    mobileFallback: "event-list",
    parts: [
      {
        id: "edit-apply-review.change-feedback",
        number: 1,
        label: "변경 feedback",
        shortCopy: "독립 수정 적용 후 화면 상단 status feedback을 확인합니다.",
        event: "applyIndependentEdit",
        stateBefore: "cargo-selected",
        stateAfter: "edit-applied",
        targetZone: "edit-change-feedback",
        markerKind: "status-badge",
        marker: { x: 49.0, y: 8.0 },
        liveMarkerPlacement: "below",
        focusRect: { x: 35.0, y: 4.0, width: 30.0, height: 5.0 },
        rightDetailKey: "edit-apply-review.change-feedback",
        detail: "독립 수정 적용 후 표시되는 feedback입니다. 사용자는 이 message로 메인 화면의 draft 값이 바뀌었음을 확인하지만, 실제 저장 API는 아직 실행되지 않았습니다.",
        qa: ["AC-EAR-01"]
      },
      {
        id: "edit-apply-review.updated-row",
        number: 2,
        label: "수정 row 반영",
        shortCopy: "적용된 수정값이 메인 row에 반영되었는지 확인합니다.",
        event: "reviewUpdatedRow",
        stateBefore: "edit-applied",
        stateAfter: "edit-applied",
        targetZone: "edit-updated-row",
        markerKind: "form-section",
        marker: { x: 44.0, y: 51.0 },
        liveMarkerPlacement: "center",
        focusRect: { x: 8.0, y: 45.5, width: 65.0, height: 6.0 },
        rightDetailKey: "edit-apply-review.updated-row",
        detail: "수정 반영 확인용 샘플 row입니다. screenmap에서는 운송+품목 독립 수정 적용을 사용해 메인 row가 최신 draft 값을 표시하는지 확인합니다.",
        qa: ["AC-EAR-02"]
      },
      {
        id: "edit-apply-review.final-submit-cta",
        number: 3,
        label: "최종 화물 등록 CTA",
        shortCopy: "수정값 반영 후 실제 저장 전 최종 CTA가 보이는지 확인합니다.",
        event: "reviewFinalSubmitCta",
        stateBefore: "edit-applied",
        stateAfter: "edit-applied",
        targetZone: "edit-final-submit-cta",
        markerKind: "action-button",
        marker: { x: 17.0, y: 88.0 },
        liveMarkerPlacement: "above",
        focusRect: { x: 12.0, y: 84.0, width: 11.0, height: 5.0 },
        rightDetailKey: "edit-apply-review.final-submit-cta",
        detail: "`화물 등록` CTA는 실제 저장 API를 시작하는 경계입니다. 이 node에서는 버튼 표시와 pre-API 상태만 다루고, validation/pending/retry/server error는 API 단계로 남깁니다.",
        qa: ["AC-EAR-03"]
      },
      {
        id: "edit-apply-review.cancel-boundary",
        number: 4,
        label: "취소 경계",
        shortCopy: "dialog의 취소는 적용 전 값을 유지하는 경계입니다.",
        event: "openEditDialogAndCancel",
        stateBefore: "cargo-selected",
        stateAfter: "edit-cancelled",
        targetZone: "edit-cancel-boundary",
        markerKind: "action-button",
        marker: { x: 57.0, y: 72.0 },
        liveMarkerPlacement: "above",
        focusRect: { x: 51.0, y: 69.0, width: 9.0, height: 5.0 },
        rightDetailKey: "edit-apply-review.cancel-boundary",
        detail: "수정 dialog의 `취소` 버튼입니다. 취소는 저장 전 값을 유지하는 경계이며, 이미 적용된 다른 수정값이나 최종 CTA 상태를 되돌리는 동작으로 설명하지 않습니다.",
        qa: ["AC-EAR-04"]
      },
      {
        id: "edit-apply-review.list-update-pending",
        number: 5,
        label: "목록 갱신 보류",
        shortCopy: "목록 row 갱신 시점은 아직 정책 확인 항목으로 둡니다.",
        event: "reviewListUpdatePolicy",
        stateBefore: "edit-applied",
        stateAfter: "edit-applied",
        targetZone: "edit-list-update-policy",
        markerKind: "status-badge",
        marker: { x: 42.0, y: 88.0 },
        liveMarkerPlacement: "above",
        focusRect: { x: 5.0, y: 82.0, width: 72.0, height: 8.0 },
        rightDetailKey: "edit-apply-review.list-update-pending",
        detail: "하단 `cargo-list`는 core view에서 계속 숨깁니다. 목록 row 갱신은 즉시 갱신, 저장 성공 후 갱신, 재조회 중 어느 정책인지 확정되지 않았으므로 보류 항목으로 표시합니다.",
        qa: ["AC-EAR-05"]
      }
    ]
  }
};

const requiredInputBasePreview = centerPreviewMaps["new-order.group-required-inputs"];

if (requiredInputBasePreview) {
  requiredInputSplitGroups.forEach((group) => {
    const splitParts = group.partIds
      .map((partId, index) => {
        const sourcePart = requiredInputBasePreview.parts.find((part) => part.id === partId);
        const overrides = group.partOverrides?.[partId] || {};
        return sourcePart ? { ...sourcePart, ...overrides, number: index + 1 } : null;
      })
      .filter(Boolean);

    centerPreviewMaps[group.id] = {
      ...requiredInputBasePreview,
      master: {
        ...requiredInputBasePreview.master,
        src: `${MASTER_HTML}?screenmap=1&group=${group.id}`,
        title: `cargo-order-admin-hifi-master ${group.label} preview`
      },
      parts: splitParts
    };
  });
}

const screenStates = [
  { id: "idle-edit", label: "기본/화물 수정 상태", entry: "초기 화면, 기존 화물 선택, 등록 완료 후 일반 상태" },
  { id: "new-reset", label: "신규 접수 초기화", entry: "신규(F3) 클릭" },
  { id: "new-wizard-active", label: "신규 접수 wizard 진행", entry: "화주 정보 입력 시작" },
  { id: "new-required-complete", label: "필수 입력 완료", entry: "금액 단계 validation 통과" },
  { id: "new-driver-optional", label: "차주 선택 단계", entry: "차주 정보로 이동 선택" },
  { id: "new-submitted", label: "메인 화면 적용 완료, pre-API", entry: "화물 등록 완료 또는 차주 단계 완료" },
  { id: "submit-validating", label: "최종 validation", entry: "메인 화물 등록 클릭" },
  { id: "submit-pending", label: "API 통신 중", entry: "validation 통과" },
  { id: "submit-failed", label: "등록 실패", entry: "API 실패 또는 server validation 실패" },
  { id: "submit-complete", label: "등록 완료", entry: "API 성공" }
];

const dataContracts = {
  CargoOrder: {
    fields: ["cargoId", "status", "processedAt", "displayPolicy", "urgentFlag", "reservationFlag", "stopoverFlag"],
    usedBy: ["Header", "오더 요약", "화물 목록", "main-submit"]
  },
  Requester: {
    fields: ["requesterName", "requesterType", "businessNumber", "contactPhone", "managerName"],
    usedBy: ["화주 정보", "validation"]
  },
  ContactPerson: {
    fields: ["contactId", "requesterId", "contactName", "phone", "email", "roles", "isPrimary"],
    usedBy: ["화주 정보", "화주/담당자 조회", "담당자 추가"]
  },
  Location: {
    fields: ["side", "region1", "region2", "region3", "detailAddress", "managerName", "contactPhone"],
    usedBy: ["운송 구간", "주소 최근", "지도"]
  },
  RouteSummary: {
    fields: ["loadPoint", "unloadPoint", "distanceKm", "baseAmount", "summaryText"],
    usedBy: ["운송 구간 row", "Header", "화물정보 요약"]
  },
  RouteLocationDraft: {
    fields: ["side", "source", "placeName", "address", "detailAddress", "managerName", "managerPhone"],
    usedBy: ["주소 검색 dialog", "선택 preview", "상차/하차 적용"]
  },
  RouteInlineEditDraft: {
    fields: ["side", "fieldKey", "beforeValue", "draftValue", "commitTrigger"],
    usedBy: ["상차 row inline edit", "하차 row inline edit"]
  },
  RouteConditionDraft: {
    fields: ["side", "timePreset", "scheduledAt", "handlingMethod"],
    usedBy: ["일시/방법 cell", "조건 popover", "운송 구간 row"]
  },
  RouteRecalcState: {
    fields: ["routeChanged", "distanceStatus", "baseAmountStatus", "staleReason"],
    usedBy: ["Header 거리/기준 chip", "화물정보 요약", "validation"]
  },
  HandlingCondition: {
    fields: ["side", "scheduledAtPreset", "scheduledAt", "handlingMethod", "saveToAddressBook", "detailEditSource"],
    usedBy: ["상차지", "하차지", "주소 선택 preview", "validation"]
  },
  VehicleRequirement: {
    fields: ["tonnage", "vehicleType", "wideOption", "quantity", "exclusiveOrMixed"],
    usedBy: ["화물 정보", "운송+품목 최근"]
  },
  CargoDetail: {
    fields: ["itemName", "actualWeight", "cargoMemo", "extraInfo", "specialNotes"],
    usedBy: ["화물 정보", "오더 요약"]
  },
  Pricing: {
    fields: ["paymentMethod", "baseChargeAmount", "baseDispatchAmount", "feeAmount", "totalAmount", "profitAmount"],
    usedBy: ["정산 정보", "금액 로그", "main-submit"]
  },
  PricingAdjustment: {
    fields: ["id", "reasonCode", "targetType", "amountSigned", "note", "actorName", "changedAt"],
    usedBy: ["정산 정보", "금액 로그"]
  },
  NewOrderDraft: {
    fields: ["requester", "loadLocation", "unloadLocation", "cargoDetail", "pricing", "driverAssignment"],
    usedBy: ["신규 접수 wizard", "메인 화면 적용", "pre-API 확인"]
  },
  BranchDecision: {
    fields: ["choice", "fromState", "toState", "apiRequestCreated"],
    usedBy: ["금액 완료 후 분기", "차주 선택 단계", "메인 화면 적용"]
  },
  RecentLocation: {
    fields: ["side", "placeName", "address", "detailAddress", "source", "lastUsedAt", "privacyDisplayMode"],
    usedBy: ["주소 검색 다이얼로그"]
  },
  RecentCargoCombo: {
    fields: ["tonnage", "vehicleType", "quantity", "actualWeight", "itemName", "lastUsedAt", "dedupeKey"],
    usedBy: ["운송+품목 다이얼로그"]
  },
  CargoMemo: {
    fields: ["id", "orderId", "type", "content", "authorName", "createdAt", "permission"],
    usedBy: ["보조 정보 메모"]
  },
  RoutePreview: {
    fields: ["loadAddressStatus", "unloadAddressStatus", "loadCoordinate", "unloadCoordinate", "distanceKm", "estimatedMinutes", "hasStopover", "routeStatus"],
    usedBy: ["Header", "보조 정보 지도"]
  },
  DispatchManager: {
    fields: ["managerName", "teamName", "workStatus", "lastCheckedAt", "canChange", "changeHistory"],
    usedBy: ["Header chip"]
  },
  DriverAssignment: {
    fields: ["driverName", "driverPhone", "vehicleNumber", "vehicleType", "vehicleCapacity", "businessNumber"],
    usedBy: ["차주 정보", "화물 목록"]
  },
  SettlementDocument: {
    fields: ["taxInvoiceEnabled", "receiptMailEnabled", "invoiceIssuedAt", "invoiceAmount", "consignmentDocumentStatus"],
    usedBy: ["오더 요약", "화물 목록"]
  },
  EditPatch: {
    fields: ["nodeId", "fieldKey", "beforeValue", "afterValue", "sourceInteraction"],
    usedBy: ["화물 수정", "수정값 반영 확인"]
  }
};

const policyBacklog = {
  "P0-SUBMIT-API": {
    priority: "P0",
    area: "new-order-submit",
    decisionNeeded: "저장 연동 방식, 저장 데이터 구조, server validation code",
    impact: "blocks real save implementation"
  },
  "P0-VALIDATION": {
    priority: "P0",
    area: "validation",
    decisionNeeded: "actual required fields and dropdown options",
    impact: "wizard gate and error messaging"
  },
  "P0-RECENT-SCOPE": {
    priority: "P0",
    area: "recent-list",
    decisionNeeded: "shipper/user/org scope and save timing",
    impact: "recent API and DB design"
  },
  "P0-PRIVACY": {
    priority: "P0",
    area: "privacy",
    decisionNeeded: "contact and manager name masking",
    impact: "recent location row and preview"
  },
  "P0-CONTACT-MASTER-POLICY": {
    priority: "P0",
    area: "shipper-contact",
    decisionNeeded: "담당자 마스터 등록 범위, 중복 판단, 수정 권한",
    impact: "화주/담당자 선택과 담당자 추가 등록 재사용"
  },
  "P0-AMOUNT-PERMISSION": {
    priority: "P0",
    area: "amount-log",
    decisionNeeded: "amount view/edit/masking roles",
    impact: "supporting info amount tab"
  },
  "P0-SETTLEMENT-EDIT": {
    priority: "P0",
    area: "settlement",
    decisionNeeded: "whether adjustments can be changed after settlement",
    impact: "pricing adjustment API and audit log"
  },
  "P1-MAP-PROVIDER": {
    priority: "P1",
    area: "route-map",
    decisionNeeded: "map provider, quota, fallback",
    impact: "route map implementation"
  },
  "P1-MEMO-PERMISSION": {
    priority: "P1",
    area: "memo",
    decisionNeeded: "create/edit/delete visibility and retention",
    impact: "memo dialog and list actions"
  },
  "P1-DISPATCH-MANAGER": {
    priority: "P1",
    area: "dispatch-manager",
    decisionNeeded: "assignment/change permission/history and unassigned label",
    impact: "header chip future interaction"
  }
};

const nodes = [
  {
    id: "new-order.group-init",
    label: "그룹 1. 신규 접수 시작/초기화",
    group: "신규 접수",
    previewType: "event-group",
    howToOpen: "master HTML에서 `신규(F3)` 클릭",
    previewState: "new-reset",
    summary: "`신규 접수 클릭 -> 전체 입력 상태 초기화 -> 상태: new-reset -> 섹션 헤더 표시 -> 화주 정보 focus`까지를 하나의 시작 이벤트 그룹으로 봅니다.",
    dataContracts: ["CargoOrder", "Requester", "Location", "Pricing", "DriverAssignment"],
    states: ["idle-edit", "new-reset"],
    validation: ["reset 범위", "focus 1회 이동", "섹션 헤더 표시 조건"],
    checklist: ["신규 접수 버튼 handler 확인", "전체 입력 상태 초기화 범위 확인", "화주 정보 focus가 render 후 1회만 이동하는지 확인"]
  },
  {
    id: "new-order.group-wizard-entry",
    label: "그룹 2. Wizard 진입",
    group: "신규 접수",
    previewType: "event-group",
    howToOpen: "`new-reset` 상태에서 화주 정보 입력 시작",
    previewState: "new-wizard-active",
    summary: "`화주 정보 입력 시작 -> wizard 다이얼로그 열림 -> 왼쪽 프로세스 패널 표시 -> 상태: new-wizard-active`를 하나의 진입 그룹으로 봅니다.",
    dataContracts: ["Requester", "CargoMemo"],
    states: ["new-reset", "new-wizard-active"],
    validation: ["wizard 최초 진입 조건", "프로세스 패널 표시 조건"],
    checklist: ["화주 정보 입력 CTA 확인", "wizard frame 진입 확인", "프로세스 패널이 신규 접수에서만 표시되는지 확인"]
  },
  {
    id: "new-order.group-required-inputs",
    label: "그룹 3. 필수 입력 진행",
    group: "신규 접수",
    previewType: "event-group",
    howToOpen: "wizard에서 필수 단계를 순서대로 진행",
    previewState: "new-wizard-active -> new-required-complete",
    summary: "화주 정보, 상차지, 하차지, 운송+품목, 금액을 순서대로 완료해 `new-required-complete`까지 도달하는 그룹입니다.",
    dataContracts: ["Requester", "Location", "VehicleRequirement", "CargoDetail", "Pricing"],
    states: ["new-wizard-active", "new-required-complete"],
    validation: ["화주 정보", "상차지", "하차지", "운송+품목", "금액"],
    checklist: ["미완료 필수 단계 건너뛰기 차단", "완료한 이전 단계로 돌아가기 허용 범위 확인", "금액 완료 후 분기 화면 표시 확인"]
  },
  {
    id: "new-order.group-amount-branch",
    label: "그룹 4. 금액 완료 후 분기",
    group: "신규 접수",
    previewType: "event-group",
    howToOpen: "금액 단계 validation 통과 후 마지막 선택지 확인",
    previewState: "new-required-complete",
    summary: "`new-required-complete` 상태에서 사용자가 `화물 등록 완료` 또는 `차주 정보로 이동` 중 다음 행동을 선택하는 분기 그룹입니다.",
    dataContracts: ["Pricing", "PricingAdjustment", "NewOrderDraft", "BranchDecision"],
    states: ["new-required-complete"],
    validation: ["금액 필수값 완료", "분기 선택 표시", "`화물 등록 완료` 선택 시 API 통신 없음"],
    checklist: ["필수 입력 완료 panel 표시 확인", "`화물 등록 완료`가 화면 적용 의미로 안내되는지 확인", "`차주 정보로 이동` 선택 시 차주 단계로 이어지는지 확인", "실제 저장 연동 항목이 그룹 4 detail에 연결되지 않는지 확인"]
  },
  {
    id: "new-order.group-driver-choice",
    label: "그룹 5. 차주 정보 선택",
    group: "신규 접수",
    previewType: "event-group",
    howToOpen: "`차주 정보로 이동` 선택 후 차주 단계 확인",
    previewState: "new-driver-optional",
    summary: "차주 정보는 선택 단계입니다. 차주/차량을 조회해 선택하거나 건너뛰고, 실제 API 없이 그 결과를 draft에 반영합니다.",
    dataContracts: ["DriverAssignment", "NewOrderDraft", "DriverChoiceDecision", "HwamulmanDriverState"],
    states: ["new-driver-optional"],
    validation: ["선택 사항", "건너뛰기 가능", "차주 선택 preview", "화물맨 배차 결과 박스 표시", "실제 화물맨/API 호출 제외"],
    checklist: ["차주 선택 단계 dialog 표시 확인", "차주/차량 조회 진입 marker 확인", "화물맨 배차 결과 박스 marker 확인", "선택 preview marker 확인", "건너뛰기 marker 확인", "차주 정보에 적용 후 메인 적용 의미 확인"]
  },
  {
    id: "new-order.group-main-apply",
    label: "그룹 6. 메인 화면 적용",
    group: "신규 접수",
    previewType: "event-group",
    howToOpen: "`화물 등록 완료` 또는 차주 단계 완료 후 메인 화면 확인",
    previewState: "new-submitted",
    summary: "wizard draft를 메인 화면에 적용하고 `new-submitted`로 전환합니다. 적용 완료 feedback, 메인 요약/차주 정보 반영, 최종 `화물 등록` CTA 표시, 이후 독립 수정 진입을 확인합니다.",
    dataContracts: ["CargoOrder", "Requester", "Location", "VehicleRequirement", "CargoDetail", "Pricing", "DriverAssignment"],
    states: ["new-submitted"],
    validation: ["메인 화면 적용 결과", "적용 완료 status 표시", "섹션 헤더 숨김", "최종 `화물 등록` CTA 표시", "실제 API 호출 제외"],
    checklist: ["적용 완료 status marker 확인", "섹션 헤더가 숨겨지는지 확인", "요약 row가 draft 기준으로 반영되는지 확인", "차주 선택 시 차주 정보가 반영되는지 확인", "메인 `화물 등록` CTA가 표시되는지 확인", "이후 수정이 독립 다이얼로그로 열리는지 확인"]
  },
  {
    id: "new-order.group-cancel",
    label: "그룹 7. 신규 접수 취소",
    group: "신규 접수",
    previewType: "event-group",
    howToOpen: "신규 접수 작성 중 취소 선택",
    previewState: "idle-edit",
    summary: "신규 접수 중 취소하면 작성 중단 확인을 거쳐 `idle-edit`로 복귀하고 wizard와 신규 접수 전용 UI를 숨깁니다.",
    dataContracts: ["CargoOrder"],
    states: ["new-reset", "new-wizard-active", "new-required-complete", "new-driver-optional", "idle-edit"],
    validation: ["작성 중단 확인", "입력값 폐기/유지 정책 확인 필요"],
    checklist: ["취소 confirmation 문구 확인", "취소 후 wizard와 프로세스 패널 숨김 확인", "취소 후 섹션 헤더 숨김 확인"]
  },
  {
    id: "edit-order.row-select",
    label: "목록 행 선택",
    group: "화물 수정",
    previewType: "edit-flow",
    howToOpen: "기존 화물 목록에서 행 선택",
    previewState: "cargo-selected",
    summary: "화물 목록 row를 선택해 선택 화물 데이터를 메인 화면에 로드합니다. 선택 후에도 신규 접수 wizard는 열리지 않고 명세서형 보기를 유지합니다.",
    dataContracts: ["CargoOrder", "DriverAssignment", "SettlementDocument"],
    states: ["idle-edit", "cargo-selected"],
    validation: ["목록 row 선택", "선택 row 강조", "명세서형 보기", "섹션 헤더 숨김"],
    checklist: ["목록 행 선택 후 메인 화면 데이터가 갱신되는지 확인", "본문 라벨과 값 중심으로 보이는지 확인", "신규 접수 wizard가 열리지 않는지 확인"]
  },
  {
    id: "edit-order.section-scan",
    label: "수정 가능 항목 확인",
    group: "화물 수정",
    previewType: "edit-flow",
    howToOpen: "선택 화물의 메인 명세서 화면에서 수정 가능한 항목 확인",
    previewState: "section-editing",
    summary: "화주, 운송 구간, 운송+품목, 금액, 차주, 보조 정보의 editable/readonly 항목을 구분합니다. 왼쪽 node는 큰 흐름만 유지하고 세부 항목은 part로 분리합니다.",
    dataContracts: ["EditField", "Requester", "Location", "VehicleRequirement", "CargoDetail", "Pricing", "DriverAssignment"],
    states: ["cargo-selected", "section-editing"],
    validation: ["수정 가능/표시 전용/[확인 필요] 분류", "UI 유형 분류", "근거 source 연결"],
    checklist: ["editable 항목이 과하게 많은 node로 쪼개지지 않는지 확인", "readonly 계산값이 수정 가능처럼 보이지 않는지 확인", "각 항목의 source 근거가 연결되는지 확인"]
  },
  {
    id: "edit-order.shipper-edit",
    label: "화주 항목 수정",
    group: "화물 수정",
    previewType: "edit-flow",
    howToOpen: "화주 row의 `화주/담당자 변경` 또는 연락처/이메일 값 선택",
    previewState: "dialog-editing",
    summary: "업체명, 사업자번호, 담당자명은 통합 조회 다이얼로그로 변경하고, 담당자 연락처와 이메일은 적용된 row에서 inline edit로 보정합니다.",
    dataContracts: ["ShipperSummary", "ShipperContactCandidate", "ContactDraft", "InlineEditDraft", "EditPatch"],
    states: ["cargo-selected", "dialog-editing", "field-editing", "edit-applied", "edit-cancelled"],
    validation: ["화주 식별", "담당자/연락처", "연락처/이메일 형식 확인 필요", "담당자 역할 확인 필요"],
    checklist: ["7개 part 목록 표시 확인", "화주/담당자 변경 dialog 진입 확인", "담당자 추가 등록 위치 확인", "연락처/이메일 inline edit의 Enter/blur/Escape 동작 확인", "live anchor 연결 전 fallback marker가 잘못 노출되지 않는지 확인"]
  },
  {
    id: "edit-order.route-edit",
    label: "운송 구간 수정",
    group: "화물 수정",
    previewType: "edit-flow",
    howToOpen: "상차/하차 row의 주소 또는 일시/방법 수정 진입",
    previewState: "dialog-editing",
    summary: "상차지와 하차지 주소는 주소 검색 dialog로 다시 선택하고, 상세주소/담당/연락처는 적용된 row에서 inline edit로 보정합니다. 일시/방법은 각 row의 조건 cell에서 빠르게 선택하며, 주소 변경 후 거리/기준금액 재계산 필요 여부를 header와 요약에서 확인합니다.",
    dataContracts: ["RouteSummary", "RouteLocationDraft", "RouteInlineEditDraft", "RouteConditionDraft", "RouteRecalcState", "EditPatch"],
    states: ["cargo-selected", "dialog-editing", "field-editing", "condition-editing", "edit-applied", "edit-cancelled"],
    validation: ["상차/하차 주소", "상세주소/담당/연락처", "일시/방법 조건", "거리/기준금액 재계산 필요"],
    checklist: ["6개 part 목록 표시 확인", "상차/하차 주소 dialog가 독립적으로 열리는지 확인", "주소 결과 row와 선택 preview가 같은 dialog 안에서 보이는지 확인", "상차/하차 inline edit가 row 높이를 크게 흔들지 않는지 확인", "거리/기준금액 확인 marker가 header chip과 충돌하지 않는지 확인"]
  },
  {
    id: "edit-order.cargo-money-edit",
    label: "운송+품목/금액 수정",
    group: "화물 수정",
    previewType: "edit-flow",
    howToOpen: "운송, 품목, 금액 row의 수정 가능한 값 선택",
    previewState: "field-editing",
    summary: "운송+품목은 톤수, 차종, 대수, 실중량, 품목을 dialog에서 수정한 뒤 운송 조건 row와 품목 row로 반영합니다. 금액은 결제방법, 청구비용, 운송비용, 수수료, 조정금을 별도 dialog에서 수정하고, 수익/차주운임은 계산값으로 read-only 구분합니다.",
    dataContracts: ["VehicleRequirement", "CargoDetail", "Pricing", "PricingAdjustment", "EditPatch"],
    states: ["cargo-selected", "dialog-editing", "field-editing", "edit-applied", "edit-cancelled"],
    validation: ["톤수/차종 필수", "대수 1 이상", "실중량 0 이상", "0 이상 금액", "결제방법별 계산", "계산값 readonly"],
    checklist: ["7개 part 목록 표시 확인", "운송+품목 dialog와 최근 조합 선택 위치 확인", "적용 후 운송 조건 row와 품목 row 분리 확인", "금액 dialog와 계산 preview 확인", "수익/차주운임이 직접 수정 대상처럼 보이지 않는지 확인", "화물정보 요약 stale 후보를 확인"]
  },
  {
    id: "edit-order.driver-edit",
    label: "차주 정보 수정",
    group: "화물 수정",
    previewType: "edit-flow",
    howToOpen: "차주 row의 `차주/차량 변경` 또는 보정 가능 값 선택",
    previewState: "dialog-editing",
    summary: "차주명과 차량번호는 차주/차량 통합 조회 다이얼로그로 변경하고, 차주 연락처, 톤수, 차종은 적용된 row에서 각각 현재 오더 기준으로 보정합니다. 내부 DB 결과와 화물맨 배차 결과는 같은 dialog에서 비교하지만 실제 API 연동은 제외합니다.",
    dataContracts: ["DriverAssignment", "DriverLookupCandidate", "DriverRegisterDraft", "DriverInlineEditDraft", "HwamulmanDriverState", "EditPatch"],
    states: ["cargo-selected", "dialog-editing", "field-editing", "edit-applied", "edit-cancelled"],
    validation: ["차주명/차량번호 dialog 변경", "연락처 inline 보정", "톤수 inline 보정", "차종 inline 보정", "화물맨 결과 상단 고정", "차량 스펙 비교 확인 필요"],
    checklist: ["9개 part 목록 표시 확인", "차주/차량 변경 dialog 진입 확인", "내부 DB 결과와 화물맨 배차 결과 위치 확인", "선택 preview와 차주 등록 form이 동시에 보이지 않는지 확인", "연락처/톤수/차종 inline 보정 marker가 각각 다른 cell을 가리키는지 확인", "실제 화물맨/API 항목이 detail에 연결되지 않는지 확인"]
  },
  {
    id: "edit-order.apply-review",
    label: "수정값 반영 확인",
    group: "화물 수정",
    previewType: "edit-flow",
    howToOpen: "inline edit 저장 또는 독립 다이얼로그 적용 후 메인 화면 확인",
    previewState: "edit-applied",
    summary: "독립 수정 적용 후 status feedback, 수정 row 반영, 최종 `화물 등록` CTA를 확인합니다. 취소는 적용 전 값을 유지하는 경계로 설명하고, 목록 row 갱신 시점은 아직 확인 필요 항목으로 둡니다.",
    dataContracts: ["EditPatch", "EditFeedbackState", "CargoOrderDraft", "ListRefreshPolicy", "EditCancelPolicy"],
    states: ["edit-applied", "edit-cancelled", "cargo-selected"],
    validation: ["변경 field feedback", "수정 row 반영", "최종 CTA 표시", "취소 시 이전 값 유지", "목록 row 갱신 시점 확인 필요"],
    checklist: ["5개 part 목록 표시 확인", "변경 feedback과 수정 row가 같은 적용 상태를 가리키는지 확인", "최종 `화물 등록` CTA가 API 전 경계로 보이는지 확인", "취소 버튼이 적용 전 값 유지 경계로 설명되는지 확인", "목록 갱신 보류가 실제 cargo-list 구현처럼 보이지 않는지 확인"]
  },
  {
    id: "new-order.start",
    label: "신규 접수 시작",
    group: "신규 접수",
    previewType: "master-state",
    howToOpen: "master HTML에서 `신규(F3)` 클릭",
    previewState: "new-reset",
    summary: "`신규(F3)` 클릭 후 전체 입력 상태를 초기화하고 화주 정보 입력으로 focus를 이동합니다.",
    dataContracts: ["CargoOrder", "Requester", "Location", "Pricing", "DriverAssignment"],
    states: ["idle-edit", "new-reset"],
    validation: ["reset 범위", "focus 1회 이동"],
    checklist: ["기존 신규 버튼 handler 위치 확인", "전체 form reset 범위 확인", "draft id 생성 위치 확인"],
    backlog: ["P0-VALIDATION"]
  },
  {
    id: "new-order.shipper",
    label: "화주 정보",
    group: "신규 접수",
    previewType: "wizard-step",
    howToOpen: "`new-reset` 후 화주 정보 입력 시작",
    previewState: "new-wizard-active",
    summary: "신규 접수 첫 입력 단계이며 화주 선택 후 보조 정보 메모 mock 표시 조건과 연결됩니다.",
    dataContracts: ["Requester", "CargoMemo"],
    states: ["new-wizard-active"],
    validation: ["화주 식별 정보", "담당자 또는 연락처"],
    checklist: ["화주 조회/선택 dialog 확인", "의뢰자/화주 용어 매핑", "사업자번호 조건부 필수 확인"],
    backlog: ["P0-VALIDATION", "P1-MEMO-PERMISSION"]
  },
  {
    id: "new-order.load-address",
    label: "상차지",
    group: "신규 접수",
    previewType: "dialog-preview",
    howToOpen: "상차지 주소 검색 다이얼로그 열기",
    previewState: "address-recent-load",
    summary: "상차 주소를 확정합니다. 최근 장소는 검색 결과 영역의 초기 상태로만 표시됩니다.",
    dataContracts: ["Location", "RecentLocation", "RoutePreview"],
    states: ["new-wizard-active"],
    validation: ["주소", "상세주소 또는 장소명", "상차 정책"],
    checklist: ["주소 검색 component 확인", "최근 장소 scope 확인", "연락처 row 마스킹 확인"],
    backlog: ["P0-VALIDATION", "P0-RECENT-SCOPE", "P0-PRIVACY", "P1-MAP-PROVIDER"]
  },
  {
    id: "new-order.unload-address",
    label: "하차지",
    group: "신규 접수",
    previewType: "dialog-preview",
    howToOpen: "하차지 주소 검색 다이얼로그 열기",
    previewState: "address-recent-unload",
    summary: "하차 주소를 확정합니다. 상차지와 하차지가 모두 적용되면 보조 정보 지도 mock이 표시됩니다.",
    dataContracts: ["Location", "RecentLocation", "RoutePreview"],
    states: ["new-wizard-active"],
    validation: ["주소", "상세주소 또는 장소명", "하차 정책"],
    checklist: ["하차지 검색 handler 확인", "지도/거리 계산 data source 확인"],
    backlog: ["P0-VALIDATION", "P0-RECENT-SCOPE", "P0-PRIVACY", "P1-MAP-PROVIDER"]
  },
  {
    id: "new-order.cargo-item",
    label: "운송+품목",
    group: "신규 접수",
    previewType: "dialog-preview",
    howToOpen: "운송+품목 입력 다이얼로그 열기",
    previewState: "cargo-recent",
    summary: "톤수, 차종, 대수, 실중량, 품목을 입력합니다. 최근 조합 클릭은 입력폼만 채웁니다.",
    dataContracts: ["VehicleRequirement", "CargoDetail", "RecentCargoCombo"],
    states: ["new-wizard-active"],
    validation: ["톤수", "차종", "대수", "실중량", "품목"],
    checklist: ["운송+품목 dialog 확인", "조합 중복 제거 key 확인", "금액 조건 미포함 확인"],
    backlog: ["P0-VALIDATION", "P0-RECENT-SCOPE"]
  },
  {
    id: "new-order.amount",
    label: "금액",
    group: "신규 접수",
    previewType: "wizard-step",
    howToOpen: "금액 입력 단계 완료",
    previewState: "new-required-complete",
    summary: "금액까지 필수 입력이 끝나면 `화물 등록 완료` 또는 `차주 정보로 이동`을 선택합니다.",
    dataContracts: ["Pricing", "PricingAdjustment"],
    states: ["new-required-complete"],
    validation: ["결제방법", "청구비용", "운송비용"],
    checklist: ["금액 입력 component 확인", "조정금 사유/대상 확인", "정산 권한 확인"],
    backlog: ["P0-VALIDATION", "P0-AMOUNT-PERMISSION", "P0-SETTLEMENT-EDIT"]
  },
  {
    id: "new-order.driver",
    label: "차주 정보 선택",
    group: "신규 접수",
    previewType: "wizard-step",
    howToOpen: "금액 완료 후 `차주 정보로 이동` 선택",
    previewState: "new-driver-optional",
    summary: "차주 정보는 선택 단계입니다. 선택하거나 건너뛸 수 있습니다.",
    dataContracts: ["DriverAssignment"],
    states: ["new-driver-optional"],
    validation: ["선택 사항"],
    checklist: ["차주 조회 dialog 확인", "화물맨 연동 포함 여부 확인", "건너뛰기 상태 확인"],
    backlog: []
  },
  {
    id: "new-order.pre-api-submit",
    label: "메인 적용 후 최종 등록",
    group: "신규 접수",
    previewType: "master-state",
    howToOpen: "`화물 등록 완료` 선택 후 메인 화면 확인",
    previewState: "new-submitted",
    summary: "wizard 데이터가 저장 연동 전 메인 화면에 적용된 상태입니다.",
    dataContracts: ["CargoOrder"],
    states: ["new-submitted"],
    validation: ["최신 메인 화면 데이터 기준"],
    api: ["메인 `화물 등록`만 저장 연동 진입"],
    checklist: ["메인 CTA 위치 확인", "wizard 재개 방지", "개별 수정 후 화면 변경 버전 증가"],
    backlog: ["P0-SUBMIT-API", "P0-VALIDATION"]
  },
  {
    id: "new-order.submit",
    label: "저장 연동 보류",
    group: "신규 접수",
    navHidden: true,
    previewType: "state-machine",
    howToOpen: "메인 `화물 등록` 클릭",
    previewState: "submit-validating -> submit-pending",
    summary: "최종 validation 후 저장 연동으로 넘어가는 보류 항목입니다.",
    dataContracts: ["CargoOrder"],
    states: ["submit-validating", "submit-pending", "submit-failed", "submit-complete"],
    api: ["저장 연동 방식 보류", "저장 데이터 구조 보류", "중복 실행 방지 key 필요"],
    checklist: ["저장 연동 방식 확인", "server validation code 매핑", "중복 클릭 방지"],
    backlog: ["P0-SUBMIT-API", "P0-VALIDATION"]
  },
  {
    id: "aside.memo",
    label: "보조 정보: 메모",
    group: "보조 정보",
    previewType: "aside-tab",
    howToOpen: "보조 정보 `메모` 탭",
    previewState: "memo",
    summary: "운영자 메모, 고객 요청, 배차 특이사항을 리스트 중심으로 확인합니다.",
    dataContracts: ["CargoMemo"],
    policy: ["작성/수정/삭제 권한 보류", "보존 기간 보류"],
    checklist: ["메모 API 확인", "권한별 button 표시 확인"],
    backlog: ["P1-MEMO-PERMISSION"]
  },
  {
    id: "aside.amount-log",
    label: "보조 정보: 금액 로그",
    group: "보조 정보",
    previewType: "aside-tab",
    howToOpen: "보조 정보 `금액 로그` 탭",
    previewState: "amount",
    summary: "기준 청구금/배차금, 조정금, 합계, 수익을 금액 명세로 확인합니다.",
    dataContracts: ["Pricing", "PricingAdjustment"],
    policy: ["금액 권한 보류", "정산 후 수정 정책 보류", "조정금 저장 단위 보류"],
    checklist: ["금액 로그 API 확인", "민감 금액 마스킹 확인"],
    backlog: ["P0-AMOUNT-PERMISSION", "P0-SETTLEMENT-EDIT"]
  },
  {
    id: "aside.route-map",
    label: "보조 정보: 운송 구간 지도",
    group: "보조 정보",
    previewType: "aside-tab",
    howToOpen: "보조 정보 `운송 구간 지도` 탭",
    previewState: "map",
    summary: "상차지와 하차지의 경로, 거리, 예상 시간, 경유 여부를 확인합니다.",
    dataContracts: ["RoutePreview", "Location"],
    policy: ["지도 provider 보류", "좌표 저장 방식 보류"],
    checklist: ["지도 provider 확인", "fallback empty/error 상태 확인"],
    backlog: ["P1-MAP-PROVIDER"]
  },
  {
    id: "dialog.address-recent",
    label: "주소 최근 사용",
    group: "최근 사용 다이얼로그",
    previewType: "dialog-preview",
    howToOpen: "주소 검색 다이얼로그 열기",
    previewState: "recent-before-search",
    summary: "최근 장소 row는 선택 미리보기만 갱신하고 적용 버튼이 확정 책임을 가집니다.",
    dataContracts: ["RecentLocation"],
    policy: ["scope 보류", "저장 시점 보류", "개인정보 마스킹 보류"],
    checklist: ["최근 row click handler 확인", "검색 결과 전환 확인"],
    backlog: ["P0-RECENT-SCOPE", "P0-PRIVACY"]
  },
  {
    id: "dialog.cargo-recent",
    label: "운송+품목 최근 사용",
    group: "최근 사용 다이얼로그",
    previewType: "dialog-preview",
    howToOpen: "운송+품목 입력 다이얼로그 열기",
    previewState: "recent-combo",
    summary: "최근 조합 row는 톤수, 차종, 대수, 실중량, 품목 입력폼만 채웁니다.",
    dataContracts: ["RecentCargoCombo"],
    policy: ["조합 key 보류", "개별 추천은 후속"],
    checklist: ["적용 전 row 미반영 확인", "금액 조건 미포함 확인"],
    backlog: ["P0-RECENT-SCOPE"]
  },
  {
    id: "header.status-metrics",
    label: "Header 상태/거리/기준금액",
    group: "Header 상태",
    previewType: "header",
    howToOpen: "master 상단 header 확인",
    previewState: "header-metrics",
    summary: "거리와 기준금액은 운송 구간 내부 중복 메타가 아니라 header와 지도 탭으로 역할을 분리합니다.",
    dataContracts: ["CargoOrder", "RoutePreview", "Pricing"],
    checklist: ["운송 구간 내부 중복 메타 제거 확인", "header wrap 확인"],
    backlog: ["P1-MAP-PROVIDER"]
  },
  {
    id: "header.dispatch-manager",
    label: "배차 담당자",
    group: "Header 상태",
    previewType: "header",
    howToOpen: "header 상태 chip 옆 `배차 김민지` 확인",
    previewState: "dispatch-manager-chip",
    summary: "현재는 표시 전용 chip입니다. 배정/변경/이력 UX는 후속 기획입니다.",
    dataContracts: ["DispatchManager"],
    policy: ["데이터 모델 보류", "변경 권한 보류"],
    checklist: ["담당자 source 확인", "미지정 상태 문구 결정"],
    backlog: ["P1-DISPATCH-MANAGER"]
  },
  {
    id: "header.label-toggle",
    label: "라벨 표시 토글",
    group: "Header 상태",
    previewType: "header",
    howToOpen: "header `Aa` icon button 확인",
    previewState: "label-toggle",
    summary: "본문 라벨 표시/숨김을 header 상태 흐름 안에서 제어합니다.",
    dataContracts: [],
    checklist: ["tooltip 한글 확인", "좁은 화면 wrap 확인", "버튼 접근성 확인"],
    backlog: []
  }
];

const requiredInputBaseNode = nodes.find((node) => node.id === "new-order.group-required-inputs");

if (requiredInputBaseNode) {
  requiredInputSplitGroups.forEach((group) => {
    nodes.push({
      ...requiredInputBaseNode,
      id: group.id,
      label: group.label,
      summary: group.summary,
      dataContracts: group.dataContracts,
      states: group.states,
      validation: group.validation,
      checklist: group.checklist,
      backlog: group.backlog
    });
  });
}

const sourceLinks = {
  "global.baseline": [
    "../source-snapshot/root-docs/README.md",
    "../baseline/html/results-html-README.md",
    "../source-snapshot/artifact-audit/source-of-truth-map.md",
    "../baseline/html/cargo-order-admin-hifi-master.html"
  ],
  "new-order.group-init": [
    "./01-user-flow-new-order-events.md",
    "../source-snapshot/sections/new-order-registration-flow/01-new-order-flow-overview.md",
    "../source-snapshot/sections/new-order-registration-flow/05-state-and-interaction-matrix.md",
    "../source-snapshot/sections/new-order-registration-flow/06-acceptance-criteria.md"
  ],
  "new-order.group-wizard-entry": [
    "./01-user-flow-new-order-events.md",
    "../source-snapshot/sections/new-order-registration-flow/04-dialog-wizard-flow.md",
    "../source-snapshot/sections/new-order-registration-flow/05-state-and-interaction-matrix.md",
    "../source-snapshot/sections/new-order-registration-flow/06-acceptance-criteria.md"
  ],
  "new-order.group-required-inputs": [
    "./01-user-flow-new-order-events.md",
    "../source-snapshot/sections/new-order-registration-flow/04-dialog-wizard-flow.md",
    "../source-snapshot/sections/new-order-registration-flow/05-state-and-interaction-matrix.md",
    "../source-snapshot/sections/new-order-registration-flow/06-acceptance-criteria.md"
  ],
  "new-order.group-amount-branch": [
    "./01-user-flow-new-order-events.md",
    "./13-group-4-amount-branch-plan.md",
    "../source-snapshot/sections/new-order-registration-flow/01-new-order-flow-overview.md",
    "../source-snapshot/sections/new-order-registration-flow/04-dialog-wizard-flow.md",
    "../source-snapshot/sections/new-order-registration-flow/06-acceptance-criteria.md",
    "../source-snapshot/sections/new-order-registration-flow/08-main-submit-api-policy.md"
  ],
  "new-order.group-driver-choice": [
    "./01-user-flow-new-order-events.md",
    "./14-group-5-driver-choice-plan.md",
    "../source-snapshot/sections/new-order-registration-flow/04-dialog-wizard-flow.md",
    "../source-snapshot/sections/new-order-registration-flow/06-acceptance-criteria.md",
    "../source-snapshot/sections/driver-info/README.md",
    "../source-snapshot/sections/driver-info/05-b-integration-guide.md",
    "../source-snapshot/sections/driver-info/08-hwamulman-field-state-mapping.md"
  ],
  "new-order.group-main-apply": [
    "./01-user-flow-new-order-events.md",
    "./15-group-6-main-apply-plan.md",
    "../source-snapshot/sections/new-order-registration-flow/05-state-and-interaction-matrix.md",
    "../source-snapshot/sections/new-order-registration-flow/07-main-submit-cta-visibility.md",
    "../source-snapshot/sections/new-order-registration-flow/06-acceptance-criteria.md"
  ],
  "new-order.group-cancel": [
    "./01-user-flow-new-order-events.md",
    "../source-snapshot/sections/new-order-registration-flow/04-dialog-wizard-flow.md",
    "../source-snapshot/sections/new-order-registration-flow/05-state-and-interaction-matrix.md"
  ],
  "edit-order.row-select": [
    "./16-edit-order-section-edit-flow-plan.md",
    "../source-snapshot/root-docs/01-screen-map.md",
    "../source-snapshot/root-docs/02-field-inventory.md",
    "../source-snapshot/sections/cargo-list/00-package-plan.md"
  ],
  "edit-order.section-scan": [
    "./16-edit-order-section-edit-flow-plan.md",
    "../source-snapshot/root-docs/01-screen-map.md",
    "../source-snapshot/root-docs/02-field-inventory.md"
  ],
  "edit-order.shipper-edit": [
    "./16-edit-order-section-edit-flow-plan.md",
    "./17-edit-order-shipper-edit-marker-plan.md",
    "../source-snapshot/sections/shipper-info/02-wireframe-shipper-info.md",
    "../source-snapshot/root-docs/02-field-inventory.md"
  ],
  "edit-order.route-edit": [
    "./16-edit-order-section-edit-flow-plan.md",
    "./18-edit-order-route-edit-marker-plan.md",
    "../source-snapshot/sections/transport-route/04-field-state-mapping.md",
    "../source-snapshot/sections/transport-route/03-user-flow-transport-route.md"
  ],
  "edit-order.cargo-money-edit": [
    "./16-edit-order-section-edit-flow-plan.md",
    "./19-edit-order-cargo-money-edit-marker-plan.md",
    "../source-snapshot/sections/cargo-transport/04-field-state-mapping.md",
    "../source-snapshot/sections/cargo-transport/07-inline-edit-interaction-plan.md",
    "../source-snapshot/sections/cargo-summary-docs/04-field-state-mapping.md"
  ],
  "edit-order.driver-edit": [
    "./16-edit-order-section-edit-flow-plan.md",
    "./20-edit-order-driver-edit-marker-plan.md",
    "../source-snapshot/sections/driver-info/README.md",
    "../source-snapshot/sections/driver-info/03-user-flow-driver-info.md",
    "../source-snapshot/sections/driver-info/04-field-state-mapping.md",
    "../source-snapshot/sections/driver-info/05-b-integration-guide.md"
  ],
  "edit-order.apply-review": [
    "./16-edit-order-section-edit-flow-plan.md",
    "./21-edit-order-apply-review-marker-plan.md",
    "../source-snapshot/sections/new-order-registration-flow/05-state-and-interaction-matrix.md",
    "../source-snapshot/root-docs/01-screen-map.md",
    "../source-snapshot/root-docs/02-field-inventory.md"
  ],
  "new-order.start": [
    "../source-snapshot/root-docs/01-screen-map.md",
    "../source-snapshot/root-docs/03-wireframe.md",
    "../source-snapshot/sections/new-order-registration-flow/01-new-order-flow-overview.md",
    "../source-snapshot/sections/new-order-registration-flow/05-state-and-interaction-matrix.md",
    "../source-snapshot/sections/new-order-registration-flow/06-acceptance-criteria.md"
  ],
  "new-order.shipper": [
    "../source-snapshot/sections/new-order-registration-flow/04-dialog-wizard-flow.md",
    "../source-snapshot/sections/shipper-info/README.md",
    "../source-snapshot/root-docs/02-field-inventory.md"
  ],
  "new-order.load-address": [
    "../source-snapshot/sections/transport-route/README.md",
    "../source-snapshot/sections/transport-route/address-apply-layouts/02-wireframe-address-apply-layouts.md",
    "../source-snapshot/sections/transport-dialog-recent-lists/02-address-dialog-recent-list.md"
  ],
  "new-order.unload-address": [
    "../source-snapshot/sections/transport-route/README.md",
    "../source-snapshot/sections/transport-route/address-apply-layouts/02-wireframe-address-apply-layouts.md",
    "../source-snapshot/sections/transport-dialog-recent-lists/02-address-dialog-recent-list.md"
  ],
  "new-order.cargo-item": [
    "../source-snapshot/sections/cargo-transport/README.md",
    "../source-snapshot/sections/cargo-transport/09-f-transport-item-money-dialog-plan.md",
    "../source-snapshot/sections/transport-dialog-recent-lists/03-cargo-item-dialog-recent-list.md"
  ],
  "new-order.amount": [
    "../source-snapshot/sections/new-order-registration-flow/04-dialog-wizard-flow.md",
    "../source-snapshot/sections/new-order-registration-flow/08-main-submit-api-policy.md",
    "../source-snapshot/sections/reservation-area-tabs/04-tab-amount-log-section.md",
    "../source-snapshot/sections/reservation-area-tabs/08-implementation-handoff.md"
  ],
  "new-order.driver": [
    "../source-snapshot/sections/driver-info/README.md",
    "../source-snapshot/sections/driver-info/05-b-integration-guide.md",
    "../source-snapshot/sections/new-order-registration-flow/04-dialog-wizard-flow.md"
  ],
  "new-order.pre-api-submit": [
    "../source-snapshot/sections/new-order-registration-flow/05-state-and-interaction-matrix.md",
    "../source-snapshot/sections/new-order-registration-flow/07-main-submit-cta-visibility.md",
    "../source-snapshot/sections/new-order-registration-flow/08-main-submit-api-policy.md"
  ],
  "new-order.submit": [
    "../source-snapshot/sections/new-order-registration-flow/08-main-submit-api-policy.md",
    "../source-snapshot/sections/new-order-registration-flow/06-acceptance-criteria.md"
  ],
  "aside.memo": [
    "../source-snapshot/sections/reservation-area-tabs/03-tab-memo-section.md",
    "../source-snapshot/sections/reservation-area-tabs/05-state-and-interaction-matrix.md",
    "../source-snapshot/sections/reservation-area-tabs/08-implementation-handoff.md"
  ],
  "aside.amount-log": [
    "../source-snapshot/sections/reservation-area-tabs/04-tab-amount-log-section.md",
    "../source-snapshot/sections/reservation-area-tabs/08-implementation-handoff.md",
    "../source-snapshot/sections/reservation-area-tabs/09-planning-closure.md"
  ],
  "aside.route-map": [
    "../source-snapshot/sections/reservation-area-tabs/02-tab-map-section.md",
    "../source-snapshot/sections/reservation-area-tabs/08-implementation-handoff.md",
    "../source-snapshot/sections/reservation-area-tabs/09-planning-closure.md"
  ],
  "dialog.address-recent": [
    "../source-snapshot/sections/transport-dialog-recent-lists/02-address-dialog-recent-list.md",
    "../source-snapshot/sections/transport-dialog-recent-lists/04-state-and-interaction-matrix.md",
    "../source-snapshot/sections/transport-dialog-recent-lists/05-acceptance-criteria.md"
  ],
  "dialog.cargo-recent": [
    "../source-snapshot/sections/transport-dialog-recent-lists/03-cargo-item-dialog-recent-list.md",
    "../source-snapshot/sections/transport-dialog-recent-lists/04-state-and-interaction-matrix.md",
    "../source-snapshot/sections/transport-dialog-recent-lists/05-acceptance-criteria.md"
  ],
  "header.status-metrics": [
    "../source-snapshot/root-docs/01-screen-map.md",
    "../source-snapshot/root-docs/03-wireframe.md",
    "../source-snapshot/root-docs/10-hifi-design-polish-and-dispatch-manager-integration-log.md"
  ],
  "header.dispatch-manager": [
    "../source-snapshot/root-docs/10-hifi-design-polish-and-dispatch-manager-integration-log.md",
    "../source-snapshot/root-docs/02-field-inventory.md",
    "../source-snapshot/root-docs/04-modernization-brief.md"
  ],
  "header.label-toggle": [
    "../source-snapshot/root-docs/10-hifi-design-polish-and-dispatch-manager-integration-log.md",
    "../baseline/html/results-html-README.md"
  ]
};

const requiredInputSourceLinks = [
  "./01-user-flow-new-order-events.md",
  "./08-group-3-required-inputs-marker-plan.md",
  "./09-group-3-required-inputs-split-plan.md",
  "../source-snapshot/sections/new-order-registration-flow/04-dialog-wizard-flow.md",
  "../source-snapshot/sections/new-order-registration-flow/05-state-and-interaction-matrix.md",
  "../source-snapshot/sections/new-order-registration-flow/06-acceptance-criteria.md"
];

requiredInputSplitGroups.forEach((group) => {
  sourceLinks[group.id] = [...requiredInputSourceLinks, ...(group.extraSourceLinks || [])];
});

const qaMap = {
  "new-order.group-init": { group: "그룹 1. 신규 접수 시작/초기화", source: "./01-user-flow-new-order-events.md", criteria: ["AC-A1", "AC-A2", "AC-A3", "AC-A4", "AC-A5"] },
  "new-order.group-wizard-entry": { group: "그룹 2. Wizard 진입", source: "./01-user-flow-new-order-events.md", criteria: ["AC-C1", "AC-C2", "AC-C3"] },
  "new-order.group-required-inputs": { group: "그룹 3. 필수 입력 진행", source: "./01-user-flow-new-order-events.md", criteria: ["AC-C5", "AC-D1"] },
  "new-order.group-amount-branch": { group: "그룹 4. 금액 완료 후 분기", source: "./13-group-4-amount-branch-plan.md", criteria: ["AC-D1", "AC-D2", "AC-D3", "AC-D5"] },
  "new-order.group-driver-choice": { group: "그룹 5. 차주 정보 선택", source: "./14-group-5-driver-choice-plan.md", criteria: ["AC-D5", "AC-E1", "AC-E2", "AC-E3", "AC-E4"] },
  "new-order.group-main-apply": { group: "그룹 6. 메인 화면 적용", source: "./15-group-6-main-apply-plan.md", criteria: ["AC-B4", "AC-D3", "AC-D4", "AC-D6", "AC-F1", "AC-F2", "AC-F3", "AC-F4"] },
  "new-order.group-cancel": { group: "그룹 7. 신규 접수 취소", source: "./01-user-flow-new-order-events.md", checks: ["작성 중단 확인 필요", "wizard/프로세스 패널 숨김", "섹션 헤더 숨김", "idle-edit 복귀"] },
  "edit-order.row-select": { group: "화물 수정", source: "./16-edit-order-section-edit-flow-plan.md", checks: ["목록 row 선택", "선택 row 강조", "메인 화면 로드", "명세서형 보기 유지"] },
  "edit-order.section-scan": { group: "화물 수정", source: "./16-edit-order-section-edit-flow-plan.md", checks: ["수정 가능/표시 전용 분류", "UI 유형 분류", "source 근거 연결"] },
  "edit-order.shipper-edit": { group: "화물 수정", source: "./17-edit-order-shipper-edit-marker-plan.md", checks: ["현재 화주 row", "화주/담당자 변경", "조회 결과 선택", "선택 preview", "담당자 추가 등록", "연락처 inline edit", "이메일 inline edit"] },
  "edit-order.route-edit": { group: "화물 수정", source: "./18-edit-order-route-edit-marker-plan.md", checks: ["상차/하차 현재 row", "상차지 주소 변경", "상차 상세/담당/조건 수정", "하차지 주소 변경", "하차 상세/담당/조건 수정", "거리/기준금액 확인"] },
  "edit-order.cargo-money-edit": { group: "화물 수정", source: "./19-edit-order-cargo-money-edit-marker-plan.md", checks: ["운송+품목 입력 dialog", "최근 조합 선택", "운송 조건 row", "품목 row", "금액 입력 dialog", "금액 계산 preview", "금액 row / 계산값 readonly"] },
  "edit-order.driver-edit": { group: "화물 수정", source: "./20-edit-order-driver-edit-marker-plan.md", checks: ["차주 현재 row", "차주/차량 변경 dialog", "내부 DB 결과", "화물맨 배차 결과", "선택 preview", "차주 등록", "연락처 inline 보정", "톤수 inline 보정", "차종 inline 보정"] },
  "edit-order.apply-review": { group: "화물 수정", source: "./21-edit-order-apply-review-marker-plan.md", checks: ["변경 feedback", "수정 row 반영", "최종 화물 등록 CTA", "취소 경계", "목록 갱신 보류"] },
  "new-order.start": { group: "신규 접수 flow", source: "../source-snapshot/sections/new-order-registration-flow/06-acceptance-criteria.md", criteria: ["AC-A1", "AC-A2", "AC-A3", "AC-A4", "AC-A5"] },
  "new-order.shipper": { group: "신규 접수 flow", source: "../source-snapshot/sections/new-order-registration-flow/06-acceptance-criteria.md", criteria: ["AC-C1", "AC-C2", "AC-C3", "AC-C5"] },
  "new-order.amount": { group: "신규 접수 flow", source: "../source-snapshot/sections/new-order-registration-flow/06-acceptance-criteria.md", criteria: ["AC-D1", "AC-D2", "AC-D3", "AC-D4", "AC-D5", "AC-D6"] },
  "new-order.driver": { group: "신규 접수 flow", source: "../source-snapshot/sections/new-order-registration-flow/06-acceptance-criteria.md", criteria: ["AC-E1", "AC-E2", "AC-E3", "AC-E4"] },
  "new-order.pre-api-submit": { group: "신규 접수 flow", source: "../source-snapshot/sections/new-order-registration-flow/06-acceptance-criteria.md", criteria: ["AC-F1", "AC-F2", "AC-F3", "AC-F4", "AC-F5", "AC-H4"] },
  "new-order.submit": { group: "신규 접수 flow", source: "../source-snapshot/sections/new-order-registration-flow/06-acceptance-criteria.md", criteria: ["AC-I1", "AC-I2", "AC-I3", "AC-I4", "AC-I5", "AC-I6", "AC-I7", "AC-I8", "AC-I9", "AC-I10"] },
  "dialog.address-recent": { group: "최근 사용 다이얼로그", source: "../source-snapshot/sections/transport-dialog-recent-lists/05-acceptance-criteria.md", criteria: ["AC-ADDR-001", "AC-ADDR-002", "AC-ADDR-003", "AC-ADDR-004", "AC-ADDR-005", "AC-ADDR-006", "AC-ADDR-007", "AC-ADDR-008", "AC-REG-001", "AC-REG-005"] },
  "dialog.cargo-recent": { group: "최근 사용 다이얼로그", source: "../source-snapshot/sections/transport-dialog-recent-lists/05-acceptance-criteria.md", criteria: ["AC-CARGO-001", "AC-CARGO-002", "AC-CARGO-003", "AC-CARGO-004", "AC-CARGO-005", "AC-CARGO-006", "AC-CARGO-007", "AC-REG-002"] },
  "aside.memo": { group: "보조 정보", source: "../source-snapshot/sections/reservation-area-tabs/09-planning-closure.md", checks: ["기본 탭이 메모인지 확인", "메모 추가 dialog 진입 확인", "권한 정책 보류 표시"] },
  "aside.amount-log": { group: "보조 정보", source: "../source-snapshot/sections/reservation-area-tabs/09-planning-closure.md", checks: ["조정금 용어와 +/- 표기 확인", "상세 항목 펼침 확인", "금액 권한/정산 후 수정 보류 표시"] },
  "aside.route-map": { group: "보조 정보", source: "../source-snapshot/sections/reservation-area-tabs/09-planning-closure.md", checks: ["좌측 운송 구간 주소 반복 표시 없음", "주소 미입력 empty 상태 확인", "지도 provider 보류 표시"] },
  "header.status-metrics": { group: "Header 상태", source: "../source-snapshot/root-docs/10-hifi-design-polish-and-dispatch-manager-integration-log.md", checks: ["운송 구간 내부 중복 계산 메타 제거", "거리/기준금액 chip 유지"] },
  "header.dispatch-manager": { group: "Header 상태", source: "../source-snapshot/root-docs/10-hifi-design-polish-and-dispatch-manager-integration-log.md", checks: ["`dispatch-manager-chip` marker 확인", "`김민지` 고정 예시인지 확인", "미지정 상태 후속 결정 필요"] },
  "header.label-toggle": { group: "Header 상태", source: "../source-snapshot/root-docs/10-hifi-design-polish-and-dispatch-manager-integration-log.md", checks: ["`label-toggle-wrap` marker 확인", "`라벨 표시`/`라벨 숨김` tooltip 확인"] }
};

requiredInputSplitGroups.forEach((group) => {
  qaMap[group.id] = {
    group: group.label,
    source: "./09-group-3-required-inputs-split-plan.md",
    criteria: group.qa
  };
});

const legacyNodeRedirects = {
  "new-order.group-required-inputs": "new-order.group-required-shipper",
  "edit-order.section-edit": "edit-order.section-scan",
  "edit-order.dialog-edit": "edit-order.shipper-edit",
  "edit-order.apply": "edit-order.apply-review"
};

const nodeById = Object.fromEntries(nodes.map((node) => [node.id, node]));
let activeNodeId = getInitialNodeId();
let searchTerm = "";
const selectedPartByNode = {};
const liveAnchorStateByNode = {};

document.addEventListener("DOMContentLoaded", () => {
  syncLegacyHash();
  document.getElementById("masterHeaderLink").href = MASTER_HTML;
  document.getElementById("masterPreviewLink").href = MASTER_HTML;
  document.getElementById("nodeCount").textContent = `${getVisibleNavNodeCount()} nodes`;
  window.addEventListener("message", handleLiveMasterMessage);

  const search = document.getElementById("nodeSearch");
  search.addEventListener("input", (event) => {
    searchTerm = event.target.value.trim().toLowerCase();
    renderFlowList();
  });

  renderFlowList();
  renderActiveNode();

  window.addEventListener("resize", syncLiveMasterFrames);
  window.addEventListener("hashchange", () => {
    const rawId = decodeURIComponent(window.location.hash.replace(/^#/, ""));
    const nextId = normalizeNodeId(rawId);
    if (isVisibleNavNodeId(nextId)) {
      setActiveNode(nextId, rawId !== nextId);
    }
  });
});

function getInitialNodeId() {
  const hashId = normalizeNodeId(decodeURIComponent(window.location.hash.replace(/^#/, "")));
  return isVisibleNavNodeId(hashId) ? hashId : getFirstVisibleNodeId();
}

function normalizeNodeId(nodeId) {
  return legacyNodeRedirects[nodeId] || nodeId;
}

function syncLegacyHash() {
  const rawId = decodeURIComponent(window.location.hash.replace(/^#/, ""));
  const normalizedId = normalizeNodeId(rawId);
  if (rawId && rawId !== normalizedId && isVisibleNavNodeId(normalizedId)) {
    window.history.replaceState(null, "", `#${encodeURIComponent(normalizedId)}`);
  }
}

function setActiveNode(nodeId, updateHash = true) {
  activeNodeId = nodeId;
  ensureSelectedPart(nodeById[nodeId]);
  if (updateHash) {
    window.history.replaceState(null, "", `#${encodeURIComponent(nodeId)}`);
  }
  renderFlowList();
  renderActiveNode();
}

function renderFlowList() {
  const flowList = document.getElementById("flowList");
  const html = flows
    .map((flow) => {
      const visibleNodes = flow.nodes
        .map((id) => nodeById[id])
        .filter(Boolean)
        .filter((node) => !node.navHidden)
        .filter((node) => matchesSearch(node));

      if (!visibleNodes.length) return "";
      const meta = flowMeta[flow.id] || {};
      const flowStatus = meta.status || "";

      return `
        <section class="flow-group" data-flow="${escapeAttr(flow.id)}">
          <div class="flow-title">
            <span class="flow-title-copy">
              <span class="flow-label">${escapeHtml(flow.label)}</span>
              <span class="flow-note">${escapeHtml(meta.note || "")}</span>
            </span>
            <span class="flow-badges">
              <span class="flow-mode">${escapeHtml(meta.mode || `${visibleNodes.length}개`)}</span>
              ${flowStatus ? `<span class="flow-status">${escapeHtml(flowStatus)}</span>` : ""}
            </span>
          </div>
          <div class="node-stack" role="list" aria-label="${escapeAttr(flow.label)} node 목록">
            ${visibleNodes
              .map((node, index) => {
                const nav = navMeta[node.id] || {};
                const displayLabel = nav.label || node.label;
                const displayId = nav.displayId || node.id;
                const navStatus = nav.navStatus || "";
                const step = String(index + 1).padStart(2, "0");
                return `
                <button class="node-button ${node.id === activeNodeId ? "active" : ""} ${navStatus ? "is-not-implemented" : ""}" type="button" role="listitem" data-node-id="${escapeAttr(node.id)}" aria-pressed="${node.id === activeNodeId}">
                  <span class="node-step" aria-hidden="true">${escapeHtml(step)}</span>
                  <span class="node-copy">
                    <span class="node-label-row">
                      <span class="node-label">${escapeHtml(displayLabel)}</span>
                      <span class="node-kind">${escapeHtml(nav.kind || "확인")}</span>
                      ${navStatus ? `<span class="node-nav-status">${escapeHtml(navStatus)}</span>` : ""}
                    </span>
                    <span class="node-hint">${escapeHtml(nav.hint || node.previewState)}</span>
                    <span class="node-id">${escapeHtml(displayId)}</span>
                  </span>
                  <span class="node-status-dot" aria-hidden="true"></span>
                </button>
              `;
              })
              .join("")}
          </div>
        </section>
      `;
    })
    .join("");

  flowList.innerHTML = html || `<div class="empty-state">검색 결과가 없습니다.</div>`;
  flowList.querySelectorAll("[data-node-id]").forEach((button) => {
    button.addEventListener("click", () => setActiveNode(button.dataset.nodeId));
  });
}

function renderActiveNode() {
  const node = nodeById[activeNodeId] || nodes[0];
  ensureSelectedPart(node);

  document.getElementById("selectedTitle").textContent = node.label;
  document.getElementById("selectedMeta").innerHTML = renderMetaChips(node);
  document.getElementById("previewStage").innerHTML = renderPreview(node);
  document.getElementById("stateStrip").innerHTML = renderStates(node);
  document.getElementById("stateCount").textContent = `${(node.states || []).length || 1} linked`;
  document.getElementById("centerSources").innerHTML = renderSourceLinks(node.id);
  document.getElementById("detailPanel").innerHTML = renderDetail(node);
  attachCenterPartHandlers(node);
  attachLiveMasterHandlers();
  requestAnimationFrame(syncLiveMasterFrames);
}

function matchesSearch(node) {
  if (!searchTerm) return true;
  const nav = navMeta[node.id] || {};
  const haystack = [
    nav.displayId || node.id,
    nav.label || node.label,
    nav.hint,
    nav.kind,
    node.group,
    node.previewState
  ]
    .join(" ")
    .toLowerCase();
  return haystack.includes(searchTerm);
}

function getVisibleNavNodeCount() {
  return flows.reduce(
    (total, flow) => total + flow.nodes.map((id) => nodeById[id]).filter((node) => node && !node.navHidden).length,
    0
  );
}

function getFirstVisibleNodeId() {
  for (const flow of flows) {
    const first = flow.nodes.find((id) => isVisibleNavNodeId(id));
    if (first) return first;
  }
  return nodes[0].id;
}

function isVisibleNavNodeId(nodeId) {
  if (!nodeById[nodeId] || nodeById[nodeId].navHidden) return false;
  return flows.some((flow) => flow.nodes.includes(nodeId));
}

function getCenterMap(node) {
  return node ? centerPreviewMaps[node.id] : null;
}

function ensureSelectedPart(node) {
  const centerMap = getCenterMap(node);
  if (!centerMap?.parts?.length) return;

  const current = selectedPartByNode[node.id];
  if (!centerMap.parts.some((part) => part.id === current)) {
    selectedPartByNode[node.id] = centerMap.parts[0].id;
  }
}

function getActivePart(node) {
  const centerMap = getCenterMap(node);
  if (!centerMap?.parts?.length) return null;

  ensureSelectedPart(node);
  return centerMap.parts.find((part) => part.id === selectedPartByNode[node.id]) || centerMap.parts[0];
}

function attachCenterPartHandlers(node) {
  const centerMap = getCenterMap(node);
  if (!centerMap?.parts?.length) return;

  document.querySelectorAll("[data-center-part-id]").forEach((button) => {
    button.addEventListener("click", () => {
      const partId = button.dataset.centerPartId;
      if (!centerMap.parts.some((part) => part.id === partId)) return;
      if (selectedPartByNode[node.id] === partId) return;
      selectedPartByNode[node.id] = partId;
      updateActivePartView(node);
    });
  });
}

function updateActivePartView(node) {
  const activePart = getActivePart(node);
  if (!activePart) return;

  const activePartChip = document.querySelector("[data-active-part-chip]");
  if (activePartChip) {
    activePartChip.innerHTML = chip(`${activePart.number}. ${activePart.label}`, "accent");
  }

  document.querySelectorAll(".center-event[data-center-part-id]").forEach((button) => {
    const isActive = button.dataset.centerPartId === activePart.id;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", isActive ? "true" : "false");
  });

  document.querySelectorAll(".overlay-marker[data-center-part-id]").forEach((button) => {
    const isActive = button.dataset.centerPartId === activePart.id;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", isActive ? "true" : "false");
  });

  document.getElementById("detailPanel").innerHTML = renderDetail(node);
  updateLiveMasterFocus(node, activePart);
  postLiveMasterSelectPart(node.id, activePart.id);
}

function renderMetaChips(node) {
  const chips = [
    chip(node.group, "accent"),
    chip(node.previewType, "blue"),
    chip(node.previewState, "warn"),
    ...(node.backlog || []).map((id) => chip(policyBacklog[id]?.priority || id, policyBacklog[id]?.priority === "P0" ? "danger" : "warn"))
  ];
  return chips.join("");
}

function renderPreview(node) {
  const centerMap = getCenterMap(node);
  if (centerMap?.centerMode === "live-master-hotspot") {
    return renderLiveMasterHotspot(node, centerMap);
  }

  if (centerMap?.centerMode === "screenshot-hotspot") {
    return renderScreenshotHotspot(node, centerMap);
  }

  if (centerMap?.centerMode === "numbered-screen-overlay") {
    return renderNumberedScreenOverlay(node, centerMap);
  }

  const isDialog = node.previewType.includes("dialog");
  const isAside = node.previewType.includes("aside");
  const isHeader = node.previewType.includes("header");
  const isSubmit = node.previewType.includes("state-machine");
  const activeMain = isSubmit ? "submit-validating" : node.previewState;

  return `
    <div class="mock-window" aria-label="${escapeAttr(node.label)} preview">
      <div class="mock-header">
        <div class="mock-title">${escapeHtml(node.label)}</div>
        <div class="mock-status">
          ${chip(node.previewState, "accent")}
          ${chip(node.previewType, "blue")}
        </div>
      </div>
      <div class="mock-body">
        <div class="mock-rail">
          <div class="mock-line short"></div>
          <div class="mock-line"></div>
          <div class="mock-line"></div>
          <div class="mock-small"></div>
        </div>
        <div class="mock-main">
          ${isHeader ? `<div class="mock-block active"></div><div class="mock-block"></div><div class="mock-block"></div>` : ""}
          ${isDialog ? renderMockDialog(node) : ""}
          ${!isDialog && !isHeader ? `<div class="mock-block ${isSubmit ? "active" : ""}"></div><div class="mock-block active"></div><div class="mock-block"></div><div class="mock-block"></div>` : ""}
          <div class="preview-note">
            <p><strong>열기 경로:</strong> ${formatInlineCode(node.howToOpen)}</p>
            <p><strong>현재 상태:</strong> ${escapeHtml(activeMain)}</p>
            <p><strong>기준 HTML:</strong> <a href="${MASTER_HTML}" target="_blank" rel="noreferrer">cargo-order-admin-hifi-master.html</a></p>
          </div>
        </div>
        <div class="mock-aside">
          <div class="mock-line short"></div>
          <div class="mock-block ${isAside ? "active" : ""}"></div>
          <div class="mock-block"></div>
        </div>
      </div>
    </div>
  `;
}

function renderMockDialog(node) {
  return `
    <div class="mock-dialog">
      <div class="mock-dialog-head">${escapeHtml(node.label)}</div>
      <div class="mock-dialog-body">
        <div class="mock-line"></div>
        <div class="mock-line short"></div>
        <div class="mock-block active"></div>
        <div class="mock-small"></div>
      </div>
    </div>
  `;
}

function renderLiveMasterHotspot(node, centerMap) {
  const activePart = getActivePart(node);
  const master = centerMap.master || {};
  const screenshot = centerMap.screenshot || {};
  const masterWidth = Number(screenshot.width || 1408);
  const masterHeight = Number(screenshot.height || 662);
  const masterSrc = withQueryParams(master.src || MASTER_HTML, {
    group: node.id,
    part: activePart?.id || ""
  });

  return `
    <div class="center-map live-master-map" aria-label="${escapeAttr(node.label)} live master hotspot preview">
      <div class="center-map-head">
        <div>
          <p class="pane-kicker">Live Master Hotspot</p>
          <h3>${escapeHtml(node.label)}</h3>
        </div>
        <span data-active-part-chip>${activePart ? chip(`${activePart.number}. ${activePart.label}`, "accent") : ""}</span>
      </div>

      <div class="live-master-frame" data-node-id="${escapeAttr(node.id)}" data-master-width="${escapeAttr(masterWidth)}" data-master-height="${escapeAttr(masterHeight)}">
        <iframe
          class="live-master-iframe"
          data-node-id="${escapeAttr(node.id)}"
          src="${escapeAttr(masterSrc)}"
          title="${escapeAttr(master.title || node.label)}"
          width="${escapeAttr(masterWidth)}"
          height="${escapeAttr(masterHeight)}"
          loading="lazy"
        ></iframe>
        <img
          class="live-master-fallback-shot"
          src="${escapeAttr(master.fallbackImage || screenshot.src || "")}"
          alt="${escapeAttr(screenshot.alt || node.label)}"
          width="${escapeAttr(masterWidth)}"
          height="${escapeAttr(masterHeight)}"
        />
        ${renderHotspotFocus(activePart, node)}
        <div class="overlay-markers hotspot-markers" aria-label="그룹 1 live master fallback marker">
          ${centerMap.parts.map((part) => renderOverlayMarker(part, activePart, node)).join("")}
        </div>
      </div>

      <div class="center-event-list" aria-label="그룹 1 이벤트 목록">
        ${centerMap.parts
          .map((part) => `
            <button class="center-event ${part.id === activePart?.id ? "active" : ""}" type="button" data-center-part-id="${escapeAttr(part.id)}" aria-pressed="${part.id === activePart?.id}">
              <span class="center-event-number">${escapeHtml(part.number)}</span>
              <span>
                <strong>${escapeHtml(part.label)}</strong>
                <span>${escapeHtml(part.shortCopy)}</span>
              </span>
            </button>
          `)
          .join("")}
      </div>
    </div>
  `;
}

function attachLiveMasterHandlers() {
  document.querySelectorAll(".live-master-iframe").forEach((iframe) => {
    iframe.addEventListener("load", () => {
      iframe.closest(".live-master-frame")?.classList.add("is-loaded");
    });
    iframe.addEventListener("error", () => {
      iframe.closest(".live-master-frame")?.classList.add("is-fallback");
    });
  });
}

function handleLiveMasterMessage(event) {
  const data = event.data || {};
  if (
    data.type !== "screenmap.anchor-rects" ||
    data.bridge !== "screenmap" ||
    data.source !== "cargo-order-admin-hifi-master"
  ) {
    return;
  }

  const nodeId = data.groupId;
  const node = nodeById[nodeId];
  const centerMap = getCenterMap(node);
  if (!node || centerMap?.centerMode !== "live-master-hotspot") return;
  if (!isActiveLiveMasterSource(event.source, nodeId)) return;

  const previousAnchors = liveAnchorStateByNode[nodeId]?.anchors || {};
  const incomingAnchors = isObjectRecord(data.anchors) ? data.anchors : {};
  liveAnchorStateByNode[nodeId] = {
    anchors: mergeLiveAnchors(previousAnchors, incomingAnchors),
    metrics: getLiveAnchorMetrics(incomingAnchors, liveAnchorStateByNode[nodeId]?.metrics),
    partId: data.partId || "",
    reason: data.reason || "",
    receivedAt: Date.now()
  };

  syncLiveMasterFrames();
  updateLiveMasterMarkers(nodeId);
  postLiveMasterSelectPart(nodeId, selectedPartByNode[nodeId]);
}

function isActiveLiveMasterSource(source, nodeId) {
  const iframe = getActiveLiveMasterIframe(nodeId);
  return Boolean(iframe?.contentWindow && source === iframe.contentWindow);
}

function getActiveLiveMasterIframe(nodeId) {
  if (nodeId !== activeNodeId) return null;
  const iframe = document.querySelector(".live-master-iframe");
  return iframe?.dataset.nodeId === nodeId ? iframe : null;
}

function postLiveMasterSelectPart(nodeId, partId) {
  if (!nodeId || !partId) return false;
  const iframe = getActiveLiveMasterIframe(nodeId);
  if (!iframe?.contentWindow) return false;

  const sendKey = `${nodeId}:${partId}`;
  if (iframe.dataset.selectPartSent === sendKey) return false;
  iframe.dataset.selectPartSent = sendKey;
  try {
    iframe.contentWindow.postMessage(
      {
        type: "screenmap.select-part",
        groupId: nodeId,
        partId
      },
      "*"
    );
    return true;
  } catch {
    delete iframe.dataset.selectPartSent;
    return false;
  }
}

function updateLiveMasterMarkers(nodeId) {
  if (nodeId !== activeNodeId) return;
  const node = nodeById[nodeId];
  const centerMap = getCenterMap(node);
  if (!centerMap?.parts?.length) return;

  const frame = document.querySelector(".live-master-frame");
  if (frame?.dataset.nodeId !== nodeId) return;
  const hasLive = centerMap.parts.some((part) => Boolean(getLiveAnchorRect(nodeId, part.id)));
  frame?.classList.toggle("has-live-anchors", hasLive);
  updateLiveMasterFocus(node, getActivePart(node));

  document.querySelectorAll(".hotspot-markers .overlay-marker[data-center-part-id]").forEach((markerEl) => {
    const part = centerMap.parts.find((item) => item.id === markerEl.dataset.centerPartId);
    if (!part) return;
    const marker = getPartMarkerPosition(node, part);
    markerEl.style.left = `${marker.x}%`;
    markerEl.style.top = `${marker.y}%`;
    markerEl.dataset.anchorSource = marker.source;
    markerEl.dataset.markerPlacement = marker.placement;
    markerEl.classList.toggle("is-live", marker.source === "live");
    markerEl.classList.toggle("is-fallback", marker.source === "fallback");
    markerEl.classList.toggle("is-pending-live", marker.pending === true);
    markerEl.setAttribute("aria-hidden", marker.pending ? "true" : "false");
    markerEl.tabIndex = marker.pending ? -1 : 0;
  });
}

function updateLiveMasterFocus(node, activePart) {
  const focusEl = document.querySelector(".live-master-frame .hotspot-focus");
  if (!focusEl || !node || !activePart) return;

  const rect = getHotspotFocusRect(activePart, node);
  if (!rect) return;
  focusEl.style.left = `${rect.x}%`;
  focusEl.style.top = `${rect.y}%`;
  focusEl.style.width = `${rect.width}%`;
  focusEl.style.height = `${rect.height}%`;
  focusEl.dataset.anchorSource = rect.source;
  focusEl.classList.toggle("is-pending-live", rect.pending === true);
}

function syncLiveMasterFrames() {
  document.querySelectorAll(".live-master-frame").forEach((frame) => {
    const iframe = frame.querySelector(".live-master-iframe");
    const width = Number(frame.dataset.masterWidth);
    const baseHeight = Number(frame.dataset.masterHeight);
    const liveHeight = getLiveMasterDocumentHeight(frame.dataset.nodeId);
    const height = liveHeight || baseHeight;
    if (!iframe || !width || !height) return;

    const scale = frame.clientWidth / width;
    frame.style.height = `${Math.round(height * scale)}px`;
    iframe.style.width = `${width}px`;
    iframe.style.height = `${height}px`;
    iframe.style.transform = `scale(${scale})`;
  });
}

function renderScreenshotHotspot(node, centerMap) {
  const activePart = getActivePart(node);
  const screenshot = centerMap.screenshot || {};

  return `
    <div class="center-map" aria-label="${escapeAttr(node.label)} master screenshot hotspot preview">
      <div class="center-map-head">
        <div>
          <p class="pane-kicker">Master Capture Hotspot</p>
          <h3>${escapeHtml(node.label)}</h3>
        </div>
        <span data-active-part-chip>${activePart ? chip(`${activePart.number}. ${activePart.label}`, "accent") : ""}</span>
      </div>

      <div class="master-shot-frame">
        <img
          class="master-shot"
          src="${escapeAttr(screenshot.src || "")}"
          alt="${escapeAttr(screenshot.alt || node.label)}"
          width="${escapeAttr(screenshot.width || "")}"
          height="${escapeAttr(screenshot.height || "")}"
        />
        ${renderHotspotFocus(activePart)}
        <div class="overlay-markers hotspot-markers" aria-label="그룹 1 master screenshot hotspot marker">
          ${centerMap.parts.map((part) => renderOverlayMarker(part, activePart)).join("")}
        </div>
      </div>

      <div class="center-event-list" aria-label="그룹 1 이벤트 목록">
        ${centerMap.parts
          .map((part) => `
            <button class="center-event ${part.id === activePart?.id ? "active" : ""}" type="button" data-center-part-id="${escapeAttr(part.id)}" aria-pressed="${part.id === activePart?.id}">
              <span class="center-event-number">${escapeHtml(part.number)}</span>
              <span>
                <strong>${escapeHtml(part.label)}</strong>
                <span>${escapeHtml(part.shortCopy)}</span>
              </span>
            </button>
          `)
          .join("")}
      </div>
    </div>
  `;
}

function renderHotspotFocus(activePart, node = null) {
  const rect = getHotspotFocusRect(activePart, node);
  if (!rect) return "";
  const pendingClass = rect.pending ? " is-pending-live" : "";

  return `
    <span
      class="hotspot-focus${pendingClass}"
      data-anchor-source="${escapeAttr(rect.source)}"
      aria-hidden="true"
      style="left: ${escapeAttr(rect.x)}%; top: ${escapeAttr(rect.y)}%; width: ${escapeAttr(rect.width)}%; height: ${escapeAttr(rect.height)}%;"
    ></span>
  `;
}

function getHotspotFocusRect(activePart, node = null) {
  if (!activePart) return null;

  const liveRect = getLiveAnchorRect(node?.id, activePart.id);
  if (liveRect) {
    const documentWidth = toFiniteNumber(liveRect.documentWidth);
    const documentHeight = toFiniteNumber(liveRect.documentHeight);
    const pageX = toFiniteNumber(liveRect.pageX);
    const pageY = toFiniteNumber(liveRect.pageY);
    const width = toFiniteNumber(liveRect.width);
    const height = toFiniteNumber(liveRect.height);

    if (documentWidth && documentHeight && pageX !== null && pageY !== null && width !== null && height !== null) {
      return {
        x: clampPercent(((pageX - width / 2) / documentWidth) * 100, 0, 100),
        y: clampPercent(((pageY - height / 2) / documentHeight) * 100, 0, 100),
        width: clampPercent((width / documentWidth) * 100, 1, 100),
        height: clampPercent((height / documentHeight) * 100, 1, 100),
        source: "live"
      };
    }
  }

  if (shouldWaitForLiveAnchor(node, activePart)) {
    const fallbackRect = activePart.focusRect || { x: 50, y: 50, width: 1, height: 1 };
    return { ...fallbackRect, source: "pending-live", pending: true };
  }

  return activePart.focusRect ? { ...activePart.focusRect, source: "fallback" } : null;
}

function renderNumberedScreenOverlay(node, centerMap) {
  const activePart = getActivePart(node);
  const activeZone = activePart?.targetZone || "";

  return `
    <div class="center-map" aria-label="${escapeAttr(node.label)} numbered preview">
      <div class="center-map-head">
        <div>
          <p class="pane-kicker">Numbered Overlay</p>
          <h3>${escapeHtml(node.label)}</h3>
        </div>
        <span data-active-part-chip>${activePart ? chip(`${activePart.number}. ${activePart.label}`, "accent") : ""}</span>
      </div>

      <div class="schematic-screen">
        <div class="schematic-toolbar ${activeZone === "header-action" ? "active-zone" : ""}">
          <div class="schematic-title">화물 오더 접수/수정</div>
          <div class="schematic-actions">
            <span>조회</span>
            <strong>신규(F3)</strong>
            <span>저장</span>
          </div>
        </div>

        <div class="schematic-status ${activeZone === "status-area" ? "active-zone" : ""}">
          <span>idle-edit</span>
          <strong>new-reset</strong>
          <span>입력 준비</span>
        </div>

        <div class="schematic-body">
          <aside class="schematic-process">
            <span>신규 접수</span>
            <strong>1 화주 정보</strong>
            <span>2 상차지</span>
            <span>3 하차지</span>
          </aside>
          <section class="schematic-form ${activeZone === "main-form" ? "active-zone" : ""}">
            <div class="schematic-section-header ${activeZone === "section-header" ? "active-zone" : ""}">
              <strong>01 화주 정보</strong>
              <span>신규 접수 입력 단계</span>
            </div>
            <div class="schematic-field ${activeZone === "shipper-section" ? "active-zone" : ""}">
              <strong>화주 정보 입력</strong>
              <span>focus target</span>
            </div>
            <div class="schematic-field muted"></div>
            <div class="schematic-field muted"></div>
          </section>
        </div>

        <div class="overlay-markers" aria-label="그룹 1 part marker">
          ${centerMap.parts.map((part) => renderOverlayMarker(part, activePart)).join("")}
        </div>
      </div>

      <div class="center-event-list" aria-label="그룹 1 이벤트 목록">
        ${centerMap.parts
          .map((part) => `
            <button class="center-event ${part.id === activePart?.id ? "active" : ""}" type="button" data-center-part-id="${escapeAttr(part.id)}" aria-pressed="${part.id === activePart?.id}">
              <span class="center-event-number">${escapeHtml(part.number)}</span>
              <span>
                <strong>${escapeHtml(part.label)}</strong>
                <span>${escapeHtml(part.shortCopy)}</span>
              </span>
            </button>
          `)
          .join("")}
      </div>
    </div>
  `;
}

function renderOverlayMarker(part, activePart, node = null) {
  const marker = getPartMarkerPosition(node, part);
  const activeClass = part.id === activePart?.id ? "active" : "";
  const sourceClass = marker.source === "live" ? "is-live" : marker.source === "fallback" ? "is-fallback" : "";
  const pendingClass = marker.pending ? "is-pending-live" : "";
  return `
    <button
      class="overlay-marker ${activeClass} ${sourceClass} ${pendingClass}"
      type="button"
      data-center-part-id="${escapeAttr(part.id)}"
      data-anchor-source="${escapeAttr(marker.source)}"
      data-marker-placement="${escapeAttr(marker.placement)}"
      style="left: ${escapeAttr(marker.x)}%; top: ${escapeAttr(marker.y)}%;"
      aria-label="${escapeAttr(`${part.number}. ${part.label}`)}"
      aria-pressed="${part.id === activePart?.id}"
      aria-hidden="${marker.pending ? "true" : "false"}"
      tabindex="${marker.pending ? "-1" : "0"}"
    >
      ${escapeHtml(part.number)}
    </button>
  `;
}

function getPartMarkerPosition(node, part) {
  const liveAnchor = getLiveAnchor(node?.id, part.id);
  const liveRect = liveAnchor?.rect || null;
  if (liveRect) {
    const placement = getPartMarkerPlacement(part, liveAnchor);
    const markerPoint = getLiveMarkerPoint(liveRect, placement);
    return {
      x: clampPercent(markerPoint.x),
      y: clampPercent(markerPoint.y),
      source: "live",
      placement
    };
  }

  const marker = part.marker || { x: 50, y: 50 };
  if (shouldWaitForLiveAnchor(node, part)) {
    return {
      x: clampPercent(marker.x, 0, 100),
      y: clampPercent(marker.y, 0, 100),
      source: "pending-live",
      placement: "center",
      pending: true
    };
  }

  return {
    x: clampPercent(marker.x, 0, 100),
    y: clampPercent(marker.y, 0, 100),
    source: "fallback",
    placement: "center"
  };
}

function shouldWaitForLiveAnchor(node, part) {
  return Boolean(
    (node?.id?.startsWith("new-order.group-required-") &&
      part?.id?.startsWith("group-required-inputs.")) ||
      (node?.id === "new-order.group-amount-branch" &&
        part?.id?.startsWith("group-amount-branch.")) ||
      (node?.id === "new-order.group-driver-choice" &&
        part?.id?.startsWith("group-driver-choice.")) ||
      (node?.id === "new-order.group-main-apply" &&
        part?.id?.startsWith("group-main-apply.")) ||
      (node?.id === "edit-order.shipper-edit" &&
        part?.id?.startsWith("edit-shipper.")) ||
      (node?.id === "edit-order.route-edit" &&
        part?.id?.startsWith("edit-route.")) ||
      (node?.id === "edit-order.cargo-money-edit" &&
        part?.id?.startsWith("edit-cargo-money.")) ||
      (node?.id === "edit-order.driver-edit" &&
        part?.id?.startsWith("edit-driver.")) ||
      (node?.id === "edit-order.apply-review" &&
        part?.id?.startsWith("edit-apply-review."))
  );
}

function getPartMarkerPlacement(part, liveAnchor = null) {
  if (part.liveMarkerPlacement) {
    return normalizeMarkerPlacement(part.liveMarkerPlacement);
  }

  if (isButtonAnchor(liveAnchor)) {
    return getAutoButtonMarkerPlacement(liveAnchor.rect);
  }

  return "center";
}

function normalizeMarkerPlacement(placement) {
  return ["above", "below", "left", "right", "center"].includes(placement) ? placement : "center";
}

function isButtonAnchor(anchor) {
  const target = anchor?.target || {};
  const tagName = String(target.tagName || "").toLowerCase();
  const role = String(target.role || "").toLowerCase();
  return Boolean(target.isButton || tagName === "button" || role === "button");
}

function getAutoButtonMarkerPlacement(rect) {
  const x = resolveLivePercent(rect, "x");
  const y = resolveLivePercent(rect, "y");
  if (x >= 82) return "left";
  if (x <= 18) return "right";
  if (y <= 12) return "below";
  return "above";
}

function getLiveMarkerPoint(rect, placement) {
  if (placement === "center") {
    return {
      x: resolveLivePercent(rect, "x"),
      y: resolveLivePercent(rect, "y")
    };
  }

  const bounds = getLiveAnchorBoundsPercent(rect);
  if (!bounds) {
    return {
      x: resolveLivePercent(rect, "x"),
      y: resolveLivePercent(rect, "y")
    };
  }

  if (placement === "above") return { x: bounds.centerX, y: bounds.top };
  if (placement === "below") return { x: bounds.centerX, y: bounds.bottom };
  if (placement === "left") return { x: bounds.left, y: bounds.centerY };
  if (placement === "right") return { x: bounds.right, y: bounds.centerY };

  return { x: bounds.centerX, y: bounds.centerY };
}

function getLiveAnchorBoundsPercent(rect) {
  const pageX = toFiniteNumber(rect.pageX);
  const pageY = toFiniteNumber(rect.pageY);
  const width = toFiniteNumber(rect.width);
  const height = toFiniteNumber(rect.height);
  const documentWidth = toFiniteNumber(rect.documentWidth);
  const documentHeight = toFiniteNumber(rect.documentHeight);
  if (
    pageX === null ||
    pageY === null ||
    width === null ||
    height === null ||
    !documentWidth ||
    !documentHeight
  ) {
    return null;
  }

  const left = ((pageX - width / 2) / documentWidth) * 100;
  const right = ((pageX + width / 2) / documentWidth) * 100;
  const top = ((pageY - height / 2) / documentHeight) * 100;
  const bottom = ((pageY + height / 2) / documentHeight) * 100;

  return {
    left,
    right,
    top,
    bottom,
    centerX: (left + right) / 2,
    centerY: (top + bottom) / 2
  };
}

function getLiveAnchorRect(nodeId, partId) {
  return getLiveAnchor(nodeId, partId)?.rect || null;
}

function getLiveAnchor(nodeId, partId) {
  if (!nodeId || !partId) return null;
  const anchor = liveAnchorStateByNode[nodeId]?.anchors?.[partId];
  return anchor?.found && anchor.rect ? anchor : null;
}

function getLiveMasterDocumentHeight(nodeId) {
  const height = toFiniteNumber(liveAnchorStateByNode[nodeId]?.metrics?.documentHeight);
  const baseHeight = Number(getCenterMap(nodeById[nodeId])?.screenshot?.height || 0);
  if (height === null || height <= baseHeight) return null;
  return Math.min(Math.ceil(height), 2400);
}

function getLiveAnchorMetrics(anchors, fallback = null) {
  let documentWidth = toFiniteNumber(fallback?.documentWidth);
  let documentHeight = toFiniteNumber(fallback?.documentHeight);
  Object.values(anchors).forEach((anchor) => {
    const rect = anchor?.rect;
    if (!anchor?.found || !rect) return;
    documentWidth = Math.max(documentWidth || 0, toFiniteNumber(rect.documentWidth) || 0);
    documentHeight = Math.max(documentHeight || 0, toFiniteNumber(rect.documentHeight) || 0);
  });
  return { documentWidth, documentHeight };
}

function mergeLiveAnchors(previousAnchors, incomingAnchors) {
  const merged = { ...previousAnchors };
  Object.entries(incomingAnchors).forEach(([partId, anchor]) => {
    if (!isObjectRecord(anchor)) return;
    if (anchor.found && anchor.rect) {
      merged[partId] = anchor;
      return;
    }
    merged[partId] = { ...anchor, rect: null };
  });
  return merged;
}

function resolveLivePercent(rect, axis) {
  const direct = toFiniteNumber(axis === "x" ? rect.documentPercentX : rect.documentPercentY);
  if (direct !== null) return direct;

  const page = toFiniteNumber(axis === "x" ? rect.pageX : rect.pageY);
  const documentSize = toFiniteNumber(axis === "x" ? rect.documentWidth : rect.documentHeight);
  if (page !== null && documentSize && documentSize > 0) return (page / documentSize) * 100;

  const viewportDirect = toFiniteNumber(axis === "x" ? rect.percentX : rect.percentY);
  if (viewportDirect !== null) return viewportDirect;

  const center = toFiniteNumber(axis === "x" ? rect.centerX : rect.centerY);
  const viewport = toFiniteNumber(axis === "x" ? rect.viewportWidth : rect.viewportHeight);
  if (center !== null && viewport && viewport > 0) return (center / viewport) * 100;

  return 50;
}

function clampPercent(value, min = 3, max = 97) {
  const number = toFiniteNumber(value);
  if (number === null) return 50;
  return Math.min(max, Math.max(min, number));
}

function toFiniteNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function isObjectRecord(value) {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function renderPartDetail(node) {
  const centerMap = getCenterMap(node);
  if (!centerMap) return "";

  const activePart = getActivePart(node);
  if (!activePart) return "";

  return `
    <section class="detail-section part-detail-section">
      <div class="part-detail-head">
        <span class="part-number">${escapeHtml(activePart.number)}</span>
        <div>
          <h3>${escapeHtml(activePart.label)}</h3>
          <p>${escapeHtml(activePart.shortCopy)}</p>
        </div>
      </div>
      <div class="part-detail-grid">
        <div class="part-detail-item">
          <strong>Event</strong>
          <span>${escapeHtml(activePart.event)}</span>
        </div>
        <div class="part-detail-item">
          <strong>State</strong>
          <span>${escapeHtml(activePart.stateBefore)} -> ${escapeHtml(activePart.stateAfter)}</span>
        </div>
        <div class="part-detail-item">
          <strong>Target</strong>
          <span>${escapeHtml(activePart.targetZone)}</span>
        </div>
      </div>
      <p>${escapeHtml(activePart.detail)}</p>
      <div class="inline-chip-list">
        ${(activePart.qa || []).map((item) => chip(item, "blue")).join("")}
      </div>
    </section>
  `;
}

function renderStates(node) {
  const ids = node.states?.length ? node.states : [node.previewState];
  return ids
    .map((id) => {
      const state = screenStates.find((item) => item.id === id);
      return `
        <div class="state-card ${node.previewState.includes(id) ? "active" : ""}">
          <strong>${escapeHtml(state?.label || id)}</strong>
          <span>${escapeHtml(state?.entry || id)}</span>
        </div>
      `;
    })
    .join("");
}

function renderSourceLinks(nodeId) {
  const links = sourceLinks[nodeId] || [];
  if (!links.length) {
    return `<div class="empty-state">이 node에 연결된 source link가 없습니다.</div>`;
  }

  return links
    .map((source) => {
      const href = toScreenmapHref(source);
      const label = source.replace(/^\.\.\//, "");
      return `
        <a class="source-link" href="${escapeAttr(href)}" target="_blank" rel="noreferrer">
          <strong>${escapeHtml(fileName(label))}</strong>
          <span>${escapeHtml(href)}</span>
        </a>
      `;
    })
    .join("");
}

function renderDetail(node) {
  return `
    ${renderPartDetail(node)}

    <section class="detail-section">
      <h3>기능 설명</h3>
      <p>${formatInlineCode(node.summary)}</p>
    </section>

    <section class="detail-section">
      <h3>Data Contract</h3>
      <div class="detail-list">${renderContracts(node.dataContracts || [])}</div>
    </section>

    <section class="detail-section">
      <h3>Validation</h3>
      ${renderSimpleList(node.validation || ["해당 node에서 직접 검증 규칙 없음"])}
    </section>

    <section class="detail-section">
      <h3>API / 정책 보류</h3>
      ${renderApiPolicy(node)}
    </section>

    <section class="detail-section">
      <h3>QA Point</h3>
      ${renderQa(node.id)}
    </section>

    <section class="detail-section">
      <h3>Handoff Checklist</h3>
      ${renderSimpleList(node.checklist || [])}
    </section>

    <section class="detail-section">
      <h3>Source</h3>
      <div class="source-list">${renderSourceLinks(node.id)}</div>
    </section>
  `;
}

function renderContracts(contractNames) {
  if (!contractNames.length) {
    return `<div class="empty-state">연결된 data contract가 없습니다.</div>`;
  }

  return contractNames
    .map((name) => {
      const contract = dataContracts[name];
      if (!contract) {
        return `<div class="detail-card"><strong>${escapeHtml(name)}</strong><p class="muted-label">field 정보 없음</p></div>`;
      }

      return `
        <div class="detail-card">
          <strong>${escapeHtml(name)}</strong>
          <ul class="field-list">
            ${contract.fields.map((field) => `<li>${escapeHtml(field)}</li>`).join("")}
          </ul>
          <div class="inline-chip-list" aria-label="${escapeAttr(name)} 사용 위치">
            ${contract.usedBy.map((item) => chip(item, "")).join("")}
          </div>
        </div>
      `;
    })
    .join("");
}

function renderApiPolicy(node) {
  const direct = [...(node.api || []), ...(node.policy || [])];
  const backlog = node.backlog || [];
  const directHtml = direct.length ? renderSimpleList(direct) : `<p class="muted-label">node별 직접 API 설명 없음</p>`;
  const backlogHtml = backlog.length
    ? `
      <div class="backlog-list">
        ${backlog
          .map((id) => {
            const item = policyBacklog[id];
            if (!item) return "";
            const tone = item.priority === "P0" ? "danger" : "warn";
            return `
              <div class="backlog-item">
                <div class="backlog-head">
                  <strong>${escapeHtml(id)}</strong>
                  ${chip(item.priority, tone)}
                </div>
                <p>${escapeHtml(item.decisionNeeded)}</p>
                <p><strong>영향:</strong> ${escapeHtml(item.impact)}</p>
              </div>
            `;
          })
          .join("")}
      </div>
    `
    : `<div class="empty-state">P0/P1 backlog 연결 없음</div>`;

  return `${directHtml}<div class="detail-section">${backlogHtml}</div>`;
}

function renderQa(nodeId) {
  const qa = qaMap[nodeId];
  if (!qa) {
    return `<div class="empty-state">연결된 QA point가 없습니다.</div>`;
  }

  const entries = qa.criteria || qa.checks || [];
  const qaSource = toScreenmapHref(qa.source);
  return `
    <div class="qa-list">
      <div class="qa-item">
        <div class="qa-item-head">
          <strong>${escapeHtml(qa.group)}</strong>
          <a href="${escapeAttr(qaSource)}" target="_blank" rel="noreferrer">source</a>
        </div>
        <div class="inline-chip-list">
          ${entries.map((entry) => chip(entry, qa.criteria ? "blue" : "accent")).join("")}
        </div>
      </div>
    </div>
  `;
}

function renderSimpleList(items) {
  if (!items.length) return `<div class="empty-state">항목 없음</div>`;
  return `<ul class="plain-list">${items.map((item) => `<li>${formatInlineCode(item)}</li>`).join("")}</ul>`;
}

function chip(label, tone) {
  return `<span class="chip ${tone || ""}">${escapeHtml(label)}</span>`;
}

function toScreenmapHref(source) {
  if (!source) return SOURCE_ROOT;
  if (source.startsWith("http") || source.startsWith("file:")) return source;
  if (source.startsWith("./")) return source;
  const cleaned = source.replace(/^\.\.\//, "");
  return `${SOURCE_ROOT}/${cleaned}`;
}

function withQueryParams(href, params) {
  const [base, query = ""] = String(href || "").split("?");
  const search = new URLSearchParams(query);
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") {
      search.delete(key);
      return;
    }
    search.set(key, value);
  });

  const nextQuery = search.toString();
  return nextQuery ? `${base}?${nextQuery}` : base;
}

function fileName(path) {
  const parts = path.split("/");
  return parts[parts.length - 1] || path;
}

function formatInlineCode(text) {
  return escapeHtml(text || "").replace(/`([^`]+)`/g, "<code>$1</code>");
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttr(value) {
  return escapeHtml(value);
}
