#!/usr/bin/env node
/**
 * 커밋 직전 "결과 게이트" — 도구 무관(Claude/Codex/사람 누가 커밋해도 동일하게 동작).
 *
 * git pre-commit 훅과 CI 양쪽에서 같은 파일을 호출한다. 막을 위반이 있으면 exit 1.
 * 비개발자가 알아볼 수 있게 실패 메시지를 한국어로 풀어 출력하는 게 핵심 설계다.
 *
 * 게이트:
 *   1. 타입 검사: tsconfig.json 있으면 `npx tsc --noEmit`
 *   2. 테스트:    package.json 의 test:changed > test 스크립트
 *   3. 린트:      package.json 의 lint 스크립트
 *   4. 비밀값:    변경분에서 계정/비밀번호/토큰/키 패턴 탐지 (항상)
 *   5. 구조 규칙: enforce/rules.json 이 있으면 레이어 위반·테스트 누락 검사 (선언적)
 *                — Claude 훅(layer-violation-checker 등)에만 있던 강제를 도구 무관하게 이식한 부분
 *
 * 검사 범위(비밀값/구조): 기본은 staged 변경. CI 에서는 GATE_DIFF_RANGE(예: origin/main...HEAD)로 지정.
 * 끄기: git config --unset core.hooksPath
 */
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = process.cwd();
const GATE_DIR = path.dirname(fileURLToPath(import.meta.url));
const pkgPath = path.join(ROOT, 'package.json');
const pkgRaw = fs.existsSync(pkgPath) ? fs.readFileSync(pkgPath, 'utf8').replace(/^﻿/, '') : '{}';
const pkg = JSON.parse(pkgRaw);
const scripts = pkg.scripts || {};
const failures = [];   // 막는 위반 (critical/high)
const warnings = [];   // 경고만 (medium)

// ── 명령 게이트 ────────────────────────────────────────────────────────
function run(label, cmd) {
  process.stdout.write('▶ ' + label + ' … ');
  try {
    execSync(cmd, { cwd: ROOT, stdio: 'pipe' });
    console.log('통과');
    return null;
  } catch (e) {
    console.log('실패');
    const out = ((e.stdout && e.stdout.toString()) || '') + ((e.stderr && e.stderr.toString()) || '');
    return { label, out: out.trim().split('\n').slice(-20).join('\n') };
  }
}

// ── 변경 파일 목록 (staged 또는 CI 범위) ────────────────────────────────
function changedFiles() {
  const range = process.env.GATE_DIFF_RANGE;
  const cmd = range
    ? 'git diff --name-only --diff-filter=ACM ' + range
    : 'git diff --cached --name-only --diff-filter=ACM';
  try {
    return execSync(cmd, { cwd: ROOT, stdio: 'pipe' }).toString().split('\n').map(s => s.trim()).filter(Boolean);
  } catch { return []; }
}

function readFile(rel) {
  try { return fs.readFileSync(path.join(ROOT, rel), 'utf8'); } catch { return null; }
}

// ── glob → 정규식 (**, **/, *, {a,b} 지원) ─────────────────────────────
function globToRegex(glob) {
  let re = '^';
  for (let i = 0; i < glob.length; i++) {
    const c = glob[i];
    if (c === '*') {
      if (glob[i + 1] === '*') {
        i++;
        if (glob[i + 1] === '/') { i++; re += '(?:.*/)?'; }
        else re += '.*';
      } else {
        re += '[^/]*';
      }
    } else if (c === '{') {
      const end = glob.indexOf('}', i);
      if (end === -1) { re += '\\{'; }
      else {
        const alts = glob.slice(i + 1, end).split(',').map(s => s.replace(/[.+^${}()|[\]\\?]/g, m => '\\' + m));
        re += '(?:' + alts.join('|') + ')';
        i = end;
      }
    } else if ('.+^$()|[]\\?'.includes(c)) {
      re += '\\' + c;
    } else {
      re += c;
    }
  }
  return new RegExp(re + '$');
}
function matchesAny(file, globs) {
  return (globs || []).some(g => globToRegex(g).test(file));
}

// ── 구조 규칙 (선언적, enforce/rules.json) ──────────────────────────────
function importSources(content) {
  const out = [];
  const re = /(?:import[^'"]*from|import|require\()\s*['"]([^'"]+)['"]/g;
  let m;
  while ((m = re.exec(content))) out.push(m[1]);
  return out;
}
function importViolates(source, forbid) {
  return forbid.some(f => source === f || source.startsWith(f.endsWith('/') ? f : f + '/'));
}
function findFile(dir, names, depth) {
  if (depth > 8) return false;
  let entries = [];
  try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return false; }
  for (const e of entries) {
    if (e.isDirectory()) { if (findFile(path.join(dir, e.name), names, depth + 1)) return true; }
    else if (names.includes(e.name)) return true;
  }
  return false;
}
function hasTest(file) {
  const ext = file.endsWith('.tsx') ? 'tsx' : 'ts';
  const base = path.basename(file).replace(/\.(ts|tsx)$/, '');
  const dir = path.dirname(file);
  const names = [base + '.test.' + ext, base + '.spec.' + ext, base + '.test.ts', base + '.spec.ts'];
  for (const n of names) {
    if (fs.existsSync(path.join(ROOT, dir, n))) return true;
    if (fs.existsSync(path.join(ROOT, dir, '__tests__', n))) return true;
  }
  const testsRoot = path.join(ROOT, 'tests');
  if (fs.existsSync(testsRoot) && findFile(testsRoot, names, 0)) return true;
  return false;
}

function runStructuralChecks() {
  const rulesPath = path.join(GATE_DIR, 'rules.json');
  if (!fs.existsSync(rulesPath)) return;
  let rules;
  try { rules = JSON.parse(fs.readFileSync(rulesPath, 'utf8').replace(/^﻿/, '')); }
  catch { warnings.push({ name: 'rules.json 파싱 실패 — 구조 규칙 건너뜀', file: rulesPath }); return; }

  const files = changedFiles();
  const record = (sev, name, file, hint) =>
    (sev === 'medium' ? warnings : failures).push({ structural: true, name, file, hint });

  for (const file of files) {
    const content = readFile(file);
    if (content == null) continue;

    for (const rule of rules.forbiddenImports || []) {
      if (!matchesAny(file, [rule.match])) continue;
      const bad = importSources(content).find(s => importViolates(s, rule.forbid || []));
      if (bad) record(rule.severity || 'high', rule.name + ' (import: ' + bad + ')', file, rule.hint);
    }
    for (const rule of rules.forbiddenPatterns || []) {
      if (!matchesAny(file, [rule.match])) continue;
      let re;
      try { re = new RegExp(rule.pattern, rule.flags || ''); } catch { continue; }
      if (re.test(content)) record(rule.severity || 'high', rule.name, file, rule.hint);
    }
  }

  const rt = rules.requireTest;
  if (rt) {
    const matchGlobs = Array.isArray(rt.match) ? rt.match : [rt.match];
    for (const file of files) {
      if (!matchesAny(file, matchGlobs)) continue;
      if (matchesAny(file, rt.exclude || [])) continue;
      if (!hasTest(file)) {
        record(rt.severity || 'high', '대응 테스트 없음', file,
          rt.hint || ('같은 폴더 __tests__/ 또는 tests/ 에 ' + path.basename(file).replace(/\.(ts|tsx)$/, '') + '.test.* 를 추가하세요'));
      }
    }
  }
}

// ── 비밀값 스캔 ─────────────────────────────────────────────────────────
function scanSecrets() {
  const range = process.env.GATE_DIFF_RANGE;
  const cmd = range ? 'git diff --no-color ' + range : 'git diff --cached --no-color';
  let diff = '';
  try { diff = execSync(cmd, { cwd: ROOT, stdio: 'pipe' }).toString(); } catch { return; }
  const added = diff.split('\n').filter(l => l.startsWith('+') && !l.startsWith('+++'));
  const patterns = [
    [/(password|passwd|pwd|비밀번호)\s*[:=]\s*['"]?[^\s'"]{4,}/i, '비밀번호로 보이는 값'],
    [/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\s*[/:,]\s*\S{4,}/, '계정+비밀번호로 보이는 값'],
    [/(api[_-]?key|secret|token)\s*[:=]\s*['"]?[A-Za-z0-9_\-]{16,}/i, 'API 키/토큰으로 보이는 값'],
    [/\b(sk|pk|ghp|gho|xox[baprs])[-_][A-Za-z0-9]{16,}\b/, '서비스 토큰으로 보이는 값'],
    [/-----BEGIN [A-Z ]*PRIVATE KEY-----/, '개인 키(private key) 내용'],
  ];
  const hits = [];
  for (const line of added) for (const [re, name] of patterns) if (re.test(line)) hits.push(name + ': ' + line.slice(1).trim().slice(0, 60));
  if (hits.length) failures.push({ label: '비밀값 검사', secret: true, out: [...new Set(hits)].join('\n') });
}

// ── 게이트 실행 ─────────────────────────────────────────────────────────
if (fs.existsSync(path.join(ROOT, 'tsconfig.json'))) {
  const f = run('타입 검사 (tsc)', 'npx tsc --noEmit');
  if (f) failures.push(f);
}
const testScript = scripts['test:changed'] ? 'test:changed' : (scripts.test ? 'test' : null);
if (testScript) {
  const f = run('테스트 (npm run ' + testScript + ')', 'npm run ' + testScript + ' --silent');
  if (f) failures.push(f);
}
if (scripts.lint) {
  const f = run('린트 (npm run lint)', 'npm run lint --silent');
  if (f) failures.push(f);
}
scanSecrets();
runStructuralChecks();

// ── 결과 출력 ───────────────────────────────────────────────────────────
function renderFail(f) {
  if (f.structural) {
    console.error('\n● 구조 규칙 위반: ' + f.name);
    console.error('  파일: ' + f.file);
    if (f.hint) console.error('  → ' + f.hint);
    console.error('  (잘 모르면 이 메시지를 AI에게 보여주며 "이 규칙대로 고쳐줘"라고 하세요.)');
  } else if (f.secret) {
    console.error('\n● ' + f.label + ' 실패');
    console.error('  커밋하려는 변경에 비밀값(계정/비밀번호/키)으로 보이는 게 있어요.');
    console.error('  → 그 값을 코드에서 지우고 .env 같은 곳으로 옮기세요. 잘 모르면 개발자에게 보여주세요.');
    console.error('  발견된 부분:\n    ' + f.out.split('\n').join('\n    '));
  } else {
    console.error('\n● ' + f.label + ' 실패');
    console.error('  → AI에게 "' + f.label + ' 실패했어, 고쳐줘"라고 그대로 보여주세요. 그래도 안 되면 개발자에게.');
    console.error('  마지막 메시지:\n    ' + f.out.split('\n').join('\n    '));
  }
}

if (warnings.length) {
  console.error('\n⚠️  경고 (커밋은 진행됩니다 — 확인만 하세요):');
  for (const w of warnings) console.error('  - ' + w.name + (w.file ? ' [' + w.file + ']' : ''));
}

if (!failures.length) {
  console.log('\n✅ 모든 검사 통과 — 커밋을 진행합니다.');
  process.exit(0);
}

console.error('\n──────────────────────────────────────────');
console.error('🚫 커밋을 멈췄습니다. 아래 문제를 먼저 해결하세요.');
console.error('──────────────────────────────────────────');
for (const f of failures) renderFail(f);
console.error('\n(모두가 안전하게 개발하도록 켜둔 검사입니다. 우회하지 말고 위 안내를 따르세요.)');
process.exit(1);
