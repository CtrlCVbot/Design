#!/usr/bin/env node
/**
 * Claude Code 훅 — rules.json 단일 소스로 검사 (Codex 가드·git 게이트와 동일 규칙).
 * 하드코딩된 tdd-guard.js / layer-violation-checker.js 의 규칙 역할을 대체한다.
 *
 *   phase 'pre'  (PreToolUse Edit|Write): requireTest — 테스트 없는 프로덕션 코드 차단.
 *   phase 'post' (PostToolUse Edit|Write): forbiddenImports / forbiddenPatterns.
 * 위반 시 exit 2 + stderr → Claude 가 피드백 받아 수정.
 *
 * 입력(stdin JSON, Claude 형식): tool_input.file_path, cwd.
 * rules.json 탐색: docs/dev-guidelines/enforce/rules.json > .claude/rules.json > .codex/rules.json
 */
const fs = require('fs');
const path = require('path');

let METRIC_CWD = process.cwd();
function logMetric(rec) {
  try { fs.appendFileSync(path.join(METRIC_CWD, '.harness-metrics.jsonl'), JSON.stringify({ tool: 'claude', ...rec }) + '\n'); } catch {}
}

let input = '';
process.stdin.on('data', d => (input += d));
process.stdin.on('end', () => {
  let j = {};
  try { j = JSON.parse(input); } catch { process.exit(0); }
  const phase = process.argv[2] || 'post';
  const ti = j.tool_input || {};
  const fileAbs = (ti.file_path || '').replace(/\\/g, '/');
  if (!fileAbs || !/\.(ts|tsx)$/.test(fileAbs)) process.exit(0);
  const cwd = (j.cwd || process.cwd()).replace(/\\/g, '/');
  METRIC_CWD = j.cwd || process.cwd();
  const rel = fileAbs.startsWith(cwd + '/') ? fileAbs.slice(cwd.length + 1) : fileAbs;
  const rules = loadRules(cwd);
  if (!rules) process.exit(0);

  if (phase === 'pre') {
    const rt = rules.requireTest;
    if (rt && !isTestPath(rel) && matchesAny(rel, arr(rt.match)) && !matchesAny(rel, rt.exclude || [])) {
      if (!hasTestFor(rel, cwd)) block(rel + ': 대응 테스트 없음 — 테스트를 먼저 작성한 뒤 프로덕션 코드를 추가하세요 (TDD)');
    }
    process.exit(0);
  }

  // post: 디스크에서 (방금 편집된) 파일을 읽어 import/패턴 검사
  let content = '';
  try { content = fs.readFileSync(fileAbs, 'utf8'); } catch { process.exit(0); }
  const v = check(rel, content, rules);
  if (v) block(rel + ': ' + v);
  process.exit(0);
});

function arr(x) { return Array.isArray(x) ? x : [x]; }
function loadRules(cwd) {
  const cands = [
    path.join(cwd, 'docs/dev-guidelines/enforce/rules.json'),
    path.join(cwd, '.claude/rules.json'),
    path.join(cwd, '.codex/rules.json'),
  ];
  for (const p of cands) { try { return JSON.parse(fs.readFileSync(p, 'utf8').replace(/^﻿/, '')); } catch {} }
  return null;
}
function globToRegex(glob) {
  let re = '^';
  for (let i = 0; i < glob.length; i++) {
    const c = glob[i];
    if (c === '*') {
      if (glob[i + 1] === '*') { i++; if (glob[i + 1] === '/') { i++; re += '(?:.*/)?'; } else re += '.*'; }
      else re += '[^/]*';
    } else if (c === '{') {
      const end = glob.indexOf('}', i);
      if (end === -1) re += '\\{';
      else { re += '(?:' + glob.slice(i + 1, end).split(',').map(s => s.replace(/[.+^${}()|[\]\\?]/g, m => '\\' + m)).join('|') + ')'; i = end; }
    } else if ('.+^$()|[]\\?'.includes(c)) re += '\\' + c;
    else re += c;
  }
  return new RegExp(re + '$');
}
function matchesAny(file, globs) { return (globs || []).some(g => globToRegex(g).test(file)); }
function check(file, content, rules) {
  for (const r of rules.forbiddenImports || []) {
    if (!globToRegex(r.match).test(file)) continue;
    const re = /(?:import[^'"]*from|require\()\s*['"]([^'"]+)['"]/g; let m;
    while ((m = re.exec(content))) {
      const s = m[1];
      if ((r.forbid || []).some(f => s === f || s.startsWith(f.endsWith('/') ? f : f + '/'))) return r.name + ' (import: ' + s + ')';
    }
  }
  for (const r of rules.forbiddenPatterns || []) {
    if (!globToRegex(r.match).test(file)) continue;
    try { if (new RegExp(r.pattern).test(content)) return r.name; } catch {}
  }
  return null;
}
function isTestPath(p) { return /(\.test\.|\.spec\.)/.test(p) || /(^|\/)__tests__\//.test(p); }
function hasTestFor(prod, cwd) {
  const ext = prod.endsWith('.tsx') ? 'tsx' : 'ts';
  const base = prod.replace(/.*\//, '').replace(/\.(ts|tsx)$/, '');
  const dir = prod.includes('/') ? prod.replace(/\/[^/]*$/, '') : '';
  const names = [base + '.test.' + ext, base + '.spec.' + ext, base + '.test.ts', base + '.spec.ts'];
  for (const n of names) {
    if (fs.existsSync(path.join(cwd, dir, n))) return true;
    if (fs.existsSync(path.join(cwd, dir, '__tests__', n))) return true;
  }
  return findInDir(path.join(cwd, 'tests'), names, 0);
}
function findInDir(dir, names, depth) {
  if (depth > 8) return false;
  let entries = [];
  try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return false; }
  for (const e of entries) {
    if (e.isDirectory()) { if (findInDir(path.join(dir, e.name), names, depth + 1)) return true; }
    else if (names.includes(e.name)) return true;
  }
  return false;
}
function block(reason) {
  logMetric({ event: 'enforce', result: 'deny', rule: reason });
  process.stderr.write('\n🚫 레이어/구조 규칙 위반 — ' + reason + '\n수정한 뒤 다시 시도하세요. (규칙 출처: rules.json)\n');
  process.exit(2);
}
