---
name: tailwind
description: "Tailwind CSS v4 유틸리티 클래스 사용 기준. className 수정, 스타일링 시 참조. cn() 유틸, 반응형, 다크 모드를 포함. 스타일링을 추가하거나 수정할 때 이 스킬을 사용할 것."
---

# Tailwind CSS Skill

## 적용 시점
- 컴포넌트의 className 수정 시
- globals.css / @theme 수정 시
- 새 UI 컴포넌트 작성 시

## 필수 참조
- 기준 문서: `docs/standards/tailwind.md`
- 갭 분석: `docs/standards/tailwind-gap-analysis.md`

## 핵심 규칙

1. **조건부 클래스는 cn()** — ternary, template literal 직접 사용 금지
2. **동적 클래스 생성 금지** — `bg-${color}-500` 불가, 매핑 객체 사용
3. **컴포넌트 추출 > @apply** — 반복 클래스는 React 컴포넌트로
4. **CVA로 variant 정의** — variant가 있는 UI 컴포넌트는 cva() 필수
5. **반복 arbitrary value → @theme** — 하드코딩 색상/간격은 토큰으로
6. **모바일 우선** — unprefixed = 전체, sm: = 640px 이상

## className 작성 체크리스트

- [ ] 조건부 클래스 → `cn()` 사용
- [ ] 동적 값 → 매핑 객체 (complete class strings)
- [ ] variant가 2개 이상 → CVA 검토
- [ ] 같은 arbitrary value 3회 이상 → @theme 토큰
- [ ] 외부 className prop → `cn(기본클래스, className)` 병합
