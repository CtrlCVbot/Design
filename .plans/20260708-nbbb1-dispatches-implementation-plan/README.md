# nbbb1 /dispatches 구현 기획 패키지

- 작성일: 2026-07-09
- 목적: `nb-main`의 **실행 가능한 기획 코드**를 화면·상호작용 원본으로 삼아 신규 격리 route에 먼저 고충실도 UI prototype을 만들고, **사용자 화면 승인 후에만** mm-broker-order-console Phase 3 기능 자산을 실제 업무 계약으로 연결하기 위한 기획 문서 패키지.
- 입력 소스:
  - 역사적 구현 현황: `C:\Work\Dev\Optics\.plans\...\38-phase3-planning-and-git-history-20260708.md` 인덱스가 가리키는 문서 전체 (661건) + canonical 코드 integration head `1a5e43cd` 검증 53건
  - 코드형 기획 원본: `C:\Work\Dev\Design\.references\code\nb-main` — Vite/React 기반 `/dispatches` 화면과 interaction
  - Phase 3 기준선(읽기 전용): `C:\Work\Dev\Optics\apps\mm-broker\app\test\broker-order-console` HEAD `744327f5`
  - 신규 구현 target: `C:\Work\Dev\Optics\apps\mm-broker\app\test\broker-order-console-new`
  - 목표 기획: `C:\Work\Dev\Design\.plans\20260708-nbbb1-dispatches-analysis\` (기능분석·userflow·wireframe)

## 문서 맵

| 문서 | 내용 | 핵심 수치 |
|---|---|---|
| [00-document-coverage-checklist.md](00-document-coverage-checklist.md) | 전수 조사 체크리스트 + 검증 기록 | 문서 661건 전건 `읽음`, 자가검증 5항목 전부 통과 |
| [01-implemented-feature-inventory.md](01-implemented-feature-inventory.md) | Phase 3 구현 기능 인벤토리 (IMPL-D#-###) | 429항목 — 완료 258 / 부분 45 / 보류 68 / 기각 39 / 계획만 17 / 미확인 2 |
| [02-nbbb1-feature-inventory.md](02-nbbb1-feature-inventory.md) | nbbb1 목표 기능 인벤토리 (NB-001~065) | 65항목 + 불명확 ⚠ 11건 (기획 확정 질문) |
| [03-coverage-mapping.md](03-coverage-mapping.md) | 양방향 커버리지 매핑 | NB→IMPL: 그대로이식 11 / 수정후이식 36 / 신규기획 17 / 제외후보 1 · IMPL→NB 미배치: 완료자산 115 / 보류기각 95 / 인프라 77 |
| [04-user-decision-queue.md](04-user-decision-queue.md) | 사용자 결정 대기 큐 (DEC-001~012) | 결정 12그룹 + 추가 검토 자산 10건. 최우선: DEC-001 배차 상태 모델 통합 |
| [05-gap-and-new-planning.md](05-gap-and-new-planning.md) | gap 신규 기획 (GAP-001~008) | 8그룹 — 최대 규모는 GAP-007 대화방 도메인 신설 (backend 무변경 원칙 초과) |
| [06-work-packages.md](06-work-packages.md) | work package 분해 (WP-001~025) | 25개, NB 65항목 전수 커버 (커버리지 표 포함) |
| [07-phase-roadmap.md](07-phase-roadmap.md) | Phase 로드맵 | 5단계 (Phase 0 결정·기반 ~ Phase 4 신규 도메인), Phase별 병렬 축 표시 |
| [08-implementation-plan-review.md](08-implementation-plan-review.md) | 기존 패키지 독립 리뷰 | Phase 0 보강 후 조건부 착수 권고 |
| [09-current-phase3-code-baseline.md](09-current-phase3-code-baseline.md) | 2026-07-10 현재 실제 코드·테스트 기준선 | HEAD `744327f5`, 46 files / 434 tests |
| [10-nbbb1-phase3-screen-state-mapping.md](10-nbbb1-phase3-screen-state-mapping.md) | NB-001~065 현재 코드 재매핑 | `REUSE/ADAPT/ADD/PROPOSE/DEFER` 판정 |
| [11-cockpit-fidelity-contract.md](11-cockpit-fidelity-contract.md) | 콕핏 화면 fidelity 계약 | 화면·상태·토큰·허용 차이·시각 검증 기준 |
| [12-implementation-roadmap-v2.md](12-implementation-roadmap-v2.md) | UI prototype 우선·사용자 승인 후 기능 연결 로드맵 v4 | Phase R/N/P → G-UI → B/C/D/E/F/X/Q |
| [13-approval-required-items.md](13-approval-required-items.md) | 별도 승인 필요 항목 | 제품 결정과 backend 확장 작업 격리 |
| [14-nb-main-code-conversion-plan.md](14-nb-main-code-conversion-plan.md) | `nb-main` 코드 변환·적용 계약 | source 역할, 금지 이식, 신규 route 구조, capability bridge, drift hash |
| [15-ui-prototype-acceptance-gate.md](15-ui-prototype-acceptance-gate.md) | 사용자 화면 검수·승인 기록 | 검수 URL, CK-01~05 조작·시각 체크, `approved/revise`, 승인 후 잠금 범위 |
| [16-overall-schedule.md](16-overall-schedule.md) | 일반·AI 실행 예상 일정과 milestone | 일반 6~9주 / AI 연속 실행 1~3주, Phase X 제외 |
| [17-advisor-worker-harness-compatibility.md](17-advisor-worker-harness-compatibility.md) | Advisor/Worker·프로젝트 하네스·전역 기능 호환성 감사 | 조건부 호환, project hook 활성 확인 후 구현 시작 |
| [18-g-ui-revision-1-code-fidelity-contract.md](18-g-ui-revision-1-code-fidelity-contract.md) | G-UI R1 source-code fidelity 계약 | 검색·full-width·motion·55/45 detail·token 재현 |
| [19-g-ui-revision-2-inline-detail-fidelity-contract.md](19-g-ui-revision-2-inline-detail-fidelity-contract.md) | G-UI R2 inline 상세 fidelity 계약 | reference 상세 구조·필드·토큰·상호작용 재대조 |
| [20-g-ui-revision-3-search-fidelity-contract.md](20-g-ui-revision-3-search-fidelity-contract.md) | G-UI R3 검색 복원 계약 | 목록 검색어·검색·초기화 구현 범위 |
| [design-proposals/g-ui-design-detail-before-after.html](design-proposals/g-ui-design-detail-before-after.html) | 디자인 디테일 개선 제안 HTML | DD-01~12 변경 전·변경 후 비교와 승인 선택지 |
| [21-g-ui-revision-4-design-detail-implementation-contract.md](21-g-ui-revision-4-design-detail-implementation-contract.md) | G-UI R4 디자인 디테일 전체 적용 계약 | DD-01~12 구현·responsive·검증 기준 |
| [22-junior-handoff.md](22-junior-handoff.md) | 주니어 인수인계 | 현재 상태·작업 경계·읽는 순서·검증·시작 프롬프트 |
| [23-junior-phase-b-start-plan.md](23-junior-phase-b-start-plan.md) | Phase B 시작 계획 | 첫 capability 선정·승인·구현 절차 |
| [execution/](execution/) | G0 이후 실행 SSOT | plan·context·tasks·progress·decisions |
| [evidence/](evidence/) | G-UI 검수·검증 증거 | screenshots·visual-gap·verification |
| `_working/` | 중간 산출물 (추출 43건, 도메인 인벤토리 8건, 매핑 5건 등) | 근거 추적용 — 최종 문서의 원본 |

## 읽는 순서

1. **현재 구현 착수 판단**: 14(`nb-main` 변환 계약) → 11(fidelity) → 12(v4 로드맵) → 13(승인 분리) → 15(화면 검수 gate)
2. **의사결정자**: 13(승인 항목) → 04(기존 결정 큐) → 07(기존 로드맵)
3. **기획자**: 02(NB 목표) → 10(현재 매핑) → 05(gap 기획)
4. **구현자**: 14(변환 경계) → 12(v4 로드맵) → 15(화면 검수) → 09(현재 코드 anchor) → 06(기존 work package)

> 2026-07-10 기준 충돌 규칙: 화면 구조·상호작용은 `nb-main`과 11·14를 우선하고, 실제 업무 동작·데이터·guard는 09·10의 Phase 3 기준선을 우선한다. 충돌 시 시각은 원본에 가깝게 유지하되 가짜 데이터나 약화된 업무 규칙은 이식하지 않는다. 01~08은 과거 결정·추적성 근거로 보존한다.

## 핵심 발견 요약

- 기존 03 기준 NB 65항목 중 **47건(72%)은 Phase 3 완료 자산 재사용 가능** (그대로 11 + 수정 36). 현재 코드 변화까지 반영한 항목별 판정은 10을 우선한다. 지배적 수정 패턴은 "Phase 3 dialog 내부 후보 목록 → 콕핏 상시 폼의 인라인 칩/패널 표면화"다.
- **신규기획 17건의 공통 원인은 데이터 소스 부재** — 구간(pair) 집계, 차주 실시간 위치·상태, 채팅 백엔드. 집계 쿼리 등 공통 인프라 4종으로 수렴.
- **Phase 3 의도적 보류·기각과의 충돌 11지점** — 경유지(보류), 실중량(보류), 정산 4옵션(기각→2옵션 확정), 목록 재설계(조건부 보류), 수동 배정 guard 등. 전부 04 결정 큐에 등재.
- **대화방은 Phase 3 자산 전무** — backend 무변경 원칙을 넘어서는 첫 신규 서버 도메인 후보.
- 선결 기술 이슈 3건: 목록 API 500 재현 확인, client/server validation 불일치, 저장 후 recent cache invalidate 부재.
- **기존 `/test/broker-order-console`은 동결된 회귀 기준선**이다. 모든 신규 화면 구현은 `/test/broker-order-console-new`에서 진행하고, 기존 route 내부 파일은 수정하지 않는다.
- `nb-main`은 6,118줄 단일 `Dispatches.tsx`, fixture·`localStorage`·mock AI를 포함하므로 직접 복사하지 않는다. 화면 조합과 interaction만 분해하고 실제 데이터 흐름은 Phase 3 capability bridge로 연결한다.
- capability bridge는 UI prototype에 대한 사용자 승인 전에는 만들지 않는다. prototype은 in-memory demo adapter만 사용하며 실제 API·저장·배정·상태 mutation을 호출하지 않는다.

## 작업 방법 (추적성)

4개 workflow로 수행: ① 문서 전수 추출(배치 43+보완 2, 임시 ID 1,256건) → ② 도메인 통합 8개 + 누락 스윕(1,191 ID 대조) + 코드 검증 53건 → ③ 양방향 매핑 + 역방향 전수 대조 → ④ 문서 작성 6종 + 자가검증(NB 65/65, IMPL 429/429 확인). 모든 최종 항목은 원본 임시 ID → 출처 문서/커밋으로 역추적 가능하다.
