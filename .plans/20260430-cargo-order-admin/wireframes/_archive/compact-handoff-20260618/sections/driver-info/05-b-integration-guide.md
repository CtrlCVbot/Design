# B Integration Guide - 차주 정보

## 1. 통합 원칙

| 원칙 | 내용 |
| --- | --- |
| Phase 비교 노출 | B 통합본의 `5. 차주 정보` 안에서 Phase 1과 Phase 2를 탭으로 비교 |
| 실제 컴포넌트 사용 | 설명 카드가 아니라 실제 row, dialog, 버튼, 상태 전환 컴포넌트로 구성 |
| Phase 1 기준 | `driver-info-section-wireframe.html`의 내부 DB 차주/차량 조회, 차주 등록, inline edit 패턴 유지 |
| Phase 2 기준 | `driver-info-hwamulman-phase2-wireframe.html`의 `차주 정보 실제 배치 컴포넌트` 흐름 반영 |
| 다이얼로그 기준 | 최신 참조 다이얼로그의 status strip, 검색/필터, 결과 그룹, 우측 가이드/미리보기/등록 전환 구조 반영 |
| 디자인 톤 유지 | B Original Tone의 sheet, compact row, 손글씨형 값, dashed hover/focus 톤 유지 |
| 수정 범위 제한 | 차주 연락처는 input, 톤수와 차종은 select로만 현재 오더 기준 변경 |
| 정보 분리 | 차주 정보의 톤수/차종은 차량 스펙, 화물 운송정보의 톤수/차종은 운송 요구 조건으로 유지 |

## 2. B 통합 HTML 기준

```html
<section class="section" aria-labelledby="section-driver" data-b-driver-section>
  <div class="section-head">
    <div class="section-title" id="section-driver"><span class="num">5</span>차주 정보</div>
    <div class="section-note">Phase 1 내부 DB 배차와 Phase 2 화물맨 연동 배차 비교</div>
  </div>
  <div class="section-body">
    <div class="b-driver-phase-tabs" role="tablist">
      <button data-b-driver-tab="phase1">Phase 1 내부 DB</button>
      <button data-b-driver-tab="phase2">Phase 2 화물맨</button>
    </div>

    <div data-b-driver-panel="phase1">
      <!-- 내부 DB 차주/차량 조회 실제 row -->
    </div>

    <div data-b-driver-panel="phase2">
      <!-- 화물맨 연동 포함 실제 배치 row -->
    </div>
  </div>
</section>
```

## 3. 이벤트 기준

| 이벤트 | selector | 처리 |
| --- | --- | --- |
| Phase 탭 전환 | `[data-b-driver-tab]` | Phase 1/Phase 2 panel 표시 전환 |
| Phase 1 변경 | `[data-b-driver-open="phase1"]` | 흡수 애니메이션 후 차주/차량 통합 조회 dialog open |
| Phase 2 차주 입력 | `[data-b-driver-open="phase2"]` | 기존 내부 DB 차주 조회 dialog open |
| 화물맨 연동 | `[data-b-driver-hm-link]` | 확인 dialog 후 `화물맨 화물 연동중` 상태 전환 |
| 배차완료 수신 | `[data-b-driver-hm-complete]` | `화물맨 화물 배차완료` 상태 전환 |
| 화물맨 차주 적용 | `[data-b-driver-open-hm]` | 화물맨 배차 차주 행을 조회 목록 최상단에 고정하고 선택 |
| 연동 취소 | `[data-b-driver-hm-cancel]` | 확인 dialog 후 화물맨 API 취소 요청중 상태 표시 |
| 취소 실패 수신 | `[data-b-driver-hm-cancel-fail]` | 실패 알림, row의 `연동 취소` 버튼 유지 |
| 조회 행 선택 | `[data-b-driver-result-row]`, `[data-b-driver-hm-row]` | 선택 표시 + preview 갱신 |
| 조회 실행 | `[data-b-driver-search-run]` | 검색어 기준 내부 DB 결과 필터링 |
| 검색 초기화 | `[data-b-driver-search-reset]` | 검색어/선택 상태 초기화 |
| 다이얼로그 모드 | `[data-b-driver-dialog-mode]` | 내부 DB 조회는 보기 편의용으로 기존 리스트를 즉시 펼치고, 화물맨 배차 결과는 배차 차주 우선 표시로 전환 |
| 검색 전 안내 | `[data-b-driver-presearch]` | 결과 리스트 대신 조회 안내와 중앙 `차주 등록` CTA 표시 |
| 검색 후 등록 CTA | `[data-b-driver-floating-register]` | 결과 리스트 우측 상단에 플로팅 `차주 등록` CTA 표시 |
| 차주 등록 열기 | `[data-b-driver-register-open]` | 선택 미리보기 숨김 + 등록 섹션 동적 생성 |
| 차주 등록 취소 | `[data-b-driver-register-cancel]` | 등록 섹션 제거 + 기본 가이드 복귀 |
| 차주 등록 저장 | `[data-b-driver-register-save]` | 신규 행 추가 + 등록 섹션 제거 + 신규 행 자동 선택/미리보기 |
| 적용 | `[data-b-driver-apply]` | 현재 Phase row 값 갱신 |
| inline edit | `[data-b-driver-inline]` | 연락처 input, 톤수/차종 select 전환/저장 |

## 4. Phase별 상태 기준

| Phase | 상태 | row 표시 |
| --- | --- | --- |
| Phase 1 | 적용됨 | 차주명, 차량번호, 차주 연락처, 톤수, 차종, 출처, `차주/차량 변경` |
| Phase 1 | 조회/등록 | 통합 조회 dialog에서 내부 DB 선택 또는 `차주 등록` 후 적용 |
| Phase 2 | 입력 전 | `차주 [화물맨 연동] ... [차주/차량 입력]` |
| Phase 2 | 연동중 | `화물맨 화물 연동중`, `연동 취소`, `차주/차량 입력` |
| Phase 2 | 배차완료 | `화물맨 화물 배차완료`, `연동 취소`, `화물맨 차주 적용` |
| Phase 2 | 화물맨 적용 | 기존 row 레이아웃에 `출처 / 화물맨` 표시 |
| Phase 2 | 내부 DB 대체 적용 | 기존 row 레이아웃에 `출처 / 내부 DB` 표시, 우측 `연동 취소` 유지 |
| Phase 2 | 취소 실패 | 실패 알림 후 `연동 취소` 버튼 유지로 재시도 가능 |

## 5. 스타일 기준

| 항목 | 값 |
| --- | --- |
| 네임스페이스 | `b-driver-*` |
| row grid | 적용 row `48px + 6개 필드 + action`, linked cancel 시 action 2개 |
| row height | `32px` 기준 |
| action height | `24px` |
| value font | `var(--pen)` |
| dialog | B의 lookup dialog 톤과 동일한 fixed backdrop, compact list, preview/register aside |
| dialog result grid | `선택 / 차주명 / 차량번호 / 연락처 / 톤수 / 차종 / 최근 운행 또는 상태` |
| dialog side panel | 기본 가이드, 선택 미리보기, 차주 등록 폼을 같은 우측 영역에서 전환 |
| register layout | 차주 등록 폼도 선택 미리보기와 동일한 title + field list 구조 사용 |
| register panel | `차주 등록` 버튼 클릭 시에만 DOM 생성, 행 선택/취소/저장 시 제거 |
| register CTA | 검색 전에는 결과 리스트 대신 CTA 표시, 검색 후에는 결과 리스트 구석 플로팅 CTA 표시 |
| dialog clarity | 패널 `transform` 제거, 정수 `left/top`, 고정 컬럼 폭, 정수 `line-height`/행 패딩 적용 |

## 5-1. 차주 등록 CTA 표시 기준

| 상태 | 결과 영역 | 차주 등록 CTA | 이유 |
| --- | --- | --- | --- |
| 검색 전 | 결과 리스트 숨김, 검색 전 안내 표시 | 안내 영역 중앙에 primary CTA | 조회 전에는 리스트를 보여주지 않아 화면 목적이 명확함 |
| 내부 DB 조회 보기용 | 결과 리스트 즉시 표시 | 리스트 우측 상단 플로팅 CTA | 와이어프레임 검토 편의를 위한 상태이며 실제 구현 흐름은 검색 후 조회 기준 |
| 검색 결과 있음 | 결과 리스트 표시 | 리스트 우측 상단 플로팅 CTA | 결과를 보면서도 신규 등록으로 빠질 수 있음 |
| 검색 결과 없음 | 결과 리스트 숨김, 결과 없음 안내 표시 | 안내 영역 중앙에 primary CTA | 없는 차주를 바로 등록하는 흐름이 자연스러움 |
| 등록 폼 열림 | 기존 결과 상태 유지 | 플로팅 CTA 숨김 | 같은 등록 액션이 중복 노출되지 않게 함 |

## 6. 통합 체크리스트

| 체크 | 기준 |
| --- | --- |
| 디자인 | B Original Tone과 화주 정보 row/dialog 톤 유지 |
| Phase 비교 | B 통합본에서 Phase 1/Phase 2 탭으로 비교 가능 |
| Phase 1 | 내부 DB 조회, 차주 등록, 연락처/톤수/차종 수정 가능 |
| Phase 2 | 화물맨 연동, 배차완료 수신, 화물맨 차주 적용 가능 |
| Dialog UX/UI | 조회 전 안내, 조회 버튼, 검색 초기화, 필터 배지, 선택 마커, 화물맨 상단 고정 그룹, 우측 가이드/미리보기/등록 전환, 하단 리스트 선명도 보정 |
| 등록/미리보기 배타성 | 차주 등록 섹션과 선택 미리보기는 동시에 생성/노출하지 않음 |
| 예외 흐름 | 내부 DB 대체 배차 후 `연동 취소` 유지 |
| 취소 흐름 | 확인 dialog, API 취소 요청중, 취소 실패 재시도 표시 |
| 검증 | B 통합본에서 탭, dialog, 주요 상태 버튼 수동 확인 |
