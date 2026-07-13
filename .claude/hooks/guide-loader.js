#!/usr/bin/env node

/**
 * Guide Loader Hook (PreToolUse — Edit|Write)
 *
 * 수정 대상 파일에 맞는 스킬의 핵심 규칙을 additionalContext로 직접 주입합니다.
 *
 * Before: 블로킹(exit 2) → Claude가 docs Read → 재시도 → 통과 (3단계, 캐시 필요)
 * After:  스킬 규칙을 context에 주입 → 바로 통과(exit 0) (1단계, 캐시 불필요)
 *
 * 동작:
 *   1. 파일 경로/내용 → skill-rules.json 매칭
 *   2. 매칭된 스킬 파일의 핵심 규칙 추출
 *   3. additionalContext로 주입 (세션 내 스킬별 1회)
 *   4. exit(0) — 항상 통과, 블로킹 없음
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

const SKILL_RULES_PATH = path.join(__dirname, '../skill-rules.json');
const PROJECT_ROOT = path.resolve(__dirname, '../../');
const INJECTED_PATH = path.join(os.tmpdir(), 'claude-skill-injected.json');

// ─── glob → RegExp 변환 ─────────────────────────────────

function globToRegex(glob) {
  let regex = glob
    .replace(/\\/g, '/')
    .replace(/\./g, '\\.')
    .replace(/\*\*\//g, '(.+/)?')
    .replace(/\*\*/g, '.*')
    .replace(/\*/g, '[^/]*');
  return new RegExp('(^|/)' + regex + '$');
}

// ─── 주입 추적 (세션 내 스킬별 1회) ─────────────────────

function loadInjected() {
  try {
    if (fs.existsSync(INJECTED_PATH)) {
      const data = JSON.parse(fs.readFileSync(INJECTED_PATH, 'utf8'));
      // 30분 TTL
      if (Date.now() - (data.timestamp || 0) < 30 * 60 * 1000) {
        return data.skills || {};
      }
    }
  } catch {}
  return {};
}

function saveInjected(skills) {
  try {
    fs.writeFileSync(INJECTED_PATH, JSON.stringify({ timestamp: Date.now(), skills }), 'utf8');
  } catch {}
}

// ─── 스킬 파일에서 규칙 섹션 추출 ───────────────────────

function extractRules(skillFilePath) {
  try {
    const fullPath = path.join(PROJECT_ROOT, skillFilePath);
    const content = fs.readFileSync(fullPath, 'utf8');

    // frontmatter 제거
    const withoutFrontmatter = content.replace(/^---[\s\S]*?---\n*/, '');

    // "적용 시점/조건", "필수 참조", "심화 참조" 섹션 제거 — 규칙과 체크리스트만 남김
    const lines = withoutFrontmatter.split('\n');
    const result = [];
    let skip = false;

    for (const line of lines) {
      if (/^## (적용 시점|적용 조건|필수 참조|심화 참조)/.test(line)) {
        skip = true;
        continue;
      }
      if (/^## /.test(line)) {
        skip = false;
      }
      if (!skip) {
        result.push(line);
      }
    }

    return result.join('\n').trim();
  } catch {
    return null;
  }
}

// ─── 매칭 ───────────────────────────────────────────────

function matchesByPath(filePath, pathPatterns) {
  if (!pathPatterns || pathPatterns.length === 0) return false;
  const normalized = filePath.replace(/\\/g, '/');
  return pathPatterns.some(pattern => globToRegex(pattern).test(normalized));
}

function matchesByContent(content, contentPatterns) {
  if (!content || !contentPatterns || contentPatterns.length === 0) return false;
  return contentPatterns.some(pattern => {
    try { return new RegExp(pattern).test(content); } catch { return false; }
  });
}

// ─── 메인 ────────────────────────────────────────────────

async function main() {
  try {
    let inputData = '';
    for await (const chunk of process.stdin) {
      inputData += chunk;
    }

    const parsed = JSON.parse(inputData);
    const toolName = parsed.tool_name || '';
    const toolInput = parsed.tool_input || {};

    if (!['Edit', 'Write'].includes(toolName)) {
      process.exit(0);
    }

    const filePath = toolInput.file_path || '';
    if (!filePath) process.exit(0);

    const normalizedPath = filePath.replace(/\\/g, '/');

    // 예외: 주입 불필요 파일
    if (normalizedPath.includes('.claude/')) process.exit(0);
    if (normalizedPath.includes('/docs/')) process.exit(0);
    if (normalizedPath.includes('/db/')) process.exit(0);
    if (normalizedPath.includes('/supabase/')) process.exit(0);
    if (/\.config\.(ts|js|mjs)$/.test(normalizedPath)) process.exit(0);

    const editContent = [
      toolInput.old_string || '',
      toolInput.new_string || '',
      toolInput.content || ''
    ].join('\n');

    // skill-rules.json 매칭
    let skillRules;
    try {
      skillRules = JSON.parse(fs.readFileSync(SKILL_RULES_PATH, 'utf8'));
    } catch {
      process.exit(0);
    }

    const matchedSkills = [];

    for (const [name, rule] of Object.entries(skillRules)) {
      const triggers = rule.fileTriggers;
      if (!triggers) continue;

      const hasPathPatterns = triggers.pathPatterns && triggers.pathPatterns.length > 0;
      const hasContentPatterns = triggers.contentPatterns && triggers.contentPatterns.length > 0;

      const pathMatch = matchesByPath(filePath, triggers.pathPatterns);
      const contentMatch = matchesByContent(editContent, triggers.contentPatterns);

      let isMatch = false;
      if (hasPathPatterns && pathMatch) isMatch = true;
      else if (!hasPathPatterns && hasContentPatterns && contentMatch) isMatch = true;

      if (isMatch) {
        matchedSkills.push({ name, skill: rule.skill });
      }
    }

    if (matchedSkills.length === 0) {
      process.exit(0);
    }

    // 세션 내 이미 주입한 스킬 스킵
    const injected = loadInjected();
    const toInject = matchedSkills.filter(s => !injected[s.name]);

    if (toInject.length === 0) {
      process.exit(0);
    }

    // 최대 2개 스킬만 주입 (컨텍스트 절약)
    const selected = toInject.slice(0, 2);
    const sections = [];

    for (const s of selected) {
      const rules = extractRules(s.skill);
      if (rules) {
        sections.push(`[${s.name}] ${s.skill}\n${rules}`);
        injected[s.name] = Date.now();
      }
    }

    saveInjected(injected);

    if (sections.length === 0) {
      process.exit(0);
    }

    const context = [
      '━━━ SKILL RULES (자동 주입) ━━━',
      ...sections,
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    ].join('\n\n');

    process.stdout.write(JSON.stringify({ additionalContext: context }));
    process.exit(0);
  } catch (error) {
    process.exit(0);
  }
}

main();
