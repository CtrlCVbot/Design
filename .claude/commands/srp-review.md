# /srp-review — SRP 전문가 코드 리뷰

변경된 코드를 SRP(Single Responsibility Principle) 관점으로 리뷰합니다.

> 방법론: `.claude/skills/srp-review.md` 참조

---

## 사용법

```
/srp-review                              # 현재 변경 파일 전체 리뷰
/srp-review server/order/                # 특정 디렉토리 리뷰
/srp-review path/to/file.ts             # 특정 파일 리뷰
/srp-review --domain order               # order 도메인 전체 cross-layer 리뷰
```

---

## 수행 단계

### 1단계: 대상 파일 수집

**인자가 없는 경우:**

```bash
git diff --name-only HEAD
```

세션에서 변경된 파일이 없으면 `%TEMP%/claude-edits.log`에서 수집.

**`--domain <name>` 인자가 있는 경우:**

`.claude/skills/domain-map.md`를 읽고, 해당 도메인에 매핑된 모든 경로(Backend/Frontend/Route/Store/Type/Service)의 `.ts`/`.tsx` 파일을 대상으로 한다.

**경로 인자가 있는 경우:**

해당 경로의 `.ts`/`.tsx` 파일을 대상으로 한다.

### 2단계: 스킬 로드

`.claude/skills/srp-review.md`를 읽고 Actor 맵과 체크리스트를 숙지한다.

### 3단계: Actor 식별

각 파일에 대해:
1. 이 모듈을 변경 요청할 수 있는 actor 식별
2. 복수 actor가 의존하면 플래그

### 4단계: 위반 패턴 검사

스킬의 4가지 체크리스트를 순서대로 수행:
1. Actor 식별
2. Accidental Duplication 검사
3. Merge Risk 평가
4. 레이어별 SRP 위반 패턴 확인

### 5단계: 영향도 평가 + 리포트

스킬의 영향도 기준(Critical/High/Medium/Low)으로 등급을 매기고, 출력 형식에 맞춰 리포트 출력.

---

## 완료 시

```
srp-review 작업완료!
```
