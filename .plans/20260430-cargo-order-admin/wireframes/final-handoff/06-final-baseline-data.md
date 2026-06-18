# 최종 기준 데이터 취합본

## 목적

이 문서는 현재 최종 기준 데이터를 `final-handoff` 안에서 바로 확인할 수 있도록 취합한 구현 전 데이터 카탈로그입니다.

원문 source를 대체하지 않습니다. 구현자가 다른 PC에서 기존 프로젝트를 분석할 때, 어떤 상태, 섹션, 데이터 모델, validation, API 정책, QA 기준을 먼저 매핑해야 하는지 빠르게 확인하는 용도입니다.

구조화 데이터는 `data/final-baseline.json`에 함께 정리했습니다.

## 1. 최종 기준 요약

| 항목 | 최종 기준 |
| --- | --- |
| 통합 publishing 기준 | `baseline/html/cargo-order-admin-hifi-master.html` |
| 기준 상태 | `master-current` |
| 상세 source | `source-snapshot/sections/*` |
| 신규 접수 source | `source-snapshot/sections/new-order-registration-flow/` |
| 보조 정보 source | `source-snapshot/sections/reservation-area-tabs/` |
| 최근 사용 source | `source-snapshot/sections/transport-dialog-recent-lists/` |
| Header polish source | `source-snapshot/root-docs/10-hifi-design-polish-and-dispatch-manager-integration-log.md` |
| 구현 인계 source | `03-implementation-handoff.md` |

## 2. Screen State 기준

| 상태 | 의미 | 구현 기준 |
| --- | --- | --- |
| `idle-edit` | 기존 조회/수정 상태 | 섹션 헤더 숨김, 독립 다이얼로그 사용 |
| `new-reset` | 신규 접수 초기화 직후 | 전체 입력 초기화, 화주 focus |
| `new-wizard-active` | 신규 접수 wizard 진행 | 왼쪽 프로세스 패널 표시 |
| `new-required-complete` | 금액까지 필수 입력 완료 | `화물 등록 완료` 또는 `차주 정보로 이동` 분기 |
| `new-driver-optional` | 차주 선택 단계 | 차주 선택 또는 건너뛰기 가능 |
| `new-submitted` | 메인 화면 적용 완료, pre-API | 섹션 헤더 숨김, 메인 `화물 등록` 표시 |
| `submit-validating` | 최종 validation 중 | API 요청 전 최신 화면 데이터 검증 |
| `submit-pending` | API 통신 중 | 버튼 disabled, 중복 클릭 방지 |
| `submit-failed` | API 또는 server validation 실패 | 데이터 유지, 재시도 가능 |
| `submit-complete` | 실제 등록 성공 | 신규 접수 상태 종료 |

## 3. Section / Component 기준

| 영역 | 최종 기준 | 연결 데이터 |
| --- | --- | --- |
| Header 상태 | 상태, 거리, 기준금액, 배차 담당자, `Aa` 라벨 토글 | `CargoOrder`, `RoutePreview`, `Pricing`, `DispatchManager` |
| 화주 정보 | 신규 접수 첫 단계, 화주/의뢰자 정보 | `Requester`, `CargoMemo` |
| 운송 구간 | 상차지, 하차지, 주소 검색, 최근 장소 | `Location`, `RecentLocation`, `RoutePreview` |
| 화물 정보 | 톤수, 차종, 대수, 실중량, 품목, 최근 조합 | `VehicleRequirement`, `CargoDetail`, `RecentCargoCombo` |
| 정산 정보 | 청구금, 배차금, 수수료, 조정금, 수익 | `Pricing`, `PricingAdjustment` |
| 오더 요약 | 입력 단계가 아니라 확인용 | `CargoOrder`, `CargoDetail`, `Pricing` |
| 차주 정보 | 신규 접수에서는 선택, 수정에서는 독립 다이얼로그 | `DriverAssignment` |
| 보조 정보: 메모 | 운영자 메모, 고객 요청, 배차 특이사항 | `CargoMemo` |
| 보조 정보: 금액 로그 | 조정금 명세, 합계, 수익 | `Pricing`, `PricingAdjustment` |
| 보조 정보: 운송 구간 지도 | 거리, 예상 시간, 경유, 좌표 상태 | `RoutePreview`, `Location` |
| 하단 목록 | 기존 목록과 후속 처리 유지 | `CargoOrder`, `DriverAssignment`, `SettlementDocument` |

## 4. Data Contract 취합

| 모델 | 핵심 필드/역할 | 연결 화면 |
| --- | --- | --- |
| `CargoOrder` | 화물ID, 상태, 처리시간, 표시 옵션, 긴급/예약/경유 플래그 | Header, 목록, 저장 |
| `Requester` | 화주/의뢰자명, 구분, 사업자번호, 연락처, 담당자 | 화주 정보 |
| `Location` | 상차/하차 구분, 지역 3단계, 상세주소, 담당자, 연락처 | 운송 구간 |
| `VehicleRequirement` | 톤수, 차종, 광폭, 대수, 독차/혼적 | 화물 정보 |
| `CargoDetail` | 품목, 실중량, 화물정보, 추가정보, 특이사항 | 화물 정보, 오더 요약 |
| `Pricing` | 결제방법, 청구금, 배차금, 수수료, 합계, 수익 | 정산 정보, 금액 로그 |
| `PricingAdjustment` | 사유 코드, 대상, 부호 포함 금액, 설명, 담당자, 처리 시각 | 금액 로그 |
| `RecentLocation` | 상차/하차, 장소명, 주소, 출처, 최근 사용 시각, 마스킹 | 주소 검색 다이얼로그 |
| `RecentCargoCombo` | 톤수, 차종, 대수, 실중량, 품목, 중복 제거 key | 운송+품목 다이얼로그 |
| `CargoMemo` | 메모 유형, 내용, 작성자, 작성 시각, 권한 | 보조 정보 메모 |
| `RoutePreview` | 좌표, 거리, 예상 시간, 경유 여부, route status | 보조 정보 지도 |
| `DispatchManager` | 담당자명, 팀/근무 상태, 마지막 확인 시각, 변경 권한, 이력 | Header chip |
| `DriverAssignment` | 차주명, 차주전화, 차량번호, 차량종류, 사업자번호 | 차주 정보 |
| `SettlementDocument` | 전자세금계산서, 인수증, 계산서발행일, 계산서금액, 위탁증 | 증빙/정산 |

## 5. Validation 기준

| 단계 | 필수 확인 | 실패 처리 |
| --- | --- | --- |
| 화주 정보 | 화주 식별 정보, 담당자 또는 연락처 | 현재 단계에 머무르고 오류 표시 |
| 상차지 | 주소, 상세주소 또는 장소명, 상차 일시/방법 정책 | 다음 단계 이동 차단 |
| 하차지 | 주소, 상세주소 또는 장소명, 하차 일시/방법 정책 | 다음 단계 이동 차단 |
| 운송+품목 | 톤수, 차종, 대수, 실중량, 품목 | 다음 단계 이동 차단 |
| 정산 정보 | 결제방법, 청구비용, 운송비용 | `new-required-complete` 전환 차단 |
| 차주 정보 | 없음 | 선택/건너뛰기 가능 |
| 메인 `화물 등록` | 메인 화면 최신 데이터 기준 전체 validation | API 요청 없이 첫 오류 섹션으로 focus |

## 6. API / 저장 정책

| 항목 | 최종 기준 |
| --- | --- |
| 실제 저장 trigger | 메인 화면의 `화물 등록` 버튼 |
| wizard `화물 등록 완료` | API 저장이 아니라 메인 화면 적용 |
| payload source | wizard snapshot이 아니라 메인 화면 최신 데이터 |
| validation 순서 | client 최종 validation 후 API 요청 |
| 중복 등록 방지 | `clientDraftId + payloadVersion` 기반 idempotency key |
| 재시도 | 데이터가 같으면 같은 key, 수정되면 새 key |
| 실패 처리 | 데이터 유지, 오류 안내, 재시도 가능 |
| 성공 처리 | `submit-complete` 후 신규 접수 상태 종료 |

## 7. 보류 정책 Backlog

| 우선순위 | 영역 | 보류 항목 | 구현 영향 |
| --- | --- | --- | --- |
| P0 | 신규 접수 저장 | 실제 endpoint, payload schema, server validation | 저장 구현 차단 |
| P0 | 필수값 | 실제 프로그램 validation, 드롭다운 옵션 | wizard gate와 오류 문구 |
| P0 | 최근 사용 | 화주별/사용자별 scope, 저장 시점 | API/DB 설계 |
| P0 | 개인정보 | 연락처/담당자명 표시와 마스킹 | 최근 장소 row, preview |
| P0 | 금액 권한 | 금액 로그 조회, 조정금 입력, 마스킹 | 보조 정보 금액 로그 |
| P0 | 정산 후 수정 | 정산 완료 후 조정금 수정 가능 여부 | 금액 API와 감사 로그 |
| P1 | 지도 provider | 지도 API, 비용, 쿼터, fallback | 운송 구간 지도 |
| P1 | 메모 권한 | 작성/수정/삭제, 공개 범위, 보존 기간 | 메모 dialog와 리스트 액션 |
| P1 | 배차 담당자 | 배정/변경 권한, 이력, 미지정 상태 | Header chip 후속 UX |
| P2 | 목록/팝업 | 숨은 컬럼, 상태별 버튼 활성화, 위탁증/정보변경 팝업 | 하단 목록 현대화 |

## 8. QA Gate 취합

| Gate | 확인 기준 |
| --- | --- |
| 신규 접수 시작 | `신규(F3)` 후 전체 초기화, `new-reset`, 화주 focus |
| wizard 단계 | 화주 -> 상차지 -> 하차지 -> 운송+품목 -> 금액 -> 차주 선택 |
| API 책임 분리 | `화물 등록 완료`에서 API 요청 없음 |
| 최종 등록 | 메인 `화물 등록`에서 validation 후 API 요청 |
| 주소 최근 | 최근 row 클릭은 미리보기만 갱신, 적용 버튼이 확정 |
| 운송+품목 최근 | 최근 조합 클릭은 입력폼만 갱신, 적용 버튼이 확정 |
| 보조 정보 | 메모/금액 로그/지도 탭, empty/loading/error/data 상태 |
| Header | 배차 담당자 chip, `Aa` 라벨 토글, 거리/기준금액 chip |
| 회귀 | 기존 조회/수정 상태에서는 wizard/프로세스 패널 표시 안 함 |

## 9. 개발자 사용법

1. `data/final-baseline.json`에서 구현 대상 screen state와 data contract를 먼저 확인합니다.
2. 기존 프로젝트의 route, component, store, API를 `03-implementation-handoff.md`의 매핑 표에 채웁니다.
3. 구현 전 P0 backlog를 제품/개발 결정으로 닫습니다.
4. Visual hub를 만들 경우 `visual-handoff-hub/data/hub-map.json`과 이 JSON을 함께 사용합니다.

## 10. 유지 원칙

| 원칙 | 기준 |
| --- | --- |
| 원문 유지 | 상세 설명은 `source-snapshot/sections/*`와 루트 문서가 source |
| 취합본 갱신 | 최종 결정이 바뀌면 이 문서와 `data/final-baseline.json`을 함께 갱신 |
| 후보 HTML 관리 | 최종 안내는 master HTML만 사용 |
| 삭제 금지 | 삭제는 하지 않음. 비최종 active 산출물은 `_archive/compact-handoff-20260618/`에 보존 |
