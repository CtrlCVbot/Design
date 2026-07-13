# 개발 지침 (Dev Guidelines)

사람과 모든 AI 코딩 도구(Claude Code, Codex, Cursor, Copilot, Gemini CLI …)가 공용으로 따르는 진입점이다.
상세 지침은 `docs/dev-guidelines/`에 있다. 작업을 시작하기 전에 아래 표에서 해당하는 문서를 읽고 따른다.

> **개발이 처음이거나 비개발자(기획자 등)라면** 먼저 `docs/dev-guidelines/guidelines/company/planner-onboarding.md` 부터 읽으세요. 이 한 장이면 시작할 수 있습니다.

## 절대 하지 말 것 (안전)

- 아래 명령은 위험하니 **실행하지 말고**, 필요하면 사람(개발자)에게 요청한다: 강제 푸시(`git push --force`), 통째 되돌리기(`git reset --hard`), 통째 삭제(`rm -rf`), 운영(production) 배포.
- **main(본 줄기)에 직접 커밋·push 하지 않는다.** 항상 새 브랜치에서 작업하고 PR로 올린다.
- 커밋 검사(게이트)가 막으면 **우회하지 않는다.** `--no-verify`, `core.hooksPath` 해제 등으로 검사를 끄지 말고, 메시지대로 고치거나 개발자에게 보여준다.
- 비밀값(계정·비밀번호·토큰·키)을 코드에 적지 않는다. 환경변수(`.env`)로 둔다.

## 필수 규칙 (모든 작업)

- 모든 코드 수정/추가는 TDD로 진행한다 → `docs/dev-guidelines/guidelines/company/tdd-workflow.md`
- 코드 변경 후 Kent Beck Simple Design 4규칙으로 자가 리뷰한다 → `docs/dev-guidelines/guidelines/company/simple-design-review.md`
- 커밋은 빌드/테스트 통과 후, [문제]-[원인]-[해결] 본문 구조로 → `docs/dev-guidelines/playbooks/company/commit.md`
- Notion 이슈 기반 수정은 커밋·결과 보고 규칙을 따른다 → `docs/dev-guidelines/guidelines/company/notion-issue-workflow.md`

## 작업 유형별 지침

### 지침 (guidelines)

| 문서 | 언제 읽나 |
|---|---|
| `docs/dev-guidelines/guidelines/company/component-review.md` | 컴포넌트 응집/결합 원칙 리뷰. 모듈 간 순환 의존, 도메인 간 결합, 변경 전파 범위를 분석한다. '순환 의존', '모듈 결합', '도메인 분리', 'import cycle', '컴포넌트 원칙' 요청 시 이 스킬을 사용할 것. |
| `docs/dev-guidelines/guidelines/company/dip-review.md` | DIP(Dependency Inversion Principle) 전문가 코드 리뷰. 소스 코드 의존성이 추상에 향하는지, 변동성 높은 구체에 의존하고 있지 않은지 분석한다. 'DIP', '의존성 역전', '추상 의존', '구체 의존', '의존성 방향' 요청 시 이 스킬을 사용할 것. |
| `docs/dev-guidelines/guidelines/company/isp-review.md` | ISP(Interface Segregation Principle) 전문가 코드 리뷰. 필요하지 않은 것에 의존하고 있지 않은지 분석한다. 'ISP', '인터페이스 분리', '불필요한 의존', '뚱뚱한 인터페이스', 'fat interface' 요청 시 이 스킬을 사용할 것. |
| `docs/dev-guidelines/guidelines/company/lsp-review.md` | LSP(Liskov Substitution Principle) 전문가 코드 리뷰. 인터페이스/타입의 대체 가능성을 분석한다. 'LSP', '리스코프', '대체 가능', '인터페이스 계약', 'API 일관성' 요청 시 이 스킬을 사용할 것. |
| `docs/dev-guidelines/guidelines/company/notion-issue-workflow.md` | Notion 버그/이슈 기반 수정 작업의 커밋 및 결과 보고 규칙. Notion 이슈를 조회해 수정하거나, 수정 완료 후 커밋·보고할 때 사용 |
| `docs/dev-guidelines/guidelines/company/ocp-review.md` | OCP(Open-Closed Principle) 전문가 코드 리뷰. 코드가 확장에 열려있고 수정에 닫혀있는지 분석한다. 'OCP', '개방-폐쇄', '확장성', 'switch 분기', '타입별 분기' 요청 시 이 스킬을 사용할 것. |
| `docs/dev-guidelines/guidelines/company/planner-onboarding.md` | 개발이 처음이거나 비개발자(기획자 등)가 이 프로젝트에서 AI로 개발을 시작할 때 가장 먼저 읽는 안내 |
| `docs/dev-guidelines/guidelines/company/refactoring.md` | 리팩토링 워크플로우. /refactor 명령 또는 리팩토링 작업 시 참조. Before/After 체크리스트, Test-First 순서, Google Staff Engineer 품질 기준을 포함. 코드 리팩토링을 수행할 때 반드시 이 스킬을 사용할 것. |
| `docs/dev-guidelines/guidelines/company/simple-design-review.md` | 페이스북 스태프 엔지니어 페르소나로 simple-design 관점에서 staged 코드를 리뷰하는 프로토콜. /commit 단계 5 와 명시 호출(`/simple-design-review`) 양쪽에서 동일 절차 사용. Kent Beck 4규칙(테스트통과/의도드러냄/중복없음/최소요소) + 8 카테고리 체크리스트 + Severity 분류 + 결과 처리 loop + '안 짚은 것 + 이유' 보고. 'simple-design 리뷰', 'Kent Beck 리뷰', '의도 드러냄 점검', '중복 점검' 요청 시 이 스킬 사용. |
| `docs/dev-guidelines/guidelines/company/srp-review.md` | SRP(Single Responsibility Principle) 전문가 코드 리뷰. 변경된 코드가 SRP를 위반하는지 분석하고 영향도를 평가한다. '코드 리뷰', 'SRP', '단일 책임', '책임 분리', 'actor 분석' 요청 시 이 스킬을 사용할 것. |
| `docs/dev-guidelines/guidelines/company/tdd-workflow.md` | TDD 워크플로우 가이드. 모든 코드 수정/추가 시 필수 참조. 유즈케이스 정의 → 실패하는 테스트 → 최소 구현 → 리팩토링 순서를 강제한다. 코드를 작성하거나 수정하려 할 때 반드시 이 스킬을 먼저 확인할 것. |

### 절차서 (playbooks)

| 문서 | 절차 |
|---|---|
| `docs/dev-guidelines/playbooks/company/commit.md` | 커밋 생성 (/commit) |
| `docs/dev-guidelines/playbooks/company/component-review.md` | /component-review — 컴포넌트 원칙 리뷰 |
| `docs/dev-guidelines/playbooks/company/continue.md` | 작업 계속 |
| `docs/dev-guidelines/playbooks/company/dev-docs-update.md` | Dev Docs 업데이트 |
| `docs/dev-guidelines/playbooks/company/dev-docs.md` | Dev Docs 생성 |
| `docs/dev-guidelines/playbooks/company/dip-review.md` | /dip-review — DIP 전문가 코드 리뷰 |
| `docs/dev-guidelines/playbooks/company/fix-pipeline.md` | /fix-pipeline - 버그 수정 전체 파이프라인 |
| `docs/dev-guidelines/playbooks/company/isp-review.md` | /isp-review — ISP 전문가 코드 리뷰 |
| `docs/dev-guidelines/playbooks/company/lsp-review.md` | /lsp-review — LSP 전문가 코드 리뷰 |
| `docs/dev-guidelines/playbooks/company/ocp-review.md` | /ocp-review — OCP 전문가 코드 리뷰 |
| `docs/dev-guidelines/playbooks/company/refactor-pipeline.md` | /refactor-pipeline - 리팩토링 전체 파이프라인 |
| `docs/dev-guidelines/playbooks/company/share-plan.md` | 플랜 공유용 마크다운 생성 (/share-plan) |
| `docs/dev-guidelines/playbooks/company/solid-review.md` | /solid-review — SOLID + Component 원칙 순차 리뷰 + 반영 |
| `docs/dev-guidelines/playbooks/company/srp-review.md` | /srp-review — SRP 전문가 코드 리뷰 |
| `docs/dev-guidelines/playbooks/company/verify-all.md` | 전체 테스트 품질 검증 |
| `docs/dev-guidelines/playbooks/company/wrap.md` | 세션 마무리 (/wrap) |

## 절차서 표기 관행

- 절차서(playbooks)가 서로를 `/이름` 으로 참조하면 `docs/dev-guidelines/playbooks/<그룹>/이름.md` 절차를 뜻한다.
- 일부 절차서는 특정 도구 기능(병렬 서브에이전트 실행 등)을 언급한다. 해당 기능이 없는 도구·사람은 같은 단계를 순차로 수행한다.

## 프로젝트 고유 규칙

<!-- mm-broker 프로젝트 지침 (CLAUDE.md 자동 포함, Claude·Codex 공용) -->

## WHY: 핵심 원칙

- **Rich Domain Model** + Testability
- **Layered Architecture**: Route → Service → Repository + Domain
- **CQRS**: Query/Command 분리

## WHAT: 프로젝트 구조

- 인증: JWT (쿠키), Middleware → `x-user-seq` 헤더 주입

## 네이밍 규칙

- **축약어 금지**: `repo`, `svc` 등 축약어 사용하지 않음

## TDD 워크플로우 (필수)

모든 코드 수정은 TDD로 진행한다. 유즈케이스 정의 → 실패하는 테스트 → 최소 구현 → 리팩토링.
상세 가이드: `.claude/skills/tdd-workflow.md`

## Simple Design 자가 리뷰 (필수)

코드 추가/수정 시 Kent Beck Simple Design 4규칙을 따른다:

1. **Passes all tests** — 테스트 통과
2. **Reveals intention** — 의도 드러냄: 4+ 줄 인라인 주석, `|| ''` fallback, `is*` boolean fan-out, 매직 리터럴, `as <Type>` cast 누적은 위반
   신호
3. **No duplication** — 중복 없음: 같은 매직 3+ 회, 의미 같지만 표현 다른 두 값(예: `7 * 24 * 60 * 60 * 1000` 와 `'7d'`), 인라인 분기 중복
4. **Fewest elements** — 최소 요소: server 가 frontend type (`@/types/`) import, 사용처 0 export, 추상화 1:1, 불필요
   try/catch·Promise.all

### 자동화 흐름

`git commit` 직전에 `simple-design-precommit.js` (PreToolUse Bash hook) 가 자동 발사:

- 검사 범위: **staged files + 직접 import 한 local 파일들** (변경의 blast radius)
- critical/high 위반 발견 → **commit 차단 (exit 2)** + layer 차원 리팩토링 directive
- medium 위반 → 경고만, commit 진행
- `--no-verify` / `-n` 우회 → 차단

### Hook 차단 시 행동

차단 메시지가 내려오면 **spot fix 가 아니라 layer 차원 root cause 를 검토**한다 (예: frontend type coupling 발견 시 → import 한 줄만 빼지 말고
application/dto 정의로 layer 정책 결정). 리팩토링 후 re-stage → 다시 commit.

자가 리뷰는 **사용자가 묻기 전 선제적**. hook 발사 전에 이미 4규칙 자체 검토하고 commit 만들 것.

상세 가이드: `.claude/skills/simple-design-review.md` (또는 `/simple-design-review` 호출)

## HOW: Skills (작업 시 해당 파일 읽을 것)

| Skill                                    | 적용 시점                                |
|------------------------------------------|--------------------------------------|
| `.claude/skills/tdd-workflow.md`         | 모든 코드 수정/추가 (필수)                     |
| `.claude/skills/simple-design-review.md` | 코드 추가/수정 후 자가 리뷰 (필수, Kent Beck 4규칙) |
| `.claude/skills/layered-architecture.md` | route/service/repository 작업 (개요)     |
| `.claude/skills/route-layer.md`          | route 레이어 상세 규칙                      |
| `.claude/skills/service-layer.md`        | service 레이어 상세 규칙                    |
| `.claude/skills/repository-layer.md`     | repository 레이어 상세 규칙                 |
| `.claude/skills/domain-modeling.md`      | domain 모델 작업                         |
| `.claude/skills/type-safety.md`          | `as any` 사용 검토                       |
| `.claude/skills/testing.md`              | 백엔드 테스트 코드 작성                        |
| `.claude/skills/testing-frontend.md`     | 프론트엔드 테스트 코드 작성                      |
| `.claude/skills/testing-e2e.md`          | E2E 테스트 코드 작성                        |
| `.claude/skills/qa-browser.md`           | MCP 브라우저 QA 테스트                      |
| `.claude/skills/qa-strategy.md`          | QA 전략                                |
| `.claude/skills/response-dto.md`         | DTO 작성                               |
| `.claude/skills/refactoring.md`          | 리팩토링 작업                              |
| `.claude/skills/zustand.md`              | store/ 수정, 전역 상태 추가                  |
| `.claude/skills/tanstack-query.md`       | 서버 데이터 페칭, useQuery/useMutation      |
| `.claude/skills/react-hook-form-zod.md`  | 폼 작성/수정, useForm, zodResolver        |
| `.claude/skills/tailwind.md`             | className 수정, 스타일링, UI 컴포넌트          |
| `.claude/skills/shadcn-radix.md`         | Dialog/Sheet/Select, UI 컴포넌트 추가      |
| `.claude/skills/toast.md`                | 토스트 알림 추가/수정 (ToastUtils 표준)        |
| `.claude/skills/nextjs.md`               | page/layout/route handler/middleware |
| `.claude/skills/react.md`                | 컴포넌트/state/effect/메모이제이션             |
| `.claude/skills/typescript.md`           | 타입 정의, as/any/! 검토, 제네릭              |
| `.claude/skills/drizzle.md`              | DB 스키마, Repository, 쿼리, 트랜잭션         |
| `.claude/skills/auth.md`                 | 인증/세션/인가, JWT, 쿠키, 미들웨어 보호           |

## HOW: Commands (슬래시 명령어)

| Command              | 용도                             |
|----------------------|--------------------------------|
| `/commit`            | 커밋 생성 (Why/How 중심)             |
| `/pre`               | Pre 서버 배포                      |
| `/production`        | Production 서버 배포               |
| `/verify`            | 백엔드 테스트 품질 검증                  |
| `/verify-fe`         | 프론트엔드 테스트 품질 검증                |
| `/verify-e2e`        | E2E 테스트 품질 검증                  |
| `/verify-all`        | BE + FE + E2E 병렬 검증            |
| `/qa`                | MCP 브라우저로 탐색적 QA 테스트           |
| `/share-plan`        | 플랜을 공유용 마크다운으로 변환              |
| `/refactor-pipeline` | 리팩토링→검증→QA→알림 자동 파이프라인         |
| `/fix-pipeline`      | Notion 버그→수정→검증→QA→알림 자동 파이프라인 |

## 대규모 작업 시

계획 승인 후 `dev/active/[task-name]/` 생성:

- `plan.md` - 승인된 계획
- `context.md` - 핵심 파일, 결정사항
- `tasks.md` - 체크리스트

---

<sub>logishm-dev-guidelines 241b762 에서 설치됨 · 갱신: 라이브러리 레포에서 `node scripts/install.mjs <이 레포 경로>` 재실행</sub>
