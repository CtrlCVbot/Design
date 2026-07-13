---
name: route-layer
description: "Route Layer 상세 규칙. app/api/**/route.ts 파일 작업 시 참조. HTTP 관심사, Zod 검증, withErrorHandler, 스키마 분리(validation.ts) 규칙을 포함. API 엔드포인트를 생성하거나 수정할 때 이 스킬을 사용할 것."
---

# Route Layer Skill

## 적용 조건

- `server/**/*.ts` 파일 중 route 레이어 작업 시
- `app/api/**/*.ts` 파일 작업 시

## 🚨 CRITICAL: 레이어 책임 검증

> **"이 코드가 Route 레이어의 책임인가?"**
> - HTTP 관심사만 처리하고 있는가?
> - 비즈니스 로직이 침투하지 않았는가?

---

## 규칙

- service 생성은 최상단에서 모듈 최상위 변수로 갖는다. 왜: handler 내부 생성은 요청마다 인스턴스가 만들어져 비효율적이고, 테스트에서 교체하기 어렵다.
- HTTP 관심사만 처리 (요청 검증, 인증 확인). 왜: Route에 비즈니스 로직이 들어가면 단위 테스트가 HTTP 의존적이 되어 TDD가 어려워진다.
- Domain Error는 `withErrorHandler`로 처리. 왜: try-catch가 route에 직접 있으면 에러 처리가 분산되고, 표준 응답 포맷이 깨진다.
- drizzle 의존성 금지. 왜: Route가 DB에 직접 접근하면 Repository 패턴이 무너지고, 쿼리 변경이 API 레이어까지 전파된다.

---

## 요청 검증 (입력 검증은 Route의 책임)

- Zod 스키마는 route layer의 책임 (HTTP 요청 검증)
- **입력 검증 = Route 책임**: 중복 제거, 범위 검사, 형식 검증 등
    - Service는 유효한 입력을 신뢰하고 비즈니스 로직만 처리
    - Service에서 `new Set()` 같은 입력 정제? → Route로 이동
- 검증은 반드시 `@/common/http/api-handler`의 공통 유틸 사용:
    - `validateJsonBody(request, schema)`: Request Body 파싱 + Zod 검증
    - `validateQueryParams(request, schema)`: Query Parameter 검증
    - `validateUUIDFormat(params, 'paramName')`: UUID Path Parameter 검증
    - `validatePathParams(params, { id: z.string().uuid() })`: 복합 Path Parameter 검증
- 복잡한 검증은 Zod `.refine()` 사용:
  ```typescript
  // 예: 중복 검증
  z.object({ items: z.array(...) })
    .refine(data => {
      const ids = data.items.map(i => i.id);
      return ids.length === new Set(ids).size;
    }, { message: '중복된 ID가 있습니다.' })
  ```
- 별도 `parseRequestBody` 같은 로컬 함수 만들지 말 것

---

## 스키마 파일 분리 (필수)

- Zod 스키마는 **항상** `validation.ts`로 분리
- route.ts는 스키마를 import만 수행
- 파일 구조:
  ```
  app/api/{도메인}/{엔드포인트}/
  ├── route.ts        # HTTP 핸들러만
  └── validation.ts   # Zod 스키마
  ```
- 예외: 한 줄짜리 단순 스키마 (예: `z.object({ id: z.string().uuid() })`)

---
