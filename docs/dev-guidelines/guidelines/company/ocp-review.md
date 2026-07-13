---
name: ocp-review
description: "OCP(Open-Closed Principle) 전문가 코드 리뷰. 코드가 확장에 열려있고 수정에 닫혀있는지 분석한다. 'OCP', '개방-폐쇄', '확장성', 'switch 분기', '타입별 분기' 요청 시 이 스킬을 사용할 것."
---


# OCP Review Skill

## 핵심 원칙 (Robert C. Martin)

> **"A software artifact should be open for extension but closed for modification."**

- 새 요구사항을 추가할 때 **기존 코드를 수정하지 않고 확장**할 수 있어야 한다.
- 보호 계층: 높은 수준(비즈니스 규칙) → 낮은 수준(UI, DB)으로 의존성을 배치해서, 낮은 수준의 변경이 높은 수준에 파급되지 않게 한다.
- SRP로 변경 이유를 분리하고, DIP로 의존성 방향을 정리하면 OCP가 달성된다.

---

## mm-broker 보호 계층

```
가장 보호됨 (변경 파급 최소)
  Domain Model    ← 비즈니스 규칙. 다른 레이어 변경에 영향받지 않아야 함
  Service         ← 조율. Domain은 보호하되 Route 변경에는 영향받지 않아야 함
  Repository      ← 데이터 접근. DB 스키마 변경은 여기서 흡수
  Route           ← HTTP. 프론트 요구사항 변경은 여기서 흡수
가장 노출됨 (변경 빈번)
```

---

## 위반 패턴 체크리스트

### 1. switch/if-else 분기 폭발

새 타입/상태를 추가할 때마다 기존 코드에 `case`를 추가해야 하면 OCP 위반.

```typescript
// ❌ OCP 위반: 새 status 추가 시 이 함수를 수정해야 함
function getStatusLabel(status: string) {
  switch (status) {
    case 'PENDING': return '대기';
    case 'ACCEPTED': return '수락';
    case 'COMPLETED': return '완료';
    // 새 상태 추가할 때마다 여기를 수정...
  }
}

// ✅ OCP 준수: 맵으로 확장 가능
const STATUS_LABELS: Record<string, string> = {
  PENDING: '대기',
  ACCEPTED: '수락',
  COMPLETED: '완료',
};
// 새 상태는 맵에 엔트리만 추가하면 됨
```

왜 위험한가: 분기가 여러 파일에 산재하면, 새 타입 추가 시 **모든 switch를 찾아 수정**해야 하고, 하나라도 놓치면 런타임 에러.

### 2. 타입별 조건 분기 (Type Checking)

`if (type === 'A')` 패턴이 여러 곳에 반복되면, 새 타입 추가 시 모든 분기를 수정해야 함.

```typescript
// ❌ OCP 위반: 타입별 분기가 서비스 전체에 산재
if (order.type === 'DIRECT') {
  // 직접 배차 로직
} else if (order.type === 'BIDDING') {
  // 입찰 로직
}
// → 새 type 'RELAY' 추가 시 모든 if-else를 찾아 수정

// ✅ OCP 준수: 전략 패턴 또는 도메인 모델 다형성
class Order {
  dispatch(): DispatchResult {
    return this.strategy.dispatch(); // 전략 객체에 위임
  }
}
```

### 3. 의존성 방향 역전 (보호 계층 위반)

높은 수준 모듈이 낮은 수준 모듈에 직접 의존하면, 낮은 수준 변경이 높은 수준으로 파급.

```
❌ Domain → Repository (도메인이 인프라에 의존)
❌ Service → Route의 타입 (서비스가 HTTP 관심사에 의존)
✅ Route → Service → Domain (의존성이 안쪽으로 향함)
```

### 4. 수정 빈도 집중 (Modification Hotspot)

`git log`에서 특정 파일이 매번 수정된다면 OCP 위반 신호.

```bash
# 수정 빈도 높은 파일 확인
git log --oneline --since="2 months ago" -- "server/**/*.ts" | wc -l
```

---

## 영향도 평가 기준

| 등급 | 조건 | 설명 |
|------|------|------|
| 🔴 **Critical** | switch/if-else 5개 이상 case + 여러 파일에 동일 패턴 산재 | 새 타입 추가 시 대규모 수정 필요. 전략 패턴/맵으로 즉시 리팩토링 |
| 🟠 **High** | switch 4+ case 또는 의존성 방향 역전 | 확장 비용 높음. 다음 변경 시 리팩토링 계획 |
| 🟡 **Medium** | switch 3 case 또는 단일 파일 내 타입 분기 | 현재는 관리 가능. 분기가 늘어나면 분리 |
| 🟢 **Low** | 2 case 이하 또는 상수 맵 사용 | OCP 준수 또는 미미한 위반 |

---

## 출력 형식

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📐 OCP REVIEW REPORT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📁 대상: {파일 또는 변경 범위}

🔍 발견 사항:

[1] 🟠 {파일:라인} — Switch Explosion
    분기: switch(status) 6 cases
    파급: 같은 status 분기가 {N}개 파일에 존재
    해결: STATUS_LABELS 맵 또는 도메인 모델 다형성

[2] 🟡 {파일:라인} — Type Conditional
    분기: if (type === 'X') 패턴 3회 반복
    파급: 새 타입 추가 시 3곳 수정 필요
    해결: 전략 패턴으로 타입별 로직 캡슐화

📊 요약:
  🔴 Critical: 0건
  🟠 High: 1건
  🟡 Medium: 1건
  🟢 Low: 2건
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```
