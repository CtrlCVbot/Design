# Cleanup Candidates: 운송구간 D안 1차 정리

## 목적

D `compact-hybrid`를 운송구간 1차 기준안으로 정리하면서, 나중에 삭제하거나 아카이브할 수 있는 후보 파일을 먼저 목록화한다.

이번 단계에서는 추가 파일 삭제를 실행하지 않는다. 삭제는 전체 `Cargo Order Wireframe B Original Tone.html` 통합 후, 사용자가 별도로 승인할 때만 진행한다.

참고로 B 통합본의 HTML 내부에서는 기존 5번 `배차 유형`, 6번 `상차 조건`, 7번 `하차 조건` 섹션을 제거하고 1번 `운송 구간`으로 병합했다. 이는 파일 삭제가 아니라 화면 내부 섹션 정리다.

## 현재 삭제 완료

| 파일 | 상태 | 메모 |
| --- | --- | --- |
| `transport-route-section.html` | 삭제 완료 | 기존 단독 카드형 HTML. 비교 기준은 `transport-route-section-variants.html`과 `transport-route-d-workflow.html`로 통합됨 |

## 삭제 후보

| 우선순위 | 파일 | 현재 역할 | 삭제 조건 | 권장 액션 |
| --- | --- | --- | --- | --- |
| P1 | `review-artifacts/transport-route-desktop.png` | 삭제된 `transport-route-section.html`의 데스크톱 검증 캡처 | D안 통합 후 과거 단독 HTML 증빙이 필요 없을 때 | 삭제 후보 |
| P1 | `review-artifacts/transport-route-mobile.png` | 삭제된 `transport-route-section.html`의 모바일 검증 캡처 | D안 통합 후 과거 단독 HTML 증빙이 필요 없을 때 | 삭제 후보 |
| P2 | `transport-route-section-variants.html` | A/B/C/D 비교 HTML | D안이 최종 기본안으로 확정되고 비교안 보존이 필요 없을 때 | 삭제 또는 archive 후보 |
| P2 | `review-artifacts/transport-route-desktop-variants.png` | A/B/C/D 비교 HTML 데스크톱 캡처 | variants HTML을 삭제하거나 archive할 때 | 함께 정리 후보 |
| P2 | `review-artifacts/transport-route-mobile-variants.png` | A/B/C/D 비교 HTML 모바일 캡처 | variants HTML을 삭제하거나 archive할 때 | 함께 정리 후보 |

## 보존 권장

| 파일 | 이유 |
| --- | --- |
| `transport-route-d-workflow.html` | D안 1차 기준안의 닫힘/열림/워크플로우 기준 파일 |
| `review-artifacts/transport-route-d-workflow-desktop.png` | D안 데스크톱 검증 증빙 |
| `review-artifacts/transport-route-d-workflow-mobile.png` | D안 모바일 검증 증빙 |
| `review-artifacts/source-compare-wireframe-original.png` | 원본 `Cargo Order Wireframe.html` 비교 증빙 |
| `review-artifacts/source-compare-b-original-tone.png` | B 원본 톤 비교 증빙 |
| `review-artifacts/source-compare-transport-variants.png` | source comparison review 작성 당시 비교 증빙 |

## 삭제 전 확인 조건

1. D안이 전체 `Cargo Order Wireframe B Original Tone.html`에 통합되어야 한다. 현재 full-width 병합까지 1차 반영 완료.
2. A/B/C 비교안이 더 이상 의사결정에 필요 없는지 확인해야 한다.
3. `07-cleanup-candidates.md`의 삭제 후보를 사용자에게 다시 확인받아야 한다.
4. 삭제 전 `README.md`, `self-review.md`, `06-source-comparison-review.md`에서 해당 파일 참조가 남아 있는지 확인해야 한다.
