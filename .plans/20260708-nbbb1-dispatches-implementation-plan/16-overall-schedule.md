# 16. 전체 예상 일정

- 작성일: 2026-07-10
- 기준 로드맵: `12-implementation-roadmap-v2.md` v4
- 기준 branch: `feat/nbbb1-broker-order-console-new-ui-prototype`
- 일정 단위: 영업일 기준
- 일정 성격: 구현 착수 전 추정치

## 1. 결론

| 목표 | 예상 개발 공수 | 예상 기간 |
|---|---:|---:|
| 첫 UI prototype 제출·G-UI 검수 진입 | 10~14영업일 | 약 2~3주 |
| G-UI 수정 1회 반영·화면 승인 | 누적 12~18영업일 | 약 2.5~4주 |
| Phase 3 등록·목록 core 연결 완료 | 누적 19~28영업일 | 약 4~6주 |
| 상세·상태·배정·부가기능·production closeout | 누적 30~44영업일 | 약 6~9주 |
| Phase X 신규 backend 기능 | 위 일정에 미포함 | 항목별 별도 산정 |

추천 계획 기준은 **G-UI 수정 1회 + Phase X 제외 + 총 7~8주**다. 화면 수정이 없으면 단축될 수 있고, 사용자 검수 회차와 공용 service 변경 여부에 따라 9주 이상으로 늘어날 수 있다.

## 2. AI 중심 실행 일정

Codex가 Advisor/Worker 방식으로 구현·테스트·브라우저 검증을 연속 수행할 때는 일반 개발 일정 대신 아래 범위를 사용한다.

| 목표 | 순수 AI 작업 시간 | 사용자 대기 포함 예상 경과 |
|---|---:|---:|
| 첫 UI prototype·G-UI 제출 | 19~38시간 | 약 2~5일 |
| G-UI 수정 1회·승인본 확정 | 추가 3~8시간 | 약 3~7일 누적 |
| capability bridge·등록·목록 연결 | 추가 12~24시간 | 약 5~10일 누적 |
| 상세·상태·배정·부가기능 연결 | 추가 14~28시간 | 약 7~14일 누적 |
| 전체 회귀·fidelity closeout | 추가 4~8시간 | 약 8~16일 누적 |

Phase X를 제외한 전체 순수 작업량은 약 **52~106시간**이다. 환경이 안정적이고 사용자 피드백이 빠르면 **1~2주**, 테스트 실패·화면 수정 2회·인증 runtime 문제가 있으면 **2~3주**를 현실적인 AI 진행 일정으로 본다.

### AI 실행 단계별 추정

| Phase | 작업 | 순수 작업 시간 |
|---|---|---:|
| R | reference·legacy 기준선 | 1~2시간 |
| N | route·isolation·component·token foundation | 3~6시간 |
| P-01~04 | 등록·목록·상세·배정·추천 prototype | 12~24시간 |
| P-05~06 | 전체 상태·screenshot·검수 패키지 | 3~6시간 |
| G-UI revise | 사용자 수정 1회 | 3~8시간 |
| B | capability bridge·runtime·validation·cache | 4~8시간 |
| C | 등록·목록·submit 실제 연결 | 8~16시간 |
| D | 상세·상태·배정 실제 연결 | 8~16시간 |
| E/F | frontend-only·Phase 3-only 배치 | 6~12시간 |
| Q | 회귀·build·browser·fidelity closeout | 4~8시간 |

### AI 일정 해석 규칙

- 순수 작업 시간은 Codex가 도구를 실행하며 실제로 작업하는 시간이다.
- 사용자 확인을 기다리는 G-UI 정지 시간은 순수 작업 시간에서 제외한다.
- 테스트·build·브라우저 screenshot 실행 시간은 포함한다.
- Worker 완료 후 Advisor 독립 검증과 repair loop 1회를 포함한다.
- 여러 파일을 동시에 수정하는 병렬 write는 가정하지 않는다.
- 세션 중단, PC 종료, 인증 만료, 외부 API 장애는 경과시간을 늘린다.
- AI가 빠르게 작성하더라도 G-UI 승인과 backend 변경 승인을 생략하지 않는다.

### 추천 AI 운영안

| 구간 | 권장 운영 |
|---|---|
| 1차 세션 | R/N과 P-01~02 완료 |
| 2차 세션 | P-03~06, screenshot, G-UI 제출 |
| 사용자 검수 | `revise / approved` 결정까지 정지 |
| 3차 세션 | 승인본 수정·B capability bridge |
| 4차 세션 | C/D 실제 기능 연결 |
| 5차 세션 | E/F/Q closeout |

한 세션에 모든 범위를 밀어 넣기보다 G-UI 전후와 core/closeout을 분리하는 편이 context와 검증 증거를 안정적으로 유지한다.

## 3. 산정 가정

1. Advisor 1개 세션과 Worker 1개 구현 흐름을 기준으로 한다.
2. 한 번에 하나의 주요 UI slice를 구현·검증하며 병렬 write는 하지 않는다.
3. 기존 `broker-order-console`은 수정하지 않는다.
4. G-UI 전에는 API·실제 mutation·backend/service를 연결하지 않는다.
5. G-UI 사용자 검수는 1~3일 안에 피드백을 받는다고 가정한다.
6. UI 수정은 1회, 2~4영업일을 기본값으로 잡는다.
7. Phase B 이후 기존 Phase 3 service/hook을 그대로 재사용할 수 있다고 가정한다.
8. Phase X의 AI·채팅·위치·신규 DB field는 포함하지 않는다.
9. 휴일, 사용자 대기, 외부 장애는 개발 공수와 별도로 본다.

## 4. 단계별 상세 공수

| 순서 | Phase | 주요 작업 | 예상 공수 | 누적 | 완료 조건 |
|---:|---|---|---:|---:|---|
| 0 | 준비 | branch·문서·저장 위치·G0 범위 확인 | 0.5일 | 0.5일 | 구현 branch와 문서 SSOT 확정 |
| 1 | R | reference hash, screen contract, legacy 434 tests 기준선 | 1~1.5일 | 1.5~2일 | reference·회귀 기준선 통과 |
| 2 | N | 신규 route, isolation test, component boundary, token foundation | 2~3일 | 3.5~5일 | CK-01 static shell |
| 3 | P-01 | 기본 등록·목록 interaction prototype | 2~3일 | 5.5~8일 | 등록·목록 기본 상태 |
| 4 | P-02~04 | 상세·배정·추천·collapse interaction | 3~4일 | 8.5~12일 | CK-02~05 조작 가능 |
| 5 | P-05~06 | 전체 상태 preview, screenshot, gap·검수 패키지 | 1.5~2일 | 10~14일 | G-UI 제출 가능 |
| 6 | G-UI | 사용자 검수와 수정 1회 | 2~4일 + 대기 | 12~18일 | `G-UI approved` |
| 7 | B | capability bridge, auth/runtime, validation, cache preflight | 3~4일 | 15~22일 | bridge exit gate |
| 8 | C | 등록·목록·submit·retry 실제 기능 연결 | 4~6일 | 19~28일 | core journey 통과 |
| 9 | D | 상세·상태·차주 배정 실제 기능 연결 | 4~6일 | 23~34일 | detail/status/assign 통과 |
| 10 | E/F | 새 화면 frontend-only 기능과 Phase 3-only 기능 배치 | 4~6일 | 27~40일 | 승인 화면 drift 없음 |
| 11 | Q | 전체 회귀·typecheck·build·브라우저·fidelity closeout | 3~4일 | 30~44일 | production closeout |

## 5. 주차별 권장 일정

실제 착수를 다음 영업일부터 한다는 가정의 상대 일정이다. 날짜는 세션 시작일과 휴일에 따라 이동한다.

| 주차 | 목표 | 사용자 확인 |
|---:|---|---|
| 1주차 | R 완료, N foundation, CK-01 시작 | 없음 |
| 2주차 | P-01~04, 기본·상세·배정·추천 상태 | 중간 화면 공유 가능 |
| 3주차 | P-05~06, visual evidence, G-UI 제출 | **필수 화면 검수** |
| 4주차 | G-UI 수정 반영·승인, B 착수 | **G-UI approved 필요** |
| 5주차 | B 완료, C 등록·목록 연결 | core 범위 확인 |
| 6주차 | C 완료, D 상세·상태·배정 | 업무 흐름 확인 |
| 7주차 | D 완료, E/F 기능 배치 | 화면 밀도 재확인 가능 |
| 8주차 | E/F 완료, Q 회귀·fidelity closeout | 최종 검수 |
| 9주차 | 여유 구간 또는 보완 | 필요 시만 사용 |

## 6. Milestone

| Milestone | 산출물 | 예상 시점 | Gate |
|---|---|---:|---|
| M0 | branch·문서 기준선 | 완료 | 구현 전 |
| M1 | CK-01 static shell | 1주차 말 | N exit |
| M2 | CK-01~05 interaction prototype | 2~3주차 | P exit |
| M3 | 사용자 승인 화면 | 3~4주차 | G-UI |
| M4 | 등록·목록 실제 기능 | 5~6주차 | C exit |
| M5 | 상세·상태·배정 | 6~7주차 | D exit |
| M6 | 전체 production closeout | 8~9주차 | Q exit |

## 7. 사용자 확인이 필요한 시점

| 시점 | 확인 내용 | 미응답 시 |
|---|---|---|
| G0 | UI prototype 구현 범위 | 구현 시작 보류 |
| P 중간 공유 | 방향이 크게 어긋나는지 조기 확인 | 계획대로 P-06까지 진행 가능 |
| G-UI | 좌우 비율·밀도·등록·목록·상세·배정·추천 | Phase B 시작 금지 |
| C exit | 실제 등록·목록 동작 | D 진행 전 보완 판단 |
| E/F 배치 | Phase 3-only 기능으로 인한 화면 밀도 변화 | 큰 변경이면 재승인 |
| Q closeout | 최종 visual·journey | closeout 보류 |

## 8. 일정 변동 요인

| 변동 요인 | 예상 영향 | 처리 |
|---|---:|---|
| G-UI 수정 1회 추가 | +2~4영업일 | UI layer만 반복 |
| reference 변경 | +1~3영업일 | hash·screen contract 재검토 |
| 기존 route test 회귀 | +1~3영업일 이상 | 원인 확인 후 중단·수정 |
| auth/list API runtime 장애 | +1~3영업일 | Phase B에서 별도 기록 |
| 공용 frontend service/type 변경 필요 | +2~5영업일 | 제안·승인 후 별도 slice |
| backend/service 변경 필요 | 현재 일정에서 제외 | Phase X 또는 별도 package |
| 모바일 동시 구현 요청 | +4~8영업일 | desktop 승인 후 별도 Phase |

## 9. Phase X 별도 추정

아래는 discovery와 계약 승인 후 다시 산정해야 하는 초기 범위다. 서로 독립적이며 모두 자동 구현하지 않는다.

| 항목 | 초기 예상 | 주요 불확실성 |
|---|---:|---|
| pair·최근/최빈 운임·교차 count | 5~10영업일 | 집계 scope·주소 정규화·cache |
| 경유지 ordered points | 7~12영업일 | payload/schema/migration/distance |
| 화물 실중량 저장 | 3~5영업일 | DB owner·단위·과거 데이터 |
| 정산 예정일 | 3~5영업일 | 산식·owner·nullable |
| AI 난이도·추천 | 15영업일 이상 | scoring·evaluation·설명 가능성 |
| 차주 위치·가용·계좌 | 15영업일 이상 | 위치 source·개인정보·freshness |
| 실제 대화방 | 15영업일 이상 | channel·storage·read state·알림 |

Phase X를 전부 포함한 단일 완료일은 현재 산정하지 않는다. 먼저 필요한 항목을 선택하고 API·DB·개인정보 계약을 확정해야 한다.

## 10. 진행 기록 위치

모든 일정·진행·결정·검수 산출물은 아래 패키지 안에 둔다.

```text
C:\Work\Dev\Design\.plans\20260708-nbbb1-dispatches-implementation-plan\
├─ 16-overall-schedule.md
├─ execution\
│  ├─ plan.md
│  ├─ context.md
│  ├─ tasks.md
│  ├─ progress.md
│  └─ decisions.md
└─ evidence\
   ├─ screenshots\
   ├─ visual-gap\
   └─ verification\
```

앱 저장소에는 구현 코드와 테스트만 둔다.

## 11. 일정 운영 규칙

1. 각 Phase 시작 시 예상과 실제 공수를 `execution/progress.md`에 기록한다.
2. 2영업일 이상 지연되면 원인·영향·회복안을 기록한다.
3. G-UI 대기시간은 개발 지연과 분리한다.
4. 승인 전 범위를 미리 구현해 일정을 당기지 않는다.
5. closeout 시 최초 예상과 실제 차이를 회고한다.
