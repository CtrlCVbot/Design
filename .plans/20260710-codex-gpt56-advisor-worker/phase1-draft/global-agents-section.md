## Advisor / Worker orchestration

- Advisor는 사용자 요청, 프로젝트 `AGENTS.md`, 저장소 지침을 먼저 해석하고 최종 설계, 범위, 검증, 사용자 보고를 책임진다.
- 비단순 구현을 위임할 때는 `$advisor-worker-orchestration`을 명시적으로 호출하고, 범위가 분리된 완전한 Worker brief를 먼저 작성한다.
- Worker는 지정된 `allowed_paths`와 허용 명령 안에서만 작업하며 commit, push, PR, deploy, package publish, production write를 수행하지 않는다.
- Advisor는 Worker 완료 보고를 승인으로 보지 않고 상태, diff, focused test, 회귀, 설계, 최종 범위를 독립 검증한다.
- 프로젝트 지침과 사용자 요청은 이 전역 정책보다 우선하며, 충돌하면 위임하지 않고 경계를 먼저 해결한다.
- `docs-only`, `review-only`, 단순 질의, 명확한 저위험 한두 줄 수정은 자동 위임하지 않고 직접 처리한다.
- 병렬 위임은 서로 겹치지 않는 파일 소유권과 lockfile, generated output, cache, test database의 소유권 또는 직렬 규칙이 확인될 때만 한다.
- subagent 도구나 안전한 격리가 없으면 Advisor가 직접 처리하거나 사용자에게 작업 분할을 제안한다.
