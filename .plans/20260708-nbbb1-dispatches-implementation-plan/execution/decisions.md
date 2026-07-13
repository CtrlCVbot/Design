# 실행 Decision Log

| ID | 날짜 | 결정 | 근거 | 영향 |
|---|---|---|---|---|
| EX-DEC-001 | 2026-07-10 | G0 UI prototype 착수 승인 | 사용자 `진행해줘` | R/N/P unblock |
| EX-DEC-002 | 2026-07-10 | Worker 1개·single-writer 운영 | shared worktree·cache 충돌 방지 | Advisor는 Worker 종료 후 write |
| EX-DEC-003 | 2026-07-10 | project hook live 증거가 없어도 manual TDD fallback 사용 | guard script dry-run은 정상, 자동 event 미확인 | Worker brief·Advisor 검증 강화 |
| EX-DEC-004 | 2026-07-10 | missing `docs/standards/**`를 추정하지 않음 | repo에 파일 미존재 | skill 본문·기존 패턴 우선 |
| EX-DEC-005 | 2026-07-10 | B-00 이후 기능 연결 금지 | G-UI 사용자 승인 필요 | prototype 완료 후 중단 |
| EX-DEC-006 | 2026-07-10 | Worker repair brief로 guard·fixture·banner 문제 수정 | Advisor 독립 검증에서 high 3건 발견 | test 9 files / 15 tests, guard exit 0 |
| EX-DEC-007 | 2026-07-10 | 넓은 viewport screenshot은 유효 영역 crop + DOM 검증으로 제공 | in-app browser 가장자리 타일링 | 최종 전체 화면 만족도는 사용자 URL 직접 검수 필요 |
| EX-DEC-008 | 2026-07-10 | G-UI R1은 screenshot보다 reference source code를 우선 | 사용자 피드백 3·5 | line anchor·computed style 검증 추가 |
| EX-DEC-009 | 2026-07-10 | 거래처 검색을 right pane mode로 추가 | `Dispatches.tsx:4821-4924` | 등록 draft context 유지 |
| EX-DEC-010 | 2026-07-10 | 상세 status는 route-local demo transition만 허용 | backend 연결 금지 + interaction 검수 필요 | 실제 저장 없이 badge 반영 |
| EX-DEC-011 | 2026-07-10 | R1 완료 후에도 자동 승인하지 않음 | G-UI는 사용자 gate | `revise-ready`, Phase B 보류 |
| EX-DEC-012 | 2026-07-10 | R2 inline detail은 reference JSX/CSS를 line-by-line SSOT로 사용 | R1 내부 재해석이 사용자 기대와 불일치 | 원본 label·순서·token·상태 동작 고정 |
| EX-DEC-013 | 2026-07-10 | reference의 저장은 route-local state로만 대체 | backend/service 무변경 gate | UI 동작 검수 가능, 실제 저장 없음 |
| EX-DEC-014 | 2026-07-10 | typography·색상 drift를 repair brief로 재위임 | Advisor 독립 검증에서 high fidelity gap 확인 | CSS exact contract 추가 후 재검증 |
