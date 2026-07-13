---
name: lsp-review
description: "LSP(Liskov Substitution Principle) 전문가 코드 리뷰. 인터페이스/타입의 대체 가능성을 분석한다. 'LSP', '리스코프', '대체 가능', '인터페이스 계약', 'API 일관성' 요청 시 이 스킬을 사용할 것."
---

# LSP Review Skill

## 핵심 원칙 (Barbara Liskov)

> **"S가 T의 서브타입이면, T를 사용하는 프로그램에서 S로 대체해도 동작이 변하지 않아야 한다."**

- 상속/구현 뿐 아니라 **같은 인터페이스를 따르는 모든 구현**에 적용된다.
- 위반하면 호출측에 `if (type === 'X')` 같은 특수 케이스가 생긴다.
- 아키텍처 수준에서 LSP 위반은 시스템 전체에 복잡한 우회 메커니즘을 퍼뜨린다.

---

## mm-broker에서의 LSP 적용 범위

LSP는 상속이 아니라 **"같은 계약을 따르는 구현들의 일관성"**이다.

| 계약 (인터페이스) | 구현들 | LSP 위반 시 증상 |
|-----------------|--------|----------------|
| **API Route 응답 형식** | GET/POST/PATCH 각 엔드포인트 | 어떤 API만 다른 형식으로 응답 → 프론트에 특수 케이스 |
| **Service 메서드 시그니처** | Query/Command 각 Service | 어떤 Service만 다른 에러 패턴 → Route에 분기 |
| **Domain Model 상태 전이** | 각 상태별 전이 규칙 | 어떤 상태만 다른 규칙 → Service에 if문 |
| **Repository 반환 타입** | 각 Repository 메서드 | 어떤 메서드만 null 대신 throw → Service에 분기 |
| **프론트 컴포넌트 Props** | 같은 Props를 받는 컴포넌트 | 어떤 컴포넌트만 특수 처리 필요 → 부모에 if문 |

---

## 위반 패턴 체크리스트

### 1. API 응답 형식 불일치

같은 도메인의 엔드포인트들이 서로 다른 응답 구조를 반환하면, 프론트에서 API별 특수 처리가 필요해진다.

```typescript
// ❌ LSP 위반: 같은 도메인인데 응답 구조가 다름
// GET /api/orders       → { items: Order[], total: number }
// GET /api/orders/[id]  → Order (래핑 없이 직접 반환)
// 프론트에서 "이 API는 items 꺼내고, 저 API는 바로 쓰고..." 분기 발생

// ✅ LSP 준수: 일관된 응답 구조
// GET /api/orders       → withErrorHandler가 { data: [...], success: true } 래핑
// GET /api/orders/[id]  → withErrorHandler가 { data: {...}, success: true } 래핑
```

### 2. 에러 처리 불일치

같은 계층의 모듈이 에러를 다르게 처리하면, 호출측에 특수 케이스가 생긴다.

```typescript
// ❌ LSP 위반: Service마다 에러 처리가 다름
// OrderService.findById → 없으면 null 반환
// DriverService.findById → 없으면 throw NotFoundError
// → Route에서 "OrderService는 null 체크, DriverService는 try-catch" 분기

// ✅ LSP 준수: 일관된 패턴
// 모든 Service → orElseThrow(repo.findById(id), new NotFoundError(id))
```

### 3. 구현별 특수 케이스 (if/instanceof)

호출측에서 구현 타입을 체크해서 다르게 처리하면, 대체 가능성이 깨진 것이다.

```typescript
// ❌ LSP 위반: 택시 회사 예시의 mm-broker 버전
if (gateway.type === 'popbill') {
  // 팝빌 전용 파라미터 추가
} else if (gateway.type === 'barobill') {
  // 바로빌 전용 처리
}
// → 새 게이트웨이 추가할 때마다 if문 추가 (OCP도 동시 위반)

// ✅ LSP 준수: 통일된 인터페이스
gateway.issue(invoice); // 내부에서 각 구현이 알아서 처리
```

### 4. Optional 필드 불일치

같은 타입인데 어떤 경우에만 필드가 있고 없으면, 사용측에서 매번 null 체크해야 한다.

```typescript
// ❌ LSP 위반: 같은 Order 타입인데 상태에 따라 필드 유무가 다름
// PENDING 상태 → dispatchInfo: undefined
// DISPATCHED 상태 → dispatchInfo: { driverName, ... }
// → 사용하는 곳마다 if (order.dispatchInfo) 분기

// ✅ LSP 준수: 상태별 타입 분리 또는 discriminated union
type PendingOrder = { status: 'PENDING'; ... }
type DispatchedOrder = { status: 'DISPATCHED'; dispatchInfo: DispatchInfo; ... }
```

---

## 영향도 평가 기준

| 등급 | 조건 | 설명 |
|------|------|------|
| 🔴 **Critical** | 외부 시스템 인터페이스 불일치 + 호출측에 하드코딩된 특수 케이스 | 새 구현 추가 시 시스템 전체에 if문 전파. 책의 Acme 택시 문제 |
| 🟠 **High** | 같은 계층 모듈 간 계약 불일치 (에러 처리, 반환 타입) | 호출측에 불필요한 분기. 패턴 통일 필요 |
| 🟡 **Medium** | API 응답 형식 불일치 또는 Optional 필드 남용 | 프론트에서 API별 특수 처리. 래핑 통일 필요 |
| 🟢 **Low** | 일관된 계약, 대체 가능 | LSP 준수 |

---

## 출력 형식

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📐 LSP REVIEW REPORT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📁 대상: {파일 또는 변경 범위}

🔍 발견 사항:

[1] 🟠 {파일:라인} — Error Handling Inconsistency
    계약: Service.findById는 없으면 throw가 표준
    위반: null 반환 → 호출측에 null 체크 분기 강제
    해결: orElseThrow 패턴으로 통일

[2] 🟡 {파일:라인} — Implementation Special Case
    계약: gateway.issue(invoice) 통일 인터페이스
    위반: if (type === 'popbill') 특수 처리
    해결: 각 구현 내부에서 차이 흡수

📊 요약:
  🔴 Critical: 0건
  🟠 High: 1건
  🟡 Medium: 1건
  🟢 Low: 2건
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```
