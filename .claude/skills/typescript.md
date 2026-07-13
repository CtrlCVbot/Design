---
name: typescript
description: "TypeScript 타입 정의, 추론, 제네릭 규칙. 타입 정의 파일 작업 시 참조. 타입 추론 활용, narrowing, union 타입을 포함. 타입을 정의하거나 수정할 때 이 스킬을 사용할 것."
---

# TypeScript Skill

## 적용 시점
- TS/TSX 파일 수정 시
- 타입 정의, 인터페이스, 제네릭 작업 시
- `as any`, `!`, `as` 사용 검토 시
- 새 도메인 모델/DTO 타입 정의 시

## 필수 참조
- 프로젝트 규칙: `docs/standards/typescript/06-project-rules.md`

## 심화 참조 (해당 상황에서 읽을 것)
- 타입 추론 vs 명시 판단 → `docs/standards/typescript/01-type-inference-and-annotations.md`
- narrowing/판별 유니온 작성 → `docs/standards/typescript/02-narrowing-and-discriminated-unions.md`
- as/!/단언 사용 검토 → `docs/standards/typescript/03-type-assertions-and-non-null.md`
- 유틸리티 타입 활용 → `docs/standards/typescript/04-utility-types-and-type-composition.md`
- 제네릭 설계 → `docs/standards/typescript/05-generics.md`
- 현재 코드 위반 현황 → `docs/standards/typescript/gap-analysis.md`

## 핵심 규칙

1. **추론 우선** — 변수/콜백은 TS 추론. export 함수/경계만 반환 타입 명시
2. **any 금지** — unknown부터 시작, narrowing으로 좁힘
3. **as 단언 최소화** — 외부 경계(Zod parse, DOM, SDK)에서만 허용
4. **! 대신 방어 로직** — optional chaining, nullish coalescing, null 체크 + throw
5. **narrowing으로 분기** — typeof, in, 판별 유니온 + switch
6. **exhaustive never** — union switch에 default: assertNever(x)
7. **스키마 추론** — z.infer, $inferSelect로 수동 중복 방지
8. **interface 우선** — 객체는 interface, 유니온/조합은 type
9. **Record<string, any> 금지** — 구체적 키/값 타입 사용
10. **도메인 vs UI 타입 분리** — 도메인 타입에 UI 편의 필드 혼합 금지

## 타입 정의 체크리스트

- [ ] 변수에 불필요한 타입 어노테이션 없는지
- [ ] export 함수에 반환 타입 명시했는지
- [ ] `any` 대신 `unknown` + narrowing 사용했는지
- [ ] `as` 단언이 외부 경계에서만 사용되는지
- [ ] `!` 사용 시 null 불가능 근거가 있는지
- [ ] 수동 중복 타입 대신 z.infer/Pick/Omit 활용했는지
- [ ] switch 분기에 exhaustive 검사 있는지

## 테스트 코드 타입 규칙

- `as any` 최소화 — Partial<T> 또는 테스트 팩토리 우선
- `as unknown as T` — mock 생성 시 예외적 허용
- `!` — expect() assertion 이후 사용 자제, 먼저 toBeDefined() 확인
