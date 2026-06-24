# 차주용 앱 Open Questions, Assumptions, Self-review

## 1. 주요 가정

| 가정 | 영향 |
| --- | --- |
| 차주 앱 MVP는 이미 배차된 화물의 운행 관리가 중심이다. | 신규 화물 검색/수락 기능은 MVP 핵심에서 제외된다. |
| 관리자 시스템에서 `DriverAssignment`가 확정된 후 차주 앱에 배차가 노출된다. | 배차 노출 조건과 권한 판단이 단순해진다. |
| 차주는 정산/송금 상태를 조회만 하고 직접 확정하지 않는다. | 정산 확정 권한은 주선사용 시스템에 남는다. |
| MVP에서는 차주가 `상차완료`, `하차완료`를 직접 등록한다. | 하차 담당자 링크 없이도 상태 공유와 실무 확인 속도를 우선 확보한다. |
| 하차 담당자 확인 링크와 모바일 서명 페이지는 Phase 2로 분리한다. | 인수증 대체/보조 증빙은 다음 단계에서 별도 유저플로우와 와이어프레임으로 다룬다. |
| 이번 단계는 API/백엔드 설계보다 기능, UI/UX, 유저플로우, 와이어프레임 정리에 집중한다. | 기술 계약은 후속 구현 단계에서 다룬다. |

## 2. 정책 결정 사항

| 항목 | 결정 | 우선순위 | 메모 |
| --- | --- | --- | --- |
| MVP 상태 변경 | 차주가 `상차완료`, `하차완료`를 직접 등록한다. | P0 | 하차완료 후 주선사가 특이사항을 확인해 운행완료/정산 가능 여부를 판단 |
| 하차 담당자 링크 범위 | 하차 담당자 확인 링크, 모바일 서명, 인증 미확보 표시는 MVP에서 제외한다. | P0 | 다음 단계 Phase 2로 정리 |
| 하차 확인 목적 | 인수증 대체와 운행완료 보조 확인을 모두 목표로 한다. | Phase 2 | 법적 완결성보다 실무 확인과 빠른 송금 판단을 우선한다. |
| 확인 방식 | 하차 담당자 서명 기반으로 간다. | Phase 2 | 확인 버튼만으로는 부족하다고 판단 |
| 링크 만료 | 하차 시 확인을 기본으로 하되 24시간 유효하게 둔다. | Phase 2 | 미확인 시 인증 미확보 표시 |
| 담당자 연락처 | 주선사가 보유하면 자동 입력, 없으면 차주가 입력한다. | Phase 2 | 수동 입력 연락처는 신뢰 보강 필요 |
| 수동 연락처 리스크 | 기존 화주용 서비스에서 화주 배차담당자가 확인해 최종 신뢰를 보강한다. | Phase 2 | 화주용 서비스 상세 기획은 후속 범위 |
| 미확인 처리 | 배차 상태와 별도로 `하차담당자 인증 미확보`를 표시한다. | Phase 2 | 하차 담당자가 확인하지 않아도 상태 이력은 남김 |
| 특이사항 | 파손/수량 차이/하차 이슈는 보류 또는 관리자 검토로 보낸다. | P0 | 자동 운행완료 차단 |
| 재발송 | 차주와 배차 담당자가 재발송할 수 있고 이력을 저장한다. | Phase 2 | 남용 방지는 추후 횟수/쿨다운으로 보강 |

## 2.1 남은 정책 질문

| 항목 | 질문 | 우선순위 | 미결정 시 영향 |
| --- | --- | --- | --- |
| 서명 실무 효력 | 모바일 서명이 송금 판단을 얼마나 빠르게 해줄 수 있는가? | Phase 2 | MVP 이후 확인 링크 기획에서 다룸 |
| 화주용 서비스 확인 | 기존 화주용 서비스에 어떤 확인 플로우를 추가할 것인가? | Later | 지금은 차주 앱 기획 범위 밖. 후속 화주용 서비스 기획에서 다룸 |
| 사진 증빙 | 상차/하차 사진을 필수로 할 것인가? | P1 | 현장 입력 부담과 증빙력 trade-off |
| 위치 기록 | 상태 변경 시 위치를 수집할 것인가? | P1 | 개인정보 동의와 운영 신뢰 이슈 |
| 정산 표시 | 차주에게 조정금 상세를 어디까지 보여줄 것인가? | P0 | 금액 이견/민감 정보 노출 |
| 송금 계좌 | 차주 앱에서 계좌 정보를 보여줄 것인가? | P1 | 개인정보/보안 관리 필요 |
| 배차 취소 | 배차 후 차주가 취소 요청할 수 있는가? | P1 | 운영자 승인 흐름 필요 |

## 3. 기존 문서와의 충돌/확인 필요

| 항목 | 현재 문서 기준 | 차주 앱 기획에서 필요한 보강 |
| --- | --- | --- |
| 관리자 `new-*` 상태 | 등록 화면 내부 상태 중심 | 차주 운송 상태(`assigned`, `pickup_done`, `operation_completed`) 별도 정의 필요 |
| 차주 정보 선택 | 신규 접수에서는 선택 단계 | 차주 앱 노출은 차주 확정 후여야 함 |
| 정산 정보 | 관리자 금액 입력/금액 로그 중심 | 차주 앱은 운임/송금 조회와 정산 문의 중심 |
| `SettlementDocument` | 인수증/세금계산서/위탁증 상태만 모델링 | MVP는 송금/정산 조회 중심. 하차 확인 링크 결과와 전자 인수 확인 기록은 Phase 2 |
| 배차 담당자 | header chip 표시 중심 | 차주 앱 상세에서는 연락/문의 동선 필요 |
| 현재 차주 앱 초안 | 검색/배차받기 UI가 포함됨 | MVP는 배차받은 내역 관리와 운행 상태 처리 중심으로 재구성 필요 |
| 화주용 서비스 | 이미 별도 서비스가 존재함 | 지금은 상세 기획하지 않고, 수동 입력 연락처 확인이 필요하다는 연결 지점만 남김 |

## 4. 권장 추가 데이터 필드

| 모델 후보 | 필드 | 이유 |
| --- | --- | --- |
| `DriverProgressEvent` | `eventId`, `orderId`, `driverId`, `status`, `createdAt`, `lat`, `lng`, `photoUrls`, `memo` | 차주 상태 변경 이력 |
| `SettlementStatus` | `orderId`, `status`, `expectedAmount`, `paidAmount`, `paidAt`, `holdReason` | 차주 정산/송금 조회 |
| `IssueReport` | `issueId`, `orderId`, `type`, `memo`, `photoUrls`, `reportedBy`, `status` | 특이사항 보류 처리 |
| `DeliveryConfirmation` | `confirmationId`, `orderId`, `receiverName`, `receiverPhone`, `confirmedAt`, `method`, `signatureUrl`, `contactSource`, `note` | Phase 2 하차 담당자 확인 기록 |
| `ConfirmationLink` | `linkId`, `orderId`, `targetPhone`, `contactSource`, `expiresAt`, `usedAt`, `status`, `sendCount` | Phase 2 링크 보안/재발송 관리 |
| `ShipperDeliveryVerification` | `verificationId`, `orderId`, `shipperDispatcherId`, `verifiedAt`, `result`, `memo` | Phase 2 화주 배차담당자 최종 확인 |

## 5. Self-review 결과

| 검토 항목 | 상태 | 메모 |
| --- | --- | --- |
| 기존 문서 분석 근거 | 완료 | `01-final-prd.md`, `03-implementation-handoff.md`, `06-final-baseline-data.md`, `data/final-baseline.json`, `driver-info` 문서를 근거로 사용 |
| 차주 앱 초안 반영 | 완료 | `publishing`의 `home/results/ticket` 구조와 스크린샷을 업무 화면으로 재해석 |
| 핵심 화면 목록 | 완료 | MVP는 목록, 상세, 운행 내역, 정산 상세 중심. 확인 링크는 Phase 2로 분리 |
| 상태 흐름 | 완료 | Mermaid 상태 흐름과 상태별 버튼 정책 작성 |
| 하차 확인 정책 | 완료 | MVP에서는 제외하고 Phase 2 정책으로 분리. 인수증 대체+보조 확인, 서명 필수, 24시간 만료, 연락처 자동/수동 입력은 후속 기획 기준으로 보관 |
| 정산/송금 흐름 | 완료 | 차주는 조회 중심, 주선사가 확정/송금하는 구조로 분리 |
| 신규 아이디어 backlog | 완료 | MVP/Phase 2/Later 우선순위로 분류 |
| 기존 문서 수정 방지 | 완료 | 신규 `planning` 문서만 추가 |

## 6. 피드백 반영 결과

| 항목 | Severity | Confidence | Action | 반영 내용 |
| --- | --- | --- | --- | --- |
| 관리자 상태와 차주 운송 상태 혼동 가능성 | high | confirmed | auto-fixed | 별도 차주 앱 상태 흐름과 매핑 표를 추가 |
| 하차 담당자 확인 링크 보안 누락 위험 | high | likely | scope-changed | MVP 제외 후 Phase 2 정책으로 보관. 1회성, 만료, 본인 확인, 기록 보관은 후속 기획에서 다룸 |
| 수동 입력 연락처 악용 가능성 | high | confirmed | scope-changed | MVP 제외 후 Phase 2에서 기존 화주용 서비스의 후속 확인 기능으로 신뢰 보강 |
| 하차 담당자 미서명 시 상태 혼동 가능성 | medium | confirmed | scope-changed | MVP 제외 후 Phase 2 확인 상태 모델에서 `하차담당자 인증 미확보` 표시를 다룸 |
| 다음 단계가 API/백엔드로 치우칠 가능성 | medium | confirmed | auto-fixed | 후속 작업을 기능, UI/UX, 유저플로우, 와이어프레임 중심으로 재정렬 |
| 정산 권한 오해 가능성 | medium | confirmed | auto-fixed | 차주는 조회 중심, 확정은 주선사용 시스템 권한으로 분리 |
| 디자인 초안의 여행 앱 템플릿 문구 혼재 | medium | confirmed | auto-fixed | 구조만 참고하고 도메인 문구/기능은 화물 업무 기준으로 재정의 |
| 산출물 근거 추적 부족 가능성 | medium | likely | auto-fixed | 분석 문서에 source reference 표 추가 |
| MVP 범위가 하차 담당자 링크까지 넓어지는 문제 | high | confirmed | auto-fixed | 하차 담당자 링크/서명/화주 확인 보강은 Phase 2로 내리고 MVP는 상차완료/하차완료 직접 상태 변경으로 단순화 |
| backlog Phase 분류와 roadmap Phase 분류 불일치 | high | confirmed | auto-fixed | `03` backlog를 `05` roadmap 기준으로 MVP, Phase 2, Phase 3, Phase 4, Later로 재정렬 |
| Phase 1 범위가 한 번에 커질 가능성 | medium | confirmed | auto-fixed | `05` roadmap에 Phase 1A 운행 수행, Phase 1B 운행/정산 조회, Phase 1C 예외 처리 실행 단위 추가 |

## 7. 남은 리스크

| 리스크 | 수준 | 대응 |
| --- | --- | --- |
| 하차 확인 서명이 종이 인수증을 완전히 대체하는 법적 범위는 미확정 | low | MVP 제외. Phase 2에서 실무 확인과 송금 속도 개선 관점으로 재검토 |
| 화주용 서비스 확인 화면 상세는 아직 정의하지 않음 | low | MVP 제외. 이미 서비스가 있으므로 후속 화주용 서비스 기획에서 추가 |
| 송금/정산 데이터의 실제 확정 단위는 아직 미확정 | medium | 이번 단계에서는 차주가 이해할 UI 상태와 문구 중심으로 정리 |
| 차주 앱 인증/계정 구조가 아직 정의되지 않음 | medium | 차주 전화번호, 차량번호, 사업자번호 기준 로그인 정책 필요 |
| 현재 디자인 초안 텍스트 일부가 템플릿/깨진 문자열 상태 | low | 후속 디자인 단계에서 도메인 문구로 재작성 필요 |

## 8. 다음 단계

1. `05-epic-phase-roadmap.md`를 기준으로 Phase 1 MVP PRD를 작성한다.
2. Phase 1A 운행 수행 범위로 `내 배차 목록`, `배차 상세`, `상차완료`, `하차완료`, 상태 타임라인을 먼저 정리한다.
3. Phase 1B 운행/정산 조회 범위로 운행 내역과 정산/송금 확인 화면의 UI 상태값과 문구를 정리한다.
4. Phase 1C 예외 처리 범위로 특이사항 보고, 보류 상태, 담당자 문의 flow를 정리한다.
5. Phase 2에서 하차 담당자 확인 링크, 모바일 서명, 화주 확인 보강 플로우를 별도 유저플로우로 정리한다.
