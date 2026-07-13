import { readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const toolDir = dirname(fileURLToPath(import.meta.url));
const screenmapDir = resolve(toolDir, "..");
const planDir = resolve(screenmapDir, "..");
const masterPath = resolve(
  planDir,
  "wireframes/final-handoff/baseline/html/cargo-order-admin-hifi-master.html"
);

const templatePattern = /(<script type="__bundler\/template">\s*)([\s\S]*?)(\s*<\/script>)/;
const bridgePattern =
  /\n?<!-- SCREENMAP_BRIDGE_LAYER_START -->[\s\S]*?<!-- SCREENMAP_BRIDGE_LAYER_END -->\n?/;

const bridgeLayer = String.raw`<!-- SCREENMAP_BRIDGE_LAYER_START -->
<script id="screenmap-bridge-script">
(function () {
  var params = new URLSearchParams(window.location.search || "");
  if (params.get("screenmap") !== "1") return;

  var VERSION = "screenmap-bridge-20260622-edit-apply-review";
  var state = {
    groupId: params.get("group") || "",
    partId: params.get("part") || "",
    view: params.get("screenmapView") || "core",
    allowScroll: params.get("screenmapScroll") === "1",
    anchorRects: {},
    selectToken: 0
  };
  var mainApplyPreparing = false;
  var mainApplyCallbacks = [];
  var applyReviewPreparing = false;
  var applyReviewCallbacks = [];

  var anchors = {
    "group-init.click-new": {
      key: "new-order.click-new",
      selectors: ['[data-screenmap-anchor="new-order.click-new"]'],
      text: [{ selector: "button", value: "신규 접수" }]
    },
    "group-init.reset-fields": {
      key: "new-order.reset-fields",
      selectors: [
        '[data-screenmap-anchor="new-order.reset-fields"]',
        ".stack-main",
        ".app-main"
      ]
    },
    "group-init.state-new-reset": {
      key: "new-order.state-new-reset",
      selectors: [
        '[data-screenmap-anchor="new-order.state-new-reset"]',
        ".new-order-flow-status.is-visible",
        "#hdr-status",
        ".app-head__status"
      ],
      text: [{ selector: "*", value: "new-reset" }, { selector: "*", value: "신규 접수" }]
    },
    "group-init.section-headers": {
      key: "new-order.section-headers",
      selectors: [
        '[data-screenmap-anchor="new-order.section-headers"]',
        ".stack-main .ds-section > .sec-head",
        ".sec-head"
      ]
    },
    "group-init.shipper-focus": {
      key: "new-order.shipper-focus",
      selectors: [
        '[data-screenmap-anchor="new-order.shipper-focus"]',
        ".new-order-required-action",
        ".new-order-first-focus"
      ],
      text: [
        { selector: ".new-order-required-action", value: "화주" },
        { selector: "button", value: "화주 정보" }
      ]
    },
    "group-wizard-entry.shipper-cta": {
      key: "new-order.wizard-entry.shipper-cta",
      selectors: [
        '[data-screenmap-anchor="new-order.wizard-entry.shipper-cta"]',
        ".new-order-required-action"
      ],
      text: [
        { selector: ".new-order-required-action", value: "화주 정보" },
        { selector: "button", value: "화주 정보 입력" }
      ]
    },
    "group-wizard-entry.dialog-open": {
      key: "new-order.wizard-entry.dialog",
      selectors: [
        '[data-screenmap-anchor="new-order.wizard-entry.dialog"]',
        '.dialog.dialog--new-order-wizard[data-new-order-step="shipper"]',
        ".dialog.dialog--new-order-wizard"
      ]
    },
    "group-wizard-entry.process-panel": {
      key: "new-order.wizard-entry.process-panel",
      selectors: [
        '[data-screenmap-anchor="new-order.wizard-entry.process-panel"]',
        ".dialog.dialog--new-order-wizard .new-order-process-panel",
        ".new-order-process-panel"
      ]
    },
    "group-wizard-entry.state-active": {
      key: "new-order.wizard-entry.state-active",
      selectors: [
        '[data-screenmap-anchor="new-order.wizard-entry.state-active"]',
        '.new-order-step-item[data-step="shipper"][data-state="current"]',
        '.dialog.dialog--new-order-wizard[data-new-order-step="shipper"]',
        ".dialog.dialog--new-order-wizard"
      ]
    },
    "group-required-inputs.shipper-complete": {
      key: "new-order.required-inputs.shipper-complete",
      selectors: [
        '[data-screenmap-anchor="new-order.required-inputs.shipper-complete"]',
        "#dlg-apply",
        ".dialog__foot-actions .btn--primary"
      ],
      requireTextMatch: true,
      text: [{ selector: "button", value: "화주 정보에 적용" }]
    },
    "group-required-inputs.shipper-search": {
      key: "new-order.required-inputs.shipper-search",
      selectors: [
        '[data-screenmap-anchor="new-order.required-inputs.shipper-search"]',
        ".dialog.dialog--new-order-wizard .lookup-search"
      ]
    },
    "group-required-inputs.shipper-result-select": {
      key: "new-order.required-inputs.shipper-result-select",
      selectors: [
        '[data-screenmap-anchor="new-order.required-inputs.shipper-result-select"]',
        ".dialog.dialog--new-order-wizard .rrow.is-selected",
        ".dialog.dialog--new-order-wizard .rrow"
      ]
    },
    "group-required-inputs.shipper-selected-preview": {
      key: "new-order.required-inputs.shipper-selected-preview",
      selectors: [
        '[data-screenmap-anchor="new-order.required-inputs.shipper-selected-preview"]',
        ".dialog.dialog--new-order-wizard .preview-aside .pcard:first-child",
        ".dialog.dialog--new-order-wizard .preview-aside"
      ]
    },
    "group-required-inputs.shipper-contact-add": {
      key: "new-order.required-inputs.shipper-contact-add",
      selectors: [
        '[data-screenmap-anchor="new-order.required-inputs.shipper-contact-add"]',
        ".dialog.dialog--new-order-wizard .preview-aside .pcard:nth-of-type(2)",
        ".dialog.dialog--new-order-wizard .preview-aside"
      ]
    },
    "group-required-inputs.load-step": {
      key: "new-order.required-inputs.load-step",
      selectors: [
        '[data-screenmap-anchor="new-order.required-inputs.load-step"]',
        '.new-order-step-item[data-step="load"][data-state="current"]'
      ]
    },
    "group-required-inputs.load-address-search": {
      key: "new-order.required-inputs.load-address-search",
      selectors: [
        '[data-screenmap-anchor="new-order.required-inputs.load-address-search"]',
        '.dialog.dialog--new-order-wizard[data-new-order-step="load"] .lookup-search',
        ".dialog.dialog--new-order-wizard .lookup-search"
      ]
    },
    "group-required-inputs.load-result-select": {
      key: "new-order.required-inputs.load-result-select",
      selectors: [
        '[data-screenmap-anchor="new-order.required-inputs.load-result-select"]',
        '.dialog.dialog--new-order-wizard[data-new-order-step="load"] .rrow.is-selected',
        '.dialog.dialog--new-order-wizard[data-new-order-step="load"] .rrow',
        ".dialog.dialog--new-order-wizard .rrow.is-selected"
      ]
    },
    "group-required-inputs.load-selected-preview": {
      key: "new-order.required-inputs.load-selected-preview",
      selectors: [
        '[data-screenmap-anchor="new-order.required-inputs.load-selected-preview"]',
        '.dialog.dialog--new-order-wizard[data-new-order-step="load"] #addr-pcard',
        '.dialog.dialog--new-order-wizard[data-new-order-step="load"] .preview-aside .pcard:first-child',
        ".dialog.dialog--new-order-wizard .preview-aside .pcard:first-child"
      ]
    },
    "group-required-inputs.load-condition": {
      key: "new-order.required-inputs.load-condition",
      selectors: [
        '[data-screenmap-anchor="new-order.required-inputs.load-condition"]',
        '.dialog.dialog--new-order-wizard[data-new-order-step="load"] .preview-aside .pcard:nth-of-type(2)',
        ".dialog.dialog--new-order-wizard .preview-aside .pcard:nth-of-type(2)"
      ]
    },
    "group-required-inputs.load-complete": {
      key: "new-order.required-inputs.load-complete",
      selectors: [
        '[data-screenmap-anchor="new-order.required-inputs.load-complete"]',
        "#dlg-apply",
        ".dialog__foot-actions .btn--primary"
      ],
      requireTextMatch: true,
      text: [{ selector: "button", value: "상차지 적용" }]
    },
    "group-required-inputs.unload-step": {
      key: "new-order.required-inputs.unload-step",
      selectors: [
        '[data-screenmap-anchor="new-order.required-inputs.unload-step"]',
        '.new-order-step-item[data-step="unload"][data-state="current"]'
      ]
    },
    "group-required-inputs.unload-address-search": {
      key: "new-order.required-inputs.unload-address-search",
      selectors: [
        '[data-screenmap-anchor="new-order.required-inputs.unload-address-search"]',
        '.dialog.dialog--new-order-wizard[data-new-order-step="unload"] .lookup-search',
        ".dialog.dialog--new-order-wizard .lookup-search"
      ]
    },
    "group-required-inputs.unload-result-select": {
      key: "new-order.required-inputs.unload-result-select",
      selectors: [
        '[data-screenmap-anchor="new-order.required-inputs.unload-result-select"]',
        '.dialog.dialog--new-order-wizard[data-new-order-step="unload"] .rrow.is-selected',
        '.dialog.dialog--new-order-wizard[data-new-order-step="unload"] .rrow',
        ".dialog.dialog--new-order-wizard .rrow.is-selected"
      ]
    },
    "group-required-inputs.unload-selected-preview": {
      key: "new-order.required-inputs.unload-selected-preview",
      selectors: [
        '[data-screenmap-anchor="new-order.required-inputs.unload-selected-preview"]',
        '.dialog.dialog--new-order-wizard[data-new-order-step="unload"] #addr-pcard',
        '.dialog.dialog--new-order-wizard[data-new-order-step="unload"] .preview-aside .pcard:first-child',
        ".dialog.dialog--new-order-wizard .preview-aside .pcard:first-child"
      ]
    },
    "group-required-inputs.unload-condition": {
      key: "new-order.required-inputs.unload-condition",
      selectors: [
        '[data-screenmap-anchor="new-order.required-inputs.unload-condition"]',
        '.dialog.dialog--new-order-wizard[data-new-order-step="unload"] .preview-aside .pcard:nth-of-type(2)',
        ".dialog.dialog--new-order-wizard .preview-aside .pcard:nth-of-type(2)"
      ]
    },
    "group-required-inputs.unload-complete": {
      key: "new-order.required-inputs.unload-complete",
      selectors: [
        '[data-screenmap-anchor="new-order.required-inputs.unload-complete"]',
        "#dlg-apply",
        ".dialog__foot-actions .btn--primary"
      ],
      requireTextMatch: true,
      text: [{ selector: "button", value: "하차지 적용" }]
    },
    "group-required-inputs.cargo-step": {
      key: "new-order.required-inputs.cargo-step",
      selectors: [
        '[data-screenmap-anchor="new-order.required-inputs.cargo-step"]',
        '.new-order-step-item[data-step="cargo"][data-state="current"]'
      ]
    },
    "group-required-inputs.cargo-vehicle-requirement": {
      key: "new-order.required-inputs.cargo-vehicle-requirement",
      selectors: [
        '[data-screenmap-anchor="new-order.required-inputs.cargo-vehicle-requirement"]',
        '.dialog.dialog--new-order-wizard[data-new-order-step="cargo"] #ci-ton',
        "#ci-ton",
        "#ci-type"
      ]
    },
    "group-required-inputs.cargo-quantity-weight": {
      key: "new-order.required-inputs.cargo-quantity-weight",
      selectors: [
        '[data-screenmap-anchor="new-order.required-inputs.cargo-quantity-weight"]',
        '.dialog.dialog--new-order-wizard[data-new-order-step="cargo"] #ci-weight',
        "#ci-weight",
        "#ci-count"
      ]
    },
    "group-required-inputs.cargo-item-input": {
      key: "new-order.required-inputs.cargo-item-input",
      selectors: [
        '[data-screenmap-anchor="new-order.required-inputs.cargo-item-input"]',
        '.dialog.dialog--new-order-wizard[data-new-order-step="cargo"] #ci-item',
        "#ci-item"
      ]
    },
    "group-required-inputs.cargo-recent-combo": {
      key: "new-order.required-inputs.cargo-recent-combo",
      selectors: [
        '[data-screenmap-anchor="new-order.required-inputs.cargo-recent-combo"]',
        '.dialog.dialog--new-order-wizard[data-new-order-step="cargo"] #cargo-recent-results',
        "#cargo-recent-results",
        '.dialog.dialog--new-order-wizard[data-new-order-step="cargo"] .preview-aside'
      ]
    },
    "group-required-inputs.cargo-complete": {
      key: "new-order.required-inputs.cargo-complete",
      selectors: [
        '[data-screenmap-anchor="new-order.required-inputs.cargo-complete"]',
        "#dlg-apply",
        ".dialog__foot-actions .btn--primary"
      ],
      requireTextMatch: true,
      text: [{ selector: "button", value: "운송+품목 적용" }]
    },
    "group-required-inputs.money-step": {
      key: "new-order.required-inputs.money-step",
      selectors: [
        '[data-screenmap-anchor="new-order.required-inputs.money-step"]',
        '.new-order-step-item[data-step="money"][data-state="current"]'
      ]
    },
    "group-required-inputs.money-payment-method": {
      key: "new-order.required-inputs.money-payment-method",
      selectors: [
        '[data-screenmap-anchor="new-order.required-inputs.money-payment-method"]',
        '.dialog.dialog--new-order-wizard[data-new-order-step="money"] #mi-pay',
        "#mi-pay"
      ]
    },
    "group-required-inputs.money-charge-haul": {
      key: "new-order.required-inputs.money-charge-haul",
      selectors: [
        '[data-screenmap-anchor="new-order.required-inputs.money-charge-haul"]',
        '.dialog.dialog--new-order-wizard[data-new-order-step="money"] #mi-charge',
        "#mi-charge",
        "#mi-haul"
      ]
    },
    "group-required-inputs.money-fee-adjustment": {
      key: "new-order.required-inputs.money-fee-adjustment",
      selectors: [
        '[data-screenmap-anchor="new-order.required-inputs.money-fee-adjustment"]',
        '.dialog.dialog--new-order-wizard[data-new-order-step="money"] #mi-adjust-reason',
        "#mi-adjust-reason",
        "#mi-adjust-amount",
        "#mi-fee"
      ]
    },
    "group-required-inputs.money-complete": {
      key: "new-order.required-inputs.money-complete",
      selectors: [
        '[data-screenmap-anchor="new-order.required-inputs.money-complete"]',
        "#dlg-apply",
        ".dialog__foot-actions .btn--primary"
      ],
      requireTextMatch: true,
      text: [{ selector: "button", value: "금액 조건 적용" }]
    },
    "group-required-inputs.required-complete": {
      key: "new-order.required-inputs.required-complete",
      selectors: [
        '[data-screenmap-anchor="new-order.required-inputs.required-complete"]',
        ".new-order-apply-panel"
      ]
    },
    "group-amount-branch.required-complete-panel": {
      key: "new-order.amount-branch.required-complete-panel",
      selectors: [
        '[data-screenmap-anchor="new-order.amount-branch.required-complete-panel"]',
        ".new-order-apply-panel"
      ]
    },
    "group-amount-branch.api-boundary-note": {
      key: "new-order.amount-branch.api-boundary-note",
      selectors: [
        '[data-screenmap-anchor="new-order.amount-branch.api-boundary-note"]',
        ".new-order-apply-panel__box",
        ".new-order-apply-panel"
      ]
    },
    "group-amount-branch.go-driver": {
      key: "new-order.amount-branch.go-driver",
      selectors: [
        '[data-screenmap-anchor="new-order.amount-branch.go-driver"]',
        ".dialog__foot-actions .btn--secondary",
        "button"
      ],
      requireTextMatch: true,
      text: [{ selector: "button", value: "차주 정보로 이동" }]
    },
    "group-amount-branch.apply-to-main": {
      key: "new-order.amount-branch.apply-to-main",
      selectors: [
        '[data-screenmap-anchor="new-order.amount-branch.apply-to-main"]',
        ".dialog__foot-actions .btn--primary",
        "button"
      ],
      requireTextMatch: true,
      text: [{ selector: "button", value: "화물 등록 완료" }]
    },
    "group-driver-choice.driver-step-panel": {
      key: "new-order.driver-choice.driver-step-panel",
      selectors: [
        '[data-screenmap-anchor="new-order.driver-choice.driver-step-panel"]',
        '.dialog.dialog--new-order-wizard[data-new-order-step="driver"]',
        ".dialog.dialog--new-order-wizard"
      ],
      text: [{ selector: ".dialog__title", value: "차주/차량 통합 조회" }]
    },
    "group-driver-choice.driver-search-entry": {
      key: "new-order.driver-choice.driver-search-entry",
      selectors: [
        '[data-screenmap-anchor="new-order.driver-choice.driver-search-entry"]',
        '.dialog.dialog--new-order-wizard[data-new-order-step="driver"] .lookup-search',
        ".dialog.dialog--new-order-wizard .lookup-search",
        "[data-b-driver-search-run]",
        '[data-b-driver-open="phase2"]',
        '[data-b-driver-open="phase1"]'
      ]
    },
    "group-driver-choice.hwamulman-result-box": {
      key: "new-order.driver-choice.hwamulman-result-box",
      selectors: [
        '[data-screenmap-anchor="new-order.driver-choice.hwamulman-result-box"]',
        '.dialog.dialog--new-order-wizard[data-new-order-step="driver"] #driver-results .ext-group',
        ".dialog.dialog--new-order-wizard #driver-results .ext-group",
        "#driver-results .ext-group",
        "#driver-results .ext-group__title",
        "[data-b-driver-hm-results]",
        "[data-b-driver-hm-link]"
      ],
      text: [
        { selector: "#driver-results .ext-group", value: "화물맨 배차 결과" },
        { selector: "*", value: "화물맨 배차 결과" }
      ]
    },
    "group-driver-choice.driver-result-preview": {
      key: "new-order.driver-choice.driver-result-preview",
      selectors: [
        '[data-screenmap-anchor="new-order.driver-choice.driver-result-preview"]',
        '.dialog.dialog--new-order-wizard[data-new-order-step="driver"] #dlg-preview .pcard',
        '.dialog.dialog--new-order-wizard[data-new-order-step="driver"] #dlg-preview',
        ".dialog.dialog--new-order-wizard #dlg-preview .pcard",
        "#dlg-preview",
        "[data-b-driver-preview-panel]",
        "[data-b-driver-preview-card]"
      ]
    },
    "group-driver-choice.skip-driver": {
      key: "new-order.driver-choice.skip-driver",
      selectors: [
        '[data-screenmap-anchor="new-order.driver-choice.skip-driver"]',
        '.dialog.dialog--new-order-wizard[data-new-order-step="driver"] [data-new-order-driver-skip]',
        "[data-new-order-driver-skip]",
        "button"
      ],
      requireTextMatch: true,
      text: [{ selector: "button", value: "건너뛰기" }]
    },
    "group-driver-choice.apply-driver": {
      key: "new-order.driver-choice.apply-driver",
      selectors: [
        '[data-screenmap-anchor="new-order.driver-choice.apply-driver"]',
        '.dialog.dialog--new-order-wizard[data-new-order-step="driver"] #dlg-apply',
        '.dialog.dialog--new-order-wizard[data-new-order-step="driver"] .dialog__foot-actions .btn--primary',
        "#dlg-apply",
        "[data-b-driver-apply]",
        ".dialog__foot-actions .btn--primary"
      ],
      requireTextMatch: true,
      text: [{ selector: "button", value: "차주 정보에 적용" }]
    },
    "group-main-apply.status-success": {
      key: "new-order.main-apply.status-success",
      selectors: [
        '[data-screenmap-anchor="new-order.main-apply.status-success"]',
        '.new-order-flow-status.is-visible[data-tone="success"]',
        ".new-order-flow-status.is-visible"
      ],
      text: [{ selector: "*", value: "메인 화면에 적용" }]
    },
    "group-main-apply.document-view": {
      key: "new-order.main-apply.document-view",
      selectors: [
        '[data-screenmap-anchor="new-order.main-apply.document-view"]',
        "body.new-order-flow--document-view .stack-main",
        ".stack-main"
      ]
    },
    "group-main-apply.summary-applied": {
      key: "new-order.main-apply.summary-applied",
      selectors: [
        '[data-screenmap-anchor="new-order.main-apply.summary-applied"]',
        "#sec-summary .irow--summary",
        "#summary-field",
        "#sec-summary"
      ],
      text: [{ selector: "*", value: "화물정보 요약" }]
    },
    "group-main-apply.driver-applied": {
      key: "new-order.main-apply.driver-applied",
      selectors: [
        '[data-screenmap-anchor="new-order.main-apply.driver-applied"]',
        "#driver-db .driver-grid",
        "#driver-db .meta-row",
        "#driver-db"
      ],
      text: [
        { selector: "*", value: "배차 적용" },
        { selector: "*", value: "차주" }
      ]
    },
    "group-main-apply.final-submit-cta": {
      key: "new-order.main-apply.final-submit-cta",
      selectors: [
        '[data-screenmap-anchor="new-order.main-apply.final-submit-cta"]',
        ".actionbar .new-order-main-submit.is-visible",
        ".new-order-main-submit.is-visible",
        ".actionbar button"
      ],
      requireTextMatch: true,
      text: [{ selector: "button", value: "화물 등록" }]
    },
    "group-main-apply.independent-edit-entry": {
      key: "new-order.main-apply.independent-edit-entry",
      selectors: [
        '[data-screenmap-anchor="new-order.main-apply.independent-edit-entry"]',
        "#sec-shipper .irow--shipper button",
        "#sec-route .irow--route button",
        "#sec-cargo-transport button",
        "#sec-cargo-money button"
      ],
      requireTextMatch: true,
      text: [
        { selector: "button", value: "변경" },
        { selector: "button", value: "수정" }
      ]
    },
    "edit-shipper.row-summary": {
      key: "edit-order.shipper.row-summary",
      selectors: [
        '[data-screenmap-anchor="edit-order.shipper.row-summary"]',
        "#sec-shipper .irow--shipper"
      ]
    },
    "edit-shipper.change-entry": {
      key: "edit-order.shipper.change-entry",
      selectors: [
        '[data-screenmap-anchor="edit-order.shipper.change-entry"]',
        "#sec-shipper .irow--shipper button"
      ],
      requireTextMatch: true,
      text: [{ selector: "#sec-shipper .irow--shipper button", value: "변경" }]
    },
    "edit-shipper.lookup-result": {
      key: "edit-order.shipper.lookup-result",
      selectors: [
        '[data-screenmap-anchor="edit-order.shipper.lookup-result"]',
        ".dialog .rrow.cols-shipper.is-selected",
        ".dialog .rrow.cols-shipper"
      ]
    },
    "edit-shipper.selected-preview": {
      key: "edit-order.shipper.selected-preview",
      selectors: [
        '[data-screenmap-anchor="edit-order.shipper.selected-preview"]',
        "#dlg-preview .pcard:first-child",
        "#dlg-preview"
      ]
    },
    "edit-shipper.contact-add": {
      key: "edit-order.shipper.contact-add",
      selectors: [
        '[data-screenmap-anchor="edit-order.shipper.contact-add"]',
        "#dlg-preview .pcard:nth-of-type(2)",
        "#dlg-preview"
      ],
      text: [{ selector: "#dlg-preview .pcard", value: "담당자 추가" }]
    },
    "edit-shipper.contact-phone-inline": {
      key: "edit-order.shipper.contact-phone-inline",
      selectors: [
        '[data-screenmap-anchor="edit-order.shipper.contact-phone-inline"]',
        "#sec-shipper .irow--shipper .cell--edit"
      ],
      requireTextMatch: true,
      text: [{ selector: "#sec-shipper .irow--shipper .cell--edit", value: "연락처" }]
    },
    "edit-shipper.contact-email-inline": {
      key: "edit-order.shipper.contact-email-inline",
      selectors: [
        '[data-screenmap-anchor="edit-order.shipper.contact-email-inline"]',
        "#sec-shipper .irow--shipper .cell--edit"
      ],
      requireTextMatch: true,
      text: [{ selector: "#sec-shipper .irow--shipper .cell--edit", value: "이메일" }]
    },
    "edit-route.row-summary": {
      key: "edit-order.route.row-summary",
      selectors: [
        '[data-screenmap-anchor="edit-order.route.row-summary"]',
        "#sec-route"
      ]
    },
    "edit-route.load-address-dialog": {
      key: "edit-order.route.load-address-dialog",
      selectors: [
        '[data-screenmap-anchor="edit-order.route.load-address-dialog"]',
        ".dialog .rrow.cols-addr.is-selected",
        ".dialog .rrow.cols-addr",
        "#addr-results"
      ],
      text: [{ selector: ".dialog__title", value: "주소 검색" }, { selector: ".dlg-sub", value: "상차지" }]
    },
    "edit-route.load-inline-fields": {
      key: "edit-order.route.load-inline-fields",
      selectors: [
        '[data-screenmap-anchor="edit-order.route.load-inline-fields"]',
        "#sec-route .irow--route .cell--edit"
      ],
      requireTextMatch: true,
      text: [{ selector: "#sec-route .irow--route .cell--edit", value: "상세주소" }]
    },
    "edit-route.unload-address-dialog": {
      key: "edit-order.route.unload-address-dialog",
      selectors: [
        '[data-screenmap-anchor="edit-order.route.unload-address-dialog"]',
        ".dialog .rrow.cols-addr.is-selected",
        ".dialog .rrow.cols-addr",
        "#addr-results"
      ],
      text: [{ selector: ".dialog__title", value: "주소 검색" }, { selector: ".dlg-sub", value: "하차지" }]
    },
    "edit-route.unload-inline-fields": {
      key: "edit-order.route.unload-inline-fields",
      selectors: [
        '[data-screenmap-anchor="edit-order.route.unload-inline-fields"]',
        "#sec-route .irow--route .cell--edit"
      ],
      requireTextMatch: true,
      text: [{ selector: "#sec-route .irow--route .cell--edit", value: "상세주소" }]
    },
    "edit-route.recalc-notice": {
      key: "edit-order.route.recalc-notice",
      selectors: [
        '[data-screenmap-anchor="edit-order.route.recalc-notice"]',
        "#hdr-status",
        ".app-head__status"
      ],
      text: [{ selector: "#hdr-status", value: "거리" }, { selector: "#hdr-status", value: "기준" }]
    },
    "edit-cargo-money.transport-dialog": {
      key: "edit-order.cargo-money.transport-dialog",
      selectors: [
        '[data-screenmap-anchor="edit-order.cargo-money.transport-dialog"]',
        "#ci-item",
        "#ci-ton",
        ".dialog .dgrid"
      ]
    },
    "edit-cargo-money.recent-combo": {
      key: "edit-order.cargo-money.recent-combo",
      selectors: [
        '[data-screenmap-anchor="edit-order.cargo-money.recent-combo"]',
        "#cargo-recent-results .rrow.is-selected",
        "#cargo-recent-results .rrow",
        "#cargo-recent-results"
      ]
    },
    "edit-cargo-money.transport-row": {
      key: "edit-order.cargo-money.transport-row",
      selectors: [
        '[data-screenmap-anchor="edit-order.cargo-money.transport-row"]',
        "#sec-cargo-transport .irow--cond"
      ]
    },
    "edit-cargo-money.item-row": {
      key: "edit-order.cargo-money.item-row",
      selectors: [
        '[data-screenmap-anchor="edit-order.cargo-money.item-row"]',
        "#sec-cargo-transport .irow--item"
      ]
    },
    "edit-cargo-money.money-dialog": {
      key: "edit-order.cargo-money.money-dialog",
      selectors: [
        '[data-screenmap-anchor="edit-order.cargo-money.money-dialog"]',
        "#mi-pay",
        "#mi-charge",
        ".dialog .dgrid"
      ]
    },
    "edit-cargo-money.money-preview": {
      key: "edit-order.cargo-money.money-preview",
      selectors: [
        '[data-screenmap-anchor="edit-order.cargo-money.money-preview"]',
        "#mi-formula"
      ]
    },
    "edit-cargo-money.money-row": {
      key: "edit-order.cargo-money.money-row",
      selectors: [
        '[data-screenmap-anchor="edit-order.cargo-money.money-row"]',
        "#sec-cargo-money .irow--money"
      ]
    },
    "edit-driver.row-summary": {
      key: "edit-order.driver.row-summary",
      selectors: [
        '[data-screenmap-anchor="edit-order.driver.row-summary"]',
        "#driver-db .driver-grid",
        "#driver-db .meta-row",
        "#driver-db"
      ]
    },
    "edit-driver.change-dialog": {
      key: "edit-order.driver.change-dialog",
      selectors: [
        '[data-screenmap-anchor="edit-order.driver.change-dialog"]',
        ".dialog #driver-results",
        ".dialog .lookup-search",
        ".dialog"
      ],
      text: [{ selector: ".dialog__title", value: "차주/차량 통합 조회" }]
    },
    "edit-driver.internal-result": {
      key: "edit-order.driver.internal-result",
      selectors: [
        '[data-screenmap-anchor="edit-order.driver.internal-result"]',
        "#driver-results .int-block .rrow.is-selected",
        "#driver-results .int-block .rrow",
        "#driver-results .int-block"
      ],
      text: [{ selector: "#driver-results .int-head", value: "내부 DB 결과" }]
    },
    "edit-driver.hwamulman-result": {
      key: "edit-order.driver.hwamulman-result",
      selectors: [
        '[data-screenmap-anchor="edit-order.driver.hwamulman-result"]',
        "#driver-results .ext-group .rrow.is-selected",
        "#driver-results .ext-group .rrow",
        "#driver-results .ext-group",
        "#driver-results .ext-group__title"
      ],
      text: [{ selector: "#driver-results .ext-group", value: "화물맨 배차 결과" }]
    },
    "edit-driver.selected-preview": {
      key: "edit-order.driver.selected-preview",
      selectors: [
        '[data-screenmap-anchor="edit-order.driver.selected-preview"]',
        "#dlg-preview .pcard"
      ]
    },
    "edit-driver.register-form": {
      key: "edit-order.driver.register-form",
      selectors: [
        '[data-screenmap-anchor="edit-order.driver.register-form"]',
        "#dlg-preview .pform",
        "#dlg-preview .pcard"
      ],
      text: [{ selector: "#dlg-preview .pcard", value: "차주 등록" }]
    },
    "edit-driver.contact-inline": {
      key: "edit-order.driver.contact-inline",
      selectors: [
        '[data-screenmap-anchor="edit-order.driver.contact-inline"]',
        "#driver-db .driver-grid .cell--edit"
      ],
      requireTextMatch: true,
      text: [{ selector: "#driver-db .driver-grid .cell--edit", value: "연락처" }]
    },
    "edit-driver.ton-inline": {
      key: "edit-order.driver.ton-inline",
      selectors: [
        '[data-screenmap-anchor="edit-order.driver.ton-inline"]',
        "#driver-db .driver-grid .cell--edit"
      ],
      requireTextMatch: true,
      text: [{ selector: "#driver-db .driver-grid .cell--edit", value: "톤수" }]
    },
    "edit-driver.type-inline": {
      key: "edit-order.driver.type-inline",
      selectors: [
        '[data-screenmap-anchor="edit-order.driver.type-inline"]',
        "#driver-db .driver-grid .cell--edit"
      ],
      requireTextMatch: true,
      text: [{ selector: "#driver-db .driver-grid .cell--edit", value: "차종" }]
    },
    "edit-apply-review.change-feedback": {
      key: "edit-order.apply-review.change-feedback",
      selectors: [
        '[data-screenmap-anchor="edit-order.apply-review.change-feedback"]',
        ".new-order-flow-status.is-visible",
        "#hdr-status",
        ".app-head__status"
      ],
      text: [
        { selector: ".new-order-flow-status.is-visible", value: "수정값" },
        { selector: ".new-order-flow-status.is-visible", value: "반영" }
      ]
    },
    "edit-apply-review.updated-row": {
      key: "edit-order.apply-review.updated-row",
      selectors: [
        '[data-screenmap-anchor="edit-order.apply-review.updated-row"]',
        "#sec-cargo-transport .irow--cond"
      ]
    },
    "edit-apply-review.final-submit-cta": {
      key: "edit-order.apply-review.final-submit-cta",
      selectors: [
        '[data-screenmap-anchor="edit-order.apply-review.final-submit-cta"]',
        ".actionbar .new-order-main-submit.is-visible",
        ".new-order-main-submit.is-visible"
      ],
      requireTextMatch: true,
      text: [{ selector: "button", value: "화물 등록" }]
    },
    "edit-apply-review.cancel-boundary": {
      key: "edit-order.apply-review.cancel-boundary",
      selectors: [
        '[data-screenmap-anchor="edit-order.apply-review.cancel-boundary"]',
        ".dialog__foot-actions .btn--secondary",
        ".dialog button"
      ],
      requireTextMatch: true,
      text: [{ selector: "button", value: "취소" }]
    },
    "edit-apply-review.list-update-pending": {
      key: "edit-order.apply-review.list-update-pending",
      selectors: [
        '[data-screenmap-anchor="edit-order.apply-review.list-update-pending"]',
        ".actionbar",
        ".actionbar .new-order-main-submit.is-visible"
      ]
    }
  };

  function all(selector) {
    try {
      return Array.prototype.slice.call(document.querySelectorAll(selector));
    } catch (error) {
      return [];
    }
  }

  function allIn(scope, selector) {
    try {
      return Array.prototype.slice.call((scope || document).querySelectorAll(selector));
    } catch (error) {
      return [];
    }
  }

  function isVisible(element) {
    if (!element || !element.getBoundingClientRect) return false;
    var rect = element.getBoundingClientRect();
    var style = window.getComputedStyle(element);
    return (
      rect.width > 0 &&
      rect.height > 0 &&
      style.visibility !== "hidden" &&
      style.display !== "none"
    );
  }

  function normalizedText(element) {
    return String(element && element.textContent ? element.textContent : "")
      .replace(/\s+/g, " ")
      .trim();
  }

  function findByText(selector, value) {
    var needle = String(value || "").trim();
    if (!needle) return null;
    var candidates = all(selector);
    for (var i = 0; i < candidates.length; i += 1) {
      var element = candidates[i];
      if (isVisible(element) && normalizedText(element).indexOf(needle) >= 0) {
        return element;
      }
    }
    return null;
  }

  function matchesTextTargets(element, textTargets) {
    if (!textTargets || !textTargets.length) return true;
    var text = normalizedText(element);
    for (var i = 0; i < textTargets.length; i += 1) {
      var needle = String(textTargets[i].value || "").trim();
      if (needle && text.indexOf(needle) >= 0) return true;
    }
    return false;
  }

  function findShipperInlineCell(partId) {
    var label = partId === "edit-shipper.contact-email-inline" ? "이메일" : "연락처";
    var cells = all("#sec-shipper .irow--shipper .cell--edit");
    for (var i = 0; i < cells.length; i += 1) {
      var cellLabel = normalizedText(cells[i].querySelector(".cell__label"));
      if (cellLabel === label) return cells[i];
    }
    return null;
  }

  function routeSideForPart(partId) {
    return String(partId || "").indexOf("unload") >= 0 ? "unload" : "load";
  }

  function findRouteRow(side) {
    var label = side === "unload" ? "하차" : "상차";
    var rows = all("#sec-route .irow--route");
    for (var i = 0; i < rows.length; i += 1) {
      var kindText = normalizedText(rows[i].querySelector(".kind"));
      if (kindText === label) return rows[i];
    }
    return null;
  }

  function findRouteInlineCell(partId) {
    var side = routeSideForPart(partId);
    var row = findRouteRow(side);
    if (!row) return null;
    var cells = allIn(row, ".cell--edit");
    for (var i = 0; i < cells.length; i += 1) {
      var cellLabel = normalizedText(cells[i].querySelector(".cell__label"));
      if (cellLabel === "상세주소") return cells[i];
    }
    return cells[0] || row;
  }

  function currentRouteAddressDialogSide() {
    var sub = document.querySelector(".dialog .dlg-sub");
    var text = normalizedText(sub);
    if (text.indexOf("상차지") >= 0) return "load";
    if (text.indexOf("하차지") >= 0) return "unload";
    return "";
  }

  function findRouteAddressDialogTarget(side) {
    if (side && currentRouteAddressDialogSide() !== side) return null;
    return document.querySelector(".dialog .rrow.cols-addr.is-selected") ||
      document.querySelector(".dialog .rrow.cols-addr") ||
      document.querySelector("#addr-results");
  }

  function currentCargoDialogOpen() {
    return Boolean(document.querySelector("#ci-ton") && document.querySelector("#ci-item"));
  }

  function currentMoneyDialogOpen() {
    return Boolean(document.querySelector("#mi-pay") && document.querySelector("#mi-formula"));
  }

  function findCargoDialogFormTarget() {
    return document.querySelector(".dialog .dgrid") ||
      document.querySelector("#ci-item") ||
      document.querySelector("#ci-ton");
  }

  function findMoneyDialogFormTarget() {
    return document.querySelector(".dialog .dgrid") ||
      document.querySelector("#mi-pay") ||
      document.querySelector("#mi-charge");
  }

  function findCargoItemCell() {
    var row = document.querySelector("#sec-cargo-transport .irow--item");
    if (!row) return null;
    return row.querySelector(".cell--edit") || row;
  }

  function currentEditDriverDialogOpen() {
    return Boolean(
      document.querySelector(".dialog #driver-results") ||
      findByText(".dialog__title", "차주/차량 통합 조회")
    );
  }

  function driverInlineLabelForPart(partId) {
    if (partId === "edit-driver.ton-inline") return "톤수";
    if (partId === "edit-driver.type-inline") return "차종";
    return "연락처";
  }

  function findDriverInlineCell(partId) {
    var label = driverInlineLabelForPart(partId);
    var cells = all("#driver-db .driver-grid .cell--edit");
    for (var i = 0; i < cells.length; i += 1) {
      var cellLabel = normalizedText(cells[i].querySelector(".cell__label"));
      if (cellLabel === label) return cells[i];
    }
    return cells[0] || null;
  }

  function findDriverInternalResultTarget() {
    return document.querySelector("#driver-results .int-block .rrow.is-selected") ||
      document.querySelector("#driver-results .int-block .rrow") ||
      document.querySelector("#driver-results .int-block");
  }

  function currentDriverInternalResultRow() {
    return document.querySelector("#driver-results .int-block .rrow");
  }

  function findDriverHwamulmanResultTarget() {
    return document.querySelector("#driver-results .ext-group .rrow.is-selected") ||
      document.querySelector("#driver-results .ext-group .rrow") ||
      document.querySelector("#driver-results .ext-group") ||
      document.querySelector("#driver-results .ext-group__title");
  }

  function findCustomTarget(partId) {
    if (partId === "edit-route.row-summary") return document.querySelector("#sec-route");
    if (partId === "edit-route.load-address-dialog") return findRouteAddressDialogTarget("load");
    if (partId === "edit-route.unload-address-dialog") return findRouteAddressDialogTarget("unload");
    if (partId === "edit-route.load-inline-fields" || partId === "edit-route.unload-inline-fields") {
      return findRouteInlineCell(partId);
    }
    if (partId === "edit-route.recalc-notice") {
      return document.querySelector("#hdr-status") || document.querySelector(".app-head__status");
    }
    if (partId === "edit-cargo-money.transport-dialog") return findCargoDialogFormTarget();
    if (partId === "edit-cargo-money.recent-combo") {
      return document.querySelector("#cargo-recent-results .rrow.is-selected") ||
        document.querySelector("#cargo-recent-results .rrow") ||
        document.querySelector("#cargo-recent-results");
    }
    if (partId === "edit-cargo-money.transport-row") return document.querySelector("#sec-cargo-transport .irow--cond");
    if (partId === "edit-cargo-money.item-row") return findCargoItemCell();
    if (partId === "edit-cargo-money.money-dialog") return findMoneyDialogFormTarget();
    if (partId === "edit-cargo-money.money-preview") return document.querySelector("#mi-formula");
    if (partId === "edit-cargo-money.money-row") return document.querySelector("#sec-cargo-money .irow--money");
    if (partId === "edit-driver.row-summary") {
      return document.querySelector("#driver-db .driver-grid") ||
        document.querySelector("#driver-db .meta-row") ||
        document.querySelector("#driver-db");
    }
    if (partId === "edit-driver.change-dialog") {
      return document.querySelector(".dialog #driver-results") ||
        document.querySelector(".dialog .lookup-search") ||
        findByText(".dialog__title", "차주/차량 통합 조회");
    }
    if (partId === "edit-driver.internal-result") return findDriverInternalResultTarget();
    if (partId === "edit-driver.hwamulman-result") return findDriverHwamulmanResultTarget();
    if (partId === "edit-driver.selected-preview") return document.querySelector("#dlg-preview .pcard");
    if (partId === "edit-driver.register-form") {
      return document.querySelector("#dlg-preview .pform") ||
        findByText("#dlg-preview .pcard", "차주 등록");
    }
    if (
      partId === "edit-driver.contact-inline" ||
      partId === "edit-driver.ton-inline" ||
      partId === "edit-driver.type-inline"
    ) {
      return findDriverInlineCell(partId);
    }
    if (partId === "edit-apply-review.change-feedback") {
      return document.querySelector(".new-order-flow-status.is-visible") ||
        document.querySelector("#hdr-status") ||
        document.querySelector(".app-head__status");
    }
    if (partId === "edit-apply-review.updated-row") {
      return document.querySelector("#sec-cargo-transport .irow--cond");
    }
    if (partId === "edit-apply-review.final-submit-cta") {
      return document.querySelector(".actionbar .new-order-main-submit.is-visible") ||
        document.querySelector(".new-order-main-submit.is-visible");
    }
    if (partId === "edit-apply-review.cancel-boundary") {
      return findByText(".dialog__foot-actions .btn--secondary", "취소") ||
        findByText(".dialog button", "취소");
    }
    if (partId === "edit-apply-review.list-update-pending") {
      return document.querySelector(".actionbar") ||
        document.querySelector(".new-order-main-submit.is-visible");
    }
    return null;
  }

  function findTarget(partId) {
    var definition = anchors[partId];
    if (!definition) return null;

    var customTarget = findCustomTarget(partId);
    if (customTarget && isVisible(customTarget)) return customTarget;

    for (var i = 0; i < definition.selectors.length; i += 1) {
      var candidates = all(definition.selectors[i]);
      for (var k = 0; k < candidates.length; k += 1) {
        var element = candidates[k];
        if (!isVisible(element)) continue;
        if (definition.requireTextMatch && !matchesTextTargets(element, definition.text)) continue;
        return element;
      }
    }

    var textTargets = definition.text || [];
    for (var j = 0; j < textTargets.length; j += 1) {
      var found = findByText(textTargets[j].selector, textTargets[j].value);
      if (found) return found;
    }

    return null;
  }

  function rectPayload(element) {
    var rect = element.getBoundingClientRect();
    var doc = document.documentElement;
    var body = document.body || doc;
    var viewportWidth = window.innerWidth || doc.clientWidth || rect.width || 1;
    var viewportHeight = window.innerHeight || doc.clientHeight || rect.height || 1;
    var centerX = rect.left + rect.width / 2;
    var centerY = rect.top + rect.height / 2;
    var documentWidth = Math.max(doc.scrollWidth, body.scrollWidth, viewportWidth);
    var documentHeight = Math.max(doc.scrollHeight, body.scrollHeight, viewportHeight);
    var pageX = centerX + window.scrollX;
    var pageY = centerY + window.scrollY;

    return {
      x: rect.left,
      y: rect.top,
      width: rect.width,
      height: rect.height,
      centerX: centerX,
      centerY: centerY,
      pageX: pageX,
      pageY: pageY,
      percentX: Math.max(0, Math.min(100, (centerX / viewportWidth) * 100)),
      percentY: Math.max(0, Math.min(100, (centerY / viewportHeight) * 100)),
      documentPercentX: Math.max(0, Math.min(100, (pageX / documentWidth) * 100)),
      documentPercentY: Math.max(0, Math.min(100, (pageY / documentHeight) * 100)),
      viewportWidth: viewportWidth,
      viewportHeight: viewportHeight,
      scrollX: window.scrollX,
      scrollY: window.scrollY,
      documentWidth: documentWidth,
      documentHeight: documentHeight
    };
  }

  function elementPayload(element) {
    var role = String(element.getAttribute("role") || "").toLowerCase();
    var tagName = String(element.tagName || "").toLowerCase();
    var buttonHost = tagName === "button" || role === "button"
      ? element
      : element.closest && element.closest("button,[role='button']");

    return {
      tagName: tagName,
      role: role,
      className: String(element.className || ""),
      text: normalizedText(element).slice(0, 80),
      isButton: Boolean(buttonHost)
    };
  }

  function post(type, detail) {
    var payload = Object.assign(
      {
        type: type,
        source: "cargo-order-admin-hifi-master",
        bridge: "screenmap",
        version: VERSION,
        groupId: state.groupId,
        partId: state.partId
      },
      detail || {}
    );
    window.parent.postMessage(payload, "*");
  }

  function installScreenmapViewFilter() {
    document.documentElement.dataset.screenmapMode = "true";
    document.documentElement.dataset.screenmapView = state.view;
    if (state.view === "full") return;
    if (document.getElementById("screenmap-view-filter-style")) return;

    var style = document.createElement("style");
    style.id = "screenmap-view-filter-style";
    style.textContent = [
      'html[data-screenmap-mode="true"][data-screenmap-view="core"] .list-ph,',
      'html[data-screenmap-mode="true"][data-screenmap-view="core"] .ds-section.showcase {',
      '  display: none !important;',
      '}',
      'html[data-screenmap-mode="true"][data-screenmap-view="core"] .app {',
      '  margin-bottom: 0 !important;',
      '}',
      'html[data-screenmap-mode="true"][data-screenmap-view="core"] body {',
      '  padding-bottom: 96px !important;',
      '}',
      'html[data-screenmap-mode="true"][data-screenmap-view="core"] .actionbar {',
      '  margin-bottom: 48px !important;',
      '}'
    ].join("\n");
    document.head.appendChild(style);
  }

  function collectAnchorRects() {
    var result = {};
    Object.keys(anchors).forEach(function (partId) {
      var definition = anchors[partId];
      var target = findTarget(partId);
      if (target) {
        if (!target.getAttribute("data-screenmap-anchor")) {
          target.setAttribute("data-screenmap-anchor", definition.key);
        }
        result[partId] = {
          found: true,
          key: definition.key,
          target: elementPayload(target),
          rect: rectPayload(target)
        };
      } else {
        result[partId] = {
          found: false,
          key: definition.key,
          fallbackReason: "target-not-found"
        };
      }
    });
    state.anchorRects = result;
    return result;
  }

  function reportAnchors(reason) {
    post("screenmap.anchor-rects", {
      reason: reason || "manual",
      anchors: collectAnchorRects()
    });
  }

  function waitForRuntime(callback) {
    var attempts = 0;
    var timer = window.setInterval(function () {
      attempts += 1;
      var runtime = window.__newOrderRegistrationFlow;
      if (runtime && typeof runtime.start === "function") {
        window.clearInterval(timer);
        callback(runtime);
      } else if (attempts >= 30) {
        window.clearInterval(timer);
        callback(null);
      }
    }, 60);
  }

  function waitForElement(selector, callback) {
    var attempts = 0;
    var timer = window.setInterval(function () {
      attempts += 1;
      var element = document.querySelector(selector);
      if (isVisible(element)) {
        window.clearInterval(timer);
        callback(element);
      } else if (attempts >= 30) {
        window.clearInterval(timer);
        callback(null);
      }
    }, 60);
  }

  function waitForPartTarget(partId, callback) {
    var attempts = 0;
    var timer = window.setInterval(function () {
      attempts += 1;
      var target = findTarget(partId);
      if (target) {
        window.clearInterval(timer);
        callback(target);
      } else if (attempts >= 30) {
        window.clearInterval(timer);
        callback(null);
      }
    }, 60);
  }

  function callGlobal(name) {
    var fn = window[name];
    if (typeof fn !== "function") return false;
    fn.apply(window, Array.prototype.slice.call(arguments, 1));
    return true;
  }

  function waitForRequiredPart(partId, callback) {
    waitForPartTarget(partId, function (target) {
      window.setTimeout(function () {
        callback(target);
      }, 120);
    });
  }

  function requiredInputStage(partId) {
    if (partId === "group-required-inputs.shipper-search") return 0;
    if (partId === "group-required-inputs.shipper-result-select") return 0;
    if (partId === "group-required-inputs.shipper-selected-preview") return 0;
    if (partId === "group-required-inputs.shipper-contact-add") return 0;
    if (partId === "group-required-inputs.shipper-complete") return 0;
    if (partId === "group-required-inputs.load-step") return 1;
    if (partId === "group-required-inputs.load-address-search") return 1;
    if (partId === "group-required-inputs.load-result-select") return 1;
    if (partId === "group-required-inputs.load-selected-preview") return 1;
    if (partId === "group-required-inputs.load-condition") return 1;
    if (partId === "group-required-inputs.load-complete") return 1;
    if (partId === "group-required-inputs.unload-step") return 2;
    if (partId === "group-required-inputs.unload-address-search") return 2;
    if (partId === "group-required-inputs.unload-result-select") return 2;
    if (partId === "group-required-inputs.unload-selected-preview") return 2;
    if (partId === "group-required-inputs.unload-condition") return 2;
    if (partId === "group-required-inputs.unload-complete") return 2;
    if (partId === "group-required-inputs.cargo-step") return 3;
    if (partId === "group-required-inputs.cargo-vehicle-requirement") return 3;
    if (partId === "group-required-inputs.cargo-quantity-weight") return 3;
    if (partId === "group-required-inputs.cargo-item-input") return 3;
    if (partId === "group-required-inputs.cargo-recent-combo") return 3;
    if (partId === "group-required-inputs.cargo-complete") return 3;
    if (partId === "group-required-inputs.money-step") return 4;
    if (partId === "group-required-inputs.money-payment-method") return 4;
    if (partId === "group-required-inputs.money-charge-haul") return 4;
    if (partId === "group-required-inputs.money-fee-adjustment") return 4;
    if (partId === "group-required-inputs.money-complete") return 4;
    if (partId === "group-required-inputs.required-complete") return 5;
    return 0;
  }

  function currentRequiredInputStage() {
    if (document.querySelector(".dialog.dialog--new-order-wizard .new-order-apply-panel")) return 5;
    var dialog = document.querySelector(".dialog.dialog--new-order-wizard[data-new-order-step]");
    var step = dialog ? dialog.getAttribute("data-new-order-step") : "";
    if (step === "shipper") return 0;
    if (step === "load") return 1;
    if (step === "unload") return 2;
    if (step === "cargo") return 3;
    if (step === "money") return 4;
    return null;
  }

  function currentDriverChoiceOpen() {
    return Boolean(document.querySelector('.dialog.dialog--new-order-wizard[data-new-order-step="driver"]'));
  }

  function currentMainApplyReady() {
    return document.body.dataset.newOrderPhase === "new-submitted" &&
      Boolean(document.querySelector(".new-order-main-submit.is-visible"));
  }

  function isRequiredPartAlreadyOpen(partId, stage) {
    return currentRequiredInputStage() === stage && Boolean(findTarget(partId));
  }

  function requiredInputStepName(stage) {
    if (stage === 0) return "shipper";
    if (stage === 1) return "load";
    if (stage === 2) return "unload";
    if (stage === 3) return "cargo";
    if (stage === 4) return "money";
    return "money";
  }

  function setScreenmapWizardState(runtime, stage) {
    var phase = stage === 5 ? "new-required-complete" : "new-wizard-active";
    var step = requiredInputStepName(stage);
    if (runtime && runtime.state) {
      runtime.state.phase = phase;
      runtime.state.step = step;
    }
    document.body.dataset.newOrderPhase = phase;
    document.body.classList.add("new-order-flow--guided-entry");
    document.body.classList.remove("new-order-flow--document-view");
  }

  function setScreenmapDriverState(runtime) {
    if (runtime && runtime.state) {
      runtime.state.phase = "new-driver-optional";
      runtime.state.step = "driver";
    }
    document.body.dataset.newOrderPhase = "new-driver-optional";
    document.body.classList.add("new-order-flow--guided-entry");
    document.body.classList.remove("new-order-flow--document-view");
  }

  function openRequiredInputStep(runtime, stage, callback) {
    var step = requiredInputStepName(stage);
    setScreenmapWizardState(runtime, stage);

    if (step === "shipper") callGlobal("openShipperLookup");
    else if (step === "load" || step === "unload") callGlobal("openAddrSearch", step);
    else if (step === "cargo") callGlobal("openCargoInput");
    else if (step === "money") callGlobal("openMoneyInput");

    window.setTimeout(callback, 160);
  }

  function openDriverChoiceStep(runtime, callback) {
    setScreenmapDriverState(runtime);
    callGlobal("openDriverLookup");
    window.setTimeout(callback, 180);
  }

  function prepareGroupInit(partId, callback) {
    if (!partId || partId === "group-init.click-new") {
      callback();
      return;
    }

    waitForRuntime(function (runtime) {
      if (runtime && typeof runtime.start === "function") {
        runtime.start();
      }
      window.setTimeout(callback, 160);
    });
  }

  function prepareGroupWizardEntry(partId, callback) {
    if (!partId) {
      callback();
      return;
    }

    if (partId !== "group-wizard-entry.shipper-cta" && findTarget(partId)) {
      window.setTimeout(callback, 120);
      return;
    }

    waitForRuntime(function (runtime) {
      if (runtime && typeof runtime.start === "function") {
        runtime.start();
      }

      waitForElement(".new-order-required-action", function (button) {
        if (partId === "group-wizard-entry.shipper-cta") {
          window.setTimeout(callback, 120);
          return;
        }

        if (button && typeof button.click === "function") {
          button.click();
        }

        waitForPartTarget(partId, function () {
          window.setTimeout(callback, 160);
        });
      });
    });
  }

  function prepareGroupRequiredInputs(partId, callback) {
    var targetPartId = partId || "group-required-inputs.shipper-complete";
    var stage = requiredInputStage(targetPartId);

    if (isRequiredPartAlreadyOpen(targetPartId, stage)) {
      waitForRequiredPart(targetPartId, callback);
      return;
    }

    waitForRuntime(function (runtime) {
      if (runtime && typeof runtime.start === "function" && currentRequiredInputStage() === null) {
        runtime.start();
      }

      window.setTimeout(function () {
        if (stage === 5) {
          openRequiredInputStep(runtime, 4, function () {
            callGlobal("applyMoney");
            waitForRequiredPart(targetPartId, callback);
          });
          return;
        }

        openRequiredInputStep(runtime, stage, function () {
          waitForRequiredPart(targetPartId, callback);
        });
      }, 80);
    });
  }

  function prepareGroupAmountBranch(partId, callback) {
    var targetPartId = partId || "group-amount-branch.required-complete-panel";

    if (currentRequiredInputStage() === 5 && findTarget(targetPartId)) {
      waitForRequiredPart(targetPartId, callback);
      return;
    }

    waitForRuntime(function (runtime) {
      if (runtime && typeof runtime.start === "function" && currentRequiredInputStage() === null) {
        runtime.start();
      }

      window.setTimeout(function () {
        if (currentRequiredInputStage() === 5) {
          waitForRequiredPart(targetPartId, callback);
          return;
        }

        openRequiredInputStep(runtime, 4, function () {
          callGlobal("applyMoney");
          waitForRequiredPart(targetPartId, callback);
        });
      }, 80);
    });
  }

  function revealDriverSelectionIfNeeded(partId, callback) {
    if (partId === "group-driver-choice.hwamulman-result-box") {
      callGlobal("driverSetMode", "hm");
      window.setTimeout(callback, 160);
      return;
    }

    if (
      partId === "group-driver-choice.driver-result-preview" ||
      partId === "group-driver-choice.apply-driver"
    ) {
      callGlobal("driverSearch");
      window.setTimeout(function () {
        var row = document.querySelector('.dialog.dialog--new-order-wizard[data-new-order-step="driver"] #driver-results .rrow') ||
          document.querySelector("#driver-results .rrow") ||
          document.querySelector("[data-b-driver-result-row]");
        if (row && typeof row.click === "function" && !row.classList.contains("is-selected")) {
          row.click();
        }
        window.setTimeout(callback, 140);
      }, 160);
      return;
    }

    callback();
  }

  function prepareGroupDriverChoice(partId, callback) {
    var targetPartId = partId || "group-driver-choice.driver-step-panel";

    if (currentDriverChoiceOpen() && findTarget(targetPartId)) {
      revealDriverSelectionIfNeeded(targetPartId, function () {
        waitForRequiredPart(targetPartId, callback);
      });
      return;
    }

    waitForRuntime(function (runtime) {
      if (runtime && typeof runtime.start === "function" && currentRequiredInputStage() === null && !currentDriverChoiceOpen()) {
        runtime.start();
      }

      window.setTimeout(function () {
        if (currentDriverChoiceOpen()) {
          revealDriverSelectionIfNeeded(targetPartId, function () {
            waitForRequiredPart(targetPartId, callback);
          });
          return;
        }

        openDriverChoiceStep(runtime, function () {
          revealDriverSelectionIfNeeded(targetPartId, function () {
            waitForRequiredPart(targetPartId, callback);
          });
        });
      }, 80);
    });
  }

  function pickFirstDriverRow() {
    var row = document.querySelector('.dialog.dialog--new-order-wizard[data-new-order-step="driver"] #driver-results .rrow') ||
      document.querySelector("#driver-results .rrow") ||
      document.querySelector("[data-b-driver-result-row]");
    if (row && typeof row.click === "function") {
      row.click();
    }
  }

  function prepareMainApplySample(runtime, callback) {
    if (currentMainApplyReady()) {
      callback();
      return;
    }

    if (runtime && typeof runtime.start === "function") {
      runtime.start();
    }

    window.setTimeout(function () {
      callGlobal("openShipperLookup");
      window.setTimeout(function () {
        callGlobal("applyShipper");
        window.setTimeout(function () {
          callGlobal("applyAddr");
          window.setTimeout(function () {
            callGlobal("applyAddr");
            window.setTimeout(function () {
              callGlobal("applyCargo");
              window.setTimeout(function () {
                callGlobal("applyMoney");
                window.setTimeout(function () {
                  openDriverChoiceStep(runtime, function () {
                    callGlobal("driverSearch");
                    window.setTimeout(function () {
                      pickFirstDriverRow();
                      window.setTimeout(function () {
                        callGlobal("applyDriver");
                        window.setTimeout(callback, 300);
                      }, 100);
                    }, 180);
                  });
                }, 260);
              }, 260);
            }, 260);
          }, 260);
        }, 260);
      }, 180);
    }, 120);
  }

  function flushMainApplyCallbacks() {
    var callbacks = mainApplyCallbacks.slice();
    mainApplyCallbacks.length = 0;
    callbacks.forEach(function (callback) {
      if (typeof callback === "function") callback();
    });
  }

  function ensureMainApplyReady(runtime, callback) {
    if (currentMainApplyReady()) {
      callback();
      return;
    }

    mainApplyCallbacks.push(callback);
    if (mainApplyPreparing) return;

    mainApplyPreparing = true;
    prepareMainApplySample(runtime, function () {
      mainApplyPreparing = false;
      flushMainApplyCallbacks();
    });
  }

  function prepareGroupMainApply(partId, callback) {
    var targetPartId = partId || "group-main-apply.status-success";

    if (currentMainApplyReady() && findTarget(targetPartId)) {
      waitForRequiredPart(targetPartId, callback);
      return;
    }

    waitForRuntime(function (runtime) {
      ensureMainApplyReady(runtime, function () {
        waitForRequiredPart(targetPartId, callback);
      });
    });
  }

  function currentEditShipperRowReady() {
    return Boolean(document.querySelector("#sec-shipper .irow--shipper"));
  }

  function currentEditShipperDialogOpen() {
    return Boolean(
      document.querySelector(".dialog #dlg-preview") ||
      findByText(".dialog__title", "화주 조회")
    );
  }

  function ensureEditShipperRowReady(callback) {
    if (currentEditShipperRowReady()) {
      window.setTimeout(callback, 80);
      return;
    }

    callGlobal("openShipperLookup");
    window.setTimeout(function () {
      callGlobal("applyShipper");
      waitForRequiredPart("edit-shipper.row-summary", callback);
    }, 180);
  }

  function ensureEditShipperDialogOpen(callback) {
    if (currentEditShipperDialogOpen()) {
      window.setTimeout(callback, 120);
      return;
    }

    callGlobal("openShipperLookup");
    window.setTimeout(callback, 180);
  }

  function isEditShipperDialogPart(partId) {
    return [
      "edit-shipper.lookup-result",
      "edit-shipper.selected-preview",
      "edit-shipper.contact-add"
    ].indexOf(partId) !== -1;
  }

  function isEditShipperInlinePart(partId) {
    return [
      "edit-shipper.contact-phone-inline",
      "edit-shipper.contact-email-inline"
    ].indexOf(partId) !== -1;
  }

  function prepareEditShipperInlinePart(partId, callback) {
    if (currentEditShipperDialogOpen()) {
      callGlobal("closeDialog");
    }

    ensureEditShipperRowReady(function () {
      var cell = findShipperInlineCell(partId);
      if (cell && !cell.classList.contains("editing") && typeof cell.click === "function") {
        cell.click();
      }
      waitForRequiredPart(partId, callback);
    });
  }

  function prepareEditOrderShipper(partId, callback) {
    var targetPartId = partId || "edit-shipper.row-summary";

    if (isEditShipperDialogPart(targetPartId)) {
      ensureEditShipperRowReady(function () {
        ensureEditShipperDialogOpen(function () {
          waitForRequiredPart(targetPartId, callback);
        });
      });
      return;
    }

    if (isEditShipperInlinePart(targetPartId)) {
      prepareEditShipperInlinePart(targetPartId, callback);
      return;
    }

    if (currentEditShipperDialogOpen()) {
      callGlobal("closeDialog");
    }

    ensureEditShipperRowReady(function () {
      waitForRequiredPart(targetPartId, callback);
    });
  }

  function currentEditRouteRowsReady() {
    return Boolean(findRouteRow("load") && findRouteRow("unload"));
  }

  function currentEditRouteAddressDialogOpen(side) {
    return currentRouteAddressDialogSide() === side && Boolean(findRouteAddressDialogTarget(side));
  }

  function applyRouteAddressSample(side, callback) {
    callGlobal("openAddrSearch", side);
    window.setTimeout(function () {
      callGlobal("applyAddr");
      window.setTimeout(callback, 180);
    }, 180);
  }

  function ensureEditRouteRowsReady(callback) {
    if (currentEditRouteRowsReady()) {
      window.setTimeout(callback, 80);
      return;
    }

    applyRouteAddressSample("load", function () {
      applyRouteAddressSample("unload", function () {
        waitForRequiredPart("edit-route.row-summary", callback);
      });
    });
  }

  function ensureEditRouteAddressDialogOpen(side, callback) {
    if (currentEditRouteAddressDialogOpen(side)) {
      window.setTimeout(callback, 120);
      return;
    }

    callGlobal("openAddrSearch", side);
    window.setTimeout(callback, 180);
  }

  function isEditRouteAddressDialogPart(partId) {
    return [
      "edit-route.load-address-dialog",
      "edit-route.unload-address-dialog"
    ].indexOf(partId) !== -1;
  }

  function isEditRouteInlinePart(partId) {
    return [
      "edit-route.load-inline-fields",
      "edit-route.unload-inline-fields"
    ].indexOf(partId) !== -1;
  }

  function prepareEditRouteInlinePart(partId, callback) {
    if (currentRouteAddressDialogSide()) {
      callGlobal("closeDialog");
    }

    ensureEditRouteRowsReady(function () {
      var cell = findRouteInlineCell(partId);
      if (cell && cell.classList && !cell.classList.contains("editing") && typeof cell.click === "function") {
        cell.click();
      }
      waitForRequiredPart(partId, callback);
    });
  }

  function prepareEditOrderRoute(partId, callback) {
    var targetPartId = partId || "edit-route.row-summary";

    if (isEditRouteAddressDialogPart(targetPartId)) {
      var side = routeSideForPart(targetPartId);
      ensureEditRouteRowsReady(function () {
        ensureEditRouteAddressDialogOpen(side, function () {
          waitForRequiredPart(targetPartId, callback);
        });
      });
      return;
    }

    if (isEditRouteInlinePart(targetPartId)) {
      prepareEditRouteInlinePart(targetPartId, callback);
      return;
    }

    if (currentRouteAddressDialogSide()) {
      callGlobal("closeDialog");
    }

    ensureEditRouteRowsReady(function () {
      waitForRequiredPart(targetPartId, callback);
    });
  }

  function currentEditCargoRowsReady() {
    return Boolean(
      document.querySelector("#sec-cargo-transport .irow--cond") &&
      document.querySelector("#sec-cargo-transport .irow--item")
    );
  }

  function currentEditMoneyRowReady() {
    return Boolean(document.querySelector("#sec-cargo-money .irow--money"));
  }

  function ensureCargoDialogOpen(callback) {
    if (currentCargoDialogOpen()) {
      window.setTimeout(callback, 120);
      return;
    }

    if (currentMoneyDialogOpen() || currentRouteAddressDialogSide() || currentEditShipperDialogOpen()) {
      callGlobal("closeDialog");
    }

    callGlobal("openCargoInput");
    window.setTimeout(callback, 180);
  }

  function ensureMoneyDialogOpen(callback) {
    if (currentMoneyDialogOpen()) {
      window.setTimeout(callback, 120);
      return;
    }

    if (currentCargoDialogOpen() || currentRouteAddressDialogSide() || currentEditShipperDialogOpen()) {
      callGlobal("closeDialog");
    }

    callGlobal("openMoneyInput");
    window.setTimeout(callback, 180);
  }

  function pickFirstCargoRecentIfNeeded(callback) {
    var row = document.querySelector("#cargo-recent-results .rrow.is-selected") ||
      document.querySelector("#cargo-recent-results .rrow");
    if (row && typeof row.click === "function" && !row.classList.contains("is-selected")) {
      row.click();
    }
    window.setTimeout(callback, 120);
  }

  function ensureEditCargoRowsReady(callback) {
    if (currentEditCargoRowsReady()) {
      window.setTimeout(callback, 80);
      return;
    }

    ensureCargoDialogOpen(function () {
      pickFirstCargoRecentIfNeeded(function () {
        callGlobal("applyCargo");
        waitForRequiredPart("edit-cargo-money.transport-row", callback);
      });
    });
  }

  function ensureEditMoneyRowReady(callback) {
    if (currentEditMoneyRowReady()) {
      window.setTimeout(callback, 80);
      return;
    }

    ensureMoneyDialogOpen(function () {
      callGlobal("applyMoney");
      waitForRequiredPart("edit-cargo-money.money-row", callback);
    });
  }

  function isEditCargoDialogPart(partId) {
    return [
      "edit-cargo-money.transport-dialog",
      "edit-cargo-money.recent-combo"
    ].indexOf(partId) !== -1;
  }

  function isEditMoneyDialogPart(partId) {
    return [
      "edit-cargo-money.money-dialog",
      "edit-cargo-money.money-preview"
    ].indexOf(partId) !== -1;
  }

  function prepareEditCargoItemPart(callback) {
    if (currentCargoDialogOpen() || currentMoneyDialogOpen() || currentRouteAddressDialogSide() || currentEditShipperDialogOpen()) {
      callGlobal("closeDialog");
    }

    ensureEditCargoRowsReady(function () {
      var cell = findCargoItemCell();
      if (cell && cell.classList && !cell.classList.contains("editing") && typeof cell.click === "function") {
        cell.click();
      }
      waitForRequiredPart("edit-cargo-money.item-row", callback);
    });
  }

  function prepareEditOrderCargoMoney(partId, callback) {
    var targetPartId = partId || "edit-cargo-money.transport-row";

    if (isEditCargoDialogPart(targetPartId)) {
      ensureCargoDialogOpen(function () {
        if (targetPartId === "edit-cargo-money.recent-combo") {
          pickFirstCargoRecentIfNeeded(function () {
            waitForRequiredPart(targetPartId, callback);
          });
          return;
        }
        waitForRequiredPart(targetPartId, callback);
      });
      return;
    }

    if (targetPartId === "edit-cargo-money.transport-row") {
      if (currentCargoDialogOpen() || currentMoneyDialogOpen() || currentRouteAddressDialogSide() || currentEditShipperDialogOpen()) {
        callGlobal("closeDialog");
      }
      ensureEditCargoRowsReady(function () {
        waitForRequiredPart(targetPartId, callback);
      });
      return;
    }

    if (targetPartId === "edit-cargo-money.item-row") {
      prepareEditCargoItemPart(callback);
      return;
    }

    if (isEditMoneyDialogPart(targetPartId)) {
      ensureEditCargoRowsReady(function () {
        ensureMoneyDialogOpen(function () {
          waitForRequiredPart(targetPartId, callback);
        });
      });
      return;
    }

    if (targetPartId === "edit-cargo-money.money-row") {
      if (currentCargoDialogOpen() || currentMoneyDialogOpen() || currentRouteAddressDialogSide() || currentEditShipperDialogOpen()) {
        callGlobal("closeDialog");
      }
      ensureEditCargoRowsReady(function () {
        ensureEditMoneyRowReady(function () {
          waitForRequiredPart(targetPartId, callback);
        });
      });
      return;
    }

    callback();
  }

  function currentEditDriverRowReady() {
    return Boolean(document.querySelector("#driver-db .driver-grid"));
  }

  function ensureEditDriverRowReady(callback) {
    if (currentEditDriverRowReady()) {
      window.setTimeout(callback, 80);
      return;
    }

    ensureEditDriverDialogOpen(function () {
      callGlobal("driverSearch");
      window.setTimeout(function () {
        pickFirstDriverRow();
        window.setTimeout(function () {
          callGlobal("applyDriver");
          waitForRequiredPart("edit-driver.row-summary", callback);
        }, 120);
      }, 180);
    });
  }

  function ensureEditDriverDialogOpen(callback) {
    if (currentEditDriverDialogOpen()) {
      window.setTimeout(callback, 120);
      return;
    }

    if (currentCargoDialogOpen() || currentMoneyDialogOpen() || currentRouteAddressDialogSide() || currentEditShipperDialogOpen()) {
      callGlobal("closeDialog");
    }

    callGlobal("openDriverLookup");
    window.setTimeout(callback, 180);
  }

  function ensureDriverInternalResults(callback) {
    ensureEditDriverDialogOpen(function () {
      if (currentDriverInternalResultRow()) {
        window.setTimeout(callback, 80);
        return;
      }

      callGlobal("driverSearch");
      window.setTimeout(callback, 180);
    });
  }

  function ensureDriverPreview(callback) {
    ensureDriverInternalResults(function () {
      pickFirstDriverRow();
      window.setTimeout(callback, 140);
    });
  }

  function ensureDriverHwamulmanResults(callback) {
    ensureEditDriverDialogOpen(function () {
      callGlobal("driverSetMode", "hm");
      window.setTimeout(callback, 180);
    });
  }

  function ensureDriverRegisterForm(callback) {
    ensureDriverInternalResults(function () {
      callGlobal("driverRegister");
      window.setTimeout(callback, 140);
    });
  }

  function isEditDriverDialogPart(partId) {
    return [
      "edit-driver.change-dialog",
      "edit-driver.internal-result",
      "edit-driver.hwamulman-result",
      "edit-driver.selected-preview",
      "edit-driver.register-form"
    ].indexOf(partId) !== -1;
  }

  function isEditDriverInlinePart(partId) {
    return [
      "edit-driver.contact-inline",
      "edit-driver.ton-inline",
      "edit-driver.type-inline"
    ].indexOf(partId) !== -1;
  }

  function prepareEditDriverInlinePart(partId, callback) {
    if (currentEditDriverDialogOpen()) {
      callGlobal("closeDialog");
    }

    ensureEditDriverRowReady(function () {
      var cell = findDriverInlineCell(partId);
      if (cell && cell.classList && !cell.classList.contains("editing") && typeof cell.click === "function") {
        cell.click();
      }
      waitForRequiredPart(partId, callback);
    });
  }

  function prepareEditOrderDriver(partId, callback) {
    var targetPartId = partId || "edit-driver.row-summary";

    if (isEditDriverInlinePart(targetPartId)) {
      prepareEditDriverInlinePart(targetPartId, callback);
      return;
    }

    if (isEditDriverDialogPart(targetPartId)) {
      ensureEditDriverRowReady(function () {
        if (targetPartId === "edit-driver.internal-result") {
          ensureDriverInternalResults(function () {
            waitForRequiredPart(targetPartId, callback);
          });
          return;
        }

        if (targetPartId === "edit-driver.hwamulman-result") {
          ensureDriverHwamulmanResults(function () {
            waitForRequiredPart(targetPartId, callback);
          });
          return;
        }

        if (targetPartId === "edit-driver.selected-preview") {
          ensureDriverPreview(function () {
            waitForRequiredPart(targetPartId, callback);
          });
          return;
        }

        if (targetPartId === "edit-driver.register-form") {
          ensureDriverRegisterForm(function () {
            waitForRequiredPart(targetPartId, callback);
          });
          return;
        }

        ensureEditDriverDialogOpen(function () {
          waitForRequiredPart(targetPartId, callback);
        });
      });
      return;
    }

    if (currentEditDriverDialogOpen()) {
      callGlobal("closeDialog");
    }

    ensureEditDriverRowReady(function () {
      waitForRequiredPart(targetPartId, callback);
    });
  }

  function currentApplyReviewReady() {
    return Boolean(
      document.querySelector(".new-order-flow-status.is-visible") &&
      document.querySelector(".new-order-main-submit.is-visible") &&
      document.querySelector("#sec-cargo-transport .irow--cond")
    );
  }

  function setApplyReviewSampleState() {
    try {
      window.eval([
        "(function(){",
        "if (typeof S === 'undefined') return;",
        "S.cargo = S.cargo || {};",
        "S.summary = S.summary || {};",
        "S.cargo.transport = { ton: '5톤', type: '윙바디', count: 1, weight: '4.2', item: '전자부품 / 팔레트 8EA' };",
        "S.summary.overridden = false;",
        "if (typeof regenSummary === 'function') regenSummary();",
        "if (typeof renderCargo === 'function') renderCargo();",
        "if (typeof renderSummary === 'function') renderSummary();",
        "})()"
      ].join(""));
    } catch (error) {
      // Screenmap preview only: if the master state is unavailable, keep DOM fallbacks below.
    }

    var strip = document.querySelector(".new-order-flow-status");
    if (!strip) {
      strip = document.createElement("div");
      strip.className = "new-order-flow-status";
      strip.setAttribute("role", "status");
      strip.setAttribute("aria-live", "polite");
      var actionbar = document.querySelector(".actionbar");
      if (actionbar) {
        actionbar.insertAdjacentElement("beforebegin", strip);
      } else {
        document.body.appendChild(strip);
      }
    }
    strip.textContent = "운송+품목 수정값이 최종 등록 데이터에 반영되었습니다.";
    strip.dataset.tone = "info";
    strip.classList.add("is-visible");

    var submitButton = document.querySelector(".new-order-main-submit") ||
      findByText(".actionbar button", "화물 등록") ||
      findByText("button", "화물 등록");
    if (submitButton) {
      submitButton.textContent = "화물 등록";
      submitButton.disabled = false;
      submitButton.classList.add("new-order-main-submit", "is-visible");
    }

    document.body.dataset.newOrderPhase = "new-submitted";
    document.body.classList.add("new-order-flow--document-view");
    document.body.classList.remove("new-order-flow--guided-entry");
  }

  function flushApplyReviewCallbacks() {
    var callbacks = applyReviewCallbacks.slice();
    applyReviewCallbacks.length = 0;
    callbacks.forEach(function (callback) {
      if (typeof callback === "function") callback();
    });
  }

  function prepareApplyReviewSample(callback) {
    if (currentApplyReviewReady()) {
      window.setTimeout(callback, 80);
      return;
    }

    if (currentEditDriverDialogOpen() || currentMoneyDialogOpen() || currentRouteAddressDialogSide() || currentEditShipperDialogOpen()) {
      callGlobal("closeDialog");
    }

    setApplyReviewSampleState();
    window.setTimeout(setApplyReviewSampleState, 120);
    window.setTimeout(function () {
      setApplyReviewSampleState();
      waitForRequiredPart("edit-apply-review.updated-row", callback);
    }, 260);
  }

  function ensureApplyReviewReady(callback) {
    if (currentApplyReviewReady()) {
      window.setTimeout(callback, 80);
      return;
    }

    applyReviewCallbacks.push(callback);
    if (applyReviewPreparing) return;

    applyReviewPreparing = true;
    prepareApplyReviewSample(function () {
      applyReviewPreparing = false;
      flushApplyReviewCallbacks();
    });
  }

  function prepareEditApplyReview(partId, callback) {
    var targetPartId = partId || "edit-apply-review.change-feedback";

    if (targetPartId === "edit-apply-review.cancel-boundary") {
      ensureApplyReviewReady(function () {
        ensureCargoDialogOpen(function () {
          waitForRequiredPart(targetPartId, callback);
        });
      });
      return;
    }

    if (currentCargoDialogOpen() || currentMoneyDialogOpen() || currentEditDriverDialogOpen() || currentRouteAddressDialogSide() || currentEditShipperDialogOpen()) {
      callGlobal("closeDialog");
    }

    ensureApplyReviewReady(function () {
      waitForRequiredPart(targetPartId, callback);
    });
  }

  function isRequiredInputsGroup(groupId) {
    return [
      "new-order.group-required-inputs",
      "new-order.group-required-shipper",
      "new-order.group-required-load",
      "new-order.group-required-unload",
      "new-order.group-required-cargo",
      "new-order.group-required-money"
    ].indexOf(groupId) !== -1;
  }

  function prepareScreenmapState(callback) {
    if (state.groupId === "new-order.group-init") {
      prepareGroupInit(state.partId, callback);
      return;
    }

    if (state.groupId === "new-order.group-wizard-entry") {
      prepareGroupWizardEntry(state.partId, callback);
      return;
    }

    if (isRequiredInputsGroup(state.groupId)) {
      prepareGroupRequiredInputs(state.partId, callback);
      return;
    }

    if (state.groupId === "new-order.group-amount-branch") {
      prepareGroupAmountBranch(state.partId, callback);
      return;
    }

    if (state.groupId === "new-order.group-driver-choice") {
      prepareGroupDriverChoice(state.partId, callback);
      return;
    }

    if (state.groupId === "new-order.group-main-apply") {
      prepareGroupMainApply(state.partId, callback);
      return;
    }

    if (state.groupId === "edit-order.shipper-edit") {
      prepareEditOrderShipper(state.partId, callback);
      return;
    }

    if (state.groupId === "edit-order.route-edit") {
      prepareEditOrderRoute(state.partId, callback);
      return;
    }

    if (state.groupId === "edit-order.cargo-money-edit") {
      prepareEditOrderCargoMoney(state.partId, callback);
      return;
    }

    if (state.groupId === "edit-order.driver-edit") {
      prepareEditOrderDriver(state.partId, callback);
      return;
    }

    if (state.groupId === "edit-order.apply-review") {
      prepareEditApplyReview(state.partId, callback);
      return;
    }

    callback();
  }

  function selectPart(partId, options) {
    state.partId = partId || state.partId;
    state.selectToken += 1;
    var selectToken = state.selectToken;
    prepareScreenmapState(function () {
      if (selectToken !== state.selectToken) return;
      var target = findTarget(state.partId);
      if (state.allowScroll && target && target.scrollIntoView) {
        target.scrollIntoView({
          block: "center",
          inline: "center",
          behavior: options && options.smooth ? "smooth" : "auto"
        });
      }
      window.setTimeout(function () {
        reportAnchors("select-part");
      }, 100);
      window.setTimeout(function () {
        reportAnchors("select-part-stable");
      }, 420);
    });
  }

  function installMessageListener() {
    window.addEventListener("message", function (event) {
      var data = event.data || {};
      if (!data || data.type !== "screenmap.select-part") return;
      if (data.groupId) state.groupId = data.groupId;
      selectPart(data.partId || state.partId, { smooth: true });
    });
  }

  function installObservers() {
    var queued = 0;
    function queue(reason) {
      window.clearTimeout(queued);
      queued = window.setTimeout(function () {
        reportAnchors(reason);
      }, 120);
    }

    window.addEventListener("resize", function () { queue("resize"); });
    window.addEventListener("scroll", function () { queue("scroll"); }, true);

    if (window.MutationObserver) {
      var observer = new MutationObserver(function () { queue("mutation"); });
      observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["class", "style", "data-screenmap-anchor"]
      });
    }
  }

  function boot() {
    installScreenmapViewFilter();
    installMessageListener();
    installObservers();
    window.__screenmapBridge = {
      version: VERSION,
      state: state,
      anchors: anchors,
      report: reportAnchors,
      select: selectPart
    };
    if (state.partId) {
      selectPart(state.partId);
      return;
    }

    prepareScreenmapState(function () {
      reportAnchors("ready");
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
</script>
<!-- SCREENMAP_BRIDGE_LAYER_END -->`;

const source = await readFile(masterPath, "utf8");
const match = source.match(templatePattern);

if (!match) {
  throw new Error("Cannot find __bundler/template script in master HTML.");
}

const template = JSON.parse(match[2]);
const cleanedTemplate = template.replace(bridgePattern, "");

if (!cleanedTemplate.includes("</body>")) {
  throw new Error("Cannot find </body> in parsed template.");
}

const enhancedTemplate = cleanedTemplate.replace("</body>", "\n" + bridgeLayer + "\n</body>");
const serializedTemplate = JSON.stringify(enhancedTemplate).replace(
  /<\/script/gi,
  "<\\u002Fscript"
);
const enhancedSource = source.replace(templatePattern, "$1" + serializedTemplate + "$3");
const changed = source !== enhancedSource;

if (changed) {
  await writeFile(masterPath, enhancedSource, "utf8");
}

console.log(
  JSON.stringify(
    {
      changed,
      masterPath,
      layerId: "screenmap-bridge-script",
      marker: "SCREENMAP_BRIDGE_LAYER_START",
      templateBytes: Buffer.byteLength(enhancedTemplate, "utf8"),
      outputBytes: Buffer.byteLength(enhancedSource, "utf8")
    },
    null,
    2
  )
);
