# QA 스크립트 선택

저장된 QA 스크립트 목록에서 선택하여 테스트를 수행합니다.

---

## 수행 단계

### 1단계: 스크립트 목록 조회

1. `.claude/qa-scripts/` 디렉토리의 모든 `.md` 파일을 Glob으로 조회한다
2. 각 파일의 YAML frontmatter에서 `description`을 읽는다

### 2단계: 사용자에게 선택 요청

AskUserQuestion 도구를 사용하여 목록을 보여주고 선택을 요청한다.

**옵션 구성:**
- 각 스크립트 파일에서 `name`과 `description`을 읽어서 옵션으로 만든다
- label: `{name}`
- description: `{description} ({url})`

### 3단계: 선택된 스크립트 실행

사용자가 선택하면:
1. 해당 스크립트 파일을 읽는다
2. `/qa {스크립트명}` 과 동일하게 테스트를 수행한다
3. `.claude/skills/qa-browser.md` 규칙을 따른다

---

## 스크립트 파일 형식

```markdown
---
name: order-list
description: 화물현황 페이지
url: /broker/order/list
---

# 화물현황 페이지 QA 스크립트
...
```

---

## 테스트 계정

```
이메일: <QA_ACCOUNT>
비밀번호: 12341234
```

---

## 완료 시

```
qa작업완료!
```
