#!/usr/bin/env node
/**
 * Codex PreToolUse 훅(비차단) — guide-loader 의 Codex 포팅.
 * 편집(apply_patch) 대상 파일에 맞는 스킬 규칙을 additionalContext 로 자동 주입한다.
 * → Codex 도 Claude 처럼 "편집하는 파일에 맞는 스킬을 알아서 읽는다".
 *
 * Codex apply_patch 는 tool_input.command(패치)만 주므로 패치에서 경로·추가내용을 파싱.
 * 매칭: <cwd>/.claude/skill-rules.json 의 fileTriggers(pathPatterns/contentPatterns).
 * 주입: Codex 형식 hookSpecificOutput.additionalContext. 항상 통과(차단 안 함).
 * 지표: 주입 시 .harness-metrics.jsonl 에 skill_injected 기록.
 */
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

let input = '';
process.stdin.on('data', d => (input += d));
process.stdin.on('end', () => {
  try { run(JSON.parse(input)); } catch {}
  process.exit(0);
});

function run(j) {
  if (j.tool_name !== 'apply_patch') return;
  const cwd = j.cwd || process.cwd();
  const patch = (j.tool_input && j.tool_input.command) || '';
  let rules;
  try { rules = JSON.parse(fs.readFileSync(path.join(cwd, '.claude', 'skill-rules.json'), 'utf8').replace(/^﻿/, '')); } catch { return; }

  const files = parsePatch(patch);
  const matched = new Map(); // name -> skillPath
  for (const f of files) {
    if (/[\\/]\.claude[\\/]|[\\/]docs[\\/]|[\\/]db[\\/]/.test(f.path)) continue;
    const content = f.added.join('\n');
    for (const [name, rule] of Object.entries(rules)) {
      const t = rule.fileTriggers; if (!t) continue;
      const hasPath = t.pathPatterns && t.pathPatterns.length;
      const hasContent = t.contentPatterns && t.contentPatterns.length;
      const pathMatch = hasPath && t.pathPatterns.some(p => globToRegex(p).test(f.path));
      const contentMatch = hasContent && t.contentPatterns.some(p => { try { return new RegExp(p).test(content); } catch { return false; } });
      if ((hasPath && pathMatch) || (!hasPath && hasContent && contentMatch)) matched.set(name, rule.skill);
    }
  }
  if (!matched.size) return;

  // 세션 내 스킬별 1회(30분 TTL)
  const injPath = path.join(os.tmpdir(), 'codex-skill-injected.json');
  let inj = {};
  try { const d = JSON.parse(fs.readFileSync(injPath, 'utf8')); if (Date.now() - (d.timestamp || 0) < 1800000) inj = d.skills || {}; } catch {}
  const todo = [...matched].filter(([n]) => !inj[n]).slice(0, 2);
  if (!todo.length) return;

  const sections = [];
  const injectedNames = [];
  for (const [name, skill] of todo) {
    const r = extractRules(path.join(cwd, skill));
    if (r) { sections.push('[' + name + '] ' + skill + '\n' + r); inj[name] = Date.now(); injectedNames.push(name); }
  }
  if (!sections.length) return;
  try { fs.writeFileSync(injPath, JSON.stringify({ timestamp: Date.now(), skills: inj })); } catch {}

  // 지표 기록
  try { fs.appendFileSync(path.join(cwd, '.harness-metrics.jsonl'), JSON.stringify({ tool: 'codex', event: 'skill_injected', ref: injectedNames.join(','), skill_ref: true }) + '\n'); } catch {}

  const context = ['━━━ SKILL RULES (자동 주입) ━━━', ...sections, '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'].join('\n\n');
  process.stdout.write(JSON.stringify({ hookSpecificOutput: { hookEventName: 'PreToolUse', additionalContext: context } }));
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
  const re = glob.replace(/\\/g, '/').replace(/\./g, '\\.').replace(/\*\*\//g, '(.+/)?').replace(/\*\*/g, '.*').replace(/\*/g, '[^/]*');
  return new RegExp('(^|/)' + re + '$');
}
function extractRules(skillFullPath) {
  try {
    const content = fs.readFileSync(skillFullPath, 'utf8').replace(/^---[\s\S]*?---\n*/, '');
    const out = []; let skip = false;
    for (const line of content.split('\n')) {
      if (/^## (적용 시점|적용 조건|필수 참조|심화 참조)/.test(line)) { skip = true; continue; }
      if (/^## /.test(line)) skip = false;
      if (!skip) out.push(line);
    }
    return out.join('\n').trim();
  } catch { return null; }
}
