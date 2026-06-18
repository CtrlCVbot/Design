# claude-design-v2 — 디자인 고도화 핸드오프 패키지

`sections/`의 섹션별 기획(cargo-list 제외)과 구현 결과물 `Cargo Order B Implementation Clean.html`을
**재취합·정리**한 패키지입니다. 클로드 디자인(claude.ai/design)에서 **정리 → 디자인 고도화**를 진행하기 위한 입력 묶음입니다.

> 기존 문서(`../01~06`, `../sections/`)는 **보존**합니다. 1차(전체 화면) 핸드오프는 `../_archive/legacy-prompts/claude-design-v1/`에 보관하고, 이번(섹션 재취합 + 고도화) 핸드오프는 이 폴더입니다.

## 구성

| 문서 | 역할 |
| --- | --- |
| [00-overview.md](00-overview.md) | 통합 개요 — 화면 정의, 섹션 순서·확정 결정, 구현 현황, 범위 |
| [01-section-digest.md](01-section-digest.md) | 5개 섹션 정제 요약 — 필드·상태·인터랙션·보존 규칙 |
| [02-design-context.md](02-design-context.md) | 현재 토큰 현황 + 고도화 방향 + 컴포넌트 가이드 + 보존 규칙 |
| [03-open-issues.md](03-open-issues.md) | 미결정·리스크 통합(임의 확정 금지 목록) |
| [04-layout-correction-points.md](04-layout-correction-points.md) | Planned.html ↔ 원본 구현 섹션별 배치 차이·교정 포인트 |
| [05-section5-driver-fidelity-and-section3-labels.md](05-section5-driver-fidelity-and-section3-labels.md) | 섹션5 차주 원본 정밀 일치(15개) + 섹션3 라벨 중첩 정리 |
| (프롬프트 01~08) | 개별 `prompts/` 파일은 [PROMPT-LOG.md](PROMPT-LOG.md)로 통합·삭제됨 — 붙여넣기 전문은 로그 참조 |
| [review-checklist.md](review-checklist.md) | 결과 검수 체크리스트 |
| [PROMPT-LOG.md](PROMPT-LOG.md) | **프롬프트 실행 로그** — 최종 결과물 도출에 쓴 01~08 프롬프트 전문 취합(실행 순서·재현용) |

## 사용 순서

1. **읽기**: `00` → `01` → `02` → `03` 순으로 맥락 파악.
2. **클로드 디자인 1단계(정리)**:
   - claude.ai/design 새 작업 시작
   - `../results/wireframe/order-register-new2.0/Cargo Order B Implementation Clean.html` 첨부 + `../assets/source-full.png` 첨부
   - `PROMPT-LOG.md`의 Step 1 붙여넣기 블록 실행 → 토큰·공통 컴포넌트 기반 확보
3. **클로드 디자인 2단계(고도화)**:
   - `PROMPT-LOG.md`의 Step 7(고도화) 붙여넣기 → High Fidelity 화면 생성
4. **검수**: `review-checklist.md`로 보존·고도화·미결정 처리 점검. 결과 URL·피드백 기록.
5. **교정(필요 시)**: 결과가 기획 레이아웃에서 벗어나거나 다이얼로그가 작동하지 않으면
   `PROMPT-LOG.md`의 Step 2로 세로 1열 스택 복원 + 다이얼로그 작동 + **비교용 신규 파일**을 요청.
   (기존 결과물은 삭제하지 않고 새 파일로 추가)

## 한 줄 핵심

> 업무 로직·필드·상태·인터랙션은 **100% 보존**, 시각 디자인 시스템·컴포넌트 일관성은 **전문 업무용 UI로 고도화**.
> 와이어프레임의 종이/손글씨 톤은 버리고, 차분한 고밀도 데스크톱 업무 화면으로.
