# Advisor/Worker Phase 0 Fixture

격리된 model access, credits calibration, B0 golden task subset 실행용 TypeScript fixture다.

## 검증

```powershell
npm test
```

Node.js 24의 type stripping을 사용하므로 dependency 설치가 필요 없다.

## 안전 경계

- production credential 없음
- 실제 remote 없음
- 외부 네트워크 불필요
- fixture 밖 파일 수정 금지
- commit/push/deploy는 baseline fixture 준비 외 금지
