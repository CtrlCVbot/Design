# 07. Phase 0 기준선 실행 결과

> 실행일: 2026-07-10 KST
> 범위: 백업, 현재 상태, GPT-5.6 접근성, credits 계측 가능성, 격리 fixture, GPT-5.5 B0 부분 기준선
> 판정: **완료, credits calibration 제한 있음**

## 1. 결론

- `gpt-5.6-sol/high`, `gpt-5.6-terra/medium`, `gpt-5.6-luna/medium`은 Codex CLI와 app subagent 경로에서 모두 실행 가능했다.
- 전역 `AGENTS.md`, `config.toml`, 기본 모델, `[agents]`, custom agent의 최종 상태는 변경 전과 동일하다.
- 현재 기본 묶음인 `gpt-5.5/xhigh/priority`로 GT-01, GT-02, GT-05를 실행했고 Advisor 독립 검증까지 모두 통과했다.
- CLI token usage는 수집했지만 Usage panel delta를 읽지 못해 token-to-credit 산식은 calibration하지 못했다. 비용 비교용 `credits_source`는 `unavailable`로 유지하고, 아래 credits는 참고용 미검증 산출값으로만 기록한다.
- 따라서 Phase 1 역할 정책 문서·skill 작업은 진행 가능하지만, 25% credits 절감 목표 판정과 전역 기본 모델 변경은 아직 승인할 수 없다.

## 2. 전역 상태와 체크포인트

### 현재 상태

| 항목 | 기준선 |
|---|---|
| 기본 모델 | `gpt-5.5` |
| reasoning effort | `xhigh` |
| service tier | `priority` |
| `[agents]` | 미설정 |
| custom agents | `C:\Users\beck\.codex\agents` 미존재 |
| `AGENTS.md` | 9,188 bytes, SHA256 `73233109CE6DE17E01EA83ECB8D7FDD627C158A0010683676A1EDD8B5815EA6E` |
| `config.toml` | 10,246 bytes, SHA256 `5B16E56FF4279422E9FF4E92B641C0C26D41B3378A51363AA5BC124A0865557E` |
| 민감 키 이름 scan | 발견 없음 |

### Health-check 기준선

| 영역 | 결과 | 비고 |
|---|---|---|
| AGENTS | PASS | 92 lines, core-sized |
| config | WARN | hook trust 22건 중 stale 15건 |
| skills | PASS | 66 total, stale file 0 |
| commands | PASS | 42 total |
| memories | PASS | rollout file 41 |
| plugins | PASS | manifest error 0 |
| duplicate skill name | PASS | 0건 |
| stale Claude/Gemini reference | PASS | 0건 |

hook stale 15건은 Advisor/Worker 변경 전부터 존재한 기준선이다. 이번 Phase 0 결과로 새로 발생한 경고가 아니다.

### 백업

- 위치: `C:\Users\beck\Documents\Codex\_backups\agentic\2026-07-10\03-agentic-change-checkpoints\advisor-worker-phase0`
- 파일: `AGENTS.md`, `config.toml`, `manifest.json`
- 검증: 원본과 백업 SHA256 일치, manifest JSON parse PASS
- manifest 시각: `2026-07-10T08:57:37.0991971+09:00`

전역 변경이 필요한 다음 단계에서만 아래 파일 단위 복원을 사용한다. Phase 0에서는 실행하지 않았다.

```powershell
Copy-Item -LiteralPath 'C:\Users\beck\Documents\Codex\_backups\agentic\2026-07-10\03-agentic-change-checkpoints\advisor-worker-phase0\AGENTS.md' -Destination 'C:\Users\beck\.codex\AGENTS.md' -Force
Copy-Item -LiteralPath 'C:\Users\beck\Documents\Codex\_backups\agentic\2026-07-10\03-agentic-change-checkpoints\advisor-worker-phase0\config.toml' -Destination 'C:\Users\beck\.codex\config.toml' -Force
```

## 3. 격리 Pilot Workspace

| 항목 | 결과 |
|---|---|
| seed repo | `C:\Users\beck\.codex\eval-runs\advisor-worker\phase0\seed` |
| branch | `fixture/baseline` |
| baseline commit | `7c719074b808ca7d7fb31abf64e3edd1bc2416e3` |
| remote | 로컬 bare repo `dummy-remote.git`만 연결 |
| seed 상태 | clean, local dummy remote와 일치 |
| baseline test | 3/3 PASS |
| production credential | 없음 |
| 사용자 worktree 격리 | PASS |

실행 복제본은 `runs/gt-01`, `runs/gt-02`, `runs/gt-05`로 나눴다. Worker는 각 복제본의 허용 파일만 수정했고 commit, push, deploy, config 변경을 수행하지 않았다.

## 4. GPT-5.6 Access Matrix

고정 smoke prompt는 도구를 사용하지 않고 정확히 한 고정 문자열만 반환하도록 제한했다.

| 경로 | 모델 / effort | 결과 | thread ID |
|---|---|---|---|
| CLI | `gpt-5.6-sol/high` | PASS | `019f4952-fe95-73a2-b1b2-870a7eaf2b3e` |
| CLI | `gpt-5.6-terra/medium` | PASS | `019f4952-bf3f-7172-87d8-15217957bf65` |
| CLI | `gpt-5.6-luna/medium` | PASS | `019f4953-1b7a-7e61-b44e-bc6fc76d33a4` |
| app subagent | `gpt-5.6-sol/high` | PASS | `019f4953-892d-76f2-a406-dcc5fd96b872` |
| app subagent | `gpt-5.6-terra/medium` | PASS | `019f4953-a0b1-7042-9c96-3628c17fc3ec` |
| app subagent | `gpt-5.6-luna/medium` | PASS | `019f4953-be8a-7a23-b00c-237b4b6b085d` |

역할 생성 관점에서 Sol, Terra, Luna 모두 사용 가능하다. 이번 smoke는 선택한 기본 effort만 확인했으며 전체 effort 조합의 품질 비교는 Phase 4 eval 범위다.

## 5. Credits Calibration

### 적용 근거

- rate card 확인 시각: `2026-07-10T09:11:14+09:00`
- [Codex Rate Card](https://help.openai.com/en/articles/20001106-codex-rate-card-2)
- [Codex Speed](https://learn.chatgpt.com/docs/agent-configuration/speed)
- 현재 설정: `service_tier = "priority"`
- 문서상 Fast mode: `service_tier = "fast"`와 `[features].fast_mode = true` 조합이며 현재 GPT-5.5/GPT-5.4만 지원
- 판정: 현재 `priority`에 Fast mode multiplier를 적용하지 않음

| 모델 | input / 1M | cached input / 1M | output / 1M |
|---|---:|---:|---:|
| GPT-5.6 Sol | 125 | 12.5 | 750 |
| GPT-5.6 Terra | 62.5 | 6.25 | 375 |
| GPT-5.6 Luna | 25 | 2.5 | 150 |
| GPT-5.5 | 125 | 12.5 | 750 |

### Calibration 판정

| 증거 | 결과 |
|---|---|
| CLI per-thread token usage | 수집 가능 |
| runtime 직접 credits 값 | 없음 |
| app child thread token usage | child별 `token_count` 없음 |
| Usage panel delta | 격리 브라우저가 비로그인 상태라 확인 불가 |
| `input_tokens`에 cached token이 포함되는지 독립 대조 | 미완료 |
| 최종 `credits_source` | `unavailable` |

null 또는 미관측 credits를 0으로 계산하지 않는다. 다음 표의 값은 공식 rate를 적용한 **indicative derived estimate**이며 pilot 비용 PASS 판정에는 사용하지 않는다.

| run | input | cached | uncached | output | 참고 산출 credits |
|---|---:|---:|---:|---:|---:|
| GPT-5.6 Terra smoke | 24,789 | 9,472 | 15,317 | 6 | 1.018762 |
| GPT-5.6 Sol smoke | 24,789 | 8,960 | 15,829 | 6 | 2.095125 |
| GPT-5.6 Luna smoke | 23,598 | 0 | 23,598 | 6 | 0.590850 |
| GPT-5.6 smoke 합계 | 73,176 | 18,432 | 54,744 | 18 | 3.704738 |

## 6. GPT-5.5 B0 부분 기준선

세 task는 동일 seed, 동일 허용 경로, `gpt-5.5/xhigh/priority`, `workspace-write` sandbox에서 순차 실행했다. 수치는 Worker 보고가 아니라 Advisor가 다시 실행한 diff와 test를 기준으로 판정했다.

| task | 유형 | 결과 | test | 범위 이탈 | repair | wall time | 참고 산출 credits |
|---|---|---|---:|---:|---:|---:|---:|
| GT-01 | 상수 경계 변경 | PASS | 3/3 | 0 | 0 | 64.3s | 5.587850 |
| GT-02 | 예약 태그 규칙 추가 | PASS | 4/4 | 0 | 0 | 54.6s | 5.642475 |
| GT-05 | 반복 구분자 회귀 수정 | PASS | 4/4 | 0 | 0 | 60.0s | 8.660300 |

| 집계 | 값 |
|---|---:|
| task PASS | 3/3 |
| Advisor 독립 검증 | 3/3 |
| `git diff --check` | 3/3 PASS |
| scope violation | 0 |
| repair loop | 0 |
| 총 wall time | 약 178.9s |
| 중앙 wall time | 60.0s |
| 참고 산출 credits 합계 | 19.890625 |
| 참고 산출 credits 중앙값 | 5.642475 |

### Run evidence

| task | thread ID | 변경 파일 |
|---|---|---|
| GT-01 | `019f4956-34ae-7741-ad2d-539779146d1c` | `src/tag-policy.ts`, `test/tag-policy.test.ts` |
| GT-02 | `019f4957-918b-7b63-9a43-79cfe19ceaba` | `src/tag-policy.ts`, `test/tag-policy.test.ts` |
| GT-05 | `019f4958-e3cd-7201-b6ca-8b8d58c2d504` | `src/tag-policy.ts`, `test/tag-policy.test.ts` |

## 7. Gate 판정

| Phase 0 gate | 판정 | 증거 |
|---|---|---|
| secret 없는 기준선 | PASS | 민감 키 이름 scan 없음, credential 없는 fixture |
| 기존 hook warning 분리 | PASS | stale 15건을 변경 전 기준선으로 기록 |
| 파일 단위 rollback | PASS | 백업과 SHA256 manifest |
| Terra/medium 접근 | PASS | CLI·app smoke |
| Sol/high, Luna/medium 접근 | PASS | CLI·app smoke |
| credits source 분류 | PASS WITH LIMITATION | `unavailable`, null을 0으로 미처리 |
| 사용자 worktree와 pilot 격리 | PASS | 전용 seed/runs와 local dummy remote |
| B0 일부 기준선 | PASS | GT-01, GT-02, GT-05와 Advisor 재검증 |

Phase 0 자체는 종료할 수 있다. 다만 credits calibration이 끝날 때까지 비용 절감률, 모델별 가성비, 전역 기본값 전환은 판정 보류다.

## 8. 비차단 Runtime 경고

- CLI 실행이 세 run 디렉터리의 `projects.*.trust_level = "trusted"`를 전역 `config.toml`에 자동 추가했다. Advisor가 해당 세 블록만 제거했고, 최종 `config.toml` SHA256이 체크포인트와 다시 일치함을 확인했다.
- `template-creator` manifest의 네 번째 `interface.defaultPrompt`가 최대 3개 제한으로 무시된다.
- PowerShell shell snapshot은 현재 runtime에서 지원되지 않는다.
- GT-02 실행 중 recommended plugin catalog 조회가 한 차례 실패했지만 구현과 검증에는 영향이 없었다.

세 경고 모두 Worker 구현 실패나 GPT-5.6 접근 실패로 이어지지 않았다.

## 9. 다음 Gate

1. Phase 1에서는 전역 파일을 바꾸기 전에 `AGENTS.md` 추가 문구와 `advisor-worker-orchestration` skill 초안을 별도 diff로 만든다.
2. Phase 1 완료 후에도 기본 모델과 `[agents]`는 변경하지 않는다.
3. Phase 2 또는 Phase 4 전, 로그인된 Codex Usage panel에서 고정 task 전후 delta를 확인해 credits calibration을 다시 수행한다.
4. 비용 판정이 필요한 pilot은 calibration 완료 전 `PASS`로 승격하지 않는다.
