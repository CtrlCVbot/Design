#!/usr/bin/env node

/**
 * File Edit Tracker Hook (PostToolUse)
 *
 * 파일 편집을 로깅만 합니다. 빌드는 실행하지 않습니다.
 * Stop hook에서 이 로그를 읽어서 일괄 빌드를 수행합니다.
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

const EDIT_LOG_PATH = path.join(os.tmpdir(), 'claude-edits.log');
const PROJECT_ROOT = path.resolve(__dirname, '../../');

async function main() {
  try {
    // stdin에서 JSON 입력 읽기
    let inputData = '';
    for await (const chunk of process.stdin) {
      inputData += chunk;
    }

    const parsed = JSON.parse(inputData);
    const toolUse = parsed.tool_use || {};
    const toolName = toolUse.tool_name || '';

    // 파일 수정 도구만 처리
    const fileEditTools = ['Edit', 'Write', 'MultiEdit', 'NotebookEdit'];
    if (!fileEditTools.includes(toolName)) {
      process.exit(0);
    }

    const filePath = toolUse.tool_input?.file_path || '';

    // .ts/.tsx 파일만 로깅
    if (!filePath.endsWith('.ts') && !filePath.endsWith('.tsx')) {
      process.exit(0);
    }

    // 로그 엔트리 생성
    const logEntry = {
      timestamp: new Date().toISOString(),
      filePath: filePath,
      toolName: toolName,
      projectRoot: PROJECT_ROOT
    };

    // 로그 파일에 추가 (줄바꿈으로 구분)
    fs.appendFileSync(EDIT_LOG_PATH, JSON.stringify(logEntry) + '\n', 'utf8');

    process.exit(0);
  } catch (error) {
    // 에러 발생해도 진행 허용
    process.exit(0);
  }
}

main();
