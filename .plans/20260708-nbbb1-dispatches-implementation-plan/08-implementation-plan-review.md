# 08. nbbb1 /dispatches 구현 기획 리뷰

- 작성일: 2026-07-09
- 리뷰 범위: `.plans/20260708-nbbb1-dispatches-implementation-plan/` 전체 문서 패키지와 기준 자료 `.plans/20260708-nbbb1-dispatches-analysis/`
- 리뷰 목적: 현재 기획 패키지가 다음 구현 세션에서 바로 실행 가능한지, 어떤 결정·검증·계약 보강이 선행돼야 하는지 판단한다.
- 리뷰 결론: **조건부 승인**. 추적성과 범위 분해는 매우 강하지만, Phase 0에서 아래 P0/P1 보강 없이 구현에 들어가면 콕핏 레이아웃 전환, 결정 ID 추적, 검증 재현성, backend 신규 범위에서 재작업 리스크가 크다.

## 1. 리뷰 방식

방법론 라우팅:

| 항목 | 판정 |
|---|---|
| profile | `review-only` + `docs-only` |
| selected_methods | Review-Driven, Risk Scoring, Test Gap Analysis, Docs-as-Code |
| evidence | 기획 패키지 00~07, `_working/` 근거 일부, nbbb1 분석 문서 01/02/04, wireframe HTML 주요 주석 |
| skipped | 코드 구현, 코드 수정, 실제 mm-broker 런타임 재검증 |
| verification | 문서 구조 대조, ID/결정 체계 대조, phase/WP 의존성 검토, 원본 분석과 구현 계획의 경계 확인 |

검토한 핵심 문서:

| 문서 | 리뷰 관점 |
|---|---|
| `README.md` | 패키지 목적, 문서 맵, 핵심 발견, 읽는 순서 |
| `00-document-coverage-checklist.md` | 조사 범위, 기계 검증 주장, NB/IMPL/DEC 정합성 |
| `01-implemented-feature-inventory.md` | Phase 3 구현 자산 상태 판정과 재사용 근거 |
| `02-nbbb1-feature-inventory.md` | 목표 NB 65항목, 불명확 항목 11건 |
| `03-coverage-mapping.md` | NB→IMPL 4분류, IMPL 미배치 자산, 구조적 발견 |
| `04-user-decision-queue.md` | DEC-001~012 결정 큐와 권고안 |
| `05-gap-and-new-planning.md` | 신규기획 17건과 gap/infra 분해 |
| `06-work-packages.md` | WP-001~025 범위, 선행 조건, 완료 기준 |
| `07-phase-roadmap.md` | Phase 0~4 순서, 병렬 축, 결정 지연 영향 |
| `20260708-nbbb1-dispatches-analysis/*` | 원본 목업이 API 없는 클라이언트 목업이라는 전제, UX/디자인 source of truth |

## 2. 총평

이 패키지는 단순 기능 목록이 아니라 **추적 가능한 구현 전환 문서**에 가깝다. NB 65개와 IMPL 429개를 식별자로 묶고, 신규기획 17건을 GAP 8개로 수렴시킨 점은 강점이다. 특히 "dialog 후보 목록을 콕핏 상시 표면으로 끌어올리는 재배치"라는 지배적 패턴을 찾아낸 것은 구현 전략으로 유용하다.

다만 현재 상태는 "구현 착수 가능"이라기보다 **Phase 0 보강 후 착수 가능**이다. 이유는 세 가지다.

1. Phase 0의 WP-001이 전체 구조를 바꾸는 고위험 작업인데, state machine과 visual acceptance contract가 아직 별도 계약으로 고정되지 않았다.
2. 결정 체계가 `DEC-001~012`와 `DEC-{주제}` 14그룹으로 나뉘어 있어, 사용자 승인 기록을 남기지 않으면 이후 세션에서 같은 결정을 다시 해석할 가능성이 높다.
3. "기계 검증 통과" 수치가 문서에는 있지만, 재실행 가능한 검증 스크립트와 산출 로그가 패키지에 남아 있지 않다.

## 3. 주요 강점

| 강점 | 근거 | 구현 가치 |
|---|---|---|
| 기능 범위 추적성 | NB-001~065, IMPL-D#-###, WP-001~025 체계 | 다음 구현자가 "무엇을 어디까지 했나"를 ID로 따라갈 수 있음 |
| 보류·기각 자산과의 충돌 인식 | 04 DEC 큐, 03 구조적 발견, 05 backend 초과 표기 | 예전 Phase 3 결정을 실수로 뒤집을 가능성을 낮춤 |
| 신규기획 원인 수렴 | 05의 GAP-001~008, INFRA-1~4 | 17개 신규항목을 개별 개발하지 않고 공통 인프라로 묶을 수 있음 |
| work package 분해 | 06의 25개 WP와 NB 커버리지 표 | 실행 단위와 완료 기준이 대부분 명확함 |
| phase 병렬성 제시 | 07의 Phase 0~4, 병렬 축, 결정 지연 표 | 의사결정 지연 시 어떤 축이 막히는지 예측 가능 |

## 4. 핵심 리뷰 Findings

Severity는 Impact(영향) + Reach(범위) + Recovery(복구 난이도)를 기준으로 P0/P1/P2로 단순화했다.

| ID | Severity | Finding | 영향 | 권고 |
|---|---|---|---|---|
| F-01 | P0 | WP-001 콕핏 셸은 "결정 불요"로 두기엔 구조 리스크가 크다 | 모든 Phase가 top drawer → 좌측 상시 패널 전환 위에 쌓임 | Phase 0에 `cockpit-shell-contract`를 추가해 상태축, focus/dirty, 반응형, screenshot acceptance를 고정 |
| F-02 | P0 | DEC 체계가 12개 숫자 ID와 14개 주제 ID로 이원화되어 사용자 승인 추적이 어렵다 | 결정 재해석, 승인 누락, WP 선행조건 오판 가능 | `04A-decision-record.md` 또는 04 부록으로 `DEC-001 ↔ DEC-{주제}` crosswalk와 승인 상태를 고정 |
| F-03 | P1 | 기계 검증 결과는 있으나 검증 스크립트·로그가 패키지에 없다 | NB/IMPL/WP 정합성 주장을 다음 세션이 재현하기 어려움 | `_working/verification/verify-plan-coverage.mjs`와 실행 로그를 보존 |
| F-04 | P1 | 원본은 API 없는 클라이언트 목업인데, 구현 계획은 여러 backend 신규 범위를 포함한다 | 목업 기능을 실서비스 요구로 과확장할 위험 | `mock-to-production-gap.md`로 목업-only, 실데이터 가능, 신규 서버 필요를 별도 구분 |
| F-05 | P1 | backend 신규/스키마 변경 항목의 contract-first 산출물이 없다 | DB/API 설계 없이 WP가 착수되면 회귀와 migration 리스크 증가 | INFRA-1~3, GAP-002~004에 API/DB contract, migration/rollback, test plan 추가 |
| F-06 | P1 | visual/design fidelity 완료 기준이 기능 smoke 위주다 | nbbb1의 콕핏형 UX와 디자인 토큰이 구현 중 일반 UI로 재해석될 수 있음 | `visual-acceptance-matrix.md`로 reference screenshot, token, viewport, screenshot diff 기준 추가 |
| F-07 | P1 | privacy/security gate가 여러 곳에 흩어져 있다 | 연락처, 계좌, 채팅, LMS, recent scope, password fallback이 실서비스 신뢰 리스크가 될 수 있음 | Phase 0/2 전에 개인정보·권한·마스킹·감사로그 gate를 한 문서로 통합 |
| F-08 | P1 | 테스트 전략은 WP별로 있으나 phase-level regression gate가 없다 | WP 단위 통과 후 통합 플로우에서 깨질 수 있음 | Phase별 `unit / integration / E2E / visual / accessibility` 검증 표 추가 |
| F-09 | P2 | "한 세션 내 완료 가능한 WP"라는 크기 규칙과 실제 WP 규모가 일부 맞지 않는다 | WP-001, 011, 013, 015, 019, 023은 한 세션 초과 가능성이 큼 | 대형 WP는 `contract`, `data/model`, `UI shell`, `integration` 하위 slice로 분해 |
| F-10 | P2 | 추가 검토 후보 10건이 phase/backlog로 이어지지 않는다 | 좋은 자산이 회의 때만 언급되고 실행 계획에서 사라질 수 있음 | 04 부록 후보를 `optional-backlog.md`로 분리하고 채택 조건/Phase를 부여 |
| F-11 | P2 | 용어 표준화가 아직 부족하다 | `배차중/배차대기`, `운행등록/배차등록`, `기사/차주` 혼용이 상태 모델 구현을 흔들 수 있음 | `terminology-and-status-map.md`를 추가해 표시명, 서버 enum, domain event를 대응 |

## 5. 문서별 상세 리뷰

### 5.1 `00-document-coverage-checklist.md`

좋은 점:

- 문서 661건과 feature package 내부 md 588건을 포함해 조사 범위를 명시했다.
- NB 65/65, IMPL 429/429, 매핑 집계 일치 등 핵심 정합성 검증을 수치화했다.
- "DEC 숫자 ID와 주제형 참조가 이원화되어 있으나 교차 대조 완료"라고 관찰을 남긴 점은 정직하다.

보강 필요:

- Node 검증 스크립트가 패키지에 없다. "통과"라는 결과만 있고, 다음 사람이 같은 방식으로 재실행할 수 없다.
- `phase-3-f3-route-address-candidates`의 깨진 참조(`02-package/03-flow.md` 부재)가 "조사 불가"로만 남아 있다. 경유지·주소 계열은 이번 계획의 핵심이므로, 이 결손이 실제 판정에 미친 영향이 없다는 확인 문장이 필요하다.

권고:

- `_working/verification/` 아래에 검증 스크립트, 실행 명령, 결과 JSON 또는 로그를 보존한다.
- 깨진 참조 항목은 "대체 근거 문서로 충분했는지"를 명시한다.

### 5.2 `01-implemented-feature-inventory.md`

좋은 점:

- closeout 우선, 최신 날짜 우선, 커밋 근거 우선, 코드 검증 override라는 판정 규칙이 명확하다.
- 완료/부분/보류/기각/계획만/미확인 정의가 있어 오래된 planning 문서와 최신 구현 결과를 섞어도 판정 기준을 잃지 않는다.
- D1~D8 도메인별 상태 집계가 이후 03 매핑의 기반으로 잘 작동한다.

보강 필요:

- 429항목 자체는 매우 상세하지만 구현자가 바로 보기에는 너무 크다. 03/06에서 자주 재사용되는 핵심 자산과 위험 자산만 별도 "top implementation anchors"로 뽑아두면 좋다.
- `미확인` 2건이 모두 목록 API 500 계열인데, 로드맵에서는 Phase 0 확인으로만 남는다. 이 이슈는 Phase 2 전체를 막는 병목이므로 별도 preflight issue로 승격하는 편이 안전하다.

권고:

- `01A-implementation-anchor-summary.md`를 추가해 재사용 핵심 자산, 위험 자산, runtime 확인 필요 자산을 한 장으로 요약한다.

### 5.3 `02-nbbb1-feature-inventory.md`

좋은 점:

- 원본 01을 기준 축으로 잡고 02/03은 교차 검증 출처로 병기한 구조가 좋다.
- 불명확 항목 11건을 명시해 목업의 빈칸을 숨기지 않았다.

보강 필요:

- 원본이 API 없는 SPA 목업이라는 사실이 README에는 있지만, NB 항목별로 "목업-only 동작"과 "실서비스 요구로 확정된 동작"이 분리되어 있지 않다.
- `alert()` 검증, 토스트 부재, 페이지네이션 없음처럼 원본의 한계를 개선 대상으로 볼지 fidelity 대상으로 볼지 WP마다 다르게 해석될 수 있다.

권고:

- NB별 `source_kind`를 추가한다: `observed-mock`, `production-required`, `needs-product-decision`, `known-as-is-limit`.
- as-is 한계는 "그대로 따라 하지 않을 항목"으로 별도 acceptance rule을 둔다.

### 5.4 `03-coverage-mapping.md`

좋은 점:

- NB→IMPL과 IMPL→NB 양방향 대조가 이 패키지의 가장 큰 자산이다.
- "수정후이식 36건"의 지배 패턴을 잘 잡았다. 특히 dialog/wizard 내부 자산을 인라인 칩·상시 패널로 표면화한다는 전략은 실행성이 높다.
- 신규기획 17건의 근본 원인을 데이터 소스 부재로 묶은 점이 좋다.

보강 필요:

- `수정후이식` 안에 난이도 차이가 너무 크다. 예를 들어 단순 UI 재배치와 상태 모델 통합, store 2축 확장, 서버 count 설계가 같은 분류에 들어간다.
- 미배치 완료자산 115건 중 채택 후보 10건은 좋지만, 이 후보가 로드맵에 들어갈 기준이 없다.

권고:

- `수정후이식`을 하위 태그로 나눈다: `UI-relocation`, `state-machine`, `data-contract`, `backend-touch`, `policy-gate`.
- 미배치 완료자산은 `adopt-now`, `adopt-later`, `do-not-adopt`로 분류해 선택 부담을 줄인다.

### 5.5 `04-user-decision-queue.md`

좋은 점:

- DEC-001~012의 우선순위와 차단 범위가 분명하다.
- 권고안이 대부분 현실적이다. 특히 대화방을 LMS 1차 + 실시간 채팅 별도 패키지로 분리하는 판단은 범위 폭발을 잘 막는다.

보강 필요:

- 04는 12개 숫자 DEC, 06/07은 14개 주제 DEC를 사용한다. 00에서 정합성을 검증했다고 해도, 사용자 승인 artifact로는 혼란스럽다.
- 각 DEC가 `proposed`, `approved`, `rejected`, `deferred` 중 어디인지 기록하는 상태 칸이 없다.
- 일부 권고안은 실제로는 추가 조사가 필요하다. 예: 운임 통계 scope를 "자사 오더 전체"로 권고하지만, 개인정보·영업정보·거래처별 민감도에 대한 별도 정책 문서가 없다.

권고:

- `04A-decision-record.md`를 만들고 다음 필드를 둔다: `numeric_dec_id`, `topic_dec_id`, `status`, `selected_option`, `owner`, `decided_at`, `unblocks`, `revisit_condition`.

### 5.6 `05-gap-and-new-planning.md`

좋은 점:

- GAP-001~008로 신규기획을 잘 묶었다.
- Phase 3의 backend 무변경 원칙을 넘어서는 항목을 명시한 점이 중요하다.
- INFRA-1~4는 중복 구현을 막는 좋은 축이다.

보강 필요:

- backend 변경이 필요한 GAP-001~007에 API/DB contract 초안이 없다. "무엇이 필요하다"는 있지만 "어떤 request/response/schema/migration으로 갈지"는 아직 없다.
- 원본 nbbb1이 API 없는 목업이라는 점 때문에, AI/위치/채팅 기능은 제품 가치 검증이 먼저 필요하다. 현재는 신규기획 초안이 기능 구현 쪽으로 조금 빠르게 넘어간다.

권고:

- GAP별로 `contract-first` 문서를 추가한다. 최소 필드는 `data source`, `API`, `schema`, `permission`, `test`, `rollback`, `degraded mode`.
- AI/차주 위치/채팅은 바로 구현 WP가 아니라 `spike` 또는 `discovery`로 시작하는 게 안전하다.

### 5.7 `06-work-packages.md`

좋은 점:

- NB 65개가 WP 25개로 빠짐없이 배치되어 있다.
- 선행 조건과 완료 기준이 대부분 검증 가능한 문장이다.
- 결정 불요 WP와 DEC 종속 WP가 구분되어 있어 병렬 실행 계획을 세우기 쉽다.

보강 필요:

- WP-001, WP-011, WP-013, WP-015, WP-019, WP-023은 "한 세션 내 완료 가능"보다 크다. 특히 WP-001은 구조 전환 + store 2축 + dirty/focus + panel collapse를 포함해 사실상 architecture package다.
- WP-008을 Phase 1 결정 불요로 두지만, `GAP-담당자-서버검증`과 `GAP-recent-invalidate`를 포함한다. 이는 작은 보수가 아니라 저장·추천 체인의 신뢰성을 좌우한다.
- WP별 테스트는 있지만, "이 WP가 끝나면 어떤 기존 기능이 회귀하면 안 되는가"가 명확하지 않다.

권고:

- 대형 WP를 하위 slice로 나눈다.
  - WP-001A: shell layout markup/CSS
  - WP-001B: store 2축 state machine
  - WP-001C: dirty/focus/restore contract
  - WP-001D: visual smoke and responsive baseline
- 모든 WP에 `regression targets` 칸을 추가한다.

### 5.8 `07-phase-roadmap.md`

좋은 점:

- Phase 0에 DEC 결정, WP-001, 목록 API preflight를 배치한 판단은 맞다.
- 결정 지연 허용 시한 표가 매우 유용하다.
- Phase 3/4로 신규 데이터·신규 도메인을 미룬 구조는 MVP 우선 관점에서 합리적이다.

보강 필요:

- Phase 0의 A/B/C 병렬은 가능하지만, WP-001의 최종 acceptance는 DEC 일부와 맞물린다. 예를 들어 사이드바 범위, 대화방 모드 placeholder, 모바일 범위가 shell 계약에 영향을 준다.
- Phase 1 마일스톤은 "등록 코어 한 바퀴"인데, 정산 방법은 임시 2옵션으로 우회한다고 되어 있다. 이 임시 상태가 사용자 확인용 demo인지, 실제 merge 가능한 상태인지 구분해야 한다.
- Phase별 exit criteria가 기능 중심이고, visual/accessibility/security/data contract gate가 빠져 있다.

권고:

- 각 Phase에 `entry gate`, `exit gate`, `rollback/defer rule`을 둔다.
- Phase 1 임시 정산 2옵션은 `temporary-demo-only`인지 `production-acceptable-slice`인지 결정한다.

## 6. Phase별 준비도 판정

| Phase | 현재 준비도 | 판정 이유 | 착수 전 보강 |
|---|---|---|---|
| Phase 0 | 조건부 가능 | 해야 할 일이 맞게 잡혀 있음. 단 WP-001 계약이 더 필요 | cockpit contract, DEC crosswalk, 검증 스크립트 보존 |
| Phase 1 | 부분 가능 | 완료 자산 이식 중심이라 실현성 높음 | WP-001 완료, 담당자 서버검증/recent invalidate 범위 확정 |
| Phase 2 | 결정 후 가능 | 목록/상태/배정은 DEC와 런타임 API 안정성에 걸림 | DEC-001/002/010 등 승인, 목록 API preflight |
| Phase 3 | 기획 보강 후 가능 | 구간 집계·AI·경유지는 신규 데이터/스키마 성격 | API/DB contract, product validation, migration plan |
| Phase 4 | 별도 Epic 권장 | 대화방·차주 위치·모바일 최적화는 범위가 큼 | 채팅/위치/모바일을 별도 package로 재분해 |

## 7. 우선 보강 제안

구현 전 최소 보강 세트:

| 순서 | 문서/작업 | 목적 | 이유 |
|---|---|---|---|
| 1 | `04A-decision-record.md` | DEC-001~012와 DEC-{주제} 14개를 연결하고 승인 상태 기록 | 결정 혼선을 가장 빨리 줄임 |
| 2 | `_working/verification/verify-plan-coverage.mjs` | NB/IMPL/WP/DEC 정합성 재현 | 현재 수치 검증을 다음 세션도 신뢰하게 함 |
| 3 | `08A-cockpit-shell-contract.md` | WP-001 state machine, focus/dirty, responsive, visual 기준 고정 | Phase 1 전체 재작업 방지 |
| 4 | `08B-phase-quality-gates.md` | Phase별 unit/integration/E2E/visual/security gate | WP별 테스트를 통합 품질 기준으로 연결 |
| 5 | `08C-mock-to-production-gap.md` | nbbb1 목업-only 기능과 실서비스 요구 분리 | API 없는 목업을 과도하게 실서비스 기능으로 해석하지 않게 함 |

## 8. 추천 의사결정 순서

현재 04의 제안처럼 DEC-001/002/003을 먼저 보는 방향은 맞다. 다만 실제 착수 안전성 기준으로는 아래 순서를 권장한다.

| 순서 | 결정 | 이유 |
|---|---|---|
| 1 | DEC-002 / DEC-목록재설계-게이트 | 목록이 Phase 2의 임계 경로이며, nbbb1 콕핏의 오른쪽 절반을 결정 |
| 2 | DEC-001 / DEC-상태전환-범위 | 상태 칩, 필터 카운트, 배정 자동전환, AI 표시 조건을 모두 좌우 |
| 3 | DEC-003 / DEC-구간랭킹-집계방식 | 구간 칩·주요구간·운임 추천의 공통 데이터 소스 |
| 4 | DEC-008 / DEC-사이드바-범위 | WP-001 shell과 전역 IA에 영향을 줌 |
| 5 | DEC-005 / DEC-대화방 | Phase 4지만 shell placeholder와 버튼 정책에는 조기 영향 |
| 6 | DEC-009 / DEC-정산-4옵션 | Phase 1의 임시 정산 UI가 demo-only인지 production slice인지 결정 |

## 9. 리스크 레지스터

| 리스크 | 등급 | 감지 위치 | 완화책 |
|---|---|---|---|
| 콕핏 shell 전환 후 기존 drawer 기반 초기화·dirty·focus 계약 회귀 | High | 03 구조적 발견, 06 WP-001, 07 리스크 메모 | state machine contract + Playwright focus/dirty E2E |
| 목록 API 500/0건 이슈가 Phase 2에서 재발 | High | 01 미확인, 06 GAP-목록API-안정성, 07 Phase 0 | Phase 0 runtime preflight와 수정 완료 전 Phase 2 차단 |
| 상태 모델을 표시명만 맞추고 서버 domain guard와 충돌 | High | 04 DEC-001, 06 WP-015 | 상태 전이표 + server mutation contract + 회귀 테스트 |
| 목업 AI/추천 기능을 근거 없이 production 알고리즘으로 구현 | High | 02 불명확 항목, 05 GAP-005/006 | discovery spike, 지표 정의 승인, 축소 MVP |
| 채팅 백엔드가 전체 일정 지배 | High | 03 M4, 04 DEC-005, 05 GAP-007 | LMS 1차/실시간 채팅 별도 Epic 분리 |
| 개인정보/계좌/연락처 노출 정책 누락 | High | 03 미배치 보류기각, 04 추가 후보, 05 INFRA-3 | privacy/security gate 문서화 |
| 검증 수치 재현 불가 | Medium | 00 검증 기록 | 검증 스크립트와 로그 보존 |

## 10. 최종 권고

이 패키지는 **버리지 말고 보강해서 쓰는 것이 맞다**. 이미 가장 어려운 "무엇이 있는지/없는지" 분석은 잘 되어 있다. 다만 바로 구현으로 들어가기 전에 Phase 0 산출물을 조금 더 계약화해야 한다.

추천 시작점:

1. `04A-decision-record.md`로 결정 ID와 승인 상태를 고정한다.
2. `08A-cockpit-shell-contract.md`로 WP-001을 구현 가능한 architecture contract로 쪼갠다.
3. 검증 스크립트를 보존해 NB/IMPL/WP 수치가 다시 재현되게 한다.
4. Phase 1은 "등록 코어 이식"으로 작게 시작하되, demo-only 임시 상태와 production-acceptable 상태를 문서에서 분리한다.

## 11. 리뷰 문서 self-review

| 항목 | Severity | Confidence | Action | 메모 |
|---|---|---|---|---|
| 기존 기획의 강점을 충분히 보존했는가 | low | high | checked | 추적성, DEC 큐, GAP 수렴, WP 분해를 강점으로 명시 |
| 구현 범위 밖 코드 수정을 요구하지 않았는가 | low | high | checked | 코드 수정 없이 문서 보강안만 제시 |
| 원본 목업과 구현 계획의 경계를 과장하지 않았는가 | medium | medium | queued | 실제 런타임 검증은 하지 않았으므로 "문서 기반 리뷰"로 범위를 제한 |
| critical/high 즉시 수정 필요 항목이 있는가 | high | high | not-applicable | 리뷰 대상은 기획 문서이며 코드/운영 변경 없음. 보강 권고는 문서 산출물로 큐잉 |
