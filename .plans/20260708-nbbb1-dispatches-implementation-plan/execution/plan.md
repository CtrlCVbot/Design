# G0 UI Prototype 실행 계획

- 시작일: 2026-07-10
- 상태: UI prototype·검증 완료 / G-UI 사용자 검수 대기
- branch: `feat/nbbb1-broker-order-console-new-ui-prototype`
- code target: `C:\Work\Dev\Optics\apps\mm-broker\app\test\broker-order-console-new`
- reference: `C:\Work\Dev\Design\.references\code\nb-main`
- 중단 gate: G-UI 사용자 검수

## 목표

`nb-main`의 `/dispatches` 화면과 주요 interaction을 Next.js의 신규 test route에 in-memory prototype으로 구현한다. 실제 API·저장·배정·상태 mutation은 연결하지 않는다.

## 실행 순서

1. R — reference·legacy 기준선 고정
2. N — 신규 route·isolation·component·token foundation
3. P-01 — 등록·목록
4. P-02 — 상세 확장
5. P-03 — 차주 배정 mode
6. P-04 — 추천·collapse mode
7. P-05 — 전체 기획 상태 preview
8. P-06 — screenshot·gap·검수 패키지
9. G-UI — 사용자 승인 대기

## 변경 허용

- `app/test/broker-order-console-new/**`
- 이 Design package의 `execution/**`, `evidence/**`, 승인·진행 문서

## 변경 금지

- `app/test/broker-order-console/**`
- backend/service/repository/domain/schema
- 공용 component/hook/type/service
- package·lockfile
- 전역 config·hook·skill·memory
- 기존 사용자 untracked 파일

## 완료 조건

- CK-01~05 interaction prototype
- network/API/mutation 0건
- prototype fixture `_prototype/**` 격리
- focused test·typecheck·build 통과
- 1600×1000·1440×900 검수 evidence
- G-UI 검수 안내와 known gap 기록
