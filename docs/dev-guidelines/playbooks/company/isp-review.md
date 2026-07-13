# /isp-review — ISP 전문가 코드 리뷰

변경된 코드를 ISP(Interface Segregation Principle) 관점으로 리뷰합니다.

> 방법론: `../../guidelines/company/isp-review.md` 참조

---

## 사용법

```
/isp-review                              # 현재 변경 파일 전체 리뷰
/isp-review server/order/                # 특정 디렉토리 리뷰
/isp-review path/to/file.ts             # 특정 파일 리뷰
/isp-review --domain order               # order 도메인 전체 cross-layer 리뷰
```

---

## 수행 단계

### 1단계: 대상 파일 수집

**인자 없으면:** `git diff --name-only HEAD` 또는 `%TEMP%/claude-edits.log`.

**`--domain <name>` 인자가 있는 경우:** `.claude/skills/domain-map.md`를 읽고, 해당 도메인에 매핑된 모든 경로의 `.ts`/`.tsx` 파일을 대상으로 한다.

**경로 인자가 있는 경우:** 해당 경로의 `.ts`/`.tsx` 파일을 대상으로 한다.

### 2단계: 스킬 로드

`../../guidelines/company/isp-review.md`를 읽고 위반 패턴을 숙지한다.

### 3단계: 위반 패턴 검사

1. **Fat Type** — 거대 타입을 import하고 일부만 사용
2. **God Props** — 컴포넌트 Props가 과다하고 실제 사용은 일부
3. **Barrel 과다 의존** — index.ts에서 불필요한 것까지 import
4. **거대 Service 인터페이스** — public 메서드가 과다 (CQRS 미적용)

### 4단계: 영향도 평가 + 리포트

스킬의 영향도 기준(Critical/High/Medium/Low)으로 등급을 매기고 리포트 출력.

---

## 완료 시

```
isp-review 작업완료!
```
