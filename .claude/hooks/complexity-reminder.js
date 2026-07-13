#!/usr/bin/env node

/**
 * Test-First Refactoring & Complexity Reminder Hook (UserPromptSubmit)
 *
 * 리팩토링 작업 시 다음을 상기시킵니다:
 * 1. 테스트 먼저 작성 (Test-First Refactoring)
 *    - Before 체크리스트 → 테스트 작성 → 프로덕션 코드 리팩토링
 * 2. 불필요한 복잡성 제거
 *    - Map/배열 중복 생성 체크
 *    - 불필요한 추상화 체크
 *    - 성능 최적화 기회 체크
 */

async function main() {
  try {
    let inputData = '';
    for await (const chunk of process.stdin) {
      inputData += chunk;
    }

    const parsed = JSON.parse(inputData);
    const prompt = parsed.prompt || '';
    const promptLower = prompt.toLowerCase();

    const refactoringKeywords = [
      'refactor', '리팩토링', '리팩터', 'restructure',
      '/refactor', '/refactor-pipeline'
    ];

    const isRefactoring = refactoringKeywords.some(kw =>
      promptLower.includes(kw.toLowerCase())
    );

    if (isRefactoring) {
      const lines = [
        '',
        '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
        '🚨 TEST-FIRST REFACTORING REMINDER',
        '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
        '',
        '⚠️  프로덕션 코드를 먼저 리팩토링하지 마세요!',
        '',
        '✅ 올바른 순서:',
        '   1. Before 체크리스트 작성',
        '   2. Domain Service 단위 테스트 작성',
        '   3. Service Layer 단위 테스트 작성',
        '   4. Route Integration 테스트 작성',
        '   5. 테스트 실행 (실패 확인)',
        '   6. 프로덕션 코드 리팩토링 (테스트 통과)',
        '   7. After 체크리스트 검증',
        '',
        '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
        '🧹 COMPLEXITY CHECK',
        '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
        '프로덕션 코드 작성 시 아래 항목을 체크하세요:',
        '',
        '❓ Map/배열을 2번 이상 생성하고 있나요?',
        '   → 한 번의 순회로 처리 가능한지 확인',
        '',
        '❓ 배열을 여러 번 필터링하고 있나요?',
        '   → for loop로 한 번에 처리 가능한지 확인',
        '',
        '❓ 추상화가 실제로 가치를 더하나요?',
        '   → 간단한 for loop가 더 명확하지 않은지 확인',
        '',
        '❓ 불필요한 중간 변수가 있나요?',
        '   → 직접 사용 가능한지 확인',
        '',
        '💡 "기존 코드를 그대로 옮기지 말고,',
        '   불필요한 복잡성을 제거하라"',
        '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
        '',
      ];
      process.stderr.write(lines.join('\n'));
    }

    process.exit(0);
  } catch (error) {
    process.exit(0);
  }
}

main();
