#!/usr/bin/env node

/**
 * Skill Activator Hook (UserPromptSubmit)
 *
 * 사용자 프롬프트를 분석하여 관련 skill을 Claude에게 알려줍니다.
 * - 키워드 매칭
 * - Intent Pattern 매칭 (정규식)
 */

const fs = require('fs');
const path = require('path');

const SKILL_RULES_PATH = path.join(__dirname, '../skill-rules.json');

function loadSkillRules() {
  try {
    const content = fs.readFileSync(SKILL_RULES_PATH, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    return {};
  }
}

function detectSkills(input, skillRules) {
  const inputLower = input.toLowerCase();
  const matchedSkills = [];

  for (const [name, rule] of Object.entries(skillRules)) {
    let matched = false;
    let matchType = '';

    const keywords = rule.promptTriggers?.keywords || [];
    const keywordMatch = keywords.some(kw => inputLower.includes(kw.toLowerCase()));

    if (keywordMatch) {
      matched = true;
      matchType = 'keyword';
    }

    if (!matched) {
      const intentPatterns = rule.promptTriggers?.intentPatterns || [];
      for (const pattern of intentPatterns) {
        try {
          const regex = new RegExp(pattern, 'i');
          if (regex.test(input)) {
            matched = true;
            matchType = 'intent';
            break;
          }
        } catch (e) {
          // 잘못된 정규식 무시
        }
      }
    }

    if (matched) {
      matchedSkills.push({
        name,
        description: rule.description || name,
        skill: rule.skill,
        matchType
      });
    }
  }

  return matchedSkills;
}

async function main() {
  try {
    let inputData = '';
    for await (const chunk of process.stdin) {
      inputData += chunk;
    }

    const parsed = JSON.parse(inputData);
    const prompt = parsed.prompt || '';

    const skillRules = loadSkillRules();
    const matchedSkills = detectSkills(prompt, skillRules);

    if (matchedSkills.length > 0) {
      const skillList = matchedSkills
        .map(s => `  📌 ${s.name}\n     └─ ${s.skill}`)
        .join('\n');

      const lines = [
        '',
        '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
        '🎯 SKILL ACTIVATION',
        '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
        `감지된 Skills:\n${skillList}`,
        '',
        '💡 작업 전 위 skill 파일을 읽어주세요.',
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
