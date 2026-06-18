# HiFi Promotion Review - 2026-06-16

## 목적

신규 HiFi 결과물 `results/html/화물 오더 접수수정 (오프라인).html`을 기준본으로 승격할 수 있는지 검토한다.

이번 검토는 사용자의 우선순위 변경을 반영해 `cargo-list` 기획 착수보다 먼저 수행한다. 결론은 전면 승격이 아니라 `시각 고도화 기준본`으로 조건부 승격하는 것이다.

## 검토 대상

| 대상 | 역할 | 현재 판정 |
| --- | --- | --- |
| `results/html/화물 오더 접수수정 (오프라인).html` | 신규 HiFi 결과물 | 시각 기준본으로 조건부 승격 |
| `results/wireframe/order-register-new2.0/Cargo Order Wireframe B Original Tone.html` | 기획 통합 기준 | 구조/필드 기준 유지 |
| `results/wireframe/order-register-new2.0/Cargo Order B Implementation Clean.html` | 구현/동작 기준 | interaction/data hook 기준 유지 |
| `sections/*` | 섹션별 상세 기획 | 업무 규칙 기준 유지 |
| `sections/cargo-list` | 하단 목록 기획 | 후순위 보류 |

## 정적 분석 결과

브라우저 자동 DOM 점검은 현재 `file://` URL 정책상 사용할 수 없어서, 로컬 HTML 내부 `__bundler/template`을 추출해 정적 분석했다.

| 항목 | HiFi | Clean | B Original Tone | 판단 |
| --- | ---: | ---: | ---: | --- |
| 내부 template 크기 | 약 94 KB | 약 250 KB | 약 260 KB | HiFi는 시각 압축본 성격 |
| 5개 입력 섹션 순서 | 확인 | 확인 | 확인 | 통과 |
| `오더 목록` | placeholder 있음 | 없음 | 하단 목록 있음 | HiFi는 목록 실기획 아님 |
| `화물 목록` 문자열 | 0 | 0 | 2 | cargo-list는 후순위로 유지 |
| 전역 액션 | 일부 확인 | 입력 섹션 중심 | 기존 업무 액션 포함 | 부분 통과 |
| `data-b-*` hook | 0 | 471 | 464 | 구현 기준 승격 불가 |
| `data-route-*` hook | 0 | 44 | 51 | 구현 기준 승격 불가 |
| `data-summary-*` hook | 0 | 10 | 10 | 구현 기준 승격 불가 |
| `data-preview-*` hook | 0 | 17 | 17 | 구현 기준 승격 불가 |
| `role="dialog"` | 0 | 6 | 6 | 접근성/동작 계약 재검토 필요 |
| `aria-modal` | 1 | 6 | 6 | 부분 통과 |
| `role="tablist"` | 0 | 1 | 1 | 차주 Phase 탭 계약 재검토 필요 |
| `aria-live` | 2 | 4 | 4 | 부분 통과 |

## 승격 판정

| 기준 | 판정 | 근거 |
| --- | --- | --- |
| 시각 디자인 기준본 | 조건부 승격 | shadcn 계열 토큰, Pretendard, 섹션 헤더, 전문 업무 화면 톤이 반영됨 |
| 정보 구조 기준본 | 부분 승격 | 5개 입력 섹션 순서는 유지하나 `cargo-list`는 placeholder |
| 구현 기준본 | 보류 | Clean/B Original Tone의 `data-*` hook과 dialog semantics가 보존되지 않음 |
| 전체 화면 기준본 | 보류 | 하단 목록, 계산서/서명확인 등 일부 후속 액션이 별도 확인 필요 |
| 접수/수정 기획 기준 | 참고 기준으로 사용 | 전역 액션바와 입력 섹션 고도화 방향은 참고 가능 |

## 조건부 승격 범위

HiFi를 아래 범위의 기준본으로 사용한다.

| 범위 | 사용 방식 |
| --- | --- |
| 시각 톤 | 최종 고도화 방향. 손글씨/종이 톤 대신 차분한 전문 업무 UI |
| 디자인 토큰 | Pretendard, shadcn식 neutral/brand/status 토큰 참고 |
| 섹션 헤더 | 번호 + 제목 + 보조 설명 구조 참고 |
| 전역 액션 그룹 | 기본/위험/출력 그룹 분리 방향 참고 |
| 접수/수정 섹션 다듬기 | 신규 접수, 등록, 수정, 복사, 취소, 배차취소, 정산 처리 흐름의 시각 기준으로 참고 |

아래 범위는 계속 기존 기준을 사용한다.

| 범위 | 기준 |
| --- | --- |
| 필드 누락 검증 | `sections/*`, `02-field-inventory.md` |
| interaction/data hook | `Cargo Order B Implementation Clean.html` |
| B 통합 구조 | `Cargo Order Wireframe B Original Tone.html` |
| 화물맨 상태 머신 | `sections/driver-info` |
| 금액 계산 규칙 | `sections/cargo-transport` |
| 하단 화물 목록 | `sections/cargo-list` 후속 기획 |

## 접수/수정 섹션 보강 방향

다음 기획은 `cargo-list`가 아니라 상단 입력/수정 업무면과 전역 액션바를 먼저 다듬는다.

| 영역 | 보강할 내용 |
| --- | --- |
| 화면 상태 | 신규 접수, 등록 대기, 수정 모드, 저장 완료, 저장 실패, dirty state |
| 전역 액션 | 신규 접수, 화물 등록, 화물 수정, 화물 복사, 조회, 화물 취소, 배차 취소, 정산 처리, 출력 |
| 위험 액션 | 화물 취소, 배차 취소, 정산 처리는 confirm dialog와 사유/영향 요약 필요 |
| 후속 액션 | 계산서, 인수증, 서명확인, 위탁증은 원본 기능 보존 여부 재확인 |
| 키보드 흐름 | `F3` 신규 접수, Enter 저장, Esc 취소 등 단축키 정책 정리 |
| 상태 연결 | 선택된 오더 ID, 접수/완료/취소 상태, 화물맨 연동 상태를 헤더와 액션바에 연결 |
| 저장 검증 | 필수/조건부 필수, 금액 계산, 주소/차주/화주 적용 상태를 저장 전 점검 |

## 남은 확인

| 항목 | 수준 | 다음 액션 |
| --- | --- | --- |
| 브라우저 시각 QA | medium | 수동 또는 허용된 브라우저 환경에서 실제 화면 캡처 확인 |
| HiFi의 dialog semantics | high | `role="dialog"`, `role="tablist"`, focus trap 여부 보강 필요 |
| Clean hook 보존 | high | 실제 구현 단계에서는 HiFi 스타일을 Clean 구조에 이식하는 방식 권장 |
| cargo-list | medium | 지금은 보류. 접수/수정 섹션 정리 후 착수 |
| 후속 액션 누락 | medium | 계산서, 서명확인, 차주송금 거절정보 등 원본 액션 재매핑 필요 |

## 결론

신규 HiFi는 `시각 고도화 기준본`으로 조건부 승격한다. 다만 `전체 구현 기준본` 또는 `유일한 source of truth`로 승격하지 않는다.

다음 단계는 HiFi의 시각 언어를 기준으로 `접수/수정 섹션`의 상태, 전역 액션바, 저장/수정/취소 흐름을 문서화하는 것이다.
