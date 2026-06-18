# 화물 오더 접수/수정 최종 구현 인계 패키지

## 목적

이 폴더는 `화물관리 > 오더 접수/수정` UI/UX를 현재 기획 결과물 기준으로 다른 PC의 기존 프로젝트에 구현하기 전에, 구현자가 반드시 확인해야 할 최종 기준을 모아둔 인계 패키지입니다.

이 패키지는 기존 `.md` 원문을 대체하지 않습니다. 기존 원문은 `source-snapshot/`에 복사되어 있으며, active 루트의 원본 작업 산출물은 `_archive/compact-handoff-20260618/`에 보존되어 있습니다.

`final-handoff/`는 화면, 흐름, 섹션, 컴포넌트, 정책, QA를 빠르게 연결하는 최종 전달 패키지입니다.

## 정리 실행 기준

| 항목 | 기준 |
| --- | --- |
| 최종 폴더 | 이 폴더, 즉 `final-handoff/`를 최종 구현 인계 패키지로 사용 |
| 완료 작업 | `final-handoff` 내부 기준 문서, data map, baseline/source/reference 복사본 구성 |
| 삭제 여부 | 삭제 없음. 비최종 active 산출물은 `_archive/compact-handoff-20260618/`로 이동 |
| Archive 처리 | 완료. 이동 대상과 복구 기준은 `archive-manifest-2026-06-18.md`에 기록 |
| Source 원칙 | 최종 판단은 `final-handoff`에서 확인하고, 상세 원문은 `source-snapshot/` 또는 archive에서 추적 |

## 현재 최종 기준

| 기준 | 파일 | 판단 |
| --- | --- | --- |
| 통합 HiFi 기준 | `baseline/html/cargo-order-admin-hifi-master.html` | 최종 publishing 기준 |
| 기준 관계 | `source-snapshot/artifact-audit/source-of-truth-map.md` | source of truth map |
| 루트 통합 기획 | `source-snapshot/root-docs/README.md`, `source-snapshot/root-docs/01-screen-map.md`, `source-snapshot/root-docs/02-field-inventory.md`, `source-snapshot/root-docs/03-wireframe.md`, `source-snapshot/root-docs/04-modernization-brief.md` | PRD 원천 |
| 신규 접수 | `source-snapshot/sections/new-order-registration-flow/` | flow source |
| 보조 정보 | `source-snapshot/sections/reservation-area-tabs/` | aside source |
| 최근 사용 | `source-snapshot/sections/transport-dialog-recent-lists/` | dialog recent source |
| 최신 header polish | `source-snapshot/root-docs/10-hifi-design-polish-and-dispatch-manager-integration-log.md` | 배차 담당자, 라벨 토글 기준 |

## 문서 구성

| 문서 | 역할 | 먼저 읽을 사람 |
| --- | --- | --- |
| `01-final-prd.md` | 최종 PRD, 범위, 정책, acceptance 기준 | PM, 개발 리드 |
| `02-publishing-baseline.md` | master HTML 기준 상태와 확인 방법 | 프론트엔드, QA |
| `03-implementation-handoff.md` | 기존 프로젝트 분석/매핑/마이그레이션 체크리스트 | 구현 담당자 |
| `04-source-register.md` | 유지, 통합, archive 후보와 source of truth 등록부 | 기획/문서 관리자 |
| `05-visual-handoff-hub-plan.md` | HTML 기반 visual planning hub IA와 3-pane 설계 | 기획, 프론트엔드 |
| `06-final-baseline-data.md` | 최종 기준 데이터 취합본. 상태, 섹션, data contract, validation, API, QA | 구현 담당자, hub 구현자 |
| `data/final-baseline.json` | 후속 hub 또는 기존 프로젝트 매핑에 쓸 구조화 데이터 | 프론트엔드, 자동화 |
| `visual-handoff-hub/` | 실제 hub 구현 전 데이터/설계 초안 | 후속 hub 구현자 |
| `package-manifest.md` | `final-handoff` 내부에 실제 복사 취합한 파일 묶음과 원본 경로 | 구현 담당자, 문서 관리자 |
| `archive-manifest-2026-06-18.md` | active 루트에서 archive로 이동한 항목과 복구 기준 | 문서 관리자 |

## 실제 취합 폴더

| 폴더 | 역할 | 먼저 확인할 파일 |
| --- | --- | --- |
| `baseline/` | 최종 publishing 기준 복사본 | `baseline/html/cargo-order-admin-hifi-master.html` |
| `source-snapshot/` | 루트 문서, section 문서, audit 문서, 분석 이미지 복사본 | `source-snapshot/root-docs/README.md` |
| `reference-snapshot/` | 비교/구현 참고용 HTML과 component 규칙 복사본 | `reference-snapshot/component-unification-plan/00-index.md` |

다른 PC로 넘길 때는 `final-handoff/` 폴더 전체를 기준 패키지로 전달합니다. 원본 폴더가 함께 없더라도 `baseline/`, `source-snapshot/`, `reference-snapshot/`에서 핵심 자료를 확인할 수 있습니다.

## 최종 기준 파일 취합 현황

| 구분 | 파일/폴더 | `final-handoff` 반영 상태 | 조치 |
| --- | --- | --- | --- |
| 최종 publishing | `baseline/html/cargo-order-admin-hifi-master.html` | `02-publishing-baseline.md`, `06-final-baseline-data.md`, `data/final-baseline.json`에 반영 | 최종 화면 확인 기준으로 유지 |
| HTML 관리 규칙 | `baseline/html/results-html-README.md` | `02-publishing-baseline.md`, `04-source-register.md`에 반영 | 후보 HTML 안내 기준으로 유지 |
| 원본 통합 기획 | `source-snapshot/root-docs/README.md`, `source-snapshot/root-docs/01-screen-map.md`, `source-snapshot/root-docs/02-field-inventory.md`, `source-snapshot/root-docs/03-wireframe.md`, `source-snapshot/root-docs/04-modernization-brief.md`, `source-snapshot/root-docs/05-self-review.md` | `01-final-prd.md`, `04-source-register.md`, `06-final-baseline-data.md`에 요약 반영 | 원문 source로 유지 |
| 최신 통합 로그 | `source-snapshot/root-docs/07-new-order-registration-flow-integration-log.md`, `source-snapshot/root-docs/08-reservation-area-tabs-integration-log.md`, `source-snapshot/root-docs/09-transport-dialog-recent-lists-integration-log.md`, `source-snapshot/root-docs/10-hifi-design-polish-and-dispatch-manager-integration-log.md` | 주요 결정은 `02-publishing-baseline.md`, `06-final-baseline-data.md`에 반영 | 최종 반영 근거로 유지 |
| 최근 사용 main 계획 | `source-snapshot/root-docs/09-transport-dialog-recent-lists-main-integration-plan.md` | `04-source-register.md`에 연결 보강 | 최근 사용 리스트의 메인 반영 계획 근거로 연결 |
| 신규 접수 flow | `source-snapshot/sections/new-order-registration-flow/` | `01-final-prd.md`, `05-visual-handoff-hub-plan.md`, `06-final-baseline-data.md`, hub data에 반영 | 상세 AC/API policy 원문으로 유지 |
| 보조 정보 탭 | `source-snapshot/sections/reservation-area-tabs/` | `01-final-prd.md`, `05-visual-handoff-hub-plan.md`, `06-final-baseline-data.md`, hub data에 반영 | 상세 visibility/API/QA 원문으로 유지 |
| 최근 사용 리스트 | `source-snapshot/sections/transport-dialog-recent-lists/` | `01-final-prd.md`, `05-visual-handoff-hub-plan.md`, `06-final-baseline-data.md`, hub data에 반영 | 상세 interaction/AC 원문으로 유지 |
| 기준 관계/감사 | `source-snapshot/artifact-audit/source-of-truth-map.md`, `source-snapshot/artifact-audit/artifact-inventory.md` | `04-source-register.md`에 반영 | source of truth와 파일 분류 근거로 유지 |
| 기존 archive 기록 | `source-snapshot/artifact-audit/archive-plan.md`, `source-snapshot/artifact-audit/cleanup-candidates.md`, `source-snapshot/artifact-audit/cleanup-manifest-2026-06-16.md`, `source-snapshot/artifact-audit/archive-execution-log-2026-06-16.md` | README와 `04-source-register.md`에서 archive 판단 근거로 연결 | 이번 archive는 `archive-manifest-2026-06-18.md` 기준 |

## 추가 취합 또는 연결 필요 항목

| 우선순위 | 항목 | 필요한 조치 | 이유 |
| --- | --- | --- | --- |
| P0 | 기존 프로젝트 매핑 결과 | `03-implementation-handoff.md`의 route/page/component/API/store 표를 실제 파일 경로로 채움 | 다른 PC의 기존 프로젝트에서 구현 착수하려면 현재 프로젝트와 기존 코드의 연결점이 필요 |
| P0 | API/payload/server validation 결정 | `06-final-baseline-data.md`와 `data/final-baseline.json`의 P0 backlog를 실제 계약으로 갱신 | 최종 저장 기능 구현을 막는 핵심 미결정 |
| P0 | archive 결과 확인 | `archive-manifest-2026-06-18.md`와 `_archive/compact-handoff-20260618/`의 이동 결과 확인 | 복구가 필요한 경우 원래 위치를 빠르게 찾기 위함 |
| P1 | component-unification 기준 | `reference-snapshot/component-unification-plan/`의 버튼, label, focus 규칙 중 구현 필수 항목만 handoff에 요약 | 기존 프로젝트 UI 컴포넌트와 맞출 때 회귀를 줄이기 위함 |
| P1 | 상세 섹션 원문 링크 | `shipper-info`, `transport-route`, `cargo-transport`, `driver-info`, `cargo-summary-docs`, `cargo-list` 원문 중 최종 화면에 직접 필요한 항목만 source register에 보강 | `final-handoff`가 전체 원문 구조를 대신하지 않으면서도 찾을 위치를 제공 |
| P2 | visual hub preview asset | `visual-handoff-hub/previews/`에 실제 preview 이미지를 둘지 결정 | hub HTML 구현 시 화면 상태 preview를 더 빠르게 구성 가능 |

## Archive 완료와 남은 후보

이번 패키지 정리에서 active 루트의 비최종 산출물은 `_archive/compact-handoff-20260618/`로 이동했습니다. 삭제는 하지 않았습니다.

| 항목 | 현재 판단 | 확인 위치 |
| --- | --- | --- |
| 이번 archive | 루트 문서, `artifact-audit/`, `assets/`, `claude-design-v2/`, `results/`, `sections/` 이동 완료 | `archive-manifest-2026-06-18.md` |
| 과거 후보 HTML | master에 반영된 후보 또는 비교용 reference | `_archive/compact-handoff-20260618/results/html/` |
| 과거 review artifacts | 검증 근거이나 현재 최종 안내 기준은 아님 | `_archive/compact-handoff-20260618/results/` |
| 기존 `_archive` 자료 | 이전 archive 완료 자료 | `../_archive/` |
| 삭제 후보 | 이번 단계에서는 지정하지 않음 | 별도 `deletion-candidates`와 사용자 승인 필요 |

## 권장 읽기 순서

1. `01-final-prd.md`에서 구현 목표와 보류 정책을 확인합니다.
2. `baseline/html/cargo-order-admin-hifi-master.html`에서 최종 화면을 확인합니다.
3. `02-publishing-baseline.md`에서 master HTML의 상태 확인 방법을 확인합니다.
4. `06-final-baseline-data.md`에서 구현자가 바로 매핑해야 할 최종 기준 데이터를 확인합니다.
5. `03-implementation-handoff.md`에서 기존 프로젝트에서 찾아야 할 파일, 컴포넌트, API 후보를 체크합니다.
6. `package-manifest.md`에서 복사 취합된 원문과 reference 위치를 확인합니다.
7. `04-source-register.md`에서 어떤 문서를 원문 source로 유지하고 어떤 문서를 최종 인계 문서로 흡수할지 확인합니다.
8. `05-visual-handoff-hub-plan.md`와 `visual-handoff-hub/data/*.json`으로 후속 visual hub 구현 범위를 확인합니다.

## 작업 경계

| 구분 | 포함 | 제외 |
| --- | --- | --- |
| 이번 패키지 | PRD 정리, source 등록, publishing 기준, 구현 인계, visual hub IA | 실제 앱 구현 |
| visual hub | IA, 화면 구성, 데이터 초안 | `index.html` 실제 구현 |
| 문서 관리 | 기존 `final-handoff` 패키지 보강, 비최종 산출물 archive 완료 | 삭제, 실제 앱 구현 |

## 구현 착수 전 핵심 확인

| 우선순위 | 확인 항목 | 이유 |
| --- | --- | --- |
| P0 | 실제 `화물 등록` API endpoint, payload schema, server validation | `new-submitted` 이후 실제 저장 책임 |
| P0 | 필수값과 조건부 validation | 저장 실패, 현장 입력 오류 방지 |
| P0 | 금액/메모/배차 담당자 권한 | 민감 정보 노출과 운영 책임 이슈 |
| P0 | 최근 사용 scope, 저장 시점, 개인정보 마스킹 | 주소/담당자/연락처 노출 정책 |
| P1 | 기존 프로젝트의 route, component, store, API client 위치 | 안전한 단계별 이식 |
| P1 | 목록 전체 컬럼과 상태별 버튼 활성화 | 하단 목록/후속 처리 회귀 방지 |

## 후속 실행

이 패키지까지 확인한 뒤 다음 세션에서는 아래 순서로 진행하는 것을 권장합니다.

1. 기존 프로젝트에서 `화물관리 > 오더 접수/수정` 관련 route, page, component, API, store를 찾습니다.
2. `03-implementation-handoff.md`의 매핑 표를 실제 파일 기준으로 채웁니다.
3. `data/final-baseline.json`과 `visual-handoff-hub/data/hub-map.json`을 기존 프로젝트 component 경로와 연결합니다.
4. Visual hub 실제 HTML 생성이 필요하면 `05-visual-handoff-hub-plan.md` 기준으로 별도 승인 후 `visual-handoff-hub/index.html`을 만듭니다.
