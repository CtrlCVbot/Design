# logishm-dev-guidelines 하네스 분석 문서 패키지

> 분석 대상: `.references/code/logishm-dev-guidelines-main` (라이브러리 원본 스냅샷)
> 분석일: 2026-07-08 · 분석 기준 버전: `241b762` — 설치본 클론(`C:\Work\Dev\logishm-dev-guidelines`)과 레퍼런스 사본은 동일 구성 (스크립트 7종 포함, 전 파일 diff 0건 — 09 리뷰로 확인)

## 이 패키지가 답하는 질문

1. **이 라이브러리는 무엇이고 왜 이렇게 만들어졌나?** → [01-overview.md](./01-overview.md)
2. **폴더·파일이 각각 무슨 역할인가?** → [02-structure.md](./02-structure.md)
3. **전체가 어떻게 흘러가나?** (원본→라이브러리→내 프로젝트→일상 사용) → [03-flows.md](./03-flows.md)
4. **"강제(막기)"는 어떻게 구현돼 있나?** → [04-enforcement.md](./04-enforcement.md)
5. **Claude·Codex 두 도구를 어떻게 동일하게 지원하나?** → [05-codex-parity.md](./05-codex-parity.md)
6. **어디까지 범용화(전역화)할 수 있나? 무엇부터 하면 되나?** → [06-generalization.md](./06-generalization.md)
7. **Codex 전역 에이전틱 환경과 비교하면 무엇이 부족한가?** → [08-codex-global-comparison.md](./08-codex-global-comparison.md)
8. **이 패키지 자체의 리뷰 결과 (확정 지적 38건과 정정 이력)** → [09-review-findings.md](./09-review-findings.md)

## 30초 요약

logishm-dev-guidelines는 **"한 프로젝트(mm-broker)에서 다듬은 AI 개발 환경을, 회사의 누구든·어떤 AI 도구로든 한 명령으로 그대로 받게 하는 배포 시스템"**이다. 세 가지 축으로 이루어진다:

| 축 | 내용 | 핵심 파일 |
|---|---|---|
| **지침 (문서)** | 규칙·절차를 도구 중립적인 마크다운으로 관리, `AGENTS.md` 한 입구로 통일 | `guidelines/` `playbooks/` `templates/AGENTS.md` |
| **하네스 (자동화)** | 스킬 자동 주입·위반 차단 훅을 Claude와 Codex 양쪽에 배선 | `bundles/` `adapters/` |
| **강제 (게이트)** | 테스트·빌드·비밀값·구조 규칙을 커밋/CI에서 도구 무관하게 차단 | `scripts/precommit-gates.mjs` `templates/ci-gates.yml` |

설계의 한 문장: **"규칙(데이터)과 검사기(엔진)를 분리하고, 규칙은 `rules.json` 한 곳에 두어, 어떤 도구가 와도 같은 엔진 어댑터만 붙이면 된다."**

## 범용화 결론 미리보기

- **이미 범용인 것 (그대로 어느 조직/프로젝트에도 이식 가능)**: 결과 게이트, rules.json 선언 체계, AGENTS.md 입구 패턴, 설치기 골격, 지표 프로브 — 자세히: [06-generalization.md](./06-generalization.md) §1
- **파라미터만 빼면 범용이 되는 것**: 번들 생성기 3종(mm-broker 하드코딩), migrate 배치표, 게이트의 npm/tsc 고정 — §2
- **범용화하면 안 되는 것**: 도메인 knowledge, 프로젝트 경로 규칙, 개인 메모리·시크릿 — §3
