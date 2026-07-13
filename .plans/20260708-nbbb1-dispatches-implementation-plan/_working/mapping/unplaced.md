# 미배치 IMPL 항목 대조 (unplaced)

- 작성일: 2026-07-09
- 방법: D1~D8 메인 테이블에서 IMPL ID 429건 기계 추출 → M1~M5 인용 ID(IMPL-D#-### 및 D#-### 축약 표기 모두 인식) 142건과 차집합 287건 → 상태·성격 분류
- 주의: M1~M5는 NB 항목당 대표 IMPL만 인용하는 방식이라, 미배치-완료자산의 상당수는 **이미 매핑된 상위 기능(dialog/섹션)의 세부 동작**이다. 상위 기능 이식 시 자동 승계되므로 전부가 신규 배치 대상은 아니다.

## 집계

| 구분 | 건수 |
|---|---|
| IMPL 인벤토리 전체 | 429 |
| M1~M5 인용(배치) | 142 |
| 미배치 합계 | 287 |
| ├ 미배치-완료자산 (완료/부분, UI 기능) | 115 |
| ├ 미배치-보류기각 (보류/기각/계획만) | 95 |
| └ 미배치-인프라 (계약·payload·API·테스트·문서·정책) | 77 |

## 1. 미배치-완료자산 (115건) — nbbb1 기획 추가 여부 사용자 결정 후보

상태 완료/부분인데 nbbb1 화면 매핑(M1~M5)에 인용되지 않은 UI 기능. ★ 표시는 추가 검토 가치가 높은 항목.

| ID | 기능 | 상태 | 분류 | 비고 |
|---|---|---|---|---|
| IMPL-D1-002 | 화주 row 1열/2열/3열 grouping (T7-GAP-010) — 1열 업체명/사업자번호, 2열 담당자/연락처/이메일, 3열 화주/담당자 변경 버튼, 고정 폭 + 운송구간 row 시작선 정렬(left=89/273/501) | 완료 | 미배치-완료자산 | 세 배치 모두 T7 closeout(7/6~7/7) 계열로 일치. UI 전용(data/API 무변경), completed-ui-only-clos |
| IMPL-D1-003 | 인라인 수정 디자인 통일 기준 — 수정 가능 항목 점선/hover/focus/label 포함 focus를 화주 섹션 기준으로 통일 | 완료 | 미배치-완료자산 | 화주 섹션이 reference 표준으로 완료. 전 섹션 잔여 통일(T7-GAP-004)은 T7-08 보류 — 인접: D8(공통 UI) |
| IMPL-D1-004 | 연락처/이메일 빠른 수정(inline edit) — dialog 없이 same-place input, Enter/blur 반영, Escape 복구 (업체명/사업자번호/담당자명은 dialog 재선택으로만 변경) | 완료 | 미배치-완료자산 |  |
| IMPL-D1-005 | 수정/copy mode — 기존 snapshot summary + visible `변경`(접근성 이름 `화주/담당자 변경`) 진입 버튼 | 완료 | 미배치-완료자산 | source label decision: visible `변경` + aria `화주/담당자 변경` 확정 |
| IMPL-D1-006 | 운송마감 보호 — `flowStatus==="운송마감"` 또는 dispatch `isClosed=true` 시 화주 변경 버튼·빠른 수정 disabled/read-only | 완료 | 미배치-완료자산 |  |
| IMPL-D1-007 | order detail snapshot(`companySnapshot`/`contactUserSnapshot`) → 화주 summary row 초기 매핑 + 상세/수정/복사 진입 시 화주 draft 주입(S2) | 완료 | 미배치-완료자산 | `brokerManagerSnapshot`은 후보 source 제외(AC-F2-012). 인접: D6(드로어 주입 파이프라인) |
| IMPL-D1-009 | 조회 결과 row = `화주 회사 + 화주 측 담당자` 조합, 담당자별 row 분리 | 완료 | 미배치-완료자산 | `배차 담당자`는 화주 측 담당자이며 주선사 내부 담당자 아님(REQ-F2-025) |
| IMPL-D1-011 | dialog 취소/닫기 시 mode별 이전 상태 복구 (신규→CTA, 수정→기존 row) | 완료 | 미배치-완료자산 |  |
| IMPL-D1-013 | 적용된 화주 존재 시 dialog 재오픈 — 해당 화주 담당자 전체 목록 우선 표시 + pending 선택 해제 + 검색 input autofocus | 완료 | 미배치-완료자산 |  |
| IMPL-D1-014 | 담당자 없는 화주 처리 — `담당자 없음` company-only row + preview 담당자 추가 CTA, 담당자 필수 시 apply disabled | 완료 | 미배치-완료자산 | 라벨 `담당자 추가 필요`→`담당자 없음`은 구현 중 정정(충돌 아님, 12-feedback-summary). broker 미연결 master  |
| IMPL-D1-015 | 조회 결과 목록 responsive row/card 전환 — fixed column table 제거, 내부 가로 스크롤 해소, row 내 field label 유지 | 완료 | 미배치-완료자산 | 커밋 해시 근거 (F2 closure polish) |
| IMPL-D1-016 | dialog 접근성/keyboard — focus trap, row 선택, apply disabled, quick edit keyboard 동작 | 완료 | 미배치-완료자산 |  |
| IMPL-D1-030 | 담당자 빠른 등록 — `createShipperContactCandidate`→`createManager`(기존 `POST /api/users` 재사용), 역할 `배차/정산/관리` 멀티 선택(기본 배차), 성공 시 `신규` row 자… | 부분 | 미배치-완료자산 | ★ 추가 검토 후보: 담당자 빠른 등록 카드 — nbbb1 자유텍스트 거래처를 화주 엔티티 체계로 유지 시 필요 |
| IMPL-D1-031 | 담당자 검색/조회 — 검색어 + `조회` 버튼 통합 조회 UX | 완료 | 미배치-완료자산 | 담당자 전용 reload는 IMPL-D1-032로 분리 기각 |
| IMPL-D1-041 | legacy 오더 상세 시트 — 화주/담당자 snapshot·주의사항·상하차 timeline 표시 (read-only) | 완료 | 미배치-완료자산 | legacy 화면 자산(Phase 3 이전 기준선); legacy 자산으로서의 완료. 근거가 통합 전 snapshot 문서 1건. Phase 3 drawer가 대체 중 — 인접: D7 |
| IMPL-D1-042 | legacy `/order/register` — 회사 자동 설정/검색·선택, 담당자 선택 흐름 | 완료 | 미배치-완료자산 | legacy 화면 자산(Phase 3 이전 기준선); legacy 기준선. Phase 3 target과 route 분리 상태 — 인접: D6(전체 등록 흐름) |
| IMPL-D1-043 | legacy `/order/register` — 담당자 추가/검색/reload/전체 reset UI | 부분 | 미배치-완료자산 | legacy 화면 자산(Phase 3 이전 기준선); legacy route 한정 판정. Phase 3에는 담당자 빠른 등록 완료(IMPL-D1-030)로 대체 — route별 차이, 충돌 아님 |
| IMPL-D1-047 | 수정 mode 독립 dialog parity — 화주 dialog 포함 각 섹션 독립 수정 dialog의 list row 선택~apply review 흐름 | 부분 | 미배치-완료자산 | list row 선택부터 apply review까지 QA 잔여. 인접: D6(전 섹션 공통 parity) |
| IMPL-D2-001 | 운송구간 섹션(`#sec-route`) — 상차/하차 독립 row(empty/partial/applied), placeholder 교체, F1 shell 2번째 full-width 위치 | 완료 | 미배치-완료자산 | P09 F3 패키지 implementation-sync(release checklist 전 gate [x])가 E1-26/P07-07의 계획만  |
| IMPL-D2-002 | `상차지 변경`/`하차지 변경` side별 CTA | 완료 | 미배치-완료자산 | 단일 근거, 충돌 없음 |
| IMPL-D2-005 | 운송마감 read-only 보호 — `flowStatus==="운송마감"`/`isClosed` 시 주소 변경·inline edit 차단 + 사유 표시 | 완료 | 미배치-완료자산 | F2 화주 섹션과 동일 잠금 정책 |
| IMPL-D2-006 | 운송구간 responsive/접근성 — 모바일 2열 요약형 row, 후보 row aria-selected/arrow·Home·End focus, condition trigger aria | 완료 | 미배치-완료자산 |  |
| IMPL-D2-007 | route row compact UI — 1열/2열/3열 grouping(`route-main-fields`/`route-meta-fields`/`route-row-actions`) + 52px rail 정렬 + 상세주소·조건 필드 … | 완료 | 미배치-완료자산 | UI 전용 변경. 36-t7-closeout(07-07)이 완료 확정 |
| IMPL-D2-009 | disabled/locked field 안내(수정 가능 필드 정책) — 운송구간·수정 mode 전반 | 부분 | 미배치-완료자산 | 스타일·클릭 제한은 있으나 legacy edit lock 안내와 불일치. 이후 closeout 갱신 없음 → 부분 유지. 인접 도메인: D6(폼 |
| IMPL-D2-017 | query 없는 open 기본 후보 — 선택 화주 등록/최근 주소 즉시 표시, Kakao는 query 입력 후 호출 | 완료 | 미배치-완료자산 |  |
| IMPL-D2-019 | source별 preview mode — `화주 등록` label-first(수정 click 후 입력), `Kakao` form-first(즉시 보강 입력), 행정주소 readonly + `검색으로만 변경` 안내 | 완료 | 미배치-완료자산 |  |
| IMPL-D2-023 | 화주 등록 후보 `수정 저장` checkbox — 보강 필드 변경 시에만 `/api/addresses/[id]` PUT, 변경 없으면 disabled | 완료 | 미배치-완료자산 |  |
| IMPL-D2-024 | 주소 후보 row/preview compact 표시 — 도로명·지번 2-line(primary 굵게 + secondary muted) + 선택 preview readonly `주소` 입력 박스 제거 | 완료 | 미배치-완료자산 | 문서 자체가 기획+당일 반영 sync 겸용 |
| IMPL-D2-025 | 상/하차지명 직접 입력 필드화 + Kakao place_name 없을 때 주소로 대체 금지 | 완료 | 미배치-완료자산 |  |
| IMPL-D2-027 | 검색어 유형별(도로명/지번) primary·secondary 표시 우선순위 휴리스틱(display-only) | 완료 | 미배치-완료자산 | Kakao `address_type` 운영 실값 확인은 잔존 과제(12#13) |
| IMPL-D2-028 | 주소 검색 상단 source hint chip(최근/화주등록/Kakao) | 부분 | 미배치-완료자산 | 코드 검증(07-09): source chip은 후보 행 단위로 구현됨. 다이얼로그 상단(헤더/검색바 1187-1226행)에는 별도 hint c |
| IMPL-D2-041 | 일시/방법 condition cell — route row 빠른 조건 변경 + 주소 dialog preview 조건 카드(공용 draft), 수정 drawer 상차일시 inline list·상하차 방법 inline 선택 적용 | 완료 | 미배치-완료자산 | ★ 추가 검토 후보: 상하차 일시/방법 quick condition cell — nbbb1 폼에 상하차 방법(지게차 등) 입력 자체가 없음(기획 누락 가능) |
| IMPL-D2-042 | 방법(상하차 방법) 기본값 `선택안함` — 지게차 기본 선택 제거 | 완료 | 미배치-완료자산 | 사용자 피드백 반영 보정 |
| IMPL-D2-046 | 거리/기준금액 recalc notice — 주소 변경 후 `확인 필요`/stale read-only 표시(자동 계산 없음) | 완료 | 미배치-완료자산 | 표시만 F3 범위. 자동 계산은 IMPL-D2-048로 별도 실현 |
| IMPL-D2-047 | 저장된 거리 표시 — 기존 오더 snapshot `estimatedDistance*` → `supportDraft.routeMap` 변환 → header distance chip/drawer 표시 | 완료 | 미배치-완료자산 | 거리 '계산' provider와 별개의 저장값 표시 경로 |
| IMPL-D2-048 | Header distance chip live 거리 자동 계산 — 좌표 완성+route key 변경 시에만 `DistanceClientService` → `POST /api/distance/calculate` 1회 호출(route-c… | 완료 | 미배치-완료자산 | ★ 추가 검토 후보: 좌표 완성 시 거리 자동 계산(1회 guarded) — nbbb1 폼/헤더에 거리·예상시간 노출 후보 |
| IMPL-D2-057 | 거리 fallback 상태 구분 UI 체계(missingCoordinates/providerDisabled/quotaLimited/error) | 부분 | 미배치-완료자산 | 기초 3상태 표기만 구현, 4분류 상태 체계 UI는 미구현 |
| IMPL-D2-059 | Header route chip 거리+기준금액 compact 최종형(S7/S10 합류 후) | 부분 | 미배치-완료자산 | 코드 검증(07-09): header chip은 거리 실값(distance-api 또는 supportDraft.routeMap snapshot) |
| IMPL-D2-062 | Support map 탭 read-only fallback — `supportDraft.routeMap` snapshot 우선, 없으면 `routeDraft` 좌표 기반 표시(거리·마커, provider call 없음) | 완료 | 미배치-완료자산 | ★ 추가 검토 후보: 경로 지도 read-only 표시 — nbbb1 우측 추천 패널의 지도 모드 후보 |
| IMPL-D2-066 | legacy `/order/register` 주소록 선택·날짜/시간·거리 계산(기준선) | 완료 | 미배치-완료자산 | legacy 화면 자산(Phase 3 이전 기준선); Phase 3 콘솔과 route 분리된 legacy 기준선. Phase 3 이관 대상 비교용 |
| IMPL-D2-067 | legacy Kakao 주소 직접 검색 trigger | 부분 | 미배치-완료자산 | legacy 화면 자산(Phase 3 이전 기준선); legacy 한정 gap. Phase 3 콘솔에서는 완료(IMPL-D2-012)로 해소 — route별 차이이며 충돌 아님 |
| IMPL-D2-068 | 신규 flow wizard route 연계 — 상차 apply 후 하차 단계, 하차 apply 후 운송+품목 단계 안내(sequential advance) | 완료 | 미배치-완료자산 | wizard 구조 종속 — nbbb1 상시 폼에서는 재검토 필요; 인접 도메인: D6(wizard 단계 구조). route apply가 단계 전이를 트리거하는 연계 부분만 D2 등재 |
| IMPL-D3-001 | 화물 정보 섹션 (`BrokerOrderCargoTransportSection`, `#sec-cargo-transport`) — placeholder 교체, empty CTA row(`톤수, 차종, 품목을 입력하세요` + `운송+품목… | 완료 | 미배치-완료자산 | E1-27 계획·B1-15 부분(6/29)을 F4A 패키지 구현(P10, 6/25~26)과 S8 closeout(P23 p3-complete,  |
| IMPL-D3-002 | `운송 + 품목 입력` 다이얼로그 — 좌측 최근 사용 조합 + 우측 1열 입력폼, dialog-first 수정(적용 완료 행 클릭 시 기존 값 보존 오픈), 취소 시 이전 row/draft 유지 | 완료 | 미배치-완료자산 | 초기 row-only 구현이 partial 판정 후 dialog-first로 보정 완료(P10 12-feedback-summary). S8(P2 |
| IMPL-D3-006 | 톤수/차종/품목 inline 수정 — 점선/hover/focus 수정 affordance(화주·상하차 섹션과 통일), 적용/취소/dirty 표시 | 완료 | 미배치-완료자산 | 13-post-qa-sync(7/3)가 커밋 근거로 완료 확정. Wave6 QA(7/1)와 일치 — 충돌 없음 |
| IMPL-D3-007 | 화물 적용 완료 compact row — `applyCargo()` 후 `.irow--cond`(톤수·차종)/`.irow--item`(품목) 요약 표시, 빈 상태와 구분, 적용 후 대수·실중량 미노출 | 완료 | 미배치-완료자산 | F4A 구현 + S8 parity 재확인 |
| IMPL-D3-017 | 운송마감/잠금(closed/disabled) 상태에서 화물 입력·수정 트리거 비활성 + 사유 안내 | 부분 | 미배치-완료자산 | 코드 검증: 부분 확인. 컴포넌트 레벨은 disabled + 사유 title 툴팁 구현·테스트 완료. 그러나 실제 콘솔 wiring(worksp |
| IMPL-D3-018 | 화물정보 왼쪽 label rail(52px) 정렬 통일 | 부분 | 미배치-완료자산 | 17-integration-diff-matrix가 confirmed-partial(visual screenshot 확인 후속)로 남김. T7 U |
| IMPL-D3-023 | legacy 상세 시트 화물 정보 편집 form (`BrokerOrderInfoEditForm`) | 부분 | 미배치-완료자산 | legacy 화면 자산(Phase 3 이전 기준선); form/zod validation은 있으나 진입 trigger·실제 update API 연결 미확인 — dead branch 후보. 이후 문서 |
| IMPL-D4-002 | legacy ChargeDialog 인수증 운임 입력/수정 (Quick/Advanced 모드, 청구/배차 분리 패널, `/api/charge/with-lines` 저장, charge group 재조회, dirty confirm, pa… | 완료 | 미배치-완료자산 | legacy 화면 자산(Phase 3 이전 기준선); 세 배치 판정 일치. sheet-level/card 내부 state owner 이중화 gap 지적(E2-70)은 개선 후보로만 남음 |
| IMPL-D4-003 | legacy 선착불 정산 입력 (BrokerPrepaidChargeForm — 선불/착불, 수수료, fee≤0 시 memo 필수, `readOnly=isLocked`) | 완료 | 미배치-완료자산 | legacy 화면 자산(Phase 3 이전 기준선); 판정 일치 |
| IMPL-D4-006 | 화주 화면 인수증 발급 버튼 | 부분 | 미배치-완료자산 | toast stub만 존재. broker 정산 증빙과 별개 기능 — 인접: 화주 화면 도메인 |
| IMPL-D4-007 | 사후등록 오더 증빙 확인 화면 (entry-compliance EvidenceTable, read model) | 완료 | 미배치-완료자산 | RECEIPT 정산 증빙과 다른 도메인의 증빙 read — 존재 확인 수준. 인접: 대시보드 도메인 |
| IMPL-D4-008 | 정산 정보 섹션 shell (`#sec-cargo-money`, `BrokerOrderSettlementSection` route-local 신설) + 정산 CTA/공통 정산 dialog shell open/close | 완료 | 미배치-완료자산 | E1-28(계획만, 06-22)을 F4B 14-sync(06-25 구현)가 갱신 |
| IMPL-D4-015 | Applied summary — draft projection money row (인수증: 결제방법/청구/운송비/수익, 선착불: 금액/수수료/수익) | 완료 | 미배치-완료자산 | F5 전 draft projection, `API 통신 전 단계` label로 저장값과 구분 |
| IMPL-D4-016 | 신규 접수 정산 empty state — 신규 default draft는 applied summary 제외, `정산 정보 입력` empty CTA | 완료 | 미배치-완료자산 | 40(07-08) 통합 branch smoke까지 유지 확인 |
| IMPL-D4-032 | side effect 실패 시 drawer 유지 + side-effect-only retry (`registerOrder`/`updateOrder` 재호출 금지) + partial save guard | 완료 | 미배치-완료자산 | 중복 오더 생성 방지 목적 |
| IMPL-D4-036 | settlementSideEffect blocked operation 분리 표시 — submit gate에서 정산 plan 존재 시 사용자 확인 필요 operation으로 표시 | 완료 | 미배치-완료자산 | P20-25의 미구현 서술은 S5 UI spec 한정 — gate 표시는 S4에서 구현 완료. 인접: D-제출 도메인 |
| IMPL-D4-041 | 정산 dialog dirty close parity — 취소/ESC/open change 시 ConfirmCloseDialog 경유, 입력값 보존 (open 시점 draft baseline) | 완료 | 미배치-완료자산 |  |
| IMPL-D4-042 | 바깥 클릭 dirty close + nested alertdialog guard | 완료 | 미배치-완료자산 |  |
| IMPL-D4-043 | draft 적용 pending affordance — `정산 조건 적용 중` spinner/`aria-busy`, 취소 비활성, 중복 적용 차단 | 완료 | 미배치-완료자산 |  |
| IMPL-D4-046 | 견적 입력 진입 정책 parity — `견적 정보 입력하기` CTA, locked disabled, 운송요청 차단 toast, RECEIPT/PREPAID 분기 (`handleOpenQuoteDialog` 상당) | 부분 | 미배치-완료자산 | 코드 검증: 부분 — 진입 CTA + locked disabled + RECEIPT/PREPAID 분기는 구현·테스트됨. 그러나 (1) 운송요청 |
| IMPL-D4-047 | RECEIPT 수정 가능 guard parity — `useEditableCheck`(isClosed/isCanceled/운송요청) 수정 불가 + `disableReason` 안내 | 부분 | 미배치-완료자산 | 코드 검증: 부분 — Phase 3 정산 섹션은 useEditableCheck 미사용, lock은 new-order 위저드 step lock뿐. |
| IMPL-D4-048 | RECEIPT 초기 포커스 panel parity — 청구/배차 진입 위치별 `initialFocusPanel`/`mobileActivePanel` | 부분 | 미배치-완료자산 | 코드 검증: 부분 — 진입 위치별(청구 vs 배차) 전달 경로 미구현, 진입은 단일 '정산 정보 입력/수정' 버튼뿐이라 항상 기본값 charge |
| IMPL-D4-054 | 보조 정보 금액 로그 탭 read-only 모델 + empty fallback (`supportDraft.amountLogs` normalize) | 완료 | 미배치-완료자산 | ★ 추가 검토 후보: 금액 로그 read-only 탭 — 정산 변경 이력 노출 후보 |
| IMPL-D5-023 | 배차 담당자 chip — 표시 전용(display-only/read-only/unassigned state, `role=status`, 접근성 이름) | 완료 | 미배치-완료자산 | S3 audit(부분)·S1 coverage(계획만)를 S7 closeout+13-post-qa가 완료로 갱신. 인접 도메인: 헤더 ops |
| IMPL-D5-027 | 화물맨(Logishm) 공유 status read — `GET /api/integrations/logishm/status/[orderId]` reuse adapter + 상태별 badge/notice(NOT_SHARED/SHARING… | 완료 | 미배치-완료자산 | backend 무변경 read-only 재사용. P13(UI state만) → P12(실제 read 연결)로 갱신 |
| IMPL-D5-036 | 화물맨 상태별 차주 섹션 UI — 상태 뱃지 개선, 상태 안내 중복 제거, 연동중(SHARING/registering) 차량 입력 숨김+`연동 취소` 표시, dispatchReady(SHARED+proposals) 요약 행+`배차 적… | 완료 | 미배치-완료자산 | ★ 추가 검토 후보: 화물맨 상태별 차주 섹션 UI(뱃지·연동중 잠금·배차 적용) — nbbb1이 배차 연동을 다루면 필수 자산 |
| IMPL-D5-037 | 화물맨 연동 실패 시 명시 retry UI/action (failed 상태 재시도 버튼) | 완료 | 미배치-완료자산 | 코드 검증(2026-07-09): workspace shell retry와 별개로 차주 섹션 전용 retry UI 존재. 버튼 라벨은 '재시도' |
| IMPL-D5-040 | 신규 접수 차주 섹션 노출 + `화물맨 연동` 체크 기본 ON / 복사 접수 기본 OFF (저장 전 로컬 intent만, 외부 호출 없음) | 완료 | 미배치-완료자산 | new, new 모드는 화주 미선택 시 잠금+사유 문구), `broker-order-driver-section.tsx:439-442`(idle+ |
| IMPL-D5-044 | 다이얼로그 selected preview 적용 전 수정 — 차주명/차량번호 read-only, 톤수/차종/배차콜센터만 수정, `차주/차량 원본 정보도 함께 수정` 체크(driver master `updateDriverMasterFie… | 완료 | 미배치-완료자산 | master 원본 배차콜센터 저장은 schema 부재로 미구현 확정 |
| IMPL-D5-046 | SHARING(연동중) 상태 취소 정책 — provider cancel 성공 확인 전 완료 UI 금지, 미지원 시 local cancel-intent/backend policy 분리 (CM-SVC-02) | 완료 | 미배치-완료자산 | 코드 검증(2026-07-09): SHARING 취소 차단이 UI·클라이언트 adapter·도메인 3층에 구현. 'CM-SVC-02' 식별자는  |
| IMPL-D5-055 | Legacy 상세 시트 화물맨 연동 — LogishmShareCard: 공유 등록/정보 수정/공유 취소/재오픈/접수시간 변경/cancel ack 실제 mutation | 완료 | 미배치-완료자산 | legacy 화면 자산(Phase 3 이전 기준선); Phase 3 신규 범위(scope)와 별개의 기존 자산. reopen 계획에서 회귀 테스트 대상 |
| IMPL-D5-059 | Legacy 차주/차량 정보 표시 + 기존 배차 수정 dialog + 신규 배차 입력 CTA + 차주 검색/선택/임시 차주 등록/`assignDriver` 저장 | 완료 | 미배치-완료자산 | legacy 화면 자산(Phase 3 이전 기준선); isLocked/운송요청 guard 포함. 취소건 안내 문구 명칭 gap 존재(legacy) |
| IMPL-D5-060 | 수정/상세 화면 명시 `화물맨 연동` 클릭 시 register 즉시 호출 (저장 후처리 register와 별개 경로) | 완료 | 미배치-완료자산 | 코드 검증(2026-07-09): 저장 후처리 register(workspace-shell.tsx:638)와 별개로 명시 클릭 경로 존재 |
| IMPL-D5-062 | wizard 등록 확인(required-complete) 다이얼로그에 화물맨 연동 ON/OFF 표시 | 완료 | 미배치-완료자산 | wizard 구조 종속 — nbbb1 상시 폼에서는 재검토 필요; 코드 검증(2026-07-09): 구현 확인 |
| IMPL-D5-063 | `FAILED+ordernum`(외부 등록 여부 불명확) 잠금 동작 — 자동 재시도/local 초기화/자동 cancel 금지, 운영 확인 안내만 표시 | 완료 | 미배치-완료자산 | 코드 검증(2026-07-09): 표시 UI뿐 아니라 재시도/자동 cancel 차단이 UI·adapter 양층에 구현 확인 |
| IMPL-D5-065 | 모바일 차주 섹션 action row 보정 — `hm-actions` wrapper, checkbox label 세로 깨짐 수정 | 완료 | 미배치-완료자산 | preview review에서 발견 후 당일 수정 |
| IMPL-D6-007 | wizard process panel UI + step 상태 표시 (complete/current/optional/wait, aria-current, data-state) | 완료 | 미배치-완료자산 | wizard 구조 종속 — nbbb1 상시 폼에서는 재검토 필요; 23-wave7(07-02) '구현이 문서를 앞섬' 판정이 S9 decision-only(06-30)·S12 보류 판정을 갱신. 32(07-03 |
| IMPL-D6-008 | section step highlighting + section locking (`data-new-order-step-state`, wait 상태 section disabled) | 완료 | 미배치-완료자산 | Wave 7 inventory 단독 근거, 충돌 없음 |
| IMPL-D6-009 | wizard 중 actionbar 제어 — 시작 전 `신규 접수`만 노출, wizard 활성 중 actionbar 숨김 | 완료 | 미배치-완료자산 | wizard 구조 종속 — nbbb1 상시 폼에서는 재검토 필요; 충돌 없음 |
| IMPL-D6-010 | section dialog wizard shell (`dialog--new-order-wizard` + process panel 삽입) + sequential step advance (shipper→load→unload→cargo→m… | 완료 | 미배치-완료자산 | wizard 구조 종속 — nbbb1 상시 폼에서는 재검토 필요; 충돌 없음 |
| IMPL-D6-011 | required-complete dialog ('필수 입력 완료'/'화물 등록 완료' 분기) + main apply branch (newOrderSubmitted=true, actionbar 복귀) | 완료 | 미배치-완료자산 | wizard 구조 종속 — nbbb1 상시 폼에서는 재검토 필요; 23-wave7(07-02) 구현 확인이 06-29~30 보류 판정을 갱신. HiFi '차주 정보로 이동' branch는 미채택(IMPL-D6- |
| IMPL-D6-023 | mode별 오더 작업 버튼 matrix — new: `화물 등록`만 / copy: `신규 접수`+`화물 복사` / edit·detail: `신규 접수`+`화물 수정`+`배차 취소`+조건부 `운행 마감`; required-field 전… | 완료 | 미배치-완료자산 | 14-delta(07-01) R11 browser QA가 P19의 개별 버튼 보류(06-29)를 mode matrix 완료로 갱신. `조회`는  |
| IMPL-D6-024 | copy 모드 저장 — source order 초기값 매핑 + `신규 접수` 클릭 시 빈 신규 reset, 저장은 `registerOrder` 신규 생성 | 완료 | 미배치-완료자산 | NP1(06-30~07-01)이 06-26~29 부분/계획 판정을 완료로 갱신. copy 시 driver/support 제외 정책은 P17-07 |
| IMPL-D6-033 | 필수 입력 오류 안내 정리 — 반복 reminder 대신 actionbar validation 표시로 축소 채택; 정적 오류 affordance·첫 오류 focus·focus ring은 gate 대기 | 부분 | 미배치-완료자산 | wizard 구조 종속 — nbbb1 상시 폼에서는 재검토 필요; P24(06-30)+T5(07-03) 판정: 기존 S4 blocking 표시가 기준, 반복 glow/sweep는 기각, 정적 affordance |
| IMPL-D6-034 | wizard 접근성 상세 — keyboard flow, focus return, screen reader copy, reduced motion | 부분 | 미배치-완료자산 | wizard 구조 종속 — nbbb1 상시 폼에서는 재검토 필요; aria-current/aria-busy 등 기본 속성은 구현·검증, 전체 keyboard/SR QA 미완 |
| IMPL-D6-037 | legacy `/order/register` standalone 등록 흐름 (회사 자동 설정, 담당자, 최근 화물, 주소록, 날짜/시간, 거리 계산, 운송 옵션, 제출 validation, `POST /orders`) | 완료 | 미배치-완료자산 | legacy 화면 자산(Phase 3 이전 기준선); Phase 3 target과 route 분리된 legacy 기준선. nbbb1 매핑 시 Phase 3 drawer 흐름과 혼동 주의 |
| IMPL-D6-041 | compact 오더 요약 — F5 summary aggregator, F4A apply 후 화물/품목/비고 표시 (`sec-summary`, 예: `1톤 · 카고`, `파손주의`) | 완료 | 미배치-완료자산 | F5 summary가 aggregator, F4A/F4B/F4C가 candidate producer(P01 04#Gate3). full sect |
| IMPL-D7-006 | 보조 정보 숨김 시 2열 레이아웃 점유 최적화 (화물정보/정산/오더요약/차주 배치, USER-ADD-001) | 부분 | 미배치-완료자산 | 코드 검증(07-09): compact 처리(720px cap CSS + data attr + 테스트) 존재하나 panelMode==='new' |
| IMPL-D7-008 | dialog scroll owner 정규화 (wizard/shipper/route/cargo/settlement dialog nested scroll/clipping 정리, T7-GAP-003) | 부분 | 미배치-완료자산 | wizard 구조 종속 — nbbb1 상시 폼에서는 재검토 필요; wizard dialog는 QA 통과, driver/settlement dialog는 인증 상태 미확보로 미확인 — clipping 재현 시에만 |
| IMPL-D7-009 | mobile dialog footer stacking 통일 (T7-GAP-009) | 부분 | 미배치-완료자산 | wizard footer만 확인됨 |
| IMPL-D7-010 | 섹션 간 inline 수정 affordance 디자인 통일 (점선 rail/hover/focus-visible, 전 섹션) | 부분 | 미배치-완료자산 | 화주/화물/운송구간 통일은 구현됨. T7(07-07) 기준 driver/settlement 차이가 잔존해 부분 — 새 결함 증거 확인 시에만 s |
| IMPL-D7-024 | 우클릭 context menu (상세/배차 복사/화물 수정) + Radix onSelect 안정화 | 완료 | 미배치-완료자산 | ★ 추가 검토 후보: 목록 우클릭 context menu(상세/배차 복사/화물 수정) — nbbb1 목록 조작 가속 |
| IMPL-D7-032 | waiting tab row click = selection toggle 유지 (상세 진입은 non-waiting row/context action 분리) | 완료 | 미배치-완료자산 |  |
| IMPL-D7-036 | mode별 오더 작업 버튼 matrix (신규:`화물 등록`/복사:`신규 접수`+`화물 복사`/수정·상세:+`배차 취소`·조건부 `운행 마감`) + actionbar safety(미구현 action disabled/deferred) | 완료 | 미배치-완료자산 | 14-delta(07-01) Wave6 browser QA가 S4(06-29) disabled 보류 판정을 완료로 갱신. 버튼이 트리거하는 취소 |
| IMPL-D7-039 | legacy 상세 sheet loading/error UI (재시도/닫기) | 부분 | 미배치-완료자산 | legacy 화면 자산(Phase 3 이전 기준선); gap이 문서에 남은 채 이후 갱신 기록 없음 |
| IMPL-D7-040 | legacy 화물번호 short id 표시/UUID 복사 | 부분 | 미배치-완료자산 | legacy 화면 자산(Phase 3 이전 기준선); 이후 갱신 기록 없음 |
| IMPL-D7-041 | legacy 변경 이력 표시 (`BrokerOrderChangeLog`) | 완료 | 미배치-완료자산 | legacy 화면 자산(Phase 3 이전 기준선) |
| IMPL-D7-047 | 배차 담당자 chip — 표시 전용 (display-only/read-only/unassigned state, `role=status`, 접근성 이름) | 완료 | 미배치-완료자산 | S7 p3-complete(06-30, 커밋 bdff1544)·13-post-qa(07-03)가 S3 audit(06-29 부분)을 완료로 갱신 |
| IMPL-D7-049 | `Aa` 라벨 표시/숨김 토글 (aria-pressed, tooltip, `data-label-visibility`, sr-only 접근성 유지, keyboard) | 완료 | 미배치-완료자산 | ★ 추가 검토 후보: Aa 라벨 표시/숨김 밀도 토글 — 고밀도 콕핏 UI인 nbbb1과 궁합 |
| IMPL-D7-053 | F7 보조 정보 메모 탭 (Phase 3 route-local: no-order empty/loading/error/data 상태, 목록·생성·수정·삭제 confirm, HiFi 대응 toolbar/summary badge/compa… | 완료 | 미배치-완료자산 | ★ 추가 검토 후보: 오더 메모 CRUD 탭(F7) — nbbb1 상세/보조 영역에 메모 기능 부재 |
| IMPL-D7-062 | 지도 탭 read-only fallback (`supportDraft.routeMap` snapshot 우선/`routeDraft` 좌표 fallback, provider call 없음, `estimatedDistance*`→rout… | 완료 | 미배치-완료자산 | S10 구현(06-30, 74b2bfdc)+31/32 closeout(07-03)이 fallback 범위 완료로 고정. live provider |
| IMPL-D7-065 | memo tab 접근성 (role=tabpanel, aria-live, row aria-label, dialog title/description 연결) | 완료 | 미배치-완료자산 | 코드 검증(07-09): 완료 확인. role="tabpanel"은 memo tab 파일 명시가 아니라 Radix Tabs primitive 렌 |
| IMPL-D8-008 | 인라인 수정 affordance 디자인 통일 — 수정 가능 항목 점선 rail/hover/focus-visible/label 포함 focus를 화주·운송구간·화물·차주·정산 전 섹션에 일관화 | 부분 | 미배치-완료자산 | 화주·화물·운송구간에는 적용 완료. T7 closeout(07-07, 최신)이 driver select cell hover 부재·settleme |
| IMPL-D8-011 | 저장 중 pending feedback — submit spinner, disabled, `aria-busy`, `data-submit-pending`, 중복 submit 차단 (기능적 animation) | 완료 | 미배치-완료자산 | wizard 구조 종속 — nbbb1 상시 폼에서는 재검토 필요; Wave 7 구현(07-02) 후 T5(07-03)·35(07-06)·13-sync(07-03)가 모두 완료 재확인. 인접 도메인: 저장/sub |
| IMPL-D8-015 | required action 정적 affordance + first focus ring — 오류 안내 정적 표시, 첫 오류 focus, `aria-describedby`/`role=status` | 부분 | 미배치-완료자산 | wizard 구조 종속 — nbbb1 상시 폼에서는 재검토 필요; 코드 검증(2026-07-09): role=status 정적 affordance는 구현, per-field aria-describedby는 정산 |
| IMPL-D8-023 | legacy AI 등록 자산 — AI 입력 패널(`broker-order-ai-register-panel`), AI 추출/적용 훅(useAiExtract/useAiToFormMapper/useAiApplyStore/useAiApply… | 완료 | 미배치-완료자산 | ★ 추가 검토 후보: AI 텍스트 → 폼 자동입력 패널(Phase 1/2 자산). nbbb1 좌측 상시 폼과 결합 시 입력 가속 극대화 |
| IMPL-D8-032 | 섹션/다이얼로그 접근성 기본 구현 — dialog focus trap, row aria-selected/arrow·Home·End 이동, `aria-pressed`/tooltip, sr-only 라벨 유지, CurrencyInput … | 완료 | 미배치-완료자산 | 각 섹션 패키지에 분산 구현된 접근성 자산의 횡단 취합. 인접: 각 섹션 도메인(D2~D5)·D6(헤더/drawer) |
| IMPL-D8-033 | wizard 접근성 상세 — keyboard flow, focus return, screen reader copy, reduced motion QA | 부분 | 미배치-완료자산 | wizard 구조 종속 — nbbb1 상시 폼에서는 재검토 필요; aria-current/data-state 구현은 확인, 나머지 keyboard/SR/reduced motion QA는 미수행으로 남음. 인접: |
| IMPL-D8-034 | 보조 정보 memo tab 접근성 — role=tabpanel, aria-live, row aria-label, dialog title/description 연결 | 완료 | 미배치-완료자산 | 코드 검증(2026-07-09): 4개 항목 모두 구현 확인. 다만 `__tests__/broker-order-support-memo-tab.t |
| IMPL-D8-041 | 사후등록 오더 증빙 확인 화면 (entry-compliance EvidenceTable, 콘솔 외 대시보드 read model) | 완료 | 미배치-완료자산 | RECEIPT 정산 증빙과 다른 도메인의 기존 read model. 존재만 확인됐고 상세 구현 범위는 문서로 판단 불가 — catch-all 등 |
| IMPL-D8-042 | dialog scroll owner/clipping 정규화 (T7-GAP-003) — wizard/shipper/route/cargo/settlement dialog의 nested scroll·clipping 정리 | 부분 | 미배치-완료자산 | wizard 구조 종속 — nbbb1 상시 폼에서는 재검토 필요; 36-t7-closeout(07-07, 최신)이 wizard dialog는 통과·driver/settlement dialog는 실제 open 가 |
| IMPL-D8-044 | mobile dialog footer stacking 통일 (T7-GAP-009) | 부분 | 미배치-완료자산 | wizard footer는 확인 완료, 나머지는 인증 edit flow 확보 후 확인 잔여. clipping 확인될 때만 QA 전용 |
| IMPL-D8-046 | 정산 applied row overflow 정리 (T7-GAP-002) — 긴 금액/label의 내부 scroll/clipping 제거 | 부분 | 미배치-완료자산 | 인증 세션/seeded edit order 확보 후 smoke 필요. T7 UI polish gate 소관이라 D8 등재 — 인접: 정산 도메인 |

## 2. 미배치-보류기각 (95건) — 배치 불필요 (참고 목록)

| ID | 기능 | 상태 | 분류 | 비고 |
|---|---|---|---|---|
| IMPL-D1-018 | 로그인 사용자 기반 회사(화주) 숨은 자동 설정 | 기각 | 미배치-보류기각 | R1-06 '부분(유사 구현)'은 명시 선택 UX 존재를 지칭 — S12 closeout(P28/P28b)이 기각으로 확정. 명시 선택 UX 유 |
| IMPL-D1-021 | master 후보 검색 route의 운영 승격 (security review 포함) | 보류 | 미배치-보류기각 | 운영 승격 전 security review 필요 결정(F2 closure 6/23). 이후 closeout에 갱신 기록 없음 |
| IMPL-D1-022 | 운영/공유 통합 화주+담당자 검색 API (backend 신설) | 보류 | 미배치-보류기각 | F5/API strategy에서 필요성 재판단 결정. 재개 기록 없음 |
| IMPL-D1-023 | 최근 화주 Top 5 전용 backend API | 보류 | 미배치-보류기각 | 기존 `/api/orders/with-dispatch` 조합으로 1차 충족 판정. 30번 closeout(7/3)도 기존 source 유지 고정 |
| IMPL-D1-026 | recent scope 확장/masking preference 저장/recent 삭제·숨김 UI (organization-wide recent 포함) | 보류 | 미배치-보류기각 | B3-26 기각 표기와 B2-32/P28-04 보류가 동일 근거(NP-S12-003 "별도 gate 전 금지")를 인용 — gate-blocke |
| IMPL-D1-027 | 개인정보/연락처 마스킹 정책 (화주 섹션·dialog 표시 필드, 후보 list 연락처 부분 마스킹) | 보류 | 미배치-보류기각 | 기존 snapshot 표시 수준 유지, security/privacy decision 대기. 인접: D2(P09-33 route 표시 정책 de |
| IMPL-D1-032 | 담당자(manager) 전용 reload 버튼/상태 | 기각 | 미배치-보류기각 | 6/26 gap board 결정을 S12 closeout(7/3)이 고정. 재개 조건: 통합 조회 UX 부족하다는 제품 결정 |
| IMPL-D1-033 | 담당자 중복 검사 고도화 (이름/연락처/이메일 중복 정책) | 보류 | 미배치-보류기각 | 별도 UX/API hardening 패키지로 이관 결정. submit gate에서의 권한/중복 validation 확인 과제로 반복 언급 |
| IMPL-D1-034 | 담당자 수정/상태변경/삭제 및 기존 담당자 역할 변경 UX | 보류 | 미배치-보류기각 | 별도 담당자 관리 UX 패키지로 이관 결정 |
| IMPL-D1-035 | 담당자 빠른 등록 기본 password(`password1234`) fallback 정책 재검토 | 보류 | 미배치-보류기각 | 운영/보안 결정 deferred — high 리스크로 기록됨 |
| IMPL-D1-036 | 신규 담당자 생성 전용 API | 기각 | 미배치-보류기각 | 기존 API 재사용으로 대체 결정 (F2 결정 문서) |
| IMPL-D1-037 | 사업자번호 실제 검증 API (현재는 형식 표시만) | 보류 | 미배치-보류기각 | 후순위 validation package로 이관 |
| IMPL-D1-038 | 주선사 내부 배차 담당자 선택/배정 (화주 측 담당자와 별개) | 기각 | 미배치-보류기각 | S7 closeout 계열(6/30~7/3) 기각이 F2 계획 문서의 보류(P08-28)를 갱신. 헤더 chip 표시 전용 구현 자체는 S7/D |
| IMPL-D1-044 | AI 추출 결과를 화주 섹션에 적용 (F6) | 보류 | 미배치-보류기각 | F6 전체가 USER-DEC-002로 next-phase 보류 확정 — closeout 계열(7/1~)이 P08-31 '계획만'을 보류로 갱신. |
| IMPL-D1-045 | 화주 선택 후 메모/주의사항 표시 (Phase 3 화주 섹션/보조 정보 연계) | 계획만 | 미배치-보류기각 | 코드 검증: 미구현 확인 (2026-07-09). F7 memo tab은 order 단위 메모 전용이 맞음. 화주 단위 주의사항 API/lega |
| IMPL-D2-029 | 지번-only 후보 주소록 저장 dedup/idempotency 정책 | 계획만 | 미배치-보류기각 | 코드 검증(07-09): 미구현 확인. roadAddress 있는 주소의 idempotent 등록(LOADING-05 advisory lock) |
| IMPL-D2-032 | 주소 검색 dialog 초기 자동 후보 로딩 지연 개선(UX/API) | 계획만 | 미배치-보류기각 | 코드 검증(07-09): 미구현 확인. 자동 검색 + 스피너 + per-source timeout은 있으나 prefetch/skeleton 등  |
| IMPL-D2-035 | 신규 주소록 backend/API/schema 변경 | 기각 | 미배치-보류기각 | F3 결정(2026-06월)으로 기존 API 재사용 확정. 이후 번복 없음 |
| IMPL-D2-036 | 수동 입력 주소 선등록(`AddressService.createAddress`) 경계 결정 | 보류 | 미배치-보류기각 | 주소 중복/권한/좌표 리스크로 결정 자체가 미결 |
| IMPL-D2-051 | Broker UI용 거리 quota/error 표시(사용량/오류 상태 UI) | 보류 | 미배치-보류기각 | quota source 자체가 미해결(platform admin stats는 부적합 판정). provider gate(DR-MAP-001~003 |
| IMPL-D2-052 | 거리/duration의 order field persistence(draft-only vs DB 저장) | 보류 | 미배치-보류기각 | 정책 결정 전 금지선으로 일관 |
| IMPL-D2-053 | 거리 기반 기준금액(base amount) 산출(운임 산식/요율) | 보류 | 미배치-보류기각 | pricing source 미확인 + "distance에서 임의 추론 금지"(P21-16). 인접 도메인: D4(정산) |
| IMPL-D2-054 | 별도 수동 `거리 계산` 실행 버튼 | 기각 | 미배치-보류기각 | P21-10 비고의 '차단 vs 보류' 표현차는 사용자 결정(버튼 미채택)으로 기각 확정. 재개는 별도 제품 결정 필요 |
| IMPL-D2-055 | 클라이언트 직접 Kakao directions 호출 / 두 번째 distance provider 추가 | 기각 | 미배치-보류기각 | 기존 server chain 단일 경로 확정 |
| IMPL-D2-056 | platform admin `/api/kakao/usage-stats`를 broker UI quota source로 사용 | 기각 | 미배치-보류기각 | usage-stats API 자체는 기존 완료 자산 — broker 콘솔 소비만 기각 |
| IMPL-D2-058 | Route section 내 거리/예상시간/계산 상태 metric 표시 | 계획만 | 미배치-보류기각 | 코드 검증(07-09): 미구현 확인. route section 내 거리/예상시간/계산 상태 metric 없음, 재계산 안내 문구만 존재. 거리 |
| IMPL-D2-060 | Distance/route map mock 계약 타입(`Phase3RouteDistanceDecision`/`Phase3RouteMapSnapshot`: distanceKm/durationMinutes/source/providerSt… | 계획만 | 미배치-보류기각 | 헤더 chip·운송구간·support map 공유 타입 |
| IMPL-D2-063 | Support map live provider 연결(route/header/support 공유 source 계약 기반 실제 지도/경로 provider) | 보류 | 미배치-보류기각 | DR-MAP-001과 같은 provider package로 묶어 재개해야 함(단독 구현 금지). 전 계열 문서 일치 |
| IMPL-D2-064 | Kakao map SDK 지도 렌더링(실제 지도 표시) | 보류 | 미배치-보류기각 | directions는 distance chain에서 reachable, map SDK는 미연결. provider decision gate 안에서 |
| IMPL-D2-065 | 고급 지도/경로 최적화 | 보류 | 미배치-보류기각 | Epic 초기 보류 이후 재개 기록 없음 |
| IMPL-D3-013 | transportOptions 운영 UI 표면화 — fast/forklift/direct/trace/cod/roundTrip/special/manual 후보 옵션 popup 확장 | 보류 | 미배치-보류기각 | 운송 구간 상하차 방법과 의미 중복 → 동기화 조건부 승인(G-S8-P2-004) 후 S12/backlog 유지. payload 매핑(D3-01 |
| IMPL-D3-014 | 화물 정보/운송 옵션 접기·펼치기 legacy/HiFi parity | 계획만 | 미배치-보류기각 | legacy 화면 자산(Phase 3 이전 기준선); 코드 검증: 미구현 확인. fold/collapse 인터랙션은 존재하지 않고 compact row(톤수/차종/품목 inline cell) + d |
| IMPL-D3-020 | 차량 세부 옵션 `광폭` | 보류 | 미배치-보류기각 | 후속 차량 옵션 package로 보류. 이후 문서에 재개 기록 없음 |
| IMPL-D3-021 | 최근 화물 후보 list의 cargo memo 축약/숨김 처리 | 보류 | 미배치-보류기각 | free-text 민감정보 가능성으로 user gate 전 구현 금지. 인접 도메인: recent scope/마스킹 정책 |
| IMPL-D3-024 | 신규 화물 상세/최근화물 API 엔드포인트 신설 | 기각 | 미배치-보류기각 | 기각 근거: 기존 `fetchOrderDetail`·`useRecentCargos` 재사용 원칙(S8 gate 승인 2026-06-29). 30 |
| IMPL-D3-025 | 상하차 일시/방법 조건의 화물 섹션 내 재구현 | 기각 | 미배치-보류기각 | 기각 근거: 일시/방법 조건은 운송 구간 섹션 소유로 확정, cargo `운송 옵션`과 분리 유지. 인접 도메인: 운송구간(D2) |
| IMPL-D3-026 | 화물 적용 피드백 애니메이션/장식성 강조(highlight) | 보류 | 미배치-보류기각 | T5 motion decision(7/3~7/6)이 반복 애니메이션은 제외, 조건부 후보(section flash)만 main gate 뒤 보류 |
| IMPL-D4-005 | 정산 export의 인수증(receipt) 필드 read | 기각 | 미배치-보류기각 | 라벨만 존재, 실제 필드 미구현 — source 부재 확인으로 기각 |
| IMPL-D4-020 | `settlementType` create/update payload schema 확장 방식 저장 | 기각 | 미배치-보류기각 | D-NP2-PREPAID-001(06-30) "schema 확장 없이 switchOrderSettlementType 재사용" 결정이 P14-21 |
| IMPL-D4-035 | `/api/charge/with-lines` idempotency key (request id/중복 방지 key) | 보류 | 미배치-보류기각 | migration/API contract 영향으로 별도 stage 분리. S5-TEST-41은 "key 없음" 가정 유지 |
| IMPL-D4-037 | 신규 정산 provider / charge·settlement DB mutation 신설 (`useAddCharge`/`createChargeGroup`/`createChargeLine` 직접 연결 포함) | 기각 | 미배치-보류기각 | Phase 3 원칙: 기존 provider 재사용만 허용, 신규 mutation 생성 금지 |
| IMPL-D4-050 | 정산 applied row overflow 정리 (긴 금액/label 내부 scroll/clipping 제거) | 보류 | 미배치-보류기각 | 인증 세션/seeded edit order 확보 후 smoke 필요. 인접: UI/UX 조정 도메인 |
| IMPL-D4-051 | RECEIPT 인수증 증빙(evidence/document/file) write — 업로드/저장/삭제 | 기각 | 미배치-보류기각 | 시간순: DR-RECEIPT-001 보류(06-30~07-02) → 07-03 사용자 결정 "현재 불필요, 구현하지 않음" → 07-06 35# |
| IMPL-D4-052 | evidence 신규 구성요소 생성 — `with-lines` payload evidence field 추가, ChargeDialog file upload UI, settlement close route evidence 저장, evi… | 기각 | 미배치-보류기각 | 명시적 blocked task 목록(금지선). `evidenceId`/`attachmentUrl` 등 필드는 어느 schema에도 없음 확인 |
| IMPL-D4-056 | 조정금 표시 + 금액 변경 감사 로그(audit log) source/API | 보류 | 미배치-보류기각 | charge group/line read까지는 IMPL-D4-055로 구현. 변경 이력(audit) source 자체가 미확정 |
| IMPL-D4-059 | 수수료 정책 확정 | 보류 | 미배치-보류기각 | 수수료 입력 필드 자체는 draft로 구현됨(IMPL-D4-012/039) — 정책(요율 기준)만 미결 |
| IMPL-D4-060 | distance/duration/base amount의 order field persistence (운임 관련 저장 정책) | 보류 | 미배치-보류기각 | draft-only vs DB persist 미결정 — DB mutation gate 전 금지. 인접: 거리/지도 도메인 |
| IMPL-D5-007 | driver 적용 row rail 폭 정렬 (52px, T7-GAP-005 driver part) | 보류 | 미배치-보류기각 | route part는 완료, driver part만 보류. 인접 도메인: UI/레이아웃(T7) |
| IMPL-D5-021 | driver skip 명시 액션 (`건너뛰기`, HIFI-EVT-007) | 기각 | 미배치-보류기각 | wizard 구조 종속 — nbbb1 상시 폼에서는 재검토 필요; wizard driver step 제거(완료)로 skip 액션의 전제가 사라짐 — 사실상 기각 |
| IMPL-D5-024 | 배차 담당자 변경/지정 기능 (담당자 모델/권한/이력 API) | 기각 | 미배치-보류기각 | 근거 부족으로 미구현 결정(2026-06-30~07-03). 재기획 시 재개 가능. 인접 도메인: 헤더 ops |
| IMPL-D5-033 | 화물맨 실제 테스트 서버 성공 smoke(register→cancel→reopen) + production env/credential + audit/permission guard | 보류 | 미배치-보류기각 | 기능 구현은 완료, actual smoke만 credential-blocked. T3 최종 상태 `completed-implementation- |
| IMPL-D5-048 | outbound 실패 시 화물 등록 자동 rollback | 기각 | 미배치-보류기각 | 정책 결정으로 종결 |
| IMPL-D5-049 | hidden retry / 자동 cancel (사용자 클릭 없는 외부 재시도·취소) | 기각 | 미배치-보류기각 | 재시도는 명시 클릭으로만 — 원칙 확정 |
| IMPL-D5-050 | provider credential/webhook 신규 설정 (CargoMan) | 기각 | 미배치-보류기각 | 별도 package guard. credential 대기 자체는 IMPL-D5-033 |
| IMPL-D5-051 | CargoMan DB status/audit schema 변경 (status/audit mutation) | 보류 | 미배치-보류기각 | status/audit decision 전까지 시작 금지 |
| IMPL-D5-052 | 외부 후보 기반 내부 차주 등록/배차 적용의 audit/permission 확인 (CM-OPS-01) | 계획만 | 미배치-보류기각 | 실현 기록 없음 |
| IMPL-D5-053 | cancel ack — 화물맨 배차취소 수신(inbound cancel) 확인 UX (Phase 3 콘솔) | 보류 | 미배치-보류기각 | legacy 상세 시트에는 cancel ack 구현 존재(IMPL-D5-055) — Phase 3 콘솔 반영만 보류 |
| IMPL-D5-054 | 화물맨 proposal PAY 표시 (공유 상태 pay, inbound proposal 부가 정보) | 보류 | 미배치-보류기각 | 기존 상세 hook shape 확인만 완료 |
| IMPL-D6-028 | autoAccept 실제 실행 — 즉시 배차대기(자동 수락) 전환 mutation | 기각 | 미배치-보류기각 | P03 결정 로그(06-30) '신규 계열 즉시 배차는 사용자 요구상 금지' + P26 sync 'autoAccept excluded'가 06- |
| IMPL-D6-029 | submit 성공 후 read mode / read-only document 전환 | 기각 | 미배치-보류기각 | W7-DEC-003(07-02) 사용자 결정 '화면 자체가 read mode 역할 — 만들지 않는다'가 06-29~07-01 보류/계획 판정을  |
| IMPL-D6-030 | HiFi 완료 branch — `차주 정보로 이동` 분기, 차주 `건너뛰기` 명시 action | 기각 | 미배치-보류기각 | wizard 구조 종속 — nbbb1 상시 폼에서는 재검토 필요; driver step 제거(W7-DEC-005, 07-02)로 branch 대상 자체가 소멸 + S4 submit gate와 책임 중복(P24  |
| IMPL-D6-032 | submit idempotency key (등록/수정 중복 제출 서버 계약) | 계획만 | 미배치-보류기각 | 코드 검증: 미구현 확인(07-09). 서버 측 idempotency key·중복 제출 방지 계약 없음. 존재하는 것은 client pendin |
| IMPL-D6-038 | 등록 기능 기준 route 확정/운영 승격 (`/order/register` vs `/broker/order/register` vs test console 승격) | 보류 | 미배치-보류기각 | legacy 화면 자산(Phase 3 이전 기준선); 00-epic-brief(06-22)~06-deferred-roadmap 일관 보류 — UX/저장 안정성 확인 후 판단. 이후 closeout에 |
| IMPL-D6-039 | dedicated `detail` 전용 mode 신설 (현재는 edit-compatible mode가 상세 진입을 겸함) | 보류 | 미배치-보류기각 | S2 결정(06-29) 이후 갱신 기록 없음 — edit-compatible mode 대체 유지(IMPL-D6-002 참조), S12/후속 St |
| IMPL-D6-040 | raw source detail 전체(full) snapshot 보존 (현재는 reduced snapshot 채택) | 보류 | 미배치-보류기각 | reduced snapshot(IMPL-D6-002)이 채택안으로 완료. full 보존은 S4/S10 handoff 검증 후 재판단 — 이후 c |
| IMPL-D6-042 | full 오더 요약 section — submit 전 검수 화면 (`sec-order-summary`, summary rows/validation 표시/interaction, 증빙/주의/최종 확인) | 보류 | 미배치-보류기각 | 2026-06-26 사용자 요청 보류(USER-DEC-001) → 07-01 user-hold-confirmed(DR-W6-001)로 재확정.  |
| IMPL-D6-043 | 오더 요약 row click → 해당 섹션 scroll/focus 이동 | 보류 | 미배치-보류기각 | full section(IMPL-D6-042)과 함께 보류 |
| IMPL-D7-007 | wide-layout rhythm (cargo/settlement 720px cap vs full-width shipper/route, support panel/left stack 폭 정책) | 보류 | 미배치-보류기각 | T7 gate(07-07)가 decision-needed로 보류 — width 정책 결정 필요 |
| IMPL-D7-029 | raw full source detail snapshot 보존 | 보류 | 미배치-보류기각 | privacy/size 리스크로 reduced snapshot 채택(06-29) — S4/S10 handoff 검증 후 재판단 |
| IMPL-D7-048 | 배차 담당자 변경/지정/권한/이력 기능 | 기각 | 미배치-보류기각 | 근거 부족으로 미구현 결정(06-30 S7 self-review→07-03 sync 일치). 재기획+권한/이력 모델 확인 시 재개 가능 |
| IMPL-D7-050 | 헤더 라벨 preference 저장 (사용자별 persistence) | 보류 | 미배치-보류기각 | 13-closeout(06-30) 보류가 기준. B3 세션로그의 '기각' 표현은 같은 결정(local state만 구현)의 다른 서술 — 저장  |
| IMPL-D7-055 | 메모 type selector/type badge (customer/dispatch/ops) | 기각 | 미배치-보류기각 | `운영 메모` 단일 badge로 축소 결정 — 필요 시 backend/schema 별도 Feature |
| IMPL-D7-056 | memo backend/server/schema 변경 | 기각 | 미배치-보류기각 | 기존 memo CRUD 재사용 확정 — 변경 필요 시 별도 Feature 분리 |
| IMPL-D7-057 | 기존 dispatch memo UI(dark card/floating button) 직접 재사용 | 기각 | 미배치-보류기각 | route-local UI 신규 작성으로 대체 — 운영 route 승격 시 공통화 재판단 |
| IMPL-D7-059 | 신규 등록 화면 보조 정보 panel 노출 | 기각 | 미배치-보류기각 | 사용자 결정으로 의도 제외 확정(06-29) — S12가 구현 task 승격 차단 guard 보유 |
| IMPL-D7-060 | 신규 등록 직후 memo post-create 자동 저장 | 보류 | 미배치-보류기각 | 별도 사용자 확인 후 post-create side effect로만 검토 — 이후 실현 기록 없음 |
| IMPL-D7-063 | 지도 탭 live provider/map SDK 연결 (route/header/support 공유 source 계약) | 보류 | 미배치-보류기각 | DR-MAP-002/003 gate(31/32-closeout 07-03) — provider 계약·SDK 소유권·비용/쿼터 확정 전 금지. 인 |
| IMPL-D7-064 | 금액 로그 조정금/변경 감사(audit) 이력 source | 보류 | 미배치-보류기각 | charge 원장 read는 완료(IMPL-D7-061), audit log 자체는 source/API 미확정으로 보류. 인접 D4(정산) |
| IMPL-D7-067 | 출력(print) action의 workspace actionbar 배치 | 기각 | 미배치-보류기각 | 출력은 기존 목록 내부 기능으로 유지 결정 |
| IMPL-D7-068 | actionbar `조회` 버튼 노출 | 기각 | 미배치-보류기각 | NP1(06-30)이 S4(06-29)의 disabled 보류를 '표시하지 않음' 결정으로 갱신 — 기존 상세 source 확인 전 신설 금지  |
| IMPL-D8-003 | route-local 공통 컴포넌트 추출 — `SectionShell`, `FieldRow`, source/status badge helper | 보류 | 미배치-보류기각 | F1.5 decision log에서 명시 pending. 이후 closeout 문서 어디에도 추출 실행 기록 없음 |
| IMPL-D8-004 | shared `components/ui/*` variant 승격 (Button blue 운영 variant, Badge status/source variant 등) | 보류 | 미배치-보류기각 | 세 문서 일치 — route-local wrapper 검증 후 F3/F7 이후 재검토. 이후 승격 실행 기록 없음 |
| IMPL-D8-005 | 전역 `app/globals.css` primary/theme(blue) 변경 | 보류 | 미배치-보류기각 | F1.5 기간 중 금지 + F2~F4B 시각 검증 후 승격 판단으로 일관. 실행 기록 없음 |
| IMPL-D8-006 | Pretendard 폰트 적용 | 보류 | 미배치-보류기각 | 운영 UI 전반 font 정책 확정 시 재개. 후속 기록 없음 |
| IMPL-D8-007 | Phase 3 toast/feedback 표준 결정 (Sonner vs 기존 useToast) | 보류 | 미배치-보류기각 | 표준 '결정' 자체가 보류. Wave 7 success toast는 구현됐으나(IMPL-D8-011 인접) 표준화 결정 기록은 없음 |
| IMPL-D8-012 | 반복 reminder glow/sweep·attention 애니메이션 (10초 반복 강조) | 기각 | 미배치-보류기각 | wizard 구조 종속 — nbbb1 상시 폼에서는 재검토 필요; T5 decision(07-03)이 P18-14/R1-71의 보류·미확인을 excluded-now로 확정 갱신. reduced motion에서  |
| IMPL-D8-013 | smooth scroll / screenmap select transition | 기각 | 미배치-보류기각 | reduced motion instant/focus 우선 결정 |
| IMPL-D8-014 | main submit CTA attention sweep + 섹션 적용 후 1회 flash feedback (next-phase 후보) | 보류 | 미배치-보류기각 | 발견성 문제가 browser QA에서 재현될 때만 1회 강조 검토. API/save flow 변경 금지 조건 |
| IMPL-D8-016 | decorative motion / reduced motion 대응 전반 정책 (NP-S12-004) | 보류 | 미배치-보류기각 | HiFi 근거·접근성·reduced motion QA·main/user gate 전 구현 금지로 전 문서 일치. 최저 우선순위 backlog |
| IMPL-D8-019 | masking preference 저장 / 수동 masking toggle (DB/API) | 기각 | 미배치-보류기각 | DB/API scope 증가 금지 결정. 정책 결정 문서 + owner 확보 시에만 재개 |
| IMPL-D8-020 | recent 삭제/숨김/만료 UI 및 endpoint | 기각 | 미배치-보류기각 | 기각이되 P05-15 비고의 RSMP-OPEN-003(정책 필요 여부 open question)로 재검토 여지 기록 |
| IMPL-D8-021 | recent 후보 표시 보강 — cargo memo 축약/숨김, 연락처 부분 마스킹, source badge/tooltip, recent focused tests/browser QA | 보류 | 미배치-보류기각 | user gate 열리기 전 구현 금지. free-text 민감정보 가능성으로 policy 패키지가 명시 보류 |
| IMPL-D8-022 | 개인정보 마스킹/노출 정책 전반 결정 (화주 snapshot·주소/연락처 표시 수준, P0-PRIVACY) | 보류 | 미배치-보류기각 | 현행은 기존 표시 수준 유지 검증만 완료, 정책 자체는 security/privacy decision 대기. IMPL-D8-017 정책 기준선과 |
| IMPL-D8-027 | Sentry Turbopack compatibility/deprecation warning 해소 | 계획만 | 미배치-보류기각 | 코드 검증: 미구현 확인 — Turbopack 관련 Sentry 경고 완화 설정·후속 보정 커밋 없음 (dev 서버 실기동 재확인은 미수행, 설 |
| IMPL-D8-043 | 섹션 wide-layout rhythm (T7-GAP-007) — cargo/settlement 720px cap vs full-width shipper/route 정합, support panel/left stack width 정책 | 보류 | 미배치-보류기각 | width 정책 자체가 decision-needed로 보류. 인접: D6(workspace layout) |

## 3. 미배치-인프라 (77건) — 화면 매핑 비대상 (계약/파이프/테스트/문서)

UI 화면 기능이 아니라 submit payload 계약, side-effect 파이프라인, backend API, 테스트/QA 자산, 문서 산출물, 환경 정책 등. nbbb1 재구현 시에도 그대로 승계되는 기반 자산.

| ID | 기능 | 상태 | 분류 | 비고 |
|---|---|---|---|---|
| IMPL-D1-020 | 화주 master 후보 검색 API — `GET /api/test/broker-order-console/shipper-master-candidates` + scoped/master 결과 병합·중복 제거 (broker 인증, keywo… | 완료 | 미배치-인프라 | `삼덕시스템` 미노출 이슈 대응 보강. 커밋 해시 근거. query search only, 사업자번호는 company-only fallback( |
| IMPL-D1-025 | Recent scope/masking 정책 기준선 문서화 — 조회 scope(broker selected company/shipper own/current user) + 표시 정책(연락처·상세주소·사업자번호·memo·internal … | 완료 | 미배치-인프라 | docs-only 산출물, 코드 변경 없음. 구현 확장은 IMPL-D1-026에서 별도 판정. 인접: D2/D3 |
| IMPL-D1-040 | payload safety — 빈 `selectedManagerId`를 `undefined`로 변환해 submit payload에서 제외 | 완료 | 미배치-인프라 | 겹침 항목 — 저장 파이프라인(인접 D6)이나 담당자 필드 계약이라 병기. IMPL-D1-046 검증과 연동 |
| IMPL-D2-026 | 지번-only/도로명-only 후보 적용·저장 validation 허용(둘 중 하나 필수, copy 보정 포함) | 완료 | 미배치-인프라 |  |
| IMPL-D2-030 | 등록 주소 검색 API의 지번(jibun) 검색 범위 | 완료 | 미배치-인프라 | 코드 검증(07-09): 지번 주소 문자열로도 saved 주소 매칭 가능 — API 검색 대상 보강 이미 반영 |
| IMPL-D2-044 | 상세 조회 초기화 데이터의 주소(지번) fallback 보강 | 완료 | 미배치-인프라 | 커밋 해시 부착 판정 |
| IMPL-D2-045 | 좌표 payload safety — 좌표 0은 address metadata에서 제외(submit payload) | 완료 | 미배치-인프라 | 인접 도메인: D6(submit payload) |
| IMPL-D2-049 | Drawer hydration/open 시 distance API no-call guard — 초기화 route와 사용자 변경 route 분리, drawer 열기만으로 호출 없음(`draftIdentity` route key 처리 완… | 완료 | 미배치-인프라 |  |
| IMPL-D3-012 | 운송 옵션(transportOptions) + route method → submit payload 반영 (`createRouteTransportOptions`) | 완료 | 미배치-인프라 | 13-final-closeout(6/30)의 '근거 부족 보류'를 14-post-closeout-delta(7/1~2) R10이 완료로 갱신(규 |
| IMPL-D3-015 | cargo submit candidate adapter — `createCargoSubmitCandidate`(`cargoName`/`requestedVehicleType`/`requestedVehicleWeight`/`memo`/`… | 완료 | 미배치-인프라 | P14 내부 done/partial 충돌은 B2-07(17-integration-diff-matrix 7/1, 통합 검증 계열)이 confirm |
| IMPL-D3-019 | cargo dialog 수정과 inline 수정의 동일 draft source 사용 | 완료 | 미배치-인프라 | 코드 검증: 완료 확인. dialog apply와 inline commit 모두 동일한 controlled cargoDraft(phase3-or |
| IMPL-D3-022 | 신규/상세/수정/복사 화물 섹션 정합성 브라우저 QA | 부분 | 미배치-인프라 | focused test는 통과, 화물 섹션 특정 browser smoke 완료 기록 없음. S5-38 full UI 저장 flow QA도 계획만 |
| IMPL-D4-010 | SettlementDraftBoundary — orderId 없으면 `sideEffectsDeferred=true` draft-only, mutation 지연 | 완료 | 미배치-인프라 | B2-11이 구 F4B store/adapter를 draft boundary 구조로 대체 완료 확인 |
| IMPL-D4-017 | settlement submit candidate adapter — `createSettlementSubmitCandidate` (create payload `settlementType` 후보 + `fallbackSettlementT… | 완료 | 미배치-인프라 | P14-18의 10-release-checklist "partial" 표기는 14-sync done과 시점 차 — 이후 S5 closeout으로 |
| IMPL-D4-018 | 정산 side effect plan 지연 보관 + executed/deferred 분리 — `receiptChargeSave`/`prepaidChargeSave`를 requiresOrderId plan으로 보관, amount exec… | 완료 | 미배치-인프라 | future evidence package가 소비하도록 설계된 경계 계약 |
| IMPL-D4-022 | 저장 성공 후 PREPAID settlement type 전환 side effect (`switchOrderSettlementType(orderId,"PREPAID")`) | 완료 | 미배치-인프라 | wizard 구조 종속 — nbbb1 상시 폼에서는 재검토 필요; 14-delta(07-01)가 13-final-closeout(06-30)의 미연결 기록을 구현 완료로 갱신 |
| IMPL-D4-024 | RECEIPT settlement type 전환 side effect (`PATCH /api/orders/[orderId]/settlement-type`, noop guard, chargeGroups 삭제 후 type 변경) | 완료 | 미배치-인프라 | 초기 NP2에서 RECEIPT skipped였다가 post-closeout delta에서 구현 — 문서 내 순차 갱신(충돌 아님). reposi |
| IMPL-D4-026 | PREPAID 선택 금액 `estimatedPriceAmount` fallback 전달 (목록 운송비 표시용) | 완료 | 미배치-인프라 | fallback만으로 저장 완료 주장 금지 원칙 병기 |
| IMPL-D4-028 | 배차 조정액 목록 분리 — 배차 panel 조정액은 목록 운송비 후보에 미합산, 기존 추가 운임 provider로만 저장 | 완료 | 미배치-인프라 |  |
| IMPL-D4-029 | 수정/상세 mode `sourceDispatchId` 보존 — provider 인자로 기존 dispatch id 전달, 배차측 amount write 대상 유지 | 완료 | 미배치-인프라 | 인접: D5 차주 |
| IMPL-D4-030 | 정산 side effect `orderId` guard — orderId 없음/비 UUID/source snapshot 불일치 시 실행 차단 | 완료 | 미배치-인프라 | 초기 decision type 설계는 adapter 계약으로 대체됨 |
| IMPL-D4-031 | 신규/복사 mode draft-only guard — orderId 없는 mode에서 정산 입력이 provider 호출 금지 | 완료 | 미배치-인프라 |  |
| IMPL-D4-034 | 후처리 재시도 범위 분리 — `settlement → driverAssign → logishm` stage 분리, 후속 stage 실패 시 정산 후처리 반복 없이 해당 stage만 재시도 | 완료 | 미배치-인프라 | 37(07-08)이 최신 closeout. 인접: D5 차주/외부연동 |
| IMPL-D4-055 | 금액 로그 actual provider — 탭 진입 시 `getChargeGroupsByOrderIdWithLines(selectedOrderId)` lazy load read-only 조회 (edit/detail 전용, 신규/cop… | 완료 | 미배치-인프라 | P25-03 내부 충돌(README "미호출" vs 09-sync post-delta "connected")은 post-delta(07-01)가 |
| IMPL-D5-013 | 차주 선택 후 화물 수정 저장 500 오류 수정 — dispatch 없는 오더는 assign skip (W6-P0-03) | 완료 | 미배치-인프라 | 단일 근거 |
| IMPL-D5-015 | 신규/복사 접수 wizard에서 driver step/driver section/driver 이동 CTA 제거 — wizard를 화주/상차/하차/화물/정산 5단계로 고정 | 완료 | 미배치-인프라 | wizard 구조 종속 — nbbb1 상시 폼에서는 재검토 필요; Wave7 결정+구현 문서 일치. 이후 P02(07-06)가 CargoMan intent 중심으로 차주 섹션을 재노출(IMPL-D5-040) — |
| IMPL-D5-018 | 전 모드 submit payload `autoAccept=false` 강제 guard — 저장 성공을 배차 성공으로 해석 금지(autoDispatched=false) | 완료 | 미배치-인프라 | NP1 real submit bridge 구현에 포함 |
| IMPL-D5-019 | `driver.autoDirectDispatch` → `autoAccept` payload 후보 매핑 (submit candidate, 실행과 분리) | 완료 | 미배치-인프라 | 후보 매핑까지 완료. 실제 실행은 IMPL-D5-017(기각) |
| IMPL-D5-020 | driver draft submit 제외 정책 — `driver.driverId/snapshot` 등을 create/update payload에서 제외(submitExcluded), edit 배차는 assign side effect로… | 완료 | 미배치-인프라 | 정책 자체가 구현 결과. 해제 여부 결정은 edit 전용 side effect(IMPL-D5-008) 채택으로 종결 |
| IMPL-D5-029 | QA용 `화물맨 배차 샘플` 후보 주입 — client-local 샘플, production 숨김(`data-runtime-scope="test-route-only"`), connected 데이터와 소스 분리 | 완료 | 미배치-인프라 | test route 전용, 운영 노출 금지 |
| IMPL-D5-031 | CargoMan outbound register 후처리 — 오더 저장 성공 후 `/api/integrations/logishm/outbound/register` 호출 (test console shell/adapter 경계, 기존 se… | 완료 | 미배치-인프라 | 06-29 S11B no-send 기각 → 07-07 사용자 결정 reopen → 37-t3-closeout(07-08, 최상위 closeout |
| IMPL-D5-032 | CargoMan cancel/reopen 외부 호출(`/outbound/cancel`, `/outbound/reopen`) + `ordernum:null` FAILED 상태 local guard(외부 전송 전 400 차단: `화물맨 … | 완료 | 미배치-인프라 | 구현·local guard는 37 closeout 확정. 외부 전송 성공 검증은 register 성공(ordernum 확보) 선행 필요 → IM |
| IMPL-D5-034 | 화물맨 status API `data:null`/malformed payload 미연동 판정 처리 — register 재등록 차단 버그 수정 (회귀 테스트 포함) | 완료 | 미배치-인프라 | 37 closeout 근거 |
| IMPL-D5-035 | 화물맨 후처리 실패 retry 범위 분리 — `settlement → driverAssign → logishm` stage 분리, Logishm 실패 시 오더 저장·정산·차주 후처리 반복 없이 Logishm만 재시도 | 완료 | 미배치-인프라 | 37 closeout 근거 |
| IMPL-D5-038 | 화물맨 상태 QA mock 미리보기 — `?logishmQa=failed-locked/dispatched/shared/cancelled` 상태별 차주 섹션 preview (외부 호출 없음) | 완료 | 미배치-인프라 | FAILED+ordernum 잠금(failed-locked) 상태 preview 포함 |
| IMPL-D5-039 | 화물맨 테스트 URL/환경 정책 — `LOGISHM_API_BASE_URL | | http://cargo.apitest.labbgsoft.kr:8080/service2/ty` 기본 테스트 서버, production은 Vercel en… | 완료 | 미배치-인프라 | 외부번호(ordernum)·credential 정책과 연동되는 환경 경계 |
| IMPL-D5-041 | copy 시 원본 CargoMan 외부 상태(status/proposals/ordernum/webhook) 초기화 + 원본 상태 재사용/복사 금지 | 완료 | 미배치-인프라 | 검증 task CM-CPY-01은 Phase 3 마무리 검증 대기 |
| IMPL-D5-042 | CargoManShareIntent 로컬 상태 — DriverDraft와 분리, 체크 toggle이 autoAccept/assignDriver 미트리거 | 완료 | 미배치-인프라 | S11A 경계 유지 확인 |
| IMPL-D5-047 | register/cancel 후 status/proposals read refresh (edit/detail 진입 refresh 포함) | 완료 | 미배치-인프라 | 코드 검증(2026-07-09): register/cancel/reopen 모두 실행 후 status·proposal refetch 연결됨. 검 |
| IMPL-D5-056 | 기존 화물맨 outbound 서버 인프라 — register/cancel/reopen/update/sort-change/status route + `OutboundShareService` + `LogishmApiClient` | 완료 | 미배치-인프라 | T3 구현은 이 인프라 재사용(서버 미수정) |
| IMPL-D5-061 | register 중복 발송 방지 idempotency guard — register 전 최신 status 재조회 + client in-flight lock, double register가 외부 PAY mutation 1회로 수렴 | 완료 | 미배치-인프라 | 코드 검증(2026-07-09): 구현 확인 |
| IMPL-D5-064 | 인증 세션 실데이터 connected SHARED proposal 표시 검증 (connected read 실증) | 완료 | 미배치-인프라 | 코드 검증(2026-07-09): status API→adapter→다이얼로그 group까지 wiring 완결. 실제 인증 세션 라이브 실증은  |
| IMPL-D5-066 | CargoMan 경계/UX 테스트 세트 (CM-TST-01: autoAccept/assign 미호출, CargoMan 후보 직접 적용 불가, copy 미복사 등 store/adapter/component/workspace target… | 부분 | 미배치-인프라 | outbound 연결(T3, 07-07~08) 이후 boundary test 추가 여부는 기록 없음 |
| IMPL-D6-001 | Phase 3 canonical draft contract + route-local draft store (`usePhase3OrderDraftStore`, section slice/patch event, workspace draft… | 완료 | 미배치-인프라 | F5 package sync(06-26)가 Epic draft(E1-30 계획만)를 구현으로 실현. 기존 store 확장 vs 별도 store  |
| IMPL-D6-004 | legacy AI 등록 패널(`BrokerOrderAiRegisterPanel`) 을 drawer 기본 content에서 분리 — 기본 content를 `BrokerOrderWorkspaceShell`로 교체, legacy 파일 보존 | 완료 | 미배치-인프라 | legacy 화면 자산(Phase 3 이전 기준선); S1 P3(06-29) browser smoke `AI 화물 등록=false` 확인 — R1-58(drawer title 교체 계획)을 해소.  |
| IMPL-D6-012 | wizard 섹션 다이얼로그 닫힘 회귀 수정 — X/ESC/바깥 클릭 시 부모 active step 해제로 즉시 재오픈 차단 | 완료 | 미배치-인프라 | wizard 구조 종속 — nbbb1 상시 폼에서는 재검토 필요; 14-post-closeout-delta(07-01) browser QA 확인 |
| IMPL-D6-016 | submit excluded contract — driver id/snapshot·외부 발송 payload, support memoSnapshot/금액로그/지도, cargo draft-only metadata(vehicleCount/… | 완료 | 미배치-인프라 | 제외 계약 자체는 완료. 각 필드의 write 승격 여부(대수/실중량 등)는 인접 D3/D4/D5 항목에서 판정 |
| IMPL-D6-017 | submit 실행 게이트 — `phase3-submit-execution-gate`/`createPhase3RealSubmitGateDecision`: register/update·settlementSideEffect·autoAcce… | 완료 | 미배치-인프라 | 13-final-closeout(06-30, `cbfe01ac`)이 B1-12의 'S4 미진행 vs adapter 존재' 충돌을 완료로 해소.  |
| IMPL-D6-022 | 저장 후처리 stage 분리 + side-effect-only retry — settlement→driverAssign→logishm 순서 고정, 실패 stage만 재시도(`registerOrder`/`updateOrder` 재호출 … | 완료 | 미배치-인프라 | 37-t3-closeout(07-08)이 3-stage 분리·retry 범위 분리를 커밋 근거로 확정. 정산 retry 세부는 인접 D4, 화물 |
| IMPL-D6-025 | 차주 선택 후 화물 수정 저장 500 오류 수정 (dispatch 없는 오더는 assign skip) | 완료 | 미배치-인프라 | Wave6 QA(07-01) 검증. 인접 D5 |
| IMPL-D6-027 | autoAccept=false 강제 guard + `driver.autoDirectDispatch`→`autoAccept` 후보 매핑 (저장 성공을 배차 성공으로 해석 금지, `autoDispatched=false`) | 완료 | 미배치-인프라 | NP1(06-30) 전 모드 autoAccept=false 고정 구현. 인접 D5 |
| IMPL-D6-035 | wizard process panel HiFi visual parity (pixel/layout 비교) | 부분 | 미배치-인프라 | wizard 구조 종속 — nbbb1 상시 폼에서는 재검토 필요; 코드 검증(07-09): 마크업 구조·클래스명·aria-label·상태 라벨·224px 사이드 컬럼은 완전 일치. 시각 스타일은 재해석됨 — s |
| IMPL-D6-036 | 신규/복사/수정 전체 UI 저장 플로우 통합 QA | 부분 | 미배치-인프라 | 코드 검증(07-09): 목록 row→copy/edit drawer→registerOrder(copy)/updateOrder(edit) 코드 경 |
| IMPL-D6-044 | 테스트 콘솔 전용 등록 성공 dialog (`test-register-success-dialog.tsx`) | 완료 | 미배치-인프라 | Wave7 성공 toast(IMPL-D6-019)와 별개의 legacy 컴포넌트 — Phase 3 성공 처리는 toast 경로 채택 |
| IMPL-D7-011 | 헤더 chip/actionbar/라벨 토글 overflow 검증 (1440/960/390, T7-GAP-006/008) | 완료 | 미배치-인프라 | QA-only smoke pass — 구현 변경 없이 현행 유지 판정 |
| IMPL-D7-017 | legacy AI 등록 drawer 분리 + drawer default content/title 교체 (BrokerOrderWorkspaceShell로 교체, AI panel 파일 보존) | 완료 | 미배치-인프라 | legacy 화면 자산(Phase 3 이전 기준선); P16 P3 implementation-sync가 같은 날 01-inventory의 누락 판정을 완료로 갱신. AI 기능 자체는 D6/AI 도메 |
| IMPL-D7-020 | new open 시 `lastSuccess` 보존 (초기화 대상 제외) | 완료 | 미배치-인프라 | 최종 정책 소유는 success bridge(IMPL-D7-021) 측 |
| IMPL-D7-026 | copy mode 정책 (source order id/snapshot reference만 보존, driver·support는 active draft 제외, `신규 접수` 클릭 시 빈 상태 reset) | 완료 | 미배치-인프라 | S2/NP1 구현이 01-inventory 부분 판정 갱신. 인접 D5(차주 제외 정책)/D6(registerOrder 저장) |
| IMPL-D7-027 | edit/detail(edit-compatible) mode 정책 (driver snapshot·support panel source·source order id 보존) | 완료 | 미배치-인프라 | 데이터 주입·보존은 S2 완료. `updateOrder` 실행은 인접 D6 |
| IMPL-D7-028 | hidden source snapshot — raw 전체 대신 reduced snapshot(`meta.sourceSnapshot`: sourceKeys/orderId/mode/submit 제외 정책) 보존 | 완료 | 미배치-인프라 | S4/S10 handoff용 계약 |
| IMPL-D7-033 | 기존 right detail sheet(`BrokerOrderDetailSheet`) fallback/deprecation boundary 유지 (즉시 제거 안 함) | 완료 | 미배치-인프라 | legacy 화면 자산(Phase 3 이전 기준선); fallback 유지 자체가 구현 내용 |
| IMPL-D7-042 | legacy copy/edit 초기값 adapter + panel mode 흐름 (`createRegisterInitialDataFromOrderDetail`, new/copy/edit) | 완료 | 미배치-인프라 | legacy 화면 자산(Phase 3 이전 기준선); Phase 3에서는 `phase3-draft-initializer`(IMPL-D7-025)로 대체 — legacy 자산 기록 |
| IMPL-D7-046 | dialog open/close/ESC/opener focus restore flow-level 회귀 정책 (콘솔 전 dialog 공통) | 부분 | 미배치-인프라 | 개별 dialog의 autofocus/keyboard/close는 존재(S1/S2/S5 개별 검증), flow-level wrapper·전면 회 |
| IMPL-D7-052 | 메모 client service + backend (`/api/orders/{orderId}/memos`, broker tenant 격리, command/query service) | 완료 | 미배치-인프라 | F7 1차에서 backend 변경 금지 — 기존 자산 그대로 재사용 |
| IMPL-D7-061 | 금액 로그 탭 read-only actual provider (`getChargeGroupsByOrderIdWithLines` lazy load, source label, empty state) | 완료 | 미배치-인프라 | R0 sync(07-01)·26-wave8(07-02)가 01-inventory '미연결' 판정을 완료로 갱신. P25 내부 충돌(README  |
| IMPL-D8-001 | F1.5 Design System Foundation 패키지 — HiFi token(색상/typography/spacing/radius/shadow)·shadcn component mapping·layout pattern contra… | 완료 | 미배치-인프라 | P06 패키지 closeout(TASK 전건 done + 커밋)이 E1-24의 draft '계획만' 판정을 완료로 갱신. docs-only 산출 |
| IMPL-D8-009 | S3 HiFi event audit / adoption matrix — HIFI-EVT-001~014 채택 판정 + S7/S9/S11B/S12 handoff (문서 산출물) | 완료 | 미배치-인프라 | 4개 배치 일치. 즉시 구현 확정 event 0건 — 개별 event 판정은 각 후속 항목 참조 |
| IMPL-D8-010 | T5 HiFi motion polish decision matrix — 모션 후보 채택/제외/gate 판정 산출물 | 완료 | 미배치-인프라 | 결정 문서로서 완료. 개별 판정 결과는 IMPL-D8-011~016으로 분해 |
| IMPL-D8-026 | dev 서버 `rimraf can't be external` 경고 보정 — `next.config.ts` `transpilePackages: ["rimraf"]` | 완료 | 미배치-인프라 | 40(07-08)과 P29 재검증(07-08)이 일치. 서버 재시작 후 미재발 확인 |
| IMPL-D8-028 | 공용 Dialog(Radix DialogOverlay) ref warning 정리 | 완료 | 미배치-인프라 | 코드 검증(2026-07-09): React 18 함수 컴포넌트 ref 경고의 표준 해소 패턴 적용 확인 — DialogOverlay ref w |
| IMPL-D8-030 | S0 regression hook 세트 — `data-testid="existing-cargo-list-region"`/`workspace-shell`/`workspace-stack`/`workspace-split`, `data-su… | 완료 | 미배치-인프라 | S1 G-S0-01 8항목 pass가 이 hook 세트로 검증됨. 이후 Wave QA들이 동일 attribute를 계속 사용 — 유지 확인 |
| IMPL-D8-031 | Phase 1/2 테스트 안전망 — store/list-action/query-sync/context-menu 단위 테스트 4종 | 완료 | 미배치-인프라 | Phase 3 진입 전 기준선. 이후 focused test 수백 건으로 확장됨(각 도메인 패키지 소관) |
| IMPL-D8-035 | flow-level dialog open/close·ESC·focus restore 정책 (전 dialog 공통 wrapper/회귀) | 부분 | 미배치-인프라 | 개별 dialog 수준 구현은 존재(IMPL-D8-032), flow-level 공통 정책·회귀 QA는 미완. 인접: D6 |
| IMPL-D8-036 | S12 deferred/decision guard backlog board — 보류/기각 항목 분류(5종)·금지선·재개 조건 관제 산출물 | 완료 | 미배치-인프라 | decision-only 패키지로 정상 종료, 코드 0건. 보류·기각의 SSOT 역할 — 개별 항목 판정은 각 도메인 행에 반영됨 |
| IMPL-D8-039 | HiFi visual parity 검증 — wizard process panel vs HiFi HTML pixel/layout 비교 | 부분 | 미배치-인프라 | wizard 구조 종속 — nbbb1 상시 폼에서는 재검토 필요; 코드 검증(2026-07-09): 구조 parity 높음, 픽셀 parity 아님 — step 배지 HiFi 24x24 radius-sm+rin |
| IMPL-D8-040 | F0 Current Implementation Map 문서 (기존 구현/상태/서비스 의존성 문서화) | 부분 | 미배치-인프라 | 문서는 실존하나 Epic상 draft로 남음. 이후 로드맵/closeout 문서군이 사실상 대체 — nbbb1 매핑에는 참고 자산 |
| IMPL-D8-045 | 헤더 chip/actionbar 가로 overflow (T7-GAP-008) + label visible/hidden 전환 overflow (T7-GAP-006) QA | 완료 | 미배치-인프라 | QA-only smoke 판정 — app/source 구현 변경 없음, 현행 구현 유지. 운영 screenshot에서 잘림 확인 시에만 조정.  |
