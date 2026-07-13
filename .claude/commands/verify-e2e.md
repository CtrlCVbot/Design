# E2E 테스트 품질 검증

변경된 코드와 관련된 E2E 테스트의 품질을 검증합니다.

> 규칙: `.claude/skills/testing-e2e.md` 참조

---

## 리뷰 원칙

```
🎯 Google Staff Engineer 레벨의 엄격한 기준으로 검증할 것

E2E 테스트는 "핵심 플로우"가 제대로 검증되는지가 핵심이다.
Happy path만 있고 에러 케이스가 없으면 불완전한 테스트다.
```

### 필수 검증 항목

1. **해당 커밋의 변경사항 커버리지**
   - 이번 변경으로 영향받는 사용자 플로우가 테스트되는가?
   - 새로 추가된 기능/화면이 E2E에 반영되었는가?

2. **핵심 플로우 커버리지**
   - 사용자의 주요 여정이 테스트되는가?
   - 돈/상태 전이 등 중요한 액션이 검증되는가?

3. **Edge Case 커버리지**
   - 인증 실패 (비인증 접근, 잘못된 인증)
   - 네트워크 에러 (API 실패, 타임아웃)
   - 빈 상태 (데이터 없음)
   - 잘못된 입력

4. **Happy Path만 있진 않은가?**
   - 성공 케이스만 테스트하면 ❌
   - 에러/실패 케이스 필수

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

변경된 페이지/기능 확인:
- `app/**` → 어떤 페이지가 변경되었는가?
- `components/**` → 어떤 UI가 변경되었는가?

### 2단계: 관련 E2E 테스트 파일 찾기

| 변경 영역 | E2E 테스트 파일 |
|-----------|-----------------|
| 정산 관련 | `e2e/settlement-flow.spec.ts` |
| 로그인/인증 | `e2e/auth.spec.ts` |
| 필터 관련 | `e2e/filter-*.spec.ts` |

### 3단계: 테스트 파일 읽고 검증

`.claude/skills/testing-e2e.md` 체크리스트 기준으로 검증:

#### 테스트 품질
- [ ] 사용자 관점에서 테스트하는가?
- [ ] Role/Label/Text 기반 selector 사용하는가?
- [ ] 하드코딩된 waitForTimeout 없는가?
- [ ] 각 테스트가 독립적인가?

#### 커버리지
- [ ] 핵심 Happy path 커버되는가?
- [ ] 인증 실패 케이스 있는가?
- [ ] 네트워크 에러 케이스 있는가?
- [ ] 빈 상태/에러 상태 UI 테스트 있는가?

### 4단계: 안티패턴 감지

```typescript
// ❌ 감지 대상: 하드코딩된 대기
await page.waitForTimeout(3000);

// ❌ 감지 대상: CSS 클래스 기반 selector
page.locator('.btn-primary');
page.locator('div > div > button');

// ❌ 감지 대상: 테스트 간 의존성
// 이전 테스트 결과에 의존하는 코드
```

---

## 출력 형식

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔍 E2E TEST QUALITY REPORT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📁 분석된 테스트 파일:
  - e2e/settlement-flow.spec.ts

🎯 변경사항 커버리지:
  - 변경된 페이지: /broker/sale
  - 관련 E2E 테스트: ✅ 존재함

✅ 통과:
  - [품질] 사용자 관점 테스트
  - [품질] Role 기반 selector 사용

⚠️ 개선 필요:
  - 파일:줄번호 - waitForTimeout 사용 (명시적 대기로 변경 권장)

❌ 규칙 위반:
  - 파일:줄번호 - CSS 클래스 기반 selector 사용

📊 커버리지:
  - Happy path: ✅
  - 인증 에러: ✅
  - 네트워크 에러: ⚠️ 부족
  - 빈 상태: ❌ 없음

💡 권장 사항:
  1. 네트워크 에러 테스트 추가
  2. 빈 데이터 상태 테스트 추가
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```
