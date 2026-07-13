# Phase 2 Legacy Routing Evaluation

## 범위

- 이동 대상: `cc-dev-agent`, `team-orchestrator`, `strategic-compact`, `using-superpowers`
- 제외 대상: `continuous-learning-v2` — claude-kit compatibility 및 session-wrap 문서 consumer가 확인되어 Phase 2에서는 active/deferred로 유지한다.
- 금지 대상: `claude-kit`, `C:\Users\beck\.codex\config.toml`, `C:\Users\beck\.codex\AGENTS.md`, custom agents, 대상 외 global skill

## 사전 조건

1. [before-manifest.json](./before-manifest.json)의 12개 파일 SHA-256 및 크기를 이동 전 고정한다.
2. `continuous-learning-v2`는 원 경로에 남고, 11개 파일 tree digest `BDCB5C32A1F2118721DC30BAC04BB22B9EE7FFEFA5330B5C2EB291624A1B0A28`를 유지한다.
3. 이동은 `Move-Item`만 사용하며 삭제하지 않는다.

## 합격 기준

| 검증 | 기대 결과 |
|---|---|
| 대상 경로 | 네 source directory는 skill root에서 없고 quarantine root에만 존재 |
| 매니페스트 | before/result/quarantine manifest의 파일 수·원본/격리 경로·SHA-256·크기 mapping이 동일 |
| health-check | exit 0, active skills 63, hook trust global/project/unknown 7/15/0 |
| 회귀 방지 | claude-kit/config/AGENTS/custom agents/non-target skill 변경 없음 |
| 계획 JSON | 159 entries, 평균 54.5, DELETE 6, QUARANTINE 30, Deferred 1의 current-state 표기 |

## 실행 검증

```powershell
$env:PYTHONDONTWRITEBYTECODE = '1'
python C:\Users\beck\.agents\skills\agentic-health-check\tests\test_agentic_health_check.py
$env:PYTHONIOENCODING = 'utf-8'
python C:\Users\beck\.agents\skills\agentic-health-check\scripts\agentic_health_check.py
```

`result.json`과 quarantine root의 `quarantine-manifest.json`은 실행 후 이 기준을 기계 판독 가능한 결과로 기록한다.
