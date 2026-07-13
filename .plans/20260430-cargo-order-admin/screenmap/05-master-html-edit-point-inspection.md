# Master HTML 수정 지점 조사

## 목적

이 문서는 `master.html?screenmap=1` bridge script를 구현하기 전에, 현재 `cargo-order-admin-hifi-master.html`의 구조와 안전한 수정 지점을 확인한 결과를 정리합니다.

범위는 조사와 구현 방향 확정입니다. 이 단계에서는 `master.html` 코드를 수정하지 않습니다.

## 조사 대상

| 항목 | 경로 |
| --- | --- |
| canonical master | `../wireframes/final-handoff/baseline/html/cargo-order-admin-hifi-master.html` |
| archive 보존본 | `../wireframes/_archive/compact-handoff-20260618/results/html/cargo-order-admin-hifi-master.html` |
| 신규 접수 layer 생성 참고 | `../wireframes/final-handoff/source-snapshot/sections/new-order-registration-flow/build-new-order-registration-flow-html.mjs` |
| local 후보 layer 생성 참고 | `../wireframes/_archive/compact-handoff-20260618/results/html/build-local-hifi-candidate.mjs` |

## 확인 결과

| 항목 | 결과 | 의미 |
| --- | --- | --- |
| master 크기 | 약 22MB | 직접 수작업 편집은 위험함 |
| canonical 위치 | `final-handoff/baseline/html` | screenmap에서는 이 파일을 기준으로 삼아야 함 |
| archive 보존본 | SHA256 동일 | 현재 baseline과 archive master는 같은 파일 |
| 이전 active root | 사용 불필요 | `C:\Work\Dev\Design\.plans\wireframes\cargo-order-admin-20260430`에 의존하지 않아도 됨 |
| 전체 build pipeline | `final-handoff` 안에는 없음 | 재생성보다 최소 layer 삽입이 현실적 |

## HTML 구조

현재 master는 일반적인 단일 HTML처럼 보이지만, 실제로는 wrapper가 내부 template을 풀어내는 구조입니다.

| 구간 | 역할 | 조사 메모 |
| --- | --- | --- |
| outer wrapper | loading thumbnail, asset manifest, unpack script | 브라우저가 처음 실행하는 껍데기 |
| `script[type="__bundler/manifest"]` | font/resource data | 대용량 base64 resource |
| `script[type="__bundler/template"]` | 실제 화면 HTML | `JSON.parse(...)`로 복원됨 |
| unpack script | template 파싱 후 `document.documentElement.replaceWith(...)` 실행 | 실제 화면 DOM으로 교체 |
| inert script 재실행 루프 | template 안의 script를 다시 만들어 실행 | 내부 앱 script 실행 순서를 보존 |

핵심 동작은 아래 순서입니다.

1. outer wrapper가 `script[type="__bundler/template"]` 내용을 `JSON.parse(...)`로 읽습니다.
2. asset UUID를 blob URL로 치환합니다.
3. `DOMParser`로 실제 HTML을 만듭니다.
4. `document.documentElement.replaceWith(doc.documentElement)`로 현재 문서를 교체합니다.
5. 교체된 문서 안의 script들을 다시 생성해 실행합니다.

## 기존 삽입 패턴

이미 같은 master 계열에서 layer 삽입 방식이 사용되고 있습니다.

| 패턴 | 위치 | 방식 |
| --- | --- | --- |
| `NEW_ORDER_REGISTRATION_FLOW_LAYER` | template 내부 `</body>` 직전 | 신규 접수 CSS/JS layer 삽입 |
| `LOCAL_HIFI_MOTION_LAYER` | archive build script 참고 | `__bundler/template`을 JSON parse 후 `</body>` 앞에 삽입 |
| `local-design-feedback-patch` | outer wrapper unpack 후 | wrapper script가 교체된 DOM에 style/chip을 직접 추가 |

bridge script는 기존 신규 접수 layer와 성격이 비슷합니다. 화면 동작에 붙는 작은 runtime layer이므로 template 내부 `</body>` 직전 삽입이 가장 자연스럽습니다.

## 수정 후보 비교

| 후보 | 장점 | 단점 | 판정 |
| --- | --- | --- | --- |
| outer wrapper에 직접 추가 | template JSON을 건드리지 않아도 됨 | 내부 앱 script 실행 전후 타이밍을 별도 조정해야 함 | 보류 |
| template 내부 `</body>` 직전 삽입 | 기존 layer 삽입 패턴과 같고 script 실행 순서가 자연스러움 | 대용량 HTML을 안전하게 재직렬화해야 함 | 권장 |
| 별도 JS 파일로 분리 | bridge 코드 관리가 쉬움 | `file://`와 단일 HTML 배포 기준에서 추가 파일 경로 관리 필요 | 후속 |
| 이전 active root의 원본 수정 | 과거 생성 맥락 추적 가능 | 현재 요구사항의 경로 독립성과 충돌 | 제외 |

## 권장 구현 방식

1차 구현은 `baseline/html/cargo-order-admin-hifi-master.html`의 `__bundler/template`을 파싱해서, template 내부 `</body>` 직전에 아래 layer를 삽입합니다.

```html
<!-- SCREENMAP_BRIDGE_LAYER_START -->
<script id="screenmap-bridge-script">
  /* screenmap=1일 때만 실행 */
</script>
<!-- SCREENMAP_BRIDGE_LAYER_END -->
```

구현 시 원칙:

| 원칙 | 설명 |
| --- | --- |
| idempotent | 이미 `SCREENMAP_BRIDGE_LAYER_START`가 있으면 중복 삽입하지 않음 |
| query gated | `screenmap=1`이 없으면 즉시 종료 |
| normal mode 무영향 | 기본 master 열람 화면에는 marker, debug UI, 스타일 변화를 만들지 않음 |
| fallback 유지 | anchor를 못 찾으면 기존 screenmap fallback marker를 계속 사용 |
| 직접 string 조작 최소화 | `script[type="__bundler/template"]` 내용은 `JSON.parse` 후 수정하고 `JSON.stringify`로 되돌림 |

## 구현 전 체크리스트

| 체크 | 기준 |
| --- | --- |
| 백업 또는 hash 확인 | 수정 전 master SHA256 기록 |
| layer 중복 여부 확인 | `SCREENMAP_BRIDGE_LAYER_START` 검색 |
| template parse 확인 | `script[type="__bundler/template"]` 추출 후 `JSON.parse` 성공 |
| `</body>` 존재 확인 | template 내부 `</body>` 기준으로 삽입 |
| normal mode 확인 | query 없이 master를 열었을 때 화면 변화 없음 |
| screenmap mode 확인 | `?screenmap=1`에서 `screenmap.anchor-rects` postMessage 발생 |

## 구현 결론

`04-master-screenmap-bridge-design.md`의 bridge contract를 기준으로, template 내부 `</body>` 직전에 `SCREENMAP_BRIDGE_LAYER`를 삽입하는 방식을 확정했습니다.

이 결론에 따라 1차 bridge layer 삽입까지 완료했습니다. 이후 부모 screenmap 쪽에서 `screenmap.anchor-rects` message를 받아 그룹 1 marker 좌표를 live DOM 기준으로 갱신하는 작업도 1차 완료했습니다.

## 구현 결과

구현일: `2026-06-18`

| 항목 | 결과 |
| --- | --- |
| 삽입 도구 | `tools/inject-screenmap-bridge.mjs` 추가 |
| 삽입 위치 | `__bundler/template` 내부 `</body>` 직전 |
| 중복 삽입 방지 | 재실행 시 `changed: false` 확인 |
| layer marker | `SCREENMAP_BRIDGE_LAYER_START` 1개 확인 |
| 일반 master mode | query가 없을 때 `window.__screenmapBridge` 없음 |
| screenmap mode | `screenmap.anchor-rects` message 송신 확인 |
| parent marker sync | `screenmap/app.js`가 live 좌표로 그룹 1 marker 5개 갱신 |
| core view filter | `screenmap=1`에서 `.list-ph`, `.ds-section.showcase` 숨김 |
| no internal scroll | iframe `scrollY=0`, `innerHeight=scrollHeight` 기준으로 marker/focus sync |
| target metadata | bridge가 `tagName`, `role`, `className`, `text`, `isButton`을 함께 송신 |
| button callout | 부모 screenmap이 버튼형 target marker를 버튼 바깥에 표시 |

다음 구현은 그룹 2~7 확장 전에 동적 상태별 anchor map, fallback 표시 정책, 추가 `screenmapView` 분리 여부를 정리하는 작업입니다.
