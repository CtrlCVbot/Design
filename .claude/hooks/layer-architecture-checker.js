#!/usr/bin/env node

/**
 * Layer Architecture Checker Hook (Stop)
 *
 * Claude 응답 완료 후 수정된 파일들의 레이어 규칙 위반을 검사합니다 (최종 안전망).
 * PostToolUse의 layer-violation-checker.js가 파일별 실시간 체크를 담당하고,
 * 이 hook은 최종 요약 + 편집 로그 정리를 담당합니다.
 *
 * ⚠️ Stop hook 중 마지막에 실행되어야 합니다 (edit log 삭제 담당).
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

const PROJECT_ROOT = path.resolve(__dirname, '../../');
const EDIT_LOG_PATH = path.join(os.tmpdir(), 'claude-edits.log');

const LAYER_RULES = {
  route: {
    pattern: /app\/api\/.+\/route\.ts$/,
    violations: [
      { name: 'drizzle 의존성', regex: /import\s+.*from\s+['"](@\/)?db['"]/, severity: 'critical', message: 'Route Layer에서 drizzle 직접 import 금지' },
      { name: 'drizzle-orm 의존성', regex: /import\s+.*from\s+['"]drizzle-orm['"]/, severity: 'critical', message: 'Route Layer에서 drizzle-orm import 금지' },
      { name: '스키마 정의', regex: /const\s+\w+Schema\s*=\s*z\.object\(\{[\s\S]{200,}/, severity: 'high', message: '큰 Zod 스키마는 validation.ts로 분리 필요' }
    ]
  },
  service: {
    pattern: /server\/.+\/application\/.+\.service\.ts$/,
    violations: [
      { name: 'drizzle 의존성', regex: /import\s+.*from\s+['"](@\/)?db['"]/, severity: 'critical', message: 'Service Layer에서 drizzle 직접 import 금지' },
      { name: 'drizzle-orm 의존성', regex: /import\s+.*from\s+['"]drizzle-orm['"]/, severity: 'critical', message: 'Service Layer에서 drizzle-orm import 금지' },
      { name: 'zod 의존성', regex: /import\s+.*from\s+['"]zod['"]/, severity: 'high', message: 'Service Layer에서 zod import 금지 (순수 TypeScript interface만 사용)' },
      { name: '응답 래핑', regex: /return\s*\{\s*success\s*:/, severity: 'high', message: 'Service에서 { success: ... } 래핑 금지 (withErrorHandler가 담당)' }
    ]
  },
  repository: {
    pattern: /server\/.+\/infrastructure\/.+\.repository\.ts$/,
    violations: [
      { name: '전체 select', regex: /\.select\(\)\s*\.from\(/, severity: 'medium', message: 'select() 대신 필요한 컬럼만 명시적으로 select' }
    ]
  },
  domain: {
    pattern: /server\/.+\/domain\/.+\.model\.ts$/,
    violations: [
      { name: 'id 필드 포함', regex: /constructor\s*\([^)]*\bid\s*:/, severity: 'medium', message: 'Domain Model에 id 필드 포함 금지' }
    ]
  }
};

const SEVERITY_ICONS = { critical: '🔴', high: '🟠', medium: '🟡', low: '🟢' };

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

function clearEditLog() {
  try { if (fs.existsSync(EDIT_LOG_PATH)) fs.unlinkSync(EDIT_LOG_PATH); } catch {}
}

function getLayerType(filePath) {
  const relativePath = filePath.replace(/\\/g, '/');
  for (const [layerName, config] of Object.entries(LAYER_RULES)) {
    if (config.pattern.test(relativePath)) return layerName;
  }
  return null;
}

function checkViolations(filePath, content, layerType) {
  const config = LAYER_RULES[layerType];
  const violations = [];
  for (const rule of config.violations) {
    if (rule.regex.test(content)) {
      violations.push({ file: filePath, layer: layerType, rule: rule.name, severity: rule.severity, message: rule.message });
    }
  }
  return violations;
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

    const layerFiles = editedFiles.filter(e => getLayerType(e.filePath) !== null);
    if (layerFiles.length === 0) {
      clearEditLog();
      process.exit(0);
    }

    const allViolations = [];
    for (const edit of layerFiles) {
      const filePath = edit.filePath;
      const layerType = getLayerType(filePath);
      try {
        const absolutePath = path.isAbsolute(filePath) ? filePath : path.join(PROJECT_ROOT, filePath);
        if (!fs.existsSync(absolutePath)) continue;
        const content = fs.readFileSync(absolutePath, 'utf8');
        allViolations.push(...checkViolations(filePath, content, layerType));
      } catch {}
    }

    if (allViolations.length === 0) {
      const lines = [
        '',
        '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
        '✅ LAYER ARCHITECTURE CHECK',
        '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
        `검사 파일: ${layerFiles.length}개`,
        '레이어 규칙 위반 없음',
        '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
        '',
      ];
      process.stderr.write(lines.join('\n'));
      clearEditLog();
      process.exit(0);
    }

    const criticalCount = allViolations.filter(v => v.severity === 'critical').length;
    const highCount = allViolations.filter(v => v.severity === 'high').length;
    const mediumCount = allViolations.filter(v => v.severity === 'medium').length;

    const lines = [
      '',
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      '⚠️  LAYER ARCHITECTURE VIOLATIONS',
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      `검사 파일: ${layerFiles.length}개`,
      `위반 발견: ${allViolations.length}개`,
    ];
    if (criticalCount > 0) lines.push(`  🔴 Critical: ${criticalCount}개`);
    if (highCount > 0) lines.push(`  🟠 High: ${highCount}개`);
    if (mediumCount > 0) lines.push(`  🟡 Medium: ${mediumCount}개`);
    lines.push('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    const importantViolations = allViolations.filter(v => v.severity === 'critical' || v.severity === 'high');
    if (importantViolations.length > 0) {
      lines.push('', '위반 상세:');
      for (const v of importantViolations) {
        const icon = SEVERITY_ICONS[v.severity];
        lines.push(``, `${icon} [${v.layer.toUpperCase()}] ${path.basename(v.file)}`);
        lines.push(`   규칙: ${v.rule}`);
        lines.push(`   💡 ${v.message}`);
      }
    }

    if (criticalCount > 0 || highCount > 0) {
      lines.push('', '💡 상세 검증이 필요하면:');
      lines.push('   "layer-architecture-reviewer agent로 검증해줘"');
    }

    lines.push('', '참조: .claude/skills/layered-architecture.md');
    lines.push('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', '');
    process.stderr.write(lines.join('\n'));

    clearEditLog();
    process.exit(0);
  } catch (error) {
    clearEditLog();
    process.exit(0);
  }
}

main();
