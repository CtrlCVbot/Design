# /component-review — 컴포넌트 원칙 리뷰

모듈 간 결합과 응집을 CCP/ADP/SDP 관점으로 리뷰합니다.

> 방법론: `../../guidelines/company/component-review.md` 참조

---

## 사용법

```
/component-review                        # 현재 변경 파일의 도메인 간 의존 분석
/component-review server/order/          # 특정 도메인 모듈 분석
/component-review --domain order         # order 도메인 전체 cross-layer 분석
```

---

## 수행 단계

### 1단계: 대상 파일 수집

**인자 없으면:** `git diff --name-only HEAD` 또는 `%TEMP%/claude-edits.log`.

**`--domain <name>` 인자가 있는 경우:** `.claude/skills/domain-map.md`를 읽고, 해당 도메인에 매핑된 모든 경로의 `.ts`/`.tsx` 파일을 대상으로 한다.

**경로 인자가 있는 경우:** 해당 경로의 `.ts`/`.tsx` 파일을 대상으로 한다.

### 2단계: 스킬 로드

`../../guidelines/company/component-review.md`를 읽고 위반 패턴을 숙지한다.

### 3단계: 위반 패턴 검사

1. **도메인 간 직접 결합** — server/{A}/에서 server/{B}/를 import
2. **순환 의존** — A→B→A 양방향 의존
3. **안정→불안정 의존** — domain/service가 route/component에 의존

### 4단계: 영향도 평가 + 리포트

---

## 완료 시

```
component-review 작업완료!
```
