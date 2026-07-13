# 06. 구축 로드맵 — Phase 0~3, 리스크, 완료 판정

## Phase 0 — 기반 (반나절) : "빈 땅에 뼈대"

| 작업 | 산출물 | 검증 |
|---|---|---|
| `~/.agents`를 beck-agentic-kit 저장소로 초기화 (GitHub 개인 계정 비공개 원격 — canonical·beck-kit·마켓 정의·setup.mjs 관리처) | 레포(=`~/.agents`) + setup.mjs 뼈대 | clone→setup 동작 |
| 전역 CLAUDE.md 초안 작성 (03 §1 편성 원칙) | `~/.claude/CLAUDE.md` ≤150줄 | 새 폴더에서 세션 열어 로드 확인 |
| 전역 훅 3종 (secret-filter, danger-guard, probe) 작성 + settings.json **임시** 배선 (Phase 2에서 beck-kit hooks로 이관·제거 예정) | `~/.claude/hooks/*.js` + settings.json | **가드 스크립트에 mock 훅 입력(JSON) 주입으로 판정 검증** — 파괴 명령 문자열(`git push --force`, PowerShell `Remove-Item -Recurse -Force` 등 03 §5 부록)을 `tool_input`에 담은 fixture를 stdin으로 흘려 deny가 나오는지 확인. **실제 파괴 명령을 실행하지 않는다** (미검증 가드가 통과시키면 그 명령이 진짜 실행됨). 부수로 훅당 실행 시간 측정 |

Phase 0만으로도 G5(안전 전역 가드)가 달성된다 — 가장 값싼 최대 효용.

## Phase 1 — 능력 이식 (1~2일) : "Codex 자산의 선별 수입"

| 작업 | 내용 |
|---|---|
| canonical 24 스킬 A/B/C 확정 분류 | 각 SKILL.md 열어 03 §2-1 표 확정 (이름 기반 1차 분류의 검증) |
| A분류 어댑트 + B분류 재작성 | **L1(`~/.claude/skills/`)에 배치** — 세션 로드로 즉시 검증 |
| 커맨드 1차 3종 (wrap, kit-release, learn) — doctor-agentic은 엔진(doctor.mjs)과 함께 Phase 2로 | **L1(`~/.claude/commands/`)에 배치** (Phase 1 동안은 짧은 `/wrap`으로 호출 가능 — 아직 플러그인이 아니라 네임스페이스 없음) |
| 서브에이전트 5종 (code-reviewer, security-reviewer, verify-agent, doc-updater, design-qa) | **L1(`~/.claude/agents/`)에 배치** |
| memory-conventions 스킬 | 자동 메모리 규약 표준화 (L1) |

> **Phase 1은 L1 단일 흐름이다**: 모든 산출물을 우선 `~/.claude/`(L1)에 두어 **세션 로드로 즉시 검증**한다. beck-kit 플러그인은 Phase 2에서야 설치 가능하므로, 처음부터 beck-kit 폴더에만 두면 Phase 1 종료 시점에 아무것도 로드되지 않아 검증이 불가능하다. Phase 2에서 이 L1 산출물을 beck-kit으로 **승격(이동)**하며, 그 시점에 호출 형태가 짧은 `/wrap` → 네임스페이스 `/beck-kit:wrap`로 바뀐다(03 §3 네이밍 정책). R3의 "실험은 L1, 안정물은 플러그인" 규칙과 정합.

## Phase 2 — 플러그인화 + 진단 (1~2일) : "버전과 거울"

| 작업 | 내용 |
|---|---|
| beck-kit plugin.json + Claude용 로컬 마켓(.claude-plugin/marketplace.json 신설) 등록 | `claude plugin marketplace add ~/.agents/plugins`(비대화형 — setup.mjs에도 수록) → beck-kit 0.1.0 설치 |
| L1 산출물(skills·commands·agents) → beck-kit 승격, L1 비우기 | 이중 존재 제거 + 호출 형태 `/beck-kit:<이름>`로 전환 (doctor A4가 L1·L2 중복 0 확인) |
| **settings.json 임시 훅 배선 + `~/.claude/hooks/` 제거 — beck-kit hooks.json으로 이관** | 훅 이중 실행 방지 (doctor A2가 이중 배선 0 확인) |
| doctor.mjs + /beck-kit:doctor-agentic (검사 **A1~A11**, B1~B5 — A10 훅 지연 p95·A11 fail-open 누적 포함) | [05](./05-doctor-health.md) 명세 구현 |
| logishm 회사 마켓 등록 (설치는 비하네스 프로젝트에서만 — 04 §5 정책) | `/plugin marketplace add C:\Work\Dev\logishm-dev-guidelines` |

**Phase 2 종료 = 이 기획의 핵심 완성** (G1~G6 전부 충족 가능 상태).

## Phase 3 — 심화 (선택, 수요 생길 때)

- 교차 AI 리뷰: `codex exec` 래핑 커맨드로 "Codex에게 이 diff 리뷰시켜줘" (claude-reviewer의 역방향)
- 기획 파이프라인(plan-*)의 프로젝트 계층(L3, 이 Design 레포) 이식 — 전역이 아닌 프로젝트 커맨드로
- doctor 주기 실행 + 알림, 지표 리포트(`.claude-global-metrics.jsonl` 집계)
- sync-claude.mjs 자동화 (canonical→beck-kit 어댑트가 수동에서 병목이 되면)

## 리스크와 대응

| 리스크 | 가능성 | 대응 |
|---|---|---|
| 전역 훅이 도구 전체를 느리게/막히게 함 | 중 | fail-open 설계(파싱 실패=allow) + 200ms 예산 + doctor A2·A9 상시 감시 + `/plugin` 제거로 즉시 원복 |
| 전역 스킬과 프로젝트 스킬 오발동 경합 | 중 | description에 "프로젝트 지침 우선" 명문화 + doctor A4/B5 중복 검사 + 하네스 프로젝트에선 회사 플러그인 미설치 정책 |
| 전역 CLAUDE.md 비대화 (모든 것을 넣고 싶어짐) | 높음 | ≤150줄 하드 리밋 + doctor A1이 fail 처리 — "스킬로 위임" 강제 |
| L1·L2 이중 관리 회귀 (실험물 방치) | 중 | 승격 규칙(02 §5) + doctor A4 |
| Codex와의 canonical 드리프트 (한쪽만 고침) | 낮음 | Codex는 canonical(~/.agents/skills)을 직접 로드하므로 Codex 쪽 드리프트는 구조적으로 없음 — 드리프트는 beck-kit 어댑트 쪽에서만 발생하며 kit-release의 sync 단계가 커버 |
| Claude Code 업데이트로 경로·플러그인 규격 변화 | 낮음 | doctor가 조기 감지 (배선 끊김=fail), beck-agentic-kit 레포로 재적용 용이 |

## 완료 판정 (Definition of Done)

1. 새 빈 폴더에서 `claude` 실행 → `/beck-kit:doctor-agentic` 전 항목 pass, `/beck-kit:wrap`·에이전트 동작 (G1·G4)
2. canonical 스킬 1개 수정 → Codex 세션에서 즉시 반영 확인(직접 로드) + kit-release 1회로 Claude 반영 확인 (G2)
3. beck-kit patch 릴리스 → `/plugin` 업데이트 → 다른 프로젝트 세션에 반영 (G3)
4. danger-guard에 파괴 명령 fixture(`git push --force`·PowerShell `Remove-Item -Recurse -Force` 등)를 mock 훅 입력으로 주입 → 전부 deny 판정 확인 (G5) — **실제 실행이 아닌 판정 검증**. 추가로 secret-filter에 비밀값 포함 fixture 주입 → deny 확인
5. mm-broker에서 기존 하네스 훅·게이트 동작 불변 + doctor B1~B5 pass (G6)
6. **이 설계가 소유한 구성물만** 제거(CLAUDE.md, settings의 훅 항목, skills/·commands/·agents/·hooks/, beck-kit 플러그인) 후 재구축 시나리오(04 §6) 15분 내 완료 (R6). **`~/.claude` 통째 삭제 금지** — `.credentials.json`(OAuth 자격)·`projects/`(전 프로젝트 자동 메모리)·세션 기록은 재구축이 복원하지 못하는 자산이다

## 다음 행동

이 기획 승인 시 Phase 0부터 착수한다. 첫 커밋은 beck-agentic-kit 레포 생성과 전역 CLAUDE.md 초안 — 초안 내용은 착수 시점에 사용자와 함께 확정한다 (개인 커뮤니케이션 규약은 본인 확인이 필요한 유일한 입력).
