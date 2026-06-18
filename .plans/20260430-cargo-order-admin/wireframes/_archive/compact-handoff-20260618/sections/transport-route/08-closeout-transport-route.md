# Closeout: 운송구간 1차 기준 고정

## 목적

이 문서는 `운송구간` 섹션 1차 정리의 종료 상태를 고정한다.

다음 작업인 `화물 운송정보` 섹션 정리를 시작하기 전에, 어떤 HTML과 문서를 기준으로 이어가야 하는지 명확히 남긴다.

## 1차 기준 상태

| 항목 | 상태 | 기준 |
| --- | --- | --- |
| 기준 표시안 | 확정 | D `compact-hybrid` |
| B 통합본 반영 | 완료 | `Cargo Order Wireframe B Original Tone.html` |
| 운송구간 배치 | 완료 | 좌우 2컬럼 전체 폭 `full-width` |
| 배차 유형 | 완료 | 기존 5번 섹션 제거, 운송구간 오른쪽 메타로 병합 |
| 상차/하차 조건 | 완료 | summary에는 `지금 / 지게차`, `당일 / 지게차`만 유지 |
| 펼침 상세 | 완료 | 상세주소, 담당자/연락처, 특이사항 요약만 표시 |
| 선택 UI | 보류 | 상차일시/방법, 하차일시/방법 선택 화면은 별도 구현 |
| 삭제 후보 | 보류 | 실제 삭제 없음, `07-cleanup-candidates.md`에만 목록 유지 |

## 기준 파일

| 파일 | 역할 |
| --- | --- |
| `results/wireframe/order-register-new2.0/Cargo Order Wireframe B Original Tone.html` | 실제 B 통합본 기준 HTML |
| `transport-route-d-workflow.html` | 운송구간 D안 상태 흐름과 펼침 정렬 기준 |
| `transport-route-section-variants.html` | A/B/C/D 비교 근거 보존용 |
| `07-cleanup-candidates.md` | 삭제 후보와 보류 사유 |
| `self-review.md` | 검증 결과와 리스크 기록 |

## B 통합본 최종 반영 요약

| 변경 | 결과 |
| --- | --- |
| 운송구간 full-width | 현재 B 통합본의 `2. 운송 구간`이 좌측 컬럼에서 빠져 `workspace` 전체 폭 사용 |
| 오른쪽 메타 영역 | 상차/하차 2행 오른쪽에 `배차 유형`, `계산 메타` 배치 |
| 5~7번 섹션 제거 | 기존 `배차 유형`, `상차 조건`, `하차 조건` 독립 섹션 제거 |
| 상세 펼침 정렬 | 상세주소는 주소 열 하단, 담당자/연락처는 일시/방법 열 하단에 정렬 |
| 중복 제거 | `상하차 조건` 메타와 `독차·예약`, `당착·지게차` 행 칩 제거 |

## 검증 상태

| 검증 | 결과 | 근거 |
| --- | --- | --- |
| B 통합본 데스크톱 | 통과 | `b-original-tone-route-detail-aligned-desktop.png` |
| B 통합본 모바일 | 통과 | `b-original-tone-route-detail-aligned-mobile.png` |
| D workflow 데스크톱 | 통과 | `transport-route-d-workflow-detail-aligned-desktop.png` |
| D workflow 모바일 | 통과 | `transport-route-d-workflow-detail-aligned-mobile.png` |
| 삭제 후보 보류 | 통과 | 추가 파일 삭제 없음 |

## 다음 섹션으로 넘길 의존성

`화물 운송정보` 섹션은 운송구간의 `계산 메타`와 연결된다.

| 운송구간 표시 | 화물 운송정보 의존 값 |
| --- | --- |
| `5톤 · 축카고 반영` | `톤수`, `차종` |
| `15.8km` | 상차 주소, 하차 주소 |
| `기준 105,000원` | 주소, 톤수, 차종 |
| `톤수·차종 변경 시 재계산` | 화물 운송정보 값 변경 |

따라서 다음 작업에서는 `3. 화물 운송정보`의 `톤수`, `차종`, `대수`, `품목`, 금액 조건이 운송구간 계산 메타와 어떻게 이어지는지 먼저 정리한다.

## 남은 보류 항목

| 항목 | 보류 사유 | 다음 처리 |
| --- | --- | --- |
| 상차일시/방법 선택 화면 | 운송구간 펼침에서는 중복이므로 제거 | 별도 입력/선택 화면으로 기획 |
| 하차일시/방법 선택 화면 | 운송구간 펼침에서는 중복이므로 제거 | 별도 입력/선택 화면으로 기획 |
| 삭제 후보 정리 | 비교안과 과거 캡처가 아직 의사결정 근거 | 사용자 승인 후 삭제 또는 archive |
| 계산 메타 중복 | 상단 subbar와 운송구간 오른쪽 메타에 함께 존재 | 화물 운송정보 섹션 정리 중 최종 결정 |

## 1차 마무리 판정

운송구간은 1차 기준안으로 마무리한다.

다음 작업은 `cargo-transport` 섹션 패키지를 새로 만들고, `화물 운송정보` 섹션을 운송구간과 같은 방식으로 PRD, wireframe, user flow, field mapping, source mapping, review, HTML variants 순서로 정리한다.
