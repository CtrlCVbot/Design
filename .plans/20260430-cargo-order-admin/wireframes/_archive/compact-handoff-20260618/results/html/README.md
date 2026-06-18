# HiFi HTML Exports

이 폴더는 화물 오더 접수/수정 화면의 HiFi export 결과물을 보관한다.

## 보관 규칙

| 규칙 | 내용 |
| --- | --- |
| 기존 파일 보존 | 새 export가 생겨도 기존 HTML을 덮어쓰지 않는다. |
| master 파일 관리 | 현재 통합 HiFi 기준은 `cargo-order-admin-hifi-master.html` 하나로 관리한다. 데이터 없음 같은 상태 확인도 같은 파일 안의 신규 접수 흐름으로 확인한다. |
| 기준 파일 안내 | 사용자와 구현자에게 최종 결과물은 master 파일로 안내한다. 후보 HTML은 비교/rollback 참고용으로만 둔다. |
| 후보 파일 병렬 보관 | 새 결과물은 후보 파일로 추가하되, 최종 안내는 master 파일로 모은다. |
| ASCII 후보명 권장 | 새 후보는 `cargo-order-hifi-clean-animation-YYYYMMDD.html` 형식 권장 |
| 검증 전 삭제 금지 | 대용량이어도 비교/판정 전 삭제하지 않는다. |

## Export 목록

| 파일 | 상태 | 역할 | 검증 |
| --- | --- | --- | --- |
| `cargo-order-admin-hifi-master.html` | master-current | 신규 접수 플로우, 보조 정보 탭, 운송 관련 다이얼로그 최근 사용 리스트, 최신 디자인 피드백, 라벨 토글 정리, 배차 담당자 header chip이 함께 반영된 현재 통합 HiFi 기준 파일 | 기본 데이터 있음 상태, `신규(F3)` 초기화 후 보조 정보 빈 상태, 부분 데이터 상태, 주소/운송+품목 최근 사용 다이얼로그 marker, header 배차 담당자 chip 정적 검증 통과 |
| `화물 오더 접수수정 (오프라인).html` | active-reference | 신규 shadcn HiFi 시각 기준 후보 | 조건부 승격, Clean animation 미반영 |
| `cargo-order-hifi-local-motion-20260616.html` | local-candidate | Claude Design 없이 로컬에서 motion layer를 주입한 후보 | 정적/브라우저 검증 통과, `partial-pass` |
| `new-order-registration-flow-hifi-20260617.html` | flow-candidate | master에 반영 완료된 신규 접수 flow 후보 | 섹션 기획 정합성 리뷰 통과, API endpoint 보류 |
| `cargo-order-hifi-reservation-tabs-shadcn-20260616.html` | source-candidate | 보조 정보 탭 데이터 있음 상태 후보 | master에 반영 완료 |
| `cargo-order-hifi-reservation-tabs-empty-shadcn-20260617.html` | state-candidate | 보조 정보 탭 데이터 없음 상태 후보 | master의 신규 접수 초기화 상태에 반영 |
| `cargo-order-hifi-clean-animation-20260616.html` | planned-candidate | Clean animation 반영 후보 export 예정 | 파일 수신 후 검증 |

## Master 상태 확인 경로

| 상태 | 확인 방법 |
| --- | --- |
| 데이터 있음 | `cargo-order-admin-hifi-master.html`을 그대로 열어 확인 |
| 데이터 없음 | 같은 파일에서 `신규(F3)` 클릭 후 확인 |
| 메모만 있음 | `신규(F3)` 후 화주 선택 적용 |
| 지도 있음 | 상차지와 하차지를 모두 적용 |
| 금액 로그 있음 | 정산 정보 또는 금액 입력 적용 |
| 상차/하차 최근 장소 | `주소 검색` 다이얼로그를 열면 기존 검색 결과 영역의 초기 상태로 확인 |
| 주소 검색 결과 전환 | 주소 검색 다이얼로그에서 `조회` 또는 Enter 실행 |
| 운송+품목 최근 조합 | `운송+품목 입력` 다이얼로그에서 최근 조합 후보 확인 |
| 라벨 표시 토글 | header 우측 상태 흐름의 `Aa` icon button 확인 |
| 배차 담당자 | header 상태 chip 옆 `배차 김민지` chip 확인 |

후속 섹션을 반영할 때는 새 후보 HTML을 최종본처럼 안내하지 않고 master에 병합한 뒤, 상위 통합 로그를 갱신한다.

## Local 개선 파일

| 파일 | 역할 |
| --- | --- |
| `hifi-local-motion-layer.html` | 후보 HTML에 주입되는 CSS/JS motion layer |
| `build-local-hifi-candidate.mjs` | 기존 오프라인 HTML을 보존하고 local candidate를 재생성하는 스크립트 |
| `label-toggle-design-options-20260618.html` | 라벨 표시/숨김 토글 배치안 비교 화면. 6번 안이 master에 반영됨 |
| `dispatch-manager-placement-options-20260618.html` | 배차 담당자 배치안 비교 화면. 1번 header chip 안이 master에 반영됨 |

로컬 후보를 다시 만들 때는 아래 명령을 사용한다.

```sh
node .plans/wireframes/cargo-order-admin-20260430/results/html/build-local-hifi-candidate.mjs
```

## 수용 체크리스트

새 export 파일이 들어오면 아래를 확인한다.

| 항목 | 기준 |
| --- | --- |
| 파일 추가 방식 | 기존 HTML을 덮어쓰지 않고 새 파일로 추가 |
| 파일명 | 의도와 날짜를 포함 |
| 정적 분석 | `@keyframes`, `prefers-reduced-motion`, `animationend`, `aria-live` 확인 |
| 화면 판정 | 기존 HiFi와 비교해 `promote`, `partial`, `reject` 중 하나로 기록 |

## 2026-06-16 local candidate 검증

| 항목 | 결과 |
| --- | --- |
| `@keyframes` | 7 |
| `animation:` | 7 |
| `prefers-reduced-motion` | 2 |
| JS `matchMedia` | 1 |
| `animationend` | 2 |
| `aria-live` | 5 |
| `data-b-*` | 8 |

버튼 열기 모션은 Clean 기준처럼 `translateX(var(--hifi-absorb-x))`와 `getBoundingClientRect()` 거리 계산을 사용한다. 클릭 직후 sliding absorb가 끝난 뒤 원래 dialog open `onclick`을 실행한다.

데이터 적용 후 피드백은 흔들림을 제거했다. 기본값은 실제 갱신된 값만 `hifi-motion-field-flash`로 강조하고, 값 컨테이너를 찾지 못할 때만 row 배경 flash를 fallback으로 사용한다. 브라우저 검증에서 운송+품목과 화주 적용 직후 row `transform: none`, row reveal 0, field flash 정상 실행을 확인했다.

`화물맨 연동`은 일반 입력 버튼의 sliding absorb에서 제외했다. 대신 버튼에서 화물맨 상태 badge로 이동하는 `hifi-motion-handoff-dot`과 source/target pulse를 적용하고, `YES` 후 상태 chip만 field flash되도록 했다. 브라우저 검증에서 클릭 직후 dot 1개, absorb 0, handoff 후 확인창 open, `YES` 후 row `transform: none`을 확인했다.
