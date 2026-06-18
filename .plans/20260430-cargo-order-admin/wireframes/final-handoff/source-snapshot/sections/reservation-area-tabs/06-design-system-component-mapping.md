# 예약 영역 탭 shadcn 컴포넌트 매핑

## 목적

이 문서는 화면 노출명 `보조 정보`, 내부 작업명 `예약 영역` 3개 탭을 구현할 때 `Design System.html`의 shadcn 기준에서 어떤 토큰과 컴포넌트 패턴을 사용할지 정리한 매핑 문서입니다.

기준 파일은 아래 HTML입니다.

`C:\Work\Dev\Design\.plans\wireframes\cargo-order-admin-20260430\results\html\Design System.html`

이번 문서는 구현 파일을 수정하지 않습니다. 다음 구현자가 `예약 영역` placeholder를 탭 패널로 바꿀 때 새 시각 언어를 만들지 않고 `Design System.html`의 shadcn 기준을 그대로 사용할 수 있게 하는 것이 목표입니다.

## 적용 원칙

| 원칙 | 설명 |
| --- | --- |
| 새 토큰 금지 | 색상, 간격, radius, shadow는 `Design System.html`의 CSS token을 우선 사용합니다. |
| 운영 화면 밀도 유지 | 큰 hero, 마케팅형 문구, 장식형 카드 그리드는 사용하지 않습니다. |
| 기존 섹션 리듬 유지 | `ds-section`, `sec-head`, `sec-body`, `summary-row`의 32px 리듬을 우선합니다. |
| 상태는 chip/notice로 표현 | 성공, 경고, 오류, 대기 상태는 `chip`, `badge`, `notice` 계열로 표현합니다. |
| 직접 수정 책임 분리 | 지도/금액 로그 탭은 확인 중심이며, 주소와 금액 수정은 기존 입력 섹션으로 연결합니다. |
| 요약 우선 | 우측 패널 첫 화면은 compact 요약과 리스트 중심으로 구성하고, 작성/상세는 dialog 또는 펼침으로 분리합니다. |

## 공통 레이아웃 매핑

| 보조 정보 요소 | Design System 기준 | 적용 메모 |
| --- | --- | --- |
| 탭 패널 외곽 | `ds-section` | 우측 placeholder를 실제 section으로 승격할 때 사용 |
| 패널 헤더 | `sec-head`, `sec-head__title`, `sec-head__note` | 화면 제목은 `보조 정보`, note는 `메모 · 금액 · 지도` |
| 탭 목록 | `seg`, `seg__opt` 또는 `btn btn--secondary btn--sm` | 3개 탭은 같은 높이로 고정하고 선택 상태만 강조 |
| 탭 본문 | `sec-body` | 내부는 `summary-row`, `empty`, list item 조합 |
| 주요 액션 | `btn--primary`, `btn--secondary`, `btn--ghost` | 저장/추가만 primary, 이동/재조회는 secondary 또는 ghost |
| 위험 액션 | `btn--danger`, `notice--danger` | 예약 영역 자체에서는 위험 액션을 만들지 않는 것을 기본값으로 둠 |
| 상태 안내 | `notice`, `notice--info`, `notice--danger` | 오류나 정책 안내는 색상만 쓰지 않고 문구 포함 |
| 빈 상태 | `empty`, `empty__text` | 한 문장 안내와 1개 액션만 유지 |

## 토큰 매핑

| 용도 | 사용할 토큰 | 메모 |
| --- | --- | --- |
| 기본 배경 | `--surface` | 패널과 리스트 기본 표면 |
| 보조 배경 | `--surface-soft` | 탭 헤더, 지도 placeholder, 로그 receipt 배경 |
| 잠금/대기 표면 | `--surface-sunken` | 계산 대기, 정산 후 수정 제한 등 |
| 경계선 | `--border`, `--border-strong` | 탭 구분선, 리스트 구분선 |
| 주 액션 | `--brand-600`, `--brand-700` | primary 버튼 외 임의 사용 금지 |
| 정보 상태 | `--info-fg`, `--info-bg`, `--info-bd` | 경로 계산값, 자동 계산 안내 |
| 경고 상태 | `--warn-fg`, `--warn-bg`, `--warn-bd` | 주소 불완전, 정책 확인 필요 |
| 위험 상태 | `--danger-fg`, `--danger-bg`, `--danger-bd` | 조회 실패, 취소/정산 위험 안내 |
| 성공 상태 | `--success-fg`, `--success-bg`, `--success-bd` | 저장 완료, 계산 완료 |

## 탭별 컴포넌트 매핑

| 탭 | 영역 | Design System 기준 | 구현 방향 |
| --- | --- | --- | --- |
| `메모` | 메모 추가 dialog | `field`, `field__label`, `ctl`, `btn--primary`, dialog 패턴 | 탭 본문은 리스트만 두고, 유형 선택과 textarea는 dialog 안에 배치 |
| `메모` | 유형 표시 | `chip`, `chip--role` | `운영자 메모`, `고객 요청`, `배차 특이사항`을 chip으로 표시 |
| `메모` | 메모 item | `summary-row` 변형 | 본문, 작성자, 시각을 조밀한 리스트로 표시 |
| `메모` | 저장 실패 | `notice--danger` | 입력값 유지와 재시도 액션 제공 |
| `금액 로그` | 금액 명세 | `num`, `summary-row`, `badge`, `separator` 감각 | 기준금액, 조정금, 합계, 수익을 조밀한 명세로 표시 |
| `금액 로그` | 명세 내부 상세 row | `summary-row` 또는 inline receipt row | 조정 사유, 대상, +/- 금액, 담당자, 처리 시각, 설명을 하단 박스 없이 조밀하게 표시 |
| `금액 로그` | 정산 상태 | `badge`, `chip` | `정산 전`, `정산 처리됨`, `정산 보류`를 상태로 표시 |
| `금액 로그` | 정산 후 제한 | `notice`, `notice--danger` | 금액 수정 제한 안내를 명확히 표시 |
| `운송 구간 지도` | 경로 상태 | `chip chip--metric`, `notice--info` | 거리, 예상 시간, 경유 여부를 metric chip으로 표시 |
| `운송 구간 지도` | 지도 placeholder | `surface-soft`, `border`, `radius` 토큰 | 지도 API 전에는 정적 placeholder를 사용하고 과한 장식 금지 |
| `운송 구간 지도` | 주소 상태 | `chip`, `notice--info`, tooltip 감각 | 상차/하차 전체 주소를 하단 summary row로 반복하지 않고 핀/상태/기존 섹션 이동으로 처리 |
| `운송 구간 지도` | 주소 없음 | `empty` | 누락 주소와 이동 액션 1개 표시 |

## 탭 버튼 매핑

| 탭 | 기본 label | 선택 상태 | 보조 정보 |
| --- | --- | --- | --- |
| `메모` | `메모` | `seg__opt is-on` 또는 selected secondary button | 메모 수 badge 또는 chip |
| `금액 로그` | `금액 로그` | `seg__opt is-on` 또는 selected secondary button | 수익 또는 정산 상태 chip |
| `운송 구간 지도` | `운송 구간 지도` | `seg__opt is-on` 또는 selected secondary button | 경로 계산 상태 chip |

MVP에서는 `seg`를 우선 권장합니다. 3개 탭이 같은 그룹이라는 의미가 가장 분명하고, `Design System.html`의 결제방법 segment와 같은 조작 감각을 재사용할 수 있기 때문입니다.

## 상태별 컴포넌트 매핑

| 상태 | 공통 컴포넌트 | 탭별 예시 |
| --- | --- | --- |
| 빈 상태 | `empty` | 메모 없음, 금액 로그 없음, 운송 구간 계산 불가 |
| 로딩 상태 | `surface-soft` skeleton, `aria-busy` | 경로 계산 중, 목록 조회 중 |
| 오류 상태 | `notice--danger`, `btn--secondary btn--sm` | 다시 계산, 다시 불러오기 |
| 데이터 있음 | `summary-row`, `chip`, `badge` | 경로 메타, 메모 리스트, 금액 명세 |
| 정책 안내 | `notice`, `notice--info` | 예상 시간 기준, 정산 후 수정 제한 |

## Motion 및 Feedback 매핑

| 상황 | 적용 패턴 | 설명 |
| --- | --- | --- |
| 탭 전환 | 빠른 opacity/translate 또는 즉시 전환 | MVP에서는 과한 motion 없이 본문만 전환 |
| 새 메모 저장 | field flash | 새 item만 강조 |
| 조정금 반영 | field flash | 금액 명세 row 또는 최신 상세 item만 강조 |
| 경로 재계산 완료 | field flash | 거리/예상 시간 chip만 강조 |
| 오류 발생 | notice 표시 | 흔들림이나 layout shift 없이 안내 |
| reduced motion | animation 제거 | 상태 text와 chip 변경으로 의미 유지 |

## 금지 패턴

| 금지 | 이유 |
| --- | --- |
| 예약 영역 전용 신규 색상 팔레트 | 전체 HiFi 톤과 분리되어 보일 수 있음 |
| 지도 탭에서 주소 직접 편집 | 기존 `2. 운송 구간` 책임과 충돌 |
| 지도 탭 하단에 상차/하차 전체 주소 반복 | 기존 `2. 운송 구간`과 같은 정보를 중복 표시해 우측 패널이 무거워짐 |
| 금액 로그 탭에서 금액 직접 수정 | 기존 `금액 입력` 다이얼로그 책임과 충돌 |
| 금액 로그 첫 화면에 전체 변경 전/후 감사 로그 노출 | 운영자가 필요한 금액 명세보다 감사 상세가 먼저 보여 정보 밀도가 과해짐 |
| 메모 탭 본문에 상시 입력폼 노출 | 리스트 확인 화면을 무겁게 만들고 탭의 읽기 역할을 약화함 |
| 긴 설명문 중심 empty state | 운영자가 빠르게 스캔하기 어려움 |
| 카드 안에 또 카드 배치 | 우측 보조 패널이 과하게 무거워짐 |
| `화물맨` handoff motion 재사용 | 기존 결정상 화물맨 연동 전용 motion으로 분리 |

## 구현 전 체크리스트

| ID | 체크 |
| --- | --- |
| `DSM-AC-01` | `보조 정보` 탭 외곽은 `Design System.html`의 shadcn section 패턴을 따른다. |
| `DSM-AC-02` | 탭 선택 UI는 `seg` 또는 기존 `btn` 계열만 사용한다. |
| `DSM-AC-03` | 상태 표시는 `chip`, `badge`, `notice`, `empty` 중 하나로 매핑한다. |
| `DSM-AC-04` | 금액 숫자는 `num` 또는 `ctl--money` 감각으로 우측 정렬한다. |
| `DSM-AC-05` | 주소/금액 수정 책임은 기존 섹션으로 연결하고 `보조 정보`에서 직접 처리하지 않는다. |
| `DSM-AC-06` | 새 색상, 새 shadow, 새 radius token을 만들지 않는다. |
| `DSM-AC-07` | 메모 작성은 dialog, 금액 상세는 펼침 또는 dialog로 분리해 첫 화면 밀도를 낮춘다. |

## 다음 단계

1. `cargo-order-hifi-reservation-tabs-shadcn-20260616.html`을 기준으로 브라우저 QA를 진행합니다.
2. 후보 구현에서 `Design System.html`의 shadcn class와 token 재사용 여부를 확인합니다.
3. 구현 후 `DSM-AC-*`와 기존 `RAT/MAP/MEMO/AMT/STATE` acceptance criteria를 함께 검증합니다.
