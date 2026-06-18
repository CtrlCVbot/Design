# Archive Reclassification: 최종 방향 기준 재분류

> 작성일: 2026-06-16  
> 목적: 최종 결과물과 방향이 다르거나 과거 검토용으로 생성된 프롬프트, HTML, 캡처 산출물을 다시 아카이브 후보로 분류한다.

## 판단 기준

| 기준 | 처리 |
| --- | --- |
| 최종 구현 방향과 직접 연결되는 산출물 | 활성 영역 유지 |
| 최신 high fidelity 결과를 설명하거나 재현하는 문서 | 활성 영역 유지, 최종 확정 후 아카이브 가능 |
| 과거 프롬프트, 1차 handoff, 초기 비교안 | 아카이브 대상 |
| 현재 문서에서 참조 중인 과거 자료 | 참조 경로 수정 후 아카이브 |
| 검증 스크린샷, 임시 리뷰 캡처 | 최종 검증 근거만 남기고 아카이브 |

## 1. 이번 단계 아카이브 완료

현재 최종 방향과 역할이 겹치거나 과거 프롬프트 성격이 강한 항목을 먼저 이동했다.

| 우선순위 | 기존 대상 | 현재 역할 | 이동 후 위치 | 상태 |
| --- | --- | --- | --- |
| P1 | `claude-design/` | 1차 Claude Design 프롬프트 패키지 | `_archive/legacy-prompts/claude-design-v1/` | 완료 |
| P1 | `prompts/transport-route-section-package-prompt.md` | 운송구간 과거 프롬프트 단일 파일 | `_archive/legacy-prompts/transport-route-section-package-prompt.md` | 완료 |

관련 문서의 1차 프롬프트 참조는 `_archive/legacy-prompts/claude-design-v1/`로, 최신 디자인 고도화 참조는 `claude-design-v2/`로 정리했다.

## 2. 참조 경로 수정 후 아카이브 권장

최종 화면과 방향이 달라졌거나 현재는 비교 근거로만 남은 항목이다. 다만 문서에서 직접 참조 중이므로, 이동 전에 링크를 정리해야 한다.

| 우선순위 | 대상 | 아카이브 이유 | 선행 작업 |
| --- | --- | --- | --- |
| P2 | `results/wireframe/order-register-new2.0/Cargo Order Wireframe.html` | 최초 wireframe으로, 현재 B 통합안과 Clean/HiFi 방향이 기준이 됨 | `ux-ui-review.md`, 섹션 source mapping, specs 링크 정리 |
| P2 | `results/wireframe/order-register-new2.0/specs/` | 명세서형/출력물형 참고 자료로 현재 입력 화면 방향과 다름 | `04 Wireframe Spec Form.html` 참조 문서 정리 |
| P2 | `sections/transport-route/transport-route-section-variants.html` | A/B/C/D 비교용, 현재는 주소 적용 1열안과 B 통합안에 흡수됨 | 운송구간 문서의 비교안 참조를 closeout 또는 archive 경로로 변경 |
| P2 | `sections/transport-route/transport-route-d-workflow.html` | D안 흐름 검토용, 최종 B 통합안과 주소 적용 HTML로 흡수됨 | `address-apply-layouts` 문서와 README의 "기존 D workflow 유지" 문구 정리 |
| P2 | `sections/cargo-transport/cargo-transport-section-variants.html` | F안 이전 비교안, 현재는 F 단독 HTML과 B 통합안이 기준 | cargo-transport README, self-review 참조 정리 |
| P2 | `sections/driver-info/driver-info-section-wireframe.html` | Phase 1 기준안, 현재 B 통합안은 Phase 2 화물맨 연동 버전 중심 | Phase 1 비교 의도가 필요하면 archive reference로 이동 |
| P3 | `results/wireframe/order-register-new2.0/review-artifacts/` | 중간 리뷰 캡처 모음 | 최종 검증에 필요한 캡처만 남기고 나머지 이동 |
| P3 | `sections/transport-route/review-artifacts/` | 운송구간 중간 검증 캡처 모음 | 최종 기준 캡처만 남기고 나머지 이동 |

## 3. 활성 유지

아직 최종 결과물과 직접 연결되거나, 현재 기획/구현 기준으로 쓰이는 항목이다.

| 대상 | 유지 이유 |
| --- | --- |
| `results/html/화물 오더 접수수정 (오프라인).html` | 다른 AI를 통해 고도화된 최종 high fidelity 결과물 |
| `results/wireframe/order-register-new2.0/Cargo Order Wireframe B Original Tone.html` | 기존 기획 통합안 기준 HTML |
| `results/wireframe/order-register-new2.0/Cargo Order B Implementation Clean.html` | 기획 문구 제거, 구현용 정리 기준 HTML |
| `claude-design-v2/` | 최신 high fidelity 입력/로그 패키지 |
| `sections/shipper-info/shipper-info-section-wireframe.html` | 화주 정보 최신 섹션 기준 |
| `sections/transport-route/transport-route-address-apply-layouts.html` | 운송구간 최신 주소 적용 기준 |
| `sections/cargo-transport/cargo-transport-section-f-wireframe.html` | 화물 운송정보 F안 최신 기준 |
| `sections/cargo-summary-docs/cargo-summary-docs-section-wireframe.html` | 화물정보 요약 최신 기준 |
| `sections/driver-info/driver-info-hwamulman-phase2-wireframe.html` | 차주 정보 Phase 2 화물맨 연동 최신 기준 |
| `sections/cargo-list/` | 화물 목록 섹션 분리 기획 진행 영역 |
| `artifact-audit/` | 산출물 정리, 아카이브 판단, 로그 기준 문서 |

## 4. 이미 아카이브 완료

| 위치 | 내용 |
| --- | --- |
| `_archive/duplicate-source-copies/` | 루트 중복 HTML, uploads 중복 이미지 |
| `_archive/old-wireframes/order-register-new2.0.zip` | 압축 백업 파일 |
| `_archive/old-wireframes/b-improved/` | B Improved 과거 시안 및 캡처 |
| `_archive/verification-snapshots/order-register-new2.0/` | 과거 verification 스냅샷 |

## 5. 추천 실행 순서

1. 완료: 1차 Claude Design 패키지와 운송구간 과거 프롬프트를 legacy prompt로 이동한다.
2. 완료: 이동된 prompt 경로를 참조하는 문서들을 최신 `claude-design-v2/` 또는 archive 경로로 수정한다.
3. 다음: 초기 HTML과 섹션별 variants HTML을 archive reference로 옮긴다.
4. 다음: `review-artifacts` 폴더는 최종 기준 캡처만 남기고 나머지를 archive evidence로 이동한다.
5. 보류: `specs/`는 참조가 많으므로 마지막에 이동하거나, `reference-specs`로 별도 보관할지 결정한다.

## 6. 다음 실행 전 확인 질문

| 질문 | 권장 답 |
| --- | --- |
| 과거 프롬프트는 활성 영역에서 제거할까요? | 완료. 최신 handoff는 `claude-design-v2/`, 과거 프롬프트는 `_archive/legacy-prompts/`로 분리 |
| 최초 wireframe과 specs는 삭제가 아니라 archive가 맞나요? | 예. 비교 근거로 가치가 있으므로 삭제보다 archive |
| Phase 1 차주 HTML은 남길까요? | Phase 2 중심으로 확정했다면 archive reference로 이동 |
| review 캡처는 모두 옮길까요? | 최종 결과 검증용 1세트만 남기고 나머지는 archive |
