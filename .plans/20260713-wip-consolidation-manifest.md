# WIP consolidation archive manifest

## 목적

비-main worktree와 branch를 정리하기 전에 Git에 직접 넣지 않는 외부 source, 중복 archive, runtime 산출물의 복구 위치와 무결성 기준을 기록한다.

## Archive

- snapshot date: `2026-07-13`
- local archive root: `C:\Work\Archive\Design-wip-20260713`
- archived file count: `301`
- archived size: `59.59 MiB`
- hash algorithm: `SHA256`

## File hashes

| Relative path | SHA256 | 처리 이유 |
|---|---|---|
| `.plans/20260430-cargo-order-admin/final-handoff.zip` | `c2f7b85861eca44c5e62674623c0cbaf2f5f0eccb0a1025593866de337116b7b` | 추출 가능한 전달용 archive |
| `.plans/20260430-cargo-order-admin/order-new-design-260630.zip` | `c07c1747ea1a62d00666c3d73cd3477e92c4d07f4e9cb6b0950d3d17162ecaa1` | 추출 가능한 전달용 archive |
| `.plans/20260430-cargo-order-admin/screenmap.zip` | `6b789c39b74fecf022e63094481efe48b52573aff146d8be06b2b2e7fe141660` | `screenmap/` source와 중복되는 전달본 |
| `.plans/20260624-cargo-carowner-app-design/publishing/화물 배차 앱 3차 (standalone).html` | `92be2d658457ab45d6bc572653207c8fd9f834f48988dd0c3ba0aaa2c149726c` | `21.73 MiB` self-contained 전달본 |
| `.references/code/loadout-main.zip` | `f0498a6d153b39f04d87bd8d5d742f727993894770cf3c9401f9e7dd72af81a0` | 외부 source archive |
| `.references/code/nb-main.zip` | `93b8a7715c461e70c5d6a95654388436e08460fbe8115b3067f3b60d5cab5770` | 출처와 license 확인 전 Git 제외 |
| `.harness-metrics.jsonl` | `2e7b4bdb6148c5fd67bd50b4098aa888fd5ee313b6c7a108943457fff7a0f90b` | archive 생성 시점의 runtime snapshot |
| `.plans/20260624-cargo-carowner-app-design/publishing/.thumbnail` | `9de4f04bee94529fd1af4ed4e081edf2113279e3f4607621e7f37fb8c15a8ed6` | local publishing marker |

## Directory tree digests

Directory digest는 `relative/path|file-sha256` 목록을 경로순으로 정렬한 뒤 전체 문자열에 SHA256을 적용한 값이다.

| Relative path | Tree digest | 처리 이유 |
|---|---|---|
| `.references` | `7a3b87ddab8cb4a16e9785e700122428e5484dc84368fd34593675c6d79e078c` | 외부 source와 원본 archive 보존 |
| `.obsidian` | `d9624edbb54da3bacdf621f35bbf8a0efcbd28ae4d2f68e1fc5c57c8a042fb4b` | 개인 editor 상태 보존 |
| `output/playwright` | `7e6f8d657d201f263568d249b9a851e4a4a7f9cd2cf22dafb098f899fa3424f0` | 정리 전 QA screenshot 원본 보존 |

## 복구와 정리 기준

1. Git에 보존할 source와 evidence가 `main`에 반영되기 전에는 원본 worktree를 삭제하지 않는다.
2. archive 대상은 위 hash 또는 tree digest가 일치해야 복구 가능한 것으로 판정한다.
3. `.references/code/nb-main`은 provenance와 license가 확인되기 전까지 저장소에 vendor하지 않는다.
4. nested fixture repository는 공통 원격 HEAD 대신 각 실험의 untracked evidence와 verifier만 상위 계획 패키지에 보존한다.
5. `.harness-metrics.jsonl`은 명령 실행 중 계속 갱신되므로 위 hash는 archive 생성 시점 snapshot을 가리킨다.
