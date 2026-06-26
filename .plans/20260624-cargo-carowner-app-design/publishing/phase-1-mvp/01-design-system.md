# Phase 1 MVP Design System

## 1. Visual Thesis

현장 차주가 한 손으로 배차 확인증을 넘기듯 확인하는 모바일 업무 앱이다. 3차 퍼블리싱의 티켓형 카드, 절제된 블루 액션, 상태 badge, 아이폰 프레임 감각은 유지한다.

## 2. Layout Foundation

| 항목 | 기준 |
| --- | --- |
| 기준 화면 | 모바일 390px 폭 중심 |
| 앱 프레임 | 둥근 모바일 디바이스 프레임 안에 앱 화면을 배치 |
| 화면 배경 | 외부 배경은 옅은 블루 그레이, 앱 내부는 `#f6f8fb` |
| 콘텐츠 구조 | 상단 헤더, 스크롤 본문, 하단 3탭 |
| 하단 탭 | `내 배차`, `운행 내역`, `정산` |
| 카드 반경 | 주요 카드 14~18px, 버튼 11~12px, badge pill |
| 그림자 | 카드 그림자는 유지하되 과하게 진한 장식 효과는 줄인다 |

## 3. Color Tokens

| Token | Value | 용도 |
| --- | --- | --- |
| `--color-primary` | `#1668e8` | 주요 CTA, 선택 chip, 진행 라인 |
| `--color-primary-strong` | `#0c4bc6` | 활성 탭, primary text accent |
| `--color-success` | `#0d8a5b` | 하차완료, 운행완료, 송금완료 |
| `--color-warning` | `#a86500` | 정산대기, 송금 예정 |
| `--color-danger` | `#c44032` | 보류, 특이사항, 오류 |
| `--color-text` | `#172033` | 본문 핵심 텍스트 |
| `--color-muted` | `#657084` | 보조 텍스트 |
| `--color-subtle` | `#8993a5` | 라벨, 힌트 |
| `--color-border` | `#e3e8f0` | 구분선, 카드 border |
| `--color-surface` | `#ffffff` | 카드/탭 배경 |
| `--color-app-bg` | `#f6f8fb` | 앱 내부 배경 |
| `--color-page-bg` | `#e8eef8` | 외부 프레임 배경 |

## 4. Typography

| 항목 | 기준 |
| --- | --- |
| 기본 서체 | `Pretendard`, system-ui, sans-serif |
| 숫자 보조 | `Outfit` 사용 가능. 금액/거리/큰 숫자에 제한적으로 사용 |
| 화면 제목 | 20~24px, 800~900 |
| 카드 제목 | 16~18px, 800 |
| 본문 | 13~15px, 600~700 |
| 라벨/메타 | 11~13px, 700~800 |
| 버튼 | 14~15px, 800 |

## 5. Status Badge

| 상태값 | 표시 문구 | Tone | 배경/글자 |
| --- | --- | --- | --- |
| `assigned` | 배차됨 | neutral | `#eef2f7` / `#657084` |
| `driver_confirmed` | 운행 준비 | ready | `#eaf2ff` / `#0c4bc6` |
| `pickup_done` | 상차완료 | progress | `#eaf2ff` / `#0c4bc6` |
| `dropoff_done` | 하차완료 | success | `#e7f7ef` / `#0d8a5b` |
| `operation_completed` | 운행완료 | success | `#e7f7ef` / `#0d8a5b` |
| `settlement_pending` | 정산대기 | pending | `#fff8ec` / `#a86500` |
| `paid` | 송금완료 | paid | `#e7f7ef` / `#0d8a5b` |
| `issue_hold` | 보류 | hold | `#ffece9` / `#c44032` |

## 6. Core Components

| Component | 기준 |
| --- | --- |
| App Header | 현재 화면 제목, 날짜/상태 요약, 뒤로가기 필요 시 좌측 아이콘 |
| Bottom Nav | 3개 탭 고정. 활성 탭은 옅은 블루 배경과 primary text |
| Filter Chips | pill 형태, 선택 상태는 primary fill |
| Dispatch Ticket Card | 회사명, 상태 badge, 상차/하차 구간, 시간, 화물, 배차금, 다음 CTA |
| Detail Section | 정보 그룹은 흰 카드 안에 배치하되 과도한 중첩 카드 금지 |
| Timeline | 운행 준비 -> 상차완료 -> 하차완료 -> 운행완료 순서 |
| Settlement Home Summary | 송금완료, 미정산, 보류 금액을 한 화면 상단에 표시 |
| Settlement Group Card | 송금 예정일 또는 상태별 묶음 단위로 건수와 금액 표시 |
| Settlement Detail | 배차금, 조정 요약, 송금금액, 송금일, 송금상태만 표시 |
| Issue Form | 유형 chip, 메모 textarea, 사진 첨부 optional, 제출 CTA |
| Modal | 상차완료/하차완료 확인 전용. 권한 안내 문구 포함 |
| Toast | 상태 변경, 문의 연결, 사진 첨부 안내 등 짧은 피드백 |

## 7. Interaction Rules

| 항목 | 기준 |
| --- | --- |
| CTA 우선순위 | 현재 상태에서 가능한 1차 액션만 강하게 표시 |
| 상차완료 | 운행 준비 상태에서만 primary CTA |
| 하차완료 | 상차완료 이후 success CTA |
| 운행완료 | 차주 앱에서 직접 변경하지 않음 |
| 정산 탭 | `SCR-008 정산 홈`으로 이동 |
| 정산 상세 | 운행 카드 또는 정산 묶음 선택 후 진입 |
| 보류 상태 | 문의 CTA와 사유 요약을 함께 표시 |
| 사진 첨부 | optional. 필수처럼 보이지 않게 처리 |

## 8. Copy Rules

| 상황 | 문구 기준 |
| --- | --- |
| 하차완료 안내 | "하차완료는 차주의 현장 완료 등록입니다." |
| 운행완료 안내 | "주선사 확인 후 운행완료/정산대기로 전환됩니다." |
| 정산 홈 안내 | "운행완료 또는 정산대기 건을 기준으로 미정산 금액을 표시합니다." |
| 송금일 미확정 | "송금일 확정 전" |
| 정산 정보 없음 | "선택한 기간의 정산 정보가 없습니다." |
| 특이사항 없음 | "보고된 특이사항이 없습니다." |

## 9. MVP Exclusions

아래 항목은 디자인 시스템에 포함하지 않는다.

| 제외 항목 | 사유 |
| --- | --- |
| 배차 검색/신규 오더 수락 | Phase 1은 이미 배차된 운행 수행과 조회가 목적 |
| 하차 담당자 확인 링크 | Phase 2 범위 |
| 모바일 서명 | Phase 2 범위 |
| `하차담당자 인증 미확보` badge | Phase 2 상태 모델 필요 |
| 내부 청구금/수수료/내부 메모 | 차주 노출 대상 아님 |
| 송금 계좌 표시 | 개인정보/금융정보 노출 리스크 |
