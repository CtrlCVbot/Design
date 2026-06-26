# Traceability & Review

## 1. 기존 Feature REQ와 MVP REQ 관계

| 기존 Feature REQ | Phase 1 MVP 반영 | 메모 |
| --- | --- | --- |
| `REQ-carowner-dispatch-001` | `REQ-carowner-mvp-001`, `REQ-carowner-mvp-002` | 내 배차 목록과 카드 표시로 구체화 |
| `REQ-carowner-dispatch-002` | `REQ-carowner-mvp-003`, `REQ-carowner-mvp-004` | 배차 상세 진입과 상세 정보 표시로 구체화 |
| `REQ-carowner-status-001` | `REQ-carowner-mvp-005`, `REQ-carowner-mvp-006` | 상차완료 등록과 타임라인 기록 |
| `REQ-carowner-status-002` | `REQ-carowner-mvp-007`, `REQ-carowner-mvp-008`, `REQ-carowner-mvp-009` | 하차완료와 운행완료 권한 차이 명시 |
| `REQ-carowner-settlement-001` | `REQ-carowner-mvp-010`, `REQ-carowner-mvp-011` | 월별/기간 조회와 상태 필터 |
| `REQ-carowner-settlement-002` | `REQ-carowner-mvp-012` | 송금상태, 송금일, 송금금액 중심 |
| `REQ-carowner-issue-001` | `REQ-carowner-mvp-013`, `REQ-carowner-mvp-014`, `REQ-carowner-mvp-015` | 특이사항 보고와 보류 후보 표시 |
| `REQ-carowner-notify-001` | Phase 1 MVP 제외 | 알림 상세는 후속 Phase에서 별도 정의 |

## 2. REQ -> Flow -> Screen 매핑

| MVP REQ | User Story | Flow | Screen | Component |
| --- | --- | --- | --- | --- |
| `REQ-carowner-mvp-001` | `US-carowner-mvp-001` | Flow 1 | `SCR-001` | 하단 탭, 목록 헤더 |
| `REQ-carowner-mvp-002` | `US-carowner-mvp-001` | Flow 1 | `SCR-001` | 배차 카드, 상태 badge |
| `REQ-carowner-mvp-003` | `US-carowner-mvp-002` | Flow 1 | `SCR-001`, `SCR-002` | 배차 카드 |
| `REQ-carowner-mvp-004` | `US-carowner-mvp-002` | Flow 1 | `SCR-002` | 상세 정보 섹션, 상태 타임라인 |
| `REQ-carowner-mvp-005` | `US-carowner-mvp-003` | Flow 2 | `SCR-002`, `SCR-003` | 상차완료 버튼 |
| `REQ-carowner-mvp-006` | `US-carowner-mvp-003` | Flow 2 | `SCR-002` | 상태 타임라인 |
| `REQ-carowner-mvp-007` | `US-carowner-mvp-004` | Flow 3 | `SCR-002`, `SCR-004` | 하차완료 버튼 |
| `REQ-carowner-mvp-008` | `US-carowner-mvp-004` | Flow 3 | `SCR-004`, `SCR-002` | 권한 안내 문구 |
| `REQ-carowner-mvp-009` | `US-carowner-mvp-005` | Flow 3, Flow 4 | `SCR-002`, `SCR-006` | 상태 badge, 정산 안내 |
| `REQ-carowner-mvp-010` | `US-carowner-mvp-006` | Flow 4 | `SCR-005` | 기간 필터 |
| `REQ-carowner-mvp-011` | `US-carowner-mvp-006` | Flow 4 | `SCR-005` | 상태 필터 |
| `REQ-carowner-mvp-012` | `US-carowner-mvp-006` | Flow 4, Flow 4A | `SCR-006` | 정산 정보 블록 |
| `REQ-carowner-mvp-013` | `US-carowner-mvp-007` | Flow 5 | `SCR-002`, `SCR-007` | 특이사항 보고 CTA |
| `REQ-carowner-mvp-014` | `US-carowner-mvp-007` | Flow 5 | `SCR-007` | 메모 입력, 사진 첨부 |
| `REQ-carowner-mvp-015` | `US-carowner-mvp-007` | Flow 5 | `SCR-001`, `SCR-002`, `SCR-005` | 보류 badge |
| `REQ-carowner-mvp-016` | `US-carowner-mvp-002`, `US-carowner-mvp-007` | Flow 1, Flow 4, Flow 4A, Flow 5 | `SCR-002`, `SCR-006`, `SCR-007`, `SCR-008` | 담당자 문의 CTA |
| `REQ-carowner-mvp-017` | `US-carowner-mvp-006` | Flow 4A | `SCR-008` | 정산 홈 요약, 상태별 정산 묶음 |

## 3. 퍼블리싱 반영 검증

| 검증 항목 | 결과 | 근거 |
| --- | --- | --- |
| 최종 HTML | 반영 완료 | `publishing/phase-1-mvp/phase-1-mvp-standalone.html` |
| `SCR-001` 내 배차 목록 | 3차 원본 디자인 유지 | Visual QA 픽셀 차이 `0%` |
| `SCR-005` 운행 내역 | 3차 원본 디자인 유지 | Visual QA 픽셀 차이 `0%` |
| `SCR-006` 정산/송금 상세 | 건별 child screen으로 유지 | 운행 내역 진입 시 하단 활성 탭만 `운행 내역`으로 변경 |
| `SCR-008` 정산 홈 | 하단 `정산` 탭 도착 화면으로 반영 | 원본 `정산상세` 직접 진입을 집계형 홈으로 변경 |
| QA 기록 | 기록 완료 | 공통 화면 픽셀 차이 `0%`, 정산 탭은 `SCR-008` 도착 화면으로 의도 변경 |

## 4. Self-review

| 검토 항목 | 결과 | 메모 |
| --- | --- | --- |
| 완전성 | 통과 | PRD 10개 섹션, 핵심 user flow 6개, 화면 8개, screen map, traceability, 퍼블리싱 반영 검증을 포함했다. |
| 일관성 | 통과 | `05-epic-phase-roadmap.md`의 MVP/Phase 2 경계를 기준으로 하차 확인 고도화 항목은 제외 범위로만 남겼고, 하단 `정산` 탭은 `정산 홈`으로 재정의했다. |
| 실현가능성 | 통과 | API/DB 상세 계약 없이도 화면, 상태, CTA, 문구 기준으로 다음 기획/디자인 작업이 가능하다. |
| 사용자 중심성 | 통과 | 첫 화면을 검색이 아닌 `내 배차 목록`으로 두고, 차주의 현장 액션과 월/기간별 정산 요약 조회 흐름을 우선했다. |
| 남은 리스크 | 확인 필요 | 실제 정산 데이터 확정 단위, 송금 예정일 산정 기준, 보류 금액 포함 기준, 담당자 연락처 마스킹, 상태 변경 위치 수집 여부는 후속 구현 기획에서 결정해야 한다. |

## 5. 피드백 반영 결과

| 항목 | Severity | Confidence | Action | 메모 |
| --- | --- | --- | --- | --- |
| 단일 파일 4개와 31개 세부 파일 사이의 구조 과분리 | medium | confirmed | auto-fixed | 6개 본문 문서와 1개 README로 취합 |
| `05-epic-phase-roadmap.md`의 삭제된 `06~09` 경로 참조 | high | confirmed | auto-fixed | `phase-1-mvp/*` 경로로 갱신 |
| 운행 준비 상태명 혼동 | medium | confirmed | auto-fixed | 기존 상태 표기를 `driver_confirmed`로 재정의하고 표시 문구는 `운행 준비`로 유지 |
| 정산/송금 노출 범위 흔들림 | high | confirmed | auto-fixed | 계좌/메모 노출 표현을 Phase 1 노출 항목에서 제거 |
| REQ/Flow/Screen 추적 부족 | medium | confirmed | auto-fixed | REQ -> Flow -> Screen -> Component 매핑 추가 |
| 하단 정산 탭의 역할 부족 | medium | confirmed | auto-fixed | `REQ-carowner-mvp-017`, Flow 4A, `SCR-008 정산 홈`으로 집계형 정산 진입점 추가 |
