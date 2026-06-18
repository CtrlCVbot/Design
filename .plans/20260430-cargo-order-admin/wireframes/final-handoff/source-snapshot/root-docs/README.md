# 화물 오더 접수/수정 화면 문서 패키지

## 목적

이 패키지는 `오더접수관리-구버전` 화면을 현대적인 UX/UI로 개선하기 전에, 현재 화면의 정보 구조와 입력 항목을 빠짐없이 보존하기 위한 기준 문서입니다.

상단은 개별 화물 오더를 입력, 수정, 확인하는 영역이고, 하단은 등록된 화물 목록을 조회하고 후속 작업을 수행하는 영역입니다.

## 기준 이미지

| 항목 | 내용 |
| --- | --- |
| 원본 파일 | `.references/design/24시_2026-04-30 132210.png` |
| 분석용 복사본 | `assets/source-full.png` |
| 캡처 추정 시각 | 2026-04-30 13:22:10 |
| 화면 제목 | `오더접수관리-구버전` |
| 화면 성격 | 화물 오더 등록, 수정, 배차, 목록 조회, 정산/증빙 후속 처리 |

## 문서 구성

| 문서 | 역할 |
| --- | --- |
| `01-screen-map.md` | 전체 화면을 섹션 단위로 나눈 구조 분석 |
| `02-field-inventory.md` | 입력 필드, 버튼, 체크박스, 목록 컬럼 인벤토리 |
| `03-wireframe.md` | 현재 화면의 와이어프레임과 현대화 준비용 정보 구조 |
| `04-modernization-brief.md` | UX/UI 개선 전에 보존해야 할 업무 의미와 개선 방향 |
| `05-self-review.md` | 누락 위험, 불확실성, 피드백 반영 결과 |
| `07-new-order-registration-flow-integration-log.md` | 신규 접수 플로우 기획과 결과 HTML을 최종 기획 결과물에 반영한 로그 |
| `08-reservation-area-tabs-integration-log.md` | 보조 정보 탭 기획을 통합 master HTML에 반영한 로그 |
| `09-transport-dialog-recent-lists-integration-log.md` | 운송 관련 다이얼로그 최근 사용 리스트를 통합 master HTML과 메인 기획에 반영한 로그 |
| `09-transport-dialog-recent-lists-main-integration-plan.md` | 최근 사용 리스트 메인 기획 반영 계획과 실행 기준 |
| `10-hifi-design-polish-and-dispatch-manager-integration-log.md` | 최신 HiFi 디자인 피드백, 라벨 토글, 운송 구간 중복 제거, 배차 담당자 header chip 반영 로그 |
| `sections/reservation-area-tabs/09-planning-closure.md` | 보조 정보 섹션 기획 마무리 체크리스트 |
| `claude-design-v2/` | 섹션 정리 후 최신 High Fidelity 작업을 진행하기 위한 입력 패키지 |
| `sections/new-order-registration-flow/` | 신규 접수 버튼 이후 등록 플로우, wizard, 섹션 헤더, 최종 등록 CTA 기획 완료본 |
| `sections/reservation-area-tabs/` | 우측 `보조 정보` 탭 섹션 기획 완료본 |
| `sections/transport-dialog-recent-lists/` | 상하차지 주소 검색과 운송+품목 입력 다이얼로그의 최근 사용 리스트 기획 완료본 |
| `_archive/legacy-prompts/claude-design-v1/` | 1차 Claude Design 프롬프트, 검수 체크리스트, 결과 기록 문서 archive |

## 최신 HiFi 기준 결과물

| 파일 | 상태 | 역할 |
| --- | --- | --- |
| `results/html/cargo-order-admin-hifi-master.html` | master-current | 신규 접수 플로우, 보조 정보 탭, 운송 관련 다이얼로그 최근 사용 리스트, 최신 디자인 피드백, 라벨 토글 정리, 배차 담당자 header chip이 함께 반영된 현재 통합 HiFi 기준 파일. 기본은 데이터 있음 상태이며, `신규(F3)` 후 데이터 없음 상태를 확인 |
| `results/html/new-order-registration-flow-hifi-20260617.html` | flow-candidate | master에 반영 완료된 신규 접수 flow 후보 HTML |
| `results/html/cargo-order-hifi-reservation-tabs-shadcn-20260616.html` | source-candidate | 보조 정보 탭 데이터 있음 상태 후보. master에 반영 완료 |
| `results/html/cargo-order-hifi-reservation-tabs-empty-shadcn-20260617.html` | state-candidate | 보조 정보 탭 데이터 없음 상태 후보. master의 신규 접수 초기화 상태에 반영 |
| `sections/new-order-registration-flow/new-order-registration-flow-hifi-20260617.html` | source-candidate | 섹션 기획 폴더에 보관한 원본 후보 |
| `results/html/화물 오더 접수수정 (오프라인).html` | active-reference | 신규 shadcn HiFi 시각 기준 후보 |

`results/html/cargo-order-admin-hifi-master.html`은 현재 통합 HiFi의 source of truth입니다. 과거 후보 HTML은 비교와 rollback을 위한 참고 파일이며, 최종 결과물로 안내하지 않습니다.

실제 API endpoint 연결은 기획 완료 후에도 보류 상태로 유지한다. 메인 `화물 등록` API 정책은 `sections/new-order-registration-flow/08-main-submit-api-policy.md`의 보류 항목을 따른다.

## 현재 B 통합본 섹션 순서

| 번호 | 섹션 | 기준 |
| --- | --- | --- |
| 공통 | 화면 헤더 | 상태 chip, 거리/기준금액 chip, `배차 김민지` 담당자 chip, `Aa` 라벨 표시 토글을 같은 헤더 흐름에 배치 |
| 1 | 화주 정보 | 운송구간 상단 1열 배치 |
| 2 | 운송 구간 | 상하차지 full-width 배치. 주소 검색 다이얼로그는 최근 장소를 기존 검색 결과 영역의 초기 상태로 표시 |
| 3 | 화물 정보 | 운송+품목 입력과 적용 후 정보 표시. 운송+품목 다이얼로그는 최근 조합을 입력폼에만 반영 |
| 4 | 정산 정보 | 금액 입력과 적용 후 정산 정보 표시 |
| 확인 | 오더 요약 | 입력 단계가 아니라 검토용 섹션. 신규 접수 안내형 보기에서만 회색 `확인` 배지 |
| 선택 | 차주 정보 | 신규 접수 wizard에서는 선택 단계, 일반 수정에서는 독립 다이얼로그 |
| 6 | 보조 정보 | 우측 패널. `메모`, `금액 로그`, `운송 구간 지도` 탭으로 운영 보조 정보 확인 |

## 분석 보조 이미지

| 파일 | 범위 |
| --- | --- |
| `assets/top-toolbar.png` | 창 제목, 메뉴, 상단 상태/문의/광고 영역 |
| `assets/entry-form-left.png` | 상차지/하차지, 운송료, 화물정보, 차주 정보 |
| `assets/entry-form-right.png` | 독차/혼적, 상하차 방법/일시, 의뢰자, 수수료율 |
| `assets/actions-and-search.png` | 등록/수정/취소 액션, 목록 필터, 검색, 인쇄/정산 액션 |
| `assets/cargo-list.png` | 하단 화물 목록 전체 |
| `assets/cargo-list-left-columns.png` | 목록 좌측 주요 컬럼 |
| `assets/cargo-list-right-columns.png` | 목록 우측 차주/차량/정산 컬럼 |

## 사용 방법

1. `01-screen-map.md`에서 화면의 큰 구획을 먼저 확인합니다.
2. `02-field-inventory.md`를 기준으로 새 UI에 보존해야 할 항목을 체크합니다.
3. `03-wireframe.md`의 와이어프레임을 바탕으로 개선안의 화면 배치를 설계합니다.
4. `04-modernization-brief.md`에서 현재 화면의 UX 문제와 개선 원칙을 검토합니다.
5. 개선안 작성 후 `05-self-review.md`의 남은 리스크를 다시 확인합니다.
6. 최종 HiFi 결과물은 `results/html/cargo-order-admin-hifi-master.html`을 기준으로 확인합니다.
7. 보조 정보 데이터 없음 상태는 같은 master 파일에서 `신규(F3)`를 눌러 신규 접수 초기화 흐름으로 확인합니다.
8. 운송 관련 최근 사용 리스트는 master 파일에서 `주소 검색`, `운송+품목 입력` 다이얼로그를 열어 확인합니다.
9. 헤더의 배차 담당자 chip과 `Aa` 라벨 표시 토글은 master 파일 상단에서 확인합니다.
10. 보조 정보 섹션 기획 마무리 기준은 `sections/reservation-area-tabs/09-planning-closure.md`에서 확인합니다.
11. 최신 Claude Design 작업을 진행할 때는 `claude-design-v2/README.md`를 먼저 읽고, `claude-design-v2/PROMPT-LOG.md`의 실행 순서를 사용합니다. 1차 과거 프롬프트와 루트 handoff 기록은 `_archive/legacy-prompts/claude-design-v1/`에 보관합니다.

## 범위와 한계

이 문서는 캡처 이미지에 보이는 항목만 기준으로 작성했습니다. 드롭다운 내부 옵션, 팝업 화면, 권한별 노출 여부, 가로 스크롤 뒤쪽의 숨은 컬럼은 실제 프로그램이나 추가 캡처로 확인이 필요합니다.
