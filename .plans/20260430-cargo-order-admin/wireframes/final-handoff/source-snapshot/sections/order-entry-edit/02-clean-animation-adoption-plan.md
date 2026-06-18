# Clean 애니메이션 반영 계획

## 목적

`Cargo Order B Implementation Clean.html`에 들어 있는 업무 피드백 애니메이션을 신규 HiFi 결과물에 반영하기 위한 계획이다.

이번 단계는 애니메이션을 바로 구현하는 것이 아니라, 어떤 모션을 유지하고 어떤 방식으로 HiFi에 이식할지 확정하는 것이다.

단, 2026-06-16 기준으로 Claude Design 재생성은 보류하고 로컬 후보본을 직접 개선하는 방식으로 전환했다.

## 검토 대상

| 구분 | 파일 | 역할 |
| --- | --- | --- |
| 애니메이션 기준 | `../reference-snapshot/wireframe/Cargo Order B Implementation Clean.html` | 기존 동작/모션 기준 |
| 반영 대상 | `../../_archive/compact-handoff-20260618/results/html/화물 오더 접수수정 (오프라인).html` | 신규 HiFi 시각 기준본 |
| 로컬 후보 | `../../_archive/compact-handoff-20260618/results/html/cargo-order-hifi-local-motion-20260616.html` | 기존 HiFi에 local motion layer를 주입한 개선 후보 |
| 기획 기준 | `01-entry-edit-refinement-plan.md` | 접수/수정 상태와 전역 액션 기준 |

## 확인 결과

| 항목 | Clean | HiFi | 판단 |
| --- | ---: | ---: | --- |
| `@keyframes` | 8 | 0 | HiFi에는 핵심 업무 모션 없음 |
| `animation:` | 16 | 0 | 적용/전환 피드백 미반영 |
| `transition:` | 24 | 5 | HiFi는 hover/focus 전환 중심 |
| `prefers-reduced-motion` | 4 | 0 | 접근성 보강 필요 |
| JS `matchMedia` reduced motion | 3 | 0 | 사용자의 모션 줄이기 설정 미반영 |
| `animationend` | 3 | 0 | 모션 완료 후 상태 전환 계약 없음 |
| `aria-live` | 4 | 2 | 상태 안내는 HiFi에서 일부 약함 |

## Clean 모션 인벤토리

| 모션 | Clean 계약 | 쓰임 | 반영 우선순위 |
| --- | --- | --- | --- |
| 주소 포커스 강조 | `address-section-focused`, `routeAddressFocusIn` | 상차/하차 주소 셀 hover/focus/click 시 변경 가능 영역을 강조 | P1 |
| 적용 흡수 모션 | `change-absorbing`, `route-change-absorbing`, `cargo-absorb-to-kind`, `absorbToLabel` | 버튼이 결과 라벨 쪽으로 이동하며 적용 완료를 암시 | P1 |
| 입력 활성화 모션 | `activating`, `activated`, `cargo-compact-absorb-to-kind` | 운송+품목, 금액 입력 버튼에서 결과 row로 전환 | P1 |
| 적용 완료 reveal | `just-applied`, `cargo-row-reveal` | 적용된 결과 row를 짧게 하이라이트 | P1 |
| 부드러운 확인 강조 | `shipper-soft-highlight`, `motionSoftHighlight` | 화주/운송/요약/차주 row 적용 후 배경 하이라이트 | P1 |
| 차주/화물맨 상태 피드백 | `setTimeout`, `is-linking`, `is-dispatched`, `is-canceling` | API 요청중/완료/실패 상태를 시간차로 표현 | P2 |
| 다이얼로그 위치 보정 | `bDriverSnapDialogPanel`, `bDriverResetDialogSnap` | 차주 다이얼로그가 viewport 안에서 열리도록 보정 | P2 |
| inline edit affordance | `opacity` transition, 편집 pill 노출 | hover/focus 시 수정 가능성 안내 | P2 |

## 반영 원칙

| 원칙 | 내용 |
| --- | --- |
| 업무 피드백만 이식 | 장식 모션은 제외하고 적용, 저장, 조회, 취소, 정산처럼 상태 변화가 있는 흐름만 반영 |
| HiFi 시각 토큰 사용 | 색상은 Clean의 종이 톤을 그대로 쓰지 않고 HiFi의 `--warn-bg`, `--success-bg`, `--surface` 계열로 치환 |
| Clean hook 보존 | `data-*` hook, dialog semantics, `aria-live` 계약은 제거하지 않고 이식 |
| 상태 전환은 JS helper로 통일 | `animationend`와 fallback timer를 공통 helper로 묶어 중복 구현 방지 |
| motion reduce 필수 | `prefers-reduced-motion: reduce`에서는 animation/transition 없이 즉시 상태 전환 |
| 레이아웃 흔들림 금지 | `transform`, `opacity`, `background-color` 중심으로 구성하고 width/height 변경 모션은 금지 |

## 반영 범위

| 섹션 | 반영 모션 | 완료 후 기대 동작 |
| --- | --- | --- |
| 화주 정보 | `change-absorbing` + soft highlight | `화주 조회/적용` 후 행이 적용 상태로 바뀌며 짧게 강조 |
| 운송 구간 | 주소 포커스 강조 + `route-change-absorbing` | 상차/하차지 변경 버튼과 주소 셀의 연결감 강화 |
| 화물 운송정보 | `activating` → dialog open → `activated` + `just-applied` | 운송+품목/금액 적용 후 결과 row가 즉시 드러남 |
| 화물정보 요약 | `change-absorbing` + summary focus | 요약 수정 진입과 저장 완료가 구분됨 |
| 차주 정보 | `change-absorbing` + 상태 row highlight | 차주 적용, 화물맨 연동, 연동 취소 상태가 눈에 남음 |
| 전역 액션바 | 최소 transition + danger confirm focus | 등록/수정/취소/정산의 위험도와 완료 피드백을 구분 |

## 구현 단계 계획

| 단계 | 작업 | 산출물 |
| --- | --- | --- |
| 1 | motion token 정의 | `--motion-fast`, `--motion-normal`, `--motion-apply`, `--motion-highlight`, easing 토큰 |
| 2 | keyframes 이식 | `motion-absorb-to-label`, `motion-soft-highlight`, `motion-row-reveal`, `motion-address-focus` |
| 3 | JS motion helper 작성 | `runAbsorbMotion`, `revealAppliedRow`, `withReducedMotion` |
| 4 | 섹션별 hook 연결 | 화주/운송/화물/요약/차주 순으로 적용 |
| 5 | 상태 피드백 연결 | `aria-live`, status badge, dirty/saved/error 메시지와 연결 |
| 6 | QA | reduced motion, keyboard, dialog, mobile/desktop, layout shift 확인 |

## 구현 방식 선택

| 방식 | 판단 | 이유 |
| --- | --- | --- |
| local motion layer 주입 | 현재 실행 | 기존 HTML은 보존하고 후보 HTML만 재생성해 리뷰 가능 |
| 원본 소스/입력 패키지에 반영 후 HiFi 재생성 | 보류 | Claude Design 진행을 당분간 하지 않기로 함 |
| 결과 HTML 직접 패치 | 제한적 보조안 | 22MB 파일을 수동 편집하지 않고 빌드 스크립트로만 후보 생성 |
| Clean HTML을 그대로 기준본 교체 | 제외 | HiFi 시각 톤과 신규 액션바 기준이 사라짐 |

## 2026-06-16 로컬 반영 결과

상세 로그는 `../source-snapshot/artifact-audit/local-hifi-improvement-log-2026-06-16.md`에 기록했다.

| 항목 | 결과 | 판정 |
| --- | ---: | --- |
| `@keyframes` | 4 | 통과 |
| `animation:` | 4 | 통과 |
| `prefers-reduced-motion` | 2 | 통과 |
| JS `matchMedia` | 1 | 통과 |
| `animationend` | 2 | 통과 |
| `aria-live` | 5 | 통과 |
| `data-b-*` | 8 | 통과 |

브라우저에서는 운송+품목 입력/적용, 화주 정보 입력/적용, 화물맨 연동 confirm 흐름을 확인했다. 열기 버튼은 Clean처럼 `getBoundingClientRect()`로 버튼과 대상 라벨 사이 거리를 계산하고, `translateX(var(--hifi-absorb-x))` sliding 완료 후 원래 dialog open을 실행한다. 현재 후보 판정은 전체 action matrix가 확정되기 전이므로 `partial-pass`다.

## 원본 소스 확인 결과

상세 확인은 `../source-snapshot/artifact-audit/hifi-source-regeneration-check-2026-06-16.md`에 기록했다.

| 항목 | 결과 | 반영 판단 |
| --- | --- | --- |
| 로컬 중간 산출물 | `Design System.html`, `Cargo Order New.html`, `Cargo Order HiFi.html`, `ds.css` 미존재 | 로컬 소스 직접 수정 불가 |
| HiFi 오프라인 HTML | font manifest + template로 구성 | 최종 export 산출물로 취급 |
| 재생성 원본 | `claude-design-v2/PROMPT-LOG.md` | Claude Design 프롬프트 체인이 기준 |
| 권장 구현 경로 | local motion layer 후보 유지 | Claude Design 재생성은 보류하고 로컬 후보를 검증 |

## Acceptance Criteria

| 기준 | 통과 조건 |
| --- | --- |
| 모션 존재 | HiFi 결과물에 최소 4개 핵심 keyframes와 motion helper가 존재 |
| 업무 연결 | 화주/운송/화물/요약/차주 중 4개 이상 섹션에서 적용 완료 피드백 확인 |
| 접근성 | `prefers-reduced-motion` CSS와 JS 분기 모두 존재 |
| 상태 안내 | 주요 적용/취소/정산 흐름에 `aria-live` 또는 명확한 status text 연결 |
| 안정성 | animation 중 중복 클릭 방지, fallback timer, `animationend` 종료 처리 존재 |
| 디자인 일관성 | HiFi의 shadcn 톤을 유지하고 Clean의 종이 질감 색을 그대로 복사하지 않음 |

## 다음 문서

| 우선순위 | 산출물 | 목적 |
| --- | --- | --- |
| 1 | `03-action-state-matrix.md` | 애니메이션 트리거를 액션별 상태 조건과 연결 |
| 2 | `04-save-validation-summary.md` | 저장 전 validation과 상태 안내 연결 |
| 3 | `05-hifi-to-clean-integration-checklist.md` | Clean hook/accessibility/motion 보존 체크리스트 |

## 남은 확인

| 항목 | 수준 | 대응 |
| --- | --- | --- |
| HiFi 원본 소스 위치 | medium | 로컬 중간 소스는 없음. 현재는 layer 주입 후보로 우회 |
| 브라우저 직접 QA | low | `file://` 대신 `http://127.0.0.1:8765` 로컬 서버로 대표 흐름 검증 완료 |
| 전역 액션 완료 피드백 | medium | 등록/수정/복사/취소/정산별 성공/실패 상태를 action matrix에서 확정 |
