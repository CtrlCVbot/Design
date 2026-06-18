# Source Register

## 목적

이 문서는 현재 폴더의 원문 source, 최종 기준, 후보/참고, archive 후보를 구분합니다.

원칙은 삭제 없이 보존하는 것입니다. 현재 active 기준은 `final-handoff/`이며, 비최종 원본 작업 산출물은 `_archive/compact-handoff-20260618/`에 보존되어 있습니다.

## Source 상태 모델

| 상태 | 의미 |
| --- | --- |
| `canonical` | 현재 최종 판단 기준 |
| `source` | 상세 정책과 근거의 원문 |
| `reference` | 비교, rollback, hook 확인용 |
| `absorbed` | 최종 문서에 요약 흡수하되 원문은 유지 |
| `archive-candidate` | 현행 구현 기준은 아니나 삭제 전 승인 필요 |
| `archived` | 이미 `_archive`로 이동된 보존 자료 |
| `delete-candidate` | 삭제 후보. 이번 패키지에서는 지정하지 않음 |

## Canonical 기준

| 대상 | 파일 | 상태 |
| --- | --- | --- |
| 통합 HiFi | `baseline/html/cargo-order-admin-hifi-master.html` | `canonical` |
| source map | `source-snapshot/artifact-audit/source-of-truth-map.md` | `canonical` |
| 결과 HTML 관리 | `baseline/html/results-html-README.md` | `canonical` |
| 최종 인계 패키지 | `./README.md` 외 `01~06` | `canonical` for handoff |
| 최종 기준 데이터 | `./06-final-baseline-data.md`, `./data/final-baseline.json` | `canonical` for implementation data |
| 패키지 manifest | `./package-manifest.md` | `canonical` for copied handoff bundle |
| 패키지 내부 master | `./baseline/html/cargo-order-admin-hifi-master.html` | copied canonical baseline |

## 패키지 내부 복사본

| 내부 폴더 | 원본 범위 | 상태 |
| --- | --- | --- |
| `./baseline/` | `baseline/html/cargo-order-admin-hifi-master.html`, `baseline/html/results-html-README.md` | 최종 화면 기준 복사본 |
| `./source-snapshot/root-docs/` | 루트 README, `01~05`, `07~10`, 최근 사용 main 계획 | 원문 source 복사본 |
| `./source-snapshot/sections/` | 최종 화면 구현에 필요한 section package 10개 | 원문 source 복사본 |
| `./source-snapshot/artifact-audit/` | source of truth, inventory, cleanup/archive 근거 문서 | 감사 source 복사본 |
| `./source-snapshot/assets/` | 원본 캡처 분석 이미지 | 분석 이미지 복사본 |
| `./reference-snapshot/` | B Original/Clean, component unification, design option HTML | 구현/비교 참고 복사본 |

## 원문 source 유지

| 영역 | 원문 | Hub/PRD 흡수 방식 |
| --- | --- | --- |
| 화면 맵 | `source-snapshot/root-docs/01-screen-map.md` | screen node와 섹션 구조로 흡수 |
| 필드 인벤토리 | `source-snapshot/root-docs/02-field-inventory.md` | data contract와 field map으로 흡수 |
| 와이어프레임 | `source-snapshot/root-docs/03-wireframe.md` | 화면 상태 preview와 flow로 흡수 |
| 현대화 브리프 | `source-snapshot/root-docs/04-modernization-brief.md` | 구현 원칙과 risk로 흡수 |
| Self-review | `source-snapshot/root-docs/05-self-review.md` | risk register로 흡수 |
| 신규 접수 | `source-snapshot/sections/new-order-registration-flow/` | flow/AC/API policy로 연결 |
| 보조 정보 | `source-snapshot/sections/reservation-area-tabs/` | aside tabs/data/QA로 연결 |
| 최근 사용 | `source-snapshot/sections/transport-dialog-recent-lists/` | dialog recent state로 연결 |
| 최근 사용 main 반영 계획 | `source-snapshot/root-docs/09-transport-dialog-recent-lists-main-integration-plan.md` | 최근 사용 리스트 메인 통합 판단 근거로 연결 |
| Header polish | `source-snapshot/root-docs/10-hifi-design-polish-and-dispatch-manager-integration-log.md` | header component 정책으로 연결 |
| Archive 감사 | `source-snapshot/artifact-audit/archive-plan.md`, `source-snapshot/artifact-audit/cleanup-candidates.md`, `source-snapshot/artifact-audit/cleanup-manifest-2026-06-16.md`, `source-snapshot/artifact-audit/archive-execution-log-2026-06-16.md` | archive 후보와 과거 정리 실행 근거로 연결 |

## Final-handoff 반영 현황

| 구분 | 파일/폴더 | 반영 상태 | 다음 조치 |
| --- | --- | --- | --- |
| 최종 화면 | `baseline/html/cargo-order-admin-hifi-master.html` | 반영됨 | 최종 UI 확인은 이 파일만 안내 |
| HTML 운영 규칙 | `baseline/html/results-html-README.md` | 반영됨 | 후보 HTML 안내 기준 유지 |
| 루트 원문 | `source-snapshot/root-docs/README.md`, `source-snapshot/root-docs/01-screen-map.md`, `source-snapshot/root-docs/02-field-inventory.md`, `source-snapshot/root-docs/03-wireframe.md`, `source-snapshot/root-docs/04-modernization-brief.md`, `source-snapshot/root-docs/05-self-review.md` | 요약 반영됨 | 원문 source로 유지 |
| 통합 로그 | `source-snapshot/root-docs/07-new-order-registration-flow-integration-log.md`, `source-snapshot/root-docs/08-reservation-area-tabs-integration-log.md`, `source-snapshot/root-docs/09-transport-dialog-recent-lists-integration-log.md`, `source-snapshot/root-docs/10-hifi-design-polish-and-dispatch-manager-integration-log.md` | 핵심 결정 반영됨 | 상세 근거 source로 유지 |
| 최근 사용 main 계획 | `source-snapshot/root-docs/09-transport-dialog-recent-lists-main-integration-plan.md` | 연결 보강됨 | 실제 구현 전 최근 사용 적용 범위 재확인 |
| 섹션 원문 | `source-snapshot/sections/new-order-registration-flow/`, `source-snapshot/sections/reservation-area-tabs/`, `source-snapshot/sections/transport-dialog-recent-lists/` | 핵심 flow/data/QA 반영됨 | 상세 AC와 policy는 원문 확인 |
| 감사 문서 | `source-snapshot/artifact-audit/source-of-truth-map.md`, `source-snapshot/artifact-audit/artifact-inventory.md` | 반영됨 | source of truth와 파일 분류 근거로 유지 |
| Archive 기록 | `source-snapshot/artifact-audit/archive-plan.md`, `source-snapshot/artifact-audit/cleanup-candidates.md`, `source-snapshot/artifact-audit/cleanup-manifest-2026-06-16.md`, `source-snapshot/artifact-audit/archive-execution-log-2026-06-16.md` | 연결 보강됨 | 이번 archive 실행은 `archive-manifest-2026-06-18.md` 기준 |

## Reference 유지

| 대상 | 파일 | 이유 |
| --- | --- | --- |
| B Original Tone | `reference-snapshot/wireframe/Cargo Order Wireframe B Original Tone.html` | 기존 구조/업무 흐름 비교 |
| Clean 구현 참조 | `reference-snapshot/wireframe/Cargo Order B Implementation Clean.html` | interaction/data hook 참고 |
| Component plan | `reference-snapshot/component-unification-plan/` | label, hover, focus, placeholder 규칙 |
| Design system | `reference-snapshot/html-options/Design System.html` | shadcn 기준 component/token |
| 선택안 비교 HTML | `reference-snapshot/html-options/label-toggle-design-options-20260618.html`, `reference-snapshot/html-options/dispatch-manager-placement-options-20260618.html` | 결정 근거 보존 |
| Master upload split | `../_archive/compact-handoff-20260618/results/html/master-upload-split-20260617/` | 대용량 master 전달/재조립 참고 |

## Candidate HTML 처리

| 파일 | 현재 상태 | 처리 |
| --- | --- | --- |
| `../_archive/compact-handoff-20260618/results/html/new-order-registration-flow-hifi-20260617.html` | flow-candidate | reference 유지 |
| `../_archive/compact-handoff-20260618/results/html/cargo-order-hifi-reservation-tabs-shadcn-20260616.html` | source-candidate | reference 유지 |
| `../_archive/compact-handoff-20260618/results/html/cargo-order-hifi-reservation-tabs-empty-shadcn-20260617.html` | state-candidate | reference 유지 |
| `../_archive/compact-handoff-20260618/results/html/화물 오더 접수수정 (오프라인).html` | active-reference | reference 유지 |
| `../_archive/compact-handoff-20260618/results/html/cargo-order-hifi-local-motion-20260616.html` | local-candidate | reference 유지 |
| `../_archive/compact-handoff-20260618/results/html/hifi-local-motion-layer.html` | local-layer-reference | reference 유지 |
| `reference-snapshot/html-options/label-toggle-design-options-20260618.html` | decision-reference | reference 유지 |
| `reference-snapshot/html-options/dispatch-manager-placement-options-20260618.html` | decision-reference | reference 유지 |

후속 구현자에게는 위 후보를 최종 기준으로 안내하지 않습니다. 최종 화면 확인은 master 파일을 우선합니다.

## Archive 상태

| 대상 | 판단 | 조건 |
| --- | --- | --- |
| 이번 compact archive | archived | `_archive/compact-handoff-20260618/`와 `archive-manifest-2026-06-18.md` 기준 |
| 오래된 review artifacts | archived/reference | `_archive/compact-handoff-20260618/results/`에서 보존 |
| 과거 후보 HTML | archived/reference | master 반영 완료, rollback 참고용 |
| legacy prompts | archived | 이미 `_archive/legacy-prompts`에 보존 |
| verification snapshots | archived/reference 혼재 | 현재 문서 참조 여부 확인 필요 |
| 초기 specs HTML | archived/reference | `_archive/compact-handoff-20260618/results/wireframe/order-register-new2.0/specs/`에서 보존 |

## 삭제 정책

이번 패키지는 삭제 후보를 새로 지정하지 않습니다.

삭제가 필요하면 별도 `deletion-candidates` 문서와 사용자 승인이 필요합니다. HTML, 문서, 이미지 증빙이 서로 연결된 경우 한쪽만 단독 삭제하지 않습니다.

## Visual Hub 연결 규칙

| Hub 데이터 | 원문 source |
| --- | --- |
| `screenNodes` | `source-snapshot/root-docs/01-screen-map.md`, `source-snapshot/root-docs/03-wireframe.md`, section README |
| `flowStates` | `source-snapshot/sections/new-order-registration-flow/05-state-and-interaction-matrix.md` |
| `acceptanceCriteria` | section별 `06-acceptance-criteria.md` 또는 `05-acceptance-criteria.md` |
| `dataContracts` | `source-snapshot/root-docs/02-field-inventory.md`, section handoff |
| `risks` | `source-snapshot/root-docs/05-self-review.md`, section self-review, planning closure |
| `sourceLinks` | 이 문서와 `source-snapshot/artifact-audit/source-of-truth-map.md` |
| `finalBaseline` | `06-final-baseline-data.md`, `data/final-baseline.json` |
