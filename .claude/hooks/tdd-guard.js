#!/usr/bin/env node

/**
 * TDD Guard Hook (PreToolUse)
 *
 * Edit/Write 시 프로덕션 코드에 대응하는 테스트 파일이 존재하는지 검사합니다.
 * 테스트 파일이 없으면 exit 2로 블로킹 → "테스트를 먼저 작성하세요"
 *
 * TDD 워크플로우: 실패하는 테스트 → 최소 구현 → 리팩토링
 * 참조: .claude/skills/tdd-workflow.md
 *
 * 대상 (테스트 필수):
 *   - 모든 .ts/.tsx 파일 (예외 제외)
 *
 * 예외 (테스트 불필요):
 *   - 테스트 파일 자체 (tests/, *.test.ts, *.spec.ts)
 *   - 에러 클래스 (domain/errors/)
 *   - 타입 정의 (.d.ts, types/)
 *   - DB 스키마/마이그레이션 (db/)
 *   - 설정 파일 (*.config.ts)
 *   - Next.js 라우팅 (page.tsx, layout.tsx, loading.tsx, error.tsx, not-found.tsx)
 *   - Route 파일 (app/api/) — 통합 테스트 대상
 *   - Repository 파일 — 통합 테스트 대상
 *   - index.ts 파일
 *   - UI 프리미티브 (components/ui/)
 */

const fs = require('fs');
const path = require('path');

// ─── 프로덕션 파일 감지 (TDD 대상) ────────────────────────

function isTddTarget(filePath) {
  const normalized = filePath.replace(/\\/g, '/');

  // 모든 .ts/.tsx 파일이 대상 (예외는 isException에서 처리)
  if (/\.(ts|tsx)$/.test(normalized)) return true;

  return false;
}

// ─── 예외 파일 감지 ────────────────────────────────────────

function isException(filePath) {
  const normalized = filePath.replace(/\\/g, '/');

  // 테스트 파일 자체
  if (/\.test\.(ts|tsx)$/.test(normalized)) return true;
  if (/\.spec\.(ts|tsx)$/.test(normalized)) return true;
  if (/tests\//.test(normalized)) return true;

  // 에러 클래스
  if (/\/errors\//.test(normalized)) return true;

  // 타입 정의
  if (/\.d\.ts$/.test(normalized)) return true;
  if (/\/types\//.test(normalized)) return true;

  // index.ts
  if (/\/index\.(ts|tsx)$/.test(normalized)) return true;

  // 설정 파일
  if (/\.config\.(ts|js|mjs)$/.test(normalized)) return true;

  // Next.js 라우팅 파일
  if (/\/(page|layout|loading|error|not-found)\.(ts|tsx)$/.test(normalized)) return true;

  // Route 핸들러 (통합 테스트 대상)
  if (/app\/api\//.test(normalized) && /\/route\.(ts|tsx)$/.test(normalized)) return true;

  // Repository (통합 테스트 대상)
  if (/\.repository\.(ts|tsx)$/.test(normalized)) return true;

  // DB 스키마/마이그레이션
  if (/\/db\//.test(normalized)) return true;

  // 스크립트 (seed, migration, 운영 도구)
  if (/\/scripts\//.test(normalized)) return true;

  // UI 프리미티브 (shadcn 등)
  if (/components\/ui\//.test(normalized)) return true;

  // hooks 설정 파일
  if (/\.claude\//.test(normalized)) return true;

  return false;
}

// ─── 테스트 파일 검색 ──────────────────────────────────────

function findTestFile(productionFilePath, projectRoot) {
  const ext = path.extname(productionFilePath);
  const basename = path.basename(productionFilePath, ext);

  // 1. 공존 __tests__/ 디렉토리 확인
  const colocatedDir = path.join(path.dirname(productionFilePath), '__tests__');
  if (fs.existsSync(colocatedDir)) {
    const found = searchRecursive(colocatedDir, `${basename}.test.ts`)
      || searchRecursive(colocatedDir, `${basename}.test.tsx`)
      || searchRecursive(colocatedDir, `${basename}.spec.ts`)
      || searchRecursive(colocatedDir, `${basename}.spec.tsx`);
    if (found) return found;
  }

  // 2. 프로젝트 루트 tests/ 디렉토리 확인
  const testsDir = path.join(projectRoot, 'tests');
  if (!fs.existsSync(testsDir)) return null;

  return searchRecursive(testsDir, `${basename}.test.ts`)
    || searchRecursive(testsDir, `${basename}.test.tsx`)
    || searchRecursive(testsDir, `${basename}.spec.ts`)
    || searchRecursive(testsDir, `${basename}.spec.tsx`);
}

function searchRecursive(dir, targetFilename) {
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        // node_modules 등 무시
        if (entry.name === 'node_modules' || entry.name === '.git') continue;
        const found = searchRecursive(fullPath, targetFilename);
        if (found) return found;
      } else if (entry.name === targetFilename) {
        return fullPath;
      }
    }
  } catch {}
  return null;
}

// ─── 메인 ────────────────────────────────────────────────

async function main() {
  try {
    let inputData = '';
    for await (const chunk of process.stdin) {
      inputData += chunk;
    }

    const parsed = JSON.parse(inputData);
    const toolInput = parsed.tool_input || {};
    const filePath = toolInput.file_path || '';

    if (!filePath || (!filePath.endsWith('.ts') && !filePath.endsWith('.tsx'))) {
      process.exit(0);
    }

    // 예외 파일이면 통과
    if (isException(filePath)) {
      process.exit(0);
    }

    // TDD 대상이 아니면 통과
    if (!isTddTarget(filePath)) {
      process.exit(0);
    }

    // 프로젝트 루트 탐색
    const projectRoot = findProjectRoot(filePath);
    if (!projectRoot) {
      process.exit(0);
    }

    // 테스트 파일 존재 여부 확인
    const testFile = findTestFile(filePath, projectRoot);
    if (testFile) {
      // 테스트 파일 존재 → 통과
      process.exit(0);
    }

    // 테스트 파일 없음 → 블로킹
    const ext = path.extname(filePath);
    const basename = path.basename(filePath, ext);
    const testExt = ext === '.tsx' ? '.test.tsx' : '.test.ts';
    const lines = [];
    lines.push('');
    lines.push('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    lines.push('🔴 TDD 위반: 테스트를 먼저 작성하세요');
    lines.push('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    lines.push(`프로덕션 파일: ${path.basename(filePath)}`);
    lines.push(`필요한 테스트:  ${basename}${testExt}`);
    lines.push('');
    lines.push('TDD 워크플로우:');
    lines.push('  1. 유즈케이스 정의');
    lines.push('  2. 실패하는 테스트 작성 (← 지금 이 단계)');
    lines.push('  3. 최소 구현');
    lines.push('  4. 리팩토링');
    lines.push('');
    lines.push(`테스트 파일을 먼저 생성하세요:`);
    lines.push(`  tests/.../${basename}${testExt}`);
    lines.push('');
    lines.push('참조: .claude/skills/tdd-workflow.md');
    lines.push('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    lines.push('');

    process.stderr.write(lines.join('\n'));
    process.exit(2);
  } catch (error) {
    // 에러 시 조용히 통과 (훅이 프로세스를 방해하면 안됨)
    process.exit(0);
  }
}

function findProjectRoot(filePath) {
  let dir = path.dirname(path.resolve(filePath));
  for (let i = 0; i < 20; i++) {
    if (fs.existsSync(path.join(dir, 'package.json'))) {
      return dir;
    }
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return null;
}

main();
