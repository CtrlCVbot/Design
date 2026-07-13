#!/usr/bin/env node

/**
 * Build Checker Hook (Stop)
 *
 * Claude 응답 완료 후 file-edit-tracker 로그를 읽어서 일괄 빌드를 수행합니다.
 * - 편집된 .ts/.tsx 파일이 있을 때만 빌드
 * - 5개 이하 에러: 표시
 * - 5개 이상 에러: build-error-resolver agent 제안
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const PROJECT_ROOT = path.resolve(__dirname, '../../');
const EDIT_LOG_PATH = path.join(os.tmpdir(), 'claude-edits.log');

function readEditLog() {
  try {
    if (!fs.existsSync(EDIT_LOG_PATH)) return [];
    const content = fs.readFileSync(EDIT_LOG_PATH, 'utf8');
    const lines = content.trim().split('\n').filter(Boolean);
    return lines.map(line => {
      try { return JSON.parse(line); } catch { return null; }
    }).filter(Boolean);
  } catch {
    return [];
  }
}

async function main() {
  try {
    let inputData = '';
    for await (const chunk of process.stdin) {
      inputData += chunk;
    }

    const editedFiles = readEditLog();
    if (editedFiles.length === 0) {
      clearEditLog();
      process.exit(0);
    }

    const editedPaths = editedFiles.map(e => path.basename(e.filePath));

    const headerLines = [
      '',
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      '🔍 BUILD CHECK',
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      `수정된 파일 (${editedFiles.length}개):`,
      ...editedPaths.map(p => `  - ${p}`),
      '',
    ];
    process.stderr.write(headerLines.join('\n'));

    try {
      execSync('npx tsc --noEmit 2>&1', {
        cwd: PROJECT_ROOT,
        encoding: 'utf8',
        timeout: 60000
      });

      const successLines = [
        '✅ TypeScript 빌드 성공 - 에러 없음',
        '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
        '',
      ];
      process.stderr.write(successLines.join('\n'));
    } catch (buildError) {
      const output = buildError.stdout || buildError.message || '';
      const errorLines = output.split('\n').filter(line => line.includes('error TS'));
      const errorCount = errorLines.length;

      const resultLines = [
        `❌ TypeScript 에러 발견: ${errorCount}개`,
        '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      ];

      if (errorCount <= 5) {
        resultLines.push('', '에러 목록:');
        errorLines.forEach(line => resultLines.push(`  ${line}`));
        resultLines.push('', '💡 위 에러들을 수정해주세요.');
      } else {
        resultLines.push('', '처음 5개 에러:');
        errorLines.slice(0, 5).forEach(line => resultLines.push(`  ${line}`));
        resultLines.push(``, `... 외 ${errorCount - 5}개 에러`);
        resultLines.push('', '💡 에러가 많습니다. build-error-resolver agent 사용을 권장합니다.');
      }

      resultLines.push('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', '');
      process.stderr.write(resultLines.join('\n'));
    }

    clearEditLog();
    process.exit(0);
  } catch (error) {
    clearEditLog();
    process.exit(0);
  }
}

function clearEditLog() {
  try { if (fs.existsSync(EDIT_LOG_PATH)) fs.unlinkSync(EDIT_LOG_PATH); } catch {}
}

main();
