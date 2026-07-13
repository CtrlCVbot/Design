---
name: testing
description: "백엔드 Unit/Integration 테스트 가이드. 테스트 코드 작성 시 참조. mock 전략, 테스트 구조, describe/it 네이밍 규칙을 포함. 백엔드 테스트를 작성하거나 수정할 때 이 스킬을 사용할 것."
---

# Backend Testing Skill

## 적용 조건

- `tests/**/*.ts` 파일 작업 시
- 백엔드 테스트 코드 작성 시

> **프론트엔드 테스트**는 `.claude/skills/testing-frontend.md` 참조

---

## Unit Test

### 대상

- domain model
- service layer

### 규칙

- SUT(System Under Test) 외의 다른 레이어의 구현에 대해서는 테스트하지 않는다
- domain model의 getter, equals 같은건 테스트하지 않는다
- service layer unit test는 모듈간 조율을 잘하는지 테스트해야지 도메인 로직이나 repository 구현을 테스트해서는 안된다
- **서비스 테스트에서 내부 모듈(repository 등) mocking이 많다면 Rich Domain Model 패턴 검토**
  → `.claude/skills/domain-modeling.md` > Rich Domain Model 패턴 참조

---

## Integration Test

### 대상

- 트랜잭션 단위 동작 검증 (필수)
- repository 구현 (허용)

### 규칙

- domain model, service layer에 대한 구현에 대해서 테스트하지 않는다
- repository의 구현에 대해서 테스트하는 것은 허용

### 검증 방식

- DB select보다 API 응답 DTO를 활용하는 것이 더 빠르고 간결하다
- 응답 DTO에 필요한 필드가 있으면 DB select 없이 응답으로 검증
- DB select는 응답에 없는 내부 필드 검증이나 롤백 검증 등 특수한 경우에만 사용

---

## 체크리스트

### Unit Test

- [ ] SUT만 테스트하는가?
- [ ] mock 객체가 적절히 사용되었는가?
- [ ] getter 테스트가 포함되어 있지 않은가?

### Integration Test

- [ ] 트랜잭션 단위가 잘 동작하는지 테스트하는가?
- [ ] API 응답 DTO로 검증 가능한 부분은 DB select 없이 검증하는가?
