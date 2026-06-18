# Master Integration Plan

## 목적

이 문서는 `transport-dialog-recent-lists-hifi-20260617.html`에서 확정한 다이얼로그 정책을 `results/html/cargo-order-admin-hifi-master.html`에 반영할 때의 범위와 순서를 정의합니다.

이 문서는 처음에는 실행 계획으로 작성되었고, 2026-06-17에 같은 기준으로 `master.html` static prototype 반영까지 완료했습니다. 현재는 반영 범위, 실행 결과, 제외 항목을 함께 확인하는 기준 문서입니다.

## 반영 결론

| 항목 | 결정 |
| --- | --- |
| 반영 시점 | 2026-06-17 master static prototype 반영 완료 |
| 반영 형태 | static HiFi prototype 반영 완료 |
| 실제 데이터 연동 | 제외, 후속 API/DB 설계에서 처리 |
| 기존 flow 보호 | `openAddrSearch()`, `renderAddrPreview()`, `openCargoInput()`, `applyAddr()`, `applyCargo()`의 확정 책임 유지 |
| 신규 접수 wizard | 왼쪽 프로세스 패널 정책은 변경하지 않음 |

## 실행 결과

| 항목 | 결과 |
| --- | --- |
| 주소 최근 리스트 | `openAddrSearch(side)`에 `ADDR_RECENTS` 기반 초기 결과 표시와 `조회`/Enter 검색 전환 반영 |
| 운송+품목 최근 조합 | `openCargoInput()`에 `CARGO_RECENTS` 기반 후보 리스트와 입력폼 채우기 반영 |
| 확정 책임 | `applyAddr()`, `applyCargo()` 버튼 확정 흐름 유지 |
| 제외 유지 | 실제 API/DB, 최근 기록 저장 로직, 화주별/사용자별 scope 결정은 후속 |
| 정적 검증 | template JSON parse와 inline script 문법 검사 통과 |

## 대상 파일과 함수

| 파일 | 반영 지점 | 역할 |
| --- | --- | --- |
| `results/html/cargo-order-admin-hifi-master.html` | `openAddrSearch(side)` | 상차지/하차지 주소 검색 다이얼로그 구성 |
| `results/html/cargo-order-admin-hifi-master.html` | `renderAddrPreview(a)` | 주소 선택 후 `선택 미리보기` 렌더링 |
| `results/html/cargo-order-admin-hifi-master.html` | `openCargoInput()` | `운송+품목 입력` 다이얼로그 구성 |
| `results/html/cargo-order-admin-hifi-master.html` | `applyAddr()` | 주소 확정 반영 |
| `results/html/cargo-order-admin-hifi-master.html` | `applyCargo()` | 운송+품목 확정 반영 |

## 상하차지 다이얼로그 반영 범위

| 구분 | 반영 내용 |
| --- | --- |
| 초기 표시 | 다이얼로그가 열리면 기존 검색 결과 리스트 영역에 최근 장소 row를 표시 |
| 검색 실행 | `조회` 클릭 또는 Enter 입력 후 같은 영역을 기존 검색 결과 리스트로 전환 |
| 레이아웃 | 기존 주소 검색 다이얼로그의 검색 영역, 결과 리스트, 우측 `선택 미리보기` 구조 유지 |
| 최근 row 선택 | 기존 `pickRow()`와 `renderAddrPreview()` 흐름을 사용해 미리보기만 갱신 |
| 확정 | `상차지 적용` 또는 `하차지 적용` 버튼 클릭 전까지 `운송 구간` row에 반영하지 않음 |
| empty | 최근 장소가 없으면 같은 결과 리스트 영역에 `최근 사용 장소가 없습니다.` 표시 |
| error | 최근 조회 실패는 검색 결과 흐름을 차단하지 않음 |

### 주소 최근 row 표시 정보

| 정보 | 노출 여부 | 메모 |
| --- | --- | --- |
| 출처 | 표시 | `최근 사용`, `화주 등록`, `Kakao` 수준 |
| 장소명 | 표시 | 선택 판단에 필요 |
| 주소 | 표시 | 기존 검색 결과 row의 핵심 값 |
| 상세주소 | 미리보기 중심 | row에서는 과밀하면 생략 가능 |
| 담당자 | 제한 표시 | 필요 시 미리보기에서만 표시 |
| 연락처 | row에서는 숨김 | 개인정보 과노출 방지 |

## 운송+품목 다이얼로그 반영 범위

| 구분 | 반영 내용 |
| --- | --- |
| 초기 표시 | `운송+품목 입력` 다이얼로그 안에 최근 조합 리스트를 보조 후보로 표시 |
| 최근 기준 | `톤수 + 차종 + 대수 + 실중량 + 품목` 조합 단위 |
| 최근 row 선택 | `ci-ton`, `ci-type`, `ci-count`, `ci-weight`, `ci-item` 입력폼 값을 채움 |
| 확정 | `운송+품목 적용` 클릭 전까지 `화물 정보` row에 반영하지 않음 |
| 선택 요약 | 별도 `선택 요약` 패널은 만들지 않음 |
| empty | 최근 조합이 없으면 `최근 사용 조합이 없습니다.` 표시, 입력폼은 계속 사용 가능 |
| error | 최근 조회 실패는 직접 입력과 `운송+품목 적용`을 차단하지 않음 |

## 제외 범위

| 제외 항목 | 이유 |
| --- | --- |
| 실제 최근 사용 API/DB 연동 | 현재 산출물은 HiFi prototype 범위 |
| 최근 사용 저장 로직 | 적용 성공 후 기록할지, 최종 등록 API 성공 후 기록할지 정책 결정 필요 |
| 화주별/사용자별 scope 확정 | 데이터 소유권과 권한 정책 확인 필요 |
| 톤수/차종/품목 개별 추천 | MVP는 조합 단위 최근 사용 |
| 검색 알고리즘 개선 | 최근 리스트는 기존 검색 결과 흐름의 초기 상태일 뿐 대체 기능이 아님 |
| 신규 접수 wizard 좌측 패널 개편 | 기존 wizard 정책 보호 |

## 구현 순서

| 순서 | 작업 | 완료 조건 |
| --- | --- | --- |
| 1 | `master.html` 백업 또는 변경 전 기준 확인 | 기존 파일 크기/수정 시각 기록 |
| 2 | 주소 최근 sample data와 render helper 추가 | 상차/하차 최근 row를 기존 결과 리스트 영역에 렌더링 |
| 3 | 주소 검색 전환 이벤트 연결 | `조회`/Enter 후 기존 검색 결과 리스트로 전환 |
| 4 | 주소 empty/error 상태 추가 | 최근 실패가 검색 흐름을 막지 않음 |
| 5 | 운송+품목 최근 sample data와 render helper 추가 | 최근 row 클릭 시 입력폼만 갱신 |
| 6 | 운송+품목 empty/error 상태 추가 | 직접 입력과 적용 버튼 유지 |
| 7 | 회귀 확인 | 기존 `적용` 버튼, wizard 상태, 일반 수정 다이얼로그 동작 확인 |

## 검증 기준

| 검증 | 기준 |
| --- | --- |
| 주소 초기 상태 | 주소 검색 다이얼로그 open 시 최근 row가 검색 결과 영역에 표시 |
| 주소 검색 전환 | `조회` 또는 Enter 후 같은 영역이 기존 검색 결과로 전환 |
| 주소 확정 책임 | 최근 row 클릭만으로 `운송 구간` row가 바뀌지 않음 |
| 주소 적용 | `상차지 적용`/`하차지 적용` 후 기존 `applyAddr()` 결과가 유지 |
| 운송+품목 최근 선택 | 최근 조합 클릭 후 입력폼 값만 변경 |
| 운송+품목 확정 책임 | `운송+품목 적용` 전까지 `화물 정보` row가 바뀌지 않음 |
| 요약 중복 제거 | 운송+품목 다이얼로그에 별도 `선택 요약` 패널이 없음 |
| wizard 보호 | 신규 접수 wizard 왼쪽 프로세스 패널이 변경되지 않음 |
| 독립 수정 보호 | 신규 접수 완료 후 개별 수정 다이얼로그 방식이 유지 |

## 실행 완료 프롬프트 기록

아래 프롬프트는 2026-06-17에 실행 완료된 master static prototype 반영 요청입니다. 같은 작업을 반복하기보다, 이후에는 API/DB 정책 확정 또는 시각 QA 작업으로 이어갑니다.

```text
C:\Work\Dev\Design\.plans\wireframes\cargo-order-admin-20260430 프로젝트에서
sections/transport-dialog-recent-lists/06-master-integration-plan.md 기준으로
results/html/cargo-order-admin-hifi-master.html에 최근 사용 리스트를 static HiFi prototype 범위로 반영해주세요.

반영 원칙:
- 상하차지 최근 리스트는 기존 주소 검색 결과 리스트 영역의 초기 상태로 표시
- 조회/Enter 검색 실행 후 같은 영역을 기존 검색 결과 리스트로 전환
- 주소 선택 미리보기 위치와 전체 레이아웃은 기존 master 주소 검색 다이얼로그 구조 유지
- 운송+품목 최근 조합은 입력폼 값만 채우고 별도 선택 요약 패널은 만들지 않음
- 최근 row 클릭만으로 저장하거나 row에 확정 반영하지 않음
- 기존 applyAddr(), applyCargo() 확정 책임 유지
- 신규 접수 wizard 왼쪽 프로세스 패널 정책 유지

검증:
- openAddrSearch('load') / openAddrSearch('unload') 양쪽 확인
- 조회 버튼과 Enter 전환 확인
- 최근 있음/없음 상태 확인
- openCargoInput()에서 최근 있음/없음과 최근 선택 후 입력폼 반영 확인
- 운송+품목 적용 전후 row 반영 차이 확인
- master.html 외 파일 변경이 필요한 경우 먼저 이유를 문서화
```
