# /ocp-review — OCP 전문가 코드 리뷰

변경된 코드를 OCP(Open-Closed Principle) 관점으로 리뷰합니다.

> 방법론: `../../guidelines/company/ocp-review.md` 참조

---

## 사용법

```
/ocp-review                              # 현재 변경 파일 전체 리뷰
/ocp-review server/order/                # 특정 디렉토리 리뷰
/ocp-review path/to/file.ts             # 특정 파일 리뷰
/ocp-review --domain order               # order 도메인 전체 cross-layer 리뷰
```

---

## 수행 단계

### 1단계: 대상 파일 수집

**인자 없으면:** `git diff --name-only HEAD` 또는 `%TEMP%/claude-edits.log`.

**`--domain <name>` 인자가 있는 경우:** `.claude/skills/domain-map.md`를 읽고, 해당 도메인에 매핑된 모든 경로의 `.ts`/`.tsx` 파일을 대상으로 한다.

**경로 인자가 있는 경우:** 해당 경로의 `.ts`/`.tsx` 파일을 대상으로 한다.

### 2단계: 스킬 로드

`../../guidelines/company/ocp-review.md`를 읽고 위반 패턴과 보호 계층을 숙지한다.

### 3단계: 위반 패턴 검사

1. **switch/if-else 분기 폭발** — case 수, 산재 여부
2. **타입별 조건 분기** — 같은 discriminator로 분기하는 코드가 여러 곳에 반복
3. **의존성 방향 역전** — 높은 수준 모듈이 낮은 수준에 직접 의존
4. **수정 빈도 집중** — git log로 같은 파일이 반복 수정되는지 확인

### 4단계: 영향도 평가 + 리포트

스킬의 영향도 기준(Critical/High/Medium/Low)으로 등급을 매기고 리포트 출력.

---

## 완료 시

```
ocp-review 작업완료!
```
