# 01. 목표·요구사항 — 무엇을 만들고, 무엇을 만들지 않나

## 1. 목표 (Goals)

| # | 목표 | 성공 판정 |
|---|---|---|
| G1 | **전역 능력 계층** — 어느 폴더에서 Claude Code를 열어도 개인 스킬·커맨드·에이전트가 즉시 사용 가능 | 새 빈 폴더에서 `/beck-kit:wrap`, 스킬 자동발동, 리뷰 에이전트가 동작 |
| G2 | **Codex와 원본 공유** — 같은 스킬을 두 도구가 이중 관리 없이 사용 | canonical 스킬 1곳 수정 → Codex는 즉시 반영(직접 로드), Claude는 kit-release 1회로 반영 |
| G3 | **버전 있는 배포** — 회사 지침·개인 키트를 플러그인으로 구독, 업데이트가 전파됨 | `/plugin` 업데이트 한 번으로 전 프로젝트 갱신 |
| G4 | **자가 진단** — 전역 환경 상태를 한 명령으로 pass/fail 확인 | `/beck-kit:doctor-agentic` 실행 시 Codex health-check 동등 표 출력 |
| G5 | **안전 전역 가드** — **도구 입력·파일 쓰기 단계**의 비밀값과 파괴적 명령을 어떤 프로젝트에서든 차단 (채팅 응답 본문 유출은 훅 제약상 범위 밖 — 03 §5 잔여 리스크) | 미하네스 폴더에서 파괴 명령 fixture가 deny되고, 비밀값 포함 도구 입력이 차단됨 |
| G6 | **하네스 무간섭** — 기존 프로젝트 하네스(logishm)와 충돌 0 | mm-broker·Design 레포에서 기존 훅·게이트 동작 불변 |

## 2. 비목표 (Non-Goals) — 명시적으로 하지 않는 것

- **품질 강제의 전역화 금지** — TDD 가드·레이어 규칙·커밋 게이트를 전역 훅으로 걸지 않는다. 남의 레포·실험 폴더에서 오작동하고, "레포만 clone하면 같은 강제"라는 하네스 재현성을 깨기 때문. ([하네스 분석 08](../20260708-harness-library-analysis/08-codex-global-comparison.md) §5 결론 유지)
- **팀 배포는 이 기획의 범위 밖** — 이것은 beck PC의 개인 전역 환경 기획이다. 팀 배포는 logishm 라이브러리(프로젝트 계층)와 마켓플레이스(플러그인 계층)가 담당.
- **Codex 전역 환경 개조 금지** — `~/.codex`는 읽기 참조만. 이 기획으로 Codex 쪽 동작이 바뀌면 안 된다. 단 `~/.agents`(도구 중립 계층)에의 추가는 허용 — 원래 그 용도다.
- **비밀값·개인 메모리의 공유 채널화 금지** — 전역 계층에도 계정·토큰을 파일로 두지 않는다 (.env·자격 증명 관리자 유지).

## 3. Codex 전역 기능 → Claude Code 대응표 (파리티 목표)

Codex 인벤토리 문서의 각 기능을 Claude Code의 네이티브 수단으로 매핑한다. **Claude Code는 모든 항목에 네이티브 대응물이 있다** — 즉 이 기획은 새 메커니즘 발명이 아니라 배치 설계다.

| Codex 전역 기능 | Claude Code 대응 수단 | 파리티 | 비고 |
|---|---|---|---|
| `~/.codex/AGENTS.md` (전역 지침 92줄) | `~/.claude/CLAUDE.md` (전역 메모리 — 모든 프로젝트에 로드) | ◎ 동일 개념 | core-sized 유지 원칙 승계 ([03 §1](./03-components.md)) |
| `~/.codex/config.toml` | `~/.claude/settings.json` (+ `~/.claude.json`의 user-scope MCP) | ◎ | 훅·권한·env 포함 |
| `~/.agents/skills` (도구 중립 24개) | **그대로 공유** + `~/.claude/skills/`로 어댑트 | ◎ | G2의 핵심 — 이중 관리 금지 |
| `~/.codex/skills` (개인 10개) | `~/.claude/skills/<이름>/SKILL.md` | ◎ | 개인 유틸 스킬 |
| commands 42개 | `~/.claude/commands/*.md` → `/이름` (user 스코프) | ◎ | |
| claude-kit `agents/` 21개 (서브에이전트) | `~/.claude/agents/*.md` (개인 서브에이전트) | ◎ | Claude가 원조 — frontmatter(name/description/tools/model) |
| claude-kit `hooks.json` 14개 | beck-kit 플러그인 hooks (Phase 0에만 settings.json 임시 배선 → Phase 2 이관) | ◎ | 단, **안전 범주만 전역 배선** (§2 비목표) |
| 플러그인 + 버전 캐시 + 마켓플레이스 | `/plugin marketplace add` + `~/.claude/plugins/` | ◎ | logishm 마켓(.claude-plugin/marketplace.json)이 이미 존재 |
| `claude-reviewer` (교차 AI 리뷰 MCP) | 역방향: **Codex를 MCP/CLI로 감싸 Claude 안에서 교차 리뷰** | ○ 응용 | Phase 3 선택 항목 |
| memories (MEMORY.md + rollout 요약) | `~/.claude/projects/<슬러그>/memory/` (자동 메모리, 이미 동작 중) | ◎ | 규약 표준화만 필요 |
| session index / archived_sessions | `~/.claude/projects/` 세션 기록 + `history.jsonl` | ○ | 네이티브 존재, 별도 설계 불요 |
| `agentic-health-check` 스킬 | **신규 제작** `/beck-kit:doctor-agentic` 스킬+스크립트 | ● 제작 필요 | [05](./05-doctor-health.md) |
| hook trust 추적 (7/7 current) | 신뢰 개념이 다름(설치 시 승인) → doctor가 **훅 스크립트 존재·해시 변경 감지**로 대체 | ○ 대체 | |

◎ 네이티브 1:1 / ○ 유사 대응 / ● 신규 제작

## 4. 요구사항 정리

### 기능 요구사항

- R1. 전역 CLAUDE.md는 **150줄 이하**를 유지하며(코어 지침만), 상세는 스킬로 위임한다. doctor가 크기를 감시한다.
- R2. `~/.agents/skills`의 canonical 스킬 중 Claude에 유효한 것을 선별 어댑트한다 (전량 복사 금지 — Codex 전용 스킬 존재).
- R3. 개인 키트는 **로컬 플러그인**(`beck-kit`)으로 패키징해 버전을 갖는다. 직접 `~/.claude/skills`에 두는 것은 실험 단계의 스킬만.
- R4. 전역 훅은 화이트리스트 방식으로 설계한다: 계측(probe)·안전 가드(secrets/파괴 명령)·메모리 보조만. 각 훅은 **"모르는 프로젝트에서 실행돼도 무해한가"** 심사를 통과해야 한다.
- R5. doctor는 전역 계층뿐 아니라 **현재 프로젝트의 하네스 상태**(게이트 우회 여부 포함)도 진단한다 — 하네스 분석에서 도출된 요구 ([08 §3-③](../20260708-harness-library-analysis/08-codex-global-comparison.md)).
- R6. 모든 구성물은 **멱등 설치 스크립트**로 재구축 가능해야 한다 (PC 교체·초기화 대비). 설치 스크립트와 자산은 git 레포로 관리.

### 비기능 요구사항

- N1. **성능**: 전역 훅은 훅당 200ms, 이벤트당 합산 400ms 이내 (근거: Windows node 콜드 스타트 ~100ms + 파싱·검사 여유분. 같은 이벤트에 매칭된 훅들은 병렬 실행되므로 합산은 최장 훅 기준). **예산은 측정 장치와 함께여야 유효하다** — probe가 훅 실행 시간(duration)을 기록하고 doctor가 p95를 검사한다.
- N2. **가역성**: 어떤 단계든 파일 삭제/플러그인 제거로 원상복구 가능. 레지스트리·시스템 설정 변경 없음.
- N3. **투명성**: 전역 계층이 주입하는 모든 것은 doctor 출력에서 열거 가능해야 한다 ("보이지 않는 마법 금지").
- N4. **Windows 안전**: 경로 공백·한글·CRLF·인코딩(UTF-8 BOM) 이슈를 스크립트가 처리 (기존 `windows-encoding-safe` 스킬 규약 준수).
