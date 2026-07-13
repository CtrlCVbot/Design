---
name: repository-layer
description: "Repository Layer 상세 규칙. server/**/infrastructure/**/*.repository.ts 작업 시 참조. 컬럼 선택, 타입 추론($inferInsert/$inferSelect), row 반환 원칙. Repository를 생성하거나 수정할 때 이 스킬을 사용할 것."
---

# Repository Layer Skill

## 적용 조건

- `server/**/*.ts` 파일 중 repository 레이어 작업 시
- `**/repository.ts` 파일 작업 시

## 🚨 CRITICAL: 레이어 책임 검증

> **"이 코드가 Repository 레이어의 책임인가?"**
> - 순수 데이터 접근만 하고 있는가?
> - 비즈니스 로직이 침투하지 않았는가?

---

## 규칙

- select 시 꼭 필요한 컬럼만 조회한다. 왜: `select()`로 전체 조회하면 불필요한 데이터 전송 + 민감 필드(비밀번호 등) 노출 위험.
- `$inferInsert`, `$inferSelect`를 사용해 타입 안전성 확보. 왜: 스키마 변경 시 Repository 타입이 자동 추론되어 컴파일 타임에 불일치를 잡는다.
- DTO ↔ DB 필드명 변환은 service layer 책임. 왜: Repository가 변환까지 하면 DB 스키마와 API 응답 포맷이 결합되어, 한쪽 변경이 양쪽을 깨뜨린다.
- DB row를 그대로 반환. 왜: Repository에서 도메인 모델로 변환하면 Repository가 도메인 지식을 갖게 되어 레이어 경계가 무너진다.

---
