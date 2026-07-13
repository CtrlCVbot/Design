---
name: testing-e2e
description: "E2E 테스트 가이드. Playwright E2E 테스트 작성 시 참조. 페이지 탐색, 셀렉터, 대기 전략, 테스트 격리를 포함. E2E 테스트를 작성하거나 수정할 때 이 스킬을 사용할 것."
---

# E2E Testing Skill

## 적용 조건

- `e2e/**/*.spec.ts` 파일 작업 시
- E2E 테스트 코드 작성 시

---

## 핵심 원칙

```
E2E 테스트는 "핵심 사용자 플로우"만 검증한다.
모든 케이스를 E2E로 커버하려 하지 말 것 - 그건 Unit/Integration의 역할.
```

---

## 대상 (3-5개 핵심 플로우)

1. 로그인 → 목록 조회
2. 상세 → 주요 액션 (정산 처리 등)
3. 필터 적용 → 결과 확인
4. 에러 발생 시 메시지 표시
5. (선택) 모바일 반응형

---

## 테스트 작성 규칙

### 1. 사용자 관점 테스트

```typescript
// ✅ Good: 사용자가 보는 것으로 검증
await expect(page.getByText('정산 완료')).toBeVisible();

// ❌ Bad: 내부 구현 검증
await expect(page.locator('[data-internal-state="completed"]')).toBeVisible();
```

### 2. 안정적인 Selector 사용

```typescript
// ✅ Good: Role, Label, Text 기반
page.getByRole('button', { name: '저장' });
page.getByLabel('이메일');
page.getByText('정산 목록');

// ❌ Bad: CSS 클래스, 내부 구조 의존
page.locator('.btn-primary');
page.locator('div > div > button');
```

### 3. 적절한 대기 전략

```typescript
// ✅ Good: 명시적 대기
await expect(page.getByText('로딩 완료')).toBeVisible();
await page.waitForResponse('**/api/charge/**');

// ❌ Bad: 하드코딩된 대기
await page.waitForTimeout(3000);
```

### 4. 테스트 독립성

```typescript
// ✅ Good: 각 테스트가 독립적
test.beforeEach(async ({ page }) => {
  // 필요한 상태 설정
});

// ❌ Bad: 이전 테스트 결과에 의존
test('두 번째 테스트', async ({ page }) => {
  // 첫 번째 테스트에서 생성한 데이터 사용
});
```

---

## Edge Case 테스트

### 필수 커버 항목

| 카테고리 | 테스트 케이스 |
|----------|---------------|
| **인증** | 비인증 접근 → 리다이렉트 |
| **네트워크** | API 실패 시 에러 표시 |
| **입력** | 잘못된 입력 → 에러 메시지 |
| **빈 상태** | 데이터 없을 때 빈 상태 UI |
| **권한** | 권한 없는 액션 → 에러 처리 |

### 네트워크 에러 테스트

```typescript
test('API 500 에러 시 에러 메시지 표시', async ({ page }) => {
  await page.route('**/api/charge/**', (route) => {
    route.fulfill({
      status: 500,
      body: JSON.stringify({ error: '서버 오류' }),
    });
  });

  await page.goto('/broker/sale');
  await expect(page.getByText(/오류|에러|실패/i)).toBeVisible();
});
```

---

## 테스트 구조

```typescript
/**
 * [기능명] E2E 테스트
 *
 * 테스트 대상:
 * 1. 핵심 플로우 설명
 * 2. 에러 케이스 설명
 */

test.describe('인증 테스트', () => {
  test.describe('로그인', () => {
    test('정상 로그인 시 대시보드로 이동', async ({ page }) => {
      // ...
    });

    test('잘못된 인증 정보 → 에러 메시지', async ({ page }) => {
      // ...
    });
  });
});

test.describe('핵심 플로우', () => {
  test('목록 조회 → 상세 → 액션', async ({ page }) => {
    // ...
  });
});

test.describe('에러 처리', () => {
  test('네트워크 에러 시 에러 표시', async ({ page }) => {
    // ...
  });
});
```

---

## 체크리스트

### 테스트 품질

- [ ] 사용자 관점에서 테스트하는가?
- [ ] Role/Label/Text 기반 selector 사용하는가?
- [ ] 하드코딩된 waitForTimeout 없는가?
- [ ] 각 테스트가 독립적인가?

### 커버리지

- [ ] 핵심 Happy path 커버되는가?
- [ ] 인증 실패 케이스 있는가?
- [ ] 네트워크 에러 케이스 있는가?
- [ ] 빈 상태/에러 상태 UI 테스트 있는가?

### 참고 예시

- `e2e/settlement-flow.spec.ts`
