# Visual Bugs

PR41 Genesis Badge Founder Explainer QA + Live Smoke found one P3 visual issue.

| Severity | Page | Viewport | Screenshot Path | Reproduction Steps | Observed Behavior | Expected Behavior | Suspected Component | Suggested Fix |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| P3 | `/genesis` and `/founders` | Mobile, 390px wide | `../screenshots/qa/pr41-genesis-mobile.png`, `../screenshots/qa/pr41-founders-mobile.png` | Open live `/genesis` or `/founders` at a 390px viewport. | Header/nav width appears to push the page wider than the viewport, so the screenshot captures left-aligned clipped content. Main content still loads and remains readable with horizontal movement. | Mobile viewport should not show horizontal clipping; header links should fit or collapse without widening the page. | Shared site header / global layout, not PR40 page copy. | Add a later layout polish task to collapse or horizontally constrain header nav on narrow mobile widths. |
