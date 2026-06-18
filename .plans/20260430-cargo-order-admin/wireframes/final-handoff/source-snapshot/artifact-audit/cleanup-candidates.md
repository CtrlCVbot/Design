# Cleanup Candidates

> 이 문서는 삭제 실행 목록이 아니라 정리 후보 분류입니다. 실제 삭제/이동은 사용자 승인 후 진행합니다.

## 분류 기준

| 분류 | 의미 | 처리 방식 |
| --- | --- | --- |
| 유지 | 현재 기준본 또는 필수 참고 자료 | 그대로 유지 |
| 기준본 | 이후 작업의 source of truth | 유지, README에 명시 |
| 참고본 | 비교/근거로 필요하지만 최신 기준은 아님 | 유지 또는 아카이브 |
| 아카이브 대상 | 과거 버전, 검증 스냅샷, 비교 산출물 | `_archive` 이동 후보 |
| 삭제 후보 | 동일 중복, 임시 복사본, 기준본으로 대체 가능 | 승인 후 삭제 후보 |
| 판단 보류 | 기준 여부가 불확실함 | 추가 검토 |

## 유지 권장

| 경로 | 이유 |
| --- | --- |
| `C:\Work\Dev\Design\.plans\wireframes\cargo-order-admin-20260430\01-screen-map.md` 등 `01~06` | 최초 원본 분석 기준 |
| `C:\Work\Dev\Design\.plans\wireframes\cargo-order-admin-20260430\sections` | 섹션별 최신 기획 문서 |
| `C:\Work\Dev\Design\.plans\wireframes\cargo-order-admin-20260430\results\wireframe\order-register-new2.0\Cargo Order Wireframe B Original Tone.html` | B 통합안 기준본 |
| `C:\Work\Dev\Design\.plans\wireframes\cargo-order-admin-20260430\results\wireframe\order-register-new2.0\component-unification-plan` | 컴포넌트 통일 기준 |
| `C:\Work\Dev\Design\.plans\wireframes\cargo-order-admin-20260430\claude-design-v2` | 신규 HiFi 입력 패키지 |

## 아카이브 후보

| 경로 | 사유 | 대체/상위 기준 |
| --- | --- | --- |
| `C:\Work\Dev\Design\.plans\wireframes\cargo-order-admin-20260430\results\wireframe\order-register-new2.0.zip` | 초기 산출물 압축본으로 보임. 현재 압축 해제본과 후속 문서가 존재 | `results\wireframe\order-register-new2.0` |
| `C:\Work\Dev\Design\.plans\wireframes\cargo-order-admin-20260430\results\wireframe\order-register-new2.0\review-artifacts` | 이전 비교 캡처 다수. 검증 근거로는 유효하나 active 폴더에 계속 둘 필요는 낮음 | `_archive\review-artifacts` |
| `C:\Work\Dev\Design\.plans\wireframes\cargo-order-admin-20260430\sections\transport-route\review-artifacts` | 운송구간 과거 비교 캡처 | `_archive\transport-route-review-artifacts` |
| `C:\Work\Dev\Design\.plans\wireframes\cargo-order-admin-20260430\results\wireframe\order-register-new2.0\verification-*.png` | Clean/B 반영 검증 스냅샷 | component-unification-plan 검증 문서 |
| `C:\Work\Dev\Design\.plans\wireframes\cargo-order-admin-20260430\results\wireframe\order-register-new2.0\Cargo Order Wireframe B Improved.html` | 과거 개선안. 현재 B Original Tone과 Clean이 기준 | B Original Tone, Clean |
| `C:\Work\Dev\Design\.plans\wireframes\cargo-order-admin-20260430\results\wireframe\order-register-new2.0\specs` | 초기 명세서형 참고 화면 | 섹션별 최신 HTML |

## 삭제 후보

| 경로 | 사유 | 승인 전 확인 |
| --- | --- | --- |
| `C:\Work\Dev\Design\.plans\wireframes\cargo-order-admin-20260430\Cargo Order B Implementation Clean.html` | `results\wireframe\order-register-new2.0\Cargo Order B Implementation Clean.html`와 SHA256 동일 | 루트 경로를 참조하는 문서/프롬프트가 없는지 확인 |
| `C:\Work\Dev\Design\.plans\wireframes\cargo-order-admin-20260430\results\wireframe\order-register-new2.0\uploads\source-full.png` | `assets\source-full.png`와 SHA256 동일 | HTML 또는 문서에서 uploads 경로를 직접 참조하는지 확인 |

## 판단 보류

| 경로 | 보류 사유 |
| --- | --- |
| `C:\Work\Dev\Design\.plans\wireframes\cargo-order-admin-20260430\results\html\화물 오더 접수수정 (오프라인).html` | 신규 결과물. 리뷰 후 기준본/참고본/재작업 후보 결정 |

## 2026-06-16 실행 반영

| 항목 | 처리 결과 |
| --- | --- |
| Clean 루트 중복본 | `_archive\duplicate-source-copies`로 이동 |
| uploads source-full 복사본 | `_archive\duplicate-source-copies`로 이동 |
| 초기 zip | `_archive\old-wireframes`로 이동 |
| B Improved HTML | `_archive\old-wireframes\b-improved`로 이동 |
| B Improved 캡처 3개 | `_archive\old-wireframes\b-improved\review-artifacts`로 이동 |
| `verification-*.png` 12개 | `_archive\verification-snapshots\order-register-new2.0`로 이동 |
| `specs` | 직접 참조가 있어 보류 |
| `review-artifacts` 전체 | 직접 참조가 있어 보류 |
| 1차 Claude Design 패키지 | `_archive\legacy-prompts\claude-design-v1`로 이동 |
| 운송구간 과거 프롬프트 | `_archive\legacy-prompts\transport-route-section-package-prompt.md`로 이동 |

실제 삭제는 하지 않았습니다. 삭제 후보도 우선 아카이브로 처리했습니다.
