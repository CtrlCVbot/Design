---
name: isp-review
description: "ISP(Interface Segregation Principle) 전문가 코드 리뷰. 필요하지 않은 것에 의존하고 있지 않은지 분석한다. 'ISP', '인터페이스 분리', '불필요한 의존', '뚱뚱한 인터페이스', 'fat interface' 요청 시 이 스킬을 사용할 것."
---


# ISP Review Skill

## 핵심 원칙 (Robert C. Martin)

> **"필요하지 않은 것에 의존하지 마라."**

- 클라이언트는 자신이 사용하지 않는 메서드/필드에 의존하면 안 된다.
- 사용하지 않는 것에 의존하면, 그것이 변경될 때 나까지 영향받는다.
- 정적 타입 언어에서는 재컴파일, 아키텍처 수준에서는 불필요한 재배포를 유발한다.
- TypeScript에서도 동일: 큰 타입을 import하면 그 타입의 무관한 변경이 내 코드에 파급된다.

---

## mm-broker에서의 ISP 적용 범위

| 수준 | 뚱뚱한 의존 | ISP 위반 시 증상 |
|------|-----------|----------------|
| **타입/인터페이스** | 모든 필드가 담긴 거대 타입을 여기저기서 import | 필드 하나 추가하면 무관한 파일까지 영향 |
| **모듈 import** | 파일에서 export 10개 중 1개만 사용 | 나머지 9개 변경이 빌드에 파급 |
| **컴포넌트 Props** | Props에 20개 필드, 실제 사용은 3개 | 부모가 불필요한 데이터까지 전달해야 함 |
| **외부 의존성** | 프레임워크 전체를 import하고 기능 1개만 사용 | 프레임워크 업데이트가 시스템 전체 위험 |

---

## 위반 패턴 체크리스트

### 1. Fat Type (뚱뚱한 타입)

하나의 타입이 너무 많은 필드를 가지고, 사용처마다 일부만 쓴다.

```typescript
// ❌ ISP 위반: 모든 곳에서 Order 전체 타입을 사용
type Order = {
  id: string;
  shipperName: string;    // 목록에서만 필요
  shipperPhone: string;   // 목록에서만 필요
  dispatchInfo: {...};     // 상세에서만 필요
  settlementInfo: {...};   // 정산에서만 필요
  chargeDetails: {...};    // 정산에서만 필요
}
// → settlementInfo 구조가 바뀌면 목록 컴포넌트도 재컴파일

// ✅ ISP 준수: 사용처별 타입 분리
type OrderListItem = Pick<Order, 'id' | 'shipperName' | 'shipperPhone'>;
type OrderSettlement = Pick<Order, 'id' | 'settlementInfo' | 'chargeDetails'>;
```

왜 위험한가: 정산팀이 `settlementInfo` 구조를 변경하면, 전혀 관련 없는 목록 페이지 코드도 영향받는다. 책의 "D의 변경이 F와 S를 재배포시키는" 문제.

### 2. God Props (뚱뚱한 Props)

컴포넌트가 실제 사용하지 않는 Props까지 받으면, 부모가 불필요한 데이터를 조립해야 한다.

```typescript
// ❌ ISP 위반: 컴포넌트가 Order 전체를 받지만 일부만 사용
function OrderCard({ order }: { order: Order }) {
  return <div>{order.shipperName} - {order.status}</div>;
  // dispatchInfo, settlementInfo 등은 전혀 사용 안 함
}

// ✅ ISP 준수: 필요한 것만 Props로 받기
function OrderCard({ shipperName, status }: { shipperName: string; status: string }) {
  return <div>{shipperName} - {status}</div>;
}
```

### 3. Barrel Export 과다 의존

index.ts에서 모든 것을 re-export하고, 사용처에서 index를 import하면 무관한 변경에 의존하게 된다.

```typescript
// ❌ ISP 위반: barrel에서 모든 것을 가져옴
import { OrderService, DriverService, SettlementService } from '@/server/services';
// 실제로는 OrderService만 사용 → 나머지 변경이 파급

// ✅ ISP 준수: 직접 경로에서 필요한 것만
import { OrderService } from '@/server/order/application/order.service';
```

### 4. 거대 Service 인터페이스

Service 클래스가 너무 많은 public 메서드를 노출하면, Route가 사용하지 않는 메서드 변경에도 영향받는다.

```typescript
// ❌ ISP 위반: Route가 Service의 10개 메서드 중 1개만 사용
// OrderService에 findAll, findById, create, update, delete,
// calculateFee, validateAddress, checkDuplicate, exportCsv, syncExternal
// → Route에서 create만 쓰는데 exportCsv 시그니처 변경 시 영향

// ✅ ISP 준수: Query/Command 분리 (CQRS)
// OrderQueryService: findAll, findById
// OrderCommandService: create, update, delete
```

이는 SRP(변경 이유 분리)와도 연결되지만, ISP 관점에서는 "사용하지 않는 메서드에 의존하지 마라"가 핵심.

---

## 영향도 평가 기준

| 등급 | 조건 | 설명 |
|------|------|------|
| 🔴 **Critical** | 거대 타입을 10개+ 파일에서 import + 필드 20개+ | 한 필드 변경이 대규모 파급. 즉시 타입 분리 |
| 🟠 **High** | Props 10개+ 중 절반 미사용, 또는 barrel 과다 의존 | 불필요한 결합. Pick/Omit으로 분리 |
| 🟡 **Medium** | Service에 public 메서드 8개+ (CQRS 미적용) | 인터페이스가 비대. Query/Command 분리 고려 |
| 🟢 **Low** | 사용처별 적절한 타입, 필요한 것만 import | ISP 준수 |

---

## 출력 형식

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📐 ISP REVIEW REPORT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📁 대상: {파일 또는 변경 범위}

🔍 발견 사항:

[1] 🟠 {파일:라인} — Fat Type
    타입: Order (필드 15개)
    사용: 이 파일에서 3개만 사용
    파급: Order 변경 시 이 파일도 영향
    해결: Pick<Order, 'id' | 'status' | ...> 또는 전용 타입 분리

[2] 🟡 {파일:라인} — God Props
    Props: 12개 필드 중 4개만 사용
    해결: 필요한 필드만 개별 Props로 받기

📊 요약:
  🔴 Critical: 0건
  🟠 High: 1건
  🟡 Medium: 1건
  🟢 Low: 3건
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```
