# 06. Claude Design 작업 핸드오프

## 목적

이 문서는 현재 문서 패키지를 활용해 Claude Design에서 `wireframe → high fidelity` 순서로 화물 오더 접수/수정 화면을 디자인하기 위한 1차 실행 기록/legacy 가이드입니다.

최신 섹션 정리 후 High Fidelity 작업은 `claude-design-v2/README.md`와 `claude-design-v2/PROMPT-LOG.md`를 기준으로 진행합니다. 이 문서에서 사용하는 1차 프롬프트 파일은 `_archive/legacy-prompts/claude-design-v1/`에 보관합니다.

핵심 목표는 기존 사용자가 불편해하지 않도록 현재 화면의 큰 구조를 유지하면서, B안으로 확정한 `2열 유지 + 업무 의미 묶음 정리형`을 시각적으로 개선하는 것입니다.

## 사용 전제

| 항목 | 내용 |
| --- | --- |
| 실행 도구 | Claude Design |
| 실행 방식 | 브라우저 GUI에서 수동 실행 |
| 자동화 범위 | 로컬 문서는 프롬프트와 검수 기준까지만 제공 |
| 작업 순서 | 1단계 Wireframe → 검토 → 2단계 High Fidelity |
| 기준 화면 | `SCR-CARGO-ORDER-001` 화물 오더 접수/수정 관리 화면 |
| 기준 문서 | `03-wireframe.md`의 확정 B안 |

## 입력 자료

| 자료 | 역할 |
| --- | --- |
| `assets/source-full.png` | 원본 화면 캡처. Claude Design에 가능하면 함께 첨부 |
| `01-screen-map.md` | 원본 화면 섹션 구조 |
| `02-field-inventory.md` | 보존해야 할 필드, 버튼, 목록 컬럼 |
| `03-wireframe.md` | 확정 와이어프레임과 B안 정보 구조 |
| `04-modernization-brief.md` | UX/UI 개선 방향과 리스크 |
| `sections/new-order-registration-flow/README.md` | 신규 접수 플로우 최종 기획 기준 |
| `sections/reservation-area-tabs/README.md` | 우측 `보조 정보` 탭 최종 기획 기준 |
| `results/html/cargo-order-admin-hifi-master.html` | 신규 접수 플로우와 보조 정보 탭이 함께 반영된 통합 master HiFi HTML. 기본은 데이터 있음, `신규(F3)` 초기화 후 보조 정보 빈 상태 |
| `results/html/new-order-registration-flow-hifi-20260617.html` | 신규 접수 플로우가 반영된 이전 HiFi 후보 HTML |
| `_archive/legacy-prompts/claude-design-v1/prompt-01-wireframe.md` | 1단계 Wireframe 모드용 붙여넣기 프롬프트 |
| `_archive/legacy-prompts/claude-design-v1/prompt-02-high-fidelity.md` | 2단계 High Fidelity 모드용 붙여넣기 프롬프트 |
| `_archive/legacy-prompts/claude-design-v1/review-checklist.md` | 1차 결과 검수 기준 |
| `_archive/legacy-prompts/claude-design-v1/design-manifest.md` | 1차 실행 결과 기록용 문서 |

## 실행 순서

1. Claude Design을 열고 새 디자인 작업을 시작합니다.
2. 가능하면 `assets/source-full.png`를 첨부합니다.
3. `_archive/legacy-prompts/claude-design-v1/prompt-01-wireframe.md` 전체를 붙여넣고 Wireframe 모드로 실행합니다.
4. 결과가 현재 화면의 큰 배치를 유지하는지 먼저 봅니다.
5. `_archive/legacy-prompts/claude-design-v1/review-checklist.md`의 Wireframe 체크 항목을 통과하면 같은 세션에서 다음 단계로 갑니다.
6. `_archive/legacy-prompts/claude-design-v1/prompt-02-high-fidelity.md` 전체를 붙여넣고 High Fidelity 모드로 전환합니다.
7. 결과 URL, 캡처, 주요 피드백을 `_archive/legacy-prompts/claude-design-v1/design-manifest.md`에 기록합니다.

## 디자인 원칙

| 원칙 | 설명 |
| --- | --- |
| 기존 구조 우선 | 상단 입력/수정 영역과 하단 목록 구조는 유지 |
| 2열 유지 | 좌측 오더 입력, 우측 배차·상하차·화주 조건을 유지 |
| 업무 의미 묶음 | 운송 구간, 화물 정보, 정산 정보, 오더 요약, 차주, 화주, 수수료율로 정리 |
| 고밀도 업무 화면 유지 | 핵심 필드를 숨기지 않고 빠르게 스캔 가능하게 구성 |
| 위험 액션 분리 | 화물취소, 배차취소, 정산처리는 일반 액션과 시각적으로 구분 |
| 상태 의미 명확화 | 접수, 완료, 취소, 선택 행은 색상과 텍스트 배지로 함께 표현 |

## 화면 ID

| SCR-ID | 화면명 | 설명 |
| --- | --- | --- |
| `SCR-CARGO-ORDER-001` | 화물 오더 접수/수정 관리 화면 | 상단에서 개별 화물 오더를 입력/수정하고, 하단에서 등록된 화물 목록을 조회/처리하는 화면 |

## 단계별 산출물

| 단계 | 기대 산출물 | 통과 기준 |
| --- | --- | --- |
| Wireframe | 구조 중심 저충실도 화면 | B안의 좌우 2열, 하단 목록, 필드 그룹이 유지됨 |
| High Fidelity | 실제 사용 가능한 고충실도 화면 | 색상, 여백, 상태, 입력 컴포넌트, 테이블이 업무용 UI로 정리됨 |
| Review | 검수 기록 | 필드 보존, 상태 보존, 위험 액션 분리, 목록 기능 유지 확인 |

## Claude Design에 반드시 전달할 핵심 지시

| 지시 | 이유 |
| --- | --- |
| 기존 화면과 크게 달라 보이면 안 됨 | 사용자가 급격한 변화에 불편함을 느낌 |
| B안의 정보 묶음을 기준으로 함 | 현재까지 확정한 구조적 의사결정 |
| `수수료` 금액은 좌측 화물 운송정보에 둠 | 운송료, 합계와 같은 금액 흐름 |
| `주선약관 수수료율`은 우측 별도 정보로 둠 | 수수료 금액과 다른 계산 기준표 |
| `의뢰자`는 새 UI에서 `화주 정보`로 표현 | 업무 의미를 더 정확히 드러냄 |
| `추가정보`는 새 UI에서 `품목`으로 표현 | 실제 운송 품목 의미 |
| 모든 필드를 숨기지 말고 스캔 가능하게 배치 | 숙련 운영자의 속도 유지 |
| `신규(F3)`는 신규 접수 wizard 플로우로 처리 | 기존 수정/조회와 신규 입력 안내 흐름을 분리 |
| 기본/수정/등록 완료 화면은 명세서형 보기 유지 | 본문 라벨과 섹션 헤더가 이중으로 보이지 않게 함 |
| `화물 등록 완료`는 API 저장이 아니라 메인 화면 적용 | 실제 API 통신은 메인 `화물등록` 버튼에서만 발생 |
| 실제 API endpoint는 보류 상태로 둠 | 기획 범위에서 endpoint와 payload schema를 확정하지 않음 |
| 우측 `예약 영역`은 `보조 정보`로 다룸 | 메모, 금액 로그, 운송 구간 지도는 입력 폼과 분리된 후속 판단 정보 |

## 신규 접수 플로우 인계 요약

| 항목 | 기준 |
| --- | --- |
| 상세 기획 | `sections/new-order-registration-flow/` |
| 이전 flow 후보 HTML | `results/html/new-order-registration-flow-hifi-20260617.html` |
| 상태 흐름 | `new-reset -> new-wizard-active -> new-required-complete -> new-driver-optional 또는 new-submitted` |
| wizard 순서 | 화주 정보, 상차지, 하차지, 화물 정보, 정산 정보, 차주 정보 선택 |
| 섹션 헤더 | 신규 접수 안내형 상태에서만 표시. 기본/수정/등록 완료 후 숨김 |
| 오더 요약 | 입력 단계가 아닌 확인용 섹션. 신규 접수 안내형 보기에서만 회색 `확인` 배지 |
| API 정책 | endpoint 연결 보류. 메인 `화물등록` 버튼이 실제 API 통신 담당 |

## 통합 HiFi master 기준

| 항목 | 기준 |
| --- | --- |
| 현재 통합 결과물 | `results/html/cargo-order-admin-hifi-master.html` |
| 데이터 있음 확인 | `results/html/cargo-order-admin-hifi-master.html` 기본 URL |
| 데이터 없음 확인 | `results/html/cargo-order-admin-hifi-master.html`에서 `신규(F3)` 클릭 후 확인 |
| 부분 데이터 확인 | 화주 선택 시 메모 mock, 상차지+하차지 적용 시 지도 mock, 정산 정보 적용 시 금액 로그 mock |
| 신규 접수 source | `results/html/new-order-registration-flow-hifi-20260617.html` |
| 보조 정보 source | `sections/reservation-area-tabs/` |
| 보조 정보 탭 순서 | `메모 -> 금액 로그 -> 운송 구간 지도` |
| 금액 로그 용어 | `조정금`으로 통일하고 `+/-` 부호로 증감 확인 |
| 보류 정책 | 지도 provider, 조정금 저장 방식, 정산 후 수정, 권한 정책 |

## 결과 기록 방식

Claude Design 1차 결과가 나오면 `_archive/legacy-prompts/claude-design-v1/design-manifest.md`에 아래 정보를 기록합니다.

| 항목 | 기록 내용 |
| --- | --- |
| Wireframe URL | 1단계 결과 링크 |
| High Fidelity URL | 2단계 결과 링크 |
| 첨부 이미지 | Claude Design에 첨부한 이미지 |
| 주요 변경 | 원본 대비 바뀐 정보 구조 |
| 보존 확인 | 필드, 버튼, 목록, 상태 보존 여부 |
| 남은 피드백 | 수정 요청이 필요한 항목 |

## 다음 단계

1. `_archive/legacy-prompts/claude-design-v1/prompt-01-wireframe.md`로 Claude Design Wireframe 결과를 생성합니다.
2. 결과가 B안과 맞는지 `_archive/legacy-prompts/claude-design-v1/review-checklist.md`로 검토합니다.
3. 통과하면 `_archive/legacy-prompts/claude-design-v1/prompt-02-high-fidelity.md`로 High Fidelity 작업을 진행합니다.
4. 결과 URL과 피드백을 `_archive/legacy-prompts/claude-design-v1/design-manifest.md`에 기록합니다.
