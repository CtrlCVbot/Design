# 09. 운송 관련 다이얼로그 최근 사용 리스트 최종 반영 로그

## 목적

이 문서는 `sections/transport-dialog-recent-lists`에서 확정한 `운송 관련 다이얼로그 최근 사용 리스트` 기획을 메인 기획 문서와 최종 HiFi master에 반영한 내역을 기록합니다.

최근 사용 리스트는 새 화면 섹션이 아니라 기존 `운송 구간`과 `화물 정보` 다이얼로그의 보조 상태입니다. 따라서 상세 정책은 섹션 문서를 source of truth로 유지하고, 메인 기획에는 최신 기준과 링크만 연결합니다.

## 반영 기준

| 항목 | 위치 | 상태 |
| --- | --- | --- |
| 상세 기획 패키지 | `sections/transport-dialog-recent-lists/` | 완료 |
| master 반영 계획/결과 | `sections/transport-dialog-recent-lists/06-master-integration-plan.md` | 완료 |
| standalone HTML | `sections/transport-dialog-recent-lists/transport-dialog-recent-lists-hifi-20260617.html` | 완료 |
| 최종 통합 master HTML | `results/html/cargo-order-admin-hifi-master.html` | static prototype 반영 완료 |
| 메인 기획 반영 계획 | `09-transport-dialog-recent-lists-main-integration-plan.md` | 완료 |

## 반영 결과 요약

| 영역 | 반영 내용 |
| --- | --- |
| 상하차지 주소 검색 | `openAddrSearch(side)`에서 기존 검색 결과 영역의 초기 상태로 `상차 최근`/`하차 최근` 표시 |
| 주소 검색 전환 | `조회` 버튼 또는 Enter 실행 후 같은 영역을 기존 주소 검색 결과로 전환 |
| 주소 확정 책임 | 최근 row 클릭은 `선택 미리보기`만 갱신하고 `상차지 적용`/`하차지 적용` 버튼이 실제 반영을 담당 |
| 운송+품목 입력 | `openCargoInput()`에서 최근 조합 후보를 표시하고 클릭 시 입력폼만 채움 |
| 운송+품목 확정 책임 | `운송+품목 적용` 전까지 `화물 정보` row에 반영하지 않음 |
| 결과물 관리 | 새 최종 후보 HTML을 만들지 않고 기존 `cargo-order-admin-hifi-master.html`에 병합 |

## 반영 파일 상세

| 파일 | 반영 내용 | 상태 |
| --- | --- | --- |
| `results/html/cargo-order-admin-hifi-master.html` | `ADDR_RECENTS`, `CARGO_RECENTS`, `renderAddrResults()`, `pickCargoRecent()` 기반 static prototype 반영 | 완료 |
| `README.md` | 문서 구성, 최신 HiFi 기준, 사용 방법에 최근 사용 리스트 기준 추가 | 완료 |
| `results/html/README.md` | master-current 설명과 상태 확인 경로에 최근 사용 다이얼로그 확인 추가 | 완료 |
| `01-screen-map.md` | `운송 구간`, `화물 정보` 다이얼로그 보조 상태 기준 추가 | 완료 |
| `02-field-inventory.md` | 최근 장소/최근 운송+품목 조합 후보 데이터 표시 범위 추가 | 완료 |
| `03-wireframe.md` | 운송 구간/화물 정보 와이어프레임 원칙에 최근 리스트 보조 동작 추가 | 완료 |
| `04-modernization-brief.md` | 반복 입력 비용 감소와 기존 적용 책임 유지 원칙 추가 | 완료 |
| `05-self-review.md` | 최근 사용 리스트 반영 결과와 남은 정책 리스크 추가 | 완료 |
| `09-transport-dialog-recent-lists-main-integration-plan.md` | 메인 반영 계획과 실행 프롬프트 기록 | 완료 |

## 루트 handoff 정리

| 항목 | 결정 |
| --- | --- |
| `06-claude-design-handoff.md` | 루트에서는 제거 |
| 기록 보존 | `_archive/legacy-prompts/claude-design-v1/06-claude-design-handoff.md`로 이동 |
| 최신 디자인 기준 | `claude-design-v2/README.md`, `claude-design-v2/PROMPT-LOG.md`, `results/html/cargo-order-admin-hifi-master.html` |
| 삭제 이유 | 1차 Claude Design 실행 기록 성격이 강하고, 현재 메인 기획 기준 문서로는 중복/노후화됨 |

## 확정된 의사결정

| 정책 | 최종 기준 |
| --- | --- |
| 상세 기획 source of truth | `sections/transport-dialog-recent-lists/` |
| 최종 HiFi 관리 파일 | `results/html/cargo-order-admin-hifi-master.html` |
| 주소 최근 표시 위치 | 기존 주소 검색 결과 영역의 초기 상태 |
| 주소 검색 결과 우선순위 | 검색 실행 후 같은 영역이 기존 검색 결과로 전환 |
| 운송+품목 최근 기준 | `톤수 + 차종 + 대수 + 실중량 + 품목` 조합 단위 |
| 확정 책임 | 기존 `상차지 적용`, `하차지 적용`, `운송+품목 적용` 버튼 유지 |
| 신규 접수 wizard | 왼쪽 프로세스 패널 정책 유지 |
| 일반 수정 다이얼로그 | 기존 독립 다이얼로그 방식 유지 |

## 보류 정책

| 항목 | 상태 | 이유 |
| --- | --- | --- |
| 실제 최근 사용 API/DB | 보류 | static prototype 범위를 벗어남 |
| 화주별/사용자별 최근 scope | 보류 | 데이터 소유권, 권한, 운영자 계정 정책 확인 필요 |
| 최근 기록 저장 시점 | 보류 | `적용` 직후 기록할지, 최종 저장 API 성공 후 기록할지 결정 필요 |
| 개인정보 표시 범위 | 보류 | 연락처/담당자명 row 노출과 미리보기 마스킹 기준 확정 필요 |
| 톤수/차종/품목 개별 추천 | 보류 | MVP는 조합 단위 최근 사용 |

## 검증 로그

| 검증 | 결과 | 메모 |
| --- | --- | --- |
| master marker | 통과 | `ADDR_RECENTS`, `CARGO_RECENTS`, `renderAddrResults()`, `pickCargoRecent()` 확인 |
| master 중복 함수 | 통과 | `openAddrSearch(side)` 1개, `ADDR_RECENTS` 1개, `CARGO_RECENTS` 1개 확인 |
| template parse | 통과 | `__bundler/template` JSON parse와 inline script 문법 검사 통과 |
| 기존 확정 책임 | 통과 | `applyAddr()`, `applyCargo()` 유지 |
| 문서 링크 | 통과 | 루트 README와 results README에서 섹션 기획 위치 연결 |
| handoff 정리 | 통과 | 루트 `06-claude-design-handoff.md`를 archive로 이동하고 현재 기준 문서에서 제거 |

## 다음 단계

실제 개발 착수 전에는 아래 정책을 먼저 확정합니다.

| 우선순위 | 항목 |
| --- | --- |
| P0 | 화주별/사용자별 최근 scope |
| P0 | 최근 기록 저장 시점 |
| P0 | 개인정보 표시와 마스킹 기준 |
| P1 | 최근 사용 API 응답 구조와 중복 제거 key |
| P2 | 톤수/차종/품목 개별 추천 확장 여부 |
