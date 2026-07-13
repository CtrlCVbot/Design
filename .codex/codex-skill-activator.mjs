#!/usr/bin/env node
/**
 * Codex UserPromptSubmit 훅(비차단) — skill-activator 의 Codex 포팅.
 * 프롬프트 키워드/의도패턴을 skill-rules.json(promptTriggers)과 매칭해 관련 스킬을
 * additionalContext 로 안내한다. (Claude skill-activator 는 stderr 출력이라 Codex 엔 무효 → 별도 포팅.)
 */
import fs from 'node:fs';
import path from 'node:path';

let input = '';
process.stdin.on('data', d => (input += d));
process.stdin.on('end', () => { try { run(JSON.parse(input)); } catch {} process.exit(0); });

function run(j) {
  const prompt = String(j.prompt || j.user_prompt || j.message || j.input || '');
  if (!prompt) return;
  const cwd = j.cwd || process.cwd();
  let rules;
  try { rules = JSON.parse(fs.readFileSync(path.join(cwd, '.claude', 'skill-rules.json'), 'utf8').replace(/^﻿/, '')); } catch { return; }

  const low = prompt.toLowerCase();
  const matched = [];
  for (const [name, rule] of Object.entries(rules)) {
    const pt = rule.promptTriggers || {};
    const kw = (pt.keywords || []).some(k => low.includes(String(k).toLowerCase()));
    let intent = false;
    if (!kw) intent = (pt.intentPatterns || []).some(p => { try { return new RegExp(p, 'i').test(prompt); } catch { return false; } });
    if (kw || intent) matched.push({ name, skill: rule.skill });
  }
  if (!matched.length) return;

  const list = matched.map(s => '  📌 ' + s.name + ' → ' + s.skill).join('\n');
  const ctx = '━━━ 관련 스킬 (프롬프트 감지) ━━━\n' + list + '\n작업 전 위 스킬 파일을 읽고 따르세요.';
  try { fs.appendFileSync(path.join(cwd, '.harness-metrics.jsonl'), JSON.stringify({ tool: 'codex', event: 'skill_activated', ref: matched.map(m => m.name).join(','), skill_ref: true }) + '\n'); } catch {}
  process.stdout.write(JSON.stringify({ hookSpecificOutput: { hookEventName: 'UserPromptSubmit', additionalContext: ctx } }));
}
