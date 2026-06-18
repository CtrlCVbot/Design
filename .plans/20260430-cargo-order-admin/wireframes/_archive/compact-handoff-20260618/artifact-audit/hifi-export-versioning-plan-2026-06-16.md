# HiFi Export Versioning Plan - 2026-06-16

## 목적

Clean 애니메이션을 반영한 새 HiFi export가 생성되면 기존 HiFi를 덮어쓰지 않고 나란히 보관하기 위한 기준을 정한다.

현재 `results/html`에는 기존 HiFi export 1개만 있다.

## 현재 상태

| 파일 | 상태 | 역할 |
| --- | --- | --- |
| `results/html/화물 오더 접수수정 (오프라인).html` | 보존 | 기존 shadcn HiFi 기준 후보 |

## 보관 원칙

| 원칙 | 내용 |
| --- | --- |
| 덮어쓰기 금지 | 새 export는 기존 `화물 오더 접수수정 (오프라인).html`을 대체하지 않고 별도 파일로 추가 |
| 최신 후보 분리 | 새 export는 `candidate`로 두고, 검증 전에는 기준본으로 승격하지 않음 |
| 파일명에 의도 포함 | 어떤 피드백을 반영한 결과인지 파일명에서 확인 가능해야 함 |
| manifest 기록 | 파일 추가 시 `results/html/README.md`에 역할, 생성일, 검증 상태 기록 |
| 대용량 중복 허용 | HTML이 20MB 이상이어도 비교 검증 전에는 삭제하지 않음 |

## 권장 파일명

| 용도 | 권장 파일명 | 메모 |
| --- | --- | --- |
| 기존 export | `화물 오더 접수수정 (오프라인).html` | 현재 파일명 유지 |
| Local motion 후보 | `cargo-order-hifi-local-motion-20260616.html` | Claude Design 없이 로컬 layer를 주입한 현재 후보 |
| Clean animation 반영 후보 | `cargo-order-hifi-clean-animation-20260616.html` | ASCII 이름을 권장해 CLI/검색 안정성 확보 |
| 수동 캡처 증빙 | `cargo-order-hifi-clean-animation-20260616-desktop.png` | 필요 시 `review-artifacts` 또는 별도 evidence 폴더에 보관 |

## 새 export 수용 절차

Claude Design export를 다시 진행하지 않는 동안에는 `cargo-order-hifi-local-motion-20260616.html`을 local candidate로 사용한다. 이 파일은 기존 HTML을 직접 수동 편집한 결과가 아니라 `hifi-local-motion-layer.html`과 `build-local-hifi-candidate.mjs`로 재생성한다.

1. Claude Design에서 새 결과를 export한다.
2. 기존 파일을 덮어쓰지 않고 `results/html/cargo-order-hifi-clean-animation-20260616.html`로 저장한다.
3. `results/html/README.md`에 새 row를 추가한다.
4. 정적 분석으로 아래 항목을 비교한다.

| 검증 항목 | 기존 HiFi 기대값 | 새 후보 목표 |
| --- | ---: | ---: |
| `@keyframes` | 0 | 4개 이상 |
| `animation:` | 0 | 4개 이상 |
| `prefers-reduced-motion` | 0 | CSS/JS 모두 존재 |
| `animationend` | 0 | 1개 이상 |
| `aria-live` | 2 | 4개 이상 또는 상태 안내 보강 |
| `data-b-*` hook | 0 | 가능하면 Clean 기준 보강 |

5. 기존 HiFi와 새 후보를 비교해 다음 중 하나로 판정한다.

| 판정 | 의미 | 후속 |
| --- | --- | --- |
| `promote` | 새 후보를 시각 기준본으로 승격 가능 | source-of-truth 갱신 |
| `partial` | 일부 모션은 유효하나 구조/필드 회귀 있음 | 피드백 프롬프트 재작성 |
| `reject` | 기준 충돌이 큼 | 기존 HiFi 유지 |

## 권장 폴더 정책

| 위치 | 역할 |
| --- | --- |
| `results/html/` | 현재 비교 대상 HiFi export만 보관 |
| `artifact-audit/` | 판정 문서와 비교 로그 보관 |
| `_archive/old-hifi/` | 더 이상 active 비교 대상이 아닌 과거 HiFi export 보관 후보 |

## 다음 액션

새 export 파일이 들어오면 `results/html/README.md`의 후보 row를 실제 파일명과 크기로 갱신하고, 정적 비교 리포트를 추가한다.
