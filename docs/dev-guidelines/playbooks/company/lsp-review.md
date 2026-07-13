# /lsp-review — LSP 전문가 코드 리뷰

변경된 코드를 LSP(Liskov Substitution Principle) 관점으로 리뷰합니다.

> 방법론: `../../guidelines/company/lsp-review.md` 참조

---

## 사용법

```
/lsp-review                              # 현재 변경 파일 전체 리뷰
/lsp-review server/order/                # 특정 디렉토리 리뷰
/lsp-review path/to/file.ts             # 특정 파일 리뷰
/lsp-review --domain order               # order 도메인 전체 cross-layer 리뷰
```

---

## 수행 단계

### 1단계: 대상 파일 수집

**인자 없으면:** `git diff --name-only HEAD` 또는 `%TEMP%/claude-edits.log`.

**`--domain <name>` 인자가 있는 경우:** `.claude/skills/domain-map.md`를 읽고, 해당 도메인에 매핑된 모든 경로의 `.ts`/`.tsx` 파일을 대상으로 한다.

**경로 인자가 있는 경우:** 해당 경로의 `.ts`/`.tsx` 파일을 대상으로 한다.

### 2단계: 스킬 로드

`../../guidelines/company/lsp-review.md`를 읽고 위반 패턴을 숙지한다.

### 3단계: 위반 패턴 검사

1. **API 응답 형식 불일치** — 같은 도메인 엔드포인트 간 응답 구조 비교
2. **에러 처리 불일치** — 같은 계층 모듈 간 에러 패턴 비교
3. **구현별 특수 케이스** — 호출측에서 구현 타입 체크하는 if/instanceof
4. **Optional 필드 불일치** — 같은 타입인데 상태에 따라 필드 유무 다름

### 4단계: 영향도 평가 + 리포트

스킬의 영향도 기준(Critical/High/Medium/Low)으로 등급을 매기고 리포트 출력.

---

## 완료 시

```
lsp-review 작업완료!
```
