# Premium UX and client feedback implementation

Implemented on `fix/premium-ux-stability`, 27 October 2026. Changes are local and uncommitted; nothing was deployed, pushed or merged. The working tree was clean before implementation.

## 1. Files changed

| Area | Files |
| --- | --- |
| Services | `src/components/home/ServicesSection.tsx`, `ServicesSection.css`; new `src/lib/service-progress.ts` |
| Navigation and routes | `src/components/layout/Navbar.tsx`, `Navbar.css`, `SiteLayout.tsx`, `RouteTransition.tsx`, `RouteTransition.css`; new `ProjectsMegaMenu.tsx`, `ProjectsMegaMenu.css` in the same directory |
| Projects | `src/pages/Projects.tsx`, `ProjectDetail.tsx`, `Projects.css`; `src/components/projects/NextProject.tsx`, `ProjectCard.tsx`, `ProjectGallery.tsx`, `ProjectGrid.tsx`; `src/data/projects.ts`; new `src/data/project-image-sizes.json` |
| Enquiry and footer | `src/components/home/EnquirySection.tsx`, `EnquirySection.css`; `src/components/layout/Footer.tsx`, `Footer.css`; new `src/data/contacts.ts` |
| Other pages and shared styling | `src/App.tsx`, `src/index.css`, `src/pages/Home.tsx`, `BlogDetail.tsx`; `src/components/home/Hero.tsx`, `ProjectTile.tsx`; new `src/pages/Research.tsx`, `Research.css`, `src/components/home/InstagramReel.tsx`, `InstagramReel.css` |
| Build and QA | `vite.config.ts`, `package.json`, `scripts/enquiry-qa.mjs`, `scripts/visual-qa.mjs`; new `scripts/services-qa.mjs`, `scripts/client-ux-qa.mjs` |
| Documentation | `README.md`, this report |

No dependencies, credentials, source project photographs or lockfiles were changed.

## 2. Issues fixed

- Service text, counter and accessibility state could disagree during a scrubbed transition. Reversing or seeking also depended on overlapping visibility operations.
- SPA navigation from a scrolled, pinned section could initialize a new page's ScrollTriggers against the old scroll position. A reproduced GSAP `undefined.end` / invalid-scope failure unmounted the page.
- Route animation could hide the entire main element; interrupted navigation depended on that animation completing.
- Project filters were not durable URL state. Filter and detail changes also needed explicit GSAP teardown.
- A dominant next-project hero blurred the boundary between independent case studies.
- Portrait cover photography was undersized inside an oversized blurred background.
- Mobile menu scrolling needed a stable header surface and reduced-motion transition delays needed resetting.
- Enquiry submission needed a synchronous duplicate guard, request cancellation and a complete pending-state regression check.
- Research was an unfinished destination. It now presents existing published material.

## 3. New components and features

`ProjectsMegaMenu` provides archive previews and category discovery. `InstagramReel` provides the supplied external reel link. `Research` groups nine existing journal articles into three useful reading topics. `service-progress.ts` owns the deterministic service-frame calculation. Shared team-contact data and measured image dimensions prevent duplicated contact literals and avoid unreserved image geometry.

## 4. GSAP diagnosis and fix

### Services

The baseline reproduced counter `01` while the first title was hidden and an incoming image was visible but inert. Presentation came from several overlapping `autoAlpha`, text and `.set()` operations; the counter and ARIA state came from raw ScrollTrigger progress while the rendered timeline was still catching up through `scrub`. Those were different clocks. Later tweens could also capture visibility states that were unsuitable when seeking backwards. A standalone all-slides-blank frame was not captured during the baseline run; the observed mismatch corroborated the reported failure mechanism.

The replacement animates one numeric playhead. Each frame derives slide opacity, visibility, stacking, active text, counter, rail progress, `inert` and `aria-hidden` from that value. A hold followed by complementary crossfading guarantees at least one slide has opacity of 0.5 or greater. Only the active text layer is shown, avoiding overlapping text during an image handoff. No competing slide timelines own these properties.

The pin is scoped to the section and created only on desktop with motion enabled. Refresh synchronizes the rendered frame. Media-query teardown removes all manually owned styles and accessibility state, and the CSS default is readable stacked content. Mobile and reduced-motion layouts do not depend on a pin or animation completing.

### Route lifecycle

React child layout effects ran before the old parent scroll reset. The new `RouteScrollManager` is the first sibling before the routed outlet, so its layout effect resets the scroll position before the incoming page measures its triggers. Search-only filter changes preserve scroll. Fonts and meaningful image geometry changes schedule refreshes; refresh is not called on every frame.

Route transitions now animate a decorative progress line and never hide or transform the main content. Global internal-link interception was removed. Hero no longer animates the shared header. Filter and slug-dependent GSAP effects use `revertOnUpdate` to dispose of the previous setup.

Repeated-route ScrollTrigger counts remained stable: Home `[15,15,15]`, Projects `[18,18]`, Project Detail `[4,4]`, Blog `[13,13]`, Blog Detail `[3,3]`, About `[22,22]`. Repeated category-filter cycles were `[10,10,10]`.

## 5. Navigation and category routing

- Desktop Projects opens on hover, keyboard focus or the adjacent disclosure. The primary Projects link still opens `/projects`.
- The panel has a real archive photograph on the left, populated categories and counts on the right, and a close control. Hover/focus crossfades to an image from the highlighted category after it loads.
- A shared hover bridge and short close delay protect pointer travel into the panel. Escape, meaningful pointer exit, outside click, close control and navigation close it.
- Keyboard order connects the disclosure to the panel and then the next primary navigation link. Escape restores focus; closed content is inert. This is navigation, without a modal focus trap.
- Categories are derived from actual project records: Clubs 10, Heritage 1, Commercial 1, Facade 3, Gym 1, Office 3, Theatre 1; 20 projects overall.
- Category links use `/projects?category=Clubs` and equivalent encoded URLs. `useSearchParams` controls the filters. Refresh and back/forward restore the selection; invalid values display All.
- Mobile uses an accessible Projects accordion, an explicit All Projects link, tappable categories and a scrollable navigation panel.

## 6. Project detail improvements

Kingsman and City Palace retain independent routes, descriptions and photography. Category discovery always opens an archive, then lets the visitor choose a project. Breadcrumbs return to the appropriate category.

Landscape heroes use a cinematic crop. Portrait heroes use a larger proportional image with title and metadata beside it; mobile places the title first. The blurred duplicate backdrop was removed. Exact intrinsic image dimensions now accompany project imagery.

Existing verified descriptions and galleries lead to a clear project conclusion. A compact, separated **Explore another project** recommendation names the destination, category and location where known. Same-category recommendations take priority: Kingsman recommends Rosado. Unique-category projects explicitly label a recommendation as coming from another category. No results, locations, specifications or credits were invented.

## 7. Enquiry and footer improvements

The enquiry section uses one frosted glass surface over existing architectural photography. Warm ivory and navy treatments share semantic theme tokens, readable input surfaces, fine borders and a lime CTA. Blur is static at 18px, with a solid fallback when unsupported. Background settling, heading masking, field stagger and the accent line provide a restrained entrance; focus finishes the reveal so the form is usable immediately.

The browser still submits through the existing Web3Forms endpoint and `VITE_WEB3FORMS_ACCESS_KEY`. Required fields, validation, loading/error/success feedback and project/product context remain. A synchronous ref prevents same-tick duplicate requests. The honeypot does not submit; unmount cancels an outstanding request. Success appears after a successful response, not when the request begins. Recipient configuration was not changed.

The navy footer now organizes brand, Explore, Expertise, Experience Centre/general contact details and **Talk to our team**. Service links resolve to the existing Home service section. Both existing general numbers and the general mailbox remain available. Contact columns never start fully hidden, and focus/fast scrolling completes the restrained reveal.

## 8. Contact details added

| Contact | Role | Phone / link | Email |
| --- | --- | --- | --- |
| Kirti Nankani | Project-related enquiries | +91 9116668039 / `tel:+919116668039` | `mailto:kirti@anjora.lighting` |
| Shraddha Soni | Lighting Designer — Lighting Consultancy | +91 861 952 7505 / `tel:+918619527505` | `mailto:shraddha@anjora.lighting` |

General information remains: B 15, Parivahan Marg, C Scheme, Jaipur, Rajasthan 302001; +91 99295 71272; +91 77928 34789; `info@anjora.lighting`. The new roles and contact details come directly from the client brief; no additional credentials or profile photographs were added.

## 9. Instagram integration status

The supplied [Instagram reel](https://www.instagram.com/reel/DePausjtUqP/) could not be inspected through either its public URL or embed URL in this environment. Its content, publisher and embed availability therefore remain unverified.

Home includes a small, clearly external **Watch on Instagram** CTA linking to the exact supplied URL. It has a new-tab accessible label and `noopener noreferrer`. There is no broken iframe, fabricated thumbnail, downloaded video, autoplay, third-party embed loading or claim that its publisher is Anjora's official account.

## 10. Responsive and visual checks

Checked at widths **1440, 1024, 768, 430 and 375px**, in both light and dark themes. Coverage includes portrait project heroes, glass enquiry, footer, navigation, overflow and readable layout. Inspected desktop and mobile screenshots, the category preview, Kingsman and City Palace, Research, expanded and scrolled mobile navigation, and project recommendations.

There were no separate screenshot files in the supplied attachment; it contained the written brief. Comparison used captures of the actual baseline site, the reference website and final captures, rather than claiming access to missing screenshots.

Local screenshots are in `/tmp/anjora-client-qa`, `/tmp/anjora-visual-qa`, `/tmp/anjora-theme-qa` and the existing feature-specific QA directories. Baseline captures are in `/tmp/anjora-before`. These are local review artifacts, not committed production assets.

## 11. Accessibility checks

Verified keyboard opening, category focus, Tab boundaries, Escape/focus restoration, outside close, disclosure state and inert hidden navigation. Mobile categories have touch-sized rows and usable scrolling. Semantic headings, project links, visible focus, form labels and validation relationships remain in place. Contact `tel:`/`mailto:` destinations and internal footer links were checked.

Reduced motion shows all service content without pinning and removes animation/transition delays. Theme persistence and scroll position were checked. Image previews are decorative; project photography keeps descriptive alternative text. Input and copy contrast were reviewed in both themes; the final light error color has a conservative 4.88:1 ratio against the darkest possible ivory-glass composite.

These are browser, keyboard and code checks, not a formal accessibility certification or a physical assistive-device audit.

## 12. QA and production build

All commands below were run successfully during implementation using local Chrome through Playwright. Automated enquiries were mocked; no real client inbox messages were sent.

| Check | Result / coverage |
| --- | --- |
| `npm run typecheck` | PASS, including final source |
| `npm run lint` | PASS, including final source |
| `npm run build` | PASS, final source, no chunk-size warning |
| `git diff --check` | PASS |
| `npm run services:qa` | PASS: all seven stages forward/reverse, handoffs, rapid seeks, wheel, theme change, resize, three route revisits, reduced motion and mobile fallback |
| `npm run client:qa` | PASS: desktop/mobile navigation, preview switching, keyboard, category/history behavior, independent details, route visibility, Research, footer links, reel fallback, five widths and both themes |
| `npm run premium:qa` | PASS: route timing/reset, rapid scrolling and stable ScrollTrigger counts |
| `npm run visual:qa` | PASS against production preview: project routes and galleries, including all 20 projects; no browser console warnings/errors or page errors |
| `npm run theme:qa` | PASS: both themes, routes, persistence, reduced motion, scroll position and responsive overflow |
| `npm run enquiry:qa` | PASS on dev and production preview: validation, delayed response, duplicate guard, honeypot, success, API/network failure, product/project payloads and responsive layouts |
| `npm run refinement:qa` | PASS: layout, hero and alignment checks |
| `npm run product-service:qa` | PASS: existing product and service flows |
| `npm run blog:qa` | PASS: all 17 articles, routes, local imagery, SEO, motion modes and responsive layouts |
| `npm run about:qa` | PASS: route, content, local imagery, SEO, reduced motion and responsive layouts |
| Additional scroll-input check | PASS: pointer drag of a visible browser scrollbar into the service stage and repeated small-delta wheel input; zero blank frames sampled during the wheel sequence |
| Additional image-failure check | PASS: aborting the Clubs preview image preserves the previous loaded archive photograph and keeps the menu usable |

The final change after functional suites was a light-theme error-color contrast adjustment, followed by typecheck, lint and production build. Small-delta wheel automation approximates trackpad input; no physical trackpad/device claim is made.

Vite separates the shared React/Router/GSAP runtime from app code: runtime 373.69 kB (126.96 kB gzip), app 236.89 kB (57.17 kB gzip), CSS 96.85 kB (18.04 kB gzip). This improves caching boundaries and removes the previous oversized single-chunk warning; it is not a claim of lower total JavaScript or a measured Core Web Vitals result.

To reproduce on a running dev server:

```bash
ANJORA_QA_URL=http://127.0.0.1:5174 npm run services:qa
ANJORA_QA_URL=http://127.0.0.1:5174 npm run client:qa
ANJORA_QA_URL=http://127.0.0.1:5174 npm run premium:qa
```

`services:qa`, `client:qa` and trigger-inspection checks require Vite dev module access. Public-flow suites such as `visual:qa` and `enquiry:qa` also run against `vite preview` by setting `ANJORA_QA_URL`. Scripts default to port 5173 and accept `CHROME_PATH` where supported.

## 13. Remaining client-dependent items

1. **Higher-resolution original project photography.** Kingsman's existing cover is 388 × 518px; several other archive images are similarly small. Layout and aspect ratios were improved, but genuine photographic detail requires original files. Existing work was not replaced with stock or fabricated imagery.
2. **Optional Instagram embed or approved local video.** The external link is functional. An embed needs a verified accessible reel and permission/context; a local video needs a client-approved asset.
3. **Mailbox delivery and optional specialist routing.** Existing Web3Forms configuration is preserved. A live delivery check requires confirming receipt in the configured mailbox. Separate delivery to Kirti and Shraddha requires an approved account-side routing setup; a frontend dropdown alone cannot change recipients. Current payloads retain project/product context.
4. **Existing catalogue inputs.** Approved product photography and final catalogue specifications remain the pre-existing content dependency. No unsupported product claims were introduced.
5. **Release authorization.** No production deployment or merge was performed.

## References and review basis

- [Lasvit](https://www.lasvit.com/) and its [project archive](https://www.lasvit.com/projects): public category-discovery and footer hierarchy reference. No branding, imagery, source code or exact layout copied.
- [Anjora's published website](https://anjora.lighting/): existing company/project information and general contacts; the repository retains individual project source URLs.
- [GSAP matchMedia](https://gsap.com/docs/v3/GSAP/gsap.matchMedia/) and [GSAP React integration](https://gsap.com/resources/React/): lifecycle and cleanup guidance, alongside inspection of the locally installed library.
- Client brief: specialist contacts, requested interactions and exact Instagram URL.
