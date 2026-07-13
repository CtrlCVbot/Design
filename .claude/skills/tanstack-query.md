---
name: tanstack-query
description: "TanStack Query 서버 상태 관리 기준. useQuery/useMutation 작성 시 참조. queryKey 설계, invalidation 전략, 에러 처리를 포함. 서버 데이터 페칭 훅을 작성하거나 수정할 때 이 스킬을 사용할 것."
---

# TanStack Query Skill

## 적용 시점
- useQuery, useMutation, useQueryClient 사용 코드 수정 시
- 서버 데이터 페칭 로직 추가/수정 시
- API 호출 관련 hook 작성 시

## 필수 참조
- 기준 문서: `docs/standards/tanstack-query.md`
- 갭 분석: `docs/standards/tanstack-query-gap-analysis.md`

## 핵심 규칙

1. **서버 데이터는 Query로 관리** — store에 fetch/isLoading/error 넣지 않음
2. **Query key는 factory 패턴** — 인라인 문자열 하드코딩 금지
3. **Mutation 후 반드시 invalidation** — onSuccess에서 invalidateQueries
4. **Query 결과를 state/store에 복사하지 않음** — 직접 사용
5. **queryFn 반환 타입에서 추론** — 제네릭 직접 전달 금지
6. **enabled 대신 skipToken** (id가 nullable일 때)
7. **SWR 신규 사용 금지** — 새 서버 데이터는 반드시 Query

## Query vs Zustand 판정

| 질문 | Yes → Query | No → Zustand |
|---|---|---|
| 서버 API에서 온 데이터인가? | useQuery | store |
| refetch/캐시 무효화가 필요한가? | useQuery | store |
| isLoading/error를 관리해야 하는가? | useQuery 자동 | store 불필요 |
| 여러 컴포넌트가 같은 데이터 공유? | useQuery (dedupe) | store |

## 새 Query hook 체크리스트

- [ ] query key factory에 key 추가
- [ ] queryFn의 반환 타입 명시 (제네릭 추론)
- [ ] staleTime 도메인에 맞게 설정
- [ ] nullable id는 skipToken 사용
- [ ] 관련 mutation에 invalidation 연결
