# QA 브라우저 테스트

MCP Playwright 브라우저를 띄워서 QA 테스트를 수행합니다.

> 테스트 방법론: `.claude/skills/qa-browser.md` 참조
> 통합 정합성: `.claude/knowledge/integration-coherence-checklist.md` 참조

---

## 사용법

```
/qa                    # 변경 파일 기반 탐색적 테스트
/qa order-list         # 저장된 스크립트 직접 실행
/qa-list               # 스크립트 목록에서 선택
```

---

## 테스트 계정

```
이메일: jhpark@logishm.com
비밀번호: 123412345
```

---

## 수행 단계

### 0단계: 스크립트 확인 (인자가 있는 경우)

인자가 주어지면 `.claude/qa-scripts/{인자}.md`를 읽고 해당 시나리오대로 수행. 1단계 건너뛰고 2단계로.

### 1단계: 변경 파일 파악 + 영향 분석

1. `%TEMP%/claude-edits.log`에서 변경 파일 확인
2. `.claude/knowledge/feature-impact-map.md` → 회귀 테스트 필요 페이지 추출
3. `.claude/knowledge/qa-edge-cases.md` → 알려진 엣지케이스 확인
4. 영향 분석 결과 출력 후 테스트 대상 결정

### 2단계: 브라우저 열고 로그인

`http://localhost:3002/login` 접속 → 테스트 계정 로그인 → 대상 페이지 이동

### 3단계: 탐색적 테스트 수행

`.claude/skills/qa-browser.md`의 테스트 관점 + 수행 규칙을 따른다.

### 4단계: 발견 사항 기록

`.claude/skills/qa-browser.md`의 보고 형식을 따른다.

### 5단계: E2E 스크립트 제안

발견한 엣지케이스를 E2E로 영구화할 수 있으면 제안

### 6단계: 지식 인계 (Knowledge Handoff)

1. `.claude/knowledge/` 파일 로드
2. 신규 영향 관계 / 엣지케이스 / 상태 변경 추출
3. 인계 보고서 출력 → AskUserQuestion으로 저장 확인 → 승인 시 knowledge 문서 업데이트

---

## 주의사항

- **스크린샷 금지**: `browser_snapshot`만 사용 (접근성 트리)
- **테스트 순서**: 핵심 플로우 → 엣지케이스 → 동시성/복구

---

## 완료 시

```
qa작업완료!
```

---

## QA 스크립트 작성 가이드

새 스크립트는 `.claude/qa-scripts/`에 생성. 기존 예시: `order-list.md`

```markdown
---
name: script-name
description: 페이지 설명
url: /path/to/page
---

# 페이지명 QA 스크립트

## 테스트 시나리오
### 1. 시나리오명
- [ ] 체크리스트 항목
```
