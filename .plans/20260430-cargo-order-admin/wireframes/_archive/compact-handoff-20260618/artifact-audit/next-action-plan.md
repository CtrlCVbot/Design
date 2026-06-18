# Next Action Plan

## 권장 순서

| 단계 | 작업 | 결과물 |
| --- | --- | --- |
| 1 | 신규 HiFi HTML의 기준본 승격 범위 확정 | `hifi-promotion-review-2026-06-16.md` |
| 2 | source of truth 판정 갱신 | `source-of-truth-map.md`, `high-fidelity-review.md` |
| 3 | 접수/수정 섹션 기획 패키지 시작 | `sections/order-entry-edit` |
| 4 | Clean 애니메이션 분석과 HiFi 반영 계획 | `02-clean-animation-adoption-plan.md` |
| 5 | HiFi 원본 소스/재생성 경로 확인 | `hifi-source-regeneration-check-2026-06-16.md` |
| 6 | 새 HiFi export 병렬 보관 기준 수립 | `hifi-export-versioning-plan-2026-06-16.md`, `results/html/README.md` |
| 7 | Claude Design 보류 후 local HiFi motion 후보 생성 | `local-hifi-improvement-log-2026-06-16.md`, `cargo-order-hifi-local-motion-20260616.html` |
| 8 | 접수/수정 action/state matrix 작성 | `03-action-state-matrix.md` 예정 |
| 9 | 초기 HTML/variants HTML과 review artifacts 정리 | archive reference 이동 여부 후속 결정 |

## 1차 실행 제안

가장 먼저 할 일은 신규 HiFi를 어떤 기준본으로 볼지 확정하는 것입니다. 최신 판단은 `전면 구현 기준본`이 아니라 `시각 고도화 기준본`으로 조건부 승격하는 것입니다.

| 확인 항목 | 이유 |
| --- | --- |
| 5개 입력 섹션 순서 | HiFi가 접수/수정 업무면을 보존하는지 확인 |
| 전역 액션바 | 신규/등록/수정/복사/취소/정산/출력 흐름을 접수/수정 기획으로 연결 |
| Clean data hook | HiFi를 구현 기준으로 바로 쓰면 동작 계약이 손실될 수 있음 |
| Clean animation hook | 적용/전환/상태 피드백 모션을 HiFi에 선별 이식해야 함 |
| cargo-list placeholder | 목록 기획은 후순위라는 최신 방향과 충돌하지 않도록 분리 |
| dialog/accessibility | `role="dialog"`, tablist, focus 흐름 보강 필요 여부 확인 |

## 2차 실행 제안

그 다음 접수/수정 섹션 기획을 다듬습니다.

1. `artifact-audit/local-hifi-improvement-log-2026-06-16.md` 기준으로 local candidate 상태를 공유합니다.
2. `results/html/cargo-order-hifi-local-motion-20260616.html`을 현재 개선 후보로 두고 추가 QA를 진행합니다.
3. `sections/order-entry-edit/03-action-state-matrix.md`에서 전역 액션별 활성/비활성 조건과 confirm dialog를 정의합니다.
4. 5개 입력 섹션의 저장 전 validation summary를 연결합니다.
5. HiFi 시각 스타일을 Clean 구조에 이식할 때 보존해야 할 hook/accessibility/motion 체크리스트를 만듭니다.
6. Claude Design 재생성은 당분간 보류하고, 필요 시 후순위 옵션으로 되돌립니다.
7. 이후 archive/reference 정리를 다시 진행합니다.

## 사용자 승인 필요 항목

| 항목 | 필요한 결정 |
| --- | --- |
| 신규 HiFi HTML | 시각 기준본으로 조건부 승격. 구현 기준본은 Clean 유지 |
| Clean 애니메이션 반영 | HiFi에 업무 피드백 모션을 선별 이식. 현재는 local motion layer 후보로 진행 |
| 재생성 경로 | Claude Design 재생성은 보류. 로컬 후보는 `build-local-hifi-candidate.mjs`로 재생성 |
| 새 export 보관 | 기존 HTML을 덮어쓰지 않고 `cargo-order-hifi-local-motion-20260616.html` 후보로 병렬 보관 |
| 초기 HTML/variants HTML | archive reference로 옮길지, active 비교본으로 남길지 |
| review-artifacts | active 위치 유지 또는 `_archive` 이동 |
| specs | active 참고본, archive, 또는 `reference-specs` 별도 보관 중 선택 |
