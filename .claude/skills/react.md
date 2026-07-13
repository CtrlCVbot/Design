---
name: react
description: "React 컴포넌트 작성 기준. 컴포넌트, state, effect, 메모이제이션 작업 시 참조. hooks 규칙, 렌더링 최적화, 커스텀 훅 추출을 포함. React 컴포넌트를 생성하거나 수정할 때 이 스킬을 사용할 것."
---

# React Skill

## 적용 시점
- 컴포넌트 작성/수정 시
- useState, useEffect, useMemo, useCallback 사용 시
- 커스텀 훅 작성 시

## 필수 참조
- 프로젝트 규칙: `docs/standards/react/06-project-rules.md`

## 심화 참조 (해당 상황에서 읽을 것)
- 컴포넌트 분리/합성 고민 → `docs/standards/react/01-components-and-composition.md`
- state 구조 설계/리팩토링 → `docs/standards/react/02-state-and-derived-state.md`
- useReducer 전환 검토 → `docs/standards/react/02-1-reducer-and-immutability.md`
- useEffect 사용 여부 판단 → `docs/standards/react/03-effects-and-synchronization.md`
- 렌더링 성능 문제 → `docs/standards/react/04-rendering-performance-and-memoization.md`
- 폼/이벤트 처리 → `docs/standards/react/05-forms-events-and-controlled-vs-uncontrolled.md`
- 현재 코드 위반 현황 → `docs/standards/react/gap-analysis.md`

## 핵심 규칙

1. **계산 가능하면 state 아닌 렌더 시 계산** — derived state는 useMemo 또는 직접 계산
1-1. **5+ useState면 useReducer 검토** — 상태 머신, 디버깅, 테스트 용이
1-2. **상태는 불변** — 객체/배열은 새로 만들어 교체 (mutation 금지)
2. **Effect는 외부 동기화 전용** — 이벤트로 처리 가능하면 이벤트 핸들러
3. **측정 없는 메모이제이션 금지** — useCallback은 React.memo와 함께
4. **컴포넌트 안에 컴포넌트 정의 금지** — 상태 초기화 버그
5. **index-as-key 금지** — 고유 ID 사용
6. **props를 state에 복사 금지** — 직접 사용
7. **라이프사이클 훅 금지** — useMount, useEffectOnce 등

## 새 컴포넌트 체크리스트

- [ ] 단일 책임 확인 (커지면 분리)
- [ ] state: 계산 가능한 값은 state 대신 직접 계산
- [ ] state: 관련 상태는 그룹화 (5+면 useReducer 검토)
- [ ] state: 객체/배열은 불변 업데이트 (spread, map, filter)
- [ ] Effect: 이벤트로 충분하면 Effect 사용 안 함
- [ ] key: 리스트에 고유 ID 사용
- [ ] 폼: RHF + Zod (`react-hook-form-zod.md` 참조)
