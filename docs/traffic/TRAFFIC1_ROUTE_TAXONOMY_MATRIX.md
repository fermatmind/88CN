# TRAFFIC1 Route Taxonomy Matrix

Result: GO_TRAFFIC2

## Matrix

| intent_type | route_family | audience | data_source_requirement | minimum_threshold | allowed_lifecycle_states | indexability_policy | sitemap_policy | canonical_policy | monetization_boundary | acquisition_priority | navigation_priority | SEO_risk | data_readiness | engineering_complexity | brand_fit | first_wave_or_later | launch_gate |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- |
| `landscape_intent` | `/landscape` | Founder, builder, researcher, evaluator | Reviewed/published projects and source links | Hub can launch with safe reviewed copy; claims need source-backed counts | `published`, `claimed`, `owner_verified` | Indexable if manually reviewed and safe | Include when indexable | Self-canonical | `none` | 3 | 5 | 2 | 4 | 3 | 5 | First wave | TRAFFIC2 must prove no unsupported counts and safe links only. |
| `landscape_intent` | `/landscape/sectors` | Founder, researcher, evaluator | Reviewed sector assignments | 3 reviewed/published projects per sector route | `published`, `claimed`, `owner_verified` | Indexable above threshold | Include eligible sector routes only | Self-canonical | `none` | 3 | 5 | 2 | 3 | 3 | 5 | First wave after hub | Sector checker must validate sample-count labels. |
| `task_intent` | `/tasks/[slug]` | Builder, operator, C-end AI user | Allowlisted slug and reviewed public-signal project set | 3 reviewed/published projects per slug | `published`, `claimed`, `owner_verified` | Indexable only above threshold | Include allowlisted indexable slugs only | Self-canonical if allowlisted | `none` | 5 | 3 | 4 | 3 | 3 | 4 | First wave after hub | Task checker must reject arbitrary slugs and under-threshold sitemap entries. |
| `alternative_intent` | `/alternatives/[slug]` | Software evaluator, buyer researcher | Approved canonical pair and source-backed fields | Approved pair; broader set threshold if route claims alternatives set | `published`, `claimed`, `owner_verified` | Indexable only for approved pair | Include canonical pairs only | Approved order only | `none` | 5 | 3 | 4 | 4 | 2 | 4 | First/second wave | Checker must reject reverse duplicates and N-by-N generation. |
| `zh_cn_tool_discovery_intent` | `/zh-CN/landscape` | Chinese builder, founder, evaluator | Manual Chinese copy over reviewed public data | Hub can launch after manual review | `published`, `claimed`, `owner_verified` | Indexable after review | Include after indexable | I18N canonical/hreflang deferred | `none` | 4 | 5 | 3 | 3 | 4 | 5 | First wave after stable strategy | Chinese copy checker must reject directory/promise language. |
| `machine_readability_intent` | `/zh-CN/geo-checker` | Chinese outbound founder, builder | Static tool copy; generated checks noindex | Tool page not project-count based | Static public page only | Indexable after manual review | Include static route only | I18N canonical/hreflang deferred | `forbidden` | 4 | 4 | 3 | 4 | 4 | 5 | First wave after review | Checker must verify no generated-result indexing and no outcome promise. |
| `zh_cn_outbound_founder_intent` | `/zh-CN/founders` | Chinese founder, maintainer | Manual education copy and reviewed examples | Education route not project-count based | Reviewed examples only | Indexable after review | Include after indexable | I18N canonical/hreflang deferred | `none` | 3 | 4 | 2 | 4 | 2 | 5 | First wave | Copy checker must reject funding/customer/search promises. |
| `submission_intent` | `/zh-CN/submit` | Chinese founder, maintainer | Manual lifecycle copy | Education route not project-count based | Submitted records excluded until reviewed/published | Indexable if no listing promise | Include education page only | I18N canonical/hreflang deferred | `checkpoint_required` | 3 | 3 | 3 | 4 | 2 | 4 | First wave as education | Checker must reject automatic listing and paid inclusion language. |
| `buyer_research_intent` | `/report-distribution-pack` | Researcher, founder, internal team | Reviewed/published report source package | Reviewed/published report | Published reports only | Indexable if reviewed/published | Include reviewed package routes only | Self-canonical | `none` unless sponsorship checkpoint | 3 | 3 | 3 | 4 | 2 | 4 | Later first wave | Checker must reject automated sending/posting and private contact data. |

## TRAFFIC2 Gate Rows

TRAFFIC2 may plan or implement `/landscape` only after it carries these constraints forward:

- reviewed/published data only;
- no fake counts;
- no unreviewed project routes;
- no auto-generated categories;
- no paid effect on organic systems;
- no unsupported best/top/ranking language;
- no sitemap entry for under-threshold child routes;
- no implementation of `/tasks`, `/alternatives`, or `/zh-CN` in TRAFFIC2 unless separately scoped.
