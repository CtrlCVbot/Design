# 그룹 3-1 화주/담당자 컴포넌트 기획

## 배경

`그룹 3-1. 화주 정보`는 단순히 화주를 선택하고 `화주 정보에 적용`을 누르는 단계가 아닙니다. 실제 wizard 화면에는 화주와 담당자를 함께 찾고, 선택한 조합을 확인하고, 필요한 경우 담당자를 추가 등록하는 컴포넌트가 포함됩니다.

따라서 screenmap에서는 이 단계를 아래 6개 part로 나눠 설명합니다.

세분화, dialog 직접 open, 같은 node 내 part 이동 안정화 기준은 `12-group-3-screenmap-pattern-template.md`를 따릅니다.

## 구성 Part

| Part | 컴포넌트 | 역할 | 사용자 판단 |
| --- | --- | --- | --- |
| `shipper-search` | 화주/담당자 통합 조회 | 업체명, 사업자번호, 담당자명, 연락처 기준으로 후보를 찾습니다 | 어떤 기준으로 검색했는지 확인 |
| `shipper-result-select` | 결과 row 선택 | 화주 업체와 담당자 조합을 한 row에서 선택합니다 | row 클릭은 즉시 적용이 아니라 선택 상태 변경 |
| `shipper-selected-preview` | 선택 정보 preview | 적용 전 업체명, 사업자번호, 담당자, 연락처, 이메일, 역할을 확인합니다 | 선택 row와 preview가 같은 사람인지 확인 |
| `shipper-contact-add` | 담당자 추가 등록 | 선택한 화주에 새 담당자와 역할을 추가합니다 | 중복 등록 여부와 역할 범위 확인 |
| `shipper-complete` | 화주 정보 적용 | 선택된 화주/담당자 조합을 wizard draft에 반영합니다 | 적용 후 다음 단계로 이동 가능한지 확인 |
| `load-step` | 상차지 단계 표시 | 상차지 step이 current 상태로 바뀝니다 | 화주 정보 단계가 완료됐는지 확인 |

## 화면 설명 기준

왼쪽 결과 목록과 오른쪽 preview는 서로 다른 책임을 가집니다.

| 영역 | 설명 책임 |
| --- | --- |
| 조회 영역 | 검색 조건 입력과 조회 실행 |
| 결과 목록 | 후보 비교, row 선택, 현재 선택 row 표시 |
| 선택 정보 preview | 적용 전 최종 확인, 연락처/이메일/역할 검증 |
| 담당자 추가 카드 | 기존 후보에 없는 담당자 등록, 역할 선택 |
| footer 적용 버튼 | 선택 값을 wizard draft로 확정 |

## Data Contract

| Contract | 포함 정보 | 비고 |
| --- | --- | --- |
| `Requester` | 화주 업체명, 사업자번호, 업체 유형 | 업체 단위 식별 |
| `ContactPerson` | 담당자명, 연락처, 이메일, 역할, 대표 여부 | 사람 단위 선택/추가 등록 |
| `CargoMemo` | 화주 선택 후 보조 정보 메모 표시 | 선택 이후 보조 정보 연동 |

## Validation

| 항목 | 기준 |
| --- | --- |
| 화주 선택 | `Requester`가 선택되어야 합니다 |
| 담당자 선택 | 담당자명과 연락처 중 운영 필수값을 충족해야 합니다 |
| 선택/preview 동기화 | 결과 row와 우측 preview의 업체/담당자가 같아야 합니다 |
| 담당자 추가 | 신규 담당자는 이름, 연락처, 역할을 갖고 중복 등록 정책을 따라야 합니다 |
| 적용 | 적용 버튼 이후 상차지 step으로 이동해야 합니다 |

## 정책 보류

실제 API endpoint는 이 문서 범위에서 다루지 않습니다. 다만 구현 전 아래 정책은 확정되어야 합니다.

| Backlog | 결정 필요 |
| --- | --- |
| `P0-CONTACT-MASTER-POLICY` | 담당자 마스터 등록 범위, 중복 판단, 수정 권한 |
| `P0-PRIVACY` | 담당자명, 연락처, 이메일의 표시/마스킹 기준 |
| `P0-VALIDATION` | 담당자 추가 등록 시 필수 필드와 역할 선택 규칙 |

## Screenmap 반영

| 영역 | 반영 |
| --- | --- |
| 왼쪽 user flow | `그룹 3-1. 화주 정보` node 유지 |
| 중앙 preview | 6개 part marker로 조회, 선택, preview, 추가 등록, 적용, 다음 단계 표시 |
| 오른쪽 panel | `Requester`, `ContactPerson`, `CargoMemo`와 backlog를 표시 |
| source link | `sections/shipper-info/README.md`, `02-wireframe-shipper-info.md` 연결 |
