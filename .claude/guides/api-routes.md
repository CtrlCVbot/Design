# API Route 작업 가이드

> 이 파일은 `app/api/**/*.ts` 파일 작업 시 자동으로 참조됩니다.

## 필수 규칙

### 1. 레이어 책임
- **HTTP 관심사만 처리** (요청 검증, 인증 확인)
- 비즈니스 로직은 **Service Layer에 위임**
- Domain Error는 `withErrorHandler`로 처리
- **drizzle 의존성 금지**

### 2. Service 생성
```typescript
// 모듈 최상단에서 생성
const orderService = new OrderService(orderRepository);

export async function GET(request: NextRequest) {
  // service 사용
}
```

### 3. 요청 검증 (필수 유틸 사용)
```typescript
import {
  validateJsonBody,      // Request Body 검증
  validateQueryParams,   // Query Parameter 검증
  validateUUIDFormat,    // UUID Path Parameter 검증
  validatePathParams     // 복합 Path Parameter 검증
} from '@/common/http/api-handler';
```

### 4. 스키마 파일 분리
```
app/api/{도메인}/{엔드포인트}/
├── route.ts        # HTTP 핸들러만
└── validation.ts   # Zod 스키마
```

## 상세 규칙
👉 `.claude/skills/route-layer.md` 참조

## 참조 구현
- `server/order-settlement/`
- `server/charge/`
