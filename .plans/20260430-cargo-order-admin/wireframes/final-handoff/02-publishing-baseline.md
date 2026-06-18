# Publishing 기준본: 통합 HiFi Master

## 기준 파일

| 항목 | 값 |
| --- | --- |
| 파일 | `baseline/html/cargo-order-admin-hifi-master.html` |
| 상태 | `master-current` |
| 역할 | 현재 통합 HiFi 기준 파일 |
| 성격 | static prototype, 구현 코드 직접 복사 대상 아님 |
| 기준 날짜 | 2026-06-18 기준 최신 통합 로그 반영 |

## 포함된 최신 반영사항

| 반영사항 | 확인 기준 |
| --- | --- |
| 신규 접수 flow | `신규(F3)`, `new-reset`, `new-submitted`, 메인 `화물 등록` |
| 보조 정보 탭 | `메모`, `금액 로그`, `운송 구간 지도` |
| 보조 정보 상태 전환 | 기본 데이터 있음, 신규 후 empty, 부분 데이터 |
| 주소 최근 사용 | `ADDR_RECENTS`, `renderAddrResults()` |
| 운송+품목 최근 사용 | `CARGO_RECENTS`, `pickCargoRecent()` |
| 디자인 polish | shadow, button hierarchy, focus ring, dialog title |
| 라벨 토글 | header 흐름 안의 `Aa` icon button |
| 배차 담당자 | header 상태 chip 옆 `배차 김민지` chip |

## 상태별 확인 방법

| 상태 | 확인 방법 | 구현자가 봐야 할 것 |
| --- | --- | --- |
| 데이터 있음 | master HTML을 그대로 열기 | 기존 오더 조회/수정 상태의 기본 밀도 |
| 신규 접수 초기화 | `신규(F3)` 클릭 | `new-reset`, 보조 정보 empty, 화주 focus |
| 화주 적용 | 신규 후 화주 정보 적용 | 메모 mock 표시 |
| 상차/하차 적용 | 신규 후 상차지와 하차지 적용 | 지도 mock 표시 |
| 정산 정보 적용 | 신규 후 금액/정산 적용 | 금액 로그 mock 표시 |
| 금액 완료 | 금액 단계 완료 | `화물 등록 완료`/`차주 정보로 이동` 분기 |
| 메인 적용 | `화물 등록 완료` 선택 | `new-submitted`, 메인 `화물 등록` 표시 |
| 주소 최근 | 주소 검색 다이얼로그 열기 | 최근 리스트가 검색 결과 영역 초기 상태로 표시 |
| 운송+품목 최근 | 운송+품목 입력 다이얼로그 열기 | 최근 조합 클릭 시 입력폼만 채움 |
| header | 상단 상태 영역 확인 | 거리/기준금액, 배차 담당자, 라벨 토글 |

## Prototype과 Production의 차이

| 구분 | Prototype 기준 | Production 구현 시 주의 |
| --- | --- | --- |
| 데이터 | mock data와 static state | 실제 API/DB/schema 연결 필요 |
| API | 실제 endpoint 없음 | 메인 `화물 등록`만 저장 trigger |
| validation | 화면/문서 기준 | 기존 서버 validation과 매핑 필요 |
| 최근 사용 | static 배열 | scope, 저장 시점, 마스킹 결정 필요 |
| 지도 | mock route | provider, 비용, fallback 결정 필요 |
| 배차 담당자 | `김민지` 고정 예시 | 담당자 모델/권한/이력 결정 필요 |

## 후보 HTML 처리 기준

| 파일 종류 | 처리 |
| --- | --- |
| `cargo-order-admin-hifi-master.html` | 최종 안내 기준 |
| `new-order-registration-flow-hifi-20260617.html` | flow 후보, master 반영 완료 |
| `cargo-order-hifi-reservation-tabs-*.html` | 보조 정보 후보, master 반영 완료 |
| `화물 오더 접수수정 (오프라인).html` | 초기 HiFi reference |
| `dispatch-manager-placement-options-20260618.html` | 배차 담당자 비교안, 1번 안 반영 완료 |
| `label-toggle-design-options-20260618.html` | 라벨 토글 비교안, 6번 안 반영 완료 |

후보 HTML은 비교와 rollback 용도입니다. 구현자에게 최종 화면 기준으로 안내할 때는 master 파일만 우선합니다.

## 정적 검증 기준

| Marker | 의미 |
| --- | --- |
| `new-reset` | 신규 접수 초기화 상태 |
| `new-wizard-active` | wizard 진행 상태 |
| `new-submitted` | 메인 화면 적용 완료/pre-API 상태 |
| `submit-validating` | 최종 validation 상태 |
| `data-reserve-tabs` | 보조 정보 탭 root |
| `ADDR_RECENTS` | 주소 최근 사용 static prototype |
| `CARGO_RECENTS` | 운송+품목 최근 사용 static prototype |
| `dispatch-manager-chip` | 배차 담당자 chip |
| `label-toggle-wrap` | 라벨 토글 wrapper |

## Publishing 수용 기준

| 항목 | 통과 기준 |
| --- | --- |
| master 기준 | 최종 안내가 master 파일 하나로 모인다 |
| 신규 접수 | `신규(F3)` 이후 상태 흐름이 문서 기준과 일치한다 |
| 보조 정보 | 데이터 있음/없음/부분 데이터 상태가 확인된다 |
| 최근 사용 | 최근 row 클릭과 적용 버튼 책임이 분리된다 |
| header | 배차 담당자와 라벨 토글이 본문을 밀지 않는다 |
| 접근성 | tablist, dialog, focus, reduced motion 정책을 구현 시 유지한다 |
| 회귀 방지 | 후보 HTML을 최종본으로 다시 안내하지 않는다 |

## 기존 프로젝트 적용 시 주의

1. Prototype DOM 구조를 그대로 복사하기보다 기존 component 구조에 맞게 분해합니다.
2. `new-submitted` 이후 메인 `화물 등록` 버튼이 실제 저장 책임을 갖도록 state machine을 분리합니다.
3. 최근 사용 리스트는 검색/입력 flow를 대체하지 않고, 초기 후보 또는 입력 보조 상태로만 구현합니다.
4. 보조 정보 탭은 입력 폼을 반복하지 않고, 선택 오더의 후속 판단 정보만 보여줍니다.
5. header chip은 상세 변경 UX가 미정이므로 우선 표시 전용으로 구현하고, 변경/이력은 후속 결정으로 둡니다.
