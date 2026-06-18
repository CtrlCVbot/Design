# 운송구간 섹션 기획 패키지

## 목적

이 패키지는 화물 오더 접수/수정 화면 중 `운송구간` 섹션만 독립적으로 정리한 기획 산출물입니다.

전체 화면의 기존 골격은 유지하되, 운송구간 안에서는 상차지와 하차지를 좌우 2열이 아니라 세로 2행으로 요약합니다. 데이터가 있을 때는 명세서처럼 컴팩트하게 보여주고, 데이터가 없을 때는 주소 입력 전 상태를 명확히 보여주는 것이 목표입니다.

## 기준 파일

| 기준 파일 | 역할 |
| --- | --- |
| `Cargo Order Wireframe B Original Tone.html` | 최종 시각 톤, B안 구조, 현재 운송구간 입력값 기준 |
| `Cargo Order Wireframe.html` | 최초 와이어프레임의 운송구간/상하차 조건 필드 근거 |
| `specs/04 Wireframe Spec Form.html` | 값이 없을 때의 명세서형 빈 상태와 출력 양식 근거 |

## 산출물

| 파일 | 내용 |
| --- | --- |
| `01-prd-transport-route.md` | 운송구간 섹션 PRD |
| `02-wireframe-transport-route.md` | 데이터 있음, 빈 상태, 펼침 상태 와이어프레임 |
| `03-user-flow-transport-route.md` | 주소 미입력부터 요약 생성, 펼침, 수정 진입까지의 흐름 |
| `04-field-state-mapping.md` | 필드별 표시 조건과 상태별 UI 매핑 |
| `05-source-mapping.md` | 세 기준 HTML에서 가져온 구조/상태/톤 매핑 |
| `06-source-comparison-review.md` | 기존 전체 와이어프레임 2종과 신규 variants 비교 리뷰 |
| `07-cleanup-candidates.md` | 삭제 후보 파일과 보류 사유 목록. 실제 삭제는 하지 않음 |
| `08-closeout-transport-route.md` | 운송구간 1차 기준 고정, 검증 상태, 다음 섹션 인계 문서 |
| `09-additional-wireframe-plan-transport-route.md` | 화주 정보 closeout 수준을 기준으로 추가 필요한 운송구간 상태 화면 계획 |
| `10-transport-route-quality-gap-review.md` | 운송구간과 화주 정보의 완성도 차이, 추가 보강 리스크 리뷰 |
| `11-address-apply-layout-package-overview.md` | 주소 검색/적용 레이아웃 하위 패키지 개요, 1열 단일 행, 통합 검색 기준 |
| `address-apply-layouts/` | `transport-route-address-apply-layouts.html` 전용 하위 문서 패키지 |
| `transport-route-section-variants.html` | 데이터 있음 상태의 A/B/C/D 표시 방식 비교 HTML |
| `transport-route-d-workflow.html` | D안의 닫힘, 열림, 주소 입력, 계산 완료 흐름을 확인하는 워크플로우 HTML |
| `transport-route-address-apply-layouts.html` | 기존 D workflow를 수정하지 않고 주소 검색/적용, 1열 단일 행, 화주 주소록+Kakao 통합 검색을 확인하는 추가 HTML |
| `results/wireframe/order-register-new2.0/Cargo Order Wireframe B Original Tone.html` | D안 `compact-hybrid`가 1차 반영된 전체 B 원본 톤 HTML |
| `self-review.md` | 자체 리뷰와 남은 결정사항 |

## 핵심 결정

| 결정 | 내용 |
| --- | --- |
| 1차 기준안 | D `compact-hybrid`를 운송구간 1차 기준안으로 정리 |
| 배치 | 상차지와 하차지는 세로 2행으로 배치 |
| B 통합본 배치 | `Cargo Order Wireframe B Original Tone.html`에서는 `2. 운송 구간`을 좌우 2컬럼 전체 폭으로 확장 |
| 기본 상태 | 데이터가 있으면 입력 폼이 아니라 D안의 컴팩트 명세 카드로 표시 |
| 주소 표시 | 기본 화면에서는 상세주소를 숨기고 행정주소만 표시 |
| 펼침 정보 | 상세주소, 담당자, 연락처, 특이사항 요약을 펼침 영역에 표시 |
| 빈 상태 | 주소 미적용 상태는 `04 Wireframe Spec Form.html`의 빈칸/폼시트 감각을 사용 |
| 배차/상하차 조건 병합 | 기존 5번 `배차 유형`, 6번 `상차 조건`, 7번 `하차 조건`은 독립 섹션에서 제거하고 운송구간 내부로 병합 |
| 배차 유형 | `독차/혼적`은 대표 선택으로, `긴급/왕복/예약`은 멀티옵션으로, `경유`는 경유 수 조건으로 상하차지 전체 보조 칩에 반영 |
| 톤 | `Cargo Order Wireframe B Original Tone.html`의 종이 배경, 손글씨 폰트, 검은 선 스타일 유지 |

## 데이터 있음 상태 표시안

| 안 | 표시 모드 | 설명 | 권장도 |
| --- | --- | --- | --- |
| A | `sheet-row` | `Wireframe Spec Form.html`처럼 상차/하차를 표의 한 행으로 표시 | 비교 근거 |
| B | `sheet-card` | 카드처럼 구분하되 내부는 지명, 주소, 일시/방법이 한 행으로 흐름 | 비교 근거 |
| C | `stacked-card` | 지명, 주소, 일시/방법을 세로로 쌓는 설명형 카드 | 비교안 |
| D | `compact-hybrid` | B안의 명세 구조와 C안의 가벼운 카드 감각을 병합. 기본 화면은 라벨을 숨기고 값 중심으로 표시 | 1차 기준안 |

기존 단독 `transport-route-section.html`은 삭제했습니다. A/B/C/D 비교는 `transport-route-section-variants.html`에서, D안의 닫힘/열림/전체 흐름은 `transport-route-d-workflow.html`에서 확인합니다.

## 사용 방법

1. `01-prd-transport-route.md`에서 요구사항을 확인합니다.
2. `02-wireframe-transport-route.md`에서 상태별 화면 구성을 확인합니다.
3. `06-source-comparison-review.md`에서 기존 전체 화면과의 차이를 확인합니다.
4. `transport-route-section-variants.html`을 브라우저에서 열어 A/B/C/D 비교 구성을 확인합니다.
5. `transport-route-d-workflow.html`을 브라우저에서 열어 D안의 닫힘/열림/워크플로우 구성을 확인합니다.
6. 전체 `Cargo Order Wireframe B Original Tone.html`에서 D안이 B 원본 톤으로 통합된 상태를 확인합니다.
7. `09-additional-wireframe-plan-transport-route.md`에서 주소 입력 전, 부분 입력, 주소 검색/적용, 상세 inline edit 추가 계획을 확인합니다.
8. `10-transport-route-quality-gap-review.md`에서 화주 정보 closeout 수준 대비 운송구간 보강 gap을 확인합니다.
9. `transport-route-address-apply-layouts.html`에서 B안 운송구간 1열 단일 행과 주소 검색/적용 다이얼로그를 확인합니다.
10. `address-apply-layouts/README.md`에서 주소 검색/적용 HTML의 전용 문서 패키지를 확인합니다.

## 다음 결정 필요

| 항목 | 선택지 | 기본 제안 |
| --- | --- | --- |
| 펼침 트리거 | 행별 펼침 / 섹션 전체 펼침 | 행별 펼침 |
| 특이사항 배지 | `특이사항 2` / `주의 2` / 아이콘+숫자 | `특이사항 2` |
| 거리/기준 금액 노출 | 운송구간 안에 포함 / 상단 subbar 유지 / 운송구간 하단 보조 메타 | 상단 subbar 또는 얇은 보조 메타 유지, 단 `톤수·차종 선택 후 계산` 상태 선표시 |
| 최종 표시안 | D 컴팩트 명세 카드형 유지 / A 명세표형으로 되돌림 / B 카드형으로 완화 | 1차 기준은 D안. 전체 B 원본 톤 HTML에 1차 통합 완료, 운영자가 실제 밀도를 확인한 뒤 최종 확정 |
| 배차 유형 위치 | 별도 5번 섹션 유지 / 운송구간 전체 보조 칩으로 이동 / 둘 다 표시 | B 통합본은 운송구간 내부 병합으로 적용 완료. 대표 기본값은 `독차`, `긴급/왕복/예약`은 모두 미선택 가능 |
| 주소 검색/적용 | inline edit / 주소 검색 다이얼로그 / 별도 주소 선택 화면 | 지명과 행정주소는 주소 검색/적용 다이얼로그, 상세주소와 담당자는 1열 단일 행에서 확인. 다이얼로그는 화주 주소록과 Kakao 결과를 함께 표시 |
| 빈 상태 CTA | 섹션 전체 CTA / 상차·하차 개별 CTA / 기존 폼시트 | 화주 정보와 같은 흡수형 전환을 쓰되 상차·하차 개별 CTA로 분리 |
| 계산 메타 상태 | 단일 문구 / 상태별 chip / 상세 tooltip | 주소, 톤수, 차종 의존성에 따라 대기/경고/확정 chip으로 구분 |

## B 통합본 변경 이력

| 날짜 | 변경 | 영향 |
| --- | --- | --- |
| 2026-05-07 | 운송구간 full-width 확장 | 좌측 컬럼에 갇혀 있던 운송구간을 좌우 2컬럼 전체 폭으로 확장. 현재 B 통합본에서는 `2. 운송 구간`으로 배치 |
| 2026-05-07 | 5~7번 섹션 병합 | `배차 유형`, `상차 조건`, `하차 조건`을 독립 섹션에서 제거하고 운송구간 요약/펼침/보조 메타로 이동 |
| 2026-05-07 | 1차 마무리 | `08-closeout-transport-route.md`에 기준 상태와 다음 섹션 인계 조건 고정 |
| 2026-06-02 | 추가 보강 계획 | 화주 정보 closeout과 HTML interaction을 기준으로 운송구간 추가 상태 화면 계획과 gap review 작성 |
| 2026-06-02 | 주소 검색/적용 분리 | 기존 D workflow 원본은 유지하고 `transport-route-address-apply-layouts.html` 추가 |
| 2026-06-02 | 주소 검색/적용 패키지화 | `address-apply-layouts` 하위 문서 패키지로 README, PRD, Wireframe, Closeout, self-review 정리 |

## 삭제 후보

삭제 후보는 [07-cleanup-candidates.md](</C:/Work/Dev/Design/.plans/wireframes/cargo-order-admin-20260430/sections/transport-route/07-cleanup-candidates.md>)에만 정리합니다. 이번 단계에서는 추가 파일 삭제를 진행하지 않습니다.
## 2026-06-08 Clean 반영 고정 규칙

| 항목 | 기준 |
| --- | --- |
| 입력전 상태 | 상차/하차 각각 `kind + 주소와 조건 placeholder + 입력 버튼` 구조로 시작한다. |
| 적용 후 상태 | 상차지명, 주소, 상세주소, 담당자, 연락처, 일시, 방법을 한 행에 유지하고 불필요한 말줄임을 쓰지 않는다. |
| 수정 | 상세주소, 담당자, 연락처는 화주 섹션과 같은 hover/focus inline edit 패턴을 사용한다. |
| 일시/방법 | 일시는 quick option과 지정 일시 dialog, 방법은 선택 없음/지게차/호이스트/수해줌/수작업/크레인을 유지한다. |
| B 통합안 | 기존 full-width 운송구간 구조를 유지하되 Clean의 입력전 placeholder와 no-ellipsis 규칙을 반영한다. |
