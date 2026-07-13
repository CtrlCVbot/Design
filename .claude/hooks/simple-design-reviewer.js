#!/usr/bin/env node

/**
 * Simple Design Reviewer (Standalone / 수동 invoke 용)
 *
 * 과거: Stop hook 에 등록되어 turn 끝마다 발사.
 * 현재: simple-design-precommit.js 가 commit 시점에 발사하므로 Stop 등록 해제됨.
 *       이 파일은 standalone 도구로 남겨둠 — 임시 검증/디버깅 용도.
 *
 * 검사 함수는 lib/simple-design-checks.js 에서 import (DRY).
 * 리포트만 출력하고 차단하지 않음 (exit 0).
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const { isTarget, runChecks } = require('./lib/simple-design-checks.js');

const PROJECT_ROOT = path.resolve(__dirname, '../../');
const EDIT_LOG_PATH = path.join(os.tmpdir(), 'claude-edits.log');

function readEditLog() {
  try {
    if (!fs.existsSync(EDIT_LOG_PATH)) return [];
    const content = fs.readFileSync(EDIT_LOG_PATH, 'utf8');
    return content.trim().split('\n').filter(Boolean).map(line => {
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
      process.exit(0);
    }

    const uniquePaths = [...new Set(editedFiles.map(e => e.filePath))];
    const targetFiles = uniquePaths.filter(isTarget);
    if (targetFiles.length === 0) {
      process.exit(0);
    }

    const allViolations = [];
    for (const filePath of targetFiles) {
      const absolutePath = path.isAbsolute(filePath) ? filePath : path.join(PROJECT_ROOT, filePath);
      if (!fs.existsSync(absolutePath)) continue;
      const content = fs.readFileSync(absolutePath, 'utf8');
      for (const v of runChecks(filePath, content)) {
        allViolations.push({ ...v, file: path.basename(filePath) });
      }
    }

    if (allViolations.length === 0) {
      process.exit(0);
    }

    const severityIcon = { critical: '🔴', high: '🟠', medium: '🟡' };
    const c = allViolations.filter(v => v.severity === 'critical').length;
    const h = allViolations.filter(v => v.severity === 'high').length;
    const m = allViolations.filter(v => v.severity === 'medium').length;

    const lines = [
      '',
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      '🧱 SIMPLE DESIGN REVIEW (Kent Beck 4규칙)',
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      `검사 파일: ${targetFiles.length}개`,
      ''
    ];
    for (const v of allViolations) {
      const icon = severityIcon[v.severity] || '⚪';
      lines.push(`${icon} [${v.rule}] ${v.file} — ${v.type}`);
      lines.push(`   ${v.message}`);
      lines.push(`   💡 ${v.hint}`);
      lines.push('');
    }
    lines.push(`요약: 🔴 ${c} / 🟠 ${h} / 🟡 ${m}`);
    lines.push('');
    lines.push('의미적 분석: /simple-design-review');
    lines.push('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    lines.push('');

    process.stderr.write(lines.join('\n'));
    process.exit(0);
  } catch (error) {
    process.exit(0);
  }
}

main();
