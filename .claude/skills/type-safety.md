---
name: type-safety
description: "타입 안전성 가이드. as any, as unknown 사용 검토 시 참조. 타입 단언 대안, 제네릭 활용, 타입 가드 패턴을 포함. 타입 에러를 해결하거나 any를 제거할 때 이 스킬을 사용할 것."
---

# Type Safety Skill

## 적용 조건
- TypeScript 코드 작업 시
- `as any` 사용 검토 시

## 기본 원칙
- `as any`는 "금지"가 아니라 "비용을 알고 사용"
- 핵심 질문: "이 any가 런타임 버그로 이어질 가능성이 얼마나 되는가?"

---

## 제거 우선순위

| 우선순위 | 케이스 | 판단 기준 |
|----------|--------|-----------|
| 높음 | API 경계 (Request/Response) | 사용자 영향 큼, 반드시 타입 정의 |
| 높음 | 비즈니스 로직 핵심 경로 | 버그 시 치명적 |
| 중간 | 내부 유틸/헬퍼 | 영향 범위 제한적 |
| 낮음 | ORM 타입 캐스팅 | 값은 동일, 타입만 불일치 시 허용 |
| 낮음 | 테스트 mock 객체 | 전체 interface 구현 불필요 |
| 낮음 | 외부 라이브러리 타입 불일치 | 고치는 비용 > 이득 |

---

## 허용되는 경우

```typescript
// 1. ORM enum 타입 불일치 (값은 동일)
vehicleType: data.vehicleType as any,  // OK: Drizzle enum 타입 이슈

// 2. 테스트 mock (일부만 구현)
const mockRepo = { findById: jest.fn() } as any;  // OK

// 3. 외부 라이브러리 타입 버그/한계
externalLib.method(data as any);  // OK: 라이브러리 이슈
```

---

## 반드시 제거해야 하는 경우

```typescript
// 1. 구조가 명확한 데이터 → interface 정의
addressSnapshot: any  // BAD
addressSnapshot: AddressSnapshot | null  // GOOD

// 2. 배열/컬렉션 타입 → 구체적 타입 사용
const conditions: any[] = []  // BAD
const conditions: SQL[] = []  // GOOD (drizzle-orm)

// 3. reduce/map 콜백 → 타입 추론 활용
data.reduce((acc: any, row: any) => ...)  // BAD
data.reduce<Record<string, Item>>((acc, row) => ...)  // GOOD
```

---

## 공통 타입 정의 위치

`common/types/`에 재사용 가능한 스냅샷/공통 타입 정의

```typescript
// common/types/snapshots.ts
export interface AddressSnapshot {
  roadAddress?: string;
  jibunAddress?: string;
  postalCode?: string;
  lng?: number;
  lat?: number;
}
```
