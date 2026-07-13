# 실행 Context

## Repo

- root: `C:\Work\Dev\Optics\apps\mm-broker`
- branch: `feat/nbbb1-broker-order-console-new-ui-prototype`
- base HEAD: `744327f5`
- target route: `/test/broker-order-console-new`
- legacy route: `/test/broker-order-console` — read-only

## Reference

- `src/pages/Dispatches.tsx`: SHA-256 `7610ccf3a2c951900deebb7227b6bab0c78dbb8b39f2fbc2b59ed76048b72987`
- `src/index.css`: SHA-256 `9559fa9e3f819d47a56e620a225ed2c4ca371d6480be5e3304f0cbdf49ee6cf3`
- fidelity contract: `../11-cockpit-fidelity-contract.md`
- conversion contract: `../14-nb-main-code-conversion-plan.md`
- acceptance gate: `../15-ui-prototype-acceptance-gate.md`

## P0 검증

- `agentic-health-check`: custom agents·skills·commands·memories·plugins pass
- global config: stale hook trust 15개 warn, 구현 차단 아님
- project guard dry-run: testless production deny / test-first allow
- legacy focused tests: exit code 0
- 기존 warning: URL mock error log, React `act(...)`, duplicate case, Vitest deprecated config
- project hook live firing: 현재 세션 자동 증거 없음, Worker TDD + Advisor 독립 검증 fallback 적용

## Project instruction gap

`.claude/skills/react.md`, `typescript.md`, `tailwind.md`, `nextjs.md`가 참조하는 `docs/standards/**` 파일은 현재 repo에 없다. 없는 문서의 내용을 추정하지 않고 skill 본문과 기존 route 패턴을 따른다.

## Dirty state 보존

- `.next-dev-3045.err.log`
- `.next-dev-3045.log`
- `broker-order-uiux-proposal.html`

위 파일은 사용자 소유이며 수정·삭제·stage하지 않는다.
