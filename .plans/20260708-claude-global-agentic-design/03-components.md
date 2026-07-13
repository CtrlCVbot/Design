# 03. 구성 요소별 상세 설계

## 1. 전역 CLAUDE.md (`~/.claude/CLAUDE.md`) — 신규 작성

Codex 전역 AGENTS.md(92줄, "core-sized")의 대응물. **모든 프로젝트의 모든 세션에 로드되므로 가장 비싼 부동산**이다 — 다음 편성 원칙을 지킨다:

- **넣는 것** (코어만, 목표 ≤150줄):
  - 정체성·언어: "사용자는 한국어 사용, 보고는 한국어로" 등 커뮤니케이션 규약
  - 안전 상수: 파괴적 명령 전 확인, 비밀값 코드 금지, main 직접 push 금지 (프로젝트 하네스가 없는 폴더에서의 기본 안전선)
  - 환경 상수: Windows/PowerShell 주의점, 인코딩(UTF-8, CRLF), 자주 쓰는 경로 규약
  - 위임 포인터: "세션 마무리는 `/beck-kit:wrap`", "검증은 verification-engine 스킬" 식으로 상세를 스킬로 위임
- **안 넣는 것**: 프로젝트별로 달라지는 규칙(커밋 형식·TDD — L3 담당), 장문 방법론(스킬로), 비밀값·계정
- **감시**: doctor가 줄 수(≤150)와 프로젝트 규칙 침범 키워드를 검사

## 2. 스킬 (skills)

### 2-1. canonical 24개의 선별 어댑트 (L0 → L1/beck-kit)

`~/.agents/skills` 실측 목록을 3분류로 처리:

| 분류 | 대상 (실측 이름 기준) | 처리 |
|---|---|---|
| **A. 즉시 어댑트** — 도구 무관 방법론 | verification-engine, verify-implementation, review-feedback-loop, methodology-router, reporting-style, session-wrap, strategic-compact, windows-encoding-safe, html-fidelity-reproduction, verify-html-fidelity, frontend-code-review, security-pipeline, eval-harness, build-system, continuous-learning-v2 | beck-kit `skills/`에 포함. frontmatter(name/description) 보정, Codex 고유 표현(도구명·경로) 치환 |
| **B. 재작성 어댑트** — 개념은 유효하나 도구 종속 | agentic-health-check (Codex 경로 하드코딩), manage-skills, skill-factory, hook-scope-policy, using-superpowers, prompts-chat | Claude 대응 경로·메커니즘으로 본문 재작성 — health-check는 [05](./05-doctor-health.md)의 신규 스킬로 대체 |
| **C. 제외** — Codex 전용/중복 | cc-dev-agent(Claude를 부르는 스킬 — Claude 안에선 무의미), cache-components, team-orchestrator(Codex 오케스트레이션 전제) | 어댑트하지 않음. 목록만 doctor 인벤토리에 기록 |

> 정확한 A/B/C 배정은 Phase 1에서 각 SKILL.md를 열어 확정한다 (이 표는 이름 기반 1차 분류).

### 2-2. Codex 개인 스킬 10개의 이식

`~/.codex/skills`의 playwright, playwright-interactive, screenshot, figma, sentry, vercel-deploy, gh-fix-ci, doc, frontend-skill, claude-reviewer 중 — Claude Code에는 네이티브 대응(Claude in Chrome, playwright MCP, 스크린샷 도구)이 있는 것이 많다. **기능 중복이면 이식하지 않고**, 절차 지식이 담긴 것(vercel-deploy, gh-fix-ci, sentry)만 canonical로 승격 후 공유.

### 2-3. 신규 스킬 (이 기획에서 제작)

| 스킬 | 역할 |
|---|---|
| `doctor-agentic` | 전역+프로젝트 에이전틱 환경 진단 ([05](./05-doctor-health.md)) |
| `memory-conventions` | 자동 메모리 작성 규약 (§7) — 무엇을 저장/삭제하나 |
| `kit-release` | beck-kit 버전 올리기·sync·플러그인 갱신 절차 |

## 3. 커맨드 (commands)

claude-kit 커맨드 38개는 **dev-* 21 · plan-* 10 · copy-* 7** 구성이다. 최다 계열인 dev-*(dev-commit, dev-review, dev-verify 등)는 logishm 하네스의 프로젝트 커맨드(/commit, /verify 등)와 역할이 겹치므로 전역 도입에서 제외하고, 기획(plan-*)·카피(copy-*) 17개를 2차 검토 대상으로 한다:

- **1차 도입 (개인 워크플로우 커맨드)**: `/beck-kit:wrap`(session-wrap 스킬 호출), `/beck-kit:doctor-agentic`, `/beck-kit:kit-release`, `/beck-kit:learn`(continuous-learning 트리거)
- **2차 검토 (기획 파이프라인)**: plan-draft → plan-prd → plan-wireframe → plan-review 계열 — 단, **이 Design 레포의 L3(프로젝트 커맨드)로 넣는 것이 우선 검토안**이다. 기획 파이프라인은 `.plans/` 구조라는 프로젝트 규약에 묶이기 때문 ("규칙은 코드와 함께" 원칙). 전역에는 프로젝트 무관 부분만.

### 네이밍 정책 (확정)

**플러그인 커맨드는 네임스페이스 형태 `/beck-kit:<이름>`가 정식 호출**이다 — Claude Code는 플러그인 제공 커맨드에 플러그인명 접두사를 붙이므로, 짧은 `/wrap`은 플러그인화(Phase 2) 후 성립하지 않는다. 따라서 이 패키지 전체에서 커맨드 표기는 `/beck-kit:...` 기준으로 통일한다(01 G1·G4, 03, 05, 06 DoD 포함).

- **짧은 alias는 옵션이며 조건부다**: `~/.claude/commands/<이름>.md`에 얇은 셔틀을 두면 짧은 `/이름` 호출이 가능하지만, ① **하네스 프로젝트 커맨드와 이름이 겹치는 것(`/wrap` 등)에는 만들지 않는다** — 실측상 logishm 하네스가 모든 설치 레포에 `/wrap`을 깔아 충돌하기 때문. ② alias를 두면 doctor가 "의도된 alias 목록"과 대조해, 목록에 없는 중복만 경고한다(A4·A5). 초기(Phase 1~2)에는 alias 없이 네임스페이스 형태만 쓰고, 필요가 확인되면 비충돌 이름에 한해 추가한다.

## 4. 서브에이전트 (agents) — `~/.claude/agents/*.md`

claude-kit agents 21개에서 역수입할 가치가 높은 것부터. Claude Code 네이티브 형식(frontmatter: name, description, tools, model):

| 에이전트 | 용도 | 모델 제안 |
|---|---|---|
| `code-reviewer` | diff 리뷰 (읽기 전용 도구만) | 상위 모델 |
| `security-reviewer` | 비밀값·인젝션·권한 관점 리뷰 | 상위 모델 |
| `verify-agent` | 구현 후 실동작 검증 (verification-engine 스킬 연계) | 기본 |
| `doc-updater` | 작업 후 문서 갱신 (쓰기 허용) | 경량 |
| `design-qa` | HTML 산출물 ↔ 레퍼런스 정합 검증 (이 PC의 디자인 작업 특화, html-fidelity 스킬 연계) | 기본 |

설계 규칙: 에이전트는 **역할(페르소나)+도구 제한**만 정의하고, 방법론은 스킬을 참조하게 한다 (중복 서술 금지). 결정적 게이트(claude-kit의 plan-dev-gate.js 같은 것)는 에이전트가 아니라 **훅/스크립트**로 — Claude에선 커맨드 md 안에서 절차 강제로 표현.

## 5. 전역 훅 (beck-kit 플러그인 hooks가 최종 배선처 — Phase 0에만 settings.json 임시 배선)

**화이트리스트 3종만** 배선한다 (R4 심사 통과 항목). 모두 "모르는 프로젝트에서 실행돼도 무해" 조건 충족:

| 훅 | 이벤트 | 동작 | Codex 대응물 |
|---|---|---|---|
| `global-secret-filter.js` | PreToolUse (Bash·PowerShell·Write·Edit) | 도구 입력에 비밀값 패턴(하네스 게이트의 5종 패턴 재사용) 감지 시 **차단+사유**. 주의: 원본과 달리 **입력 시점** 검사다 — 채팅 응답 본문으로 새는 경로는 훅 이벤트 제약상 미커버(의도적 범위 축소, 잔여 리스크로 인지) | output-secret-filter |
| `global-danger-guard.js` | PreToolUse (**Bash·PowerShell 등 셸 도구 전체** — Bash 전용 매처면 주력 셸인 PS에서 무력) | 파괴 패턴 감지 시 차단(사용자 승인 유도). 패턴 목록은 아래 부록이 명세 | dev-db-guard |
| `global-probe.js` | PostToolUse (전체) | `~/.claude-global-metrics.jsonl`(홈)에 도구 사용·스킬 참조 + **훅 실행 시간(duration)** 기록 — 비차단, doctor의 p95 검사 원료 | harness-probe |

**danger-guard 차단 패턴 부록 (구현 시 이 목록이 명세다 — Windows가 주력이므로 PS/cmd 변형 포함):**

- git: `push --force`/`-f`, `reset --hard`, `clean -fd*`, 원격 브랜치 강제 삭제
- Unix: `rm -rf`, `chmod -R 777`
- PowerShell/cmd: `Remove-Item -Recurse -Force`, `rd /s /q`, `del /f /s`, `Format-Volume` 등 포맷 계열
- DB: `DROP TABLE|DATABASE`, `TRUNCATE`

**검증 원칙 (안전)**: danger-guard·secret-filter 테스트는 **가드 스크립트에 mock 훅 입력(위 패턴을 `tool_input`에 담은 JSON)을 stdin으로 주입해 deny 판정만 확인**한다. 실제 파괴 명령을 실행해 "차단되는지 보는" 방식은 금지 — 아직 검증 안 된 가드가 통과시키면 그 명령이 그대로 실행되기 때문이다. 부수 검증(throwaway repo + dummy remote)이 필요하면 격리된 임시 fixture에서만.

배선 원칙:
- 각 훅 200ms 이내(N1), stdin JSON 파싱 실패 시 allow(fail-open — 전역 훅이 도구를 못 쓰게 만드는 사고 방지). **fail-open의 정당화는 훅별로 다르다**: `secret-filter`는 L3 게이트가 커밋 시점에 비밀값을 재검사하므로 "최종 방어선은 L3" 층위 논리가 성립한다. 그러나 `danger-guard`는 뒤를 받치는 층이 없다 — 파괴 명령은 커밋 게이트가 구조적으로 다루지 못하고, G5의 대상인 미하네스 폴더엔 L3 자체가 없다. 따라서 danger-guard는 fail-open을 유지하되(도구 마비 방지가 우선) **파싱 실패를 probe에 기록하고 doctor가 반복 실패를 fail로 승격**시킨다 — 최소한 "조용한 무력화"는 막는다.
- 프로젝트 훅과 중복 실행됨을 가정 (하네스 게이트도 비밀값 검사 — 이중 검사는 무해).
- claude-kit의 품질류 훅(no-duplication-guard, code-quality-reminder, tdd-guard)은 **전역 배선 금지** — 비목표 §2.

## 6. MCP (user 스코프)

- 전역 등록 후보: playwright(브라우저 QA — 여러 프로젝트에서 사용 중), 필요 시 figma. `claude mcp add --scope user`로 등록해 `~/.claude.json`에 저장.
- 프로젝트 `.mcp.json`과 같은 서버명이면 프로젝트가 우선 — 하네스가 까는 playwright와 충돌하지 않도록 **같은 서버명·같은 커맨드**로 통일 (사실상 동일 설정의 이중 등록 → 무해).
- 교차 리뷰(claude-reviewer의 역방향, Codex를 Claude 안에서 호출)는 Phase 3 선택 — `codex exec`를 감싸는 커맨드/스킬로 충분할 수 있어 MCP 서버 제작은 보류.

## 7. 메모리 규약

Claude Code의 자동 메모리(`~/.claude/projects/<슬러그>/memory/`)는 이미 동작 중 (이 세션도 사용). 신규 제작 없이 **규약만 표준화**:

- `memory-conventions` 스킬: 저장 기준(반복될 사실만)·형식(frontmatter type: user/feedback/project/reference)·삭제 기준(틀린 것 즉시)·프로젝트 간 승격(개인 공통 사실은 전역 CLAUDE.md로) 절차.
- Codex의 rollout_summaries 대응: `/beck-kit:wrap` 커맨드가 세션 요약을 프로젝트 메모리에 남기는 단계 포함 (별도 시스템 불요).
- doctor 검사: 메모리 인덱스(MEMORY.md)와 실제 파일 목록의 정합.
