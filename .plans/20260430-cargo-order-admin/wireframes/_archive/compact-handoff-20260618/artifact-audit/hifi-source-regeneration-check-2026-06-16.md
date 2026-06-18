# HiFi Source Regeneration Check - 2026-06-16

## 목적

신규 HiFi 결과물 `results/html/화물 오더 접수수정 (오프라인).html`에 Clean 애니메이션을 반영하기 전에, 원본 소스 또는 재생성 가능한 경로가 로컬에 남아 있는지 확인한다.

## 결론

현재 폴더만 기준으로 보면, HiFi 결과물은 로컬 빌드 소스가 아니라 Claude Design 결과를 오프라인 HTML로 내보낸 산출물이다.

업데이트: 2026-06-16 후속 결정에 따라 Claude Design 재생성은 당분간 보류하고, `results/html/cargo-order-hifi-local-motion-20260616.html` local candidate를 통해 현재 폴더 안에서 개선을 진행한다.

따라서 권장 반영 경로는 `결과 HTML 직접 패치`가 아니라 `claude-design-v2/PROMPT-LOG.md`를 기준으로 Claude Design에서 재생성한 뒤 새 결과 HTML을 받는 방식이다.

## 확인 결과

| 항목 | 결과 | 판단 |
| --- | --- | --- |
| `results/html` | `화물 오더 접수수정 (오프라인).html` 단일 파일만 존재 | 최종 export만 있음 |
| 중간 산출물 | `Design System.html`, `Cargo Order New.html`, `Cargo Order HiFi.html`, `ds.css` 로컬 미존재 | 로컬 소스 수정 경로 없음 |
| 빌드 설정 | `package.json`, `vite/webpack/rollup` 설정 미존재 | 일반 프론트엔드 빌드 프로젝트 아님 |
| `claude-design-v2/README.md` | Claude Design 수동 실행 절차 기록 | 재생성 안내 문서 |
| `claude-design-v2/PROMPT-LOG.md` | Step 1~7 프롬프트 전문과 산출물명 기록 | 재생성의 단일 원본 |
| HiFi 내부 manifest | 18개 font asset과 template로 구성 | 소스 트리 복원용 manifest 아님 |

## 오프라인 HTML 내부 구조

| 항목 | 값 |
| --- | ---: |
| 파일 크기 | 22,735,989 bytes |
| 내부 template | 94,334 chars |
| manifest entry | 18 |
| manifest mime | `font/woff2` 9개, `font/woff` 9개 |
| template 내 script | 1 |
| template 내 style | 3 |
| template 내 중간 산출물명 | `ds.css` 문자열만 확인 |

## 재생성 기준

| 우선순위 | 방식 | 사용 조건 |
| --- | --- | --- |
| 1 | Claude Design 재생성 | `PROMPT-LOG.md` Step 1~7을 기준으로 최신 지시를 추가해 새 HiFi를 생성 |
| 2 | Claude Design 후속 수정 | 기존 결과물을 Claude Design에 다시 첨부하고 Clean 애니메이션 반영 프롬프트를 실행 |
| 3 | 결과 HTML 직접 패치 | 재생성 경로가 막히고, 빠른 검토용 샘플만 필요할 때 사용 |

## Clean 애니메이션 반영 시 권장 흐름

1. `Cargo Order B Implementation Clean.html`과 현재 HiFi 오프라인 HTML을 Claude Design에 함께 첨부한다.
2. `sections/order-entry-edit/02-clean-animation-adoption-plan.md`를 지시문으로 제공한다.
3. `PROMPT-LOG.md` Step 7의 유지 조건을 반복해 구조 변경을 막는다.
4. 결과는 기존 파일을 덮어쓰지 말고 새 파일로 export한다.
5. 새 결과를 정적 분석해 `@keyframes`, `prefers-reduced-motion`, `animationend`, `aria-live` 보강 여부를 확인한다.

## 남은 리스크

| 리스크 | 수준 | 대응 |
| --- | --- | --- |
| Claude Design 세션 원본 부재 | high | 현재 로컬에는 중간 산출물이 없으므로 프롬프트 재실행이 필요 |
| 결과 재생성 시 레이아웃 회귀 | high | Step 7 유지 조건과 Clean hook 보존 조건을 함께 제공 |
| 번들 직접 패치 유혹 | medium | 직접 패치는 검토용 임시본으로만 제한 |

## 다음 액션

다음 작업은 local candidate를 기준으로 action/state matrix를 작성하고, 필요한 추가 모션을 `hifi-local-motion-layer.html`에 반영하는 것이다. Claude Design용 프롬프트 작성은 후순위 옵션으로 보류한다.
