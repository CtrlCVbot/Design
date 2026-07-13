# Toast 알림 정책

토스트 추가/수정 시 이 문서를 따른다. (배경: 2026-06 토스트 전수 개선 — 거짓 토스트 제거,
generic 에러 통일, 중복 안내 제거. 커밋 `1752f946`·`61a62a30`·`fac7c771`·`cd00a6ce`)

## 표준 진입점: ToastUtils (`lib/toast.ts`)

신규 코드는 **`ToastUtils` 만** 사용한다. sonner `toast` 직접 호출과
`components/ui/use-toast` 어댑터(deprecated)는 신규 사용 금지.

ToastUtils 에만 있는 것:

- **중복 방지**: 같은 타입+제목+설명이면 같은 id → 연타/이중 호출이 화면에 겹치지 않음
- **Sentry breadcrumb**: 사용자에게 보여진 에러가 장애 조사 시 맥락으로 남음 (`apiError`)
- **일관 정책**: 에러 8초 / 경고 7초 / 일반 5초, bottom-right

| 상황 | 호출 |
|---|---|
| API/mutation 실패 catch | `ToastUtils.apiError(error, '…에 실패했습니다.')` — 서버 사유 우선, fallback 문구는 둘째 인자 |
| 성공 안내 (띄울 가치가 있을 때만) | `ToastUtils.success('…되었습니다.')` |
| 폼 필드 에러 묶음 | `ToastUtils.formError(title, fieldErrors)` |
| 장시간 작업 | `ToastUtils.loading()` + `update()` 또는 `promise()` |

`catch` 에서 고정 문구 `toast.error("…")` 를 쓰면 서버가 내려준 차단 사유(409 등)가
사용자에게 전달되지 않는다 — 반드시 `apiError` 경유.

## 토스트를 띄우지 말아야 하는 경우

1. **결과가 화면에 즉시 드러나는 액션** — 새로고침("마지막 업데이트" 라벨), 필터 적용,
   폼 필드 자동 채움, 토글. 화면이 이미 말해주는 것을 토스트로 중복 안내하지 않는다.
2. **선제 자동 실행** — 자동 설정/자동 갱신은 조용히 수행하고 배지·라벨로 표시.
   (볼타: "확실한 것은 조용히 처리하고, 판단이 필요한 것만 건넨다")
3. **내부 invariant 위반** — "ID가 필요합니다" 류는 사용자가 행동할 수 없다.
   `console.error` 로 로그만 남기고 토스트 금지.
4. **미구현 기능** — "준비 중입니다" 토스트로 때우지 않는다. 버튼을 숨기거나 disabled.
5. **실제 일어나지 않은 일** — 저장/전송 없이 성공 토스트 금지 (거짓 토스트).

## 토스트 때문에 UX 를 지연시키지 않는다

토스트는 전역 렌더라 시트/다이얼로그를 닫거나 페이지를 이동해도 유지된다.
`setTimeout(닫기/이동, N)` 으로 토스트 노출 시간을 벌지 말 것.

## 다음 행동 제안 (action 버튼)

차단 에러는 사용자의 의도(원하는 것)와 장애물(막는 것)을 둘 다 아는 순간이다.
해결 경로가 제품 안에 있으면 토스트에 action 으로 입구를 단다:

```typescript
ToastUtils.error('세금계산서가 발행된 정산은 삭제할 수 없습니다.', undefined, {
  // sonner action — ToastUtils 옵션 확장 필요 시 lib/toast.ts 에 추가
});
```

(action 패턴은 G 작업에서 표준화 예정 — 그 전까지는 케이스별 판단)

## 마이그레이션 (점진)

- `components/ui/use-toast` 어댑터(30파일)·sonner 직접 호출(50+파일)은 **해당 파일을
  다른 이유로 수정할 때** ToastUtils 로 함께 이관한다. 일괄 치환 PR 금지(리뷰 불가 규모).
- 어댑터 신규 import 금지 — `@deprecated` JSDoc 참조.
