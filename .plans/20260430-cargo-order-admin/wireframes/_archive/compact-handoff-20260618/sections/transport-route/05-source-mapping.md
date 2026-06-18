# Source Mapping: 운송구간

## 기준 파일별 역할

| 기준 파일 | 반영 역할 |
| --- | --- |
| `Cargo Order Wireframe B Original Tone.html` | 최종 시각 톤, B안 개선 구조, 현재 값이 들어간 운송구간 입력 필드 |
| `Cargo Order Wireframe.html` | 최초 운송구간 입력 필드, 상차/하차 조건의 담당자/연락처/특이사항 구조 |
| `specs/04 Wireframe Spec Form.html` | 빈 상태, 명세서형 행 구조, 출력/폼시트 감각 |

## `Cargo Order Wireframe B Original Tone.html`

| 위치 | 참고 내용 | 반영 |
| --- | --- | --- |
| `section-route` 근처 | `운송 구간`, 상차지 검색, 하차지 검색, 상세주소 필드 | 기본 필드 후보로 반영 |
| `section-cargo-transport` 근처 | `톤수`, `차종`, `운송료`, `수수료`, `합계` | 거리/기준 금액 보조 메타의 정확도 조건으로 참조 |
| `section-dispatch` 근처 | `독차`, `혼적`, `긴급`, `왕복`, `예약`, `경유` | `독차/혼적`은 대표 선택, `긴급/왕복/예약`은 멀티옵션, `경유`는 수량 조건으로 운송구간 전체 보조 메타에 반영 |
| `section-load` 근처 | 상차 조건, 지게차, 상차일시, 상차지 전화 | 상차 행의 일시/방법/연락처 근거 |
| `section-unload` 근처 | 하차 조건, 지게차, 하차일시 | 하차 행의 일시/방법 근거 |
| 전체 스타일 | 종이 배경, 검은 선, 손글씨 폰트, dashed 안내 | HTML 시각 톤으로 반영 |

## `Cargo Order Wireframe.html`

| 위치 | 참고 내용 | 반영 |
| --- | --- | --- |
| `운송 구간` 그룹 | 상차지, 상차 상세, 시/도, 시/군/구, 하차지, 하차 상세 | 주소 구성과 상세주소 분리 근거 |
| `화물 운송정보` 일부 | 상차일시, 상차 시간대, 하차일시, 하차 시간대, 배차 유형, 차량 톤수, 차량 종류 | 일시 요약 근거, 배차 유형 근거, 계산 보조 메타의 차량 조건 근거 |
| `상차 조건` 그룹 | 상차 방법, 담당자, 연락처, 특이사항 | 펼침 상세 정보로 반영 |
| `하차 조건` 그룹 | 하차 방법, 담당자, 연락처, 특이사항 | 펼침 상세 정보로 반영 |

## `specs/04 Wireframe Spec Form.html`

| 위치 | 참고 내용 | 반영 |
| --- | --- | --- |
| `A. 운송 구간` | 상차/하차를 행으로 나누는 명세서형 표 | 빈 상태 및 2행 구조 근거 |
| `B. 화물 운송정보` | 상차일시, 하차일시 빈칸 | 빈 상태의 일시 placeholder 근거 |
| `E. 상차 · 하차 조건` | 상차 방법, 상차 담당, 하차 방법, 하차 담당 | 펼침 상세 정보의 필드 근거 |
| 폼시트 스타일 | 번호, 빈칸, 점선, 인쇄용 레이아웃 | 주소 미입력 상태의 시각 톤으로 반영 |

## 표시안별 소스 매핑

| 표시안 | 표시 모드 | 주요 기준 | 반영 내용 |
| --- | --- | --- | --- |
| A안 | `sheet-row` | `specs/04 Wireframe Spec Form.html` | 데이터 있음 상태도 표의 한 행으로 표시 |
| B안 | `sheet-card` | `specs/04 Wireframe Spec Form.html` + `Cargo Order Wireframe B Original Tone.html` | 명세표의 가로 흐름을 카드 안에 유지 |
| C안 | `stacked-card` | 기존 카드형 제안 | 지명, 주소, 일시/방법을 세로로 쌓는 설명형 비교안 |
| D안 | `compact-hybrid` | B안 `sheet-card` + C안 `stacked-card` | 1차 기준안. B안의 명세 흐름을 유지하되 상차/하차 header와 기본 라벨 노출을 줄인 컴팩트 병합안 |

## PRD-Wireframe-HTML 매핑

| REQ-ID | Wireframe | HTML 반영 |
| --- | --- | --- |
| REQ-transport-route-001 | SCR-TR-001 | `.route-summary .route-row` 2개를 세로 배치 |
| REQ-transport-route-002 | SCR-TR-001 | 구간명, 지명, 주소, 일시/방법, 배지 표시 |
| REQ-transport-route-003 | SCR-TR-001 | 상세주소는 기본 요약에 미노출 |
| REQ-transport-route-004 | SCR-TR-003 | `details` 펼침 영역에 상세정보 표시 |
| REQ-transport-route-005 | SCR-TR-001 | 지명 없는 샘플에서 지명 줄 생략 |
| REQ-transport-route-006 | SCR-TR-002 | 빈 상태 폼시트 패널 구현 |
| REQ-transport-route-007 | SCR-TR-001 | `특이사항 N` 배지 구현 |
| REQ-transport-route-008 | 전체 | 한 HTML에 세 상태 비교 섹션 구현 |
| REQ-transport-route-009 | SCR-TR-004 | `transport-route-section-variants.html`에서 A/B/C/D 표시안 비교 |
| REQ-transport-route-010 | SCR-TR-001, SCR-TR-004 | `transport-route-section-variants.html`에 `톤수·차종 선택 후 계산` 보조 메타 반영 |
| REQ-transport-route-011 | SCR-TR-001, SCR-TR-004 | `transport-route-section-variants.html`에 `독차(기본)/혼적` 대표 선택과 `긴급/왕복/예약` 멀티옵션 규칙 반영 |
| REQ-transport-route-012 | SCR-TR-D | `transport-route-d-workflow.html`에서 D안 닫힘/열림/워크플로우 상태 구현 |
| REQ-transport-route-013 | SCR-TR-D | `Cargo Order Wireframe B Original Tone.html`의 `.route-section-wide`로 운송구간 full-width 적용 |
| REQ-transport-route-014 | SCR-TR-D | 기존 `section-dispatch`, `section-load`, `section-unload` 정보를 운송구간 summary/detail/meta로 병합 |

## B 통합본 섹션 병합 매핑

| 기존 B 원본 섹션 | 병합 후 위치 | 보존된 정보 |
| --- | --- | --- |
| 5 `배차 유형` | 1 `운송 구간` 하단 `배차 유형` 메타 | `독차(기본)`, `혼적 전환 가능`, `긴급`, `왕복`, `예약` |
| 6 `상차 조건` | 상차 행 summary와 펼침 상세 | `지금`, `당일`, `내일`, `일상차`, `30분`, `지게차`, `수작업`, `호이스트`, `크레인`, `컨베이어`, 상차 연락처 |
| 7 `하차 조건` | 하차 행 summary와 펼침 상세 | `당일`, `내일`, `월착`, `일하차`, `30분`, `당착`, `지게차`, `수작업`, `호이스트`, `크레인`, `컨베이어`, 보험료 요약 |
| 8 `화주 정보` | 우측 컬럼 5번 | 번호만 재정렬, 필드 유지 |
| 9 `수수료율 정보` | 우측 컬럼 6번 | 번호만 재정렬, 필드 유지 |

## 의도적 차이

| 항목 | 차이 | 이유 |
| --- | --- | --- |
| 상차/하차 배치 | 기존 입력폼의 좌우/그리드 배치 대신 세로 2행 | 사용자가 명시한 최신 방향 반영 |
| 상세주소 위치 | 기존 입력폼에서는 기본 노출, 새 요약에서는 숨김 | 명세서형 컴팩트 요약 우선 |
| 담당자/연락처 | 기존 상하차 조건 섹션에 분산, 새 구조에서는 펼침으로 흡수 | 운송구간 관점에서 필요한 상세 정보로 통합 |
| 거리/기준 금액 | 기존 subbar에는 바로 노출되지만 새 구조에서는 `주소 + 톤수 + 차종` 조건 충족 후 보조 메타로 표시 | 사용자가 지적한 계산 정확도 의존성 반영 |
| 배차 유형 | 기존 B안에서는 별도 5번 섹션, 새 구조에서는 운송구간 전체 보조 메타로 반영 | `독차` 기본 대표값, `혼적` 전환, `긴급/왕복/예약` 독립 멀티선택이라는 최신 규칙 반영 |
