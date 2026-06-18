# 05. Self-review

## 검토 범위

| 항목 | 상태 | 근거 |
| --- | --- | --- |
| 화면 섹션 분해 | 완료 | 상단 공통, 입력 폼, 배차 조건, 액션, 필터, 목록, 상태 바로 분리 |
| 필드 인벤토리 | 완료 | 캡처에 보이는 입력, 버튼, 체크박스, 컬럼을 문서화 |
| 와이어프레임 | 완료 | 현재 구조와 현대화 준비 구조를 모두 작성 |
| 현대화 메모 | 완료 | 보존할 업무 가치, UX 문제, 개선 전 체크리스트 작성 |
| 이미지 근거 | 완료 | `assets`에 원본 복사본과 주요 crop 저장 |
| 신규 접수 플로우 최종 반영 | 완료 | `sections/new-order-registration-flow` 기획과 결과 HTML을 최상위 문서에 연결 |
| 보조 정보 탭 최종 반영 | 완료 | `sections/reservation-area-tabs` 기획을 `cargo-order-admin-hifi-master.html`에 반영 |
| 보조 정보 섹션 마무리 기준 정리 | 완료 | `sections/reservation-area-tabs/09-planning-closure.md`에 기획 마무리 체크리스트 정리 |
| 운송 관련 다이얼로그 최근 사용 리스트 반영 | 완료 | `sections/transport-dialog-recent-lists` 기획과 master static prototype을 메인 기획에 연결 |
| 최신 HiFi 디자인 피드백 및 배차 담당자 반영 | 완료 | `10-hifi-design-polish-and-dispatch-manager-integration-log.md`에 반영 내역 기록 |

## 피드백 결과

| 항목 | Severity | Confidence | Action | 메모 |
| --- | --- | --- | --- | --- |
| 우측 끝 목록 컬럼명이 잘려 있음 | medium | confirmed | queued | 캡처 범위 한계로 `원...`까지만 식별 가능 |
| 드롭다운 내부 옵션 미확인 | medium | confirmed | queued | 닫힌 상태라 전체 옵션은 실제 프로그램 또는 추가 캡처 필요 |
| 일부 체크박스 선택 상태 불확실 | low | likely | queued | 작은 해상도와 색상 대비 때문에 `미선택처럼 보임`으로 표기 |
| 필수/선택 여부 미확정 | medium | likely | queued | 화면 경고와 업무 맥락으로 후보만 제시 |

## 자동 반영한 보완

| 보완 | 상태 | 반영 위치 |
| --- | --- | --- |
| 캡처 판독 한계 명시 | auto-fixed | `README.md`, `04-modernization-brief.md` |
| 미확인 컬럼을 확정하지 않고 표시 | auto-fixed | `01-screen-map.md`, `02-field-inventory.md` |
| 현재 구조와 개선 준비 구조 분리 | auto-fixed | `03-wireframe.md` |
| 위험 액션을 별도 분류 | auto-fixed | `04-modernization-brief.md` |
| 대안 B 확정 | auto-fixed | `03-wireframe.md` |
| A/C/D 비교안 정리 | auto-fixed | `03-wireframe.md` |
| 화물 운송정보/화물 요약/차주/화주/수수료율 묶음 보정 | auto-fixed | `03-wireframe.md` |
| Claude Design 실행 문서 정리 | auto-fixed | `claude-design-v2/`, `_archive/legacy-prompts/claude-design-v1/`. 루트 `06-claude-design-handoff.md`는 archive로 이동 |
| 신규 접수 플로우 반영 | auto-fixed | `README.md`, `01-screen-map.md`, `03-wireframe.md`, `04-modernization-brief.md`, `07-new-order-registration-flow-integration-log.md` |
| 통합 master HTML 생성 | auto-fixed | `results/html/cargo-order-admin-hifi-master.html`, `08-reservation-area-tabs-integration-log.md` |
| 보조 정보 전체 기획 본문 반영 보완 | auto-fixed | `01-screen-map.md`, `02-field-inventory.md`, `03-wireframe.md`, `04-modernization-brief.md` |
| master 데이터 없음 상태 전환 추가 | auto-fixed | `results/html/cargo-order-admin-hifi-master.html`의 `신규(F3)` 초기화 흐름 |
| 운송 관련 최근 사용 리스트 반영 | auto-fixed | `results/html/cargo-order-admin-hifi-master.html`, `09-transport-dialog-recent-lists-integration-log.md`, `sections/transport-dialog-recent-lists/` |
| 최신 HiFi 디자인 피드백 반영 | auto-fixed | `results/html/cargo-order-admin-hifi-master.html`, `10-hifi-design-polish-and-dispatch-manager-integration-log.md` |
| 배차 담당자 header chip 반영 | auto-fixed | `README.md`, `01-screen-map.md`, `02-field-inventory.md`, `03-wireframe.md`, `04-modernization-brief.md` |

## B안 확정 후 추가 검토

| 항목 | Severity | Confidence | Action | 메모 |
| --- | --- | --- | --- | --- |
| `수수료` 금액 위치 누락 가능성 | high | confirmed | auto-fixed | `운송료`, `합계`와 함께 `화물 운송정보`에 복구 |
| `추가정보` 의미 불명확 | medium | likely | auto-fixed | 업무 의미상 `품목`으로 정리 |
| `의뢰자` 명칭 혼선 | medium | likely | auto-fixed | 새 UI 기준 `화주 정보`로 정리 |
| `화물정보` 자동 요약 여부 미확정 | medium | likely | needs-verification | 자동 생성인지, 사용자 직접 편집 메모인지 확인 필요 |
| Claude Design 결과가 원본과 과하게 달라질 가능성 | medium | likely | needs-verification | `claude-design-v2/review-checklist.md`로 B안 구조 유지 여부 확인 필요 |

## 남은 확인 항목

| 확인 항목 | 필요 이유 | 권장 자료 |
| --- | --- | --- |
| 드롭다운 옵션 전체 | 차종, 시간, 검색 기준을 새 UI에 정확히 이식 | 각 드롭다운 펼친 캡처 |
| 저장 validation | 필수 필드와 조건부 필수 규칙 확정 | 빈 값 저장 테스트 또는 기존 코드/매뉴얼 |
| 목록 전체 컬럼 | 가로 스크롤 뒤 숨은 컬럼 확인 | 컬럼 전체 캡처 또는 설정 파일 |
| 상태별 버튼 활성화 | 접수/완료/취소 상태에서 가능한 액션 정의 | 상태별 행 선택 캡처 |
| 모달/팝업 화면 | 조회, 점검, 안내문, 위탁증, 정보변경 흐름 확인 | 각 버튼 클릭 후 화면 캡처 |
| 화물정보 요약 생성 방식 | 화물정보가 자동 요약인지 수동 메모인지 확정 | 실제 입력/수정 동작 확인 |
| Claude Design Wireframe 결과 | B안 구조가 유지되는지 확인 | 최신 결과는 `claude-design-v2/review-checklist.md`, 1차 결과는 `_archive/legacy-prompts/claude-design-v1/review-checklist.md` 기준 검수 |
| 신규 접수 실제 API endpoint | 신규 접수 wizard 완료 후 메인 `화물등록` 버튼에서 호출할 API 확정 | 후속 개발 착수 전까지 보류 |
| 보조 정보 탭 운영 정책 | 지도 provider, 조정금 저장 방식, 정산 후 수정, 권한 정책 확정 | `sections/reservation-area-tabs/08-implementation-handoff.md` |
| 운송 관련 최근 사용 정책 | 화주별/사용자별 scope, 최근 기록 저장 시점, 개인정보 표시 범위 확정 | `sections/transport-dialog-recent-lists/self-review.md` |
| 배차 담당자 데이터 모델 | header chip은 반영됐지만 담당자 배정/변경 정책은 미확정 | 후속 배차 담당자 선택/변경 다이얼로그 기획 |

## 리스크 분류

| 리스크 | Impact | Reach | Recovery | Total | Severity | Confidence | Action |
| --- | ---: | ---: | ---: | ---: | --- | --- | --- |
| 미확인 컬럼 누락 가능성 | 1 | 2 | 1 | 4 | medium | confirmed | queued |
| 조건부 필수 규칙 오판 가능성 | 2 | 2 | 1 | 5 | high | likely | needs-verification |
| 드롭다운 옵션 누락 가능성 | 1 | 2 | 1 | 4 | medium | confirmed | queued |
| 실제 업무 순서와 문서 순서 차이 가능성 | 1 | 1 | 1 | 3 | medium | likely | needs-verification |
| 화물정보 요약 생성 방식 미확정 | 1 | 2 | 1 | 4 | medium | likely | needs-verification |
| Claude Design 결과의 구조 이탈 가능성 | 1 | 2 | 1 | 4 | medium | likely | needs-verification |
| 신규 접수 API endpoint 미확정 | 2 | 2 | 1 | 5 | high | likely | queued |
| 보조 정보 탭 운영 정책 미확정 | 2 | 2 | 1 | 5 | high | likely | queued |
| 운송 관련 최근 사용 정책 미확정 | 2 | 2 | 1 | 5 | high | likely | queued |
| 배차 담당자 데이터/권한 미확정 | 1 | 2 | 1 | 4 | medium | likely | queued |

## 종료 판단

문서 패키지는 캡처 기반 분석 산출물로는 사용 가능한 상태입니다. 와이어프레임은 `대안 B. 2열 유지 + 업무 의미 묶음 정리형`을 확정안으로 정리했습니다. 다만 실제 현대화 설계에 들어가기 전에는 `저장 validation`, `드롭다운 옵션`, `목록 전체 컬럼`, `상태별 버튼 활성화`, `화물정보 요약 생성 방식`을 추가 캡처나 프로그램 조작으로 확인해야 합니다.

## 2026-06-17 신규 접수 플로우 반영 결과

| 항목 | 결과 | 메모 |
| --- | --- | --- |
| 결과 HTML | 반영 | `results/html/new-order-registration-flow-hifi-20260617.html` 추가 |
| 최상위 문서 연결 | 반영 | `README.md`에 신규 접수 플로우 기획과 HTML 후보 위치 추가 |
| 화면 맵 | 반영 | `신규(F3)` 이후 `new-reset`부터 `new-submitted`까지 상태 흐름 추가 |
| 와이어프레임 | 반영 | wizard, 금액 후 분기, 메인 `화물등록` API 책임 분리 추가 |
| 현대화 브리프 | 반영 | 명세서형 보기, 섹션 헤더, motion/reduced motion 기준 추가 |
| API endpoint | 보류 유지 | 기획 범위에서는 확정하지 않고 후속 개발 착수 전까지 보류 |

## 2026-06-17 보조 정보 탭 반영 결과

| 항목 | 결과 | 메모 |
| --- | --- | --- |
| 통합 master HTML | 반영 | `results/html/cargo-order-admin-hifi-master.html` 생성 |
| master 데이터 없음 상태 | 반영 | 같은 파일에서 `신규(F3)` 클릭 후 보조 정보 빈 상태 확인 |
| 최상위 문서 연결 | 반영 | `README.md`에 master 파일과 보조 정보 기획 위치 추가 |
| 결과 HTML 목록 | 반영 | `results/html/README.md`에 master, source 후보, empty 후보 등록 |
| 통합 로그 | 반영 | `08-reservation-area-tabs-integration-log.md` 생성 |
| 전체 기획 본문 | 반영 | `01-screen-map.md`, `02-field-inventory.md`, `03-wireframe.md`, `04-modernization-brief.md`에 보조 정보 섹션 기준 추가 |
| 신규 접수 흐름 | 유지 | `new-reset`, `화물 등록 완료` 기준 유지 |
| 보조 정보 탭 | 반영 | `메모`, `금액 로그`, `운송 구간 지도` 탭 기준 반영 |
| 보조 정보 부분 데이터 상태 | 반영 | 화주 선택 시 메모 mock, 상차지+하차지 적용 시 지도 mock, 정산 정보 적용 시 금액 로그 mock |
| 금액 로그 | 반영 | `조정금`, `할인`, `수익 125,000원`, `610,000원` 기준 반영 |
| 브라우저 확인 | 통과 | 사용자가 `cargo-order-admin-hifi-master.html`을 열어 확인 완료 |
| 후속 반영 방식 | 확정 | 이후 섹션은 새 최종 후보로 안내하지 않고 master 파일에 병합 |
| 운영 정책 | 보류 유지 | 지도 provider, 조정금 저장 방식, 정산 후 수정, 권한 정책은 후속 확정 |

## 2026-06-17 마무리 확인 결과

| 항목 | 결과 | 메모 |
| --- | --- | --- |
| 최종 기준 파일 | 완료 | `results/html/cargo-order-admin-hifi-master.html`을 현재 통합 HiFi source of truth로 정리 |
| 데이터 없음 확인 방식 | 완료 | 별도 HTML 분리 없이 같은 master 파일에서 `신규(F3)` 흐름으로 확인 |
| 부분 데이터 확인 방식 | 완료 | 화주, 운송 구간, 정산 정보 적용 단계별 mock 노출 기준 정리 |
| 후속 정책 체크리스트 | 완료 | `sections/reservation-area-tabs/09-planning-closure.md`에 P0/P1/P2 우선순위로 분리 |
| 임시 파일 | 이상 없음 | `_tmp`, `.tmp` 패턴의 남은 작업 파일 없음 |
| 과거 후보 HTML | 보존 | 최종 기준은 아니며 비교와 rollback 참고용으로 유지 |

## 2026-06-17 운송 관련 다이얼로그 최근 사용 리스트 반영 결과

| 항목 | 결과 | 메모 |
| --- | --- | --- |
| 통합 master HTML | 반영 | `ADDR_RECENTS`, `CARGO_RECENTS`, `renderAddrResults()`, `pickCargoRecent()` 기반 static prototype 반영 |
| 최상위 문서 연결 | 반영 | `README.md`, `results/html/README.md`에 최근 사용 리스트 기준 추가 |
| 통합 로그 | 반영 | `09-transport-dialog-recent-lists-integration-log.md` 생성 |
| 전체 기획 본문 | 반영 | `01-screen-map.md`, `02-field-inventory.md`, `03-wireframe.md`, `04-modernization-brief.md`에 보조 상태 기준 추가 |
| 기존 flow 보호 | 유지 | 최근 row 클릭은 미리보기/입력폼만 갱신하고 기존 `적용` 버튼이 확정 |
| 신규 접수 wizard | 유지 | 왼쪽 프로세스 패널 정책 변경 없음 |
| 루트 handoff 정리 | 반영 | `06-claude-design-handoff.md`는 `_archive/legacy-prompts/claude-design-v1/`로 이동 |
| 운영 정책 | 보류 유지 | API/DB, 화주별/사용자별 scope, 저장 시점, 개인정보 표시 범위는 후속 확정 |

## 2026-06-18 HiFi 디자인 피드백 및 배차 담당자 반영 결과

| 항목 | 결과 | 메모 |
| --- | --- | --- |
| 통합 master HTML | 반영 | 디자인 피드백 patch, 라벨 토글 위치 정리, 배차 담당자 header chip 반영 |
| 최상위 문서 연결 | 반영 | `README.md`, `results/html/README.md`에 최신 기준 추가 |
| 전체 기획 본문 | 반영 | `01-screen-map.md`, `02-field-inventory.md`, `03-wireframe.md`, `04-modernization-brief.md`에 header 책임 정보 기준 추가 |
| 통합 로그 | 반영 | `10-hifi-design-polish-and-dispatch-manager-integration-log.md` 생성 |
| 운송 구간 중복 메타 | 반영 | 운송 구간 섹션 내부 중복 계산 메타 삭제 기준 문서화 |
| 배차 담당자 위치 | 확정 | 1번 안인 header 상태 chip 옆 compact chip으로 확정 |
| 운영 정책 | 보류 유지 | 담당자 배정/변경 데이터 모델, 권한, 이력 UX는 후속 기획 필요 |
