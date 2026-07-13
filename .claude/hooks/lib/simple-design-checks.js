/**
 * Simple Design Checks (Library)
 *
 * Kent Beck 4규칙 중 패턴 매칭 가능한 위반들의 검사 함수.
 * simple-design-reviewer.js (Stop, deprecated) 와
 * simple-design-precommit.js (PreToolUse Bash) 가 공유.
 *
 * 의미적 분석은 /simple-design-review skill 이 담당.
 */

// ─── 검사 대상 / 예외 ────────────────────────────────────

function isTarget(filePath) {
  const normalized = filePath.replace(/\\/g, '/');
  if (!/\.(ts|tsx)$/.test(normalized)) return false;
  if (/\.(test|spec)\.(ts|tsx)$/.test(normalized)) return false;
  if (/tests\//.test(normalized)) return false;
  if (/__tests__\//.test(normalized)) return false;
  if (/\.d\.ts$/.test(normalized)) return false;
  if (/\/types\//.test(normalized)) return false;
  if (/\.config\.(ts|js)$/.test(normalized)) return false;
  if (/\/db\//.test(normalized)) return false;
  if (/\/scripts\//.test(normalized)) return false;
  if (/\.claude\//.test(normalized)) return false;
  if (/components\/ui\//.test(normalized)) return false;
  if (/\/index\.(ts|tsx)$/.test(normalized)) return false;
  if (/\/(page|layout|loading|error|not-found)\.(ts|tsx)$/.test(normalized)) return false;
  return true;
}

// ─── Rule 2: Reveals Intention ──────────────────────────

function checkRevealsIntention(filePath, content) {
  const violations = [];
  const lines = content.split('\n');

  // 2-1. (DISABLED — 사용자 정책) 함수 안에 4+ 줄 인라인 주석 블록 검사 비활성화.
  // 격리·도메인·회귀 사유 등 non-obvious 컨텍스트는 long comment 가 적절한 경우가 있어,
  // 일괄 violation 처리 대신 코드 리뷰로 판단. 다시 켜려면 아래 블록의 주석을 풀면 됨.
  /*
  let commentBlockStart = -1;
  let commentBlockLines = 0;
  let braceDepth = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const isCommentLine = /^\s*\/\//.test(line);

    if (isCommentLine && braceDepth > 0) {
      if (commentBlockStart === -1) commentBlockStart = i + 1;
      commentBlockLines++;
    } else {
      if (commentBlockLines >= 4) {
        violations.push({
          severity: 'high',
          rule: 'Reveals Intention',
          type: 'Long Inline Comment',
          message: `함수 내부 ${commentBlockLines}줄 인라인 주석 (line ${commentBlockStart}~)`,
          hint: '코드가 의도를 못 드러내서 주석으로 보충 중. 도메인 함수/잘 명명된 변수로 추출 검토.'
        });
      }
      commentBlockStart = -1;
      commentBlockLines = 0;
    }

    braceDepth += (line.match(/\{/g) || []).length;
    braceDepth -= (line.match(/\}/g) || []).length;
    if (braceDepth < 0) braceDepth = 0;
  }
  */

  // 2-2. magic falsy fallback in const/let assignment (변수 할당 한정)
  const fallbacks = content.match(/(?:const|let)\s+\w+\s*=\s*[^;\n]+\|\|\s*(?:''|""|undefined|null|0|false)[\s;,)]/g) || [];
  if (fallbacks.length >= 2) {
    violations.push({
      severity: 'medium',
      rule: 'Reveals Intention',
      type: 'Magic Falsy Fallback',
      message: `|| '' / undefined / 0 같은 fallback 할당 ${fallbacks.length}회`,
      hint: '의도가 가려짐. ?? 로 nullish 명시 또는 if 분기로 의도 드러냄.'
    });
  }

  // 2-3. fan-out boolean: 같은 파일 안 is* boolean 변수 3+ 개
  const boolVars = content.match(/(?:const|let)\s+is[A-Z]\w*\s*=/g) || [];
  if (boolVars.length >= 3) {
    violations.push({
      severity: 'high',
      rule: 'Reveals Intention',
      type: 'Boolean Fan-out',
      message: `is* boolean 변수 ${boolVars.length}개 — 분류 결정이 인라인으로 박힘`,
      hint: '도메인 함수로 추출하여 분류 결정 자체에 이름 부여 검토.'
    });
  }

  return violations;
}

// ─── Rule 3: No Duplication ─────────────────────────────

function checkNoDuplication(filePath, content) {
  const violations = [];

  // 3-1. 동일 magic number 3+ 회 (3자리 이상, 흔한 값 제외)
  const numbers = content.match(/\b\d{3,}\b/g) || [];
  const ignored = new Set(['100', '1000', '200', '404', '401', '403', '500']);
  const numCounts = {};
  for (const n of numbers) {
    if (ignored.has(n)) continue;
    numCounts[n] = (numCounts[n] || 0) + 1;
  }
  for (const [num, count] of Object.entries(numCounts)) {
    if (count >= 3) {
      violations.push({
        severity: 'medium',
        rule: 'No Duplication',
        type: 'Repeated Magic Number',
        message: `숫자 리터럴 "${num}" 이 ${count}회 반복`,
        hint: '의미 있는 상수로 추출.'
      });
    }
  }

  // 3-2. 동일 magic string 4+ 회
  const strings = content.match(/['"][a-z][a-z0-9_-]{3,}['"]/gi) || [];
  const strCounts = {};
  for (const s of strings) {
    strCounts[s] = (strCounts[s] || 0) + 1;
  }
  for (const [str, count] of Object.entries(strCounts)) {
    if (count >= 4) {
      violations.push({
        severity: 'medium',
        rule: 'No Duplication',
        type: 'Repeated Magic String',
        message: `문자열 ${str} 이 ${count}회 반복`,
        hint: '상수 또는 enum 으로 추출.'
      });
    }
  }

  return violations;
}

// ─── Rule 4: Fewest Elements ────────────────────────────

function checkFewestElements(filePath, content) {
  const violations = [];
  const normalized = filePath.replace(/\\/g, '/');

  // 4-1. server/ 코드가 frontend type 직접 import — 임시 비활성화.
  // historical 위반 다수 (~30+ 파일) 가 모든 commit 의 transitive import 영역에 잡혀
  // 다른 fix 진행을 막던 systemic 한계. 별도 layer 리팩토링 PR 로 추적.
  // if (/(^|\/)server\//.test(normalized)) {
  //   const frontendTypeImports = content.match(/import\s+(?:type\s+)?\{[^}]+\}\s+from\s+['"]@\/types\/[^'"]+['"]/g) || [];
  //   if (frontendTypeImports.length > 0) {
  //     violations.push({
  //       severity: 'critical',
  //       rule: 'Fewest Elements',
  //       type: 'Frontend Type Coupling',
  //       message: `server/ 코드가 @/types/ 에서 import (${frontendTypeImports.length}회) — 응답이 frontend 타입에 결합`,
  //       hint: 'application/route 가 응답 계약을 결정해야 함. dto/<x>.response.ts 정의 후 그 타입을 service 가 반환.'
  //     });
  //   }
  // }

  // 4-2. as <Type> cast 3+ 회 — 임시 비활성화.
  // historical 위반 다수가 transitive import 영역 (logishm/dispatch/mapper 등) 에 잡혀
  // 다른 fix 진행을 막던 패턴. frontend-type-coupling 룰과 동일한 systemic 한계.
  // 별도 layer 리팩토링 PR (응답 DTO 정의 + cast 제거) 로 추적.
  // const asCasts = content.match(/\bas\s+[A-Z]\w*(?:<[^>]+>)?(?:\[\])?\b/g) || [];
  // if (asCasts.length >= 3) {
  //   violations.push({
  //     severity: 'high',
  //     rule: 'Fewest Elements',
  //     type: 'Repeated Type Casts',
  //     message: `as <Type> cast ${asCasts.length}회 — 타입 시스템 우회 누적`,
  //     hint: '응답 DTO 또는 도메인 타입을 정확히 정의해 cast 제거.'
  //   });
  // }

  return violations;
}

// ─── Rule 4 보강: 무상태 1:1 wrapper 클래스 ──────────────
//
// private 생성자 + static 팩토리 + 인스턴스 메서드 1개 이하 = 상태·행위 없는 래퍼.
// 한 변환만 하면 순수 함수가 더 정직하다 (예: request→spec 만 하던 CreateSalesBundleCommand).
// 접근자가 여러 개인 정당한 도메인 팩토리(SalesBundleCreationDraft 등)는 메서드 수(>1)로 제외.
// 의미 판단(이름 ceremony / 경계 earns-its-keep)은 /simple-design-review skill 이 담당.

function extractClasses(content) {
  const classes = [];
  const re = /\bclass\s+(\w+)[^{]*\{/g;
  let m;
  while ((m = re.exec(content))) {
    let depth = 1;
    let i = m.index + m[0].length;
    for (; i < content.length && depth > 0; i++) {
      if (content[i] === '{') depth++;
      else if (content[i] === '}') depth--;
    }
    classes.push({ name: m[1], body: content.slice(m.index + m[0].length, i - 1) });
  }
  return classes;
}

function countInstanceMethods(body) {
  // 줄 시작의 (수식어) name(params) [: 반환타입] { 휴리스틱. static/constructor/제어 키워드 제외.
  const methodRe = /(?:^|\n)[ \t]*(?:public\s+|private\s+|protected\s+)?(?:async\s+)?(?:get\s+|set\s+)?(\w+)\s*\([^)]*\)\s*(?::[^;{]+)?\{/g;
  const reserved = new Set(['constructor', 'if', 'for', 'while', 'switch', 'catch', 'function', 'return']);
  let count = 0;
  let m;
  while ((m = methodRe.exec(body))) {
    if (reserved.has(m[1])) continue;
    const lineStart = body.lastIndexOf('\n', m.index) + 1;
    const lineEnd = body.indexOf('\n', m.index + 1);
    const line = body.slice(lineStart, lineEnd === -1 ? body.length : lineEnd);
    if (/\bstatic\b/.test(line)) continue; // static 팩토리/메서드 제외
    count++;
  }
  return count;
}

function checkStatelessWrapperClass(filePath, content) {
  const violations = [];
  for (const { name, body } of extractClasses(content)) {
    // 순수 래퍼는 생성자 본문이 비어있다(raw 입력만 param property 로 저장). 생성자에서 파생/계산하면
    // 상태를 가진 정당한 도메인 모델(예: ShareAvailability)이므로 제외.
    if (!/private\s+constructor\s*\([^)]*\)\s*\{\s*\}/.test(body)) continue;
    if (!/\bstatic\s+\w+\s*\(/.test(body)) continue;
    // 검증/행위가 있는 클래스는 제외: throw 가 있으면 value object 등 정당한 도메인 객체.
    // 무상태 래퍼(Command)는 순수 passthrough 라 throw 가 없다.
    if (/\bthrow\b/.test(body)) continue;
    if (countInstanceMethods(body) <= 1) {
      violations.push({
        severity: 'medium',
        rule: 'Fewest Elements',
        type: 'Stateless 1:1 Wrapper Class',
        message: `${name}: private 생성자 + static 팩토리 + 인스턴스 메서드 1개 이하 — 무상태 래퍼로 보임`,
        hint: '상태·행위 없이 한 변환만 하면 순수 함수가 더 정직함(클래스 ceremony 제거). 접근자 여러 개인 도메인 팩토리면 무시.',
      });
    }
  }
  return violations;
}

// ─── Aggregate ──────────────────────────────────────────

function runChecks(filePath, content) {
  const all = [];
  for (const check of [checkRevealsIntention, checkNoDuplication, checkFewestElements, checkStatelessWrapperClass]) {
    for (const v of check(filePath, content)) {
      all.push(v);
    }
  }
  return all;
}

module.exports = {
  isTarget,
  checkRevealsIntention,
  checkNoDuplication,
  checkFewestElements,
  checkStatelessWrapperClass,
  runChecks,
};
