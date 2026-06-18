# 화물 목록 섹션 기획 패키지

## 목적

이 패키지는 B 통합안 하단의 `화물 목록` 섹션을 차주 정보 섹션과 같은 방식으로 분리해 기획하기 위한 시작 문서입니다.

이번 단계에서는 바로 HTML을 구현하지 않고, 현재 목록 섹션을 분석한 뒤 문서 패키지와 분리 HTML 산출물의 구조를 먼저 확정합니다.

## 기준

| 항목 | 기준 |
| --- | --- |
| 기준 화면 | `../reference-snapshot/wireframe/Cargo Order Wireframe B Original Tone.html` |
| 기준 섹션 | 하단 `화물 목록` |
| 구조 참고 | `../driver-info/README.md`와 차주 정보 섹션 문서 패키지 |
| 디자인 톤 | B Original Tone의 색감, 폰트, 밀도, 테이블 톤 유지 |

## 차주 정보 패키지에서 가져올 방식

| 기준 | 화물 목록 적용 방향 |
| --- | --- |
| `README.md` | 패키지 목적, 기준 화면, 산출물, 사용 순서 정리 |
| `01-prd-*.md` | 목록 섹션의 목표, 범위, 기능 요구사항 정리 |
| `02-wireframe-*.md` | 목록 기본/필터/선택/빈 결과/액션 상태 wireframe 정리 |
| `03-user-flow-*.md` | 등록된 화물 확인, row 선택, 수정/복사/배차/정산 흐름 정리 |
| `04-field-state-mapping.md` | 테이블 컬럼, 상태 badge, row action, 필터 state mapping |
| `05-b-integration-guide.md` | B 통합안으로 되돌릴 때 적용할 범위와 기준 정리 |
| HTML wireframe | 브라우저에서 상태별 목록 UX를 확인하는 독립 HTML |
| `self-review.md` | 반영 상태, 남은 리스크, 후속 작업 기록 |

## 계획 산출물

| 파일 | 상태 | 역할 |
| --- | --- | --- |
| `README.md` | 작성됨 | 화물 목록 패키지 진입점 |
| `00-package-plan.md` | 작성됨 | 문서 패키지와 HTML 분리 작업 계획 |
| `01-prd-cargo-list.md` | 예정 | 화물 목록 목표, 범위, 요구사항 |
| `02-wireframe-cargo-list.md` | 예정 | 상태별 목록 wireframe |
| `03-user-flow-cargo-list.md` | 예정 | 목록 조회/선택/수정/반영 user flow |
| `04-field-state-mapping.md` | 예정 | 컬럼/필터/상태/액션 mapping |
| `05-b-integration-guide.md` | 예정 | B 통합안 반영 기준 |
| `cargo-list-section-wireframe.html` | 예정 | 독립 HTML 와이어프레임 |
| `self-review.md` | 작성됨 | 이번 계획 self-review |

## 현재 B 통합안 목록 구조 요약

| 영역 | 현재 구조 | 기획 검토 포인트 |
| --- | --- | --- |
| 상태 탭 | 전체목록, 접수목록, 완료목록, 취소 | 상태명과 개수 표시 기준 정리 필요 |
| 검색 기준 | 날짜와 검색 가능 키워드 안내 | 실제 검색 input, 필터, 빠른 검색으로 분리할지 검토 |
| 페이지 컨트롤 | 이전, 현재 페이지, 다음 | 목록 수, 페이지 크기, 고정 위치 검토 |
| 정렬/보기 옵션 | 처리시간순, 항목 너비 저장, 글자 크게 | 운영자 반복 사용 기준으로 우선순위 재정리 필요 |
| 테이블 | 가로 스크롤 기반 대량 컬럼 | 핵심 컬럼과 보조 컬럼 분리 필요 |
| 선택 row | 선택 row 배경 강조 | 상단 입력 섹션과 연결되는 동작 기준 필요 |
| 취소 row | 취소 row 색상 강조 | 취소 사유/재접수 가능 여부 검토 필요 |

## 다음 작성 순서

1. `01-prd-cargo-list.md`에서 목록 섹션의 목표와 범위를 확정합니다.
2. `04-field-state-mapping.md`에서 현재 테이블 컬럼을 핵심/보조/숨김 후보로 분류합니다.
3. `02-wireframe-cargo-list.md`에서 기본 목록, 선택 row, 빈 결과, 필터 적용 상태를 정리합니다.
4. `03-user-flow-cargo-list.md`에서 상단 입력 섹션과 하단 목록이 이어지는 흐름을 정리합니다.
5. `cargo-list-section-wireframe.html`을 분리 HTML로 작성합니다.
6. `05-b-integration-guide.md`를 통해 B 통합안 반영 범위를 확정합니다.
