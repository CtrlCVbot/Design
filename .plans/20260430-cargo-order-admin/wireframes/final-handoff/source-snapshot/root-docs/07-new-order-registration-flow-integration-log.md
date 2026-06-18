# 07. 신규 접수 플로우 최종 반영 로그

## 목적

이 문서는 `sections/new-order-registration-flow`에서 확정한 신규 접수 플로우 기획을 최종 기획 결과물에 반영한 내역을 기록한다.

반영 범위는 기획 문서와 HiFi 후보 결과물 연결까지다. 실제 API endpoint, payload schema, 서버 validation code 확정은 후속 개발 착수 전까지 보류한다.

## 반영 기준

| 항목 | 위치 | 상태 |
| --- | --- | --- |
| 신규 접수 플로우 상세 기획 | `sections/new-order-registration-flow/` | 완료 |
| 섹션 원본 HTML 후보 | `sections/new-order-registration-flow/new-order-registration-flow-hifi-20260617.html` | 완료 |
| flow 후보 HTML | `results/html/new-order-registration-flow-hifi-20260617.html` | master 반영 전 단계 후보 |
| API endpoint 연결 | `sections/new-order-registration-flow/08-main-submit-api-policy.md` | 보류 |

## 반영 결과 요약

| 영역 | 반영 내용 |
| --- | --- |
| 결과 HTML | 섹션 폴더의 HiFi 후보를 `results/html` 하위 flow 후보로 복사 |
| 최상위 안내 | `README.md`에 신규 접수 플로우 문서와 결과 HTML 위치 추가 |
| 화면 맵 | `01-screen-map.md`에 `신규(F3)` 이후 상태 흐름 추가 |
| 와이어프레임 | `03-wireframe.md`에 wizard, 금액 후 분기, 메인 `화물등록` CTA 정책 반영 |
| 현대화 브리프 | `04-modernization-brief.md`에 명세서형 보기, 섹션 헤더, motion/reduced motion 기준 추가 |
| Self-review | `05-self-review.md`에 반영 결과와 API endpoint 보류 리스크 추가 |
| Handoff | 당시 루트 `06-claude-design-handoff.md`에 신규 접수 플로우 인계 요약 추가. 이후 해당 기록은 `_archive/legacy-prompts/claude-design-v1/06-claude-design-handoff.md`로 이동 |
| 접수/수정 섹션 | `sections/order-entry-edit`의 예전 신규 상태명을 최종 상태명 기준으로 보정 |

## 반영 파일 상세

| 파일 | 반영 내용 | 판정 |
| --- | --- | --- |
| `README.md` | 신규 접수 플로우 상세 문서, flow 후보 HTML, API endpoint 보류 상태 추가 | 완료 |
| `01-screen-map.md` | `new-reset`, `new-wizard-active`, `new-required-complete`, `new-driver-optional`, `new-submitted` 흐름 추가 | 완료 |
| `03-wireframe.md` | 기존 단순 입력 흐름을 신규 접수 wizard 흐름으로 보완 | 완료 |
| `04-modernization-brief.md` | 신규 접수 전용 UX 기준과 attention motion 기준 추가 | 완료 |
| `05-self-review.md` | 최종 반영 결과, 남은 보류 리스크, 결과 HTML 반영 내역 추가 | 완료 |
| `_archive/legacy-prompts/claude-design-v1/06-claude-design-handoff.md` | 디자인/후속 작업자가 따라야 할 신규 접수 인계 기준 기록 보존 | 완료 |
| `results/html/README.md` | `new-order-registration-flow-hifi-20260617.html`을 `flow-candidate`로 등록 | 완료 |
| `sections/order-entry-edit/README.md` | 신규 접수 상태 기준은 `new-order-registration-flow`를 source of truth로 사용하도록 명시 | 완료 |
| `sections/order-entry-edit/01-entry-edit-refinement-plan.md` | `new-empty`, `new-draft`, `register-ready` 초안을 최종 상태명으로 보정 | 완료 |
| `sections/order-entry-edit/self-review.md` | 상태명 충돌 보정과 API endpoint 보류 로그 추가 | 완료 |

## 확정된 핵심 정책

| 정책 | 최종 기준 |
| --- | --- |
| 신규 접수 시작 | `신규(F3)` 클릭 시 전체 입력 상태 초기화 후 `new-reset` 진입 |
| 최초 입력 | wizard 다이얼로그로 진행 |
| 왼쪽 프로세스 패널 | 신규 접수 wizard에서만 표시 |
| 섹션 헤더 | 신규 접수 안내형 상태에서만 표시 |
| 기본/수정/등록 완료 화면 | 섹션 헤더를 숨기고 명세서형 보기 유지 |
| 오더 요약 | 입력 단계가 아니라 확인용 섹션. 신규 접수 안내형 보기에서만 회색 `확인` 배지 사용 |
| 금액 후 분기 | `화물 등록 완료` 또는 `차주 정보로 이동` 제공 |
| `화물 등록 완료` 의미 | API 저장이 아니라 wizard 데이터를 메인 화면에 적용하는 동작 |
| 메인 `화물등록` 버튼 | `new-submitted` 이후 실제 API 통신을 시작하는 최종 CTA |
| 차주 정보 | 선택 사항. 선택 또는 건너뛰기 모두 허용 |
| 개별 수정 | `new-submitted` 이후에도 wizard를 재개하지 않고 독립 다이얼로그 사용 |

## 보류 유지 항목

| 항목 | 상태 | 이유 |
| --- | --- | --- |
| 실제 API endpoint | 보류 | 후속 개발 착수 전까지 확정하지 않음 |
| payload schema | 보류 | 메인 화면 최신 데이터와 request field 매핑 필요 |
| 서버 validation code | 보류 | 필드/섹션 오류 표시 규칙과 연결 필요 |
| 신규 접수 취소 정책 | 보류 | 입력값 폐기/유지/임시 저장 중 결정 필요 |

## 검증 로그

| 검증 | 결과 | 메모 |
| --- | --- | --- |
| 결과 HTML 복사 | 통과 | `results/html/new-order-registration-flow-hifi-20260617.html` 생성 |
| 원본/결과 HTML 해시 | 통과 | SHA256 일치 |
| 최상위 문서 참조 | 통과 | `README.md`, `results/html/README.md`에서 결과 HTML 참조. 1차 handoff 기록은 archive에 보존 |
| 상태 흐름 참조 | 통과 | `01-screen-map.md`, `03-wireframe.md`, `sections/order-entry-edit`에 최종 상태명 반영 |
| API endpoint 보류 | 통과 | 확정값 없이 보류 상태로 유지 |

## 다음 단계

현재 기획 반영은 완료 상태다.

실제 개발 착수 시점에는 `sections/new-order-registration-flow/06-acceptance-criteria.md`를 기준으로 구현 작업 단위를 분리하고, 그 전에 API endpoint, payload schema, 서버 validation code를 확정한다.
