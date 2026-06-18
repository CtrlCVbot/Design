# 09. 운송 관련 다이얼로그 최근 사용 리스트 메인 기획 반영 계획

## 목적

`sections/transport-dialog-recent-lists/`에서 완료한 `운송 관련 다이얼로그 최근 사용 리스트` 기획과 `master.html` static prototype 반영 내용을 메인 기획 문서에 어떻게 연결할지 정리합니다.

이번 계획의 핵심은 상세 기획을 루트 문서에 중복 작성하지 않고, 메인 기획에서는 `현재 통합 HiFi 기준에 포함된 기능`, `상세 기획 위치`, `후속 정책 보류 항목`만 명확히 연결하는 것입니다.

## 현재 상태

| 항목 | 상태 | 근거 |
| --- | --- | --- |
| 섹션 기획 패키지 | 완료 | `sections/transport-dialog-recent-lists/README.md` |
| standalone HTML | 완료 | `sections/transport-dialog-recent-lists/transport-dialog-recent-lists-hifi-20260617.html` |
| master static prototype | 완료 | `results/html/cargo-order-admin-hifi-master.html` |
| 상세 반영 기록 | 완료 | `sections/transport-dialog-recent-lists/06-master-integration-plan.md` |
| 메인 기획 반영 | 완료 | `09-transport-dialog-recent-lists-integration-log.md` |
| 루트 handoff 정리 | 완료 | `_archive/legacy-prompts/claude-design-v1/06-claude-design-handoff.md` |
| 실제 API/DB 정책 | 보류 | 화주별/사용자별 scope, 저장 시점, 개인정보 노출 기준 추가 확정 필요 |

## 실행 결과

| 항목 | 결과 |
| --- | --- |
| P0 반영 | `README.md`, `results/html/README.md`, `05-self-review.md`, `09-transport-dialog-recent-lists-integration-log.md` 반영 |
| P1 반영 | `01-screen-map.md`, `03-wireframe.md`, `04-modernization-brief.md`, `claude-design-v2/00-overview.md` 반영 |
| P2 반영 | `02-field-inventory.md`에 `RecentLocation`, `RecentCargoCombo` 후보 모델 추가 |
| handoff 정리 | 루트 `06-claude-design-handoff.md`를 archive로 이동하고 현재 기준 문서에서 제거 |

## 메인 기획 반영 필요 여부

| 판단 | 결론 |
| --- | --- |
| 반영 필요 여부 | 필요 |
| 이유 | `master.html`의 현재 기준 기능이 바뀌었고, `운송 구간`/`화물 정보`의 다이얼로그 동작이 반복 입력 보조 흐름을 포함하게 되었기 때문 |
| 반영 방식 | 루트 문서에는 요약과 링크만 추가하고, 상세 정책은 `sections/transport-dialog-recent-lists/`를 source of truth로 둠 |
| 새 메인 섹션 여부 | 불필요. 최근 리스트는 새 화면 섹션이 아니라 기존 다이얼로그의 보조 상태 |

## 반영 대상 문서

| 우선순위 | 파일 | 반영할 내용 | 이유 |
| --- | --- | --- | --- |
| P0 | `README.md` | 문서 구성에 `sections/transport-dialog-recent-lists/` 추가, 최신 HiFi 기준 설명에 최근 리스트 포함, 사용 방법에 다이얼로그 확인 경로 추가 | 프로젝트 진입점이므로 최신 기준 안내 필요 |
| P0 | `results/html/README.md` | `cargo-order-admin-hifi-master.html` 역할/검증에 운송 관련 다이얼로그 최근 리스트 반영 내용 추가 | 최종 HTML 기준 파일의 상태 설명 보정 |
| P0 | `05-self-review.md` | `운송 관련 다이얼로그 최근 사용 리스트` 반영 완료, 남은 정책 리스크 추가 | 전체 기획 완료 상태와 보류 정책 추적 |
| P0 | 신규 루트 통합 로그 | `09-transport-dialog-recent-lists-integration-log.md` 생성 | `07`, `08`과 같은 형식으로 master 반영 내역 기록 |
| P1 | `01-screen-map.md` | `운송 구간`, `화물 정보` 설명에 최근 사용 보조 다이얼로그가 포함됨을 한 줄 추가 | 화면 맵에서 다이얼로그 behavior 누락 방지 |
| P1 | `03-wireframe.md` | 운송 구간/화물 정보 와이어프레임 원칙에 최근 리스트는 기존 다이얼로그 보조 상태라고 명시 | 화면 구조 변경이 아니라 다이얼로그 상태 추가임을 명확화 |
| P1 | `04-modernization-brief.md` | 반복 입력 비용 감소 원칙과 최근 리스트의 비확정 보조 동작 추가 | 현대화 방향의 사용자 가치 반영 |
| P1 | `claude-design-v2/00-overview.md` | 최신 디자인 기준에서 루트 `06` handoff 제거와 archive 위치 안내 | 다음 디자인 세션의 누락 방지 |
| P2 | `02-field-inventory.md` | `RecentLocation`, `RecentCargoCombo` 성격의 후보 데이터 표시 범위와 개인정보 제한 메모 추가 | 실제 데이터 모델 전환 전 참고용 |

## 반영하지 않을 항목

| 항목 | 이유 |
| --- | --- |
| 루트 문서에 최근 리스트 상세 정책 전체 복제 | 상세 정책은 섹션 문서가 source of truth이므로 중복 관리 위험이 큼 |
| 신규 화면 섹션 추가 | 최근 리스트는 화면 섹션이 아니라 기존 주소/운송+품목 다이얼로그의 초기/보조 상태 |
| 실제 API endpoint, DB schema 확정 | 현재 범위는 static HiFi prototype이며 제품/개발 정책 결정이 필요 |
| 화주별/사용자별 최근 scope 확정 | 권한, 데이터 소유권, 운영자 계정 정책 확인 필요 |
| 연락처 전체 노출 정책 확정 | 개인정보 마스킹 기준은 후속 정책으로 분리 |

## 메인 문서별 반영 문구 초안

| 파일 | 반영 문구 방향 |
| --- | --- |
| `README.md` | `sections/transport-dialog-recent-lists/`는 상하차지 주소 검색과 운송+품목 입력 다이얼로그에 최근 사용 후보를 추가한 완료본으로 안내 |
| `results/html/README.md` | master 검증 항목에 `주소 최근 리스트 초기 표시`, `조회 후 검색 결과 전환`, `운송+품목 최근 조합 입력폼 반영` 추가 |
| `01-screen-map.md` | `운송 구간`은 상차/하차 주소 검색 다이얼로그에서 최근 장소를 초기 후보로 보여준다고 보강 |
| `03-wireframe.md` | `화물 정보`의 `운송+품목 입력`은 최근 조합으로 입력폼을 채울 수 있지만 적용 전 row 반영은 없다고 보강 |
| `04-modernization-brief.md` | 반복 입력 비용을 줄이는 보조 후보 원칙을 추가하되, 검색/입력/적용 책임은 기존 흐름 유지 |
| `05-self-review.md` | high 리스크로 `화주별/사용자별 최근 scope`, `최근 기록 저장 시점`, `개인정보 표시 범위`를 추적 |
| `claude-design-v2/00-overview.md` | 다음 작업자는 최신 master에 최근 리스트가 반영되어 있으며 1차 handoff 기록은 archive에서 확인하도록 안내 |

## 권장 실행 순서

| 순서 | 작업 | 산출물 |
| --- | --- | --- |
| 1 | 루트 통합 로그 생성 | `09-transport-dialog-recent-lists-integration-log.md` |
| 2 | 진입점 문서 갱신 | `README.md`, `results/html/README.md` |
| 3 | 기획 본문 최소 보강 | `01-screen-map.md`, `03-wireframe.md`, `04-modernization-brief.md` |
| 4 | 검토/인계 문서 보강 | `05-self-review.md`, `claude-design-v2/00-overview.md` |
| 5 | 선택적 필드 인벤토리 보강 | `02-field-inventory.md` |
| 6 | 용어/링크 검증 | `운송 구간`, `화물 정보`, `운송+품목`, `최근 사용` 검색 검증 |

## 검증 계획

| 검증 | 기준 |
| --- | --- |
| 링크 검증 | 루트 문서에서 `sections/transport-dialog-recent-lists/`와 master HTML 경로가 정확함 |
| 용어 검증 | `운송 구간`, `화물 정보`, `운송+품목`, `최근 사용` 용어가 섹션 문서와 충돌하지 않음 |
| master 기준 검증 | `results/html/cargo-order-admin-hifi-master.html`에 `ADDR_RECENTS`, `CARGO_RECENTS`, `renderAddrResults()`, `pickCargoRecent()`가 남아 있음 |
| 회귀 방지 | 최근 리스트가 기존 검색/입력/적용 흐름을 대체하지 않는다고 메인 문서에 명시 |
| 보류 정책 검증 | API/DB, scope, 개인정보, 저장 시점은 확정이 아니라 후속 항목으로 남김 |

## 실행 완료 프롬프트 기록

아래 프롬프트는 2026-06-17에 실행 완료된 메인 기획 반영 요청입니다. 이후에는 실제 API/DB 정책 확정 또는 실화면 QA로 이어갑니다.

```text
C:\Work\Dev\Design\.plans\wireframes\cargo-order-admin-20260430 프로젝트에서
09-transport-dialog-recent-lists-main-integration-plan.md 기준으로
운송 관련 다이얼로그 최근 사용 리스트를 메인 기획 문서에 반영해주세요.

반영 원칙:
- 상세 정책은 sections/transport-dialog-recent-lists/를 source of truth로 유지
- 루트 문서는 요약, 링크, master 반영 상태, 보류 정책만 반영
- 새 화면 섹션을 만들지 말고 기존 운송 구간/화물 정보 다이얼로그 보조 상태로 설명
- 실제 API/DB, 최근 기록 저장 시점, 화주별/사용자별 scope, 개인정보 표시 정책은 후속 보류로 남김
- 07/08 통합 로그와 같은 형식으로 09 통합 로그를 작성

우선 반영 대상:
1. README.md
2. results/html/README.md
3. 05-self-review.md
4. 09-transport-dialog-recent-lists-integration-log.md 신규 생성
5. 01-screen-map.md
6. 03-wireframe.md
7. 04-modernization-brief.md
8. claude-design-v2/00-overview.md
9. 필요 시 02-field-inventory.md

검증:
- master HTML marker: ADDR_RECENTS, CARGO_RECENTS, renderAddrResults(), pickCargoRecent()
- 문서 링크와 용어 일관성 확인
- 최근 리스트가 기존 검색 결과 선택 흐름과 적용 버튼 책임을 대체하지 않는지 확인
```
