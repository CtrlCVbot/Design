# GT-04 v2.5 평가 계약

## 목적

v2.4에서 확인된 Windows `shell_command` 반환 형태 차이를 최소 수정으로 정규화한다. `payload.text`가 문자열인 경우와 PowerShell metadata를 포함한 객체의 `.value`인 경우를 모두 같은 Worker brief 문자열로 취급해야 한다.

## 고정 조건

- v2.4 fixture를 byte-identical하게 유지한다.
- Worker brief 내용과 경로만 v2.5 bundle에 맞춘다.
- 헤더와 SHA-256 검증은 계속 수행한다.
- no-agent probe는 Worker를 spawn하지 않는다.
- probe가 PASS일 때만 diagnostic delegated probe를 1회 실행한다.
- 재시도, repair, 파일 수정, commit, push, deploy는 금지한다.

## 판정

- `PASS`: preflight, fresh no-agent probe, 조건부 diagnostic probe가 각각 계약을 만족한다.
- `FAIL`: preflight 또는 probe가 실패하거나 payload 정규화가 기존 검증을 우회한다.
- v2.4의 `Shell payload is invalid`는 first-attempt evidence로 보존하고 v2.5 결과와 분리한다.
