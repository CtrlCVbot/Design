---
name: srp-review
description: "SRP(Single Responsibility Principle) 전문가 코드 리뷰. 변경된 코드가 SRP를 위반하는지 분석하고 영향도를 평가한다. '코드 리뷰', 'SRP', '단일 책임', '책임 분리', 'actor 분석' 요청 시 이 스킬을 사용할 것."
---


# SRP Review Skill

## 핵심 원칙 (Robert C. Martin)

> **"A module should be responsible to one, and only one, actor."**

- "하나의 일만 하라"가 아니다. 하나의 **actor(이해관계자 그룹)**에만 책임져야 한다.
- 위반 증상: Accidental Duplication, Merge Conflict Risk
- 해결: 다른 actor를 지원하는 코드를 분리한다

---

## 실용적 SRP: "변경 이유가 몇 가지인가?"

소규모 팀(1-2인)에서 actor 분석은 과다하다. 대신 **"이 모듈을 변경해야 하는 이유가 몇 가지인가?"**로 판단한다.

```
질문: "이 파일을 수정해야 하는 이유를 나열해봐"
- 1가지 → ✅ SRP 준수
- 2가지 이상 → ⚠️ 분리 검토
```

예시:
- `order.service.ts`를 수정하는 이유: "화물 등록 로직 변경" + "정산 계산 규칙 변경" → 2가지 → 분리
- `dispatch.model.ts`를 수정하는 이유: "배차 상태 전이 규칙 변경" → 1가지 → OK

---

## 리뷰 체크리스트

### 1. 모듈 크기 (가장 직관적 신호)

300줄 이상이면 변경 이유가 여러 가지일 가능성 높음. 500줄 이상이면 거의 확실히 SRP 위반.

### 2. Accidental Duplication (증상 1)

다른 actor가 의존하는 **공유 로직**을 찾는다.

```
패턴:
- 공유 유틸 함수를 2개 이상의 서로 다른 actor 경로에서 import
- Service 메서드가 화주용 로직과 정산팀용 로직을 모두 포함
- Domain 모델 메서드가 여러 actor의 규칙을 혼합
```

왜 위험한가: Actor A의 요청으로 공유 함수를 변경하면, Actor B의 기능이 의도치 않게 깨진다.

### 3. Merge Risk (증상 2)

같은 파일에 **다른 actor의 변경이 충돌**할 가능성을 평가한다.

```
패턴:
- Service 클래스에 public 메서드가 5개 이상이고 서로 다른 actor를 지원
- Route 파일에 GET(조회/운영자) + POST(등록/화주) + PATCH(상태변경/차주)
- Component에 표시(화주) + 관리(운영자) + 정산(정산팀) 로직 혼합
```

왜 위험한가: 두 팀이 같은 파일을 동시에 수정하면 merge conflict가 발생하고, 해결 과정에서 버그가 유입된다.

### 4. 레이어별 SRP 위반 패턴

| 레이어 | SRP 위반 신호 | 해결 방향 |
|--------|--------------|----------|
| **Route** | 하나의 route.ts에 5개 이상 HTTP 메서드 | actor별 route 분리 또는 Facade |
| **Service** | public 메서드가 다른 actor를 지원 | actor별 Service 분리 (QueryService/CommandService) |
| **Domain** | 모델 메서드가 다른 bounded context 규칙 혼합 | 도메인 이벤트 또는 별도 모델로 분리 |
| **Component** | 하나의 컴포넌트가 표시+편집+관리 | 역할별 컴포넌트 분리 |

---

## 영향도 평가 기준

| 등급 | 조건 | 설명 |
|------|------|------|
| 🔴 **Critical** | 3개 이상 actor가 하나의 모듈에 의존 + 공유 로직 존재 | 변경 시 의도치 않은 파급. 즉시 분리 필요 |
| 🟠 **High** | 2개 actor 의존 + 변경 빈도 높음 | merge 충돌 위험. 분리 계획 필요 |
| 🟡 **Medium** | 2개 actor 의존 + 변경 빈도 낮음 | 인지하고 있으면 됨. 다음 변경 시 분리 |
| 🟢 **Low** | 1개 actor 또는 순수 인프라 | SRP 준수. 현상 유지 |

---

## 출력 형식

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📐 SRP REVIEW REPORT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📁 대상: {파일 또는 변경 범위}

🎭 Actor 분석:
  - {파일}: {Actor A} + {Actor B} → ⚠️ 복수 actor

🔍 발견 사항:

[1] 🟠 {파일:라인} — Accidental Duplication
    Actor: {A}가 의존하는 regularHours()를 {B}도 사용
    영향: {A}의 요청으로 변경 시 {B} 기능 파손 위험
    해결: {구체적 분리 방안}

[2] 🟡 {파일:라인} — Merge Risk
    Actor: GET(운영자) + POST(화주) 가 같은 route에 공존
    영향: 동시 변경 시 충돌
    해결: {구체적 분리 방안}

📊 요약:
  🔴 Critical: 0건
  🟠 High: 1건
  🟡 Medium: 1건
  🟢 Low: 3건
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```
