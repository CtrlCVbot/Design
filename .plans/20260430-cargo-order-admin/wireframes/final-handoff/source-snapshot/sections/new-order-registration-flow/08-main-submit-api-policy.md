# 메인 `화물 등록` API 정책

## 핵심 원칙

메인 화면의 `화물 등록` 버튼만 실제 API 통신을 실행한다.

wizard의 `화물 등록 완료`는 API 저장이 아니라 메인 화면 적용 동작이다. 사용자는 메인 화면에서 데이터를 최종 확인하고, `화물 등록` 버튼을 눌러 실제 등록 요청을 보낸다.

| 항목 | 정책 |
| --- | --- |
| API 트리거 | 메인 화면의 `화물 등록` 버튼 |
| 데이터 기준 | wizard 원본이 아니라 메인 화면에 적용된 최신 데이터 |
| 버튼 표시 | `new-submitted` 진입 후 표시 |
| 버튼 클릭 전 API | 발생하지 않음 |
| 중복 클릭 | 첫 클릭만 인정하고 이후 클릭은 loading 중 무시 |
| 실패 처리 | 입력값 유지, 오류 안내, 재시도 가능 |
| 성공 처리 | 실제 등록 완료 상태로 전환 |

## 상태 정의

| 상태 | 의미 | UI |
| --- | --- | --- |
| `new-submitted` | wizard 데이터가 메인 화면에 적용된 pre-API 상태 | `화물 등록` 버튼 표시 |
| `submit-validating` | 최종 validation 실행 중 | 버튼 disabled, `검증 중...` |
| `submit-pending` | API 통신 중 | 버튼 disabled, `등록 중...` |
| `submit-failed` | API 실패 또는 서버 validation 실패 | 오류 안내, `다시 등록` 가능 |
| `submit-complete` | API 성공 | 실제 등록 완료, 일반 조회/수정 상태 |

## 권장 플로우

1. 사용자가 wizard에서 `화물 등록 완료`를 선택한다.
2. API 통신 없이 전체 데이터가 메인 화면에 적용된다.
3. 상태는 `new-submitted`가 된다.
4. 메인 화면에 `화물 등록` 버튼이 표시된다.
5. 사용자가 메인 화면에서 최종 데이터를 확인한다.
6. `화물 등록` 버튼을 클릭한다.
7. 상태는 `submit-validating`으로 전환된다.
8. 최종 validation을 실행한다.
9. validation 통과 시 상태는 `submit-pending`으로 전환되고 API 요청을 보낸다.
10. API 성공 시 상태는 `submit-complete`로 전환한다.
11. API 실패 시 상태는 `submit-failed`로 전환하고 메인 화면 데이터는 유지한다.
12. 사용자는 오류를 수정하거나 그대로 재시도할 수 있다.

## 최종 validation 정책

메인 `화물 등록` 버튼 클릭 후에는 API 요청 전에 최종 validation을 한 번 더 실행한다.

| 결과 | 처리 |
| --- | --- |
| 필수값 통과 | API 요청 진행 |
| 필수값 누락 | API 요청 없음. 해당 섹션으로 scroll/focus |
| 클라이언트 형식 오류 | API 요청 없음. 필드 또는 섹션 오류 표시 |
| 서버 validation 실패 | `submit-failed`. 서버 오류를 필드/섹션에 매핑 |

최종 validation은 wizard 단계 validation과 별개다. `new-submitted` 이후 개별 수정이 가능하므로, 실제 API 전송 직전에 최신 화면 데이터 기준으로 다시 검증해야 한다.

## 데이터 기준

API payload는 메인 화면에 표시된 최신 데이터를 기준으로 만든다.

| 데이터 | 정책 |
| --- | --- |
| 화주 정보 | 메인 화면 적용값 기준 |
| 상차지/하차지 | 메인 화면 적용값 기준 |
| 운송+품목 | 메인 화면 적용값 기준 |
| 금액 | 메인 화면 적용값 기준 |
| 차주 정보 | 선택된 경우 포함, 건너뛴 경우 미지정 상태로 전송 |
| 개별 수정 후 값 | 수정된 최신값을 전송 |

wizard 원본 snapshot을 별도로 유지하더라도 API payload의 source of truth는 메인 화면 적용 데이터다.

## 중복 등록 방지 정책

중복 요청 방지를 위해 `clientDraftId`와 `idempotencyKey`를 사용한다.

`Idempotency Key`는 같은 등록 요청을 서버가 같은 요청으로 인식하게 하는 키다. 사용자가 버튼을 여러 번 누르거나 네트워크 응답이 끊겨 재시도하더라도 동일 오더가 중복 생성되지 않게 한다.

| 항목 | 정책 |
| --- | --- |
| `clientDraftId` 생성 | `new-reset` 진입 시 생성 |
| `clientDraftId` 유지 | `submit-complete` 또는 신규 접수 취소 전까지 유지 |
| `payloadVersion` | `new-submitted` 이후 개별 수정 시 증가 |
| `idempotencyKey` 생성 | `화물 등록` 클릭 시 `clientDraftId + payloadVersion` 기준 생성 |
| 재시도 | 데이터가 바뀌지 않았으면 같은 `idempotencyKey` 재사용 |
| 실패 후 수정 | 데이터가 바뀌면 `payloadVersion` 증가 후 새 `idempotencyKey` 사용 |

## 버튼 상태

| 상태 | 버튼 문구 | 활성 여부 | 동작 |
| --- | --- | --- | --- |
| `new-submitted` | `화물 등록` | 활성 | 클릭 시 validation 시작 |
| `submit-validating` | `검증 중...` | 비활성 | 중복 클릭 방지 |
| `submit-pending` | `등록 중...` | 비활성 | API 통신 중 |
| `submit-failed` | `다시 등록` | 활성 | 같은 데이터면 같은 key로 재시도 |
| `submit-complete` | 표시 안 함 또는 `등록 완료` | 비활성 | 일반 조회/수정 상태 |

## 오류 처리

| 오류 | 처리 |
| --- | --- |
| 필수값 누락 | 해당 섹션으로 이동하고 첫 오류 필드에 focus |
| 서버 validation 실패 | 서버 메시지를 관련 필드/섹션에 표시 |
| 네트워크 실패 | 상단 toast와 버튼 하단 보조 문구 표시 |
| timeout | `submit-failed`로 전환하고 같은 key 재시도 허용 |
| 중복 요청 감지 | 기존 등록 결과를 보여주거나 상세/목록으로 이동 |
| 알 수 없는 실패 | 데이터 유지, 오류 코드 표시, 재시도 가능 |

## 성공 처리

API 성공 시에는 `submit-complete`로 전환한다.

성공 이후에는 신규 접수 전용 상태를 종료하고 일반 조회/수정 화면으로 고정한다. 섹션 헤더, wizard, 왼쪽 프로세스 패널, pre-API `화물 등록` CTA는 표시하지 않는다.

## Acceptance 메모

- `화물 등록 완료` 클릭 시 API 요청이 없어야 한다.
- 메인 `화물 등록` 클릭 전에는 API 요청이 없어야 한다.
- 메인 `화물 등록` 클릭 시 최종 validation이 먼저 실행되어야 한다.
- validation 실패 시 API 요청이 없어야 한다.
- API 요청 중 버튼은 disabled 상태여야 한다.
- 같은 데이터 재시도는 같은 `idempotencyKey`를 사용해야 한다.
- 실패 후 데이터가 바뀌면 새 `idempotencyKey`를 사용해야 한다.
- 성공 후에는 `submit-complete`로 전환하고 pre-API CTA를 숨겨야 한다.
