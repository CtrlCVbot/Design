# planning_worker Pilot Rollback

이 절차는 새 agent와 health-check 확장만 되돌린다. Phase 5 기본 모델 설정은 변경하지 않는다.

```powershell
Copy-Item -LiteralPath 'C:\Work\Dev\Design\.plans\20260710-codex-gpt56-advisor-worker\phase5-1-planning-worker\global-before\agentic_health_check.py' -Destination 'C:\Users\beck\.agents\skills\agentic-health-check\scripts\agentic_health_check.py' -Force
Copy-Item -LiteralPath 'C:\Work\Dev\Design\.plans\20260710-codex-gpt56-advisor-worker\phase5-1-planning-worker\global-before\test_agentic_health_check.py' -Destination 'C:\Users\beck\.agents\skills\agentic-health-check\tests\test_agentic_health_check.py' -Force
Copy-Item -LiteralPath 'C:\Work\Dev\Design\.plans\20260710-codex-gpt56-advisor-worker\phase5-1-planning-worker\global-before\checks.md' -Destination 'C:\Users\beck\.agents\skills\agentic-health-check\references\checks.md' -Force
Copy-Item -LiteralPath 'C:\Work\Dev\Design\.plans\20260710-codex-gpt56-advisor-worker\phase5-1-planning-worker\global-before\SKILL.md' -Destination 'C:\Users\beck\.agents\skills\agentic-health-check\SKILL.md' -Force
Remove-Item -LiteralPath 'C:\Users\beck\.codex\agents\planning-worker.toml' -Force
python 'C:\Users\beck\.agents\skills\agentic-health-check\tests\test_agentic_health_check.py'
python 'C:\Users\beck\.agents\skills\agentic-health-check\scripts\agentic_health_check.py'
```
