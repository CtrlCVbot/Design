# Cargo Order Artifact Audit

> 작성일: 2026-06-16  
> 대상 폴더: `C:\Work\Dev\Design\.plans\wireframes\cargo-order-admin-20260430`  
> 현재 통합 HiFi 기준: `C:\Work\Dev\Design\.plans\wireframes\cargo-order-admin-20260430\results\html\cargo-order-admin-hifi-master.html`

## 목적

이 패키지는 화물 오더 접수/수정 화면의 기존 기획 문서, 섹션별 와이어프레임, B 통합안, Clean 구현안, 현재 통합 HiFi master와 과거 후보 HTML 결과물을 한 번에 정리하기 위한 감사 문서입니다.

현재 단계에서는 삭제보다 아카이브 이동을 우선합니다. 중복/과거 산출물 일부와 legacy prompt는 `_archive`로 이동했고, 참조가 남은 `specs`, `review-artifacts`, 초기 HTML/variants HTML은 경로 정리 후 이동 여부를 결정합니다.

## 현재 판단

| 구분 | 현재 기준 |
| --- | --- |
| 기획 통합 기준본 | `C:\Work\Dev\Design\.plans\wireframes\cargo-order-admin-20260430\results\wireframe\order-register-new2.0\Cargo Order Wireframe B Original Tone.html` |
| 컴포넌트 통일 기준 | `C:\Work\Dev\Design\.plans\wireframes\cargo-order-admin-20260430\results\wireframe\order-register-new2.0\component-unification-plan` |
| Clean 참조 화면 | `C:\Work\Dev\Design\.plans\wireframes\cargo-order-admin-20260430\results\wireframe\order-register-new2.0\Cargo Order B Implementation Clean.html` |
| 현재 통합 HiFi master | `C:\Work\Dev\Design\.plans\wireframes\cargo-order-admin-20260430\results\html\cargo-order-admin-hifi-master.html` |
| 신규 HiFi 초기 후보 | `C:\Work\Dev\Design\.plans\wireframes\cargo-order-admin-20260430\results\html\화물 오더 접수수정 (오프라인).html` |
| 원본 분석 패키지 | `C:\Work\Dev\Design\.plans\wireframes\cargo-order-admin-20260430\01-screen-map.md` 등 `01~06` 문서 |

## 문서 구성

| 문서 | 역할 |
| --- | --- |
| `artifact-inventory.md` | 전체 산출물 구성, 파일 수, 주요 파일 역할 정리 |
| `source-of-truth-map.md` | 기준본, 참고본, 후보 결과물 관계 정리 |
| `high-fidelity-review.md` | 신규 HiFi HTML의 위치, 검토 기준, 초기 리뷰 |
| `cleanup-candidates.md` | 유지, 기준본, 참고본, 아카이브, 삭제 후보 분류 기준 |
| `archive-plan.md` | 아카이브 폴더 구조와 실행 순서 |
| `archive-reclassification-2026-06-16.md` | 최종 방향 기준의 재분류와 legacy prompt 이동 결과 |
| `deletion-candidates.md` | 삭제 후보와 승인 전 점검 항목 |
| `work-log.md` | 이번 감사 작업 로그 |
| `next-action-plan.md` | 다음 실행 단계 |

## 안전 규칙

1. 삭제보다 아카이브를 우선합니다.
2. 기준본 여부가 불확실한 파일은 `판단 보류`로 둡니다.
3. 실제 삭제 또는 이동 전에는 변경 전 manifest를 남깁니다.
4. HTML, 문서, 이미지 증빙이 서로 연결된 경우 한쪽만 단독 삭제하지 않습니다.
5. 현재 최종 안내 기준은 `results/html/cargo-order-admin-hifi-master.html`입니다. 과거 후보 HTML은 비교와 rollback 참고용으로 둡니다.
