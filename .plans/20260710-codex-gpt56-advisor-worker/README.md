# Codex GPT-5.6 전역 Advisor/Worker 오케스트레이션 기획

> 기획일: 2026-07-10
> 범위: `C:\Users\beck\.codex`와 `C:\Users\beck\.agents`에 적용할 개인 전역 에이전틱 기능
> 상태: Draft v0.17, planning_worker 품질 PASS·자동 라우팅 REJECT·explicit opt-in 유지

## 한 줄 결론

메인 세션은 판단과 검증을 소유하는 `Advisor`, subagent는 구현을 수행하는 `Worker`로 역할을 분리하되, GPT-5.6의 `Sol/Terra/Luna`를 난이도와 사용량에 따라 라우팅한다.

이 패턴은 Anthropic의 공식 Advisor Strategy를 그대로 구현하는 것이 아니다. 공식 전략에서 착안했지만 메인 세션이 Advisor이자 최종 통합 책임자가 되는 `Advisor/Worker 오케스트레이션 변형`이다.

## 핵심 결정

| 항목 | 결정 |
|---|---|
| 기본 모델 | `gpt-5.6-terra` + `medium`을 일상 작업 기본 후보로 검증 |
| Advisor 승격 | 모호하거나 고위험인 설계·판단은 `gpt-5.6-sol` + `high` |
| 일반 Worker | custom agent `implementation_worker`: `gpt-5.6-terra` + `medium` |
| 반복 Worker | custom agent `routine_worker`: `gpt-5.6-luna` + `medium`. Terra 검증 루프가 안정된 뒤 추가 |
| 병렬화 | 탐색·분석은 적극 병렬화, 쓰기 작업은 파일 소유권이 분리된 경우만 병렬화 |
| Ultra | 기본값으로 사용하지 않음. 3개 이상 독립 작업으로 분해 가능한 큰 작업에만 명시적 사용 |
| 검증 책임 | Worker가 아니라 Advisor가 `git diff`, 테스트, 범위, 커밋 여부를 최종 확인 |
| 사용량 제한 | `[agents].max_threads = 4`는 runtime 자원 상한, turn당 Worker 최대 3개는 skill이 적용하는 soft policy |
| 전역 구현 표면 | 얇은 `AGENTS.md` 규칙 + orchestration skill + custom agents + `[agents]` 제한 + health-check |
| Hook | MVP에서는 신규 전역 hook을 추가하지 않음 |

## 도입 전 기준선

Phase 0에서 2026-07-10에 캡처한 변경 전 상태다. 현재 적용 상태는 Phase 1~4-B 실행 보고서를 따른다.

| 항목 | 현재 상태 | 기획상 의미 |
|---|---|---|
| 기본 모델 | `gpt-5.5` + `xhigh` | 사용량이 빠르게 소모될 수 있어 비교 기준선으로 보존 |
| 서비스 계층 | `service_tier = "priority"` | 실제 사용량 영향은 별도 실측 후 변경 여부 결정 |
| GPT-5.6 접근 | Sol/high, Terra/medium, Luna/medium 모두 CLI·app PASS | Phase 1·2에서 후보 역할을 생성할 수 있음 |
| `[agents]` | 미설정 | Codex 기본 `max_threads = 6`, `max_depth = 1` 사용 중 |
| custom agents | `C:\Users\beck\.codex\agents` 미존재 | Worker 프로필을 새로 정의할 수 있는 상태 |
| 전역 `AGENTS.md` | 92줄, core-sized | 역할 정책은 20줄 안팎으로 얇게 추가해야 함 |
| health-check | `warn` | hook trusted hash 15건 stale. 본 기능과 분리해 기준선으로 기록 |

## 문서 맵

| 문서 | 내용 |
|---|---|
| [01-prd.md](./01-prd.md) | 문제, 목표, 사용자 스토리, 요구사항, 성공 지표 |
| [02-architecture.md](./02-architecture.md) | 전역 적용 표면, 실행 흐름, 책임 경계 |
| [03-model-routing.md](./03-model-routing.md) | GPT-5.6 모델·추론 강도·병렬화 정책 |
| [04-worker-brief-verification.md](./04-worker-brief-verification.md) | Worker brief 계약, 검증 게이트, 재위임 템플릿 |
| [05-eval-observability.md](./05-eval-observability.md) | 기준선 비교, golden task, 품질·사용량 평가 |
| [06-roadmap.md](./06-roadmap.md) | 단계별 구축, 리스크, 롤백, 완료 판정 |
| [07-phase0-baseline.md](./07-phase0-baseline.md) | 백업, access matrix, credits 판정, GPT-5.5 B0 부분 기준선 |
| [08-phase1-role-skill.md](./08-phase1-role-skill.md) | 전역 역할 라우팅, orchestration skill, trigger·repair 검증 결과 |
| [09-phase2-terra-worker-limits.md](./09-phase2-terra-worker-limits.md) | Terra Worker 등록, thread/depth hard cap, Worker 3개 soft policy 검증 |
| [10-phase3-advisor-verification.md](./10-phase3-advisor-verification.md) | 병렬 Terra Worker, Advisor 독립 검증, evidence-based repair 결과 |
| [11-phase4a-luna-health.md](./11-phase4a-luna-health.md) | Luna routine Worker, custom-agent health-check, fresh CLI route 검증 |
| [12-phase4b-gt04-pilot.md](./12-phase4b-gt04-pilot.md) | GT-04 custom Luna 3-trial 결과, runtime 실패와 사용량 분석 |
| [13-phase4b-gt04-v2-diagnostic.md](./13-phase4b-gt04-v2-diagnostic.md) | PowerShell harness 검증, custom Worker spawn transport 실패와 전역 drift 분석 |
| [14-phase4b-gt04-v2-1-diagnostic.md](./14-phase4b-gt04-v2-1-diagnostic.md) | Structured transport preflight, fresh CLI nested tool capability mismatch 분석 |
| [15-phase4b-gt04-v2-2-diagnostic.md](./15-phase4b-gt04-v2-2-diagnostic.md) | Live-shell no-agent probe, code-mode host packaging 실패와 app-local bundle remediation |
| [16-mm-broker-routing-audit.md](./16-mm-broker-routing-audit.md) | docs-only direct route의 실제 rollout, model 활성화 조건, 관측성 개선안 |
| [17-phase4b-gt04-v2-3-routing-observability.md](./17-phase4b-gt04-v2-3-routing-observability.md) | 전역 route/model 공개 적용, app-local v2.3 probe, resume model drift와 사용량 분석 |
| [18-phase4b-gt04-v2-5-shell-payload-normalization.md](./18-phase4b-gt04-v2-5-shell-payload-normalization.md) | v2.4 payload schema 실패를 정규화하고 v2.5 no-agent/delegated probe와 Advisor 검증을 완료 |
| [19-phase5-limited-release.md](./19-phase5-limited-release.md) | Terra/medium 전역 기본값 제한 출시, 필수 Gate, rollback과 이연 검증 |
| [20-planning-worker-pilot.md](./20-planning-worker-pilot.md) | 대형 기획 전용 Worker의 trigger, usage guard, fresh model 증거와 승격 조건 |
| [21-phase5-1-planning-worker-capability.md](./21-phase5-1-planning-worker-capability.md) | planning_worker 등록, health TDD, model smoke, capability 결과와 사용량 Gate |
| [22-phase5-1-planning-worker-paired-eval.md](./22-phase5-1-planning-worker-paired-eval.md) | timeout negative eval, direct/delegated 3회 비교와 자동 라우팅 최종 판정 |

## 공식 근거

- [Codex Models](https://learn.chatgpt.com/docs/models): Sol/Terra/Luna 용도, reasoning effort, Max/Ultra 기준
- [Codex Subagents](https://learn.chatgpt.com/docs/agent-configuration/subagents): built-in worker/explorer, custom agent, 병렬화와 사용량 주의
- [Codex AGENTS.md](https://learn.chatgpt.com/docs/agent-configuration/agents-md): 전역 지침과 프로젝트 지침의 계층
- [Codex Configuration Reference](https://learn.chatgpt.com/docs/config-file/config-reference): `[agents]`, custom agent config, 전역 config 위치
- [GPT-5.6 Preview](https://help.openai.com/en/articles/20001325-a-preview-of-gpt-5-6-sol-terra-and-luna): 접근 범위와 모델 ID
- [Codex Rate Card](https://help.openai.com/en/articles/20001106-codex-rate-card-2): 모델별 token-to-credit 환산과 Usage panel

## 방법론 라우팅

```text
방법론 라우팅
- profile: docs-only + ai-eval modifier
- confidence: high
- selected_methods: Docs-as-Code + Eval-Driven + Review Checklist
- evidence: 전역 prompt/agent 동작을 바꾸는 기획이며 품질과 사용량 검증이 필요함
- skipped: 코드 구현, 전역 설정 변경, hook 추가
- reason: 먼저 역할·모델·검증 계약과 평가 기준을 고정해야 안전하게 실험 가능
- verification: 모델 접근 gate, credits 계측 계약, 문서 링크/요구사항 정합성, 공식 문서 근거, self-review
- ask_or_assume: assume
```
