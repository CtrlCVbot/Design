# Visual Handoff Hub Draft

## 목적

이 폴더는 실제 visual handoff hub를 만들기 전의 설계와 데이터 초안을 보관합니다.

현재 단계에서는 `index.html`을 만들지 않습니다. 실제 HTML hub 생성은 별도 승인 후 진행합니다.

## 파일 구성

| 파일 | 역할 |
| --- | --- |
| `../data/final-baseline.json` | 공통 최종 기준 데이터. state, section, data contract, validation, API, policy, QA |
| `data/hub-map.json` | flow와 screen node 구조 |
| `data/source-links.json` | node별 원문 source 연결 |
| `data/qa-map.json` | node별 acceptance criteria와 QA 연결 |
| `previews/` | 후속 preview image 저장 위치 |

## 후속 구현 원칙

1. 왼쪽은 업무 흐름과 화면 상태 목록입니다.
2. 가운데는 선택된 상태의 화면 preview와 publishing 기준입니다.
3. 오른쪽은 기능 설명, data contract, validation, API/권한/정책, QA를 보여줍니다.
4. `.md` 원문은 source로 유지하고 hub는 원문을 탐색하게 하는 layer입니다.
5. `cargo-order-admin-hifi-master.html`은 최종 publishing 기준이지만, hub 안에 전체 iframe으로 상시 로드하지 않습니다.
