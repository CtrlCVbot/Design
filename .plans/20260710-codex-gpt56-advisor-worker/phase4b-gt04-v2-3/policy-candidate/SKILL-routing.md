## Routing Disclosure

`Routing` 결정 직후, 비단순 산출물 작업의 첫 commentary 메시지 전에 다음 다섯 필드 Advisor/Worker 경로 블록을 공개한다.

Advisor/Worker route
- mode: direct | delegated
- advisor: <model>/<effort> | unavailable
- worker: none | <role> (<model>/<effort> | config-derived)
- orchestration skill: invoked | not-invoked
- reason: <matched trigger or exclusion>

간단한 질의는 이 공개를 생략할 수 있다. `docs-only` 또는 `review-only`의 직접 경로에서는 `direct`, `none`, `not-invoked`를 공개한다. 메인 model 또는 effort를 확인할 수 없으면 추측하지 않고 `unavailable`로 표시한다. 위임 경로에서는 spawn 전에 확인된 설정값을 공개하고, closeout에서 실제 증거로 model과 effort를 정정한다. 공개 자체는 `docs-only` 또는 `review-only` 작업의 위임 범위를 넓히지 않는다.
