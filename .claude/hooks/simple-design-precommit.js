#!/usr/bin/env node

/**
 * Simple Design Pre-Commit Hook (PreToolUse on Bash)
 *
 * git commit 명령 실행 직전에 staged files + 직접 import 한 local 파일들을
 * Kent Beck 4규칙으로 검사한다.
 *
 * 정책:
 *   - critical/high 위반 → exit 2 (commit 차단 + layer 리팩토링 directive)
 *   - medium 위반        → stderr warn, commit 진행
 *   - --no-verify / -n   → 차단 (memory: skip-verify 금지)
 *
 * 검사 함수는 lib/simple-design-checks.js 공유.
 * 의미적 분석은 /simple-design-review skill.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { isTarget, runChecks } = require('./lib/simple-design-checks.js');

const PROJECT_ROOT = path.resolve(__dirname, '../../');

// ─── git commit 명령 감지 ─────────────────────────────────
//
// 명령 체인 (`;`, `&&`, `||`, `|`) 으로 분할 후 각 체인의 첫 토큰이 정확히 `git`,
// 두 번째 토큰이 정확히 `commit` 인 경우만 매칭. 환경변수 prefix (`FOO=bar git commit`) 허용.
// 문자열 리터럴 안의 `git commit` 같은 false positive 회피.

function splitChains(command) {
  // 따옴표 안의 separator 는 무시
  const chains = [];
  let buf = '';
  let inSingle = false;
  let inDouble = false;
  for (let i = 0; i < command.length; i++) {
    const ch = command[i];
    const prev = command[i - 1];
    if (ch === "'" && prev !== '\\' && !inDouble) inSingle = !inSingle;
    else if (ch === '"' && prev !== '\\' && !inSingle) inDouble = !inDouble;
    if (!inSingle && !inDouble) {
      if (ch === ';') { chains.push(buf); buf = ''; continue; }
      if ((ch === '&' && command[i + 1] === '&') || (ch === '|' && command[i + 1] === '|')) {
        chains.push(buf); buf = ''; i++; continue;
      }
      if (ch === '|' && command[i + 1] !== '|') { chains.push(buf); buf = ''; continue; }
    }
    buf += ch;
  }
  chains.push(buf);
  return chains;
}

function chainIsGitCommit(chain) {
  // 환경변수 prefix 제거: FOO=bar BAZ=qux git ...
  const stripped = chain.trim().replace(/^(?:[A-Z_][A-Z0-9_]*=\S+\s+)+/, '');
  // 첫 토큰 git, 둘째 토큰 commit (commit-graph, commit-tree 등 제외)
  return /^git\s+commit(?:\s|$)/.test(stripped);
}

function isGitCommitCommand(command) {
  if (!command || typeof command !== 'string') return false;
  return splitChains(command).some(chainIsGitCommit);
}

function stripQuoted(chain) {
  // 따옴표 안 (heredoc body, -m "..." 인자 포함) 을 제거하여 flag 부분만 남김.
  let out = '';
  let inSingle = false, inDouble = false;
  for (let i = 0; i < chain.length; i++) {
    const ch = chain[i];
    const prev = chain[i - 1];
    if (ch === "'" && prev !== '\\' && !inDouble) { inSingle = !inSingle; continue; }
    if (ch === '"' && prev !== '\\' && !inSingle) { inDouble = !inDouble; continue; }
    if (!inSingle && !inDouble) out += ch;
  }
  return out;
}

function hasNoVerifyFlag(command) {
  // git commit 체인 안에서만 검사. 따옴표/heredoc body 안의 문자열은 무시.
  return splitChains(command).some(chain => {
    if (!chainIsGitCommit(chain)) return false;
    return /\s(?:--no-verify|-n)(?:\s|$)/.test(stripQuoted(chain));
  });
}

// ─── staged files ────────────────────────────────────────

function getStagedFiles() {
  try {
    const output = execSync('git diff --cached --name-only --diff-filter=ACMR', {
      encoding: 'utf8',
      cwd: PROJECT_ROOT,
    });
    return output.trim().split('\n').filter(Boolean);
  } catch {
    return [];
  }
}

// ─── import 파싱 + 로컬 경로 해석 ─────────────────────────

function parseLocalImports(content) {
  // import { X } from '...';   import type { X } from '...';   import X from '...';   import * as X from '...';
  // export { X } from '...';
  const importRegex = /(?:import|export)\s+(?:type\s+)?(?:\*\s+as\s+\w+|\{[^}]*\}|\w+(?:\s*,\s*\{[^}]*\})?)\s+from\s+['"]([^'"]+)['"]/g;
  const specs = [];
  let m;
  while ((m = importRegex.exec(content))) {
    specs.push(m[1]);
  }
  return specs;
}

function resolveLocalImport(spec, fromFile) {
  if (!spec.startsWith('.') && !spec.startsWith('@/')) return null;

  let basePath;
  if (spec.startsWith('@/')) {
    basePath = path.join(PROJECT_ROOT, spec.slice(2));
  } else {
    basePath = path.resolve(path.dirname(fromFile), spec);
  }

  const candidates = [
    basePath + '.ts',
    basePath + '.tsx',
    path.join(basePath, 'index.ts'),
    path.join(basePath, 'index.tsx'),
  ];

  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }
  return null;
}

function expandRelatedFiles(stagedFiles) {
  const related = new Set();
  const stagedAbsolutes = new Set();

  for (const sf of stagedFiles) {
    const absolute = path.isAbsolute(sf) ? sf : path.join(PROJECT_ROOT, sf);
    if (!fs.existsSync(absolute)) continue;
    stagedAbsolutes.add(absolute);
    related.add(absolute);

    // Tests 는 staged 라면 검사 스킵 대상이지만, 일단 set 에 넣고 isTarget 에서 필터.
    let content;
    try {
      content = fs.readFileSync(absolute, 'utf8');
    } catch {
      continue;
    }
    for (const spec of parseLocalImports(content)) {
      const resolved = resolveLocalImport(spec, absolute);
      if (resolved) related.add(resolved);
    }
  }

  return { related: [...related], stagedAbsolutes };
}

// ─── 메인 ────────────────────────────────────────────────

async function main() {
  try {
    let inputData = '';
    for await (const chunk of process.stdin) {
      inputData += chunk;
    }

    const parsed = JSON.parse(inputData);
    const command = parsed.tool_input?.command || '';

    if (!isGitCommitCommand(command)) {
      process.exit(0);
    }

    if (hasNoVerifyFlag(command)) {
      const lines = [
        '',
        '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
        '🔴 --no-verify / -n 사용 차단',
        '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
        'pre-commit 검증 우회 금지. 문제 발견 시 root cause 를 고치세요.',
        '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
        ''
      ];
      process.stderr.write(lines.join('\n'));
      process.exit(2);
    }

    const stagedFiles = getStagedFiles();
    if (stagedFiles.length === 0) {
      process.exit(0);
    }

    const { related, stagedAbsolutes } = expandRelatedFiles(stagedFiles);
    const targetFiles = related.filter(isTarget);
    if (targetFiles.length === 0) {
      process.exit(0);
    }

    const allViolations = [];
    for (const filePath of targetFiles) {
      let content;
      try {
        content = fs.readFileSync(filePath, 'utf8');
      } catch {
        continue;
      }
      const isStagedFile = stagedAbsolutes.has(filePath);
      for (const v of runChecks(filePath, content)) {
        allViolations.push({
          ...v,
          file: path.relative(PROJECT_ROOT, filePath).replace(/\\/g, '/'),
          fromStaged: isStagedFile,
        });
      }
    }

    if (allViolations.length === 0) {
      process.exit(0);
    }

    const hasBlocking = allViolations.some(v => v.severity === 'critical' || v.severity === 'high');
    const severityIcon = { critical: '🔴', high: '🟠', medium: '🟡' };
    const c = allViolations.filter(v => v.severity === 'critical').length;
    const h = allViolations.filter(v => v.severity === 'high').length;
    const m = allViolations.filter(v => v.severity === 'medium').length;

    const lines = [
      '',
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      '🧱 SIMPLE DESIGN — Pre-Commit Review',
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      `검사: staged ${stagedFiles.length}개 + 직접 import 한 local 파일 (검사 대상 ${targetFiles.length}개)`,
      ''
    ];

    for (const v of allViolations) {
      const icon = severityIcon[v.severity] || '⚪';
      const tag = v.fromStaged ? '[staged]' : '[import]';
      lines.push(`${icon} [${v.rule}] ${v.file} ${tag} — ${v.type}`);
      lines.push(`   ${v.message}`);
      lines.push(`   💡 ${v.hint}`);
      lines.push('');
    }

    lines.push(`요약: 🔴 ${c} / 🟠 ${h} / 🟡 ${m}`);
    lines.push('');
    lines.push('─────────────────────────────────────────');
    lines.push('처방 — spot fix 가 아니라 layer 차원 root cause 검토:');
    lines.push('  • Reveals Intention 위반 → 도메인 함수 추출 / 명명된 상수 / 명시적 분기로 의도 코드화');
    lines.push('  • No Duplication 위반   → 단일 source 에서 파생, 또는 결정 자체를 도메인 함수로 추출');
    lines.push('  • Fewest Elements 위반  → 응답 DTO 를 layer 정책으로 정의, frontend type 결합 제거');
    lines.push('상세 분석: /simple-design-review');

    if (hasBlocking) {
      lines.push('');
      lines.push('🚫 commit 차단. 위반을 리팩토링한 뒤 다시 commit 하세요.');
      lines.push('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      lines.push('');
      process.stderr.write(lines.join('\n'));
      process.exit(2);
    }

    // medium 만 — commit 진행, 메시지 표시
    lines.push('');
    lines.push('⚠️  medium 위반. commit 진행 허용 (참고).');
    lines.push('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    lines.push('');
    process.stderr.write(lines.join('\n'));
    process.exit(0);
  } catch (error) {
    // 안전 기본값: 통과
    process.exit(0);
  }
}

main();
