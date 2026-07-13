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
| EX-DEC-015 | 2026-07-13 | 목록 검색은 입력 state와 적용 filter를 분리 | reference는 검색 click·Enter에서 적용 | 입력 중 목록이 임의 변경되지 않음 |
| EX-DEC-016 | 2026-07-13 | 검색 facet은 전체 원본에서 먼저 검색한 뒤 상태별 count 계산 | reference count 의미 보존 | 검색 결과 안에서 상태를 재필터링 가능 |
| EX-DEC-017 | 2026-07-13 | 디자인 디테일 제안은 standalone HTML로만 제공 | 사용자 요청 및 승인 전 UI 기준선 보호 | DD-01~12 앱 미적용, 선택 후 별도 구현 |
| EX-DEC-018 | 2026-07-13 | 사용자의 `전체 적용`을 DD-01~12 전체 승인으로 기록 | HTML을 직접 검토한 후 명시한 결정 | R4 UI 구현 unblock, Phase B는 계속 보류 |
| EX-DEC-019 | 2026-07-13 | 사용자의 `G-UI approved`를 R4 화면 기준선 승인으로 기록 | R4 검증·fidelity evidence 완료 후 명시 승인 | Phase B 계획 수립 가능, 실제 연결은 별도 승인 필요 |
| EX-DEC-020 | 2026-07-13 | 인수인계는 Phase B 계획 단계부터 시작 | UI R3/R4 기준선 commit 완료 | handoff boundary 고정 후 첫 slice 승인 요청 |
