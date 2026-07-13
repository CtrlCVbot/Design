---
name: testing-frontend
description: "프론트엔드 테스트 가이드. React 컴포넌트 테스트 작성 시 참조. Testing Library, userEvent, render 패턴을 포함. 프론트엔드 테스트를 작성하거나 수정할 때 이 스킬을 사용할 것."
---

# Frontend Testing Skill

## 적용 조건

- `components/**/__tests__/*.tsx` 파일 작업 시
- 프론트엔드 테스트 코드 작성 시

---

## Unit Test

### 대상

- 데이터 변환 함수 (formatCurrency, toViewModel 등)
- 유틸리티 함수 (calculateNetAmount 등)

### 규칙

- 순수 함수만 테스트 (입력 → 출력)
- 컴포넌트 렌더링 없이 함수만 테스트

---

## Integration Test (컴포넌트)

### 대상

- 필터 컴포넌트 (상태 변경 → API 파라미터)
- 탭/페이지 전환 (상태 초기화)
- 버튼/폼 동작 (클릭 → 핸들러)
- 데이터 표시 (API 응답 → 렌더링)

### Mock 전략

| 대상                       | 전략               | 이유          |
|--------------------------|------------------|-------------|
| Zustand Store            | **실제 사용**        | 실제 상태 변경 검증 |
| API (fetch)              | Mock             | 외부 의존성      |
| Router (next/navigation) | Mock             | 외부 의존성      |
| Date/Time                | vi.setSystemTime | 테스트 안정화     |

### 테스트 작성 원칙

```
Behavior 테스트: "버튼 클릭 → store 상태 변경" 검증
Implementation 테스트 금지: mock 호출 여부만 검증하지 말 것
User-centric: 실제 사용자 흐름 시뮬레이션
```

### 안티패턴 vs 올바른 패턴

```typescript
// ❌ Bad: Mock을 테스트 (자명한 테스트)
mockSetFilter({date: '2024-01-01'});
expect(mockSetFilter).toHaveBeenCalled();

// ✅ Good: 실제 동작 테스트
fireEvent.click(screen.getByRole('button', {name: '오늘'}));
const state = useBrokerChargeStore.getState();
expect(state.filter.startDate).toBe('2024-01-01');
```

## 체크리스트

### Unit Test

- [ ] 순수 함수만 테스트하는가?
- [ ] 입력 → 출력만 검증하는가?

### Integration Test

- [ ] Zustand Store를 실제로 사용하는가? (mock 금지)
- [ ] 외부 의존성(fetch, router)만 mock하는가?
- [ ] Behavior를 테스트하는가? (mock 호출 검증 금지)
- [ ] 사용자 관점에서 테스트하는가?
