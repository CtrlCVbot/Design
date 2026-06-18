# Self Review: 운송구간 섹션 패키지

## 리뷰 요약

| 항목 | 상태 | 메모 |
| --- | --- | --- |
| 범위 준수 | 완료 | 운송구간 섹션만 다룸 |
| 2행 요구 반영 | 완료 | 상차지/하차지를 세로 2행으로 명시 |
| 데이터 있음 상태 | 완료 | 명세서형 요약으로 정리 |
| 빈 상태 | 완료 | `04 Wireframe Spec Form.html`의 폼시트 감각 반영 |
| 펼침 상태 | 완료 | 상세주소, 담당자, 연락처, 특이사항 표시 |
| 단독 HTML 정리 | 완료 | `transport-route-section.html` 삭제, variants HTML로 비교 기준 통합 |
| D안 1차 기준 | 완료 | `compact-hybrid`를 운송구간 1차 기준안으로 정리 |
| 표시 방식 4안 | 완료 | A/B/C는 비교 근거, D는 1차 기준안으로 구분 |
| D안 워크플로우 | 완료 | `transport-route-d-workflow.html`에서 닫힘, 열림, 주소 미적용, 부분 입력, 계산 완료 흐름 구현 |
| 삭제 후보 목록 | 완료 | `07-cleanup-candidates.md`에 후보만 정리. 추가 삭제는 진행하지 않음 |
| 배차 유형 규칙 | 완료 | `독차/혼적` 대표 선택과 `긴급/왕복/예약` 멀티옵션을 분리 |
| B 원본 톤 통합 | 완료 | `Cargo Order Wireframe B Original Tone.html` 1번 운송구간에 D안을 1차 반영 |
| full-width 병합 | 완료 | B 통합본에서 운송구간을 전체 폭으로 확장하고 5~7번 섹션을 내부 병합 |
| 메타 우측 정렬 | 완료 | 배차 유형/계산 메타를 상차·하차 오른쪽으로 이동하고 중복 칩 제거 |
| 펼침 열 정렬 | 완료 | 상세주소는 주소 열 하단, 담당자/연락처는 일시/방법 열 하단으로 정렬 |
| 1차 마무리 | 완료 | `08-closeout-transport-route.md`에 기준 상태와 다음 섹션 인계 조건 기록 |
| 추가 와이어프레임 계획 | 완료 | `09-additional-wireframe-plan-transport-route.md`에 주소 입력 전, 부분 입력, 주소 검색/적용, 상세 inline edit, 계산 메타 상태 계획 기록 |
| 품질 gap review | 완료 | `10-transport-route-quality-gap-review.md`에 화주 정보 closeout 수준 대비 보강 gap과 리스크 기록 |
| 주소 검색/적용 분리안 | 완료 | `11-address-apply-layout-package-overview.md`와 `transport-route-address-apply-layouts.html`에 별도 구현. 기존 D workflow 원본은 유지 |
| 주소 검색/적용 문서 패키지 | 완료 | `address-apply-layouts` 하위 폴더에 README, PRD, Wireframe, Closeout, self-review 생성 |

## 누락 가능성이 있는 필드

| 필드 | 현재 처리 | 후속 검토 |
| --- | --- | --- |
| 경유지 | 이번 범위에서는 제외 | 운송구간 확장 시 `경유 N` 배지로 추가 가능 |
| 배차 유형 | variants HTML, D workflow, B 원본 톤 통합본에 반영 | B 통합본에서는 5번 독립 섹션을 제거하고 운송구간 보조 메타로 병합 |
| 거리 | B 원본 톤 통합본에서 `5톤 · 축카고 반영`, `톤수·차종 변경 시 재계산`으로 표시 | 상단 subbar와 운송구간 하단 보조 메타를 둘 다 둘지 최종 검토 |
| 대기시간 | `30분 미선택`으로 운송구간 보조 메타와 펼침 상세에 반영 | 유료/무료 대기 정책은 후속 검토 |
| 유료/무료 대기 | 제외 | 정산 영향이 있으면 펼침에 추가 필요 |

## 불명확한 요구사항

| 항목 | 판단 |
| --- | --- |
| 펼침 위치 | HTML에서는 행별 펼침으로 구현 |
| 특이사항 배지 명칭 | `특이사항 N`을 기본값으로 사용 |
| 지명 없는 상태 | 하차지명 없는 샘플에서 지명 줄을 렌더링하지 않는 방식으로 검증 |

## 리스크 분류

| 피드백 | Impact | Reach | Recovery | Total | Severity | Confidence | Action |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 거리/기준 금액이 `톤수/차종` 선택 전 확정값처럼 보이면 잘못된 판단을 유도할 수 있음 | 3 | 2 | 1 | 6 | high | confirmed | auto-fixed |
| 배차 유형이 운송구간과 분리되거나 단일 값처럼 보이면 독차/혼적/긴급/왕복/예약 조건을 경로 확인 중 놓칠 수 있음 | 3 | 2 | 1 | 6 | high | confirmed | auto-fixed |
| 대기시간을 요약에서 제외해 운영자가 추가 확인해야 할 수 있음 | 2 | 2 | 1 | 5 | high | likely | queued |
| 행별 펼침이 실제 개발에서 클릭 범위를 복잡하게 만들 수 있음 | 1 | 2 | 1 | 4 | medium | likely | queued |
| 특이사항 배지만으로 위험도를 충분히 구분하지 못할 수 있음 | 2 | 1 | 1 | 4 | medium | tentative | queued |
| 모바일에서 명세표형 구조가 내부 가로 스크롤을 요구함 | 1 | 2 | 1 | 4 | medium | likely | queued |
| 주소 검색/적용 기준 없이 inline edit를 허용하면 좌표와 표시 주소가 불일치할 수 있음 | 3 | 2 | 2 | 7 | high | likely | queued |
| 상차만 입력된 중간 상태가 B 통합본에 없으면 신규 입력 진행 상태가 모호해질 수 있음 | 2 | 2 | 1 | 5 | high | likely | queued |
| 상세정보 inline edit 범위가 불명확하면 일시/방법 선택 화면과 충돌할 수 있음 | 2 | 2 | 1 | 5 | high | likely | queued |

## 자동 반영 결과

| 항목 | 상태 | 내용 |
| --- | --- | --- |
| 2열 오해 | auto-fixed | 모든 문서와 HTML에서 세로 2행을 기준으로 작성 |
| 상세주소 노출 | auto-fixed | 기본 요약에서 숨기고 펼침 영역에만 배치 |
| 빈 지명 처리 | auto-fixed | 값 없는 지명은 표시하지 않는 규칙과 샘플 추가 |
| B안 가독성 저하 | auto-fixed | 비교 영역을 세로 나열로 바꿔 명세표 구조 카드가 충분한 폭을 갖도록 조정 |
| variants 페이지 가로 넘침 | auto-fixed | `section`, `table-scroll`, `variant-grid` 폭 제약을 보강해 페이지 overflow 제거 |
| 거리/기준 금액 계산 조건 | auto-fixed | 주소만으로 확정하지 않고 화물 운송정보의 `톤수/차종` 선택 후 정밀 표시하는 기준으로 문서 수정 |
| 배차 유형 추가 반영 | auto-fixed | B안 5번 섹션의 배차 유형을 variants HTML의 상하차지 전체 보조 칩으로 반영 |
| 배차 유형 대표/옵션 분리 | auto-fixed | `독차(기본)`과 `혼적 전환 가능`을 대표 선택으로, `긴급/왕복/예약`을 멀티옵션으로 분리 |
| B+C 컴팩트 병합안 추가 | auto-fixed | D안 `compact-hybrid`를 추가해 접힘 상태는 값 중심, 펼침 상태는 라벨 중심으로 분리 |
| D안 흐름 검토 HTML 추가 | auto-fixed | 닫힘/열림 정적 예시와 상태 버튼 기반 워크플로우를 별도 HTML로 추가 |
| D안 기준 문서 정리 | auto-fixed | README, PRD, Wireframe, User Flow, Field Mapping, Source Review에서 D안을 1차 기준안으로 통일 |
| B 원본 톤 D안 통합 | auto-fixed | 전체 B 원본 톤 HTML의 1번 운송구간을 D `compact-hybrid`로 교체하고, 5번 배차 유형을 같은 규칙으로 정리 |
| full-width 병합 | auto-fixed | 1번 운송구간을 `.route-section-wide`로 확장하고 기존 `section-dispatch`, `section-load`, `section-unload`를 제거 |
| 상하차 조건 중복 제거 | auto-fixed | 펼침 영역에서 일시 상세와 방법 옵션을 제거하고 summary의 일시/방법만 유지 |
| 중복 메타 정리 | auto-fixed | 하단 `상하차 조건` 그룹과 행 안의 `독차·예약`, `당착·지게차` 칩을 제거하고 오른쪽 메타 영역에 배차/계산만 유지 |
| 펼침 상세 단순화 | auto-fixed | `상차일시 상세`, `상차방법 옵션`, `하차일시 상세`, `하차방법 옵션`을 삭제하고 선택 화면은 별도 구현 대상으로 분리 |
| 1차 closeout 문서화 | auto-fixed | 기준 파일, 보류 파일, 검증 증빙, 화물 운송정보 섹션 의존성을 `08-closeout-transport-route.md`로 고정 |
| 삭제 후보 문서화 | queued | 실제 삭제는 하지 않고 후보 목록만 작성 |
| 화주 정보 기준 재점검 | queued | HTML 구현 전 `09`, `10` 문서 기준으로 추가 상태 화면을 먼저 확정 |
| 주소 검색/적용 분리 | auto-fixed | 지명/행정주소는 검색 다이얼로그로 변경하고, 상세주소/담당자/연락처는 1열 단일 행에 기본 노출 |

## 검증 결과

| 검증 | 결과 | 근거 |
| --- | --- | --- |
| 데스크톱 렌더링 | 통과 | `1440px`에서 페이지 가로 overflow 없음 |
| 모바일 렌더링 | 통과 | `390px`에서 페이지 가로 overflow 없음 |
| 상차/하차 2행 | 통과 | 데이터 있음 상태의 `.route-row` 2개가 같은 x좌표에서 세로 배치 |
| 상세주소 기본 숨김 | 통과 | 데이터 있음 기본 요약에 `18-1`, `554-7` 미노출 |
| 펼침 상태 | 통과 | 펼침 샘플에서 `details[open]` 2개 확인 |
| 빈 상태 | 통과 | 빈 상태 표의 header + 상차 + 하차 3행 확인 |
| 핵심 문구 | 통과 | `상차지/하차지 세로 2행`, `데이터 있음`, `빈 상태`, `펼침 상태`, `특이사항 2` 확인 |
| variants 데스크톱 렌더링 | 통과 | `1440px`에서 페이지 가로 overflow 없음, A/B/C/D 4안 모두 표시 |
| variants 모바일 렌더링 | 통과 | `390px`에서 페이지 가로 overflow 없음, 명세표 계열은 내부 스크롤로 구조 유지 |
| 단독 HTML 삭제 | 통과 | `transport-route-section.html` 삭제 확인 |
| 명세표형 한 줄 행 | 통과 | 상차 행이 `상차 / 코덱트 후진입차 / 경기 여주시 산북면 후리 / 지금 / 지게차` 순서로 표시 |
| 4가지 표시안 수량 | 통과 | `.route-table` 3개, `.sheet-card` 2개, `.route-card` 2개, `.compact-route-card` 2개 확인 |
| D안 접힘/펼침 규칙 | 통과 | 접힘 summary에는 필드 라벨을 숨기고, details 펼침 영역에 `상세주소`, `담당자 / 연락처`, `특이사항 요약` 라벨 배치 |
| 06 반영 상태 표 | 통과 | HTML 하단 표 6행 확인 |
| D안 워크플로우 HTML | 통과 | `transport-route-d-workflow.html`에서 5개 상태 버튼, 닫힘 2행, 열림 2행, 계산 완료 메타 확인 |
| 삭제 후보 목록 | 통과 | `07-cleanup-candidates.md` 작성, 추가 삭제 없음 |
| 보조 메타 수량 | 통과 | `.meta-band` 6개, `.meta-chip` 30개 확인 |
| 배차 유형 보조 칩 | 통과 | variants HTML에서 `독차(기본)`, `혼적 전환 가능`, `예약`, `긴급/왕복 미선택`, `옵션 없음`, `배차 유형 선택 전` 확인 |
| 계산 메타 | 통과 | variants HTML에서 `톤수·차종 선택 후 거리/기준 금액 계산` 확인 |
| B 원본 톤 D 통합 데스크톱 | 통과 | `1440px`에서 `.route-card` 2개, 기본 닫힘, 펼침 라벨, 배차 옵션, 가로 overflow 없음 확인 |
| B 원본 톤 D 통합 모바일 | 통과 | `390px`에서 페이지 가로 overflow 없음, 명세 행은 카드 내부 스크롤로 유지 |
| B 통합본 full-width | 통과 | `.route-section-wide` 폭과 `.workspace` 폭이 `1242px`로 동일 |
| 5~7번 섹션 제거 | 통과 | `#section-dispatch`, `#section-load`, `#section-unload` 없음 |
| 번호 재정렬 | 통과 | 화면 섹션 번호가 `1, 2, 3, 4, 5, 6` 순서로 표시 |
| 상하차 조건 병합 | 통과 | summary의 `지금 / 지게차`, `당일 / 지게차`만 유지하고 선택 UI는 별도 구현 대상으로 분리 |
| 메타 우측 정렬 | 통과 | 데스크톱에서 route panel `864px`, meta panel `350px` 2열로 표시. y좌표와 높이 모두 일치 |
| 중복 표현 제거 | 통과 | `독차·예약`, `당착·지게차`, 하단 `상하차 조건` 메타 미노출 |
| 펼침 열 정렬 | 통과 | B 통합본과 D workflow에서 상세주소는 주소 열, 담당자/연락처는 일시/방법 열 x좌표와 일치 |
| 선택 상세 제거 | 통과 | B 통합본과 D workflow에서 상차/하차 일시 상세 및 방법 옵션 라벨 미노출 |
| closeout 문서 | 통과 | `08-closeout-transport-route.md` 생성, README 산출물 표에 연결 |
| 추가 계획 문서 | 통과 | `09-additional-wireframe-plan-transport-route.md` 생성, README 산출물 표에 연결 |
| 품질 gap review | 통과 | `10-transport-route-quality-gap-review.md` 생성, README 산출물 표에 연결 |
| 주소 검색/적용 분리 문서 | 통과 | `11-address-apply-layout-package-overview.md` 생성, README 산출물 표에 연결 |
| 주소 검색/적용 분리 HTML | 통과 | `HTTP 200`, `scriptSyntax=ok`, 1열 단일 행, 변경 버튼, 다이얼로그 오픈, 적용 결과 반영 확인 |
| 주소 검색/적용 패키지 구조 | 통과 | `address-apply-layouts` 하위 패키지 문서 5종 생성, 상위 README에 연결 |

## 검증 산출물

| 캡처 | 경로 |
| --- | --- |
| 데스크톱 | `review-artifacts/transport-route-desktop.png` |
| 모바일 | `review-artifacts/transport-route-mobile.png` |
| variants 데스크톱 | `review-artifacts/transport-route-desktop-variants.png` |
| variants 모바일 | `review-artifacts/transport-route-mobile-variants.png` |
| D안 워크플로우 데스크톱 | `review-artifacts/transport-route-d-workflow-desktop.png` |
| D안 워크플로우 모바일 | `review-artifacts/transport-route-d-workflow-mobile.png` |
| B 원본 톤 D 통합 데스크톱 | `results/wireframe/order-register-new2.0/review-artifacts/b-original-tone-d-route-desktop.png` |
| B 원본 톤 D 통합 모바일 | `results/wireframe/order-register-new2.0/review-artifacts/b-original-tone-d-route-mobile.png` |
| B 원본 톤 full-width 닫힘 데스크톱 | `results/wireframe/order-register-new2.0/review-artifacts/b-original-tone-fullwidth-route-closed-desktop.png` |
| B 원본 톤 full-width 닫힘 모바일 | `results/wireframe/order-register-new2.0/review-artifacts/b-original-tone-fullwidth-route-closed-mobile.png` |
| B 원본 톤 full-width 펼침 데스크톱 | `results/wireframe/order-register-new2.0/review-artifacts/b-original-tone-fullwidth-route-desktop.png` |
| B 원본 톤 full-width 펼침 모바일 | `results/wireframe/order-register-new2.0/review-artifacts/b-original-tone-fullwidth-route-mobile.png` |
| B 원본 톤 메타 우측 정렬 데스크톱 | `results/wireframe/order-register-new2.0/review-artifacts/b-original-tone-route-meta-right-desktop.png` |
| B 원본 톤 메타 우측 정렬 모바일 | `results/wireframe/order-register-new2.0/review-artifacts/b-original-tone-route-meta-right-mobile.png` |
| B 원본 톤 상세 열 정렬 데스크톱 | `results/wireframe/order-register-new2.0/review-artifacts/b-original-tone-route-detail-aligned-desktop.png` |
| B 원본 톤 상세 열 정렬 모바일 | `results/wireframe/order-register-new2.0/review-artifacts/b-original-tone-route-detail-aligned-mobile.png` |
| D workflow 상세 열 정렬 데스크톱 | `review-artifacts/transport-route-d-workflow-detail-aligned-desktop.png` |
| D workflow 상세 열 정렬 모바일 | `review-artifacts/transport-route-d-workflow-detail-aligned-mobile.png` |
| 삭제 후보 목록 | `07-cleanup-candidates.md` |

## 남은 결정사항

1. 거리와 기준 금액을 상단 subbar와 운송구간 하단 보조 메타에 둘 다 둘지 결정합니다. 단, `톤수/차종 선택 후 계산` 상태는 유지합니다.
2. 전체 B 통합본에서 제거된 5~7번 섹션의 병합 정보 밀도가 충분한지 운영자에게 확인합니다.
3. 경유지가 있는 오더를 별도 상태로 추가할지 결정합니다.
4. 특이사항 배지를 단순 숫자형으로 둘지, 위험도 단계까지 넣을지 결정합니다.
5. 운영자 검토 후 `07-cleanup-candidates.md`의 삭제 후보를 실제 삭제할지 결정합니다.
6. 주소 검색/적용 분리 HTML의 1열 단일 행을 B 통합본에 반영할지 결정합니다.
7. B 통합본에 주소 미입력 CTA 흡수 상태와 상차만 입력된 부분 상태를 반영할지 결정합니다.
8. 긴 주소가 있는 실제 데이터로 1열 단일 행의 컬럼 폭과 내부 스크롤 정책을 확인합니다.
