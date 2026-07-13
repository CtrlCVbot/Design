# 13. 별도 승인 필요 항목

- 작성일: 2026-07-10
- 상태: 사용자 결정 대기
- 원칙: 아래 항목은 일반 frontend 구현 로드맵에서 격리하며, 승인 전 구현하지 않는다.

## 1. 승인 등급

| 등급 | 의미 |
|---|---|
| `P0-BEFORE-IMPLEMENT` | 기본 화면 구현 방향에 영향을 주므로 시작 전 확인 필요 |
| `P1-BEFORE-PHASE` | 해당 후속 Phase 시작 전 확인 |
| `P2-DEFERRED` | 별도 package/Epic으로 미룸 |

## 2. 시작 전 확인할 기본안

### AP-001 — 앱 사이드바와 운영 route

- 등급: `P0-BEFORE-IMPLEMENT`
- 관련: NB-001, NB-002, DEC-008
- 현재 사실: 기존 `/test/broker-order-console`은 회귀 기준선으로 동결하고 실제 target은 `/test/broker-order-console-new`다. `nb-main`의 7메뉴 전체는 현재 구현 범위가 아니다.
- 추천: **기존 mm-broker navigation을 유지하고, 새 화면 내부에서 nbbb1 sidebar를 복제하지 않는다.** 프로필도 기존 app owner에 맡긴다.
- trade-off: screenshot의 70px rail exact match는 낮아지지만 가짜 route와 이중 navigation을 피한다.
- 승인 선택:
  1. 추천안: 기존 navigation 유지.
  2. 배차 관리 화면 전용 rail만 시각적으로 추가.
  3. 전체 운영 IA를 별도 기획.

### AP-002 — desktop 우선과 mobile 범위

- 등급: `P0-BEFORE-IMPLEMENT`
- 관련: NB-004, DEC-011
- 추천: **1차는 1440~1600px desktop 콕핏만 구현하고 390px는 별도 E-MOBILE package로 분리한다.**
- 이유: current Phase 3는 desktop 운영 콘솔이 기준이고 mobile은 정보 우선순위·touch flow를 별도로 검증해야 한다.

### AP-003 — 배차 상태 표시와 전이

- 등급: `P0-BEFORE-IMPLEMENT`
- 관련: NB-029, NB-046, NB-063, DEC-001
- 현재 사실: current code에는 status dropdown과 mutation, 취소·마감 guard가 연결돼 있다. nbbb1 목업은 비순차 전환을 허용한다.
- 추천: **기존 enum·API·domain guard를 유지하고 nbbb1의 표시명·색·버튼 배치만 매핑한다.**
- 금지: 모든 상태로 임의 전환하는 mock 동작 복제.
- 별도 backend 변경: 추천안에는 없음.

### AP-004 — 정산 방식 UI

- 등급: `P0-BEFORE-IMPLEMENT`
- 관련: NB-019, DEC-009
- 현재 사실: current contract는 `인수증 / 선착불`이며 선착불 내부에 선불·착불이 있다. `카드`의 저장 enum 근거가 없다.
- 추천: **1차는 현재 2옵션을 유지하고 reference의 4옵션은 fidelity gap으로 기록한다.**
- 대안: 선불·착불만 frontend에서 평면화하고 카드 제외. 이 경우에도 draft mapping test가 필요하다.
- backend 가능성: 카드 옵션을 실제 저장하려면 계약 확인 또는 확장이 필요하다.

## 3. 신규 데이터·backend 가능성이 있는 항목

### AP-005 — 주요 구간 pair·최근/최빈 운임·교차 count

- 등급: `P1-BEFORE-PHASE`
- 관련: NB-007, NB-022, NB-055, NB-064, NB-065, DEC-003/004
- 필요한 것:
  - tenant/company scope
  - 주소 정규화 key
  - pair 빈도·최근 운임·최빈 운임 response
  - 날짜×상태 count response 또는 전체 dataset 계약
  - cache/invalidation
- frontend-only 대안: saved/recent 상·하차 후보를 분리 제공하고 현재 summary만 표시.
- 추천: **frontend-only 대안으로 1차를 완료한 뒤 별도 집계 contract를 승인한다.**
- 리스크: client current-page 데이터로 전체 통계처럼 표시하면 잘못된 배차 판단을 유도한다.

### AP-006 — 경유지 최대 3개

- 등급: `P2-DEFERRED`
- 관련: NB-014, NB-039, DEC-007
- 필요한 변경:
  - route draft `load/unload` → ordered points
  - payload/schema
  - detail hydration
  - distance multi-leg calculation/cache key
  - 기존 2점 데이터 migration/fallback
- frontend-only 대안: 없음. UI만 추가하면 저장되지 않는다.
- 추천: **별도 route package로 연기.**

### AP-007 — 화물실중량 저장

- 등급: `P2-DEFERRED`
- 관련: NB-018, DEC-012
- 현재 사실: `actualWeightTon`은 draft에 있으나 submit 제외가 테스트로 고정돼 있다.
- 필요한 결정: 단위, 범위, 소수 자릿수, DB owner, API field, 과거 데이터 fallback.
- 추천: **저장 계약 전에는 화면에도 노출하지 않는다.**

### AP-008 — 정산 예정일

- 등급: `P2-DEFERRED`
- 관련: NB-020
- 필요한 결정: 등록일/하차일 기준, 바로·15일·월말·45일 산식, nullable, order/settlement owner.
- 추천: 별도 settlement contract에서 결정.

### AP-009 — AI 난이도·advisor·추천 차주

- 등급: `P2-DEFERRED`
- 관련: NB-035, NB-038, NB-048, DEC-004/006
- 현재 사실: 동일 의미의 metric source와 scoring algorithm이 없다.
- 필요한 계약:
  - 대기 차주, 경쟁 화물, 평균 운임 definition
  - 난이도 threshold
  - 추천 score와 사유 설명
  - stale/insufficient data fallback
  - 운영자 오판 방지 문구와 auditability
- frontend-only 대안: 해당 영역을 미노출하거나 “데이터 연결 후 제공”으로 명시.
- 추천: **fixture AI를 금지하고 discovery/evaluation package로 분리.**

### AP-010 — 차주 위치·가용 상태·계좌·연계지 거리

- 등급: `P2-DEFERRED`
- 관련: NB-050, NB-051, DEC-006
- 필요한 것: 위치 source, freshness, permission, 개인정보 정책, 운행 상태, 계좌 masking, distance input.
- frontend-only 대안: 이름·연락처·차량·source 등 current candidate core만 표시.
- 추천: core card로 1차 완료 후 별도 driver tracking package.

### AP-011 — 대화방과 `/chats`

- 등급: `P2-DEFERRED`
- 관련: NB-058~062, DEC-005
- 현재 사실: current support memo는 내부 운영 메모이고, legacy LMS는 문자 채널이다. 둘 다 실시간 대화방과 동일하지 않다.
- 필요한 결정:
  - channel: chat / LMS / 병행
  - participant: 화주 / 차주 / 운영자
  - message storage/retention/read state
  - attachment/template
  - notification, permission, masking
- frontend-only 대안: 현재 운영자 메모를 상세 보조 panel에 유지하되 “대화방”으로 이름을 바꾸지 않는다.
- 추천: **1차 콕핏에서 chat mode와 `/chats` 버튼 제외.**

## 4. 화면 배치 결정을 받을 항목

### AP-012 — Phase 3-only 기능 노출

- 등급: `P1-BEFORE-PHASE`
- 대상: copy/edit, card view, pagination, auto refresh, Excel, bulk accept, memo, amount logs, CargoMan, 운행 마감.
- 추천:
  - primary 유지: copy/edit, pagination, submit retry, 운행 마감.
  - secondary toolbar: auto refresh, Excel, bulk accept, card view.
  - detail secondary panel: memo, amount logs.
  - driver advanced area: CargoMan.
- 이유: production 기능은 보존하되 nbbb1 primary flow를 가리지 않게 한다.

### AP-013 — 우측 list collapse

- 등급: `P1-BEFORE-PHASE`
- 관련: NB-032
- 추천: Phase E에서 desktop frontend-only로 구현.
- 유지 조건: collapse 전 filter, page, selection, scroll state 보존.

### AP-014 — 수동 차주 입력과 즉시 배정 원칙

- 등급: `P1-BEFORE-PHASE`
- 관련: NB-044, NB-052, DEC-010
- 현재 사실: current Phase 3는 내부 DB에 저장된 차주만 실제 assign할 수 있고, 신규 차주는 등록→선택→배정 흐름을 거친다.
- 추천: **현재 guard를 유지하고 nbbb1의 자유 텍스트 즉시 배정을 복제하지 않는다.**
- 이유: 존재하지 않는 driver ID로 배차하는 데이터 오류를 막고, driver master 수정의 opt-in 계약을 보존한다.
- backend 변경: 추천안에는 없음.

### AP-015 — `nb-main` 변환 방식과 route 격리

- 등급: `P0-BEFORE-IMPLEMENT`
- 관련: 전체 NB, `14-nb-main-code-conversion-plan.md`
- 현재 사실: `nb-main`은 Vite/React Router + fixture + `localStorage` 기반 기획 코드이며, 기존 Phase 3는 Next.js와 실제 API/guard를 사용한다.
- 추천:
  1. 기존 `app/test/broker-order-console/**`는 수정하지 않는다.
  2. 모든 신규 화면은 `app/test/broker-order-console-new/**`에 만든다.
  3. 먼저 `nb-main`의 화면·interaction을 in-memory UI prototype으로 `PORT`하고 사용자 승인을 받는다.
  4. 승인 후에만 실제 동작을 Phase 3 capability bridge로 `BRIDGE`한다.
  5. route-local in-memory fixture는 prototype에서만 허용하고, production fixture·mock AI/chat·localStorage·Supabase placeholder는 `REJECT`한다.
  6. 공용 backend/service 변경이 필요하면 현재 작업을 중단하고 별도 제안·승인을 받는다.
- trade-off: 초기 bridge와 characterization test 비용이 들지만 기존 화면 회귀와 기획 mock의 production 유입을 막는다.

## 5. 추천 승인 묶음

### 기존 DEC ↔ 현재 AP crosswalk

| 기존 숫자 DEC | 기존 주제 DEC | 현재 AP |
|---|---|---|
| DEC-001 | DEC-상태전환-범위 | AP-003 |
| DEC-002 | DEC-목록재설계-게이트 | AP-012, AP-013 |
| DEC-003 | DEC-구간랭킹-집계방식 | AP-005 |
| DEC-004 | DEC-운임통계-스코프, DEC-AI지표 | AP-005, AP-009 |
| DEC-005 | DEC-대화방 | AP-011 |
| DEC-006 | DEC-차주추천, DEC-차주카드-데이터 | AP-009, AP-010 |
| DEC-007 | DEC-경유지 | AP-006 |
| DEC-008 | DEC-사이드바-범위 | AP-001 |
| DEC-009 | DEC-정산-4옵션 | AP-004 |
| DEC-010 | DEC-수동배정-원칙 | AP-014 |
| DEC-011 | DEC-모바일-범위 | AP-002 |
| DEC-012 | DEC-화물실중량 | AP-007 |
| 기존 숫자 DEC 없음 | 정산 예정일 신규 계약 | AP-008 |
| 기존 숫자 DEC 없음 | `nb-main` 코드 변환·신규 route 격리 | AP-015 |

이 crosswalk를 현재 승인 기록의 기준으로 사용하고, 기존 04·06의 두 ID 체계를 다시 해석하지 않는다.

### Gate G0 — UI prototype 구현 승인

- 상태: `approved`
- 승인자: 사용자
- 승인일: 2026-07-10
- 승인 근거: 사용자 명시 요청 `진행해줘`
- 승인 범위: `R-00 → R-01 → N-00 → N-01 → N-02 → P-01~06`
- 제외: `B-00` 이후 capability bridge, API, backend/service, 실제 mutation

다음 추천안을 묶어 확인한다.

1. AP-015 추천안: 기존 route 동결, 신규 route 격리, `UI PORT → 사용자 승인 → BRIDGE` 방식.
2. 기존 app navigation 유지.
3. desktop 우선.
4. prototype은 CK-01~05 주요 화면과 interaction을 모두 보여준다.
5. prototype의 demo data는 in-memory이며 실제 API·저장·배정·상태 변경을 호출하지 않는다.
6. 미지원 기능도 화면 확인을 위해 표시할 수 있지만 `prototype-only`로 구분한다.
7. G-UI 승인 전 capability bridge와 Phase 3 기능 연결을 시작하지 않는다.

G0 승인 시 `12-implementation-roadmap-v2.md`의 `R-00 → R-01 → N-00 → N-01 → N-02 → P-01~06`만 진행한다. 완료 후 실제 route, screenshot 비교, known gap을 제출하고 멈춘다.

### Gate G-UI — 사용자 화면 승인

- 사용자가 `/test/broker-order-console-new`를 직접 확인
- 좌우 구성, 정보 밀도, 등록, 목록, 상세, 배정, 추천 interaction 검토
- `revise`이면 UI prototype만 수정
- `approved`이면 승인 screenshot·commit/hash를 고정
- 명시적 승인 없이는 기능 연결 금지

### Gate G1 — Phase 3 capability·등록·목록 연결

- AP-003 기존 status enum·domain guard 유지
- AP-004 실제 저장 가능한 정산 option 결정
- `selectedManagerId` validation preflight
- recent candidate cache preflight
- auth·tenant·submit·list 계약 연결

### Gate G2 — 상세·상태·배정과 후속 UI

- status label mapping
- driver core card field
- AP-014 등록→선택→배정 원칙
- existing assign action composition
- right recommendation panel
- list collapse
- quick chip
- amount stepper
- Phase 3-only secondary hierarchy

### Gate G3 — 신규 backend/domain

AP-005~011을 **각각 독립적으로** 승인한다. 한 항목 승인이 다른 항목의 자동 승인을 뜻하지 않는다.

## 6. 승인 기록 형식

결정 시 다음 형식으로 이 문서에 기록한다.

| 필드 | 값 |
|---|---|
| approval_id | `AP-###` |
| status | `proposed / approved / rejected / deferred` |
| selected_option | 선택안 |
| owner | 결정자 |
| decided_at | 날짜 |
| unblocks | 열리는 Phase/task |
| constraints | 추가 제약 |
| revisit_condition | 재검토 조건 |

현재 AP-001~015의 개별 제품 결정 상태는 `proposed`다. Gate G0만 UI prototype 범위로 `approved`됐으며, G-UI와 G1~G3는 대기한다.
