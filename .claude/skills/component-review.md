---
name: component-review
description: "컴포넌트 응집/결합 원칙 리뷰. 모듈 간 순환 의존, 도메인 간 결합, 변경 전파 범위를 분석한다. '순환 의존', '모듈 결합', '도메인 분리', 'import cycle', '컴포넌트 원칙' 요청 시 이 스킬을 사용할 것."
---

# Component Principles Review Skill

## 적용 원칙 (Clean Architecture Ch.13-14에서 발췌)

이 프로젝트에 실용적인 3가지만 적용한다.

### CCP: Common Closure Principle

> **"같은 이유로 변경되는 것을 같은 모듈에 모아라."**

SRP의 모듈 버전. 함께 변경되는 파일들이 같은 `server/{domain}/`에 있어야 한다.
다른 도메인의 파일을 수정해야 한다면 모듈 경계가 잘못된 것.

### ADP: Acyclic Dependencies Principle

> **"모듈 의존 그래프에 순환을 허용하지 마라."**

`server/order/` → `server/settlement/` → `server/order/` 순환이 있으면:
- 하나를 변경할 때 나머지도 전부 변경해야 함
- 테스트 격리 불가능 ("morning after syndrome")
- 해결: DIP로 인터페이스 추출하거나, 공유 모듈 생성

### SDP: Stable Dependencies Principle

> **"안정된 방향으로 의존하라."**

안정된 모듈(domain)이 불안정한 모듈(route, component)에 의존하면 안 된다.
불안정한 모듈의 변경이 안정적이어야 할 모듈까지 파급됨.

---

## mm-broker 모듈 안정도

```
안정 (변경 시 파급 큼, 많은 것이 의존)
  server/{domain}/domain/     ← 비즈니스 규칙
  server/{domain}/application/ ← 서비스 조율

불안정 (변경 빈번, 의존하는 것 적음)
  server/{domain}/infrastructure/ ← DB 접근
  app/api/                        ← HTTP 엔드포인트
  components/                     ← UI
```

---

## 위반 패턴 체크리스트

### 1. 도메인 간 직접 결합 (ADP/CCP 위반)

한 도메인 모듈이 다른 도메인 모듈을 직접 import하면, 두 도메인이 사실상 하나의 큰 모듈이 된다.

```typescript
// ❌ 순환 위험: order가 settlement에 직접 의존
// server/order/application/order.service.ts
import { SettlementService } from '@/server/settlement/application/settlement.service';

// ❌ 더 나쁨: settlement도 order에 의존하면 순환
// server/settlement/application/settlement.service.ts
import { OrderQueryService } from '@/server/order/application/order-query.service';

// ✅ 해결: Route에서 조율하거나, 공유 인터페이스 추출
// Route (불안정한 곳)에서 두 Service를 호출하고 결과를 조합
```

### 2. 안정 → 불안정 의존 (SDP 위반)

도메인/서비스가 Route나 Component에 의존하면 의존 방향이 역전.

```
❌ server/order/domain/ → app/api/ (안정 → 불안정)
❌ server/order/domain/ → components/ (안정 → 불안정)
✅ app/api/ → server/order/application/ → server/order/domain/ (불안정 → 안정)
```

### 3. 모듈 경계를 넘는 변경 전파 (CCP 위반)

하나의 기능 변경이 여러 `server/{domain}/`에 걸쳐 수정을 요구하면, 모듈 경계가 잘못 설정된 신호.

```
❌ "화물 상태 변경" 기능 수정 → order/, settlement/, lms/ 3개 도메인 동시 수정
   → 이 세 도메인이 하나의 변경 이유를 공유하고 있다는 뜻
   → 공유 로직을 별도 모듈로 추출하거나 도메인 이벤트로 분리
```

---

## 영향도 평가 기준

| 등급 | 조건 | 설명 |
|------|------|------|
| 🔴 **Critical** | 도메인 간 양방향 의존 (순환) | 두 도메인이 분리 불가능. 테스트/배포 격리 깨짐 |
| 🟠 **High** | 도메인 간 단방향 의존 3개+ 또는 안정→불안정 | 결합도 높음. 인터페이스 추출 필요 |
| 🟡 **Medium** | 도메인 간 단방향 의존 1-2개 | 인지하고 관리. 증가 추세면 분리 |
| 🟢 **Low** | 도메인 내부 의존만 | 모듈 응집 양호 |

---

## 출력 형식

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📐 COMPONENT PRINCIPLES REVIEW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📁 대상: {파일 또는 변경 범위}

🔗 도메인 간 의존 분석:
  server/order/ → server/settlement/ (단방향)
  server/settlement/ → server/order/ (⚠️ 순환!)

🔍 발견 사항:

[1] 🔴 ADP 위반 — order ↔ settlement 순환 의존
    경로: order.service → settlement.service → order-query.service
    파급: 한쪽 변경 시 양쪽 모두 수정/테스트 필요
    해결: Route에서 조율하거나 공유 인터페이스 추출

📊 요약:
  🔴 Critical: 1건 (순환)
  🟠 High: 0건
  🟡 Medium: 0건
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```
