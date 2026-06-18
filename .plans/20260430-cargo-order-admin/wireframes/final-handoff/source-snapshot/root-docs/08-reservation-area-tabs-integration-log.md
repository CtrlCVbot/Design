# 08. 보조 정보 탭 최종 반영 로그

## 목적

이 문서는 `sections/reservation-area-tabs`에서 확정한 `보조 정보` 탭 기획을 최종 HiFi 결과물에 반영한 내역을 기록합니다.

이번 반영부터는 섹션별 후보 HTML을 계속 최종본처럼 늘리지 않고, 아래 단일 master 파일을 현재 통합 HiFi 기준으로 관리합니다.

`results/html/cargo-order-admin-hifi-master.html`

## 반영 기준

| 항목 | 위치 | 상태 |
| --- | --- | --- |
| 기존 최종 흐름 기준 HTML | `results/html/new-order-registration-flow-hifi-20260617.html` | 기준 |
| 보조 정보 데이터 있음 후보 | `results/html/cargo-order-hifi-reservation-tabs-shadcn-20260616.html` | 반영 |
| 보조 정보 데이터 없음 후보 | `results/html/cargo-order-hifi-reservation-tabs-empty-shadcn-20260617.html` | master 상태 전환 기준으로 반영 |
| 최종 통합 master HTML | `results/html/cargo-order-admin-hifi-master.html` | 생성 및 상태 전환 반영 완료 |
| 보조 정보 상세 기획 | `sections/reservation-area-tabs/` | 완료 |
| 구현 인계 문서 | `sections/reservation-area-tabs/08-implementation-handoff.md` | 완료 |

## 최종 결과물 네이밍

| 파일 | 상태 | 역할 |
| --- | --- | --- |
| `cargo-order-admin-hifi-master.html` | master-current | 신규 접수 플로우와 보조 정보 탭이 함께 반영된 현재 통합 HiFi 기준 파일. 기본은 데이터 있음, `신규(F3)` 초기화 후 데이터 없음 상태 |

앞으로 새 섹션 기획이 최종 결과물에 반영될 때는 이 master 파일을 기준으로 갱신합니다.

기존 후보 파일은 비교와 rollback을 위해 유지하되, 최종 결과물로 안내하지 않습니다.

## 반영 결과 요약

| 영역 | 반영 내용 |
| --- | --- |
| 결과 HTML | `new-order-registration-flow-hifi-20260617.html`을 기준으로 `보조 정보` 최신 aside와 금액 입력 dialog 기준을 병합 |
| 보조 정보 탭 | `메모`, `금액 로그`, `운송 구간 지도` 탭 순서 반영 |
| 보조 정보 데이터 없음 | 같은 master HTML에서 `신규(F3)` 클릭 후 실제 초기화 흐름으로 확인 가능하게 반영 |
| 보조 정보 부분 데이터 | 화주 선택 시 메모 mock, 상차지+하차지 적용 시 지도 mock, 정산 정보 적용 시 금액 로그 mock 표시 |
| 금액 로그 | `조정금` 용어, `대기비`, `경유비`, `할인`, `기타 조정` 사유 기준 반영 |
| 금액 입력 | `조정 사유`, `조정 대상`, `조정 금액`, `조정 설명` 입력 기준 반영 |
| 신규 접수 플로우 | `new-reset`, `화물 등록 완료`, 메인 `화물등록` CTA 책임 유지 |
| 결과물 관리 | `cargo-order-admin-hifi-master.html`을 앞으로 섹션 통합 기준 파일로 지정 |

## 반영 파일 상세

| 파일 | 반영 내용 | 상태 |
| --- | --- | --- |
| `results/html/cargo-order-admin-hifi-master.html` | 신규 접수 플로우 + 보조 정보 탭 통합 최종 master 생성 | 완료 |
| `results/html/README.md` | master 파일을 `master-current`로 등록 | 완료 |
| `README.md` | 최신 HiFi 결과물 목록에 master 파일과 보조 정보 기획 위치 추가 | 완료 |
| `01-screen-map.md` | 전체 화면 섹션 맵에 `보조 정보`를 정식 섹션으로 추가 | 완료 |
| `02-field-inventory.md` | 보조 정보 필드와 `PricingAdjustment`, `CargoMemo`, `RoutePreview` 모델 추가 | 완료 |
| `03-wireframe.md` | 보조 정보 패널 와이어프레임과 상태 기준 추가 | 완료 |
| `04-modernization-brief.md` | 보조 정보 현대화 기준과 미결정 정책 추가 | 완료 |
| `05-self-review.md` | master 생성 및 보조 정보 반영 결과 추가 | 완료 |
| `_archive/legacy-prompts/claude-design-v1/06-claude-design-handoff.md` | 당시 후속 디자인/구현 참조 기준 기록 보존. 현재 기준은 `claude-design-v2/`와 master 파일 | 완료 |
| `sections/reservation-area-tabs/09-planning-closure.md` | 보조 정보 섹션 기획 마무리 체크리스트 정리 | 완료 |

## 확정된 의사결정

| 정책 | 최종 기준 |
| --- | --- |
| 최종 HiFi 관리 파일 | `results/html/cargo-order-admin-hifi-master.html` |
| 화면 노출명 | `보조 정보` |
| 기본 탭 | `메모` |
| 탭 순서 | `메모 -> 금액 로그 -> 운송 구간 지도` |
| 금액 증감 용어 | `조정금` |
| 조정금 사유 | `대기비`, `경유비`, `할인`, `기타 조정` |
| 금액 상세 | `상세 항목 보기`에서 조정 사유, 대상, +/- 금액, 담당자, 처리 시각, 설명 확인 |
| 주소/금액 수정 책임 | 기존 좌측 접수/수정 입력 섹션 유지 |
| 데이터 있음 확인 | `results/html/cargo-order-admin-hifi-master.html` 기본 URL |
| 데이터 없음 확인 | `results/html/cargo-order-admin-hifi-master.html`에서 `신규(F3)` 클릭 후 확인 |
| 부분 데이터 확인 | 화주 선택, 상차지+하차지 적용, 정산 정보 적용 단계별로 확인 |
| 후속 섹션 반영 방식 | 새 후보를 최종본으로 안내하지 않고 `cargo-order-admin-hifi-master.html`에 병합 |

## 보류 정책

| 항목 | 상태 | 이유 |
| --- | --- | --- |
| 지도 provider | 보류 | API, 비용, 쿼터, fallback 방식 확정 필요 |
| 조정금 저장 방식 | 보류 | `둘 다` 대상 조정금을 단일 item으로 둘지 분리 저장할지 결정 필요 |
| 정산 후 수정 정책 | 보류 | 정산 완료 후 조정금 수정 가능 여부와 승인 예외 확정 필요 |
| 메모/금액 권한 | 보류 | 작성, 조회, 수정, 삭제, 마스킹 기준 확정 필요 |

세부 우선순위는 `sections/reservation-area-tabs/09-planning-closure.md`의 후속 정책 확인 항목을 기준으로 확인합니다.

## 검증 로그

| 검증 | 결과 | 메모 |
| --- | --- | --- |
| master HTML 생성 | 통과 | `results/html/cargo-order-admin-hifi-master.html` 생성 |
| 신규 접수 흐름 유지 | 통과 | `new-reset`, `화물 등록 완료` 문자열 확인 |
| 보조 정보 탭 반영 | 통과 | `data-reserve-tabs`, `메모`, `금액 로그`, `운송 구간 지도` 확인 |
| 조정금 입력 반영 | 통과 | `mi-adjust-reason`, `조정 사유`, `조정 대상`, `조정 금액`, `조정 설명` 확인 |
| 금액 명세 최신화 | 통과 | `수익 125,000원`, `610,000원`, `할인`, `-10,000원` 확인 |
| 이전 금액 잔존 여부 | 통과 | `수익 135,000원`, `+40,000원`, `620,000원`, `21.8%` 미존재 |
| 브라우저 수동 확인 | 통과 | 사용자가 `cargo-order-admin-hifi-master.html`을 열어 확인 완료 |
| master 관리 정책 확인 | 통과 | 후속 섹션은 master 파일에 병합하는 방식으로 확정 |
| master 데이터 없음 상태 반영 | 통과 | `reservation-tabs-flow-state-script`, `resetAll`, `reserve-empty` 흐름 문자열 확인 |
| master 부분 데이터 전환 스크립트 | 통과 | Node VM으로 `resetAll -> applyShipper -> applyAddr -> applyMoney` 실행 시 `empty -> memo -> memo+map -> memo+amount+map` 전환 확인 |
| 전체 기획 본문 반영 | 통과 | `01-screen-map.md`, `02-field-inventory.md`, `03-wireframe.md`, `04-modernization-brief.md`에 보조 정보 기준 추가 |
| 임시 스크립트 정리 | 통과 | `_tmp-build-hifi-master.mjs`, `_tmp-add-master-reservation-empty-state.cjs` 삭제 |

## 다음 단계

현재 최종 HiFi 기준 파일은 `cargo-order-admin-hifi-master.html`입니다.

데이터 있음 상태는 기본 화면에서 확인하고, 보조 정보 데이터 없음 상태는 `cargo-order-admin-hifi-master.html`에서 `신규(F3)`를 눌러 확인합니다.

신규 접수 중 부분 데이터 상태는 다음 기준으로 확인합니다.

| 단계 | 보조 정보 상태 |
| --- | --- |
| 신규 접수 초기화 직후 | 메모, 금액 로그, 운송 구간 지도 모두 빈 상태 |
| 화주 선택 후 | 메모 mock 표시, 금액 로그/운송 구간 지도는 빈 상태 |
| 상차지+하차지 적용 후 | 운송 구간 지도 mock 표시 |
| 정산 정보 적용 후 | 금액 로그 mock 표시 |

이후 다른 섹션 기획을 결과물에 반영할 때는 기존 후보 HTML을 새 최종본으로 안내하지 않고, 이 master 파일을 기준으로 갱신한 뒤 본 통합 로그와 같은 형식으로 반영 내역을 기록합니다.

## 2026-06-17 마무리 반영

| 항목 | 결과 |
| --- | --- |
| master 기준 고정 | `results/html/cargo-order-admin-hifi-master.html`을 현재 통합 HiFi source of truth로 명시 |
| 결과 HTML 안내 | 데이터 있음, 데이터 없음, 부분 데이터 확인 방법을 같은 master 파일 기준으로 정리 |
| 후속 정책 확인 | API, 권한, 정산, 지도 정책을 `sections/reservation-area-tabs/09-planning-closure.md`에 우선순위별로 분리 |
| 후보 파일 처리 | 과거 후보 HTML은 비교와 rollback 참고용으로 유지하고 최종 결과물로 안내하지 않음 |
