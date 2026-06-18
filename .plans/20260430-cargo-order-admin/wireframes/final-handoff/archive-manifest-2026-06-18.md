# Compact Handoff Archive Manifest

## 목적

`final-handoff/`를 최종 전달 패키지로 남기고, 루트의 원본 작업 산출물과 후보 산출물을 `_archive/compact-handoff-20260618/`로 이동해 active 폴더를 compact하게 정리합니다.

삭제는 실행하지 않습니다. 모든 항목은 archive로 이동하며, 필요한 경우 이 manifest의 원래 경로와 archive 경로를 기준으로 복구합니다.

## 실행 기준

| 항목 | 기준 |
| --- | --- |
| 최종 active 패키지 | `final-handoff/` |
| Archive root | `_archive/compact-handoff-20260618/` |
| 실행 방식 | 원본 삭제 없음. archive 이동만 수행 |
| 보존 기준 | 이미 `final-handoff/` 내부에 baseline/source/reference 복사본이 존재 |
| 제외 | `final-handoff/`, 기존 `_archive/` |

## Archive 이동 대상

| 원래 경로 | Archive 경로 | 사유 |
| --- | --- | --- |
| `README.md` | `_archive/compact-handoff-20260618/root-docs/README.md` | `final-handoff/source-snapshot/root-docs/README.md`에 복사 완료 |
| `01-screen-map.md` | `_archive/compact-handoff-20260618/root-docs/01-screen-map.md` | `final-handoff/source-snapshot/root-docs/`에 복사 완료 |
| `02-field-inventory.md` | `_archive/compact-handoff-20260618/root-docs/02-field-inventory.md` | `final-handoff/source-snapshot/root-docs/`에 복사 완료 |
| `03-wireframe.md` | `_archive/compact-handoff-20260618/root-docs/03-wireframe.md` | `final-handoff/source-snapshot/root-docs/`에 복사 완료 |
| `04-modernization-brief.md` | `_archive/compact-handoff-20260618/root-docs/04-modernization-brief.md` | `final-handoff/source-snapshot/root-docs/`에 복사 완료 |
| `05-self-review.md` | `_archive/compact-handoff-20260618/root-docs/05-self-review.md` | `final-handoff/source-snapshot/root-docs/`에 복사 완료 |
| `07-new-order-registration-flow-integration-log.md` | `_archive/compact-handoff-20260618/root-docs/07-new-order-registration-flow-integration-log.md` | `final-handoff/source-snapshot/root-docs/`에 복사 완료 |
| `08-reservation-area-tabs-integration-log.md` | `_archive/compact-handoff-20260618/root-docs/08-reservation-area-tabs-integration-log.md` | `final-handoff/source-snapshot/root-docs/`에 복사 완료 |
| `09-transport-dialog-recent-lists-integration-log.md` | `_archive/compact-handoff-20260618/root-docs/09-transport-dialog-recent-lists-integration-log.md` | `final-handoff/source-snapshot/root-docs/`에 복사 완료 |
| `09-transport-dialog-recent-lists-main-integration-plan.md` | `_archive/compact-handoff-20260618/root-docs/09-transport-dialog-recent-lists-main-integration-plan.md` | `final-handoff/source-snapshot/root-docs/`에 복사 완료 |
| `10-hifi-design-polish-and-dispatch-manager-integration-log.md` | `_archive/compact-handoff-20260618/root-docs/10-hifi-design-polish-and-dispatch-manager-integration-log.md` | `final-handoff/source-snapshot/root-docs/`에 복사 완료 |
| `artifact-audit/` | `_archive/compact-handoff-20260618/artifact-audit/` | 핵심 감사 문서는 `final-handoff/source-snapshot/artifact-audit/`에 복사 완료 |
| `assets/` | `_archive/compact-handoff-20260618/assets/` | 분석 이미지는 `final-handoff/source-snapshot/assets/`에 복사 완료 |
| `claude-design-v2/` | `_archive/compact-handoff-20260618/claude-design-v2/` | high fidelity 입력 패키지. 최종 기준은 `final-handoff`와 master HTML |
| `results/` | `_archive/compact-handoff-20260618/results/` | 최종 master HTML과 reference는 `final-handoff/baseline/`, `reference-snapshot/`에 복사 완료 |
| `sections/` | `_archive/compact-handoff-20260618/sections/` | 최종 구현 관련 section은 `final-handoff/source-snapshot/sections/`에 복사 완료 |

## 이동 후 active 루트

이동 후 active 루트에는 아래만 남깁니다.

| 경로 | 역할 |
| --- | --- |
| `final-handoff/` | 최종 구현 인계 패키지 |
| `_archive/` | 보존 자료와 이번 archive 결과 |

## 복구 기준

복구가 필요하면 `_archive/compact-handoff-20260618/` 아래의 동일 파일을 원래 경로로 되돌립니다.

원본과 복사본의 기준이 충돌하면 `final-handoff/package-manifest.md`와 `final-handoff/04-source-register.md`를 먼저 확인합니다.
