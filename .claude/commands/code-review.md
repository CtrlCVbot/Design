# 코드 리뷰

최근 변경된 코드를 CLAUDE.md 및 skills 규칙에 따라 리뷰합니다.

## 수행 단계

1. **변경 파일 확인**: git diff 또는 최근 편집 파일 확인
2. **관련 skill 로드**: 파일 경로에 따라 해당 skill 읽기
3. **리뷰 수행**:

### 체크리스트

#### Layered Architecture
- [ ] Route Layer: HTTP 관심사만 처리하는가?
- [ ] Service Layer: drizzle/zod 의존성 없는가?
- [ ] Repository Layer: 필요한 컬럼만 select하는가?

#### Domain Model
- [ ] id 값을 가지지 않는가?
- [ ] getter는 필요한 것만 있는가?
- [ ] Rich Domain Model인가? (빈약하지 않은가?)

#### Type Safety
- [ ] 불필요한 `as any` 사용이 없는가?
- [ ] API 경계에 명시적 타입이 있는가?

#### Response DTO
- [ ] ReturnType 추론 활용했는가?
- [ ] 불필요한 interface 정의가 없는가?

## 출력 형식

```
## 코드 리뷰 결과

### ✅ 준수 사항
- ...

### ⚠️ 개선 필요
- 파일: path/to/file.ts:123
  - 문제: ...
  - 권장: ...

### ❌ 규칙 위반
- 파일: path/to/file.ts:45
  - 위반: ...
  - 수정 방법: ...
```
