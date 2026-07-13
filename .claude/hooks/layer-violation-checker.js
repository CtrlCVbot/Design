#!/usr/bin/env node

/**
 * Layer Violation Checker Hook (PostToolUse)
 *
 * Edit/Write 직후 해당 파일의 레이어 규칙 위반을 즉시 검사합니다.
 * - critical/high 위반: exit 2로 블로킹 → Claude 자동 수정
 * - medium 위반: 경고만 표시 (false positive 가능성 있는 규칙)
 *
 * 규칙 출처: .claude/skills/ 디렉토리의 MD 파일들
 * - layered-architecture.md, domain-modeling.md, refactoring.md
 */

const fs = require('fs');
const path = require('path');

// ─── 레이어 감지 ────────────────────────────────────────

function detectLayer(filePath) {
  const normalized = filePath.replace(/\\/g, '/');

  // auth 파일 감지 (다른 레이어보다 먼저 체크)
  if (/middleware\.ts$/.test(normalized)) return 'auth';
  if (/utils\/jwt\.ts$/.test(normalized)) return 'auth';
  if (/utils\/auth\.ts$/.test(normalized)) return 'auth';
  if (/store\/auth-store\.ts$/.test(normalized)) return 'auth';
  if (/app\/api\/auth\/.*\.ts$/.test(normalized)) return 'auth';
  if (/server\/auth\/.*\.ts$/.test(normalized)) return 'auth';
  if (/components\/auth-initializer\.tsx$/.test(normalized)) return 'auth';

  if (/app\/api\/.+\/route\.ts$/.test(normalized)) return 'route';
  if (/server\/.+\/application\/.+\.service\.ts$/.test(normalized)) return 'service';
  if (/server\/.+\/infrastructure\/.+\.repository\.ts$/.test(normalized)) return 'repository';
  if (/server\/.+\/domain\/.*\.model\.ts$/.test(normalized)) return 'domain';
  if (/store\/(?!__tests__).*\.ts$/.test(normalized)) return 'store';

  return null;
}

// ─── index.ts 생성 감지 (레이어 무관) ────────────────────

function isIndexTsCreation(filePath, toolName) {
  if (toolName !== 'Write') return false;
  const normalized = filePath.replace(/\\/g, '/');
  return /\/index\.ts$/.test(normalized);
}

// ─── 레이어별 규칙 정의 ──────────────────────────────────

const RULES = {
  route: [
    // === 기존 규칙 ===
    {
      name: 'drizzle/db 의존성 금지',
      test: (content) => /import\s+.*from\s+['"](@\/)?db(\/.*)?['"]/.test(content)
        || /import\s+.*from\s+['"]drizzle-orm(\/.*)?['"]/.test(content),
      severity: 'critical',
      message: 'Route Layer에서 drizzle/db 직접 import 금지. Repository를 통해 접근하세요.',
      ref: 'layered-architecture.md > Route Layer > 규칙'
    },
    {
      name: 'Zod 스키마 인라인 정의',
      test: (content) => {
        const match = content.match(/(?:const|let)\s+\w+(?:Schema|schema)\s*=\s*z\.object\(\{[\s\S]*?\}\)/g);
        if (!match) return false;
        return match.some(m => m.length > 200);
      },
      severity: 'high',
      message: 'Zod 스키마는 validation.ts로 분리하세요. route.ts는 import만 수행.',
      ref: 'layered-architecture.md > Route Layer > 스키마 파일 분리'
    },
    {
      name: 'parseRequestBody 로컬 함수',
      test: (content) => /function\s+parseRequestBody/.test(content)
        || /const\s+parseRequestBody\s*=/.test(content),
      severity: 'high',
      message: '별도 parseRequestBody 함수 금지. validateJsonBody(request, schema) 사용하세요.',
      ref: 'layered-architecture.md > Route Layer > 요청 검증'
    },
    // === 추가 규칙 ===
    {
      name: 'request.json() 직접 호출 금지',
      test: (content) => /await\s+request\.json\(\)/.test(content)
        || /request\.json\(\)/.test(content),
      severity: 'high',
      message: 'request.json() 직접 호출 금지. validateJsonBody(request, schema) 사용하세요.',
      ref: 'route-layer.md > 요청 검증 > 공통 유틸 사용'
    },
    {
      name: 'try-catch 직접 사용 금지',
      test: (content) => {
        // withErrorHandler 내부의 try-catch는 허용, route 핸들러 내부 직접 try-catch만 감지
        // export function 내부에 try-catch가 있으면 위반
        const hasTryCatch = /\btry\s*\{/.test(content);
        if (!hasTryCatch) return false;
        // withErrorHandler를 사용하고 있으면 OK (그 안에서의 try-catch일 가능성)
        const usesWithErrorHandler = /withErrorHandler/.test(content);
        // withErrorHandler 없이 try-catch를 쓰고 있으면 위반
        return !usesWithErrorHandler;
      },
      severity: 'high',
      message: 'Route에서 try-catch 직접 사용 금지. withErrorHandler로 Domain Error를 처리하세요.',
      ref: 'layered-architecture.md > Route Layer > Domain Error는 withErrorHandler로 처리'
    },
    {
      name: 'service를 handler 내부에서 생성',
      test: (content) => {
        // export function 내부에서 new XxxService() 패턴 감지
        const lines = content.split('\n');
        let insideHandler = false;
        let braceDepth = 0;
        for (const line of lines) {
          if (/export\s+(async\s+)?function\s+(GET|POST|PUT|PATCH|DELETE)\b/.test(line)) {
            insideHandler = true;
            braceDepth = 0;
          }
          if (insideHandler) {
            braceDepth += (line.match(/\{/g) || []).length;
            braceDepth -= (line.match(/\}/g) || []).length;
            if (/new\s+\w+Service\s*\(/.test(line)) return true;
            if (braceDepth <= 0) insideHandler = false;
          }
        }
        return false;
      },
      severity: 'medium',
      message: 'service 생성은 모듈 최상단 변수로 선언하세요. handler 내부 생성 금지.',
      ref: 'layered-architecture.md > Route Layer > service 생성은 최상단에서 모듈 최상위 변수'
    }
  ],

  service: [
    // === 기존 규칙 (db/schema 패턴 보강) ===
    {
      name: 'drizzle/db 의존성 금지',
      test: (content) => /import\s+.*from\s+['"](@\/)?db(\/.*)?['"]/.test(content)
        || /import\s+.*from\s+['"]drizzle-orm(\/.*)?['"]/.test(content),
      severity: 'critical',
      message: 'Service Layer에서 drizzle/db import 금지. Repository에 위임하세요.',
      ref: 'layered-architecture.md > Service Layer > 규칙'
    },
    {
      name: 'zod 의존성 금지',
      test: (content) => /import\s+.*from\s+['"]zod['"]/.test(content),
      severity: 'critical',
      message: 'Service Layer에서 zod import 금지. 순수 TypeScript interface만 사용.',
      ref: 'layered-architecture.md > Service Layer > 규칙'
    },
    {
      name: '응답 래핑 금지',
      test: (content) => /return\s*\{[\s\S]{0,50}success\s*:/.test(content)
        || /return\s*\{[\s\S]{0,50}data\s*:[\s\S]{0,50}message\s*:/.test(content),
      severity: 'high',
      message: 'Service에서 { success/data/message } 래핑 금지. withErrorHandler가 담당합니다.',
      ref: 'layered-architecture.md > Service Layer > 응답 구조'
    },
    // === 추가 규칙 ===
    {
      name: 'existsById 사용 금지',
      test: (content) => /\.existsById\s*\(/.test(content)
        || /existsById\s*\(/.test(content),
      severity: 'high',
      message: 'existsById + if문 대신 orElseThrow(await repository.findById(id), new NotFoundError(id)) 사용.',
      ref: 'layered-architecture.md > Service Layer > 엔티티 존재 검증'
    },
    {
      name: '상태 전이 직접 수행 금지',
      test: (content) => {
        // repository.update(id, { status: '...' }) 패턴 감지
        // 서비스에서 직접 상태를 변경하면 도메인 모델로 이동해야 함
        return /\.update\s*\([^)]*,\s*\{[^}]*status\s*:/.test(content);
      },
      severity: 'medium',
      message: '서비스에서 status 직접 변경 금지. 도메인 모델의 메서드로 상태 전이를 위임하세요.',
      ref: 'layered-architecture.md > Service Layer > Testability 원칙'
    }
  ],

  repository: [
    {
      name: '전체 컬럼 select',
      test: (content) => /\.select\(\)\s*\.from\(/.test(content),
      severity: 'high',
      message: 'select() 대신 필요한 컬럼만 명시적으로 select({ ... })하세요.',
      ref: 'layered-architecture.md > Repository Layer > 규칙'
    }
  ],

  store: [
    {
      name: 'Store 내 API 호출 금지',
      test: (content) => {
        // async 함수 내부에서 await + API 패턴 감지
        // fetch, axios, get/post/put/delete + API service 호출
        const hasAsyncAction = /async\s*\([^)]*\)\s*(?::\s*Promise[^{]*)?\s*=>\s*\{/.test(content)
          || /async\s+\w+\s*\([^)]*\)\s*(?::\s*Promise[^{]*)?\s*\{/.test(content);
        if (!hasAsyncAction) return false;
        // store create 내부에서 fetch/axios/service 호출
        const hasApiCall = /await\s+(?:fetch|axios|get|post|put|patch|delete)\w*\s*\(/.test(content)
          || /await\s+\w+Service\.\w+\s*\(/.test(content)
          || /await\s+\w+(?:ByOrderId|ById|Items|Bundles|List)\s*\(/.test(content);
        return hasApiCall;
      },
      severity: 'high',
      message: 'Store에 API 호출 금지. 서버 데이터는 React Query로 관리하세요.',
      ref: 'docs/standards/zustand.md > Avoid > Store에 API 호출 넣지 않는다'
    },
    {
      name: 'Store 전체 구독 (selector 미사용)',
      test: (content) => {
        // export 시 raw store를 그대로 export하는 패턴은 허용 (store 파일 자체)
        // 이 규칙은 컴포넌트에서 감지하는 것이 더 적합하므로 store 파일에서는 검사하지 않음
        return false;
      },
      severity: 'medium',
      message: 'Atomic selector로 구독하세요. useStore((s) => s.field) 형태.',
      ref: 'docs/standards/zustand.md > Do > Atomic selector로 구독'
    },
    {
      name: 'Persist에 서버 데이터 포함 의심',
      test: (content) => {
        const hasPersist = /persist\s*\(/.test(content);
        if (!hasPersist) return false;
        // partialize가 없으면 전체 persist → 서버 데이터 포함 가능성
        const hasPartialize = /partialize/.test(content);
        // persist가 있는데 partialize가 없으면 경고
        return !hasPartialize;
      },
      severity: 'medium',
      message: 'persist 사용 시 partialize로 UI 상태만 저장하세요. 서버 데이터 persist 금지.',
      ref: 'docs/standards/zustand.md > Avoid > Persist에 서버 데이터를 넣지 않는다'
    }
  ],

  auth: [
    {
      name: '비밀번호 평문 비교 금지',
      test: (content) => {
        // command.password !== user.password 또는 password === 등 평문 비교 감지
        // bcrypt.compare 사용은 허용
        const hasPlainCompare = /(?:command|body|input|req|data)\.\s*password\s*[!=]==?\s*(?:user|record|found|row)\.\s*password/.test(content)
          || /(?:user|record|found|row)\.\s*password\s*[!=]==?\s*(?:command|body|input|req|data)\.\s*password/.test(content);
        return hasPlainCompare;
      },
      severity: 'critical',
      message: '비밀번호 평문 비교 금지. bcrypt.compare()를 사용하세요.',
      ref: 'docs/standards/auth/06-security-rules.md > R6'
    },
    {
      name: 'Access Token을 localStorage/Zustand에 저장 금지',
      test: (content, filePath) => {
        const normalized = filePath.replace(/\\/g, '/');
        // auth-store에서 token 필드를 persist하는 패턴 감지
        if (/store\/auth-store/.test(normalized)) {
          const hasTokenInState = /token\s*:\s*(?:string|null)/.test(content);
          const hasPersist = /persist\s*\(/.test(content);
          // persist하면서 token 필드가 있으면 경고
          return hasTokenInState && hasPersist;
        }
        return false;
      },
      severity: 'high',
      message: 'Access Token을 클라이언트 스토리지에 persist 금지. httpOnly 쿠키만 사용하세요.',
      ref: 'docs/standards/auth/06-security-rules.md > R3'
    },
    {
      name: '인증 에러에서 사용자 존재 여부 노출 금지',
      test: (content) => {
        // "등록되지 않은 이메일", "이메일이 존재하지 않", "사용자를 찾을 수 없" 등 구체적 에러 메시지
        return /['"`].*등록되지 않은.*이메일.*['"`]/.test(content)
          || /['"`].*비밀번호가 일치하지.*['"`]/.test(content)
          || /['"`].*email.*not.*found.*['"`]/i.test(content)
          || /['"`].*invalid.*password.*['"`]/i.test(content);
      },
      severity: 'high',
      message: '인증 실패 시 구체적 에러 메시지 금지. "이메일 또는 비밀번호가 올바르지 않습니다"로 통일하세요.',
      ref: 'docs/standards/auth/06-security-rules.md > R8'
    },
    {
      name: 'GET 메서드로 로그아웃 금지',
      test: (content, filePath) => {
        const normalized = filePath.replace(/\\/g, '/');
        if (!/auth\/logout/.test(normalized)) return false;
        return /export\s+(async\s+)?function\s+GET/.test(content);
      },
      severity: 'high',
      message: 'GET 로그아웃 금지. CSRF/프리페치로 의도치 않은 로그아웃 발생 가능. POST만 허용.',
      ref: 'docs/standards/auth/06-security-rules.md > R10'
    },
    {
      name: '클라이언트에서 x-user-* 헤더 직접 전송 금지',
      test: (content, filePath) => {
        const normalized = filePath.replace(/\\/g, '/');
        // api-client 또는 utils/auth에서 x-user-* 헤더 설정 감지
        if (!/utils\/api-client|utils\/auth/.test(normalized)) return false;
        return /headers\[['"]x-user-(id|seq|name|email|access-level|company-id)['"]\]\s*=/.test(content);
      },
      severity: 'high',
      message: '클라이언트에서 x-user-* 헤더 직접 전송 금지. 미들웨어가 쿠키 기반으로 주입합니다.',
      ref: 'docs/standards/auth/06-security-rules.md > R2'
    }
  ],

  domain: [
    {
      name: '도메인 모델에 id 값 금지',
      test: (content) => {
        // constructor 파라미터에 id가 있거나, private/readonly id 필드가 있는 경우
        // 단, _id (내부 변수)는 허용하지 않음 — DB 관심사인 id 자체를 가지면 안됨
        const hasIdInConstructor = /constructor\s*\([^)]*\bid\s*[:?]/.test(content);
        const hasIdField = /(?:private|readonly|public)\s+(?:readonly\s+)?id\s*[:=]/.test(content);
        return hasIdInConstructor || hasIdField;
      },
      severity: 'high',
      message: '도메인 모델에 id 필드 금지. id는 DB 관심사이므로 도메인 모델에서 제거하세요.',
      ref: 'domain-modeling.md > Domain Model > 도메인 모델은 id 값을 가지지 않는다'
    }
  ]
};

// ─── 메인 ────────────────────────────────────────────────

async function main() {
  try {
    let inputData = '';
    for await (const chunk of process.stdin) {
      inputData += chunk;
    }

    const parsed = JSON.parse(inputData);
    const toolUse = parsed.tool_use || parsed;
    const toolName = toolUse.tool_name || parsed.tool_name || '';
    const toolInput = toolUse.tool_input || parsed.tool_input || {};
    const filePath = toolInput.file_path || '';

    if (!filePath || !filePath.endsWith('.ts')) {
      process.exit(0);
    }

    // ─── index.ts 생성 감지 (레이어 무관) ───
    if (isIndexTsCreation(filePath, toolName)) {
      const lines = [];
      lines.push('');
      lines.push('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      lines.push('🟠 index.ts 생성 감지');
      lines.push('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      lines.push('index.ts는 무조건 생성 금지. 필요성 판단 후 생성하세요.');
      lines.push('  필요: 여러 곳에서 import, 내부 구조 숨기기');
      lines.push('  불필요: 단일 route에서만 사용, 작은 모듈');
      lines.push('참조: layered-architecture.md > index.ts (모듈 진입점)');
      lines.push('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      lines.push('');
      process.stderr.write(lines.join('\n'));
      process.exit(2);
    }

    // ─── 레이어별 규칙 검사 ───
    const layer = detectLayer(filePath);
    if (!layer) {
      process.exit(0);
    }

    const absolutePath = path.isAbsolute(filePath) ? filePath : path.resolve(filePath);
    if (!fs.existsSync(absolutePath)) {
      process.exit(0);
    }

    const content = fs.readFileSync(absolutePath, 'utf8');
    const rules = RULES[layer] || [];
    const violations = [];

    for (const rule of rules) {
      if (rule.test(content, filePath)) {
        violations.push(rule);
      }
    }

    if (violations.length === 0) {
      process.exit(0);
    }

    // critical/high 위반이 있는지 확인
    const hasBlocking = violations.some(v => v.severity === 'critical' || v.severity === 'high');

    const fileName = path.basename(filePath);
    const layerName = layer.charAt(0).toUpperCase() + layer.slice(1);
    const severityIcon = { critical: '🔴', high: '🟠', medium: '🟡' };

    const lines = [];
    lines.push('');
    lines.push('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    lines.push(`⚠️  LAYER VIOLATION (${layerName} Layer)`);
    lines.push('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    lines.push(`파일: ${fileName}`);
    lines.push('');

    for (const v of violations) {
      const icon = severityIcon[v.severity] || '⚪';
      lines.push(`${icon} ${v.name}`);
      lines.push(`   → ${v.message}`);
      lines.push(`   참조: ${v.ref}`);
      lines.push('');
    }

    if (hasBlocking) {
      // critical/high → exit 2 (블로킹)
      lines.push('이 위반을 수정한 후 다시 Edit/Write하세요.');
      lines.push('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      lines.push('');
      process.stderr.write(lines.join('\n'));
      process.exit(2);
    } else {
      // medium만 → exit 0 (경고만, 진행 허용)
      lines.push('⚠️  위 항목을 확인해주세요 (경고, 진행은 허용)');
      lines.push('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      lines.push('');
      process.stdout.write(JSON.stringify({
        additionalContext: lines.join('\n')
      }));
      process.exit(0);
    }
  } catch (error) {
    process.exit(0);
  }
}

main();
