# UI Prototype 검증 보고서

- 검증일: 2026-07-10
- branch: `feat/nbbb1-broker-order-console-new-ui-prototype`
- base HEAD: `744327f5`
- target: `/test/broker-order-console-new`
- gate: `G-UI pending`

## 결론

신규 UI prototype은 route-local in-memory 상태로 구현됐고, 실제 API·저장·backend/service를 호출하지 않는다. 신규 테스트, legacy 회귀, 타입 검사, production build, project guard, 브라우저 주요 interaction이 모두 통과했다.

## 자동 검증

| 항목 | 명령/범위 | 결과 |
|---|---|---|
| 신규 prototype test | `vitest run app/test/broker-order-console-new` | 9 files / 15 tests PASS |
| legacy regression | 기존 `/test/broker-order-console` focused suite | 46 files / 434 tests PASS |
| combined regression | legacy + new | 55 files / 449 tests PASS |
| typecheck | `tsc --noEmit` | PASS |
| production build | `NEXT_DIST_DIR=.next-qa-build npm.cmd run build` | PASS |
| route 포함 | Next.js route table | `/test/broker-order-console-new`, static route |
| rules guard | `.codex/codex-rules-guard.mjs --dry-run ...` | exit 0 |
| 금지 의존성 | network/storage/backend/service/timer/native dialog/cast scan | 0건 |
| legacy 무변경 | `git status --short -- app/test/broker-order-console` | clean |
| UTF-8 | 신규 `.ts/.tsx/.css` 20개 | PASS |

## 브라우저 검증

| 상태 | 검증 동작 | 결과 |
|---|---|---|
| CK-01 | 최초 진입 | 좌 등록 + 우 목록, 2-pane 확인 |
| CK-02 | `가온물류 상세 보기` | `aria-expanded=true`, inline detail 4개 section 확인 |
| CK-03 | 차주 배정 → 장기사 선택 → demo 배정 | 선택 `aria-pressed=true`, 현재 차주에 장기사 반영, mode 복귀 |
| CK-04 | 상하차지 추천 → 공덕로 선택 | 추천 panel 닫힘, 상차지 `서울 마포구 공덕로` 반영 |
| CK-05 | filter/collapse 상태 | `배차중 (1)` row 1개, collapse/restore test PASS |
| browser console | error/warn 조회 | 0건 |

## TDD와 repair 증거

- Worker가 component behavior test를 먼저 만들고 production component를 구현했다.
- Advisor가 rules guard deny, fixture 위치, prototype banner layout 문제를 독립 발견했다.
- repair 후 production file별 basename test를 포함해 9 files / 15 tests가 통과했다.
- Worker 완료 보고를 그대로 승인하지 않고 Advisor가 test·type·build·guard·browser를 다시 실행했다.

## Build warning

다음 warning은 build 실패가 아니며 현재 prototype 범위에서 수정하지 않았다.

- 기존 Sentry `onRequestError`·`instrumentation-client.ts` 권고
- LMS 운영 환경변수 미설정에 따른 FakeSmsGateway 안내
- webpack cache big string 성능 warning

## 범위 확인

- 변경 허용: `app/test/broker-order-console-new/**`
- legacy route: 무변경
- backend/service/repository/domain/schema: 무변경
- package·lockfile·전역 config: 무변경
- commit/push/PR: 수행하지 않음
