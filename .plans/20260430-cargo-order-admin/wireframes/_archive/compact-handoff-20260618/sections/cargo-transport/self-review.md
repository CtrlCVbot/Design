# Self Review: 화물 운송정보 패키지 수정

## 리뷰 범위

이번 리뷰는 `sections/cargo-transport` 문서 패키지의 정보 구조 수정, 비교용 HTML variants 생성, B 통합본 화물 운송정보 섹션 반영을 포함합니다.

삭제 대상 정리는 수행하지 않았습니다.

## 완료 확인

| 항목 | 상태 | 근거 |
| --- | --- | --- |
| `광폭` 제외 | 완료 | PRD, wireframe, mapping에 제외 필드로 표기 |
| `도착` 제외 | 완료 | 운송구간 중복 항목으로 분리 |
| 운송 조건 재정의 | 완료 | `톤수`, `차종`, `대수`, `실중량` 기준 |
| `실중량` 추가 | 완료 | 대수 오른쪽에 0.00 단위 입력창 배치, 톤수 110% 자동 입력 규칙 반영 |
| `품목` row 이동 | 완료 | F안 기준 `운송+품목` 박스 2번째 row로 반영 |
| 금액 조건 재정의 | 완료 | `결제방법`, `청구비용`, `운송비용`, `수수료`, `수익/차주운임` 기준 |
| 청구비용 자동 입력 규칙 | 완료 | `청구비용` 입력 시 `운송비용` 자동 입력 |
| 운송비용 수정 규칙 | 완료 | `청구비용` 유지, `운송비용`만 수정 |
| 수수료 자동 선착불 규칙 | 완료 | `수수료` 입력 시 자동 선착불, 청구비용 0원, 운송비용 포커스 |
| 컴포넌트 위치 고정 | 완료 | 인수증/선착불 동일 위치 기준 |
| HTML variants 생성 | 완료 | `cargo-transport-section-variants.html` 신규 생성 |
| 운송구간 D안 컨셉 정렬 | 완료 | 종이 배경, 손글씨 폰트, 얇은 라인을 유지하고 항상 노출 row로 재작성 |
| inline edit 기획 | 완료 | `07-inline-edit-interaction-plan.md` 신규 작성 |
| inline edit HTML 반영 | 완료 | 클릭/Enter 진입, Enter/blur 저장, Esc 취소 샘플 구현 |
| 값 없음 활성화 전환 기획 | 완료 | `08-empty-state-activation-transition.md` 신규 작성 |
| CTA 흡수 전환 HTML 반영 | 완료 | 입력 CTA가 대상 라벨로 이동 후 다이얼로그를 열고 적용 후 row 전환 |
| CTA 흡수 전환값 확정 | 완료 | B 통합본 cargo 전용 버튼 이동 `340ms`, 적용 후 row reveal `140ms`, 라벨 접촉 여백 `4px` 기준 |
| B 통합본 화물 운송정보 반영 | 완료 | 기존 `광폭`, `도착` 중복 row를 제거하고 F안 `운송+품목`/`금액` CTA 전환, 금액 조건 분리, 품목 2행 row 반영 |
| CTA 전환 blur 수정 | 완료 | 결과 row animation을 제거해 손글씨 폰트가 뿌옇게 보이는 현상 완화 |
| B 통합본 밀도 조정 | 완료 | row padding, label/value 크기, 필드 폭, cargo 전용 CTA 흡수 속도, 적용 후 reveal을 조정 |
| B 통합본 최종 UI 계약 문서화 | 완료 | 입력 전/적용 후 row 높이, 보조 chip 강도, 결과 강조, dialog 닫힘 기준 반영 |
| 최종 채택 기준 문서화 | 완료 | F안 단독 HTML은 reference, B 통합본은 실제 구현 기준으로 분리 |
| 화물정보 요약 데이터 연결 | 완료 | `11-summary-data-connection.md`로 `품목`, `실중량`, `톤수`, `차종`, `대수`의 요약 전달 기준 정리 |

## 피드백 결과

| ID | 피드백 | Severity | Confidence | Action | 결과 |
| --- | --- | --- | --- | --- | --- |
| `CT-FB-007` | `광폭`을 기준 필드에 남기면 이번 정리 기준과 맞지 않음 | medium | confirmed | auto-fixed | 제외 필드로 이동 |
| `CT-FB-008` | `도착`은 운송구간과 중복되어 화물 운송정보에 남기면 반복됨 | high | confirmed | auto-fixed | 기준 필드에서 제외 |
| `CT-FB-009` | `청구비용`보다 다른 금액 필드가 먼저 오면 화주 청구 흐름이 흐려짐 | medium | confirmed | auto-fixed | 금액 조건 첫 필드로 고정 |
| `CT-FB-010` | `합계` 명칭은 조건별 계산 의미를 설명하지 못함 | medium | confirmed | auto-fixed | `수익/차주운임`으로 변경 |
| `CT-FB-011` | 수수료를 항상 표시하면 인수증 조건에서 혼동됨 | high | confirmed | auto-fixed | 조건부 표시로 정리 |
| `CT-FB-012` | 결제방법별로 필드 위치가 움직이면 사용자가 비교하기 어려움 | high | confirmed | auto-fixed | 동일 컴포넌트 위치 유지 기준 반영 |
| `CT-FB-013` | `품목`을 운송 조건 row에 두면 row가 길어지고 설명성 텍스트가 좁아짐 | medium | confirmed | auto-fixed | F안에서 `운송+품목` 박스 2번째 row로 이동 |
| `CT-FB-014` | 금액 조건에 `결제방법`이 빠지면 인수증/선불/착불/선착불 계산 흐름을 제어할 수 없음 | high | confirmed | auto-fixed | 금액 조건에 `결제방법` 추가 |
| `CT-FB-015` | B Original Tone 스타일로 가면 운송구간 D안과 컨셉이 달라져 섹션 간 연결감이 깨짐 | high | confirmed | auto-fixed | `transport-route-d-workflow.html` 컨셉으로 HTML 재작성 |
| `CT-FB-016` | 인수증 상태에서 `차주운임` 라벨을 쓰면 실제 의미가 수익인데 차주에게 줄 금액처럼 보일 수 있음 | high | confirmed | auto-fixed | 인수증은 `수익`, 선착불은 `차주운임`으로 분리 |
| `CT-FB-017` | 실중량이 화물 운송정보 안에 없으면 톤수 110% 계산값을 수정할 위치가 불명확함 | medium | confirmed | auto-fixed | 운송 조건 row에 `실중량` 입력 추가 |
| `CT-FB-018` | 화물 운송정보는 숨길 보조 정보가 적어 펼침 구조가 오히려 조작 부담을 늘림 | medium | confirmed | auto-fixed | `details/summary` 제거, 항상 노출 compact row로 변경 |
| `CT-FB-019` | 입력값을 항상 input으로 노출하면 화면 밀도가 높아지고 읽기성이 떨어질 수 있음 | medium | confirmed | auto-fixed | 기본은 라벨, 클릭 시 inline edit로 전환하는 기준 문서화 |
| `CT-FB-020` | label-to-input 전환 시 row 높이가 흔들리면 명세표 스캔성이 떨어짐 | medium | confirmed | auto-fixed | `.edit-cell` 최소 높이와 `.edit-control` 높이를 고정해 같은 자리 전환으로 구현 |
| `CT-FB-021` | 값 없음 상태에서 row가 갑자기 바뀌면 사용자가 어떤 영역이 활성화됐는지 놓칠 수 있음 | medium | confirmed | auto-fixed | 입력 CTA가 대상 라벨에 닿아 흡수되는 전환과 다이얼로그 적용 흐름으로 문서화 및 HTML 반영 |
| `CT-FB-022` | B 통합본에 예전 `광폭`, `도착`, `운송료/합계` 구조가 남으면 확정 패턴과 충돌함 | high | confirmed | auto-fixed | B 통합본 `3. 화물 운송정보`를 F안 `운송+품목` CTA 전환, 청구/운송 금액 분리 구조로 교체 |
| `CT-FB-023` | reveal animation이 남아 있으면 손글씨 폰트가 뿌옇게 보일 수 있음 | medium | confirmed | auto-fixed | 결과 row에는 animation을 적용하지 않고 버튼 슬라이딩 후 즉시 표시 |
| `CT-FB-024` | 금액/품목만 즉시 노출되면 값 없음 상태의 진입 패턴이 운송 조건과 달라짐 | medium | confirmed | auto-fixed | B 통합본에 `운송+품목 입력`, `금액 조건 선택` CTA 전환 추가 |
| `CT-FB-025` | F안 반영 후 빈 row와 적용 후 row가 설명적으로 보이면 B 통합본 전체 밀도가 무거워짐 | medium | confirmed | auto-fixed | 보조 chip 체감은 낮추고, row padding/필드 폭/CTA 속도를 조정 |
| `CT-FB-026` | animationend와 fallback timer가 모두 실행되면 적용 후 다이얼로그가 다시 열릴 수 있음 | high | confirmed | auto-fixed | 완료 이벤트를 1회만 처리하고 dialog 닫힘 상태를 보강 |
| `CT-FB-027` | 입력 전 보조 chip이 CTA와 같은 무게로 보이면 사용자가 주 액션을 놓칠 수 있음 | medium | confirmed | auto-fixed | 입력 전 chip을 dashed muted 스타일로 낮춤 |
| `CT-FB-028` | `품목`, `실중량`, `톤수`, `차종`이 요약 문장으로 어떻게 전달되는지 불명확하면 3번과 4번 섹션 책임이 섞일 수 있음 | medium | confirmed | auto-fixed | `11-summary-data-connection.md`와 요약 데이터 계약 문서로 source of truth와 override 정책 정리 |

## 남은 리스크

| 리스크 | 수준 | 대응 |
| --- | --- | --- |
| `수익/차주운임` 라벨이 조건별로 바뀌어 사용자가 위치를 놓칠 수 있음 | medium | 같은 위치에 두고 라벨만 변경했으며 사용자 시각 검토 필요 |
| `수수료` 숨김과 비활성 중 어느 방식이 더 좋은지 미확정 | medium | HTML variants에서는 비활성/미표시 표현으로 비교 가능하게 둠 |
| `운송 상품`의 최종 위치가 아직 확정되지 않음 | medium | 다음 variants 단계에서 보조 필드 또는 제외 결정 |
| `품목`이 금액 필드처럼 보일 수 있음 | low | B 통합본에서는 `운송+품목` 2행 안에 배치해 금액 row와 분리 |
| `결제방법` 배치가 금액 입력 첫 필드 기준과 충돌해 보일 수 있음 | medium | HTML variants에서 selector와 금액 입력 필드를 분리했으며 화면 검토 필요 |
| 라벨에서 input/select로 전환될 때 row 높이가 흔들릴 수 있음 | low | HTML에 최소 높이를 고정했으나 실제 브라우저 시각 확인 필요 |
| CTA 흡수 전환의 이동 거리가 과하면 장식처럼 보일 수 있음 | low | B 통합본 cargo 전용 전환을 `340ms`로 줄이고 축소감을 완화 |
| B 통합본에서 값 있음 상태와 값 없음 전환 상태를 같은 섹션에서 어떻게 병행할지 추가 판단 필요 | low | 입력 전/적용 후 최종 UI 계약을 문서화했으며 실제 데이터 연동 시 기본 상태만 재확인 필요 |
| validation message와 `자동/수정됨` chip은 아직 미정 | low | 사용자가 후속 단계로 미루기로 결정. 데이터 상태값은 `auto`, `overridden`, `stale`로 먼저 정리 |

## 검증 checklist

| 확인 항목 | 결과 |
| --- | --- |
| 기준 운송 조건 4개 반영 | 통과 |
| `실중량` 110% 자동 입력/수정 가능 반영 | 통과 |
| `품목` 2행 row 반영 | 통과 |
| `결제방법` 금액 조건 반영 | 통과 |
| `광폭`, `도착` 제외 기준 반영 | 통과 |
| `청구비용` 첫 배치 반영 | 통과 |
| `운송비용` 자동 입력/수정 규칙 반영 | 통과 |
| `수수료` 자동 선착불 규칙 반영 | 통과 |
| 인수증 `수익`, 선착불 `차주운임` 라벨 반영 | 통과 |
| HTML variants 생성 | 통과 |
| 운송구간 D안 컨셉 정렬 | 통과 |
| 펼침 구조 제거 | 통과 |
| inline edit 기획 문서 생성 | 통과 |
| inline edit HTML 반영 | 통과 |
| 값 없음 활성화 전환 기획 문서 생성 | 통과 |
| CTA 흡수 전환 HTML 반영 | 통과 |
| CTA 흡수 전환값 문서화 | 통과 |
| B 통합본 화물 운송정보 반영 | 통과 |
| CTA 전환 blur 수정 | 통과 |
| `운송+품목`/`금액` CTA 전환 반영 | 통과 |
| B 통합본 밀도 조정 | 통과 |
| B 통합본 입력 전/적용 후 최종 UI 계약 문서화 | 통과 |
| 다이얼로그 닫힘과 animation 중복 실행 방지 기준 반영 | 통과 |
| F안/B 통합본 최종 채택 기준 문서화 | 통과 |
| `4. 화물정보 요약` 데이터 연결 규칙 문서화 | 통과 |
| B 통합본 요약 자동 갱신 샘플 | 통과 |
| 브라우저 프리뷰 | 통과 |
| 삭제 작업 미수행 | 통과 |

브라우저 프리뷰는 in-app browser의 `localhost` 경로에서 B 통합본을 열어 확인했습니다. `운송+품목 입력`, `금액 조건 선택` CTA 클릭, 다이얼로그 open/apply/close, 적용 후 row 활성화, 요약 자동 갱신, 수동 요약 후 `stale` 전환, 콘솔 오류 없음까지 확인했습니다.

## 다음 단계 제안

1. validation message와 `자동/수정됨` chip은 후속 단계에서 결정합니다.
2. 차종 축약어와 일정 토큰의 운영 표기를 확정합니다.
3. 실제 개발 단계에서 B 통합본 기준을 컴포넌트 구현 스펙으로 변환합니다.
