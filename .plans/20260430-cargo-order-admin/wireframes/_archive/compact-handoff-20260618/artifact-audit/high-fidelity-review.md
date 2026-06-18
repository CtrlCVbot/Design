# High Fidelity Review

> 대상 파일: `C:\Work\Dev\Design\.plans\wireframes\cargo-order-admin-20260430\results\html\화물 오더 접수수정 (오프라인).html`

## 파일 기본 정보

| 항목 | 내용 |
| --- | --- |
| 파일명 | `화물 오더 접수수정 (오프라인).html` |
| 위치 | `C:\Work\Dev\Design\.plans\wireframes\cargo-order-admin-20260430\results\html` |
| 크기 | 약 22 MB |
| 생성/수정 기준 | 2026-06-16 08:23 |
| HTML title | `화물 오더 접수/수정 — 고도화(HiFi · shadcn)` |
| 성격 | 오프라인 단일 HTML 기반 high fidelity 결과물 |

## 초기 관찰

| 항목 | 관찰 | 판단 |
| --- | --- | --- |
| 디자인 시스템 | Pretendard, shadcn 계열 토큰, 버튼/필드/Badge 토큰 포함 | 고도화 결과물로 적합 |
| 주요 기능 스크립트 | 화주, 주소 검색, 운송+품목, 금액, 일시/방법, 차주/화물맨 흐름 함수 포함 | 기존 기획 흐름 반영 가능성 높음 |
| 산출물 형태 | CSS, font, script가 포함된 큰 단일 HTML | 배포용보다는 디자인 검토용 |
| 기준본 여부 | 아직 검증 전 | 기준본 승격 보류 |

## 섹션별 리뷰 기준

| 섹션 | 비교 기준 | 확인할 내용 |
| --- | --- | --- |
| 화주 정보 | `sections\shipper-info` | 입력 전, 적용 후, 변경 다이얼로그, 담당자 정보 인라인 수정 |
| 운송구간 | `sections\transport-route` | 1열 정리안, 상하차지 변경, 주소 검색, 일시/방법 선택 |
| 화물 운송정보 | `sections\cargo-transport` | F안, 운송+품목 2행, 금액 섹션, 실중량 안내 |
| 화물정보 요약 | `sections\cargo-summary-docs` | 화물 운송정보와 데이터 연결, 과도한 설명 문구 제거 |
| 차주 정보 | `sections\driver-info` | phase2 화물맨 연동, 차주 등록, 연동 취소, 다이얼로그 선명도 |
| 화물 목록 | `sections\cargo-list` | 아직 분리 기획 초기 단계라 HiFi 반영 여부 별도 확인 필요 |

## 기준본 승격 전 체크리스트

| 체크 항목 | 상태 | 메모 |
| --- | --- | --- |
| B Original Tone과 섹션 순서 일치 | 검증 필요 | 현재 문서 기반 비교 필요 |
| Clean의 입력 전 placeholder 규칙 반영 | 검증 필요 | 화면 렌더링 확인 필요 |
| label view 토글/hover 규칙 반영 | 검증 필요 | 상호작용 확인 필요 |
| 화물맨 phase2 차주 정보만 표현 | 검증 필요 | 차주 섹션 확인 필요 |
| 기획 설명 문구 제거 | 검증 필요 | 구현용 화면 기준 확인 필요 |
| 화물 목록 기획 미완료 영역 처리 | 검증 필요 | 목록 섹션은 별도 기획 중 |

## 권장 리뷰 순서

1. 신규 HiFi HTML을 브라우저로 열어 전체 레이아웃을 캡처합니다.
2. B Original Tone과 섹션 순서, 필드 누락, 버튼 위치를 비교합니다.
3. Clean 구현안과 placeholder, label view, hover/focus, 버튼 스타일을 비교합니다.
4. 각 다이얼로그가 기존 섹션 기획의 사용자 흐름과 맞는지 확인합니다.
5. 기준본 승격, 부분 반영, 재작업 요청 중 하나로 판정합니다.

## 초기 판정

현재는 `시각 고도화 기준본으로 조건부 승격`입니다. 파일 구조상 high fidelity 결과물로는 적합하지만, Clean과 B Original Tone의 interaction/data hook을 그대로 보존하지 않아 `구현 기준본`으로는 승격하지 않습니다.

## 2026-06-16 승격 검토 반영

상세 판정은 `hifi-promotion-review-2026-06-16.md`에 기록했습니다.

| 항목 | 결과 | 메모 |
| --- | --- | --- |
| 5개 입력 섹션 순서 | 통과 | 화주 정보 → 운송 구간 → 화물 운송정보 → 화물정보 요약 → 차주 정보 |
| 시각 고도화 | 통과 | shadcn 계열 토큰, Pretendard, 전문 업무용 UI 톤 확인 |
| cargo-list | 보류 | `오더 목록 (cargo-list)` placeholder만 있고 실제 테이블은 후속 기획 |
| 전역 액션 | 부분통과 | 신규 접수, 화물 등록/수정/복사, 위험/출력 그룹은 있으나 계산서/서명확인 등 재매핑 필요 |
| Clean data hook | 미통과 | HiFi template에는 `data-b-*`, `data-route-*`, `data-summary-*`, `data-preview-*` hook이 확인되지 않음 |
| dialog/accessibility contract | 부분통과 | `aria-modal` 일부 확인. Clean의 `role="dialog"`, `role="tablist"` 계약은 보존 검토 필요 |

## 최신 판정

| 기준 | 판정 | 설명 |
| --- | --- | --- |
| 시각 기준본 | 조건부 승격 | 이후 접수/수정 섹션 고도화의 시각 방향으로 사용 |
| 구조 기준본 | 부분 승격 | 5개 입력 섹션은 참고 가능, cargo-list는 제외 |
| 구현 기준본 | 보류 | Clean과 B Original Tone을 계속 기준으로 유지 |
| 다음 기획 우선순위 | 접수/수정 섹션 | `cargo-list`는 사용자의 최신 지시에 따라 후순위 |
