---
name: drizzle
description: "Drizzle ORM 스키마/쿼리/트랜잭션 규칙. DB 스키마, Repository, 쿼리 작업 시 참조. pgTable 정의, select/insert/update 패턴, 트랜잭션을 포함. DB 관련 코드를 작성하거나 수정할 때 이 스킬을 사용할 것."
---

# Drizzle ORM Skill

## 적용 시점
- db/schema/ 수정 시
- server/**/infrastructure/*.repository.ts 수정 시
- DB 쿼리 작성/수정 시
- 트랜잭션 로직 작성 시

## 필수 참조
- 프로젝트 규칙: `docs/standards/drizzle/05-project-rules.md`

## 심화 참조 (해당 상황에서 읽을 것)
- 스키마 정의/타입 추론 → `docs/standards/drizzle/01-schema-and-type-inference.md`
- 쿼리 패턴(select/query/join) → `docs/standards/drizzle/02-query-patterns.md`
- 트랜잭션/에러 처리 → `docs/standards/drizzle/03-transactions-and-error-handling.md`
- 쿼리 성능 최적화 → `docs/standards/drizzle/04-performance.md`
- 현재 코드 위반 현황 → `docs/standards/drizzle/gap-analysis.md`

## 핵심 규칙

1. **$inferSelect 우선** — 수동 타입 정의 금지, 스키마에서 추론
2. **select vs query 구분** — 관계 로딩 = db.query + with, 집계 = db.select()
3. **명시적 컬럼 선택** — SELECT * 금지, 필요한 컬럼만
4. **트랜잭션 원자성** — 관련 변경은 db.transaction() 내에서
5. **optional tx 지원** — Repository 메서드에 tx?: Transaction 매개변수
6. **트랜잭션 내 외부 호출 금지** — 커밋 후 best-effort
7. **N+1 방지** — inArray() + Map 또는 with 절
8. **동적 조건 빌드** — 조건 배열 + and(...conditions)
9. **raw SQL 최소화** — Drizzle API로 표현 가능하면 API 사용
10. **as any 금지** — $inferInsert 타입 명시, 구체적 타입 전달

## Repository 체크리스트

- [ ] DB 접근이 Repository에 캡슐화되었는지
- [ ] $inferSelect/$inferInsert로 타입 추론하는지
- [ ] 필요한 컬럼만 선택하는지
- [ ] N+1 쿼리가 없는지
- [ ] 관련 변경이 트랜잭션으로 묶였는지
- [ ] optional tx 매개변수 지원하는지
- [ ] as any 없이 타입 안전한지

## 스키마 수정 체크리스트

- [ ] 컬럼 추가/변경 후 마이그레이션 생성했는지
- [ ] 생성된 SQL 검토했는지 (rename → drop+create 주의)
- [ ] 새 FK에 인덱스 추가했는지
- [ ] relations.ts 관계 정의 업데이트했는지
- [ ] 수동 타입 중복 없이 $inferSelect로 파생하는지
