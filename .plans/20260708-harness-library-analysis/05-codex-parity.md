# 05. 멀티 도구 파리티 — Claude와 Codex를 동일하게

## 1. 가능해진 근거

Codex가 Claude Code와 **같은 훅 스키마**를 지원한다: `hooks.json` 포맷, PreToolUse/PostToolUse/UserPromptSubmit 이벤트, exit 2 차단, `additionalContext` 주입, stdin 필드(`tool_name`/`tool_input`) 동일. 그래서 훅 배선을 거의 그대로 옮길 수 있었고, `.claude/hooks/*.js` 스크립트 자체는 **양쪽이 공유**한다.

## 2. 그러나 그대로는 안 되는 지점 — apply_patch 문제

결정적 차이 하나: Codex의 편집 도구 `apply_patch`는 `tool_input.command`(패치 텍스트)만 주고 **`file_path`가 없다.** 그래서 file_path를 읽는 mm-broker 훅들(layer-violation-checker, tdd-guard)은 Codex에서 조용히 no-op이 된다.

해법 = **`codex-rules-guard.mjs`**: 패치 텍스트를 직접 파싱해(`*** Add/Update File:` 마커 + `+` 줄) 파일 경로와 추가 내용을 복원한 뒤, **같은 rules.json**으로 판정하고 위반이면 deny로 차단한다. requireTest 판정 시 "이번 패치 안에 테스트 파일이 같이 있는가"까지 본다(패치 단위 TDD 허용).

> 교훈: 멀티 도구 파리티는 "설정 복사"가 아니라 **"도구별 입력 형태 차이를 흡수하는 어댑터 + 공유 규칙 데이터"** 조합으로 달성된다.

## 3. 포팅 대응표

| Claude 쪽 | Codex 쪽 | 방식 |
|---|---|---|
| `.claude/settings.json` hooks 배선 | `.codex/hooks.json` | gen-codex-adapter가 복사 + 가드 추가 |
| layer-violation-checker / tdd-guard (강제) | `codex-rules-guard.mjs` | 패치 파싱 재구현, rules.json 공유 |
| guide-loader (편집 파일→스킬 자동 주입) | `codex-skill-loader.mjs` | skill-rules.json의 fileTriggers 공유, additionalContext로 주입 |
| skill-activator (프롬프트 키워드→스킬 안내) | `codex-skill-activator.mjs` | promptTriggers 공유 |
| qa-knowledge-activator (QA 지식 주입) | `codex-qa-knowledge.mjs` | knowledge/ 공유 |
| 슬래시 커맨드 `/commit` 등 27개 | `.codex/prompts/` → `/prompts:commit` | 파일 그대로 복사 |
| `.mcp.json` (playwright MCP) | `.codex/config.toml` | JSON→TOML 번역 |
| CLAUDE.md 프로젝트 규칙 | AGENTS.md에 본문 인라인 | Codex는 AGENTS.md 네이티브 인식 |
| harness-probe 계측 | 동일 파일 재사용 (`harness-probe.cjs codex`) | 인자만 다름 |

미포팅으로 남긴 것(advisory 성격): 턴종료 build-checker(git 게이트의 tsc가 커버), solid-reviewer, complexity-reminder. "핵심 개발 루프는 동등"이라고 선을 그었다.

원본 CODEX-setup.md "알려진 차이"의 실무 함정 2건도 유의해야 한다: ① **프롬프트 홈 경로 폴백** — Codex 버전에 따라 슬래시 프롬프트를 프로젝트 `.codex/prompts/`가 아닌 홈 `~/.codex/prompts/`에서만 읽을 수 있어, `/prompts:*`가 안 뜨면 27개 파일을 홈으로 복사해야 한다(원본에도 미검증 항목으로 표시). ② **MCP 도구명 매처** — qa-knowledge-activator의 `mcp__playwright__*` 매처는 Codex의 MCP 도구 명명이 다르면 그 매처만 조정해야 한다.

## 4. 실측 검증 기록 (Codex 0.141, 2026-06-22)

- service 파일에 `drizzle-orm` import 시도 → **편집 시점 차단**, 파일 미생성, Codex가 사유 설명까지.
- 테스트 없이 프로덕션 파일만 추가 시도 → **차단** ("테스트를 먼저 작성한 뒤…"). 자연스러운 요청에선 Codex가 스스로 테스트 먼저 작성.
- 발사 조건 3가지 (실측): ① 프로젝트 trust (신뢰 안 하면 `.codex/` 통째 무시) ② 훅 정의에 `type="command"` ③ 자동화 실행 시 stdin 닫기.
- 이 검증에서 버그도 발견·수정: `--enforce`의 약한 기본 rules.json이 프로젝트 규칙을 가림 → `--project`가 번들 rules.json을 enforce/로 승격하도록 수정.

## 5. "100% 파리티"의 정직한 답 (PARITY.md의 결론)

결정 변수 3개 — ① 같은 도구인가 ② 같은 프로젝트인가 ③ 개인 상태인가:

| 조합 | 파리티 |
|---|---|
| Claude + mm-broker | **100%** (전부 파일이라 그대로 복제) |
| Codex + mm-broker | 대부분 (차단 실측 검증됨; 셸 차단은 부분적 → git 게이트가 백업) |
| 다른 프로젝트 | 프로젝트 전용 규칙은 경로가 안 맞아 **논리적으로 불가** (기술 한계 아님) |
| 개인 메모리·시크릿·모델 티어 | **불가/공유 금지** |

"결과(AI 출력)가 아니라 **하네스·규칙·강제**가 동일하다"는 것 — 출력은 모델·메모리·비결정성으로 달라진다는 한계까지 명시돼 있다.
