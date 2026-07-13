# 06. 구축 로드맵, 리스크, 완료 판정

## Phase 0. 기준선과 가역성 확보

> 실행 상태: **완료, credits calibration 제한 있음**<br>
> 증거: [07-phase0-baseline.md](./07-phase0-baseline.md)

### 작업

- `agentic-health-check` 결과를 기준선으로 저장한다.
- `C:\Users\beck\.codex\AGENTS.md`, `config.toml`을 안전한 개인 백업 위치에 복사한다.
- Codex app과 사용 가능한 CLI surface에서 Sol/high, Terra/medium, Luna/medium read-only smoke를 실행하고 access matrix를 만든다.
- local session token field와 Usage panel을 고정 task 1회로 대조해 credits calibration 가능 여부를 판정한다.
- disposable fixture repo 또는 전용 clean worktree, dummy remote, production credential이 없는 pilot workspace를 준비한다.
- 현재 `gpt-5.5/xhigh/priority`로 golden task 일부를 실행해 B0 기준선을 만든다.
- 적용할 Codex rate card 원문/조회 시각과 service tier를 baseline에 저장한다.
- 적용 파일 목록과 롤백 명령을 먼저 문서화한다.

### Gate

- 기준선 파일에 secret이 없다.
- 기존 hook hash warning 15건이 Advisor/Worker 변경 전 상태임을 기록한다.
- global 파일을 삭제하거나 전체 초기화하지 않고 개별 파일 단위로 롤백 가능하다.
- Terra/medium 접근이 확인된다. 확인되지 않으면 기본 모델 전환을 중단하고 5.5 role-only pilot으로 전환하거나 작업을 보류한다.
- Sol/high와 Luna/medium의 availability/error가 명시되어 해당 역할을 생성할 수 있는지 판단 가능하다.
- `credits_source`가 `observed`, 검증된 `derived`, `aggregate-only`, `unavailable` 중 하나로 판정되고 null을 0으로 취급하지 않는다.
- pilot workspace가 사용자 dirty worktree와 분리되고 실제 remote write가 불가능하다.

## Phase 1. 역할 정책과 skill

> 실행 상태: **완료, 공식 quick validator 의존성 제한 있음**<br>
> 증거: [08-phase1-role-skill.md](./08-phase1-role-skill.md)

### 작업

- 전역 `AGENTS.md`에 20줄 안팎의 Advisor/Worker 섹션을 추가한다.
- `advisor-worker-orchestration` skill을 생성한다.
- brief, repair brief, 검증 게이트, 직접 처리 예외를 skill에 넣는다.
- 프로젝트 지침 우선과 docs-only/review-only 경계를 명시한다.

### Gate

- 전역 `AGENTS.md`가 core-sized를 유지한다.
- skill trigger가 단순 질의에 오발동하지 않는다.
- 실제 구현 task에서 brief template가 누락 없이 생성된다.

## Phase 2. Terra Worker와 사용량 제한

> 실행 상태: **완료**<br>
> 증거: [09-phase2-terra-worker-limits.md](./09-phase2-terra-worker-limits.md)

### 작업

- `~/.codex/agents/implementation-worker.toml`을 Terra/medium으로 만든다.
- `config.toml`에 `[agents]` 제한을 추가한다.
- built-in `worker`, `explorer`, `default`를 덮어쓰지 않는지 확인한다.
- orchestration skill에 turn당 Worker 최대 3개 soft policy를 추가한다.

### Gate

- `implementation_worker`가 Codex에서 로드되고 subagent panel에 식별된다.
- 부모 sandbox/approval보다 넓은 권한을 얻지 않는다.
- runtime에서 `max_depth = 1`, `max_threads = 4`가 적용되고 둘의 실제 의미를 smoke로 기록한다.
- Worker 최대 3개는 config hard cap으로 오인하지 않고 run log의 `worker_count`로 검증한다.
- Worker가 commit/push/deploy하지 않는다.

## Phase 3. Advisor 검증 루프

> 실행 상태: **완료, in-app custom role 노출 제한 기록**<br>
> 증거: [10-phase3-advisor-verification.md](./10-phase3-advisor-verification.md)

### 작업

- disposable fixture 또는 전용 clean worktree의 synthetic 작은 기능 2개에 Terra Worker를 적용한다.
- Advisor가 `status -> diff -> focused test -> broader check` 순서로 독립 검증한다.
- 의도적으로 실패하는 fixture로 repair brief 흐름을 검증한다.
- 병렬 쓰기 task는 disjoint path가 확인된 1개 사례에서만 시험한다.

### Gate

- Worker `complete` 보고만으로 승인한 사례가 없다.
- 실패 로그가 repair brief에 정확히 전달된다.
- 같은 파일의 병렬 수정이 없다.
- shared lockfile, generated output, cache, test DB의 병렬 소유권 충돌이 없다.
- 직접 처리 예외와 위임 trigger가 실제 작업에서 구분된다.

## Phase 4. Luna Worker, Health-check와 Eval

> 실행 상태: **Phase 4-A 완료, route observability 적용, Phase 4-B GT-04 v2.5 PASS. v2.4 first attempt의 payload schema 실패도 보존**<br>
> 증거: [11-phase4a-luna-health.md](./11-phase4a-luna-health.md), [12-phase4b-gt04-pilot.md](./12-phase4b-gt04-pilot.md), [13-phase4b-gt04-v2-diagnostic.md](./13-phase4b-gt04-v2-diagnostic.md), [14-phase4b-gt04-v2-1-diagnostic.md](./14-phase4b-gt04-v2-1-diagnostic.md), [15-phase4b-gt04-v2-2-diagnostic.md](./15-phase4b-gt04-v2-2-diagnostic.md), [17-phase4b-gt04-v2-3-routing-observability.md](./17-phase4b-gt04-v2-3-routing-observability.md), [18-phase4b-gt04-v2-5-shell-payload-normalization.md](./18-phase4b-gt04-v2-5-shell-payload-normalization.md)

### 작업

- Terra 검증 루프가 Phase 3 gate를 통과한 뒤 `~/.codex/agents/routine-worker.toml`을 Luna/medium으로 만든다.
- custom agent schema와 `[agents]` 제한 검사를 health-check에 추가한다.
- GT-01~GT-10을 B0, B1, C1~C4 중 해당 조합에 실행한다.
- 조합별 최소 3회, 무작위 순서, 동일 fixture/prompt/권한으로 품질, credits, 시간, repair loop, 범위 이탈을 비교한다.
- model/effort 라우팅 표를 결과로 보정한다.

### Gate

- health-check가 기존 항목을 깨뜨리지 않는다.
- `routine_worker`가 Luna/medium으로 로드되고 GT-04에서 `pass^3 = 100%`를 달성한다.
- credits calibration과 parent/child thread attribution 상태가 report에 표시된다.
- pilot 성공 기준을 충족한다.
- 기준선보다 품질이 떨어진 task class는 낮은 모델을 기본으로 채택하지 않는다.

## Phase 5. 전역 기본값 전환

> 실행 상태: **제한 출시 완료. 전체 Pilot QA·credits calibration·fallback 검증은 후속 단계로 이연**<br>
> 증거: [19-phase5-limited-release.md](./19-phase5-limited-release.md)

### 추천안

```toml
model = "gpt-5.6-terra"
model_reasoning_effort = "medium"
```

이 변경은 pilot 통과 후 별도 승인한다. `service_tier`는 같은 변경에 묶지 않고, credits 실측 결과가 있을 때 독립 결정한다.

### Gate

- 일상 task에서 C1 품질이 기준선 이상이다.
- Sol/high 승격 trigger가 skill에 반영됐다.
- GPT-5.6 접근이 없는 환경에서 gpt-5.5 fallback이 동작한다.

## Phase 5.1. 대형 기획용 planning_worker Pilot

> 실행 상태: **Capability·timeout·품질 PASS. 효율 Gate FAIL로 자동 라우팅 REJECT, explicit opt-in 유지**<br>
> 증거: [20-planning-worker-pilot.md](./20-planning-worker-pilot.md), [21-phase5-1-planning-worker-capability.md](./21-phase5-1-planning-worker-capability.md), [22-phase5-1-planning-worker-paired-eval.md](./22-phase5-1-planning-worker-paired-eval.md)

### 순서

1. `planning_worker = gpt-5.6-terra/medium` 등록.
2. fresh read-only smoke로 실제 child model/effort 고정 증거 수집.
3. 대형 기획 fixture 1건을 1 Worker·no resume·10분 제한으로 실행.
4. Worker 총 사용량 300,000 tokens ceiling과 Advisor 독립 검증 적용.
5. 통과 후에만 docs-only 자동 라우팅 확대 여부를 별도 승인.

## 리스크와 대응

| 리스크 | Impact | Reach | Recovery | Severity | 대응 |
|---|---:|---:|---:|---|---|
| Worker가 범위 밖 파일을 수정 | 3 | 2 | 2 | high | allowed path, Advisor diff gate, 병렬 소유권 |
| 자동 위임으로 credits 급증 | 2 | 3 | 1 | high | Ultra 비기본, fan-out 3, CSV worker timeout 20분, 일반 agent stop 정책 |
| Worker 보고를 잘못 승인 | 3 | 2 | 2 | high | Advisor 독립 테스트와 diff 확인 |
| 프로젝트 규칙과 전역 정책 충돌 | 3 | 2 | 1 | high | 전역은 역할만, 프로젝트 지침 우선 |
| custom agent schema drift | 2 | 2 | 1 | high | health-check, built-in worker fallback |
| config 파싱 오류 | 3 | 3 | 2 | critical | 백업, TOML parse check, 한 변경씩 적용 |
| Ultra와 수동 fan-out 중복 | 2 | 2 | 1 | high | 둘 중 하나만 선택하는 명시 규칙 |
| Luna가 모호한 작업을 잘못 구현 | 2 | 2 | 1 | high | Terra gate 이후 Luna/medium만 도입, routine-only contract, 예외 즉시 stop |
| GPT-5.6 preview 접근 없음 | 3 | 3 | 1 | high | Phase 0 access matrix, 5.5 role-only fallback 또는 보류 |
| credits 측정 불가·잘못된 환산 | 3 | 3 | 1 | high | calibration, rate card version, `unavailable` 시 비용 판정 금지 |
| pilot이 사용자 WIP를 오염 | 2 | 1 | 1 | medium | disposable fixture/clean worktree, dummy remote, production credential 제거 |

`config.toml` 파싱 오류는 모든 Codex 작업에 영향을 줄 수 있어 critical로 취급한다. Phase 2에서는 agent 파일과 `[agents]` 변경을 분리 적용하고 각 단계마다 health-check를 실행한다.

## 롤백 계획

롤백은 전체 `.codex` 삭제가 아니라 변경 표면만 되돌린다.

1. `config.toml`의 `[agents]` 블록과 승인된 모델 기본값 변경만 복원한다.
2. 전역 `AGENTS.md`의 Advisor/Worker 섹션만 제거한다.
3. `~/.codex/agents/implementation-worker.toml`, `routine-worker.toml`만 제거한다.
4. `~/.agents/skills/advisor-worker-orchestration`과 health-check 확장분을 되돌린다.
5. `~/.codex/eval-runs/advisor-worker`의 mutable run state를 별도 보관하거나 제거한다.
6. 기존 skills, plugins, memories, sessions, auth, hook trust는 건드리지 않는다.

롤백 후 기존 `gpt-5.5/xhigh/priority` 기준선과 health-check 상태가 복원되어야 한다.

## Definition of Done

- [ ] 전역 `AGENTS.md`가 Advisor 책임과 Worker 경계를 얇게 정의한다.
- [ ] orchestration skill이 brief, 병렬화, repair, 검증을 제공한다.
- [ ] Terra implementation Worker와 Luna routine Worker가 로드된다.
- [ ] `max_depth = 1`, `max_threads = 4` runtime 설정이 확인된다.
- [ ] turn당 Worker 최대 3개 soft policy가 skill에 있고 pilot run에서 위반 0건이다.
- [ ] Worker는 commit/push/deploy를 수행하지 않는다.
- [ ] Advisor가 모든 구현 결과에서 diff와 테스트를 독립 검증한다.
- [ ] parallel write conflict와 scope violation이 0건이다.
- [ ] GT-01~GT-10 pilot이 성공 기준을 충족한다.
- [ ] health-check가 agent와 config drift를 진단한다.
- [ ] 롤백 dry-run이 기존 global state를 손상하지 않는다.
- [ ] GPT-5.6 access matrix와 credits calibration 결과가 baseline에 존재한다.
- [ ] pilot은 disposable fixture 또는 전용 clean worktree에서만 실행된다.
- [ ] `gpt-5.6-terra/medium` 기본값 전환은 pilot 결과와 사용자 승인 후에만 수행한다.

## 요구사항 추적

| 요구사항 | 구현 단계 | 검증 |
|---|---|---|
| REQ-AWO-001, REQ-AWO-004, REQ-AWO-007 | Phase 1 | global guidance와 skill review, brief smoke |
| REQ-AWO-002, REQ-AWO-009, REQ-AWO-010 | Phase 2 | Terra agent load, model/effort 확인, runtime/soft fan-out 제한 |
| REQ-AWO-005, REQ-AWO-006, REQ-AWO-008, REQ-AWO-011 | Phase 3 | diff/test gate, repair fixture, 병렬 경로 검사 |
| REQ-AWO-003, REQ-AWO-012, REQ-AWO-013 | Phase 4 | Luna/medium agent, health-check, 통제된 GT-01~GT-10 report |
| REQ-AWO-014, REQ-AWO-015 | Phase 0, 4 | access matrix, credits calibration과 attribution |
| NFR-AWO-001~007 | Phase 0~5 전체 | credits, 권한, rollback, compatibility, routing log, workspace 격리 |

## 구현 순서 추천

1. Phase 0 기준선과 eval 정의.
2. Phase 1 역할 정책과 skill.
3. Phase 2 Terra Worker 1종만 먼저 추가.
4. Phase 3 Terra 검증 루프 안정화.
5. Phase 4 Luna/medium Worker와 전체 pilot 추가.
6. Phase 4 pilot 통과 후에만 Phase 5 전역 기본 모델 변경.

한 번에 모든 모델·agent·config를 바꾸지 않는다. 변화 원인을 분리해야 품질과 credits 차이를 설명할 수 있다.
