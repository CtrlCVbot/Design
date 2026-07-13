# 05. Evaluation and Rollback

## 1. Evaluation 목적

정리 후 기능 수가 줄었다는 사실만으로 성공을 선언하지 않는다. 남은 capability가 올바른 작업에서만 호출되고, project enforcement와 Advisor 검증이 유지되며, 임의 repo를 오염시키지 않는지 대표 작업으로 확인한다.

## 2. Golden Tasks

| ID | 시나리오 | 기대 route | 핵심 판정 |
|---|---|---|---|
| GT-GLOBAL-01 | 단순 질의 | direct, skill 최소 | Worker·hook·문서 생성 0 |
| GT-GLOBAL-02 | 기획 문서 review-only | direct + review | implementation Worker 0 |
| GT-GLOBAL-03 | 비단순 코드 구현 | Advisor + implementation_worker | brief, diff, focused test, scope PASS |
| GT-GLOBAL-04 | 결정적 반복 수정 | routine_worker 또는 direct | Luna route와 결과 일치, 불필요 fan-out 0 |
| GT-GLOBAL-05 | 대형 기획 명시 승인 | planning_worker opt-in | 자동 route 0, ceiling과 timeout 계약 |
| GT-GLOBAL-06 | reference frontend 작업 | fidelity capability pack | reference contract와 screenshot evidence |
| GT-GLOBAL-07 | marker 없는 임시 repo | global core only | block·warning·project 파일 생성 0 |
| GT-GLOBAL-08 | marker 있는 개발 repo | project harness | TDD/architecture fixture가 project gate에서 탐지 |
| GT-GLOBAL-09 | Design planning workflow | Design adapter | `.plans` schema는 Design에서만 적용 |
| GT-GLOBAL-10 | Windows session closeout | lightweight wrap | `/tmp`, Bash, stale model name 0 |
| GT-GLOBAL-11 | hook health audit | health-check | global/project trust 분리, nested stale report |
| GT-GLOBAL-12 | claude-kit disabled session | target architecture | core 기능 회귀 0, command surface 감소 |

## 3. Metrics

| 지표 | Baseline | 목표 |
|---|---:|---:|
| 구조 점수 | 43/100 | 85/100 이상 |
| active stale runtime refs | nested scan에서 다수 | 0 |
| global claude-kit commands | 38 | 0 |
| global custom hook | registered 7, Codex compatibility 불명확 | 기본 0; 승인된 Pilot만 예외 |
| capability metadata | 부분적 | active capability 100% |
| value evidence coverage | 15/36 이상 상태 증거 | KEEP 항목 100% Verified, 핵심은 Valuable |
| unmarked repo pollution | edit-tracker 설계상 `.ai` 생성 가능 | 생성 파일 0 |
| project hook trust false stale | 15 | 0 |
| planning automatic delegation | REJECT | 계속 0 |

skill 개수 자체는 성공 지표로 사용하지 않는다. 중복 trigger 0, active stale reference 0, owner/test/rollback coverage 100%를 우선한다.

## 4. Test Layers

### Static

- TOML과 JSON parse
- skill frontmatter와 unique name
- active source 전체의 stale tool/model/path scan
- command/agent/hook dependency graph에서 dangling reference 0
- Markdown relative link 0 broken

### Deterministic

- health-check unit test
- hook mock payload test
- custom agent schema와 model/effort route test
- project marker positive/negative fixture
- source/cache or installed artifact hash manifest

### Fresh Runtime

- fresh direct route
- fresh delegated route
- claude-kit enabled/disabled 비교
- unmarked repo no-op smoke
- project adapter discovery smoke

### Representative Work

- 코드 구현, 문서 리뷰, 대형 기획, fidelity, project gate를 각각 최소 1회
- routing 변경은 같은 fixture로 3회 반복이 필요한 경우 `pass^3` 사용
- Worker 사용은 parent와 child token/time을 합산

## 5. Promotion Rules

다음 중 하나라도 실패하면 다음 Phase로 승격하지 않는다.

- scope violation 또는 외부 상태 변경 발생
- active stale runtime reference 존재
- marker 없는 repo에서 block, warning spam, 파일 생성 발생
- project gate 회귀
- Advisor 독립 검증 누락
- rollback rehearsal 실패
- health-check가 실제 manifest와 다른 PASS를 보고

시간이나 token이 baseline보다 증가하면 품질 개선 근거가 있어도 자동 route에는 사용하지 않는다. planning Worker의 기존 `explicit opt-in` 판정을 유지한다.

## 6. Backup Manifest

각 Phase 시작 전 다음을 timestamped backup root에 보존한다.

- `C:\Users\beck\.codex\AGENTS.md`
- `C:\Users\beck\.codex\config.toml`
- `C:\Users\beck\.codex\agents`
- 변경 대상 `.agents\skills` directory
- `C:\Users\beck\.codex\local-plugins\claude-kit`
- enabled plugin ID와 version
- 파일별 relative path, size, SHA-256
- health-check 결과와 fresh smoke 결과

credential, session, memory 본문은 cleanup backup에 복사하지 않는다. 이 설계가 소유하지 않는 사용자 자산을 삭제하거나 덮어쓰지 않는다.

## 7. Rollback 단위

| 변경 | Rollback |
|---|---|
| health-check | 해당 skill snapshot 복원 후 unit test |
| skill disable/quarantine | manifest 경로로 원위치 복원 후 fresh session |
| skill merge/rewrite | 이전 두 skill 복원, 새 skill routing disable |
| claude-kit disable | config enable 복원, cache/version 확인, fresh session |
| project adapter | repo 변경 revert 또는 adapter marker disable |
| global hook Pilot | hook manifest에서 해당 entry disable 후 config trust 재검증 |
| custom agent | 이전 TOML 복원, health-check route test |

전체 `C:\Users\beck\.codex` 또는 사용자 home을 통째로 삭제하는 rollback은 금지한다.

## 8. Rollback Rehearsal

1. clean fixture와 별도 backup root를 사용한다.
2. 한 capability를 disable한다.
3. 예상 실패 또는 미노출을 확인한다.
4. manifest를 이용해 복원한다.
5. hash, health-check, fresh route를 확인한다.
6. 총 소요 시간과 수동 단계 수를 기록한다.

목표는 15분 이내, 수동 판단 2회 이하, 손실 파일 0이다.

## 9. 최종 Definition of Done

- 구조 점수 85/100 이상
- active capability가 target architecture의 한 층에만 소속
- KEEP capability의 trigger, consumer, dependency, validation, rollback 100% 기록
- active stale runtime reference 0
- unmarked repo에서 custom global side effect 0
- project harness와 Design adapter 대표 task PASS
- Advisor/Worker release smoke PASS
- claude-kit disabled trial PASS
- rollback rehearsal PASS
- 사용자 G7 최종 삭제 승인
