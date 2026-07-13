# 04. 플러그인·배포 설계 — 버전 있는 구독 체계

## 1. 왜 플러그인이 중심인가 (복습)

하네스 분석에서 확인한 add-only 파일 복사의 약점 — **업데이트가 전파되지 않음** — 을 전역 계층에서 반복하지 않기 위해, 안정 자산의 배포 단위를 처음부터 플러그인으로 잡는다. Codex 전역 환경의 `local-plugins/claude-kit`(원본) + `plugins/cache/<버전>`(런타임) 구조의 Claude 대응이 그대로 존재한다: `/plugin marketplace` + `~/.claude/plugins/`.

## 2. 마켓플레이스 3원 체제

| 마켓 | 소스 | 제공물 | 갱신 주기 |
|---|---|---|---|
| **개인 로컬 마켓** | `~/.agents/plugins/.claude-plugin/marketplace.json` (★신설 별도 파일 — 기존 루트 `marketplace.json`은 **Codex 전용 스키마라 공유 불가**: Claude 규약은 `.claude-plugin/` 위치 + name/owner/plugins 형식이며 `source:"local"` 타입이 없음) | `beck-kit` (source: `./beck-kit`) | 수시 (kit-release 절차) |
| **회사 마켓** | `logishm-dev-guidelines` 레포 (`.claude-plugin/marketplace.json` — **이미 완성돼 있음**, 미활용 상태) | company-core, stack-typescript, stack-react-frontend, stack-node-backend | 라이브러리 릴리스 시 |
| **공식 마켓** | anthropics/claude-plugins-official (이미 등록됨) | 서드파티 도구 | 필요 시 |

등록 명령(1회): `/plugin marketplace add <경로/레포>` → 이후 `/plugin`에서 설치·업데이트. **비대화형 CLI도 실재해 스크립트화가 가능하다** (로컬 확인됨): `claude plugin marketplace add <경로>` · `claude plugin install <이름>` — setup.mjs가 이를 호출해 R6(스크립트 재구축)를 충족한다.

## 3. beck-kit 플러그인 명세

```
~/.agents/plugins/beck-kit/
├── .claude-plugin/
│   └── plugin.json          # { "name": "beck-kit", "version": "0.1.0", "description": "..." }
├── skills/                  # 03 §2에서 선별된 어댑트 스킬 (A분류 + 재작성 B분류)
│   └── <이름>/SKILL.md
├── commands/                # wrap, doctor-agentic, kit-release, learn (호출 시 /beck-kit:<이름>)
├── agents/                  # code-reviewer, security-reviewer, verify-agent, doc-updater, design-qa
├── hooks/
│   ├── hooks.json           # 전역 훅 3종 배선 (secret-filter, danger-guard, probe)
│   └── *.js
├── scripts/
│   └── doctor.mjs           # /beck-kit:doctor-agentic 엔진 (커맨드가 ${CLAUDE_PLUGIN_ROOT}/scripts/doctor.mjs 로 참조)
└── manifest.sha256          # 파일별 해시 목록 — doctor A3(훅 무결성) 대조용, kit-release가 재생성
```

설계 결정 2가지:

1. **훅을 settings.json이 아니라 플러그인 hooks로 배선하는 것을 기본안으로 한다.** 이유: 플러그인 훅은 설치/제거가 `/plugin` 한 번이라 가역성(N2)이 좋고, 버전과 함께 움직인다. settings.json 직접 배선은 폴백(플러그인 훅 미지원 상황)으로만. **이행 규칙**: Phase 0에서는 beck-kit이 아직 없으므로 settings.json에 임시 배선하고, **Phase 2에서 beck-kit 설치와 동시에 임시 배선·`~/.claude/hooks/`를 제거**한다 — 같은 이벤트의 훅은 모두 실행되므로(02 §3) 이관 단계를 빠뜨리면 가드가 이중 실행되고 계측이 2배로 왜곡된다. doctor A2가 이중 배선을 warn으로 감시한다.
2. **스킬·에이전트는 beck-kit에, 실험물만 `~/.claude/` 직접 배치.** L1↔L2 이중 존재는 doctor가 중복으로 잡는다.

## 4. 버전·릴리스 절차 (`/kit-release` 커맨드로 절차화)

1. canonical(`~/.agents/skills`) 또는 beck-kit 원본 수정 — **Codex는 canonical을 직접 로드하므로 이 시점에 이미 반영됨** (별도 Codex sync 단계 불요)
2. `plugin.json` semver 올림 (스킬 추가=minor, 수정=patch, 구조 변경=major)
3. sync 스크립트 실행 (canonical → beck-kit 어댑트) + `manifest.sha256` 재생성
4. `/plugin` 업데이트(또는 `claude plugin` CLI) → 모든 프로젝트의 다음 세션부터 반영
5. git 커밋 (beck-agentic-kit 레포 = `~/.agents`) — PC 재구축의 원천

## 5. 회사 마켓 활용 시나리오 (하네스와의 접점)

logishm 마켓의 company-core 등을 플러그인으로 설치하면, **하네스가 프로젝트에 복사한 같은 이름의 스킬·커맨드와 공존**하게 된다. 정책:

- **현 단계(개인 실험)**: 하네스 설치 프로젝트(mm-broker, Design)에서는 회사 플러그인을 설치하지 않는다 — 중복 발동 혼란 방지. 하네스 없는 개인 프로젝트에서만 회사 플러그인 사용.
- **수렴 단계(후속 제안)**: 하네스 분석 08의 로드맵대로 라이브러리 배포 자체가 플러그인으로 전환되면, 프로젝트 계층에는 rules.json·게이트·프로젝트 스킬만 남고 회사 공통은 플러그인이 담당 — 그때 이 전역 기획과 자연 합류한다. **이 기획은 그 수렴의 개인측 선행 실험이기도 하다.**

## 6. 재구축 스토리 (R6 검증 시나리오)

새 PC에서:

```bash
git clone <beck-agentic-kit 원격> ~/.agents    # 레포 = ~/.agents (canonical + beck-kit + 마켓 정의 + setup.mjs)
node ~/.agents/setup.mjs                       # ~/.claude/CLAUDE.md·settings 생성(add-only)
                                               #  + 비대화형 등록: claude plugin marketplace add ~/.agents/plugins
                                               #                   claude plugin install beck-kit
claude                                         # 아무 폴더에서 실행
/beck-kit:doctor-agentic                       # 전 항목 pass 확인
```

목표: **15분 내 전체 전역 환경 복원, 전 단계 스크립트화(R6).** setup.mjs는 logishm install.mjs의 원칙(멱등, add-only, `!` 경고) 승계. 단 이 재구축이 복원하는 것은 이 설계의 소유물뿐이다 — 자격 증명·자동 메모리·세션 기록은 별개 자산이므로 기존 `~/.claude`를 삭제하는 방식으로 검증하지 않는다 (06 DoD 6 참조).
