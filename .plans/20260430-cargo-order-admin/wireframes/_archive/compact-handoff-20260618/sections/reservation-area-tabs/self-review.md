# 예약 영역 탭 기획 Self-Review

## 리뷰 범위

| 항목 | 상태 | 근거 |
| --- | --- | --- |
| 문서 위치 | 완료 | `sections/reservation-area-tabs` 하위에 패키지 구성 |
| shadcn 기준 반영 | 완료 | `results/html/Design System.html`의 shadcn 기준을 구현 기준으로 문서화 |
| 컴포넌트 매핑 | 완료 | `06-design-system-component-mapping.md`에 shadcn 탭별 매핑 추가 |
| HTML 후보 생성 | 완료 | `cargo-order-hifi-reservation-tabs-shadcn-20260616.html`에 최신 기획 기준 반영 완료 |
| 구현 인계 문서 | 완료 | `08-implementation-handoff.md`에 최종 결정, 구현 순서, 데이터 필드 초안, 검증 체크리스트 정리 |
| 탭 목적 분리 | 완료 | 지도는 경로/주소 상태 확인, 메모는 리스트 중심의 사람 기록, 금액 로그는 청구금/배차금/수익 명세로 분리 |
| MVP와 확장 범위 | 완료 | 전체 문서와 탭별 문서에서 MVP/후속 확장 분리 |
| 기존 접수/수정 충돌 방지 | 완료 | 주소/금액 수정은 기존 섹션에서 처리하고 예약 영역은 보조 확인으로 제한 |
| 상태 정의 | 완료 | 모든 탭에 빈/로딩/오류/데이터 있음 상태 정의 |
| acceptance criteria | 완료 | 전체, 탭별, 상태 매트릭스 기준으로 작성 |
| 관련 문서 누락 점검 | 완료 | `README`, `01`~`08`, `self-review` 간 헤더명, 탭 순서, 빈 상태, 금액 명세 기준 점검 |

## 검증 기준 점검

| 검증 기준 | 결과 | 메모 |
| --- | --- | --- |
| 문서가 `sections` 하위의 적절한 위치에 정리되었는지 | 통과 | `reservation-area-tabs` 신규 패키지로 정리 |
| 3개 탭의 목적과 역할이 서로 겹치지 않는지 | 통과 | 각 탭의 담당 질문과 제외 범위를 명시 |
| 각 탭의 MVP와 후속 확장 범위가 분리되어 있는지 | 통과 | `02`, `03`, `04`에 탭별로 분리 |
| 기존 접수/수정 화면과 충돌하지 않는지 | 통과 | 주소 수정/금액 수정 책임을 기존 섹션으로 유지 |
| 구현팀이 다음 단계로 바로 넘어갈 수 있는 acceptance criteria가 있는지 | 통과 | `RAT`, `MAP`, `MEMO`, `AMT`, `STATE` 기준 작성 |
| self-review에서 리스크와 후속 확인 사항이 정리되었는지 | 통과 | 아래 리스크 표와 확인 필요 정책 정리 |

## 검증 실행 기록

| 검증 | 결과 | 메모 |
| --- | --- | --- |
| 파일 존재 확인 | 통과 | 10개 문서가 `sections/reservation-area-tabs` 하위에 생성됨 |
| shadcn 기준 파일 확인 | 통과 | `results/html/Design System.html` 존재와 주요 shadcn 패턴 확인 |
| 컴포넌트 매핑 확인 | 통과 | `ds-section`, `seg`, `btn`, `chip`, `badge`, `notice`, `empty`, `summary-row` 매핑 작성 |
| 후보 HTML 생성 확인 | 통과 | `results/html/cargo-order-hifi-reservation-tabs-shadcn-20260616.html` 최신 기획 반영 확인 |
| Browser 탭 동작 검증 | 이전 후보 기준 통과 | 이번 변경은 정적 구조 검증 완료, in-app browser 연결 timeout으로 수동 확인 필요 |
| HTML 정적 구조 검증 | 통과 | 탭/패널 순서가 `메모`, `금액 로그`, `운송 구간 지도`이고 기본 활성 탭이 `메모`임을 확인 |
| 빈 상태 HTML 구조 검증 | 통과 | `cargo-order-hifi-reservation-tabs-empty-shadcn-20260617.html`에서 메모, 금액 로그, 운송 구간 지도 모두 같은 empty box 패턴 확인 |
| 헤더 네이밍 검증 | 통과 | 화면 노출명은 `보조 정보`, 내부 작업명은 `예약 영역`으로 분리 |
| 관련 문서 일관성 검색 | 통과 | 오래된 첫 화면 설명, 금액 로그 빈 상태 설명, 접힘 버튼 문구를 최신 기준으로 정리 |
| Browser 레이아웃 검증 | 이전 후보 기준 통과 | 빈 상태 후보는 브라우저에서 파일을 열어 수동 확인 필요 |
| 검증 스크린샷 | 이전 후보 기준 통과 | `output/playwright/reservation-tabs-shadcn-*.png` 3개 생성 |
| 핵심 항목 검색 | 통과 | 탭명, MVP, 상태, acceptance criteria, 기존 연결 항목 확인 |
| 충돌 마커 검색 | 통과 | `<<<<<<<`, `=======`, `>>>>>>>` 없음 |
| trailing whitespace 검색 | 통과 | 줄 끝 공백 없음 |
| `git diff --check` | 미실행 | `C:\Work\Dev\Design`이 Git 저장소로 인식되지 않아 대체 검증 수행 |
| 2026-06-17 추천 결정안 반영 | 통과 | 지도 중복 주소 제거, 메모 dialog, 금액 명세형 로그 기준을 문서와 HTML에 반영 |
| 2026-06-17 보조 정보 전체 기획 재점검 | 통과 | 9개 문서와 2개 HTML 후보의 헤더명, 탭 순서, 공통 empty box, 금액 명세 기준 확인 |
| 오래된 문구 검색 | 통과 | 기존 첫 화면 설명, 금액 로그 빈 상태 오해 문구, 접힘 버튼 이전 명칭이 남아 있지 않음 |
| 구현 인계 체크리스트 확인 | 통과 | 최종 결정, 구현 순서, 데이터 필드 초안, 구현 전 확인 필요, 검증 체크리스트를 별도 문서로 분리 |

## 피드백 및 반영 결과

| 항목 | Severity | Confidence | Action | 메모 |
| --- | --- | --- | --- | --- |
| 기존 placeholder의 `aria-hidden="true"` 잔존 가능성 | medium | confirmed | auto-fixed | HTML 후보는 `aria-label="보조 정보"` 기준으로 전환했고, 실제 구현 시 탭 semantics 유지 확인 필요 |
| 지도 provider와 예상 시간 기준 미확정 | medium | likely | needs-verification | API/요금/정확도 정책 확정 전에는 placeholder 또는 mock 기준 필요 |
| 지도 탭의 상차/하차 주소 중복 표시 | medium | confirmed | auto-fixed | 하단 전체 주소 summary row 반복을 제외하고 핀/상태 chip 중심으로 문서 갱신 |
| 금액 로그의 변경 전/후 중심 표현 | medium | confirmed | auto-fixed | 청구 조정금, 배차 조정금, 수익을 명세서형으로 보여주고 담당자/일시는 상세 항목으로 분리 |
| 메모 탭의 상시 입력폼 노출 | medium | confirmed | auto-fixed | 리스트 중심 화면과 `메모 추가` dialog 방식으로 문서 갱신 |
| 금액 로그와 메모의 사유 중복 가능성 | medium | likely | auto-fixed | 공식 금액/조정금 사유는 금액 로그, 보조 설명은 메모로 문서에서 분리 |
| 정산 후 금액 수정 정책 미확정 | medium | likely | needs-user-input | 정산 완료 후 수정 가능 여부와 승인 정책 확인 필요 |
| 메모 수정/삭제 권한 미확정 | low | likely | queued | MVP에서는 추가만 우선하고 수정/삭제는 후속으로 분리 |
| shadcn 기준 누락 가능성 | low | confirmed | auto-fixed | `Design System.html`의 shadcn 기준을 README, 전체 기획, 상태 매트릭스에 반영 |
| 구현 전 컴포넌트 선택 기준 부족 | low | confirmed | auto-fixed | `06-design-system-component-mapping.md`로 shadcn 탭별 컴포넌트 매핑 추가 |
| 기존 HiFi 후보 덮어쓰기 위험 | low | confirmed | auto-fixed | 기존 파일은 유지하고 `cargo-order-hifi-reservation-tabs-shadcn-20260616.html` 새 후보로 분기 |
| 1차 HTML 후보와 최신 기획의 차이 | medium | confirmed | auto-fixed | 최신 기획 기준을 `cargo-order-hifi-reservation-tabs-shadcn-20260616.html`에 반영 |

## 리스크 분류

| 리스크 | Impact | Reach | Recovery | Total | Severity | Confidence | Action |
| --- | ---: | ---: | ---: | ---: | --- | --- | --- |
| 지도 API provider, 좌표 저장, 예상 시간 산정 기준이 확정되지 않으면 구현 범위가 흔들릴 수 있음 | 2 | 1 | 1 | 4 | medium | likely | needs-verification |
| 실제 구현 중 기존 placeholder 코드를 되살리면 보조 기술 사용자에게 `보조 정보` 기능이 보이지 않을 수 있음 | 2 | 1 | 1 | 4 | medium | tentative | needs-verification |
| 정산 처리 후 금액 수정 정책이 확정되지 않으면 금액 로그의 안내 문구와 액션 제한이 달라질 수 있음 | 2 | 1 | 1 | 4 | medium | likely | needs-user-input |
| 조정금 사유 코드가 후속에서 과도하게 세분화되면 운영자가 입력 시 선택에 오래 걸릴 수 있음 | 1 | 1 | 1 | 3 | medium | likely | queued |
| 메모 유형이 많아지면 운영자가 어느 유형을 선택해야 할지 헷갈릴 수 있음 | 1 | 1 | 1 | 3 | medium | likely | queued |
| 우측 패널 정보가 많아지면 기존 좌측 입력 흐름의 집중도가 낮아질 수 있음 | 1 | 1 | 1 | 3 | medium | tentative | queued |

## 자동 반영한 보완

| 보완 | 반영 위치 |
| --- | --- |
| 금액 변경 사유와 일반 메모의 역할 중복을 분리 | `01-reservation-tabs-planning.md`, `03-tab-memo-section.md`, `04-tab-amount-log-section.md` |
| 주소/금액 직접 수정 책임을 기존 섹션에 유지 | `01-reservation-tabs-planning.md`, `02-tab-map-section.md`, `04-tab-amount-log-section.md` |
| 모든 탭에 빈/로딩/오류/데이터 있음 상태를 강제 | `05-state-and-interaction-matrix.md` |
| 기존 motion 방향과 충돌하지 않도록 field flash 중심으로 정리 | `05-state-and-interaction-matrix.md` |
| `Design System.html`의 shadcn 기준을 예약 영역 탭의 디자인 기준으로 명시 | `README.md`, `01-reservation-tabs-planning.md`, `05-state-and-interaction-matrix.md` |
| 예약 영역 탭별 컴포넌트와 토큰 매핑 추가 | `06-design-system-component-mapping.md`, `README.md`, `self-review.md` |
| shadcn 기준 예약 영역 탭 HTML 후보 생성 | `../../results/html/cargo-order-hifi-reservation-tabs-shadcn-20260616.html`, `README.md`, `self-review.md` |
| 최신 기획 기준 HTML 후보 갱신 | `../../results/html/cargo-order-hifi-reservation-tabs-shadcn-20260616.html`, `README.md`, `self-review.md` |
| Playwright 검증 스크린샷 생성 | `../../../../output/playwright/reservation-tabs-shadcn-section-desktop.png`, `../../../../output/playwright/reservation-tabs-shadcn-memo-desktop.png`, `../../../../output/playwright/reservation-tabs-shadcn-amount-desktop.png` |
| 지도 탭 하단 상차/하차 주소 반복 제거 기준 반영 | `01-reservation-tabs-planning.md`, `02-tab-map-section.md`, `05-state-and-interaction-matrix.md`, `06-design-system-component-mapping.md` |
| 메모 리스트 중심 + 추가 dialog 기준 반영 | `01-reservation-tabs-planning.md`, `03-tab-memo-section.md`, `05-state-and-interaction-matrix.md`, `06-design-system-component-mapping.md` |
| 금액 로그 명세서형 표시 + 상세 항목 펼침 기준 반영 | `01-reservation-tabs-planning.md`, `04-tab-amount-log-section.md`, `05-state-and-interaction-matrix.md`, `06-design-system-component-mapping.md`, `../../results/html/cargo-order-hifi-reservation-tabs-shadcn-20260616.html` |
| `보조 정보` 헤더명, 탭 순서, 공통 empty box 기준 문서 간 일관화 | `README.md`, `01-reservation-tabs-planning.md`, `02-tab-map-section.md`, `04-tab-amount-log-section.md`, `05-state-and-interaction-matrix.md`, `06-design-system-component-mapping.md`, `07-visibility-rules.md` |
| 금액 증감 용어를 `조정금`으로 통일하고 `+/-` 부호로 증감 의미를 확인하는 기준 반영 | `README.md`, `01-reservation-tabs-planning.md`, `04-tab-amount-log-section.md`, `05-state-and-interaction-matrix.md`, `06-design-system-component-mapping.md`, `07-visibility-rules.md`, HTML 후보 2개 |
| MVP 조정금 사유 코드 4종과 `금액 입력` 다이얼로그/`금액 로그` 상세 row 연결 기준 반영 | `04-tab-amount-log-section.md`, `05-state-and-interaction-matrix.md`, HTML 후보 2개 |
| 구현 인계용 최종 체크리스트 추가 | `08-implementation-handoff.md`, `README.md`, `self-review.md` |

## 후속 확인 필요

| 항목 | 필요 결정 |
| --- | --- |
| 기본 탭 | `메모`를 첫 번째 탭이자 기본 탭으로 확정 완료 |
| 지도 provider | 실제 지도 API와 비용/쿼터 정책 확인 |
| 예상 시간 | 실시간 교통 반영 여부와 상하차 대기 시간 포함 여부 확인 |
| 메모 권한 | 작성, 수정, 삭제, 공개 범위 정책 확인 |
| 금액 로그 | 항목별 대상 저장 방식, 변경 사유 필수 여부, 정산 후 수정 가능 여부 확인 |
| HTML 후보 | 브라우저 캐시가 남는 경우 `?v=20260617-amount-tabs` 쿼리 또는 강력 새로고침으로 최신 후보 확인 |
| 접근성 | 실제 구현 시 `aria-label="보조 정보"`, `tablist`, `tab`, `tabpanel` semantics 적용 확인 |

## 다음 단계

1. `08-implementation-handoff.md`를 기준으로 구현 작업을 `패널 shell`, `메모`, `금액 로그`, `운송 구간 지도`, `공통 검증` 단위로 나눕니다.
2. 지도 provider와 예상 시간 산정 기준을 정책으로 확정합니다.
3. 조정금의 항목별 대상 저장 방식, 변경 사유 필수 여부, 정산 후 수정 가능 여부를 운영 정책으로 확정합니다.
4. 메모 작성/수정/삭제 권한과 공개 범위를 확정합니다.
5. 확정된 정책을 기준으로 실제 데이터 모델과 API 응답 필드를 설계합니다.
