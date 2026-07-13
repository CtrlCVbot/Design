# planning_worker Timeout Negative Eval

## 목적

`wait_agent` 10초 timeout이 발생하면 parent가 실행 중인 `planning_worker`를 종료하고 재시도 없이 FAIL-safe 결과를 남기는지 검증한다.

## 고정 조건

- parent와 child sandbox는 read-only다.
- Worker는 `Start-Sleep -Seconds 30` 외 도구·파일 작업을 하지 않는다.
- parent는 child 1개만 spawn하고 10초만 기다린다.
- timeout이면 즉시 close/interrupt하고 previous status를 기록한다.
- follow-up, resume, retry, repair는 금지한다.

## PASS

- timeout이 실제 발생한다.
- close/interrupt가 1회 실행된다.
- child가 interrupted 또는 shutdown 상태가 된다.
- 파일 변경과 후속 Worker가 없다.
