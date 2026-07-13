# 추적성과 self-review

## 1. Figma 근거 추적

| Figma 요소 | 문서 반영 위치 | 반영 내용 |
| --- | --- | --- |
| `수출입 통합 (TO - BE)` 전체 화면 | `01-figma-source-analysis.md`, `02-process-prd.md` | 전체 TO-BE flow 기준 |
| 로그인/기초 데이터/업체 등록 | `02-process-prd.md`, `03-user-operation-flows.md` | 공통 진입 flow |
| 견적 문의, 비용 확인, 견적서 작성/공유 | `02-process-prd.md`, `03-user-operation-flows.md` | 견적-오더 전환 flow |
| `CI / PL 등록 Y/N` | `03-user-operation-flows.md`, `04-system-document-map.md` | 서류 등록 분기 |
| `B/L 입력` | `02-process-prd.md`, `03-user-operation-flows.md`, `04-system-document-map.md` | 수출/수입 공통 게이트 |
| `FCL 수출`, `LCL 수출`, `수입` | `03-user-operation-flows.md`, `04-system-document-map.md` | 분기별 운영 flow |
| `M/BL`, `H/BL`, 적하목록, EDI | `02-process-prd.md`, `03-user-operation-flows.md`, `04-system-document-map.md` | EDI 작업 묶음 |
| `오류 N`, `오류 Y`, `EDI 정정신고` | `03-user-operation-flows.md`, `05-open-questions-and-assumptions.md` | 오류 처리 UX |
| 선적완료/운송완료 | `03-user-operation-flows.md`, `04-system-document-map.md` | 정산 진입 이벤트 |
| 지출결의서, 해외 정산서, 화주 청구서, 세금계산서, 입금 확인 | `03-user-operation-flows.md`, `04-system-document-map.md` | 정산/청구/입금 flow |
| 노란 주석 `수입 플로우...` | `05-open-questions-and-assumptions.md` | `OQ-MM-001` |
| 노란 주석 `EDI 전송 / 확인 / 정정...` | `02-process-prd.md`, `05-open-questions-and-assumptions.md` | `REQ-MM-011`, `OQ-MM-002` |

## 2. 요구사항 추적

| 요구사항 | 근거 | 후속 산출물 후보 |
| --- | --- | --- |
| `REQ-MM-001` | 로그인, 기초 데이터 등록, 신규 업체/담당자 등록 | 거래처/담당자 화면 spec |
| `REQ-MM-002` | 견적 문의 `TOMS`, 메일 | 견적 접수 spec |
| `REQ-MM-003` | 비용 확인, 견적서 작성/공유 | 견적 상세 spec |
| `REQ-MM-004` | `CI / PL 등록 Y/N` | 오더/서류 상세 spec |
| `REQ-MM-005` | `B/L 입력` 다이아몬드 | `B/L` 입력 spec |
| `REQ-MM-006` | `FCL 수출` 선사 사이트 flow | 수출 `FCL` checklist |
| `REQ-MM-007` | `LCL 수출` 콘솔사 flow | 수출 `LCL` checklist |
| `REQ-MM-008` | 수입 flow 주석 | 수입 상세 보완 문서 |
| `REQ-MM-009` | `M/BL`, `H/BL`, 적하목록 | 적하목록 spec |
| `REQ-MM-010` | EDI 오류 `Y/N` | EDI 오류 처리 spec |
| `REQ-MM-011` | EDI 통합 처리 주석 | EDI 작업 큐 spec |
| `REQ-MM-012` | 선적완료/운송완료 분기 | 완료 이벤트 정책 |
| `REQ-MM-013` | 정산/청구/입금 flow | 정산 상세 spec |
| `REQ-MM-014` | 유니패스/트래킹 조회 주석 | 외부 조회 정책 |

## 3. Self-review

| 검토 항목 | 결과 | 메모 |
| --- | --- | --- |
| docs-only 범위 준수 | 통과 | 코드/설정/데이터 파일은 수정하지 않고 문서와 근거 이미지만 추가 |
| 기존 작업 보존 | 통과 | 기존 수정 중인 `.plans/20260624...`, `publishing`, `output/playwright` 파일은 건드리지 않음 |
| Figma 근거 명시 | 통과 | 직접 확인한 화면과 MCP 제한을 문서에 분리 |
| 시스템 경계 분리 | 통과 | `PMS`, `TOMS`, 다우, 선사 사이트, 콘솔사, `Ulogis`를 구분 |
| 수출/수입 분기 표현 | 통과 | `FCL`, `LCL`, 수입을 별도 flow로 분리 |
| 미결 질문 보존 | 통과 | Figma 노란 주석을 `OQ-MM-001`, `OQ-MM-002`로 보존 |
| 구현 과잉 방지 | 통과 | DB/API는 후보 수준으로만 정리 |
| 남은 검증 | 확인 필요 | 1차/2차 섹션 확대 확인은 Figma 호출 제한으로 미완료 |

## 4. 리스크

| 리스크 | 심각도 | 영향 | 대응 |
| --- | --- | --- | --- |
| 1차/2차 섹션 미확인 | Medium | TO-BE 통합본에 누락된 히스토리/결정 사유가 있을 수 있음 | Figma 호출 제한 해제 후 비교 문서 추가 |
| 수입 상세 공백 | Medium | 수입 `B/L` 이후 적하목록 전 단계가 누락될 수 있음 | `OQ-MM-001`을 담당자 확인 질문으로 승격 |
| `B/L` 유형 혼재 | Medium | 해상/항공/원본/서렌더 유형별 상태가 섞일 수 있음 | 유형별 필드 매트릭스 작성 |
| 외부 시스템 자동화 기대치 | Low | 초기 구현에서 자동 연동 범위를 과대평가할 수 있음 | MVP는 수동 상태/증빙 등록으로 제한 |
| 정산 완료 기준 미확정 | Medium | 실적정산 상태가 부정확해질 수 있음 | 정산 담당자와 완료 기준 확인 |

## 5. 후속 작업 제안

| 순서 | 작업 | 산출물 |
| --- | --- | --- |
| 1 | Figma `수출 1차/2차`, `수입 1차/2차` 확대 비교 | `07-version-diff.md` |
| 2 | 수입 `B/L` 이후 상세 flow 인터뷰 | `08-import-detail-flow.md` |
| 3 | EDI 작업 큐 상세 PRD | `09-edi-work-queue-prd.md` |
| 4 | `B/L` 유형별 필드/상태 매트릭스 | `10-bl-type-policy.md` |
| 5 | 오더 상세 화면 wireframe | `11-order-detail-wireframe.md` |
