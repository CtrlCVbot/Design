# Nested fixture evidence harvest

## 목적

Advisor/Worker 검증 과정에서 생성된 nested Git fixture의 실험 입력·출력과 verifier를 상위 저장소에서 복구할 수 있는 일반 파일로 보존한다.

## 공통 기준

- source HEAD: `99421d4`
- source branch: `feat/nbbb1-dispatches-implementation-plan`
- source remote: `origin`
- harvested scope: nested repository의 untracked files
- excluded scope: nested `.git` metadata와 공통 tracked checkout

공통 tracked checkout은 원격 commit `99421d4`에서 복구할 수 있다. 각 fixture의 tracked 변경 4개는 상위 WIP와 동일하며 별도 consolidation 커밋에서 보존한다.

## Harvest inventory

| Evidence directory | Files | 원본 역할 |
|---|---:|---|
| `phase4b-gt04__fixture` | 21 | GT04 baseline, expected, trial, Python verifier |
| `phase4b-gt04-v2-5__fixture` | 30 | GT04 v2.5 pass/fail fixture와 PowerShell verifier |
| `phase5-1-planning-worker__fixture` | 10 | planning worker evidence와 output |
| `phase5-1-planning-worker__paired-trials__delegated-01` | 9 | delegated trial 01 |
| `phase5-1-planning-worker__paired-trials__delegated-02` | 9 | delegated trial 02 |
| `phase5-1-planning-worker__paired-trials__delegated-03` | 9 | delegated trial 03 |
| `phase5-1-planning-worker__paired-trials__direct-01` | 9 | direct trial 01 |
| `phase5-1-planning-worker__paired-trials__direct-02` | 9 | direct trial 02 |
| `phase5-1-planning-worker__paired-trials__direct-03` | 9 | direct trial 03 |

총 `115`개 실험 파일을 수집했다. 이 README를 포함한 evidence 패키지는 `116`개 파일이다.

## 안전 기준

1. 상위 저장소에 file mode `160000` gitlink를 추가하지 않는다.
2. nested `.git` directory를 복사하거나 vendor하지 않는다.
3. verifier는 보존된 상대경로 안에서 재실행할 수 있어야 한다.
4. 원본 fixture를 삭제하기 전에 harvested file count와 source untracked file count를 대조한다.
