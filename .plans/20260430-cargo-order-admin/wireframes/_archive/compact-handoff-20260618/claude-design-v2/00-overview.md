# 00. 통합 개요 — Cargo Order B 디자인 고도화 핸드오프

> 이 패키지(`claude-design-v2/`)는 `sections/`의 섹션별 기획과 구현 결과물
> `Cargo Order B Implementation Clean.html`을 **재취합·정리**하여,
> 클로드 디자인(claude.ai/design)에서 **정리 → 디자인 고도화**를 진행하기 위한 입력 패키지입니다.
> 기존 메인 기획(`01~05`, `07~09`, `sections/`)은 보존하며, 1차 Claude Design 패키지와 루트 handoff 기록은 `_archive/legacy-prompts/claude-design-v1/`에 보관합니다. 이 폴더는 신규 정리물만 담습니다.

## 작업 목표

기존 구현물의 **업무 로직·필드·상태·인터랙션을 100% 보존**하면서,
시각 디자인 시스템과 컴포넌트 일관성을 한 단계 끌어올린다.
와이어프레임의 "종이/손글씨 스케치 톤"은 **저충실도 신호**였을 뿐 최종 목표가 아니다 →
고도화 목표는 **차분하고 고밀도인 전문 업무용 데스크톱 UI**(SaaS 랜딩/카드형 대시보드 아님).

## 화면 정의

| 항목 | 값 |
| --- | --- |
| SCR-ID | `SCR-CARGO-ORDER-001` |
| 화면명 | 화물 오더 접수/수정 관리 화면 |
| 핵심 사용자 | 화물 오더를 빠르게 접수·수정·배차·정산 처리하는 운영자 (고밀도 입력에 익숙) |
| 기준 결과물 | `../results/wireframe/order-register-new2.0/Cargo Order B Implementation Clean.html` (258KB) |
| 원본 캡처 | `../assets/source-full.png` |
| 1차 타깃 폭 | Desktop 1280px+ (현재 구현 max-width 1500px) |

## 섹션 구성 (B 통합본 확정 순서)

| # | 섹션 | 키 | 핵심 결정 | 범위 |
| --- | --- | --- | --- | --- |
| 1 | 화주 정보 | `shipper-info` | 한 줄 요약 row + 통합 조회 다이얼로그 + 버튼 흡수 전환(A안) | 포함 |
| 2 | 운송 구간 | `transport-route` | full-width, 상차/하차 세로 2행, D `compact-hybrid` (기존 5/6/7번 흡수) | 포함 |
| 3 | 화물 운송정보 | `cargo-transport` | F안 = `운송+품목` / `금액` 분리 구조 | 포함 |
| 4 | 화물정보 요약 | `cargo-summary-docs` | 3번에서 파생되는 한 줄 read-only 요약 | 포함 |
| 5 | 차주 정보 | `driver-info` | 내부 DB(Phase 1) / 화물맨 연동(Phase 2) 탭 구조 | 포함 |
| — | 화물 목록 | `cargo-list` | — | **제외 (이번 범위 밖)** |

> 섹션 1·5는 **동일한 "조회 다이얼로그 + 흡수 전환 + inline edit" 패턴**을 공유한다.
> 섹션 2의 주소 검색도 같은 다이얼로그 레이아웃을 재사용한다. → 컴포넌트화의 1순위 후보.

## 구현 현황 요약 (Implementation Clean.html)

**구현됨**: 5개 섹션 전체 수직 스택, CSS 변수 32종(`var()` 511회), 다이얼로그/팝오버 10종,
inline edit, 주소검색(화주 주소록 + Kakao 병합), 금액 자동계산, 라벨 보기 토글,
상태 표현(`is-empty`/`applied-editable`/`aria-live`), 반응형 분기(1180/720px) + `prefers-reduced-motion`.

**미구현 / 고도화 대상**:
- **어드민 셸 부재** — 페이지 헤더·네비·전역 액션바(등록/수정/취소)·하단 오더 목록이 없음. "입력 폼"만 떠 있음
- **이중 디자인 토큰 혼재** — `accent/ink` 계열과 `pen/paper/note` 계열이 섞여 명명 일관성 낮음
- **미사용 손글씨 폰트** — Gaegu/Caveat/Nanum을 로드만 하고 CSS 미적용(vestigial)
- **컴포넌트 비일관** — 동일 역할 버튼이 섹션별 4~5종 클래스로 중복 정의
- **시각 위계 부족** — 가시적 섹션 제목/번호 없이 `aria-label`만 의존, 5섹션 평면 나열
- **비표준 타입/스페이싱** — px 직접 지정(타입 10단계 산발, spacing 토큰 없음)

상세는 [02-design-context.md](02-design-context.md) 참조.

## 패키지 사용 순서

1. [00-overview.md](00-overview.md) — (이 문서) 전체 맥락
2. [01-section-digest.md](01-section-digest.md) — 5개 섹션 필드·상태·인터랙션 정제 요약
3. [02-design-context.md](02-design-context.md) — 현재 토큰 현황 + 고도화 방향 + 보존 규칙
4. [03-open-issues.md](03-open-issues.md) — 미결정·리스크 통합
5. [PROMPT-LOG.md](PROMPT-LOG.md) — 클로드 디자인 프롬프트 전문(Step 1~7 실행 순서, 01~08 통합 · prompts/는 이 로그로 통합·삭제)
7. [review-checklist.md](review-checklist.md) — 결과 검수 체크리스트

## 원본 기획 위치 (필요 시 역참조, 수정 금지)

- 섹션별 상세: `../sections/{shipper-info, transport-route, cargo-transport, cargo-summary-docs, driver-info}/`
- 1차 핸드오프 기록: `../_archive/legacy-prompts/claude-design-v1/06-claude-design-handoff.md`, `../_archive/legacy-prompts/claude-design-v1/`
- 현대화 브리프: `../04-modernization-brief.md`
