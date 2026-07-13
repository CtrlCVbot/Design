# G-UI R1 Code Fidelity Report

- mode: review/closeout
- source of truth: `nb-main` source code
- target: `/test/broker-order-console-new`
- verdict: `LIMITED — code fidelity PASS, user visual gate pending`

## 사용자 피드백 반영

| R1 | 반영 내용 | code evidence | 결과 |
|---|---|---|---|
| R1-01 | 거래처 검색 right pane | `ClientSearchPane`, `rightMode=clientSearch` | PASS |
| R1-02 | full-width frame | `.workspace width:100%; max-width:none; 40fr/60fr` | PASS |
| R1-03 | motion | 200/350ms token, pane 220ms, detail 300ms, press 0.97 | PASS |
| R1-04 | 상세 구조 | advisor + 55/45 + left detail + right control stack | PASS |
| R1-05 | 세부 디자인 | code token map, heading rail, field·badge·segment treatment | PASS |

## Reference anchor 대조

| reference | target 대응 |
|---|---|
| `Dispatches.tsx:4821-4924` client search | `client-search-pane.tsx` |
| `index.css:551-567` 40/60 full frame | `prototype.module.css .workspace` |
| `index.css:688-702` pane motion | `paneEnter 220ms` |
| `Dispatches.tsx:5129` detail enter | `detailEnter 300ms` |
| `Dispatches.tsx:5217-5525` left detail | route timeline·transport·memo context |
| `Dispatches.tsx:5532-5725` fee control | `운임 및 수수료 정보 수정` card |
| `Dispatches.tsx:5727-5864` driver/status | driver grid·6-state segment |
| `ui.tsx:3-53` press feedback | route scope button `scale(0.97)` |

## Risk-based self-review

| 이슈 | Impact | Reach | Recovery | Total | Severity | Confidence | Action |
|---|---:|---:|---:|---:|---|---|---|
| 거래처 검색 화면 누락 | 3 | 3 | 1 | 7 | high | confirmed | auto-fixed |
| desktop 중앙 max-width | 2 | 3 | 1 | 6 | high | confirmed | auto-fixed |
| motion contract 누락 | 2 | 3 | 1 | 6 | high | confirmed | auto-fixed |
| 상세 2×2 구조 drift | 3 | 2 | 1 | 6 | high | confirmed | auto-fixed |
| heading·field·segment token drift | 2 | 2 | 1 | 5 | high | confirmed | auto-fixed |
| route-local CSS 약 1,300줄 | 1 | 2 | 1 | 4 | medium | confirmed | queued after G-UI |
| 운임 증감·수정은 visual-only | 2 | 1 | 0 | 3 | medium | confirmed | needs-user-input after G-UI |
| 넓은 화면 자동 capture 타일링 | 1 | 1 | 0 | 2 | low | confirmed | DOM·computed evidence로 보완 |

critical/high 잔여 fidelity gap은 확인되지 않았다.

## 의도된 미연결

- 운임·수수료 quick control은 이번 R1에서 원본 section의 시각 구조만 제공한다.
- 상태 변경은 route-local demo transition까지 제공한다.
- AI·위치·통계 판단은 가짜 데이터 대신 deferred strip을 유지한다.
- 대화방·경유지 저장·실제 거래처 조회는 Phase B 또는 별도 승인 대상이다.

## 사용자 재검수 항목

1. 화면 폭이 충분히 채워지는지
2. 검색 pane의 정보 밀도·선택 흐름
3. 상세의 좌 상세 / 우 control 위계
4. pane·detail 진입 motion과 button press 감각
5. field·badge·segment의 색·간격·크기

사용자 `G-UI approved` 전까지 Phase B는 시작하지 않는다.
