# 프론트엔드 테스트 품질 검증

변경된 프론트엔드 코드와 관련된 테스트의 품질을 검증합니다.

> 규칙: `.claude/skills/testing-frontend.md` 참조

---

## 리뷰 원칙

```
🎯 Google Staff Engineer 레벨의 엄격한 기준으로 검증할 것

테스트는 "있다"가 아니라 "제대로 있다"가 중요하다.
Happy path만 커버하는 테스트는 없는 것과 같다.
```

### 필수 검증 항목

1. **핵심 사용자 시나리오 커버리지**
   - 이 컴포넌트의 핵심 동작이 테스트되고 있는가?
   - 필터, 정렬, 페이지네이션 등 주요 인터랙션이 검증되는가?

2. **Edge Case 커버리지**
   - 경계값 (빈 데이터, 긴 텍스트, 특수문자)
   - 비정상 상태 (로딩 중 클릭, 빠른 연속 클릭)
   - 빈 상태/에러 상태 UI

3. **Error Case 커버리지**
   - API 실패 시 UI가 올바르게 표시되는가?
   - 에러 메시지가 사용자에게 보이는가?
   - 에러 후 복구가 가능한가?

4. **Happy Path만 있진 않은가?**
   - "클릭하면 동작한다" 같은 자명한 테스트 금지
   - 실패/에러 케이스 없이 성공만 테스트하면 ❌

---

## 수행 단계

### 1단계: 변경 파일 파악

**세션에서 변경된 파일 확인:**

```bash
cat %TEMP%/claude-edits.log | jq -r '.filePath' | sort -u
```

또는 Windows PowerShell:
```powershell
Get-Content $env:TEMP/claude-edits.log | ConvertFrom-Json | Select-Object -ExpandProperty filePath | Sort-Object -Unique
```

`components/**`, `hooks/**`, `store/**`, `utils/**` 경로의 변경 파일 필터링

### 2단계: 관련 테스트 파일 찾기

| 소스 파일 | 테스트 파일 |
|-----------|-------------|
| `components/{path}/*.tsx` | `components/{path}/__tests__/*.test.tsx` |
| `utils/**` | `tests/utils/**` |
| `hooks/**` | 해당 컴포넌트 테스트에서 검증 |

### 3단계: 테스트 파일 읽고 검증

`.claude/skills/testing-frontend.md` 체크리스트 기준으로 검증:

#### Unit Test
- [ ] 순수 함수만 테스트하는가?
- [ ] 입력 → 출력만 검증하는가?

#### Integration Test (컴포넌트)
- [ ] Zustand Store를 실제로 사용하는가? (mock 금지)
- [ ] 외부 의존성(fetch, router)만 mock하는가?
- [ ] Behavior를 테스트하는가?
- [ ] mock 호출만 검증하지 않는가?
- [ ] 사용자 관점에서 테스트하는가?

### 4단계: 안티패턴 감지

```typescript
// ❌ 감지 대상: Mock을 테스트 (자명한 테스트)
mockSetFilter({ ... });
expect(mockSetFilter).toHaveBeenCalled();

// ❌ 감지 대상: Store를 mock
vi.mock('@/store/xxx-store');
```

### 5단계: 커버리지 분석

- [ ] Happy path 테스트 존재?
- [ ] Edge case 테스트 존재?
- [ ] Error case 테스트 존재?
- [ ] 사용자 시나리오 커버?

## 출력 형식

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔍 FRONTEND TEST QUALITY REPORT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📁 분석된 테스트 파일:
  - components/broker/order/__tests__/xxx.test.tsx

✅ 통과:
  - [Integration] Zustand Store 실제 사용
  - [Integration] Behavior 테스트 적절함

⚠️ 개선 필요:
  - 파일:줄번호 - 문제 설명

❌ 규칙 위반:
  - 파일:줄번호 - mock 호출만 검증함 (Behavior 테스트로 변경 필요)

📊 커버리지:
  - Happy path: ✅
  - Edge case: ✅
  - Error case: ⚠️ API 에러 케이스 부족

💡 권장 사항:
  1. ...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```
