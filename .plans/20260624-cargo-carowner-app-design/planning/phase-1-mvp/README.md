# Phase 1 MVP 기획 패키지

이 폴더는 차주용 배차/운행/정산 조회 앱의 Phase 1 MVP 기획 패키지다. `../05-epic-phase-roadmap.md`를 SSOT(Single Source of Truth, 단일 기준 문서)로 삼는다.

## 문서 구성

| 순서 | 문서 | 역할 |
| --- | --- | --- |
| 1 | `01-mvp-prd.md` | PRD 10개 섹션, 요구사항, 권한/정산 노출 기준 |
| 2 | `02-mvp-user-flows.md` | 앱 진입, 상태 변경, 운행/정산 조회, 특이사항 보고 flow |
| 3 | `03-wireframes-dispatch-execution.md` | 내 배차 목록, 배차 상세, 상차완료/하차완료 modal |
| 4 | `04-wireframes-history-settlement-issue.md` | 운행 내역, 정산 홈, 정산/송금 상세, 특이사항 보고 |
| 5 | `05-screen-map.md` | 화면 목록, 탭 구조, 진입점, 이동 관계, 상태 책임 |
| 6 | `06-traceability-and-review.md` | 기존 REQ와 MVP REQ 매핑, REQ/Flow/Screen 추적, self-review |
| 7 | `07-publishing-3rd-functional-review.md` | 3차 퍼블리싱 기능/IA 리뷰, 정산 탭 재정의 결과, 추가/제외 아이디어 |

## 퍼블리싱 반영 상태

| 항목 | 결과 |
| --- | --- |
| 최종 HTML | `../../publishing/phase-1-mvp/phase-1-mvp-standalone.html` |
| 디자인 기준 | `../../publishing/화물 배차 앱 3차 (standalone).html` 원본 디자인 유지 |
| 하단 `정산` 탭 | `SCR-008 정산 홈`으로 진입 |
| 건별 `정산/송금 상세` | `운행 내역` 카드 또는 `정산 홈`의 정산 묶음에서 진입 |
| Visual QA | 공통 화면 픽셀 차이 `0%` 확인, QA 이미지는 커밋 제외 |

## Phase 1 범위

| 구분 | 포함 |
| --- | --- |
| Phase 1A 운행 수행 | 내 배차 목록, 배차 상세, 상차완료, 하차완료, 상태 타임라인 |
| Phase 1B 운행/정산 조회 | 운행 내역, 기간/월별 조회, 정산 홈, 정산/송금 상태, 송금일, 송금금액 |
| Phase 1C 예외 처리 | 특이사항 보고, 사진/메모 optional, 보류 상태 표시, 담당자 문의 |

## 제외 범위

하차 담당자 확인 링크, 모바일 서명, `하차담당자 인증 미확보` badge, 화주 확인 보강 flow, 배차 검색/신규 오더 수락, API/DB/백엔드 상세 계약은 Phase 1 MVP에서 제외한다.
