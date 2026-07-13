# B2B MM first-mile 수출입 flow 분석 패키지

이 패키지는 Figma FigJam 보드 [B2B MM](https://www.figma.com/board/BiVqsV13nKzUEkvCp2PT3m/B2B-MM?t=WoAKRu2J27mP2ox8-0)의 `수출입 통합 (TO - BE)` 화면을 기준으로 first-mile 물류 수출입 운영 flow를 문서화한 기획 패키지다.

## 패키지 범위

| 구분 | 내용 |
| --- | --- |
| 기준 화면 | `수출입 통합 (TO - BE)` 섹션 |
| 보조 근거 | Figma 최상위 섹션 목록, TO-BE 전체/분할 스크린샷 |
| 주요 범위 | 기초 데이터, 견적, 오더/서류 등록, `B/L` 입력, 수출 `FCL/LCL`, 수입, 적하목록/EDI, 운송 완료, 정산 |
| 제외 범위 | 실제 API/DB 계약, 회계 전표 상세, 외부 선사/콘솔사/세관 시스템 내부 화면, 구현 코드 |

## 문서 구성

| 순서 | 문서 | 역할 |
| --- | --- | --- |
| 1 | `planning/01-figma-source-analysis.md` | Figma 근거, 섹션 목록, 색상/시스템 범례, 확인 제한 |
| 2 | `planning/02-process-prd.md` | TO-BE 업무 목적, 역할, 범위, 요구사항, 수용 기준 |
| 3 | `planning/03-user-operation-flows.md` | 견적부터 정산까지 사용자/운영 flow |
| 4 | `planning/04-system-document-map.md` | 시스템 경계, 문서/서류 흐름, 상태 맵 |
| 5 | `planning/05-open-questions-and-assumptions.md` | Figma 주석 기반 미결 질문과 가정 |
| 6 | `planning/06-traceability-and-review.md` | Figma 요소와 문서 매핑, self-review, 남은 리스크 |

## 근거 이미지

| 이미지 | 설명 |
| --- | --- |
| `assets/figma/b2b-mm-to-be.png` | `수출입 통합 (TO - BE)` 전체 축소 스크린샷 |
| `assets/figma/01-left-order-and-bl.png` | 로그인, 기초 데이터, 견적, 오더/서류, `B/L` 입력 구간 |
| `assets/figma/02-middle-ship-and-mbl.png` | 수출 `FCL/LCL`, 선사/콘솔사, `M/BL`, `H/BL`, 적하목록, EDI 구간 |
| `assets/figma/03-right-edi-and-settlement.png` | EDI 후속, 선적/운송 완료, 지출결의, 청구, 세금계산서, 실적정산 구간 |

## 읽는 순서

1. `planning/01-figma-source-analysis.md`에서 근거와 한계를 확인한다.
2. `planning/02-process-prd.md`로 제품/업무 범위를 잡는다.
3. `planning/03-user-operation-flows.md`와 `planning/04-system-document-map.md`로 실제 화면/기능 단위를 나눈다.
4. `planning/05-open-questions-and-assumptions.md`의 질문을 답한 뒤, 구현 또는 상세 PRD로 넘긴다.

## 현재 상태

Figma MCP 호출 제한으로 `수출 1차`, `수출 2차`, `수입 1차`, `수입 2차` 섹션의 확대 스크린샷은 확보하지 못했다. 따라서 이 패키지는 `수출입 통합 (TO - BE)` 기준의 1차 분석본이며, 1차/2차 섹션 비교 검증은 후속 보완 항목으로 남긴다.
