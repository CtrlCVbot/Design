# Clean 확정 기능 B 통합안 반영 기준

## 목적

`Cargo Order B Implementation Clean.html`에서 확정한 UX/UI 규칙을 기존 기획 통합안인 `Cargo Order Wireframe B Original Tone.html`과 각 섹션별 기획 문서, 섹션 HTML에 되돌려 반영하기 위한 기준 문서입니다.

Clean 파일은 최종 산출물이 아니라 구현 기준을 검증한 참조 화면입니다. 최종 기획 통합 기준은 기존 B 통합안입니다.

## 반영 범위

| 영역 | 반영 대상 | 반영 기준 |
| --- | --- | --- |
| 화주 정보 | 입력전 row, 적용 후 row, 통합 조회 다이얼로그 | 입력전에는 짧은 placeholder와 `화주 정보 입력` 버튼을 사용하고, 적용 후에는 hover/focus 라벨과 inline edit를 유지 |
| 운송 구간 | 상차/하차 1열 row, 주소 검색/적용 다이얼로그 | 상차지/하차지 입력전 placeholder, 적용 후 값 전체 표시, 상세주소/담당자/연락처 inline edit, 일시/방법 선택 유지 |
| 화물 운송정보 | 운송+품목 row, 금액 row | 두 입력 row 모두 `kind + placeholder + action` 구조로 통일하고, 적용 후에는 말줄임 없이 값 표시 |
| 화물정보 요약 | 요약 row | 화물 운송정보 입력 전에는 `운송 정보 입력 후 요약됩니다` placeholder를 사용 |
| 차주 정보 | Phase 2 화물맨 연동 row | Phase 1 비교보다 Phase 2 실제 배치 컴포넌트를 우선 기준으로 사용 |
| 공통 디자인 | 버튼, 라벨, placeholder, divider | 기존 B tone을 유지하되 버튼 높이, border radius, hover/focus, dotted placeholder를 통일 |

## 확정된 공통 규칙

| 규칙 | 내용 | 적용 위치 |
| --- | --- | --- |
| 입력전 row | `kind + dotted placeholder + action button`을 기본 구조로 사용 | 화주, 운송구간, 화물 운송정보, 차주 |
| placeholder 문구 | 설명문이 아니라 사용자가 다음에 입력할 대상을 짧게 표시 | 모든 입력전 row |
| 섹션 상단 패딩 | 첫 섹션과 나머지 섹션의 상하 여백을 동일하게 유지 | B 통합안 전체 |
| 버튼 통일 | 3px radius, 24~29px 높이, 같은 hover/focus outline 사용 | 모든 row action |
| 라벨 보기 OFF | 기본은 compact 값 표시, hover/focus 때만 임시 라벨 노출 | 적용 후 row |
| 라벨 보기 ON | `라벨 / 데이터` 2행 구조로 전환 | 구현 옵션, 화면 확인용 |
| 말줄임 제거 | 적용 후 데이터는 `...`으로 줄이지 않고 가능한 한 전체 표시 | 화주, 운송구간, 화물 운송정보, 요약, 차주 |
| 2중 박스 정리 | section 외곽만 유지하고 내부 card border는 최소화 | B 통합안과 섹션 HTML |
| 다이얼로그 선명도 | 다이얼로그 내부 리스트와 preview는 blur/opacity 없이 선명하게 표시 | 화주, 주소, 차주 |

## 섹션별 문서 반영 메모

| 섹션 문서 | 추가해야 할 기준 |
| --- | --- |
| `sections/shipper-info/README.md` | 입력전 placeholder와 `화주 정보 입력` 버튼, 적용 후 hover/focus 라벨, 연락처/이메일 inline edit |
| `sections/transport-route/README.md` | 상차/하차 입력전 placeholder, 적용 후 값 전체 표시, 주소 옆 hover 변경 라벨, 일시/방법 선택 |
| `sections/cargo-transport/README.md` | F안 확정 규칙, 운송+품목/금액 입력전 placeholder, 적용 후 말줄임 제거 |
| `sections/cargo-summary-docs/README.md` | 요약 placeholder 문구와 cargo transport 데이터 연동 기준 |
| `sections/driver-info/README.md` | Phase 2 화물맨 연동 버전만 B 통합안 기준으로 사용, 스크롤 없는 실제 배치 row |

## B 통합안 반영 체크리스트

| 항목 | 기준 |
| --- | --- |
| main class | B 통합안에 Clean 반영용 scope class를 추가해 기존 tone과 충돌을 줄임 |
| 화주 정보 | 최초 상태는 입력전 row로 시작하고, 적용 시 `is-empty`를 제거 |
| 운송 구간 | 상차/하차 모두 입력전 row로 시작하고, 주소 적용 시 `is-empty`를 제거 |
| 화물 운송정보 | 운송+품목, 금액 모두 입력전 row로 시작하며 placeholder 문구를 노출 |
| 화물정보 요약 | 초기값은 자동 요약 문장이 아니라 placeholder로 시작 |
| 차주 정보 | Phase 2 화물맨 연동 row의 placeholder, 취소/배차완료/적용 흐름 유지 |
| 데이터 표시 | label mode OFF에서도 적용 후 값이 `...`으로 줄지 않도록 CSS override |
| 문서 링크 | component unification 문서와 각 섹션 README에서 이 기준 문서를 참조 |

## 검증 기준

| 검증 | 통과 기준 |
| --- | --- |
| 입력전 상태 | 화주, 운송구간, 화물 운송정보, 요약, 차주가 모두 짧은 placeholder로 보임 |
| 적용 후 상태 | 다이얼로그 적용 또는 inline edit 후 기존 row 구조가 흔들리지 않음 |
| hover/focus | 임시 라벨과 수정 affordance가 표시되지만 row height가 크게 튀지 않음 |
| 말줄임 | 적용된 값이 불필요하게 `...`으로 축약되지 않음 |
| 스크롤 | 차주 정보 Phase 2 row가 섹션 내부에서 가로 스크롤 없이 표시됨 |
