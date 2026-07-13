# 06. File-level Capability Scorecard

> 기준일: 2026-07-13 KST
> 상태: G3-1 반영 — `security-review` 검증 및 `security-pipeline` rollback quarantine 완료, 나머지 Phase 3 target은 REVIEW_READY

## 1. 평가 범위

이 표는 runtime이 직접 발견하거나 routing에 사용하는 operational entry file을 개별 평가한다. 포함 범위는 core 2개, custom agent 3개, global skill 25개, personal skill 10개, claude-kit skill 32개, command 38개, agent 21개, hook 14개, manifest 2개, enabled plugin 14개다.

references, scripts, templates, assets는 독립 기능이 아니라 owner entry의 구현 자산이므로 owner 점수와 처분을 상속한다. Root 전체 파일은 global skill 91개, personal skill 71개, claude-kit 115개이며, operational entry를 제외한 support 파일은 각각 66개, 61개, 8개로 총 135개다. OpenAI 공식 plugin cache 내부 파일은 platform-managed이므로 직접 삭제 대상으로 평가하지 않고 enabled plugin 단위로만 기록한다.

## 2. 점수 기준

총점은 Runtime 적합성 25, 책임·trigger 명확성 20, invocation·test 증거 20, 비중복성 20, 유지보수성 15의 합계다.

| 점수 | 해석 |
|---:|---|
| 85~100 | 강함 - 현행 유지 또는 core 승격 가능 |
| 70~84 | 사용 가능 - 작은 보완 또는 명시 trigger 필요 |
| 50~69 | 부분 가치 - scope 이동·통합·재작성 필요 |
| 30~49 | 낮음 - runtime 불일치 또는 중복이 큼 |
| 0~29 | 은퇴 우선 - consumer 확인 후 삭제·격리 |

점수만으로 처분을 결정하지 않는다. 유용한 기능도 프로젝트 schema에 묶여 있으면 PROJECT-ONLY이며, 낮은 점수라도 안전 의도가 있으면 REWRITE가 될 수 있다.

## 3. 전체 요약

| 항목 | 값 |
|---|---:|
| 현재 entry | 161 |
| 현재 총점 | 8842 |
| 현재 평균 점수 | 54.9 |
| 신규 target | 9 |
| DELETE | 6 |
| KEEP | 41 |
| MERGE | 4 |
| PROJECT-ONLY | 69 |
| QUARANTINE | 30 |
| REWRITE | 11 |

### Surface별 평균

| Surface | 파일 수 | 평균 점수 |
|---|---:|---:|
| claude-kit-agent | 21 | 41.4 |
| claude-kit-command | 38 | 43.0 |
| claude-kit-hook | 14 | 32.1 |
| claude-kit-manifest | 2 | 32.5 |
| claude-kit-skill | 32 | 55.8 |
| core | 2 | 86.0 |
| custom-agent | 3 | 88.7 |
| enabled-plugin | 14 | 83.5 |
| global-skill | 25 | 62.5 |
| personal-skill | 10 | 86.7 |

## 4. 파일별 기능·점수·처분

경로의 `~`는 `C:\Users\beck`을 뜻한다.

| ID | Surface | 파일/항목 | 기능 | 상태 | 점수 | 처분 | 통합·이동 대상 | 근거 |
|---|---|---|---|---|---:|---|---|---|
| FILE-001 | core | `~/.codex/AGENTS.md` | 전역 언어·안전·routing·보고 정책 | Verified | 91 | KEEP | 현행 thin global core | 116 lines, 현재 세션에서 실제 적용 |
| FILE-002 | core | `~/.codex/config.toml` | model·plugin·agent limit·hook trust 설정 | Verified | 81 | REWRITE | 불필요 Claude flag 제거와 trust 분류 정리 | 핵심 route 정상, stale env와 trust 진단 혼재 |
| FILE-003 | custom-agent | `~/.codex/agents/implementation-worker.toml` | bounded 구현·test Worker | Verified | 94 | KEEP | 현행 유지 | fresh delegated smoke PASS |
| FILE-004 | custom-agent | `~/.codex/agents/planning-worker.toml` | 명시 승인 대형 기획 Worker | Verified | 88 | KEEP | explicit opt-in 유지 | 품질 PASS, 자동 routing 효율 FAIL |
| FILE-005 | custom-agent | `~/.codex/agents/routine-worker.toml` | 결정적 반복 변환 Worker | Verified | 84 | KEEP | 현행 유지 후 실전 value 재평가 | route/schema 검증, 사용 범위 제한 |
| FILE-006 | global-skill | `~/.agents/skills/advisor-worker-orchestration/SKILL.md` | Advisor 중심 구현 위임과 독립 검증 | Valuable | 92 | KEEP | 현행 유지 | 실제 release smoke와 repair 경계 검증 |
| FILE-007 | global-skill | `~/.agents/skills/agentic-health-check/SKILL.md` | 전역 설정·skill·plugin·agent 진단 | Verified | 84 | KEEP | 현행 유지, Phase 2 detector로 사용 | hook trust 7/15/0 분류, nested active/inactive scan, 19 tests PASS |
| FILE-008 | global-skill | `~/.agents/skills/build-system/SKILL.md` | 프로젝트 build system 탐지와 실행 | Invoked | 78 | KEEP | 현행 유지 | 좁은 책임과 직접 실행 가능 |
| FILE-009 | global-skill | `~/.agents/skills/cache-components/SKILL.md` | Next.js Cache Components 전용 지침 | Routable | 82 | KEEP | 현행 유지 | 명확한 자동 trigger |
| FILE-010 | global-skill | `~/.agents/quarantine/20260713-phase2-legacy-routing/cc-dev-agent/SKILL.md` | 구형 Codex 개발 workflow 집합 | Quarantined | 18 | QUARANTINE | Phase 2 quarantine; rollback manifest 보존 | consumer-free 재검증 후 Move-Item 완료; Phase 7 전까지 삭제 금지 |
| FILE-011 | global-skill | `~/.agents/skills/continuous-learning-v2/SKILL.md` | hook 기반 instinct 학습 체계 | Deferred | 28 | QUARANTINE | consumer-bound legacy; Phase 4 claude-kit 분해 후 재평가 | claude-kit compatibility skill 및 session-wrap references consumer가 확인되어 Phase 2 이동 제외 |
| FILE-012 | global-skill | `~/.agents/skills/eval-harness/SKILL.md` | agent와 prompt formal evaluation | Invoked | 86 | KEEP | 현행 유지 | Advisor/Worker pilot에서 가치 확인 |
| FILE-013 | global-skill | `~/.agents/skills/frontend-code-review/SKILL.md` | frontend 변경과 fidelity 증거 리뷰 | Invoked | 84 | KEEP | frontend fidelity pack | 명확한 review trigger |
| FILE-014 | global-skill | `~/.agents/skills/hook-scope-policy/SKILL.md` | global hook scope와 fail-open 결정 | Routable | 80 | KEEP | health/guardrail 운영 pack | Phase 5 guardrail 재배치에 필요 |
| FILE-015 | global-skill | `~/.agents/skills/html-fidelity-reproduction/SKILL.md` | reference 기반 frontend fidelity contract | Invoked | 90 | KEEP | frontend fidelity pack | 명확한 source-of-truth workflow |
| FILE-016 | global-skill | `~/.agents/skills/manage-skills/SKILL.md` | 검증 skill 누락과 AGENTS drift 관리 | Installed | 55 | MERGE | 신규 skill-lifecycle | skill-factory와 lifecycle overlap |
| FILE-017 | global-skill | `~/.agents/skills/methodology-router/SKILL.md` | 작업별 최소 방법론 선택 | Invoked | 90 | KEEP | governance core | 명확한 routing과 반복 사용 |
| FILE-018 | global-skill | `~/.agents/skills/prompts-chat/SKILL.md` | prompt·skill 검색과 개선 | Invoked | 82 | KEEP | 현행 유지 | explicit trigger와 fallback |
| FILE-019 | global-skill | `~/.agents/skills/reporting-style/SKILL.md` | 한국어 결과 보고 형식 선택 | Invoked | 88 | KEEP | governance core | 명확한 출력 책임 |
| FILE-020 | global-skill | `~/.agents/skills/review-feedback-loop/SKILL.md` | Impact/Reach/Recovery self-review | Invoked | 90 | KEEP | governance core | 중위험 이상 변경 검증에 사용 |
| FILE-021 | global-skill | `~/.agents/quarantine/20260713-phase3-security-review/security-pipeline/SKILL.md` | 대체된 CWE/STRIDE 보안 workflow | Quarantined | 42 | QUARANTINE | `security-review`; Phase 7 전 rollback 보존 | G3-1 검증 후 자동 trigger·hard gate·effort 주장을 이관하지 않고 격리 |
| FILE-162 | global-skill | `~/.agents/skills/security-review/SKILL.md` | 명시 요청 또는 risk-high 증거 기반 보안 review | Verified | 88 | KEEP | global advisory security review | evidence·primary-source·no auto-fix/block 계약 |
| FILE-022 | global-skill | `~/.agents/skills/session-wrap/SKILL.md` | 5-agent 세션 closeout pipeline | Installed | 30 | REWRITE | 신규 session-closeout | Windows에서 /tmp·tail·sonnet 전제 |
| FILE-023 | global-skill | `~/.agents/skills/skill-factory/SKILL.md` | 세션 패턴을 skill로 생성 | Installed | 38 | MERGE | 신규 skill-lifecycle | stale TeamCreate와 manage-skills overlap |
| FILE-024 | global-skill | `~/.agents/quarantine/20260713-phase2-legacy-routing/strategic-compact/SKILL.md` | tool count 기반 /compact 제안 | Quarantined | 20 | QUARANTINE | Phase 2 quarantine; runtime compaction | consumer-free 재검증 후 Move-Item 완료; Phase 7 전까지 삭제 금지 |
| FILE-025 | global-skill | `~/.agents/quarantine/20260713-phase2-legacy-routing/team-orchestrator/SKILL.md` | 구형 Agent Teams orchestration | Quarantined | 15 | QUARANTINE | Phase 2 quarantine; advisor-worker-orchestration | consumer-free 재검증 후 Move-Item 완료; Phase 7 전까지 삭제 금지 |
| FILE-026 | global-skill | `~/.agents/quarantine/20260713-phase2-legacy-routing/using-superpowers/SKILL.md` | skill routing audit meta-workflow | Quarantined | 25 | QUARANTINE | Phase 2 quarantine; methodology-router + platform routing | consumer-free 재검증 후 Move-Item 완료; Phase 7 전까지 삭제 금지 |
| FILE-027 | global-skill | `~/.agents/skills/verification-engine/SKILL.md` | fresh-context verification workflow | Installed | 42 | REWRITE | 신규 verification-router | 없는 /handoff-verify와 stale command |
| FILE-028 | global-skill | `~/.agents/skills/verify-html-fidelity/SKILL.md` | reference/app screenshot fidelity 검증 | Invoked | 90 | KEEP | frontend fidelity pack | closeout 검증 책임 명확 |
| FILE-029 | global-skill | `~/.agents/skills/verify-implementation/SKILL.md` | verify skill 통합 실행기 | Installed | 45 | REWRITE | 신규 verification-router | verification-engine과 overlap·stale command |
| FILE-030 | global-skill | `~/.agents/skills/windows-encoding-safe/SKILL.md` | Windows UTF-8·한글 인코딩 안전 처리 | Invoked | 88 | KEEP | 현행 유지 | 환경 특화 책임과 검증법 명확 |
| FILE-031 | personal-skill | `~/.codex/skills/claude-reviewer/SKILL.md` | Claude read-only second opinion | Routable | 80 | KEEP | 현행 explicit review | 명확한 review-only 경계 |
| FILE-032 | personal-skill | `~/.codex/skills/doc/SKILL.md` | DOCX 생성·렌더 검증 | Routable | 90 | KEEP | 현행 유지 | 전문 artifact workflow |
| FILE-033 | personal-skill | `~/.codex/skills/figma/SKILL.md` | Figma context와 design-to-code | Routable | 90 | KEEP | 현행 유지 | 도구 trigger 명확 |
| FILE-034 | personal-skill | `~/.codex/skills/frontend-skill/SKILL.md` | 시각적으로 강한 frontend 구현 | Routable | 85 | KEEP | frontend fidelity pack | 창작과 fidelity 경계 명시 |
| FILE-035 | personal-skill | `~/.codex/skills/gh-fix-ci/SKILL.md` | GitHub Actions 실패 진단 | Routable | 88 | KEEP | 현행 유지 | 공식 로그 기반 좁은 책임 |
| FILE-036 | personal-skill | `~/.codex/skills/playwright/SKILL.md` | terminal browser automation | Routable | 92 | KEEP | 현행 유지 | 실행 도구와 검증 명확 |
| FILE-037 | personal-skill | `~/.codex/skills/playwright-interactive/SKILL.md` | persistent browser debugging | Routable | 85 | KEEP | 현행 유지 | playwright와 사용 모드 분리 |
| FILE-038 | personal-skill | `~/.codex/skills/screenshot/SKILL.md` | OS-level screenshot capture | Routable | 90 | KEEP | 현행 유지 | explicit trigger |
| FILE-039 | personal-skill | `~/.codex/skills/sentry/SKILL.md` | Sentry production issue read-only 조회 | Routable | 85 | KEEP | 현행 유지 | read-only와 token 경계 |
| FILE-040 | personal-skill | `~/.codex/skills/vercel-deploy/SKILL.md` | Vercel deployment workflow | Routable | 82 | KEEP | 현행 유지 | explicit deploy request 경계 |
| FILE-041 | claude-kit-skill | `~/.codex/local-plugins/claude-kit/skills/agent-completion-cache-invalidate/SKILL.md` | Claude subagent cache compatibility | Routable | 25 | QUARANTINE | legacy archive | Claude hook parity 전제 |
| FILE-042 | claude-kit-skill | `~/.codex/local-plugins/claude-kit/skills/claude-design-workflow/SKILL.md` | Claude Design prompt workflow | Routable | 55 | PROJECT-ONLY | Design planning adapter | 제품·프로젝트 특화 |
| FILE-043 | claude-kit-skill | `~/.codex/local-plugins/claude-kit/skills/continuous-learning/SKILL.md` | legacy Claude continuous learning | Routable | 20 | QUARANTINE | legacy archive | global continuous-learning과 중복 |
| FILE-044 | claude-kit-skill | `~/.codex/local-plugins/claude-kit/skills/copy-closeout-workflow/SKILL.md` | copy fidelity workflow: copy-closeout-workflow | Routable | 65 | PROJECT-ONLY | Design fidelity adapter | evidence schema가 프로젝트 특화 |
| FILE-045 | claude-kit-skill | `~/.codex/local-plugins/claude-kit/skills/copy-evidence-management/SKILL.md` | copy fidelity workflow: copy-evidence-management | Routable | 65 | PROJECT-ONLY | Design fidelity adapter | evidence schema가 프로젝트 특화 |
| FILE-046 | claude-kit-skill | `~/.codex/local-plugins/claude-kit/skills/copy-gap-analysis/SKILL.md` | copy fidelity workflow: copy-gap-analysis | Routable | 65 | PROJECT-ONLY | Design fidelity adapter | evidence schema가 프로젝트 특화 |
| FILE-047 | claude-kit-skill | `~/.codex/local-plugins/claude-kit/skills/copy-pipeline/SKILL.md` | copy fidelity workflow: copy-pipeline | Routable | 65 | PROJECT-ONLY | Design fidelity adapter | evidence schema가 프로젝트 특화 |
| FILE-048 | claude-kit-skill | `~/.codex/local-plugins/claude-kit/skills/copy-qa-workflow/SKILL.md` | copy fidelity workflow: copy-qa-workflow | Routable | 65 | PROJECT-ONLY | Design fidelity adapter | evidence schema가 프로젝트 특화 |
| FILE-049 | claude-kit-skill | `~/.codex/local-plugins/claude-kit/skills/dev-architecture-decision/SKILL.md` | project development guidance: dev-architecture-decision | Routable | 58 | PROJECT-ONLY | project dev harness | 프로젝트 구조·stack 지식 의존 |
| FILE-050 | claude-kit-skill | `~/.codex/local-plugins/claude-kit/skills/dev-domain-modeling/SKILL.md` | project development guidance: dev-domain-modeling | Routable | 58 | PROJECT-ONLY | project dev harness | 프로젝트 구조·stack 지식 의존 |
| FILE-051 | claude-kit-skill | `~/.codex/local-plugins/claude-kit/skills/dev-feature-module/SKILL.md` | project development guidance: dev-feature-module | Routable | 58 | PROJECT-ONLY | project dev harness | 프로젝트 구조·stack 지식 의존 |
| FILE-052 | claude-kit-skill | `~/.codex/local-plugins/claude-kit/skills/dev-feature-plan/SKILL.md` | project development guidance: dev-feature-plan | Routable | 58 | PROJECT-ONLY | project dev harness | 프로젝트 구조·stack 지식 의존 |
| FILE-053 | claude-kit-skill | `~/.codex/local-plugins/claude-kit/skills/dev-frontend-patterns/SKILL.md` | project development guidance: dev-frontend-patterns | Routable | 58 | PROJECT-ONLY | project dev harness | 프로젝트 구조·stack 지식 의존 |
| FILE-054 | claude-kit-skill | `~/.codex/local-plugins/claude-kit/skills/dev-layered-architecture/SKILL.md` | project development guidance: dev-layered-architecture | Routable | 58 | PROJECT-ONLY | project dev harness | 프로젝트 구조·stack 지식 의존 |
| FILE-055 | claude-kit-skill | `~/.codex/local-plugins/claude-kit/skills/dev-observability/SKILL.md` | project development guidance: dev-observability | Routable | 58 | PROJECT-ONLY | project dev harness | 프로젝트 구조·stack 지식 의존 |
| FILE-056 | claude-kit-skill | `~/.codex/local-plugins/claude-kit/skills/dev-refactoring/SKILL.md` | project development guidance: dev-refactoring | Routable | 58 | PROJECT-ONLY | project dev harness | 프로젝트 구조·stack 지식 의존 |
| FILE-057 | claude-kit-skill | `~/.codex/local-plugins/claude-kit/skills/dev-security-pipeline/SKILL.md` | claude-kit security workflow | Routable | 45 | MERGE | 신규 security-review + project gate | global security-pipeline과 중복 |
| FILE-058 | claude-kit-skill | `~/.codex/local-plugins/claude-kit/skills/dev-tdd-workflow/SKILL.md` | project development guidance: dev-tdd-workflow | Routable | 58 | PROJECT-ONLY | project dev harness | 프로젝트 구조·stack 지식 의존 |
| FILE-059 | claude-kit-skill | `~/.codex/local-plugins/claude-kit/skills/dev-testing-backend/SKILL.md` | project development guidance: dev-testing-backend | Routable | 58 | PROJECT-ONLY | project dev harness | 프로젝트 구조·stack 지식 의존 |
| FILE-060 | claude-kit-skill | `~/.codex/local-plugins/claude-kit/skills/dev-testing-e2e/SKILL.md` | project development guidance: dev-testing-e2e | Routable | 58 | PROJECT-ONLY | project dev harness | 프로젝트 구조·stack 지식 의존 |
| FILE-061 | claude-kit-skill | `~/.codex/local-plugins/claude-kit/skills/dev-testing-frontend/SKILL.md` | project development guidance: dev-testing-frontend | Routable | 58 | PROJECT-ONLY | project dev harness | 프로젝트 구조·stack 지식 의존 |
| FILE-062 | claude-kit-skill | `~/.codex/local-plugins/claude-kit/skills/dev-verification-engine/SKILL.md` | claude-kit verification workflow | Routable | 42 | MERGE | 신규 verification-router | global verification 계열과 중복 |
| FILE-063 | claude-kit-skill | `~/.codex/local-plugins/claude-kit/skills/dev-workflow/SKILL.md` | project development guidance: dev-workflow | Routable | 58 | PROJECT-ONLY | project dev harness | 프로젝트 구조·stack 지식 의존 |
| FILE-064 | claude-kit-skill | `~/.codex/local-plugins/claude-kit/skills/plan-archive-workflow/SKILL.md` | planning workflow: plan-archive-workflow | Routable | 68 | PROJECT-ONLY | Design planning adapter | 고유 가치 있으나 .plans schema 의존 |
| FILE-065 | claude-kit-skill | `~/.codex/local-plugins/claude-kit/skills/plan-idea-management/SKILL.md` | planning workflow: plan-idea-management | Routable | 68 | PROJECT-ONLY | Design planning adapter | 고유 가치 있으나 .plans schema 의존 |
| FILE-066 | claude-kit-skill | `~/.codex/local-plugins/claude-kit/skills/plan-pipeline/SKILL.md` | planning workflow: plan-pipeline | Routable | 68 | PROJECT-ONLY | Design planning adapter | 고유 가치 있으나 .plans schema 의존 |
| FILE-067 | claude-kit-skill | `~/.codex/local-plugins/claude-kit/skills/plan-prd-authoring/SKILL.md` | planning workflow: plan-prd-authoring | Routable | 68 | PROJECT-ONLY | Design planning adapter | 고유 가치 있으나 .plans schema 의존 |
| FILE-068 | claude-kit-skill | `~/.codex/local-plugins/claude-kit/skills/plan-review-criteria/SKILL.md` | planning workflow: plan-review-criteria | Routable | 68 | PROJECT-ONLY | Design planning adapter | 고유 가치 있으나 .plans schema 의존 |
| FILE-069 | claude-kit-skill | `~/.codex/local-plugins/claude-kit/skills/plan-screening-workflow/SKILL.md` | planning workflow: plan-screening-workflow | Routable | 68 | PROJECT-ONLY | Design planning adapter | 고유 가치 있으나 .plans schema 의존 |
| FILE-070 | claude-kit-skill | `~/.codex/local-plugins/claude-kit/skills/plan-wireframe-design/SKILL.md` | planning workflow: plan-wireframe-design | Routable | 68 | PROJECT-ONLY | Design planning adapter | 고유 가치 있으나 .plans schema 의존 |
| FILE-071 | claude-kit-skill | `~/.codex/local-plugins/claude-kit/skills/session-wrap/SKILL.md` | legacy closeout compatibility: session-wrap | Routable | 22 | DELETE | 신규 session-closeout | global session-wrap과 중복·Claude hook 전제 |
| FILE-072 | claude-kit-skill | `~/.codex/local-plugins/claude-kit/skills/session-wrap-suggest/SKILL.md` | legacy closeout compatibility: session-wrap-suggest | Routable | 22 | DELETE | 신규 session-closeout | global session-wrap과 중복·Claude hook 전제 |
| FILE-073 | claude-kit-command | `~/.codex/local-plugins/claude-kit/commands/copy-closeout.md` | copy command: /copy-closeout | Routable | 50 | PROJECT-ONLY | Design fidelity adapter | global command로는 범위가 넓음 |
| FILE-074 | claude-kit-command | `~/.codex/local-plugins/claude-kit/commands/copy-gap-board.md` | copy command: /copy-gap-board | Routable | 50 | PROJECT-ONLY | Design fidelity adapter | global command로는 범위가 넓음 |
| FILE-075 | claude-kit-command | `~/.codex/local-plugins/claude-kit/commands/copy-interaction-review.md` | copy command: /copy-interaction-review | Routable | 50 | PROJECT-ONLY | Design fidelity adapter | global command로는 범위가 넓음 |
| FILE-076 | claude-kit-command | `~/.codex/local-plugins/claude-kit/commands/copy-plan-unit.md` | copy command: /copy-plan-unit | Routable | 50 | PROJECT-ONLY | Design fidelity adapter | global command로는 범위가 넓음 |
| FILE-077 | claude-kit-command | `~/.codex/local-plugins/claude-kit/commands/copy-reference-refresh.md` | copy command: /copy-reference-refresh | Routable | 50 | PROJECT-ONLY | Design fidelity adapter | global command로는 범위가 넓음 |
| FILE-078 | claude-kit-command | `~/.codex/local-plugins/claude-kit/commands/copy-verify.md` | copy command: /copy-verify | Routable | 50 | PROJECT-ONLY | Design fidelity adapter | global command로는 범위가 넓음 |
| FILE-079 | claude-kit-command | `~/.codex/local-plugins/claude-kit/commands/copy-visual-review.md` | copy command: /copy-visual-review | Routable | 50 | PROJECT-ONLY | Design fidelity adapter | global command로는 범위가 넓음 |
| FILE-080 | claude-kit-command | `~/.codex/local-plugins/claude-kit/commands/dev-architecture.md` | development command: /dev-architecture | Routable | 35 | PROJECT-ONLY | project dev playbook 또는 제거 | stale agent·slash command chain 다수 |
| FILE-081 | claude-kit-command | `~/.codex/local-plugins/claude-kit/commands/dev-build-fix.md` | development command: /dev-build-fix | Routable | 35 | PROJECT-ONLY | project dev playbook 또는 제거 | stale agent·slash command chain 다수 |
| FILE-082 | claude-kit-command | `~/.codex/local-plugins/claude-kit/commands/dev-checkpoint.md` | development command: /dev-checkpoint | Routable | 35 | PROJECT-ONLY | project dev playbook 또는 제거 | stale agent·slash command chain 다수 |
| FILE-083 | claude-kit-command | `~/.codex/local-plugins/claude-kit/commands/dev-commit.md` | development command: /dev-commit | Routable | 35 | PROJECT-ONLY | project dev playbook 또는 제거 | stale agent·slash command chain 다수 |
| FILE-084 | claude-kit-command | `~/.codex/local-plugins/claude-kit/commands/dev-commit-push-pr.md` | development command: /dev-commit-push-pr | Routable | 35 | PROJECT-ONLY | project dev playbook 또는 제거 | stale agent·slash command chain 다수 |
| FILE-085 | claude-kit-command | `~/.codex/local-plugins/claude-kit/commands/dev-continue.md` | development command: /dev-continue | Routable | 35 | PROJECT-ONLY | project dev playbook 또는 제거 | stale agent·slash command chain 다수 |
| FILE-086 | claude-kit-command | `~/.codex/local-plugins/claude-kit/commands/dev-explore.md` | development command: /dev-explore | Routable | 35 | PROJECT-ONLY | project dev playbook 또는 제거 | stale agent·slash command chain 다수 |
| FILE-087 | claude-kit-command | `~/.codex/local-plugins/claude-kit/commands/dev-feature.md` | development command: /dev-feature | Routable | 35 | PROJECT-ONLY | project dev playbook 또는 제거 | stale agent·slash command chain 다수 |
| FILE-088 | claude-kit-command | `~/.codex/local-plugins/claude-kit/commands/dev-handoff-verify.md` | development command: /dev-handoff-verify | Routable | 35 | PROJECT-ONLY | project dev playbook 또는 제거 | stale agent·slash command chain 다수 |
| FILE-089 | claude-kit-command | `~/.codex/local-plugins/claude-kit/commands/dev-learn.md` | development command: /dev-learn | Routable | 35 | PROJECT-ONLY | project dev playbook 또는 제거 | stale agent·slash command chain 다수 |
| FILE-090 | claude-kit-command | `~/.codex/local-plugins/claude-kit/commands/dev-plan.md` | development command: /dev-plan | Routable | 35 | PROJECT-ONLY | project dev playbook 또는 제거 | stale agent·slash command chain 다수 |
| FILE-091 | claude-kit-command | `~/.codex/local-plugins/claude-kit/commands/dev-refactor.md` | development command: /dev-refactor | Routable | 35 | PROJECT-ONLY | project dev playbook 또는 제거 | stale agent·slash command chain 다수 |
| FILE-092 | claude-kit-command | `~/.codex/local-plugins/claude-kit/commands/dev-review.md` | development command: /dev-review | Routable | 35 | PROJECT-ONLY | project dev playbook 또는 제거 | stale agent·slash command chain 다수 |
| FILE-093 | claude-kit-command | `~/.codex/local-plugins/claude-kit/commands/dev-run.md` | development command: /dev-run | Routable | 35 | PROJECT-ONLY | project dev playbook 또는 제거 | stale agent·slash command chain 다수 |
| FILE-094 | claude-kit-command | `~/.codex/local-plugins/claude-kit/commands/dev-security-review.md` | development command: /dev-security-review | Routable | 35 | PROJECT-ONLY | project dev playbook 또는 제거 | stale agent·slash command chain 다수 |
| FILE-095 | claude-kit-command | `~/.codex/local-plugins/claude-kit/commands/dev-sync.md` | development command: /dev-sync | Routable | 35 | PROJECT-ONLY | project dev playbook 또는 제거 | stale agent·slash command chain 다수 |
| FILE-096 | claude-kit-command | `~/.codex/local-plugins/claude-kit/commands/dev-sync-docs.md` | development command: /dev-sync-docs | Routable | 35 | PROJECT-ONLY | project dev playbook 또는 제거 | stale agent·slash command chain 다수 |
| FILE-097 | claude-kit-command | `~/.codex/local-plugins/claude-kit/commands/dev-test-verify.md` | development command: /dev-test-verify | Routable | 35 | PROJECT-ONLY | project dev playbook 또는 제거 | stale agent·slash command chain 다수 |
| FILE-098 | claude-kit-command | `~/.codex/local-plugins/claude-kit/commands/dev-verify.md` | development command: /dev-verify | Routable | 35 | PROJECT-ONLY | project dev playbook 또는 제거 | stale agent·slash command chain 다수 |
| FILE-099 | claude-kit-command | `~/.codex/local-plugins/claude-kit/commands/dev-verify-all.md` | development command: /dev-verify-all | Routable | 35 | PROJECT-ONLY | project dev playbook 또는 제거 | stale agent·slash command chain 다수 |
| FILE-100 | claude-kit-command | `~/.codex/local-plugins/claude-kit/commands/dev-verify-fe.md` | development command: /dev-verify-fe | Routable | 35 | PROJECT-ONLY | project dev playbook 또는 제거 | stale agent·slash command chain 다수 |
| FILE-101 | claude-kit-command | `~/.codex/local-plugins/claude-kit/commands/plan-archive.md` | planning command: /plan-archive | Routable | 55 | PROJECT-ONLY | Design planning adapter | Design .plans workflow 전제 |
| FILE-102 | claude-kit-command | `~/.codex/local-plugins/claude-kit/commands/plan-bridge.md` | planning command: /plan-bridge | Routable | 55 | PROJECT-ONLY | Design planning adapter | Design .plans workflow 전제 |
| FILE-103 | claude-kit-command | `~/.codex/local-plugins/claude-kit/commands/plan-design.md` | planning command: /plan-design | Routable | 55 | PROJECT-ONLY | Design planning adapter | Design .plans workflow 전제 |
| FILE-104 | claude-kit-command | `~/.codex/local-plugins/claude-kit/commands/plan-draft.md` | planning command: /plan-draft | Routable | 55 | PROJECT-ONLY | Design planning adapter | Design .plans workflow 전제 |
| FILE-105 | claude-kit-command | `~/.codex/local-plugins/claude-kit/commands/plan-idea.md` | planning command: /plan-idea | Routable | 55 | PROJECT-ONLY | Design planning adapter | Design .plans workflow 전제 |
| FILE-106 | claude-kit-command | `~/.codex/local-plugins/claude-kit/commands/plan-improve.md` | planning command: /plan-improve | Routable | 55 | PROJECT-ONLY | Design planning adapter | Design .plans workflow 전제 |
| FILE-107 | claude-kit-command | `~/.codex/local-plugins/claude-kit/commands/plan-prd.md` | planning command: /plan-prd | Routable | 55 | PROJECT-ONLY | Design planning adapter | Design .plans workflow 전제 |
| FILE-108 | claude-kit-command | `~/.codex/local-plugins/claude-kit/commands/plan-review.md` | planning command: /plan-review | Routable | 55 | PROJECT-ONLY | Design planning adapter | Design .plans workflow 전제 |
| FILE-109 | claude-kit-command | `~/.codex/local-plugins/claude-kit/commands/plan-screen.md` | planning command: /plan-screen | Routable | 55 | PROJECT-ONLY | Design planning adapter | Design .plans workflow 전제 |
| FILE-110 | claude-kit-command | `~/.codex/local-plugins/claude-kit/commands/plan-wireframe.md` | planning command: /plan-wireframe | Routable | 55 | PROJECT-ONLY | Design planning adapter | Design .plans workflow 전제 |
| FILE-111 | claude-kit-agent | `~/.codex/local-plugins/claude-kit/agents/copy-fidelity.md` | copy role: copy-fidelity | Installed | 42 | QUARANTINE | Design fidelity adapter에서 필요 역할만 재작성 | Claude agent format과 project evidence 의존 |
| FILE-112 | claude-kit-agent | `~/.codex/local-plugins/claude-kit/agents/copy-interaction-fidelity.md` | copy role: copy-interaction-fidelity | Installed | 42 | QUARANTINE | Design fidelity adapter에서 필요 역할만 재작성 | Claude agent format과 project evidence 의존 |
| FILE-113 | claude-kit-agent | `~/.codex/local-plugins/claude-kit/agents/copy-qa-reviewer.md` | copy role: copy-qa-reviewer | Installed | 42 | QUARANTINE | Design fidelity adapter에서 필요 역할만 재작성 | Claude agent format과 project evidence 의존 |
| FILE-114 | claude-kit-agent | `~/.codex/local-plugins/claude-kit/agents/copy-reference-baseline.md` | copy role: copy-reference-baseline | Installed | 42 | QUARANTINE | Design fidelity adapter에서 필요 역할만 재작성 | Claude agent format과 project evidence 의존 |
| FILE-115 | claude-kit-agent | `~/.codex/local-plugins/claude-kit/agents/dev-architect.md` | development role: dev-architect | Installed | 32 | QUARANTINE | project dev adapter 또는 삭제 | Claude agent persona와 proactive trigger |
| FILE-116 | claude-kit-agent | `~/.codex/local-plugins/claude-kit/agents/dev-code-reviewer.md` | development role: dev-code-reviewer | Installed | 32 | QUARANTINE | project dev adapter 또는 삭제 | Claude agent persona와 proactive trigger |
| FILE-117 | claude-kit-agent | `~/.codex/local-plugins/claude-kit/agents/dev-database-reviewer.md` | development role: dev-database-reviewer | Installed | 32 | QUARANTINE | project dev adapter 또는 삭제 | Claude agent persona와 proactive trigger |
| FILE-118 | claude-kit-agent | `~/.codex/local-plugins/claude-kit/agents/dev-doc-updater.md` | development role: dev-doc-updater | Installed | 32 | QUARANTINE | project dev adapter 또는 삭제 | Claude agent persona와 proactive trigger |
| FILE-119 | claude-kit-agent | `~/.codex/local-plugins/claude-kit/agents/dev-security-reviewer.md` | security reviewer role | Installed | 45 | QUARANTINE | 신규 security-review | 현 runtime 도구 계약 재작성 필요 |
| FILE-120 | claude-kit-agent | `~/.codex/local-plugins/claude-kit/agents/dev-verify-agent.md` | fresh verification role | Installed | 45 | QUARANTINE | 신규 verification-router | Task tool와 stale command 의존 |
| FILE-121 | claude-kit-agent | `~/.codex/local-plugins/claude-kit/agents/plan-bridge-writer.md` | planning role/gate: plan-bridge-writer | Installed | 44 | QUARANTINE | Design planning adapter에서 필요 역할만 재작성 | Task tool·Claude path·.plans schema 의존 |
| FILE-122 | claude-kit-agent | `~/.codex/local-plugins/claude-kit/agents/plan-design-writer.md` | planning role/gate: plan-design-writer | Installed | 44 | QUARANTINE | Design planning adapter에서 필요 역할만 재작성 | Task tool·Claude path·.plans schema 의존 |
| FILE-123 | claude-kit-agent | `~/.codex/local-plugins/claude-kit/agents/plan-dev-gate.js` | planning role/gate: plan-dev-gate | Installed | 44 | QUARANTINE | Design planning adapter에서 필요 역할만 재작성 | Task tool·Claude path·.plans schema 의존 |
| FILE-124 | claude-kit-agent | `~/.codex/local-plugins/claude-kit/agents/plan-draft-writer.md` | planning role/gate: plan-draft-writer | Installed | 44 | QUARANTINE | Design planning adapter에서 필요 역할만 재작성 | Task tool·Claude path·.plans schema 의존 |
| FILE-125 | claude-kit-agent | `~/.codex/local-plugins/claude-kit/agents/plan-idea-collector.md` | planning role/gate: plan-idea-collector | Installed | 44 | QUARANTINE | Design planning adapter에서 필요 역할만 재작성 | Task tool·Claude path·.plans schema 의존 |
| FILE-126 | claude-kit-agent | `~/.codex/local-plugins/claude-kit/agents/plan-idea-screener.md` | planning role/gate: plan-idea-screener | Installed | 44 | QUARANTINE | Design planning adapter에서 필요 역할만 재작성 | Task tool·Claude path·.plans schema 의존 |
| FILE-127 | claude-kit-agent | `~/.codex/local-plugins/claude-kit/agents/plan-idea-screener-rescoring.js` | planning role/gate: plan-idea-screener-rescoring | Installed | 44 | QUARANTINE | Design planning adapter에서 필요 역할만 재작성 | Task tool·Claude path·.plans schema 의존 |
| FILE-128 | claude-kit-agent | `~/.codex/local-plugins/claude-kit/agents/plan-prd-writer.md` | planning role/gate: plan-prd-writer | Installed | 44 | QUARANTINE | Design planning adapter에서 필요 역할만 재작성 | Task tool·Claude path·.plans schema 의존 |
| FILE-129 | claude-kit-agent | `~/.codex/local-plugins/claude-kit/agents/plan-reviewer.md` | planning role/gate: plan-reviewer | Installed | 44 | QUARANTINE | Design planning adapter에서 필요 역할만 재작성 | Task tool·Claude path·.plans schema 의존 |
| FILE-130 | claude-kit-agent | `~/.codex/local-plugins/claude-kit/agents/plan-wireframe-checklist.js` | planning role/gate: plan-wireframe-checklist | Installed | 44 | QUARANTINE | Design planning adapter에서 필요 역할만 재작성 | Task tool·Claude path·.plans schema 의존 |
| FILE-131 | claude-kit-agent | `~/.codex/local-plugins/claude-kit/agents/plan-wireframe-designer.md` | planning role/gate: plan-wireframe-designer | Installed | 44 | QUARANTINE | Design planning adapter에서 필요 역할만 재작성 | Task tool·Claude path·.plans schema 의존 |
| FILE-132 | claude-kit-hook | `~/.codex/local-plugins/claude-kit/hooks/agent-completion-cache-invalidate.js` | Claude subagent read-cache invalidation | Inactive | 20 | DELETE | legacy archive | Codex runtime에서 hook 미등록 |
| FILE-133 | claude-kit-hook | `~/.codex/local-plugins/claude-kit/hooks/code-quality-reminder.js` | 모든 code edit 품질 reminder | Registered | 20 | DELETE | project review checklist | Edit\|Write matcher와 warning noise |
| FILE-134 | claude-kit-hook | `~/.codex/local-plugins/claude-kit/hooks/dev-db-guard.js` | 위험 SQL command 차단 | Registered | 35 | REWRITE | 선택적 global safety-hook pilot | Bash만 검사해 exec_command는 allow |
| FILE-135 | claude-kit-hook | `~/.codex/local-plugins/claude-kit/hooks/dev-feature-scope-guard.js` | feature binding 밖 code edit 차단 | Registered | 45 | PROJECT-ONLY | project dev adapter | 프로젝트 .plans schema 의존 |
| FILE-136 | claude-kit-hook | `~/.codex/local-plugins/claude-kit/hooks/dev-tdd-guard.js` | test 선행 code edit 차단 | Registered | 48 | PROJECT-ONLY | project rules/git gate | opt-in marker와 Edit\|Write 의존 |
| FILE-137 | claude-kit-hook | `~/.codex/local-plugins/claude-kit/hooks/edit-tracker.js` | TS edit를 project .ai log에 기록 | Registered | 15 | DELETE | 필요 시 project metrics | 임의 repo 파일 오염 가능 |
| FILE-138 | claude-kit-hook | `~/.codex/local-plugins/claude-kit/hooks/feedback-collector.js` | Claude session feedback 수집 | Inactive | 25 | QUARANTINE | privacy eval 후 판단 | active routing과 consumer 증거 없음 |
| FILE-139 | claude-kit-hook | `~/.codex/local-plugins/claude-kit/hooks/feedback-subagent-collector.js` | Claude subagent feedback 수집 | Inactive | 20 | QUARANTINE | privacy eval 후 판단 | Claude session/agent 의존 |
| FILE-140 | claude-kit-hook | `~/.codex/local-plugins/claude-kit/hooks/no-duplication-guard.js` | 중복 code heuristic guard | Inactive | 20 | DELETE | project lint/review | global opt-in 가치 미검증 |
| FILE-141 | claude-kit-hook | `~/.codex/local-plugins/claude-kit/hooks/output-secret-filter.js` | remote output secret pattern filter | Inactive | 40 | REWRITE | 선택적 credential safety pilot | Codex payload와 실제 출력 경로 검증 필요 |
| FILE-142 | claude-kit-hook | `~/.codex/local-plugins/claude-kit/hooks/plan-doc-guard.js` | plan schema와 code edit guard | Registered | 42 | PROJECT-ONLY | Design planning adapter | project schema 및 marker 의존 |
| FILE-143 | claude-kit-hook | `~/.codex/local-plugins/claude-kit/hooks/plan-idea-move-guard.js` | .plans ideas 이동 제한 | Inactive | 45 | PROJECT-ONLY | Design planning adapter | Design 전용 경로 |
| FILE-144 | claude-kit-hook | `~/.codex/local-plugins/claude-kit/hooks/plan-review-trigger.js` | plan 완료 시 review 제안 | Inactive | 40 | PROJECT-ONLY | Design planning adapter | Claude session marker 의존 |
| FILE-145 | claude-kit-hook | `~/.codex/local-plugins/claude-kit/hooks/security-auto-trigger.js` | security-sensitive edit 경고 | Registered | 35 | REWRITE | security-review explicit router | apply_patch 미감지·없는 command 제안 |
| FILE-146 | claude-kit-manifest | `~/.codex/local-plugins/claude-kit/.codex-plugin/plugin.json` | claude-kit package metadata | Routable | 35 | REWRITE | plugin disable 후 legacy archive | 설명과 실제 dev/plan/copy 범위 불일치 |
| FILE-147 | claude-kit-manifest | `~/.codex/local-plugins/claude-kit/hooks.json` | registered global hook wiring | Routable | 30 | REWRITE | 목표 global hook 0; project adapter로 이동 | 7개 hook이 Claude tool matcher 사용 |
| FILE-148 | enabled-plugin | `documents@openai-primary-runtime` | platform-managed product capability | Routable | 88 | KEEP | 사용자 선택 유지 | platform-managed cache는 직접 삭제하지 않음 |
| FILE-149 | enabled-plugin | `pdf@openai-primary-runtime` | platform-managed product capability | Routable | 88 | KEEP | 사용자 선택 유지 | platform-managed cache는 직접 삭제하지 않음 |
| FILE-150 | enabled-plugin | `spreadsheets@openai-primary-runtime` | platform-managed product capability | Routable | 88 | KEEP | 사용자 선택 유지 | platform-managed cache는 직접 삭제하지 않음 |
| FILE-151 | enabled-plugin | `presentations@openai-primary-runtime` | platform-managed product capability | Routable | 88 | KEEP | 사용자 선택 유지 | platform-managed cache는 직접 삭제하지 않음 |
| FILE-152 | enabled-plugin | `template-creator@openai-primary-runtime` | platform-managed product capability | Routable | 78 | KEEP | 사용자 선택 유지 | platform-managed cache는 직접 삭제하지 않음 |
| FILE-153 | enabled-plugin | `claude-kit@user-local` | custom governance monolith | Routable | 35 | REWRITE | 분해 후 disable | custom source, 별도 migration 대상 |
| FILE-154 | enabled-plugin | `gmail@openai-curated` | platform-managed product capability | Routable | 88 | KEEP | 사용자 선택 유지 | platform-managed cache는 직접 삭제하지 않음 |
| FILE-155 | enabled-plugin | `codex@openai-codex` | platform-managed product capability | Routable | 88 | KEEP | 사용자 선택 유지 | platform-managed cache는 직접 삭제하지 않음 |
| FILE-156 | enabled-plugin | `google-drive@openai-curated` | platform-managed product capability | Routable | 88 | KEEP | 사용자 선택 유지 | platform-managed cache는 직접 삭제하지 않음 |
| FILE-157 | enabled-plugin | `sites@openai-bundled` | platform-managed product capability | Routable | 88 | KEEP | 사용자 선택 유지 | platform-managed cache는 직접 삭제하지 않음 |
| FILE-158 | enabled-plugin | `visualize@openai-bundled` | platform-managed product capability | Routable | 88 | KEEP | 사용자 선택 유지 | platform-managed cache는 직접 삭제하지 않음 |
| FILE-159 | enabled-plugin | `browser@openai-bundled` | platform-managed product capability | Routable | 88 | KEEP | 사용자 선택 유지 | platform-managed cache는 직접 삭제하지 않음 |
| FILE-160 | enabled-plugin | `computer-use@openai-bundled` | platform-managed product capability | Routable | 88 | KEEP | 사용자 선택 유지 | platform-managed cache는 직접 삭제하지 않음 |
| FILE-161 | enabled-plugin | `chrome@openai-bundled` | platform-managed product capability | Routable | 88 | KEEP | 사용자 선택 유지 | platform-managed cache는 직접 삭제하지 않음 |

## 5. 신규 생성·통합 Target

아래 항목은 목표 설계이며 아직 생성하지 않았다.

| ID | 신규 target | 기능 | 목표 점수 | 변경 형태 | 흡수하는 기존 기능 | 비고 |
|---|---|---|---:|---|---|---|
| NEW-001 | `~/.agents/capability-registry.json` | active capability owner·trigger·test·rollback registry | 90 | NEW | inventory.json, health-check | Phase 3 선행조건 제외; Phase 6에서 필요성 재평가 |
| NEW-002 | `~/.agents/skills/verification-router/SKILL.md` | 현재 runtime 기반 경량 검증 routing | 90 | MERGE+REWRITE | verification-engine, verify-implementation, claude-kit dev-verification-engine | 계약 REVIEW_READY, 구현 순서 2 |
| NEW-003 | `~/.agents/skills/security-review/SKILL.md` | risk-high 명시 보안 review | 88 | MERGE+REWRITE | security-pipeline, claude-kit dev-security-pipeline, security-auto-trigger | G3-1 IMPLEMENTED, 구현 순서 1 |
| NEW-004 | `~/.agents/skills/skill-lifecycle/SKILL.md` | skill inventory·생성·검증·retirement | 88 | MERGE | manage-skills, skill-factory | 계약 REVIEW_READY, 구현 순서 3 |
| NEW-005 | `~/.agents/skills/session-closeout/SKILL.md` | Windows·현재 subagent API 기반 경량 closeout | 85 | REWRITE | session-wrap, claude-kit session-wrap compatibility | 계약 REVIEW_READY, 구현 순서 4 |
| NEW-006 | `C:/Work/Dev/Design/.codex/skills/planning-workflow/SKILL.md` | Design 전용 .plans workflow adapter | 90 | NEW+MOVE | claude-kit plan skills/commands/agents/hooks | 구현 전 사용자 승인 필요 |
| NEW-007 | `C:/Work/Dev/Design/.codex/skills/fidelity-workflow/SKILL.md` | Design 전용 copy evidence adapter | 90 | NEW+MOVE | claude-kit copy skills/commands/agents | 구현 전 사용자 승인 필요 |
| NEW-008 | `~/.codex/hooks/global-safety-hook (candidate)` | Codex payload 기반 destructive/credential safety | 90 | NEW-CANDIDATE | dev-db-guard, output-secret-filter | Phase 5 isolated eval 전에는 생성하지 않음 |
| NEW-009 | `~/.codex/legacy/claude-kit/<version>/manifest.json` | read-only legacy archive와 restore manifest | 85 | NEW | claude-kit source/cache | 구현 전 사용자 승인 필요 |

## 6. 읽는 방법

- KEEP: 파일 유지. 점수가 낮은 KEEP는 별도 검증 전 자동 확대하지 않는다.
- MERGE: 여러 source를 새 target 하나로 합친다. source는 target 검증 후 quarantine한다.
- REWRITE: 같은 책임을 유지하되 현재 runtime 계약으로 다시 작성한다.
- PROJECT-ONLY: global routing에서 제거하고 marker가 있는 repo로 이동한다.
- QUARANTINE: active routing을 끄고 consumer와 rollback을 관찰한다.
- DELETE: Delete Gate를 통과한 뒤 제거한다. 이번 문서 작업에서는 삭제하지 않았다.
- NEW-CANDIDATE: eval과 별도 승인 전에는 만들지 않는다.

## 7. SSOT 관계

이 문서는 file-level 판정의 SSOT다. capability-level 요약은 [inventory.json](./inventory.json), 구조 결정은 [03-disposition-and-target-architecture.md](./03-disposition-and-target-architecture.md), 실행 순서는 [04-migration-roadmap.md](./04-migration-roadmap.md)를 따른다.
