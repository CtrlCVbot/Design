#!/usr/bin/env node
/**
 * Codex PreToolUse 훅(비차단) — qa-knowledge-activator 의 Codex 포팅.
 * 브라우저/플레이라이트 도구 사용 시 QA 지식을 additionalContext 로 자동 주입.
 *   1) 세션 첫 호출 → git 변경 기반 영향 분석(feature-impact-map.md)
 *   2) navigate → 해당 페이지 엣지케이스(qa-edge-cases.md)
 * 지식 파일: <cwd>/.claude/knowledge/. 캐시: tmp 30분.
 *
 * 검증 필요: 실제 Codex MCP(playwright) 세션에서 도구명/입력 형태 확인(여기선 브라우저 미실행).
 */
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { execSync } from 'node:child_process';

let input = '';
process.stdin.on('data', d => (input += d));
process.stdin.on('end', () => { try { run(JSON.parse(input)); } catch {} process.exit(0); });

function run(j) {
  const tool = String(j.tool_name || '');
  if (!/browser|playwright|navigate/i.test(tool)) return; // 브라우저 QA 도구만
  const cwd = j.cwd || process.cwd();
  const ti = j.tool_input || {};
  const KN = path.join(cwd, '.claude', 'knowledge');
  const CACHE = path.join(os.tmpdir(), 'codex-qa-knowledge.json');

  let cache = { timestamp: Date.now(), impactShown: false, pages: {} };
  try { const d = JSON.parse(fs.readFileSync(CACHE, 'utf8')); if (Date.now() - (d.timestamp || 0) < 1800000) cache = d; } catch {}

  let out = '';

  if (!cache.impactShown) {
    cache.impactShown = true;
    const changed = getChangedFiles(cwd);
    if (changed.length) {
      const affected = findAffected(changed, parseImpactMap(path.join(KN, 'feature-impact-map.md')));
      if (affected.length) {
        const lines = ['━━━ QA KNOWLEDGE: 영향 분석 ━━━'];
        for (const a of affected) { lines.push('📍 ' + a.name + ' — 회귀 테스트:'); for (const p of a.pages) lines.push('   - ' + p.url + ' → ' + p.check); }
        out += lines.join('\n') + '\n';
      }
    }
    save(CACHE, cache);
  }

  if (/navigate/i.test(tool)) {
    const url = String(ti.url || '');
    const page = extractPagePath(url);
    if (page && !cache.pages[page]) {
      cache.pages[page] = true; save(CACHE, cache);
      const ec = parseEdgeCases(path.join(KN, 'qa-edge-cases.md'));
      const hits = Object.entries(ec).filter(([u]) => page.includes(u) || u.includes(page));
      if (hits.length) {
        const lines = ['━━━ QA KNOWLEDGE: ' + page + ' ━━━'];
        for (const [, data] of hits) for (const c of data.cases.filter(c => c.status !== 'wontfix')) {
          const icon = (c.severity === 'high' || c.severity === 'critical') ? '🔴' : '🟡';
          lines.push('  ' + icon + ' ' + c.title + (c.status === 'fixed' ? ' [회귀확인]' : ' [재현확인]'));
        }
        if (lines.length > 1) out += lines.join('\n') + '\n';
      }
    }
  }

  if (!out) return;
  try { fs.appendFileSync(path.join(cwd, '.harness-metrics.jsonl'), JSON.stringify({ tool: 'codex', event: 'qa_knowledge', ref: tool, skill_ref: true }) + '\n'); } catch {}
  process.stdout.write(JSON.stringify({ hookSpecificOutput: { hookEventName: 'PreToolUse', additionalContext: out } }));
}

function save(p, o) { try { fs.writeFileSync(p, JSON.stringify(o)); } catch {} }
function getChangedFiles(cwd) {
  try { return execSync('git diff --name-only HEAD~5', { encoding: 'utf8', timeout: 5000, cwd }).trim().split('\n').filter(Boolean); } catch { return []; }
}
function parseImpactMap(p) {
  try {
    const content = fs.readFileSync(p, 'utf8');
    return content.split(/\n## /).slice(1).map(section => {
      const name = section.split('\n')[0].replace(/\s*\(.*\)/, '').trim();
      const pb = section.match(/```\n([\s\S]*?)```/);
      const patterns = pb ? pb[1].trim().split('\n').filter(Boolean) : [];
      const pages = [];
      for (const row of (section.match(/\| .+ \| \/.+ \| .+ \|/g) || [])) {
        const cols = row.split('|').map(c => c.trim()).filter(Boolean);
        if (cols.length >= 3) pages.push({ page: cols[0], url: cols[1], check: cols[2] });
      }
      return { name, patterns, pages };
    });
  } catch { return []; }
}
function parseEdgeCases(p) {
  try {
    const content = fs.readFileSync(p, 'utf8');
    const result = {};
    for (const section of content.split(/\n## /).slice(1)) {
      const header = section.split('\n')[0].trim();
      const um = header.match(/(\/\S+)/); if (!um) continue;
      const cases = [];
      for (const block of section.split(/\n#### /).slice(1)) {
        const title = block.split('\n')[0].trim();
        const severity = (block.match(/\*\*심각도\*\*:\s*(\w+)/) || [])[1] || 'unknown';
        const status = (block.match(/\*\*상태\*\*:\s*(\w+)/) || [])[1] || 'unknown';
        cases.push({ title, severity, status });
      }
      result[um[1]] = { name: header, cases };
    }
    return result;
  } catch { return {}; }
}
function findAffected(changed, impactMap) {
  return impactMap.filter(area => area.pages.length > 0 && changed.some(f => area.patterns.some(pt => f.startsWith(pt.replace(/\*\*.*/, '').replace(/\*.*/, '')))));
}
function extractPagePath(url) {
  try { return new URL(url).pathname; } catch { return url.replace(/\?.*$/, '').replace(/^https?:\/\/[^/]+/, ''); }
}
