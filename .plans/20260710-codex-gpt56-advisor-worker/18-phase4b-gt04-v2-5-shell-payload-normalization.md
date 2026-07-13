# Phase 4B GT-04 v2.5 실행 결과

## 결론

v2.5는 **PASS**다. v2.4에서 확인된 Windows `shell_command` 결과의 `payload.text` 객체 형태를 `.value`로 정규화하고, 기존 헤더 및 SHA-256 검증을 유지한 결과 no-agent probe와 조건부 delegated diagnostic이 모두 통과했다.

## 실행 증거

| 단계 | 결과 | 근거 |
|---|---|---|
| v2.4 first attempt | FAIL | `Shell payload is invalid`; [v2.4 probe-result](phase4b-gt04-v2-4/probe-result.json) |
| v2.5 preflight | PASS | bundle `PASS`, `exit 0`, `codex-cli 0.144.0-alpha.4` |
| v2.5 no-agent probe | PASS | `spawn_agent_call_count=0`, `worker_count=0`, brief hash 검증 PASS |
| v2.5 delegated diagnostic | PASS | routine_worker 완료, `mismatches=0`, `exit 0` |
| Advisor 재검증 | PASS | 실제 grader PASS, 지정된 4개 파일만 변경 |

## 변경 범위

- `transport/probe-source.mjs`, `run-source.mjs`: `payload.text` 문자열 또는 `payload.text.value`를 공통 문자열로 정규화.
- `briefs/trial-01.md`, prompt, EVAL, manifest: v2.5 bundle과 재현 조건 고정.
- Worker 변경: `fixture/trial-01/records/{east,north,south,west}.json` 4개만.

## 사용량

| 실행 | input | cached input | output | reasoning |
|---|---:|---:|---:|---:|
| no-agent parent | 119,727 | 86,272 | 1,250 | 179 |
| diagnostic parent | 247,083 | 215,040 | 2,072 | 630 |
| routine_worker | 124,430 | 99,328 | 1,676 | 466 |

## 잔여 리스크

- Worker 결과에는 child의 실제 model/effort가 노출되지 않아 `config-derived`로만 기록했다. 다음 운영 개선에서는 child runtime metadata를 결과 계약에 포함해야 한다.
- post-diagnostic 상태에서는 초기 fixture integrity 테스트가 의도대로 실패한다. 이는 fixture가 초기 상태에서 바뀌었기 때문이며, 실제 grader와 byte parity는 PASS다.
- global health check의 기존 stale trusted hash 경고는 이번 실행에서 변경하지 않았다.
