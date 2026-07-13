# Evidence Index

G-UI와 이후 production closeout 증거를 저장한다.

```text
evidence/
├─ screenshots/
│  ├─ g-ui-initial-registration.png
│  ├─ g-ui-initial-dispatch-list.png
│  ├─ g-ui-inline-detail.png
│  ├─ g-ui-driver-assignment.png
│  ├─ g-ui-location-recommendations.png
│  ├─ g-ui-r1-client-search.png
│  ├─ g-ui-r1-inline-detail.png
│  ├─ g-ui-r2-inline-detail.png
│  ├─ g-ui-r3-dispatch-search.png
│  ├─ g-ui-r4-default.png
│  ├─ g-ui-r4-custom-date.png
│  ├─ g-ui-r4-no-result.png
│  ├─ g-ui-r4-detail-feedback.png
│  ├─ g-ui-r4-1280-column-scroll.png
│  └─ g-ui-r4-767-single-column.png
├─ visual-gap/
│  ├─ 01-g-ui-fidelity-report.md
│  ├─ 02-g-ui-r1-code-fidelity-report.md
│  ├─ 03-g-ui-r2-inline-detail-fidelity-report.md
│  ├─ 04-g-ui-r3-search-fidelity-report.md
│  └─ 05-g-ui-r4-design-detail-fidelity-report.md
└─ verification/
   ├─ 01-ui-prototype-verification.md
   ├─ 02-g-ui-r1-verification.md
   ├─ 03-g-ui-r2-inline-detail-verification.md
   ├─ 04-g-ui-r3-search-verification.md
   └─ 05-g-ui-r4-design-detail-verification.md
```

현재 상태: G-UI Revision 4 DD-01~12 전체 적용·자동 검증·브라우저 computed style/interaction/responsive QA 완료, 사용자 재판정 대기.

넓은 viewport의 in-app browser 캡처에서 가장자리 타일링이 발생해 screenshot은 유효 렌더 영역을 상태별로 분할·crop했다. DOM viewport·interaction·console 검증은 별도로 수행했으며 이 제한은 visual-gap 보고서에 기록한다.
