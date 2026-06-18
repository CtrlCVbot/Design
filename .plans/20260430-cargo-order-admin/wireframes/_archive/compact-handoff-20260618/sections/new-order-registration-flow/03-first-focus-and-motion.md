# 최초 focus와 attention motion

## 목표

`신규 접수` 클릭 직후 사용자가 다음 행동을 즉시 알 수 있게 한다.

초기화 이후에는 `화주 정보`가 첫 단계이므로 focus도 `화주 정보` 섹션 또는 `화주 정보 입력` 버튼으로 이동한다. attention motion은 사용자의 시선을 부드럽게 안내하는 용도이며, 경고처럼 느껴지는 움직임은 사용하지 않는다.

## focus 정책

| 상황 | focus 대상 | 메모 |
| --- | --- | --- |
| `신규 접수` 클릭 직후 | `화주 정보 입력` 버튼 우선 | 바로 Enter로 시작 가능 |
| 버튼이 없거나 비활성 | `화주 정보` 섹션 컨테이너 | `tabindex="-1"` 같은 programmatic focus 고려 |
| wizard가 열린 직후 | 다이얼로그 첫 입력 또는 검색 input | 현재 기준 `renderDialog()`의 `data-autofocus` 정책과 연결 가능 |
| 사용자가 직접 다른 요소를 클릭 | 사용자 선택 유지 | 강제 focus 이동 금지 |

## motion 추천안

### 1순위: soft focus ring

`화주 정보 입력` 버튼에 focus ring을 1회 또는 2회만 부드럽게 강조한다.

| 항목 | 권장 |
| --- | --- |
| 지속 시간 | 700ms 이하 |
| 반복 | 최대 2회 |
| 느낌 | 현재 focus ring보다 약간 더 넓고 부드러운 외곽선 |
| 장점 | 접근성과 의미가 명확함 |

### 2순위: glow pulse

버튼 주변에 약한 brand color glow를 적용한다.

| 항목 | 권장 |
| --- | --- |
| 지속 시간 | 600ms ~ 900ms |
| 반복 | 최대 2회 |
| 색상 | 기존 `--brand-600` 계열의 낮은 alpha |
| 주의 | 버튼이 CTA처럼 과하게 보이지 않도록 shadow 강도 제한 |

### 3순위: highlight sweep

버튼 내부 또는 버튼 배경에 아주 약한 sweep을 1회 적용한다.

| 항목 | 권장 |
| --- | --- |
| 지속 시간 | 700ms ~ 900ms |
| 반복 | 1회 권장 |
| 방향 | 좌에서 우 |
| 주의 | shimmer 광고처럼 보이지 않게 대비를 낮춤 |

## 금지

- shake motion 금지
- 무한 반복 금지. 단, 기본 화면의 빈 필수 입력은 아래 `기본 화면 필수 입력 reminder` 정책처럼 긴 간격의 1회성 reminder만 허용
- 버튼 위치를 실제로 이동시키는 transform 금지
- 빨강/노랑 경고색 중심 강조 금지
- focus가 없는 요소처럼 보이는 장식성 animation 금지

## 기본 화면 필수 입력 reminder

기본 화면 또는 `new-submitted` 이후의 명세서형 보기에서는 섹션 헤더가 숨겨진다. 따라서 비어 있는 필수 항목은 섹션 헤더가 아니라 본문 행 자체에서 알려야 한다.

적용 대상은 아직 값이 없는 필수 입력 행이다.

| 대상 | 조건 | 표시 |
| --- | --- | --- |
| 화주 | 화주 정보 없음 | 행 좌측 2px 상태 바, `화주 정보 입력` 버튼 강조 |
| 상차 | 상차지 정보 없음 | 행 좌측 2px 상태 바, `주소 검색` 버튼 강조 |
| 하차 | 하차지 정보 없음 | 행 좌측 2px 상태 바, `주소 검색` 버튼 강조 |
| 운송+품목 | 운송 정보 없음 | 행 좌측 2px 상태 바, `운송+품목 입력` 버튼 강조 |
| 금액 | 금액 정보 없음 | 행 좌측 2px 상태 바, `금액 입력` 버튼 강조 |

### 상태 바

좌측 상태 바는 motion 없이 정적으로 표시한다.

| 항목 | 정책 |
| --- | --- |
| 위치 | 빈 필수 입력 행의 좌측 inset |
| 두께 | 2px 수준 |
| 색상 | `--brand-600` 계열. 경고색 사용 금지 |
| 레이아웃 | margin, padding, grid 변경 없이 `box-shadow: inset` 등으로 처리 |

### 버튼 reminder motion

입력 버튼은 최초 표시 시 `soft glow pulse`를 최대 2회 실행한다.

그 뒤에도 값이 비어 있으면 10초 간격으로 1회 reminder pulse만 다시 실행한다. 사용자가 버튼을 클릭하거나 해당 값이 입력되어 빈 행이 사라지면 reminder를 중단한다.

| 항목 | 정책 |
| --- | --- |
| 최초 motion | `soft glow pulse` 최대 2회, 낮은 대비의 highlight sweep 1회 |
| 반복 reminder | 10초마다 1회. 계속 움직이는 무한 pulse 금지 |
| 중단 조건 | 버튼 클릭, 값 입력 완료, wizard 진입, 행 제거 |
| 성능 기준 | 버튼별 timer는 정리 가능해야 하며, DOM이 제거된 버튼을 계속 참조하지 않아야 함 |
| reduced motion | `prefers-reduced-motion: reduce`에서는 animation 생략, 정적 상태 바와 focus ring만 유지 |

이 정책은 신규 접수 wizard의 왼쪽 프로세스 패널이나 번호형 헤더를 대체하지 않는다. 헤더가 숨겨지는 명세서형 보기에서만 필수 입력 발견성을 보강한다.

## 중단 조건

attention motion은 아래 이벤트에서 즉시 중단한다.

| 이벤트 | 처리 |
| --- | --- |
| 사용자가 `화주 정보 입력` 버튼 클릭 | motion 중단 후 wizard 열기 |
| 사용자가 Tab 또는 마우스로 다른 요소 이동 | motion 중단 |
| wizard가 열린 상태 | motion 표시하지 않음 |
| `idle-edit` 또는 `new-submitted` 전환 | `화주 정보 입력` 버튼 motion 표시하지 않음. 메인 `화물 등록` CTA motion은 `07-main-submit-cta-visibility.md` 정책을 따름 |
| 사용자가 입력을 시작 | motion 중단 |
| 기본 화면 빈 필수 입력 버튼 클릭 | 해당 버튼의 reminder motion 중단 후 독립 다이얼로그 열기 |
| 기본 화면 빈 필수 값 입력 완료 | 해당 행의 상태 바와 버튼 reminder 제거 |

## `prefers-reduced-motion` 대응

사용자가 시스템에서 motion 축소를 선택한 경우 animation을 실행하지 않는다.

대신 아래 중 하나로 대체한다.

| 대체 방식 | 설명 |
| --- | --- |
| 정적 focus ring | focus 상태만 명확히 표시 |
| 짧은 배경 강조 | 1ms 수준의 transition 또는 즉시 적용/해제 |
| live region 안내 | 필요한 경우 `화주 정보부터 입력하세요` 같은 보조 안내를 screen reader에 제공 |

## 권장 문구

화면에 별도 설명 문구를 추가하는 것은 MVP에서 권장하지 않는다. 이미 버튼, focus, 섹션 헤더가 다음 행동을 안내하기 때문이다.

다만 screen reader용 보조 안내가 필요하면 시각적으로 숨긴 live region에서만 짧게 제공한다.

예시:

```text
신규 접수가 시작되었습니다. 화주 정보부터 입력하세요.
```

## 확인 필요

| 항목 | 확인 이유 |
| --- | --- |
| 버튼의 실제 DOM 식별자 | 구현 시 focus 대상 selector 확정 필요 |
| 기존 local motion class 재사용 여부 | 현재 기준 화면의 `hifi-motion-*` 계열과 충돌 방지 필요 |
| focus 이동 타이밍 | reset/render 완료 후 focus해야 하므로 render lifecycle 확인 필요 |
