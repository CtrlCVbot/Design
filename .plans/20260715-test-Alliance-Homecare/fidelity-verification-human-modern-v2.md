# 새소망 방문요양 Human Modern V2 검증 보고서

## 판정

- 최종 판정: **PASS**
- 대상: `apps/alliance-homecare`의 `/`, `/v1`, `/v2`
- 기준: `UI UX 고도화 제안 - 휴먼 모던 v1.html`
- 확인일: 2026-07-16

## 결과 요약

| 영역 | 결과 | 근거 |
| --- | --- | --- |
| V1 보존 | PASS | `/`와 `/v1`이 기존 홈 구성을 유지하며 버전 선택기만 추가됨 |
| V2 프레임 | PASS | full-bleed hero, fixed overlay nav, 스크롤 후 solid nav 적용 |
| 반응형 | PASS | 390×844 사전 캡처와 모바일 CSS 계약 테스트, 가로 넘침 없음 |
| 인터랙션 | PASS | 서비스 아코디언 단일 열림, 4개 테마 전환, 모션 축소 규칙 확인 |
| 접근성 | PASS | semantic button, `aria-expanded`, `focus-visible`, 44px 이상 모바일 동작 영역 확인 |
| 이미지 | PASS | `next/image`, hero priority, relative fill wrapper, broken image 0 |
| 품질 게이트 | PASS | test 36/36, lint 0 warning/error, production build 성공 |

## 시각 증거

- 기준 데스크톱: `evidence-human-modern-v2/reference-desktop-1440x960.png`
- 기준 모바일: `evidence-human-modern-v2/reference-mobile-390x844.png`
- V1 데스크톱/모바일: `app-v1-desktop-1440x960.png`, `app-v1-mobile-390x844.png`
- V2 데스크톱: `app-v2-desktop-1280x720-final.png`
- V2 모바일: `app-v2-mobile-390x844.png`

## 보정 내역

| ID | 보정 | 결과 |
| --- | --- | --- |
| HM-VF-01 | V2 nav를 hero 위 fixed overlay로 전환 | 해결 |
| HM-VF-02 | 실제 돌봄·간판 이미지를 `next/image`로 적용 | 해결 |
| HM-VF-03 | 서비스 카드 반복을 큰 단일 열림 아코디언으로 전환 | 해결 |
| HM-VF-04 | 모바일 빠른 상담과 버전 선택기의 충돌 제거 | 해결 |
| HM-VF-05 | nav depth, reveal, reduced-motion 적용 | 해결 |
| HM-VF-06 | 네 테마와 V1/V2 비교 경로 제공 | 해결 |

## 제한과 수용 범위

- 보정 후 브라우저 세션의 viewport override가 적용되지 않아 최종 모바일 raster를 다시 저장하지 못했습니다. 보정 전 390×844 화면, 보정 CSS 계약 테스트, 전체 테스트로 겹침 제거를 확인했습니다.
- 돌봄 사진은 콘셉트 검수용 임시 자산입니다. 실제 운영 사진으로 교체할 때 같은 crop과 대비 규칙을 유지합니다.
