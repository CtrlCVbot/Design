---
name: react-hook-form-zod
description: "React Hook Form + Zod 폼 관리 기준. useForm, zodResolver 사용 시 참조. 폼 스키마 정의, Controller 패턴, 에러 표시를 포함. 폼을 생성하거나 수정할 때 이 스킬을 사용할 것."
---

# React Hook Form + Zod Skill

## 적용 시점
- 폼 컴포넌트 작성/수정 시
- Zod 스키마 작성/수정 시
- useForm, Controller, zodResolver 사용 시

## 필수 참조
- 기준 문서: `docs/standards/react-hook-form-zod.md`
- 갭 분석: `docs/standards/react-hook-form-zod-gap-analysis.md`

## 핵심 규칙

1. **Zod 스키마 = 타입의 Single Source of Truth** — z.infer로 추론, 별도 interface 금지
2. **useForm + zodResolver 필수 세트** — resolver 없는 useForm 금지
3. **register 우선** — Controller는 shadcn/Radix 등 ref 미지원 컴포넌트에만
4. **useState로 폼 필드 관리 금지** — RHF의 uncontrolled 방식 사용
5. **폼 상태를 store에 실시간 동기화 금지** — submit 시에만 외부 전달
6. **에러 메시지는 스키마에서 관리** — 컴포넌트는 errors.field?.message만 렌더
7. **모달/시트 닫힐 때 form.reset()** — stale 데이터 방지

## 새 폼 작성 체크리스트

- [ ] Zod 스키마 정의 (validation + 에러 메시지)
- [ ] `type FormValues = z.infer<typeof schema>`
- [ ] `useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: {...} })`
- [ ] 기본 input → register, UI 라이브러리 → Controller
- [ ] handleSubmit(onSubmit) 연결
- [ ] 에러 표시: `errors.field?.message`
- [ ] 모달/시트 → onClose에 form.reset()
- [ ] 숫자 필드 → valueAsNumber 또는 z.coerce.number()
