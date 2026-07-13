# 02. Scorecard and Findings

## 1. 종합 점수

| 평가 영역 | 배점 | 원점수 | 환산 | 근거 |
|---|---:|---:|---:|---|
| 구조적 일관성과 책임 분리 | 15 | 3/5 | 9 | 얇은 AGENTS와 계층은 좋으나 claude-kit이 dev/plan/copy를 혼합 |
| routing과 trigger 정확성 | 15 | 2/5 | 6 | 명확한 skill description도 있지만 hook과 legacy command가 runtime과 불일치 |
| 중복 제거와 최소성 | 15 | 1/5 | 3 | 36 capability 중 semantic overlap 다수, claude-kit 11,411 Markdown lines |
| guardrail 비례성 | 15 | 2/5 | 6 | 일부 opt-in은 적절하지만 global/project 강제가 섞이고 작동 여부가 불명확 |
| runtime 정합성과 실제 작동성 | 15 | 2/5 | 6 | config와 custom agent는 검증됐지만 Claude tool name·model·command 잔존 |
| 검증·관측·회귀 탐지 | 10 | 3/5 | 6 | health-check와 Advisor eval은 강점이나 nested references와 project trust를 놓침 |
| 유지보수성과 version 관리 | 10 | 2/5 | 4 | source/cache 115개 hash는 일치하지만 June version ID 아래 July 수정이 누적됨 |
| migration·rollback 가능성 | 5 | 3/5 | 3 | Advisor rollout은 snapshot이 좋지만 전체 global manifest와 통합 복구는 없음 |
| **합계** | **100** |  | **43** | 평가 영역 8/8, confidence medium |

점수는 구조 감사 8개 영역을 모두 평가했으므로 coverage 100%다. 다만 capability 36개 중 `Invoked`, `Verified`, `Valuable` 증거가 있는 것은 15개(41.7%)여서 가치 판정의 신뢰도는 별도로 제한한다.

## 2. 가장 큰 구조적 문제 5개

### F-001. 등록된 global hook이 Codex tool name과 맞지 않는다

- `dev-db-guard.js`는 `Bash`만 검사하고 현재 Codex 명령 도구는 `exec_command`다.
- 보안·품질·편집 hook은 `Edit|Write`를 검사하고 현재 파일 수정 도구는 `apply_patch`다.
- mock probe에서 같은 `DROP TABLE` 문자열이 `Bash`일 때 exit 2, `exec_command`일 때 exit 0이었다.
- 이는 보호 기능이 없다는 문제보다 “보호 중이라고 오인하는 상태”가 더 위험하다.

### F-002. 전역 skill 내부에 존재하지 않는 runtime과 command가 다수 남아 있다

- `cc-dev-agent`, `team-orchestrator`, `verification-engine`, `session-wrap`, `skill-factory`가 `/orchestrate`, `/handoff-verify`, `/commit-push-pr`, TeamCreate, TaskCreate, SendMessage를 전제한다.
- `session-wrap`은 Windows 환경인데 `/tmp`, `tail`, Bash와 `sonnet`을 고정한다.
- `continuous-learning-v2`는 Claude CLI와 `haiku` observer를 전제하지만 active hook 증거가 없다.
- health-check는 top-level `SKILL.md`만 scan해 nested references의 stale runtime을 놓친다.

### F-003. claude-kit이 하나의 전역 plugin으로 너무 많은 책임을 가진다

- 32 active skills, 38 commands, 21 agents, 14 hook files를 한 plugin이 소유한다.
- command는 dev 21, plan 10, copy 7로 서로 다른 사용자 여정이다.
- manifest 설명은 TDD·Hexagonal Architecture 중심이지만 실제 plugin은 기획·디자인 복제·학습·보안까지 포함한다.
- 프로젝트 `.plans` schema를 전역 command가 전제해 project/global 경계가 뒤집혀 있다.

### F-004. health-check가 건강 상태와 분류 오류를 동시에 만든다

- `stale hook 15`는 Design 프로젝트의 hook trust 15개와 대응한다.
- expected set은 enabled plugin hook만 계산하므로 project hook trust를 stale로 분류한다.
- 반대로 nested skill references, plugin agents, hook 내부의 Claude 전용 token은 검사하지 않는다.
- 따라서 현재 PASS는 “파일과 기본 schema가 존재함”을 의미하며 실제 routability 전체를 보증하지 않는다.

### F-005. 프로젝트 하네스와 전역 governance가 같은 문제를 중복 해결한다

- Design 프로젝트에는 15개 hook command와 약 947 KB metrics가 존재한다.
- claude-kit도 TDD, scope, plan doc, edit tracking, security reminder를 전역에서 다시 시도한다.
- 과거 하네스 분석의 결론처럼 강제는 프로젝트 `rules.json`, git gate, CI에 남기는 편이 도구 독립성과 팀 재현성이 높다.

## 3. Risk-based Review

| Finding | Impact | Reach | Recovery | Total | Severity | 처리 |
|---|---:|---:|---:|---:|---|---|
| Global hook false protection | 3 | 3 | 1 | 7 | high | 기존 hook 확대 금지, Phase 1에서 quarantine |
| Stale runtime workflow 실행 실패 | 2 | 3 | 1 | 6 | high | Delete/Rebuild 후보 분리 |
| claude-kit monolith의 변경 전파 | 2 | 3 | 2 | 7 | high | capability 추출 후 plugin 은퇴 |
| health-check project trust 오분류 | 2 | 3 | 1 | 6 | high | global/project expected set 분리 |
| 전역·프로젝트 guard 중복 | 2 | 2 | 2 | 6 | high | project enforcement 우선 |
| session-wrap의 Windows/runtime 불일치 | 2 | 1 | 1 | 4 | medium | 명시 호출 전용 경량 workflow로 재작성 |
| official/personal utility 중복 | 1 | 1 | 1 | 3 | medium | 사용자 선택 유지, 자동 삭제 금지 |

확인된 secret 노출, 데이터 손상 또는 production write는 없다. 가장 높은 위험은 실제 사고가 아니라 작동하지 않는 guard를 작동한다고 믿는 운영 오류다.

## 4. 유지할 강점

- `AGENTS.md`가 116줄로 core-sized이며 상세 절차를 skill로 위임한다.
- Terra/medium 기본값과 `max_threads=4`, `max_depth=1`이 실제 config와 agent route에서 검증됐다.
- Advisor/Worker는 diff/test 독립 검증과 repair brief 경계가 명확하다.
- planning Worker 자동 라우팅을 실측 효율 실패에 따라 거절한 의사결정이 증거 기반이다.
- 프로젝트 하네스는 canonical 문서, 선언 규칙, git/CI gate라는 재현 가능한 강제 층을 제공한다.
- frontend fidelity, Windows encoding, methodology, review, reporting 등 trigger가 좁은 skill은 역할이 비교적 선명하다.

## 5. 목표 점수

| 영역 | 목표 원점수 | 목표 환산 |
|---|---:|---:|
| 구조 일관성 | 5/5 | 15 |
| routing 정확성 | 4/5 | 12 |
| 최소성 | 4/5 | 12 |
| guardrail 비례성 | 4/5 | 12 |
| runtime 정합성 | 4/5 | 12 |
| 검증·관측 | 5/5 | 10 |
| 유지보수·version | 4/5 | 8 |
| migration·rollback | 4/5 | 4 |
| **목표 합계** |  | **85/100** |

85점은 기능 수를 줄였다는 선언이 아니라, 남은 capability가 실제 trigger·consumer·test·rollback을 가진 상태를 뜻한다.
