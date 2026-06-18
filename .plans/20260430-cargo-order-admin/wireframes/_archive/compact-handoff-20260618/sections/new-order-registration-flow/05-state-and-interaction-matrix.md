# 상태와 상호작용 매트릭스

## 상태 정의

| 상태 | 의미 | 진입 조건 | 종료 조건 |
| --- | --- | --- | --- |
| `idle-edit` | 기본/화물 수정 상태. 명세서형 보기. 헤더 숨김. 독립 다이얼로그 사용 | 초기 화면, 기존 화물 선택, 메인 적용 완료 후 일반 상태 | `신규 접수` 클릭 |
| `new-reset` | 신규 접수 클릭 직후. 안내형 보기. 전체 초기화. 번호 헤더 표시. 화주 focus | `신규 접수` 클릭과 초기화 완료 | 화주 정보 입력 시작 |
| `new-wizard-active` | 신규 접수 wizard 진행 중. 왼쪽 프로세스 패널 표시 | 화주 정보 입력 시작 | 금액 필수 입력 완료 또는 취소 |
| `new-required-complete` | 금액까지 필수 입력 완료. 메인 적용/차주 이동 선택 제공 | 금액 단계 validation 통과 | 메인 화면 적용 또는 차주 정보 이동 |
| `new-driver-optional` | 차주 정보 선택 입력 단계 | `차주 정보로 이동` 선택 | 차주 선택, 건너뛰기, 메인 화면 적용 |
| `new-submitted` | wizard 데이터가 메인 화면에 적용된 pre-API 상태. 헤더 숨김 | `화물 등록 완료` 또는 차주 단계 완료 | 메인 `화물 등록` 버튼 클릭 또는 개별 수정 |
| `submit-validating` | 메인 화면 최신 데이터 기준 최종 validation 실행 중 | 메인 `화물 등록` 클릭 | validation 통과 또는 실패 |
| `submit-pending` | 실제 API 통신 중 | validation 통과 | API 성공 또는 실패 |
| `submit-failed` | API 실패 또는 서버 validation 실패 | API 실패, timeout, 서버 validation 실패 | 재시도, 개별 수정, 취소 |
| `submit-complete` | API 성공 후 실제 등록 완료 | API 성공 | 일반 조회/수정 상태 |

## UI 표시 매트릭스

| 상태 | 섹션 초기화 | 섹션 헤더 | wizard | 왼쪽 프로세스 패널 | 독립 다이얼로그 | 화주 focus | 메인 `화물 등록` 버튼 | 빈 필수 입력 강조 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `idle-edit` | 없음 | 숨김 | 숨김 | 숨김 | 사용 | 없음 | 숨김 | 빈 필수 행에 좌측 상태 바와 버튼 reminder |
| `new-reset` | 완료 | 표시 | 아직 숨김 | 숨김 | 사용 안 함 | 있음 | 숨김 | 사용 안 함. 안내형 헤더와 focus가 우선 |
| `new-wizard-active` | 유지 | 표시 | 표시 | 표시 | 사용 안 함 | 없음 | 숨김 | 사용 안 함 |
| `new-required-complete` | 유지 | 표시 | 표시 | 표시 | 사용 안 함 | 없음 | 숨김 | 사용 안 함 |
| `new-driver-optional` | 유지 | 표시 | 표시 | 표시 | 사용 안 함 | 없음 | 숨김 | 사용 안 함 |
| `new-submitted` | 없음 | 숨김 | 숨김 | 숨김 | 사용 | 없음 | 표시 | 필수값이 다시 비면 좌측 상태 바와 버튼 reminder |

## 상태 전환

| 이벤트 | 현재 상태 | 다음 상태 | 메모 |
| --- | --- | --- | --- |
| `신규 접수` 클릭 | `idle-edit` | `new-reset` | 전체 초기화 후 화주 focus |
| `화주 정보 입력` 시작 | `new-reset` | `new-wizard-active` | wizard 다이얼로그 열기 |
| 화주 정보 완료 | `new-wizard-active` | `new-wizard-active` | 다음 단계 상차지 |
| 상차지 완료 | `new-wizard-active` | `new-wizard-active` | 다음 단계 하차지 |
| 하차지 완료 | `new-wizard-active` | `new-wizard-active` | 다음 단계 운송+품목 |
| 운송+품목 완료 | `new-wizard-active` | `new-wizard-active` | 다음 단계 금액 |
| 금액 완료 | `new-wizard-active` | `new-required-complete` | 분기 선택 표시 |
| `화물 등록 완료` 선택 | `new-required-complete` | `new-submitted` | API 통신 없이 전체 데이터를 메인 화면에 적용하고 메인 `화물 등록` 버튼 표시 |
| `차주 정보로 이동` 선택 | `new-required-complete` | `new-driver-optional` | 선택 단계 진입 |
| 차주 선택 완료 | `new-driver-optional` | `new-submitted` | 차주 포함 데이터를 메인 화면에 적용하고 메인 `화물 등록` 버튼 표시 |
| 차주 건너뛰기 | `new-driver-optional` | `new-submitted` | 차주 미지정 상태로 메인 화면에 적용하고 메인 `화물 등록` 버튼 표시 |
| 신규 접수 취소 | `new-reset`, `new-wizard-active`, `new-required-complete`, `new-driver-optional` | `idle-edit` | 입력값 폐기/유지 정책 확인 필요 |
| 등록 완료 후 개별 수정 | `new-submitted` | `idle-edit` 정책 유지 | 독립 다이얼로그만 사용 |
| 메인 `화물 등록` 클릭 | `new-submitted` | `submit-validating` | 최신 메인 화면 데이터 기준 최종 validation 시작 |
| validation 통과 | `submit-validating` | `submit-pending` | `idempotencyKey` 생성 후 API 요청 |
| validation 실패 | `submit-validating` | `new-submitted` | API 요청 없음. 첫 오류 섹션으로 scroll/focus |
| API 성공 | `submit-pending` | `submit-complete` | 실제 등록 완료, pre-API CTA 숨김 |
| API 실패 | `submit-pending` | `submit-failed` | 데이터 유지, 오류 표시, 재시도 가능 |
| 재시도 | `submit-failed` | `submit-validating` | 데이터가 바뀌지 않았으면 같은 `idempotencyKey` 사용 |
| 실패 후 개별 수정 | `submit-failed` | `new-submitted` | `payloadVersion` 증가, 수정 후 재등록 가능 |

## 단계별 validation

| 단계 | 필수 확인 | 실패 시 처리 |
| --- | --- | --- |
| 화주 정보 | 화주 식별 정보, 담당자 또는 연락처 | 현재 단계에 머무르고 오류 표시 |
| 상차지 | 주소, 상세주소 또는 장소명, 상차 일시/방법 정책 | 현재 단계에 머무름 |
| 하차지 | 주소, 상세주소 또는 장소명, 하차 일시/방법 정책 | 현재 단계에 머무름 |
| 운송+품목 | 톤수, 차종, 수량, 실중량 | 현재 단계에 머무름 |
| 금액 | 결제방법, 청구비용, 운송비용 | `new-required-complete`로 전환하지 않음 |
| 차주 정보 | 없음 | 건너뛰기 가능 |

## 기존 독립 다이얼로그와의 관계

| 흐름 | 호출 방식 |
| --- | --- |
| 신규 접수 wizard | 단계 컨트롤러가 기존 입력 UI를 wizard frame 안에서 순차 표시 |
| 화물 수정 | 기존처럼 개별 버튼에서 독립 다이얼로그 직접 호출 |
| 신규 접수 완료 후 수정 | `idle-edit`과 동일하게 독립 다이얼로그 직접 호출 |

## 기본 화면 필수 입력 강조 상태

명세서형 보기에서는 섹션 헤더가 숨겨지므로, 필수값이 없는 행 자체가 다음 입력 대상을 안내한다.

| 상태 | 적용 여부 | 정책 |
| --- | --- | --- |
| `idle-edit` | 적용 | 빈 필수 행에 좌측 상태 바와 입력 버튼 reminder 표시 |
| `new-submitted` | 조건부 적용 | 메인 적용 후 개별 수정 등으로 필수값이 비면 같은 정책 적용 |
| `new-reset` 이상 신규 접수 안내형 상태 | 미적용 | 번호형 섹션 헤더, focus, wizard가 안내 역할을 담당 |
| `submit-validating`, `submit-pending` | 미적용 | 전송 중에는 입력 유도 motion을 새로 시작하지 않음 |
| `submit-failed` | 적용 가능 | 실패 후 필수값 누락이 있으면 첫 오류 섹션 scroll/focus와 함께 정적 상태 바 우선 |

버튼 reminder는 최초 표시 시 최대 2회 pulse 후 중단하고, 값이 비어 있으면 10초 간격으로 1회 reminder만 다시 실행한다. 버튼 클릭, 값 입력 완료, 행 제거 시 timer를 정리한다.

## API submit 상태 정책

| 항목 | 정책 |
| --- | --- |
| API 트리거 | 메인 `화물 등록` 버튼만 허용 |
| payload 기준 | 메인 화면에 표시된 최신 데이터 |
| 중복 방지 | `clientDraftId + payloadVersion` 기반 `idempotencyKey` |
| 재시도 | 데이터가 바뀌지 않았으면 같은 `idempotencyKey` 재사용 |
| 실패 후 수정 | `payloadVersion` 증가 후 새 `idempotencyKey` 사용 |

## 리스크

| 항목 | 수준 | 설명 |
| --- | --- | --- |
| 최종 API 전송 책임 분리 | medium | `화물 등록 완료`는 화면 적용, 메인 `화물 등록`은 API 통신으로 역할을 분리해야 함 |
| reset 범위 과다/부족 | medium | 차주, 화물맨, 요약, 거리, 금액 계산 상태까지 모두 초기화해야 함 |
| 수정 흐름 혼동 | medium | `new-submitted` 이후 wizard가 다시 뜨지 않도록 상태 전환이 명확해야 함 |
| API endpoint 미연결 | medium | 정책은 확정했지만 실제 endpoint와 payload schema 연결 필요 |
