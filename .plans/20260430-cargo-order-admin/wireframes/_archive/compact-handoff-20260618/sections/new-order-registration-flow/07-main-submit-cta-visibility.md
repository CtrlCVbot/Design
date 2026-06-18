# 메인 `화물 등록` 버튼 표시와 attention UI/UX

## 핵심 정정

wizard의 `화물 등록 완료`는 실제 API 저장이 아니다.

이 동작은 신규 접수 wizard에서 입력한 전체 데이터를 메인 화면에 적용하는 단계다. 적용 후 사용자는 메인 화면에서 내용을 한 번 더 확인하고, 별도의 `화물 등록` 버튼을 눌러 실제 API 통신을 시작한다.

| 구분 | 의미 |
| --- | --- |
| `화물 등록 완료` | wizard 데이터를 메인 화면에 적용 |
| `화물 등록` | 메인 화면에서 실제 API 통신을 시작하는 최종 CTA |
| `new-submitted` | API 저장 완료가 아니라 pre-API 메인 적용 상태 |

## 버튼 노출 정책

| 상황 | `화물 등록` 버튼 |
| --- | --- |
| `idle-edit` | 숨김 |
| `new-reset` | 숨김 |
| `new-wizard-active` | 숨김 |
| `new-required-complete` | 숨김 |
| `new-driver-optional` | 숨김 |
| `new-submitted` | 표시 |

`new-submitted`에서 개별 수정이 발생해도 버튼은 유지한다. 버튼이 전송할 데이터는 메인 화면에 표시된 최신 값이어야 한다.

## 추천 UI 구조

### 추천안 A: 상단 action slot reveal

메인 화면 상단의 주요 action 영역에 `화물 등록` 버튼을 표시한다.

| 항목 | 정책 |
| --- | --- |
| 위치 | 기존 `신규 접수` 또는 주요 action 버튼이 있는 영역 |
| 장점 | 사용자가 다음 최종 행동을 바로 찾기 쉬움 |
| 주의 | 기존 수정/취소/정산 버튼과 시각적 우선순위 충돌 방지 |

### 추천안 B: 하단 sticky action bar

화면 하단에 얇은 sticky action bar를 표시하고, 오른쪽에 `화물 등록` 버튼을 둔다.

| 항목 | 정책 |
| --- | --- |
| 위치 | viewport 하단 |
| 장점 | 사용자가 스크롤 중이어도 최종 CTA를 놓치지 않음 |
| 주의 | 화면을 가리지 않도록 높이를 낮게 유지 |

### 추천안 C: 요약 섹션 근처 CTA

오더 요약 또는 최종 확인 영역 근처에 `화물 등록` 버튼을 배치한다.

| 항목 | 정책 |
| --- | --- |
| 위치 | 요약 섹션 우측 또는 하단 |
| 장점 | 확인 후 등록이라는 흐름이 자연스러움 |
| 주의 | 요약 섹션이 화면 밖에 있으면 발견성이 낮아질 수 있음 |

## 권장 조합

MVP에서는 `상단 action slot reveal + 짧은 focus/glow pulse` 조합을 추천한다.

이 조합은 새 레이아웃 부담이 작고, 사용자가 wizard를 닫은 직후 다음 행동을 찾기 쉽다. 버튼이 화면에 없는 상황이 자주 발생하면 후속으로 하단 sticky action bar를 검토한다.

## attention motion 제안

| 제안 | 설명 | 반복 |
| --- | --- | --- |
| CTA reveal fade | 버튼이 action 영역에 120ms ~ 180ms로 부드럽게 나타남 | 1회 |
| soft focus ring | 버튼 주위 focus ring을 1회 강조 | 1회 |
| glow pulse | brand color 기반 약한 glow를 적용 | 최대 2회 |
| highlight sweep | 버튼 내부에 낮은 대비의 sweep 적용 | 1회 |
| summary-to-CTA handoff | 요약 섹션에서 버튼 방향으로 매우 약한 highlight 연결 | 1회 |

## 금지/제한

- shake motion 금지
- 무한 반복 금지
- 버튼 위치가 흔들리거나 레이아웃이 밀리는 animation 금지
- warning color 중심 강조 금지
- 2회 초과 pulse 금지
- 버튼을 지나치게 큰 hero CTA처럼 만들지 않기

## `prefers-reduced-motion` 대응

motion 축소 환경에서는 animation을 생략한다.

대신 버튼에 정적 focus ring 또는 상태 badge만 제공한다. 필요하면 screen reader용 live region으로 아래 정도의 짧은 상태만 알린다.

```text
입력한 화물 정보가 메인 화면에 적용되었습니다. 화물 등록 버튼으로 최종 등록할 수 있습니다.
```

## 적용 완료 feedback

`new-submitted` 진입 직후에는 버튼만 튀어나오는 것보다, 메인 화면에 데이터가 반영되었다는 상태도 함께 보여주는 편이 안전하다.

| UI | 역할 |
| --- | --- |
| 버튼 focus | 다음 행동 안내 |
| 요약 섹션 soft highlight | 적용된 데이터 위치 안내 |
| 짧은 status chip | `등록 전` 또는 `적용됨` 상태 표현 |
| live region | 보조 기술 사용자에게 상태 변화 전달 |

status chip은 제품 설명 문구가 아니라 현재 데이터 상태를 알려주는 짧은 상태값으로만 사용한다.

## 개별 수정 이후 정책

`new-submitted` 상태에서 사용자가 금액, 주소, 차주 정보를 다시 수정하면 wizard를 재개하지 않는다.

수정 완료 후에는 `화물 등록` 버튼을 유지하고, 수정된 섹션 또는 버튼에 짧은 field flash를 1회만 적용할 수 있다. 이때도 실제 API 통신은 `화물 등록` 버튼 클릭 전까지 발생하지 않는다.

## Acceptance 메모

- `화물 등록 완료` 클릭 시 네트워크 요청이 발생하지 않아야 한다.
- `new-submitted` 진입 후 `화물 등록` 버튼이 표시되어야 한다.
- 버튼은 keyboard focus가 가능해야 한다.
- attention motion은 최대 2회 이하로 제한한다.
- reduced motion 환경에서는 정적 상태 표시로 대체한다.
- 최종 API 통신은 메인 `화물 등록` 버튼 클릭에서만 발생해야 한다.
- API 통신, validation, 중복 방지, 재시도 정책은 `08-main-submit-api-policy.md`를 따른다.
