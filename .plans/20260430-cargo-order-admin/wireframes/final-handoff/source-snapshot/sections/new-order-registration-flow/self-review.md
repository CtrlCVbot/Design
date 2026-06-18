# Self Review - 신규 접수 플로우 기획 문서

## 검토 범위

`sections\new-order-registration-flow` 하위 문서가 요청한 신규 접수 플로우를 기획 문서로 정리하고, 이후 생성된 HiFi HTML 후보가 같은 기획 기준을 따르는지 검토했다.

초기 기획 기준 화면은 `results\html\cargo-order-hifi-local-motion-20260616.html`이다. 현재 HiFi 구현 후보는 `results\html\cargo-order-hifi-reservation-tabs-shadcn-20260616.html`를 복사한 뒤 신규 접수 플로우 레이어를 주입해 생성한 `new-order-registration-flow-hifi-20260617.html`이다.

## 완료 확인

| 항목 | 상태 | 근거 |
| --- | --- | --- |
| 문서 위치 | 완료 | `sections\new-order-registration-flow` 하위에 문서 작성 |
| 신규 접수/화물 수정 분기 | 완료 | `01`, `04`, `05`에서 `idle-edit`과 신규 접수 상태 분리 |
| 섹션 헤더 정책 | 완료 | `02`에서 명세서형 보기와 신규 접수 안내형 헤더 기준 정의 |
| 최초 focus와 motion | 완료 | `03`에서 focus 대상, motion 추천, reduced motion 대응 정의 |
| wizard 단계 | 완료 | `04`에서 단계, 완료 조건, footer 정책 정의 |
| 금액 후 분기 | 완료 | `01`, `04`, `06`에서 `화물 등록 완료` / `차주 정보로 이동` 명시 |
| `화물 등록 완료` 의미 정정 | 완료 | API 저장이 아니라 메인 화면 데이터 적용으로 정리 |
| 메인 `화물 등록` CTA | 완료 | `07`에서 버튼 노출과 attention UI/UX 제안 작성 |
| 메인 `화물 등록` API 정책 | 완료 | `08`에서 validation, loading, 실패, 재시도, 중복 방지 정책 확정 |
| 오더 요약 표현 정책 | 완료 | `01`, `02`, `06`에서 입력 단계 번호가 아닌 회색 `확인` 배지 예외로 정리 |
| 기본 화면 필수 입력 강조 | 완료 | `03`, `05`, `06`에서 좌측 상태 바와 10초 reminder motion 정책 반영 |
| 차주 정보 선택 사항 | 완료 | `04`, `06`에서 건너뛰기와 선택 완료 모두 허용 |
| acceptance criteria | 완료 | `06`에서 구현 가능한 검증 기준 작성 |

## 피드백 반영 결과

| 항목 | Impact | Reach | Recovery | Total | Severity | Confidence | Action | 메모 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 신규 접수와 화물 수정 UI가 섞일 위험 | 3 | 2 | 1 | 6 | high | confirmed | auto-fixed | `idle-edit`, `new-submitted`에서는 wizard/패널/헤더 숨김으로 명시 |
| 화물 조회/수정 화면에서 라벨이 이중으로 보일 위험 | 2 | 3 | 1 | 6 | high | confirmed | auto-fixed | 명세서형 보기에서는 번호형 섹션 헤더 숨김으로 명시 |
| 금액 완료 후 다음 행동이 모호할 위험 | 3 | 2 | 1 | 6 | high | confirmed | auto-fixed | 금액 마지막 다이얼로그에서 두 선택지를 명시 |
| `화물 등록 완료`가 API 저장으로 오해될 위험 | 3 | 2 | 1 | 6 | high | confirmed | auto-fixed | 메인 화면 데이터 적용으로 의미 정정 |
| 메인 `화물 등록` 버튼 발견성이 낮을 위험 | 2 | 2 | 1 | 5 | high | likely | auto-fixed | CTA reveal, focus ring, glow pulse, sticky 대안을 제안 |
| attention motion이 과해질 위험 | 1 | 2 | 0 | 3 | medium | likely | auto-fixed | shake 금지, 시작 motion 2회 이하, reminder는 10초 간격 1회로 제한, reduced motion 대응을 AC에 포함 |
| 실제 API 버튼 정책이 미정인 위험 | 2 | 2 | 1 | 5 | high | confirmed | auto-fixed | `08`에 submit 상태, validation, 재시도, 중복 방지 정책 반영 |
| 오더 요약이 독립 블록처럼 분리되어 보일 위험 | 2 | 2 | 0 | 4 | medium | confirmed | auto-fixed | 기존 섹션 디자인 유지, 신규 접수 중에는 회색 `확인` 배지만 사용하도록 명시 |
| 기본 화면에서 필수 입력 위치를 놓칠 위험 | 2 | 2 | 0 | 4 | medium | confirmed | auto-fixed | 빈 필수 행 좌측 상태 바와 입력 버튼 reminder 정책 추가 |
| reminder motion이 과해질 위험 | 1 | 2 | 0 | 3 | medium | likely | auto-fixed | 최초 2회 후 10초 간격 1회 reminder, 클릭/입력/행 제거 시 중단으로 제한 |
| endpoint/payload 연결이 남은 위험 | 2 | 2 | 1 | 5 | high | likely | queued | 실제 API endpoint, payload schema, 서버 validation code 매핑 필요 |
| 신규 접수 취소 시 입력값 처리 불명확 | 2 | 2 | 1 | 5 | high | likely | queued | 취소 정책을 확인 필요 항목으로 남김 |

## 검증 결과

| 검증 | 결과 | 메모 |
| --- | --- | --- |
| 문서가 `sections` 하위에 정리됨 | 통과 | 새 폴더 `new-order-registration-flow` 생성 |
| 신규 접수와 화물 수정 흐름 충돌 방지 | 통과 | 상태와 다이얼로그 정책 분리 |
| 기본 상태 헤더 숨김 | 통과 | `idle-edit`는 명세서형 보기로 정의 |
| 신규 접수 시 헤더 표시 | 통과 | `new-reset`부터 `new-driver-optional`까지 번호형 안내 헤더 표시 |
| 라벨 중복 의도 반영 | 통과 | 화물 조회/수정에서는 본문 라벨과 값 중심으로 보이도록 정의 |
| 오더 요약 표현 | 통과 | 입력 단계 번호 대신 회색 `확인` 배지 예외와 기존 섹션 디자인 유지 기준 추가 |
| 기본 화면 필수 입력 강조 | 통과 | 상태 바, 최초 2회 pulse, 10초 간격 1회 reminder, reduced motion 대응 기준 추가 |
| 금액 후 분기 명확성 | 통과 | `화물 등록 완료`와 `차주 정보로 이동` 분리 |
| API 저장 의미 충돌 방지 | 통과 | `화물 등록 완료`는 네트워크 요청 없는 메인 화면 적용으로 정정 |
| 메인 `화물 등록` 버튼 제안 | 통과 | `07-main-submit-cta-visibility.md` 추가 |
| 메인 `화물 등록` API 정책 | 통과 | `08-main-submit-api-policy.md` 추가 |
| 구현 가능한 acceptance criteria | 통과 | 상태, 화면, motion, 충돌 방지 기준 작성 |

## 남은 리스크

| 항목 | 수준 | 대응 |
| --- | --- | --- |
| 실제 API endpoint 미연결 | high | 기획 완료 후 후속 개발 착수 전까지 보류 |
| payload schema 미확정 | high | 메인 화면 최신 데이터와 request field 매핑 필요 |
| 서버 validation code 매핑 미확정 | medium | 서버 오류를 필드/섹션에 표시하는 규칙 필요 |
| 신규 접수 취소 정책 미확정 | high | 입력값 폐기/유지/임시 저장 중 선택 필요 |
| validation 세부 규칙 미확정 | medium | 운영 필수값과 문구를 실제 정책으로 보강 필요 |
| 모바일 헤더 표시 QA 미정 | medium | 좁은 화면에서 명세서형 보기/안내형 헤더 전환 확인 필요 |
| 차주 단계의 화물맨 연동 범위 미확정 | medium | 선택 단계에서 내부 DB만 다룰지 외부 연동까지 포함할지 결정 필요 |

## 의도적 차이

- 구현 코드는 수정하지 않았다.
- 현재 HTML의 `.sec-head` 구조가 항상 존재하더라도, 문서는 상태 기반 표시/숨김 정책으로만 정의했다.
- 차주 정보는 필수 입력에서 제외했다.
- 프로세스 패널은 신규 접수 wizard 전용으로 제한했다.
- `화물 등록 완료`는 API 저장이 아니라 메인 화면 적용 동작으로 정의했다.
- 실제 API 통신은 메인 `화물 등록` 버튼에서만 발생하도록 정의했다.

## 다음 단계

1. 신규 접수 플로우 기획은 현재 문서 기준으로 완료 상태로 둔다.
2. 실제 API endpoint와 payload schema 연결은 후속 개발 착수 전까지 보류한다.
3. 실제 개발 착수 시점에 `06-acceptance-criteria.md`를 기준으로 구현 작업 단위를 분리한다.
4. 구현 전 validation 필수값과 오류 문구를 운영 정책에 맞춰 보강한다.

## 2026-06-17 HiFi HTML 후보 검토

| 항목 | 상태 | 메모 |
| --- | --- | --- |
| HiFi 후보 산출물 | 완료 | `new-order-registration-flow-hifi-20260617.html` 생성 |
| 재생성 스크립트 | 완료 | `build-new-order-registration-flow-html.mjs` 생성 |
| 명세서형 보기 | 통과 | 초기 `idle-edit`에서 번호형 섹션 헤더 숨김 |
| 신규 접수 안내형 보기 | 통과 | `new-reset`에서 번호형 섹션 헤더 표시, 화주 정보 focus |
| wizard 패널 | 통과 | 최초 입력 다이얼로그에 왼쪽 프로세스 패널 표시 |
| 메인 적용 | 통과 | `화물 등록 완료` 후 `new-submitted`, 헤더 숨김, 메인 `화물 등록` 버튼 표시 |
| 최종 등록 CTA | 통과 | `submit-validating` 후 `submit-complete`, `idempotencyKey` 생성 |
| 오더 요약 | 통과 | 기존 섹션 디자인으로 복귀, 신규 접수 안내형 보기에서만 회색 `확인` 배지 사용 |
| 기본 화면 필수 입력 강조 | 통과 | 빈 필수 행 좌측 상태 바, 입력 버튼 최초 2회 pulse, 10초 reminder 구현 |

| 항목 | Impact | Reach | Recovery | Total | Severity | Confidence | Action | 메모 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 원본 HTML의 `document.write` 구조로 정적 style이 사라지는 문제 | 2 | 2 | 1 | 5 | high | confirmed | auto-fixed | 런타임 style 주입으로 보정 |
| CTA 문구 변경 후 버튼 재탐색 실패 | 2 | 2 | 1 | 5 | high | confirmed | auto-fixed | `.new-order-main-submit` 클래스 기준으로 추적 |
| 필수 입력 reminder timer가 DOM 제거 후 남을 위험 | 2 | 2 | 1 | 5 | high | likely | auto-fixed | 버튼별 timer를 `WeakMap`으로 관리하고 클릭/행 제거 시 정리 |

## 2026-06-17 관련 문서 재점검 결과

| 문서 | 점검 결과 | 보완 내용 |
| --- | --- | --- |
| `README.md` | 보완 완료 | HiFi 후보 기준, 오더 요약 예외, 기본 화면 필수 입력 강조 추가 |
| `01-new-order-flow-overview.md` | 보완 완료 | 오더 요약 위치/표현과 기본 화면 필수 입력 보조 정책 추가 |
| `02-section-header-visibility.md` | 보완 완료 | 오더 요약은 확인용 섹션이며 회색 `확인` 배지를 사용하도록 확정 |
| `03-first-focus-and-motion.md` | 보완 완료 | 기본 화면 좌측 상태 바와 10초 reminder motion 정책 추가 |
| `05-state-and-interaction-matrix.md` | 보완 완료 | 상태별 빈 필수 입력 강조 적용 여부 추가 |
| `06-acceptance-criteria.md` | 보완 완료 | 오더 요약, 기본 화면 필수 입력 강조, reminder 중단 조건 AC 추가 |

전체 개요, 헤더 정책, motion 정책, 상태 매트릭스, acceptance criteria의 누락 항목을 보완했다.

## 2026-06-17 최종 기획 정합성 리뷰

| 점검 항목 | 결과 | 메모 |
| --- | --- | --- |
| 문서 범위 | 통과 | 유지 문서는 `README`, `01~08`, `self-review`, HiFi 후보와 재생성 스크립트로 정리 |
| 상태 모델 | 통과 | `idle-edit`부터 `new-submitted`, `submit-*` 상태까지 문서 간 의미 일치 |
| 신규 접수/화물 수정 분기 | 통과 | 신규 접수는 wizard, 기존 수정과 등록 후 개별 수정은 독립 다이얼로그로 분리 |
| 섹션 헤더 정책 | 통과 | 명세서형 보기에서는 숨김, 신규 접수 안내형 보기에서만 표시 |
| 오더 요약 예외 | 통과 | 입력 단계 번호가 아니라 회색 `확인` 배지를 쓰는 확인용 섹션으로 정리 |
| 금액 후 분기 | 통과 | `화물 등록 완료`는 메인 화면 적용, `차주 정보로 이동`은 선택 단계 진입으로 분리 |
| API 책임 분리 | 통과 | wizard의 `화물 등록 완료`에서는 API 통신 없음. 실제 통신은 메인 `화물 등록` 버튼만 담당 |
| motion 정책 | 통과 | shake 금지, 시작 motion 2회 이하, 기본 화면 reminder는 10초 간격 1회, reduced motion 대응 |
| 구현 ticket 문서 정리 | 통과 | 현재 단계가 기획 범위이므로 구현 ticket 문서와 관련 참조 제거. 삭제 로그만 유지 |
| 확인 필요 정책 | 보류 유지 | 실제 API endpoint와 payload schema는 후속 개발 착수 전까지 보류 |

## 2026-06-17 작업 범위 조정 로그

| 항목 | 처리 | 메모 |
| --- | --- | --- |
| 구현 ticket 문서 | 삭제 | 현재 단계는 기획까지만 진행하므로 `implementation-tickets` 폴더 제거 |
| 헤더 구현 ticket 문서 | 삭제 | `09-header-policy-implementation-ticket.md`는 구현 ticket 성격이 강해 제거 |
| 작업 로그 | 유지 | 구현 ticket 분리 시도는 본 로그에만 남김 |
| 후속 분리 | 보류 | 실제 개발 착수 시점에 별도 구현 작업 단위로 다시 분리 |

현재 유지 범위는 신규 접수 플로우 기획 문서, acceptance criteria, HiFi HTML 후보, 재생성 스크립트다.

## 2026-06-17 기획 마감 로그

| 항목 | 상태 | 메모 |
| --- | --- | --- |
| 신규 접수 플로우 기획 | 완료 | `README`, `01~08`, `self-review` 기준 |
| 실제 API endpoint 연결 | 보류 유지 | 기획 범위에서는 확정하지 않음 |
| 구현 작업 단위 분리 | 보류 유지 | 실제 개발 착수 시점에 별도 진행 |

### 기획 후 남은 리스크

| 항목 | 수준 | 대응 |
| --- | --- | --- |
| 실제 API endpoint 미연결 | high | 후속 개발 착수 전까지 보류 |
| 모바일 시각 QA | medium | desktop viewport 검증 완료, mobile은 별도 확인 필요 |
| 실제 서버 validation code 매핑 | medium | 정책 문서 기준으로 후속 연결 필요 |
