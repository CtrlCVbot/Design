# Component Unification Plan

## 목적

이 문서 패키지는 `Cargo Order B Implementation Clean.html`을 기준으로 컴포넌트 디자인 규칙을 통일하기 위한 검토 자료입니다.

현재 화면은 구현용 clean HTML로 정리되어 있지만, 섹션마다 라벨, 버튼, row, 구분선, 입력 전 상태, 수정 가능 상태의 표현이 조금씩 다릅니다. 이 상태로 high fidelity 디자인이나 실제 프론트엔드 구현을 진행하면 AI 또는 개발자가 섹션별로 다른 디자인 판단을 할 가능성이 있습니다.

## 기준 파일

| 항목 | 경로 |
| --- | --- |
| 기준 HTML | `C:\Work\Dev\Design\.plans\wireframes\cargo-order-admin-20260430\results\wireframe\order-register-new2.0\Cargo Order B Implementation Clean.html` |
| 문서 폴더 | `C:\Work\Dev\Design\.plans\wireframes\cargo-order-admin-20260430\results\wireframe\order-register-new2.0\component-unification-plan` |

## 검토 범위

| 범위 | 포함 여부 | 기준 |
| --- | --- | --- |
| 화주 정보 | 포함 | 현재 row와 다이얼로그 진입 버튼 기준 |
| 운송 구간 | 포함 | 상차/하차 1행 정리안 기준 |
| 화물 운송정보 | 포함 | 운송+품목, 금액 입력 전/적용 후 상태 기준 |
| 화물정보 요약 | 포함 | 단일 요약 row와 hover 수정 버튼 기준 |
| 차주 정보 | 포함 | 화물맨 연동 버전만 기준 |
| 우측 빈공간 | 제외 | 추후 다른 정보로 채울 예정 |
| HTML 직접 수정 | 제외 | 이번 단계는 문서화만 수행 |

## 문서 읽는 순서

1. `00-index.md`에서 전체 구조와 추천 적용 순서를 확인합니다.
2. `01-component-design-audit.md`에서 현재 화면의 불일치 항목을 확인합니다.
3. `02-component-unification-options.md`에서 통일 방식 대안을 비교합니다.
4. `03-component-state-guideline.md`에서 상태별 UI 규칙을 확인합니다.
5. `05-component-interaction-state-matrix.md`에서 컴포넌트별 입력 전/적용 후/hover 상태를 한눈에 비교합니다.
6. `04-implementation-checklist.md`를 기준으로 후속 HTML 반영 작업을 진행합니다.

## 활용 방식

이 문서 패키지는 바로 구현하기 위한 최종 디자인 명세가 아니라, 다음 HTML 정리 작업과 high fidelity 디자인 작업의 기준을 맞추기 위한 중간 의사결정 자료입니다.

추천 흐름은 다음과 같습니다.

1. `Option D+` 방향을 확정합니다.
2. `라벨 보기` 토글, 2행 라벨 모드, hover/focus 임시 라벨 규칙을 HTML에 반영합니다.
3. 라벨, 버튼, row, 상태, 구분선 규칙을 함께 정리합니다.
4. 반영 전/후 캡처를 비교합니다.
5. 확정된 clean HTML을 high fidelity 디자인 입력 자료로 사용합니다.
## 2026-06-08 Clean 반영 기준

이번 단계부터 `Cargo Order B Implementation Clean.html`은 최종 화면이 아니라 확정된 컴포넌트 규칙의 참조 화면으로 사용합니다. 실제 기획 통합 기준은 기존 `Cargo Order Wireframe B Original Tone.html`입니다.

| 문서 | 역할 |
| --- | --- |
| `06-clean-adoption-to-b-original.md` | Clean에서 확정한 입력전 placeholder, 라벨 보기, hover/focus, 말줄임 제거, 차주 Phase 2 규칙을 기존 B 통합안과 섹션별 문서/HTML에 반영하는 기준 |
| `07-clean-adoption-verification.md` | Clean 기준을 B Original 통합안에 반영한 뒤 브라우저로 확인한 초기 상태와 주요 다이얼로그 검증 기록 |
