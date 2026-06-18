# Local HiFi Improvement Log - 2026-06-16

## 목적

Claude Design 재생성을 당분간 보류하고, 현재 로컬 산출물 안에서 Clean 애니메이션의 핵심 업무 피드백을 HiFi 후보본에 반영했다.

## 산출물

| 파일 | 역할 |
| --- | --- |
| `results/html/cargo-order-hifi-local-motion-20260616.html` | 기존 HiFi를 복사해 local motion layer를 주입한 후보 HTML |
| `results/html/hifi-local-motion-layer.html` | motion token, keyframes, JS helper, `aria-live`, Clean 호환 hook 보강 레이어 |
| `results/html/build-local-hifi-candidate.mjs` | 기존 오프라인 HTML template에 motion layer를 재현 가능하게 주입하는 빌드 스크립트 |

## 반영 내용

| 영역 | 반영 |
| --- | --- |
| 모션 토큰 | `--motion-fast`, `--motion-normal`, `--motion-apply`, `--motion-highlight`, `--motion-ease` 추가 |
| keyframes | soft highlight, row reveal, field flash, handoff pulse/dot, sliding absorb, address focus 추가 |
| 접근성 | `prefers-reduced-motion`, JS `matchMedia`, hidden `aria-live` status region 추가 |
| 상태 종료 | `animationend` + fallback timer로 모션 class 제거 |
| Clean 호환 hook | 주요 섹션에 `data-b-*` 성격의 local hook 보강 |
| 보존 원칙 | 기존 `화물 오더 접수수정 (오프라인).html`은 변경하지 않음 |

## 정적 검증 결과

| 항목 | 후보 결과 | 판정 |
| --- | ---: | --- |
| `@keyframes` | 7 | 통과 |
| `animation:` | 7 | 통과 |
| `prefers-reduced-motion` | 2 | 통과 |
| JS `matchMedia` | 1 | 통과 |
| `animationend` | 1 | 통과 |
| `aria-live` | 5 | 통과 |
| `data-b-*` | 8 | 통과 |
| template carrier 내 raw `</script>` | 0 | 통과 |

## 브라우저 검증 결과

검증 URL: `http://127.0.0.1:8765/.plans/wireframes/cargo-order-admin-20260430/results/html/cargo-order-hifi-local-motion-20260616.html`

| 흐름 | 결과 | 메모 |
| --- | --- | --- |
| 후보 로드 | 통과 | bundler error 없음, section 6개 로드 |
| motion layer 로드 | 통과 | `data-hifi-local-motion="local-motion-20260616"` 확인 |
| 운송+품목 입력/적용 | 통과 | sliding 후 dialog open, 적용 직후 field flash 4개, row `transform: none`, row reveal 0 |
| 화주 정보 입력/적용 | 통과 | sliding 후 dialog open, 적용 직후 field flash 3개, row `transform: none`, row reveal 0 |
| 화물맨 연동 | 통과 | 클릭 직후 dot 1개, source/target pulse, absorb 0, handoff 후 confirm dialog open |
| 화물맨 YES 적용 | 통과 | `화물맨 화물 연동중` 상태 전환, field flash 2개, row reveal 0, row `transform: none` |
| 콘솔 오류 | 통과 | 기능 오류 없음 |

## 발견 및 반영한 피드백

| 항목 | Severity | Confidence | Action | 메모 |
| --- | --- | --- | --- | --- |
| template 문자열 내부 raw `</script>`로 후보 HTML이 중간 종료될 위험 | critical | confirmed | auto-fixed | 빌드 스크립트에서 `<\\u002Fscript`로 이스케이프 처리 |
| `file://` 브라우저 자동 검증 제한 | medium | confirmed | auto-fixed | `http://127.0.0.1:8765` 로컬 서버 검증으로 전환 |
| `window.__hifiLocalMotion` expando를 브라우저 read-only evaluate에서 읽지 못함 | low | likely | queued | DOM attribute와 hook 기반 검증으로 대체 |
| Clean의 sliding absorb를 button press로 단순화한 문제 | high | confirmed | auto-fixed | `translateX(var(--hifi-absorb-x))`, `getBoundingClientRect`, delayed onclick 방식으로 정정 |

## 2026-06-16 정정 기록

초기 local candidate는 Clean의 버튼 sliding absorb를 제대로 재현하지 못하고 button press에 가까운 축소/눌림 모션을 적용했다. 이후 Clean 원본의 `absorbToLabel`, `cargo-absorb-to-kind`, `getBoundingClientRect()` 기반 거리 계산을 다시 확인해 다음처럼 수정했다.

| 항목 | 정정 전 | 정정 후 |
| --- | --- | --- |
| 버튼 모션 | `translateY`/scale 기반 press | `translateX(var(--hifi-absorb-x))` 기반 sliding absorb |
| 실행 순서 | 클릭 직후 원래 동작 실행 | sliding 완료 후 원래 `onclick` 실행 |
| 거리 계산 | 없음 | 버튼과 대상 라벨의 `getBoundingClientRect()` 차이 계산 |
| 화물 빈 행 대상 | 버튼 직전 안내문으로 잡혀 이동 거리 작음 | `kind`가 없으면 섹션 타이틀을 대상 라벨로 사용 |

## 2026-06-16 추가 정정: 적용 후 흔들림 제거

데이터 적용 후 관련 row가 `translateY(4px)`로 reveal되고, 같은 피드백이 짧은 간격으로 두 번 실행되어 흔들림처럼 보이는 문제가 있었다. 성공 적용 후에는 위치 이동이 의미상 맞지 않으므로 아래처럼 정정했다.

| 항목 | 정정 전 | 정정 후 |
| --- | --- | --- |
| 적용 후 row 피드백 | `translateY(4px)` 위치 이동 | 위치 이동 없음, 배경/테두리만 soft flash |
| 피드백 실행 | 80ms, 180ms 두 번 예약 | 120ms 한 번만 예약 |
| 중복 방지 | 없음 | 260ms 이내 같은 feedback 중복 실행 차단 |
| 브라우저 확인 | 미확인 | 적용 후 row `transform: none` 확인 |

## 2026-06-16 추가 개선: 변경값 field flash

데이터 적용 후에는 섹션이나 row를 움직이는 대신 실제 갱신된 값 컨테이너만 `hifi-motion-field-flash`로 강조하도록 바꿨다. 값 컨테이너를 찾지 못하는 예외 상황에서만 기존 row 배경 flash를 fallback으로 사용한다.

| 항목 | 반영 내용 |
| --- | --- |
| 신규 모션 | `hifi-motion-field-flash` keyframe/class 추가. 위치 이동 없이 배경/테두리만 680ms 강조 |
| 대상 선택 | `.cell__value`, `.cell__main`, `.cell`, `.badge`, `.chip` 등 실제 값 컨테이너 우선 |
| fallback | field 대상이 0개일 때만 `hifi-motion-row-reveal` 실행 |
| 운송+품목 검증 | 적용 직후 field flash 4개: `5톤`, `축카고`, `1대`, `5.50톤`; row reveal 0, row `transform: none` |
| 화주 검증 | 적용 직후 field flash 3개: `(주)더유 물류`, `129-20-29761`, `임동진`; row reveal 0, row `transform: none` |
| 종료 상태 | 1300ms 후 field flash 0, row reveal 0, row `transform: none` |

## 2026-06-16 추가 개선: 화물맨 handoff 모션

`화물맨 연동`은 입력 다이얼로그를 여는 버튼이 아니라 외부 채널 공유 액션이므로, Clean식 sliding absorb 대상에서 제외하고 handoff 모션으로 분리했다.

| 항목 | 반영 내용 |
| --- | --- |
| 버튼 클릭 | `confirmHmLink()`를 즉시 실행하지 않고 handoff dot/pulse 후 확인창을 연다 |
| 전송 표현 | 버튼 중심에서 `#hm-panel .meta-row .badge` 쪽으로 `hifi-motion-handoff-dot` 1회 이동 |
| 상태 강조 | 버튼과 상태 badge에 `hifi-motion-handoff-pulse` 적용 |
| 상태 변경 후 | `doHmLink`, `hmComplete`, `hmCancelFail`, `doHmCancel`, `applyHmDriver`를 감싸 상태 chip field flash 실행 |
| 브라우저 검증 | 클릭 120ms 후 dot 1개, confirm dialog 없음, absorb 0 |
| YES 검증 | `화물맨 화물 연동중`, `화물맨 연동중` field flash 2개, row reveal 0, row `transform: none` |

## 현재 판정

`cargo-order-hifi-local-motion-20260616.html`은 `local-candidate`로 유지한다. 시각 기준본 승격은 가능 후보지만, 아직 전체 저장/취소/정산 action matrix가 확정되지 않았으므로 `promote`가 아니라 `partial-pass`로 둔다.

## 다음 액션

1. `03-action-state-matrix.md`에서 전역 액션별 모션 트리거와 상태 조건을 확정한다.
2. 금액, 주소, 차주 조회 다이얼로그의 상세 state를 추가 QA한다.
3. local motion layer를 계속 쓸지, 추후 실제 원본 소스가 생기면 소스 레벨로 이식할지 결정한다.
