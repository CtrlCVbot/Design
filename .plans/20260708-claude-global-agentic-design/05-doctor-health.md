# 05. `/beck-kit:doctor-agentic` — 자가 진단 설계

Codex `agentic-health-check`의 Claude판이자 확장판. 스킬(절차) + 스크립트(`doctor.mjs`, 결정적 검사) 조합으로 구현한다 — 검사 자체는 스크립트가 수행해 재현성을 보장하고, 스킬은 결과 해석·수리 절차를 안내한다.

## 1. 출력 형식 (Codex 대응 + 확장)

```
━━━ Claude 전역 에이전틱 진단 (2026-07-08) ━━━
| 영역          | 상태 | 메모                                  |
| ------------- | ---- | ------------------------------------- |
| CLAUDE.md     | pass | 128 lines, core-sized                 |
| settings/훅   | pass | 전역 훅 3/3 스크립트 존재, 파싱 OK    |
| skills        | warn | L1·beck-kit 중복 1건: session-wrap    |
| commands      | pass | 7개, 충돌 없음                        |
| agents        | pass | 5개                                   |
| plugins       | pass | beck-kit 0.3.1 (마켓 최신), 회사 마켓 등록됨 |
| MCP           | pass | playwright 응답 OK                    |
| memory        | pass | 인덱스-파일 정합 (7/7)                |
| [프로젝트] 하네스 | fail | core.hooksPath 해제됨 — 게이트 우회 상태! |
```

## 2. 검사 항목 명세

### A. 전역 계층 (어디서 실행해도 동일)

| # | 검사 | pass 조건 | fail 시 안내 |
|---|---|---|---|
| A1 | 전역 CLAUDE.md | 존재 + ≤150줄 + 프로젝트 규칙 침범 키워드 없음(커밋 형식·TDD 등) | 초과분을 스킬로 위임하는 절차 링크 |
| A2 | 훅 배선 | settings.json 파싱 OK + 활성 플러그인 hooks.json 배선이 가리키는 스크립트 전부 존재. **동일 훅의 settings.json·플러그인 이중 배선은 warn** (Phase 0 임시 배선 잔재 감지) | 끊어진/중복 배선 목록 |
| A3 | 훅 무결성 | 훅 스크립트 해시가 beck-kit `manifest.sha256`과 일치 (Codex "hook trust current" 대체) | 변조/수동 수정 감지 → kit-release 재실행 안내 |
| A4 | 스킬 중복 | L1·L2·활성 플러그인 간 같은 name 없음, description 유사 쌍 경고 | 승격 규칙(02 §5) 안내 |
| A5 | 커맨드 충돌 | user/plugin 커맨드 이름 충돌 없음 | 이름 변경 안내 |
| A6 | 플러그인 신선도 | 설치 버전 == 마켓 최신 (로컬 마켓은 plugin.json 대조) | `/plugin` 업데이트 안내 |
| A7 | MCP 응답 | user 스코프 서버 기동 확인 | 재설치 명령 |
| A8 | 메모리 정합 | MEMORY.md 인덱스 항목 ↔ 실제 파일 1:1 | 고아 항목/파일 목록 |
| A9 | 계측 동작 | `~/.claude-global-metrics.jsonl` 최근 기록 존재 (probe 살아있음) | 훅 배선 점검 |
| A10 | 훅 지연 | probe가 기록한 훅 실행 시간 p95 ≤ 200ms, 이벤트 합산 ≤ 400ms (N1) — 리스크 표의 "느려짐" 완화책이 실제로 측정되는 유일한 지점 | 초과 훅 목록 + 원인 힌트 |
| A11 | 가드 파싱 실패 누적 | danger-guard/secret-filter의 fail-open(파싱 실패 allow) 기록이 반복되면 fail 승격 — "조용한 무력화" 감지 (03 §5) | 실패 로그 + 재설치 안내 |

### B. 프로젝트 계층 (cwd가 하네스 설치 레포일 때 — 하네스 분석 08 §3-③ 요구 반영)

| # | 검사 | pass 조건 |
|---|---|---|
| B1 | **게이트 우회 감지** | `git config core.hooksPath == .githooks` && `.githooks/pre-commit` 존재 — **해제됐으면 fail (최우선 경고)** |
| B2 | rules.json | 존재 + 파싱 OK + 규칙 수 ≥ 1 |
| B3 | 하네스 버전 | AGENTS.md 버전 스탬프 vs 라이브러리 클론(`C:\Work\Dev\logishm-dev-guidelines`) HEAD — 뒤처지면 warn + 재설치 명령 |
| B4 | 훅 배선 | .claude/settings.json의 훅 스크립트 존재 |
| B5 | 전역-프로젝트 경합 | 프로젝트 스킬/커맨드와 전역·플러그인의 이름 충돌 목록 |

## 3. 판정 규칙

- **fail** = 동작이 깨졌거나(B1 우회, A2 끊어진 배선) 안전이 훼손된 상태 → 최상단에 굵게, 수리 명령 1줄 제시
- **warn** = 동작하지만 최적 아님 (중복, 버전 뒤처짐)
- 종료 코드: fail 있으면 1 (CI·스케줄 실행에서 활용 가능)
- 원칙 N3(투명성): "전역 계층이 현재 세션에 주입하는 모든 것"(지침 줄 수, 훅, 스킬, 커맨드, 에이전트, MCP)을 `--inventory` 옵션으로 전체 열거

## 4. 실행 채널

- `/beck-kit:doctor-agentic` — 대화 중 수시 (커맨드가 `${CLAUDE_PLUGIN_ROOT}/scripts/doctor.mjs`를 실행 후 해석)
- `node ~/.agents/plugins/beck-kit/scripts/doctor.mjs` — 셸에서 직접 (CI/작업 스케줄러 등록 가능. 플러그인 캐시 경로는 버전마다 바뀌므로 자동화는 레포 경로 기준으로)
- (선택) 주 1회 자동 실행 + fail 시 알림 — Phase 3
