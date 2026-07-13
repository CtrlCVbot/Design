# Phase 5 전역 기본값 제한 출시

> 실행일: 2026-07-10 KST<br>
> 판정: **제한 출시 PASS, 전체 Pilot QA와 비용 검증은 후속 단계로 이연**

## 변경

`C:\Users\beck\.codex\config.toml`의 기본 모델만 `gpt-5.6-sol/low`에서 `gpt-5.6-terra/medium`으로 변경했다. `service_tier`, `[agents]`, custom Worker 설정과 전역 정책은 변경하지 않았다.

## 필수 출시 Gate

| Gate | 결과 | 증거 |
|---|---|---|
| 출시 직전 config snapshot | PASS | 원본과 snapshot SHA-256 일치 |
| TOML parse | PASS | Terra/medium, threads 4, depth 1 |
| Agentic health | PASS with warning | core 전부 PASS, 기존 stale hook hash 15건만 유지 |
| Fresh direct route | PASS | `gpt-5.6-terra/medium`, Worker 0 |
| Fresh delegated route | PASS | parent와 `implementation_worker` 모두 실제 rollout에서 Terra/medium |
| Worker 금지 경계 | PASS | read-only smoke, file change·commit·push·deploy 0 |
| Rollback 준비 | PASS | snapshot과 즉시 복원 명령 고정 |

구조화된 결과는 [release-result.json](./phase5-release/release-result.json), 복원 절차는 [rollback.md](./phase5-release/rollback.md)에 있다.

## 이연한 검증

- GT-04 `pass^3`와 GT-01~GT-10 전체 Pilot QA
- credits calibration과 장기 사용량 비교
- stale hook hash 15건 정리
- GPT-5.5 fallback 실전 검증

이 항목을 이연했으므로 이번 상태는 전체 품질·비용이 확정된 정식 rollout이 아니라 복구 가능한 제한 출시다.

## Risk-based Self-review

| 항목 | Impact | Reach | Recovery | Total | Severity | 처리 |
|---|---:|---:|---:|---:|---|---|
| 전역 기본 모델 변경이 모든 새 세션에 영향 | 3 | 3 | 1 | 7 | high | 2줄 변경, exact snapshot, direct/delegated smoke와 rollback 고정 |
| 전체 Pilot QA 전 제한 출시 | 3 | 2 | 1 | 6 | high | 사용자 승인 아래 controlled rollout로 한정하고 품질 확정 표현 금지 |
| 기존 stale hook hash 15건 | 1 | 2 | 1 | 4 | medium | 출시 전후 동일, 별도 maintenance로 이연 |
| planning_worker token ceiling이 runtime hard cap이 아님 | 2 | 2 | 1 | 5 | high | pilot 전용 1 spawn, no resume, 10분 제한과 종료 후 ceiling gate 사용 |

확인된 critical 리스크와 신규 health regression은 없다.
