# /refactor-pipeline - 리팩토링 전체 파이프라인

Route 리팩토링 → SOLID 순차 리뷰 → 검증 → QA → 알림까지 자동화합니다.

---

## 사용법

```
/refactor-pipeline app/api/orders/accept-dispatches/route.ts
```

---

## 파이프라인 흐름

```
┌─────────────────────────────────────────────────────────────┐
│  STEP 0: Git Worktree 생성                                   │
│  mm-broker-worktrees/refactor-{name} 에서 격리 작업            │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  STEP 1: /refactor 실행                                      │
│  Before 체크리스트 → 테스트 작성 → 프로덕션 리팩토링 → After 검증 │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  STEP 2: SOLID 순차 리뷰 + 권장사항 적용                        │
│  SRP → OCP → LSP → ISP → DIP 순차 리뷰, 각 리뷰 후 즉시 반영   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  STEP 3: /verify-all + 권장사항 적용                           │
│  BE + FE + E2E 검증 → 위반/개선 적용                           │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  STEP 4: /qa + 권장사항 적용                                   │
│  탐색적 QA → 버그 수정 / E2E 반영 / 지식 인계                   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  STEP 5: 최종 검증 + 알림                                     │
│  빌드 확인 → 테스트 통과 → 사용자 알림                          │
└─────────────────────────────────────────────────────────────┘
```

---

## 상세 단계

### STEP 0: Git Worktree 생성 및 이동

route 경로에서 이름을 추출하여 **별도 worktree**에서 격리 작업합니다.
main 브랜치를 오염시키지 않고, 작업 중에도 main에서 다른 작업이 가능합니다.

**Worktree 경로 규칙:**
```
C:/Users/USER/Desktop/clone/mm-broker-worktrees/refactor-{route-name}
```

**실행 절차:**

```bash
# 1. 변수 추출
# 예: app/api/orders/accept-dispatches/route.ts → accept-dispatches
ROUTE_NAME=$(basename $(dirname "$ROUTE_PATH"))
BRANCH_NAME="refactor/$ROUTE_NAME"
WORKTREE_PATH="C:/Users/USER/Desktop/clone/mm-broker-worktrees/refactor-$ROUTE_NAME"

# 2. Worktree 생성 (main 기준 새 브랜치)
git worktree add -b "$BRANCH_NAME" "$WORKTREE_PATH" main

# 3. 이후 모든 작업은 worktree 경로에서 수행
cd "$WORKTREE_PATH"
```

**주의사항:**
- 이미 해당 worktree가 있으면 `cd`만 수행
- 이미 해당 브랜치가 있으면 `git worktree add "$WORKTREE_PATH" "$BRANCH_NAME"`
- **STEP 1~5의 모든 파일 읽기/쓰기/빌드/테스트는 worktree 경로 기준**
- `dev/active/refactor-{name}/` 산출물도 worktree 내에 생성
- 완료 후 사용자에게 worktree 경로와 브랜치명을 안내

### STEP 1: /refactor 실행

`.claude/commands/refactor.md` 프로세스를 **그대로** 수행합니다.

1. **PHASE 1: BEFORE 분석** - 기능 체크리스트 작성
2. **PHASE 2: 리팩토링** - 테스트 먼저 → 프로덕션 코드 변경
3. **PHASE 3: AFTER 검증** - 기능 회귀 없음 확인

> 이 단계에서 `dev/active/refactor-{name}/` 산출물이 생성됩니다.

**완료 조건**: 빌드 통과 + 테스트 통과 + After 체크리스트 만족

### STEP 2: SOLID 순차 리뷰 + 권장사항 적용

5개 SOLID 원칙을 **순차적으로** 리뷰하고, 각 리뷰의 권장사항을 즉시 반영합니다.

**순서:**

```
SRP → OCP → LSP → ISP → DIP
```

**각 원칙별 절차 (5회 반복):**

1. 해당 원칙의 리뷰 커맨드 실행 (`/srp-review` → `/ocp-review` → `/lsp-review` → `/isp-review` → `/dip-review`)
2. ❌ 위반 사항 즉시 수정
3. ⚠️ 개선 사항 판단 후 적용
4. 다음 원칙으로 진행

**중요:**
- 각 원칙 리뷰는 **이전 원칙의 수정이 반영된 상태**에서 수행
- 5개 원칙 모두 완료 후 다음 STEP 진행
- 빌드/테스트는 이 단계에서 수행하지 않음 (최종 검증 단계에서 일괄 수행)

**완료 조건**: 5개 원칙 리뷰 완료 + 권장사항 반영 완료

### STEP 3: /verify-all 실행 + 권장사항 적용

`.claude/commands/verify-all.md`를 **그대로** 수행. 결과에서 ❌ 위반은 즉시 수정, ⚠️ 개선은 판단 후 적용. 수정 후 재빌드 + 재테스트 필수 (최대 3회).

### STEP 4: /qa 실행 + 권장사항 적용

`.claude/commands/qa.md`를 **그대로** 수행. 버그 발견 시 즉시 수정 + 재QA (최대 3회). E2E 스크립트/knowledge 인계는 QA 프로세스 내에서 처리.

### STEP 5: 최종 검증 + 알림

**5-1. 최종 검증 수행:**

```bash
# 빌드 확인
pnpm build

# 전체 테스트 실행
pnpm test
```

**5-2. 파이프라인 결과 리포트 출력:**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🏁 REFACTOR PIPELINE COMPLETE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📍 대상: {route-path}
🌿 브랜치: refactor/{name}
📂 Worktree: mm-broker-worktrees/refactor-{name}

📊 단계별 결과:
  STEP 1 리팩토링:    ✅/❌
  STEP 2 SOLID 리뷰: ✅/❌ (SRP N건, OCP N건, LSP N건, ISP N건, DIP N건 적용)
  STEP 3 verify-all: ✅/❌ (권장 N건 적용)
  STEP 4 QA:         ✅/❌ (권장 N건 적용)
  STEP 5 최종검증:   ✅/❌

📁 산출물:
  - dev/active/refactor-{name}/before-checklist.md
  - dev/active/refactor-{name}/after-checklist.md
  - dev/active/refactor-{name}/pipeline-report.md

💡 다음 단계:
  - worktree에서 /commit 으로 커밋 생성
  - main에서 git merge refactor/{name} 또는 PR 생성
  - 완료 후: git worktree remove mm-broker-worktrees/refactor-{name}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**5-3. 사용자 알림 (Windows):**

```powershell
# 사운드 알림
[console]::beep(523, 200); [console]::beep(659, 200); [console]::beep(784, 200); [console]::beep(1047, 400)

# 토스트 알림
powershell -Command "Add-Type -AssemblyName System.Windows.Forms; $n = New-Object System.Windows.Forms.NotifyIcon; $n.Icon = [System.Drawing.SystemIcons]::Information; $n.Visible = $true; $n.BalloonTipTitle = 'Claude Code'; $n.BalloonTipText = '리팩토링 파이프라인 완료! ({route-path})'; $n.ShowBalloonTip(10000); Start-Sleep -Seconds 11; $n.Dispose()"
```

---

## 중단 정책

각 STEP에서 치명적 실패 시:

| 실패 유형 | 행동 |
|-----------|------|
| 빌드 실패 (3회 재시도 후) | 파이프라인 중단 + 현재까지 결과 리포트 + 알림 |
| 테스트 실패 (3회 재시도 후) | 파이프라인 중단 + 현재까지 결과 리포트 + 알림 |
| QA 크리티컬 버그 (3회 수정 후) | 파이프라인 중단 + 이슈 기록 + 알림 |

중단 시에도 **반드시 알림**을 보냅니다.

---

## 산출물

```
dev/active/refactor-{name}/
├── before-checklist.md    # STEP 1 - 리팩토링 전 기능 목록
├── after-checklist.md     # STEP 1 - 리팩토링 후 검증
├── pipeline-report.md     # STEP 5 - 전체 파이프라인 결과
└── summary.md             # 변경 요약
```

---

## 완료 시

파이프라인이 끝나면 마지막에 반드시 출력:

```
refactor-pipeline 작업완료!
```
