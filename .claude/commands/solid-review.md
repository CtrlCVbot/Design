# /solid-review — SOLID + Component 원칙 순차 리뷰 + 반영

6개 원칙을 **순차적으로** 리뷰하고, 각 리뷰의 권장사항을 **즉시 반영**합니다.

> 개별 원칙 상세: `/srp-review`, `/ocp-review`, `/lsp-review`, `/isp-review`, `/dip-review`, `/component-review`

---

## 사용법

```
/solid-review                            # 현재 변경 파일 전체 리뷰 + 반영
/solid-review server/order/              # 특정 디렉토리 리뷰 + 반영
/solid-review path/to/file.ts           # 특정 파일 리뷰 + 반영
/solid-review --domain order             # order 도메인 전체 cross-layer 리뷰 + 반영
```

---

## 수행 단계

### 1단계: 인자 파싱

사용자가 전달한 인자를 그대로 각 개별 리뷰 커맨드에 전달한다.

- 인자 없음 → 각 리뷰 커맨드를 인자 없이 실행 (변경 파일 대상)
- `--domain order` → 각 리뷰 커맨드에 `--domain order` 전달
- `server/order/` → 각 리뷰 커맨드에 `server/order/` 전달

### 2단계: 6원칙 순차 리뷰 + 반영

아래 순서로 **한 원칙씩** 리뷰하고 즉시 반영한다:

```
SRP → OCP → LSP → ISP → DIP → CCP/ADP
```

**각 원칙별 절차 (6회 반복):**

1. 해당 원칙의 리뷰 커맨드 실행 (인자 전달)
   - `/srp-review {args}` → `/ocp-review {args}` → `/lsp-review {args}` → `/isp-review {args}` → `/dip-review {args}` → `/component-review {args}`
2. ❌ 위반 사항 즉시 수정
3. ⚠️ 개선 사항 판단 후 적용
4. 다음 원칙으로 진행

**중요:**
- 각 원칙 리뷰는 **이전 원칙의 수정이 반영된 상태**에서 수행
- 빌드/테스트는 이 단계에서 수행하지 않음 (호출자가 판단)

### 3단계: 통합 요약 리포트

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📐 SOLID + COMPONENT REVIEW COMPLETE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📁 대상: {인자 또는 변경 파일 목록}

📊 원칙별 반영 결과:
  SRP:     ❌ N건 수정, ⚠️ N건 적용
  OCP:     ❌ N건 수정, ⚠️ N건 적용
  LSP:     ❌ N건 수정, ⚠️ N건 적용
  ISP:     ❌ N건 수정, ⚠️ N건 적용
  DIP:     ❌ N건 수정, ⚠️ N건 적용
  CCP/ADP: ❌ N건 수정, ⚠️ N건 적용

전체: ❌ N건 수정, ⚠️ N건 적용
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 완료 시

```
solid-review 작업완료!
```
