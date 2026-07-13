---
name: auth
description: "인증/세션/인가 규칙. JWT, 쿠키, 미들웨어 보호 작업 시 참조. 토큰 갱신, httpOnly 쿠키, x-user-seq 헤더를 포함. 인증 관련 코드를 작성하거나 수정할 때 이 스킬을 사용할 것."
---

# Auth Skill

## 적용 시점

인증, 세션, 인가 관련 코드를 작성하거나 수정할 때.

## 필수 참조
- 보안 규칙: `docs/standards/auth/06-security-rules.md`

## 심화 참조 (해당 상황에서 읽을 것)
- 현재 인증 아키텍처 파악 → `docs/standards/auth/01-current-architecture.md`
- NextAuth/세션 구조 → `docs/standards/auth/02-nextauth-v4-and-session.md`
- JWT/쿠키/리프레시 흐름 → `docs/standards/auth/03-jwt-cookies-refresh.md`
- 미들웨어/라우트 보호 → `docs/standards/auth/04-middleware-and-route-protection.md`
- 클라이언트 인증 상태 → `docs/standards/auth/05-client-auth-state.md`
- 현재 코드 위반 현황 → `docs/standards/auth/gap-analysis.md`

## 현재 구조

- Custom JWT (jose) 기반 인증. NextAuth v4는 설정만 존재
- Access Token: httpOnly 쿠키, HS256, 15분
- Refresh Token: httpOnly 쿠키 + DB (user_tokens), HS256, 7일
- 미들웨어: Edge에서 토큰 검증 → x-user-* 헤더 주입
- 클라이언트: Zustand persist (auth-store) → UI 캐시 역할

## 핵심 파일

| 파일 | 역할 |
|------|------|
| `middleware.ts` | 토큰 검증, 헤더 주입, 라우트 보호 |
| `utils/jwt.ts` | JWT 생성/검증 (jose) |
| `utils/auth.ts` | 클라이언트 auth 헬퍼 |
| `store/auth-store.ts` | Zustand auth state |
| `app/api/auth/login/route.ts` | 로그인 엔드포인트 |
| `app/api/auth/refresh/route.ts` | 토큰 갱신 |
| `app/api/auth/logout/route.ts` | 로그아웃 |
| `server/auth/` | 로그인 서비스 + Repository |

## Do

- httpOnly 쿠키가 서버 auth의 유일한 source of truth
- 쿠키 설정: `httpOnly: true`, `secure: true` (prod), `sameSite: 'lax'`
- 비밀번호 비교: 반드시 `bcrypt.compare()` 사용
- Route Handler에서 재인가 수행 (미들웨어만 의존하지 않음)
- 에러 메시지: 사용자 존재 여부 노출하지 않음
- Refresh Token 갱신 시 Rotation 적용

## Avoid

- Access Token을 localStorage/Zustand에 저장
- 서명 없이 JWT 파싱하여 인증 결정에 사용
- 미들웨어에서 DB 접근 또는 self-call
- GET 메서드로 로그아웃
- 클라이언트에서 보낸 x-user-* 헤더를 서버에서 신뢰
- NextAuth와 custom JWT를 혼용
