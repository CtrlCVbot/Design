# 접수/수정 섹션 기획 패키지

## 목적

이 패키지는 화물 오더 화면의 상단 입력/수정 업무면과 전역 액션바를 정리한다.

`cargo-list`는 후순위로 두고, 먼저 신규 HiFi에서 고도화된 화면 톤을 기준으로 `신규 접수`, `화물 등록`, `화물 수정`, `복사`, `취소`, `배차취소`, `정산 처리` 흐름을 다듬는다.

## 기준

| 기준 | 역할 |
| --- | --- |
| `../../results/html/화물 오더 접수수정 (오프라인).html` | 시각 고도화 기준 |
| `../../results/wireframe/order-register-new2.0/Cargo Order B Implementation Clean.html` | interaction/data hook 기준 |
| `../../results/wireframe/order-register-new2.0/Cargo Order Wireframe B Original Tone.html` | 기존 구조와 업무 액션 기준 |
| `../shipper-info` | 화주 정보 입력/조회 기준 |
| `../transport-route` | 운송구간 입력/주소 적용 기준 |
| `../cargo-transport` | 운송+품목/금액 입력 기준 |
| `../cargo-summary-docs` | 화물정보 요약 기준 |
| `../driver-info` | 차주/화물맨 입력 기준 |
| `../new-order-registration-flow` | 신규 접수 wizard, 메인 적용, 최종 `화물 등록` CTA 기준 |

## 현재 판단

| 항목 | 상태 | 메모 |
| --- | --- | --- |
| HiFi 시각 기준 | 조건부 채택 | 전문 업무 UI 톤과 액션 그룹 방향을 참고 |
| Clean 동작 기준 | 유지 | `data-*` hook과 dialog/accessibility 구조는 Clean 기준 유지 |
| Clean 애니메이션 | 반영 계획 수립 | 적용/전환/상태 피드백 모션을 HiFi에 선별 이식 |
| cargo-list | 보류 | 목록 실기획은 후속 단계 |
| 전역 액션 | 보강 필요 | 원본 기능명과 HiFi 그룹 구조를 매핑해야 함 |
| 신규 접수 상태 | 완료 | `../new-order-registration-flow` 기준을 source of truth로 사용 |
| 수정/dirty/error/saved 상태 | 보강 필요 | 기존 오더 수정과 저장 실패 상태는 별도 정의 필요 |

## 산출물

| 파일 | 내용 |
| --- | --- |
| `01-entry-edit-refinement-plan.md` | 접수/수정 업무면 보강 계획 |
| `02-clean-animation-adoption-plan.md` | Clean 애니메이션을 HiFi 결과물에 반영하기 위한 계획 |
| `self-review.md` | 이번 패키지 생성 자체 리뷰 |

## 다음 단계

1. `02-clean-animation-adoption-plan.md`를 기준으로 Clean 애니메이션의 HiFi 반영 방식을 확정한다.
2. `03-action-state-matrix.md`에서 전역 액션바, 화면 상태, 애니메이션 트리거를 연결한다.
3. 저장 전 validation과 confirm dialog 정책을 섹션별 필수값과 연결한다.
4. HiFi 스타일을 Clean 구조에 이식할 때 필요한 hook/접근성 보존 체크리스트를 작성한다.
