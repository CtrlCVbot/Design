#!/usr/bin/env node

/**
 * Error Handling Reminder Hook (PostToolUse)
 *
 * 파일 수정 후 위험 패턴을 감지하고 에러 핸들링 리마인더를 표시합니다.
 * 프로젝트 규칙에 맞는 패턴 사용을 상기시킵니다.
 */

const fs = require('fs');
const path = require('path');

const RISKY_PATTERNS = {
  route: {
    patterns: [/async\s+function/, /await\s+/, /\.service\./],
    reminders: [
      '❓ withErrorHandler로 감싸서 Domain Error 처리했나?',
      '❓ validateJsonBody/validateQueryParams 사용했나?',
      '❓ drizzle 의존성 없이 작성했나?',
    ]
  },
  service: {
    patterns: [/repository\./, /await\s+/, /async\s+/],
    reminders: [
      '❓ orElseThrow 패턴으로 존재 검증했나?',
      '❓ drizzle/zod 의존성 없이 순수 TypeScript로 작성했나?',
      '❓ 응답은 엔티티/DTO만 반환하고 { data, success } 래핑 안 했나?',
    ]
  },
  repository: {
    patterns: [/\.select\(/, /\.insert\(/, /\.update\(/, /\.delete\(/],
    reminders: [
      '❓ 필요한 컬럼만 select했나?',
      '❓ DB row 그대로 반환하고 있나? (도메인 변환은 service에서)',
    ]
  },
  domain: {
    patterns: [/class\s+\w+/, /private\s+/, /get\s+\w+\(\)/],
    reminders: [
      '❓ id 값을 가지지 않게 했나?',
      '❓ getter는 정말 필요한 것만 있나?',
      '❓ getter는 한 줄로 간단하게 작성했나?',
    ]
  }
};

function detectFileType(filePath) {
  if (filePath.includes('/app/api/') || filePath.includes('\\app\\api\\')) return 'route';
  if (filePath.includes('.service.ts')) return 'service';
  if (filePath.includes('.repository.ts')) return 'repository';
  if (filePath.includes('/domain/') || filePath.includes('\\domain\\')) return 'domain';
  return null;
}

function checkFileForPatterns(filePath, fileType) {
  try {
    if (!fs.existsSync(filePath)) return false;
    const content = fs.readFileSync(filePath, 'utf8');
    const patterns = RISKY_PATTERNS[fileType]?.patterns || [];
    return patterns.some(pattern => pattern.test(content));
  } catch {
    return false;
  }
}

async function main() {
  try {
    let inputData = '';
    for await (const chunk of process.stdin) {
      inputData += chunk;
    }

    const parsed = JSON.parse(inputData);
    const toolUse = parsed.tool_use || {};
    const toolName = toolUse.tool_name || '';

    const fileEditTools = ['Edit', 'Write', 'MultiEdit'];
    if (!fileEditTools.includes(toolName)) {
      process.exit(0);
    }

    const filePath = toolUse.tool_input?.file_path || '';
    if (!filePath.endsWith('.ts') && !filePath.endsWith('.tsx')) {
      process.exit(0);
    }

    const fileType = detectFileType(filePath);
    if (!fileType) {
      process.exit(0);
    }

    const hasRiskyPatterns = checkFileForPatterns(filePath, fileType);
    if (!hasRiskyPatterns) {
      process.exit(0);
    }

    const reminders = RISKY_PATTERNS[fileType]?.reminders || [];
    const fileTypeName = {
      route: 'Route Layer',
      service: 'Service Layer',
      repository: 'Repository Layer',
      domain: 'Domain Model'
    }[fileType];

    const lines = [
      '',
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      `📋 SELF-CHECK: ${fileTypeName}`,
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      `수정된 파일: ${path.basename(filePath)}`,
      '',
      ...reminders,
      '',
      '💡 .claude/skills/ 규칙 참고',
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      '',
    ];
    process.stderr.write(lines.join('\n'));

    process.exit(0);
  } catch (error) {
    process.exit(0);
  }
}

main();
