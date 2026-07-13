---
name: domain-modeling
description: "Rich Domain Model 설계 가이드. 도메인 모델, Value Object, Aggregate 작업 시 참조. 상태 전이, 검증 로직, id 금지 규칙을 포함. server/**/domain/ 하위 파일을 작성하거나 수정할 때 이 스킬을 사용할 것."
---

# Domain Modeling Skill

## 적용 조건

- `server/**/domain/**/*.ts` 파일 작업 시
- 도메인 모델, Value Object, Aggregate 관련 작업 시

## 핵심 원칙

- Rich Domain Model 설계 (빈약한 도메인 모델 금지)
- Testability 확보: **mock은 외부 의존성만**

## 규칙

### Domain Model

- getter는 정말 필요한지 판단하고 만들고 무작정 만들지 않는다
- 도메인 모델은 id 값을 가지지 않는다
- Entity는 사용하지 않고, 도메인 모델에서 DB drizzle 스키마만 가져다 쓴다
- getters는 `dispatch-memo-model`처럼 한줄로 간단하게 정리한다

### Error 위치

- error 파일의 위치는 `domain/해당서비스/errors/`에 위치시킨다
- 예: `server/charge/domain/errors/charge-group.errors.ts`

---

## Rich Domain Model 패턴

### 동기

- 서비스 테스트에서 내부 모듈(repository 등)을 mocking하면 구현 로직이 잘못된 레이어에 있다는 신호
- **도메인 로직은 도메인 모델에, 서비스는 오케스트레이션만**

### 패턴: 내부 상태 직접 변경 + getChanges()

```typescript
// ❌ Bad: Partial<Entity> 반환 (상태 변경 없음)
toSharing(actionType
:
ActionType
):
Partial < Entity > {
    return {shareStatus: 'SHARING', lastActionType: actionType};
}

// ✅ Good: 내부 상태 직접 변경
startSharing(actionType
:
ActionType
):
void {
    this.ensureCanStartSharing(actionType);  // 검증도 도메인에서
    this._shareStatus = 'SHARING';
    this._lastActionType = actionType;
    this._dirty = true;
}

// Repository 저장용
getChanges()
:
Partial<Entity> | null
{
    if (!this._dirty) return null;
    return {shareStatus: this._shareStatus, ...};
}
```

### Repository 패턴

```typescript
// Repository에 save 메서드 추가
async
save(model
:
DomainModel, tx ? : Transaction
):
Promise < void > {
    const changes = model.getChanges();
    if(!
changes
)
return;
await this.update(model.id, changes, tx);
model.clearDirty();
}
```

### 서비스는 오케스트레이션만

```typescript
async
execute(request)
{
    // 1. 데이터 로드
    const model = await this.repository.findById(id);

    // 2. 도메인 로직 (순수 함수처럼 동작)
    model.doSomething();  // 검증 + 상태 전이

    // 3. 저장
    await this.repository.save(model, tx);
}
```

### 테스트 전략

| 레이어     | Mock    | 테스트 대상       |
|---------|---------|--------------|
| Domain  | 없음      | 상태 전이, 검증 규칙 |
| Service | 외부 API만 | 오케스트레이션 플로우  |

```typescript
// Domain test: mock 없이
test('상태 전이', () => {
    const model = Model.createNew();
    model.startSharing('REGISTER');
    expect(model.status).toBe('SHARING');
});

// Service test: API만 mock
beforeEach(() => {
    vi.mocked(apiClient.call).mockResolvedValue({...});
});
```
