# 12. Phase 4-B GT-04 Luna 최소 Pilot 결과

> 실행일: 2026-07-10 KST<br>
> Fixture: `GT04-json-normalization-v1`<br>
> Combination: `GT04-LUNA-CUSTOM-PILOT`<br>
> 판정: **FAIL, Phase 5 진입 불가**

## 1. 결론

Custom `routine_worker` 3개는 모두 정확히 `gpt-5.6-luna/medium`으로 로드됐고, disjoint path와 Worker 3개 soft cap을 지켰다. 그러나 세 child 모두 Windows child runtime에서 Python command를 시작하지 못해 `blocked`, `exception_count = 1`로 종료했다.

Strict GT-04 결과:

| 지표 | 결과 | Gate |
|---|---:|---|
| `task_pass_at_1` | 0/3, 0% | FAIL |
| `pass^3` | false, 0% | FAIL |
| byte-exact output | 1/3 | 참고 지표 |
| `exception_count` | 3 | FAIL |
| `scope_violations` | 0 | PASS |
| `write_conflicts` | 0 | PASS |
| `worker_count` | 3 | PASS |
| repair loop | 0 | PASS, first-attempt 보존 |

이 pilot은 실패다. 실패 trial은 삭제하거나 재시도로 덮어쓰지 않았으며 [run-result.json](./phase4b-gt04/run-result.json)에 원본 판정을 보존했다.

## 2. Eval Definition과 Fixture

- 사전 정의: [EVAL.md](./phase4b-gt04/EVAL.md)
- Fixture Worker brief: [WB-phase4b-fixture-001.md](./phase4b-gt04/WB-phase4b-fixture-001.md)
- Trial briefs: [trial-01](./phase4b-gt04/briefs/trial-01.md), [trial-02](./phase4b-gt04/briefs/trial-02.md), [trial-03](./phase4b-gt04/briefs/trial-03.md)
- Pre-run state: [pre-run-manifest.json](./phase4b-gt04/pre-run-manifest.json)

Fixture는 4개의 JSON 입력에 같은 mechanical normalization을 적용한다. Expected files는 Worker 실행 전에 물질화했고 verifier는 규칙을 재구현하지 않고 file set과 exact bytes만 비교한다.

Advisor 사전 검증:

| 검사 | 결과 |
|---|---|
| EVAL definition hash | `D27A7CCD78EF1D85782E877141672D5093667799B465F3D5ACC1625006A38FCD` |
| expected independent calculation | PASS |
| expected aggregate SHA256 | `9B877691800B58AEBA43DD97A52B9C714BCFF6EFA9C3BF35C03A7D92281C3BA5` |
| baseline = trial-01/02/03 | PASS |
| initial per-trial grader | 4 mismatches |
| initial all-trial grader | 12 mismatches |
| cache·lockfile·functional nested Git | 0 |

Advisor의 첫 independent checker는 실제 fixture layout을 `trials/trial-*`로 잘못 가정해 1회 실패했다. EVAL은 directory 위치를 고정하지 않았고 실제 layout은 `fixture/trial-*`다. 경로 가정만 수정한 뒤 expected byte 계산이 PASS했으며 eval fixture나 결과는 수정하지 않았다.

Subagent sandbox가 읽기 경로를 구성하면서 fixture root에 빈 `.git`, `.agents` directory를 생성했다. 두 directory에는 file이 없고 `git rev-parse` 결과도 상위 Design repo를 가리키므로 nested repo나 agent configuration 변경으로 계산하지 않았다. 다만 이 런타임 부산물은 v2 scope checker에서 별도로 기록한다.

## 3. 실행 통제

| 항목 | 값 |
|---|---|
| Parent | fresh CLI, Luna/low |
| Children | custom `routine_worker` x3, Luna/medium |
| Seeded order | trial-02 → trial-01 → trial-03 |
| Concurrency | 3, disjoint directories |
| Sandbox / approval | workspace-write / never |
| Service tier | current global priority 상속 |
| Retry / repair | 금지, 0회 |
| Remote·production·commit·push | 금지 |

Parent thread: `019f49c2-fc44-7ee2-8c6d-6c32ef0f5282`

## 4. Trial 결과

| Trial | Child thread | Nickname | Child report | Advisor byte grader | Strict 판정 |
|---|---|---|---|---|---|
| trial-02 | `019f49c3-65bb-7140-886d-ca13ad9f04c6` | `routine_runner` | 변환 전 Python launch 실패, 변경 0 | 4 mismatch | FAIL |
| trial-01 | `019f49c3-6bdd-7660-a687-3629eacf6411` | `scope_stopper` | 변환 후 acceptance launch 실패 | 0 mismatch | FAIL |
| trial-03 | `019f49c3-7169-7931-b681-8346077e90f6` | `rule_executor` | 변환 후 acceptance launch 실패 | 1 mismatch | FAIL |

Trial-03의 `north.json`에는 trailing comma가 남아 invalid JSON이었다.

```diff
     "priority",
-    "night"
+    "night",
```

따라서 Python acceptance 환경이 정상이어도 trial-03은 통과하지 못한다. Verifier를 생략해서는 안 된다는 점도 함께 확인됐다.

## 5. Runtime Failure

세 child에서 반복된 오류:

```text
'python.exe' 프로그램을 실행하지 못했습니다.
지정한 로그온 세션이 없습니다. 이미 종료되었을 수도 있습니다.
```

Main Advisor 환경과 Phase 3 built-in Worker에서는 Python 실행이 가능했지만, 이번 fresh CLI custom child의 `workspace-write` runtime에서는 동일 command가 시작되지 않았다. Trial-02는 규칙에 따라 변환 전에 즉시 중단했고, Trial-01/03은 변환 뒤 acceptance 단계에서 중단했다.

이 결과로 Custom role discovery와 Luna routing은 PASS지만, 현재 Windows child command runtime에서 Python 기반 GT-04 harness는 운영 가능하다고 승인할 수 없다.

## 6. Scope 검증

Pre-run manifest 대비 변경 파일은 8개다.

- `trial-01/records/*.json` 4개
- `trial-03/records/*.json` 4개

Trial-02, baseline, expected, verifier, EVAL, briefs, 전역 config·agents·skills는 변경되지 않았다.

| 범위 지표 | 결과 |
|---|---:|
| added files | 0 |
| deleted files | 0 |
| allowed-path changes | 8 |
| scope violations | 0 |
| write conflicts | 0 |
| global hash drift | 0 |

## 7. Usage

| Thread | Role | Input | Cached input | Output | Total |
|---|---|---:|---:|---:|---:|
| Parent | Luna/low Advisor | 623,600 | 578,816 | 1,805 | 625,405 |
| trial-02 | Luna/medium | 123,187 | 99,328 | 1,332 | 124,519 |
| trial-01 | Luna/medium | 353,305 | 335,104 | 2,772 | 356,077 |
| trial-03 | Luna/medium | 186,273 | 173,568 | 1,438 | 187,711 |
| **합계** | | **1,286,365** | **1,186,816** | **7,347** | **1,293,712** |

- Cached input ratio: 92.26%
- Wall time: 123.392 seconds
- `credits_source = unavailable`
- `total_credits = null`, 0으로 계산하지 않음

비교 조합이 없으므로 비용 절감 주장을 하지 않는다. 실패한 단일 GT-04 pilot에 129만 tokens가 사용됐기 때문에 같은 fresh CLI 구조의 즉시 재실행은 중단했다.

## 8. Advisor 검증

Advisor가 직접 수행한 작업:

- EVAL과 Worker brief 사전 고정
- expected bytes 독립 계산
- baseline·trial SHA256 동등성 확인
- initial RED 12건 재현
- parent와 child 3개의 rollout metadata·usage 파싱
- 모델·effort·role·sandbox·approval 확인
- per-trial 및 all-trial byte grader 실행
- invalid JSON diff 직접 확인
- pre-run manifest 기반 범위 비교
- 전역 파일 hash 재확인

Worker `blocked` 보고만으로 판정하지 않았으며, trial-01의 정확한 출력과 trial-03의 잘못된 출력을 별도로 확인했다.

## 9. Risk-based Self-review

| 리스크 | Impact | Reach | Recovery | Total | Severity | 처리 |
|---|---:|---:|---:|---:|---|---|
| Custom child에서 Python command runtime 불가 | 3 | 2 | 1 | 6 | high | v1 FAIL 보존, PowerShell-native harness로 교체 |
| Verifier 미실행 상태에서 invalid JSON 생성 가능 | 3 | 1 | 1 | 5 | high | acceptance preflight와 byte/parse verifier 필수 |
| Fresh CLI parent+3 children 사용량 129만 tokens | 3 | 2 | 1 | 6 | high | 즉시 3-trial 재실행 금지, 1-trial diagnostic gate 추가 |
| Custom role이 현재 앱 API에 직접 노출되지 않음 | 2 | 1 | 1 | 4 | medium | fresh CLI 필요 상태 유지 |

확인된 critical 리스크는 없다. 이 결과로 Phase 5 기본값 전환을 승인하지 않는다.

## 10. 다음 Gate

GT-04 v2 remediation은 다음 순서로 제한한다.

1. Python dependency를 제거하고 PowerShell-native hash·JSON verifier를 만든다.
2. 같은 fixture를 새 trial snapshot으로 복원한다. v1 결과는 수정하지 않는다.
3. Custom `routine_worker` 1개만 diagnostic trial로 실행한다.
4. role Luna/medium, `exception_count = 0`, exact byte PASS, scope 0을 확인한 뒤에만 나머지 2개를 실행한다.
5. 세 trial이 모두 first-attempt PASS일 때만 `pass^3 = 100%`로 승격한다.

Phase 4-B는 현재 **진행 중·차단 해소 필요** 상태다.
