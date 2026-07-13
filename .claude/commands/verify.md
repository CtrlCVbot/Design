# 백엔드 테스트 품질 검증

변경된 백엔드 코드와 관련된 테스트의 품질을 검증합니다.

> 규칙: `.claude/skills/testing.md` 참조

---

## 리뷰 원칙

```
🎯 Google Staff Engineer 레벨의 엄격한 기준으로 검증할 것

테스트는 "있다"가 아니라 "제대로 있다"가 중요하다.
Happy path만 커버하는 테스트는 없는 것과 같다.
```

### 필수 검증 항목

1. **핵심 비즈니스 로직 커버리지**
   - 이 기능의 핵심 동작이 테스트되고 있는가?
   - 돈, 상태 전이, 권한 등 중요한 로직이 빠짐없이 검증되는가?

2. **Edge Case 커버리지**
   - 경계값 (0, null, undefined, 빈 배열, 최대값)
   - 비정상 입력 (잘못된 타입, 누락된 필드)
   - 동시성/순서 문제 (중복 요청, 순서 뒤바뀜)

3. **Error Case 커버리지**
   - 실패 시나리오가 테스트되는가?
   - 에러 메시지/코드가 올바른가?
   - 롤백/복구가 제대로 되는가?

4. **Happy Path만 있진 않은가?**
   - "성공하면 성공한다" 같은 자명한 테스트 금지
   - 실패 케이스 없이 성공만 테스트하면 ❌

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

`server/**`, `tests/**` 경로의 변경 파일 필터링

### 2단계: 관련 테스트 파일 찾기

| 소스 파일 | 테스트 파일 |
|-----------|-------------|
| `server/{module}/domain/**` | `tests/unit/domain/**` |
| `server/{module}/services/**` | `tests/unit/services/**` |
| `server/{module}/route.ts` | `tests/integration/api/{module}/**` |

### 3단계: 테스트 파일 읽고 검증

`.claude/skills/testing.md` 체크리스트 기준으로 검증:

#### Unit Test (Domain)
- [ ] SUT만 테스트하는가?
- [ ] getter, equals 테스트가 없는가?
- [ ] 비즈니스 로직을 테스트하는가?

#### Unit Test (Service)
- [ ] 모듈간 조율만 테스트하는가?
- [ ] 도메인 로직을 테스트하지 않는가?
- [ ] repository 구현을 테스트하지 않는가?
- [ ] mock이 적절히 사용되었는가?

#### Integration Test
- [ ] 트랜잭션 단위를 테스트하는가?
- [ ] API 응답 DTO로 검증하는가?
- [ ] DB select 남용이 없는가?

### 4단계: 커버리지 분석

- [ ] Happy path 테스트 존재?
- [ ] Edge case 테스트 존재?
- [ ] Error case 테스트 존재?
- [ ] 무의미한/중복 테스트 없음?

## 출력 형식

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔍 BACKEND TEST QUALITY REPORT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📁 분석된 테스트 파일:
  - tests/unit/domain/xxx.test.ts
  - tests/unit/services/xxx.test.ts

✅ 통과:
  - [Unit/Domain] SUT만 테스트함
  - [Unit/Service] 모듈간 조율 테스트 적절함

⚠️ 개선 필요:
  - 파일:줄번호 - 문제 설명

❌ 규칙 위반:
  - 파일:줄번호 - 위반 내용 및 수정 방법

📊 커버리지:
  - Happy path: ✅
  - Edge case: ⚠️ 부족
  - Error case: ✅

💡 권장 사항:
  1. ...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```
