---
name: shadcn-radix
description: "shadcn/ui + Radix UI 컴포넌트 사용 기준. Dialog, Sheet, Select 등 UI 컴포넌트 추가 시 참조. 컴포넌트 설치, 커스터마이징, asChild 패턴을 포함. UI 컴포넌트를 추가하거나 수정할 때 이 스킬을 사용할 것."
---

# shadcn/ui + Radix UI Skill

## 적용 시점
- components/ui/ 수정 시
- Dialog, Sheet, Popover, Select 등 사용 시
- 새 UI 컴포넌트 추가 시

## 필수 참조
- 기준 문서: `docs/standards/shadcn-radix.md`
- 갭 분석: `docs/standards/shadcn-radix-gap-analysis.md`

## 핵심 규칙

1. **shadcn 래퍼 사용** — Radix 직접 import 금지 (래퍼 없는 경우 제외)
2. **Dialog/Sheet → Title + Description 필수** — a11y 경고는 속성 제거가 아닌 VisuallyHidden
3. **components/ui/ 수정 최소화** — 커스텀 로직은 별도 래퍼로
4. **CSS 변수 토큰** — `bg-primary` 사용, `bg-blue-500` 하드코딩 금지
5. **CVA로 variant** — variant가 있는 컴포넌트는 cva() 사용
6. **asChild + forwardRef** — 합성 대상은 ref 전달 필수

## 새 UI 컴포넌트 체크리스트

- [ ] shadcn에 해당 컴포넌트가 있는지 확인 (있으면 설치)
- [ ] Radix 래퍼라면 data-slot 패턴 적용
- [ ] cn() + className prop 병합
- [ ] variant → CVA 정의
- [ ] 접근성: Title/Description/Label 포함
- [ ] 다크 모드에서 동작 확인
