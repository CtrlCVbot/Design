---
name: refactoring
description: "리팩토링 워크플로우. /refactor 명령 또는 리팩토링 작업 시 참조. Before/After 체크리스트, Test-First 순서, Google Staff Engineer 품질 기준을 포함. 코드 리팩토링을 수행할 때 반드시 이 스킬을 사용할 것."
---

# Refactoring Skill - Google Staff Engineer 품질 기준

## 적용 조건

- 리팩토링 작업 시
- 코드 품질 개선 요청 시

---

## 핵심 원칙

### 0. 테스트 먼저 작성

```
리팩토링 = 테스트 작성 → 프로덕션 코드 리팩토링
```

**리팩토링 작업 순서** (반드시 이 순서로 진행):

```
1. Before 체크리스트 작성 (현재 기능 문서화)
   ↓
2. Domain Service 단위 테스트 작성
   ↓
3. Service Layer 단위 테스트 작성
   ↓
4. Route Integration 테스트 작성
   ↓
5. 테스트 실행 (실패 확인)
   ↓
6. 프로덕션 코드 리팩토링 (테스트 통과시키기)
   ↓
7. After 체크리스트 검증
```

**⚠️ 중요**: 프로덕션 코드를 먼저 리팩토링하지 말 것!
---

### 1. 기능 회귀 방지 (Regression Prevention)

```
리팩토링 = 외부 동작 유지 + 내부 구조 개선
```

- 리팩토링 전후 **동일한 입력 → 동일한 출력** 보장
- Before 체크리스트로 현재 기능 문서화
- After 체크리스트로 기능 유지 검증

### 2. 테스트 작성 가이드 (Test Writing Guide)

**🔑 핵심 원칙: mock은 외부 의존성만**

**Bottom-Up 순서로 테스트 작성**:

```
1. Domain Model 테스트
   - 비즈니스 규칙, 상태 전이 검증
   - ⭐ Mock 없이 순수 함수 테스트
   - getter는 테스트하지 않음

2. Service Layer 테스트
   - 조율(오케스트레이션) 로직 검증
   - ⭐ 외부 API만 Mock (repository는 mock 최소화)
   - 조율이 아닌 구현 로직은 테스트하지 않는다

3. Route Integration 테스트
   - 전체 플로우 검증 (API → Service → Repository → DB)
   - 트랜잭션 단위 동작여부 정상 테스트
   - 실제 DB 사용 (testcontainers)
   - 응답 DTO로 검증 (DB select 최소화)
```

> **💡 서비스 테스트에서 repository mocking이 많다면?**
> → 비즈니스 로직이 서비스에 있다는 신호. Rich Domain Model 패턴 검토
> → `.claude/skills/domain-modeling.md` 참조

**테스트 케이스 예시**:
참조: `.claude/skills/testing.md`
---

```

```

### 3. Google Staff Engineer 마인드셋

> "이 코드가 Google 프로덕션에 배포된다"

| 관점       | 질문                        |
|----------|---------------------------|
| **가독성**  | 6개월 후 다른 엔지니어가 이해할 수 있는가? |
| **단순성**  | 불필요한 코드/추상화가 없는가?         |
| **유지보수** | 요구사항 변경 시 수정 범위가 최소화되는가?  |
| **테스트**  | 이 코드를 어떻게 테스트할 것인가?       |
| **성능**   | 불필요한 연산/쿼리/순회가 없는가?       |

---

## 레이어별 리팩토링 패턴

### Route Layer 리팩토링

**변경 포인트**

- ✅ try-catch → withErrorHandler
- ✅ 수동 검증 → validateJsonBody + Zod
- ✅ DB 직접 접근 → Service 위임
- ✅ 응답 래핑 → withErrorHandler가 처리

---

### Service Layer 리팩토링

**변경 포인트**

- ✅ existsById + if → orElseThrow + findById
- ✅ 비즈니스 로직 → 스스로 판단해서 Domain Model로 이동 or 다른 서비스 레이어에게 위임
- ✅ any → 명시적 타입
- ✅ { data, success } 래핑 제거

---

### Domain Layer 리팩토링

**변경 포인트**

- ✅ id 제거 (DB 관심사)
- ✅ public 필드 → private readonly props
- ✅ setter 제거 → 불변 객체 (새 인스턴스 반환)
- ✅ 비즈니스 규칙 캡슐화
- ✅ getter 최소화
- 한곳에서만 사용되는 부분은 메소드 추출 최대한 지양
