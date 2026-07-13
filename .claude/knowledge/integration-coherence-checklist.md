# 통합 정합성 검증 (Integration Coherence Verification)

> QA 시 "존재 확인"이 아닌 **"경계면 교차 비교"**를 수행하기 위한 체크리스트.
> 빌드가 통과해도 런타임에 실패하는 버그는 대부분 경계면 불일치에서 발생한다.

---

## 핵심 원칙: 양쪽을 동시에 읽어라

한쪽만 읽으면 각각 "올바르게" 보이지만, 연결 지점에서 계약이 어긋남.

| 검증 대상 | 생산자 (왼쪽) | 소비자 (오른쪽) |
|----------|-------------|---------------|
| API 응답 shape | route.ts의 `NextResponse.json()` | hooks/의 `fetchJson<T>` |
| 라우팅 | `app/` page 파일 경로 | `href`, `router.push` 값 |
| 상태 전이 | 도메인 모델의 전이 규칙 | `.update({ status })` 코드 |
| DB → API → UI | DB 스키마 컬럼명 | API 응답 필드 → 프론트 타입 정의 |

---

## 체크리스트

### API ↔ 프론트엔드 연결

- [ ] 모든 API route의 응답 shape과 대응 훅의 제네릭 타입이 일치
  - 왜: `fetchJson<T>()`의 T는 컴파일러가 검증 안 함. 런타임 shape이 다르면 크래시
- [ ] 래핑된 응답(`{ items: [...] }`)은 훅에서 unwrap하는지 확인
  - 왜: API가 객체를 반환하는데 훅이 배열을 기대하면 `.filter is not a function`
- [ ] camelCase ↔ snake_case 변환이 일관되게 적용
  - 왜: DB는 snake_case, 프론트는 camelCase — 중간 변환 누락 시 `undefined`
- [ ] 모든 API 엔드포인트에 대응하는 프론트 훅이 존재하고 실제 호출됨
  - 왜: API만 있고 훅이 없으면 기능이 죽은 코드

### 라우팅 정합성

- [ ] 코드 내 모든 `href`/`router.push` 값이 실제 page 파일 경로와 매칭
  - 왜: 경로 오타 = 404. 특히 route group `(group)`이 URL에서 제거되는 것 주의
- [ ] 동적 세그먼트(`[id]`)가 올바른 파라미터로 채워지는지 확인

### 상태 머신 정합성

- [ ] 도메인 모델에 정의된 모든 상태 전이가 코드에서 실행됨 (죽은 전이 없음)
- [ ] 코드의 모든 status 업데이트가 도메인 모델의 전이 규칙과 일치 (무단 전이 없음)
- [ ] 프론트에서 상태 기반 분기(`if status === "X"`)의 X가 실제 도달 가능

### 데이터 흐름 정합성

- [ ] DB 스키마 필드명 → API 응답 필드명 → 프론트 타입 정의가 일관됨
- [ ] 옵셔널 필드에 대한 null/undefined 처리가 양쪽에서 일관됨

---

## 검증 방법

### API 응답 ↔ 훅 타입 교차 검증

```
1. API route에서 NextResponse.json()에 전달하는 객체의 shape 추출
2. 대응 훅에서 fetchJson<T>의 T 타입 확인
3. shape과 T가 일치하는지 비교
4. withErrorHandler 래핑 여부 확인
```

### 파일 경로 ↔ 링크 경로 매핑

```
1. app/ 하위 page.tsx 파일 경로에서 URL 패턴 추출
2. 코드 내 모든 href=, router.push( 값 수집
3. 각 링크가 실제 존재하는 page 경로와 매칭되는지 확인
```

### 상태 전이 완전성 추적

```
1. 도메인 모델에서 허용된 전이 목록 추출
2. 모든 API route/service에서 상태 변경 패턴 검색
3. 각 전이가 도메인 규칙에 정의되어 있는지 확인
```
