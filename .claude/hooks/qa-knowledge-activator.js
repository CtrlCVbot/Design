#!/usr/bin/env node

/**
 * QA Knowledge Activator Hook (PreToolUse — Playwright tools)
 *
 * QA 브라우저 세션에서 knowledge를 자동 주입합니다.
 *
 * 동작:
 *   1. 세션 첫 Playwright 호출 → git 변경 파일 기반 영향 분석 출력
 *   2. browser_navigate 호출 → 해당 페이지의 엣지케이스 출력
 *   3. 이미 출력한 페이지/분석은 캐시로 스킵
 *
 * 캐시: %TEMP%/qa-knowledge-cache.json (30분 TTL)
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');

const PROJECT_ROOT = path.resolve(__dirname, '../../');
const KNOWLEDGE_DIR = path.join(__dirname, '../knowledge');
const EDGE_CASES_PATH = path.join(KNOWLEDGE_DIR, 'qa-edge-cases.md');
const IMPACT_MAP_PATH = path.join(KNOWLEDGE_DIR, 'feature-impact-map.md');
const CACHE_PATH = path.join(os.tmpdir(), 'qa-knowledge-cache.json');
const CACHE_TTL = 30 * 60 * 1000; // 30분

// ─── Cache ──────────────────────────────────────────────

function loadCache() {
  try {
    if (fs.existsSync(CACHE_PATH)) {
      const data = JSON.parse(fs.readFileSync(CACHE_PATH, 'utf8'));
      if (Date.now() - (data.timestamp || 0) < CACHE_TTL) {
        return data;
      }
    }
  } catch {}
  return { timestamp: Date.now(), impactShown: false, pages: {} };
}

function saveCache(cache) {
  try {
    fs.writeFileSync(CACHE_PATH, JSON.stringify(cache), 'utf8');
  } catch {}
}

// ─── Git 변경 파일 ──────────────────────────────────────

function getChangedFiles() {
  try {
    const result = execSync('git diff --name-only HEAD~5', {
      encoding: 'utf8',
      timeout: 5000,
      cwd: PROJECT_ROOT
    });
    return result.trim().split('\n').filter(Boolean);
  } catch {
    return [];
  }
}

// ─── Feature Impact Map 파싱 ────────────────────────────

function parseImpactMap() {
  try {
    const content = fs.readFileSync(IMPACT_MAP_PATH, 'utf8');
    const sections = content.split(/\n## /).slice(1);

    return sections.map(section => {
      const lines = section.split('\n');
      const name = lines[0].replace(/\s*\(.*\)/, '').trim();

      // 파일 패턴 추출
      const patternBlock = section.match(/```\n([\s\S]*?)```/);
      const patterns = patternBlock
        ? patternBlock[1].trim().split('\n').filter(Boolean)
        : [];

      // 회귀 테스트 페이지 추출
      const pages = [];
      const tableRows = section.match(/\| .+ \| \/.+ \| .+ \|/g) || [];
      for (const row of tableRows) {
        const cols = row.split('|').map(c => c.trim()).filter(Boolean);
        if (cols.length >= 3) {
          pages.push({ page: cols[0], url: cols[1], check: cols[2] });
        }
      }

      return { name, patterns, pages };
    });
  } catch {
    return [];
  }
}

// ─── QA Edge Cases 파싱 ─────────────────────────────────

function parseEdgeCases() {
  try {
    const content = fs.readFileSync(EDGE_CASES_PATH, 'utf8');
    const pageSections = content.split(/\n## /).slice(1);

    const result = {};
    for (const section of pageSections) {
      const lines = section.split('\n');
      const header = lines[0].trim();

      const urlMatch = header.match(/(\/\S+)/);
      if (!urlMatch) continue;
      const url = urlMatch[1];

      const cases = [];
      const caseBlocks = section.split(/\n#### /).slice(1);
      for (const block of caseBlocks) {
        const caseLines = block.split('\n');
        const title = caseLines[0].trim();
        const severity = block.match(/\*\*심각도\*\*:\s*(\w+)/)?.[1] || 'unknown';
        const status = block.match(/\*\*상태\*\*:\s*(\w+)/)?.[1] || 'unknown';
        cases.push({ title, severity, status });
      }

      result[url] = { name: header, cases };
    }

    return result;
  } catch {
    return {};
  }
}

// ─── 변경 파일 → 영향 영역 매칭 ────────────────────────

function findAffectedAreas(changedFiles, impactMap) {
  const affected = [];

  for (const area of impactMap) {
    const isAffected = changedFiles.some(file =>
      area.patterns.some(pattern => {
        // 간단한 glob → prefix 매칭
        const prefix = pattern.replace(/\*\*.*/, '').replace(/\*.*/, '');
        return file.startsWith(prefix);
      })
    );

    if (isAffected && area.pages.length > 0) {
      affected.push(area);
    }
  }

  return affected;
}

// ─── URL에서 페이지 경로 추출 ───────────────────────────

function extractPagePath(url) {
  try {
    const parsed = new URL(url);
    return parsed.pathname;
  } catch {
    return url.replace(/\?.*$/, '').replace(/^https?:\/\/[^/]+/, '');
  }
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

    const cache = loadCache();
    let output = '';

    // Phase 1: 세션 첫 Playwright 호출 → 영향 분석
    if (!cache.impactShown) {
      cache.impactShown = true;

      const changedFiles = getChangedFiles();
      if (changedFiles.length > 0) {
        const impactMap = parseImpactMap();
        const affected = findAffectedAreas(changedFiles, impactMap);

        if (affected.length > 0) {
          const lines = [
            '',
            '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
            '🎯 QA KNOWLEDGE: 영향 분석',
            '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
            '',
          ];

          for (const area of affected) {
            lines.push(`📍 ${area.name}`);
            lines.push('   회귀 테스트 필요:');
            for (const p of area.pages) {
              lines.push(`   - ${p.url} → ${p.check}`);
            }
            lines.push('');
          }

          lines.push('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
          lines.push('');
          output += lines.join('\n');
        }
      }

      saveCache(cache);
    }

    // Phase 2: browser_navigate → 해당 페이지 엣지케이스
    if (toolName.includes('browser_navigate')) {
      const url = toolInput.url || '';
      const pagePath = extractPagePath(url);

      if (pagePath && !cache.pages[pagePath]) {
        cache.pages[pagePath] = true;
        saveCache(cache);

        const edgeCases = parseEdgeCases();

        // 부분 URL 매칭
        const matchingEntries = Object.entries(edgeCases).filter(([ecUrl]) =>
          pagePath.includes(ecUrl) || ecUrl.includes(pagePath)
        );

        if (matchingEntries.length > 0) {
          const lines = [
            '',
            '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
            `📋 QA KNOWLEDGE: ${pagePath}`,
            '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
            '',
          ];

          for (const [, data] of matchingEntries) {
            const activeCases = data.cases.filter(c => c.status !== 'wontfix');
            for (const c of activeCases) {
              const icon = c.severity === 'high' || c.severity === 'critical' ? '🔴' : '🟡';
              const tag = c.status === 'fixed' ? '[회귀확인]' : '[재현확인]';
              lines.push(`  ${icon} ${c.title} ${tag}`);
            }
          }

          lines.push('');
          lines.push('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
          lines.push('');
          output += lines.join('\n');
        }
      }
    }

    if (output) {
      process.stderr.write(output);
    }

    process.exit(0);
  } catch (error) {
    process.exit(0);
  }
}

main();