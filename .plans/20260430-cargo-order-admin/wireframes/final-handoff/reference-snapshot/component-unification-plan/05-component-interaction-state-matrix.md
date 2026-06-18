# Component Interaction State Matrix

## 목적

이 문서는 각 컴포넌트가 `입력 전`, `적용 후`, `hover/focus`, `라벨 보기 ON` 상태에서 어떻게 보여야 하는지 한눈에 비교하기 위한 상태 매트릭스입니다.

기존 문서의 역할은 다음과 같이 나뉩니다.

| 문서 | 역할 |
| --- | --- |
| `02-component-unification-options.md` | Option D+의 개념과 추천 이유 |
| `03-component-state-guideline.md` | 상태별 UI 규칙 |
| `04-implementation-checklist.md` | 실제 HTML 반영 작업 |
| `05-component-interaction-state-matrix.md` | 컴포넌트별 상태 디자인 비교표 |

## 공통 상태 문법

| 상태 | 목적 | 기본 구조 | 라벨 처리 | 버튼 처리 |
| --- | --- | --- | --- | --- |
| 입력 전 | 아직 값이 적용되지 않은 상태에서 다음 action 유도 | `kind + 짧은 placeholder + action` | 2행 라벨 적용하지 않음 | 입력/연동 버튼 노출 |
| 적용 후 | 데이터 확인과 빠른 수정 진입 | `kind + data fields + action` | 기본 OFF는 compact, ON은 2행 라벨 | 변경 버튼은 row 끝 |
| hover/focus | compact 상태에서 필드 의미와 수정 가능성 안내 | 해당 field highlight | field 상단 임시 라벨 | inline edit이면 작은 수정 affordance |
| 라벨 보기 ON | 검수/초보자용 상세 확인 | 1행 라벨, 2행 데이터 | 모든 대상 field 라벨 상단 고정 | action 위치 유지 |
| 수정 중 | 값 편집 | 같은 위치에서 input/select 전환 | field label 유지 또는 임시 표시 | Enter/blur로 적용 |
| dialog 열림 | row 전체 변경 또는 외부 조회 | modal surface | dialog 내부 라벨 명시 | 적용/취소 action |

## 전체 컴포넌트 매트릭스

| 컴포넌트 | 입력 전 | 적용 후 | hover/focus | 라벨 보기 ON |
| --- | --- | --- | --- | --- |
| 화주 정보 | 기본 적용 상태이므로 별도 입력 전 없음 | compact row: 화주, 업체명, 사업자번호, 담당자, 연락처, 이메일, 변경 | 각 field 상단 임시 라벨. 연락처/이메일은 inline edit affordance | 1행 라벨, 2행 데이터. 변경 버튼 위치 유지 |
| 운송 구간 | 주소 미적용 시 `상차지 입력`, `하차지 입력` action 중심 | 상차/하차 compact row. 지명, 주소, 상세주소, 담당자, 연락처, 일시, 방법, 변경 | 주소/상세주소/담당자/연락처/일시/방법 field 상단 임시 라벨 | 적용은 신중. 우선 담당자/연락처/일시/방법만 2행 후보 |
| 화물 운송정보 | `운송+품목 입력`, `금액 조건 선택` row | 운송 row와 금액 row. 필드 위치 고정 | 톤수/차종/대수/실중량/품목/금액 field 상단 임시 라벨 | 운송 row와 금액 row 모두 1행 라벨, 2행 데이터 |
| 화물정보 요약 | 요약 자동 생성 전 placeholder | `요약 + 본문` compact row | row hover/focus 시 수정 버튼 노출. 임시 라벨 필요성 낮음 | 적용 낮음. 켜도 본문 라벨은 생략 가능 |
| 차주 정보 | `화물맨 연동 + placeholder + 차주/차량 입력` | 차주 배차 row. 차주명, 차량번호, 연락처, 톤수, 차종, 출처, 변경 | 각 field 상단 임시 라벨. 연락처/톤수/차종은 inline edit affordance | 1행 라벨, 2행 데이터. 화물맨 출처도 같은 컬럼 유지 |

## 섹션별 상세 매트릭스

### 1. 화주 정보

| 상태 | 디자인 규칙 | 표시 예 |
| --- | --- | --- |
| 입력 전 | 없음. 기본적으로 선택된 화주 정보가 있는 상태를 기준으로 함 | 해당 없음 |
| 적용 후 | compact row. `화주` kind chip, field 값, row 끝 `화주/담당자 변경` | `화주 로지스팩토리 123-45-67890 김민수 010-1234-5678` |
| hover/focus | field 상단에 `화주 업체명`, `사업자 번호`, `담당자명` 등 임시 라벨 표시 | field 내부 overlay |
| 라벨 보기 ON | 모든 field가 2행 구조. 1행 라벨, 2행 데이터 | `화주 업체명 / 로지스팩토리` |
| 수정 중 | 연락처/이메일은 같은 위치에서 input 전환 | field width 유지 |
| dialog | 화주/담당자 변경 버튼 클릭 시 통합 조회 dialog | 기존 dialog 유지 |

우선 적용 필드:

| 필드 | hover/focus 임시 라벨 | 2행 라벨 |
| --- | --- | --- |
| 화주 업체명 | 적용 | 적용 |
| 사업자 번호 | 적용 | 적용 |
| 담당자명 | 적용 | 적용 |
| 담당자 연락처 | 적용 | 적용 |
| 담당자 이메일 | 적용 | 적용 |

### 2. 운송 구간

| 상태 | 디자인 규칙 | 표시 예 |
| --- | --- | --- |
| 입력 전 | 주소가 없으면 `상차지 입력`, `하차지 입력` 버튼 중심. 긴 설명 문구는 제외 | `상차 상차지 입력` |
| 적용 후 | 상차/하차 compact row. 지명, 주소, 상세주소, 담당자, 연락처, 일시, 방법 순서 고정 | `상차 코덱트 후진입차 경기 여주시 ... 지금 상차방법` |
| hover/focus | 특정 field 상단에 임시 라벨 표시. 주소 trigger는 `변경` affordance 가능 | `주소`, `상세주소`, `담당자`, `연락처` |
| 라벨 보기 ON | 전체 2행 적용은 보류 후보. row 높이가 크게 늘어날 수 있음 | 우선 일부 field만 적용 검토 |
| 수정 중 | 상세주소/담당자/연락처 inline input. 일시/방법은 menu/select | 기존 선택 흐름 유지 |
| dialog | 지명/주소 변경은 주소 검색 dialog | `상차지 변경`, `하차지 변경` |

운송 구간의 권장 판단:

| 항목 | 판단 |
| --- | --- |
| 지명/주소/상세주소 | compact 유지, hover/focus 라벨 우선 |
| 담당자/연락처 | hover/focus 라벨 적용 |
| 일시/방법 | hover/focus 라벨 적용. 선택 가능 affordance 유지 |
| 2행 라벨 ON | 전체 적용보다 부분 적용 또는 추후 검토 |

### 3. 화물 운송정보

| 상태 | 디자인 규칙 | 표시 예 |
| --- | --- | --- |
| 입력 전 | `운송+품목`, `금액` 각각 별도 row. placeholder는 짧게 | `운송+품목 톤수/차종/품목 입력 대기` |
| 적용 후 | 운송 row와 금액 row의 필드 위치 고정 | 톤수, 차종, 대수, 실중량, 품목 / 결제방법, 청구비용, 운송비용 |
| hover/focus | field 상단 임시 라벨 + 수정 가능 highlight | 톤수, 실중량, 품목, 청구비용 |
| 라벨 보기 ON | 1행 라벨, 2행 데이터 적용 우선순위 높음 | 금액 오류 방지에 유리 |
| 수정 중 | 톤수/차종 select, 대수/실중량 input, 품목 input, 금액 input/select | field 위치 유지 |
| dialog | 최초 입력 또는 전체 변경은 운송+품목 dialog, 금액 dialog | 기존 dialog 유지 |

화물 운송정보 field 기준:

| 필드 | 입력 전 | 적용 후 | hover/focus | 라벨 보기 ON |
| --- | --- | --- | --- | --- |
| 톤수 | dialog에서 선택 | 값 표시 | 임시 라벨 + select affordance | 2행 |
| 차종 | dialog에서 선택 | 값 표시 | 임시 라벨 + select affordance | 2행 |
| 대수 | dialog에서 입력 | 값 표시 | 임시 라벨 + input affordance | 2행 |
| 실중량 | 톤수 기준 자동 | 값 + 110% hint | 임시 라벨 + input affordance | 2행 |
| 품목 | dialog에서 입력 | 값 표시 | 임시 라벨 + input affordance | 2행 |
| 결제방법 | dialog에서 선택 | 값 표시 | 임시 라벨 + select affordance | 2행 |
| 청구비용 | dialog에서 입력 | 값 표시 | 임시 라벨 + input affordance | 2행 |
| 운송비용 | dialog에서 입력 | 값 표시 | 임시 라벨 + input affordance | 2행 |
| 수수료 | 조건부 입력 | 미표시/값 표시 | 임시 라벨 + input affordance | 2행 |
| 수익/차주운임 | 자동 계산 | readonly | hover label만 | 2행 |

### 4. 화물정보 요약

| 상태 | 디자인 규칙 | 표시 예 |
| --- | --- | --- |
| 입력 전 | 화물 운송정보 입력 전이면 placeholder | `화물 운송정보 입력 후 요약 생성` |
| 적용 후 | `요약` kind + 본문. 세부 라벨 생략 | 긴 문장 ellipsis |
| hover/focus | `수정` 버튼 노출. 임시 라벨은 생략 가능 | 현재 적용 방식 유지 |
| 라벨 보기 ON | 기본적으로 변화 없음. 요약은 단일 본문이므로 2행 라벨 효과 낮음 | 적용 제외 후보 |
| 수정 중 | 같은 위치에서 input 전환 | 본문 전체 편집 |
| dialog | 없음 | 해당 없음 |

요약 섹션 판단:

| 항목 | 판단 |
| --- | --- |
| 라벨 보기 ON | 적용 제외 또는 변화 없음 |
| hover/focus | 수정 버튼 노출 유지 |
| 임시 라벨 | 기본 생략 |
| stale 상태 | 필요 시 `재검토` chip 별도 추가 가능 |

### 5. 차주 정보

| 상태 | 디자인 규칙 | 표시 예 |
| --- | --- | --- |
| 입력 전 | `화물맨 연동` primary, 짧은 placeholder, `차주/차량 입력` secondary | `차주 화물맨 연동 화물맨 연동 또는 차주 입력 차주/차량 입력` |
| 외부 연동 중 | `화물맨 화물 연동중`, `연동 취소`, `차주/차량 입력` | status row 유지 |
| 외부 배차 완료 | `화물맨 화물 배차완료`, `연동 취소`, `화물맨 차주 적용` | primary action 변경 |
| 적용 후 | 차주명, 차량번호, 연락처, 톤수, 차종, 출처, 변경, 연동취소 | 출처 `화물맨` 유지 |
| hover/focus | field 상단 임시 라벨. 연락처/톤수/차종은 수정 affordance | row height 고정 |
| 라벨 보기 ON | 1행 라벨, 2행 데이터 | 출처까지 같은 레이아웃 |
| dialog | 차주/차량 입력, 화물맨 차주 적용 모두 통합 조회 dialog 사용 | 기존 dialog 유지 |

차주 정보 field 기준:

| 필드 | 입력 전 | 적용 후 | hover/focus | 라벨 보기 ON |
| --- | --- | --- | --- | --- |
| 차주명 | 없음 | 값 표시 | 임시 라벨 | 2행 |
| 차량번호 | 없음 | 값 표시 | 임시 라벨 | 2행 |
| 연락처 | 없음 | 값 표시 | 임시 라벨 + input affordance | 2행 |
| 톤수 | 없음 | 값 표시 | 임시 라벨 + select affordance | 2행 |
| 차종 | 없음 | 값 표시 | 임시 라벨 + select affordance | 2행 |
| 출처 | 없음 | 화물맨/내부 DB | 임시 라벨 | 2행 |

## 버튼 상태 매트릭스

| 버튼 유형 | 입력 전 | 적용 후 | hover/focus | 비고 |
| --- | --- | --- | --- | --- |
| primary input | 항상 표시 | 필요 시 변경 버튼으로 대체 | accent 유지 + focus outline | 운송+품목 입력, 금액 조건 선택 |
| secondary input | primary 옆 또는 row 끝 | 변경 action으로 사용 가능 | bordered hover | 차주/차량 입력 |
| change | 없음 또는 비활성 | row 끝 항상 표시 | note background | 화주/담당자 변경, 상하차지 변경 |
| external link | 차주 입력 전 primary | 연동 상태에 따라 취소/적용으로 전환 | accent 유지 | 화물맨 연동 |
| danger | 없음 | 연동 중/적용 후 조건부 표시 | danger 유지 | 연동 취소 |
| inline edit | 기본 숨김 | hover/focus 때 노출 | 작은 badge | 요약 수정, field 수정 |

## 구분선과 박스 상태 매트릭스

| 위치 | 입력 전 | 적용 후 | hover/focus | 라벨 보기 ON |
| --- | --- | --- | --- | --- |
| section 외곽 | solid 유지 | solid 유지 | 변경 없음 | 변경 없음 |
| 내부 row 사이 | dashed divider | dashed divider | hover row만 subtle highlight | row height 증가 시 divider 유지 |
| field 수정 가능 영역 | dotted underline 가능 | dotted underline 가능 | note background + outline | label/value 2행 안에서 유지 |
| card 외곽 | 제거 또는 transparent | 제거 또는 transparent | 변경 없음 | 변경 없음 |
| dialog | solid modal surface | solid modal surface | focus outline | 변경 없음 |

## 라벨 보기 ON 적용 우선순위

| 우선순위 | 섹션 | 적용 방식 | 이유 |
| --- | --- | --- | --- |
| 1 | 화주 정보 | 전체 field 2행 | 라벨/데이터 정렬 효과가 큼 |
| 2 | 화물 운송정보 | 운송 row, 금액 row 2행 | 금액/중량/차량 조건 오해 방지 |
| 3 | 차주 정보 | 전체 field 2행 | 차량번호/연락처/톤수/출처 구분 필요 |
| 4 | 운송 구간 | 부분 적용 또는 보류 | row가 길어 height 증가 영향 큼 |
| 5 | 화물정보 요약 | 적용 제외 후보 | 단일 본문이라 효과 낮음 |

## 구현 시 검증 케이스

| 케이스 | 확인 항목 |
| --- | --- |
| 라벨 보기 OFF 기본 화면 | 기존 compact 밀도가 유지되는지 |
| 라벨 보기 ON 화면 | 라벨과 데이터가 같은 컬럼에 정렬되는지 |
| OFF + hover | 해당 field 상단에 임시 라벨이 뜨는지 |
| OFF + keyboard focus | 마우스 없이도 임시 라벨이 뜨는지 |
| hover/focus 반복 | row height가 흔들리지 않는지 |
| 입력 전 row | 2행 라벨 모드가 억지 적용되지 않는지 |
| 적용 후 row | field 위치가 상태 전환 후에도 유지되는지 |
| 화물맨 상태 전환 | idle/linking/dispatched/applied 상태에서 버튼 위치가 안정적인지 |
| 금액 조건 전환 | 인수증/선착불 전환 시 field 위치가 유지되는지 |
