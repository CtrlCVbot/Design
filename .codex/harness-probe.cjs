#!/usr/bin/env node
/**
 * 하네스 활동 프로브 (비차단) — 훅이 발사될 때마다 활동을 .harness-metrics.jsonl 에 기록.
 * 측정 지표용: 훅 발사 / 도구 사용 / 스킬·지침 파일 참조(읽기) 여부.
 * Claude(.claude/settings.json) 와 Codex(.codex/hooks.json) 양쪽 PreToolUse/PostToolUse/
 * UserPromptSubmit 에 배선. 절대 차단하지 않고(allow), 로그만 남긴다.
 *
 * Usage(훅 command): node harness-probe.cjs <tool: claude|codex>
 */
const fs = require('fs');
const path = require('path');

let input = '';
process.stdin.on('data', d => (input += d));
process.stdin.on('end', () => {
  let j = {};
  try { j = JSON.parse(input); } catch { process.exit(0); }
  const tool = process.argv[2] || '?';
  const cwd = j.cwd || process.cwd();
  const ti = j.tool_input || {};
  const ref = String(ti.file_path || ti.command || ti.path || ti.pattern || '');
  const skillRef = /guidelines\/|playbooks\/|[\\/]\.claude[\\/]skills[\\/]|AGENTS\.md|tdd-workflow|simple-design|layered-architecture|drizzle\.md|testing\.md|react\.md|auth\.md/.test(ref);
  const rec = {
    tool,
    event: j.hook_event_name || '?',
    tool_name: j.tool_name || j.event_name || null,
    ref: ref.slice(0, 140),
    skill_ref: skillRef,
  };
  try { fs.appendFileSync(path.join(cwd, '.harness-metrics.jsonl'), JSON.stringify(rec) + '\n'); } catch {}
  process.exit(0);
});
