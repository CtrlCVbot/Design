#!/usr/bin/env node

/**
 * SOLID Principle Reviewer Hook (Stop)
 *
 * 세션 응답 완료 후 변경된 파일들의 SOLID 원칙 위반을 검사합니다.
 * 블로킹하지 않고 인사이트만 제공합니다 (exit 0).
 *
 * 확장 가능한 구조:
 *   - principles/ 배열에 새 원칙 추가하면 자동 적용
 *   - 현재: SRP (Single Responsibility Principle)
 *   - 추후: OCP, LSP, ISP, DIP
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

const PROJECT_ROOT = path.resolve(__dirname, '../../');
const EDIT_LOG_PATH = path.join(os.tmpdir(), 'claude-edits.log');

// ─── SOLID 원칙 정의 (확장 포인트) ──────────────────────

const principles = [
  {
    name: 'SRP',
    fullName: 'Single Responsibility Principle',
    description: '하나의 모듈은 하나의 actor에만 책임져야 한다',
    check: checkSRP
  },
  {
    name: 'OCP',
    fullName: 'Open-Closed Principle',
    description: '확장에 열려있고 수정에 닫혀있어야 한다',
    check: checkOCP
  },
  {
    name: 'LSP',
    fullName: 'Liskov Substitution Principle',
    description: '같은 인터페이스의 구현은 대체 가능해야 한다',
    check: checkLSP
  },
  {
    name: 'ISP',
    fullName: 'Interface Segregation Principle',
    description: '필요하지 않은 것에 의존하지 마라',
    check: checkISP
  },
  {
    name: 'DIP',
    fullName: 'Dependency Inversion Principle',
    description: '소스 코드 의존성은 추상을 향해야 한다',
    check: checkDIP
  },
  {
    name: 'CCP/ADP',
    fullName: 'Component Cohesion & Acyclic Dependencies',
    description: '도메인 간 결합과 순환 의존 탐지',
    check: checkComponent
  }
];

// ─── SRP 검사 ───────────────────────────────────────────

function checkSRP(filePath, content) {
  const violations = [];
  const normalized = filePath.replace(/\\/g, '/');

  // 테스트/설정/타입 파일 제외
  if (/\.(test|spec)\.(ts|tsx)$/.test(normalized)) return [];
  if (/tests\//.test(normalized)) return [];
  if (/\.d\.ts$/.test(normalized)) return [];
  if (/\/types\//.test(normalized)) return [];
  if (/\.config\.(ts|js)$/.test(normalized)) return [];
  if (/\/db\//.test(normalized)) return [];
  if (/\.claude\//.test(normalized)) return [];
  if (/components\/ui\//.test(normalized)) return [];

  // 1. 파일 크기 검사 (과다 책임의 가장 직관적 신호)
  const lineCount = content.split('\n').length;
  if (lineCount > 300) {
    violations.push({
      severity: lineCount > 500 ? 'critical' : 'high',
      type: 'Large Module',
      message: `${lineCount}줄 — 변경 이유가 여러 가지일 가능성 높음`,
      hint: '변경 이유(reason to change)별로 파일 분리'
    });
  }

  // 2. Service 파일: public 메서드 수 검사 (과다 책임)
  if (/\.service\.ts$/.test(normalized)) {
    const publicMethods = content.match(/^\s+(async\s+)?(?!constructor|private|protected)\w+\s*\([^)]*\)\s*[:{]/gm) || [];
    if (publicMethods.length > 6) {
      violations.push({
        severity: 'high',
        type: 'God Service',
        message: `public 메서드 ${publicMethods.length}개 — 여러 actor의 유즈케이스 혼합 가능성`,
        hint: 'actor별 또는 Query/Command별 Service 분리'
      });
    }
  }

  // 3. Route 파일: HTTP 메서드 수 검사
  if (/\/route\.ts$/.test(normalized)) {
    const httpMethods = content.match(/export\s+(async\s+)?function\s+(GET|POST|PUT|PATCH|DELETE)\b/g) || [];
    if (httpMethods.length >= 4) {
      violations.push({
        severity: 'medium',
        type: 'Multi-Method Route',
        message: `HTTP 메서드 ${httpMethods.length}개 — 서로 다른 actor의 엔드포인트 혼합 가능성`,
        hint: '연관성 낮은 메서드는 별도 route로 분리'
      });
    }
  }

  // 4. Component 파일: 혼합 관심사 검사
  if (/\.tsx$/.test(normalized) && /components\//.test(normalized)) {
    const hasFetch = /useQuery|useMutation|fetch\(/.test(content);
    const hasForm = /useForm|handleSubmit/.test(content);
    const hasComplexUI = (content.match(/return\s*\(/g) || []).length > 0
      && content.split('\n').length > 200;

    if (hasFetch && hasForm && hasComplexUI) {
      violations.push({
        severity: 'medium',
        type: 'Mixed Concerns Component',
        message: '데이터 페칭 + 폼 로직 + 복잡한 UI가 한 컴포넌트에 혼합',
        hint: '컨테이너/프레젠테이션 분리 또는 커스텀 훅 추출'
      });
    }
  }

  return violations;
}

// ─── OCP 검사 ───────────────────────────────────────────

function checkOCP(filePath, content) {
  const violations = [];
  const normalized = filePath.replace(/\\/g, '/');

  // 테스트/설정/타입 파일 제외
  if (/\.(test|spec)\.(ts|tsx)$/.test(normalized)) return [];
  if (/tests\//.test(normalized)) return [];
  if (/\.d\.ts$/.test(normalized)) return [];
  if (/\/types\//.test(normalized)) return [];
  if (/\.config\.(ts|js)$/.test(normalized)) return [];
  if (/\/db\//.test(normalized)) return [];
  if (/\.claude\//.test(normalized)) return [];
  if (/components\/ui\//.test(normalized)) return [];

  // 1. switch 분기 폭발 검사
  const switchBlocks = content.match(/switch\s*\([^)]+\)\s*\{[^}]*\}/gs) || [];
  for (const block of switchBlocks) {
    const caseCount = (block.match(/\bcase\s+/g) || []).length;
    if (caseCount >= 5) {
      violations.push({
        severity: 'critical',
        type: 'Switch Explosion',
        message: `switch문에 case ${caseCount}개 — 새 타입 추가 시 기존 코드 수정 필요`,
        hint: 'Record<string, T> 맵 또는 전략 패턴으로 확장 가능하게 변경'
      });
    } else if (caseCount >= 4) {
      violations.push({
        severity: 'high',
        type: 'Switch Growth',
        message: `switch문에 case ${caseCount}개 — 확장 비용 증가 중`,
        hint: '맵 기반으로 전환 고려'
      });
    }
  }

  // 2. if-else 타입/상태 분기 체인 검사
  const ifElseChains = content.match(/if\s*\([^)]*(?:type|status|kind|category)\s*[!=]==?\s*['"][^'"]+['"]/g) || [];
  if (ifElseChains.length >= 4) {
    violations.push({
      severity: 'high',
      type: 'Type Conditional Chain',
      message: `타입/상태 기반 if-else 분기 ${ifElseChains.length}회 — 새 타입 추가 시 모든 분기 수정 필요`,
      hint: '전략 패턴 또는 도메인 모델 다형성으로 분기 제거'
    });
  } else if (ifElseChains.length >= 3) {
    violations.push({
      severity: 'medium',
      type: 'Type Conditional',
      message: `타입/상태 기반 if-else 분기 ${ifElseChains.length}회`,
      hint: '분기가 더 늘어나면 전략 패턴 고려'
    });
  }

  // 3. 의존성 방향 역전 검사 (높은 수준 → 낮은 수준 직접 의존)
  // Domain이 Route/HTTP 관심사에 의존
  if (/server\/.+\/domain\//.test(normalized)) {
    if (/import\s+.*from\s+['"].*\/route/.test(content)
      || /import\s+.*from\s+['"]next\/server['"]/.test(content)
      || /import\s+.*from\s+['"]zod['"]/.test(content)) {
      violations.push({
        severity: 'critical',
        type: 'Dependency Direction Violation',
        message: 'Domain 모듈이 Route/HTTP/Zod에 의존 — 보호 계층 역전',
        hint: 'Domain은 가장 안쪽 레이어. 외부 의존성 제거'
      });
    }
  }

  // Service가 구체 Repository 구현이 아닌 DB에 직접 의존
  if (/\.service\.ts$/.test(normalized)) {
    if (/import\s+.*from\s+['"](@\/)?db(\/.*)?['"]/.test(content)) {
      violations.push({
        severity: 'high',
        type: 'Dependency Direction Violation',
        message: 'Service가 DB에 직접 의존 — Repository 추상화 우회',
        hint: 'Repository를 통해 접근. Service는 DB 구현에 닫혀있어야 함'
      });
    }
  }

  return violations;
}

// ─── LSP 검사 ───────────────────────────────────────────

function checkLSP(filePath, content) {
  const violations = [];
  const normalized = filePath.replace(/\\/g, '/');

  // 테스트/설정/타입/UI 파일 제외
  if (/\.(test|spec)\.(ts|tsx)$/.test(normalized)) return [];
  if (/tests\//.test(normalized)) return [];
  if (/\.d\.ts$/.test(normalized)) return [];
  if (/\/types\//.test(normalized)) return [];
  if (/\.config\.(ts|js)$/.test(normalized)) return [];
  if (/\/db\//.test(normalized)) return [];
  if (/\.claude\//.test(normalized)) return [];
  if (/components\/ui\//.test(normalized)) return [];

  // 1. 구현별 특수 케이스 (if type/provider/gateway === '...')
  //    책의 "Acme 택시" 패턴: 호출측에서 구현 타입을 하드코딩
  const specialCases = content.match(
    /if\s*\([^)]*(?:\.type|\.provider|\.gateway|\.source|\.platform)\s*[!=]==?\s*['"][^'"]+['"]/g
  ) || [];
  if (specialCases.length >= 3) {
    violations.push({
      severity: 'critical',
      type: 'Implementation Special Case',
      message: `구현 타입별 특수 분기 ${specialCases.length}회 — 새 구현 추가 시 호출측 수정 필요`,
      hint: '통일된 인터페이스로 차이를 구현 내부에서 흡수'
    });
  } else if (specialCases.length >= 2) {
    violations.push({
      severity: 'high',
      type: 'Implementation Special Case',
      message: `구현 타입별 특수 분기 ${specialCases.length}회`,
      hint: '인터페이스 계약을 통일하거나 전략 패턴 적용'
    });
  }

  // 2. Service 에러 처리 불일치: null 반환 vs throw 혼용
  if (/\.service\.ts$/.test(normalized)) {
    const hasNullReturn = /return\s+null\b/.test(content);
    const hasOrElseThrow = /orElseThrow/.test(content);
    const hasDirectThrow = /throw\s+new\s+\w*(?:NotFound|Error)/.test(content);

    if (hasNullReturn && (hasOrElseThrow || hasDirectThrow)) {
      violations.push({
        severity: 'high',
        type: 'Error Handling Inconsistency',
        message: '같은 Service 내에서 null 반환과 throw를 혼용 — 호출측에 분기 강제',
        hint: 'orElseThrow 패턴으로 통일. 없으면 항상 throw, 호출측은 try-catch만'
      });
    }
  }

  // 3. Route 응답 형식 불일치: NextResponse.json 직접 호출 + withErrorHandler 혼용
  if (/\/route\.ts$/.test(normalized)) {
    const hasWithErrorHandler = /withErrorHandler/.test(content);
    const hasDirectJson = /NextResponse\.json\(/.test(content);

    // withErrorHandler를 쓰면서 직접 NextResponse.json도 쓰면 응답 형식 불일치
    if (hasWithErrorHandler && hasDirectJson) {
      const directJsonCount = (content.match(/NextResponse\.json\(/g) || []).length;
      if (directJsonCount >= 2) {
        violations.push({
          severity: 'medium',
          type: 'Response Format Inconsistency',
          message: `withErrorHandler와 NextResponse.json 직접 호출 혼용 (${directJsonCount}회) — 응답 구조 불일치`,
          hint: 'withErrorHandler로 통일. 프론트가 일관된 형식을 기대할 수 있게'
        });
      }
    }
  }

  return violations;
}

// ─── Component Principles 검사 (CCP/ADP/SDP) ───────────

function checkComponent(filePath, content) {
  const violations = [];
  const normalized = filePath.replace(/\\/g, '/');

  // server/ 내부 파일만 검사
  if (!/server\//.test(normalized)) return [];
  // 테스트/설정 제외
  if (/\.(test|spec)\.(ts|tsx)$/.test(normalized)) return [];
  if (/tests\//.test(normalized)) return [];
  if (/\.claude\//.test(normalized)) return [];

  // 현재 파일의 도메인 추출: server/{domain}/...
  const domainMatch = normalized.match(/server\/([^/]+)\//);
  if (!domainMatch) return [];
  const currentDomain = domainMatch[1];

  // import문에서 다른 server/ 도메인 참조 추출
  const serverImports = content.match(/import\s+.*from\s+['"](?:@\/)?server\/([^/'"]+)/g) || [];
  const importedDomains = new Set();

  for (const imp of serverImports) {
    const match = imp.match(/server\/([^/'"]+)/);
    if (match && match[1] !== currentDomain) {
      importedDomains.add(match[1]);
    }
  }

  // 1. 도메인 간 직접 결합 (ADP 위반 위험)
  if (importedDomains.size >= 3) {
    violations.push({
      severity: 'critical',
      type: 'Cross-Domain Coupling',
      message: `${currentDomain}/에서 ${importedDomains.size}개 다른 도메인에 의존: ${[...importedDomains].join(', ')}`,
      hint: '도메인 간 결합이 과다. Route에서 조율하거나 공유 모듈 추출'
    });
  } else if (importedDomains.size >= 2) {
    violations.push({
      severity: 'high',
      type: 'Cross-Domain Coupling',
      message: `${currentDomain}/에서 ${[...importedDomains].join(', ')}에 의존`,
      hint: '결합이 증가 추세면 인터페이스 추출 또는 도메인 이벤트 고려'
    });
  } else if (importedDomains.size === 1) {
    // domain/ 레이어에서 다른 도메인을 import하면 더 심각
    if (/\/domain\//.test(normalized)) {
      violations.push({
        severity: 'high',
        type: 'Domain Cross-Reference',
        message: `${currentDomain}/domain/이 ${[...importedDomains][0]}/에 직접 의존 — 도메인 순수성 훼손`,
        hint: '도메인 모델은 자기 도메인만 참조. 다른 도메인 데이터는 Service에서 조합'
      });
    }
  }

  return violations;
}

// ─── DIP 검사 ───────────────────────────────────────────

function checkDIP(filePath, content) {
  const violations = [];
  const normalized = filePath.replace(/\\/g, '/');

  // 테스트/설정/타입/UI/DB 파일 제외 (DB는 concrete component로 허용)
  if (/\.(test|spec)\.(ts|tsx)$/.test(normalized)) return [];
  if (/tests\//.test(normalized)) return [];
  if (/\.d\.ts$/.test(normalized)) return [];
  if (/\/types\//.test(normalized)) return [];
  if (/\.config\.(ts|js)$/.test(normalized)) return [];
  if (/\/db\//.test(normalized)) return [];
  if (/\.claude\//.test(normalized)) return [];
  if (/components\/ui\//.test(normalized)) return [];

  // Route는 concrete component → DIP 위반 허용 (의존성 조립 역할)
  if (/\/route\.ts$/.test(normalized)) return [];
  // Repository 구현은 concrete component → drizzle 의존 허용
  if (/\.repository\.ts$/.test(normalized)) return [];

  // 1. Domain이 외부 프레임워크에 의존 (가장 심각)
  if (/server\/.+\/domain\//.test(normalized)) {
    const frameworkImports = [];
    if (/import\s+.*from\s+['"]zod['"]/.test(content)) frameworkImports.push('zod');
    if (/import\s+.*from\s+['"]drizzle-orm/.test(content)) frameworkImports.push('drizzle-orm');
    if (/import\s+.*from\s+['"]next\//.test(content)) frameworkImports.push('next');
    if (/import\s+.*from\s+['"](@\/)?db(\/.*)?['"]/.test(content)) frameworkImports.push('@/db');

    if (frameworkImports.length > 0) {
      violations.push({
        severity: 'critical',
        type: 'Domain → Framework',
        message: `Domain이 구체 프레임워크에 의존: ${frameworkImports.join(', ')}`,
        hint: 'Domain은 순수 TypeScript만. 외부 의존성을 Repository/Route로 밀어내라'
      });
    }
  }

  // 2. Service가 변동성 높은 구체에 의존
  if (/\.service\.ts$/.test(normalized)) {
    const volatileDeps = [];
    if (/import\s+.*from\s+['"](@\/)?db(\/.*)?['"]/.test(content)) volatileDeps.push('@/db (스키마)');
    if (/import\s+.*from\s+['"]drizzle-orm/.test(content)) volatileDeps.push('drizzle-orm');
    if (/import\s+.*from\s+['"]next\/server['"]/.test(content)) volatileDeps.push('next/server');
    if (/import\s+.*from\s+['"]zod['"]/.test(content)) volatileDeps.push('zod');

    if (volatileDeps.length > 0) {
      violations.push({
        severity: 'high',
        type: 'Service → Concrete',
        message: `Service가 변동성 높은 구체에 의존: ${volatileDeps.join(', ')}`,
        hint: 'Repository가 DB 접근 담당, Route가 HTTP 담당. Service는 도메인 타입만 사용'
      });
    }
  }

  // 3. 컴포넌트가 server/ 모듈에 직접 의존 (프론트→백엔드 경계 위반)
  if (/\.tsx$/.test(normalized) && /components\//.test(normalized)) {
    if (/import\s+.*from\s+['"](@\/)?server\//.test(content)) {
      violations.push({
        severity: 'high',
        type: 'Component → Server',
        message: '프론트 컴포넌트가 server/ 모듈에 직접 의존 — 아키텍처 경계 위반',
        hint: 'API를 통해 통신. hooks/에서 fetch하고 컴포넌트에 전달'
      });
    }
  }

  return violations;
}

// ─── ISP 검사 ───────────────────────────────────────────

function checkISP(filePath, content) {
  const violations = [];
  const normalized = filePath.replace(/\\/g, '/');

  // 테스트/설정/타입/UI 파일 제외
  if (/\.(test|spec)\.(ts|tsx)$/.test(normalized)) return [];
  if (/tests\//.test(normalized)) return [];
  if (/\.d\.ts$/.test(normalized)) return [];
  if (/\.config\.(ts|js)$/.test(normalized)) return [];
  if (/\/db\//.test(normalized)) return [];
  if (/\.claude\//.test(normalized)) return [];
  if (/components\/ui\//.test(normalized)) return [];

  // 1. 컴포넌트 God Props 검사
  if (/\.tsx$/.test(normalized) && /components\//.test(normalized)) {
    // Props 인터페이스에서 필드 수 추정
    const propsMatch = content.match(/(?:interface|type)\s+\w*Props\s*[={][^}]*\}/s);
    if (propsMatch) {
      const propsFields = (propsMatch[0].match(/\w+\s*[?:]?\s*:/g) || []).length;
      if (propsFields > 12) {
        violations.push({
          severity: 'high',
          type: 'God Props',
          message: `Props 필드 ${propsFields}개 — 컴포넌트가 필요 이상을 요구`,
          hint: '필요한 필드만 개별 Props로 받거나, 관심사별 Props 타입 분리'
        });
      }
    }
  }

  // 2. 거대 타입 import 검사: 한 파일에서 같은 타입 모듈의 import가 과다
  const importLines = content.match(/^import\s+.*from\s+['"].*['"]/gm) || [];
  if (importLines.length > 15) {
    violations.push({
      severity: 'medium',
      type: 'Heavy Import',
      message: `import문 ${importLines.length}개 — 필요 이상의 모듈에 의존`,
      hint: '실제 사용하는 것만 import하고, 배럴(index.ts) 대신 직접 경로 사용'
    });
  }

  // 3. Service public 메서드 과다 (CQRS 미적용 = 인터페이스 비대)
  if (/\.service\.ts$/.test(normalized)) {
    const publicMethods = content.match(/^\s+(async\s+)?(?!constructor|private|protected|get\s|set\s)\w+\s*\([^)]*\)\s*[:{]/gm) || [];
    if (publicMethods.length > 8) {
      violations.push({
        severity: 'high',
        type: 'Fat Service Interface',
        message: `public 메서드 ${publicMethods.length}개 — 호출측이 사용하지 않는 메서드에도 의존`,
        hint: 'QueryService / CommandService로 분리 (CQRS)'
      });
    }
  }

  return violations;
}

// ─── Edit Log 읽기 ──────────────────────────────────────

function readEditLog() {
  try {
    if (!fs.existsSync(EDIT_LOG_PATH)) return [];
    const content = fs.readFileSync(EDIT_LOG_PATH, 'utf8');
    return content.trim().split('\n').filter(Boolean).map(line => {
      try { return JSON.parse(line); } catch { return null; }
    }).filter(Boolean);
  } catch {
    return [];
  }
}

// ─── 메인 ────────────────────────────────────────────────

async function main() {
  try {
    let inputData = '';
    for await (const chunk of process.stdin) {
      inputData += chunk;
    }

    const editedFiles = readEditLog();
    if (editedFiles.length === 0) {
      process.exit(0);
    }

    // 중복 제거
    const uniquePaths = [...new Set(editedFiles.map(e => e.filePath))];

    // .ts/.tsx 파일만
    const targetFiles = uniquePaths.filter(f =>
      f.endsWith('.ts') || f.endsWith('.tsx')
    );

    if (targetFiles.length === 0) {
      process.exit(0);
    }

    // 각 파일에 대해 모든 원칙 검사
    const allViolations = [];

    for (const filePath of targetFiles) {
      const absolutePath = path.isAbsolute(filePath) ? filePath : path.join(PROJECT_ROOT, filePath);
      if (!fs.existsSync(absolutePath)) continue;

      const content = fs.readFileSync(absolutePath, 'utf8');

      for (const principle of principles) {
        const violations = principle.check(filePath, content);
        for (const v of violations) {
          allViolations.push({
            ...v,
            principle: principle.name,
            file: path.basename(filePath)
          });
        }
      }
    }

    if (allViolations.length === 0) {
      process.exit(0);
    }

    // 리포트 생성
    const severityIcon = { critical: '🔴', high: '🟠', medium: '🟡' };
    const criticalCount = allViolations.filter(v => v.severity === 'critical').length;
    const highCount = allViolations.filter(v => v.severity === 'high').length;
    const mediumCount = allViolations.filter(v => v.severity === 'medium').length;

    const lines = [
      '',
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      '📐 SOLID REVIEW',
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      `검사 파일: ${targetFiles.length}개`,
      '',
    ];

    for (const v of allViolations) {
      const icon = severityIcon[v.severity] || '⚪';
      lines.push(`${icon} [${v.principle}] ${v.file} — ${v.type}`);
      lines.push(`   ${v.message}`);
      lines.push(`   💡 ${v.hint}`);
      lines.push('');
    }

    lines.push(`요약: 🔴 ${criticalCount} / 🟠 ${highCount} / 🟡 ${mediumCount}`);
    lines.push('');
    lines.push('상세: /srp-review /ocp-review /lsp-review /isp-review /dip-review /component-review');
    lines.push('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    lines.push('');

    process.stderr.write(lines.join('\n'));
    process.exit(0);
  } catch (error) {
    process.exit(0);
  }
}

main();
