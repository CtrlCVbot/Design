---
name: zustand
description: "Zustand store 사용 기준. store/ 수정, 전역 상태 추가 시 참조. Atomic selector, API 호출 금지, persist 규칙, 안티패턴 방지를 포함. Zustand store를 생성하거나 수정할 때 이 스킬을 사용할 것."
---

# Zustand Skill

## 적용 시점
- store/ 디렉토리 파일 수정 시
- Zustand store를 사용하는 컴포넌트/hook 수정 시
- 새로운 전역 상태 추가 시

## 필수 참조
- 기준 문서: `docs/standards/zustand.md`
- 갭 분석: `docs/standards/zustand-gap-analysis.md`

## 핵심 규칙

1. **서버 데이터는 Zustand에 넣지 않는다** — React Query 사용
2. **Store에 API 호출(fetch/axios)을 넣지 않는다**
3. **Atomic selector로 구독한다** — `useStore((s) => s.field)` 형태
4. **Actions는 별도 객체로 그룹화한다** — `state.actions.xxx`
5. **God Store 금지** — 상태+액션 15개 이상이면 분리
6. **Persist는 UI preference만** — 서버 데이터 persist 금지

## Zustand vs React Query 판정

아래 중 1개라도 해당하면 React Query:
- 서버가 truth source인 데이터
- refetch/invalidation이 필요한 데이터
- isLoading/error를 직접 관리하는 fetch 로직
- 여러 컴포넌트가 같은 API 응답을 공유
- stale/fresh 판단이나 polling이 필요

## 새 store 생성 체크리스트

- [ ] 클라이언트 전용 상태인가? (서버 데이터면 React Query)
- [ ] `create<T>()(...)` 커링 패턴 사용
- [ ] actions를 별도 객체로 그룹화
- [ ] custom hook으로 export (raw store export 금지)
- [ ] persist 필요 시 partialize로 최소화
