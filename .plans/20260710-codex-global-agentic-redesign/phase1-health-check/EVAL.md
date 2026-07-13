# Phase 1 Health-check EVAL

## Scope

`C:\Users\beck\.agents\skills\agentic-health-check`의 진단 정확도만 평가한다. config, AGENTS, custom agents, claude-kit, 다른 skill은 보호 대상이다.

## Required Behaviors

| ID | 동작 | PASS 기준 |
|---|---|---|
| HC-01 | Global plugin hook trust 분류 | claude-kit registered hook 7개를 global expected로 계산 |
| HC-02 | Project hook trust 분류 | Design `.codex\hooks.json` 15개를 project expected로 계산 |
| HC-03 | Unknown trust 분류 | live 상태 unknown/stale 0, fixture missing/drift는 1 이상 |
| HC-04 | Nested active scan | references, agents, registered hooks의 stale token을 탐지 |
| HC-05 | Inactive hook 분리 | unregistered hook token을 inactive로만 집계 |
| HC-06 | Narrow allowlist | health-check self reference만 명시적 이유로 제외하고 fixture로 검증 |
| HC-07 | Existing contracts | custom-agent tests와 exit-code 계약 회귀 0 |
| HC-08 | Scope | allowed 4개 global file 밖 변경 0 |
| HC-09 | Documentation | SKILL과 manual checks가 global/project/unknown, active/inactive를 설명 |

## Advisor Verification

1. before snapshot과 허용 4개 파일의 diff를 직접 확인한다.
2. protected aggregate hash 4개를 다시 계산한다.
3. 전체 unit test를 fresh process에서 실행한다.
4. live health-check를 실행해 hook 분류와 active/inactive stale 결과를 확인한다.
5. Simple Design과 risk review를 수행한다.

## Promotion

HC-01~HC-09가 모두 PASS일 때만 Phase 1을 완료한다. 실패 시 evidence가 포함된 repair brief를 Worker에게 재위임한다. Advisor는 동작 코드를 직접 수정하지 않는다.
