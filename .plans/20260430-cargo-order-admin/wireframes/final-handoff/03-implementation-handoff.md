# 구현 인계 체크리스트

## 목적

이 문서는 다른 PC의 기존 프로젝트에서 `화물관리 > 오더 접수/수정` 화면을 실제 구현하기 전에 확인해야 할 파일, 컴포넌트, API, 상태관리 후보와 단계별 적용 전략을 정리합니다.

## 1. 기존 프로젝트 분석 체크리스트

| 영역 | 찾아야 할 것 | 확인 질문 |
| --- | --- | --- |
| Routing | `화물관리`, `오더 접수/수정` page/route | 화면 entry point가 어디인가 |
| Page component | 상단 입력/수정 화면 container | form, list, modal을 어디서 조립하는가 |
| Section components | 화주, 운송 구간, 화물 정보, 정산, 차주, 목록 | 섹션이 이미 분리되어 있는가 |
| Dialog components | 주소 검색, 화주 조회, 운송+품목, 금액, 차주 조회 | 기존 독립 다이얼로그를 재사용할 수 있는가 |
| State management | form state, selected order, draft state | `new-*`, `submit-*` 상태를 어디에 둘 것인가 |
| API client | 주문 저장/수정/조회, 주소 검색, 차주 조회 | 신규 저장 endpoint와 payload가 무엇인가 |
| Validation | client/server validation | 필드 오류를 섹션에 어떻게 매핑하는가 |
| Permission | 금액, 메모, 배차 담당자, 취소/정산 권한 | 계정별 노출/disabled 정책이 있는가 |
| Table/list | 화물 목록, 상태 필터, 후속 액션 | 선택 행과 상단 편집 연결 방식은 무엇인가 |
| Design system | button, chip, badge, dialog, tabs | master HTML의 패턴을 기존 system으로 치환 가능한가 |

## 2. 화면/컴포넌트 매핑

| 기획 영역 | 기존 프로젝트 후보 | 구현 메모 |
| --- | --- | --- |
| Header 상태 영역 | page header, toolbar, order status component | 상태, 거리, 기준금액, 배차 담당자, 라벨 토글 |
| 화주 정보 | requester/customer section | 신규 첫 단계, 메모 mock/data trigger |
| 운송 구간 | route/location section | 주소 검색, 최근 장소, 지도 data source |
| 화물 정보 | cargo/vehicle requirement section | 톤수, 차종, 대수, 실중량, 품목 |
| 정산 정보 | pricing/payment section | 금액 입력, 조정금, 최종 validation |
| 오더 요약 | summary/review section | 입력 단계가 아니라 확인용 |
| 차주 정보 | driver assignment section | 신규에서는 선택, 수정에서는 독립 다이얼로그 |
| 보조 정보 | right aside/panel | 메모, 금액 로그, 운송 구간 지도 |
| 하단 목록 | order table/list | 선택 행 -> 상단 상세 로드 |

## 3. State Machine 구현 기준

| 상태 | 구현 책임 |
| --- | --- |
| `idle-edit` | 기존 조회/수정 기본 상태 |
| `new-reset` | `신규(F3)` 클릭 후 전체 draft 초기화 |
| `new-wizard-active` | wizard 단계 진행 |
| `new-required-complete` | 금액까지 필수 입력 완료 |
| `new-driver-optional` | 차주 정보 선택/건너뛰기 |
| `new-submitted` | API 없이 메인 화면 적용 완료 |
| `submit-validating` | 메인 화면 최신 데이터 validation |
| `submit-pending` | API 통신 중 |
| `submit-failed` | API 실패, 데이터 유지 |
| `submit-complete` | 저장 성공 후 일반 상태 복귀 |

구현 시 가장 중요한 점은 `화물 등록 완료`와 메인 `화물 등록`의 책임 분리입니다. 전자는 화면 적용이고, 후자만 API 저장입니다.

## 4. API 매핑 필요 항목

| API 후보 | 필요한 결정 | 연결 기능 |
| --- | --- | --- |
| `POST /cargo-orders` 또는 기존 생성 API | endpoint, payload, idempotency key | 메인 `화물 등록` |
| 주문 수정 API | 수정 가능한 필드와 상태별 제한 | `화물수정`, 개별 dialog |
| 주소 검색 API | 검색어, 주소록/Kakao/최근 장소 source | 주소 검색 dialog |
| 최근 장소 API | scope, 저장 시점, 마스킹 | 상차/하차 최근 |
| 최근 운송+품목 API | 조합 key, 정렬, 중복 제거 | 운송+품목 최근 |
| 메모 API | 작성/조회/수정/삭제 권한 | 보조 정보 메모 |
| 금액 조정 API | 조정금 저장 단위, 감사 로그 | 금액 로그 |
| 지도/거리 API | provider, fallback, quota | 운송 구간 지도 |
| 배차 담당자 API | 배정/변경/이력/권한 | header chip 후속 |

## 5. Migration Plan

### Phase 0. 프로젝트 분석

| 작업 | 완료 기준 |
| --- | --- |
| route/page/component/API/store 위치 확인 | 실제 파일 경로를 이 문서 하단에 기록 |
| 현재 validation과 서버 오류 응답 확인 | 필드/섹션 오류 매핑 가능 |
| 현재 목록/선택 행 흐름 확인 | 상단 편집과 충돌 없음 |

### Phase 1. Non-destructive visual alignment

| 작업 | 완료 기준 |
| --- | --- |
| header chip, button hierarchy, label toggle 기준 반영 | 기존 기능 변화 없이 화면 기준 정렬 |
| 보조 정보 shell과 탭 구조 추가 | 데이터 mock 또는 read-only 상태 가능 |
| 기존 dialog를 master 기준으로 시각 정리 | 기존 입력/적용 책임 유지 |

### Phase 2. 신규 접수 state machine

| 작업 | 완료 기준 |
| --- | --- |
| `신규(F3)` 초기화와 `new-reset` 구현 | 전체 draft 초기화 |
| wizard 단계와 validation gate 구현 | 필수 단계 미통과 시 이동 차단 |
| `new-submitted`와 메인 `화물 등록` CTA 구현 | API 저장 전 확인 가능 |

### Phase 3. API 연결

| 작업 | 완료 기준 |
| --- | --- |
| payload schema 매핑 | 메인 화면 최신 데이터 기준 |
| idempotency key 적용 | 중복 등록 방지 |
| server validation 매핑 | 첫 오류 섹션 focus |
| 실패/재시도 처리 | 데이터 유지, 재등록 가능 |

### Phase 4. 보조 데이터 고도화

| 작업 | 완료 기준 |
| --- | --- |
| 최근 장소/조합 API 연결 | scope/마스킹 정책 반영 |
| 보조 정보 메모/금액/지도 API 연결 | 권한/empty/loading/error 상태 반영 |
| 배차 담당자 변경 UX 추가 | 정책 확정 후 진행 |

## 6. 구현 전 P0 결정

| 항목 | 필요한 결정 | 결정 전 가능한 작업 |
| --- | --- | --- |
| 저장 endpoint/payload | 실제 등록 API와 request shape | UI shell, state machine |
| server validation | 오류 code와 field mapping | client validation placeholder |
| 최근 사용 scope | 사용자별/화주별/조직별 | static/mock recent list |
| 개인정보 마스킹 | row/preview에 표시할 연락처/담당자 범위 | row 기본 연락처 숨김 |
| 금액 권한 | 조회/입력/마스킹 role | read-only 금액 로그 |
| 조정금 저장 단위 | `둘 다` item 분리 여부 | UI label과 target만 유지 |
| 배차 담당자 모델 | 담당자, 팀, 변경 권한, 이력 | 표시 전용 chip |

## 7. QA 연결

| QA 그룹 | 기준 |
| --- | --- |
| 신규 접수 | `source-snapshot/sections/new-order-registration-flow/06-acceptance-criteria.md` |
| 최근 사용 | `source-snapshot/sections/transport-dialog-recent-lists/05-acceptance-criteria.md` |
| 보조 정보 | `source-snapshot/sections/reservation-area-tabs/09-planning-closure.md`와 `08-implementation-handoff.md` |
| Header polish | `source-snapshot/root-docs/10-hifi-design-polish-and-dispatch-manager-integration-log.md` |
| 전체 회귀 | `source-snapshot/root-docs/04-modernization-brief.md`의 개선안 검수 체크리스트 |

## 8. 기존 프로젝트 매핑 기록란

아래 표는 기존 프로젝트 분석 후 채웁니다.

| 기획 영역 | 기존 파일/컴포넌트 | API/Store | 상태 |
| --- | --- | --- | --- |
| Route/Page | 미확인 | 미확인 | todo |
| Header | 미확인 | 미확인 | todo |
| 화주 정보 | 미확인 | 미확인 | todo |
| 운송 구간 | 미확인 | 미확인 | todo |
| 화물 정보 | 미확인 | 미확인 | todo |
| 정산 정보 | 미확인 | 미확인 | todo |
| 차주 정보 | 미확인 | 미확인 | todo |
| 보조 정보 | 미확인 | 미확인 | todo |
| 최근 사용 | 미확인 | 미확인 | todo |
| 화물 목록 | 미확인 | 미확인 | todo |

## 9. 완료 기준

| 기준 | 완료 조건 |
| --- | --- |
| 화면 기준 | master HTML의 주요 상태를 기존 프로젝트에서 재현 |
| 기능 기준 | 기존 조회/수정/목록 flow 회귀 없음 |
| 저장 기준 | 메인 `화물 등록`만 API 저장 trigger |
| 검증 기준 | client/server validation이 섹션/필드로 표시 |
| 정책 기준 | P0 보류 항목이 결정 또는 명시적으로 feature flag 처리 |
