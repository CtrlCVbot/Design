# Self Review - 화물정보 요약

## 리뷰 결과

| 항목 | 상태 | 메모 |
| --- | --- | --- |
| 범위 축소 | 완료 | 화물정보 요약 외 중량, 증빙, 안내문 항목 제거 |
| 디자인 통일 | 완료 | 운송구간/화주 정보와 같은 sheet, row, kind, cell, row-action 구조 반영 |
| HTML 분리 | 완료 | `cargo-summary-docs-section-wireframe.html`에서 요약 row만 확인 가능 |
| B 통합본 반영 | 완료 | `Cargo Order Wireframe B Original Tone.html` 4번 섹션에 요약 row 단독 구조 반영 |
| 문서 정리 | 완료 | PRD, wireframe, user flow, field mapping, integration guide를 요약 전용으로 수정 |
| 데이터 연결 규칙 | 완료 | `06-cargo-transport-summary-data-contract.md`로 3번 원본 필드와 4번 요약 row의 연결 기준 정리 |
| B 통합본 샘플 구현 | 완료 | `품목`, `톤수` 변경 시 요약 자동 갱신, 수동 요약 후 원본 변경 시 `stale` 처리 확인 |
| 브라우저 검증 | 완료 | 상태 전환, 수정 input, overflow, console error 확인 |

## 피드백 분류

| 항목 | Severity | Confidence | Action | 메모 |
| --- | --- | --- | --- | --- |
| 기존 디자인과 톤 불일치 | high | confirmed | auto-fixed | 기존 섹션의 row/card 스타일로 재작성 |
| 요약 외 항목 과다 노출 | high | confirmed | auto-fixed | 중량, 증빙, 안내문, 보조 패널 제거 |
| 자동 요약 생성 규칙 문서화 | medium | confirmed | auto-fixed | `품목`, `실중량`, `톤수`, `차종`, `대수`와 운송구간 조건의 연결 규칙 문서화 |
| 요약 수정 저장 방식 불명확 | medium | confirmed | auto-fixed | 자동 생성값과 사용자 override를 분리하는 정책으로 정리 |
| B 통합본 샘플 미반영 | medium | confirmed | auto-fixed | `Cargo Order Wireframe B Original Tone.html`에 auto 갱신과 stale 처리 샘플 구현 |

## 남은 리스크

| 리스크 | 수준 | 대응 |
| --- | --- | --- |
| 상태 chip 노출 여부 | low | `자동/수정됨/재생성 필요` chip을 실제 row에 보여줄지는 후속 UI 검토에서 결정 |
| 운영 표기 통일 | low | `축차/축카고`, `지금상/당착` 같은 토큰은 운영 용어 확정 필요 |

## 다음 단계

1. `자동/수정됨/재생성 필요` chip을 실제 row에 노출할지 결정합니다.
2. 요약 문장에 쓰는 운영 축약어를 확정합니다.
3. 실제 개발 단계에서 요약 생성 함수와 저장 payload 구조를 확정합니다.
