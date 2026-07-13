# Operations Evidence

- `RISK-01`: stale evidence가 결정 근거에 섞일 수 있다. 대응은 입력 manifest와 evidence ID coverage 검증이다.
- `RISK-02`: Worker가 planning output 밖을 수정할 수 있다. 대응은 allowed path와 pre/post hash 비교다.
- `GATE-01`: evidence coverage와 source hash를 검증한다.
- `GATE-02`: 5개 문서와 내부 링크를 검증한다.
- `GATE-03`: Advisor가 사실, 추론, scope를 독립 검증한다.
