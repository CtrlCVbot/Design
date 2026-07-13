# 09. 전체 리뷰 결과 — 확정 지적 38건 (2026-07-08)

> ✅ **2026-07-08 반영 완료** — 아래 지적은 전부 두 패키지 문서에 반영됐다. 이 문서는 "무엇이 왜 틀렸었나"의 기록으로 남긴다. 주요 반영 결정: 훅 배선은 beck-kit 플러그인이 최종(M6 — Phase 0 임시 settings.json → Phase 2 이관·제거 명시), 커맨드는 bk- 접두사 폐기 + 프로젝트 우선·네임스페이스 구분(M8), 레포 토폴로지는 `~/.agents`=beck-agentic-kit 워킹트리(M9), 계측은 홈 파일 단일화(m8).

> 방식: 6차원 병렬 리뷰(레포 사실 대조 · 환경 실측 · Claude Code 기능 사실성 · 교차 일관성 · 설계 품질 · 완결성) 후, 지적마다 반박 전담 검증자가 실제 파일·환경·공식 문서를 재확인. 에이전트 49개. 원 지적 43건 중 38건 확정, 5건 기각.
> 대상: 분석 패키지 9개 + 기획 패키지 7개 (16개 문서)

## 🔴 Critical — 1건

### C1. [기획 06] DoD 6 "~/.claude 통째 삭제 후 재구축"은 파괴적 검증이다
`~/.claude`에는 재구축 시나리오가 복원하지 못하는 자산이 있다: `.credentials.json`(OAuth 자격), `projects/<슬러그>/memory/`(자동 메모리 — 03 §7이 "그대로 활용"하겠다고 한 바로 그 시스템), `history.jsonl`, `sessions/`. **수정**: 삭제 범위를 이 설계가 소유한 구성물(CLAUDE.md, settings의 hooks, skills/, commands/, agents/, hooks/, plugins의 beck-kit)로 한정하거나, "백업 후 삭제 + 보존 대상 명기"로 재정의.

## 🟠 Major — 16건

### 분석 패키지: 사실 오류

| # | 위치 | 내용 |
|---|---|---|
| M1 | 01-overview §1, 02-structure 트리 | **스킬 26 → 32 정정** (SOLID 리뷰 6종 누락 — 26은 번들 CLAUDE.md 표 행 수를 오인). 훅은 "16개 + lib 헬퍼 1". 총계 86 분해: commands 27 + skills 32 + hooks 17(lib 포함) + knowledge 4 + guides 1 + qa-scripts 1 + 루트 4 |
| M2 | 01-overview §2-④, 07-glossary | **"add-only는 설치기 전체 원칙" 일반화 오류.** add-only는 .claude/.codex 번들·.mcp.json·AGENTS.md·CLAUDE.md에만 적용. `docs/dev-guidelines/**`는 cpSync(force)로 **매 실행 덮어씀**(의도된 갱신 경로), --enforce의 게이트 스크립트도 덮어씀 |
| M3 | 06-generalization §4 | **"add-only라 재설치에도 안전" 위험한 오안내**: `--project mm-broker` 재설치 시 install.mjs 227–231행이 번들 rules.json을 `enforce/rules.json`에 무조건 덮어써, 같은 절이 권한 "이 레포 맞춤 규칙"이 소실된다. 맞춤 규칙 보존 방법을 함께 서술해야 함 |
| M4 | 02-structure 마지막 절, README 머리말 | **"설치본 클론에는 스크립트 3개뿐" 허위.** git 실측: 커밋 241b762에 스크립트 7종·PARITY.md·adapters 전부 포함, 두 사본은 CRLF 차이 외 완전 동일(diff 0건). 해당 절 삭제 또는 "동일 구성" 정정 |

### 기획 패키지: 설계 결함

| # | 위치 | 내용 |
|---|---|---|
| M5 | 02 §2, 04 §2·§6 | **개인 마켓 설계가 실측과 불일치 (2겹)**: ① 위치 — Claude 규약은 `<루트>/.claude-plugin/marketplace.json`인데 기존 파일은 루트 배치. ② 형식 — 기존 파일은 Codex 전용 스키마(`source:{source:"local"}` 등)로 Claude 스키마(name/owner/plugins, "local" 타입 없음)와 비호환. **"기존 파일에 Claude 항목 추가"는 동작하지 않음** → Claude용 마켓 정의를 별도 파일(.claude-plugin/marketplace.json)로 분리 |
| M6 | 04 §3 ↔ 02·03·05·06 | **훅 배선 이중 설계 미해소**: 04는 "플러그인 hooks가 기본안, settings.json은 폴백"인데 나머지 4개 문서는 settings.json 배선을 표준으로 기술. Phase 0(settings) → Phase 2(beck-kit hooks) 사이 **이관(제거) 단계가 없어 훅 이중 실행 예정**. 택일 후 전 문서 통일 + Phase 2에 이관 행 추가 |
| M7 | 03 §5 배선 원칙 | **danger-guard의 fail-open 정당화 붕괴**: "최종 방어선은 L3" 논리는 ① G5의 대상 시나리오(하네스 없는 폴더)에 L3가 없고, ② L3 게이트는 커밋 시점 검사뿐이라 파괴 명령(push --force, rm -rf)을 구조적으로 못 다룸. secret-filter에만 유효한 논리 — 훅별로 정당화 분리 필요 |
| M8 | 02 §3 ↔ 03 §3·04 §3·06 | **커맨드 네이밍 자기 위반 + 실측 충돌**: bk- 접두사 규칙을 kit 커맨드(/wrap 등)가 스스로 위반, `/wrap`은 하네스가 모든 설치 프로젝트에 까는 프로젝트 커맨드와 실제 충돌(Design 레포에 wrap.md 실존). 규칙 적용(/bk-wrap) 또는 규칙 개정(네임스페이스 호출 /beck-kit:wrap) 택일 |
| M9 | 02 §2 관리 원칙 | **beck-agentic-kit 레포 토폴로지 미정**: 호스팅 위치(R6 성립엔 PC 외부 필수)와 레포↔~/.agents 관계(클론=~/.agents인지, 별도 클론+setup 배치인지 — 02와 04가 상충) 확정 필요 |
| M10 | 03 §5 danger-guard | **차단 패턴 목록 부재 + Unix 예시뿐**: 주력 셸이 PowerShell인 PC에서 `Remove-Item -Recurse -Force`, `rd /s /q`, `git clean -fdx` 미고려 → G5가 조용히 실패. DoD 4도 git push --force 1건만 실측. 패턴 부록 확정 + PowerShell 도구 매처 확장 + DoD에 PS 명령 실측 추가 |
| M11 | 04 §6 | **대화형 /plugin vs R6(스크립트 재구축) 충돌** — 검증 중 해결책 확인됨: 비대화형 CLI `claude plugin marketplace add` / `claude plugin install`이 실재(로컬 확인). setup.mjs가 이를 호출하도록 재구축 절차 전면 스크립트화 |
| M12 | 02 §5, 04 §4, 06 리스크 표 | **Codex 쪽 sync 방법 부재** — 검증 중 사실 확인: Codex는 `~/.agents/skills`를 **네이티브 직접 로드**(skills 66 = 24+10+32 산식으로 확증). "~/.codex 반영" 화살표를 "Codex가 직접 로드(별도 조치 불요)"로 정정하고 kit-release 절차와 리스크 표의 어긋남 해소 |

## 🟡 Minor — 21건 (묶음 정리)

**집계·인벤토리 정밀도** (분석 패키지):
- m1. guidelines/company 10 → **11** (planner-onboarding.md 누락 — 하필 비개발자 타깃의 진입 문서. 패키지 전체에서 미언급) [02-structure, 2곳]
- m2. guidelines/stack 13 → **14** (자체 분해 2+10+2=14와도 자기모순) [02-structure]
- m3. 번들 루트 파일 나열에 popbill-issue-api.md 누락 [02-structure]
- m4. README 현재 상태 표: ~/.claude 3개 폴더는 "빈 폴더"가 아니라 **미존재**; settings.json은 124B·4키 (고정 수치 대신 내용 기준 서술 권장) [기획 README]

**서술 정밀도**:
- m5. "v0.2 이전 방식" → **v0.3 이전** (rules.json 선언화는 v0.3 산물) [08]
- m6. **requireTest는 이 레포에서도 실효** — match가 `**/*.ts(x)` 경로 무관이라 .ts 커밋 시 차단됨. "레이어 규칙만 inert"로 정정 [06-generalization §4]
- m7. claude-kit 커맨드 "대부분 plan/copy" → 실제 최다는 **dev-* 21/38**. 커맨드 도입 우선순위 판단 근거 재서술 [기획 03 §3]

**설계 보강** (기획 패키지):
- m8. 계측 싱크 이원 서술(02 §4 프로젝트 파일 vs 03 §5 홈 파일) — **홈 파일로 단일화** (프로젝트 트리 기록은 git status 오염 → R4 위반) [02·03]
- m9. 200ms 예산: 근거 없음 + 이벤트당 합산 미통제 + **아무 검사도 지연을 측정 안 함**(리스크 표의 완화책 A2·A9는 시간을 못 잼). probe에 duration 기록 + doctor에 p95 검사 신설. 참고: 같은 이벤트 훅은 병렬 실행 [01 N1, 05]
- m10. Phase 1 산출물이 Phase 2까지 **어떤 경로로도 로드 불가**(검증 열 부재), /doctor-agentic 커맨드(P1)와 엔진 doctor.mjs(P2) 분리 오류 — L1 우선 배치 후 승격 또는 beck-kit 0.0.x 조기 설치로 해소 [06]
- m11. doctor.mjs 배포 위치 미정(beck-kit 트리에 scripts/ 없음) + A3용 릴리스 해시 매니페스트 위치·형식 미정 [04 §3, 05]
- m12. secret-filter는 **출력 시점 미커버**(채팅 응답 본문 경로) — 의도적 범위 축소임과 잔여 리스크 명시 필요 [03 §5]

**완결성**:
- m13. 설치 플로우에 **1회 후속 셋업**(npm install, .env 채우기, plannotator 플러그인·playwright MCP, Codex trust) 누락 — plannotator는 패키지 전체 미등장 [분석 03-flows]
- m14. CODEX-setup "알려진 차이" 2건(프롬프트 홈 경로 폴백, MCP 도구명 매처) 미요약 [분석 05]
- m15. 08의 근거 문서가 개인 홈 경로에만 존재 — 레포 내 사본 보존 또는 핵심 수치 인라인 명시 [분석 08]
- m16. 기획 패키지에 비개발자 승인자용 용어 안내 경로 부재(frontmatter·semver·user 스코프 등 미정의 — L0~L3와 canonical은 정의돼 있음) [기획 README]
- (m17~m21: 위 Major의 파생 정정 지점들 — M1 관련 01-overview 반복 수치, M4 관련 README 반복, M5 관련 01 §3 파리티 표, M6 관련 05 A2/A3 검사 대상, M8 관련 01 G1·06 DoD 1의 /wrap 표기)

**검증 통과 확인** (지적 아님): MCP user 스코프 서술(~/.claude.json 저장, 프로젝트 우선)은 공식 문서와 일치 확인.

## 기각된 지적 5건 (참고)

1. "Codex AGENTS.md 92줄이 아니라 90줄" — 4가지 방법 재실측 결과 92줄 맞음 (리뷰어 측정 오류)
2. "마켓 자동 인식을 암시" — 대응표 같은 행에 `/plugin marketplace add` 명시돼 있음 (오독)
3. "claude-kit 캐시 구조 서술 오류" — 해당 문장은 Codex 구조 서술로 정확함 (오독)
4. "지침 '누적' 로드 주장 부정확" — 공식 문서와 일치 확인
5. "codex-primary-runtime 스킬 이식 누락" — 실측 결과 빈 디렉터리로 스킬 아님

## 총평

- **수치·인용의 대부분은 검증을 통과했다**: 스크립트 줄 수 7종, 게이트·패턴·훅 배선 표, PARITY/AUDIT 인용, 환경 실측 표, canonical 24개 A/B/C 분류(전수 일치), Codex 인벤토리 수치 인용 등.
- 반복 실패 패턴은 셋: ① **집계를 표 행 수로 대신함** (스킬 26), ② **원칙의 과잉 일반화** (add-only), ③ **설계 문서 간 접합부 미봉합** (훅 배선, 마켓 형식, 커맨드 네이밍).
- 특히 M3(맞춤 rules.json 소실)와 C1(메모리·자격 증명 파괴)은 독자가 문서를 따르면 실제 데이터를 잃는 지점이므로 우선 수정 대상이다.
