# G3-1 보안 리뷰 평가

## Fixture 판정

| Fixture | 관찰 증거 | 판정 | 이유 |
|---|---|---|---|
| `unsafe-command-injection-xss.fixture.md` | request 입력이 shell template과 `innerHTML`로 전달됨 | reviewable | command injection/XSS 가능성을 조사할 증거가 있으나, 실제 취약점 확정에는 호출 맥락·방어·도달성 확인이 필요함 |
| `safe-output-encoding.fixture.md` | 입력 검증 뒤 argv 배열 전달, `textContent` 사용 | 확정 finding 없음 | 이 fixture만으로 취약점을 주장하지 않으며, 실제 validator와 process wrapper의 구현은 별도 범위에서 확인해야 함 |

## 계약 확인

- SEC-01: 명시 요청 또는 `risk-high` route만 trigger한다.
- SEC-02: unsafe fixture를 조사 대상으로, safe fixture를 확정 finding 없음으로 구분한다.
- SEC-03: fixture와 결과에 secret 값이 없고, skill은 원문 read/output을 금지한다.
- SEC-04: 결과 표가 evidence·impact·fix·regression test·residual risk를 요구한다.
- SEC-05: 자동 write, commit block, hook 등록이 없다.
- SEC-06: 현재 advisory는 official primary source와 확인 날짜 없이는 확정 주장으로 쓰지 않는다.

## 정적 검증 기준

- unsafe fixture에는 `runShell` template input과 `innerHTML` input이 있다.
- safe fixture에는 argv 배열과 `textContent`가 있으며 취약점 assertion이 없다.
- fixture와 evidence는 `.env`, token, key, password 값을 포함하지 않는다.
