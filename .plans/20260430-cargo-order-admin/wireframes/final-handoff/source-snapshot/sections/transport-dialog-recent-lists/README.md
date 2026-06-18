# 운송 관련 다이얼로그 최근 사용 리스트 기획 패키지

## 목적

이 패키지는 기존 운송 관련 다이얼로그에 `최근 사용` 리스트를 보조 영역으로 추가하기 위한 기획 산출물입니다.

대상은 `상하차지 선택 다이얼로그`와 `운송+품목 선택 다이얼로그`입니다. 전체 화면을 다시 설계하지 않고, 기존 `운송 구간`과 `화물 정보` 입력 흐름 안에서 반복 입력 비용을 줄이는 보조 리스트 정책만 분리해 정리합니다.

## 범위

| 구분 | 포함 | 제외 |
| --- | --- | --- |
| 상하차지 선택 | `openAddrSearch('load')`, `openAddrSearch('unload')` 성격의 주소 검색 다이얼로그에 최근 장소 리스트 추가, `master.html` static prototype 반영 | 실제 주소록/API 저장 구현 |
| 운송+품목 선택 | `openCargoInput()` 성격의 입력 다이얼로그에 최근 조합 리스트 추가 | 톤수/차종/품목 개별 추천 구현 |
| 상태 정책 | 최근 있음/없음, 선택 후 미리보기, loading/error, wizard와 독립 다이얼로그 차이 | 전체 신규 접수 wizard 재설계 |
| HTML 산출물 | 다이얼로그 2개와 주요 상태 샘플을 담은 standalone HTML, 통합 HiFi static prototype 반영 | 전체 화면 재설계 |

## 참조 파일

| 파일 | 확인 내용 |
| --- | --- |
| `results/html/cargo-order-admin-hifi-master.html` | `openAddrSearch()`, `applyAddr()`, `openCargoInput()`, `applyCargo()` 흐름과 `운송 구간`, `화물 정보` 섹션명 |
| `results/html/Design System.html` | shadcn 기준의 `dialog`, `btn`, `chip`, `badge`, `empty`, `summary-row` 패턴 |
| `sections/new-order-registration-flow/04-dialog-wizard-flow.md` | 신규 접수 wizard와 독립 다이얼로그 분리 정책 |
| `sections/new-order-registration-flow/05-state-and-interaction-matrix.md` | `idle-edit`, `new-wizard-active`, `new-submitted` 상태 정책 |
| `sections/transport-route/address-apply-layouts/02-wireframe-address-apply-layouts.md` | 주소 검색/적용 다이얼로그의 조회 결과 + 선택 미리보기 구조 |
| `sections/transport-route/address-apply-layouts/04-kakao-shipper-address-search-plan.md` | 화주 주소록 + Kakao 통합 검색과 주소록 저장 조건 |
| `sections/cargo-transport/09-f-transport-item-money-dialog-plan.md` | `운송+품목 입력` 다이얼로그와 `운송+품목 적용` 버튼 정책 |
| `sections/cargo-transport/05-source-mapping.md` | `톤수`, `차종`, `대수`, `실중량`, `품목` target field 기준 |

## 문서 목록

| 파일 | 내용 |
| --- | --- |
| `01-overview.md` | 사용자 가치, 보조 영역 원칙, wizard와 일반 수정 다이얼로그 적용 차이 |
| `02-address-dialog-recent-list.md` | 상차지/하차지 최근 장소 리스트 정책 |
| `03-cargo-item-dialog-recent-list.md` | 운송+품목 최근 조합 리스트 정책 |
| `04-state-and-interaction-matrix.md` | 상태별 표시와 최근 항목 선택 우선순위 |
| `05-acceptance-criteria.md` | 구현 검증 기준과 기존 flow 회귀 방지 기준 |
| `06-master-integration-plan.md` | `master.html` 반영 범위, 실행 결과, 제외 항목, 후속 기준 |
| `self-review.md` | 자체 리뷰, 용어 점검, 리스크와 후속 확인 항목 |

## HTML 산출물

| 파일 | 내용 |
| --- | --- |
| `transport-dialog-recent-lists-hifi-20260617.html` | 상하차지 다이얼로그, 운송+품목 다이얼로그, 최근 리스트 있음/없음, 최근 항목 선택 후 미리보기 상태 샘플 |

## 핵심 결정

| 항목 | 결정 |
| --- | --- |
| MVP 정렬 | `최근 선택순 10개` |
| 중복 제거 | 같은 장소 또는 같은 조합은 최신 사용 시각 기준 1개만 표시 |
| 확정 책임 | 최근 항목 클릭은 다이얼로그 내부 입력값 또는 미리보기만 갱신하고, 실제 저장은 기존 `적용` 버튼이 담당 |
| 주소 최근 기준 | 최근 장소는 기존 주소 검색 결과 영역의 초기 상태로 표시. `조회` 또는 Enter 검색 실행 후 같은 영역을 기존 검색 결과 리스트로 전환 |
| 주소 미리보기 | 현재 미리보기 내부 UI 톤은 유지 가능하되, 위치와 전체 레이아웃은 기존 주소 검색 다이얼로그 구조를 우선 적용 |
| 운송+품목 최근 기준 | `톤수 + 차종 + 품목 + 중량` 조합 단위 |
| 운송+품목 미리보기 | 별도 `선택 요약` 패널 없이 최근 조합 선택값을 입력폼에만 반영 |
| 개인정보 보호 | 연락처, 업체명, 담당자명은 운영 판단에 필요한 최소 범위만 표시 |

## 작업 상태

| 항목 | 상태 |
| --- | --- |
| 섹션 문서 패키지 | 작성 |
| standalone HTML | 작성 |
| `master.html` 반영 계획 | 작성 |
| `master.html` 반영 | static prototype 반영 |
| 실제 API/DB 구현 | 후속 |
