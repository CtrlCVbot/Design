# Component Unification Plan Index

## 개요

`Cargo Order B Implementation Clean.html`은 기존 B 통합본에서 기획 설명과 불필요한 섹션 헤더를 제거한 구현용 clean 화면입니다. 현재 화면은 주요 업무 흐름을 담고 있지만, 섹션별 컴포넌트 표현 규칙이 완전히 통일되지는 않았습니다.

이 패키지는 다음 목표를 가집니다.

| 목표 | 설명 |
| --- | --- |
| 디자인 규칙 통일 | 라벨, 값, 버튼, row, 구분선, hover/focus 표현 기준 정리 |
| 상태 표현 정리 | 입력 전, 적용 완료, 수정 중, 외부 연동 중, 오류 상태를 같은 문법으로 표현 |
| 후속 구현 준비 | AI 또는 개발자가 같은 디자인 판단을 재사용할 수 있게 체크리스트 제공 |
| 기존 톤 유지 | B original tone의 hand-drawn wireframe 느낌은 유지 |

## 기준과 가정

| 항목 | 기준 |
| --- | --- |
| 기준 HTML | `Cargo Order B Implementation Clean.html` |
| 우측 빈공간 | 이번 검토에서는 문제로 보지 않음 |
| 차주 정보 | 화물맨 연동 버전만 기준 |
| 문서 범위 | 제안과 계획 수립까지 |
| HTML 수정 | 이번 패키지 작성 단계에서는 하지 않음 |
| 디자인 톤 | 현재의 종이 배경, 얇은 선, 라벨 chip, 손글씨형 값 표현 유지 |

## 산출물 목록

| 파일 | 역할 |
| --- | --- |
| `README.md` | 문서 패키지 사용 방법 |
| `00-index.md` | 전체 개요, 기준, 추천 적용 순서 |
| `01-component-design-audit.md` | 현재 화면의 불일치 항목 진단 |
| `02-component-unification-options.md` | 통일 방식 대안 비교와 추천안 |
| `03-component-state-guideline.md` | 상태별 UI 표현 규칙 |
| `04-implementation-checklist.md` | 후속 HTML 반영 작업 목록 |
| `05-component-interaction-state-matrix.md` | 컴포넌트별 입력 전, 적용 후, hover/focus, 라벨 보기 ON 상태 비교 |

## 추천 적용 순서

| 순서 | 작업 | 이유 |
| --- | --- | --- |
| 1 | `라벨 보기` 토글 기준 확정 | compact 기본값과 상세 라벨 모드의 전환 기준 결정 |
| 2 | 2행 라벨 모드 정의 | 토글 ON 시 라벨/데이터 정렬 기준 확정 |
| 3 | hover/focus 임시 라벨 규칙 정리 | 토글 OFF 상태에서도 필드 의미를 확인할 수 있게 함 |
| 4 | 컴포넌트별 상태 매트릭스 확정 | 입력 전/적용 후/hover 상태가 섹션별로 흔들리지 않게 함 |
| 5 | 버튼 역할 체계 통일 | 입력/변경/외부 연동/위험 액션의 혼선을 줄임 |
| 6 | 입력 전 row와 적용 후 row 문법 통일 | 상태 전환이 섹션마다 다르게 보이는 문제 해결 |
| 7 | 구분선과 다이얼로그 진입 규칙 정리 | 어떤 값이 inline edit인지, 어떤 값이 dialog인지 분명해짐 |

## 이번 문서의 추천 방향

추천안은 `02-component-unification-options.md`의 **Option D+: Compact 기본 + 2행 라벨 보기 + hover/focus 임시 라벨**입니다.

이유는 다음과 같습니다.

| 판단 기준 | 이유 |
| --- | --- |
| 현재 톤 유지 | 기본값은 C안처럼 compact하게 유지 |
| 신규 사용자 보완 | 필요할 때 A안처럼 2행 라벨을 켤 수 있음 |
| 운영 스캔성 | 숙련자는 데이터만 보고, 헷갈리는 필드는 hover/focus로 확인 가능 |
| 구현 안정성 | 현재 row 구조를 유지하면서 class 전환과 CSS로 반영 가능 |
| 확장성 | 우측 빈공간에 추후 보조 정보가 들어와도 좌측 row 규칙이 흔들리지 않음 |

## 후속 의사결정 필요 항목

| 항목 | 선택 필요 |
| --- | --- |
| 토글 명칭 | `라벨 보기`, `필드명 보기`, `상세 라벨 보기` 중 선택 |
| 라벨 표기 | 토글 OFF 기본 compact, 토글 ON 2행 라벨 모드 |
| 버튼 문구 | `입력`, `변경`, `연동`을 역할별로 고정할지 |
| 입력 전 안내문 | row 안에 짧게 둘지, 버튼만 남길지 |
| hover 임시 라벨 | 모든 필드에 적용할지, 의미가 헷갈리는 필드부터 적용할지 |
| 점선 구분선 | 섹션 내부 row 사이만 사용할지, 수정 가능 영역에도 사용할지 |
## 2026-06-08 Clean 확정 기능 반영

| 산출물 | 역할 |
| --- | --- |
| `06-clean-adoption-to-b-original.md` | Clean에서 검증한 입력전 placeholder, 라벨 보기, hover/focus, 말줄임 제거, 차주 Phase 2 규칙을 기존 B 통합안과 섹션별 문서/HTML에 반영하는 기준 |
| `07-clean-adoption-verification.md` | B Original 반영 후 브라우저 검증 결과와 자체 리뷰 기록 |
