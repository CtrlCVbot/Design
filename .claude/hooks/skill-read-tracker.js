#!/usr/bin/env node

/**
 * Skill & Docs Read Tracker Hook (PostToolUse — Read)
 *
 * Read 도구 사용 시 docs/standards/ 파일 읽기를 추적합니다.
 * guide-loader.js가 cache.reads를 확인하여 블로킹 여부를 결정합니다.
 *
 * 캐시 구조 (.docs-read-cache.json):
 *   {
 *     "reads":  { "docs/standards/drizzle": timestamp },  ← 이 훅이 기록
 *     "files":  { "filePath::docsGroup": timestamp },      ← guide-loader가 기록
 *     "blocks": { "docs/standards/drizzle": timestamp }    ← guide-loader가 기록
 *   }
 *
 * 그룹 정규화:
 *   docs/standards/react/01-foo.md         → docs/standards/react
 *   docs/standards/react/gap-analysis.md   → docs/standards/react
 *   docs/standards/zustand.md              → docs/standards/zustand
 *   docs/standards/zustand-gap-analysis.md → docs/standards/zustand
 */

const fs = require('fs');
const path = require('path');

const DOCS_READ_CACHE_PATH = path.join(__dirname, '../.docs-read-cache.json');

// ─── Cache ──────────────────────────────────────────────

function loadCache() {
  try {
    if (fs.existsSync(DOCS_READ_CACHE_PATH)) {
      return JSON.parse(fs.readFileSync(DOCS_READ_CACHE_PATH, 'utf8'));
    }
  } catch {}
  return { reads: {}, files: {}, blocks: {} };
}

function saveCache(cache) {
  try {
    fs.writeFileSync(DOCS_READ_CACHE_PATH, JSON.stringify(cache, null, 2), 'utf8');
  } catch {}
}

// ─── docs/standards/ 그룹 정규화 ────────────────────────

function getDocsGroup(filePath) {
  const normalized = filePath.replace(/\\/g, '/');
  const match = normalized.match(/docs\/standards\/([^/]+)/);
  if (!match) return null;

  let part = match[1];
  part = part
    .replace(/\.md$/, '')
    .replace(/-gap-analysis$/, '');
  return 'docs/standards/' + part;
}

// ─── 메인 ────────────────────────────────────────────────

async function main() {
  try {
    let inputData = '';
    for await (const chunk of process.stdin) {
      inputData += chunk;
    }

    const parsed = JSON.parse(inputData);
    const toolUse = parsed.tool_use || {};
    const toolName = toolUse.tool_name || '';

    if (toolName !== 'Read') {
      process.exit(0);
    }

    const filePath = (toolUse.tool_input?.file_path || '').replace(/\\/g, '/');

    // docs/standards/ 파일 읽기 추적
    if (filePath.includes('docs/standards/')) {
      const group = getDocsGroup(filePath);
      if (group) {
        const cache = loadCache();
        if (!cache.reads) cache.reads = {};
        cache.reads[group] = Date.now();
        saveCache(cache);
      }
    }

    process.exit(0);
  } catch (error) {
    process.exit(0);
  }
}

main();
