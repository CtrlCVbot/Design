# B Integration Guide - 화물정보 요약

## 1. 통합 원칙

| 원칙 | 내용 |
| --- | --- |
| row 구조 통일 | 운송구간 `route-line-row`, 화주 정보 `shipper-row`와 같은 compact row 감각 유지 |
| 범위 축소 | 화물정보 요약 외 항목은 B 통합본 4번 섹션에서 제거 |
| 스타일 재사용 | `kind`, `cell`, `cell-label`, `cell-value`, `row-action` 계열 톤 사용 |
| 수정 위치 유지 | 수정 시 같은 row, 같은 값 위치에서 input 전환 |

## 2. HTML 기준

```html
<section class="section-block summary-section" aria-labelledby="summary-title">
  <div class="section-title" id="summary-title">
    <span class="num">4</span>화물정보 요약
  </div>
  <div class="section-note">화물 운송정보에서 생성되는 요약 row</div>
  <div class="summary-panel">
    <div class="summary-card">
      <div class="summary-row">
        <span class="kind">요약</span>
        <div class="cell">
          <div class="cell-label">화물정보 요약</div>
          <div class="cell-value">...</div>
        </div>
        <button class="row-action" type="button">수정</button>
      </div>
    </div>
  </div>
</section>
```

## 3. 이벤트 기준

| 이벤트 | selector | 처리 |
| --- | --- | --- |
| 상태 보기 | `[data-mode]` | 값 있음, 값 없음, 수정 중 비교 |
| 수정 | `[data-summary-edit]` | 같은 위치 input 전환 |
| 저장 | `[data-summary-edit]` | input 값을 row 값으로 반영 |

## 4. 데이터 연결 기준

| 구분 | 기준 |
| --- | --- |
| 원본 섹션 | `3. 화물 운송정보` |
| 원본 필드 | `품목`, `실중량`, `톤수`, `차종`, `대수` |
| 보조 섹션 | `2. 운송 구간` |
| 보조 필드 | 상하차 일시, 상하차 방법 |
| 제외 필드 | 금액 조건 전체 |
| 상태 | `auto`, `overridden`, `stale`, `empty` |
| 상세 문서 | `06-cargo-transport-summary-data-contract.md` |

## 5. 스타일 기준

| 항목 | 값 |
| --- | --- |
| row grid | `48px minmax(0, 1fr) 72px` |
| row gap | `7px` |
| row padding | `5px 8px` |
| card border | `1.25px solid var(--line)` |
| value font | `Caveat`, `Gaegu`, cursive |
| action height | `27px` |

## 6. B 통합 체크리스트

| 체크 | 기준 |
| --- | --- |
| 섹션명 | `4. 화물정보 요약` |
| 남길 항목 | 화물정보 요약 row |
| 삭제할 항목 | 중량, 계산 기준, 이하 여부, 안내문, 증빙 옵션 |
| 원본 연결 | `3. 화물 운송정보`의 핵심 필드를 요약 source로 사용 |
| override | 사용자가 수정한 요약은 원본 필드와 분리 |
| hover/focus | 운송구간/화주 정보와 동일한 dashed focus |
| overflow | 긴 문장은 말줄임 처리 |
