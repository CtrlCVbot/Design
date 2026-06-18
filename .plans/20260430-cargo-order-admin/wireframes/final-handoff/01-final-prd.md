# 최종 PRD: 화물 오더 접수/수정 UI/UX 전환

## 1. 목표

기존 프로젝트의 `화물관리 > 오더 접수/수정` 화면을 현재 기획된 결과물 기준으로 전환합니다.

구현 기준은 `baseline/html/cargo-order-admin-hifi-master.html`입니다. 다만 이 파일은 static prototype이므로 production code로 직접 복사하는 것이 아니라, 화면 상태, 정보 구조, interaction, visual hierarchy의 기준으로 사용합니다.

## 2. 핵심 사용자 가치

| 가치 | 구현 기준 |
| --- | --- |
| 빠른 신규 접수 | `신규(F3)` 이후 wizard 기반 입력 흐름 제공 |
| 기존 수정 흐름 유지 | 기존 화물 조회/수정은 wizard가 아니라 독립 다이얼로그 사용 |
| 입력과 확인 분리 | wizard의 `화물 등록 완료`는 API 저장이 아니라 메인 화면 적용 |
| 최종 저장 책임 명확화 | 메인 `화물 등록` 버튼만 실제 API 통신 실행 |
| 반복 입력 감소 | 주소/운송+품목 다이얼로그에 최근 사용 후보 제공 |
| 운영 보조 정보 확인 | 우측 `보조 정보` 탭에서 메모, 금액 로그, 운송 구간 지도 확인 |
| 운영 책임 가시화 | header 상태 chip 옆에 배차 담당자 chip 표시 |

## 3. 최종 범위

### MVP 포함

| 영역 | 포함 내용 | 기준 source |
| --- | --- | --- |
| 신규 접수 flow | `new-reset -> new-wizard-active -> new-required-complete -> new-driver-optional -> new-submitted` | `source-snapshot/sections/new-order-registration-flow/` |
| 메인 저장 CTA | `new-submitted` 이후 메인 `화물 등록` 버튼 표시, 최종 validation 후 API | `source-snapshot/sections/new-order-registration-flow/08-main-submit-api-policy.md` |
| 화면 publishing | master HTML의 최신 시각 상태, section order, header 상태 | `baseline/html/cargo-order-admin-hifi-master.html` |
| 보조 정보 | `메모`, `금액 로그`, `운송 구간 지도` 탭 | `source-snapshot/sections/reservation-area-tabs/` |
| 최근 사용 | 상차/하차 주소, 운송+품목 최근 후보 | `source-snapshot/sections/transport-dialog-recent-lists/` |
| header 운영 상태 | 상태, 거리, 기준금액, 배차 담당자, 라벨 토글 | `source-snapshot/root-docs/10-hifi-design-polish-and-dispatch-manager-integration-log.md` |
| handoff checklist | 기존 프로젝트 매핑, validation/API/권한 확인 | `03-implementation-handoff.md` |

### MVP 제외

| 항목 | 제외 이유 | 후속 확장 |
| --- | --- | --- |
| 전체 data contract viewer | 구현 전에는 필드 연결표로 충분 | visual hub v2 |
| 권한 matrix 전용 화면 | 권한 정책 미확정 | 정책 확정 후 추가 |
| QA scenario runner | 지금은 시나리오 목록과 AC 연결이 우선 | 테스트 자동화 이후 |
| API dependency map | 실제 API endpoint 미확정 | 기존 프로젝트 분석 후 |
| 정책 미결정 관리 화면 | 미결정은 문서 표로 충분 | 운영 정책 워크플로우 필요 시 |

## 4. 화면 구조 기준

| 순서 | 화면/섹션 | 구현 기준 |
| --- | --- | --- |
| Header | 상태 chip, 거리/기준금액, 배차 담당자, 라벨 토글 | 본문 섹션을 늘리지 않고 header 흐름에 compact하게 배치 |
| 1 | 화주 정보 | 신규 접수 첫 단계, 메모 mock 표시 조건과 연결 |
| 2 | 운송 구간 | 상차지/하차지, 주소 검색, 최근 장소, 지도 탭과 연결 |
| 3 | 화물 정보 | 운송+품목, 최근 조합, 품목/톤수/차종/대수/실중량 |
| 4 | 정산 정보 | 금액 입력, 조정금, 금액 로그 탭과 연결 |
| 확인 | 오더 요약 | 입력 단계가 아니라 검토용 섹션 |
| 선택 | 차주 정보 | 신규 접수에서는 선택 단계, 수정에서는 독립 다이얼로그 |
| 6 | 보조 정보 | 우측 패널, 메모/금액 로그/운송 구간 지도 |
| 하단 | 화물 목록 | 기존 목록/상태/후속 처리 유지, 현대화 후속 |

## 5. 상태 정책

| 상태 | 의미 | UI 정책 |
| --- | --- | --- |
| `idle-edit` | 기본 조회/수정 상태 | 섹션 헤더 숨김, 독립 다이얼로그 사용 |
| `new-reset` | 신규 접수 초기화 직후 | 섹션 헤더 표시, 화주 focus |
| `new-wizard-active` | wizard 입력 중 | 왼쪽 프로세스 패널 표시 |
| `new-required-complete` | 금액까지 필수 입력 완료 | `화물 등록 완료` 또는 `차주 정보로 이동` |
| `new-driver-optional` | 차주 선택 단계 | 차주 선택 또는 건너뛰기 |
| `new-submitted` | 메인 화면 적용 완료, pre-API | 섹션 헤더 숨김, 메인 `화물 등록` 버튼 표시 |
| `submit-validating` | 최종 validation 중 | API 요청 전 오류 확인 |
| `submit-pending` | API 통신 중 | 중복 클릭 방지 |
| `submit-failed` | API/validation 실패 | 데이터 유지, 재시도 가능 |
| `submit-complete` | API 성공 | 신규 접수 상태 종료 |

## 6. Data Contract 초안

실제 필드명은 기존 프로젝트 conventions에 맞춰 조정합니다. 아래는 구현 분석자가 기존 schema/API와 매핑해야 할 최소 모델입니다.

| 모델 | 역할 | 연결 화면 |
| --- | --- | --- |
| `CargoOrder` | 오더 상태, 처리시간, 표시 옵션, 플래그 | Header, 목록 |
| `Requester` | 화주/의뢰자, 사업자번호, 연락처 | 화주 정보 |
| `Location` | 상차/하차 지역, 상세주소, 담당자 연락 | 운송 구간 |
| `VehicleRequirement` | 톤수, 차종, 대수, 독차/혼적 | 화물 정보 |
| `CargoDetail` | 품목, 실중량, 운송 메모 | 화물 정보, 오더 요약 |
| `Pricing` | 청구금, 배차금, 수수료, 합계 | 정산 정보 |
| `PricingAdjustment` | 조정금 사유, 대상, 금액, 담당자, 시각 | 금액 로그 |
| `RecentLocation` | 최근 상차/하차 장소 | 주소 검색 다이얼로그 |
| `RecentCargoCombo` | 최근 운송+품목 조합 | 운송+품목 다이얼로그 |
| `CargoMemo` | 운영자 메모, 고객 요청, 배차 특이사항 | 보조 정보 메모 |
| `RoutePreview` | 좌표, 거리, 예상 시간, 경유 여부 | 운송 구간 지도 |
| `DispatchManager` | 담당자명, 상태, 변경 권한, 이력 | header chip |

## 7. Validation 기준

| 단계 | 필수/조건부 기준 | 실패 처리 |
| --- | --- | --- |
| 화주 정보 | 화주 식별 정보, 담당자 또는 연락처 | 현재 단계 오류 표시 |
| 상차지 | 주소, 상세주소 또는 장소명, 상차 정책 | 현재 단계 유지 |
| 하차지 | 주소, 상세주소 또는 장소명, 하차 정책 | 현재 단계 유지 |
| 운송+품목 | 톤수, 차종, 대수, 실중량, 품목 | 다음 단계 이동 차단 |
| 정산 정보 | 결제방법, 청구비용, 운송비용 | `new-required-complete` 차단 |
| 메인 `화물 등록` | 최신 메인 화면 데이터 전체 | API 요청 없이 첫 오류 섹션 focus |

## 8. API 정책

| 항목 | 정책 |
| --- | --- |
| 실제 저장 trigger | 메인 `화물 등록` 버튼만 허용 |
| wizard `화물 등록 완료` | API 저장이 아니라 메인 화면 적용 |
| payload 기준 | wizard snapshot이 아니라 메인 화면 최신 데이터 |
| 중복 방지 | `clientDraftId + payloadVersion` 기반 idempotency key |
| 실패 후 재시도 | 데이터가 같으면 같은 key, 수정되면 새 key |
| 서버 validation | 필드/섹션 오류로 매핑 필요 |

## 9. 보류 정책

| 영역 | 보류 항목 | 구현 영향 |
| --- | --- | --- |
| API | endpoint, payload schema, server validation code | 실제 저장 구현 전 P0 확인 |
| 필수값 | 드롭다운 전체 옵션, 조건부 필수 규칙 | validation 문구와 단계 이동 |
| 최근 사용 | 사용자/화주별 scope, 저장 시점, 마스킹 | API/DB 설계 |
| 보조 정보 | 지도 provider, 권한, 조정금 저장 단위 | 탭 data model |
| 배차 담당자 | 배정/변경 권한, 이력 UX | header chip 클릭/변경 여부 |
| 목록 | 숨은 컬럼, 상태별 버튼 활성화 | 하단 목록 회귀 |

## 10. Acceptance Criteria 요약

| 범위 | 핵심 AC |
| --- | --- |
| 신규 접수 시작 | `신규(F3)` 클릭 시 전체 초기화, `new-reset`, 화주 focus |
| wizard | 단계 순서가 `화주 -> 상차지 -> 하차지 -> 운송+품목 -> 금액 -> 차주 선택` |
| 메인 적용 | `화물 등록 완료`은 API 없이 `new-submitted`로 전환 |
| 최종 등록 | 메인 `화물 등록` 클릭 전에는 API 요청 없음 |
| 최근 주소 | 최근 row 클릭은 미리보기만 갱신, `상차지 적용`/`하차지 적용`이 확정 |
| 최근 운송+품목 | 최근 조합 클릭은 입력폼만 채움, `운송+품목 적용`이 확정 |
| 보조 정보 | 데이터 있음/없음/부분 데이터 상태를 같은 master 파일에서 확인 |
| header | 배차 담당자 chip과 `Aa` 라벨 토글이 header 상태 흐름에 존재 |

## 11. 구현 착수 판정

화면 기획과 static prototype 기준으로는 구현 착수 준비가 가능합니다.

단, 실제 API와 운영 데이터 연동 전에는 `API endpoint`, `payload schema`, `server validation`, `권한`, `최근 사용 개인정보 정책`을 P0로 확인해야 합니다.
