# Archive Plan

> 대상: `C:\Work\Dev\Design\.plans\wireframes\cargo-order-admin-20260430`

## 원칙

1. 삭제보다 아카이브를 우선합니다.
2. 현재 기준본과 연결된 증빙 파일은 같은 묶음으로 이동합니다.
3. 이동 전에는 파일 manifest를 남깁니다.
4. 아카이브 후에는 README 또는 index에 원래 위치와 이동 사유를 기록합니다.
5. 실제 이동은 사용자 승인 후 진행합니다.

## 제안 아카이브 구조

```text
C:\Work\Dev\Design\.plans\wireframes\cargo-order-admin-20260430\_archive
  old-wireframes
  legacy-section-drafts
  review-artifacts
  verification-snapshots
  ai-generated-comparisons
  duplicate-source-copies
```

## 이동 후보 매핑

| 현재 위치 | 이동 후보 위치 | 이유 |
| --- | --- | --- |
| `results\wireframe\order-register-new2.0.zip` | `_archive\old-wireframes\order-register-new2.0.zip` | 압축 원본 보관 |
| `results\wireframe\order-register-new2.0\review-artifacts` | `_archive\review-artifacts\order-register-new2.0` | 비교 캡처 보관 |
| `sections\transport-route\review-artifacts` | `_archive\review-artifacts\transport-route` | 운송구간 비교 캡처 보관 |
| `results\wireframe\order-register-new2.0\verification-*.png` | `_archive\verification-snapshots\order-register-new2.0` | 검증 스냅샷 보관 |
| `results\wireframe\order-register-new2.0\Cargo Order Wireframe B Improved.html` | `_archive\old-wireframes\b-improved` | 과거 개선안 보관 |
| `results\wireframe\order-register-new2.0\specs` | `_archive\old-wireframes\specs` | 초기 명세서형 참고 화면 보관 |

## 실행 순서

1. `artifact-inventory.md` 기준으로 최신 목록을 다시 생성합니다.
2. 실제 이동 대상 manifest를 작성합니다.
3. 사용자에게 이동 대상, 사유, 이동 후 경로를 확인받습니다.
4. 승인된 항목만 아카이브 폴더로 이동합니다.
5. `work-log.md`와 별도 이동 로그를 갱신합니다.
6. B Original Tone, Clean, 신규 HiFi HTML이 정상 열리는지 확인합니다.

## 승인 전 체크리스트

| 체크 | 내용 |
| --- | --- |
| 경로 참조 확인 | 문서 또는 HTML에서 이동 대상 파일을 직접 참조하는지 확인 |
| 기준본 보호 | B Original Tone, Clean, 섹션 기준 HTML은 이동하지 않음 |
| 증빙 보존 | 검증 이미지와 연결 문서는 함께 보관 |
| 복구 가능성 | 삭제가 아닌 이동으로 먼저 처리 |

## 2026-06-16 실행 상태

| 항목 | 상태 |
| --- | --- |
| `_archive` 생성 | 완료 |
| 중복 복사본 이동 | 완료 |
| 초기 zip 이동 | 완료 |
| B Improved 과거안 이동 | 완료 |
| `verification-*.png` 이동 | 완료 |
| `specs` 이동 | 보류 |
| 참조 중인 `review-artifacts` 이동 | 보류 |

보류 항목은 문서에서 직접 참조하고 있어, 이동하려면 참조 경로 갱신 작업을 함께 진행해야 합니다.
