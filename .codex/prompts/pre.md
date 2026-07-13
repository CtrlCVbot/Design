# Pre 서버 배포 (/pre)

현재 브랜치의 변경사항을 pre 서버에 배포합니다.

## 수행 단계

### 0. 전처리: 빌드 & 단위 테스트 검증 (필수)

배포 전에 반드시 빌드와 단위 테스트를 통과해야 한다.
(통합 테스트는 배포 게이트에서 제외 — 필요 시 로컬에서 `pnpm test:integration` 수동 실행)

```bash
# 1. 빌드 검증
pnpm build

# 2. 단위 테스트 실행
pnpm test:unit
```

- **빌드 실패 시**: 에러를 수정하고 다시 시도
- **테스트 실패 시**: 실패한 테스트를 수정하고 다시 시도
- **모두 통과해야만** 배포 단계로 진행

### 1. 배포

```bash
git checkout main
git pull origin main
git checkout pre
git merge main --no-edit
git push origin pre
git checkout main
```

## 주의사항

- 커밋되지 않은 변경사항이 있으면 먼저 stash하거나 커밋할 것
- 충돌 발생 시 사용자에게 알리고 해결 방법 안내
