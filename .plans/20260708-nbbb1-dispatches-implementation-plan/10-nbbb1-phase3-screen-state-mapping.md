# 10. nbbb1 ↔ 현재 Phase 3 화면·상태 매핑

- 작성일: 2026-07-10
- 목표 화면 기준: `..\20260708-nbbb1-dispatches-analysis\`
- 코드형 화면 원본: `C:\Work\Dev\Design\.references\code\nb-main`
- Phase 3 capability 기준(읽기 전용): `C:\Work\Dev\Optics\apps\mm-broker\app\test\broker-order-console`
- 신규 구현 target: `C:\Work\Dev\Optics\apps\mm-broker\app\test\broker-order-console-new`
- 관련 기준선: `09-current-phase3-code-baseline.md`

## 1. 판정 규칙

이 표의 `REUSE/ADAPT/ADD/PROPOSE/DEFER`는 **기능 확보 판정**이다. 실제 코드 변환에서는 아래 보조 판정을 함께 사용한다.

| 변환 판정 | 의미 |
|---|---|
| `PORT` | `nb-main`의 화면 구조·interaction을 신규 route component로 분해 이식 |
| `BRIDGE` | `nb-main`의 동작 표면을 Phase 3 query/mutation/draft 계약에 연결 |
| `REJECT` | fixture, localStorage, mock AI/chat 등 production 이식 금지 |
| `DEFER` | 실제 data contract나 별도 제품 결정 전 미구현 |

기본 조합은 `ADAPT + PORT/BRIDGE`다. `nb-main`에 동작이 있어도 Phase 3 데이터 근거가 없으면 `ADD`가 아니라 `PROPOSE/DEFER`를 유지한다. 항목별 구현 시 `14-nb-main-code-conversion-plan.md`의 판정을 작업 기록에 남긴다.

| 판정 | 의미 |
|---|---|
| `REUSE` | 현재 기능·계약을 그대로 사용 |
| `ADAPT` | backend/service 변경 없이 배치·표면·frontend state만 조정 |
| `ADD-FRONTEND` | 현재 데이터·API 범위 안에서 새 frontend 기능 추가 |
| `PROPOSE-BACKEND` | API·service·DB·집계·외부 연동 변경 가능성이 있어 별도 승인 필요 |
| `DEFER` | 1차 구현에서 제외 |
| `EXCLUDE` | 목표와 맞지 않거나 가짜 기능이 될 위험이 있어 의도적으로 제외 |
| `NEEDS-DECISION` | 제품 규칙 또는 사용자 결정이 선행돼야 함 |

한 항목에 두 판정이 있으면 `/` 앞이 1차 처리, 뒤가 후속 조건이다.

## 2. 전역·레이아웃

| NB | 목표 | 현재 Phase 3 | 판정 | 1차 처리 |
|---|---|---|---|---|
| NB-001 | 70px 사이드바 7메뉴 | test route 내부 전용 sidebar 없음 | `DEFER/NEEDS-DECISION` | 기존 앱 내비를 유지하고 화면 내부에 가짜 7메뉴를 만들지 않음 |
| NB-002 | 하단 사용자 프로필 | auth user context는 있으나 해당 UI 없음 | `ADD-FRONTEND/NEEDS-DECISION` | 표시 필요 시 기존 auth 정보만 사용, 메뉴 동작은 별도 결정 |
| NB-003 | 좌 3모드 × 우 2모드 콕핏 | drawer/inline workspace + 목록 동시 존재 | `ADAPT` | `inline`을 좌 column으로, 목록을 우 column으로 재조합. 기존 `new/copy/edit` state는 보존 |
| NB-004 | 390px 단일 컬럼 | responsive stack과 card mode는 존재 | `DEFER/NEEDS-DECISION` | 1차 desktop fidelity 후 별도 mobile slice |

## 3. 운행 등록

| NB | 목표 | 현재 Phase 3 | 판정 | 1차 처리 |
|---|---|---|---|---|
| NB-005 | 최근 거래처 칩 즉시 적용 | 최근 화주 Top 5와 후보 apply 존재 | `ADAPT` | dialog 기본 후보를 상단 inline chip으로 표면화, 동일 draft apply 사용 |
| NB-006 | 거래처 검색 후 우측 추천 패널 | 화주 검색 + 화주별 주소 후보 존재 | `ADAPT` | 검색 결과/주소 후보를 우측 mode로 보여주되 기존 adapter 재사용 |
| NB-007 | 자주 쓰는 구간 pair 칩 | side별 주소 후보만 존재 | `DEFER/PROPOSE-BACKEND` | 1차는 최근 상차·하차 후보를 분리 제공. pair 집계는 승인 항목 |
| NB-008 | `...`로 추천 패널 열기 | 같은 후보 dialog 진입 자산 존재 | `ADD-FRONTEND` | 우측 추천 mode trigger 추가 |
| NB-009 | 상·하차 지역 칩 | saved/recent/Kakao 후보와 side apply 존재 | `ADAPT` | Top 후보를 side별 chip으로 노출 |
| NB-010 | 카카오 postcode iframe | Kakao REST 검색 + 주소록 저장 존재 | `REUSE/ADAPT` | iframe을 복제하지 않고 현재 dialog를 콕핏 UX에 맞게 배치 |
| NB-011 | 상차 일시 preset | `지금/당일/내일/지정` 존재 | `ADAPT` | 기존 규칙 유지, `월요일` 추가 여부만 결정 |
| NB-012 | 하차 일시 preset | `당일/내일/월착/지정` 존재 | `ADAPT` | 기존 `월착` 의미를 기획 용어와 정렬 |
| NB-013 | 직접 날짜·시간 지정 | Calendar + time select + ESC/더블클릭 존재 | `REUSE` | 그대로 유지 |
| NB-014 | 경유지 최대 3개 | 2점 route draft/payload 고정 | `DEFER/PROPOSE-BACKEND` | 1차 제외. N점 route package 승인 전 구현 금지 |
| NB-015 | 차량 스펙 칩 | 최근 화물 조합과 톤수·차종 draft 존재 | `ADAPT` | 최근 조합을 우선 chip으로 사용, 고정 preset은 frontend-only 후보 |
| NB-016 | 톤급 select | 구현됨 | `REUSE` | 옵션 정합만 확인 |
| NB-017 | 차종 select | 구현됨 | `REUSE` | 옵션 정합만 확인 |
| NB-018 | 화물실중량 입력·저장 | draft에는 있으나 UI 숨김·submit 제외 | `DEFER/PROPOSE-BACKEND` | 저장 계약 승인 전 노출 금지 |
| NB-019 | 인수증/선불/착불/카드 | 현재 `인수증/선착불`, 내부 선불·착불 | `REUSE/NEEDS-DECISION` | 1차 현재 2옵션 유지. 카드와 4옵션 평면화는 별도 결정 |
| NB-020 | 정산 예정일 preset·저장 | 필드·payload 없음 | `DEFER/PROPOSE-BACKEND` | 1차 제외 |
| NB-021 | 금액 콤마 포맷 | Currency input 계열 구현 | `REUSE` | 그대로 사용 |
| NB-022 | 구간별 최근/최빈 운임 | 통계 source 없음 | `DEFER/PROPOSE-BACKEND` | 가짜 추천 금지. 집계 계약 승인 후 진행 |
| NB-023 | 화물품목 chip | 최근 조합과 품목 draft 존재 | `ADAPT` | 최근 품목/고정 quick preset을 frontend-only로 제공 가능 |
| NB-024 | 메모·품목 직접 입력 | 화물 품목·비고 구현 | `REUSE` | 그대로 사용 |
| NB-025 | 검증→등록→목록 반영→초기화 | real submit, validation, invalidate, success adapter, retry 구현. 단 create server는 담당자 UUID 필수인데 client는 회사만 필수인 불일치 존재 | `REUSE/ADAPT` | alert 대신 현재 inline status·toast·pending·retry 유지. client 담당자 blocking validation을 server 계약에 맞춤 |
| NB-026 | 폼 초기화 | draft reset 구현 | `REUSE` | dirty confirm 정책과 함께 유지 |

## 4. 운행 내역 목록

| NB | 목표 | 현재 Phase 3 | 판정 | 1차 처리 |
|---|---|---|---|---|
| NB-027 | 날짜 칩 7종+건수 | QuickFilterCard/목록 query는 있으나 동일 칩 건수 없음 | `ADAPT` | 기존 filter query를 chip UI로 재배치, 건수는 현재 summary 범위만 표시 |
| NB-028 | 직접 기간 선택 | 기존 quick filter에 기간 조건 자산 존재 | `REUSE/ADAPT` | 콕핏 chip 하단에 조건부 노출 |
| NB-029 | 상태 칩 7종+건수 | waiting/dispatched/completed tab과 status data 존재 | `ADAPT/NEEDS-DECISION` | 기존 domain status 기준 chip 구성, nbbb1 표시명 mapping 결정 |
| NB-030 | 검색 버튼 적용 | 기존 search 존재 | `REUSE` | 그대로 사용 |
| NB-031 | 필터 초기화 | 기존 filter/search reset 흐름 존재 | `REUSE` | 한 곳의 초기화 action으로 조합 |
| NB-032 | 우측 패널 접힘·세로 탭 | 동일 list panel collapse 없음 | `ADD-FRONTEND` | view-only state로 추가 가능, 목록 query state는 유지 |
| NB-033 | row hover | 구현됨 | `REUSE` | token만 reference와 정렬 |
| NB-034 | row accordion 상세 | inline 상단 workspace와 detail hydration 존재 | `ADAPT` | 행 아래 또는 우측 목록 내부 inline workspace로 배치. detail fetch/guard 재사용 |
| NB-035 | AI 난이도 신호등 | data source·알고리즘 없음 | `DEFER/PROPOSE-BACKEND` | 표시하지 않음 |
| NB-036 | empty 안내 | tab별 empty 구현 | `REUSE` | 문구만 목표 화면에 맞춤 |
| NB-037 | compact table | table/card/pagination 구현 | `ADAPT` | nbbb1 핵심 column으로 compact variant 제공, pagination은 유지 |

## 5. 행 상세·인라인 작업

| NB | 목표 | 현재 Phase 3 | 판정 | 1차 처리 |
|---|---|---|---|---|
| NB-038 | AI advisor + 지표 | data source·판정식 없음 | `DEFER/PROPOSE-BACKEND` | mock banner 금지 |
| NB-039 | 상세 카드 + 경유지/대화방 | 모든 기본 detail draft와 메모는 존재 | `ADAPT` | compact read summary 우선. 경유지·대화방 버튼은 승인 전 숨김/비활성 |
| NB-040 | 운/수 대상 토글 | 정산 draft에 청구·배차 금액 구조 존재 | `ADAPT` | 의미 mapping을 기존 정산 계약에 맞춰 frontend state로 제공 |
| NB-041 | ±1만/5천/1천 stepper | Currency input은 있으나 stepper 없음 | `ADD-FRONTEND` | 기존 금액 입력의 얇은 delta control로 추가 가능 |
| NB-042 | 직접 운임/수수료 수정 | 금액 입력 구현 | `REUSE` | 그대로 사용 |
| NB-043 | 저장·toast·목록 갱신 | update/side effect/invalidate/retry 구현 | `REUSE` | 현재 실행·재시도 계약 유지 |
| NB-044 | 차주 수동 입력·프리필 | 내부 DB 등록·후보 선택·inline edit 존재 | `ADAPT` | 자유 텍스트 즉시 assign 대신 기존 등록→선택→배정 guard 유지 |
| NB-045 | 차량배정→좌측 배정 panel | 차주 lookup dialog와 draft apply 존재 | `ADAPT` | dialog contents를 좌측 assign mode로 재배치 |
| NB-046 | 상태 버튼 6종 즉시 전환 | 현재 header status mutation과 운행마감 존재 | `ADAPT/NEEDS-DECISION` | 기존 enum·server guard를 유지하고 표시 버튼만 재배치. 비순차 전환 복제 금지 |

## 6. 차량·차주 배정

| NB | 목표 | 현재 Phase 3 | 판정 | 1차 처리 |
|---|---|---|---|---|
| NB-047 | 선택 화물 요약 | current draft/detail snapshot 존재 | `ADD-FRONTEND` | 화주·노선·차량·금액 compact summary 구성 |
| NB-048 | AI 추천 Top 3 | 알고리즘·지표 없음 | `DEFER/PROPOSE-BACKEND` | 추천 badge/사유를 임의 생성하지 않음 |
| NB-049 | 가용 차주 전체 목록 | 내부 DB·화물맨 후보 목록 존재 | `ADAPT` | 현재 후보 list를 panel로 이동. 실제 가용 상태 필터는 제외 |
| NB-050 | 풍부한 차주 card | 이름·연락처·차량·source·최근 정보 일부 존재 | `ADAPT/PROPOSE-BACKEND` | 1차 core field만. 계좌·월 운임·실시간 상태는 제외 |
| NB-051 | 현위치/연계지 거리 | 위치·운행 tracking 없음 | `DEFER/PROPOSE-BACKEND` | 제외 |
| NB-052 | 선택 배정+배차완료 | driver assign side effect와 status sync 존재 | `ADAPT` | 기존 assign adapter를 독립 action으로 조합, 성공 후 register mode 복귀 |
| NB-053 | 닫기→등록 복귀 | close/dirty guard 존재 | `REUSE/ADAPT` | 닫기 대신 좌 panel mode 전환으로 연결, guard 유지 |

## 7. 주요 상하차지 추천 패널

| NB | 목표 | 현재 Phase 3 | 판정 | 1차 처리 |
|---|---|---|---|---|
| NB-054 | 거래처 안내+닫기 | 현재 dialog shell·selected company guard 존재 | `ADAPT` | 우측 panel header로 재배치 |
| NB-055 | pair Top 5 | pair 집계 없음 | `DEFER/PROPOSE-BACKEND` | 1차 panel에서는 제외 |
| NB-056 | 저장 기반 상차 Top 5 | saved/recent load 후보 존재 | `ADAPT` | 현재 정렬로 최대 5개 표시; “빈도 순위”라고 오표기하지 않음 |
| NB-057 | 저장 기반 하차 Top 5 | saved/recent unload 후보 존재 | `ADAPT` | NB-056과 동일 |

## 8. 대화방

| NB | 목표 | 현재 Phase 3 | 판정 | 1차 처리 |
|---|---|---|---|---|
| NB-058 | `/chats` 전체화면 | route/domain 없음 | `EXCLUDE/NEEDS-DECISION` | 존재하지 않는 route를 만들지 않음 |
| NB-059 | 대화방→등록 복귀 | panel mode pattern만 존재 | `DEFER` | 대화방 자체 승인 후 frontend state 추가 |
| NB-060 | 메시지 송수신 | 실시간 chat 없음; legacy LMS는 별도 domain | `DEFER/PROPOSE-BACKEND` | LMS 대체 여부 결정 전 구현 금지 |
| NB-061 | 첨부·템플릿 action | 목표도 미정, storage 없음 | `EXCLUDE` | 기능 정의 전 제외 |
| NB-062 | 상대 정보+인사 메시지 | 화주/차주 snapshot은 존재 | `DEFER/ADD-FRONTEND` | chat 채널 결정 후 snapshot 재사용 |

## 9. 횡단 규칙

| NB | 목표 | 현재 Phase 3 | 판정 | 1차 처리 |
|---|---|---|---|---|
| NB-063 | 배차 라이프사이클 | status dropdown, assign sync, cancel/close guard 존재 | `ADAPT/NEEDS-DECISION` | 기존 domain enum·mutation을 source로 표시명/색만 정렬 |
| NB-064 | 날짜×상태 교차 카운트 | refetch·summary는 있으나 동일 cross count 없음 | `DEFER/PROPOSE-BACKEND` | current summary만 사용. 전체 dataset client 추정 금지 |
| NB-065 | 화주→구간→운임 추천 체인 | 화주→side 주소·최근 화물 체인은 존재 | `ADAPT/PROPOSE-BACKEND` | 1차는 화주→주소·화물까지. pair·운임 단계는 승인 후 확장 |

## 10. 집계

중복 판정을 허용하므로 합계는 65를 초과할 수 있다.

| 관점 | 항목 |
|---|---|
| 1차에 직접 재사용 가능한 핵심 | NB-013, 016, 017, 021, 024~026, 030~031, 033, 036, 042~043 등 |
| backend 없이 화면 재배치·조정 가능 | NB-003, 005~006, 008~012, 015, 023, 027~029, 032, 034, 037, 039~041, 044~047, 049~050, 052~057, 063, 065 일부 |
| 제품 결정이 먼저 필요한 항목 | NB-001~004 일부, NB-019, NB-029, NB-046, NB-058, NB-063 |
| backend/service/DB 가능성이 있는 항목 | NB-007, 014, 018, 020, 022, 035, 038, 048, 050 일부, 051, 055, 060, 064, 065 일부 |
| 1차 제외 | AI, 위치, chat, waypoint, 신규 저장 필드, 가짜 교차 통계 |

## 11. 구현 우선순위 결론

1. 먼저 NB-001~065의 **화면 존재 여부와 배치**를 UI prototype에서 확인한다. data 미연결 항목은 `prototype-only`로 표시한다.
2. 사용자가 CK-01~05 화면·interaction을 확인하고 G-UI를 승인할 때까지 container/placement만 반복 수정한다.
3. 승인 후 `REUSE` 기능의 실제 동작 계약을 capability bridge로 연결한다.
4. `ADAPT`와 `ADD-FRONTEND`를 승인 화면 구조 안에서 구현한다.
5. `NEEDS-DECISION`은 실제 기능 연결 전 결정하며, prototype에 보였다는 이유로 자동 승인하지 않는다.
6. `PROPOSE-BACKEND`와 `DEFER`는 `13-approval-required-items.md`의 개별 승인 전 실제 기능으로 구현하지 않는다.
