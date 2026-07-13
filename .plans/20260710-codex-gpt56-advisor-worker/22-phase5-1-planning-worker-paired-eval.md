# Phase 5.1 planning_worker Paired Eval

> 실행일: 2026-07-10 KST<br>
> 판정: **품질 PASS, 자동 라우팅 REJECT, explicit opt-in 유지**

## Timeout Negative Eval

`planning_worker`가 30초 timing probe를 실행하는 동안 parent가 10초만 기다렸다. timeout 후 `interrupt_agent`가 1회 실행됐고 previous status는 `running`, child는 interrupted 상태가 됐다. 파일 변경·retry·resume·follow-up은 0이다.

## Paired 결과

| Run | Mode | Grader | Model | Total tokens | 시간 |
|---|---|---|---|---:|---:|
| direct-01 | direct | PASS | Terra/medium | 228,811 | 70.0초 |
| delegated-02 | delegated | PASS | parent/child Terra/medium | 395,072 | 115.8초 |
| delegated-03 | delegated | PASS | parent/child Terra/medium | 400,292 | 119.4초 |
| direct-03 | direct | PASS | Terra/medium | 263,673 | 90.8초 |
| direct-02 | direct | PASS | Terra/medium | 229,568 | 75.8초 |
| delegated-01 | delegated | PASS | parent/child Terra/medium | 426,015 | 98.4초 |

두 mode 모두 `pass^3=100%`, scope violation 0, model drift 0이다. 모든 delegated Worker는 300k ceiling 이하이고 parent 포함 450k ceiling도 통과했다.

## 중앙값 비교

| 지표 | Direct | Delegated | Delegated/Direct | Gate |
|---|---:|---:|---:|---|
| Total tokens | 229,568 | 400,292 | 174.37% | FAIL |
| Wall time | 75.8초 | 115.8초 | 152.92% | FAIL |
| Grader | 3/3 | 3/3 | 동등 | PASS |

사전 EVAL은 delegated가 시간 10% 개선 또는 total token 비증가 중 하나를 만족하고, 개선되지 않은 지표도 direct의 150% 이하여야 한다고 정의했다. Delegated는 두 개선 조건을 모두 충족하지 못했고 token과 시간이 모두 150%를 초과했다.

## 최종 결정

- `planning_worker` 자체는 기능적으로 유효하며 timeout·scope·model guard도 작동한다.
- 작은 synthetic 5문서 패키지에서는 direct Terra/medium보다 느리고 총 token이 많다.
- 전역 docs-only 자동 라우팅은 활성화하지 않는다.
- 사용자가 명시적으로 요청하고 context isolation, 병렬 evidence 수집, 메인 세션 보존이 비용보다 중요한 대형 기획에서만 opt-in 사용한다.
- 비용 절감 주장은 금지한다. `credits_source=unavailable`을 유지한다.

## Risk-based Self-review

| 항목 | Impact | Reach | Recovery | Total | Severity | 처리 |
|---|---:|---:|---:|---:|---|---|
| 자동 라우팅 시 74% token 증가 중앙값 | 3 | 3 | 1 | 7 | high | 자동 라우팅 REJECT, explicit opt-in 유지 |
| synthetic fixture가 실제 대형 기획을 완전히 대표하지 않음 | 2 | 2 | 1 | 5 | high | 실제 대형 기획에서는 별도 사용자 승인과 run별 사용량 보고 |
| credits 직접 계측 없음 | 2 | 2 | 1 | 5 | high | 비용 판정 금지, token만 관측값으로 기록 |
| delegated-01 post-completion cache TTL 경고 | 1 | 1 | 1 | 3 | medium | grader와 결과 영향 없음, 반복 시 runtime 진단 |

확인된 critical 리스크와 global health regression은 없다.
