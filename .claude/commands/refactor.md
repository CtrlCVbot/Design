# /refactor - Route 기반 전체 레이어 리팩토링

## 개요
특정 route 기반으로 관련된 모든 레이어(Route → Service → Repository → Domain)를 리팩토링합니다.
**Google Staff Engineer 수준의 코드 품질**을 목표로 하며, 기능 회귀를 방지하기 위한 체크리스트 검증을 수행합니다.

---

## 리팩토링 프로세스

```
┌─────────────────────────────────────────────────────────────┐
│                    PHASE 1: BEFORE 분석                      │
│                   (기능/요구사항 체크리스트 생성)              │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    PHASE 2: 리팩토링 실행                    │
│                   (Google Staff Engineer 기준)               │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    PHASE 3: AFTER 검증                       │
│                   (체크리스트 만족 여부 확인)                  │
└─────────────────────────────────────────────────────────────┘
```

---

## PHASE 1: BEFORE 분석

### 1.1 대상 파일 식별
사용자가 지정한 route 경로를 기반으로 관련 파일 식별:

```
[Route Path] 예: app/api/charges/[id]/route.ts
    │
    ├── Route Layer: app/api/charges/[id]/route.ts
    ├── Service Layer: server/charge/application/*.service.ts
    ├── Repository Layer: server/charge/infrastructure/*.repository.ts
    └── Domain Layer: server/charge/domain/**/*.ts
```

### 1.2 기능/요구사항 체크리스트 생성

다음 항목들을 분석하여 `dev/active/refactor-[name]/before-checklist.md` 생성:

#### API 계약 (Contract)
- [ ] HTTP Method (GET/POST/PUT/DELETE)
- [ ] Request Body 스키마 (필수/선택 필드)
- [ ] Query Parameter 스키마
- [ ] Path Parameter 스키마
- [ ] Response 구조 (성공/실패)
- [ ] HTTP Status Code (200, 400, 404, 500 등)

#### 비즈니스 로직
- [ ] 핵심 비즈니스 규칙 목록
- [ ] 도메인 유효성 검증 규칙
- [ ] 계산/변환 로직
- [ ] 상태 전이 규칙

#### 데이터 흐름
- [ ] DB 조회 쿼리 (SELECT)
- [ ] DB 변경 쿼리 (INSERT/UPDATE/DELETE)
- [ ] 트랜잭션 범위
- [ ] 조인/관계 데이터

#### 에러 처리
- [ ] 도메인 에러 종류
- [ ] 에러 메시지 형식
- [ ] 에러 코드

#### 엣지 케이스
- [ ] null/undefined 처리
- [ ] 빈 배열/빈 객체 처리
- [ ] 권한 검증
- [ ] 동시성 이슈

---

## PHASE 2: 리팩토링 실행

### 2.1 Google Staff Engineer 품질 기준

#### 코드 품질
- **가독성**: 코드가 자명(self-documenting)한가?
- **단순성**: 불필요한 복잡도가 없는가?
- **일관성**: 프로젝트 컨벤션을 따르는가?
- **테스트 가능성**: 단위 테스트가 용이한가?

#### 아키텍처 준수
- **레이어 분리**: 각 레이어가 자신의 책임만 갖는가?
- **의존성 방향**: 상위 레이어 → 하위 레이어로만 의존하는가?
- **도메인 순수성**: 도메인 모델이 인프라에 의존하지 않는가?

#### 프로덕션 준비도
- **에러 복원력**: 예외 상황에서 graceful하게 처리하는가?
- **성능**: 불필요한 쿼리/연산이 없는가?
- **보안**: 인젝션, XSS 등 취약점이 없는가?

### 2.2 레이어별 리팩토링 체크포인트

#### Route Layer
```typescript
// ✅ GOOD
const service = new ChargeCommandService(repository);

export async function POST(request: Request) {
  return withErrorHandler(async () => {
    const body = await validateJsonBody(request, CreateChargeSchema);
    const result = await service.create(body);
    return result;
  });
}
```
- [ ] service 인스턴스는 모듈 최상위에 생성
- [ ] withErrorHandler로 감싸기
- [ ] validateJsonBody/validateQueryParams 사용
- [ ] drizzle 의존성 없음

#### Service Layer
```typescript
// ✅ GOOD
async create(request: CreateChargeRequest): Promise<ChargeResponse> {
  const entity = orElseThrow(
    await this.repository.findById(request.id),
    new NotFoundError(request.id)
  );

  const domain = Charge.create({ ...request });
  const saved = await this.repository.save(domain.toRow());

  return toChargeResponse(saved);
}
```
- [ ] orElseThrow 패턴으로 존재 검증
- [ ] drizzle/zod 의존성 없음
- [ ] 엔티티/DTO만 반환 ({ data, success } 래핑 금지)
- [ ] 도메인 로직은 도메인 모델에 위임

#### Repository Layer
```typescript
// ✅ GOOD
async findById(id: string) {
  return db.query.charges.findFirst({
    where: eq(charges.id, id),
    columns: {
      id: true,
      amount: true,
      status: true,
      // 필요한 컬럼만 명시
    }
  });
}
```
- [ ] 필요한 컬럼만 select
- [ ] DB row 그대로 반환
- [ ] $inferSelect/$inferInsert 타입 사용

#### Domain Layer
```typescript
// ✅ GOOD
class Charge {
  private constructor(private readonly props: ChargeProps) {}

  static create(props: CreateChargeProps): Charge {
    // 생성 규칙 검증
    return new Charge({ ...props });
  }

  complete(): Charge {
    if (this.props.status !== 'pending') {
      throw new InvalidChargeStatusError();
    }
    return new Charge({ ...this.props, status: 'completed' });
  }

  // getter는 정말 필요한 것만
  get amount() { return this.props.amount; }
}
```
- [ ] id 값 없음 (DB 관심사)
- [ ] 불변 객체 패턴
- [ ] 비즈니스 규칙 캡슐화
- [ ] getter 최소화

---

## PHASE 3: AFTER 검증

### 3.1 체크리스트 검증

`dev/active/refactor-[name]/after-checklist.md` 생성:

```markdown
# After Checklist

## API 계약 검증
- [x] HTTP Method 동일: POST
- [x] Request Body 스키마 동일
- [x] Response 구조 동일
- [ ] ⚠️ 변경사항: status 필드 추가됨 (의도적)

## 비즈니스 로직 검증
- [x] 핵심 규칙 1: 금액은 양수여야 함
- [x] 핵심 규칙 2: 상태 전이 규칙 준수
...
```

### 3.2 자동 검증

1. **TypeScript 빌드**: `tsc --noEmit`
2. **테스트 실행**: `npm test -- --related [files]`
3. **API 스펙 비교**: Request/Response 타입 diff

### 3.3 수동 검증 가이드

변경 전후 비교가 필요한 항목:
- API 호출 시나리오 테스트
- 에러 케이스 테스트
- 성능 벤치마크 (필요시)

---

## 산출물

리팩토링 완료 시 다음 파일들이 생성됩니다:

```
dev/active/refactor-[name]/
├── before-checklist.md    # PHASE 1 결과
├── refactor-plan.md       # 리팩토링 계획
├── after-checklist.md     # PHASE 3 결과
└── summary.md             # 변경 요약
```

---

## 사용 예시

```
사용자: /refactor app/api/charges/[id]/route.ts

Claude:
1. PHASE 1 시작 - 해당 route 및 관련 레이어 분석...
2. before-checklist.md 생성 완료
3. 리팩토링 계획 확인 요청
4. (사용자 승인 후) PHASE 2 실행
5. PHASE 3 - 체크리스트 검증
6. after-checklist.md 생성 및 결과 보고
```

---

## 참조
- `.claude/skills/layered-architecture.md`
- `.claude/skills/domain-modeling.md`
- `.claude/skills/refactoring.md`
