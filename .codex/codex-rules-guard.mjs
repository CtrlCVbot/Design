#!/usr/bin/env node
/**
 * Codex PreToolUse 훅 — apply_patch 편집을 rules.json 으로 검사, 위반이면 차단(deny).
 *
 * 왜 별도 가드가 필요한가: Codex 의 apply_patch 는 tool_input.command(패치 텍스트)만 주고
 * tool_input.file_path 가 없다. 그래서 file_path 를 읽는 mm-broker 훅(layer-violation-checker,
 * tdd-guard)은 Codex 에선 no-op 이 된다. 이 가드는 패치에서 경로·추가내용을 파싱해 같은 규칙
 * (rules.json, git 게이트와 동일 포맷)을 적용하고, 위반이면 permissionDecision: deny 로 차단한다.
 *
 * 지원 규칙: forbiddenImports(레이어 import 금지) · forbiddenPatterns(정규식) ·
 *           requireTest(테스트 없는 프로덕션 코드 차단 = tdd-guard 대응).
 *
 * 검증됨(Codex 0.141): service→drizzle 차단, 테스트 없는 프로덕션 파일 차단.
 *
 * rules.json 탐색: argv[2] > docs/dev-guidelines/enforce/rules.json > .codex/rules.json
 */
import fs from 'node:fs';
import path from 'node:path';

let METRIC_CWD = process.cwd();
function logMetric(rec) {
  try { fs.appendFileSync(path.join(METRIC_CWD, '.harness-metrics.jsonl'), JSON.stringify({ tool: 'codex', ...rec }) + '\n'); } catch {}
}

let input = '';
process.stdin.on('data', d => (input += d));
process.stdin.on('end', () => {
  let j = {};
  try { j = JSON.parse(input); } catch { return allow(); }
  if (j.tool_name !== 'apply_patch') return allow();
  const cwd = j.cwd || process.cwd();
  METRIC_CWD = cwd;
  const patch = (j.tool_input && j.tool_input.command) || '';
  const rules = loadRules(cwd);
  if (!rules) return allow();

  const files = parsePatch(patch);

  // forbiddenImports / forbiddenPatterns (파일별)
  for (const f of files) {
    const v = check(f.path, f.added.join('\n'), rules);
    if (v) return deny(f.path + ': ' + v);
  }

  // requireTest: 테스트 없는 프로덕션 파일 추가/수정 차단 (tdd-guard 대응)
  const rt = rules.requireTest;
  if (rt) {
    const matchG = Array.isArray(rt.match) ? rt.match : [rt.match];
    const patchPaths = files.map(f => f.path);
    for (const f of files) {
      if (isTestPath(f.path)) continue;
      if (!matchesAny(f.path, matchG)) continue;
      if (matchesAny(f.path, rt.exclude || [])) continue;
      if (!hasTestFor(f.path, cwd, patchPaths)) {
        return deny(f.path + ': 대응 테스트 없음 — 테스트를 먼저 작성한 뒤 프로덕션 코드를 추가하세요 (TDD)');
      }
    }
  }

  allow();
});

function loadRules(cwd) {
  const candidates = [process.argv[2], path.join(cwd, 'docs/dev-guidelines/enforce/rules.json'), path.join(cwd, '.codex/rules.json')].filter(Boolean);
  for (const p of candidates) { try { return JSON.parse(fs.readFileSync(p, 'utf8').replace(/^﻿/, '')); } catch {} }
  return null;
}

function parsePatch(patch) {
  const files = []; let cur = null;
  for (const line of patch.split('\n')) {
    const m = line.match(/^\*\*\* (?:Add|Update|Delete) File:\s*(.+?)\s*$/);
    if (m) { cur = { path: m[1].replace(/\\/g, '/'), added: [] }; files.push(cur); continue; }
    if (cur && line.startsWith('+') && !line.startsWith('+++')) cur.added.push(line.slice(1));
  }
  return files;
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

function hasTestFor(prod, cwd, patchPaths) {
  const ext = prod.endsWith('.tsx') ? 'tsx' : 'ts';
  const base = prod.replace(/.*\//, '').replace(/\.(ts|tsx)$/, '');
  const dir = prod.includes('/') ? prod.replace(/\/[^/]*$/, '') : '';
  const names = [base + '.test.' + ext, base + '.spec.' + ext, base + '.test.ts', base + '.spec.ts'];
  for (const pp of patchPaths) { if (names.includes(pp.replace(/.*\//, ''))) return true; }
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

function allow() { process.exit(0); }
function deny(reason) {
  logMetric({ event: 'enforce', result: 'deny', rule: reason });
  process.stdout.write(JSON.stringify({
    hookSpecificOutput: { hookEventName: 'PreToolUse', permissionDecision: 'deny', permissionDecisionReason: '레이어/구조 규칙 위반 — ' + reason }
  }));
  process.exit(0);
}
