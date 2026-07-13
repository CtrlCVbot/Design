# 17. Advisor/Worker·프로젝트 하네스·전역 기능 호환성 감사

- 작성일: 2026-07-10
- 대상 repo: `C:\Work\Dev\Optics\apps\mm-broker`
- 대상 branch: `feat/nbbb1-broker-order-console-new-ui-prototype`
- 감사 모드: review-only
- 최종 판정: **조건부 호환 — P0 hook preflight 후 진행 가능**

## 1. 결론

Advisor/Worker 구조와 mm-broker 하네스 사이에 직접적인 구조 충돌은 없다. 현재 설정은 Advisor 1개 + `implementation_worker` 1개를 수용하고, Worker의 child agent 생성 금지와 프로젝트의 TDD·검증 절차도 같은 방향이다.

다만 현재 세션에서는 mm-broker의 `.codex/hooks.json`이 실제로 발사된 증거가 없다. 프로젝트 Codex hook trust 항목도 전역 `config.toml`에서 확인되지 않았다. 따라서 hook이 보호해줄 것이라고 가정하지 말고, 새 구현 세션의 첫 단계에서 로드·trust·deny/allow smoke를 확인해야 한다.

Hook 확인이 실패하더라도 Advisor/Worker 작업 자체가 불가능한 것은 아니다. Worker brief에 TDD와 경계를 명시하고 Advisor가 focused test·typecheck·build·diff 검증을 직접 수행하는 fallback이 있다. 단, 자동 하네스가 활성화된 것처럼 보고하면 안 된다.

## 2. 확인된 전역 상태

`agentic-health-check` 실행 결과:

| 항목 | 결과 | 해석 |
|---|---|---|
| 전역 `AGENTS.md` | pass | core-sized, 라우팅 규칙 정상 |
| `config.toml` | warn | plugin 12개, hook trust 22개 중 stale 15개 |
| custom agents | pass | 2개, 필수 route 2/2, override 0 |
| agent limits | pass | `max_threads=4`, `max_depth=1` |
| skills | pass | 67개, 중복 0, stale reference 0 |
| commands | pass | 42개, 중복 0, stale reference 0 |
| memories | pass | raw memory와 rollout 정상 |
| plugins | pass | 활성 plugin resolution 정상 |

전역 worker route:

| role | model | effort | 사용 판단 |
|---|---|---|---|
| Advisor | 현재 runtime에서 직접 확인 불가 | unavailable | 시작·closeout에서 실제 값 기록 |
| `implementation_worker` | `gpt-5.6-terra` | `medium` | UI prototype 구현에 사용 |
| `routine_worker` | `gpt-5.6-luna` | `medium` | 판단 없는 기계적 변환에만 사용 |

`max_depth=1`은 Worker가 다시 child agent를 만들 수 없다는 뜻이며 custom agent 지침과 일치한다. `max_threads=4`에서 Advisor + Worker 1개는 안전 범위다.

## 3. 프로젝트 하네스 구조

### Codex 전용 hook

`mm-broker/.codex/hooks.json`은 다음을 선언한다.

| event | matcher | 역할 |
|---|---|---|
| PreToolUse | `apply_patch` | `codex-rules-guard.mjs` TDD·구조 규칙 차단 |
| PreToolUse | `apply_patch` | `codex-skill-loader.mjs` 관련 project skill 자동 주입 |
| PreToolUse | browser/playwright | QA 지식 주입 |
| PostToolUse | 전체 | `harness-probe.cjs` append-only 지표 |
| Stop | 전체 | Simple Design·build checker |

`codex-rules-guard.mjs`는 `docs/dev-guidelines/enforce/rules.json`을 읽어 다음을 차단한다.

- route/service/repository layer 금지 import·pattern
- 테스트가 없는 production `.ts/.tsx` 변경
- `request.json()` 직접 호출 등 선언된 규칙

신규 `page.tsx`는 TDD guard 예외지만 `_components/**`, `_adapters/**`, `_store/**` production 파일은 대응 test가 필요하다. 이 규칙은 현재 로드맵의 실패 test 우선 방식과 일치한다.

### Claude 호환 hook

`.claude/settings.json`의 `Edit|Write|Bash` hook은 Claude 도구명에 맞춰져 있다. Codex의 `apply_patch`에서는 일부가 no-op이므로 `.codex/codex-rules-guard.mjs`가 TDD·구조 규칙을 보완한다.

Simple Design pre-commit은 실제 `.git/hooks`가 아니라 tool matcher 기반이다. 현재 repo에는 `core.hooksPath` 설정과 활성 Git hook이 없다. 따라서 commit 전 Advisor가 Simple Design review를 명시적으로 실행해야 한다.

## 4. 전역 hook과의 관계

활성 `claude-kit` 전역 hook은 DB guard, feature-scope guard, TDD guard, plan-doc guard, quality reminder, edit tracker, security trigger를 제공한다.

| hook | 현재 프로젝트 영향 | 충돌 판정 |
|---|---|---|
| DB destructive guard | 위험 Bash command만 차단 | 충돌 없음, 안전 강화 |
| feature-scope guard | `.codex-agentic.json` 또는 architecture marker opt-in | 현재 marker 없음, fail-open |
| global TDD guard | `.codex-agentic.json` opt-in | 현재 marker 없음, fail-open |
| plan-doc guard | `.codex-agentic.json` opt-in | 현재 marker 없음, fail-open |
| quality/security reminder | Edit/Write 기반 reminder | `apply_patch`에서는 제한적, 충돌 없음 |
| project Codex rules guard | `apply_patch` production code 검사 | 로드되면 TDD와 정합 |

전역 blocking hook과 project Codex guard가 동시에 같은 `apply_patch`를 이중 차단하는 상태는 확인되지 않았다. 전역 guard는 marker가 없어 비활성이고, Codex 편집은 project guard가 담당하도록 설계돼 있다.

## 5. 확인된 gap과 리스크 점수

점수는 `Impact + Reach + Recovery`다.

| 항목 | I/R/R | 합계 | Severity | Confidence | 조치 |
|---|---:|---:|---|---|---|
| 현재 세션에서 project Codex hook 발사 증거 없음 | 3/3/1 | 7 | high | confirmed | 새 세션 P0 trust·smoke 필수 |
| Advisor와 Worker가 같은 파일을 동시 수정할 위험 | 3/2/1 | 6 | high | confirmed 구조 | 단일 Worker·단일 writer로 제거 |
| Simple Design pre-commit이 실제 Git hook이 아님 | 2/2/1 | 5 | high | confirmed | commit 전 Advisor 수동 review |
| build/test cache 동시 접근 | 2/2/1 | 5 | high | likely | 테스트·build·browser QA 직렬 실행 |
| skill injection 30분 temp cache가 agent 간 공유될 가능성 | 1/2/0 | 3 | medium | likely | Worker brief에 skill을 명시, 자동 주입 의존 금지 |
| `.harness-metrics.jsonl` append 공유 | 1/2/0 | 3 | medium | confirmed 구조 | 실행 직렬화, 로그를 승인 근거로 단독 사용 금지 |
| 전역 hook stale trust 15개 | 1/1/1 | 3 | medium | confirmed | 구현 차단 아님, 별도 cleanup 권장 |
| Design repo hook trust와 앱 구현 hook 혼동 | 1/1/0 | 2 | low | confirmed | repo/cwd별로 분리 보고 |

현재 high 항목은 모두 시작 전 운영 규칙으로 완화할 수 있다. 인증·개인정보·DB·production write 관련 critical 리스크는 이번 UI prototype 범위에서 발견되지 않았다.

## 6. 안전한 Advisor/Worker 실행 계약

### Worker 수와 workspace

```text
worker_count: 1
workspace_isolation.mode: existing_single_worker
```

- Worker만 `app/test/broker-order-console-new/**`를 수정한다.
- Worker 실행 중 Advisor는 같은 repo 파일을 수정하지 않는다.
- Advisor는 read-only 분석·brief 준비만 하고 Worker 종료 후 검증한다.
- 기존 `app/test/broker-order-console/**`는 forbidden path다.

### Shared state owner

| shared state | 규칙 |
|---|---|
| `package.json`·lockfile | 수정 금지 |
| `.next`, `.next-build`, `.next-qa*` | 동시 실행 금지, phase별 단일 owner |
| Vitest cache | Worker test 종료 후 Advisor 재검증 |
| Playwright output | Advisor가 browser QA 시 소유 |
| test DB | UI prototype에서는 사용 금지 |
| `.harness-metrics.jsonl` | append-only 참고 로그, 실행 직렬화 |
| Design 문서 package | Worker 수정 금지, Advisor가 결과 반영 |
| 전역 config·hooks·skills·memory | Worker 수정 금지 |

### Worker 필수 지침

- project TDD 문서를 먼저 읽고 실패 test부터 작성
- `html-fidelity-reproduction` contract 준수
- `app/test/broker-order-console-new/**`만 write
- API·backend/service·실제 mutation 금지
- test/typecheck/build 명령만 허용
- commit·push·PR·deploy·publish 금지
- hook 차단 시 우회하지 않고 Advisor에게 보고

## 7. 다른 전역 기능 영향

| 전역 기능 | 영향 | 운영 원칙 |
|---|---|---|
| Memory | 프로젝트 선호 복구에 도움 | 읽기만, 사용자 요청 없이 memory write 금지 |
| Skills | 중복 0, stale 0 | 자동 주입에만 의존하지 않고 brief에 필수 skill 명시 |
| Commands | 중복 0 | Claude 전용 command명은 현재 Codex tool과 혼동하지 않음 |
| Browser/Playwright | visual QA에 필요 | Worker 구현 후 Advisor가 직렬 실행 |
| `verify-html-fidelity` | G-UI/closeout 검증 | P-06과 Q에서 사용 |
| `build-system` | build command 탐지 | Q 또는 blast-radius gate에서 사용 |
| claude-kit hooks | marker 기반 fail-open | marker를 임의 생성하지 않음 |
| Continuous learning | 구현 필수 기능 아님 | 자동 학습 결과를 acceptance evidence로 사용하지 않음 |
| Plugins | 명시 사용 시에만 영향 | Gmail/Drive 등 무관 plugin 호출 금지 |
| Git workflow | branch는 이미 분리됨 | 사용자 요청 전 commit·push·PR 없음 |

`next.config.ts`는 build에서 `.next-build`, QA에서 `NEXT_DIST_DIR=.next-qa*`를 지원하므로 dev/build cache 분리 기반이 이미 있다. `cacheComponents: true`는 설정돼 있지 않아 관련 global skill이 자동 개입하지 않는다.

## 8. 새 세션 P0 preflight

구현 전에 다음을 순서대로 수행한다.

1. branch가 `feat/nbbb1-broker-order-console-new-ui-prototype`인지 확인한다.
2. dirty/untracked 사용자 파일과 nested repo 경계를 기록한다.
3. `agentic-health-check`를 실행하고 custom agent route를 확인한다.
4. `.codex/hooks.json`의 trust/load 상태를 확인한다.
5. safe dry-run으로 `codex-rules-guard`의 testless production deny와 test-first allow를 확인한다.
6. `.harness-metrics.jsonl`에 새 `codex` event가 기록되는지 확인한다.
7. project TDD·Simple Design·frontend testing·React·TypeScript·Tailwind 지침을 읽는다.
8. 기존 `broker-order-console` focused 434 tests를 재실행한다.
9. 완전한 Worker brief를 공개하고 `implementation_worker` 1개만 spawn한다.

4~6이 실패하면 다음 중 하나로 결정한다.

- 사용자 승인으로 project hook을 신뢰·재로딩하고 다시 확인
- hook 자동 보호 없이 진행하되 Worker TDD + Advisor 독립 검증을 강제하고 제한을 보고
- 구현 시작을 보류하고 hook setup을 별도 작업으로 분리

전역 `config.toml`이나 hook trust 값은 사용자 승인 없이 수정하지 않는다.

## 9. 최종 Go/No-Go

| 조건 | 판정 |
|---|---|
| Advisor/Worker custom agent route | Go |
| thread/depth limit | Go |
| 단일 Worker path isolation | Go |
| TDD·레이어 규칙 정합 | Go |
| build/QA cache 분리 | Go, 직렬 실행 조건 |
| project Codex hook live firing | **Needs verification** |
| stale global hook trust cleanup | Non-blocking follow-up |

**최종: P0에서 project Codex hook 활성만 확인하면 G0 UI prototype 구현을 시작해도 된다.** 확인되지 않으면 자동 하네스 보호가 없는 fallback이라는 사실을 명시하고 Advisor 검증을 강화해야 한다.
