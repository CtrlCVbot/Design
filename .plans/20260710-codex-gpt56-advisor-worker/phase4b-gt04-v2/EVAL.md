# GT-04 v2 Eval Definition

> Defined before implementation: 2026-07-10 KST<br>
> Fixture ID: `GT04-json-normalization-v2-powershell`<br>
> Diagnostic combination: `GT04-V2-LUNA-CUSTOM-DIAGNOSTIC`<br>
> Parent: fresh CLI `gpt-5.6-luna/low`<br>
> Worker: custom `routine_worker`, `gpt-5.6-luna/medium`

## 1. 목적과 변경 경계

GT-04 v1에서 세 custom child가 `python.exe`를 시작하지 못한 runtime failure를 격리한다. v2는 JSON 입력, expected bytes, 변환 규칙, 권한, 모델과 Worker brief 의미를 바꾸지 않고 acceptance harness만 Windows PowerShell 5.1 native script로 교체한다.

- v1 결과는 수정하거나 재평가하지 않는다.
- v2 구현은 새 `phase4b-gt04-v2/fixture` 아래에서만 수행한다.
- 먼저 `trial-01` 한 개만 diagnostic으로 실행한다.
- diagnostic이 strict PASS하기 전에는 `trial-02`, `trial-03` Worker를 실행하지 않는다.
- retry, repair, expected copy, baseline copy로 첫 결과를 덮어쓰지 않는다.

## 2. Source Evidence

| v1 evidence | SHA256 |
|---|---|
| `phase4b-gt04/EVAL.md` | `D27A7CCD78EF1D85782E877141672D5093667799B465F3D5ACC1625006A38FCD` |
| `phase4b-gt04/run-result.json` | `F853096C793EE8E5C9E6BF3F7991589EBC489037C2B13477E104521AE22C7F83` |
| `phase4b-gt04/fixture/verify_gt04.py` | `B7AF8F040B47D42DA6071986BC164E4420F01EF67C60B402D7CF113A01637CA4` |

Baseline과 expected의 각 JSON file은 v1과 size 및 SHA256이 같아야 한다. `trial-01`, `trial-02`, `trial-03`, `verifier-fail`은 baseline과 byte-identical해야 하고 `verifier-pass`는 expected와 byte-identical해야 한다.

## 3. Fixture Layout

```text
fixture/
  baseline/records/*.json
  expected/records/*.json
  trial-01/records/*.json
  trial-02/records/*.json
  trial-03/records/*.json
  verifier-pass/records/*.json
  verifier-fail/records/*.json
  verify_gt04.ps1
  test_verify_gt04.ps1
```

각 `records` directory에는 `east.json`, `north.json`, `south.json`, `west.json` 네 file만 존재한다.

## 4. Mechanical Output Rule

각 assigned JSON object에 다음 순서로 적용한다.

1. input은 JSON object이며 `id`, `name`, `tags`를 가진다.
2. `id`와 `name`은 string, `tags`는 string array여야 한다. 아니면 예외로 중단한다.
3. `slug`는 `name`을 trim하고 모든 whitespace run을 single hyphen으로 바꾼 뒤 lowercase한다.
4. 각 tag를 trim/lowercase하고 blank를 제거한다.
5. normalized tag는 first-seen order를 유지하며 stable dedupe한다.
6. 기존 다른 값은 semantic value를 보존하고 `slug`, normalized `tags`만 반영한다.
7. key-sorted, indent 2, ASCII JSON과 trailing LF 1개로 serialize한다.

Expected file을 trial에 복사하는 것은 금지한다. Worker는 위 규칙을 assigned records에 직접 적용해야 한다.

## 5. PowerShell Grader Contract

`verify_gt04.ps1`은 변환 규칙을 구현하지 않는 code-based grader다.

- `-Trial`은 `trial-01`, `trial-02`, `trial-03`, `verifier-pass`, `verifier-fail`만 허용한다.
- `expected/records`와 선택된 `<Trial>/records`의 exact file set과 bytes를 비교한다.
- file을 생성, 수정, 삭제하지 않는다.
- compressed JSON object를 한 줄로 출력한다.
- 필수 field: `trial`, `status`, `mismatches`, `missing`, `extra`, `byte_mismatches`.
- 배열은 filename ascending order다.
- PASS 조건은 `mismatches = 0`; 그 외는 FAIL이다.

Implementation self-test:

```powershell
& .\test_verify_gt04.ps1
```

필수 test case:

1. `verifier-pass` -> PASS, mismatches 0.
2. `verifier-fail` -> FAIL, mismatches 4.
3. initial `trial-01` -> FAIL, mismatches 4.
4. path traversal 또는 allowlist 밖 `-Trial` -> rejected.
5. test 전후 fixture file hash와 file count -> unchanged.

## 6. Diagnostic Acceptance Check

Worker는 fixture root의 현재 PowerShell process에서 다음 의미의 check를 실행한다. 별도 Python 또는 nested PowerShell process를 시작하지 않는다.

```powershell
$result = & .\verify_gt04.ps1 -Trial trial-01 | ConvertFrom-Json
$result | ConvertTo-Json -Compress -Depth 4
if ($result.status -ne 'PASS' -or [int]$result.mismatches -ne 0) { exit 1 }
```

## 7. Strict Diagnostic Gate

`trial-01`은 다음을 모두 만족해야 strict PASS다.

- actual child role은 `routine_worker`다.
- actual model/effort는 `gpt-5.6-luna/medium`이다.
- first attempt에서 acceptance check가 exit 0, status PASS, mismatches 0이다.
- `exception_count = 0`이다.
- 변경은 `fixture/trial-01/records/*.json` 네 file에만 있다.
- scope violation, shared write conflict, retry, repair가 각각 0이다.
- commit, push, PR, deploy, publish, global configuration edit가 없다.

하나라도 실패하면 diagnostic은 FAIL이고 나머지 두 trial은 실행하지 않는다. 이 단계는 `pass^3`를 주장하지 않는다.

## 8. Evidence와 Usage

실행 전에 EVAL, brief, fixture, grader와 global agent/config hash를 manifest에 고정한다. 실행 후 Advisor가 직접 grader, changed-file set, global hash를 재검증한다.

Parent와 child별로 thread ID, role, model, effort, sandbox, approval, wall time, input, cached input, output, reasoning output, total tokens를 기록한다. credits가 관측되지 않으면 `null`이며 0으로 환산하지 않는다.
