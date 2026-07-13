# 08. Phase 2 Legacy Routing 격리 결과

> 실행일: 2026-07-13 KST<br>
> 상태: **완료 — 4개 consumer-free legacy skill 격리, 1개 consumer-bound skill 보류**

## 결과

`cc-dev-agent`, `team-orchestrator`, `strategic-compact`, `using-superpowers`를 `C:\Users\beck\.agents\skills`에서 `C:\Users\beck\.agents\quarantine\20260713-phase2-legacy-routing`으로 `Move-Item`만 사용해 이동했다. 삭제는 수행하지 않았다.

| 구분 | 값 |
|---|---:|
| 이동 skill | 4 |
| 이동 파일 | 12 |
| 이동 파일 크기 합계 | 57,666 bytes |
| active skill | 67 → 63 |
| hook trust | global/project/unknown = 7/15/0 (변화 없음) |
| health-check unit test | 19/19 PASS |
| enabled plugin | 14 |
| active scan files | 440 |
| fresh-context smoke | PASS, broken active consumer 0 |

## 보류 결정

`continuous-learning-v2`는 claude-kit continuous-learning compatibility skill과 session-wrap 문서 consumer가 확인돼 consumer-free gate를 통과하지 못했다. 따라서 원 경로에 그대로 두고 `DEFERRED_CONSUMER_BOUND`로 기록했다. 11개 파일의 tree digest는 `BDCB5C32A1F2118721DC30BAC04BB22B9EE7FFEFA5330B5C2EB291624A1B0A28`로 확인했다.

claude-kit agent/hook은 consumer가 남아 있으므로 Phase 4 분해 전까지 이동하거나 편집하지 않았다. Capability `CK-007`은 agent-completion-cache-invalidate compatibility 문서와 plan-review-trigger/plan-draft 문서 consumer를 근거로 `Deferred/QUARANTINE`으로 기록했다.

## 증거와 rollback

- 이동 전 file mapping: [before-manifest.json](./phase2-legacy-routing/before-manifest.json)
- 실행 결과: [result.json](./phase2-legacy-routing/result.json)
- quarantine mapping: `C:\Users\beck\.agents\quarantine\20260713-phase2-legacy-routing\quarantine-manifest.json`

`before-manifest.json`의 `protected_before`와 `result.json`의 `protected_after`는 config, AGENTS, custom agents, claude-kit, agentic-health, continuous-learning의 Advisor 검증 SHA-256을 기록한다. 두 집합은 동일하며 `protected_hashes_unchanged=true`다. Worker model 정보는 runtime 보고가 아니라 config-derived 증거로 구분했다.

별도 read-only fresh-context agent(`019f58c6-aa7a-7120-b404-91414de802eb`)가 live filesystem을 다시 읽어 core routing skill 5개, custom agent 3개, Design `AGENTS.md`와 `.codex/hooks.json`을 확인했다. 격리한 네 skill 이름을 참조하는 active consumer는 0건이었다.

각 rollback은 `quarantine-manifest.json`의 `quarantine_path` 디렉터리를 대응하는 `original_path` 부모로 `Move-Item`한 뒤, 모든 `sha256` 및 `size_bytes`를 재검증한다. mapping digest는 `6C2DF8D8873DD3F86F233CF5844D302B0E459682B05A8E6809F4B7D68887FD69`이다.

## 범위 확인

`C:\Users\beck\.codex\config.toml`, `C:\Users\beck\.codex\AGENTS.md`, custom agents, claude-kit source/cache, platform-managed cache, non-target global skills는 수정하지 않았다.
