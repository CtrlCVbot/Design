# Phase 5 제한 출시 Rollback

- 출시 직전 원본: `C:/Users/beck/.codex/config.toml`
- 원본 SHA-256: `F33B9DA7D2C749F1AB6AC77EF4FB03AAEED41EABC5634F7BA452A1C02DEC3E9A`
- 원본 크기: `10361` bytes
- 변경 대상: `model`, `model_reasoning_effort` 두 필드만

# 즉시 복원 값

```toml
model = "gpt-5.6-sol"
model_reasoning_effort = "low"
```

복원 후 `agentic_health_check.py`와 fresh direct smoke를 다시 실행한다.

```powershell
Copy-Item -LiteralPath 'C:\Work\Dev\Design\.plans\20260710-codex-gpt56-advisor-worker\phase5-release\config-before-release.toml' -Destination 'C:\Users\beck\.codex\config.toml' -Force
python 'C:\Users\beck\.agents\skills\agentic-health-check\scripts\agentic_health_check.py'
```
