# Rajasthan catalogue integration

The public catalogue contains **18 named designs**, **23 independently sourced technical configurations**, and **65 reviewed images**. The eight former generic fixtures are removed from the listing; their old detail URLs redirect to `/products` without pretending to identify an equivalent design. No manufacturer SKUs, prices, availability or unsupported performance specifications have been introduced.

## Source and reproduction

- `catalog.raw.json` is a byte-for-byte copy of the supplied extraction. The separately supplied `Anjora_Catalog_Extracted.json` was identical.
- `page-text.raw.json` preserves all 89 pages of extracted text, including typographical and narrative errors.
- The original 89-page PDF was independently extracted with `pdftotext` and visually reviewed as page sheets. Every exported image was inspected alongside those pages. All 127 raw technical fields (including the two internal unnamed designs) were cross-checked against the original PDF text, with zero mismatches.
- All 100 supplied WebP images remain under `src/assets/products/rajasthan/`, at their original resolution. Only the 65 explicitly selected images are imported into the public bundle. The other images, including the two unnamed designs, are retained for review.
- `image-review.json` records each image's source page, dimensions and inclusion decision. Original PDF image xrefs remain available in the raw catalogue.
- Run `python3 scripts/import-rajasthan.py` from the project root to reproduce `src/data/rajasthan.json`, the static image imports, and the image review log. The importer contains the explicit editorial decisions; edit it before regeneration.
- Source metadata and review notes are repository records, not customer-facing workflow or invented product claims.

## Content decisions requiring client review

| Pages | Issue | Public handling |
| --- | --- | --- |
| 7 | Sunehri Dhara has a vertical composition without its own technical block. | Omitted; primary suspension and verified contextual views retained. |
| 15 | Abhaas red-leaf/golden-ring narrative does not clearly match the technical photograph. | Introductory concept retained; supporting narrative withheld. |
| 22 | Image 01 is Peet Vrinda within the CHHEEN extraction. | Excluded from CHHEEN; image 02 is the correct CHHEEN view. |
| 30 | Image 02 is CHHEEN within the CHIDKOLI extraction. | Excluded. |
| 34, 38, 42 | Repeated “Luma Birds” story across Kaag, Shilora and Atki badli. | Withheld; each product's own introductory concept retained. |
| 34 | Image 01 depicts CHIDKOLI, not Kaag. | Excluded; image 02 is Kaag. |
| 32–33 | Kaag's intro mentions quartz/amethyst; technical material lists alabaster. | Preserve the intro and technical block separately; discovery uses technical materials only. |
| 42 | Image 01 depicts Shilora, not Atki badli. | Excluded; image 02 is Atki badli. |
| 45–49 | Shilpstambh's technical block specifies powder-coated metal/alabaster, while p. 46 says bronze/glass. Alternate wall/suspended compositions have no separate technical blocks. | Technical p. 45 governs specs; conflicting story withheld. Alternate gallery compositions explicitly require specification confirmation. “Blub Holder” corrected to “Bulb Holder.” |
| 51, 54–56 | Dhwani stambh section contains four technical blocks without separate configuration names. | Selector uses source page references; each configuration has its own image, dimensions, weight, finish, material and enquiry context. Family classification still needs confirmation. |
| 53 | Different Dhwani stambh form without a clearly paired technical block. | Retained internally; excluded from the configuration gallery. |
| 55 | Material ends in “meta”. | Displayed as incomplete with a request to confirm; never silently completed to “metal”. |
| 50 | App-controlled sound and aroma features are described only in the main narrative. | Main-design attribution retained; explicitly not extended to all configurations. |
| 63 | MINAR repeats Vrikshamani's woodwork narrative and includes a Vrikshamani image. | Story and image 01 excluded; MINAR image 02 retained. |
| 64–66 | MINAR white, blue and red visualizations lack separate technical specifications. | Gallery marked as alternate compositions with finish/specification confirmation; no RGB/control claim. |
| 72, 73, 75 | PHOG has three technical configurations. | Independent page-based selector; pp. 74 and 76 paired only with pp. 73 and 75 respectively. Official variant names remain unconfirmed. |
| 79 | “space white the” is an obvious typographical error. | Corrected to “space while the”; raw source preserved. |
| 85–88 | Two unnamed designs, both referring to Danny Lane as inspiration. | Entirely withheld from public products. No invented names, collaboration or endorsement claims. Raw “cob chip” retained internally. |

The extracted technical fields do not name the dimension axes, so sizes retain the printed order without assigning width/depth/height. CHHEEN retains all three sizes. Ambiguous values remain as printed.

## User-facing implementation

- `/products`: consultancy-led Rajasthan introduction, original CHHEEN image, 18-design grid, URL-driven search and material discovery, clear customization and enquiry journey.
- `/products/:slug`: catalogue story, original proportional images, technical fields, source-page configurations, related designs selected by shared materials, and contextual enquiry links.
- `/products?category=Glass&q=brass`: filters/search survive refresh/history; invalid categories show all designs. Material groups are editorial discovery based on technical fields, not official installation classifications or outdoor ratings.
- Products and Projects share `CatalogueMegaMenu`: mutually exclusive state, pointer bridge, cancellable close timer, focus preview, Escape, Enter/Space disclosure, sequential keyboard navigation, outside click and route closing. Mobile has independent accessible accordions with one expanded section.
- Both navigation triggers use the same translucent pill and lime accent. Opening a menu leaves the full header transparent.
- `/talk-to-our-team`: exact supplied specialist names, roles and phone/email links, available via one footer link and intentionally absent from primary navigation.
- Footer retains general office contacts and includes the catalogue's official Instagram and LinkedIn URLs.
- Home features Sunehri Dhara, CHHEEN and Meghchhatra; About includes a source-grounded Rajasthan section. No invented research articles.
- Enquiry URLs carry product slug and catalogue configuration page. The existing Web3Forms form includes product, collection and configuration in the prefilled message and subject. A user must explicitly submit. Automated QA intercepts requests; no test email is sent.

## Verification

Baseline: clean `main` branch; eight generic products; Projects-only menu; specialist profiles embedded in the footer; opaque full-width menu-open header. Baseline captures: `/tmp/anjora-before-products.png` and `/tmp/anjora-before-menu.png`.

New QA: `npm run catalogue:qa` checks independently enumerated names/pages, every technical field against the preserved extraction, all 18 detail routes, variants and image pairing, filters/history/search, keyboard and mobile menus, contacts, enquiry payload, animation cleanup and layouts at 1440, 1024, 768, 430 and 375 pixels in light/dark themes. Screenshots are written to `/tmp/anjora-catalogue-qa`.

Existing QA scripts were migrated from the removed placeholder to Sunehri Dhara and from footer specialist profiles to the team page. The suite now waits for committed route/filter state instead of relying on short fixed delays. A missing optional divider target discovered by theme QA was fixed in the catalogue motion hook.

No deployment, merge, external publication or real enquiry submission is part of this work.
