---
name: layered-architecture
description: "Layered Architecture 개요. Route/Service/Repository/Domain 레이어 구조와 공통 규칙(DTO, index.ts, CQRS)을 정의. 레이어 간 작업 시 이 개요를 먼저 읽고, 상세는 각 레이어 스킬 참조."
---

# Layered Architecture Skill

## 적용 조건

- `server/**/*.ts` 파일 작업 시
- route, service, repository 레이어 작업 시

## 🚨 CRITICAL: 레이어별 책임 검증

> 한 줄 한 줄 리팩토링하며 옮길 때마다 질문하라:
> - ❓ **"이 코드가 이 레이어의 책임인가?"**

---

## 레이어 구조

```
Route (HTTP 관심사) → Service (조율) → Repository (데이터 접근) + Domain (비즈니스 규칙)
```

| 레이어 | 책임 | 상세 규칙 |
|--------|------|-----------|
| Route | HTTP 검증, 인증 확인, withErrorHandler | `.claude/skills/route-layer.md` |
| Service | Repository + Domain 조율, 위임 | `.claude/skills/service-layer.md` |
| Repository | DB 접근, 컬럼 선택, 타입 안전성 | `.claude/skills/repository-layer.md` |
| Domain | 비즈니스 규칙, 상태 전이 | `.claude/skills/domain-modeling.md` |

---

## 공통 규칙

- 파라미터 전개는 하나하나 하지 않고 최대한 `...`을 이용하거나 최소화
- Query와 Command 분리
- 양방향 참조 확인

## DTO 위치 및 네이밍

### Co-location 원칙

- **단일 서비스 전용 DTO → 서비스 파일에 co-locate** (별도 파일 생성 금지)
- **2개 이상 서비스가 공유하는 DTO → 별도 파일로 분리**
- **서비스 + 레포지토리가 공유하는 DTO → 별도 파일로 분리** (레이어 의존성 보호)

### 분리가 필요한 경우의 위치

```
server/{도메인}/application/{query|command}/dto/
```

### 네이밍

- `~Request`, `~Response`로 통일
- 엔티티를 response로 변환하는 `toXxxResponse` 함수는 해당 타입과 함께 co-locate

## index.ts (모듈 진입점)

- 무조건 생성 금지, 필요성 판단 후 생성
- **필요**: 여러 곳에서 import, 내부 구조 숨기기
- **불필요**: 단일 route에서만 사용, 작은 모듈