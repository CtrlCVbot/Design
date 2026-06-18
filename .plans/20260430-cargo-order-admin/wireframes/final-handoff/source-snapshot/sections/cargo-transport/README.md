# 화물 운송정보 섹션 기획 패키지

## 목적

이 패키지는 화물 오더 접수/수정 화면 중 `3. 화물 운송정보` 섹션을 독립적으로 정리하기 위한 문서 묶음입니다.

운송구간과 중복되는 조건을 줄이고, 화주에게 청구하는 금액과 차주에게 지급/청구하는 금액을 분리해 정산 의미를 명확히 하는 것이 목표입니다.

## 현재 상태

| 항목 | 상태 | 메모 |
| --- | --- | --- |
| 패키지 생성 | 완료 | `sections/cargo-transport` 신규 생성 |
| HTML 3종 source 비교 | 완료 | `05-source-mapping.md`, `06-source-comparison-review.md` 반영 |
| 정산 구조 재정의 | 완료 | `결제방법`, `청구비용`, `운송비용`, `수수료`, `수익/차주운임` 기준 |
| HTML 구현 | 완료 | `cargo-transport-section-variants.html`을 운송구간 D안 컨셉으로 재정렬하고 inline edit 샘플 반영 |
| B 통합본 수정 | 완료 | `Cargo Order Wireframe B Original Tone.html`의 `3. 화물 운송정보` 섹션에 F안 `운송+품목`/`금액` CTA 흡수 전환과 최신 정보 구조 반영 |
| B 통합본 밀도 조정 | 완료 | row padding, 필드 폭, CTA 흡수 속도, 적용 후 reveal을 실제 사용감 기준으로 미세 조정 |
| B 통합본 최종 UI 고정 | 완료 | 입력 전 CTA row와 적용 후 정보 row의 높이/폭 리듬, 보조 chip 약화, 다이얼로그 닫힘 동작 검증 완료 |
| 화물정보 요약 연결 | 완료 | `품목`, `실중량`, `톤수`, `차종`, `대수`가 `4. 화물정보 요약`으로 전달되는 기준 정리 및 B 통합본 샘플 반영 |
| 삭제 대상 정리 | 보류 | 실제 삭제 없이 필요 시 후보만 별도 리스트업 |

## 기준 파일

| 기준 파일 | 역할 |
| --- | --- |
| `results/wireframe/order-register-new2.0/Cargo Order Wireframe B Original Tone.html` | 현재 B 통합본 기준. 필드 위치와 통합 대상 비교 |
| `results/wireframe/order-register-new2.0/Cargo Order Wireframe.html` | 최초 wireframe 기준. 원래 정보 배치와 필드 존재 여부 비교 대상 |
| `results/wireframe/order-register-new2.0/specs/04 Wireframe Spec Form.html` | 명세서형 표현과 값 없음 상태 비교 대상 |
| `sections/transport-route/transport-route-d-workflow.html` | 화면 컨셉 기준. 종이 배경, 손글씨 폰트, 얇은 라인 유지 대상 |
| `sections/transport-route/08-closeout-transport-route.md` | 운송구간 1차 기준 확정 문서. 계산 메타 의존성 인계 기준 |

## 산출물

| 파일 | 내용 |
| --- | --- |
| `01-prd-cargo-transport.md` | 화물 운송정보 섹션 PRD |
| `02-wireframe-cargo-transport.md` | 운송 조건/금액 조건/품목 row wireframe 방향 |
| `03-user-flow-cargo-transport.md` | 입력, 수정, 자동 선착불 전환 user flow |
| `04-field-state-mapping.md` | 필드별 상태, 입력 방식, 의존성 mapping |
| `05-source-mapping.md` | 기존 HTML 3종 기준 source mapping |
| `06-source-comparison-review.md` | 기존 화면 대비 개선점과 리스크 리뷰 |
| `07-inline-edit-interaction-plan.md` | 라벨 표시와 inline edit 전환 방식 기획 및 HTML 반영 기준 |
| `08-empty-state-activation-transition.md` | 값 없음 상태에서 입력 CTA가 대상 라벨로 흡수되고 다이얼로그로 이어지는 전환 기준 |
| `09-f-transport-item-money-dialog-plan.md` | F안. `운송+품목` 2행 박스와 `금액` 별도 박스, 입력 전 다이얼로그 진입 기준 |
| `10-final-adoption-criteria.md` | F안 단독 HTML과 B 통합본의 차이, 최종 채택 기준, 구현 인계 기준 |
| `11-summary-data-connection.md` | `3. 화물 운송정보` 원본 필드가 `4. 화물정보 요약`으로 전달되는 연결 기준 |
| `cargo-transport-section-variants.html` | 운송구간 D안 톤을 유지하되 항상 노출되는 compact 명세 row로 비교하는 HTML |
| `cargo-transport-section-f-wireframe.html` | F안만 단독으로 확인하는 HTML. `운송+품목` 입력, `금액 조건` 입력 다이얼로그와 적용 후 inline edit 포함 |
| `results/wireframe/order-register-new2.0/Cargo Order Wireframe B Original Tone.html` | B 통합본. 화물 운송정보 섹션에 확정 패턴 반영 |
| `self-review.md` | 이번 패키지 수정에 대한 자체 리뷰와 리스크 |

## 1차 구조 결정

| 결정 | 내용 |
| --- | --- |
| 운송 조건 | `톤수`, `차종`, `대수`, `실중량` |
| 실중량 | 톤수 선택 시 해당 톤수의 110%를 `0.00` 단위로 자동 입력, 직접 수정 가능 |
| 품목 위치 | F안과 B 통합본에서는 `운송+품목` 박스의 2번째 row. 과거 D안의 금액 아래 단독 row는 비교 기준으로만 유지 |
| 제외 필드 | `광폭`, `도착` |
| 금액 조건 | `결제방법`, `청구비용`, `운송비용`, `수수료`, `수익/차주운임` |
| 결제방법 | `인수증`, `선불`, `착불`, `선착불` |
| 필드 순서 | 금액 입력 필드는 `청구비용`을 첫 번째로 둠 |
| 청구비용 입력 | `운송비용`에 같은 금액 자동 입력 |
| 운송비용 수정 | `청구비용`은 유지하고 `운송비용`만 수정 |
| 수수료 입력 | 자동 `선착불` 전환, `청구비용=0원` 고정, `운송비용`으로 포커스 이동 |
| 인수증 상태 | `수수료` 숨김/비활성, `청구비용 - 운송비용 = 수익` |
| 선불/착불/선착불 상태 | `수수료` 표시, `운송비용 + 수수료 = 차주운임` |
| 명칭 변경 | 기존 `합계`는 인수증에서 `수익`, 선착불에서 `차주운임`으로 표기 |
| 위치 규칙 | 인수증과 선착불 상태에서 동일한 컴포넌트 위치 유지 |
| 값 없음 전환 | `운송+품목 입력`, `금액 조건 선택` 버튼이 `340ms` 동안 각 라벨 방향으로 이동 후 다이얼로그를 열고, 적용 후 항상 노출 row로 전환 |
| B 통합본 밀도 | 빈 row와 적용 후 row의 padding을 줄이고, `수정` 배지는 hover/focus에서만 표시해 화면 설명성을 낮춤 |
| B 통합본 최종 row | 입력 전 CTA row는 29px 기준, 적용 후 `운송`/`금액` row는 28px, `품목` row는 29px 기준으로 맞춤 |
| 입력 전 보조 chip | `톤수/차종/품목`, `인수증 기본`은 dashed muted chip으로 낮춰 CTA가 주 액션으로 보이게 함 |
| 적용 후 결과 강조 | 금액 row의 `수익/차주운임` 셀만 결과값으로 강조하고, `청구-운송` 공식은 보조 정보로 약하게 표시 |
| 다이얼로그 닫힘 | 적용 후 `<dialog>`의 `open` 상태와 표시 상태가 모두 닫히도록 처리하며, CTA animation 완료는 1회만 실행 |
| 수정 방식 | 기본은 라벨 표시, 클릭 시 같은 위치에서 input/select로 전환하는 inline edit |
| 팝업 사용 | 기본 사용하지 않음. 복잡한 보조 선택 화면이 필요할 때만 별도 검토 |
| 운송구간 계산 메타 | 거리와 기준 금액은 주소만으로 확정하지 않고 `톤수`, `차종` 선택 이후 더 정확하게 출력 |
| F안 추가 | `운송+품목`을 하나의 박스 안 2행으로 묶고, `금액`은 별도 박스로 분리. 최초 입력은 버튼 슬라이딩 후 다이얼로그로 진행 |
| F안 실중량 안내 | `화물중량 110% 이하`는 별도 칩이 아니라 `실중량` 셀 내부 보조 안내로 표시 |
| F안 수정 표시 | 고정 `수정 가능` 칩 제거. 각 수정 가능 셀 hover/focus 시 운송구간과 같은 `수정` 배지 표시 |
| F안 내부 문구 | 실제 배치 컴포넌트 내부에는 오더 데이터만 표시. 구조 설명 문구는 문서/외부 안내로 분리 |
| 화물정보 요약 연결 | `품목`, `실중량`, `톤수`, `차종`, `대수`는 `4. 화물정보 요약`의 원본 데이터로 전달 |
| 요약 제외 금액 | `결제방법`, `청구비용`, `운송비용`, `수수료`, `수익/차주운임`은 요약 문장에 기본 포함하지 않음 |
| 디자인 톤 | `transport-route-d-workflow.html`과 같은 종이 배경, 손글씨 폰트, 얇은 라인 유지. 단, 화물 운송정보는 펼침 없이 항상 노출 |

## 이번 단계 범위

이번 단계는 문서 패키지 수정과 비교용 HTML variants 생성을 포함합니다.

포함:
- `광폭`, `도착` 제외 기준 반영
- `품목`을 `운송+품목` 박스의 2번째 row로 이동
- `결제방법`을 금액 조건에 포함
- `실중량`을 운송 조건에 추가하고 톤수 110% 자동 입력/수정 가능 기준 반영
- 청구/운송/수수료/수익·차주운임 정산 구조 반영
- 결제방법별 계산식 반영
- 수수료 입력 시 자동 선착불 전환 규칙 반영
- 라벨 표시에서 inline edit로 전환하는 수정 interaction 기준 및 HTML 샘플 반영
- 값 없음 상태에서 입력 CTA 흡수 전환과 다이얼로그 적용 기준 및 HTML 샘플 반영
- B 통합본의 `3. 화물 운송정보` 섹션에 F안 `운송+품목`/`금액` CTA 전환, 금액 조건 분리, 품목 2행 row 반영
- `cargo-transport-section-variants.html` 신규 생성
- F안 기획 문서와 HTML 비교 섹션 추가. 최초 입력은 다이얼로그, 입력 후 수정은 D안 inline edit를 유지
- F안 단독 확인용 `cargo-transport-section-f-wireframe.html` 분리 생성
- F안 단독 HTML에 운송구간 방식의 hover/focus `수정` 배지와 `실중량` 내부 110% 안내 반영
- B 통합본 `3. 화물 운송정보`의 row 밀도, 필드 폭, CTA 전환 속도, 적용 후 reveal 체감 조정
- B 통합본 입력 전/적용 후 상태 비교 후 최종 UI 계약 문서화
- F안 단독 HTML과 B 통합본의 차이를 최종 채택 기준으로 문서화
- `4. 화물정보 요약`으로 전달되는 원본 필드와 override 정책 연결

제외:
- 기존 파일 삭제
- 실제 저장 API, validation error message, 자동/수정됨 chip 상세 구현

## 다음 단계

1. validation message와 `자동/수정됨` chip 상세 구현은 후속 단계에서 결정합니다.
2. 차종 축약어와 일정 토큰의 운영 표기를 확정합니다.
3. 실제 개발 단계에서는 B 통합본을 구현 기준으로 사용하고, F안 단독 HTML은 reference로 유지합니다.
## 2026-06-08 Clean 반영 고정 규칙

| 항목 | 기준 |
| --- | --- |
| 입력전 상태 | `운송+품목`, `금액`을 각각 별도 row로 두고 짧은 placeholder와 입력 버튼을 표시한다. |
| 운송+품목 | 톤수, 차종, 대수, 실중량, 품목을 한 컴포넌트 흐름으로 묶고, 품목은 운송 박스의 2행으로 유지한다. |
| 금액 | 결제방법, 청구비용, 운송비용, 수수료, 수익/차주운임 위치를 고정한다. |
| 수정 | 적용 후 각 field 클릭 시 같은 자리에서 input/select로 전환한다. hover/focus 때만 수정 affordance를 표시한다. |
| 표시 | 실중량 안내는 별도 큰 chip이 아니라 실중량 field 내부 보조 힌트로 둔다. 적용 후 값은 말줄임을 기본으로 쓰지 않는다. |
