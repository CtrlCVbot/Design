# 07. Phase 1 Health-check 결과

> 완료일: 2026-07-10 KST<br>
> 범위: `C:\Users\beck\.agents\skills\agentic-health-check`<br>
> 판정: **PASS - Phase 2 진입 가능**

## 변경 요약

| 영역 | 작업 전 | 작업 후 | 판정 |
|---|---:|---:|---|
| hook trust | plugin expected 7, project 15를 stale로 오분류 | global 7 / project 15 / unknown 0 | PASS |
| unit tests | 9 | 19 | PASS |
| runtime reference | top-level skill/command 중심 | nested active + custom agent + registered/inactive hook | PASS |
| self exclusion | health-check 디렉터리 전체 암묵 제외 | 이유가 명시된 정확한 4개 파일 allowlist | PASS |
| 보호 대상 변경 | 기준선 | hash 4종 동일 | PASS |

## 구현 파일

| 파일 | 변경 |
|---|---|
| `scripts/agentic_health_check.py` | hook trust 분류, nested runtime scan, active/inactive 분리, 좁은 allowlist |
| `tests/test_agentic_health_check.py` | project manifest, drift, nested asset, inactive hook, empty manifest, regex/allowlist 회귀 test |
| `SKILL.md` | 새 진단 계약과 판정 규칙 |
| `references/checks.md` | 수동 검사와 결과 해석 기준 |

## 실환경 결과

| 지표 | 결과 |
|---|---:|
| trusted hook | 22/22 current |
| global / project / unknown | 7 / 15 / 0 |
| active scan | 14 hits / 449 scanned files |
| inactive scan | 7 hits / 7 unregistered hook files |
| custom agent route | 3/3 PASS |
| skill / command stale | 0 / 0 |

`active 14`는 `codex@openai-codex` companion plugin의 command 5개와 skill 2개에 남은 Claude 호환 참조다. `inactive 7`은 등록되지 않은 claude-kit hook 5개에서 발견된 7개 참조이며, active 상태를 악화시키지 않는다. 두 집합 모두 Phase 2에서 consumer와 의존성을 확인한 뒤 격리 여부를 결정한다.

## 검증

| 검증 | 결과 |
|---|---|
| fresh unit test | `19/19 PASS` |
| Python compile | PASS |
| skill validator | `Skill is valid!` |
| live health-check | core/config/custom agents/skills/commands PASS, runtime refs WARN |
| protected SHA-256 | config, AGENTS, custom agents, claude-kit 모두 작업 전과 동일 |
| diff review | 허용된 전역 파일 4개만 변경 |
| repair loop | 2회, Advisor 재현 증거로 Worker에게 재위임 |

Skill validator는 기본 Python에 `PyYAML`이 없어 첫 실행이 실패했다. 전역 Python을 변경하지 않고 임시 경로에 `PyYAML 6.0.3`을 설치해 같은 validator를 재실행했고 통과했다.

## 리스크 리뷰

Critical/High finding은 없다. 잔여 WARN은 탐지기의 오류가 아니라 Phase 2 입력으로 보존한 legacy compatibility reference다. rollback은 `phase1-health-check/before`의 4개 파일과 manifest로 가능하다.

## Gate

HC-01~HC-09는 모두 PASS다. Phase 2는 별도 승인 후 `disable -> fresh session smoke -> quarantine` 순서로만 진행하며, 이 단계에서는 실제 삭제하지 않는다.
