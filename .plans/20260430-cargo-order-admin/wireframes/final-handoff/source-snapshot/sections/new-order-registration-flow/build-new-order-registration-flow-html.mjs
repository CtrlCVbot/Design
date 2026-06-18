import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFileSync, writeFileSync } from 'node:fs';

const sectionDir = dirname(fileURLToPath(import.meta.url));
const projectDir = resolve(sectionDir, '../..');
const sourcePath = resolve(projectDir, 'results/html/cargo-order-hifi-reservation-tabs-shadcn-20260616.html');
const outputPath = resolve(sectionDir, 'new-order-registration-flow-hifi-20260617.html');

const source = readFileSync(sourcePath, 'utf8');

const layer = String.raw`
<!-- NEW_ORDER_REGISTRATION_FLOW_LAYER_START -->
<style id="new-order-registration-flow-style">
  :root {
    --new-order-cta-ring: 0 0 0 2px var(--surface), 0 0 0 5px rgb(31 100 214 / .34);
  }

  body:not(.new-order-flow--guided-entry) .stack-main .ds-section > .sec-head {
    display: none !important;
  }

  body.new-order-flow--guided-entry .stack-main .ds-section > .sec-head {
    display: flex !important;
  }

  body.new-order-flow--guided-entry .stack-main .ds-section > .sec-head[data-new-order-step-state="current"] {
    background: linear-gradient(90deg, var(--brand-50), transparent);
    box-shadow: inset 3px 0 0 var(--brand-600);
  }

  body.new-order-flow--guided-entry .stack-main .ds-section[data-new-order-summary-section="true"] > .sec-head .sec-head__num {
    width: auto;
    min-width: 34px;
    padding: 0 8px;
    border: 1px solid var(--border-strong);
    background: var(--surface-soft);
    color: var(--text-muted);
    font-size: var(--text-sm);
  }

  body.new-order-flow--guided-entry .stack-main .ds-section > .sec-head[data-new-order-step-state="complete"] .sec-head__num {
    border-color: var(--success-bd);
    background: var(--success-bg);
    color: var(--success-fg);
  }

  .ds-section[data-new-order-cargo-empty] > .sec-body,
  .ds-section[data-new-order-money-empty] > .sec-body {
    padding: 0 !important;
  }

  .moneyF.new-order-empty-route-layout {
    display: block;
    gap: 0;
  }

  .moneyF.new-order-empty-route-layout .money-block {
    border: 0;
    border-radius: 0;
    overflow: visible;
  }

  .moneyF.new-order-empty-route-layout .money-block__head {
    display: none;
  }

  .moneyF.new-order-empty-route-layout .money-block__body {
    min-width: 0;
  }

  .moneyF.new-order-empty-route-layout .money-block + .money-block .irow {
    border-top: 1px solid var(--border);
  }

  .moneyF.new-order-empty-route-layout .irow.is-empty {
    grid-template-columns: 48px minmax(0, 1fr) max-content !important;
    min-width: 0 !important;
  }

  body:not(.new-order-flow--guided-entry) .irow.new-order-required-empty {
    position: relative;
    box-shadow: inset 2px 0 0 var(--brand-600);
  }

  body:not(.new-order-flow--guided-entry) .irow.new-order-required-empty > .kind {
    color: var(--brand-600);
    font-weight: var(--fw-bold);
  }

  body:not(.new-order-flow--guided-entry) .new-order-required-action {
    position: relative;
    overflow: hidden;
    animation: new-order-required-action-glow 760ms ease-out 2;
  }

  body:not(.new-order-flow--guided-entry) .new-order-required-action.is-reminding {
    animation: new-order-required-reminder-glow 760ms ease-out 1;
  }

  body:not(.new-order-flow--guided-entry) .new-order-required-action:hover,
  body:not(.new-order-flow--guided-entry) .new-order-required-action:focus-visible {
    box-shadow: var(--new-order-cta-ring);
  }

  body:not(.new-order-flow--guided-entry) .new-order-required-action::after {
    content: "";
    position: absolute;
    inset: -20% -45%;
    background: linear-gradient(105deg, transparent 35%, rgb(255 255 255 / .34), transparent 65%);
    opacity: 0;
    transform: translateX(-52%);
    animation: new-order-required-action-sweep 820ms ease-out 1;
    pointer-events: none;
  }

  body:not(.new-order-flow--guided-entry) .new-order-required-action.is-reminding::after {
    animation: new-order-required-reminder-sweep 820ms ease-out 1;
  }

  body.new-order-flow--document-view .ds-section[data-new-order-cargo-applied],
  body.new-order-flow--document-view .ds-section[data-new-order-money-applied] {
    border-color: transparent;
    border-radius: 0;
    background: transparent;
    box-shadow: none;
    overflow: visible;
  }

  body.new-order-flow--document-view .ds-section[data-new-order-cargo-applied] > .sec-body,
  body.new-order-flow--document-view .ds-section[data-new-order-money-applied] > .sec-body {
    padding: 0 !important;
  }

  .new-order-flow-status {
    display: none;
    align-items: center;
    gap: var(--space-2);
    min-height: 34px;
    margin: var(--space-2) var(--space-4) 0;
    padding: 0 var(--space-3);
    border: 1px solid var(--info-bd);
    border-radius: var(--radius);
    background: var(--info-bg);
    color: var(--info-fg);
    font-size: var(--text-sm);
    font-weight: var(--fw-medium);
  }

  .new-order-flow-status.is-visible {
    display: flex;
  }

  .new-order-flow-status[data-tone="success"] {
    border-color: var(--success-bd);
    background: var(--success-bg);
    color: var(--success-fg);
  }

  .new-order-flow-status[data-tone="warn"] {
    border-color: var(--warn-bd);
    background: var(--warn-bg);
    color: var(--warn-fg);
  }

  .new-order-flow-status[data-tone="danger"] {
    border-color: var(--danger-bd);
    background: var(--danger-bg);
    color: var(--danger-600);
  }

  .new-order-main-submit {
    display: none !important;
    position: relative;
    overflow: hidden;
  }

  .new-order-main-submit.is-visible {
    display: inline-flex !important;
  }

  .new-order-main-submit.is-visible:not(:disabled) {
    border-color: var(--brand-600);
    background: var(--primary);
    color: var(--primary-foreground);
  }

  .new-order-main-submit.is-attention {
    animation: new-order-cta-glow 760ms ease-out 2;
    box-shadow: var(--new-order-cta-ring);
  }

  .new-order-main-submit.is-attention::after,
  .new-order-first-focus::after {
    content: "";
    position: absolute;
    inset: -20% -45%;
    background: linear-gradient(105deg, transparent 35%, rgb(255 255 255 / .36), transparent 65%);
    transform: translateX(-52%);
    animation: new-order-highlight-sweep 820ms ease-out 1;
    pointer-events: none;
  }

  .new-order-first-focus {
    position: relative;
    overflow: hidden;
    animation: new-order-first-focus-ring 760ms ease-out 2;
    box-shadow: var(--new-order-cta-ring);
  }

  .dialog.dialog--new-order-wizard {
    width: min(1040px, calc(100vw - 32px));
    display: grid;
    grid-template-columns: 224px minmax(0, 1fr);
    align-items: stretch;
  }

  .dialog.dialog--new-order-wizard .new-order-process-panel {
    grid-row: 1 / 4;
    grid-column: 1;
    border-right: 1px solid var(--border);
    background: var(--surface-soft);
    padding: var(--space-4);
  }

  .dialog.dialog--new-order-wizard .dialog__head,
  .dialog.dialog--new-order-wizard .dialog__body,
  .dialog.dialog--new-order-wizard .dialog__foot {
    grid-column: 2;
  }

  .new-order-process-panel__title {
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin-bottom: var(--space-4);
  }

  .new-order-process-panel__title strong {
    color: var(--text-strong);
    font-size: var(--text-md);
  }

  .new-order-process-panel__title span {
    color: var(--text-muted);
    font-size: var(--text-sm);
  }

  .new-order-step-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }

  .new-order-step-item {
    display: grid;
    grid-template-columns: 28px minmax(0, 1fr);
    gap: var(--space-2);
    align-items: start;
    min-height: 38px;
    color: var(--text-muted);
  }

  .new-order-step-item__num {
    display: inline-grid;
    place-items: center;
    width: 24px;
    height: 24px;
    border-radius: var(--radius-sm);
    border: 1px solid var(--border);
    background: var(--surface);
    font-size: var(--text-sm);
    font-weight: var(--fw-bold);
  }

  .new-order-step-item__label {
    display: flex;
    flex-direction: column;
    gap: 1px;
  }

  .new-order-step-item__label strong {
    color: var(--text);
    font-size: var(--text-sm);
    font-weight: var(--fw-semibold);
  }

  .new-order-step-item__label span {
    color: var(--text-muted);
    font-size: var(--text-caption);
  }

  .new-order-step-item[data-state="current"] .new-order-step-item__num {
    border-color: var(--brand-600);
    background: var(--brand-600);
    color: var(--text-on-brand);
    box-shadow: 0 0 0 3px rgb(31 100 214 / .12);
  }

  .new-order-step-item[data-state="complete"] .new-order-step-item__num {
    border-color: var(--success-bd);
    background: var(--success-bg);
    color: var(--success-fg);
  }

  .new-order-step-item[data-state="current"] .new-order-step-item__label strong {
    color: var(--text-strong);
  }

  .new-order-step-item[data-state="optional"] .new-order-step-item__num {
    border-style: dashed;
  }

  .new-order-apply-panel {
    display: grid;
    gap: var(--space-3);
  }

  .new-order-apply-panel__box {
    display: grid;
    gap: 6px;
    padding: var(--space-3);
    border: 1px solid var(--info-bd);
    border-radius: var(--radius);
    background: var(--info-bg);
    color: var(--info-fg);
  }

  .new-order-apply-panel__box strong {
    color: var(--text-strong);
  }

  .new-order-flash {
    animation: new-order-section-flash 900ms ease-out 1;
  }

  @keyframes new-order-first-focus-ring {
    0% { box-shadow: 0 0 0 0 rgb(31 100 214 / 0); }
    42% { box-shadow: var(--new-order-cta-ring); }
    100% { box-shadow: 0 0 0 0 rgb(31 100 214 / 0); }
  }

  @keyframes new-order-cta-glow {
    0% { box-shadow: 0 0 0 0 rgb(31 100 214 / 0); }
    45% { box-shadow: var(--new-order-cta-ring), 0 8px 18px rgb(31 100 214 / .16); }
    100% { box-shadow: 0 0 0 0 rgb(31 100 214 / 0); }
  }

  @keyframes new-order-required-action-glow {
    0% { box-shadow: 0 0 0 0 rgb(31 100 214 / 0); }
    42% { box-shadow: 0 0 0 2px var(--surface), 0 0 0 4px rgb(31 100 214 / .26); }
    100% { box-shadow: 0 0 0 0 rgb(31 100 214 / 0); }
  }

  @keyframes new-order-required-action-sweep {
    0% { transform: translateX(-55%); opacity: 0; }
    24% { opacity: 1; }
    100% { transform: translateX(55%); opacity: 0; }
  }

  @keyframes new-order-required-reminder-glow {
    0% { box-shadow: 0 0 0 0 rgb(31 100 214 / 0); }
    42% { box-shadow: 0 0 0 2px var(--surface), 0 0 0 4px rgb(31 100 214 / .22); }
    100% { box-shadow: 0 0 0 0 rgb(31 100 214 / 0); }
  }

  @keyframes new-order-required-reminder-sweep {
    0% { transform: translateX(-55%); opacity: 0; }
    24% { opacity: 1; }
    100% { transform: translateX(55%); opacity: 0; }
  }

  @keyframes new-order-highlight-sweep {
    0% { transform: translateX(-55%); opacity: 0; }
    22% { opacity: 1; }
    100% { transform: translateX(55%); opacity: 0; }
  }

  @keyframes new-order-section-flash {
    0% { background-color: rgb(239 246 255 / .96); box-shadow: inset 0 0 0 1px rgb(147 197 253 / .72); }
    100% { background-color: transparent; box-shadow: inset 0 0 0 0 rgb(147 197 253 / 0); }
  }

  @media (prefers-reduced-motion: reduce) {
    .new-order-main-submit.is-attention,
    .new-order-required-action,
    .new-order-required-action.is-reminding,
    .new-order-first-focus,
    .new-order-main-submit.is-attention::after,
    .new-order-required-action::after,
    .new-order-required-action.is-reminding::after,
    .new-order-first-focus::after,
    .new-order-flash {
      animation-duration: 1ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 1ms !important;
    }
  }

  @media (max-width: 860px) {
    .dialog.dialog--new-order-wizard {
      grid-template-columns: 1fr;
    }

    .dialog.dialog--new-order-wizard .new-order-process-panel {
      grid-row: auto;
      grid-column: 1;
      border-right: 0;
      border-bottom: 1px solid var(--border);
    }

    .dialog.dialog--new-order-wizard .dialog__head,
    .dialog.dialog--new-order-wizard .dialog__body,
    .dialog.dialog--new-order-wizard .dialog__foot {
      grid-column: 1;
    }
  }
</style>
<script id="new-order-registration-flow-script">
(function () {
  const FLOW_VERSION = "new-order-registration-flow-20260617";
  const guidedPhases = new Set(["new-reset", "new-wizard-active", "new-required-complete", "new-driver-optional"]);
  const wizardPhases = new Set(["new-wizard-active", "new-required-complete", "new-driver-optional"]);
  const steps = [
    { key: "shipper", num: "1", title: "\uD654\uC8FC \uC815\uBCF4", meta: "\uD544\uC218" },
    { key: "load", num: "2-1", title: "\uC0C1\uCC28\uC9C0", meta: "\uD544\uC218" },
    { key: "unload", num: "2-2", title: "\uD558\uCC28\uC9C0", meta: "\uD544\uC218" },
    { key: "cargo", num: "3", title: "\uD654\uBB3C \uC815\uBCF4", meta: "\uD544\uC218" },
    { key: "money", num: "4", title: "\uC815\uC0B0 \uC815\uBCF4", meta: "\uD544\uC218" },
    { key: "driver", num: "5", title: "\uCC28\uC8FC \uC815\uBCF4", meta: "\uC120\uD0DD" }
  ];

  const flow = {
    phase: "idle-edit",
    step: null,
    clientDraftId: null,
    payloadVersion: 0,
    lastPayloadHash: "",
    idempotencyKey: "",
    suppressCloseTransition: false
  };

  const original = {};
  let requiredEmptyRaf = 0;
  const requiredActionReminderTimers = new WeakMap();
  const REQUIRED_ACTION_REMINDER_DELAY_MS = 10000;
  const REQUIRED_ACTION_REMINDER_ANIMATION_MS = 900;

  function ensureRuntimeStyles() {
    if (document.getElementById("new-order-registration-flow-style-runtime")) return;
    const style = document.createElement("style");
    style.id = "new-order-registration-flow-style-runtime";
    style.textContent = [
      'body.new-order-flow--document-view .stack-main .ds-section > .sec-head{display:none!important;}',
      'body:not(.new-order-flow--guided-entry) .stack-main .ds-section > .sec-head{display:none!important;}',
      'body.new-order-flow--guided-entry .stack-main .ds-section > .sec-head{display:flex!important;}',
      'body.new-order-flow--guided-entry .stack-main .ds-section > .sec-head[data-new-order-step-state="current"]{background:linear-gradient(90deg,var(--brand-50),transparent);box-shadow:inset 3px 0 0 var(--brand-600);}',
      'body.new-order-flow--guided-entry .stack-main .ds-section[data-new-order-summary-section="true"] > .sec-head .sec-head__num{width:auto;min-width:34px;padding:0 8px;border:1px solid var(--border-strong);background:var(--surface-soft);color:var(--text-muted);font-size:var(--text-sm);}',
      'body.new-order-flow--guided-entry .stack-main .ds-section > .sec-head[data-new-order-step-state="complete"] .sec-head__num{border-color:var(--success-bd);background:var(--success-bg);color:var(--success-fg);}',
      '.ds-section[data-new-order-cargo-empty] > .sec-body,.ds-section[data-new-order-money-empty] > .sec-body{padding:0!important;}',
      '.moneyF.new-order-empty-route-layout{display:block;gap:0;}',
      '.moneyF.new-order-empty-route-layout .money-block{border:0;border-radius:0;overflow:visible;}',
      '.moneyF.new-order-empty-route-layout .money-block__head{display:none;}',
      '.moneyF.new-order-empty-route-layout .money-block__body{min-width:0;}',
      '.moneyF.new-order-empty-route-layout .money-block + .money-block .irow{border-top:1px solid var(--border);}',
      '.moneyF.new-order-empty-route-layout .irow.is-empty{grid-template-columns:48px minmax(0,1fr) max-content!important;min-width:0!important;}',
      'body:not(.new-order-flow--guided-entry) .irow.new-order-required-empty{position:relative;box-shadow:inset 2px 0 0 var(--brand-600);}',
      'body:not(.new-order-flow--guided-entry) .irow.new-order-required-empty > .kind{color:var(--brand-600);font-weight:var(--fw-bold);}',
      'body:not(.new-order-flow--guided-entry) .new-order-required-action{position:relative;overflow:hidden;animation:new-order-required-action-glow 760ms ease-out 2;}',
      'body:not(.new-order-flow--guided-entry) .new-order-required-action.is-reminding{animation:new-order-required-reminder-glow 760ms ease-out 1;}',
      'body:not(.new-order-flow--guided-entry) .new-order-required-action:hover,body:not(.new-order-flow--guided-entry) .new-order-required-action:focus-visible{box-shadow:var(--new-order-cta-ring);}',
      'body:not(.new-order-flow--guided-entry) .new-order-required-action::after{content:"";position:absolute;inset:-20% -45%;background:linear-gradient(105deg,transparent 35%,rgb(255 255 255 / .34),transparent 65%);opacity:0;transform:translateX(-52%);animation:new-order-required-action-sweep 820ms ease-out 1;pointer-events:none;}',
      'body:not(.new-order-flow--guided-entry) .new-order-required-action.is-reminding::after{animation:new-order-required-reminder-sweep 820ms ease-out 1;}',
      'body.new-order-flow--document-view .ds-section[data-new-order-cargo-applied],body.new-order-flow--document-view .ds-section[data-new-order-money-applied]{border-color:transparent;border-radius:0;background:transparent;box-shadow:none;overflow:visible;}',
      'body.new-order-flow--document-view .ds-section[data-new-order-cargo-applied] > .sec-body,body.new-order-flow--document-view .ds-section[data-new-order-money-applied] > .sec-body{padding:0!important;}',
      '.new-order-flow-status{display:none;align-items:center;gap:var(--space-2);min-height:34px;margin:var(--space-2) var(--space-4) 0;padding:0 var(--space-3);border:1px solid var(--info-bd);border-radius:var(--radius);background:var(--info-bg);color:var(--info-fg);font-size:var(--text-sm);font-weight:var(--fw-medium);}',
      '.new-order-flow-status.is-visible{display:flex;}',
      '.new-order-flow-status[data-tone="success"]{border-color:var(--success-bd);background:var(--success-bg);color:var(--success-fg);}',
      '.new-order-flow-status[data-tone="warn"]{border-color:var(--warn-bd);background:var(--warn-bg);color:var(--warn-fg);}',
      '.new-order-flow-status[data-tone="danger"]{border-color:var(--danger-bd);background:var(--danger-bg);color:var(--danger-600);}',
      '.new-order-main-submit{display:none!important;position:relative;overflow:hidden;}',
      '.new-order-main-submit.is-visible{display:inline-flex!important;}',
      '.new-order-main-submit.is-visible:not(:disabled){border-color:var(--brand-600);background:var(--primary);color:var(--primary-foreground);}',
      '.new-order-main-submit.is-attention{animation:new-order-cta-glow 760ms ease-out 2;box-shadow:0 0 0 2px var(--surface),0 0 0 5px rgb(31 100 214 / .34);}',
      '.new-order-main-submit.is-attention::after,.new-order-first-focus::after{content:"";position:absolute;inset:-20% -45%;background:linear-gradient(105deg,transparent 35%,rgb(255 255 255 / .36),transparent 65%);transform:translateX(-52%);animation:new-order-highlight-sweep 820ms ease-out 1;pointer-events:none;}',
      '.new-order-first-focus{position:relative;overflow:hidden;animation:new-order-first-focus-ring 760ms ease-out 2;box-shadow:0 0 0 2px var(--surface),0 0 0 5px rgb(31 100 214 / .34);}',
      '.dialog.dialog--new-order-wizard{width:min(1040px,calc(100vw - 32px));display:grid;grid-template-columns:224px minmax(0,1fr);align-items:stretch;}',
      '.dialog.dialog--new-order-wizard .new-order-process-panel{grid-row:1/4;grid-column:1;border-right:1px solid var(--border);background:var(--surface-soft);padding:var(--space-4);}',
      '.dialog.dialog--new-order-wizard .dialog__head,.dialog.dialog--new-order-wizard .dialog__body,.dialog.dialog--new-order-wizard .dialog__foot{grid-column:2;}',
      '.new-order-process-panel__title{display:flex;flex-direction:column;gap:4px;margin-bottom:var(--space-4);}',
      '.new-order-process-panel__title strong{color:var(--text-strong);font-size:var(--text-md);}',
      '.new-order-process-panel__title span{color:var(--text-muted);font-size:var(--text-sm);}',
      '.new-order-step-list{display:flex;flex-direction:column;gap:var(--space-2);}',
      '.new-order-step-item{display:grid;grid-template-columns:28px minmax(0,1fr);gap:var(--space-2);align-items:start;min-height:38px;color:var(--text-muted);}',
      '.new-order-step-item__num{display:inline-grid;place-items:center;width:24px;height:24px;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface);font-size:var(--text-sm);font-weight:var(--fw-bold);}',
      '.new-order-step-item__label{display:flex;flex-direction:column;gap:1px;}',
      '.new-order-step-item__label strong{color:var(--text);font-size:var(--text-sm);font-weight:var(--fw-semibold);}',
      '.new-order-step-item__label span{color:var(--text-muted);font-size:var(--text-caption);}',
      '.new-order-step-item[data-state="current"] .new-order-step-item__num{border-color:var(--brand-600);background:var(--brand-600);color:var(--text-on-brand);box-shadow:0 0 0 3px rgb(31 100 214 / .12);}',
      '.new-order-step-item[data-state="complete"] .new-order-step-item__num{border-color:var(--success-bd);background:var(--success-bg);color:var(--success-fg);}',
      '.new-order-step-item[data-state="current"] .new-order-step-item__label strong{color:var(--text-strong);}',
      '.new-order-step-item[data-state="optional"] .new-order-step-item__num{border-style:dashed;}',
      '.new-order-apply-panel{display:grid;gap:var(--space-3);}',
      '.new-order-apply-panel__box{display:grid;gap:6px;padding:var(--space-3);border:1px solid var(--info-bd);border-radius:var(--radius);background:var(--info-bg);color:var(--info-fg);}',
      '.new-order-apply-panel__box strong{color:var(--text-strong);}',
      '.new-order-flash{animation:new-order-section-flash 900ms ease-out 1;}',
      '@keyframes new-order-first-focus-ring{0%{box-shadow:0 0 0 0 rgb(31 100 214 / 0);}42%{box-shadow:0 0 0 2px var(--surface),0 0 0 5px rgb(31 100 214 / .34);}100%{box-shadow:0 0 0 0 rgb(31 100 214 / 0);}}',
      '@keyframes new-order-cta-glow{0%{box-shadow:0 0 0 0 rgb(31 100 214 / 0);}45%{box-shadow:0 0 0 2px var(--surface),0 0 0 5px rgb(31 100 214 / .34),0 8px 18px rgb(31 100 214 / .16);}100%{box-shadow:0 0 0 0 rgb(31 100 214 / 0);}}',
      '@keyframes new-order-required-action-glow{0%{box-shadow:0 0 0 0 rgb(31 100 214 / 0);}42%{box-shadow:0 0 0 2px var(--surface),0 0 0 4px rgb(31 100 214 / .26);}100%{box-shadow:0 0 0 0 rgb(31 100 214 / 0);}}',
      '@keyframes new-order-required-action-sweep{0%{transform:translateX(-55%);opacity:0;}24%{opacity:1;}100%{transform:translateX(55%);opacity:0;}}',
      '@keyframes new-order-required-reminder-glow{0%{box-shadow:0 0 0 0 rgb(31 100 214 / 0);}42%{box-shadow:0 0 0 2px var(--surface),0 0 0 4px rgb(31 100 214 / .22);}100%{box-shadow:0 0 0 0 rgb(31 100 214 / 0);}}',
      '@keyframes new-order-required-reminder-sweep{0%{transform:translateX(-55%);opacity:0;}24%{opacity:1;}100%{transform:translateX(55%);opacity:0;}}',
      '@keyframes new-order-highlight-sweep{0%{transform:translateX(-55%);opacity:0;}22%{opacity:1;}100%{transform:translateX(55%);opacity:0;}}',
      '@keyframes new-order-section-flash{0%{background-color:rgb(239 246 255 / .96);box-shadow:inset 0 0 0 1px rgb(147 197 253 / .72);}100%{background-color:transparent;box-shadow:inset 0 0 0 0 rgb(147 197 253 / 0);}}',
      '@media (prefers-reduced-motion:reduce){.new-order-main-submit.is-attention,.new-order-required-action,.new-order-required-action.is-reminding,.new-order-first-focus,.new-order-main-submit.is-attention::after,.new-order-required-action::after,.new-order-required-action.is-reminding::after,.new-order-first-focus::after,.new-order-flash{animation-duration:1ms!important;animation-iteration-count:1!important;transition-duration:1ms!important;}}',
      '@media (max-width:860px){.dialog.dialog--new-order-wizard{grid-template-columns:1fr;}.dialog.dialog--new-order-wizard .new-order-process-panel{grid-row:auto;grid-column:1;border-right:0;border-bottom:1px solid var(--border);}.dialog.dialog--new-order-wizard .dialog__head,.dialog.dialog--new-order-wizard .dialog__body,.dialog.dialog--new-order-wizard .dialog__foot{grid-column:1;}}'
    ].join("\n");
    document.head.appendChild(style);
  }

  function all(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function textOf(node) {
    return (node ? node.textContent : "").replace(/\s+/g, " ").trim();
  }

  function safeS() {
    try { return S; } catch (error) { return null; }
  }

  function findActionButton(label, exact) {
    const buttons = all(".actionbar button");
    return buttons.find(function (button) {
      const text = textOf(button);
      return exact ? text === label : text.indexOf(label) === 0;
    });
  }

  function mainSubmitButton() {
    return document.querySelector(".new-order-main-submit") || findActionButton("화물 등록", true);
  }

  function setSectionHeader(section, num, title, note) {
    if (!section) return;
    const head = section.querySelector(":scope > .sec-head");
    if (!head) return;
    const numNode = head.querySelector(".sec-head__num");
    const titleNode = head.querySelector(".sec-head__title");
    const noteNode = head.querySelector(".sec-head__note");
    if (numNode) {
      if (!numNode.dataset.newOrderOriginalNum) numNode.dataset.newOrderOriginalNum = numNode.textContent;
      numNode.textContent = num;
      numNode.dataset.newOrderOriginalNum = num;
    }
    if (titleNode) titleNode.textContent = title;
    if (noteNode) noteNode.textContent = note || "";
  }

  function sectionHeadHtml(num, title, note) {
    return '<div class="sec-head"><span class="sec-head__num">' + num + '</span><span class="sec-head__title">' + title + '</span><span class="sec-head__rule"></span><span class="sec-head__note">' + (note || "") + '</span></div>';
  }

  function setupOrderInformationArchitecture() {
    const transportHost = document.getElementById("sec-cargo-transport");
    const moneyHost = document.getElementById("sec-cargo-money");
    const summaryHost = document.getElementById("sec-summary");
    const shipperHost = document.getElementById("sec-shipper");
    const routeHost = document.getElementById("sec-route");
    const driverHost = document.getElementById("driver-db") || document.getElementById("hm-panel");
    if (!transportHost || !moneyHost || !summaryHost) return;

    const shipperSection = shipperHost ? shipperHost.closest(".ds-section") : null;
    const routeSection = routeHost ? routeHost.closest(".ds-section") : null;
    const cargoSection = transportHost.closest(".ds-section");
    const summarySection = summaryHost.closest(".ds-section");
    const driverSection = driverHost ? driverHost.closest(".ds-section") : null;
    const cargoBlock = transportHost.closest(".money-block");
    const moneyBlock = moneyHost.closest(".money-block");
    if (!cargoSection || !summarySection || !cargoBlock || !moneyBlock) return;

    setSectionHeader(cargoSection, "3", "\uD654\uBB3C \uC815\uBCF4", "\uC6B4\uC1A1+\uD488\uBAA9");

    const cargoContainer = cargoBlock.closest(".moneyF");
    if (cargoContainer && cargoBlock.parentElement !== cargoContainer) cargoContainer.appendChild(cargoBlock);
    if (cargoContainer && cargoContainer.children.length > 1) {
      Array.from(cargoContainer.children).forEach(function (child) {
        if (child !== cargoBlock) child.remove();
      });
    }

    let moneySection = document.querySelector('[data-new-order-settlement-section="true"]');
    if (!moneySection) {
      moneySection = document.createElement("section");
      moneySection.className = "ds-section";
      moneySection.setAttribute("data-new-order-settlement-section", "true");
      moneySection.innerHTML = sectionHeadHtml("4", "\uC815\uC0B0 \uC815\uBCF4", "\uACB0\uC81C \u00B7 \uCCAD\uAD6C \u00B7 \uC6B4\uC1A1\uBE44")
        + '<div class="sec-body"><div class="moneyF" data-new-order-money-container="true"></div></div>';
      cargoSection.insertAdjacentElement("afterend", moneySection);
    } else {
      setSectionHeader(moneySection, "4", "\uC815\uC0B0 \uC815\uBCF4", "\uACB0\uC81C \u00B7 \uCCAD\uAD6C \u00B7 \uC6B4\uC1A1\uBE44");
    }
    const moneyContainer = moneySection.querySelector('[data-new-order-money-container="true"]') || moneySection.querySelector(".moneyF");
    if (moneyContainer && moneyBlock.parentElement !== moneyContainer) moneyContainer.appendChild(moneyBlock);

    summarySection.classList.remove("new-order-summary-section");
    summarySection.setAttribute("data-new-order-summary-section", "true");
    const summaryCustomHead = summarySection.querySelector(":scope > .new-order-summary-head");
    if (summaryCustomHead) summaryCustomHead.remove();
    setSectionHeader(summarySection, "\uD655\uC778", "\uC624\uB354 \uC694\uC57D", "\uC785\uB825\uAC12 \uD655\uC778");

    if (driverSection) {
      setSectionHeader(driverSection, "5", "\uCC28\uC8FC \uC815\uBCF4", "\uC120\uD0DD");
    }
    if (summarySection.previousElementSibling !== moneySection) moneySection.insertAdjacentElement("afterend", summarySection);
    if (driverSection && summarySection.nextElementSibling !== driverSection) summarySection.insertAdjacentElement("afterend", driverSection);
  }

  function ensureCargoEmptyKind(host, label) {
    if (!host) return;
    const row = host.querySelector(".irow.is-empty");
    if (!row) return;
    row.classList.remove("is-empty--nokind");
    let kind = row.querySelector(":scope > .kind");
    if (!kind) {
      kind = document.createElement("span");
      kind.className = "kind";
      row.insertBefore(kind, row.firstChild);
    }
    kind.textContent = label;
  }

  function prefersReducedRequiredMotion() {
    return Boolean(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }

  function clearRequiredActionReminder(button) {
    if (!button) return;
    const timer = requiredActionReminderTimers.get(button);
    if (timer) window.clearTimeout(timer);
    requiredActionReminderTimers.delete(button);
    button.classList.remove("is-reminding");
  }

  function isRequiredActionStillActive(button) {
    return Boolean(
      button
      && button.isConnected
      && button.classList.contains("new-order-required-action")
      && !button.dataset.newOrderRequiredDismissed
      && !document.body.classList.contains("new-order-flow--guided-entry")
    );
  }

  function scheduleRequiredActionReminder(button) {
    if (!button || requiredActionReminderTimers.has(button) || prefersReducedRequiredMotion()) return;
    const timer = window.setTimeout(function () {
      requiredActionReminderTimers.delete(button);
      if (!isRequiredActionStillActive(button)) {
        clearRequiredActionReminder(button);
        return;
      }

      button.classList.remove("is-reminding");
      void button.offsetWidth;
      button.classList.add("is-reminding");
      window.setTimeout(function () {
        if (button && button.isConnected) button.classList.remove("is-reminding");
      }, REQUIRED_ACTION_REMINDER_ANIMATION_MS);

      scheduleRequiredActionReminder(button);
    }, REQUIRED_ACTION_REMINDER_DELAY_MS);
    requiredActionReminderTimers.set(button, timer);
  }

  function bindRequiredActionDismiss(button) {
    if (!button || button.dataset.newOrderRequiredDismissBound === "true") return;
    button.dataset.newOrderRequiredDismissBound = "true";
    button.addEventListener("click", function () {
      button.dataset.newOrderRequiredDismissed = "true";
      clearRequiredActionReminder(button);
    });
  }

  function syncRequiredEmptyAffordances() {
    const activeRows = new Set();
    const activeButtons = new Set();
    const targets = [
      ["#sec-shipper .irow.is-empty", "shipper"],
      ["#sec-route .irow.is-empty", "route"],
      ["#sec-cargo-transport .irow.is-empty", "cargo"],
      ["#sec-cargo-money .irow.is-empty", "money"]
    ];

    targets.forEach(function (target) {
      const rows = all(target[0]);
      rows.forEach(function (row) {
        activeRows.add(row);
        row.classList.add("new-order-required-empty");
        row.dataset.newOrderRequiredKind = target[1];

        const button = row.querySelector("button.btn, .btn");
        if (button) {
          activeButtons.add(button);
          button.classList.add("new-order-required-action");
          bindRequiredActionDismiss(button);
          if (!button.dataset.newOrderRequiredDismissed) scheduleRequiredActionReminder(button);
        }
      });
    });

    all(".irow.new-order-required-empty").forEach(function (row) {
      if (activeRows.has(row)) return;
      row.classList.remove("new-order-required-empty");
      delete row.dataset.newOrderRequiredKind;
    });

    all(".new-order-required-action").forEach(function (button) {
      if (activeButtons.has(button)) return;
      clearRequiredActionReminder(button);
      button.classList.remove("new-order-required-action");
      button.classList.remove("is-reminding");
      delete button.dataset.newOrderRequiredDismissed;
    });
  }

  function scheduleRequiredEmptyAffordances() {
    if (requiredEmptyRaf) window.cancelAnimationFrame(requiredEmptyRaf);
    requiredEmptyRaf = window.requestAnimationFrame(function () {
      requiredEmptyRaf = 0;
      syncRequiredEmptyAffordances();
    });
  }

  function installRequiredEmptyObserver() {
    const root = document.querySelector(".stack-main") || document.body;
    if (!root || root.dataset.newOrderRequiredObserver === "true") return;
    root.dataset.newOrderRequiredObserver = "true";
    const observer = new MutationObserver(scheduleRequiredEmptyAffordances);
    observer.observe(root, { childList: true, subtree: true });
    scheduleRequiredEmptyAffordances();
  }

  function syncCargoEmptyRouteLayout() {
    const data = safeS();
    const transportApplied = Boolean(data && data.cargo && data.cargo.transport);
    const moneyApplied = Boolean(data && data.cargo && data.cargo.money);
    const transportHost = document.getElementById("sec-cargo-transport");
    const moneyHost = document.getElementById("sec-cargo-money");
    const cargoContainer = transportHost ? transportHost.closest(".moneyF") : null;
    const moneyContainer = moneyHost ? moneyHost.closest(".moneyF") : null;
    const cargoSection = transportHost ? transportHost.closest(".ds-section") : null;
    const moneySection = moneyHost ? moneyHost.closest(".ds-section") : null;

    if (cargoContainer) {
      cargoContainer.classList.toggle("new-order-empty-route-layout", !transportApplied);
    }
    if (moneyContainer) {
      moneyContainer.classList.toggle("new-order-empty-route-layout", !moneyApplied);
    }
    if (cargoSection) {
      if (!transportApplied) cargoSection.setAttribute("data-new-order-cargo-empty", "true");
      else cargoSection.removeAttribute("data-new-order-cargo-empty");

      if (transportApplied) cargoSection.setAttribute("data-new-order-cargo-applied", "true");
      else cargoSection.removeAttribute("data-new-order-cargo-applied");
    }
    if (moneySection) {
      if (!moneyApplied) moneySection.setAttribute("data-new-order-money-empty", "true");
      else moneySection.removeAttribute("data-new-order-money-empty");

      if (moneyApplied) moneySection.setAttribute("data-new-order-money-applied", "true");
      else moneySection.removeAttribute("data-new-order-money-applied");
    }

    if (!transportApplied) ensureCargoEmptyKind(transportHost, "\uD654\uBB3C");
    if (!moneyApplied) ensureCargoEmptyKind(moneyHost, "\uC815\uC0B0");
    syncRequiredEmptyAffordances();
  }

  function setPhase(phase, step) {
    flow.phase = phase;
    if (step !== undefined) flow.step = step;
    document.body.dataset.newOrderPhase = phase;
    document.body.dataset.newOrderVersion = FLOW_VERSION;
    document.body.classList.toggle("new-order-flow--guided-entry", guidedPhases.has(phase));
    document.body.classList.toggle("new-order-flow--document-view", !guidedPhases.has(phase));
    annotateSectionHeaders();
    updateMainSubmitButton();
    syncCargoEmptyRouteLayout();
  }

  function ensureStatusStrip() {
    let strip = document.querySelector(".new-order-flow-status");
    if (strip) return strip;
    strip = document.createElement("div");
    strip.className = "new-order-flow-status";
    strip.setAttribute("role", "status");
    strip.setAttribute("aria-live", "polite");
    const actionbar = document.querySelector(".actionbar");
    if (actionbar) actionbar.insertAdjacentElement("beforebegin", strip);
    else document.body.appendChild(strip);
    return strip;
  }

  function setStatus(message, tone) {
    const strip = ensureStatusStrip();
    strip.textContent = message || "";
    strip.dataset.tone = tone || "info";
    strip.classList.toggle("is-visible", Boolean(message));
  }

  function sectionForStep(step) {
    if (step === "shipper") return document.getElementById("sec-shipper")?.closest(".ds-section");
    if (step === "load" || step === "unload") return document.getElementById("sec-route")?.closest(".ds-section");
    if (step === "cargo") return document.getElementById("sec-cargo-transport")?.closest(".ds-section");
    if (step === "money") return document.getElementById("sec-cargo-money")?.closest(".ds-section");
    if (step === "driver") return document.getElementById("driver-db")?.closest(".ds-section") || document.getElementById("hm-panel")?.closest(".ds-section");
    return null;
  }

  function stepIndex(key) {
    return steps.findIndex(function (item) { return item.key === key; });
  }

  function processStateFor(key) {
    const current = stepIndex(flow.step);
    const index = stepIndex(key);
    if (flow.phase === "new-required-complete") {
      if (key === "driver") return "optional";
      return "complete";
    }
    if (flow.phase === "new-driver-optional") {
      if (key === "driver") return "current";
      return "complete";
    }
    if (index < current) return "complete";
    if (index === current) return "current";
    if (key === "driver") return "optional";
    return "wait";
  }

  function annotateSectionHeaders() {
    const headers = all(".stack-main .ds-section > .sec-head");
    headers.forEach(function (header) {
      header.removeAttribute("data-new-order-step-state");
    });
    if (!guidedPhases.has(flow.phase)) return;
    const currentSection = sectionForStep(flow.step);
    const currentHeader = currentSection ? currentSection.querySelector(":scope > .sec-head") : null;
    if (currentHeader) currentHeader.setAttribute("data-new-order-step-state", "current");

    if (flow.phase === "new-required-complete" || flow.phase === "new-driver-optional") {
      ["shipper", "load", "unload", "cargo", "money"].forEach(function (key) {
        const section = sectionForStep(key);
        const header = section ? section.querySelector(":scope > .sec-head") : null;
        if (header && header !== currentHeader) header.setAttribute("data-new-order-step-state", "complete");
      });
    }
  }

  function processPanelHtml() {
    const items = steps.map(function (step) {
      const state = processStateFor(step.key);
      const stateText = state === "complete" ? "완료" : state === "current" ? "진행 중" : state === "optional" ? "선택" : "대기";
      return '<div class="new-order-step-item" data-step="' + step.key + '" data-state="' + state + '">'
        + '<span class="new-order-step-item__num">' + step.num + '</span>'
        + '<span class="new-order-step-item__label"><strong>' + step.title + '</strong><span>' + step.meta + ' · ' + stateText + '</span></span>'
        + '</div>';
    }).join("");
    return '<aside class="new-order-process-panel" aria-label="신규 접수 진행 단계">'
      + '<div class="new-order-process-panel__title"><strong>신규 접수</strong><span>필수 정보 입력 후 메인 화면에 적용합니다.</span></div>'
      + '<div class="new-order-step-list">' + items + '</div>'
      + '</aside>';
  }

  function decorateDialog(dialog) {
    if (!dialog || !wizardPhases.has(flow.phase)) return dialog;
    dialog.classList.add("dialog--new-order-wizard");
    dialog.dataset.newOrderStep = flow.step || "";
    if (!dialog.querySelector(".new-order-process-panel")) {
      const holder = document.createElement("div");
      holder.innerHTML = processPanelHtml();
      dialog.insertBefore(holder.firstElementChild, dialog.firstElementChild);
    }
    if (flow.step === "driver") {
      const actions = dialog.querySelector(".dialog__foot-actions");
      if (actions && !actions.querySelector("[data-new-order-driver-skip]")) {
        const skip = document.createElement("button");
        skip.type = "button";
        skip.className = "btn btn--ghost";
        skip.dataset.newOrderDriverSkip = "true";
        skip.textContent = "건너뛰기";
        skip.addEventListener("click", function () {
          window.newOrderApplyToMain("driver-skip");
        });
        actions.insertBefore(skip, actions.firstElementChild);
      }
    }
    return dialog;
  }

  function focusFirstShipperAction() {
    const section = document.getElementById("sec-shipper");
    const button = section ? section.querySelector("button") : null;
    const target = button || section;
    if (!target) return;
    if (!button && !target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: false });
    if (button) {
      button.classList.add("new-order-first-focus");
      const remove = function () { button.classList.remove("new-order-first-focus"); };
      button.addEventListener("click", remove, { once: true });
      button.addEventListener("keydown", remove, { once: true });
      window.setTimeout(remove, 1800);
    }
  }

  function startNewOrderReset() {
    flow.clientDraftId = "draft-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 8);
    flow.payloadVersion = 0;
    flow.lastPayloadHash = "";
    flow.idempotencyKey = "";
    if (original.resetAll) original.resetAll();
    setPhase("new-reset", "shipper");
    syncCargoEmptyRouteLayout();
    setStatus("신규 접수가 시작되었습니다. 화주 정보부터 입력하세요.", "info");
    window.setTimeout(focusFirstShipperAction, 60);
  }

  function openWizardStep(step) {
    flow.step = step;
    setPhase(step === "driver" ? "new-driver-optional" : "new-wizard-active", step);
    if (step === "shipper") return original.openShipperLookup();
    if (step === "load") return original.openAddrSearch("load");
    if (step === "unload") return original.openAddrSearch("unload");
    if (step === "cargo") return original.openCargoInput();
    if (step === "money") return original.openMoneyInput();
    if (step === "driver") return original.openDriverLookup();
  }

  function openRequiredCompleteChoice() {
    setPhase("new-required-complete", "money");
    const body = '<div class="new-order-apply-panel">'
      + '<div class="new-order-apply-panel__box"><strong>필수 입력이 완료되었습니다.</strong><span>현재 입력값은 아직 API로 저장되지 않습니다. 메인 화면에 적용한 뒤 최종 내용을 확인할 수 있습니다.</span></div>'
      + '<div class="formula">차주 정보는 선택 사항입니다. 바로 메인 화면에 적용하거나 차주 정보 선택 단계로 이동할 수 있습니다.</div>'
      + '</div>';
    const foot = '<span class="chip chip--wait">API 통신 전 단계</span>'
      + '<span class="dialog__foot-actions"><button class="btn btn--secondary" onclick="window.newOrderGoDriver()">차주 정보로 이동</button>'
      + '<button class="btn btn--primary" onclick="window.newOrderApplyToMain(\'required-complete\')">화물 등록 완료</button></span>';
    window.renderDialog(window.frame("금액 입력 완료", "필수 입력 완료", body, foot));
  }

  function payloadHash() {
    const data = safeS();
    if (!data) return "";
    return JSON.stringify({
      shipper: data.shipper,
      route: data.route,
      distance: data.distance,
      base: data.base,
      cargo: data.cargo,
      summary: data.summary,
      driver: data.driver
    });
  }

  function markPayloadApplied() {
    const hash = payloadHash();
    if (hash !== flow.lastPayloadHash) {
      flow.payloadVersion += 1;
      flow.lastPayloadHash = hash;
    }
  }

  function highlightNode(node) {
    if (!node) return;
    node.classList.remove("new-order-flash");
    void node.offsetWidth;
    node.classList.add("new-order-flash");
    window.setTimeout(function () { node.classList.remove("new-order-flash"); }, 950);
  }

  function highlightSubmitButton() {
    const button = mainSubmitButton();
    if (!button) return;
    button.classList.add("is-attention");
    window.setTimeout(function () { button.classList.remove("is-attention"); }, 1800);
  }

  window.newOrderApplyToMain = function (source) {
    flow.suppressCloseTransition = true;
    if (original.closeDialog) original.closeDialog();
    flow.suppressCloseTransition = false;
    markPayloadApplied();
    setPhase("new-submitted", null);
    setStatus("입력한 화물 정보가 메인 화면에 적용되었습니다. 화물 등록 버튼으로 최종 등록할 수 있습니다.", "success");
    highlightNode(document.getElementById("sec-summary") || document.querySelector(".stack-main"));
    window.setTimeout(highlightSubmitButton, 80);
  };

  window.newOrderGoDriver = function () {
    flow.suppressCloseTransition = true;
    if (original.closeDialog) original.closeDialog();
    flow.suppressCloseTransition = false;
    openWizardStep("driver");
  };

  function recordIndependentChange(message) {
    if (flow.phase !== "new-submitted" && flow.phase !== "submit-failed") return;
    markPayloadApplied();
    setPhase("new-submitted", null);
    setStatus(message || "수정한 최신 값이 메인 화물 등록 데이터에 반영되었습니다.", "info");
    window.setTimeout(highlightSubmitButton, 60);
  }

  function validationTargetFor(step) {
    const section = sectionForStep(step);
    return section ? (section.querySelector("button, input, select, [tabindex]") || section) : null;
  }

  function validateCurrentPayload() {
    const data = safeS();
    if (!data) return { ok: false, step: "shipper", message: "화물 데이터를 확인할 수 없습니다." };
    const checks = [
      { ok: Boolean(data.shipper), step: "shipper", message: "화주 정보가 필요합니다." },
      { ok: Boolean(data.route && data.route.load), step: "load", message: "상차지 정보가 필요합니다." },
      { ok: Boolean(data.route && data.route.unload), step: "unload", message: "하차지 정보가 필요합니다." },
      { ok: Boolean(data.cargo && data.cargo.transport), step: "cargo", message: "운송+품목 정보가 필요합니다." },
      { ok: Boolean(data.cargo && data.cargo.money), step: "money", message: "금액 정보가 필요합니다." }
    ];
    return checks.find(function (item) { return !item.ok; }) || { ok: true };
  }

  function setSubmitButtonState(label, disabled) {
    const button = mainSubmitButton();
    if (!button) return;
    button.textContent = label;
    button.disabled = Boolean(disabled);
    button.classList.toggle("is-visible", flow.phase === "new-submitted" || flow.phase === "submit-validating" || flow.phase === "submit-pending" || flow.phase === "submit-failed");
    if (flow.idempotencyKey) button.dataset.idempotencyKey = flow.idempotencyKey;
  }

  function updateMainSubmitButton() {
    const button = mainSubmitButton();
    if (!button) return;
    button.classList.add("new-order-main-submit");
    if (flow.phase === "submit-validating") return setSubmitButtonState("검증 중...", true);
    if (flow.phase === "submit-pending") return setSubmitButtonState("등록 중...", true);
    if (flow.phase === "submit-failed") return setSubmitButtonState("다시 등록", false);
    if (flow.phase === "submit-complete") {
      button.textContent = "등록 완료";
      button.disabled = true;
      button.classList.remove("is-visible");
      return;
    }
    button.textContent = "화물 등록";
    button.disabled = false;
    button.classList.toggle("is-visible", flow.phase === "new-submitted");
  }

  function runMainSubmit() {
    if (flow.phase !== "new-submitted" && flow.phase !== "submit-failed") return;
    setPhase("submit-validating", null);
    setStatus("최종 등록 전 필수값을 확인하고 있습니다.", "info");
    window.setTimeout(function () {
      const result = validateCurrentPayload();
      if (!result.ok) {
        setPhase("new-submitted", null);
        setStatus(result.message + " 해당 영역을 확인하세요.", "danger");
        const target = validationTargetFor(result.step);
        const section = sectionForStep(result.step);
        if (section) section.scrollIntoView({ behavior: "smooth", block: "center" });
        if (target && typeof target.focus === "function") window.setTimeout(function () { target.focus({ preventScroll: true }); }, 120);
        highlightNode(section);
        return;
      }

      const hash = payloadHash();
      if (!flow.lastPayloadHash) {
        flow.lastPayloadHash = hash;
        flow.payloadVersion = Math.max(flow.payloadVersion, 1);
      }
      if (hash !== flow.lastPayloadHash) {
        flow.payloadVersion += 1;
        flow.lastPayloadHash = hash;
      }
      flow.idempotencyKey = flow.clientDraftId + ":" + flow.payloadVersion;
      setPhase("submit-pending", null);
      setStatus("화물 등록 요청을 전송하는 중입니다. 중복 클릭은 자동으로 차단됩니다.", "info");
      window.setTimeout(function () {
        setPhase("submit-complete", null);
        setStatus("화물 등록이 완료되었습니다. 일반 조회/수정 상태로 전환되었습니다.", "success");
        highlightNode(document.querySelector(".app-head"));
      }, 900);
    }, 320);
  }

  function captureOriginals() {
    original.resetAll = window.resetAll;
    original.renderDialog = window.renderDialog;
    original.closeDialog = window.closeDialog;
    original.openShipperLookup = window.openShipperLookup;
    original.openAddrSearch = window.openAddrSearch;
    original.openCargoInput = window.openCargoInput;
    original.openMoneyInput = window.openMoneyInput;
    original.openDriverLookup = window.openDriverLookup;
    original.renderCargo = window.renderCargo;
    original.applyShipper = window.applyShipper;
    original.applyAddr = window.applyAddr;
    original.applyCargo = window.applyCargo;
    original.applyMoney = window.applyMoney;
    original.applyDriver = window.applyDriver;
  }

  function installWrappers() {
    window.renderDialog = function (html) {
      const dialog = original.renderDialog(html);
      return decorateDialog(dialog);
    };

    if (typeof original.renderCargo === "function") {
      window.renderCargo = function () {
        const result = original.renderCargo.apply(this, arguments);
        syncCargoEmptyRouteLayout();
        return result;
      };
    }

    window.closeDialog = function () {
      original.closeDialog();
      if (wizardPhases.has(flow.phase) && !flow.suppressCloseTransition) {
        setPhase("idle-edit", null);
        setStatus("신규 접수 작성을 중단했습니다.", "warn");
      }
    };

    window.openShipperLookup = function () {
      if (flow.phase === "new-reset") return openWizardStep("shipper");
      return original.openShipperLookup.apply(this, arguments);
    };

    window.applyShipper = function () {
      const wizard = wizardPhases.has(flow.phase) && flow.step === "shipper";
      if (wizard) flow.suppressCloseTransition = true;
      original.applyShipper.apply(this, arguments);
      flow.suppressCloseTransition = false;
      const data = safeS();
      if (wizard && data && data.shipper) return window.setTimeout(function () { openWizardStep("load"); }, 80);
      recordIndependentChange("화주 정보 수정값이 최종 등록 데이터에 반영되었습니다.");
    };

    window.applyAddr = function () {
      const step = flow.step;
      const wizard = wizardPhases.has(flow.phase) && (step === "load" || step === "unload");
      if (wizard) flow.suppressCloseTransition = true;
      original.applyAddr.apply(this, arguments);
      flow.suppressCloseTransition = false;
      const data = safeS();
      if (wizard && data) {
        if (step === "load" && data.route && data.route.load) return window.setTimeout(function () { openWizardStep("unload"); }, 80);
        if (step === "unload" && data.route && data.route.unload) return window.setTimeout(function () { openWizardStep("cargo"); }, 80);
      }
      recordIndependentChange("주소 수정값이 최종 등록 데이터에 반영되었습니다.");
    };

    window.applyCargo = function () {
      const wizard = wizardPhases.has(flow.phase) && flow.step === "cargo";
      if (wizard) flow.suppressCloseTransition = true;
      original.applyCargo.apply(this, arguments);
      flow.suppressCloseTransition = false;
      syncCargoEmptyRouteLayout();
      const data = safeS();
      if (wizard && data && data.cargo && data.cargo.transport) return window.setTimeout(function () { openWizardStep("money"); }, 80);
      recordIndependentChange("운송+품목 수정값이 최종 등록 데이터에 반영되었습니다.");
    };

    window.applyMoney = function () {
      const wizard = wizardPhases.has(flow.phase) && flow.step === "money";
      if (wizard) flow.suppressCloseTransition = true;
      original.applyMoney.apply(this, arguments);
      flow.suppressCloseTransition = false;
      syncCargoEmptyRouteLayout();
      const data = safeS();
      if (wizard && data && data.cargo && data.cargo.money) return window.setTimeout(openRequiredCompleteChoice, 80);
      recordIndependentChange("금액 수정값이 최종 등록 데이터에 반영되었습니다.");
    };

    window.applyDriver = function () {
      const wizard = wizardPhases.has(flow.phase) && flow.step === "driver";
      if (wizard) flow.suppressCloseTransition = true;
      original.applyDriver.apply(this, arguments);
      flow.suppressCloseTransition = false;
      if (wizard) return window.setTimeout(function () { window.newOrderApplyToMain("driver-applied"); }, 80);
      recordIndependentChange("차주 수정값이 최종 등록 데이터에 반영되었습니다.");
    };
  }

  function configureActionbar() {
    const newButton = findActionButton("신규 접수", false);
    if (newButton) {
      newButton.type = "button";
      newButton.addEventListener("click", function (event) {
        event.preventDefault();
        startNewOrderReset();
      });
    }

    const submitButton = findActionButton("화물 등록", true);
    if (submitButton) {
      submitButton.type = "button";
      submitButton.classList.add("new-order-main-submit");
      submitButton.addEventListener("click", function (event) {
        event.preventDefault();
        runMainSubmit();
      });
    }
  }

  function init() {
    ensureRuntimeStyles();
    captureOriginals();
    if (!original.renderDialog || !original.resetAll) return;
    setupOrderInformationArchitecture();
    installWrappers();
    configureActionbar();
    installRequiredEmptyObserver();
    setPhase("idle-edit", null);
    syncCargoEmptyRouteLayout();
    setStatus("", "info");
    window.__newOrderRegistrationFlow = {
      version: FLOW_VERSION,
      state: flow,
      start: startNewOrderReset,
      applyToMain: window.newOrderApplyToMain,
      submit: runMainSubmit
    };
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
</script>
<!-- NEW_ORDER_REGISTRATION_FLOW_LAYER_END -->
`;

const marker = '</body>';
const insertAt = source.lastIndexOf(marker);
if (insertAt < 0) {
  throw new Error('Could not find </body> in source HTML.');
}

const output = source.slice(0, insertAt) + layer + '\n' + source.slice(insertAt);
writeFileSync(outputPath, output, 'utf8');

console.log(`Generated ${outputPath}`);
