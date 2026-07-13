# 06. 범용화(전역화) 분석 — 무엇을, 어떻게 꺼내 쓸 수 있나

## 0. 판단 프레임

"범용화"를 세 방향으로 나눠 본다:

- **수평 확장** — mm-broker가 아닌 **다른 프로젝트**의 하네스도 같은 방식으로 번들·배포
- **수직 확장** — 회사(logishm)를 넘어 **어떤 조직이든** 쓸 수 있는 표준 도구로
- **심도 확장** — TS/npm 생태계를 넘어 **다른 언어·도구**까지

판단 기준은 [02-structure.md](./02-structure.md)에서 정리한 **엔진 vs 데이터** 구분이다:

> **전역화할 것은 엔진이고, 전역화하면 안 되는 것은 데이터다.** 이 라이브러리 자신의 분류 원칙("프로젝트 규칙은 코드와 함께 살아야 한다 — 다른 레포로 빼는 순간 코드와 따로 논다")이 그대로 범용화의 경계선이 된다.

---

## 1. 이미 범용인 것 — 지금 그대로 꺼내 써도 되는 부분

### 1-1. 결과 게이트 엔진 (`precommit-gates.mjs`) ★ 최고 가치

- 외부 의존성 0 (Node 표준 라이브러리만), 단일 파일 242줄.
- "프로젝트에 있는 것만 검사"하는 자동 감지 설계라 어떤 npm 프로젝트에도, 심지어 문서 전용 레포에도 그대로 깔린다 (비밀값+구조규칙만 작동).
- 로컬(pre-commit)과 CI가 같은 파일을 쓰는 구조(GATE_DIFF_RANGE 분기)도 그대로 이식 가능.
- **비개발자용 한국어 실패 메시지**("이 메시지를 AI에게 보여주세요")는 AI 시대 게이트 UX의 독자적 패턴 — 어느 조직이든 재사용 가치가 있다.

### 1-2. rules.json 선언 체계 + 검사기 3종 세트

`forbiddenImports / forbiddenPatterns / requireTest` 3형식의 스키마와, 이를 읽는 가드 3개(claude/codex/git)는 **프로젝트 지식이 전혀 없다** — 프로젝트 지식은 전부 rules.json(데이터)에 있다. 사실상 "**아키텍처 규칙 강제 미니 프레임워크**"로, dependency-cruiser·eslint-boundaries의 초경량 대체재다. 차별점: 같은 규칙이 **AI 편집 시점**(도구별)과 **커밋/CI 시점**(도구 무관) 양쪽에서 강제된다는 것.

### 1-3. AGENTS.md 입구 패턴 + 설치기 골격

- "canonical md + AGENTS.md 단일 입구 + CLAUDE.md 셔틀 + 도구별 연결표"는 조직·스택 무관 패턴.
- install.mjs의 골격 — 템플릿 4-치환(`{{DEST}} {{ROUTING}} {{PROJECT_RULES}} {{VERSION}}`), **문서 frontmatter에서 라우팅 표 자동 생성**, add-only 충돌 정책(.logishm-new), 멱등 재실행 — 은 어떤 지침 라이브러리에도 재사용 가능.
- **AI 설치 프로토콜**(레포 AGENTS.md): "클론해서 AI로 열고 '설치해줘'만 하라"는 온보딩 자동화 패턴. 필수 질문 1개로 제한, 스택 자동 추론표, 4단계 검증 의무, `!` 경고 시 중단 규칙 — 문서를 실행 가능한 절차로 쓰는 이 구조 자체가 이식 가능한 발명이다.

### 1-4. 계측 세트 (`harness-probe.cjs` + `harness-metrics.mjs`)

stdin JSON 훅 규약(tool_name/tool_input)만 가정하므로 그 규약을 쓰는 어떤 도구·프로젝트에도 그대로 배선 가능. "하네스 도입 효과를 숫자로" 보여줘야 하는 조직 설득 상황에서 특히 유용.

### 1-5. Claude 플러그인 마켓플레이스 (`adapters/claude-code` + `.claude-plugin/marketplace.json`)

이미 완성된 배포 채널인데 현재 플로우(install.mjs 복사 방식)에서는 활용도가 낮다. `/plugin marketplace add <레포>` 한 번이면 **회사 전 구성원의 모든 프로젝트**에 company-core·stack-* 플러그인을 설치·업데이트할 수 있다 — "파일 복사" 배포의 대안인 **구독형 배포**가 이미 준비돼 있는 셈이다.

---

## 2. 파라미터만 빼면 범용이 되는 것 — 하드코딩 목록과 처방

| # | 현재 하드코딩 | 위치 | 처방 |
|---|---|---|---|
| 1 | 번들 출력 경로 `bundles/mm-broker/` 고정 | snapshot-claude.mjs, gen-codex-adapter.mjs | `--project <이름>` 인자화 → **임의 프로젝트 번들** 지원 (install.mjs는 이미 파라미터라 이 둘만 고치면 끝) |
| 2 | 스크럽 목록(특정 이메일 3개) | snapshot-claude.mjs SCRUB 상수 | `scrub.json` 설정 파일로 분리 + 이메일 정규식 등 일반 패턴 추가 |
| 3 | migrate 배치표(어떤 스킬→어느 그룹) | migrate.mjs PLUGINS 상수 (~60줄) | `manifest.json`으로 분리 → 스크립트는 순수 변환 엔진이 되고, 새 프로젝트 이관은 manifest 작성만으로 가능 |
| 4 | AGENTS.md 템플릿 속 회사 규칙(TDD·Notion·커밋 형식) | templates/AGENTS.md | 템플릿을 뼈대만 남기고 회사 규칙을 `{{COMPANY_RULES}}` 치환 블록으로 → 다른 조직도 템플릿 재사용 |
| 5 | 게이트의 npm/tsc/npx 고정 | precommit-gates.mjs | 게이트 명령을 선언화 — 예: rules.json에 `"gates": [{"label":"테스트","cmd":"./gradlew test","when":"build.gradle"}]` → **Java/Python/Go 프로젝트 지원** |
| 6 | 테스트 탐지 .ts/.tsx 고정 | 가드 3종의 hasTest | 확장자·테스트 파일 패턴을 rules.json requireTest에 설정으로 (`"testPatterns": ["{base}.test.{ext}", …]`) |
| 7 | 비밀값 패턴 5종 내장 | precommit-gates.mjs | 기본 내장 유지 + rules.json에서 추가/제외 가능하게; 대규모 조직은 gitleaks 연동 옵션 |
| 8 | skill-rules.json의 경로 패턴(server/** 등) | bundles 내 | 트리거를 회사/스택/프로젝트 3층으로 분리해 스택 층(contentPatterns 위주)은 라이브러리로 승격 |
| 9 | 배포 URL git+ssh 고정 | package.json repository | https 병기 또는 사설 npm 레지스트리 발행 (npm이 없는 PC 문제도 함께 해결 — 이번 설치에서 실제로 겪은 문제) |
| 10 | 한국어 메시지 | 게이트·가드 전반 | (선택) 메시지 표 분리 — 한국어 회사면 그대로 둬도 무방 |

**요점: #1~#3만 해도 "mm-broker 전용 배포기"가 "임의 프로젝트 하네스 배포기"가 된다.** 나머지는 조직/언어 확장 시 순차 적용.

---

## 3. 범용화하면 안 되는 것 (라이브러리 스스로 그은 선)

| 항목 | 이유 |
|---|---|
| `knowledge/` 도메인 자료 (~293KB 엣지케이스, 영향 맵) | mm-broker 제품 지식 그 자체 — 타 프로젝트엔 무의미. 단 **"knowledge 폴더 + qa-knowledge-activator" 라는 구조(패턴)**는 범용 — 내용만 프로젝트별로 |
| mm-broker 레이어 규칙 (rules.example.json의 경로들) | 경로가 다른 프로젝트에선 inert. **예시(견본)로서의 가치**로만 유지 |
| 프로젝트 고유 스킬 (auth, layered-architecture, domain-modeling 등 9종) | 규칙은 코드와 함께 바뀌어야 함 — 빼는 순간 코드와 따로 놈 |
| 개인 메모리·settings.local·.env·QA 계정 | 공유 금지 (PARITY.md "원리적 불가" 영역) |

---

## 4. 전역화 로드맵 제안 (노력 대비 가치 순)

| 순위 | 작업 | 노력 | 얻는 것 |
|---|---|---|---|
| 1 | snapshot/gen-codex에 `--project` 인자 추가 (§2-1,2) | 하루 미만 | 두 번째 프로젝트(예: 차주 앱)부터 하네스 번들화 가능 — **수평 확장의 관문** |
| 2 | rules.json+가드 3종을 독립 폴더/패키지로 추출 | 1~2일 | "AI 편집 시점 + 커밋 + CI 3중 아키텍처 강제"를 어느 레포든 단독 도입 — 조직 표준 후보 |
| 3 | Claude 플러그인 마켓플레이스 실사용 전환 (§1-5) | 설정 위주 | 파일 복사 대신 구독형 배포·업데이트 |
| 4 | migrate 배치표 manifest화 (§2-3) | 1일 | 신규 프로젝트 이관이 "manifest 작성"으로 단순화 |
| 5 | 게이트 명령 선언화 (§2-5,6) | 1~2일 | Java/Spring 등 비-npm 팀 지원 (README의 `--stacks none` 대상들이 게이트까지 받게 됨) |
| 6 | CI 템플릿을 GitHub org `.github` 리포의 workflow template로, 브랜치 보호를 org ruleset으로 | 설정 위주 | 신규 레포마다 복사할 필요 없이 조직 차원 기본값 |
| 7 | AGENTS.md 템플릿 계층화 + 스크럽/메시지 설정화 (§2-4,7,10) | 점진 | 타 조직 배포 가능한 오픈소스급 일반성 |

### 이 Design 레포에 당장 주는 시사점

- 이 레포에서는 게이트 중 **비밀값 스캔이 항상 실효하고, 구조 규칙 중 requireTest도 실효**한다 — match가 `**/*.ts`·`**/*.tsx`로 경로 무관이라, .ts/.tsx 파일을 커밋하면 exclude에 안 걸리는 한 "대응 테스트 없음"(high)으로 차단된다. mm-broker 경로(`**/application/**` 등) 기준인 forbiddenImports 2종과 forbiddenPatterns 대부분만 inert다. 필요하면 rules.json에 이 레포 맞춤 규칙(예: `.plans/**` HTML 산출물에 API 키 금지 패턴)을 추가하는 것이 하네스를 실제로 활용하는 길이다.
- 단, **`enforce/rules.json`은 add-only가 아니다** — `--project mm-broker`를 포함해 재설치하면 install.mjs(227–231행)가 번들 규칙을 무조건 덮어써 **맞춤 규칙이 소실**된다. 맞춤 규칙을 쓰려면 재설치 시 `--project`를 빼거나, 규칙을 별도 보관 후 재적용해야 한다. `.claude/` 안의 번들 파일(QA 지식·레이어 스킬 등)은 copyAddOnly 대상이라 재설치에도 안전하며, 발동 안 하는 상태로 무해하다.

## 5. 결론 한 문장

이 라이브러리의 진짜 자산은 mm-broker 하네스 자체가 아니라 **"규칙을 데이터로, 검사를 엔진으로 분리하고, 원본은 도구 중립 md로 두고, 어댑터가 도구별 파생물을 자동 생성하며, 마지막 방어는 도구 무관 지점(git/CI)에 두는" 아키텍처**다. 하드코딩 3곳(§2-1~3)만 파라미터화하면 이 아키텍처는 어떤 프로젝트·조직에도 이식 가능한 범용 "AI 개발 거버넌스 프레임워크"가 된다.
