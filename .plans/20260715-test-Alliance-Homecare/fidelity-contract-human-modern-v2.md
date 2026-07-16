# 새소망 방문요양 Human Modern V2 Fidelity Contract

## Current Verdict

- Functional status: verified
- Fidelity status: pass with documented mobile recapture limitation
- Closeout decision: approved for V1/V2 comparison deployment
- Source of truth: `UI UX 고도화 제안 - 휴먼 모던 v1.html`

## Reference Inputs

| artifact | path_or_url | role | notes |
| --- | --- | --- | --- |
| Human Modern concept v1 | `.plans/20260715-test-Alliance-Homecare/UI UX 고도화 제안 - 휴먼 모던 v1.html` | V2 visual source of truth | 앱에서는 기존 화면 다음 버전이므로 `/v2`로 제공 |
| Existing app | `apps/alliance-homecare` | implementation target | `/`와 `/v1`은 기존 V1 유지 |

## Screen And State Inventory

| screen_or_state | required_viewports | reference_evidence | app_evidence | status |
| --- | --- | --- | --- | --- |
| V1 current home | 1440×960, 390×844 | current `/` | `/`, `/v1` | passed |
| V2 hero | 1440×960, 390×844 | reference first viewport | `/v2` | passed |
| V2 human principles | 1440×960, 390×844 | `#principles` | `/v2#principles` | passed |
| V2 services accordion | 1440×960, 390×844 | `#services`, one-open state | `/v2#services` | passed |
| V2 process and local brand | 1440×960, 390×844 | `#process` | `/v2#process` | passed |
| V2 improvements and interaction rules | 1440×960, 390×844 | `#changes`, `#rules` | `/v2#changes`, `/v2#rules` | passed |
| Four color themes | 1440×960 | existing theme switcher | `/v2` | passed |
| Version comparison | 1440×960, 390×844 | approved V1/V2 requirement | `/`, `/v1`, `/v2` | passed |

## Token And Style Map

| token_area | source_value | target_value | match_required | notes |
| --- | --- | --- | --- | --- |
| dark surface | `#1d2943` ink navy | theme-aware dark token | yes for golden-navy baseline | other approved themes may intentionally vary |
| accent | `#e5b51e` / `#ffd44b` | theme accent tokens | yes for golden-navy baseline | CTA, eyebrow, active state only |
| paper surface | `#f7f2e8` | warm paper surface | close match | long-form reading background |
| support colors | coral and sage | scoped V2 support tokens | close match | no additional competing accent |
| typography | Noto Serif KR + Pretendard | existing loaded families | yes | serif display, sans-serif UI/body |
| motion | 500–750ms reveal, 70–80ms stagger | shared MotionProvider contract | close match | reduced-motion removes transitions |
| radius | arches, pills, restrained 20–24px | scoped V2 CSS | yes | no generic card mosaic |

## Asset Map

| asset_id | source_in_html | type | planned_target_path | implementation_method | fidelity_risk | notes |
| --- | --- | --- | --- | --- | --- | --- |
| care-hands | `assets/human-modern/care-hands-unsplash.jpg` | image | `public/images/human-modern/care-hands.jpg` | copy + `next/image` | medium | production replacement requires consented Korean care photo |
| brand-sign | `assets/human-modern/brand-sign-reference.jpg` | image | `public/images/human-modern/brand-sign.jpg` | copy + `next/image` | low | optimize delivery with `next/image` |
| plus/arrow marks | inline text and CSS | css-shape | component CSS | port | low | no icon library required |

## Visual Gap Board

| gap_id | category | reference | current_app | severity | planned_fix | evidence |
| --- | --- | --- | --- | --- | --- | --- |
| HM-VF-01 | VF-FRAME | full-bleed editorial hero | V1 split hero | high | add isolated `/v2` frame without replacing V1 | reference/app screenshots |
| HM-VF-02 | VF-ASSETS | real care and brand imagery | gradients/placeholders | high | reuse approved concept assets through `next/image` | asset load audit |
| HM-VF-03 | VF-STRUCTURE | cardless principles and accordion | repeated service cards | high | port reference section order and hierarchy | DOM/screenshot comparison |
| HM-VF-04 | VF-RESPONSIVE | mobile-first CTA and compact nav | V1 responsive layout only | high | add V2 mobile rules and fixed contact actions | 390×844 evidence |
| HM-VF-05 | VF-INTERACTION | scroll reveal, nav depth, exclusive accordion | shared V1 motions | medium | reuse/generalize motion runtime and add exclusive service state | browser interaction evidence |
| HM-VF-06 | VF-STATE | four theme choices plus V1/V2 comparison | themes only | medium | retain theme switcher and add version navigation | component and browser tests |

## Implementation Order

1. Add behavior-first tests for version navigation, V1 preservation, V2 content, themes, and routes.
2. Add `/v1` alias and `/v2` route without changing `/` behavior.
3. Port assets and V2 structure using `next/image` and scoped CSS.
4. Connect shared theme and motion contracts.
5. Capture V1/V2 desktop and mobile evidence.
6. Run focused tests, full tests, lint, and build.

## Completion Criteria

- Exact-match items: section order, hero hierarchy, service accordion structure, image usage, core copy, CTA placement.
- Tolerance-based items: responsive line wrapping, browser font rasterization, theme variants other than golden-navy.
- Required screenshots: reference and `/v2` at 1440×960 and 390×844; `/v1` preservation at the same viewports.
- Required commands: `npm test`, `npm run lint`, `npm run build` from `apps/alliance-homecare`.
- Remaining accepted gaps: concept photography remains temporary until approved production photography is supplied.
