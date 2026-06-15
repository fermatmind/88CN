# Visual Bugs

Visual QA for 2026-06-15 PR #7 SEO/GEO Content Topology.

| Severity | Page | Viewport | Screenshot Path | Reproduction Steps | Observed Behavior | Expected Behavior | Suspected Component | Suggested Fix |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| P3 | All sampled public pages | mobile 390x844 | `../screenshots/qa/pr7-mobile-category-ai-agents.png` | Open any sampled public page at a 390px mobile viewport and compare `document.documentElement.scrollWidth` to `clientWidth`. | The page width is 393px for a 390px viewport. The top navigation's `Founders` link extends about 3px beyond the viewport. Content remains readable, but the document has minor horizontal overflow. | Mobile pages should not create horizontal page overflow. | `components/site-header.tsx` navigation layout | Reduce mobile nav spacing or padding, wrap/hide lower-priority nav links behind a compact menu, or make the nav container shrink without exceeding the viewport. |
