# 예약 영역 탭 섹션 기획 패키지

## 목적

이 패키지는 현재 HiFi 후보인 `results/html/cargo-order-hifi-local-motion-20260616.html`의 우측 `예약 영역` placeholder를 3개 탭 구조로 확장하기 위한 기획 문서 패키지입니다.

화면에 노출되는 섹션 헤더명은 `보조 정보`로 확정합니다. `예약 영역`과 `reservation-area-tabs`는 기존 작업 패키지명과 내부 식별자로 유지합니다.

이번 단계는 HTML/CSS/JS 구현이 아니라 문서 구조 수립과 섹션 기획 마무리입니다. 기존 접수/수정 섹션의 입력 흐름은 유지하고, 우측 영역은 운송건을 이해하고 확인하는 보조 패널로 설계합니다.

2026-06-17 피드백 반영 후 기준은 `업무 요약 우선`입니다. 우측 `보조 정보`의 기본 탭은 `메모`이며, 탭 순서는 `메모`, `금액 로그`, `운송 구간 지도`입니다. `금액 로그`는 청구금/배차금/수익을 금액 명세처럼 읽히게 구성하고, 상세 확인이나 작성은 dialog 또는 펼침(expand) 동작으로 분리합니다.

## 추천 위치

추천 위치는 아래 경로입니다.

`C:\Work\Dev\Design\.plans\wireframes\cargo-order-admin-20260430\sections\reservation-area-tabs`

이 위치를 추천하는 이유는 다음과 같습니다.

| 판단 기준 | 내용 |
| --- | --- |
| 기존 구조 적합성 | `sections` 아래에 `transport-route`, `cargo-transport`, `order-entry-edit`처럼 섹션 단위 패키지가 이미 존재합니다. |
| 화면 내 위치 | 현재 `예약 영역`은 전체 화면의 우측 보조 영역이므로 독립 섹션 패키지로 분리하는 것이 자연스럽습니다. |
| 이번 범위 분리 | `cargo-list`는 이번 범위에서 제외되었고, 기존 접수/수정 섹션을 덮어쓰지 않아야 하므로 새 하위 폴더가 안전합니다. |
| 후속 작업 연결 | 탭별 상세 문서를 나누면 지도, 메모, 금액 로그를 각각 독립 작업 단위로 전환하기 쉽습니다. |

대안으로는 `sections/order-entry-edit/reservation-area-tabs` 하위에 넣는 방식도 가능하지만, 예약 영역은 접수/수정 입력 자체가 아니라 우측 보조 패널이므로 별도 섹션 패키지를 기본안으로 둡니다.

## shadcn 디자인 기준

예약 영역 탭의 화면 구현은 아래 `Design System.html`의 shadcn 기준으로 진행합니다.

`C:\Work\Dev\Design\.plans\wireframes\cargo-order-admin-20260430\results\html\Design System.html`

| 기준 | 적용 방향 |
| --- | --- |
| 색상/표면 | `--brand-*`, `--surface`, `--surface-soft`, `--border`, `--text-*` 토큰을 사용합니다. |
| 섹션 구조 | `ds-section`, `sec-head`, `sec-body` 계열의 밀도와 경계를 유지합니다. |
| 액션 | `btn`, `btn--primary`, `btn--secondary`, `btn--ghost`, `btn--danger` 계열을 재사용합니다. |
| 상태 표시 | `chip`, `badge`, `notice`, `empty` 패턴을 우선 사용합니다. |
| 요약 행 | 지도 메타, 최신 메모, 금액 명세는 `summary-row`와 `chip--metric` 감각을 따릅니다. |
| 금지 | 예약 영역 탭 전용의 새로운 색상 체계, 과한 카드 장식, 별도 hero형 구성을 만들지 않습니다. |

## 문서 구조

| 파일 | 역할 |
| --- | --- |
| `README.md` | 패키지 목적, 추천 위치, 문서 목록, 사용 순서 |
| `01-reservation-tabs-planning.md` | 전체 탭 구조, 사용자 가치, 정보 구조, 연결 원칙 |
| `02-tab-map-section.md` | `운송 구간 지도` 탭 상세 기획 |
| `03-tab-memo-section.md` | `메모` 탭 상세 기획 |
| `04-tab-amount-log-section.md` | `금액 로그` 탭 상세 기획 |
| `05-state-and-interaction-matrix.md` | 탭별 상태, 액션, 전환, motion/feedback 기준 |
| `06-design-system-component-mapping.md` | `Design System.html`의 shadcn 기준 컴포넌트, 토큰, 상태 매핑 |
| `07-visibility-rules.md` | `보조 정보` 패널의 표시, 접힘, 숨김 기준 |
| `08-implementation-handoff.md` | 나중에 구현으로 넘길 때 참고할 결정, 데이터 필드 초안, 검증 체크리스트 |
| `09-planning-closure.md` | 이번 섹션 기획 마무리 기준 |
| `self-review.md` | 자체 리뷰, 검증 결과, 리스크, 후속 확인 사항 |

## 범위

| 구분 | 포함 | 제외 |
| --- | --- | --- |
| 화면 구조 | 우측 `보조 정보` 패널을 3개 탭으로 구성 | 좌측 접수/수정 섹션 구조 변경 |
| 데이터 표시 | 메모 리스트, 금액 명세형 로그, 운송 구간 지도 | 실제 API 연동 |
| 액션 | 메모 추가 dialog, 금액 상세 확인, 주소/금액 변경 결과 반영 표시 | 금액 직접 수정, 주소 직접 수정 |
| 상태 | 빈 상태, 로딩 상태, 오류 상태, 데이터 있음 상태 | 최종 디자인 시안 구현 |
| 검증 | acceptance criteria와 리스크 정리 | 개발 QA, 픽셀 QA |

## 핵심 결정 요약

| 탭 | 1차 역할 | MVP 기준 |
| --- | --- | --- |
| `메모` | 운송건과 관련된 운영 메모를 시간순으로 확인 | 기본 화면은 리스트만 표시, `추가` 버튼으로 메모 작성 dialog 열기 |
| `금액 로그` | 청구 조정금, 배차 조정금, 수익을 금액 명세로 확인 | 기준금액, 조정금, 합계, 수익을 첫 화면에 표시하고 항목 담당자/일시/사유는 상세 펼침으로 확인 |
| `운송 구간 지도` | 상차지와 하차지의 위치, 거리, 예상 시간, 경유 여부를 빠르게 확인 | 지도/핀/상태 chip 중심 표시, 하단 상차/하차 주소 반복 표시 제외 |

## 구현 후보

| 파일 | 상태 | 기준 |
| --- | --- | --- |
| `../../_archive/compact-handoff-20260618/results/html/cargo-order-hifi-reservation-tabs-shadcn-20260616.html` | 최신 데이터 있음 후보, 반영 완료 | 헤더명 `보조 정보`, 탭 순서 `메모`, `금액 로그`, `운송 구간 지도`를 반영했습니다. |
| `../../_archive/compact-handoff-20260618/results/html/cargo-order-hifi-reservation-tabs-empty-shadcn-20260617.html` | 빈 상태 후보, 갱신 완료 | 헤더명 `보조 정보`, 세 탭 공통 empty box 패턴을 확인할 수 있습니다. |

## 사용 순서

1. `01-reservation-tabs-planning.md`에서 전체 구조와 탭 분리 원칙을 확인합니다.
2. 탭별 상세 문서인 `02`, `03`, `04`를 읽고 탭별 역할을 확인합니다.
3. `05-state-and-interaction-matrix.md`에서 상태별 표시, 액션, 탭 전환 규칙을 확인합니다.
4. `06-design-system-component-mapping.md`에서 `Design System.html`의 shadcn 기준 컴포넌트 매핑을 확인합니다.
5. `07-visibility-rules.md`에서 `보조 정보` 패널을 표시할지, 접을지, 숨길지 판단하는 기준을 확인합니다.
6. `08-implementation-handoff.md`에서 나중에 구현으로 넘길 때 참고할 데이터 필드 초안과 검증 체크리스트를 확인합니다.
7. `09-planning-closure.md`에서 이번 섹션 기획 완료 기준을 확인합니다.
8. `self-review.md`에서 남은 리스크와 정책 확인 항목을 확인합니다.

## 기획 종료 기준

1. `09-planning-closure.md`에서 완료 판정과 남은 정책 확인 항목을 확인합니다.
2. `cargo-order-admin-hifi-master.html`에서 데이터 있음, 데이터 없음, 부분 데이터 상태가 확인된 것을 기준으로 기획을 닫습니다.
3. 지도 provider, 조정금 대상 저장 방식, 필수 입력 여부, 정산 후 수정 정책은 다음 차수의 후속 정책 확인 항목으로 남깁니다.
