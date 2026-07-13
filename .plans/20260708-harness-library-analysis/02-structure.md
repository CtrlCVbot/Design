# 02. 구조 — 폴더·파일 인벤토리 (총 249파일)

```
logishm-dev-guidelines/
├── AGENTS.md                  ★ AI용 설치 프로토콜 (레포를 AI로 열면 이걸 읽고 설치 수행)
├── CLAUDE.md                  @AGENTS.md 셔틀 (Claude Code용 한 줄)
├── README.md                  사람용 설명서 (설치법·설계 근거·그림)
├── AUDIT.md                   분류 감사 기록 — 82개 항목의 분류 근거 + 보류 안건 5건
├── PARITY.md                  "제3자가 내 환경을 100% 받을 수 있나" 검증 기록
├── package.json               bin: harness → scripts/install.mjs (npm -g 설치용)
│
├── guidelines/                ◆ 원본(canonical) 지침 — 도구 중립 순수 md
│   ├── company/                 회사 공통 11개 (TDD, Simple Design, SOLID 6종, 리팩토링, Notion, 기획자 온보딩)
│   └── stack/                   기술스택 14개
│       ├── typescript/            TS 타입 규칙, 타입 안전성 (2)
│       ├── react-frontend/         React·Next.js·Tailwind·shadcn·Zustand·TanStack·RHF+Zod·FE/E2E 테스트·toast (10)
│       └── node-backend/           Drizzle, 백엔드 테스트 (2)
│
├── playbooks/                 ◆ 원본(canonical) 절차서 — 단계별 작업 순서
│   ├── company/                 commit, wrap, dev-docs 3종, share-plan, verify-all, 리뷰 7종, 파이프라인 2종 (16)
│   └── stack/                   build-and-fix, verify, verify-fe, verify-e2e (4)
│
├── templates/                 설치 시 대상 프로젝트에 찍어낼 틀
│   ├── AGENTS.md                입구 파일 템플릿 ({{DEST}} {{ROUTING}} {{PROJECT_RULES}} {{VERSION}} 치환)
│   ├── enforce-rules.example.json  mm-broker 레이어 규칙 전체 예시 (rules.json의 견본)
│   └── ci-gates.yml             GitHub Actions 서버 게이트 (Stage 2용)
│
├── adapters/                  ◆ 도구별 파생물 (엔진 스크립트)
│   ├── claude-code/plugins/     Claude 플러그인 4개 (마켓플레이스용, migrate.mjs가 자동 생성)
│   │   ├── company-core/          스킬 10 + 커맨드 16 + 훅 1
│   │   ├── stack-typescript/      스킬 2 + 커맨드 1 + 훅 5 (tdd-guard, simple-design 등)
│   │   ├── stack-react-frontend/  스킬 10 + 커맨드 2
│   │   └── stack-node-backend/    스킬 2 + 커맨드 1
│   ├── claude/                  claude-rules-guard.js — rules.json 기반 Claude 훅 (범용 엔진)
│   ├── codex/                   Codex 어댑터 엔진 4개
│   │   ├── codex-rules-guard.mjs    apply_patch 검사·차단 (실제 강제)
│   │   ├── codex-skill-loader.mjs   편집 파일 → 스킬 자동 주입 (guide-loader 포팅)
│   │   ├── codex-skill-activator.mjs 프롬프트 키워드 → 스킬 안내
│   │   └── codex-qa-knowledge.mjs   브라우저 QA 시 지식 주입
│   └── shared/                  harness-probe.cjs — 훅 발사·스킬 참조 계측 (Claude·Codex 공용)
│
├── bundles/                   ◆ 프로젝트 하네스 스냅샷 (--project 옵션으로 배포)
│   └── mm-broker/
│       ├── CLAUDE.md              프로젝트 지침 본문 (설치 시 AGENTS.md에 인라인됨)
│       ├── .mcp.json              playwright MCP 등록
│       ├── .claude/               하네스 86파일: commands 27, skills 32(SOLID 리뷰 6종 포함), hooks 16+lib 헬퍼 1,
│       │                          skill-rules.json(자동발동 규칙), knowledge/(도메인 엣지케이스 ~293KB),
│       │                          qa-scripts, guides, settings.json(훅 배선), rules.json, popbill-issue-api.md
│       └── .codex/                Codex 하네스 35파일: hooks.json, config.toml, rules.json,
│                                  가드 4종 사본, prompts/ 27개(슬래시 변환)
│
├── scripts/                   ◆ 파이프라인 (총 947줄, 전부 Node 표준 라이브러리만 사용)
│   ├── install.mjs (245줄)      라이브러리 → 대상 프로젝트 설치 + harness update
│   ├── migrate.mjs (208줄)      mm-broker 원본 → canonical md + Claude 플러그인 생성
│   ├── snapshot-claude.mjs (91줄) mm-broker .claude/ → bundles/ 스냅샷 (비밀값 스크럽)
│   ├── gen-codex-adapter.mjs (99줄) .claude 설정 → .codex/ 어댑터 생성
│   ├── sync.mjs (20줄)          위 3개를 순서대로 실행 (드리프트 방지 한 방 동기화)
│   ├── precommit-gates.mjs (242줄) 커밋/CI 결과 게이트 (도구 무관)
│   └── harness-metrics.mjs (42줄) .harness-metrics.jsonl 지표 집계
│
├── docs/
│   ├── CODEX-setup.md           Codex 훅 검증 기록 + 발사 조건 3가지 + 알려진 차이
│   └── SETUP-enforcement.md     Stage 1/2 강제 설정 단계별 가이드
│
└── .claude-plugin/marketplace.json  Claude 플러그인 마켓플레이스 정의 (4개 플러그인)
```

## 역할별로 다시 보기 — "데이터"와 "엔진"

이 레포의 파일은 크게 두 부류다. 이 구분이 [범용화 분석](./06-generalization.md)의 기초가 된다.

### 데이터 (콘텐츠·규칙 — 조직/프로젝트마다 다른 것)

| 데이터 | 위치 | 결합 대상 |
|---|---|---|
| 지침·절차서 md | `guidelines/` `playbooks/` | 회사 (logishm 프로세스) |
| 구조 규칙 | `templates/enforce-rules.example.json`, 각 rules.json | 프로젝트 (mm-broker 경로) |
| 스킬 자동발동 트리거 | `bundles/…/skill-rules.json` | 프로젝트 (경로 패턴) + 일반 키워드 |
| 도메인 지식 | `bundles/…/knowledge/` | 프로젝트 (mm-broker 도메인) |
| 스크럽 목록 | `snapshot-claude.mjs` 내 SCRUB 상수 | 개인 (특정 이메일) |

### 엔진 (검사기·변환기·설치기 — 어디서나 같은 것)

| 엔진 | 하는 일 | 프로젝트 결합도 |
|---|---|---|
| `install.mjs` | 복사 + 템플릿 치환 + 훅 배선 | 낮음 (bundles 이름만 파라미터) |
| `precommit-gates.mjs` | tsc/test/lint/비밀값/구조규칙 게이트 | 낮음 (npm 생태계 가정만) |
| `claude-rules-guard.js` / `codex-rules-guard.mjs` | rules.json 판정 | 낮음 (.ts/.tsx 가정만) |
| `harness-probe.cjs` + `harness-metrics.mjs` | 계측·집계 | 거의 없음 |
| `migrate.mjs` | 원본 → canonical + 플러그인 변환 | 중간 (배치표 하드코딩) |
| `snapshot-claude.mjs` / `gen-codex-adapter.mjs` | 번들 생성 | 높음 (mm-broker 경로·스크럽 하드코딩) |

## 참고: 설치본과의 관계 (09 리뷰로 정정됨)

설치본 클론(`C:\Work\Dev\logishm-dev-guidelines`, HEAD `241b762`)과 이 레퍼런스 사본은 **내용이 완전히 동일하다** — git 실측으로 커밋 241b762에 스크립트 7종·PARITY.md·adapters가 전부 포함돼 있고, 줄바꿈(CRLF/LF) 차이 외 전 파일 diff 0건이다. 초기 분석의 "설치본에는 스크립트 3개뿐, 레퍼런스가 더 최신" 서술은 관찰 오류였다.
