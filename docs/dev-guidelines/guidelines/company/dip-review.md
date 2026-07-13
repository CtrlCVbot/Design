---
name: dip-review
description: "DIP(Dependency Inversion Principle) 전문가 코드 리뷰. 소스 코드 의존성이 추상에 향하는지, 변동성 높은 구체에 의존하고 있지 않은지 분석한다. 'DIP', '의존성 역전', '추상 의존', '구체 의존', '의존성 방향' 요청 시 이 스킬을 사용할 것."
---


# DIP Review Skill

## 핵심 원칙 (Robert C. Martin)

> **"소스 코드 의존성은 추상(abstraction)을 향해야 하고, 구체(concretion)를 향하면 안 된다."**

- 모든 의존성 화살표가 **안쪽(추상/비즈니스 규칙)을 향해야** 한다.
- 변동성 낮은 것(String, 프레임워크)에 의존하는 건 괜찮다.
- 문제는 **우리가 활발히 개발 중인 변동성 높은 구체 모듈**에 의존하는 것이다.
- DIP 위반을 완전히 제거할 순 없지만, 소수의 concrete component(main, Route)에 모아두고 나머지 시스템과 격리해야 한다.

---

## mm-broker 의존성 방향 규칙

```
추상 (안쪽, 보호됨)                    구체 (바깥쪽, 변동성 높음)
┌──────────────┐                    ┌──────────────┐
│ Domain Model │ ← Service ← Route │    DB/ORM     │
│ (비즈니스 규칙) │                    │  (drizzle)   │
└──────────────┘                    └──────────────┘
       ↑                                    ↑
  Repository 인터페이스 ───── Repository 구현(drizzle)
  (추상 경계)                  (구체, DIP 위반을 여기에 격리)
```

**허용되는 DIP 위반:**
- Route에서 Service 구체 클래스를 직접 생성 (Route = concrete component)
- Repository 구현에서 drizzle을 직접 사용 (인프라 = concrete component)

**금지되는 DIP 위반:**
- Domain이 drizzle/zod/NextResponse에 의존
- Service가 DB/ORM에 직접 의존
- Service가 Route의 타입(Request/Response)에 의존

---

## 위반 패턴 체크리스트

### 1. 변동성 높은 구체에 의존

우리가 자주 변경하는 모듈에 직접 의존하면, 그 변경이 전파된다.

```typescript
// ❌ DIP 위반: Service가 구체 Repository 구현의 내부 타입에 의존
import { InferSelectModel } from 'drizzle-orm';
import { orders } from '@/db/schema';
type OrderRow = InferSelectModel<typeof orders>;
// → DB 스키마 변경이 Service까지 직접 전파

// ✅ DIP 준수: Service는 도메인 타입만 사용
import { Order } from '../domain/order.model';
// → DB 스키마가 바뀌어도 Repository가 변환을 흡수, Service는 무관
```

### 2. 의존성 방향 역전 (안쪽 → 바깥쪽)

높은 수준 모듈(Domain/Service)이 낮은 수준 모듈(DB/HTTP)을 직접 참조.

```typescript
// ❌ DIP 위반: Domain Model이 HTTP 프레임워크에 의존
import { z } from 'zod';
class OrderModel {
  static schema = z.object({ ... }); // zod는 HTTP 검증 도구
}

// ✅ DIP 준수: Domain은 순수 TypeScript
class OrderModel {
  validate(): void { // 도메인 자체 검증, 외부 의존 없음
    if (!this.amount) throw new InvalidOrderError();
  }
}
```

### 3. Factory 패턴 부재

Service가 Repository를 직접 new하면 구체에 결합된다.

```typescript
// ❌ DIP 위반: Service가 구체 Repository를 직접 생성
class OrderService {
  private repository = new DrizzleOrderRepository(db);
}

// ✅ DIP 준수: 생성자 주입 또는 Route에서 조립
// Route (concrete component) 에서:
const repository = new DrizzleOrderRepository(db);
const service = new OrderService(repository);
```

### 4. 안정된 의존 vs 변동성 높은 의존

| 의존 대상 | 변동성 | DIP 위반? |
|----------|--------|----------|
| `zod`, `drizzle-orm` (외부 라이브러리) | 낮음 | Route/Repository에서만 허용 |
| `@/db/schema` (우리 DB 스키마) | **높음** | Service/Domain에서 금지 |
| `@/server/.../domain/*.model` (우리 도메인) | 낮음 (의도적으로 안정화) | 모든 곳에서 허용 |
| `@/common/http/*` (HTTP 유틸) | 중간 | Route에서만 허용 |

---

## 영향도 평가 기준

| 등급 | 조건 | 설명 |
|------|------|------|
| 🔴 **Critical** | Domain이 외부 프레임워크(zod/drizzle/next)에 의존 | 아키텍처 경계 붕괴. 비즈니스 규칙이 인프라에 결합 |
| 🟠 **High** | Service가 DB 스키마/ORM에 직접 의존 | Repository 추상화 우회. 스키마 변경이 Service로 전파 |
| 🟡 **Medium** | Service가 Route 전용 타입(Request/Response DTO)에 의존 | HTTP와 비즈니스 로직 결합 |
| 🟢 **Low** | 의존성이 안쪽(Domain)을 향함, concrete component에 DIP 위반 격리 | 정상 |

---

## 출력 형식

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📐 DIP REVIEW REPORT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📁 대상: {파일 또는 변경 범위}

🔍 의존성 방향 분석:
  Domain ← Service ← Route  ✅ 정상 방향
  Service → @/db/schema      ❌ 역전 (구체 의존)

🔍 발견 사항:

[1] 🟠 {파일:라인} — Volatile Concrete Dependency
    의존: Service에서 import { orders } from '@/db/schema'
    방향: Service → DB (안쪽 → 바깥쪽)
    파급: DB 스키마 변경 시 Service 수정 필요
    해결: Repository가 변환 담당, Service는 도메인 타입만 사용

📊 요약:
  🔴 Critical: 0건
  🟠 High: 1건
  🟡 Medium: 0건
  🟢 Low: 3건
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```
