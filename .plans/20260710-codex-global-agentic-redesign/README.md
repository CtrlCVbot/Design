# Codex 전역 에이전틱 구조 재설계

> 감사일: 2026-07-10 KST<br>
> 범위: `C:\Users\beck\.codex`, `C:\Users\beck\.agents`, claude-kit, 관련 프로젝트 하네스<br>
> 상태: **G3-1 `security-review` 구현·격리 검증 완료; G3-2~G3-4는 REVIEW_READY**

## 한 줄 결론

현재 환경은 기본 실행에는 건강하지만, 실제 Codex runtime과 맞지 않는 Claude 계열 workflow가 전역에 많이 노출되어 있다. 추천안은 전역 core를 얇게 유지하고, 검증된 capability만 명시적으로 호출하며, 프로젝트 강제는 프로젝트 하네스에 남기고, claude-kit은 분해 후 은퇴시키는 것이다.

## 현재 판정

| 항목 | 결과 |
|---|---:|
| 구조 점수 | **43/100** |
| 평가 영역 커버리지 | 100% (8/8 영역) |
| 상위 capability | 36개 |
| File-level entry | 162개, 총점 8,930, 평균 55.1/100 |
| 신규·통합 target | 9개 |
| capability 가치 증거 | 제한적 - 설치 증거가 실제 invocation 증거보다 많음 |
| health-check | core/config PASS, active skill 63, hook trust 22/22, runtime refs WARN 14 active / 7 inactive |
| 가장 큰 문제 | runtime 불일치, semantic overlap, claude-kit 비대화, 진단 사각지대, project/global 경계 혼합 |
| 즉시 구현 여부 | 금지 - migration 승인 후 단계별 적용 |

## 우선 결정

1. `AGENTS.md`, Terra/medium 기본값, 3개 custom agent, Advisor 검증 계약은 유지한다.
2. `cc-dev-agent`, `team-orchestrator`, `using-superpowers`, `strategic-compact`는 삭제 후보로 확정하되 Delete Gate를 구현 단계에서 다시 확인한다.
3. `verification-engine`, `verify-implementation`, `security-pipeline`, `session-wrap`, skill 생성 계열은 재작성 또는 통합한다.
4. claude-kit의 dev/plan/copy workflow는 전역 core에서 제거하고 프로젝트 adapter 또는 legacy quarantine으로 이동한다.
5. global hook은 현재 상태로 신뢰하지 않는다. Codex tool name과 marker 정책을 만족하는 최소 hook만 별도 pilot 후 허용한다.
6. 프로젝트 강제는 `rules.json`, git gate, CI처럼 프로젝트와 함께 재현되는 하네스에 남긴다.

## 문서 맵

| 문서 | 역할 |
|---|---|
| [01-baseline-inventory.md](./01-baseline-inventory.md) | 실제 파일과 실행 결과로 고정한 현재 기준선 |
| [02-scorecard-and-findings.md](./02-scorecard-and-findings.md) | 100점 점수표, 주요 문제와 증거 |
| [03-disposition-and-target-architecture.md](./03-disposition-and-target-architecture.md) | KEEP/MERGE/REWRITE/DELETE 판정과 목표 구조 |
| [04-migration-roadmap.md](./04-migration-roadmap.md) | Phase별 변경, 승인 Gate, rollback |
| [05-evaluation-and-rollback.md](./05-evaluation-and-rollback.md) | 대표 작업 eval, acceptance, 복구 계약 |
| [inventory.json](./inventory.json) | 기계 판독 가능한 capability 인벤토리 |
| [06-file-level-capability-scorecard.md](./06-file-level-capability-scorecard.md) | operational entry 161개의 기능·점수·삭제·통합·이동·유지 판정 |
| [file-inventory.json](./file-inventory.json) | file-level 표와 신규 target 9개의 기계 판독 원본 |
| [07-phase1-health-check.md](./07-phase1-health-check.md) | Phase 1 변경, 독립 검증, 잔여 경고와 rollback 결과 |
| [phase1-health-check/result.json](./phase1-health-check/result.json) | Phase 1 기계 판독 검증 결과와 최종 hash |
| [08-phase2-legacy-routing.md](./08-phase2-legacy-routing.md) | 4개 legacy skill 격리, deferred consumer-bound skill, rollback 증거 |
| [phase2-legacy-routing/result.json](./phase2-legacy-routing/result.json) | Phase 2 기계 판독 결과와 hash mapping digest |
| [09-phase3-core-skill-contracts.md](./09-phase3-core-skill-contracts.md) | Phase 3 target 4개의 책임·trigger·입출력·non-goal·migration 계약 |
| [phase3-security-review/result.json](./phase3-security-review/result.json) | G3-1 validator, fixture, health-check, quarantine 결과 |
| [phase3-core-contracts/contracts.json](./phase3-core-contracts/contracts.json) | Phase 3 기계 판독 계약과 구현 순서 |
| [phase3-core-contracts/EVAL.md](./phase3-core-contracts/EVAL.md) | 계약 및 구현 승격 Gate |
| [phase3-core-contracts/source-baseline.json](./phase3-core-contracts/source-baseline.json) | 10개 source의 file count·size·tree hash와 migration 경계 |

## 방법론 라우팅

```text
profile: docs-only + review-only
methods: Docs-as-Code + evidence-based inventory + risk scoring
boundary: 전역 파일 수정·삭제 금지
verification: JSON parse, 링크, 점수 합계, health-check, self-review
```

## 승인 Gate

G3-1 `security-review`는 구현·검증 후 기존 global `security-pipeline`을 rollback 가능한 quarantine으로 이동했다. 다음 구현 단위는 [09-phase3-core-skill-contracts.md](./09-phase3-core-skill-contracts.md)의 G3-2 `verification-router`이며, G3-2~G3-4는 `REVIEW_READY`다. `continuous-learning-v2`와 claude-kit legacy surface는 consumer 때문에 이동하지 않았다.
