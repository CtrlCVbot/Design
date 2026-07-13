---
name: notion-issue-workflow
description: Notion 버그/이슈 기반 수정 작업의 커밋 및 결과 보고 규칙. Notion 이슈를 조회해 수정하거나, 수정 완료 후 커밋·보고할 때 사용
---

# Notion 이슈 처리 워크플로우

Notion API로 버그/이슈를 조회하여 수정한 경우 아래 절차를 따른다.

## 1. 커밋 메시지

- 커밋 메시지 본문 마지막에 해당 Notion 페이지 링크를 첨부한다.
  - 형식: `Notion: https://www.notion.so/...`

## 2. 커밋 후 결과 보고 (Notion API)

1. 해당 Notion 페이지에서 **"결과" heading 블록**을 찾는다.
2. heading과 다음 블록 사이에 있는 빈 paragraph를 삭제한 뒤, `after: 결과headingId` 옵션으로 바로 아래에 삽입한다:
   - **code 블록(plain text)**: 커밋 본문의 [문제], [원인], [해결] 부분만
   - 그 아래 **paragraph**: 해당 페이지의 "기획 담당" 속성에 있는 사용자를 @멘션
3. 해당 페이지의 **"상태" 속성을 "개발완료"로 변경**한다.

## 전제

- Notion API 토큰은 각 프로젝트의 `.env`(`NOTION_API_KEY`)에서 읽는다. 토큰을 코드나 문서에 하드코딩하지 않는다.
- 커밋 본문은 [문제]-[원인]-[해결] 구조를 따른다 (`/commit` 커맨드 규칙과 동일).
