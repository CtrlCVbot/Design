# Phase 3 Core Skill Contract EVAL

## 범위

Phase 3 구현 전 계약의 완전성과 내부 정합성만 검증한다. 전역 skill, config, plugin, hook은 수정하지 않는다.

## Contract Gate

| ID | 검증 | PASS 기준 |
|---|---|---|
| PC-01 | target 수 | 정확히 4개, 이름·path 중복 0 |
| PC-02 | 공통 필드 | responsibility, triggers, inputs, workflow, outputs, non_goals, sources, acceptance, rollback 존재 |
| PC-03 | acceptance ID | `SEC`, `VER`, `LIFE`, `CLOSE` prefix와 전체 unique |
| PC-04 | side effect | 자동 write·commit·push·PR·deploy·memory write 금지 명시 |
| PC-05 | runtime | stale slash command/model/Unix 경로는 preserve 대상이 아니라 discard/non-goal 증거로만 존재 |
| PC-06 | migration | 새 target PASS 전 source 유지, 삭제 대신 quarantine, claude-kit은 Phase 4 보류 |
| PC-07 | 최소 구조 | target당 최대 3개 파일, 전체 최대 12개 |
| PC-08 | dependency | `security-review`가 `verification-router`보다 먼저 구현되고 official `skill-creator`를 복제하지 않음 |
| PC-09 | 문서 정합성 | README, roadmap, scorecard, file-inventory의 status/ref가 일치 |
| PC-10 | scope | Phase 3 planning package 밖 변경 0 |

## 검증 명령

1. `contracts.json`, `source-baseline.json`, `inventory.json`, `file-inventory.json` JSON parse
2. target/acceptance ID uniqueness와 required field 검사
3. Markdown 상대 링크 존재 검사
4. `git status --short -- .plans/20260710-codex-global-agentic-redesign`로 문서 범위 확인
5. `agentic-health-check`로 전역 runtime이 Phase 2 상태 그대로인지 확인
6. `source-baseline.json`의 10개 directory tree digest와 33-file/173,510-byte 합계 재계산

## Promotion

PC-01~PC-10이 모두 PASS이고 사용자가 G3 계약을 승인한 뒤에만 첫 구현 단위 `security-review`를 시작한다.
