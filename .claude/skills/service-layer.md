---
name: service-layer
description: "Service Layer 상세 규칙. server/**/application/**/*.service.ts 작업 시 참조. 조율 역할, drizzle/zod 금지, 응답 구조, Testability 원칙을 포함. Service 클래스를 생성하거나 수정할 때 이 스킬을 사용할 것."
---

# Service Layer Skill

## 적용 조건

- `server/**/*.ts` 파일 중 service 레이어 작업 시
- `services/**/*.ts` 파일 작업 시

## 🚨 CRITICAL: 레이어 책임 검증

> **"이 코드가 Service 레이어의 책임인가?"**
> - 조율만 하고 있는가? (구현이 아닌 위임)
> - 도메인 모델에 있어야 할 로직이 아닌가?

---

## 규칙

- 무슨 조율을 하는지 한눈에 알아볼 수 있어야 하므로 최대한 간단하게
- 해당 레이어에서의 파라미터 전개는 최소화한다
- repository와 도메인 모델을 조합해서 조율하는 역할
- drizzle, zod 의존성 금지. 왜: drizzle이 들어오면 Service가 DB 구현에 결합되어 단위 테스트에서 DB mock이 필요해진다. zod는 HTTP 검증 도구이므로 Route 책임.
- 도메인 모델에 있어야 할 '구현' 로직을 작성하고 있진 않은지 확인. 왜: Service에 비즈니스 로직이 있으면 테스트에서 repository mock이 필요해지고, 같은 규칙을 여러 Service에서 중복 구현하게 된다.
- 위임이 아니라 구현을 하고 있진 않은지 확인. 왜: Service가 구현을 하면 if/else 분기가 늘어나고 테스트가 조합 폭발한다. 도메인 모델에 위임하면 모델의 단위 테스트로 커버된다.
- **서사 정리용 private 메서드 추출 지양** (가독성 저해, 코드 분산)
    - "몇 번 쓰였냐"보다 **"독립된 의미가 있냐"**가 기준
    - 추출 O: 도메인 규칙 이름 부여 가능, 외부 입력 조립, 부수효과 경계 분리, 검증 규칙 응집
    - 추출 X: 이름이 본문 요약일 뿐, 파라미터 4~5개 전달, 결국 내부를 다시 읽어야 함
    - 이름이 prepare/process/handle/do → 의심. buildModifySpec/mapToInput/persistChanges → OK

---

## 응답 구조

- service는 엔티티/DTO만 반환
- `{ data, success }` 래핑은 `withErrorHandler`가 담당
- service에서 `{ data: ..., message: ... }` 형태로 반환하면 이중 래핑 발생하므로 금지
- 응답 구조 전개는 Response DTO의 변환 함수에서 처리 (`toXxxResponse({ ...params })` 호출만)

---

## 엔티티 존재 검증

- `orElseThrow(await repository.findById(id), new NotFoundError(id))` 패턴 사용
- `existsById` + if문 대신 `orElseThrow` + `findById`로 간결하게 처리

---

## 🔑 Testability 원칙: mock은 외부 의존성만

> 서비스 테스트에서 repository를 mocking하고 있다면?
> → 비즈니스 로직이 서비스에 있다는 신호. **도메인 모델로 이동 검토**

→ 상세 패턴: `.claude/skills/domain-modeling.md` > Rich Domain Model 패턴 참조
