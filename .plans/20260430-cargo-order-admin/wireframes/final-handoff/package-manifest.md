# Final-handoff Package Manifest

## 목적

이 문서는 `final-handoff/` 안에 실제로 취합한 파일 묶음을 설명합니다.

구현 인계에 필요한 최종 기준과 근거 자료를 `final-handoff/` 내부로 복사했습니다. 이후 active 루트를 compact하게 만들기 위해 비최종 원본 작업 산출물은 `_archive/compact-handoff-20260618/`로 이동했습니다.

삭제는 실행하지 않았습니다.

## 취합 원칙

| 원칙 | 내용 |
| --- | --- |
| 복사 후 archive | 먼저 `final-handoff/` 내부에 필요한 파일을 복사한 뒤, active 루트의 비최종 산출물을 archive로 이동 |
| 최종 기준 우선 | 최종 화면은 master HTML만 baseline으로 포함 |
| 원문 보존 | 루트 문서, section 문서, audit 문서는 source snapshot으로 포함 |
| 참고 분리 | 비교용 HTML, component 규칙, design option은 reference snapshot으로 분리 |
| Archive 완료 | 이동 대상과 복구 기준은 `archive-manifest-2026-06-18.md`에 기록 |

## 취합 폴더

| 폴더 | 파일 수 | 역할 |
| --- | ---: | --- |
| `baseline/` | 2 | 최종 publishing 기준과 HTML 관리 규칙 |
| `source-snapshot/` | 145 | 원문 기획 문서, section package, audit/source map, 분석 이미지 |
| `reference-snapshot/` | 20 | B Original/Clean, component unification, design option 참고 자료 |

## Baseline

| 내부 경로 | archive 보존 경로 | 역할 |
| --- | --- | --- |
| `baseline/html/cargo-order-admin-hifi-master.html` | `../_archive/compact-handoff-20260618/results/html/cargo-order-admin-hifi-master.html` | 최종 통합 HiFi 기준 화면 |
| `baseline/html/results-html-README.md` | `../_archive/compact-handoff-20260618/results/html/README.md` | HTML export 관리 규칙과 후보 파일 설명 |

## Source Snapshot

| 내부 경로 | archive 보존 경로 | 역할 |
| --- | --- | --- |
| `source-snapshot/root-docs/` | `../_archive/compact-handoff-20260618/root-docs/` | 루트 통합 기획과 최신 통합 로그 |
| `source-snapshot/sections/new-order-registration-flow/` | `../_archive/compact-handoff-20260618/sections/new-order-registration-flow/` | 신규 접수 flow, wizard, API 보류 정책 |
| `source-snapshot/sections/reservation-area-tabs/` | `../_archive/compact-handoff-20260618/sections/reservation-area-tabs/` | 보조 정보 탭, visibility, handoff, closure |
| `source-snapshot/sections/transport-dialog-recent-lists/` | `../_archive/compact-handoff-20260618/sections/transport-dialog-recent-lists/` | 주소/운송+품목 최근 사용 리스트 |
| `source-snapshot/sections/shipper-info/` | `../_archive/compact-handoff-20260618/sections/shipper-info/` | 화주 정보 섹션 원문 |
| `source-snapshot/sections/transport-route/` | `../_archive/compact-handoff-20260618/sections/transport-route/` | 운송 구간 섹션 원문 |
| `source-snapshot/sections/cargo-transport/` | `../_archive/compact-handoff-20260618/sections/cargo-transport/` | 화물/운송/금액 섹션 원문 |
| `source-snapshot/sections/cargo-summary-docs/` | `../_archive/compact-handoff-20260618/sections/cargo-summary-docs/` | 오더 요약/증빙 섹션 원문 |
| `source-snapshot/sections/driver-info/` | `../_archive/compact-handoff-20260618/sections/driver-info/` | 차주 정보 섹션 원문 |
| `source-snapshot/sections/cargo-list/` | `../_archive/compact-handoff-20260618/sections/cargo-list/` | 하단 목록 기획 원문 |
| `source-snapshot/sections/order-entry-edit/` | `../_archive/compact-handoff-20260618/sections/order-entry-edit/` | 접수/수정 refinements 원문 |
| `source-snapshot/artifact-audit/` | `../_archive/compact-handoff-20260618/artifact-audit/` selected docs | source of truth, inventory, archive/cleanup 기록 |
| `source-snapshot/assets/` | `../_archive/compact-handoff-20260618/assets/` | 원본 캡처 분석 이미지 |

## Reference Snapshot

| 내부 경로 | archive 보존 경로 | 역할 |
| --- | --- | --- |
| `reference-snapshot/wireframe/Cargo Order Wireframe B Original Tone.html` | `../_archive/compact-handoff-20260618/results/wireframe/order-register-new2.0/Cargo Order Wireframe B Original Tone.html` | 기존 B 통합 구조 비교 |
| `reference-snapshot/wireframe/Cargo Order B Implementation Clean.html` | `../_archive/compact-handoff-20260618/results/wireframe/order-register-new2.0/Cargo Order B Implementation Clean.html` | 구현 clean interaction/data hook 참고 |
| `reference-snapshot/component-unification-plan/` | `../_archive/compact-handoff-20260618/results/wireframe/order-register-new2.0/component-unification-plan/` | label, hover, focus, placeholder, button 규칙 |
| `reference-snapshot/html-options/Design System.html` | `../_archive/compact-handoff-20260618/results/html/Design System.html` | shadcn 기준 component/token 참고 |
| `reference-snapshot/html-options/label-toggle-design-options-20260618.html` | `../_archive/compact-handoff-20260618/results/html/label-toggle-design-options-20260618.html` | `Aa` 라벨 토글 결정 근거 |
| `reference-snapshot/html-options/dispatch-manager-placement-options-20260618.html` | `../_archive/compact-handoff-20260618/results/html/dispatch-manager-placement-options-20260618.html` | 배차 담당자 header chip 결정 근거 |

## 포함하지 않은 항목

| 항목 | 이유 |
| --- | --- |
| master upload split | master HTML 복사본을 직접 포함했기 때문에 재조립 묶음은 제외 |
| 과거 후보 HTML 전체 | 최종 기준은 master HTML이며, 후보는 `_archive/compact-handoff-20260618/results/html/`에서 reference 유지 |
| 기존 `_archive/` 전체 | 기존 archive 자료는 필요 시 `../_archive/`에서 확인 |
| `results/wireframe/order-register-new2.0/review-artifacts/` 전체 | 검증 이미지가 많고 최종 구현 기준은 component plan과 source snapshot으로 충분 |

## 구현자가 먼저 열 파일

1. `README.md`
2. `01-final-prd.md`
3. `baseline/html/cargo-order-admin-hifi-master.html`
4. `06-final-baseline-data.md`
5. `data/final-baseline.json`
6. `03-implementation-handoff.md`
7. `source-snapshot/sections/new-order-registration-flow/08-main-submit-api-policy.md`

## 후속 관리

archive된 산출물을 복구하거나 원본 산출물을 새로 갱신하면 이 manifest와 복사본을 함께 갱신해야 합니다.

복사본과 원본이 다를 가능성이 생기면 원본을 먼저 확인하고, `package-manifest.md`의 취합일과 대상 파일을 갱신합니다.
