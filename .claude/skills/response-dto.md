---
name: response-dto
description: "Response DTO 작성 규칙. DTO/Response 타입 작성 시 참조. application layer Response 는 dto/*.response.ts 분리, Command/Query input 은 service 파일 응집, Route zod 가 request 검증 책임. API 응답 타입을 정의하거나 수정할 때 이 스킬을 사용할 것."
---

# Response DTO Skill

## 적용 조건
- Response DTO 작성 시
- 서비스 파일 내 Response 타입/변환 함수 작업 시
- 공유 DTO인 경우 `**/dto/*.ts` 파일 작업 시

---

## 기본 원칙
- 타입 추론 활용
- 필요한 경우에만 명시적 interface 정의
- **application layer 의 Response DTO 는 별도 파일로 분리** (아래 "파일 위치 규칙" 참조)

---

## 파일 위치 규칙 (application layer)

이 프로젝트는 DDD + CQRS 스택이라 입력이 3 군데로 분산된다. Java MVC 의 `dto/request`, `dto/response` 2-folder 분리와 다르다.

| 역할 | 위치 | 비고 |
|---|---|---|
| **외부 경계 검증** (HTTP body shape) | Route 의 `validation.ts` (zod schema) | `z.infer<>` 로 type 추론. Route 책임 |
| **유스케이스 입력** (Command/Query interface) | `application/.../*-command.service.ts` 또는 `*-query.service.ts` 와 같은 파일 | use case 와 응집도 높음. CQRS 어휘. 외부 export 불필요 |
| **응답 계약** (Response interface + 변환 함수) | `application/.../dto/*.response.ts` | **별도 파일로 분리.** frontend·다른 service 가 참조하는 boundary contract |

### 명명 규칙
- 파일: `<feature>.response.ts` (flat, `request/`·`response/` 하위 폴더 없음)
- export: `<Feature>Response`, `<Feature>Result`, `to<Feature>Response()` 변환 함수
- 위치: 해당 service 가 속한 `application/<commands|queries>/dto/`

### 선례
- `server/charge/application/queries/dto/charge-group.response.ts`
- `server/auth/application/commands/dto/login.response.ts`

### 분리 기준 (언제 dto/ 로 빼나)
- ✅ frontend 또는 다른 service 가 참조 가능한 응답 형태 → 분리
- ✅ 변환 함수 `toXResponse()` 가 service 외부에서도 재사용 → 분리
- ❌ service 파일 안에서만 쓰이는 input shape (`Command`, `Query` interface) → 같은 파일 유지
- ❌ DB row 그대로 + `ReturnType<typeof ...>` 추론으로 충분 → 같은 파일 유지

---

## 상황별 가이드

| 상황 | 방식 | 이유 |
|------|------|------|
| DB row 그대로 반환 | `...row` spread + `ReturnType` 추론 | 중복 제거 |
| 계산 필드 추가 | `...row` + 계산 필드 | 심플하게 확장 |
| 필드 숨김/변환 필요 | 명시적 interface | API 계약 명확화 |
| 외부 API/SDK 제공 | 명시적 interface | 문서화, 버전 관리 |
| 여러 소스 조합 | 명시적 interface | 복잡도 관리 |

---

## 코드 예시

### 1. 단순 조회 (DB row + 계산 필드)
```typescript
const toItemResponse = (row: DbRow) => ({
  ...row,
  profit: row.amount * 0.1,
});
export type ItemResponse = ReturnType<typeof toItemResponse>;
```

### 2. 필드 숨김/변환 필요 시
```typescript
interface UserResponse {
  id: string;
  displayName: string;  // DB: display_name
  // password 제외
}
```

---

## 체크리스트
- [ ] 불필요한 interface 정의가 없는가?
- [ ] `ReturnType` 추론으로 충분한 경우인가?
- [ ] 외부 노출 API의 경우 명시적 interface가 정의되어 있는가?
- [ ] application layer Response DTO 가 `application/.../dto/<feature>.response.ts` 로 분리되어 있는가?
- [ ] `Command`/`Query` input interface 는 service 파일 안에 응집되어 있는가? (외부 export 금지)
