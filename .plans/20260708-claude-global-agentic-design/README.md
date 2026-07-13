# Claude Code 전역 에이전틱 환경 — 구축 기획 문서 패키지

> 기획일: 2026-07-08 · 대상 PC: beck (Windows 11)
> 선행 분석: [하네스 분석 패키지](../20260708-harness-library-analysis/README.md) 특히 [08. Codex 전역 환경 비교](../20260708-harness-library-analysis/08-codex-global-comparison.md)

## 목표 한 문장

Codex 전역 환경(`~/.codex` + `~/.agents`)이 이미 갖춘 **"개인 능력의 계층·버전·진단 체계"를 Claude Code에도 구축**하되, 두 도구가 **같은 원본(canonical)을 공유**하게 하고, logishm 하네스의 원칙("강제는 프로젝트에")을 침해하지 않는다.

## 문서 맵

| 문서 | 내용 |
|---|---|
| [01-goals-requirements.md](./01-goals-requirements.md) | 목표/비목표 · Codex 대응표(파리티 목표) · 현재 상태 실측 |
| [02-architecture.md](./02-architecture.md) | 4계층 아키텍처 · 디렉터리 레이아웃 · 우선순위/충돌 규칙 · 하네스와의 역할 분담 |
| [03-components.md](./03-components.md) | 구성 요소별 상세 설계 — 전역 CLAUDE.md, 스킬, 커맨드, 에이전트, 훅, MCP, 메모리 |
| [04-plugin-distribution.md](./04-plugin-distribution.md) | 플러그인·마켓플레이스·버전·업데이트 설계 |
| [05-doctor-health.md](./05-doctor-health.md) | `agentic-health-check`의 Claude판 — 진단 항목·판정 기준·출력 설계 |
| [06-roadmap.md](./06-roadmap.md) | Phase 0~3 구축 로드맵 · 리스크와 충돌 정책 · 완료 판정 기준 |

> **용어 안내**: 낯선 용어는 [분석 패키지 용어집](../20260708-harness-library-analysis/07-glossary.md)을 먼저 보라. 이 패키지에서 추가로 쓰는 용어 — **frontmatter**(md 파일 머리의 `---`로 감싼 메타데이터 블록), **semver**(major.minor.patch 버전 규약), **user 스코프**(프로젝트가 아니라 사용자 홈 전체에 적용되는 설정 범위), **마켓플레이스**(플러그인 카탈로그 — 한 번 등록하면 설치·업데이트를 도구가 관리).

## 설계를 지배하는 4원칙 (요약)

1. **원본은 도구 중립, 도구 폴더는 파생물** — 개인 스킬의 canonical은 `~/.agents/skills/`(이미 존재, Codex와 공유). `~/.claude/`와 `~/.codex/`는 어댑터가 생성·동기화한다. (logishm 라이브러리 설계의 개인 버전)
2. **전역은 능력, 프로젝트는 강제** — 전역 계층에는 스킬·안내·안전 가드만. 품질 강제(TDD·레이어·게이트)는 지금처럼 프로젝트 하네스에 남긴다. 전역 차단 훅은 "안전(비밀값·파괴 명령)" 범주만 허용.
3. **버전 있는 배포** — 파일 복사가 아니라 플러그인(마켓플레이스) 구독으로. add-only 복사의 업데이트 전파 문제를 원천 회피.
4. **측정·진단 내장** — 설치가 아니라 운영이 절반. `/beck-kit:doctor-agentic` 헬스체크와 계측(probe)을 처음부터 포함.

## 현재 상태 (2026-07-08 실측)

| 항목 | 상태 |
|---|---|
| `~/.claude/skills` `commands` `agents` | **폴더 미존재 (생성 필요)** — 그린필드 |
| `~/.claude/CLAUDE.md` (전역 지침) | **없음** |
| `~/.claude/settings.json` | UI 설정 몇 개뿐(~124B) — 훅·권한·에이전트 설정 전무 |
| 플러그인 | 설치 0개 (official 마켓만 등록됨) |
| `~/.agents/skills` | **24개 존재** (Codex용으로 구축된 도구 중립 자산 — 재활용 대상) |
| `~/.codex` 전역 | 완성 상태 (스킬 66·커맨드 42·훅 14·에이전트 21·플러그인 10) |
| 프로젝트 계층 | logishm 하네스 설치됨 (Design 레포, mm-broker) |

→ **Claude 쪽은 빈 땅이고, 참조 구현(Codex)과 공유 자산(~/.agents)이 옆에 있다.** 베끼면서 더 낫게 만들 수 있는 최적 조건.
