# Deletion Candidates

> 삭제 후보는 실제 삭제 목록이 아닙니다. 사용자 승인 전에는 삭제하지 않습니다.

## 삭제 후보 요약

| 우선순위 | 파일 | 사유 | 권장 처리 |
| --- | --- | --- | --- |
| 1 | `C:\Work\Dev\Design\.plans\wireframes\cargo-order-admin-20260430\Cargo Order B Implementation Clean.html` | `results\wireframe\order-register-new2.0` 내부 Clean 파일과 SHA256 동일 | 참조 확인 후 삭제 가능 |
| 2 | `C:\Work\Dev\Design\.plans\wireframes\cargo-order-admin-20260430\results\wireframe\order-register-new2.0\uploads\source-full.png` | `assets\source-full.png`와 SHA256 동일 | 참조 확인 후 삭제 또는 아카이브 |

## 삭제 전 필수 확인

1. `rg`로 해당 파일명이 문서와 HTML에서 참조되는지 확인합니다.
2. 기준본 HTML이 해당 경로를 상대 참조하고 있지 않은지 확인합니다.
3. 삭제 대신 아카이브로도 충분한지 확인합니다.
4. 삭제 승인 목록을 사용자에게 다시 보여줍니다.
5. 삭제 후 `work-log.md`에 삭제 일시, 파일명, 사유를 남깁니다.

## 삭제보다 아카이브를 추천하는 항목

| 파일/폴더 | 이유 |
| --- | --- |
| `results\wireframe\order-register-new2.0.zip` | 용량이 크지만 초기 산출물 복구용 가치가 있음 |
| `review-artifacts` 폴더들 | 현재 화면 판단에는 덜 필요하지만 과거 검증 근거로 가치가 있음 |
| `verification-*.png` | 사용자 피드백 반영 증빙으로 남길 수 있음 |
| `specs` | 초기 명세서형 화면 흐름의 근거로 보관 가치가 있음 |

## 현재 삭제 실행 상태

| 항목 | 상태 |
| --- | --- |
| 실제 삭제 | 미실행 |
| 실제 이동 | 완료 |
| 사용자 승인 | 2026-06-16 2, 3번 진행 요청 기준 |

## 2026-06-16 처리 결과

| 기존 삭제 후보 | 처리 |
| --- | --- |
| `C:\Work\Dev\Design\.plans\wireframes\cargo-order-admin-20260430\Cargo Order B Implementation Clean.html` | 삭제하지 않고 `_archive\duplicate-source-copies\Cargo Order B Implementation Clean.root-copy.html`로 이동 |
| `C:\Work\Dev\Design\.plans\wireframes\cargo-order-admin-20260430\results\wireframe\order-register-new2.0\uploads\source-full.png` | 삭제하지 않고 `_archive\duplicate-source-copies\source-full.uploads-copy.png`로 이동 |

삭제보다 복구 가능한 아카이브가 안전하다고 판단해 실제 파일 삭제는 하지 않았습니다.
