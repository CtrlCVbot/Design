---
name: nextjs
description: "Next.js 15 App Router 사용 기준. page/layout/route handler/middleware 작업 시 참조. 서버/클라이언트 컴포넌트, metadata, 라우팅을 포함. Next.js 페이지나 API를 생성하거나 수정할 때 이 스킬을 사용할 것."
---

# Next.js Skill

## 적용 시점
- app/ 디렉토리 파일 수정 시
- Route Handler (app/api/) 작성/수정 시
- middleware.ts 수정 시
- layout.tsx, page.tsx, loading.tsx, error.tsx 작성 시

## 필수 참조
- 프로젝트 규칙: `docs/standards/nextjs/06-project-rules.md`

## 심화 참조 (해당 상황에서 읽을 것)
- app/ 디렉토리 구조 판단 → `docs/standards/nextjs/01-app-router-structure.md`
- 서버/클라이언트 컴포넌트 경계 → `docs/standards/nextjs/02-server-vs-client.md`
- 데이터 페칭/캐싱 전략 → `docs/standards/nextjs/03-data-fetching-caching-revalidation.md`
- Route Handler/미들웨어 작성 → `docs/standards/nextjs/04-route-handlers-middleware.md`
- 내비게이션/메타데이터/에러 → `docs/standards/nextjs/05-navigation-metadata-error-loading.md`
- 환경변수 설정 → `docs/standards/nextjs/07-environment-variables.md`
- 이미지/폰트/번들 최적화 → `docs/standards/nextjs/08-optimization.md`
- 현재 코드 위반 현황 → `docs/standards/nextjs/gap-analysis.md`

## 핵심 규칙

1. **'use client' 최소 범위** — 인터랙티브 리프 컴포넌트에만
2. **params/searchParams/cookies/headers await 필수** — v15 비동기 API
3. **Route Handler = 게이트웨이** — 파싱 + 검증 + Service 호출만
4. **Link 우선** — 선언적 내비게이션, 프리페칭 자동
5. **loading.tsx 추가** — 동적 라우트에 내비게이션 피드백
6. **페이지별 metadata** — 최소 title export
7. **fetch() 캐싱 안 됨 (v15)** — 필요시 명시적 설정
8. **NEXT_PUBLIC_ 경계** — 시크릿에 NEXT_PUBLIC_ 절대 금지
9. **대형 컴포넌트는 dynamic import 검토** — 모달/시트 1000줄+ 대상
10. **img 대신 next/image** — 자동 최적화, LCP에 priority

## 새 페이지 체크리스트

- [ ] page.tsx 생성
- [ ] `export const metadata` 또는 `generateMetadata` 추가
- [ ] loading.tsx 추가 (동적 라우트)
- [ ] error.tsx 추가 (중요 페이지)
- [ ] 'use client' 최소 범위 확인
- [ ] 새 환경변수 추가 시 NEXT_PUBLIC_ 필요 여부 확인
- [ ] 대형 컴포넌트 import 시 dynamic import 검토

## 새 Route Handler 체크리스트

- [ ] withErrorHandler 래핑
- [ ] validation.ts에 Zod 스키마 정의
- [ ] params는 `Promise<>` 타입 + await
- [ ] Service 레이어 호출 (직접 로직 금지)
