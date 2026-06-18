# 신규 접수 플로우 기획 문서

## 목적

`신규 접수` 버튼 클릭 이후 시작되는 신규 오더 등록 흐름을 문서화한다.

이번 문서는 신규 접수 전용 상태, 섹션 헤더 표시 정책, wizard 다이얼로그, 필수 입력 완료 후 분기, 차주 정보 선택 흐름을 기획 기준으로 정리한다.

2026-06-17 기준으로는 동일 폴더에 HiFi HTML 후보와 재생성 스크립트도 함께 둔다. 따라서 문서는 기획 기준이면서, 현재 구현 후보가 기획을 벗어나지 않았는지 확인하는 기준 문서 역할도 한다.

## 현재 상태

| 항목 | 상태 |
| --- | --- |
| 신규 접수 플로우 기획 | 완료 |
| HiFi 후보 정합성 리뷰 | 완료 |
| 실제 API endpoint 연결 | 보류 |
| 구현 작업 단위 분리 | 실제 개발 착수 시점까지 보류 |

## 기준 화면

| 기준 | 위치 | 메모 |
| --- | --- | --- |
| 프로젝트 | `C:\Work\Dev\Design\.plans\wireframes\cargo-order-admin-20260430` | 문서 작성 기준 폴더 |
| 현재 화면 | `results\html\cargo-order-hifi-local-motion-20260616.html` | HiFi local motion 후보 |
| 현재 구조 단서 | `resetAll()`, `openShipperLookup()`, `openAddrSearch()`, `openCargoInput()`, `openMoneyInput()`, `openDriverLookup()` | 기존 독립 다이얼로그와 초기화 흐름 |
| 현재 섹션 단서 | `sec-shipper`, `sec-route`, `sec-cargo-transport`, `sec-cargo-money`, `sec-summary`, `driver-db`, `hm-panel` | 신규 접수 wizard 단계 매핑 대상 |

## 핵심 결론

| 항목 | 정책 |
| --- | --- |
| 신규 접수 시작 | 모든 섹션을 초기화하고 `new-reset`으로 진입 |
| 최초 focus | 초기화 직후 `화주 정보` 섹션 또는 `화주 정보 입력` 버튼으로 이동 |
| 섹션 헤더 | 신규 접수 상태에서만 표시. 기본/수정/등록 완료 후에는 숨김 |
| 오더 요약 | 입력 단계가 아니라 확인용 섹션이다. 기존 섹션 디자인을 유지하되 신규 접수 안내형 보기에서만 회색 `확인` 배지로 단계 번호와 구분 |
| 기본 화면 필수 입력 강조 | 섹션 헤더가 숨겨진 명세서형 보기에서는 빈 필수 행의 좌측 상태 바와 입력 버튼 reminder motion으로 보완 |
| 최초 입력 | 신규 접수에서는 wizard 다이얼로그로 진행 |
| 필수 완료 기준 | 금액 단계까지 완료하면 `new-required-complete` |
| 금액 후 분기 | `화물 등록 완료` 또는 `차주 정보로 이동` |
| 차주 정보 | 선택 사항. 입력 시 `new-driver-optional` |
| `화물 등록 완료` 의미 | API 저장이 아니라 wizard 전체 데이터를 메인 화면에 적용하는 동작 |
| 메인 `화물 등록` 버튼 | 데이터 적용 후 실제 API 통신 전 최종 CTA로 표시 |
| 개별 수정 | 데이터 적용 후에는 기존처럼 독립 다이얼로그 사용 |

## 문서 목록

| 문서 | 역할 |
| --- | --- |
| `01-new-order-flow-overview.md` | 전체 흐름, 신규 접수/화물 수정 분기, MVP/후속 범위 |
| `02-section-header-visibility.md` | 섹션 헤더 표시/숨김 정책 |
| `03-first-focus-and-motion.md` | 최초 focus, 신규 접수 시작 motion, 기본 화면 필수 입력 reminder motion |
| `04-dialog-wizard-flow.md` | wizard 단계, 완료 조건, 마지막 금액 분기, 프로세스 패널 |
| `05-state-and-interaction-matrix.md` | 필수 상태 정의와 상태 전환 매트릭스 |
| `06-acceptance-criteria.md` | 구현 가능한 acceptance criteria |
| `07-main-submit-cta-visibility.md` | 메인 화면 `화물 등록` 버튼 노출과 attention UI/UX 제안 |
| `08-main-submit-api-policy.md` | 메인 `화물 등록` 버튼의 실제 API 통신, validation, 중복 방지 정책 |
| `self-review.md` | 자체 검토 결과, 리스크, 확인 필요 사항, 후속 작업 |

## HiFi 후보 산출물

| 파일 | 역할 |
| --- | --- |
| `new-order-registration-flow-hifi-20260617.html` | 신규 접수 플로우 기획을 반영한 HiFi HTML 후보 |
| `build-new-order-registration-flow-html.mjs` | 최신 HiFi HTML을 복사하고 신규 접수 플로우 레이어를 주입하는 재생성 스크립트 |

구현 후보는 `results\html\cargo-order-hifi-reservation-tabs-shadcn-20260616.html`를 기준으로 생성했다.

## 범위

### MVP

- `신규 접수` 클릭 시 전체 입력 상태 초기화
- 신규 접수 상태에서만 섹션 헤더 표시
- `오더 요약`은 기존 섹션 디자인을 유지하고, 신규 접수 안내형 보기에서만 번호 대신 회색 `확인` 배지 사용
- 기본/등록 완료 화면의 빈 필수 입력 행에 좌측 상태 바와 입력 버튼 reminder motion 적용
- 신규 접수 최초 입력을 wizard 다이얼로그로 연결
- wizard 단계 순서와 필수 완료 조건 정의
- 금액 완료 후 `화물 등록 완료` / `차주 정보로 이동` 분기 제공
- `화물 등록 완료` 선택 시 API 저장 없이 전체 데이터를 메인 화면에 적용
- 메인 화면에서 실제 API 통신 전 최종 액션인 `화물 등록` 버튼 표시
- 메인 `화물 등록` 버튼에 과하지 않은 attention UI 제공
- 메인 `화물 등록` 버튼 클릭 시 `최종 validation -> 중복 방지 키 생성 -> API 요청 -> 성공/실패 처리` 순서 적용
- API 요청 중 loading/disabled 처리와 실패 후 재시도 정책 정의
- 신규 접수 완료 후 일반 조회/수정 상태로 전환
- 이후 개별 수정은 독립 다이얼로그로 처리

### 후속 확장

- 임시 저장, wizard 재개, 단계별 dirty state
- 필수값 validation 문구와 에러 표시 방식
- 실제 API endpoint, payload schema, 서버 validation code 매핑
- 차주 정보 추천, 화물맨 연동, 내부 DB 검색 고도화
- 모바일 또는 좁은 화면에서 프로세스 패널 축약 방식

## 다음 단계

1. 신규 접수 플로우 기획은 현재 문서 기준으로 완료 상태로 둔다.
2. 실제 API endpoint와 payload schema 연결은 후속 개발 착수 전까지 보류한다.
3. 실제 개발 착수 시점에 `06-acceptance-criteria.md`를 기준으로 구현 작업 단위를 다시 분리한다.
