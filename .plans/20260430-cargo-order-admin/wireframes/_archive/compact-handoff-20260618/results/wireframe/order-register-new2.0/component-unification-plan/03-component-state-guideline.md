# Component State Guideline

## 공통 컴포넌트 구조

권장 기본 구조는 다음과 같습니다.

```text
section
  section-body
    component-panel
      component-row
        kind chip
        field group
        action group
```

| 구성요소 | 역할 | 규칙 |
| --- | --- | --- |
| section | 업무 영역 구분 | 바깥 박스 유지 |
| component-panel | row 묶음 | 별도 테두리는 최소화 |
| component-row | 실제 데이터 단위 | row 사이 dashed divider 사용 가능 |
| kind chip | row 종류 표시 | 화주, 상차, 하차, 운송+품목, 금액, 요약, 차주 |
| field group | 값 표시 | 기본은 compact, 라벨 보기 ON 또는 hover/focus 시 field label 표시 |
| action group | 입력/변경/연동 버튼 | row 끝 또는 주요 위치에 고정 |

## 상태 정의

| 상태 | 의미 | UI 표현 |
| --- | --- | --- |
| 입력 전 | 필수 데이터가 아직 적용되지 않음 | kind + 짧은 placeholder + 입력/연동 버튼 |
| 조회/선택 중 | 다이얼로그에서 후보를 고르는 중 | dialog + selected row + preview |
| 적용 완료 | 현재 row에 데이터가 반영됨 | 안정된 row, 값 우선 표시 |
| 수정 중 | 같은 위치에서 값을 수정 중 | 해당 field만 input/select로 전환 |
| 외부 연동 중 | 화물맨 등 외부 API 작업 중 | status text + 취소 action |
| 외부 배차 완료 | 외부에서 결과가 들어옴 | `배차완료` status + 적용 action |
| 오류/취소 실패 | 외부 API 실패 또는 검증 실패 | danger soft 상태 + 재시도/취소 action |
| stale | 관련 값 변경으로 요약 재검토 필요 | subtle warning chip 또는 title |

## 라벨 보기 규칙

### 기본 방향

`Option D+` 기준으로 라벨은 세 가지 상태를 가집니다.

| 상태 | 라벨 표현 |
| --- | --- |
| 라벨 보기 OFF | 기본은 데이터만 표시 |
| 라벨 보기 OFF + hover/focus | 해당 field 상단에 임시 라벨 표시 |
| 라벨 보기 ON | row가 2행 구조로 전환. 1행 라벨, 2행 데이터 |

라벨 위치는 항상 field 상단으로 통일합니다. 왼쪽으로 라벨이 튀어나오는 방식은 row 정렬을 깨뜨릴 수 있으므로 사용하지 않습니다.

### 2행 라벨 모드

```text
화주   화주 업체명      사업자 번호      담당자명      담당자 연락처
       로지스팩토리     123-45-67890     김민수        010-1234-5678
```

| 항목 | 규칙 |
| --- | --- |
| 1행 | field label |
| 2행 | field value |
| kind chip | 기존 위치 유지 |
| action button | row 끝 위치 유지 |
| row height | ON 상태에서는 높이 증가 허용 |
| 컬럼 폭 | OFF와 ON에서 같은 grid track 사용 |

### hover/focus 임시 라벨

```text
      화주 업체명
화주  로지스팩토리  123-45-67890  김민수
```

| 항목 | 규칙 |
| --- | --- |
| 표시 조건 | hover, keyboard focus, touch focus |
| 위치 | 해당 field 상단 |
| layout | row 높이 변화 없음 |
| 시각 톤 | 작고 연한 label, 도움말이 아닌 field name처럼 표시 |
| 겹침 방지 | value를 가리지 않도록 field 내부 top padding 또는 overlay 위치 확보 |

## 필드별 라벨 우선순위

### 라벨을 표시하는 값

| 값 유형 | 예시 | 이유 |
| --- | --- | --- |
| 신원 정보 | 화주 업체명, 사업자 번호, 담당자명 | 값의 의미가 유사해 혼동 가능 |
| 연락처 | 담당자 연락처, 차주 연락처 | 전화번호만으로 맥락 파악 어려움 |
| 금액 | 청구비용, 운송비용, 수수료, 수익 | 정산 오류 방지를 위해 명시 필요 |
| 차량 정보 | 차량번호, 톤수, 차종, 출처 | 차주 정보 row에서 비교 필요 |

### compact mode에서 라벨을 생략할 수 있는 값

| 값 유형 | 예시 | 조건 |
| --- | --- | --- |
| 위치 row의 핵심 값 | 지명, 주소, 상세주소 | 상차/하차 kind와 컬럼 순서가 고정된 경우 |
| 빠른 조건 값 | 지금, 당일, 상차방법, 하차방법 | 버튼/선택 affordance가 있는 경우 |
| 요약 본문 | 화물정보 요약 문장 | kind가 `요약`이고 단일 본문일 때 |

### compact mode에서 라벨 생략 시 보완 규칙

| 보완 | 규칙 |
| --- | --- |
| ARIA label | 실제 구현에서는 label 의미를 접근성 속성으로 유지 |
| 컬럼 순서 | 문서와 구현에서 순서 고정 |
| hover/focus | 해당 field 상단에 임시 라벨 표시 |

## 버튼 규칙

| 버튼 역할 | 예시 | 노출 위치 | 시각 규칙 |
| --- | --- | --- | --- |
| primary input | 운송+품목 입력, 금액 조건 선택 | 입력 전 row 우측 | accent soft |
| secondary input | 차주/차량 입력 | primary 옆 또는 row 우측 | white background |
| change | 화주/담당자 변경, 상차지 변경 | 적용 완료 row 끝 | compact bordered |
| inline edit | 요약 수정, 연락처 수정 | hover/focus 때만 | 작은 bordered badge |
| external link | 화물맨 연동 | 차주 row 주요 위치 | primary보다 명확한 accent |
| danger | 연동 취소 | 상태 action group | danger soft |

## 입력 전 상태 규칙

| 항목 | 규칙 |
| --- | --- |
| 구조 | `kind + 짧은 placeholder + action` |
| 문구 길이 | 한 줄 안에서 읽히는 구문 사용 |
| 안내문 | 설명형 문장보다 입력 목적 중심 |
| 버튼 | 실제 다음 action만 노출 |
| 애니메이션 | 버튼이 kind 방향으로 흡수되는 motion은 입력 전 row에서만 사용 |
| 라벨 보기 ON | 입력 전 placeholder도 2행 라벨 구조를 억지 적용하지 않음 |

예시 문구:

| 섹션 | 추천 placeholder |
| --- | --- |
| 화물 운송정보 | `톤수/차종/품목 입력 대기` |
| 금액 | `결제방법/운임 입력 대기` |
| 차주 정보 | `화물맨 연동 또는 차주 입력` |

## 적용 완료 상태 규칙

| 항목 | 규칙 |
| --- | --- |
| row 높이 | 입력 전보다 크게 늘리지 않음 |
| 값 위치 | 상태 변경 후에도 필드 위치 유지 |
| 버튼 | 변경 action은 row 끝에 고정 |
| 상태 chip | 정말 필요한 경우만 사용 |
| 설명 문장 | 기본 row에서는 제외 |

## 수정 중 상태 규칙

| 수정 방식 | 대상 | 규칙 |
| --- | --- | --- |
| inline input | 연락처, 이메일, 상세주소, 담당자명, 품목, 요약 | 클릭한 field 안에서 input으로 전환 |
| inline select | 톤수, 차종, 일시 quick option, 상하차방법 | 같은 위치에서 select/menu로 전환 |
| dialog | 화주/담당자, 상하차지, 차주/차량, 금액 조건 | row 전체 변경 또는 외부 조회가 필요한 경우 |

## hover/focus 규칙

| 대상 | hover/focus 표현 |
| --- | --- |
| 일반 field | field 상단에 임시 라벨 표시 |
| inline edit field | 임시 라벨 + note background + dotted underline 또는 outline |
| dialog trigger field | row highlight + `변경` affordance |
| row action button | note border + note background |
| danger button | danger tone 유지, focus outline만 추가 |
| external link button | primary tone 유지, focus outline 추가 |

## 라벨 토글 상태 저장

| 항목 | 규칙 |
| --- | --- |
| 저장 단위 | 사용자별 preference |
| 기본값 | OFF |
| 저장 시점 | 사용자가 토글을 변경하는 즉시 |
| 적용 범위 | 우선 현재 오더 접수/수정 화면 전체 |
| 예외 | 금액/정산 등 오해 위험이 큰 필드는 compact mode에서도 최소 라벨 유지 가능 |

## 구분선 규칙

| 위치 | 규칙 |
| --- | --- |
| section 외곽 | solid border 유지 |
| section 내부 row 사이 | dashed divider 사용 |
| 필드 내부 | dotted underline은 수정 가능 표시로만 사용 |
| card 외곽 | 2중 박스를 만들지 않도록 제거 또는 transparent |
| dialog | 별도 modal surface이므로 solid border 유지 |

## 섹션별 상태 적용

| 섹션 | 입력 전 | 적용 완료 | 수정 중 | dialog |
| --- | --- | --- | --- | --- |
| 화주 정보 | 거의 없음, 기본값 적용 상태 | compact row, 라벨 보기 ON 시 2행 | 연락처/이메일 inline edit | 화주/담당자 통합 조회 |
| 운송 구간 | 주소 미적용 상태 가능 | 상차/하차 compact row, 라벨 모드는 신중 적용 | 상세주소/담당자/연락처 inline edit, 일시/방법 select | 주소 검색 |
| 화물 운송정보 | 운송+품목, 금액 각각 입력 전 row | compact row, 라벨 보기 ON 시 2행 | 일부 field inline edit | 운송+품목 dialog, 금액 dialog |
| 화물정보 요약 | 자동 생성 전 placeholder | 요약 본문, 라벨 모드 적용 낮음 | hover 수정 | 필요 없음 |
| 차주 정보 | 화물맨 연동/차주 입력 시작 | compact row, 라벨 보기 ON 시 2행 | 연락처/톤수/차종 inline edit | 차주/차량 조회, 화물맨 결과 적용 |
## 2026-06-08 확정 규칙

| 항목 | 확정 기준 |
| --- | --- |
| 입력전 placeholder | 모든 입력전 row는 긴 안내문 대신 짧은 설명형 placeholder를 dotted line 위에 표시한다. |
| placeholder 예시 | `화주와 담당자를 선택하세요`, `상차지 주소와 조건을 입력하세요`, `톤수, 차종, 대수, 실중량, 품목을 입력하세요`, `결제방법과 청구/운송 비용을 입력하세요`, `차주를 선택하거나 화물맨에 공유하세요` |
| 라벨 보기 OFF | 기본값은 compact 데이터 표시이며, hover/focus 때만 작은 라벨을 상단에 띄운다. |
| 라벨 보기 ON | 구현 확인용 옵션으로 `라벨 / 데이터` 2행 구조를 제공한다. |
| 적용 후 데이터 | 전체 정보가 적용된 상태에서는 `...` 말줄임을 기본으로 쓰지 않는다. 필요한 경우 줄바꿈으로 전체 값을 보존한다. |
| 차주 정보 | B 통합안에서는 Phase 2 화물맨 연동 버전의 실제 배치 컴포넌트를 기준으로 한다. |
