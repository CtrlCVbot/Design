# Route Decision Observability 적용 계약

## Global AGENTS.md

`Advisor/Worker 오케스트레이션` 섹션에 아래 의미의 규칙을 한 줄 추가한다.

- 비단순 산출물 작업의 첫 commentary에서 route mode, Advisor model/effort, Worker role/model/effort 또는 none, orchestration skill 실행 여부, 적용 trigger 또는 제외 이유를 공개한다.
- 단순 질의는 공개를 생략할 수 있다.
- main model/effort를 확인할 수 없으면 추측하지 않고 `unavailable`을 사용한다.

## Orchestration Skill

`Routing` 직후 `Routing Disclosure` 절을 추가한다.

- 표준 5-field block을 고정한다.
- direct docs-only와 review-only의 값 규칙을 명시한다.
- delegated route의 시작 값은 configured model일 수 있으나 closeout은 actual evidence로 정정한다.
- disclosure가 delegation trigger를 넓히지 않음을 명시한다.

## Acceptance

- 두 global files가 UTF-8로 유효하다.
- `test_route_observability.ps1`이 candidate와 실제 global files에서 각각 PASS한다.
- `agentic_health_check.py`의 AGENTS/custom agents/skills가 PASS한다.
- 기존 docs-only direct rule과 Worker max 3 rule은 유지된다.
- `config.toml`과 custom agent TOML은 변경하지 않는다.
